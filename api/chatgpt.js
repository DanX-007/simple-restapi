const express = require('express');
const axios = require('axios');

const router = express.Router();

// ChatGPT Implementation
const ChatGpt = {
  chat: async (text) => {
    try {
      const { data } = await axios.post(
        'https://onlinegpt.org/wp-json/mwai-ui/v1/chats/submit',
        {
          botId: "default",
          newMessage: text,
          stream: false
        },
        {
          headers: {
            "Accept": "text/event-stream",
            "Content-Type": "application/json"
          }
        }
      );
      
      return {
        status: 200,
        response: data
      };
    } catch (error) {
      console.error("ChatGPT API Error:", error.response?.data || error.message);
      return {
        status: 500,
        error: error.response?.data?.message || "Failed to get response from ChatGPT"
      };
    }
  }
};

// API Endpoint
router.post('/chat', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ 
      status: 400, 
      error: 'Parameter "text" is required in the request body' 
    });
  }

  try {
    const response = await ChatGpt.chat(text);
    if (response.status === 200) {
      res.json({
        status: 200,
        model: "ChatGPT",
        response: response.response
      });
    } else {
      res.status(response.status).json(response);
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message
    });
  }
});

module.exports = router;