const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getMediaInfo: () => ipcRenderer.invoke("get-media-info"),
  getJacketImage: (title, artist) =>
    ipcRenderer.invoke("get-media-img", title, artist),
  mediaControl: (action) => ipcRenderer.invoke("media-control", action),
});
