const express = require('express');
const router = express.Router();
const { updateStoryRating } = require('../services/databaseService');

router.post('/', async (req, res) => {
  const { storyId, rating } = req.body;

  if (!storyId || rating === undefined) {
    return res.status(400).json({ error: 'Story ID and rating are required' });
  }

  try {
    await updateStoryRating({ storyId, rating });
    res.json({ success: true, rating });
  } catch (error) {
    console.error('Error updating rating:', error.message);
    res.status(500).json({ error: 'Failed to update rating' });
  }
});

module.exports = router;
