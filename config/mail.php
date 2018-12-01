<?php
return [
    'from' => [
        'address' => env('MAIL_FROM_ADDRESS'),
        'name' => env('MAIL_FROM_NAME')
    ],
    // 'reply_to'=>[
    //     'address'=>'','name'=>''
    // ]
    
    //Driver
    'driver' => env('MAIL_DRIVER','mail'),
    
    //Other options to use when needed
    'host' => env('MAIL_HOST', 'smtp.mailtrap.io'),
    'port' => env('MAIL_PORT', 25),
    'encryption' => env('MAIL_ENCRYPTION', 'tls'),
    'username' => env('MAIL_USERNAME'),
    'password' => env('MAIL_PASSWORD'),
//    'sendmail' => env('MAIL_SENDMAIL_LOCATION')
    'pretend' => false
];