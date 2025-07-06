const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

// Google Bard Implementation
const GoogleBard = {
  chat: async (query) => {
    const COOKIE_KEY = "fgg7UYYwis5OvPgxNYcRGUdHBcFcgN8CSm6_EoykSi5Yd3j30apBYKRdQ9ftCbpm5ClI6g.";
    const psidCookie = '__Secure-1PSID=' + COOKIE_KEY;
    
    const headers = {
      "Host": "bard.google.com",
      "X-Same-Domain": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Origin": "https://bard.google.com",
      "Referer": "https://bard.google.com",
      "Cookie": psidCookie
    };

    try {
      // First request to get SNlM0e and bl values
      const bardRes = await axios.get("https://bard.google.com/", { headers });
      const bardText = bardRes.data;

      const snlM0e = bardText.match(/"SNlM0e":"(.*?)"/)?.[1];
      const blValue = bardText.match(/"cfb2h":"(.*?)"/)?.[1];

      if (!snlM0e || !blValue) {
        throw new Error("Failed to extract required tokens from Bard response");
      }

      const bodyData = `f.req=[null,"[[\\"${encodeURIComponent(query)}\\"],null,[\\"\\",\\"\\",\\"\\"]]\"]&at=${snlM0e}`;
      
      // Second request to get the actual response
      const response = await axios.post(
        `https://bard.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=${blValue}&_reqid=229189&rt=c`,
        bodyData,
        { headers }
      );

      // Process the response to extract the answer
      const responseText = response.data;
      const lines = responseText.split("\n");
      const longestLine = lines.reduce((a, b) => (a.length > b.length ? a : b), "");
      
      try {
        const parsedResponse = JSON.parse(JSON.parse(longestLine)[0][2]);
        const answer = parsedResponse[4][0][1];
        return answer;
      } catch (parseError) {
        console.error("Error parsing Bard response:", parseError);
        throw new Error("Failed to parse Bard response");
      }
    } catch (error) {
      console.error("Bard API Error:", error.response?.data || error.message);
      throw new Error("Gagal mengambil jawaban dari Google Bard.");
    }
  }
};

// API Endpoint
router.get('/', async (req, res) => {
    const { content } = req.query;

    if (!content) {
        return res.status(400).json({ 
            status: 400, 
            error: 'Parameter "content" tidak boleh kosong' 
        });
    }

    try {
        const response = await GoogleBard.chat(content);
        res.json({ 
            status: 200, 
            model: "Google Bard",
            response 
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message
        });
    }
});


module.exports = router;