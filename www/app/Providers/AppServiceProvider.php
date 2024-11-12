<?php

namespace App\Providers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //pass to the side nav
        view()->composer(
            ['partials.navs.side-nav', 'partials.navs.main-nav'],
            function ($view) {
                // get the settings 
                $view->with('setting', Setting::orderBy('id', 'desc')->first());
            }
        );
    }
}
