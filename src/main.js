const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const addonPath = path.resolve(
  __dirname,
  "../tools/build/Release/media_info.node"
);

if (!fs.existsSync(addonPath)) {
  console.error("ネイティブモジュールが見つかりません:", addonPath);
  process.exit(1);
}

const myaddon = require(addonPath);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("src/renderer.html");
}

app.whenReady().then(createWindow);

ipcMain.handle("get-media-info", () => {
  try {
    const result = myaddon.getMediaInfo();
    return result;
  } catch (err) {
    return { error: err.message };
  }
});
