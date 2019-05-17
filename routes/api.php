<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('station/search', 'StationController@search');
Route::get('route/search', 'RouteController@search');
Route::get('route/{id}', 'RouteController@index');
Route::middleware('auth:api')->get('/user', function(Request $request) {
    return $request->user();
});