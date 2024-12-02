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

const phpDownloadUrl    = 'https://windows.php.net/downloads/releases/php-8.2.26-nts-Win32-vs16-x64.zip'; // Replace with actual download URL

// Main server initialization logic
async function phpCheck(loadScreen, wwwFolderPath, phpFolderPath, log, phpServer, updateStatus, showNotification) {
    log.warn('PHP server check.');
    try {
        if (!isPhpEnv_Checked) {
            await checkPhpInEnvironment(wwwFolderPath, phpFolderPath, log, showNotification);
        }

        http.get(serverUrl, (res) => {
            if ([200, 302].includes(res.statusCode)) {
                log.info('running: load screen 1');
                isPhpServerRunning = true;
                log.info(`PHP server already running at ${serverUrl}`);
                updateStatus(isPhpServerRunning);
                loadScreen();
            } else {
                log.warn('not running: start php server 1');
                isPhpServerRunning = false;
                startPhpServer(loadScreen, wwwFolderPath, phpFolderPath, log);
            }
        }).on('error', async (err) => {
            log.error(`PHP server not running: ${err.message}`);
            isPhpServerRunning = false;

            if (!isPhpServerStarting) {
                isPhpServerStarting = true;
                try {
                    if (phpEnv_Exists) {
                        log.log("'php' environment exists. Starting PHP server.");
                        await startPhpServer(loadScreen, wwwFolderPath, phpFolderPath, log);
                        updateStatus(isPhpServerRunning);
                        loadScreen();
                    } else {
                        log.log("'php' environment does not exist. Starting Node server.");
                        await startPhpServer_Node(loadScreen, wwwFolderPath, phpFolderPath, log, phpServer);
                        updateStatus(isPhpServerRunning);
                        loadScreen();
                    }
                } catch (error) {
                    log.error('Error starting PHP server:', error);
                } finally {
                    isPhpServerStarting = false;
                }
            }
        });
    } catch (error) {
        log.error('Error checking PHP environment:', error.message);
    }
}

// Check if PHP is available in the environment
function checkPhpInEnvironment(wwwFolderPath, phpFolderPath, log, showNotification) {
    return new Promise((resolve, reject) => {
        const command = process.platform === 'win32' ? 'where php' : 'which php';

        exec(command, (error, stdout, stderr) => {
            if (error || stderr) {
                log.error('Error checking PHP:', stderr || error.message);
                phpEnv_Exists = false;
                reject('PHP is not found in the system environment or an error occurred.');
                return;
            }

            if (stdout.trim()) {
                log.info('PHP is available at:', stdout.trim());
                phpEnv_Exists = true;
                resolve();
            } else {
                log.info('PHP is not found in the system environment.');
                phpEnv_Exists = false;
                reject('PHP not found.');
            }

            if (!phpEnv_Exists) {
                log.error('.Env does not exist, Creating PHP Variables for .env');
                setPhpEnvVariable(wwwFolderPath, phpFolderPath, log, showNotification);
            }
        });
    });
}

// PHP Servers 
// Start the PHP server using PHP CLI
function startPhpServer(loadScreen, wwwFolderPath, phpFolderPath, log) {
    return new Promise((resolve, reject) => {
        const command = phpEnv_Exists
            ? `php -S 127.0.0.1:8000 -t "${wwwFolderPath}"`
            : `"${phpFolderPath}" -S 127.0.0.1:8000 -t "${wwwFolderPath}"`;

        log.warn(command);

        const phpServerCMD = exec(command, (err, stdout, stderr) => {
            if (err) return reject(`Error starting PHP server: ${err.message}`);
            log.info(`PHP server started: ${stdout}`);
            isPhpServerRunning = true;
            log.info(`'server running': ${isPhpServerRunning}`);
            resolve();
        });

        phpServerPID = phpServerCMD.pid;

        loadScreen();
    });
}

// Start the Node-based PHP server
function startPhpServer_Node(loadScreen, wwwFolderPath, phpFolderPath, log, phpServer) {
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
            log.info(`Node-PHP server started at ${serverUrl}`);
            isPhpServerRunning = true;
            resolve();
        } catch (err) {
            reject(`Error starting Node-PHP server: ${err}`);
        }
    });
}

// get PHP Environment info
function setPhpEnvVariable(wwwFolderPath, phpFolderPath, log, showNotification) {
    if (fs.existsSync(phpFolderPath)) {
        process.env.PHP_PATH = phpFolderPath;
        log.warn(`PHP_PATH set to: ${process.env.PHP_PATH}`);
    } else {
        log.error(`PHP file & executable not found at: ${phpFolderPath}`);
        getPHP(log, showNotification, phpFolderPath);
    }

    if (fs.existsSync(wwwFolderPath)) {
        process.env.WWW_PATH = wwwFolderPath;
        log.warn(`WWW_PATH set to: ${process.env.WWW_PATH}`);
    } else {
        log.error(`PHP executable not found at: ${wwwFolderPath}`);
    }

    savePathsToEnv(log);
}

// Save the paths to a .env file
function savePathsToEnv(log) {
    const phpPath = process.env.PHP_PATH;
    const wwwPath = process.env.WWW_PATH;

    if (!phpPath) {
        log.error('PHP_PATH is not set.');
        return;
    }

    if (!wwwPath) {
        log.error('WWW_PATH is not set.');
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
        log.warn(`.env file created at ${envFilePath}`);
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
    log.warn('PHP_PATH and WWW_PATH saved to .env file.');
}

const tempZipPath = isDev
    ? path.join(__dirname, '../compressed', 'php.zip') // Development
    : path.join(process.resourcesPath, 'app', 'compressed', 'php.zip'); // Production

function getPHP(log, showNotification, phpFolderPath) {
    if (!phpEnv_Exists || !fs.existsSync(phpFolderPath)) {
        if (fs.existsSync(tempZipPath)) {
            log.warn(`PHP ZIP FOUND AT ${tempZipPath}, EXTACTION STARTING`);
            unzipPHP(log, showNotification, phpFolderPath);
        } else {
            log.warn(`PHP ZIP NOT FOUND, DOWNLOAD STARTING`);
            downloadPHP(log, showNotification, phpFolderPath);
        }
    }
}

function unzipPHP(log, showNotification, phpFolderPath) {
    log.warn('UNZIPPING PHP FILE...');
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
            log.warn('PHP extracted successfully.');
            process.env.PHP_PATH = phpFolderPath;
            log.warn(`PHP_PATH set to: ${process.env.PHP_PATH}`);
            // fs.unlinkSync(tempZipPath); // Clean up temporary zip file
        })
        .on('error', (err) => {
            log.error('Error extracting PHP:', err.message);
        });
}

function downloadPHP(log, showNotification, phpFolderPath) {
    log.log('Downloading PHP...');

    // Download PHP zip file
    const file = fs.createWriteStream(tempZipPath);
    https.get(phpDownloadUrl, (response) => {
        response.pipe(file);

        file.on('finish', () => {
            file.close(() => {
                log.log('PHP download completed. Extracting...');

                // Unzip the downloaded file
                fs.createReadStream(tempZipPath)
                    .pipe(unzipper.Extract({ path: phpFolderPath }))
                    .on('close', () => {
                        log.log('PHP extracted successfully.');
                        process.env.PHP_PATH = phpFolderPath;
                        log.log(`PHP_PATH set to: ${process.env.PHP_PATH}`);
                        fs.unlinkSync(tempZipPath); // Clean up temporary zip file
                    })
                    .on('error', (err) => {
                        log.error('Error extracting PHP:', err.message);
                    });
            });
        });
    }).on('error', (err) => {
        log.error('Error downloading PHP:', err.message);
    });
}

module.exports = {
    phpCheck
};