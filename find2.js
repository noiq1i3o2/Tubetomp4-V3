async function find() {
  try {
    const res = await fetch("https://instances.cobalt.tools/api/instances");
    const text = await res.text();
    console.log(text.substring(0, 100));
  } catch (e) { console.log(e.message); }
}
find();
