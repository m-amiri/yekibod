const express = require('express');
const router = express.Router();
const { summarizeStory, generateEmojis } = require('../services/openaiService');

router.post('/enhance', async (req, res) => {
  const { story } = req.body;

  if (!story) {
    return res.status(400).json({ error: 'Story text is required' });
  }

  try {
    const summary = await summarizeStory(story);
    const emojis = await generateEmojis(summary);

    res.json({ emojis });
  } catch (error) {
    console.error('Error generating story enhancement:', error.message);
    res.status(500).json({ error: 'Failed to generate summary and emojis' });
  }
});

module.exports = router;
