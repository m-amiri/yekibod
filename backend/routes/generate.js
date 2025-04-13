const express = require('express');
const router = express.Router();
const { generateStory } = require('../services/aiService');
const { generateImage } = require('../services/aiService');
const { saveStory } = require('../services/databaseService');

router.post('/', async (req, res) => {
  const { userId, name, age, gender, interests, generateImage: shouldGenerateImage } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // مرحله ۱: تولید داستان
    const story = await generateStory({ name, age, gender, interests });

    let imageUrl = null;

    // مرحله ۲: فقط در صورت نیاز تصویر بساز
    if (shouldGenerateImage) {
      const imagePrompt = story.slice(0, 100); // خلاصه‌ای از داستان برای تصویر
      imageUrl = await generateImage(imagePrompt);
    }

    // مرحله ۳: ذخیره داستان و (در صورت وجود) تصویر
    const id = await saveStory({ userId, storyText: story, imageUrl });
    res.json({ storyId: id, story, imageUrl });

  } catch (error) {
    console.error('Error generating story and image:', error.message);
    res.status(500).json({ error: 'Failed to generate story and image', details: error.message });
  }
});

module.exports = router;
