
function initializeLogs(log, isDev, path, app) {
    // Logging configuration
    log.transports.file.resolvePathFn = () => {
        const appData = isDev
            ? path.resolve(__dirname, '../logs/main.log') // Dev mode path
            : path.join(
                app.getPath('appData').replace('Roaming', 'Local'), `${app.getName()}/logs/main.log`
            ); // Production mode path

        return appData;
    };
    // END LOGS 
}

// Function to clear the main.log file
function clearLogFile() {
    const logFilePath = log.transports.file.resolvePathFn();

    // Check if the file exists
    fs.access(logFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('Log file does not exist:', err);
            return;
        }

        // Clear the log file by overwriting with an empty string
        fs.writeFile(logFilePath, '', (err) => {
            if (err) {
                console.error('Error clearing the log file:', err);
            } else {
                console.log('Log file cleared successfully');
            }
        });
    });
}

// Function to log messages and update the splash window
const splashLog = (splashWindow, message, type, log, progress = null) => {
    // Ensure the splash window exists and is not destroyed and Send the message to the splash window with the type and progress for color-based display
    if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.webContents.send('status-change', { message, type, progress });
    }

    // Log the message based on the type
    switch (type) {
        case 'log':
            log.log(message); // Green for general log
            break;
        case 'info':
            log.info(message); // Blue for info
            break;
        case 'warn':
            log.warn(message); // Orange for warnings
            break;
        case 'error':
            log.error(message); // Red for errors
            break;
        case 'download':
            if (progress !== null) {
                log.log(message); // Include progress in log
            } else {
                log.log(message); // Log message without progress if not provided
            }
            break;
        default:
            log.log(message); // Default to standard log if type is unknown
            break;
    }
};

// Function to log messages and update the main window
const mainLog = (mainWindow, message, type, log, progress = null) => {
    // Ensure the main window exists and is not destroyed and Send the message to the main window with the type and progress for color-based display
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('status-change', { message, type, progress });
    }

    // Log the message based on the type
    switch (type) {
        case 'log':
            log.log(message); // Green for general log
            break;
        case 'info':
            log.info(message); // Blue for info
            break;
        case 'warn':
            log.warn(message); // Orange for warnings
            break;
        case 'error':
            log.error(message); // Red for errors
            break;
        case 'download':
            if (progress !== null) {
                log.log(message); // Include progress in log
            } else {
                log.log(message); // Log message without progress if not provided
            }
            break;
        default:
            log.log(message); // Default to standard log if type is unknown
            break;
    }
};


// Export both functions
module.exports = {
    initializeLogs,
    splashLog,
    mainLog,
    clearLogFile
};