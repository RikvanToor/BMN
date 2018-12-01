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

/**
 * 
 * Route all relevant links to the index. There, the routing will be handled via the React
 * Router. 
 */
$router->get('/', function () use ($router) {
    return view('index');
});
$router->get('/home', function () use ($router) {
    return view('index');
});
$router->get('/nummers', function () use ($router) {
    return view('index');
});
$router->get('/suggesties', function () use ($router) {
    return view('index');
});
$router->get('/login', function () use ($router) {
    return view('index');
});
$router->get('/roosterAanpassen', function () use ($router) {
    return view('index');
});
$router->get('/rooster', function () use ($router) {
    return view('index');
});
$router->get('/aanwezigheid', function () use ($router) {
    return view('index');
});
$router->get('/gebruikersbeheer', function () use ($router) {
    return view('index');
});

/**
 * API routing
 */
$router->group(['prefix' => '/api'], function () use ($router) {
    // prefix /api
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
                $router->delete('/{id}/delete', 'UsersController@delete');
            });

            $router->group(['prefix' => '/{id}'], function () use ($router) {
                $router->get('', 'UsersController@showOneUser');

                $router->get('/songs', 'UsersController@showUserSongs');
                
                $router->get('/singersongs', 'UsersController@showSingerSongs');
                $router->get('/singersongs/genre/{genre}', 'UsersController@showSingerGenreSongs');
            });
        });

        $router->group(['prefix' => '/rehearsals'], function() use ($router) {
            $router->get('', 'RehearsalsController@showFutureRehearsals');
            $router->get('/schedules', 'RehearsalsController@showFutureRehearsalsWithSchedule');
            $router->get('/schedules/for/{id}', 'RehearsalsController@showFutureRehearsalsWithScheduleForPlayer');
            $router->get('/availabilities', 'RehearsalsController@showFutureRehearsalsOwnAvailabilities');
            $router->post('/{id}/availabilities/', 'RehearsalsController@saveAvailabilities');
            $router->get('/{id}', 'RehearsalsController@showRehearsalWithSchedule');
            $router->group(['middleware' => 'committee'], function () use ($router) {
                $router->get('/availabilities/all', 'RehearsalsController@showFutureRehearsalsWithAvailabilities');
                $router->post('/create', 'RehearsalsController@create');
                $router->post('/delete', 'RehearsalsController@deleteRehearsals');
                $router->delete('{id}', 'RehearsalsController@deleteRehearsal');
                $router->post('/createMultiple', 'RehearsalsController@createMultiple');
                $router->post('{id}/addsong', 'RehearsalsController@addSong');
                $router->delete('{id}/removesong/{song_id}', 'RehearsalsController@removeSong');
            });
        });

        $router->group(['prefix' => '/news'], function() use ($router) {
            $router->get('', 'NewsController@showAllNews');
        });
    });
});
