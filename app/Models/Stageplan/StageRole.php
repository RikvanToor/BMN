<?php

namespace App\Models\Stageplan;

use Illuminate\Database\Eloquent\Model;

class StageRole extends Model
{
    protected $table = 'stageplan_roles';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name'
    ];

    /**
     * Associated stage elements.
     */
    public function elements(){
        return $this->hasMany(StageElement::class);
    }
    public function position(){
        return $this->belongsTo(StagePositions::class);
    }
}