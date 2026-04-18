async function testYt1s() {
  try {
    const res = await fetch("https://yt1s.com/api/ajaxSearch/index", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        q: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        vt: "home"
      })
    });
    const data = await res.json();
    console.log("yt1s", data);
  } catch (e) { console.error("yt1s fail", e.message); }

  try {
    const res2 = await fetch("https://tomp3.cc/api/ajax/search", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        query: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        vt: "mp4"
      })
    });
    const data2 = await res2.json();
    console.log("tomp3", data2);
  } catch (e) { console.error("tomp3 fail", e.message); }
}
testYt1s();
