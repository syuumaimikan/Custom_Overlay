const axios = require("axios");

async function getJacketImage(songTitle, artistName) {
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

// 👇 これを追加
module.exports = {
  getJacketImage,
};
