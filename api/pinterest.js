const express = require('express');
const gis = require('g-i-s');
const router = express.Router();

async function pinterest(query) {
  try {
    const results = await new Promise((resolve) => {
      gis({ searchTerm: query + ' site:id.pinterest.com' }, (er, res) => {
        resolve(er ? [] : res);
      });
    });
    return {
      status: 200,
      data: results.map(x => x.url)
    };
  } catch (error) {
    return {
      status: 500,
      error: 'Failed to fetch Pinterest images'
    };
  }
}

router.get('/pinterest', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query parameter required' });
  
  const result = await pinterest(query);
  res.status(result.status).json(result);
});

module.exports = router;