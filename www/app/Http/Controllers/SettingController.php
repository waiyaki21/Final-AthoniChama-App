<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Cycle;
use App\Models\Member;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Finances;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Database\Eloquent\Collection;
use PhpOffice\PhpSpreadsheet\Calculation\Logical\Boolean;

class SettingController extends Controller
{
    public function settings()
    {
        // get all cycles 
        $cycles = Cycle::orderBy('created_at', 'desc')
                        ->get();

        // get current cycle 
        $current = Cycle::orderBy('created_at', 'desc')
                        ->with('payments','projects')
                        ->first();

        // get all projects 
        $projects = Project::orderBy('created_at', 'desc')
                        ->get();

        // get all members 
        $members = DB::table('members')->orderBy('created_at', 'desc')
                        ->where('deleted_at', null)
                        // ->withCount('payments')
                        // with(['product_detail.product' => function($query){
                        //     $query->groupBy('product_name');
                        // }])->get();
                        ->get(['id','name']);

        // get finance 
        $finance = Finances::first();

        // get settings 
        $settings = Setting::first();
        // return $settings;

        // get cycle form data
        if ($cycles->count() == 0) {
            // get suitable name 
            $date       = Carbon::now()->format('d/m/Y');
            $thisMonth  = Carbon::now()->format('F y');
            $name       = $thisMonth;
        } else {
            // get suitable name 
            $date       = Carbon::now()->format('d/m/Y');
            $nextMonth  = Carbon::now()->addMonth()->format('F y');
            $name       = $nextMonth;
        }

        //if settings are updated
        if (!$settings) {
            $updated = false;
        } else {
            $updated = true;
        }
        
        return Inertia::render('Settings', [
            'name'      => env('APP_NAME'),
            'route'     => Route::current()->getName(),
            'cycles'    => $cycles,
            'current'   => $current,
            'members'   => $members,
            'date'      => $date,
            'finance'   => $finance,
            'settings'  => $settings,
            'projects'  => $projects,
            'nextname'  => $name,
            'date'      => $date,
            'updated'   => $updated
        ]);
    }
    
    public function update(Request $request, Setting $setting)
    {
        //validate the request
        $this->validate($request, [
            'name'           => 'required',
            'shortname'      => 'required',
            'payment_def'    => 'required|integer|min:1',
            'welfare_def'    => 'required|integer|min:1',
        ]);

        // request to update setting
        $setting = Setting::where('user_id', Auth::user()->id)->first();
        $setting->update($request->all());

        Finances::where('user_id', Auth::user()->id)
                ->update([
                    'payment_def'   => request('payment_def'),
                    'welfare_def'   => request('welfare_def'),
                ]);

        return back();
    }

    public function months() : Array 
    {
        $month1     = strtoupper('January');
        $month2     = strtoupper('February');
        $month3     = strtoupper('March');
        $month4     = strtoupper('April');
        $month5     = strtoupper('May');
        $month6     = strtoupper('June');
        $month7     = strtoupper('July');
        $month8     = strtoupper('August');
        $month9     = strtoupper('September');
        $month10    = strtoupper('October');
        $month11    = strtoupper('November');
        $month12    = strtoupper('December');

        $col = new Collection([$month1, $month2, $month3, $month4, $month5, $month6, $month7, $month8, $month9, $month10, $month11, $month12]);
        $months = array($col);

        $arr = array();
        foreach ($col as $month) {
            $rec = array('name' => $month);
            array_push($arr, $rec);
        }
        
        return [$arr];
    }

    // API REQUESTS
    public function isSettings() : Array {
        // get route name
        $name = Route::current()->getName();

        //get cycle info
        $cycles = Cycle::count();

        if ($name == 'Admin Settings') {
            if ($cycles == 0) {
                $setup = true;
            } else {
                $setup = false;
            }
        } else {
            $setup = false;
        }

        // request to update setting
        $setting = Setting::orderBy('created_at', 'desc')->first();
        
        // get version
        $version = env('APP_VERSION');
        
        return [$setup, $setting, $version];
    }

    public function getSettings()
    {
        // get all cycles 
        $cycles = Cycle::count();

        // get all projects 
        $projects = Project::count();

        // get all members 
        $members = Member::count();

        // get settings 
        $settings = Setting::first();

        //if settings are updated
        if (!$settings) {
            $updated = false;
        } else {
            $updated = true;
        }

        return [$updated, $members, $cycles, $projects];
    }
}
