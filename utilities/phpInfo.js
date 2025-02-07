const { exec }  = require('child_process');
const http      = require('http');
const { Notification }   = require('electron');
const path      = require('path');
const fs        = require('fs');

let isPhpEnv_Checked    = false;
let phpEnv_Exists       = false;
let isPhpServerRunning  = false;
let isPhpServerStarting = false;
let envPHP_Path         = '';

const { envFilePath, phpDirPath, tempDownPath } = require("./paths");

const serverUrl = 'http://127.0.0.1:8000';

// UNZIP PHP IF IT DOES NOT EXIST 
const https     = require('https');
const unzipper  = require('unzipper');

const phpDownloadUrl    = 'https://newblessings.co.ke/preset/template/zip'; 

// Helper function to show notifications
const showNotification = (title, body) => {
    new Notification({ title, body }).show();
}

// 1. Main server initialization logic
async function phpCheck(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo) {
    showLogInfo('PHP server check.❗', 'warn');
    try {
        // 2. check if php is installed in this device 
        if (!isPhpEnv_Checked) {
            await checkPhpInEnvironment(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo);
        }

        // url check 
        http.get(serverUrl, (res) => {
            // check if server is already active 
            if ([200, 302].includes(res.statusCode)) {
                // if response is 200 / 302 the link is active 
                showLogInfo('Running: load screen 1❗', 'warn');
                isPhpServerRunning = true;
                showLogInfo(`PHP server already running at ${serverUrl}`, 'warn');
                updateStatus(isPhpServerRunning);
                return;
            } else {
                // else the server is not active 
                showLogInfo('Not running: start php server 1 - cmd🖥️', 'warn');
                restartPhpServer({
                    isPhpServerRunning,
                    isPhpServerStarting,
                    phpFolderPath,
                    wwwFolderPath,
                    updateStatus,
                    showLogInfo,
                    startPhpServer,
                    getPHP,
                });
            }
        }).on('error', async (err) => {
            showLogInfo(`PHP server not running: ${err.message}⚠️`, 'error');

            await restartPhpServer({
                isPhpServerRunning,
                isPhpServerStarting,
                phpFolderPath,
                wwwFolderPath,
                updateStatus,
                showLogInfo,
                startPhpServer,
                getPHP,
            });
        });
    } catch (error) {
        showLogInfo(`Error checking PHP environment: ${error.message}⚠️`, 'error');
    }
}

// recheck after confirmations in savePathsToEnv 
async function phpRecheck(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo) {
    isPhpEnv_Checked = true;
    showLogInfo('PHP rechecking!📃', 'log');
    await phpCheck(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo);
}

// 2. Check if PHP is available in the environment
function checkPhpInEnvironment(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo) {
    return new Promise((resolve, reject) => {
        const command = process.platform === 'win32' ? 'where php' : 'which php';
        
        exec(command, (error, stdout, stderr) => {
            if (error || stderr) {
                showLogInfo(`1. Error checking PHP: ${stderr || error.message} ⚠️`, 'error');
                phpEnv_Exists = false;
                reject('PHP is not found in the system environment or an error occurred.');
                // return;
            }

            if (stdout.trim()) {
                phpEnv_Exists = true;
                envPHP_Path   = stdout;
                showLogInfo(envPHP_Path, 'info');
                resolve();
            } else {
                showLogInfo('PHP is not found in the system environment.⚠️', 'error');
                phpEnv_Exists = false;
                reject('PHP not found.');
            }

            if (!phpEnv_Exists) {
                // showLogInfo('.Env does not exist, Creating PHP Variables for .env⚠️', 'error');
                setPhpEnvVariable(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo);
            }
        });
    });
}

// PHP Servers 
// Start the PHP server using PHP CLI
async function startPhpServer(showLogInfo, command, updateStatus) {
    try {
        showLogInfo(command, 'warn');

        const { stdout, stderr } = await exec(command);

        if (stderr) {
            showLogInfo(`PHP server stderr: ${stderr}⚠️`, 'error');
        }

        showLogInfo(`PHP server started: ${stdout}🔔`, 'info');
        isPhpServerRunning = true;
        updateStatus(isPhpServerRunning);
        showLogInfo(`Server running: ${isPhpServerRunning}🔔`, 'info');

    } catch (error) {
        showLogInfo(`Error starting PHP server: ${error.message}⚠️`, 'error');
        throw new Error(`Error starting PHP server: ${error.message}`);
    } finally {
        updateStatus(isPhpServerRunning);
    }
}

async function restartPhpServer({
    isPhpServerRunning,
    isPhpServerStarting,
    phpFolderPath,
    wwwFolderPath,
    updateStatus,
    showLogInfo,
    startPhpServer,
    getPHP,
}) {
    if (!isPhpServerRunning) {
        // Starting the server
        isPhpServerStarting = true;
        try {
            let command = ``;

            const phpExists = fs.existsSync(phpFolderPath);

            showLogInfo(`php exists: ${phpExists}📃`, 'log');
            showLogInfo(`php exists folder ${phpFolderPath}📃`, 'log');

            if (phpExists) {
                command = `"${phpFolderPath}" -S 127.0.0.1:8000 -t "${wwwFolderPath}"`;
                showLogInfo(`Restarting PHP server using PhpPath.📃`, 'log');
                await startPhpServer(showLogInfo, command, updateStatus);
                updateStatus(isPhpServerRunning);
            } else {
                // PHP folder doesn't exist, call getPHP to download and configure
                await getPHP(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo);
            }
        } catch (error) {
            showLogInfo(`Error starting PHP server: ${error}⚠️`, 'error');
        } finally {
            isPhpServerStarting = false;
        }
    }
}

// 3. get PHP Environment info if no PHP get it
function setPhpEnvVariable(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo) {
    // check if phpFolderPath exists , if it does save to .env.PHP_PATH, if not getPHP
    if (fs.existsSync(phpFolderPath)) {
        phpEnv_Exists           = true;
        process.env.PHP_PATH    = phpFolderPath;
        showLogInfo(`PHP_PATH set to: ${process.env.PHP_PATH}❗`, 'warn');
    } else {
        phpEnv_Exists           = false;
        showLogInfo(`PHP file & executable not found at: ${phpFolderPath}⚠️`, 'error');
        // get php for the app 
        getPHP(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo);
    }

    // check if wwwFolderPath exists , if it does save to .env.WWW_PATH, if not getWWW
    if (fs.existsSync(wwwFolderPath)) {
        process.env.WWW_PATH = wwwFolderPath;
        showLogInfo(`WWW_PATH set to: ${process.env.WWW_PATH}❗`, 'warn');
    } else {
        showLogInfo(`WWW_PATH not found at: ${wwwFolderPath}⚠️`, 'error');
        // get WWW file as well 
        // getWWW(phpFolderPath, showLogInfo);
    }

    const phpPath = process.env.PHP_PATH;
    const wwwPath = process.env.WWW_PATH;
    
    if (!phpPath || !wwwPath) {
        // save the new path to the .env 
        savePathsToEnv(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo);
    } else {
        //if env has been saved recheck php
        phpRecheck(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo);
    }
}

// 4. Save the paths to a .env file
function savePathsToEnv(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo) {
    const phpPath = process.env.PHP_PATH;
    const wwwPath = process.env.WWW_PATH;

    if (!phpPath || !wwwPath) {
        const missingPath = !phpPath ? 'PHP_PATH' : 'WWW_PATH';
        showLogInfo(`${missingPath} is not set.⚠️`, 'error');
        return;
    }

    // Ensure .env file exists
    if (!fs.existsSync(envFilePath)) {
        fs.mkdirSync(path.dirname(envFilePath), { recursive: true });
        fs.writeFileSync(envFilePath, '', { encoding: 'utf8' });
        showLogInfo(`.env file created at ${envFilePath}🔔`, 'info');
    }

    let envContent = fs.readFileSync(envFilePath, { encoding: 'utf8' });

    // Helper function to update or add an entry
    const updateEnv = (content, key, value) => {
        const regex = new RegExp(`${key}=.*`);
        return content.includes(key)
            ? content.replace(regex, `${key}=${value}`)
            : `${content}${key}=${value}\n`;
    };

    // Update PHP_PATH and WWW_PATH
    envContent = updateEnv(envContent, 'PHP_PATH', phpPath);
    envContent = updateEnv(envContent, 'WWW_PATH', wwwPath);

    // Write updated content back to the .env file
    fs.writeFileSync(envFilePath, envContent, { encoding: 'utf8' });
    showLogInfo('PHP_PATH and WWW_PATH saved to .env file.❗', 'warn');

    //once env has been saved recheck php
    phpRecheck(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo);
}

async function getPHP(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo) {
    try {
        const versionDate = new Date('2025-01-18T16:38:00'); // Release date for version 1.0.82
        const totalFileSizeBytes = 103096188; // Required file size in bytes

        // Check if phpFolderPath exists
        if (fs.existsSync(phpFolderPath)) {
            showLogInfo('PHP folder exists checking if its is valid and up to date.✔️', 'info');
            const stats = fs.statSync(phpFolderPath);

            // Check creation date and size
            if (stats.birthtime > versionDate && stats.size >= totalFileSizeBytes) {
                showLogInfo('PHP folder is valid and up to date.✔️', 'info');
                await phpRecheck(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo);
            } else {
                showLogInfo(
                    `PHP folder is invalid. Size: ${stats.size} bytes, Created: ${stats.birthtime}❌`,
                    'error'
                );
                // Delete the invalid folder
                fs.rmSync(phpFolderPath, { recursive: true, force: true });
                showLogInfo('Invalid PHP folder deleted. Starting fresh download...⏰', 'info');
                downloadPHP(phpFolderPath, showLogInfo, phpDirPath, wwwFolderPath, phpFolderPath, updateStatus);
            }
        } else {
            // If tempDownPath exists
            if (fs.existsSync(tempDownPath)) {
                const stats = fs.statSync(tempDownPath);
                const fileCreationDate = stats.birthtime;

                showLogInfo(`File creation date: ${fileCreationDate}🔔`, 'info');
                showLogInfo(`Version release date: ${versionDate}🔔`, 'info');

                if (fileCreationDate < versionDate) {
                    // File is older than the version date
                    fs.unlinkSync(tempDownPath); // Delete outdated zip file
                    showLogInfo('Outdated PHP ZIP found. Starting download...✔️', 'info');
                    downloadPHP(phpFolderPath, showLogInfo, phpDirPath, wwwFolderPath, phpFolderPath, updateStatus);
                } else {
                    // File is newer than the version date
                    showLogInfo('PHP ZIP is valid. Starting extraction...✔️', 'info');
                    unzipAndProcess(tempDownPath, phpDirPath, wwwFolderPath, phpFolderPath, updateStatus, showLogInfo);
                }
            } else {
                // No PHP zip file found, start download
                showLogInfo('PHP ZIP not found. Starting download...✔️', 'info');
                downloadPHP(phpFolderPath, showLogInfo, phpDirPath, wwwFolderPath, phpFolderPath, updateStatus);
            }
        }
    } catch (error) {
        showLogInfo(`An error occurred: ${error.message}⚠️`, 'error');
    }
}

async function downloadPHP(phpFolderPath, showLogInfo, phpDirPath, wwwFolderPath, phpFolderPath, updateStatus) {
    let totalBytes      = 0;

    showLogInfo('Starting PHP download...📃', 'log');
    showNotification('Downloading! ⏰', 'Downloading Some Assets, please wait!');

    https.get(phpDownloadUrl, (response) => {
        if (response.statusCode !== 200) {
            showLogInfo(`Download failed: HTTP ${response.statusCode} ${response.statusMessage}⚠️`, 'error');
            return;
        }

        const data = [];
        const totalFileSizeBytes = 38062523; // Actual file size in bytes
        const fullSizeMB = (totalFileSizeBytes / (1024 * 1024)).toFixed(2); // Convert to MB
        let lastLoggedPercentage = 0; // To track the last logged percentage

        response.on('data', (chunk) => {
            data.push(chunk);
            totalBytes += chunk.length;

            // Calculate the downloaded size in MB and percentage
            const downloadedMB  = (totalBytes / (1024 * 1024)).toFixed(2); // Convert to MB
            const percentageDownloaded = ((totalBytes / totalFileSizeBytes) * 100).toFixed(2); // Percentage

            // Check if percentageDownloaded is a multiple of int and hasn't been logged yet
            let int = 1;
            if (Math.floor(percentageDownloaded / int) > lastLoggedPercentage) {
                lastLoggedPercentage = Math.floor(percentageDownloaded / int);
                showLogInfo(
                    `Downloading 📂: ${downloadedMB} MB / ${fullSizeMB} MB - `,
                    'download',
                    percentageDownloaded
                );
            }
        });

        response.on('end', async () => {
            showLogInfo(`Download complete ✔️. Total size: ${totalBytes} bytes📃`, 'log');

            // Combine chunks and save to file
            const buffer = Buffer.concat(data);
            fs.writeFileSync(tempDownPath, buffer);

            showLogInfo('File saved. Extracting...📃', 'log');

            // Call the separate unzip function
            try {
                await unzipAndProcess(tempDownPath, phpDirPath, wwwFolderPath, phpFolderPath, updateStatus, showLogInfo);
            } catch (err) {
                let retryCount = 0;

                if (retryCount++ <= 2) {
                    showLogInfo(`Error during extraction: Redownloading⚠️`, 'error');
                    downloadPHP(phpFolderPath, showLogInfo, phpDirPath, wwwFolderPath, phpFolderPath, updateStatus);
                } else {
                    showLogInfo(`Error during extraction: ${err.message}⚠️`, 'error');
                }
            }
        });

        response.on('error', (err) => {
            showLogInfo(`Error during download: ${err.message}⚠️`, 'error');
        });
    }).on('error', (err) => {
        showLogInfo(`Error connecting to server: ${err.message}⚠️`, 'error');
    });
}

async function unzipAndProcess(tempDownPath, phpDirPath, wwwFolderPath, phpFolderPath, updateStatus, showLogInfo) {
    // read the path where the php has been downloaded 
    fs.createReadStream(tempDownPath)
        // extract it 
        .pipe(unzipper.Extract({ path: phpDirPath }))
        // on closing or finishing
        .on('close', async () => {
            showLogInfo('PHP extracted successfully. 📭', 'log');
            process.env.PHP_PATH = phpFolderPath;
            showLogInfo(`PHP_PATH set to: ${process.env.PHP_PATH}📃`, 'log');
            // fs.unlinkSync(tempDownPath); // Clean up temporary zip file

            // Call phpCheck after extraction
            try {
                await phpRecheck(wwwFolderPath, phpFolderPath, updateStatus, showLogInfo);
            } catch (err) {
                showLogInfo(`Error during PHP recheck: ${err.message} ⚠️`, 'error');
            }
        })
        .on('error', (err) => {
            showLogInfo(`Error extracting PHP: ${err.message} ⚠️`, 'error');
            showLogInfo('Invalid PHP zip folder deleted. Starting fresh download... ⏰', 'info');
            fs.unlinkSync(tempDownPath); // Clean up temporary zip file
            downloadPHP(phpFolderPath, showLogInfo, phpDirPath, wwwFolderPath, phpFolderPath, updateStatus);
        });
}

module.exports = {
    phpCheck
};