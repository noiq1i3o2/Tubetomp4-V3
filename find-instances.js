async function findInstances() {
  try {
    const res = await fetch("https://cobalt.tools/api/instances"); // or wait, let's see where the instances are
    console.log(res.status);
    const body = await res.text();
    console.log(body.substring(0, 100));
  } catch (e) {
    console.log("error", e.message);
  }
}
findInstances();
