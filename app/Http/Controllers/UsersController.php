<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Mail;
use App\Mail\GeneratedUserMail;
use App\Models\User;
use App\Http\ResponseCodes;
use Illuminate\Http\Request;

class UsersController extends Controller {
    /**
     * Add entry to 'users' table
     */
    public function create(Request $request) {
        $this->validate($request, [
            'name'     => 'required|unique:users',
            'email'    => 'required|email|unique:users',
            'username' => 'required|unique:users',
            'password' => 'required',
        ]);

        $properties = $request->all();
        $properties['password'] = app('hash')->make($request->get('password'));
        //Hack for now. 
        $properties['is_active'] = true;

        $user = User::create($properties);
        return response()->json($user, 201);
    }
    
    /**
     * Generates a new user. An email will be sent with a link to change the 
     * password for the user
     * @param Request $request
     * @return response
     */
    public function generateUser(Request $request){
        $validatedData = $this->validate($request, [
            'name'     => 'required|unique:users',
            'email'    => 'required|email|unique:users',
            'username' => 'required|unique:users',
        ]);
        //Set a random password
        $validatedData['password'] = app('hash')->make(str_random(32));
        $validatedData['is_active'] = true;
        
        //Create the user
        $user = User::create($validatedData);
        
        $token = $user->createPasswordResetToken();
        $token->save();
        
        //Send the 'reset your password' mail
        Mail::to($user)->send(new GeneratedUserMail($token->token, $user->name, $user->username));
        return response()->json(array('message'=>'The user was generated and an email was sent'),ResponseCodes::HTTP_CREATED);
    }
    
    /**
     * Generates multiple users from a csv file describing the name and email of the user
     * @param Request $request
     * @return type
     */
    public function generateUsersFromCsv(Request $request){
        $validatedData = $this->validate($request, [
            'nameColumn'     => 'integer|required',
            'emailColumn'    => 'integer|required',
        ]);
        //Check that the file is valid.
        if(!$request->hasFile('usersFile')){
            return $this->failed('Missing file for importing users');
        }
        if(!$request->file('usersFile')->isValid()){
            return $this->failed('The provided files with users is not valid. Something went wrong when uploading...');
        }
        
        $file = $request->file('usersFile');
        
        $generatedUsers = array();
        
        //Columns to read
        $nameCol = $validatedData['nameColumn'];
        $emailCol = $validatedData['emailColumn'];
        
        //Parse the csv into an array of arrays, one for each line
        $csvLines = array_map('str_getcsv', file($file->getPathName()));
        array_shift($csvLines);
        //Assume that the first line is the header line
        foreach($csvLines as $line){
            $userData= array(
                'name' => $line[$nameCol],
                'email' => $line[$emailCol]
            );
            //Create a username consisting of the fullname in lowercase with all spaces removed.
            $userData['username'] = preg_replace('/\s/','',strtolower($userData['name']));
            $userData['password'] = app('hash')->make(str_random(32));
            $userData['is_active'] = true;
            
            //Only return names of created users.
            $generatedUsers[] = $userData['name'];
            
            //Apparently, if we do not do the creation like this, created_at and updated_at won't be set...
            //Create the user
            $user = User::create($userData);
        
            $token = $user->createPasswordResetToken();
            $token->save();
            
            $resetUrl = route('newPasswordSet',['token'=>$token->token]);
            //Mail the user
            Mail::to($user)->send(new GeneratedUserMail($resetUrl, $user->name, $user->username));
        }
        return response()->json(array('users_created'=>$generatedUsers),ResponseCodes::HTTP_CREATED);
    }

    /**
     * Remove entry from 'users' table
     */
    public function delete($id) {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json('Deleted succesfully', 200);
    }

    /**
     * Show one user
     */
    public function showOneUser($id) {
        $user = User::find($id);
        return response()->json($user, 200);
    }

    /**
     * Show all users
     */
    public function showAllUsers() {
        $users = User::all();
        return response()->json($users, 200);
    }

    /**
     * Show user's songs ordered by title
     */
    public function showUserSongs($id) {
        $songs = User::find($id)->songs()->orderBy('title')->get();
        return response()->json($songs, 200);
    }

    /**
     * Show singer's possible songs
     */
    public function showSingerSongs($id) {
        $songs = User::find($id)->singingSongs()->orderBy('title')->get();
        return response()->json($songs, 200);
    }

    /**
     * Show singer's possible songs with genre
     */
    public function showSingerGenreSongs($id, $genre) {
        $songs = User::find($id)->singingSongs()->where('genre', $genre)->orderBy('title')->get();
        return response()->json($songs, 200);
    }
}
