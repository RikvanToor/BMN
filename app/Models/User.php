<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Model implements JWTSubject, AuthenticatableContract, AuthorizableContract {
    use Authenticatable, Authorizable;

    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'username', 'is_active', 'is_admin', 'password',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'email', 'is_active',
    ];

    /**
     * The songs that the user plays
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function songs() {
        return $this->belongsToMany(Song::class, 'plays')
            ->withPivot('instrument');
    }

    /**
     * The songs that the user could or could maybe sing.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function singingSongs() {
        return $this->belongsToMany(Song::class, 'can_sing')
            ->withPivot('yes_or_maybe');
    }

    /**
     * The rehearsals that the user has specified their availabilities for.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function availabilities() {
        return $this->belongsToMany(Rehearsal::class, 'availability')
            ->withPivot('start', 'end');
    }

    /**
     * The news articles this user wrote.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function news() {
        return $this->hasMany(News::class);
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT
     *
     * @return mixed
     */
    public function getJWTIdentifier() {
        return $this->getKey(); // Eloquent model method
    }
    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims() {
        return [];
    }

    /**
     * Returns whether or not a user is part of the committee.
     * 
     * @return bool
     */
    public function isCommittee() {
        return $this->is_admin;
    }
}
