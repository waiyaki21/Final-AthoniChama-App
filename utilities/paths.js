const path          = require("path");
const app           = require('electron');
const os            = require('os');

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

// IMPORTANT IMPORTANT IMPORTANT IMPORTANT IMPORTANT IMPORTANT
// NEEDED BY THE PHPINFO.JS FOLDER
const serverFolderPath = isDev
    ? path.join(__dirname, '../www', 'server.php') // Development
    : path.join(process.resourcesPath, 'app', 'www', 'server.php'); // Production

const envFilePath = isDev
    ? path.join(__dirname, '../.env')
    : path.join(__dirname, 'app', '.env');

// preffered PHP Directory not the path
const phpDirPath = isDev
    ? path.join(__dirname, '../php/') // Development
    : path.join(process.resourcesPath, 'app', 'php'); // Production

const tempDownPath = path.join(os.tmpdir(), 'php.zip');

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
    versionFile,
    serverFolderPath,
    envFilePath,
    phpDirPath,
    tempDownPath
    // createUpdateConfig
};
