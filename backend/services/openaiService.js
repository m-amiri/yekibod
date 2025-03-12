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

module.exports = { generateStory, generateImage };
