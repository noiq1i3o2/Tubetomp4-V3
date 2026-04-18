import fs from 'fs';
const content = fs.readFileSync('yt-dlp', 'utf-8').slice(0, 500);
console.log(content);
