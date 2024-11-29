const packager = require('@electron/packager');
const path = require('path');

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
        // asar: true,
        // extraResource: [
            // path.join(__dirname, '../php'), // Include the 'php' folder
            // path.join(__dirname, '../.env'), // Include the '.env' file
            // path.join(__dirname, '../utilities'), // Include the 'utilities' folder
            // path.join(__dirname, '../node_modules/node-php-server'),
            // path.join(__dirname, '../node_modules/electron-log'),
        // ],
        // ignore: [
            // /logs/,           // Ignore the "logs" directory
            // /compressed/,     // Ignore the "compressed" directory
            // /php/,         // Ignore all files with the .php extension
            // /www\/vendor/,     // Ignore the "www/vendor" directory
            // /node_modules\/.*(?!node-php-server)/, // Include node-php-server in the build
            // /node_modules\/.*(?!electron-log)/, // Include node-php-server in the build
        // ],
    };

    try {
        console.log('Starting Electron packaging...');
        const appPaths = await packager(options);
        console.log(`Electron app bundles created:\n${appPaths.join("\n")}`);
    } catch (error) {
        console.error('Error packaging Electron app:', error);
    }
}

// Call the function to start the packaging process
bundleElectronApp();
