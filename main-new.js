const { app, BrowserWindow, Notification, autoUpdater, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const log = require('electron-log');

let phpServerInstance = null;
let phpServerCMD = null;
let mainWindow;

// Determine if the app is in development or production
const isDev = !app.isPackaged;

// Logging configuration
log.transports.file.resolvePathFn = () => {
    const appData = isDev ? path.resolve(__dirname, 'logs/main.log') : path.join(app.getPath('userData'), 'logs/main.log');
    return appData;
};

log.log(`Application Version: ${app.getVersion()}`);

// Get PHP and public folder paths
const getPhpBinaryPath = () => path.join(__dirname, 'php', 'php.exe');
const getWwwBinaryPath = () => path.join(__dirname, 'www');
const phpBinaryPath = getPhpBinaryPath();
const wwwBinaryPath = getWwwBinaryPath();

// Server configuration
const port = 8000, host = '127.0.0.1', serverUrl = `http://${host}:${port}`;

// PHP Server Functions
function startPhpServer_CLI() {
    return new Promise((resolve, reject) => {
        const cmd = exec(`php -S ${host}:${port} -t "${path.join(wwwBinaryPath, 'public')}"`, (err, stdout, stderr) => {
            if (err) {
                log.error(`CMD Error: ${err.message}`);
                return reject(err);
            }
            console.log(stdout);
            console.error(stderr);
            resolve(cmd);
        });
    });
}

async function startPhpServer() {
    try {
        phpServerCMD = await startPhpServer_CLI();
        log.log('PHP server started.');
    } catch {
        await startPhpServer_Node();
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
        console.log(`Node-PHP server started at ${phpServerInstance.url}`);
    } catch (err) {
        log.error('Error starting PHP server with php-server package:', err);
    }
}

function stopPhpServer() {
    if (phpServerCMD) {
        phpServerCMD.kill();
        console.log('CLI-based PHP server stopped.');
    }
    if (phpServerInstance) {
        phpServerInstance.close();
        console.log('Node-based PHP server stopped.');
    }
}

// Check & Start
if (!app.requestSingleInstanceLock()) {
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

    function createWindow() {
        // Start PHP server
        startPhpServer();

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
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
            },
            title: title, // Set the title
            icon: iconPath
        });

        mainWindow.loadURL(serverUrl)

        mainWindow.webContents.once('dom-ready', function () {
            mainWindow.show()
        });

        // Emitted when the window is closed.
        mainWindow.on('closed', function () {
            stopPhpServer();
            if (autoUpdater) autoUpdater.removeAllListeners();  // Remove any existing listeners
            app.quit();
            mainWindow = null;
        });
    }

    // When Electron is ready to create the window
    app.whenReady().then(() => {
        createWindow();

        app.on('activate', () => {
            // Configure auto-updater
            autoUpdater.setFeedURL(feedURL);

            if (!isDev) {
                autoUpdater.checkForUpdates();
            }

            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });

    // Quit when all windows are closed
    app.on('window-all-closed', app.quit);
}

// Auto-updater notifications
function showNotification(title, body) {
    new Notification({ title, body }).show();
}

autoUpdater.on('checking-for-update', () => { log.info('Checking for updates...'); showNotification('Checking for updates...', `Checking for updates`); });
autoUpdater.on('update-available', info => showNotification('Update Available', `Version ${info.version} is available.`));
autoUpdater.on('update-not-available', () => log.info('No updates available.'));
autoUpdater.on('download-progress', progress => log.info(`Download Progress: ${Math.round(progress.percent)}%`));
autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: 'A new update has been downloaded. Restart the application to apply it.',
    }).then(response => {
        if (response.response === 0) autoUpdater.quitAndInstall();
    });
});
autoUpdater.on('error', err => log.error('Update error:', err));