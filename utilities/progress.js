const { exec } = require('child_process');
const ProgressBar = require('cli-progress');

// Create a new progress bar instance
const bar = new ProgressBar.SingleBar({
    format: '{bar} {percentage}% | {value}/{total} steps',
    barCompleteChar: '=',
    barIncompleteChar: ' ',
}, ProgressBar.Presets.shades_classic);

// Total steps for progress (You can adjust this based on expected steps in your process)
const totalSteps = 100;
bar.start(totalSteps, 0);

// Example of executing the packaging command and tracking progress
const packageProcess = exec('electron-forge make');

// Track the process output and update progress bar
packageProcess.stdout.on('data', (data) => {
    // Simulate progress based on the amount of data received (or customize it as per your needs)
    bar.increment();
});

packageProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

packageProcess.on('close', (code) => {
    bar.stop(); // Stop the progress bar when the process is finished
    if (code === 0) {
        console.log('Packaging complete');
    } else {
        console.log('Packaging failed');
    }
});
