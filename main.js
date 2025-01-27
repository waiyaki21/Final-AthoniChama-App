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
    getAppDetails, 
    capitalize
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
    showLogInfo('Create Splash Page...', 'log');
    // updates check info 
    showLogInfo('Searching for updates...', 'info');
    initializeAutoUpdater(showNotification, log, isDev, showLogInfo);

    // Start PHP-server check
    showLogInfo('Starting PHP server...', 'log');
    phpCheck(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo); 

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
    // get App info & notify 
    const { title } = getAppDetails();
    showLogInfo(`${title} Launching!`, 'log');

    let url    = 'http://localhost:8000';
    let openedUrls = new Set(); // Keep track of opened URLs

    let option1 = capitalize('Open in Browser');
    let option2 = capitalize('Open in New Window');
    let option3 = capitalize('Close App');
    let header  = capitalize(`${title} Options`);

    const options = {
        type: 'question',
        buttons: [option1, option2, option3],
        defaultId: 0,
        title: `${header}`,
        message: `Open ${title} in Browser or a Separate window?`,
    };

    dialog.showMessageBox(mainWindow, options).then(result => {
        let timeout;

        // Set a timeout to select the default option if no response within 3 seconds
        timeout = setTimeout(() => {
            // Check if no option has been selected, simulate default (0) selection
            if (result.response === -1) { // -1 means no selection
                result.response = 0; // Set default to 0
            }
        }, 3000); // 3 seconds timeout

        if (result.response === 0) {
            // Create a new browser window for the main application
            //send logs
            showLogInfo('Done Opening in browser...', 'log');

            // Open the URL in the user's default browser
            if (openedUrls.has(url)) {
                console.log(`The URL ${url} is already open.`);
                return;
            }

            shell.openExternal(url)
                .then(() => {
                    let time = isDev ? 5000 : 2500;
                    setTimeout(() => {
                        // Check if the splashWindow exists and is not destroyed
                        if (splashWindow && !splashWindow.isDestroyed()) {
                            splashWindow.close();
                        }
                    }, time);
                    console.log(`Opened ${url} in the default browser.`);
                    openedUrls.add(url); // Mark this URL as opened
                })
                .catch((err) => {
                    //send logs
                    showLogInfo(`Failed to open the link: ${err}`, 'error');
                });
        } else if (result.response === 1) {
            // Create a new window for the main application
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
            mainWindow.loadURL(url);

            mainWindow.once('ready-to-show', () => {
                setTimeout(() => {
                    // Check if the splashWindow exists and is not destroyed
                    if (splashWindow && !splashWindow.isDestroyed()) {
                        splashWindow.close();
                    }

                    // Check if the mainWindow exists and is not destroyed
                    if (mainWindow && !mainWindow.isDestroyed()) {
                        mainWindow.show();
                    }
                }, 1500);
            });

            // Handle window close event
            mainWindow.on('closed', () => {
                mainWindow = null; // Dereference the window object when closed
                app.quit();
            });

            //send logs
            showLogInfo('Done Main Window...', 'log');
        } else if (result.response === 2) {
            // User clicked "Cancel"
            console.log('User canceled the action');
            // You can close the dialog or take any other action here
            showNotification(`Closing App`, `Closing ${title}!`);
            //close app
            app.quit();
        }
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

// Handle when all windows are closed
app.on("quit", () => {
    app.quit();
});