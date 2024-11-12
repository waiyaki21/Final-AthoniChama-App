<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Cycle;
use App\Models\Member;
use App\Models\Expense;
use App\Models\Payment;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Welfare;
use App\Models\Finances;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\View;
use PhpParser\Node\Expr\Cast\Array_;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\FinancesController;

class DashboardController extends Controller
{
    public function index() 
    {
        // get all cycles 
        $cycles = Cycle::orderBy('created_at', 'desc')
                        ->get();

        // get current cycle 
        $current = Cycle::orderBy('id', 'desc')
                        ->with('payments','projects')
                        ->first();

        // get finance 
        $updateFinance = new FinancesController();
        $finance =  $updateFinance->update();
        // return $finance;

        // get settings 
        $settings = Setting::first();

        // get cycle form data
        if ($cycles->count() == 0) {
            // get suitable name 
            $date       = Carbon::now()->format('d/m/Y');
            $thisMonth  = Carbon::now()->format('F Y');
            $name       = $thisMonth;
        } else {
            // get suitable name 
            $date       = Carbon::now()->format('d/m/Y');
            $nextMonth  = Carbon::now()->addMonth()->format('F Y');
            $name       = $nextMonth;
        }

        // get cycles info 
        $info = $this->CyclesInfo();

        return Inertia::render('Dashboard', [
            'name'      => env('APP_NAME'),
            'route'     => Route::current()->getName(),
            'cycles'    => $cycles,
            'current'   => $current,
            'date'      => $date,
            'finance'   => $finance,
            'settings'  => $settings,
            'nextname'  => $name,
            'date'      => $date,
            'info'      => $info
        ]);
    }

    // API REQUESTS 
    public function CyclesInfo() 
    {
        // get cycles by year 
        $cycleYear = DB::table('cycles')
                        ->select( 
                            DB::raw('year')
                        )
                        ->groupBy('year')
                        ->orderBy('year', 'desc')
                        ->get();

        // get cycles by month
        $cycleMonth = DB::table('cycles')
                        ->orderBy('id', 'desc')
                        ->limit(12)
                        ->get();

        $cycleCount = DB::table('cycles')
                        ->where('deleted_at', null)
                        ->count();

        if ($cycleMonth->count() == 0) {
            $first = null;
            $last  = null;
            $firstname = '';
            $lastname  = '';
        } else {
            $first      = $cycleMonth[0];
            $last       = $cycleMonth->last();
            $firstname  = $cycleMonth[0]->name;
            $lastname   = $last->name;
        }

        return [$cycleYear,$cycleMonth, $first, $last, $firstname, $lastname, $cycleCount];
    }

    public function EndCyclesInfo(Cycle $cycle) : Array 
    {
        $all = $this->CyclesInfo();

        $months = $all[1]->where('id', '>=', $cycle->id);

        return [$months];
    }

    public function getCyclesNo($from, $to) : String 
    {
        // get cycles no 
        $cycleNo = DB::table('cycles')
                        // ->where('deleted_at', "")
                        ->whereBetween('id',[$from, $to])
                        ->count();

        return $cycleNo;
    }
 
    public function downloadFile()
    {
        $databasePath = database_path('database.sqlite'); // Path to the SQLite database file
        $backupPath   = public_path('backup');         // Path to store the backup files

        // Create the backup directory if it doesn't exist
        if (!File::exists($backupPath)) {
            File::makeDirectory($backupPath, 0755, true);
        }

        // Generate a unique backup filename
        $filename = "Backup-" . Carbon::now()->format('d-m-y-h-m-s') . ".sqlite";
        $destination = $backupPath . '/' . $filename;

        // Copy the database file to the backup location
        File::copy($databasePath, $destination);

        // $this->info("Database backup created successfully at: " . $destination);

        return response()->download($destination, $filename);
    }

    public function urlPrev() 
    {
        $members  = DB::table('members')->where('deleted_at', null)->count();

        $cycles   = DB::table('cycles')->where('deleted_at', null)->count();

        $projects = DB::table('projects')->where('deleted_at', null)->count();

        if (url()->previous() !== route('login') && url()->previous() !== '' && url()->previous() !== url()->current()) {
            $state = true;
            $url   = url()->previous();
            return [$state, $url, $members, $cycles, $projects];
        } else {
            $state = false;
            $url   = 'empty';
            return [$state, $url, $members, $cycles, $projects];
        }
    }
}
