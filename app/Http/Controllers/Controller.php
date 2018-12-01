<?php

namespace App\Http\Controllers;
use App\Http\ResponseCodes;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    //
    protected function failed($errorMessage){
        return response()->json(array('error'=>$errorMessage),ResponseCodes::HTTP_UNPROCESSABLE_ENTITY);
    }
}
