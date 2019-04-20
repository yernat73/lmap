<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    public function scopeSearch($query, $s){
        return $query->where('name', 'like', '%'.$s.'%');
    }

    public function stations()
    {
        return $this->belongsToMany('App\Station')
                        ->using('App\RouteStation')
                        ->withPivot([
                            'order'
                        ]);
    }
}
