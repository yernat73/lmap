<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    //
    protected $casts = [
        'start' => 'array', // Will convarted to (Array)
        'destination' => 'array',
    ];
}
