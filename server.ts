import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import * as cheerio from "cheerio";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy endpoint to bypass browser CORS restrictions
  app.get("/api/loader/download", async (req, res) => {
    try {
      const { format, url } = req.query;
      const loaderRes = await fetch(`https://loader.to/ajax/download.php?format=${format}&url=${encodeURIComponent(url as string)}`);
      const data = await loaderRes.json();
      res.status(loaderRes.status).json(data);
    } catch (error: any) {
      console.error("Downloader init proxy error:", error);
      res.status(500).json({ status: "error", error: { message: "Server encountered an error while contacting the download service." } });
    }
  });

  app.get("/api/loader/progress", async (req, res) => {
    try {
      const { id } = req.query;
      const loaderRes = await fetch(`https://loader.to/ajax/progress.php?id=${id}`);
      const data = await loaderRes.json();
      res.status(loaderRes.status).json(data);
    } catch (error: any) {
      console.error("Downloader progress proxy error:", error);
      res.status(500).json({ status: "error", error: { message: "Server encountered an error while contacting the download service metadata." } });
    }
  });

  app.get("/api/video-info", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "Missing or invalid url parameter" });
      }

      // 1. Fetch from official YouTube oEmbed API
      // This circumvents consent bots and headless scraping blocks beautifully
      const cleanUrl = encodeURIComponent(url);
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${cleanUrl}&format=json`);
      
      if (!oembedRes.ok) {
        throw new Error("oEmbed failed to fetch");
      }

      const oembedData = await oembedRes.json();
      
      // Upgrade oembed thumbnail to high quality if possible by replacing hqdefault with maxresdefault
      let hqThumbnail = oembedData.thumbnail_url;
      if (hqThumbnail && hqThumbnail.includes("hqdefault")) {
          hqThumbnail = hqThumbnail.replace("hqdefault", "maxresdefault");
      }

      res.json({ 
        title: oembedData.title || "Unknown Video", 
        image: hqThumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80", 
        description: `A video by ${oembedData.author_name || 'YouTube Creator'}` 
      });
    } catch (error: any) {
      console.error("Video Info error:", error);
      res.status(500).json({ error: "Failed to fetch video info" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
