import React, { useState } from "react";
import "./App.css";

function App() {
    const [url, setUrl] = useState("");
    const [videoInfo, setVideoInfo] = useState(null);
    const [error, setError] = useState("");
    const currentYear = new Date().getFullYear(); // Auto-update year

    const fetchVideoInfo = async () => {
        try {
            setError("");
            const res = await fetch(`http://localhost:4000/video-info?url=${encodeURIComponent(url)}`);
            const data = await res.json();

            if (data.error) {
                setError(data.error);
                setVideoInfo(null);
            } else {
                setVideoInfo(data);
            }
        } catch (err) {
            setError("Failed to fetch video info.");
        }
    };

    const handleDownload = (type) => {
        const endpoint = type === "mp3" ? "audio" : "video";
        window.location.href = `http://localhost:4000/download/${endpoint}?url=${encodeURIComponent(url)}`;
    };

    return (
        <div className="container">
            <h1>YouTube to MP3/MP4 Converter</h1>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter YouTube URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button onClick={fetchVideoInfo}>Fetch Video</button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {videoInfo && (
                <div className="video-info">
                    <h3>{videoInfo.title}</h3>
                    <img src={videoInfo.thumbnail} alt="Thumbnail" className="thumbnail" />
                    <div className="download-buttons">
                        <button onClick={() => handleDownload("mp4")}>Download MP4</button>
                        <button onClick={() => handleDownload("mp3")}>Download MP3</button>
                    </div>
                </div>
            )}

            {/* How to Use Section */}
            <div className="how-to-use">
                <h2>How to Use This App</h2>
                <ol>
                    <li>Copy the YouTube video URL from YouTube.</li>
                    <li>Paste the URL into the input field above.</li>
                    <li>Click "Fetch Video" to retrieve video details.</li>
                    <li>Select "Download MP3" for audio or "Download MP4" for video.</li>
                    <li>The download will start automatically.</li>
                </ol>
            </div>

            {/* Footer */}
            <footer className="footer">
                &copy; {currentYear} By Lethabo Thapelo Phofa
            </footer>
        </div>
    );
}

export default App;
