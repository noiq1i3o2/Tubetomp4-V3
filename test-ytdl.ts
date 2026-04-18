import { create } from 'youtube-dl-exec';

const youtubedl = create('/app/applet/node_modules/youtube-dl-exec/bin/yt-dlp');

async function test() {
  try {
    const rawOutput = await youtubedl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
      dumpJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      youtubeSkipDashManifest: true
    });
    
    console.log("Success, got info!");
    console.log("URL:", rawOutput.url ? "Found direct URL" : "No direct URL");
    console.log("Formats:", rawOutput.formats ? rawOutput.formats.length : 0);
  } catch (err) {
    console.error("Error running yt-dlp:", err);
  }
}

test();
