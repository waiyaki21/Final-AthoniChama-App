// Listen for the 'set-app-version' event from the main process
window.splashApi.onAppVersion((version) => {
    // Update the version in the HTML
    const versionElement = document.getElementById('version');
    if (versionElement) {
        versionElement.textContent = `v.${version}`; // Set the version dynamically
    }
});
// Listen for the 'status-change' event from the main process
window.splashApi.onStatusChange(({ message, type, progress }) => {
    const statusListContainer   = document.getElementById('status-list-container');
    const statusHeader          = document.getElementById('header');
    const statusState           = document.getElementById('status');
    const statusVersion         = document.getElementById('version');
    const loader                = document.querySelector('.loader');

    // Check if the type is 'download' and remove previous 'download' messages
    if (type === 'download' && statusListContainer) {
        const previousDownloadRow = statusListContainer.querySelector('.status-row.download');
        if (previousDownloadRow) {
            previousDownloadRow.querySelector('.progress-bar-fill').style.width = `${progress}%`;
            previousDownloadRow.querySelector('.status-text').innerText = `• ${message.toUpperCase()} (${progress}%)`;
            return; // Exit to avoid creating a new row for the same download
        }
    }

    // Create a new row for the message
    const messageRow = document.createElement('div');
    messageRow.classList.add('status-row');
    if (type === 'download') messageRow.classList.add('download'); // Add 'download' class for easy identification

    if (type === 'download') {
        // Create a progress bar for downloads
        messageRow.innerHTML = `
            <span class="status-text">• ${message.toUpperCase()}</span>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${progress}%"></div>
            </div>`;
    } else {
        messageRow.innerHTML = `<span class="status-dot status-text">• ${message.toUpperCase()}</span>`;
    }

    // Apply color based on message type
    let color;
    switch (type) {
        case 'log': color = '#10B981'; break; // Green
        case 'info': color = '#06B6D4'; break; // Cyan
        case 'warn': color = '#F59E0B'; break; // Orange
        case 'error': color = '#EF4444'; break; // Red
        case 'download': color = '#3B82F6'; break; // Blue for downloads
        default: color = '#FFFFFF'; break; // White
    }
    messageRow.style.color = color;

    // Append the new row to the list
    if (statusListContainer) {
        statusListContainer.appendChild(messageRow);
        statusListContainer.style.borderColor = color;
    }

    // Scroll the container to the bottom
    if (statusListContainer) {
        statusListContainer.scrollTop = statusListContainer.scrollHeight;
    }

    // Change colors
    if (statusHeader) statusHeader.style.color = color;
    if (statusState) statusState.style.color = color;
    if (statusVersion) statusVersion.style.color = color;

    // Update the loader's border-top color
    if (loader) {
        loader.style.borderTopColor = color;
    }
});