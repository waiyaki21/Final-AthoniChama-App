<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Cycle;
use App\Models\Member;
use App\Models\Expense;
use App\Models\Payment;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Welfare;
use App\Models\CycleExpense;
use App\Models\CycleExpenseNames;
use Illuminate\Support\Facades\File;
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
        
        // refresh the DB 
        if (env('APP_ENV') === 'local') {
            // If the environment is local, run the migration without specifying the --env flag
            Artisan::call('migrate:refresh');
        } else {
            // Otherwise, run the migration with the --env=production flag
            // Artisan::call('database:refresh');
            $this->refreshDB_Prod();
        }

        return redirect('/register');
    } 

    public function backupDB()
    {
        // Artisan::call('database:backup');
        $this->backupDB_Local();
    }

    public function backupDB_Local()
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

        // delete extra files
        $this->deleteExtra($backupPath);

        $message = "Database backup created successfully at: " . $destination;

        // return $message;
    }

    public function deleteExtra($backupPath)
    {
        // Count and manage backup files
        $files = File::files($backupPath); // Get all files in the backup directory

        // Sort files by last modified time in descending order (newest first)
        usort($files, function ($a, $b) {
            return $b->getMTime() <=> $a->getMTime();
        });

        $count = 15;

        // Check if there are more than $count files
        if (count($files) > $count) {
            // Keep only the most recent $count files and delete the rest
            $filesToDelete = array_slice($files, $count);
            foreach ($filesToDelete as $file) {
                File::delete($file->getPathname());
            }
            $message = "Old backups deleted, only the most recent $count files are kept.";

            // return $message;
        }
    }

    // Automatic Refresh Options 
    public function refreshDB_Prod()
    {
        // Get the database path from the config/database.php file
        $databasePath           = database_path('database.sqlite');
        $originalDatabasePath   = database_path('original/database.sqlite');

        // Check if the database.sqlite file exists
        if (File::exists($databasePath)) {
            // Delete the existing database.sqlite
            File::delete($databasePath);
            $message = 'Deleted existing database.sqlite';
        }

        // Check if the original database.sqlite file exists
        if (File::exists($originalDatabasePath)) {
            // Copy the original database.sqlite to the database path
            File::copy($originalDatabasePath, $databasePath);
            $message = 'Copied the original database.sqlite to the database path';
            // return $message;
        } else {
            // If the original database.sqlite doesn't exist
            $message = 'Original database.sqlite not found in the original folder';
            // return $message;
        }
    }

    // Manual Refresh Options
    // 1.  
    public function resetCycles()
    {
        // Get all cycles, including soft-deleted ones
        $cycles = Cycle::withTrashed()->get();

        // Delete all associated records, including soft-deleted ones
        foreach ($cycles as $cycle) {
            // Delete payments
            $payments = Payment::where('cycle_id', $cycle->id)
                ->withTrashed() // Include soft-deleted payments
                ->get();
            foreach ($payments as $payment) {
                $payment->forceDelete(); // Permanently delete
            }

            // Delete welfares
            $welfares = Welfare::where('cycle_id', $cycle->id)
                ->withTrashed() // Include soft-deleted welfares
                ->get();
            foreach ($welfares as $welfare) {
                $welfare->forceDelete(); // Permanently delete
            }

            // Delete expenses
            $expenses = Expense::where('cycle_id', $cycle->id)
                ->withTrashed() // Include soft-deleted expenses
                ->get();
            foreach ($expenses as $expense) {
                $expense->forceDelete(); // Permanently delete
            }

            // Delete cycle expenses
            $cycleExpenses = CycleExpense::where('cycle_id', $cycle->id)
                ->withTrashed() // Include soft-deleted cycle expenses
                ->get();
            foreach ($cycleExpenses as $cycleExpense) {
                $cycleExpense->forceDelete(); // Permanently delete
            }

            // Delete projects
            $projects = Project::where('cycle_id', $cycle->id)
                ->withTrashed() // Include soft-deleted projects
                ->get();
            foreach ($projects as $project) {
                $project->forceDelete(); // Permanently delete
            }

            // Delete the cycle itself
            $cycle->forceDelete(); // Permanently delete

            // Update finances
            $updateFinance = new FinancesController();
            $updateFinance->update();
        }

        // Get and return settings info
        $info = $this->getSettings();
        return $info;
    }

    // 2. 
    public function resetMembers()
    {
        // get all members 
        $members = Member::get();

        // delete all info 
        foreach ($members as $member) {
            // get & delete payments 
            $payments = Payment::where('member_id', $member->id)
                ->get();
            foreach ($payments as $payment) {
                $payment->delete();
            }

            // get & delete welfares 
            $welfares = Welfare::where('member_id', $member->id)
                ->get();
            foreach ($welfares as $welfare) {
                $welfare->delete();
            }

            // delete member 
            $member->delete();

            // update finances
            $updateFinance = new FinancesController();
            $updateFinance->update();
        }

        $info = $this->getSettings();
        return $info;
    }
    // 3. 
    public function resetUsers()
    {
        // get all users 
        $users = User::get();

        // delete all info 
        foreach ($users as $user) {
            // delete user 
            $user->delete();
        }

        // Delete all settings
        Setting::query()->delete();

        // get ,create & update finances
        $finances = new FinancesController();
        $finances->updateSettings();

        $info = $this->getSettings();
        return $info;
    }

    function getSettings()
    {
        // update settings
        $updateSettings = new SettingController();
        $info           = $updateSettings->getSettings();

        return $info;    
    }
}
