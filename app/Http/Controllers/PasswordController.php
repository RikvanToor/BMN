<?php

namespace App\Http\Controllers;
use \DateInterval;
use Carbon\Carbon;
use App\Http\ResponseCodes;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetMyPasswordMail;
use App\Models\User;
use App\Models\PasswordResetToken;
use Illuminate\Http\Request;

class PasswordController extends Controller {
    const RESET_TOKEN_LENGTH = 40;
    //Period with time element (PT), 3 hours (3H). 
    //See: http://php.net/manual/en/dateinterval.construct.php
    const TOKEN_EXPIRATION = 'PT3H'; 
    
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
        $tokenEntry = PasswordResetToken::where('token', $token)->first();
        if(!$tokenEntry){
            return response()->json(array('error'=>'Invalid token for password change'), ResponseCodes::HTTP_UNPROCESSABLE_ENTITY);
        }
        
        //Fail if token expired
        if($tokenEntry->hasExpired()){
            $tokenEntry->delete();
            return response()->json(array('error'=>'Token expired'), ResponseCodes::HTTP_UNPROCESSABLE_ENTITY);
        }
        //Check request data
        $validatedData = $this->validate($request, [
            'password' => 'required|string'
        ]);
        //Get associated user
        $user = $tokenEntry->user;
        
        //Change the password
        $user->password = app('hash')->make($validatedData['password']);
        $user->save();
        
        //Delete the token
        $tokenEntry->delete();
        
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
        $user = User::where('email', $validatedData['email'])->first();
        
        //If not found, send back that the email is not known
        if(!$user) {
            return response()->json(array('error'=>'unknown email'), 422);
        }

        //Create a reset token
        $tokenObj = $user->createPasswordResetToken();
        $tokenObj->save();

        //Generate an url to the named 'newPasswordSet' route (see routes.php)
        $resetUrl = str_replace('/public', '', route('newPasswordSet',['token'=>$tokenObj->token]));
        
        //Send the email. Takes email address from the user object
        Mail::to($user)->send(new ResetMyPasswordMail($resetUrl,$user->name));
        
        return response()->json(array('message'=>'De e-mail is verstuurd'), ResponseCodes::HTTP_OK);
    }
}