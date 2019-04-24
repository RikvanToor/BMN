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

 function getMultiple($router, $routes, $func){
     foreach($routes as $route){
         $router->get($route, $func);
     }
 }

/**
 * 
 * Route all relevant links to the index. There, the routing will be handled via the React
 * Router. 
 */
$indexRoutes = [
    '/',
    '/home',
    '/nieuws',
    '/nummers',
    '/suggesties',
    '/roosterAanpassen',
    '/rooster',
    '/aanwezigheid',
    '/gebruikersbeheer',
    '/account',
    '/wachtwoordreset',
    '/setlist',
    '/beschikbaarheden',
    '/suggestieToevoegen',
    '/tickets'
];
getMultiple( $router, $indexRoutes, function() use($router){
    return view('index');
} );
$router->get('/login', ['as'=>'login', function () use ($router) {
    return view('index');
}]);
$router->get('/nieuwwachtwoord/{token}',['as'=>'newPasswordSet', function() use ($router){
    return view('index');
}]);

/**
 * API routing
 */
$router->group(['prefix' => '/api'], function () use ($router) {
    // prefix /api
    $router->post('auth/login', 'AuthController@login');

    $router->post('forgotpassword','PasswordController@requestNewPassword');
    $router->post('setnewpassword/{token}','PasswordController@setNewPassword');
    
    
    //Participant and committee actions
    $router->group(['middleware' => 'auth'], function () use ($router) {
        $router->get('auth/me', 'AuthController@getUser');

        //prefix /api/songs
        $router->group(['prefix' => '/songs'], function () use ($router) {
            $router->get('', 'SongsController@showAllSongs');
            $router->get('/mineAndAll', 'SongsController@showMySongsAndAllSongs');
            $router->get('/genre/{genre}', 'SongsController@showGenre');
            $router->get('/suggestions', 'SongsController@showSuggestions');

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
        
        //prefix /api/users
        $router->group(['prefix' => '/users'], function () use ($router) {
            $router->get('', 'UsersController@showAllUsers');
            $router->group(['middleware' => 'committee'], function () use ($router) {
                $router->post('/create', 'UsersController@create');
                $router->delete('/{id}/delete', 'UsersController@delete');
                $router->post('/importcsv', 'UsersController@generateUsersFromCsv');
            });

            $router->group(['prefix' => '/{id}'], function () use ($router) {
                $router->get('', 'UsersController@showOneUser');
                $router->post('/changepassword', 'PasswordController@changePassword');

                $router->get('/songs', 'UsersController@showUserSongs');
                
                $router->get('/singersongs', 'UsersController@showSingerSongs');
                $router->get('/singersongs/genre/{genre}', 'UsersController@showSingerGenreSongs');
            });
        });

        //prefix /api/rehearsals
        $router->group(['prefix' => '/rehearsals'], function() use ($router) {
            $router->get('', 'RehearsalsController@showFutureRehearsals');
            $router->get('/schedules', 'RehearsalsController@showFutureRehearsalsWithSchedule');
            $router->get('/schedules/for/{id}', 'RehearsalsController@showFutureRehearsalsWithScheduleForPlayer');
            $router->get('/availabilities', 'RehearsalsController@showFutureRehearsalsOwnAvailabilities');
            $router->post('/{id}/availabilities/', 'RehearsalsController@saveAvailabilities');
            $router->post('/{id}/songs', 'RehearsalsController@setSongs');
            $router->get('/{id}', 'RehearsalsController@showRehearsalWithSchedule');
            
            //Rehearsal management
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

        //prefix /api/setlist 
        $router->group(['prefix'=>'/setlist'], function() use($router){
            $router->get('/all', 'SetlistController@getAllSetlistSongs');

            //Committee only
            $router->group(['middleware'=>'committee'], function() use($router){
                $router->post('/add', 'SetlistController@addSetlistSong');
                $router->post('/{id}/players', 'SetlistController@updateSongPlayers');
                $router->delete('/{id}', 'SetlistController@deleteSetlistSong');
                $router->post('/publish', 'SetlistController@publishSongs');
            });
        });

        //prefix /api/suggestions
        $router->group(['prefix'=>'suggestions'], function() use ($router){
            $router->post('/add', 'SongsController@addSong');
        });

        //prefix /api/news
        $router->group(['prefix' => '/news'], function() use ($router) {
            $router->get('', 'NewsController@showAllNews');
            $router->group(['middleware' => 'committee'], function () use ($router) {
                $router->post('', 'NewsController@createNews');
                $router->post('/update', 'NewsController@updateNews');
                $router->delete('/{id}', 'NewsController@deleteNews');
            });
        });
    });
});
