// load the dependencies 
const { 
    app, 
    BrowserWindow, 
    Notification, 
    ipcMain 
}                                           = require('electron');
const path                                  = require('path');
let phpServer                               = require('node-php-server');
const log                                   = require('electron-log');

// Determine if the app is in production or development
const isDev                                 = !app.isPackaged;

// load in the autoUpdater listener file from utilities 
const initializeAutoUpdater                 = require('./utilities/autoUpdaterListeners');

// load in the log listener file from utilities 
const { 
    initializeLogs, 
    splashLog
}                                           = require('./utilities/logsListeners');
initializeLogs(log, isDev, path, app);

const { 
    createWindow, 
    getAppDetails 
}                                           = require('./utilities/windowUtils');

// create the windows 
let mainWindow;
let splashWindow;

// Check for more than one instance of the app running
const singleInstanceLock                   = app.requestSingleInstanceLock();

let isPhpServerRunning                     = false; // State variable to track server status

const phpFolderPath = isDev
    ? path.join(__dirname, 'php', 'php.exe') // Development
    : path.join(process.resourcesPath, 'app' ,'php', 'php.exe'); // Production

const wwwFolderPath = isDev
    ? path.join(__dirname, 'www', 'public') // Development
    : path.join(process.resourcesPath, 'app' ,'www', 'public'); // Production

const { phpCheck } = require(isDev
    ? './utilities/phpInfo' // Development
    : path.join(process.resourcesPath, 'app', 'utilities', 'phpInfo')); // Production

// Ensure the ipcMain listener is registered only once
ipcMain.on('update-status', (event, { message, type }) => {
    if (splashWindow) {
        splashWindow.webContents.send('status-change', { message, type });
    }
});

// Helper function to show notifications
const showNotification = (title, body) => {
    new Notification({ title, body }).show();
}

const showLogInfo = (message, type) => {
    splashLog(splashWindow, message, type, log);
}

// updates the isPhpServerRunning value 
const updateStatus = (status) => {
    isPhpServerRunning = status;
};

// Load the main application window
const loadScreen = () => {
    if (isPhpServerRunning) {
        showLogInfo('Success open main', 'info');
        // Proceed to open the main window and close splash screen
        createMainWindow();
    } else {
        // Retry PHP check if server is still not running
        showLogInfo('Recheck phpCheck', 'warn');
        phpCheck(loadScreen, wwwFolderPath, phpFolderPath, log, phpServer, updateStatus, showNotification, showLogInfo);
    }
};

// Load the application splash screen
function createSplashWindow() {
    // updates check info 
    showLogInfo('Searching for updates...', 'info');
    initializeAutoUpdater(showNotification, log, isDev, showLogInfo);

    // Start PHP-server check
    showLogInfo('Starting PHP server...', 'log');
    phpCheck(loadScreen, wwwFolderPath, phpFolderPath, log, phpServer, updateStatus, showNotification, showLogInfo); 

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
        },
    });

    // load splash window 
    splashWindow.loadFile('splashUtilities/splash.html');

    // center splash window
    splashWindow.center();
}

// Function to create the main window
function createMainWindow() {
    // get App info & notify 
    const { title } = getAppDetails();
    showLogInfo(`${title} Launching!`, 'log');

    // Create a new browser window for the main application
    mainWindow = createWindow({
        width: 1280,
        height: 800,
        show: false, // Do not show immediately, only after content is loaded
        isDev,
        webPreferences: {
            nodeIntegration: true, // Enable node integration for this window
            contextIsolation: false // Allow node.js integration in the renderer process
        }
    });

    // Load the main content using URL
    mainWindow.loadURL('http://localhost:8000');

    mainWindow.once('ready-to-show', () => {
        setTimeout(() => {
            // if splash window is still open close it 
            if (splashWindow) {
                splashWindow.close();
            }
            // Show window after content is loaded
            mainWindow.show();
        }, 2000);
    });

    // Handle window close event
    mainWindow.on('closed', () => {
        mainWindow = null; // Dereference the window object when closed
        app.quit();
    });
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

        // Log the paths for PHP folder and WWW folder
        showLogInfo(phpFolderPath, 'info');
        showLogInfo(wwwFolderPath, 'info');

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

// Handle when all windows are closed
app.on("quit", () => {
    app.quit();
});