const path = require("path");
const fs = require("fs");

const addonPath = path.resolve(
  __dirname,
  "./tools/media_info/build/Release/media_info.node"
);

if (!fs.existsSync(addonPath)) {
  console.error("ネイティブモジュールが見つかりません:", addonPath);
  process.exit(1);
}

const myaddon = require(addonPath);
console.log(myaddon.getMediaInfo());

const axios = require("axios");
const mediaKeys = require("./tools/media_keys/build/Release/media_keys.node");
async function getCoverArt(songTitle, artistName) {
  try {
    // ① MusicBrainzからMBIDを取得
    const searchUrl = "https://musicbrainz.org/ws/2/release/";
    const query = `release:"${songTitle}" AND artist:"${artistName}"`;

    const searchRes = await axios.get(searchUrl, {
      params: { query, fmt: "json" },
      headers: { "User-Agent": "YourAppName/1.0 (your@email.com)" },
    });

    const releases = searchRes.data.releases;
    if (!releases || releases.length === 0) return null;

    const mbid = releases[0].id;

    // ② Cover Art Archiveから画像URLを取得
    const artRes = await axios.get(
      `https://coverartarchive.org/release/${mbid}`
    );

    const image = artRes.data.images.find((img) => img.front);
    return image?.image || null;
  } catch (err) {
    console.error("Cover Art API error:", err.message);
    return null;
  }
}

// 使用例
getCoverArt("ビビデバ", "星街すいせい").then((imageUrl) => {
  if (imageUrl) {
    console.log("Jacket Image URL:", imageUrl);
  } else {
    console.log("Image not found.");
  }
});

mediaKeys.playpause();
