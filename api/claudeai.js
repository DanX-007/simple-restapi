const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

const router = express.Router();

class Claude {
  constructor(cookie) {
    this.cookie = cookie;
    this.organizationId = undefined;
  }

  getHeaders() {
    return {
      accept: "text/event-stream, text/event-stream",
      "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      baggage: "sentry-environment=production,sentry-release=7056d48863ef1ff17036d5f9a9ce84133c63abfc,sentry-public_key=58e9b9d0fc244061a1b54fe288b0e483,sentry-trace_id=963e5c5cde6a43219b5c61e9fd8b5be6",
      "content-type": "application/json",
      "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sentry-trace": "963e5c5cde6a43219b5c61e9fd8b5be6-b9f5b45af75131c2-0",
      cookie: this.cookie,
      Referer: "https://claude.ai/chats"
    };
  }

  async getOrganizationId() {
    try {
      const response = await fetch("https://claude.ai/api/organizations", {
        headers: this.getHeaders()
      });
      const res = await response.json();
      return res;
    } catch (e) {
      throw new Error(`Failed to get organization ID: ${e.message}`);
    }
  }

  async createConversation() {
    try {
      const organizationId = await this.getOrganizationId();
      this.organizationId = organizationId;
      const response = await fetch(
        `https://claude.ai/api/organizations/4cc4ea19-f8da-4afa-8a97-ce3e15c61d6d/chat_conversations`,
        {
          headers: this.getHeaders(),
          method: "POST",
          body: JSON.stringify({
            uuid: uuidv4(),
            name: ""
          })
        }
      );
      return await response.json();
    } catch (e) {
      throw new Error(`Failed to create conversation: ${e.message}`);
    }
  }

  async chat(text) {
    try {
      const chat = await this.createConversation();
      const response = await fetch(
        `https://claude.ai/api/organizations/4cc4ea19-f8da-4afa-8a97-ce3e15c61d6d/chat_conversations/de37331e-19d3-4bb6-9e39-18f9400b9ac1/completion`,
        {
          headers: this.getHeaders(),
          method: "POST",
          body: JSON.stringify({
            prompt: text,
            timezone: "Asia/Jakarta",
            model: "claude-2.1",
            attachments: [],
            files: []
          })
        }
      );
      
      const data = await response.text();
      const regex = /"completion":"(.*?)"/g;
      let matches = [];
      let match;

      while ((match = regex.exec(data)) !== null) {
        matches.push(match[1]);
      }
      
      const textResult = matches.join("").replace(/ +/g, " ").trim();
      return { 
        status: 200,
        result: textResult.replace(/\\n/g, '\n') 
      };
    } catch (e) {
      console.error("Claude chat error:", e);
      return {
        status: 500,
        error: `Failed to get response from Claude: ${e.message}`
      };
    }
  }
}

// API Endpoints
router.post('/chat', async (req, res) => {
  const { text } = req.body;
  const cookie = `154.201.58.41:3128|bypass=1; cf_clearance=ka_2gY5YzNy.hRa7IR5YNuNxvnN6uOvMgg.kvd2oAVQ-1694890828-0-1-735201e3.bc6a1dee.24535e03-250.0.0; cf_chl_2=27cbc156255b1de|Mozilla/5.0 (Linux; Android 10; LM-Q710(FGN)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5790.166 Mobile Safari/537.36`
  if (!text) {
    return res.status(400).json({ 
      status: 400, 
      error: 'Parameters "text" are required in the request body' 
    });
  }

  try {
    const claude = new Claude(cookie);
    const response = await claude.chat(text);
    
    if (response.status === 200) {
      res.json({
        status: 200,
        model: "claude-2.1",
        response: response.result
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