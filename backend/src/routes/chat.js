import express from 'express';
import { getGeminiResponse } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received chatbot request:', message);
    if (!message) {
      console.log('No message provided');
      return res.status(400).json({ error: 'Message is required.' });
    }
    const reply = await getGeminiResponse(message);
    console.log('Gemini reply:', reply);
    res.json({ reply });
  } catch (err) {
    console.error('Chatbot route error:', err);
    res.status(500).json({ reply: 'Sorry, something went wrong.' });
  }
});

export default router;
