const titleElement = document.getElementById("title");
const artistElement = document.getElementById("artist");
const albumElement = document.getElementById("album-art");
const iconElement = document.getElementById("icon");
const appElement = document.getElementById("appName");
const backbtn = document.getElementById("back");
const skipbtn = document.getElementById("skip");
const pausebtn = document.getElementById("pause");

let pause_start_trrig = true;

const appFaviconMap = {
  spotify: "open.spotify.com",
  chrome: "www.google.com",
};

setInterval(async () => {
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
    const jacket_image = await window.api.getJacketImage(
      info.title,
      info.artist
    );
    albumElement.style.backgroundImage = `url(${jacket_image})`;
  }
}, 1000);

backbtn.addEventListener("click", async () => {
  const result = await window.api.mediaControl("prev");
  console.log(result);
});

skipbtn.addEventListener("click", async () => {
  const result = await window.api.mediaControl("next");
  console.log(result);
});

pausebtn.addEventListener("click", async () => {
  const result = await window.api.mediaControl("playpause");
  console.log(result);
  if (pause_start_trrig) {
    pause_start_trrig = false;
    pausebtn.textContent = "⏸";
  } else {
    pause_start_trrig = true;
    pausebtn.textContent = "⏯";
  }
});
