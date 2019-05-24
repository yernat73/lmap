<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class DirectionController extends Controller
{
    
    public function directions(Request $request)
    {
        
        $start = $request->get("start");
        $destination = $request->get("destination");
        if(!$start && !$destination){
            return ['meassage' => "BAD REQUEST"];
        }       
        else{
            
            
        }
        return [
            'start' =>$start, 
            'destination' => $destination, 
            'message' => "SUCCESS"];
    }
}
