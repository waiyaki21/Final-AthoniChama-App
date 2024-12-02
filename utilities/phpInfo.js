const path      = require('path');
const fs        = require('fs');
const { exec }  = require('child_process');
const http      = require('http');
const { app }   = require('electron');

const isDev = !app.isPackaged; // Determine if running in dev mode
// Setting the Server port and the host ip
const port = 8000, host = '127.0.0.1';
const serverUrl = `http://${host}:${port}`;

let isPhpServerRunning  = false; // State variable to track server status
let isPhpServerStarting = false;
let isPhpEnv_Checked    = false;
let phpEnv_Exists       = false;
let phpServerPID        = null; // Initialize with null
// let server = null;

// Check PHP 
// Main server initialization logic
async function phpCheck() {
    log.log('PHP server check.');

    try {
        // Ensure the PHP environment is checked
        if (!isPhpEnv_Checked) {
            await checkPhpInEnvironment();
        }

        // Check the server status
        http.get(serverUrl, (res) => {
            if ([200, 302].includes(res.statusCode)) {
                log.log('running: load screen 1');
                // Server is running, proceed with loadScreen
                isPhpServerRunning = true;
                log.log(`PHP server already running at ${serverUrl}`);
                loadScreen();  // Call loadScreen here to close the splash screen and show main window
            } else {
                log.log('not running: start php server 1');
                // If the server is not running, try to start it
                isPhpServerRunning = false;
                startPhpServer(); // Try starting the PHP server
            }
        }).on('error', async (err) => {
            log.error(`PHP server not running: ${err.message}`);
            isPhpServerRunning = false;

            // Only start the server if it is not already starting
            if (!isPhpServerStarting) {
                isPhpServerStarting = true; // Lock the server start process

                try {
                    if (phpEnv_Exists) {
                        log.log("'php' environment exists. Starting PHP server. not running: start cmd-php server 2");
                        await startPhpServer();  // Try starting PHP server if PHP is available
                        loadScreen();
                    } else {
                        log.log("'php' environment does not exist. Starting Node server. not running: start node-php server 1");
                        await startPhpServer_Node();  // Otherwise, fallback to Node server
                        loadScreen();
                    }
                } catch (error) {
                    log.error('Error starting PHP server:', error);
                    // Handle fallback or failure
                } finally {
                    isPhpServerStarting = false; // Unlock after server start
                }
            }
        });
    } catch (error) {
        log.error('Error checking PHP environment:', error.message);
    }
}

// Check if PHP is available in the environment
function checkPhpInEnvironment() {
    return new Promise((resolve, reject) => {
        const command = process.platform === 'win32' ? 'where php' : 'which php';

        exec(command, (error, stdout) => {
            phpEnv_Exists = !error && stdout.trim() !== '';
            phpEnv_Exists ? resolve() : reject('PHP not found in system environment');
        });

        if (!phpEnv_Exists) {
            setPhpEnvVariable();
        }
    });
}

// Set the PHP environment variable dynamically
function setPhpEnvVariable() {
    const phpPath = isDev
        ? path.join(__dirname, '../php', 'php.exe') // Development
        : path.join(process.resourcesPath, 'app', 'php', 'php.exe'); // Production

    const wwwPath = isDev
        ? path.join(__dirname, '../www', 'public') // Development
        : path.join(process.resourcesPath, 'app', 'www', 'public'); // Production

    if (fs.existsSync(phpPath)) {
        process.env.PHP_PATH = phpPath;
        console.log(`PHP_PATH set to: ${process.env.PHP_PATH}`);
    } else {
        console.error(`PHP executable not found at: ${phpPath}`);
    }

    if (fs.existsSync(wwwPath)) {
        process.env.WWW_PATH = wwwPath;
        console.log(`WWW_PATH set to: ${process.env.WWW_PATH}`);
    } else {
        console.error(`PHP executable not found at: ${wwwPath}`);
    }

    savePathsToEnv();
}

// Run a PHP script using the environment variable or Node
// Start the PHP server using PHP CLI
function startPhpServer() {
    return new Promise((resolve, reject) => {
        const command = phpEnv_Exists
            ? `php -S 127.0.0.1:8000 -t "${wwwFolderPath}"`
            : `"${phpFolderPath}" -S 127.0.0.1:8000 -t "${wwwFolderPath}"`;

        log.log(command);

        const phpServerCMD = exec(command, (err, stdout, stderr) => {
            if (err) return reject(`Error starting PHP server: ${err.message}`);
            log.log(`PHP server started: ${stdout}`);
            isPhpServerRunning = true;
            log.log(`'server running': ${isPhpServerRunning}`);
            resolve();
        });

        phpServerPID = phpServerCMD.pid; // Store process ID

        loadScreen();
    });
}

// Start the Node-based PHP server
function startPhpServer_Node() {
    return new Promise((resolve, reject) => {
        try {
            phpServer.createServer({
                port: 8000,
                hostname: '127.0.0.1',
                base: `${__dirname}/www/public`,
                keepalive: false,
                open: false,
                bin: phpFolderPath,
                router: `${__dirname}/www/server.php`
            });
            log.log(`Node-PHP server started at ${serverUrl}`);
            isPhpServerRunning = true;
            resolve();
        } catch (err) {
            reject(`Error starting Node-PHP server: ${err}`);
        }
    });
}


// Save the paths to a .env file
function savePathsToEnv() {
    const phpPath = process.env.PHP_PATH;
    const wwwPath = process.env.WWW_PATH;

    if (!phpPath) {
        console.error('PHP_PATH is not set.');
        return;
    }

    if (!wwwPath) {
        console.error('WWW_PATH is not set.');
        return;
    }

    // Read the current .env file content
    const envFilePath = isDev
        ? path.join(__dirname, '../.env') // Development
        : path.join(process.resourcesPath, 'app', '.env'); // Production

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
        console.log(`.env file created at ${envFilePath}`);
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
    console.log('PHP_PATH and WWW_PATH saved to .env file.');
}

function setupPHPInfo() {
    setPhpEnvVariable();
    // return runPhpScript();
}

module.exports = {
    phpCheck,
    setPhpEnvVariable,
    // runPhpScript,
    savePathsToEnv,
    setupPHPInfo
};
