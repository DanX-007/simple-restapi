const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

// Instagram Stalker Function
async function igstalk(username) {
  try {
    const { data } = await axios.get(`https://dumpoir.com/v/${username}`, {
      headers: {
        "cookie": "_inst_key=SFMyNTY.g3QAAAABbQAAAAtfY3NyZl90b2tlbm0AAAAYWGhnNS1uWVNLUU81V1lzQ01MTVY2R0h1.fI2xB2dYYxmWqn7kyCKIn1baWw3b-f7QvGDfDK2WXr8",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
      }
    });

    const $ = cheerio.load(data);
    
    // Extract profile picture URL
    const profilePicStyle = $('#user-page > div.user > div.row > div > div.user__img').attr('style') || '';
    const profilePic = profilePicStyle.replace(/(background-image: url\(\'|\'\);)/gi, '');

    // Validate if user exists
    if (!profilePic) {
      return {
        status: 404,
        error: 'User not found or private account'
      };
    }

    const result = {
      status: 200,
      data: {
        profile: profilePic,
        fullname: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > div > a > h1').text().trim(),
        username: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > div > h4').text().trim(),
        post: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(1)').text().replace(' Posts','').trim(),
        followers: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(2)').text().replace(' Followers','').trim(),
        following: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(3)').text().replace(' Following','').trim(),
        bio: $('#user-page > div.user > div > div.col-md-5.my-3 > div').text().trim()
      }
    };

    return result;
  } catch (error) {
    console.error('Instagram Stalk error:', error);
    return {
      status: 500,
      error: 'Failed to fetch Instagram data'
    };
  }
}

// API Endpoint
router.get('/stalk', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ 
      status: 400, 
      error: 'Parameter "username" is required' 
    });
  }

  try {
    const result = await igstalk(username);
    
    if (result.status === 200) {
      res.json({
        status: 200,
        platform: 'Instagram',
        ...result.data
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

// Credit information
router.get('/credits', (req, res) => {
  res.json({
    developer: {
      whatsapp: "https://wa.me/6282285357346",
      github: "https://github.com/sadxzyq",
      instagram: "https://instagram.com/tulisan.ku.id"
    },
    note: "Ini watermark saya, jangan dihapus"
  });
});

module.exports = router;