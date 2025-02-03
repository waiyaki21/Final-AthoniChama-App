// load the dependencies 
const { 
    app, 
    BrowserWindow, 
    Notification, 
    ipcMain,
    shell,
    dialog
}                                           = require('electron');
const path                                  = require('path');
const log                                   = require('electron-log');
const fs                                    = require('fs');

// Determine if the app is in production or development
const isDev                                 = !app.isPackaged;

// load in the autoUpdater listener file from utilities 
const { setupAutoUpdater }                 = require('./utilities/autoUpdater');

// load in the log listener file from utilities 
const { 
    initializeLogs, 
    splashLog,
    mainLog
}                                           = require('./utilities/appLogs');
initializeLogs(log, isDev, path, app);

const { 
    createWindow, 
    getAppDetails, 
    capitalize,
    openUrlDialog
}                                           = require('./utilities/windowUtils');

// create the windows 
let mainWindow;
let splashWindow;

// Check for more than one instance of the app running
const singleInstanceLock                   = app.requestSingleInstanceLock();

let isPhpServerRunning                     = false; // State variable to track server status

const { phpFolderPath, wwwFolderPath, cacheFolderPath, dbFolderPath } = require("./utilities/paths");

const { phpCheck } = require(isDev
    ? './utilities/phpInfo' // Development
    : path.join(process.resourcesPath, 'app', 'utilities', 'phpInfo')); // Production

// Ensure the ipcMain listener is registered only once
ipcMain.on('update-status', (event, { message, type, progress = null }) => {
    if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.webContents.send('status-change', { message, type, progress });
    }
});

// Helper function to show notifications
const showNotification = (title, body) => {
    new Notification({ title, body }).show();
}

const showLogInfo = (message, type, progress = null) => {
    splashLog(splashWindow, message, type, log, progress);
};

const showMainLogInfo = (message, type, progress = null) => {
    mainLog(mainWindow, message, type, log, progress);
};

// Declare mainCount outside the function to persist its value across calls
let mainCount = 0; 

// updates the isPhpServerRunning value 
const updateStatus = (status) => {
    if (status) {
        isPhpServerRunning = status;
        // Ensure createMainWindow is called only once
        if (mainCount++ === 0) {
            loadScreen();
        }
    }
};

// Load the main application window
const loadScreen = () => {
    if (isPhpServerRunning) {
        showLogInfo('Success open main', 'info');
        createMainWindow(); // Proceed to open the main window
    } else {
        // Retry PHP check if server is still not running
        showLogInfo('Recheck phpCheck', 'warn');
        phpCheck(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo);
    }
}; 

// Load the application splash screen
function createSplashWindow() {
    // clearLogFile();
    showLogInfo('Create Splash Page...', 'log');

    // Start PHP-server check
    showLogInfo('Starting PHP server...', 'log');
    phpCheck(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo); 

    // Updates check info 
    setupAutoUpdater(showNotification, log, isDev, showLogInfo)

    // get App info & notify 
    const { title } = getAppDetails();
    showLogInfo(`${title} loading, Please Wait...`, 'info')

    // create splash window 
    splashWindow = createWindow({
        width:          840,
        height:         600,
        frame:          true,
        transparent:    true,
        alwaysOnTop:    false,
        resizable:      true,
        isDev,
        webPreferences: {
            preload:            path.join(__dirname, 'splashUtilities/preload.js'),
            contextIsolation:   true,
            nodeIntegration:    false,
            javascript: true, // Ensures JavaScript is enabled
        },
    });

    // load splash window 
    splashWindow.loadFile('splashUtilities/splash.html');

    // Send app version to splash window
    splashWindow.webContents.on('did-finish-load', () => {
        splashWindow.webContents.send('set-app-version', app.getVersion());
    });

    // center splash window
    splashWindow.center();

    //send logs
    showLogInfo('Done Splash Window...', 'log');
}

// Function to create the main window
function createMainWindow() {
    if (!isDev) {
        // Ensure cacheFolderPath file exists
        if (!fs.existsSync(cacheFolderPath)) {
            fs.mkdirSync(path.dirname(cacheFolderPath), { recursive: true });
            showLogInfo(`CACHE file created at ${cacheFolderPath}🔔`, 'info');
        } else {
            showLogInfo(`CACHE file exists at ${cacheFolderPath}✔️`, 'info');
        }
    }

    // get App info & notify 
    const { title } = getAppDetails();
    showLogInfo(`${title} Launching!✔️`, 'log');

    // options dialog to open the mainWindow
    openUrlDialog('http://localhost:8000', '10000', title, mainWindow, splashWindow, isDev, dialog, showLogInfo, shell, app, fs)
}

// App initialization and configuration
// Check if the app instance is already running, if not, quit the app and show error log
if (!singleInstanceLock) {
    app.quit(); // Exit the app if another instance is already running
    showLogInfo('App Already Running', 'error'); // Log the error message
} else {
    // If this is the first instance, handle the second instance logic
    app.on('second-instance', () => {
        // If the main window is minimized, restore it
        if (mainWindow?.isMinimized()) mainWindow.restore();
        // Focus the main window
        mainWindow?.focus();
    });

    // When the app is ready, set up the splash window and log the app details
    app.whenReady().then(() => {
        // Log the application version
        showLogInfo(`Application Version: ${app.getVersion()}`, 'info');

        if (isDev) {
            // Log the paths for PHP folder and WWW folder
            showLogInfo(phpFolderPath, 'info');
            showLogInfo(wwwFolderPath, 'info');
        }

        // Create the splash window
        createSplashWindow();

        // Handle activation (macOS behavior), prevent splash window duplication
        app.on('activate', () => {
            // If no other windows are open, create a new splash window
            if (BrowserWindow.getAllWindows().length === 0) createSplashWindow();
        });
    });

    // When all windows are closed, quit the app
    app.on('window-all-closed', () => app.quit());
}

app.on("quit", () => {
    app.quit();
});