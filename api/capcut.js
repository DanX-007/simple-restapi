const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const router = express.Router();

// CapCut Scraper Functions
async function capcut(url) {
  try {
    const response = await fetch(url);
    const data = await response.text();
    const $ = cheerio.load(data);

    return {
      status: 200,
      result: {
        nama: $("img").attr("alt"),
        used: $("b").text().replace($("img").attr("alt"), ""),
        thumbnail: $("img").attr("src"),
        video: $("video").attr("src"),
      }
    };
  } catch (error) {
    console.error('CapCut error:', error);
    throw new Error('Failed to fetch CapCut data');
  }
}

async function capcutdl(Url) {
  try {
    const token = Url.match(/\d+/)[0];
    const { data } = await axios({
      url: `https://ssscapcut.com/api/download/${token}`,
      method: 'GET',
      headers: {
        'Accept': '/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; CPH2217 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/110.0.5481.153 Mobile Safari/537.36',
        'X-Requested-With': 'acr.browser.barebones',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://ssscapcut.com/',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cookie': 'sign=2cbe441f7f5f4bdb8e99907172f65a42; device-time=1685437999515'
      }
    });

    return {
      status: 200,
      result: data
    };
  } catch (error) {
    console.error('CapCut DL error:', error);
    throw new Error('Failed to download CapCut video');
  }
}

// API Endpoints
router.get('/info', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ 
      status: 400, 
      error: 'Parameter "url" is required' 
    });
  }

  try {
    const result = await capcut(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message
    });
  }
});

router.get('/download', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ 
      status: 400, 
      error: 'Parameter "url" is required' 
    });
  }

  try {
    const result = await capcutdl(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message
    });
  }
});


module.exports = router;