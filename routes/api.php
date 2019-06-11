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
Route::post('login', function (Request $request) {
    
    if (auth()->attempt(['email' => $request->input('email'), 'password' => $request->input('password')])) {
        // Authentication passed...
        $user = auth()->user();
        $user->api_token = str_random(60);
        $user->save();
        return $user;
    }
    
    return response()->json([
        'error' => 'Unauthenticated user',
        'code' => 401,
    ], 401);
});
Route::middleware('auth:api')->post('logout', function (Request $request) {
    
    if (auth()->user()) {
        $user = auth()->user();
        $user->api_token = null; // clear api token
        $user->save();

        return response()->json([
            'message' => 'Thank you for using our application',
        ]);
    }
    
    return response()->json([
        'error' => 'Unable to logout user',
        'code' => 401,
    ], 401);
});
Route::post('register', 'Auth\RegisterController@APIregister');
Route::middleware('auth:api')->get('event/all', 'EventController@all');
Route::middleware('auth:api')->post('event/new', 'EventController@store');
Route::middleware('auth:api')->delete('event/delete', 'EventController@delete');
Route::get('place/search', 'StationController@search');
Route::get('route/search', 'RouteController@search');
Route::get('route/all', 'RouteController@all');
Route::get('station/all', 'StationController@all');
Route::get('directions', 'DirectionController@directions');