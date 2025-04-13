const OpenAI = require('openai');
const BaseAIModel = require('./BaseAIModel');
const {
  StoryGenerator,
  StorySummarizer,
  EmojiGenerator
} = require('./interfaces/AIModelInterfaces');

class DeepSeekModel extends BaseAIModel {
  constructor(config) {
    super(config);
    this.client = new OpenAI({
      baseURL: config.baseURL,
      apiKey: config.apiKey
    });
  }

  async generateStory({ name, age, gender, interests }) {
    const prompt = `یک داستان کودکانه به زبان فارسی برای ${name} که ${age} ساله است بنویس. موضوع داستان شامل ${interests.join(' و ')} باشد. لحن داستان شاد و مناسب سن ${age} سال باشد. حدود ۳۰۰ کلمه.`;
    
    try {
      const chatCompletion = await this.client.chat.completions.create({
        model: this.config.name,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });
      return chatCompletion.choices[0].message.content;
    } catch (error) {
      console.error('Error in generateStory:', error.message);
      throw error;
    }
  }

  async summarizeStory(story) {
    try {
      const prompt = `یک خلاصه کوتاه از این داستان ایجاد کن:\n\n${story}`;
      const chatCompletion = await this.client.chat.completions.create({
        model: this.config.name,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });
      return chatCompletion.choices[0].message.content;
    } catch (error) {
      console.error('Error in summarizeStory:', error.message);
      throw error;
    }
  }

  async generateEmojis(summary) {
    try {
      const prompt = `به این متن نگاه کن و ۵ ایموجی مرتبط با محتوای آن پیشنهاد بده:\n"${summary}"\nفقط ایموجی‌ها را برگردان، بدون متن اضافی.`;
      const chatCompletion = await this.client.chat.completions.create({
        model: this.config.name,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });
      return chatCompletion.choices[0].message.content;
    } catch (error) {
      console.error('Error in generateEmojis:', error.message);
      throw error;
    }
  }
}

// Implement only chat-related interfaces
Object.assign(DeepSeekModel.prototype, StoryGenerator.prototype);
Object.assign(DeepSeekModel.prototype, StorySummarizer.prototype);
Object.assign(DeepSeekModel.prototype, EmojiGenerator.prototype);

module.exports = DeepSeekModel; 