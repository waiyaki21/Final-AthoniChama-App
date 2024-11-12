<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class DatabaseBackup extends Command
{

    protected $signature = 'database:backup';

    protected $description = 'This Command backs up the local Database';

    public function __construct()
    {
        parent::__construct();
    }
 
    public function handle()
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

        $this->info("Database backup created successfully at: " . $destination);
    }

    public function deleteExtra($backupPath) {
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
            $this->info("Old backups deleted, only the most recent $count files are kept.");
        }
    }
}
