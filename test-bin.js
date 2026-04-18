import { execSync } from 'child_process';
import fs from 'fs';

try {
  fs.chmodSync('yt-dlp', '755');
  const out = execSync('./yt-dlp --version', { encoding: 'utf-8' });
  console.log("yt-dlp version:", out);
} catch (e) {
  console.error("error:", e.message);
}
