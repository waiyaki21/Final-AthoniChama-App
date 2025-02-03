// const { autoUpdater } = require("electron-updater");
const { dialog, app, autoUpdater } = require("electron");

const fs                        = require('fs');
const path                      = require('path');

// Determine if the app is in production or development
const isDev                                 = !app.isPackaged;

function setupAutoUpdater(showNotification, log, isDev, showLogInfo) {
    if (!isDev) {
        // Check for updates
        // autoUpdater.checkForUpdatesAndNotify();

        // Event: Checking for updates
        autoUpdater.on("checking-for-update", () => {
            showLogInfo(`Checking for updates...🎢`, 'info');
        });

        // Event: Update available
        autoUpdater.on("update-available", (info) => {
            showLogInfo(`Update available: ${info}🎢`, 'info');
            dialog.showMessageBox({
                type: "info",
                title: "Update Available",
                message: `A new update (v${info.version}) is available. Downloading...`,
            });
        });

        // Event: Update not available
        autoUpdater.on("update-not-available", () => {
            showLogInfo(`No new updates available.❌`, 'info');
        });

        // Event: Error while updating
        autoUpdater.on("error", (err) => {
            showLogInfo(`Update Error: ${err}`, 'error');
            dialog.showMessageBox({
                type: "error",
                title: "Update Error",
                message: `An error occurred while checking for updates: ${err.message}`,
            });
        });

        // Event: Download progress
        autoUpdater.on("download-progress", (progressObj) => {
            let logMessage = `Download Speed: ${progressObj.bytesPerSecond} B/s`;
            logMessage += ` - Downloaded ${progressObj.percent.toFixed(2)}%`;
            logMessage += ` (${progressObj.transferred}/${progressObj.total} bytes)`;
            showLogInfo(`${logMessage}🎢`, 'info');
        });

        // Event: Update downloaded
        autoUpdater.on("update-downloaded", () => {
            // Save current version before quitting
            versionSave(showLogInfo);
            
            dialog
                .showMessageBox({
                    type: "question",
                    buttons: ["Restart", "Later"],
                    title: "Update Ready",
                    message: "An update has been downloaded. Restart to apply?",
                })
                .then((result) => {
                    if (result.response === 0) autoUpdater.quitAndInstall();
                });
        });

        // Event: Before quitting for update
        autoUpdater.on("before-quit-for-update", () => {
            showLogInfo(`Application is about to quit for update installation.🎢`, 'info');
        });
    } else {
        // Create backup
        createBackupOfDatabase(showLogInfo);
        // restoreDatabaseFromBackup(showLogInfo);

        // log 
        showLogInfo(`App in Dev: Updates Not Available!🎢`, 'info');
        showNotification(`Updates Unavailable`, `App is currently in develepment, No Updates Available.`);
    }
}

const { dbFolderPath, backupFolder, versionFile } = require("./paths");

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

                showLogInfo(`Database restored successfully from backup: ${ latestBackup }🎢`, 'info');
                showLogInfo('Database restored successfully from backup', 'info');
            });
        });
    } else {
        showLogInfo(`No backup file found to restore🎢`, 'info');
    }
}

module.exports = { setupAutoUpdater };
