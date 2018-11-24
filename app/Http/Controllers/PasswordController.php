<?php

namespace App\Http\Controllers;
use Db;
use Carbon;
use Illuminate\Support\Facades\Auth; 
use App\Models\User;
use Illuminate\Http\Request;

class PasswordController extends Controller {
    const RESET_TOKEN_LENGTH = 90;
    const TOKEN_DB = 'password_resets';

    public function requestNewPassword(Request $requset){
        $validatedData = $this->validate($request,[
            'email' => 'required|email'
        ]);
        //Find user by email
        $user = User::where('email', $validatedData['email']);
        //If not found, send back that the email is not known
        if(!$user) return response()-json(array('error'=>'unknown email'), 422);

        //Insert the token
        $data = [ 
        'token' => str_random(RESET_TOKEN_LENGTH),
        'email' => $validatedData['email'],
        'created_at' => Carbon::now()
        ];
        Db::table(TOKEN_DB)->insert($data);

        //Send the email
    }


}