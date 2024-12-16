
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

// Function to log messages and update the splash window
const splashLog = (splashWindow, message, type, log) => {
    // Send the message to the splash window with the type for color-based display
    if (splashWindow) {
        splashWindow.webContents.send('status-change', { message, type });
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
        default:
            log.log(message); // Default to standard log if type is unknown
            break;
    }
};

// Export both functions
module.exports = {
    initializeLogs,
    splashLog
};