import fs from 'fs';
import https from 'https';

async function download() {
  const file = fs.createWriteStream("yt-dlp");
  https.get("https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux", function(response) {
    if (response.statusCode === 302) {
      https.get(response.headers.location, function(res) {
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("Download completed");
        });
      });
    } else {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log("Download completed");
      });
    }
  });
}
download();
