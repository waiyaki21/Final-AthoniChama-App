// ./Utilities/windowUtils.js

const path = require('path');
const { app, BrowserWindow } = require('electron');
const dotenv = require('dotenv');

// Function to capitalize the first letter of each word in a string
function capitalize(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Function to retrieve application details (name, version, icon path)
function getAppDetails() {
    const appName       = capitalize(app.getName());
    const appVersion    = app.getVersion();
    return {
        title: `${appName} v${appVersion}`,
        iconPath: path.join(__dirname, '../icons/chama_icon.ico') // Adjust this path as needed
    };
}

// Function to create a new BrowserWindow with default options
function createWindow(options) {
    const { title, iconPath } = getAppDetails();
    const { isDev } = options;  // Get isDev from options
    const defaultOptions = {
        title,
        icon: iconPath,
        webPreferences: {
            nodeIntegration: false, // Required for security
            contextIsolation: true, // Required for modern Electron versions
            javascript: true, // Ensures JavaScript is enabled
        },
        autoHideMenuBar: !isDev
    };
    return new BrowserWindow({ ...defaultOptions, ...options });
}

const openUrlDialog = (url, countdown, title, mainWindow, splashWindow, isDev, dialog, showLogInfo, shell, app, fs) => {
    let openedUrls = new Set(); // Keep track of opened URLs
    let option1 = capitalize('Open in Browser');
    let option2 = capitalize('Open in New Window');
    let option3 = capitalize('Close App');
    let header = capitalize(`${title} Defaults`);

    const options = {
        type: 'question',
        buttons: [option1, option2, option3],
        defaultId: 0,
        title: `${header}`,
        message: `Set Defaults, Open in Browser or a Separate window? Browser Default will be set in 10 seconds`,
    };

    // Check APP_MODE in the .env file before opening the dialog
    dotenv.config();
    const appMode = process.env.APP_MODE;
    showLogInfo(`APP MODE ${appMode}`, 'log')

    // If APP_MODE is 'browser', open URL in the browser directly
    if (!appMode || appMode.trim() === '') {
        let timeout;

        const timeoutPromise = new Promise((resolve) => {
            timeout = setTimeout(() => {
                resolve({ response: 0 }); // Default response after timeout
            }, countdown); // Timeout after specified countdown
        });

        const dialogPromise = dialog.showMessageBox(mainWindow, options);

        Promise.race([timeoutPromise, dialogPromise]).then((result) => {
            // Clear the timeout when we get the result
            clearTimeout(timeout);

            if (result.response === 0) {
                // open in browser 
                openBrowser(showLogInfo, openedUrls, url, shell, isDev, splashWindow, fs);
            } else if (result.response === 1) {
                // open in window 
                openWindow(mainWindow, isDev, url, splashWindow, app, showLogInfo, fs);
            } else if (result.response === 2) {
                // close window
                closeApp(showLogInfo, app);
            }
        });
    } else {
        if (appMode === 'browser') {
            // open in browser 
            openBrowser(showLogInfo, openedUrls, url, shell, isDev, splashWindow, fs);
            return;
        } else {
            // open in window 
            openWindow(mainWindow, isDev, url, splashWindow, app, showLogInfo, fs);
            return;
        }
    }
};

function openBrowser(showLogInfo, openedUrls, url, shell, isDev, splashWindow, fs) {
    // Handle default action: Open URL in browser
    showLogInfo('App Opening in browser ✔️', 'log');

    if (openedUrls.has(url)) {
        showLogInfo(`The URL ${url} is already open.`, `log`);
        return;
    }

    shell.openExternal(url)
        .then(() => {
            let time = isDev ? 5000 : 2500;
            setTimeout(() => {
                if (splashWindow && !splashWindow.isDestroyed()) {
                    splashWindow.close();
                }
            }, time);
            showLogInfo(`Opened ${url} in the default browser.`, `log`);
            openedUrls.add(url);

            // Update APP_MODE to 'browser' in the .env file
            updateAppMode('browser', fs, isDev, showLogInfo);
        })
        .catch((err) => {
            showLogInfo(`Failed to open the link: ${err}`, 'error');
        });
}

function openWindow(mainWindow, isDev, url, splashWindow, app, showLogInfo, fs) {
    // Handle "Yes" action: Open the main window
    mainWindow = createWindow({
        width: 1280,
        height: 800,
        show: false,
        isDev,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL(url);

    mainWindow.once('ready-to-show', () => {
        setTimeout(() => {
            if (splashWindow && !splashWindow.isDestroyed()) {
                splashWindow.close();
            }
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.show();
            }
        }, 1000);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit();
    });

    showLogInfo('Opening Main Window ✔️', 'log');

    // Update APP_MODE to 'window' in the .env file
    updateAppMode('window', fs, isDev, showLogInfo);
}

function closeApp(showLogInfo, app) {
    // Handle "Cancel" action
    showLogInfo(`Closing App`, `log`);
    app.quit();
}

// Function to update the APP_MODE in the .env file
const updateAppMode = (mode, fs, isDev, showLogInfo) => {
    const envPath = isDev
        ? path.join(__dirname, '../.env')
        : path.join(__dirname, 'app', '.env');

    // const envPath = path.resolve(__dirname, '.env');
    dotenv.config({ path: envPath });

    // Update the APP_MODE in the process environment
    process.env.APP_MODE = mode;

    // Read current .env file contents
    let envContent = fs.readFileSync(envPath, 'utf-8');

    // Regex to match APP_MODE line
    const regex = /APP_MODE\s*=\s*[^ \n]+/;

    // If APP_MODE exists, replace its value, otherwise append it
    if (regex.test(envContent)) {
        // Replace the existing APP_MODE line with the new mode value
        envContent = envContent.replace(regex, `APP_MODE    = ${mode}`);
    } else {
        // Append APP_MODE if it doesn't exist
        envContent += `\nAPP_MODE    = ${mode}\n`;
    }

    // Write the updated content back to the .env file
    fs.writeFileSync(envPath, envContent);

    showLogInfo(`APP_MODE set to ${mode}`, 'log');
};

module.exports = { createWindow, getAppDetails, openUrlDialog };