<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Station;
use App\Route;
use App\Http\Resources\Route as RouteResource;
use DateTime;
use DatePeriod;
use DateInterval;

class DirectionController extends Controller
{
    public function getWalkingDistance($lat1, $lng1, $lat2, $lng2){
        //Our starting point / origin. Change this if you wish.
        $start = "" . $lat1 . "," . $lng1;
        
        //Our end point / destination. Change this if you wish.
        $destination =  "" . $lat2 . "," . $lng2;
        
        //The Google Directions API URL. Do not change this.
        $apiUrl = 'https://maps.googleapis.com/maps/api/directions/json';
        
        //Construct the URL that we will visit with cURL.
        $url = $apiUrl . '?key=AIzaSyBx7STG0PaXcrFVDiDqGsnr1AmMZcvf110&mode=walking' . '&origin=' . urlencode($start) . '&destination=' . urlencode($destination);
        
        //Initiate cURL.
        $curl = curl_init($url);
        
        //Tell cURL that we want to return the data.
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        
        //Execute the request.
        $res = curl_exec($curl);
        
        //If something went wrong with the request.
        if(curl_errno($curl)){
            throw new Exception(curl_error($curl));
        }
        
        //Close the cURL handle.
        curl_close($curl);
        
        //Decode the JSON data we received.
        $json = json_decode(trim($res), true);
        

        //Automatically select the first route that Google gave us.
        $route = $json['routes'][0];
        
        //Loop through the "legs" in our route and add up the distances.
        $totalDistance = 0;
        $totlaDuration = 0;

        foreach($route['legs'] as $leg){
            $totalDistance += $leg['distance']['value'];
            $totlaDuration +=$leg['duration']['value'];
        }
        
        //Divide by 1000 to get the distance in KM.
        $totalDistance = $totalDistance / 1000;
        
        //Print out the result.
        return array(
            "distance" => $totalDistance,
            "duration" => $totlaDuration,
            "routes" => $json['routes']
        );
    }
    

    public function directions(Request $request)
    {
        
        $start = $request->get("start");
        $destination = $request->get("destination");
        if(!$start && !$destination){
            return ['meassage' => "BAD REQUEST"];
        }
        $options = array();

        $distanse = $this->getWalkingDistance($start["lat"], $start["lng"], $destination["lat"], $destination["lng"]);
      

        if($distanse["distance"] <= 3){
            array_push($options, array_merge(
                array(
                    "mode" => "walk",
                    "start" => $start,
                    "end" => $destination
                ), 
                $distanse)
            );
        }
                





        // All the stations near the DESTINATION
        $destinatingStations = Station::getByDistance($destination["lat"], $destination["lng"], 1);
        // All the stations near the START
        $startingStations = Station::getByDistance($start["lat"], $start["lng"], 1);
        // All the available routes from START
        $startingRoutes = array();
        foreach($startingStations as $station){
            $stRoutes = Station::find($station->id)->routes;
            foreach($stRoutes as $route){
                array_push($startingRoutes, $route->id);
            }
        }
        $startingRoutes = array_unique($startingRoutes);
        // All the available routes to DESTINATION
        $destinatingRoutes = array();
        foreach($destinatingStations as $station){
            $stRoutes = Station::find($station->id)->routes;
            foreach($stRoutes as $route){
                array_push($destinatingRoutes, $route->id);
            }
        }
        $destinatingRoutes = array_unique($destinatingRoutes);

        foreach ($destinatingRoutes as $dr) {
            
            $option = array();
            if(in_array($dr, $startingRoutes)){
                $steps = array();
                $route = Route::find($dr);
                $startS = null;
                $endS = null;
                $route_arrival = new DateTime('NOW');
                $route_depart = new DateTime('NOW');

                $route_arrival->text = $route_arrival->format('H:i');
                $route_depart->text = $route_depart->format('H:i');

                $option_arrival = clone $route_arrival;
                $option_depart = clone $route_depart;
                foreach($startingStations as $s){
                    $station = $route->stations->find($s->id);
                    if(is_null($station)){
                        continue;
                    }
                    $routes = $station->routes()->pluck('routes.id')->toArray();
                    if(in_array($dr, $routes)){
                        $startS = $station;
                        break;
                    }
                }
                foreach($destinatingStations as $s){
                    $station = $route->stations->find($s->id);
                    if(is_null($station)){
                        continue;
                    }
                    $routes = $station->routes()->pluck('routes.id')->toArray();
                    if(in_array($dr, $routes)){
                        $endS = $station;
                        break;
                    }
                }
                if($startS->pivot->order > $endS->pivot->order || strcmp($startS->address, $endS->address) == 0 ){
                    continue;
                }
                $dis = $this->getWalkingDistance($start["lat"], $start["lng"], $startS->lat, $startS->lng);
                $option["departure_time"] = $option_depart->sub(new DateInterval('PT'.$dis["duration"].'S'));
                $option["departure_time"]->text = $option["departure_time"]->format('H:i');
                array_push($steps, array_merge(
                        array(
                            "mode" => "walk",
                            "start" => $start,
                            "end" => $startS
                        ),
                        $dis
                    )
                );

                array_push($steps, array(
                    "mode" => "transit",
                    "start" => $startS,
                    "end" => $endS,
                    "route" => new RouteResource($route),
                    "departure_time" => $route_depart,
                    "arrival_time" => $route_arrival,
                    "duration" => $route_arrival->getTimestamp() - ($route_depart)->getTimestamp() 
                ));
                $dis = $this->getWalkingDistance($endS->lat, $endS->lng, $destination["lat"], $destination["lng"]);
                array_push($steps, array_merge(
                        array(
                            "mode" => "walk",
                            "start" => $endS,
                            "end" => $destination
                        ),
                        $dis                     
                    )
                );
                $option["arrival_time"] = $option_arrival->add(new DateInterval('PT'.$dis["duration"].'S'));
                $option["arrival_time"]->text = $option["arrival_time"]->format('H:i');
                $option["steps"] = $steps;
                $option["mode"] = "transit";
                $option["duration"] = $option["arrival_time"]->getTimestamp() - ($option["departure_time"])->getTimestamp() ;
            }
            if($option){
                array_push($options, $option);
            }
            
        }
        


        return [
            "options" => $options,
            'message' => "SUCCESS"
        ];


        return [
            
            'start' =>$start, 
            'destination' => $destination,
            ];
    }




}
