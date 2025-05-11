const titleElement = document.getElementById("title");
const artistElement = document.getElementById("artist");
const albumElement = document.getElementById("album-art");
const iconElement = document.getElementById("icon");
const appElement = document.getElementById("appName");
const appFaviconMap = {
  spotify: "open.spotify.com",
  chrome: "www.google.com",
  // 他のアプリも追加可能
};

document.getElementById("myButton").addEventListener("click", async () => {
  const info = await window.api.getMediaInfo();

  if (info.error) {
    titleElement.innerText = `エラー: ${info.error}`;
  } else {
    const rawAppName = info.app?.replace(".exe", "").toLowerCase();
    appName = appFaviconMap[rawAppName] || "";
    const appIconURL = `https://${appName}/favicon.ico`;
    if (appName) {
      iconElement.style.backgroundImage = appIconURL
        ? `url(${appIconURL})`
        : "none";
      appElement.innerText = rawAppName;
    } else {
      iconElement.style.backgroundImage = "none";
    }
    titleElement.innerText = info.title;
    artistElement.innerText = info.artist;
    albumElement.innerText = info.album;
  }
});
