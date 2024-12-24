<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Cycle;

class CheckCyclesMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if there are no cycles
        $cyclesCount = Cycle::count();

        if ($cyclesCount == 0) {
            // Redirect to the settings route
            return redirect('/settings');
        }

        // Proceed with the request
        return $next($request);
    }
}
