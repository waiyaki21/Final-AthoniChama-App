const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read the version from package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = packageJson.version; // Use the version field from package.json

// Path to the executable file
// const exePath = path.join(__dirname, '../dist', 'AthoniChamaApp-win32-x64', 'AthoniChamaApp.exe');
// const zipPath = path.join(__dirname, '../dist', 'AthoniChamaApp-win32-x64', 'AthoniChamaApp-win32-x64.zip');

const exePath = path.join(__dirname, '../out','make','squirrel.windows','x64','AthoniChamaAppSetup.exe');
// const zipPath = path.join(__dirname, '../out', 'AthoniChamaApp-win32-x64', 'athonichama-app-win32-x64.zip');

// Generate the release command
const releaseCommand = `gh release create ${version} --generate-notes --title "Release ${version}" --notes "Automated release via CLI." "${exePath}"`;

// Execute the command
try {
    console.log(`Executing command: ${releaseCommand}`);
    execSync(releaseCommand, { stdio: 'inherit' });
    console.log('Release created successfully!');
} catch (error) {
    console.error('Error creating release:', error);
}
