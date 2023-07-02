// Import any required modules or dependencies
const { contextBridge, ipcRenderer } = require('electron');

// Expose selective Electron APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // Example: Send a message to the main process
  sendMessage: (message) => {
    ipcRenderer.send('message', message);
  },

  // Example: Receive a message from the main process
  receiveMessage: (callback) => {
    ipcRenderer.on('message', (event, message) => {
      callback(message);
    });
  }
});
