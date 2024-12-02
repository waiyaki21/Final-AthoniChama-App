const { app, BrowserWindow, Notification, autoUpdater, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const http = require('http');

// const initializeAutoUpdaterListeners = require('./uilities/autoUpdaterListeners');
// const fs = require('fs');

// Determine if the app is in production or development
const isDev = !app.isPackaged;

// Adjust module path based on the environment
let phpServer = require('node-php-server');
const log = require('electron-log');

let phpServerCMD = null; // Global reference for the CMD process
let mainWindow;
let splashWindow;

// Check for more than one instance of the app running
const singleInstanceLock = app.requestSingleInstanceLock();

// Logging configuration
log.transports.file.resolvePathFn = () => {
    const appData = isDev
        ? path.resolve(__dirname, 'logs/main.log') // Dev mode path
        : path.join(
            app.getPath('appData').replace('Roaming', 'Local'), `${app.getName()}/logs/main.log`
        ); // Production mode path

    return appData;
};

// log the app version 
log.log("Application Version: " + app.getVersion())
// END LOGS 

// Setting the Server port and the host ip
const port = 8000, host = '127.0.0.1';
const serverUrl = `http://${host}:${port}`;

let isPhpServerRunning = false; // State variable to track server status
let isPhpServerStarting = false;
let isPhpEnv_Checked = false;
let phpEnv_Exists = false;
let phpServerPID = null; // Initialize with null

const phpFolderPath = isDev
    ? path.join(__dirname, 'php', 'php.exe') // Development
    : path.join(process.resourcesPath, 'app', 'php', 'php.exe'); // Production

const wwwFolderPath = isDev
    ? path.join(__dirname, 'www', 'public') // Development
    : path.join(process.resourcesPath, 'app', 'www', 'public'); // Production

log.log(phpFolderPath);
log.log(wwwFolderPath);

// Helper function to show notifications
function showNotification(title, body) {
    new Notification({ title, body }).show();
}

// Main server initialization logic
async function phpCheck() {
    log.log('PHP server check.');

    try {
        // Ensure the PHP environment is checked
        if (!isPhpEnv_Checked) {
            await checkPhpInEnvironment();
        }

        // Check the server status
        http.get(serverUrl, (res) => {
            if ([200, 302].includes(res.statusCode)) {
                log.log('running: load screen 1');
                // Server is running, proceed with loadScreen
                isPhpServerRunning = true;
                log.log(`PHP server already running at ${serverUrl}`);
                loadScreen();  // Call loadScreen here to close the splash screen and show main window
            } else {
                log.log('not running: start php server 1');
                // If the server is not running, try to start it
                isPhpServerRunning = false;
                startPhpServer(); // Try starting the PHP server
            }
        }).on('error', async (err) => {
            log.error(`PHP server not running: ${err.message}`);
            isPhpServerRunning = false;

            // Only start the server if it is not already starting
            if (!isPhpServerStarting) {
                isPhpServerStarting = true; // Lock the server start process

                try {
                    if (phpEnv_Exists) {
                        log.log("'php' environment exists. Starting PHP server. not running: start cmd-php server 2");
                        await startPhpServer();  // Try starting PHP server if PHP is available
                        loadScreen();
                    } else {
                        log.log("'php' environment does not exist. Starting Node server. not running: start node-php server 1");
                        await startPhpServer_Node();  // Otherwise, fallback to Node server
                        loadScreen();
                    }
                } catch (error) {
                    log.error('Error starting PHP server:', error);
                    // Handle fallback or failure
                } finally {
                    isPhpServerStarting = false; // Unlock after server start
                }
            }
        });
    } catch (error) {
        log.error('Error checking PHP environment:', error.message);
    }
}

// Check if PHP is available in the environment
function checkPhpInEnvironment() {
    return new Promise((resolve, reject) => {
        const command = process.platform === 'win32' ? 'where php' : 'which php';

        exec(command, (error, stdout) => {
            phpEnv_Exists = !error && stdout.trim() !== '';
            phpEnv_Exists ? resolve() : reject('PHP not found in system environment');
        });
    });
}

// Start the PHP server using PHP CLI
function startPhpServer() {
    return new Promise((resolve, reject) => {
        const command = phpEnv_Exists
            ? `php -S 127.0.0.1:8000 -t "${wwwFolderPath}"`
            : `"${phpFolderPath}" -S 127.0.0.1:8000 -t "${wwwFolderPath}"`;

        log.log(command);

        const phpServerCMD = exec(command, (err, stdout, stderr) => {
            if (err) return reject(`Error starting PHP server: ${err.message}`);
            log.log(`PHP server started: ${stdout}`);
            isPhpServerRunning = true;
            log.log(`'server running': ${isPhpServerRunning}`);
            resolve();
        });

        phpServerPID = phpServerCMD.pid; // Store process ID

        loadScreen();
    });
}

// Start the Node-based PHP server
function startPhpServer_Node() {
    return new Promise((resolve, reject) => {
        try {
            phpServer.createServer({
                port: 8000,
                hostname: '127.0.0.1',
                base: `${__dirname}/www/public`,
                keepalive: false,
                open: false,
                bin: phpFolderPath,
                router: `${__dirname}/www/server.php`
            });
            log.log(`Node-PHP server started at ${serverUrl}`);
            isPhpServerRunning = true;
            resolve();
        } catch (err) {
            reject(`Error starting Node-PHP server: ${err}`);
        }
    });
}

// Load the main application window
function loadScreen() {
    if (isPhpServerRunning) {
        log.log('Success open main');
        // Proceed to open the main window and close splash screen
        createMainWindow();
        setTimeout(() => {
            if (splashWindow) {
                splashWindow.close();
            }
        }, 1000);
    } else {
        // Retry PHP check if server is still not running
        log.log('Recheck phpCheck');
        phpCheck();
    }
}

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

// Load the application splash screen
function createSplashWindow() {
    // initializeAutoUpdaterListeners(showNotification, log ,phpServer);
    phpCheck(); // Start server check

    // Notification 
    const { title } = getAppDetails();
    showNotification(`${title} Loading!`, `${title} loading, Please Wait...`);

    splashWindow = createWindow({
        width: 840,
        height: 600,
        frame: true,
        transparent: true,
        alwaysOnTop: false,
        resizable: true
    });

    splashWindow.loadFile('splash.html');
}

// Function to create the main window
function createMainWindow() {
    // notification 
    const { title } = getAppDetails();
    showNotification(`${title} Launching!`, `Loading complete now launching`);

    // Create a new browser window for the main application
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        show: false, // Do not show immediately, only after content is loaded
        webPreferences: {
            nodeIntegration: true, // Enable node integration for this window
            contextIsolation: false // Allow node.js integration in the renderer process
        }
    });

    // Load the main content (HTML, for example)
    mainWindow.loadURL('http://localhost:8000'); // Or your desired URL
    mainWindow.once('ready-to-show', () => {
        mainWindow.show(); // Show window after content is loaded
    });

    // Handle window close event
    mainWindow.on('closed', () => {
        mainWindow = null; // Dereference the window object when closed
        app.quit();
    });
}

// App initialization and configuration
if (!singleInstanceLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow?.isMinimized()) mainWindow.restore();
        mainWindow?.focus();
    });

    app.whenReady().then(() => {
        createSplashWindow();
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createSplashWindow();
        });
    });

    app.on('window-all-closed', () => app.quit());
}

// Handle when all windows are closed
app.on("quit", () => {
    // stopPHPServer();
    if (autoUpdater) autoUpdater.removeAllListeners();
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
    showNotification("No Update Available", "App is already on the latest version.");
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