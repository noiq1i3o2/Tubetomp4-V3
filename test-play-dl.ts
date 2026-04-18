import play from 'play-dl';

async function test() {
  try {
    const stream = await play.stream("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    console.log("Success! Stream URL:", stream.url);
  } catch (err) {
    console.error("Fail:", err);
  }
}
test();
