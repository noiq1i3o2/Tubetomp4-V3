import * as cheerio from "cheerio";

async function testFetchInfo() {
  try {
    const res = await fetch("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr('content');
    const image = $('meta[property="og:image"]').attr('content');
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content');
    
    console.log("Title:", title);
    console.log("Image:", image);
    console.log("Description:", description?.substring(0, 50));
  } catch (e) {
    console.log(e.message);
  }
}
testFetchInfo();
