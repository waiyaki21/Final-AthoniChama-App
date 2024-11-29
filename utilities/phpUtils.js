const path      = require('path');
const fs        = require('fs');
const { exec }  = require('child_process');
const http      = require('http');
// const { app }   = require('electron');

// const isDev = !app.isPackaged; // Determine if running in dev mode
// let server = null;

// Set the PHP environment variable dynamically
function setPhpEnvVariable() {
    // const phpPath = isDev
    //     ? path.join(__dirname, '../php', 'php.exe') // Dev mode path
    //     : path.join(process.resourcesPath, 'php', 'php.exe'); // Production mode path

    const phpPath = path.join(__dirname, '../php', 'php.exe');
    const wwwPath = path.join(__dirname, '../www', 'public');

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

// Run a PHP script using the environment variable
function runPhpScript() {
    const phpPath = process.env.PHP_PATH;
    const wwwPath = process.env.WWW_PATH;

    if (!phpPath) {
        console.error('PHP_PATH environment variable is not set.');
        return;
    }

    if (!wwwPath) {
        console.error('WWW_PATH environment variable is not set.');
        return;
    }

    // server = exec(`"${phpPath}" -S 127.0.0.1:8000 -t "${wwwPath}"`, (err, stdout, stderr) => {
    //     if (err) {
    //         console.error(`Error running PHP script: ${err.message}`);
    //         return;
    //     }
    //     console.log('PHP Script Output:', stdout);
    //     console.error('PHP Script Errors:', stderr);
    // });

    // return [server, phpPath, wwwPath];
    return [phpPath, wwwPath];
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
    // const envFilePath = !isDev
    //     ? path.join(__dirname, '.env') // Path in production
    //     : path.join(__dirname, '../.env');        // Path in development

    const envFilePath = path.join(__dirname, '../.env');

    let envContent = '';

    // Check if the file exists, and if not, create it
    // if (fs.existsSync(envFilePath)) {
    //     envContent = fs.readFileSync(envFilePath, { encoding: 'utf8' });
    // }
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
    return runPhpScript();
}

module.exports = {
    // setupPHPInfo
    setPhpEnvVariable,
    runPhpScript,
    savePathsToEnv,
    setupPHPInfo
};
