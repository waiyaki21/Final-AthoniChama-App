const path          = require("path");
const app           = require('electron');

// Determine if the app is in production or development
const isDev                                 = !app.isPackaged;

const phpFolderPath = isDev
    ? path.join(__dirname, "../php", "php.exe") // Development
    : path.join(process.resourcesPath, "app", "php", "php.exe"); // Production

const wwwFolderPath = isDev
    ? path.join(__dirname, "../www", "public") // Development
    : path.join(process.resourcesPath, "app", "www", "public"); // Production

const cacheFolderPath = isDev
    ? path.join(__dirname, "../www", "bootstrap", "cache") // Development
    : path.join(process.resourcesPath, "app", "www", "bootstrap", "cache"); // Production

const dbFolderPath = isDev
    ? path.join(__dirname, "../www", "database", "database.sqlite") // Development
    : path.join(process.resourcesPath, "app", "www", "database", "database.sqlite"); // Production

const backupFolder = isDev
    ? path.join(__dirname, '../www', 'backups') // Dev mode backups folder
    : path.join(app.getPath('appData').replace('Roaming', 'Local'), `${app.getName()}/backups`); // Prod mode backups folder

const versionFile = isDev
    ? path.join(__dirname, "app-version.json") // Dev mode: Save in the project folder
    : path.join(app.getPath('appData').replace('Roaming', 'Local'), `${app.getName()}`, "app-version.json"); // Prod mode: Save in Local AppData

// const updateFilePath = isDev
//     ? path.join(__dirname, "../app-update.yml") // Development
//     : path.join(process.resourcesPath, "app-update.yml"); // Production

// function createUpdateConfig(name, fs) {
//     // Define the update configuration
//     const updateConfig = 
//     `provider: generic
// url: https://github.com/waiyaki21/Final-AthoniChama-App/releases
// updaterCacheDirName: ${name}`;

//     try {
//         // Write the file
//         fs.writeFileSync(updateFilePath, updateConfig, "utf8");
//         console.log("✅ app-update.yml file created successfully!");
//     } catch (error) {
//         console.error("❌ Error creating app-update.yml:", error);
//     }
// }

module.exports = {
    phpFolderPath,
    wwwFolderPath,
    cacheFolderPath,
    dbFolderPath,
    backupFolder,
    versionFile
    // createUpdateConfig
};
