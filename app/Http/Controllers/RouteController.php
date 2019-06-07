<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Route;
use App\Http\Resources\Route as RouteResource;

class RouteController extends Controller
{
    public function search(Request $request)
    {
        $q = request('q');
        $results =  Route::where('direction', '0')->search($q)->get();
        return RouteResource::collection($results);
    }
    public function all(Request $request)
    {
        $routes = Route::all();
        return RouteResource::collection($routes);
    }
    public function index(Request $request, $id){
        $route = Route::find($id);
        return new RouteResource($route);
    }
}
