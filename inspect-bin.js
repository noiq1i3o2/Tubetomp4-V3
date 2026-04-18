import fs from 'fs';
try {
  const content = fs.readFileSync('/app/applet/node_modules/youtube-dl-exec/bin/yt-dlp', 'utf-8').slice(0, 500);
  console.log("Starts with:");
  console.log(content);
} catch (e) {
  console.log("Error:", e.message);
}
