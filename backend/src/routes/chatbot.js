import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Valid message is required" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Gemini API key not found in environment variables");
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    // 🔹 Add UrbanFix-specific system context
    const systemPrompt = `
You are UrbanFix's civic issue assistant chatbot. 
Your role is to help citizens report, understand, and resolve urban issues such as potholes, garbage collection, streetlight failures, and other municipal concerns.

Always:
- Be concise, helpful, and professional.
- Use markdown for formatting (headings, lists, bold).
- Avoid unrelated topics (only civic/urban issues).
- Suggest reporting to local authorities if applicable.
- When explaining technical solutions, keep it short and clear.

Examples:
- If asked "How do I report a pothole?", explain the reporting process.
- If asked "How to fix a streetlight?", explain that authorities handle it, but describe how reporting works.
    `;

    const payload = {
      contents: [
        {
          parts: [{ text: `${systemPrompt}\n\nUser: ${message.trim()}` }],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 800,
        topK: 40,
        topP: 0.9,
      },
    };

    console.log("Sending request to Gemini API...");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseErr) {
        console.error("Failed to parse error response:", parseErr);
        return res.status(response.status).json({
          error: `Gemini API error: HTTP ${response.status}`,
        });
      }
      console.error("Gemini API error:", errorData);
      return res.status(response.status).json({
        error: `Gemini API error: ${
          errorData.error?.message || "Unknown error"
        }`,
      });
    }

    const data = await response.json();
    console.log("RAW Gemini response:", JSON.stringify(data, null, 2));

    let reply = "No response from Gemini";

    if (data?.candidates?.length > 0) {
      const candidate = data.candidates[0];

      if (candidate.finishReason === "SAFETY") {
        reply =
          "⚠ I can't provide a response due to safety guidelines. Please rephrase your question.";
      } else if (candidate.content?.parts?.length > 0) {
        reply = candidate.content.parts.map((p) => p.text).join(" ");
      }
    }

    // 🔹 Cleanup reply for frontend
  reply = reply.replace(/^\s+|\s+$/g, "").replace(/\\n/g, "\n");

    res.json({
      reply,
      status: "success",
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  const apiKeyConfigured = !!process.env.GEMINI_API_KEY;
  res.json({
    status: "online",
    apiKeyConfigured,
    timestamp: new Date().toISOString(),
  });
});

export default router;