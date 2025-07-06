const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// Load API keys from JSON file
const apiKeysPath = path.join(__dirname, 'user', 'key.json');
let apiKeys = [];

try {
  const data = fs.readFileSync(apiKeysPath, 'utf8');
  apiKeys = JSON.parse(data);
  console.log('API keys loaded successfully');
} catch (err) {
  console.error('Error loading API keys:', err);
  process.exit(1);
}

let totalRequests = 0;
let clients = [];

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Request counter middleware
app.use((req, res, next) => {
  totalRequests++;
  sendUpdateToClients();
  next();
});

// API Key authentication middleware
const apiKeyAuth = async (req, res, next) => {
  const providedKey = req.headers['x-api-key'] || req.query.apikey;
  
  if (!providedKey) {
    return res.status(401).json({ 
      status: false,
      message: 'API key diperlukan'
    });
  }

  const userKey = apiKeys.find(key => key.apikey === providedKey);
  
  if (!userKey) {
    return res.status(403).json({
      status: false,
      message: 'API key tidak valid'
    });
  }

  // Check usage limit
  if (userKey.usage >= userKey.limit) {
    return res.status(429).json({
      status: false,
      message: 'Limit penggunaan API telah habis'
    });
  }

  // Update usage count
  userKey.usage += 1;
  saveApiKeys();

  // Attach user info to request
  req.user = {
    email: userKey.email,
    remaining: userKey.limit - userKey.usage
  };

  next();
};

// Save API keys to file
function saveApiKeys() {
  try {
    fs.writeFileSync(apiKeysPath, JSON.stringify(apiKeys, null, 2));
  } catch (err) {
    console.error('Error saving API keys:', err);
  }
}

// Daily reset function (run this on server start and schedule it)
function resetDailyUsage() {
  const today = new Date().toISOString().split('T')[0];
  
  apiKeys.forEach(key => {
    if (key.lastReset !== today) {
      key.usage = 0;
      key.lastReset = today;
    }
  });
  
  saveApiKeys();
}

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/monitor-page", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "monitor", "monitor.html"));
});

app.get("/monitor", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  clients.push(newClient);

  res.write(`data: ${JSON.stringify({ totalRequests })}\n\n`);

  req.on("close", () => {
    clients = clients.filter(client => client.id !== clientId);
  });
});

// Add this with your other routes
app.get('/api/check-key', (req, res) => {
    const providedKey = req.query.apikey;
    
    if (!providedKey) {
        return res.json({ valid: false });
    }

    const userKey = apiKeys.find(key => key.apikey === providedKey);
    
    if (!userKey) {
        return res.json({ valid: false });
    }

    res.json({
        valid: true,
        email: userKey.email,
        limit: userKey.limit,
        usage: userKey.usage,
        remaining: userKey.limit - userKey.usage
    });
});


// API routes with API key protection
const routes = ["ytdl", "twitterdl", "igdl", "fbdl", "ttdl", "githubstalk", 
  "searchgroups", "ttsearch", "ytsearch", "llama-3.3-70b-versatile", 
  "txt2img", "ssweb", "translate", "nulis", "cekkhodam", "tahukahkamu", 
  "brat", "qc", "detiknews", "deepseek-70b", "qwenai-32b", "anime-terbaru", "bardai", "bardimg", "appsearch", "capcut", "chatgpt", "claudeai", "gemini", "igstalk", "mediafire", "pinterest", "spotify", "spotify-dl", "transcribe", "toanime"];

routes.forEach(route => {
  app.use(`/api/${route}`, apiKeyAuth, require(`./api/${route}`));
});


// SSE updates
function sendUpdateToClients() {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify({ totalRequests })}\n\n`);
  });
}

// Initialize and start server
resetDailyUsage(); // Reset usage on server start
setInterval(resetDailyUsage, 24 * 60 * 60 * 1000); // Reset daily

const port = process.env.PORT || 2503;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server berjalan di port ${port}`);
});

module.exports = app; 