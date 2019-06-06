<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

    public static function getByDistance($lat, $lng, $distance)
    {
        $results = DB::select(DB::raw('SELECT id, (  6371 * acos( cos( radians(' . $lat . ') ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(' . $lng . ') ) + sin( radians(' . $lat .') ) * sin( radians(lat) ) ) ) AS distance FROM stations HAVING distance < ' . $distance . ' ORDER BY distance') );
        return $results;
    }


}
