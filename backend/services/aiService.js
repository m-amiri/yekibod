const OpenAIModel = require('../models/OpenAIModel');
const DeepSeekModel = require('../models/DeepSeekModel');
const { openAIConfig, deepseekConfig } = require('../config/aiModels');

// Initialize models
const storyModel = new OpenAIModel(openAIConfig.storyModel);
const summaryModel = new OpenAIModel(openAIConfig.summaryModel);
const emojiModel = new OpenAIModel(openAIConfig.emojiModel);
const imageModel = new OpenAIModel(openAIConfig.imageModel);

async function generateStory({ name, age, gender, interests }) {
  try {
    return await storyModel.generateStory({ name, age, gender, interests });
  } catch (error) {
    console.error('Error in generateStory:', error.message);
    throw error;
  }
}

async function generateImage(description) {
  try {
    return await imageModel.generateImage(description);
  } catch (error) {
    console.error('Error in generateImage:', error.message);
    throw error;
  }
}

async function summarizeStory(story) {
  try {
    return await summaryModel.summarizeStory(story);
  } catch (error) {
    console.error('Error in summarizeStory:', error.message);
    throw error;
  }
}

async function generateEmojis(summary) {
  try {
    return await emojiModel.generateEmojis(summary);
  } catch (error) {
    console.error('Error in generateEmojis:', error.message);
    throw error;
  }
}

module.exports = { generateStory, generateImage, summarizeStory, generateEmojis }; 