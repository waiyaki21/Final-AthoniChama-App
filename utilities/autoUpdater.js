const { autoUpdater, dialog } = require('electron');
const { dbFolderPath, backupFolder, versionFile } = require("./paths");

function setupAutoUpdater(showNotification, log, isDev, showLogInfo) {
    // GitHub Releases Update Feed
    const server = "https://github.com/waiyaki21/Final-AthoniChama-App/releases/latest/download";
    const feed = `${server}/`;

    if (!isDev) {
        // Set the update feed URL
        autoUpdater.setFeedURL({ url: feed });

        // Check for updates
        autoUpdater.checkForUpdates();

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

            if (percent > 0 && percent % 10 === 0) {
                log.info(progressMsg);
            }

            if (percent > 0 && percent < 100 && percent % 25 === 0) {
                showNotification("Download Progress", progressMsg);
            }
        });

        autoUpdater.on("update-downloaded", () => {
            log.info(`Update downloaded`);

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
            log.error("Update error:", err);
            showNotification("Update Error", `An error occurred: ${err.message}`);
        });
    } else {
        log.info(`App in Dev: Updates Not Available!`);
        showNotification(`Updates Unavailable`, `App is currently in develepment, No Updates Available.`);
    }
}

function versionSave(showLogInfo) {
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
function createBackupOfDatabase(showLogInfo) {
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

module.exports = { setupAutoUpdater };