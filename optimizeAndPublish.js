const { exec }      = require('child_process');
const fs            = require('fs');
const path          = require('path');

// Function to execute commands in sequence and log all output
function executeCommand(command, workingDir = process.cwd()) {
    return new Promise((resolve, reject) => {
        const process = exec(command, { cwd: workingDir });

        // Log stdout in real-time
        process.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        // Log stderr in real-time
        process.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        // Handle process completion
        process.on('close', (code) => {
            if (code !== 0) {
                reject(`Command failed with exit code ${code}`);
            } else {
                resolve();
            }
        });
    });
}

// Function to update APP_MODE in the .env file to empty
function updateAppModeToEmpty() {
    const envPath = path.join(__dirname, '.env');

    // Read the .env file contents
    let currentEnv = fs.readFileSync(envPath, 'utf-8');

    // Check if APP_MODE exists, and replace its value with ''
    const appModeRegex = /APP_MODE\s*=\s*(.*)/;
    if (appModeRegex.test(currentEnv)) {
        currentEnv = currentEnv.replace(appModeRegex, 'APP_MODE    = ""');
    } else {
        // If APP_MODE doesn't exist, append it to the .env file
        currentEnv += '\nAPP_MODE    = ""\n';
    }

    // Write the updated content back to the .env file
    fs.writeFileSync(envPath, currentEnv);
    console.log('APP_MODE set to "" in .env');
}

// Step 1: Navigate to www and run php artisan optimize:clear
async function runOptimizeAndPublish() {
    try {
        // Update APP_MODE in the .env file
        updateAppModeToEmpty();

        // Step 2: Run php artisan optimize:clear in the www directory
        console.log('Running php artisan optimize:clear in the www directory...');
        await executeCommand('php artisan optimize:clear', path.join(__dirname, 'www'));

        // Step 3: Run electron-forge publish
        console.log('Running electron-forge publish...');
        await executeCommand('electron-forge publish');
        console.log('Publish completed successfully!');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

runOptimizeAndPublish();
