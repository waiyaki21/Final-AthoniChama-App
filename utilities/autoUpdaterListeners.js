const { autoUpdater, dialog }   = require('electron');

function initializeAutoUpdaterListeners(showNotification, log) {
    autoUpdater.on("checking-for-update", () => {
        log.info("Checking for updates...");
    });

    autoUpdater.on("update-available", (info) => {
        const nextVersion = info.version;
        log.info(`Update available: Version ${nextVersion}`);
        showNotification("Update Available", `A new update (Version ${nextVersion}) is available. Downloading now...`);
    });

    autoUpdater.on("update-not-available", (info) => {
        log.info("No updates available.");
        // Uncomment if you want to notify the user
        showNotification("No Update", "App is already on the latest version.");
    });

    autoUpdater.on("download-progress", (progressTrack) => {
        const percent = Math.round(progressTrack.percent);
        const transferredMB = (progressTrack.transferred / (1024 * 1024)).toFixed(2);
        const totalMB = (progressTrack.total / (1024 * 1024)).toFixed(2);

        const progressMsg = `Downloaded ${percent}% (${transferredMB} MB / ${totalMB} MB)`;
        log.info(progressMsg);

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
            message: 'A new version has been downloaded.',
            detail: 'Restart the application to apply the updates.'
        };

        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) {
                showNotification("Update Installing", `Restarting to apply the update.`);
                autoUpdater.quitAndInstall();
            }
        });
    });

    autoUpdater.on("error", (err) => {
        log.error("Update error:", err);
        showNotification("Update Error", `An error occurred: ${err.message}`);
    });
}

module.exports = initializeAutoUpdaterListeners;
