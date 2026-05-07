const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Scans text for crisis language or harmful content.
 * Returns true if the content is flagged, false otherwise.
 */
const scanForCrisis = async (text) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    console.warn('Moderation skip: No OpenAI API key provided.');
    return false;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a content moderator for a mental health app for young women. Your only job is to detect if a piece of text indicates an immediate crisis (self-harm, suicide, extreme violence, or "wanting to disappear"). Respond with ONLY "FLAG" if it is a crisis, or "SAFE" if it is not. Do not provide any other text.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: 10,
    });

    const result = response.choices[0].message.content.trim().toUpperCase();
    return result === 'FLAG';
  } catch (error) {
    console.error('Error in AI moderation scan:', error);
    return false; // Default to safe if API fails, or you could default to flagged to be extra safe
  }
};

module.exports = {
  scanForCrisis,
};
