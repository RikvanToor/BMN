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

    /**
     * Get the rehearsal's songs and their players.
     *
     * @return array
     */
    public function schedule() {
        $result       = $this->toArray();
        $rehearsal_id = $this->id;
        $songs        = $this->songs()->with(['players' => function ($p) use ($rehearsal_id) {
            $p->with(['availabilities' => function ($a) use ($rehearsal_id) {
                $a->where('rehearsal_id', $rehearsal_id);
            }]);
        }]);
        $result['songs'] = $songs->get()->toArray();
        return $result;
    }
}
