import axios from 'axios';

export async function getGeminiResponse(message) {
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
      {
        contents: [{ parts: [{ text: message }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        params: { key: apiKey }
      }
    );
    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response.';
    return reply;
  } catch (err) {
    console.error('Gemini API error:', err?.response?.data || err?.message || err);
    return 'Sorry, something went wrong.';
  }
}

