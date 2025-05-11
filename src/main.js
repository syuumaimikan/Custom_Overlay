const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const scripts = require("./scripts");

const CACHE_FILE_PATH = path.join(__dirname, "mediaCache.json");

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

// キャッシュの取得
function getCache(artist_name, music_name) {
  if (!fs.existsSync(CACHE_FILE_PATH)) return false;

  const fileData = fs.readFileSync(CACHE_FILE_PATH, "utf8");
  const cache = JSON.parse(fileData);

  for (const entry of cache.datas) {
    const hasMatch = entry.data.some(
      (d) => d.artist_name === artist_name && d.music_name === music_name
    );
    if (hasMatch) return true;
  }

  return false;
}

function saveCache(music_name, artist_name, img_url) {
  const newEntry = {
    data: [
      {
        music_name,
        artist_name,
        img_url,
      },
    ],
    timestamp: Date.now(),
  };

  let cache = { datas: [] };

  if (fs.existsSync(CACHE_FILE_PATH)) {
    const fileData = fs.readFileSync(CACHE_FILE_PATH, "utf8");
    cache = JSON.parse(fileData);

    const exists = cache.datas.some((entry) =>
      entry.data.some(
        (d) => d.music_name === music_name && d.artist_name === artist_name
      )
    );

    if (exists) return false;
  }

  cache.datas.push(newEntry);
  fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), "utf8");
  return true;
}

ipcMain.handle("get-media-info", () => {
  try {
    const result = myaddon.getMediaInfo();
    return result;
  } catch (err) {
    return { error: err.message };
  }
});

ipcMain.handle("get-media-img", async (event, music_name, artist_name) => {
  const cached = getCache(artist_name, music_name);
  if (!cached) {
    const result = await scripts.getJacketImage(music_name, artist_name);
    saveCache(music_name, artist_name, result);
    console.log("cached new image");
    return result;
  } else {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const fileData = fs.readFileSync(CACHE_FILE_PATH, "utf8");
      const cache = JSON.parse(fileData);
      for (const entry of cache.datas) {
        for (const item of entry.data) {
          if (
            item.music_name === music_name &&
            item.artist_name === artist_name
          ) {
            return item.img_url;
          }
        }
      }
    }
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
