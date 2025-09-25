const express = require('express');
const router = express.Router();
const { getGeminiResponse } = require('../controllers/chatbotController');

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
