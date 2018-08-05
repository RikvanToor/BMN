<?php

namespace App\Http\Middleware;

use Closure;

class Committee {

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next) {
        $user = $request->user();
        if (!$user->exists || !$user->isCommittee()) {
            return response('Unauthorized.', 401);
        }

        return $next($request);

    }

}