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

$router->group(['prefix' => '/api'], function () use ($router) {
    $router->group(['prefix' => '/songs'], function () use ($router) {
        $router->get('', 'SongsController@showAllSongs');
        $router->post('/create', 'SongsController@create');

        $router->group(['prefix' => '/{id}'], function () use ($router) {
            $router->get('', 'SongsController@showOneSong');
            $router->get('/delete', 'SongsController@delete');
            $router->get('/users', 'SongsController@showUsers');
            $router->get('/withusers', 'SongsController@showSongWithUsers');
            $router->put('/adduser/{user_id}&{instrument}', 'SongsController@addUserToSong');
            $router->delete('/removeuser/{user_id}', 'SongsController@removeUserFromSong');
            $router->put('/addsinger/{user_id}&{yes_or_maybe}', 'SongsController@addSingerToSong');
            $router->delete('/removesinger/{user_id}', 'SongsController@removeSingerToSong');
            $router->get('/singers', 'SongsController@showSingerSongs');
            $router->get('/singers/{genre}', 'SongsController@showSingerGenreSongs');
        });
    });

    $router->group(['prefix' => '/users'], function () use ($router) {
        $router->get('', 'UsersController@showAllUsers');
        $router->post('/create', 'UsersController@create');

        $router->group(['prefix' => '/{id}'], function () use ($router) {
            $router->get('', 'UsersController@showOneUser');
            $router->delete('/delete', 'UsersController@delete');
            $router->get('/songs', 'UsersController@showUserSongs');
            $router->get('showgenre/{genre}', 'UsersController@showGenre');
        });
    });
});
