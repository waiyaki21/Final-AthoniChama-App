const packager = require('@electron/packager');
const path = require('path');
const { createZip } = require('./zip.js');
const { execSync } = require('child_process');
const readline = require('readline'); // Import readline for user prompts

// Create an interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to ask the user a question
function askQuestion(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => resolve(answer));
    });
}

async function bundleElectronApp() {
    // Define the options for electron-packager
    const options = {
        dir: '.', // Current directory (root of your app)
        name: 'AthoniChamaApp', // Name of your app
        platform: 'win32', // Platform for packaging (win32, darwin, linux)
        arch: 'x64', // Architecture (x64, ia32, armv7l, arm64)
        out: path.join(__dirname, '../dist'), // Output directory
        icon: path.join(__dirname, '../icons', 'chama_icon.ico'), // Path to your icon
        overwrite: true, // Overwrite existing output
        prune: true, // Remove unnecessary files (e.g., devDependencies)
        ignore: [
            /www\/node_modules/, // Ignore the 'www/node_modules' folder
            /www\/storage\/logs/, // Ignore the 'www/storage/logs' folder 
            /^\/out/, // Ignore the 'out' folder at the root
            // /^\/php/, // Ignore the 'php' folder at the root
        ],
    };

    try {
        if (process.env.NODE_ENV === 'development') {
            console.log('Running in development mode');
        } else {
            console.log('Running in production mode');
        }

        // Ask the user if they want to pack the app
        const packAnswer = await askQuestion('Would you like to pack the app? Press Enter to confirm, or type "no" to skip: ');
        if (packAnswer.trim().toLowerCase() === '' || packAnswer.trim() === '1') {
            console.info('Starting Electron packaging...');
            const appPaths = await packager(options);
            console.info(`Electron app bundles created:\n${appPaths.join("\n")}`);

            // Ask the user if they want to zip the app
            const zipAnswer = await askQuestion('Would you like to zip the app? Press Enter to confirm, or type "no" to skip: ');
            if (zipAnswer.trim().toLowerCase() === '' || zipAnswer.trim() === '1') {
                // Define paths for zipping
                const inputFolder = path.resolve(appPaths[0]); // The first app bundle path
                const outputZipPath = path.resolve(`${inputFolder}.zip`);

                // Call createZip function to create the ZIP file
                console.info('Creating ZIP archive...');
                await createZip(inputFolder, outputZipPath);
                console.info(`ZIP file created: ${outputZipPath}`);

                // Ask the user if they want to create a release on GitHub
                const releaseAnswer = await askQuestion('Would you like to create a GitHub release? Press Enter to confirm, or type "no" to skip: ');
                if (releaseAnswer.trim().toLowerCase() === '' || releaseAnswer.trim() === '1') {
                    // Call release.js to create the release on GitHub
                    console.info('Creating GitHub release...');
                    execSync('node ./utilities/release.js', { stdio: 'inherit' });
                } else if (releaseAnswer.trim().toLowerCase() === 'no') {
                    console.info('Skipping GitHub release...');
                } else {
                    console.error('Invalid input. Skipping GitHub release...');
                }
            } else if (zipAnswer.trim().toLowerCase() === 'no') {
                console.info('Skipping zip creation...');
            } else {
                console.error('Invalid input. Skipping zip creation...');
            }
        } else if (packAnswer.trim().toLowerCase() === 'no') {
            console.info('Skipping packaging...');
        } else {
            console.error('Invalid input. Skipping packaging...');
        }

        // Close the readline interface
        rl.close();
    } catch (error) {
        console.error('Error during packaging or release:', error);
        rl.close();
    }
}

// Call the function to start the packaging process
bundleElectronApp();