<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Setting;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\FinancesController;

class ArtisanController extends Controller
{
    public function getCache()
    {
        Artisan::call('route:cache');

        Artisan::call('config:cache');

        Artisan::call('view:cache');

        Artisan::call('optimize');

        // return redirect('/dashboard');
    }

    public function bustCache()
    {
        Artisan::call('optimize');

        Artisan::call('optimize:clear');

        return Inertia::render('Dashboard');
    }

    public function resetDB()
    {
        set_time_limit(0);

        $this->backupDB();
        
        Artisan::call('migrate:refresh');

        return redirect('/register');
    }

    public function backupDB()
    {
        Artisan::call('database:backup');
    }

    public function filesbackupDB()
    {
        Artisan::call('zip:files');
    }
}
