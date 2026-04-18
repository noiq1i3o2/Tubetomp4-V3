const instances = [
  "https://co.wuk.sh/",
  "https://cobalt.seasi.dev/",
  "https://cobalt-api.kwiatechu.dev/",
  "https://api.cobalt.tools/"
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
        body: JSON.stringify(body)
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        console.log("✅ Working:", url, data);
        return;
      } else {
        console.log("❌ Failed:", url, res.status, data);
      }
    } catch (e) {
      console.log("Network error:", url, e.message);
    }
  }
}
testInstances();
