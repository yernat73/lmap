<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Http\Requests;
use App\Station;
use App\Http\Resources\Station as StationResource;

class StationController extends Controller
{
    
    public function search(Request $request)
    {
        $q = request('q');
        $results = Station::search($q)->get();
        return StationResource::collection($results);
    }

    
}
