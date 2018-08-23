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
    $router->post('auth/login', 'AuthController@login');

    $router->group(['middleware' => 'auth'], function () use ($router) {
        $router->get('auth/me', 'AuthController@getUser');

        $router->group(['prefix' => '/songs'], function () use ($router) {
            $router->get('', 'SongsController@showAllSongs');
            $router->get('/genre/{genre}', 'SongsController@showGenre');

            $router->group(['middleware' => 'committee'], function () use ($router) {
                $router->post('/create', 'SongsController@create');
            });

            $router->group(['prefix' => '/{id}'], function () use ($router) {
                $router->get('', 'SongsController@showOneSong');
                $router->get('/users', 'SongsController@showUsers');
                $router->get('/withusers', 'SongsController@showSongWithUsers');

                $router->group(['middleware' => 'committee'], function () use ($router) {

                    $router->delete('', 'SongsController@delete');

                    $router->put('/users/{user_id}&{instrument}', 'SongsController@addUserToSong');
                    $router->delete('/users/{user_id}', 'SongsController@removeUserFromSong');

                    $router->put('/singers/{user_id}&{yes_or_maybe}', 'SongsController@addSingerToSong');
                    $router->delete('/singers/{user_id}', 'SongsController@removeSingerToSong');
                });

                $router->get('/singers', 'SongsController@showSingers');
            });
        });

        $router->group(['prefix' => '/users'], function () use ($router) {
            $router->get('', 'UsersController@showAllUsers');
            $router->group(['middleware' => 'committee'], function () use ($router) {
                $router->post('/create', 'UsersController@create');
            });

            $router->group(['prefix' => '/{id}'], function () use ($router) {
                $router->get('', 'UsersController@showOneUser');

                $router->group(['middleware' => 'committee'], function () use ($router) {
                    $router->delete('/delete', 'UsersController@delete');
                });

                $router->get('/songs', 'UsersController@showUserSongs');
                
                $router->get('/singersongs', 'UsersController@showSingerSongs');
                $router->get('/singersongs/genre/{genre}', 'UsersController@showSingerGenreSongs');
            });
        });
    });
});
