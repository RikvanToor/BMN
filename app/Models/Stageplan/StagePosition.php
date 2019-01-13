<?php

namespace App\Models\Stageplan;

use Illuminate\Database\Eloquent\Model;

class StagePosition extends Model
{
    protected $table = 'stageplan_positions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','geometry'
    ];

    public function roles(){
        return $this->hasMany(StageRole::class);
    }
    public function stagePlan(){
        return $this->belongsTo(Stageplan::class);
    }
}