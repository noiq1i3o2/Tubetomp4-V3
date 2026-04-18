async function testLoaderTo() {
  try {
    const res = await fetch("https://loader.to/ajax/download.php?format=1080&url=https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    const data = await res.json();
    console.log("Started", data.id);
    
    if (data.id) {
        while (true) {
            const statusRes = await fetch(`https://loader.to/ajax/progress.php?id=${data.id}`);
            const statusData = await statusRes.json();
            console.log("Poll", statusData.progress, statusData.text);
            if (statusData.success === 1 || statusData.download_url) {
                console.log("DONE", statusData.download_url);
                break;
            }
            if (statusData.success === 0 && statusData.text === "Error") {
                console.log("FAILED");
                break;
            }
            await new Promise(r => setTimeout(r, 2000));
        }
    }
  } catch (e) {
    console.error(e.message);
  }
}
testLoaderTo();
