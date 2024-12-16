const { exec }                  = require('child_process');
const http                      = require('http');
const { app }                   = require('electron');
const path                      = require('path');
const fs                        = require('fs');
// const phpServer              = require('php-server');

let isPhpEnv_Checked            = false;
let phpEnv_Exists               = false;
let isPhpServerRunning          = false;
let isPhpServerStarting         = false;
let phpServerPID;

const serverUrl = 'http://127.0.0.1:8000';

// Determine if the app is in production or development
const isDev = !app.isPackaged;

const serverFolderPath = isDev
    ? path.join(__dirname, '../www', 'server.php') // Development
    : path.join(process.resourcesPath, 'app', 'www', 'server.php'); // Production

// UNZIP PHP IF IT DOES NOT EXIST 
const https             = require('https');
const unzipper          = require('unzipper');

// const phpDownloadUrl    = 'https://windows.php.net/downloads/releases/php-8.2.26-nts-Win32-vs16-x64.zip'; // Replace with actual download URL
const phpDownloadUrl    = 'https://newblessings.co.ke/preset/template/zip';

// Main server initialization logic
async function phpCheck(loadScreen, wwwFolderPath, phpFolderPath, log, phpServer, updateStatus, showNotification, showLogInfo) {
    showLogInfo('PHP server check.', 'warn');
    try {
        if (!isPhpEnv_Checked) {
            await checkPhpInEnvironment(wwwFolderPath, phpFolderPath, log, showNotification, showLogInfo);
        }

        http.get(serverUrl, (res) => {
            if ([200, 302].includes(res.statusCode)) {
                showLogInfo('running: load screen 1', 'info');
                isPhpServerRunning = true;
                showLogInfo(`PHP server already running at ${serverUrl}`, 'info');
                updateStatus(isPhpServerRunning);
                loadScreen();
            } else {
                showLogInfo('not running: start php server 1', 'warn');
                isPhpServerRunning = false;
                startPhpServer(loadScreen, wwwFolderPath, phpFolderPath, log);
            }
        }).on('error', async (err) => {
            showLogInfo(`PHP server not running: ${err.message}`, 'error');
            isPhpServerRunning = false;

            if (!isPhpServerStarting) {
                isPhpServerStarting = true;
                try {
                    if (phpEnv_Exists) {
                        showLogInfo("'php' environment exists. Starting PHP server.", 'log');
                        await startPhpServer(loadScreen, wwwFolderPath, phpFolderPath, log, showLogInfo);
                        updateStatus(isPhpServerRunning);
                        loadScreen();
                    } else {
                        showLogInfo("'php' environment does not exist. Starting Node server.", 'log');
                        await startPhpServer_Node(loadScreen, wwwFolderPath, phpFolderPath, log, phpServer, showLogInfo);
                        updateStatus(isPhpServerRunning);
                        loadScreen();
                    }
                } catch (error) {
                    showLogInfo(`Error starting PHP server: ${error}`, 'error');
                } finally {
                    isPhpServerStarting = false;
                }
            }
        });
    } catch (error) {
        showLogInfo(`Error checking PHP environment: ${error.message}`, 'error');
    }
}

// Check if PHP is available in the environment
function checkPhpInEnvironment(wwwFolderPath, phpFolderPath, log, showNotification, showLogInfo) {
    return new Promise((resolve, reject) => {
        const command = process.platform === 'win32' ? 'where php' : 'which php';

        exec(command, (error, stdout, stderr) => {
            if (error || stderr) {
                // log.error('Error checking PHP:', stderr || error.message);
                showLogInfo(`Error checking PHP: ${stderr || error.message }`, 'error');
                phpEnv_Exists = false;
                reject('PHP is not found in the system environment or an error occurred.');
                return;
            }

            if (stdout.trim()) {
                showLogInfo(`PHP is available at:, ${stdout.trim()}`, 'info');
                phpEnv_Exists = true;
                resolve();
            } else {
                showLogInfo('PHP is not found in the system environment.', 'info');
                phpEnv_Exists = false;
                reject('PHP not found.');
            }

            if (!phpEnv_Exists) {
                showLogInfo('.Env does not exist, Creating PHP Variables for .env', 'error');
                setPhpEnvVariable(wwwFolderPath, phpFolderPath, log, showNotification, showLogInfo);
            }
        });
    });
}

// PHP Servers 
// Start the PHP server using PHP CLI
function startPhpServer(loadScreen, wwwFolderPath, phpFolderPath, log, showLogInfo) {
    return new Promise((resolve, reject) => {
        const command = phpEnv_Exists
            ? `php -S 127.0.0.1:8000 -t "${wwwFolderPath}"`
            : `"${phpFolderPath}" -S 127.0.0.1:8000 -t "${wwwFolderPath}"`;

        showLogInfo(command, 'warn');

        const phpServerCMD = exec(command, (err, stdout, stderr) => {
            if (err) return reject(`Error starting PHP server: ${err.message}`);
            showLogInfo(`PHP server started: ${stdout}`, 'info');
            isPhpServerRunning = true;
            showLogInfo(`'server running': ${isPhpServerRunning}`, 'info');
            resolve();
        });

        phpServerPID = phpServerCMD.pid;

        loadScreen();
    });
}

// Start the Node-based PHP server
function startPhpServer_Node(loadScreen, wwwFolderPath, phpFolderPath, log, phpServer, showLogInfo) {
    return new Promise((resolve, reject) => {
        try {
            phpServer.createServer({
                port: 8000,
                hostname: '127.0.0.1',
                base: `${wwwFolderPath}`,
                keepalive: false,
                open: false,
                bin: phpFolderPath,
                router: `${serverFolderPath}`
            });
            showLogInfo(`Node-PHP server started at ${serverUrl}`, 'info');
            isPhpServerRunning = true;
            resolve();
        } catch (err) {
            reject(`Error starting Node-PHP server: ${err}`);
        }
    });
}

// get PHP Environment info
function setPhpEnvVariable(wwwFolderPath, phpFolderPath, log, showNotification, showLogInfo) {
    if (fs.existsSync(phpFolderPath)) {
        process.env.PHP_PATH = phpFolderPath;
        showLogInfo(`PHP_PATH set to: ${process.env.PHP_PATH}`, 'warn');
    } else {
        showLogInfo(`PHP file & executable not found at: ${phpFolderPath}`, 'error');
        getPHP(log, showNotification, phpFolderPath, showLogInfo);
    }

    if (fs.existsSync(wwwFolderPath)) {
        process.env.WWW_PATH = wwwFolderPath;
        showLogInfo(`WWW_PATH set to: ${process.env.WWW_PATH}`, 'warn');
    } else {
        showLogInfo(`PHP executable not found at: ${wwwFolderPath}`, 'error');
    }

    savePathsToEnv(log, showLogInfo);
}

// Save the paths to a .env file
function savePathsToEnv(log, showLogInfo) {
    const phpPath = process.env.PHP_PATH;
    const wwwPath = process.env.WWW_PATH;

    if (!phpPath) {
        showLogInfo('PHP_PATH is not set.', 'error');
        return;
    }

    if (!wwwPath) {
        showLogInfo('WWW_PATH is not set.', 'error');
        return;
    }

    // Read the current .env file content
    const envFilePath = isDev
        ? path.join(__dirname, '../.env')           // Path in development
        : path.join(__dirname, 'app','.env');        // Path in production

    let envContent = '';

    // Check if the file exists, and if not, create it
    if (!fs.existsSync(envFilePath)) {
        // Ensure the directory exists
        const dir = path.dirname(envFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
        }

        // Write the .env file with the content
        fs.writeFileSync(envFilePath, envContent, { encoding: 'utf8' });
        showLogInfo(`.env file created at ${envFilePath}`, 'warn');
    } else {
        envContent = fs.readFileSync(envFilePath, { encoding: 'utf8' });
    }

    // Append or update the PHP_PATH and WWW_PATH entries
    if (!envContent.includes('PHP_PATH')) {
        envContent += `PHP_PATH=${phpPath}\n`;
    } else {
        // Update the existing PHP_PATH line
        const phpPathRegex = /PHP_PATH=.*/;
        envContent = envContent.replace(phpPathRegex, `PHP_PATH=${phpPath}`);
    }

    if (!envContent.includes('WWW_PATH')) {
        envContent += `WWW_PATH=${wwwPath}\n`;
    } else {
        // Update the existing WWW_PATH line
        const wwwPathRegex = /WWW_PATH=.*/;
        envContent = envContent.replace(wwwPathRegex, `WWW_PATH=${wwwPath}`);
    }

    // Write the updated content back to the .env file
    fs.writeFileSync(envFilePath, envContent, { encoding: 'utf8' });
    showLogInfo('PHP_PATH and WWW_PATH saved to .env file.', 'warn');
}

const tempZipPath = isDev
    ? path.join(__dirname, '../compressed', 'php.zip') // Development
    : path.join(process.resourcesPath, 'app', 'compressed', 'php.zip'); // Production

function getPHP(log, showNotification, phpFolderPath, showLogInfo) {
    if (!phpEnv_Exists || !fs.existsSync(phpFolderPath)) {
        if (fs.existsSync(tempZipPath)) {
            showLogInfo(`PHP ZIP FOUND AT ${tempZipPath}, EXTACTION STARTING`, 'warn');
            unzipPHP(log, showNotification, phpFolderPath, showLogInfo);
        } else {
            showLogInfo(`PHP ZIP NOT FOUND, DOWNLOAD STARTING`, 'warn');
            downloadPHP(log, showNotification, phpFolderPath, showLogInfo);
        }
    }
}

function unzipPHP(log, showNotification, phpFolderPath, showLogInfo) {
    showLogInfo('UNZIPPING PHP FILE...', 'warn');
    showNotification('Preparing Resources', 'Unzipping Server files');

    const phpDirPath = isDev
        ? path.join(__dirname, '../php/') // Development
        : path.join(process.resourcesPath, 'app', 'php'); // Production

    console.log(phpDirPath);

    // Unzip the zipped file
    fs.createReadStream(tempZipPath)
        .pipe(unzipper.Extract({ path: phpDirPath }))
        .on('close', () => {
            showNotification('Resources Extracted Successfully', 'Resources Extracted Successfully');
            showLogInfo('PHP extracted successfully.', 'warn');
            process.env.PHP_PATH = phpFolderPath;
            showLogInfo(`PHP_PATH set to: ${process.env.PHP_PATH}`, 'warn');
            // fs.unlinkSync(tempZipPath); // Clean up temporary zip file
        })
        .on('error', (err) => {
            showLogInfo(`Error extracting PHP: ${err.message}`, 'error');
        });
}

function downloadPHP(log, showNotification, phpFolderPath, showLogInfo) {
    showLogInfo('Downloading PHP...', 'log');

    // Download PHP zip file
    const file = fs.createWriteStream(tempZipPath);
    https.get(phpDownloadUrl, (response) => {
        response.pipe(file);

        file.on('finish', () => {
            file.close(() => {
                showLogInfo('PHP download completed. Extracting...', 'log');

                // Unzip the downloaded file
                fs.createReadStream(tempZipPath)
                    .pipe(unzipper.Extract({ path: phpFolderPath }))
                    .on('close', () => {
                        showLogInfo('PHP extracted successfully.', 'log');
                        process.env.PHP_PATH = phpFolderPath;
                        showLogInfo(`PHP_PATH set to: ${process.env.PHP_PATH}`, 'log');
                        fs.unlinkSync(tempZipPath); // Clean up temporary zip file
                    })
                    .on('error', (err) => {
                        showLogInfo(`Error extracting PHP: ${err.message}`, 'error');
                    });
            });
        });
    }).on('error', (err) => {
        showLogInfo(`Error downloading PHP: ${err.message}`, 'error');
    });
}

module.exports = {
    phpCheck
};