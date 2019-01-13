<?php

namespace App\Models\Stageplan;

use Illuminate\Database\Eloquent\Model;

class Stageplan extends Model
{
    protected $table = 'stageplans';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','year', 'notes', 'element_order'
    ];

    public function getElementOrderAttribute(){
        return array_map('intval',explode(',', $this->attributes['element_order']));
    }

    /**
     * Custom mutator for setting the element order
     * @param {array} $value The value to set. Expects array of numbers
     */
    public function setElementOrderAttribute($value){
        $this->attributes['element_order'] = join(',',$value);
    }

    public function channels(){
        return $this->hasMany(Channel::class);
    }

    public function roles(){
        return $this->hasMany(StageRole::class);
    }

    public function positions(){
        return $this->hasMany(StagePosition::class);
    }
    
    public function elements(){
        return $this->hasMany(StageElement::class);
    }
}