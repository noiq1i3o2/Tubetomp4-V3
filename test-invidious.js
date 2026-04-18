const instances = [
  "https://vid.puffyan.us",
  "https://invidious.slipfox.xyz",
  "https://invidious.fdn.fr",
  "https://yewtu.be",
  "https://invidious.flokinet.to",
  "https://invidious.nerdvpn.de"
];

const videoId = "dQw4w9WgXcQ";

async function testInvidious() {
  for (const url of instances) {
    console.log("Testing", url);
    try {
      const res = await fetch(`${url}/api/v1/videos/${videoId}`);
      if (res.ok) {
        const data = await res.json();
        const formats = data.formatStreams || [];
        console.log("✅ Working:", url, "Formats found:", formats.length);
        if (formats.length > 0) {
          console.log("Example format URL:", formats[0].url.substring(0, 50) + "...");
          return;
        }
      } else {
        console.log("❌ Failed:", url, res.status);
      }
    } catch (e) {
      console.log("Network error:", url, e.message);
    }
  }
}
testInvidious();
