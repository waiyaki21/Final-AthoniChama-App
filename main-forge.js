const { app, BrowserWindow, Notification, autoUpdater, dialog } = require('electron');
const path          = require('path');
const { exec }      = require('child_process');
const http          = require('http');

// const initializeAutoUpdaterListeners = require('./uilities/autoUpdaterListeners');
// const fs = require('fs');

// Determine if the app is in production or development
const isDev = !app.isPackaged;

// Adjust module path based on the environment
let phpServer = require('node-php-server');
const log     = require('electron-log');

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
            app.getPath('appData').replace('Roaming', 'Local'),`${app.getName()}/logs/main.log`
        ); // Production mode path

    return appData;
};

// log the app version 
log.log("Application Version: " + app.getVersion())
// END LOGS 

let isPhpServerRunning  = false; // State variable to track server status

const phpFolderPath = isDev
    ? path.join(__dirname, 'php', 'php.exe') // Development
    : path.join(process.resourcesPath, 'app' ,'php', 'php.exe'); // Production

const wwwFolderPath = isDev
    ? path.join(__dirname, 'www', 'public') // Development
    : path.join(process.resourcesPath, 'app' ,'www', 'public'); // Production

const { phpCheck } = require(isDev
    ? './utilities/phpInfo' // Development
    : path.join(process.resourcesPath, 'app', 'utilities', 'phpInfo')); // Production

log.log(phpFolderPath);
log.log(wwwFolderPath);

// Helper function to show notifications
const showNotification = (title, body) => {
    new Notification({ title, body }).show();
}

// updates the isPhpServerRunning value 
const updateStatus = (status) => {
    isPhpServerRunning = status;
};

// Load the main application window
const loadScreen = () => {
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
        phpCheck(loadScreen, wwwFolderPath, phpFolderPath, log, phpServer, updateStatus, showNotification);
    }
};

function capitalize(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function getAppDetails() {
    const appName = capitalize(app.getName());
    const appVersion = app.getVersion();
    return {
        title: `${ appName } v${ appVersion }`,
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
    phpCheck(loadScreen, wwwFolderPath, phpFolderPath, log, phpServer, updateStatus, showNotification); // Start server check

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