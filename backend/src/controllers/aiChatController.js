const pool = require('../config/db');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_dev',
});

// @desc    Send a message to AI and get response
// @route   POST /api/ai-chat/message
// @access  Private
const sendMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // 1. Save user message to database
    await pool.query(
      'INSERT INTO chat_messages (user_id, sender, message) VALUES ($1, $2, $3)',
      [userId, 'USER', message]
    );

    // 2. Fetch recent chat history for context (last 10 messages)
    const historyRes = await pool.query(
      'SELECT sender, message FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC LIMIT 10',
      [userId]
    );

    const messagesForClaude = historyRes.rows.map(msg => ({
      role: msg.sender === 'USER' ? 'user' : 'assistant',
      content: msg.message,
    }));

    // 3. Call Claude API
    let aiResponseText = '';
    
    // Check if API key is real, otherwise send dummy response
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // or 'gpt-3.5-turbo'
        messages: [
          {
            role: 'system',
            content: 'You are Humura, an empathetic and supportive AI mental health assistant. Listen actively, validate feelings, and provide calm, helpful, and supportive advice. If someone is in immediate danger, advise them to seek emergency help.',
          },
          ...messagesForClaude
        ],
        max_tokens: 500,
      });
      aiResponseText = response.choices[0].message.content;
    } else {
      // Mock response for development without API key
      aiResponseText = "I am Humura (Mock AI). I hear you, and I'm here to support you. Please make sure to set your OPENAI_API_KEY in the .env file for real responses.";
    }

    // 4. Save AI response to database
    const newAiMessage = await pool.query(
      'INSERT INTO chat_messages (user_id, sender, message) VALUES ($1, $2, $3) RETURNING *',
      [userId, 'AI', aiResponseText]
    );

    res.json({
      userMessage: message,
      aiResponse: newAiMessage.rows[0].message,
      created_at: newAiMessage.rows[0].created_at
    });
  } catch (error) {
    console.error('Error sending message to AI:', error);
    res.status(500).json({ error: 'Server error communicating with AI' });
  }
};

// @desc    Get user chat history
// @route   GET /api/ai-chat/history
// @access  Private
const getHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT id, sender, message, created_at FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Server error fetching chat history' });
  }
};

// @desc    Delete user chat history
// @route   DELETE /api/ai-chat/history
// @access  Private
const deleteHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    await pool.query('DELETE FROM chat_messages WHERE user_id = $1', [userId]);
    res.json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ error: 'Server error deleting chat history' });
  }
};

module.exports = {
  sendMessage,
  getHistory,
  deleteHistory,
};
