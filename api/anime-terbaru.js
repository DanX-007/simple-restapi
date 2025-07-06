const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();


const BASE_URL = "https://samehadaku.mba/anime-terbaru/";

async function animeBaru() {
  try {
    const { data } = await axios.get(BASE_URL);
    const $ = cheerio.load(data);
    const posts = [];

    $(".post-show li").each((index, element) => {
      const title = $(element).find(".entry-title a").attr("title")?.trim();
      const link = $(element).find(".entry-title a").attr("href")?.trim();
      const date = $(element)
        .find(".dashicons-calendar")
        .parent()
        .text()
        .replace("Released on:", "")
        .trim();

      if (title && link && date) {
        posts.push({ title, date, link });
      }
    });

    return posts;
  } catch (error) {
    console.error("Error fetching anime terbaru:", error.message);
    return [];
  }
}

// API Endpoint
router.get('/', async (req, res) => {
    try {
        const animeList = await animeBaru();
        res.json({ 
            status: 200, 
            data: animeList
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message
        });
    }
});

module.exports = router;