const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read the version from package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = packageJson.version; // Use the version field from package.json

// Path to the executable file
const exePath = path.join(__dirname, '../dist', 'AthoniChamaApp-win32-x64', 'AthoniChamaApp.exe');

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
