<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['prefix' => '/songs'], function() use ($router) {
    $router->get('', 'SongsController@showAllSongs');
    $router->get('/{id}', 'SongsController@showOneSong');
    $router->post('/create', 'SongsController@create');
    $router->get('/delete/{id}', 'SongsController@delete');
    $router->post('/addtosong/{user_id}&{song_id}&{instrument}', 'SongsController@addUserToSong');
    $router->get('/removefromsong/{user_id}&{song_id}', 'SongsController@removeUserFromSong');
    $router->post('/addsinger/{user_id}&{song_id}&{yes_or_maybe}', 'SongsController@addSingerToSong');
    $router->get('/addsinger/{user_id}&{song_id}', 'SongsController@removeSingerToSong');
});

$router->group(['prefix' => '/users'], function() use ($router) {
    $router->get('', 'UsersController@showAllUsers');
    $router->get('/{id}', 'UsersController@showOneUser');
    $router->post('/create', 'UsersController@create');
    $router->get('/delete/{id}', 'UsersController@delete');
    $router->get('/showsongs/{id}', 'UsersController@showUserSongs');
});