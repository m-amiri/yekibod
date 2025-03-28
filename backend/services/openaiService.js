const axios = require('axios');

async function generateStory({ name, age, gender, interests }) {
  const prompt = `یک داستان کودکانه به زبان فارسی برای ${name} که ${age} ساله است بنویس. موضوع داستان شامل ${interests.join(' و ')} باشد. لحن داستان شاد و مناسب سن ${age} سال باشد. حدود ۳۰۰ کلمه.`;

  console.log('Sending request to OpenAI with prompt:', prompt);
  console.log('Using API key:', process.env.OPENAI_API_KEY ? 'API key exists' : 'No API key found');

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: { 
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
      }
    );

    console.log('OpenAI response received');
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateStory:', error.message);
    if (error.response) {
      console.error('OpenAI API Error Response:', error.response.data);
    }
    throw error;
  }
}

async function generateImage(description) {
  const response = await axios.post(
    'https://api.openai.com/v1/images/generations',
    {
      prompt: description,
      n: 1,
      size: "512x512",
    },
    {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    }
  );

  return response.data.data[0].url;
}

// خلاصه‌سازی داستان
async function summarizeStory(story) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'شما یک دستیار هوشمند هستید که داستان‌ها را خلاصه می‌کنید.' },
          { role: 'user', content: `یک خلاصه کوتاه از این داستان ایجاد کن: \n\n${story}` }
        ],
        max_tokens: 50,
      },
      {
        headers: { 
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error in summarizeStory:', error.message);
    if (error.response) {
      console.error('OpenAI API Error Response:', error.response.data);
    }
    throw error;
  }
}

// تولید ایموجی‌های مرتبط
async function generateEmojis(summary) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'شما یک دستیار هوشمند هستید که ایموجی‌های مناسب با متن را پیشنهاد می‌دهید.' },
          { role: 'user', content: `به این متن نگاه کن و ۵ ایموجی مرتبط با محتوای آن پیشنهاد بده:\n"${summary}"\nفقط ایموجی‌ها را برگردان، بدون متن اضافی.` }
        ],
        max_tokens: 20,
      },
      {
        headers: { 
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error in generateEmojis:', error.message);
    if (error.response) {
      console.error('OpenAI API Error Response:', error.response.data);
    }
    throw error;
  }
}

module.exports = { generateStory, generateImage, summarizeStory, generateEmojis };
