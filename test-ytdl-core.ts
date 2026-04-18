import ytdl from '@distube/ytdl-core';

async function test() {
  try {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    console.log("Found format URL:", format.url);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
