<?php

namespace App\Models;

use Carbon;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class PasswordResetToken extends Model {

    protected $table = 'password_resets';

    //Timestamps are not relevant here
    public $timestamps = false;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'token', 'expires',
    ];

    /**
     * Returns whether the token has expired or not
     * @return boolean Has the token expired
     */
    public function hasExpired(){
        return $this->expires->lessThan(Carbon::now());
    }
    
    /**
     * Associated user
     * @return type
     */
    public function user(){
        return $this->belongsTo(User::class);
    }
}
