import axios from 'axios';

export async function getGeminiResponse(message) {
  const apiKey = process.env.GEMINI_API_KEY;
  const SYSTEM_PROMPT = `You are UrbanFix's AI assistant. You help users with any urban issues they face in daily life, such as potholes, garbage, water supply, street lights, and more. Answer questions about reporting, fixing, or understanding urban problems. If asked about UrbanFix features, you can reference information from the UrbanFix website. If the question is not about urban issues or UrbanFix, politely refuse to answer. Always keep responses concise, clear, and well formatted.`;
  try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
      {
        contents: [
          { role: 'user', parts: [{ text: message }] },
          { role: 'model', parts: [{ text: SYSTEM_PROMPT }] }
        ]
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

