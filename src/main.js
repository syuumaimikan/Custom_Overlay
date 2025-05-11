const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const scripts = require("./scripts");

const addonPath = path.resolve(
  __dirname,
  "../tools/media_info/build/Release/media_info.node"
);

if (!fs.existsSync(addonPath)) {
  console.error("ネイティブモジュールが見つかりません:", addonPath);
  process.exit(1);
}

const myaddon = require(addonPath);
const key_addon = require("../tools/media_keys/build/Release/media_keys.node");

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

ipcMain.handle("get-media-img", async (event, music_name, artist_name) => {
  try {
    const result = await scripts.getJacketImage(music_name, artist_name);
    return result;
  } catch (err) {
    return { error: err.message };
  }
});

ipcMain.handle("media-control", (event, action) => {
  try {
    if (action === "next") {
      key_addon.next();
    } else if (action === "prev") {
      key_addon.prev();
    } else if (action === "playpause") {
      key_addon.playpause();
    }
    return { status: "success" };
  } catch (error) {
    return { error: error.message };
  }
});
