const fs = require('fs');
const archiver = require('archiver');

// Function to create a zip file from a folder
function createZip(inputFolder, outputZipPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputZipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // maximum compression
        });

        output.on('close', () => {
            console.log(`${archive.pointer()} total bytes`);
            console.log('ZIP file has been created successfully');
            resolve();
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);
        archive.directory(inputFolder, false);
        archive.finalize();
    });
}

// Get folder paths from arguments
const inputFolder = process.argv[2];  // Folder to zip
const outputZipPath = process.argv[3]; // Output zip file

// Call the createZip function
createZip(inputFolder, outputZipPath)
    .then(() => console.log('Done!'))
    .catch(err => console.error('Error:', err));
