const {app, BrowserWindow, Notification } = require('electron')
const path              = require('path')

const { autoUpdater }   = require("electron-updater")
const log               = require('electron-log')

app.on('ready', () => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
})

// Requiring the node-php-server
let phpServer = require('node-php-server');

// Setting the port and the host ip
const port = 8000, host = '127.0.0.1';
const serverUrl = `http://${host}:${port}`;

// Determine if the app is in production or development
const isDev = !app.isPackaged;

// Set up logging with dynamic path to user data directory
log.transports.file.resolvePathFn = () => {
    if (isDev) {
        // Development path
        return path.join('C:/Users/Kelvin Waiyaki/Desktop/Work Projects/Final AthoniChama-App', '/logs/main.log');
    } else {
        // Production path in Local\Programs
        return path.join(
            app.getPath('appData').replace('Roaming', 'Local/Programs'),
            `${app.getName()}/logs/main.log`
        );
    }
};

log.log("Application Version: " + app.getVersion())

let mainWindow

function capitalize(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function createWindow() {
    // get title 
    const appName = app.getName();
    const appVersion = app.getVersion();
    const title = `${capitalize(appName)} v${appVersion}`; // Combine name and version

    // Create a PHP Server
    phpServer.createServer({
        port: port,
        hostname: host,
        base: `${__dirname}/www/public`,
        keepalive: false,
        open: false,
        bin: `${__dirname}/php/php.exe`,
        router: __dirname + '/www/server.php'
    });

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 720,
        show: false,
        autoHideMenuBar: true,
        title: title // Set the title
    });

    mainWindow.loadURL(serverUrl)

    mainWindow.webContents.once('dom-ready', function () {
        mainWindow.show()
        mainWindow.maximize();
        // mainWindow.webContents.openDevTools()
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        phpServer.close();
        mainWindow = null;
    })
}

// Helper function to show notifications
function showNotification(title, body) {
    new Notification({ title, body }).show();
}

/*
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows
 * Some APIs can only be used after this event occurs
 * app.on('ready', createWindow) // <== this is extra so commented, enabling this can show 2 windows..
 */

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        // PHP SERVER QUIT
        phpServer.close();
        app.quit();
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
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
    
    // Display a notification to inform the user that the update is ready
    showNotification("Update Ready", `The Update has been downloaded. Restart the app to apply the update.`);
});

autoUpdater.on("error", (err) => {
    log.error("Update error:", err);
    showNotification("Update Error", `An error occurred: ${err.message}`);
});

autoUpdater.on("error", (err) => {
    log.info("Update Error " + err);
});