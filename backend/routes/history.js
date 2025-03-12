const express = require('express');
const router = express.Router();
const { getUserStories } = require('../services/databaseService');

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // اعتبارسنجی پارامترهای pagination
  if (page < 1 || limit < 1 || limit > 50) {
    return res.status(400).json({ 
      error: 'Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 50' 
    });
  }

  try {
    const result = await getUserStories(userId, page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
