<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Song extends Model
{

    protected $table = 'songs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'artist', 'spotify_link', 'comment'
    ];

    /**
     * The users that play this song.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function players()
    {
        return $this->belongsToMany(User::class, 'plays')
            ->withPivot('instrument');
    }

    /**
     * The rehearsals where this song will be rehearsed.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function rehearsals()
    {
        return $this->belongsToMany(Rehearsal::class, 'schedule')
            ->withPivot('start', 'end');
    }
}