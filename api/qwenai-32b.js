const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

// DeepSeekThink Implementation
const deepSeekThink = {
  chat: async (question) => {
    let d = new FormData();
    d.append("content", `User: ${question}`);
    d.append("model", "@groq/deepseek-r1-distill-qwen-32b");

    try {
      let { data } = await axios.post("https://mind.hydrooo.web.id/v1/chat", d, {
        headers: d.getHeaders()
      });
      
      console.log("Full API Response:", JSON.stringify(data, null, 2));
      return data.result || data.full_result || JSON.stringify(data);
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error("Gagal mengambil jawaban dari AI.");
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
        const response = await deepSeekThink.chat(content);
        res.json({ 
            status: 200, 
            model: "deepseek-r1-distill-qwen-32b",
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