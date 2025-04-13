const openAIConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  storyModel: {
    name: 'gpt-4o-mini',
    maxTokens: 1000,
    temperature: 0.7,
  },
  summaryModel: {
    name: 'gpt-3.5-turbo',
    maxTokens: 50,
    temperature: 0.5,
  },
  emojiModel: {
    name: 'gpt-3.5-turbo',
    maxTokens: 20,
    temperature: 0.7,
  },
  imageModel: {
    name: 'dall-e-2',
    size: '512x512',
    quality: 'standard',
    n: 1,
  },
};

const deepseekConfig = {
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
  storyModel: {
    name: 'deepseek-chat',
    maxTokens: 1000,
    temperature: 0.7,
  },
  summaryModel: {
    name: 'deepseek-chat',
    maxTokens: 50,
    temperature: 0.5,
  },
  emojiModel: {
    name: 'deepseek-chat',
    maxTokens: 20,
    temperature: 0.7,
  },
};

module.exports = { openAIConfig, deepseekConfig }; 