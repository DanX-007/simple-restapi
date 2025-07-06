const express = require('express');
const { FormData, Blob } = require('formdata-node');
const fetch = require('node-fetch');
const router = express.Router();

router.post('/transcribe', async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Audio file required' });

    const blob = new Blob([req.file.buffer], { type: 'audio/webm' });
    const form = new FormData();
    form.append('audio', blob, 'recording.mp3');

    const response = await fetch('https://api.deepdev.xyz/api/openai/transcribe', {
      method: 'POST',
      body: form
    });
    const result = await response.json();

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;