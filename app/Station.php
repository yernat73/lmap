<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Station extends Model
{
    protected $fillable = [
        'name', 'lat', 'lng'
    ];

    public function scopeSearch($query, $s){
        return $query->where('address', 'like', '%'.$s.'%');
    }

    public function routes()
    {
        return $this->belongsToMany('App\Route')->using('App\RouteStation');
    }
}
