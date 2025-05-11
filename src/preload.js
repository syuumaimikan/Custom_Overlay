const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getMediaInfo: () => ipcRenderer.invoke("get-media-info"),
});
