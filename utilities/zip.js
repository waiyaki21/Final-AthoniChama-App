const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Function to create a zip file from a folder
function createZip(inputFolder, outputZipPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputZipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            const totalBytes = archive.pointer();
            const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
            console.info(`ZIP file has been created successfully ${totalBytes} total bytes (${totalMB} MB)`);
            resolve();
        });

        archive.on('error', (err) => reject(err));

        archive.pipe(output);
        archive.directory(inputFolder, false);
        archive.finalize();
    });
}

module.exports = { createZip }; // Export the createZip function
