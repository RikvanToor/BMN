<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use Tymon\JWTAuth\JWTAuth as JWTAuth;
use Tymon\JWTAuth\Claims\Expiration as Expiration;
use Tymon\JWTAuth\Exceptions\TokenExpiredException as TokenExpiredException;
use Tymon\JWTAuth\Exceptions\JWTException as JWTException;
use Tymon\JWTAuth\JWT as JWT;

class Authenticate {
    /**
     * The authentication guard factory instance.
     *
     * @var \Illuminate\Contracts\Auth\Factory
     */
    protected $auth;

    /**
     * @var \Tymon\JWTAuth\JWT
     */
    protected $jwt;

    /**
     * Create a new middleware instance.
     *
     * @param  \Illuminate\Contracts\Auth\Factory  $auth
     * @return void
     */
    public function __construct(Auth $auth, JWT $jwt) {
        $this->auth = $auth;
        $this->jwt = $jwt;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null) {
        //Apparently, we are not logged in
        if ($this->auth->guard($guard)->guest()) {
            $this->jwt->setRequest($request);
            try{
                $payload = $this->jwt->getPayload();
            }
            catch(TokenExpiredException $e){
                return response(array('msg'=>'Token expired'), 401);
            }
            catch(JWTException $e){
                return response(array('msg'=>'Unauthorized.'), 401);    
            }
            return response(array('msg'=>'Unauthorized.'), 401);
        }

        return $next($request);
    }

    public function check() {
        $auth->check();
    }
}
