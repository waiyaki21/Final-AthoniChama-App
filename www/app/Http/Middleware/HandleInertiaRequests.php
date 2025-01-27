<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
// use App\Models\Cycle;
use App\Models\Setting;
use Inertia\Middleware;
// use Tightenco\Ziggy;
use Tighten\Ziggy\Ziggy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $date  = Carbon::now();

        $ccount = DB::table('cycles')->count();
        $mcount = DB::table('members')->count();

        if ($ccount == 0 || $mcount == 0) {
            $done = false;
        } else {
            $done = true;
        }

        return array_merge(parent::share($request), [
            // user data 
            'auth' => [
                'user' => $request->user(),
            ],

            // env data
            'version' => env('APP_VERSION'),
            'setting' => Setting::first(),

            // settings done 
            'done' => $done,

            // route 
            'route'     => Route::current()->getName(),

            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },

            // 'notifications' => auth()->user()->unreadnotifications
        ]);
    }
}
