// load the dependencies 
const { 
    app, 
    BrowserWindow, 
    Notification, 
    ipcMain,
    shell,
    dialog,
    autoUpdater
}                                           = require('electron');
const path                                  = require('path');
const log                                   = require('electron-log');
const fs                                    = require('fs');

// Determine if the app is in production or development
// const isDev                                 = !app.isPackaged;
const isDev = process.env.NODE_ENV === "development";

// load in the autoUpdater listener file from utilities 
// const { setupAutoUpdater }                 = require('./utilities/autoUpdater');

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
    openUrlDialog
}                                           = require('./utilities/windowUtils');

// create the windows 
let mainWindow;
let splashWindow;

// Check for more than one instance of the app running
const singleInstanceLock                   = app.requestSingleInstanceLock();

let isPhpServerRunning                     = false; // State variable to track server status

// file paths 
const { phpFolderPath, wwwFolderPath, cacheFolderPath, dbFolderPath, backupFolder, versionFile } = require("./utilities/paths");

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
    if (splashWindow) {
        splashLog(splashWindow, message, type, log, progress);
    } else {
        mainLog(mainWindow, message, type, log, progress);
    }

    if (!isDev) {
        console.log(message);
    }
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
        // Updates check info 
        setupAutoUpdater();
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

    showLogInfo(`isDev: ${isDev}`, 'log');
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

function setupAutoUpdater() {
    // GitHub Releases Update Feed
    const server = "https://github.com/waiyaki21/Final-AthoniChama-App/releases/latest/download";
    const feed = `${server}/`;

    showLogInfo("PKAAAAAAAH Checking for updates...", 'log');

    if (!isDev) {
        // Set the update feed URL
        autoUpdater.setFeedURL({ url: feed });

        // Check for updates
        autoUpdater.checkForUpdates();

        autoUpdater.on("checking-for-update", () => {
            showLogInfo("Checking for updates...", 'info');
        });

        autoUpdater.on("update-available", (info) => {
            const nextVersion = info.version;
            showLogInfo(`Update available: Version ${nextVersion}`, 'info');
            showNotification("Update Available", `A new update (Version ${nextVersion}) is available. Downloading now...`);
        });

        autoUpdater.on("update-not-available", (info) => {
            showLogInfo("No updates available.", 'info');
            // Uncomment if you want to notify the user
            showNotification("No Update", "App is already on the latest version.");
        });

        autoUpdater.on("download-progress", (progressTrack) => {
            const percent = Math.round(progressTrack.percent);
            const transferredMB = (progressTrack.transferred / (1024 * 1024)).toFixed(2);
            const totalMB = (progressTrack.total / (1024 * 1024)).toFixed(2);

            const progressMsg = `Downloaded ${percent}% (${transferredMB} MB / ${totalMB} MB)`;

            if (percent > 0 && percent % 10 === 0) {
                showLogInfo(progressMsg, 'info');
            }

            if (percent > 0 && percent < 100 && percent % 25 === 0) {
                showNotification("Download Progress", progressMsg);
            }
        });

        autoUpdater.on("update-downloaded", () => {
            showLogInfo(`Update downloaded`, 'info');

            // Save current version before quitting
            versionSave(showLogInfo);

            const dialogOpts = {
                type: 'info',
                buttons: ['Restart', 'Later'],
                title: 'Application Update',
                message: 'A new version has been downloaded.',
                detail: 'Restart the application to apply the updates.'
            };

            dialog.showMessageBox(dialogOpts).then((returnValue) => {
                if (returnValue.response === 0) {
                    // update DB 
                    createBackupOfDatabase(showLogInfo);
                    showNotification("Update Installing", `Restarting to apply the update.`);
                    autoUpdater.quitAndInstall();
                }
            });
        });

        autoUpdater.on("error", (err) => {
            showLogInfo(`Update error: ${err}`, 'error');
            showNotification("Update Error", `An error occurred: ${err.message}`);
        });
    } else {
        showLogInfo("PKUUUUUUUH App in Dev: Updates Not Available...", 'info');
        showLogInfo(`App in Dev: Updates Not Available!`, 'info');
        showNotification(`Updates Unavailable`, `App is currently in develepment, No Updates Available.`);
    }
}

function versionSave() {
    if (!fs.existsSync(versionFile)) {
        // If the file doesn't exist, create it
        fs.writeFileSync(versionFile, JSON.stringify({ version: "0.0.0" }), "utf8");
        showLogInfo(`Created version file: ${versionFile}🎢`, 'info');
    } else {
        // If the file exists, check its contents (optional)
        const data = fs.readFileSync(versionFile, "utf8");
        const currentContent = JSON.parse(data);

        // Optionally, check if you want to update the version
        if (currentContent.version !== "1.0.0") {
            currentContent.version = "1.0.0";
            fs.writeFileSync(versionFile, JSON.stringify(currentContent), "utf8");
            showLogInfo(`Updated version file: ${versionFile}🎢`, 'info');
        }
    }
}

// Function to create a backup of the database file
function createBackupOfDatabase() {
    // Ensure the backups folder exists
    if (!fs.existsSync(backupFolder)) {
        fs.mkdirSync(backupFolder, { recursive: true });
    } else {
        // Read all files in the backup folder
        fs.readdir(backupFolder, (err, files) => {
            if (err) {
                showLogInfo(`Error reading backup folder❌: ${err}`, 'error');
                return;
            }

            files.forEach((file) => {
                const filePath = path.join(backupFolder, file);

                // Check if it's a file (not a folder)
                if (fs.lstatSync(filePath).isFile()) {
                    fs.unlinkSync(filePath, ""); // Clear file contents
                    showLogInfo(`Cleared contents of ${filePath}🎢`, 'info');
                }
            });

            if (files.length === 0) {
                showLogInfo(`No files found in backup folder.🎢`, 'info');
            }
        });
    }

    const backupFilePath = path.join(backupFolder, `database_backup_${Date.now()}.sqlite`);

    // Ensure .env file exists
    if (!fs.existsSync(dbFolderPath)) {
        showLogInfo(`db file does not exist🎢`, 'info');
    } else {
        showLogInfo(`db file does exists🎢`, 'info');
    }

    // Check if the database file exists and copy it
    fs.access(dbFolderPath, fs.constants.F_OK, (err) => {
        if (err) {
            showLogInfo(`Database file does not exist, cannot create backup🎢`, 'info');
            return;
        }

        // Create a duplicate of the database file
        fs.copyFile(dbFolderPath, backupFilePath, (err) => {
            if (err) {
                showLogInfo(`Error creating backup: ${err}🎢`, 'error');
                return;
            }

            showLogInfo(`Backup created successfully at ${backupFilePath}`);
            showLogInfo(`Database backup created successfully🎢`, 'info');
        });
    });
}

// Function to replace the current database with the backup after update
function restoreDatabaseFromBackup(showLogInfo) {
    const backupFiles = fs.readdirSync(backupFolder).filter(file => file.startsWith('database_backup_'));

    if (backupFiles.length > 0) {
        const latestBackup = path.join(backupFolder, backupFiles[backupFiles.length - 1]); // Use the latest backup file

        fs.access(latestBackup, fs.constants.F_OK, (err) => {
            if (err) {
                showLogInfo(`Backup file does not exist, cannot restore database🎢`, 'info');
                return;
            }

            // Replace the current database file with the backup
            fs.copyFile(latestBackup, dbFolderPath, (err) => {
                if (err) {
                    showLogInfo(`Error restoring backup❌: ${err}`, 'info');
                    return;
                }

                showLogInfo(`Database restored successfully from backup: ${latestBackup}🎢`, 'info');
                showLogInfo('Database restored successfully from backup', 'info');
            });
        });
    } else {
        showLogInfo(`No backup file found to restore🎢`, 'info');
    }
}