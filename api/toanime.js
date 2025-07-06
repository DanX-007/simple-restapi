const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/image/anime', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Image URL required' });

    const { data } = await axios.post(
      'https://tools.revesery.com/image-anime/convert.php',
      new URLSearchParams({ 'image-url': url }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;