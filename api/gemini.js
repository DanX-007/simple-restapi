const express = require('express');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const router = express.Router();

class Gemini {
  constructor(key, apikey) {
    this.conversation_id = '';
    this.response_id = '';
    this.choice_id = '';
    this.image_url = null;
    this.image_name = null;
    this.tools = [];
    this.params = { bl: '', _reqid: '', rt: 'c' };
    this.data = { 'f.req': '', at: '' };
    this.post_url = 'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate';
    this.headers = this.setupHeaders(key, apikey);
  }
  
  setupHeaders(key, apikey) {
    return {
      "Host": "gemini.google.com",
      "X-Same-Domain": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      "Origin": "https://gemini.google.com",
      "Referer": "https://gemini.google.com/",
      "Cookie": `${key || '__Secure-1PSID'}=${apikey || 'g.a000gQhbTE4WvC7mwVL4CcWSxbt1Bde7Ady6qpt6951pafinWART4EEKmcskZMFX08uuSKwbvAACgYKAVYSAQASFQHGX2Mi1KAIQT0oz9dXZXKy0ioMBBoVAUF8yKpem3c3iJtHRDMQF3nSHOxU0076'}`
    };
  }
  
  async question(query) {
    try {
      // Initial request to get tokens
      const response = await fetch('https://gemini.google.com/', { 
        method: 'GET', 
        headers: this.headers 
      });
      const geminiText = await response.text();
      
      // Extract required tokens
      const snlM0e = geminiText.match(/"SNlM0e":"(.*?)"/)?.[1] || '';
      const blValue = geminiText.match(/"cfb2h":"(.*?)"/)?.[1] || '';

      if (!snlM0e || !blValue) {
        throw new Error('Failed to authenticate with Gemini. Check your API key.');
      }

      this.data.at = snlM0e;
      this.params.bl = blValue;

      // Prepare request data
      const req_id = parseInt(Math.random().toString().slice(2, 6));
      const imageList = this.image_url ? [[[this.image_url, 1], this.image_name]] : [];
      
      const requestArray = [
        [query, 0, null, imageList, null, null, 0],
        ["en"],
        [this.conversation_id, this.response_id, this.choice_id, null, null, []],
        null, null, null, [1], 0, [], this.tools, 1, 0
      ];

      this.params._reqid = String(req_id);
      this.data['f.req'] = JSON.stringify([null, JSON.stringify(requestArray)]);
      
      // Make the POST request
      const postData = `f.req=${encodeURIComponent(this.data['f.req'])}&at=${this.data.at}`;
      const urlWithParams = `${this.post_url}?${new URLSearchParams(this.params)}`;
      
      const responsePost = await fetch(urlWithParams, { 
        method: 'POST', 
        headers: this.headers, 
        body: postData 
      });

      if (!responsePost.ok) {
        throw new Error(`Request failed with status ${responsePost.status}`);
      }
      
      // Parse the response
      const responseText = await responsePost.text();
      const lines = responseText.split('\n');
      const resp_dict = JSON.parse(lines[3])[0][2];
      
      if (!resp_dict) {
        throw new Error('Invalid response from Gemini');
      }

      const parsed_answer = JSON.parse(resp_dict);
      
      // Update conversation state
      this.conversation_id = parsed_answer[1][0];
      this.response_id = parsed_answer[1][1];
      this.choice_id = parsed_answer[4][0][0];
      
      return {
        status: 200,
        content: parsed_answer[4][0][1][0],
        conversation_id: this.conversation_id,
        response_id: this.response_id,
        choices: parsed_answer[4].map((i) => ({
          id: i[0],
          content: i[1]
        })),
        metadata: {
          factualityQueries: parsed_answer[3],
          textQuery: parsed_answer[2]?.[0] || ''
        }
      };
    } catch (error) {
      console.error('Gemini error:', error);
      return {
        status: 500,
        error: error.message
      };
    }
  }
}

// API Endpoints
router.post('/ask', async (req, res) => {
  const { query, key, apikey, image_url, image_name } = req.body;

  if (!query) {
    return res.status(400).json({
      status: 400,
      error: 'Query parameter is required'
    });
  }

  try {
    const gemini = new Gemini(key, apikey);
    
    if (image_url) {
      gemini.image_url = image_url;
      gemini.image_name = image_name || 'uploaded_image';
    }
    
    const response = await gemini.question(query);
    
    if (response.status === 200) {
      res.json({
        status: 200,
        model: "Gemini",
        ...response
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