<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rehearsal extends Model {

    protected $table = 'rehearsals';

    /**
     * The attributes that are mass assignable.gg
     *
     * @var array
     */
    protected $fillable = [
        'location', 'start', 'end',
    ];

    /**
     * The songs that will be rehearsed.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function songs() {
        return $this->belongsToMany(Song::class, 'schedule')
            ->withPivot('start', 'end');
    }

    /**
     * The users that have specified their availabilities for the rehearsal.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function availabilities() {
        return $this->belongsToMany(User::class, 'availability')
            ->withPivot('start', 'end');
    }
}
