<?php

namespace App\Http\Controllers;
use Db;
use Carbon;
use Illuminate\Support\Facades\Auth; 
use App\Http\ResponseCodes;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetMyPasswordMail;
use App\Models\User;
use Illuminate\Http\Request;

class PasswordController extends Controller {
    const RESET_TOKEN_LENGTH = 90;
    const TOKEN_DB = 'password_resets';
    const TOKEN_EXPIRATION = '3 hours';
    
    /**
     * Handle change password from authenticated user.
     */
    public function changePassword(Request $request, $id){
        $validatedData = $this->validate($request, [
            'password' => 'required|string'
        ]);
        
        //Change the password on the authenticated user
        $user = $request->user();
        //Check that the authenticated user changes his/her own password
        if(intval($id) !== $user->id){
            return response()->json(array('error'=>'Tried to change password of another user'), ResponseCodes::HTTP_UNAUTHORIZED);
        }
        //Change password and save
        $user->password = app('hash')->make($validatedData['password']);
        $user->save();
        
        return response()->json(array('message'=>'Succesfully changed password'), ResponseCodes::HTTP_OK);
    }
    
    /**
     * Sets a new password for a user via a reset token
     * @param Request $request The request
     * @param string $token The token
     * @return Response
     */
    public function setNewPassword(Request $request, $token){
        $tokenEntry = Db::table(TOKEN_DB)->where('token', $token)->get();
        if(!$tokenEntry){
            return response()->json(array('error'=>'Invalid token for password change'), ResponseCodes::HTTP_UNPROCESSABLE_ENTITY);
        }
        //Delete the token regardless
        Db::table(TOKEN_DB)->where('token', $token)->delete();
        
        //Fail if token expired
        if(Carbon::now()->greaterThan($tokenEntry->expires)){
            return response()->json(array('error'=>'Token expired'), ResponseCodes::HTTP_UNPROCESSABLE_ENTITY);
        }
        //Check request data
        $validatedData = $this->validate($request, [
            'password' => 'required|string'
        ]);
        //Get associated user
        $user = User::where('email',$tokenEntry['email'])->get();
        
        //Change the password
        $user->password = app('hash')->make($validatedData['password']);
        $user->save();
        
        return response()->json(array('message'=>'Password change'), ResponseCodes::HTTP_OK);
    }
    
    /**
     * Request a new password for the user with the given email address. Will send
     * an email with a special token to set a new password.
     * @param Request $request
     * @return type
     */
    public function requestNewPassword(Request $request){
        //Validate incoming data
        $validatedData = $this->validate($request,[
            'email' => 'required|email'
        ]);
        
        //Find user by email
        $user = User::where('email', $validatedData['email']);
        
        //If not found, send back that the email is not known
        if(!$user) {
            return response()-json(array('error'=>'unknown email'), 422);
        }

        //Insert the token
        $data = [ 
        'token' => str_random(RESET_TOKEN_LENGTH),
        'email' => $validatedData['email'],
        'expires' => Carbon::now()->add(TOKEN_EXPIRATION)
        ];
        Db::table(TOKEN_DB)->insert($data);

        //Generate an url to the named 'newPasswordSet' route (see routes.php)
        $resetUrl = route('newPasswordSet',['token'=>$data['token']]);
        
        //Send the email. Takes email address from the user object
        Mail::to($user)->send(new ResetMyPasswordMail($resetUrl,$user->name));
    }
}