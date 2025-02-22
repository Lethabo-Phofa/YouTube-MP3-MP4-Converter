const express = require("express");
const cors = require("cors");
const ytdl = require("@distube/ytdl-core");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// helper function to clean YouTube URLs
const cleanUrl = (url) => {
    return url.split("?")[0]; // removes unnecessary query parameters
};

//  helper function to clean filenames
const sanitizeFilename = (title) => {
    return title.replace(/[<>:"/\\|?*]+/g, "").replace(/\s+/g, "_").substring(0, 100); // Removes invalid characters
};

// getting video details 
app.get("/video-info", async (req, res) => {
    try {
        let { url } = req.query;
        url = cleanUrl(url); // cleaning the URL

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: "Invalid YouTube URL" });
        }

        const info = await ytdl.getInfo(url);
        res.json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url, // Highest quality thumbnail
        });
    } catch (error) {
        console.error("Error fetching video info:", error);
        res.status(500).json({ error: "Failed to fetch video info" });
    }
});

// download audio 
app.get("/download/audio", async (req, res) => {
    try {
        let { url } = req.query;
        url = cleanUrl(url); 

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: "Invalid YouTube URL" });
        }

        const info = await ytdl.getInfo(url);
        const title = sanitizeFilename(info.videoDetails.title);

        res.setHeader("Content-Disposition", `attachment; filename="${title}.mp3"`);
        res.setHeader("Content-Type", "audio/mpeg");

        ytdl(url, { filter: "audioonly", quality: "highestaudio" }).pipe(res);
    } catch (error) {
        console.error("Error downloading audio:", error);
        res.status(500).json({ error: "Failed to download audio" });
    }
});

// download video 
app.get("/download/video", async (req, res) => {
    try {
        let { url } = req.query;
        url = cleanUrl(url); 

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: "Invalid YouTube URL" });
        }

        const info = await ytdl.getInfo(url);
        const title = sanitizeFilename(info.videoDetails.title);

        res.setHeader("Content-Disposition", `attachment; filename="${title}.mp4"`);
        res.setHeader("Content-Type", "video/mp4");

        ytdl(url, { quality: "highestvideo" }).pipe(res);
    } catch (error) {
        console.error("Error downloading video:", error);
        res.status(500).json({ error: "Failed to download video" });
    }
});

// starting the server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
