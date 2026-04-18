async function testOembed() {
  try {
    const res = await fetch("https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&format=json");
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.log("Error:", e.message);
  }
}
testOembed();
