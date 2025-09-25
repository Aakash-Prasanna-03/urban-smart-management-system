import express from 'express';
import { getGeminiResponse } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required.' });
    const reply = await getGeminiResponse(message);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: 'Sorry, something went wrong.' });
  }
});

export default router;
