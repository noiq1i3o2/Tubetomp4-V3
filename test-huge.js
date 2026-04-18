import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

const instances = [
  "https://cobalt.api.zillyhuhn.com/",
  "https://cobalt.zill.yt/",
  "https://api.cobalt.easrng.net/",
  "https://cobalt.100zxy.cn/",
  "https://cobalt.kyuu.moe/",
  "https://cobalt.catterall.dev/",
  "https://dl.ohheck.dev/",
  "https://cobalt.canine.net.nz/",
  "https://co.eepy.today/"
];

const body = { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" };

async function testInstances() {
  for (const url of instances) {
    console.log("Testing POST to", url);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0"
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000)
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) {
        console.log("✅ Working:", url);
        return;
      } else {
        console.log("❌ Failed:", url, res.status);
      }
    } catch (e) {
      console.log("Network error:", url, e.message);
    }
  }
}
testInstances();
