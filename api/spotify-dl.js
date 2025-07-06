const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/spotify/download', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL parameter required' });

    // Step 1: Get download task ID
    const taskRes = await axios.get(
      `https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`,
      {
        headers: {
          'Referer': 'https://spotifydownload.org/',
          'Accept': 'application/json'
        }
      }
    );

    // Step 2: Get download URL
    const dlRes = await axios.get(
      `https://api.fabdl.com/spotify/mp3-convert-task/${taskRes.data.result.gid}/${taskRes.data.result.id}`,
      {
        headers: {
          'Referer': 'https://spotifydownload.org/',
          'Accept': 'application/json'
        }
      }
    );

    res.json({
      title: taskRes.data.result.name,
      artist: taskRes.data.result.artists,
      duration: taskRes.data.result.duration_ms,
      download: `https://api.fabdl.com${dlRes.data.result.download_url}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;