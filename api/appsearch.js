const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const router = express.Router();

// Helper functions
function generateList(array) {
  return array.map((item, index) => `${index + 1}. ${item}`).join('\n');
}

function addNewline(text) {
  return text.replace(/•/g, '\n•');
}

// Search apps on PlayMods
async function searchApp(q) {
  try {
    const url = 'https://m.playmods.net/id/search/' + encodeURIComponent(q);
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const dataArray = [];

    $('a.beautify.ajax-a-1').each((index, element) => {
      const $element = $(element);

      const data = {
        link: 'https://m.playmods.net' + $element.attr('href'),
        title: $element.find('.common-exhibition-list-detail-name').text().trim(),
        menu: $element.find('.common-exhibition-list-detail-menu').text().trim(),
        detail: $element.find('.common-exhibition-list-detail-txt').text().trim(),
        image: $element.find('.common-exhibition-list-icon img').attr('data-src'),
        downloadText: $element.find('.common-exhibition-line-download').text().trim(),
      };

      dataArray.push(data);
    });

    return dataArray;
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Failed to search apps');
  }
}

// Get app details
async function getApp(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const data = {
      title: $('h1.name').text().trim(),
      image: $('.icon').attr('src'),
      name: $('.app-name span').text().trim(),
      score: $('.score').text().trim(),
      edisi: $('.edition').text().trim(),
      size: $('.size .operate-cstTime').text().trim(),
      create: $('.size span').text().trim(),
      link: $('a.a_download').attr('href'),
      detail: $('.game-describe-gs').text().trim(),
      screenshots: $('.swiper-slide img').map((index, element) => $(element).attr('data-src')).get(),
      describe: $('.datail-describe-pre div').text().trim(),
    };

    return data;
  } catch (error) {
    console.error('App details error:', error);
    throw new Error('Failed to get app details');
  }
}

// API Endpoints
router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ 
      status: 400, 
      error: 'Parameter "q" (query) is required' 
    });
  }

  try {
    const results = await searchApp(q);
    res.json({ 
      status: 200,
      results
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message
    });
  }
});

router.get('/app', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ 
      status: 400, 
      error: 'Parameter "url" is required' 
    });
  }

  try {
    const appDetails = await getApp(url);
    res.json({ 
      status: 200,
      data: appDetails
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message
    });
  }
});


module.exports = router;