<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Arrival extends Model
{
    public function track()
    {
        return $this->belongsTo('App\Track');
    }
    public function station()
    {
        return $this->belongsTo('App\Station');
    }
}
