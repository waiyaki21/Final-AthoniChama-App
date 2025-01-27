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
        // Get cycle count
        $cycleCount = Cycle::count();

        // Fetch common data
        $cycles     = Cycle::orderBy('created_at', 'desc')->get();
        $current    = Cycle::orderBy('id', 'desc')
                        ->with('payments', 'projects')
                        ->first();
        $settings   = Setting::first();

        // Determine suitable name and date
        $date       = Carbon::now()->format('d/m/Y');
        $name       = $cycleCount == 0
            ? Carbon::now()->format('F Y')
            : Carbon::now()->addMonth()->format('F Y');

        if ($cycleCount != 0) {
            // Fetch finance data
            $updateFinance  = new FinancesController();
            $finance        = $updateFinance->update();

            // Fetch cycles info
            $info = $this->CyclesInfo();

            // Render Dashboard
            return Inertia::render('Dashboard', [
                'name'      => env('APP_NAME'),
                'route'     => Route::current()->getName(),
                'cycles'    => $cycles,
                'current'   => $current,
                'date'      => $date,
                'finance'   => $finance,
                'settings'  => $settings,
                'nextname'  => $name,
                'info'      => $info,
            ]);
        } else {
            // Fetch additional data for settings view
            $projects       = Project::orderBy('created_at', 'desc')->get();
            $members        = DB::table('members')
                                ->whereNull('deleted_at')
                                ->orderBy('created_at', 'desc')
                                ->get(['id', 'name']);
            $finance        = Finances::first();
            $updated        = $settings ? true : false;

            // Render Settings
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
                'updated'   => $updated,
            ]);
        }
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

        if ($cycles == 0 || $members == 0) {
            $done = false;
        } else {
            $done = true;
        }

        if (url()->previous() !== route('login') && url()->previous() !== '' && url()->previous() !== url()->current()) {
            $state = true;
            $url   = url()->previous();
            return [$state, $url, $members, $cycles, $projects, $done];
        } else {
            $state = false;
            $url   = 'empty';
            return [$state, $url, $members, $cycles, $projects, $done];
        } 
    }
}
