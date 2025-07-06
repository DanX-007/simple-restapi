const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

// MediaFire Downloader Function
async function mediafireDl(url) {
  try {
    // Validate URL
    if (!url || !url.includes('mediafire.com')) {
      return {
        status: 400,
        error: 'Invalid MediaFire URL'
      };
    }

    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const hasil = [];
    
    // Extract download information
    const link = $('a#downloadButton').attr('href');
    const size = $('a#downloadButton').text()
      .replace('Download', '')
      .replace('(', '')
      .replace(')', '')
      .replace(/\n/g, '')
      .trim();
    
    // Validate if download exists
    if (!link) {
      return {
        status: 404,
        error: 'File not found or link expired'
      };
    }

    const seplit = link.split('/');
    const nama = seplit[5] || 'unknown';
    let mime = nama.split('.');
    mime = mime.length > 1 ? mime.pop() : 'unknown';

    hasil.push({ 
      nama, 
      mime, 
      size, 
      link 
    });

    return {
      status: 200,
      data: hasil
    };
  } catch (error) {
    console.error('MediaFire error:', error);
    return {
      status: 500,
      error: 'Failed to fetch MediaFire link'
    };
  }
}

// API Endpoint
router.get('/download', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ 
      status: 400, 
      error: 'Parameter "url" is required' 
    });
  }

  try {
    const result = await mediafireDl(url);
    
    if (result.status === 200) {
      res.json({
        status: 200,
        platform: 'MediaFire',
        result: result.data[0]
      });
    } else {
      res.status(result.status).json(result);
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message
    });
  }
});


module.exports = router;