<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Track extends Model
{
    public function arrivals()
    {
        return $this->hasMany('App\Arrival');
    }

    public function route()
    {
        return $this->belongsTo('App\Route');
    }
}
