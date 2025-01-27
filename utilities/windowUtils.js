// ./Utilities/windowUtils.js

const path = require('path');
const { app, BrowserWindow } = require('electron');

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

module.exports = { capitalize, getAppDetails, createWindow };
