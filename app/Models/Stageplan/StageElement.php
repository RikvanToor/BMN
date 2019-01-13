<?php

namespace App\Models\Stageplan;

use Illuminate\Database\Eloquent\Model;

class StageElement extends Model
{
    protected $table = 'stageplan_elements';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','type','geometry'
    ];

    //Disable timestamps.
    public $timestamps = false;

    public function stageplan(){
        return $this->belongsTo(Stageplan::class);
    }

    public function roles(){
        return $this->belongsToMany(StageRole::class,
        'stage_role_to_element',
        'stageelement_id',
        'stagerole_id');
    }
}