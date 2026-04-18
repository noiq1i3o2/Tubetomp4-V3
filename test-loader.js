async function testLoaderTo() {
  try {
    const res = await fetch("https://loader.to/ajax/download.php?format=1080&url=https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    const data = await res.json();
    console.log(data);
    
    if (data.id) {
        // check status
        const statusRes = await fetch(`https://loader.to/ajax/progress.php?id=${data.id}`);
        const statusData = await statusRes.json();
        console.log(statusData);
    }
  } catch (e) {
    console.error(e.message);
  }
}
testLoaderTo();
