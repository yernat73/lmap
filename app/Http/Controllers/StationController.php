<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Http\Requests;
use App\Station;
use App\Http\Resources\Station as StationResource;

class StationController extends Controller
{
    
    
    public function index($id)
    {
        $station = Station::all()->find($id);
        return $station;
    }

    public function all(){
        $stations = Station::all();
        return StationResource::collection($stations);
    }

    
    public function search(Request $request){
        $q = request('q');
        $results = json_decode(file_get_contents('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='.urlencode($q).'&inputtype=textquery&fields=formatted_address,name,geometry&locationbias=circle:10000@43.238949,76.889709&key=AIzaSyBx7STG0PaXcrFVDiDqGsnr1AmMZcvf110'), true);
        return $results;
    } 

    
}
