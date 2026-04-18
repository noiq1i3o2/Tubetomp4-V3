const instances = [
  "https://co.wuk.sh/api/json",
  "https://cobalt.seasi.dev/api/json",
  "https://cobalt-api.kwiatechu.dev/api/json",
  "https://cobalt.100zxy.cn/api/json",
  "https://cobalt.tools/api/json"
];

const body = { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" };

async function testInstances() {
  for (const url of instances) {
    console.log("Testing", url);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
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
