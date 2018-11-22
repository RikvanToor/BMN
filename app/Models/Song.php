<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Song extends Model {

    protected $table = 'songs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'artist', 'spotify_link', 'comment',
        'genre', 'vocals', 'backing', 'duet', 'is_setlist', 'setlist_order'
    ];

    /**
     * The users that play this song.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function players() {
        return $this->belongsToMany(User::class, 'plays')
            ->withPivot('instrument');
    }

    /**
     * The users can sing this song.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function singers() {
        return $this->belongsToMany(User::class, 'can_sing')
            ->withPivot('yes_or_maybe');
    }

    /**
     * The rehearsals where this song will be rehearsed.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function rehearsals() {
        return $this->belongsToMany(Rehearsal::class, 'schedule')
            ->withPivot('start', 'end');
    }
}