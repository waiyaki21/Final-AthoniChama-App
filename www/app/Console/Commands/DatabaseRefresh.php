<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class DatabaseRefresh extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'database:refresh';  // Command to be used in the terminal

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete the existing database.sqlite and replace it with the original one from the original folder';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        // Get the database path from the config/database.php file
        $databasePath = database_path('database.sqlite');
        $originalDatabasePath = database_path('original/database.sqlite');

        // Check if the database.sqlite file exists
        if (File::exists($databasePath)) {
            // Delete the existing database.sqlite
            File::delete($databasePath);
            $this->info('Deleted existing database.sqlite');
        }

        // Check if the original database.sqlite file exists
        if (File::exists($originalDatabasePath)) {
            // Copy the original database.sqlite to the database path
            File::copy($originalDatabasePath, $databasePath);
            $this->info('Copied the original database.sqlite to the database path');
        } else {
            // If the original database.sqlite doesn't exist
            $this->error('Original database.sqlite not found in the original folder');
        }
    }
}
