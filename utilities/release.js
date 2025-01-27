const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Resolve the path to package.json relative to this script
const packageJsonPath = path.resolve(__dirname, '../package.json');

// Read the version from package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Path to the executable file
const filePath = path.join(__dirname, '../dist', 'AthoniChamaApp-win32-x64');
const zipPath = path.join(__dirname, '../dist', 'AthoniChamaApp-win32-x64.zip');

// const exePathForge = path.join(__dirname, '../out','make','squirrel.windows','x64','AthoniChamaAppSetup.exe');
// const zipPathForge = path.join(__dirname, '../out', 'make', 'zip', 'win32', 'x64', `athonichama-app-win32-x64-${version}.zip`);

// Generate the release command
const releaseCommand = `gh release create ${version} --generate-notes --title "Release ${version}" --notes "Automated release via CLI." "${zipPath}"`;

// try {
//     console.log(`Checking for existing release with tag: ${version}...`);
//     // Check if a release with the same tag exists
//     execSync(`gh release view ${version}`, { stdio: 'inherit' });

//     console.log('Existing release found. Deleting...');
//     // Delete the existing release
//     execSync(`gh release delete ${version} -y`, { stdio: 'inherit' });
//     console.log('Existing release deleted.');

//     // Delete the local tag
//     execSync(`git tag -d ${version}`, { stdio: 'inherit' });
//     console.log(`Local tag ${version} deleted.`);

//     // Delete the remote tag
//     execSync(`git push origin --delete ${version}`, { stdio: 'inherit' });
//     console.log(`Remote tag ${version} deleted.`);
// } catch (error) {
//     console.log('No existing release found. Proceeding to create a new release...');
// }

try {
    console.log(`Executing command: ${releaseCommand}`);
    // Create the release
    execSync(releaseCommand, { stdio: 'inherit' });
    console.info('GitHub release created successfully!');
} catch (error) {
    console.error('Error creating release:', error);
}