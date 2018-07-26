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

$router->get('/songs', 'SongsController@index');
$router->get('/songs/add', 'SongsController@create');
$router->post('/songs/store', 'SongsController@store');
$router->get('/songs/delete/{id}', 'SongsController@destroy');