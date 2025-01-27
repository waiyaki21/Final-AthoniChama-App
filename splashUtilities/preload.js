const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('splashApi', {
    updateStatus: (message) => ipcRenderer.send('update-status', message),

    onStatusChange: (callback) => {
        ipcRenderer.on('status-change', (event, data) => {
            callback(data);  // Pass the data (message and type) to the callback
        });
    },

    // Expose a method to receive app version
    onAppVersion: (callback) => {
        ipcRenderer.on('set-app-version', (event, version) => {
            callback(version);
        });
    },
});