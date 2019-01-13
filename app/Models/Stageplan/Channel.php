<?php

namespace App\Models\Stageplan;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    protected $table = 'stageplan_channels';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'number', 'mic_desc', 'insert'
    ];

    public function stageRole() {
        return $this->belongsTo(StageRole::class,'stagerole_id');
    }
}