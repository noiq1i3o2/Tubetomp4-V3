import { videoInfo } from 'youtube-ext';

async function test() {
  try {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const info = await videoInfo(url);
    console.log("Formats:", info.stream.length);
    console.log("First URL:", info.stream[0].url.substring(0, 50));
  } catch (err) {
    console.error("Error:", err.message);
  }
}
test();
