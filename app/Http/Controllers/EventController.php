<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Event;
use App\Http\Resources\Event as EventResource;

use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
    //

    public function __construct()
    {
        $this->middleware('auth:api');
    }


    protected function validator(array $data)
    {   
        return Validator::make($data, [
            'start' => ['required', 'array'],
            'destination' => ['required', 'array'],
        ]);
    }


    public function index(){
        $events = Auth::user()->events->sortByDesc("updated_at");
        return EventResource::collection($events);

    }

    public function store(Request $request)
    {
        if($this->validator($request->all())->fails()){
            return [
                'message' => "BAD REQUEST"
            ];
        }
        if(!$request->user()){
            return [
                'message' => "NOT AUTHENTICATED"
            ];
        }
        $start = $request->get('start');
        $destination = $request->get('destination');
        $events = $request->user()->events;
        $event = null;
        foreach($events as $e){
            if(strcmp($e->start["name"], $start["name"]) == 0 && strcmp($e->destination["name"], $destination["name"]) == 0 ){                
                $event = $e;
                break;
            }
        }

        if(!is_null($event)){
            $event->touch();            
        }else{
            $event = new Event();
            $event->start = $start;
            $event->destination = $destination;
            $event->user_id = $request->user()->id;
            
        }
        $event->save();
        return new EventResource($event);
        
    }

    public function delete(Request $request){
        if(is_null($request->get("event_id"))){
            return [
                'message' => "BAD REQUEST"
            ];
        }
        $event = $request->user()->events()->find($request->get("event_id"));
        if(is_null($event)){
            return [
                'message' => "NOT FOUND"
            ];
        }
        if(!$request->user()){
            return [
                'message' => "NOT AUTHENTICATED"
            ];
        }
        $event->delete();
        return [
            'message' => "SUCCESS",
            'id' => $event->id
        ];
        
    }
}
