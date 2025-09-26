// Gemini 2.5 Flash API integration for chatbot
// Usage: import { getGeminiReply } from './gemini';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';
const API_KEY = "AIzaSyAOHEJg4KDdQLU1VpmxvBwRX0WAt7JWxO4";

const SYSTEM_PROMPT = `You are UrbanFix's assistant. Only answer questions related to UrbanFix (an urban issue reporting platform). If the question is not related to UrbanFix, politely refuse to answer. Keep responses concise and well formatted.`;

export async function getGeminiReply(userMessage) {
  const body = {
    contents: [
      { role: 'system', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'user', parts: [{ text: userMessage }] }
    ]
  };
  const res = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  let data;
  try {
    data = await res.json();
  } catch (err) {
    console.error('Failed to parse Gemini response:', err);
    throw new Error('Gemini API error: Invalid JSON');
  }
  if (!res.ok) {
    console.error('Gemini API error:', res.status, data);
    throw new Error(`Gemini API error: ${res.status} ${data?.error?.message || ''}`);
  }
  // Gemini returns candidates[0].content.parts[0].text
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response.';
}
