<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Route extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type'=> $this->type,
            'direction' => $this->direction,
            'stations' => $this->stations()
                                ->orderBy('route_station.order', 'asc')
                                ->get()
        ];
    }
}
