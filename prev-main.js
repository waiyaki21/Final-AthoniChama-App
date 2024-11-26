const { app, BrowserWindow, Notification, autoUpdater, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const log = require('electron-log');

// Requiring the node-php-server
let phpServer = require('node-php-server');

let phpServerInstance = null; // Global reference for the PHP server
let phpServerCMD = null; // Global reference for the CMD process
let mainWindow;
let splashWindow;
var filesCheck = false;

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
const getPhpBinaryPath = () => path.join(__dirname, 'php', 'php.exe');
const getWwwBinaryPath = () => path.join(__dirname, 'www');
const phpBinaryPath = getPhpBinaryPath();
const wwwBinaryPath = getWwwBinaryPath();

// Setting the Server port and the host ip
const port = 8000, host = '127.0.0.1';
const serverUrl = `http://${host}:${port}`;

// PHP Server Functions
function startPhpServer() {
    // Start PHP server
    phpServerCMD = exec('php -S 127.0.0.1:8000 -t www/public', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error starting PHP server: ${err}`);
            log.error('Error starting PHP server with php-cmd', err);
            showNotification(`CMD Server Error`, `Error starting PHP server with php-exec package: ${err}`);
        }
        console.log(stdout);
        console.error(stderr);
        log.log('PHP server started.');
        loadScreen();
    });
}

async function startPhpServer_Node() {
    try {
        phpServer.createServer({
            port: port,
            hostname: host,
            base: `${__dirname}/www/public`,
            keepalive: false,
            open: false,
            bin: `${__dirname}/php/php.exe`,
            router: __dirname + '/www/server.php'
        });
        log.log(`Node-PHP server started at ${serverUrl}`);
        loadScreen();
    } catch (err) {
        log.error('Error starting PHP server with php-server package:', err);

        showNotification(`Server Error`, `Error starting PHP server with php-server package: ${err}`);

        startPhpServer();
    }
}

function loadScreen() {
    setTimeout(() => {
        // Close splash screen and open main window after the server starts
        if (splashWindow) splashWindow.close();
        createMainWindow();
    }, 3500);
}

function stopPHPServer() {
    if (phpServerCMD) {
        phpServerCMD.kill();
        log.log('CLI-based PHP server stopped.');
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

    function createSplashWindow(bool) {
        if (bool) {
            // Start PHP server
            startPhpServer_Node();
        } else {
            // download files
            downloadFiles();
        }

        // get title 
        const appName = app.getName();
        const appVersion = app.getVersion();
        const title = `${capitalize(appName)} v${appVersion}`; // Combine name and version

        showNotification(`${title} Loading...`, `${title} loading, Please Wait...`);

        splashWindow = new BrowserWindow({
            width: 840,
            height: 600,
            frame: true,
            transparent: true, // Optional: makes the background of splash page transparent
            alwaysOnTop: true,
            resizable: true
        });

        splashWindow.loadFile('splash.html');
    }

    function createMainWindow() {
        // Define the path to your icon file
        const iconPath = path.join(__dirname, 'icons/chama_icon.ico'); // Adjust this path

        // get title 
        const appName = app.getName();
        const appVersion = app.getVersion();
        const title = `${capitalize(appName)} v${appVersion}`; // Combine name and version

        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 720,
            show: false,
            autoHideMenuBar: !isDev ? true : false,
            webPreferences: {
                nodeIntegration: true,
            },
            title: title, // Set the title
            icon: iconPath
        });

        mainWindow.loadURL(serverUrl)

        mainWindow.webContents.once('dom-ready', function () {
            mainWindow.show()
            mainWindow.maximize();
        });

        // Emitted when the window is closed.
        mainWindow.on('closed', function () {
            closeAll();
            app.quit();
            mainWindow = null;
        });
    }

    // When Electron is ready to create the window
    app.whenReady().then(() => {
        // check for files 
        checkPhpFolder();

        app.on('activate', () => {
            // Configure auto-updater
            autoUpdater.setFeedURL('https://github.com/waiyaki21/Final-AthoniChama-App/releases/latest');
            if (!isDev) { autoUpdater.checkForUpdates() }
            if (BrowserWindow.getAllWindows().length === 0) { createSplashWindow(false) }
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
    closeAll();
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

// check if files exist if not download 
const axios = require('axios');
const fs = require('fs');

const repoOwner = 'waiyaki21';
const repoName = 'Final-AthoniChama-App';
const folderPath = 'www';
const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`;

// Get the path to the 'php' && 'vendor' folder in the project root
const phpFolderPath = path.join(__dirname, 'php');

// Function to check if the 'php' folder exists
function checkPhpFolder() {
    if (fs.existsSync(phpFolderPath)) {
        console.log("'php' folder exists in the project root.");
        // Proceed with your logic (e.g., create splash window, etc.)
        filesCheck = true;
        createSplashWindow(filesCheck);
    } else {
        console.log("'php' folder does not exist. Performing additional actions...");
        // If folder doesn't exist, download files, etc.
        filesCheck = false;
        createSplashWindow(filesCheck);
    }
}

async function downloadFiles() {
    try {
        const response = await axios.get(apiUrl);
        const files = response.data;

        log.info(files);

        for (let file of files) {
            if (file.type === 'file') {
                const fileResponse = await axios.get(file.download_url, { responseType: 'stream' });
                const filePath = path.join(__dirname, file.name);
                log.info(filePath);
                //         const writer = fs.createWriteStream(filePath);
                //         fileResponse.data.pipe(writer);

                //         writer.on('finish', () => {
                //             console.log(`Downloaded: ${file.name}`);
                //         });

                //         writer.on('error', (err) => {
                //             console.error(`Error downloading file: ${err}`);
                //         });
            }
        }
    } catch (err) {
        console.error('Error fetching files:', err);
    }
}


// ............................... original mainWindow.js before this other one 
const { app, BrowserWindow, Notification, autoUpdater, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const log = require('electron-log');

let phpServerInstance = null; // Global reference for the PHP server
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
const getPhpBinaryPath = () => path.join(__dirname, 'php', 'php.exe');
const getWwwBinaryPath = () => path.join(__dirname, 'www');
const phpBinaryPath = getPhpBinaryPath();
const wwwBinaryPath = getWwwBinaryPath();

// Setting the Server port and the host ip
const port = 8000, host = '127.0.0.1';
const serverUrl = `http://${host}:${port}`;

// PHP Server Functions
function startPhpServer_CLI() {
    return new Promise((resolve, reject) => {
        const cmd = exec(`php -S ${host}:${port} -t "${path.join(wwwBinaryPath, 'public')}"`, (err, stdout, stderr) => {
            if (err) {
                log.error(`CMD Error: ${err.message}`);
                return reject(err);
            }
            log.log(stdout);
            log.error(stderr);
            resolve(cmd);
        });
    });
}

async function startPhpServer() {
    try {
        phpServerCMD = await startPhpServer_CLI();
        log.log('PHP server started.');
        loadScreen();
    } catch {
        log.error('Error starting PHP server with php-cmd', err);

        showNotification(`CMD Server Error`, `Error starting PHP server with php-exec package: ${err}`);
    }
}

async function startPhpServer_Node() {
    try {
        const phpServer = (await import('php-server')).default;
        phpServerInstance = await phpServer({
            port,
            hostname: host,
            base: path.join(wwwBinaryPath, 'public'),
            bin: phpBinaryPath,
        });
        log.log(`Node-PHP server started at ${phpServerInstance.url}`);
        loadScreen();
    } catch (err) {
        log.error('Error starting PHP server with php-server package:', err);

        showNotification(`Server Error`, `Error starting PHP server with php-server package: ${err}`);

        await startPhpServer();
    }
}

function loadScreen() {
    setTimeout(() => {
        // Close splash screen and open main window after the server starts
        if (splashWindow) splashWindow.close();
        createMainWindow();
    }, 3500);
}

function stopPHPServer() {
    if (phpServerCMD) {
        phpServerCMD.kill();
        log.log('CLI-based PHP server stopped.');
    }
    if (phpServerInstance) {
        // Close the server by killing its internal process
        if (phpServerInstance.process) {
            phpServerInstance.process.kill();
            console.log('Node-based PHP server stopped.');
        }
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

    function createSplashWindow() {
        // Start PHP server
        startPhpServer_Node();

        // get title 
        const appName = app.getName();
        const appVersion = app.getVersion();
        const title = `${capitalize(appName)} v${appVersion}`; // Combine name and version

        showNotification(`${title} Loading...`, `${title} loading, Please Wait...`);

        splashWindow = new BrowserWindow({
            width: 840,
            height: 600,
            frame: true,
            transparent: true, // Optional: makes the background of splash page transparent
            alwaysOnTop: true,
            resizable: true
        });

        splashWindow.loadFile('splash.html');
    }

    function createMainWindow() {
        // Define the path to your icon file
        const iconPath = path.join(__dirname, 'icons/chama_icon.ico'); // Adjust this path

        // get title 
        const appName = app.getName();
        const appVersion = app.getVersion();
        const title = `${capitalize(appName)} v${appVersion}`; // Combine name and version

        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 720,
            show: false,
            autoHideMenuBar: !isDev ? true : false,
            webPreferences: {
                nodeIntegration: true,
            },
            title: title, // Set the title
            icon: iconPath
        });

        mainWindow.loadURL(serverUrl)

        mainWindow.webContents.once('dom-ready', function () {
            mainWindow.show()
            mainWindow.maximize();
        });

        // Emitted when the window is closed.
        mainWindow.on('closed', function () {
            closeAll();
            app.quit();
            mainWindow = null;
        });
    }

    // When Electron is ready to create the window
    app.whenReady().then(() => {
        createSplashWindow();
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
    closeAll();
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