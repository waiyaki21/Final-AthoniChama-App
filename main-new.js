const { app, BrowserWindow, Notification, autoUpdater, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const log = require('electron-log');
const fs = require('fs');
const http = require('http');

// const { setPhpEnvVariable, runPhpScript, savePathsToEnv } = require('./utilities/phpUtils');

// Requiring the node-php-server
let phpServer = require('node-php-server');

let phpServerCMD = null; // Global reference for the CMD process
let mainWindow;
let splashWindow;

// Determine if the app is in production or development
const isDev = !app.isPackaged;

// Check for more than one instance of the app running
const singleInstanceLock = app.requestSingleInstanceLock();

// Logging configuration
log.transports.file.resolvePathFn = () => {
    const appData = isDev ? path.resolve(__dirname, 'logs/main.log') : path.join(app.getPath('userData'), 'logs/main.log');
    console.log(appData);
    return appData;
};

// log the app version 
log.log("Application Version: " + app.getVersion())
// END LOGS 

// Get PHP and public folder paths
// const getPhpBinaryPath = () => path.join(__dirname, 'php', 'php.exe');
// const getWwwBinaryPath = () => path.join(__dirname, 'www');
// const phpBinaryPath = getPhpBinaryPath();
// const wwwBinaryPath = getWwwBinaryPath();

// Setting the Server port and the host ip
const port = 8000, host = '127.0.0.1';
const serverUrl = `http://${host}:${port}`;

let isPhpServerRunning = false; // State variable to track server status
let hasAllFiles = false;
let phpEnv_Exists = false;

// Get the path to the 'php' && 'vendor' folder in the project root
const phpFolderPath = path.join(__dirname, 'php');

// Function to check if the 'php' installation exists
function checkPhpInEnvironment() {
    const command = process.platform === 'win32' ? 'where php' : 'which php';

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log('PHP is not in the system environment.');
            phpEnv_Exists = false;
            return;
        }

        if (stderr) {
            console.error('Error checking PHP:', stderr);
            phpEnv_Exists = false;
            return;
        }

        if (stdout.trim()) {
            console.log('PHP is available at:', stdout.trim());
            phpEnv_Exists = true;
        } else {
            console.log('PHP is not found in the system environment.');
            phpEnv_Exists = false;
        }

        // Log the final value for debugging
        console.log('phpEnv_Exists:', phpEnv_Exists);
    });

    return phpEnv_Exists;
}

// Function to check if the 'php' folder exists
function phpCheck() {
    log.log('PHP server check.');
    checkPhpInEnvironment();
    // Check if the server is booted
    http.get(serverUrl, (res) => {
        if (res.statusCode === 200 || 302) {
            isPhpServerRunning = true;
            log.log(`PHP server already running at ${serverUrl}`);
            loadScreen(); // Call loadScreen on success
        }
    }).on('error', (err) => {
        isPhpServerRunning = false;
        log.error(`Waiting for PHP server to boot: ${err.message}`);
        if (phpEnv_Exists) {
            console.log("'php' env exists. Executing Command Server");
            // If folder doesn't exist, download files, etc.
            hasAllFiles = false;
            startPhpServer();
        } else {
            console.log("'php' env does not exist. Creating Local Server");
            // Proceed with your logic (e.g., create splash window, etc.)
            hasAllFiles = true;
            startPhpServer_Node();

            // if (fs.existsSync(phpFolderPath)) {
            //     console.log("'php' folder exists in the project root.");
            //     // Proceed with your logic (e.g., create splash window, etc.)
            //     hasAllFiles = true;
            //     startPhpServer_Node();
            // } else {
            //     console.log("'php' folder does not exist. Performing additional actions...");
            //     // If folder doesn't exist, download files, etc.
            //     hasAllFiles = false;
            //     startPhpServer();
            // }
        }
    });
}

// PHP Server Functions
function startPhpServer() {
    log.log('CMD PHP server activation.');

    if (isPhpServerRunning) {
        log.log('PHP server is already running. Skipping initialization.');
        return;
    }

    // Start the PHP server
    phpServerCMD = exec('php -S 127.0.0.1:8000 -t www/public', (err, stdout, stderr) => {
        if (err) {
            log.error(`Error starting PHP server: ${err.message}`);
            failScreen(); // Call failScreen immediately on error
            return;
        }
        log.log(`PHP server started:\n${stdout}`);
        log.error(`PHP server errors (if any):\n${stderr}`);
    });

    // Check if the server is booted
    loadScreen();

    // Return the server process for future control
    return phpServerCMD;
}

async function startPhpServer_Node() {
    log.log('NODE PHP server activation.');
    if (isPhpServerRunning) {
        log.log('PHP server is already running. Skipping initialization.');
        return;
    }

    try {
        // Mark the server as running
        isPhpServerRunning = true;

        phpServer.createServer({
            port: port,
            hostname: host,
            base: `${__dirname}/www/public`,
            keepalive: false,
            open: false,
            bin: `${__dirname}/php/php.exe`,
            router: __dirname + '/www/server.php',
        });

        log.log(`Node-PHP server started at ${serverUrl}`);
        loadScreen();
    } catch (err) {
        log.log('NODE PHP server failure.');
        log.error('Error starting PHP server with php-server package:', err);

        showNotification(
            `Server Error`,
            `Error starting PHP server with php-server package: ${err}`
        );

        // If an error occurs, reset the state variable
        isPhpServerRunning = false;

        log.log('CMD PHP server calling.');
        startPhpServer();
    }
}

function loadScreen() {
    isPhpServerRunning = true;
    setTimeout(() => {
        // Close splash screen and open main window after the server starts
        if (mainWindow) mainWindow.close();
        createMainWindow();
    }, 1000);
}

function failScreen() {
    isPhpServerRunning = false;
    showNotification(
        `App Error`,
        `App Error ,Closing`
    );
    setTimeout(() => {
        // Close splash screen and open main window after the server starts
        if (mainWindow) mainWindow.close();
        app.quit();
    }, 3500);
}

function stopPHPServer() {
    // Stop CLI-based PHP server
    if (phpServerCMD) {
        try {
            // Send a custom command to phpServerCMD (if applicable)
            phpServerCMD.stdin.write('exit\n'); // Not applicable to PHP server by default
            phpServerCMD.kill('SIGTERM');
            log.log('CLI-based PHP server stopped.');
        } catch (error) {
            console.error('Error stopping CLI-based PHP server:', error.message);
        }
        phpServerCMD = null; // Ensure it's reset
    } else {
        log.log('No CLI-based PHP server process to stop.');
    }

    if (phpServer) {
        phpServer.close();
        log.log('Node-based PHP server stopped.');
    }
}
// END PHP SERVERS

if (!singleInstanceLock) {
    log.log('Another Instance Closed');
    app.quit();  // Quit the app if another instance is running
} else {
    // This event is triggered when a second instance tries to open
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Focus the main window if the app is already running
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    function capitalize(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    function getAppDetails() {
        const appName = capitalize(app.getName());
        const appVersion = app.getVersion();
        return {
            title: `${appName} v${appVersion}`,
            iconPath: path.join(__dirname, 'icons/chama_icon.ico') // Adjust this path
        };
    }

    function createWindow(options) {
        const { title, iconPath } = getAppDetails();
        const defaultOptions = {
            title,
            icon: iconPath,
            webPreferences: {
                nodeIntegration: true
            },
            autoHideMenuBar: !isDev
        };
        return new BrowserWindow({ ...defaultOptions, ...options });
    }

    function createSplashWindow() {
        // Start PHP server
        phpCheck();

        // Show notification
        const { title } = getAppDetails();
        showNotification(`${title} Loading...`, `${title} loading, Please Wait...`);

        mainWindow = createWindow({
            width: 840,
            height: 600,
            frame: true,
            transparent: true,
            alwaysOnTop: true,
            resizable: true
        });

        mainWindow.loadFile('splash.html');
    }

    function createMainWindow() {
        mainWindow = createWindow({
            width: 1200,
            height: 720,
            show: false
        });

        mainWindow.loadURL(serverUrl);

        mainWindow.webContents.once('dom-ready', () => {
            mainWindow.show();
            mainWindow.maximize();
        });

        mainWindow.on('closed', () => {
            // closeAll();
            app.quit();
            mainWindow = null;
        });
    }

    // When Electron is ready to create the window
    app.whenReady().then(() => {
        createSplashWindow();

        // Set the PHP environment variable
        // setPhpEnvVariable();

        // Save the PHP path to .env
        // savePhpPathToEnv();

        // Example: Run a PHP script
        // runPhpScript(); // Replace with the actual script path

        app.on('activate', () => {
            // Configure auto-updater
            autoUpdater.setFeedURL('https://github.com/waiyaki21/Final-AthoniChama-App/releases/latest');
            if (!isDev) { autoUpdater.checkForUpdates() }
            if (BrowserWindow.getAllWindows().length === 0) { createSplashWindow() }
        });
    });

    // Quit when all windows are closed
    app.on('window-all-closed', () => { app.quit() });
}

// Helper function to show notifications
function showNotification(title, body) {
    new Notification({ title, body }).show();
}

function closeAll() {
    stopPHPServer();
    if (autoUpdater) autoUpdater.removeAllListeners();
}

// Handle when all windows are closed
app.on("quit", () => {
    // closeAll();
    app.quit();
});

// AutoUpdater Event Listeners with Notifications
autoUpdater.on("checking-for-update", () => {
    log.info("Checking for updates...");
});

autoUpdater.on("update-available", (info) => {
    // Get the version of the upcoming update
    const nextVersion = info.version;
    log.info(`Update available: Version ${nextVersion}`);
    showNotification("Update Available", `A new update (Version ${nextVersion}) is available. Downloading now...`);
});

autoUpdater.on("update-not-available", (info) => {
    log.info("No updates available:");
    // showNotification("No Update", "You are already on the latest version.");
});

autoUpdater.on("download-progress", (progressTrack) => {
    const percent = Math.round(progressTrack.percent);

    // Convert bytes to megabytes
    const transferredMB = (progressTrack.transferred / (1024 * 1024)).toFixed(2);
    const totalMB = (progressTrack.total / (1024 * 1024)).toFixed(2);

    // Log the download progress
    const progressMsg = `Downloaded ${percent}% (${transferredMB} MB / ${totalMB} MB)`;
    log.info(progressMsg);

    // Show notifications only at 25%, 50%, and 90%
    if (percent === 25 || percent === 50 || percent === 90) {
        showNotification("Download Progress", progressMsg);
    }
});

autoUpdater.on("update-downloaded", () => {
    log.info(`Update downloaded`);

    const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail:
            'A new version has been downloaded. Restart the application to apply the updates.'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) {
            // Display a notification to inform the user that the update is ready
            showNotification("Update Installing", `Restarting to apply the update.`);

            autoUpdater.quitAndInstall();
        }
    })
});

autoUpdater.on("error", (err) => {
    log.error("Update error:", err);
    log.info("Update Error " + err);
    showNotification("Update Error", `An error occurred: ${err.message}`);
});