<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Arrival extends JsonResource
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
            'track' => $this->track,
            'arrival_time' => substr($this->arrival_time, 0, 5)
        ];
    }
}
