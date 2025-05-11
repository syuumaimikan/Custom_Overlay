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
console.log(myaddon.getMediaInfo());
