// src/pages/api/chat/openai/aiGenerate.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // 🔹 Use absolute URL with proper headers
    const websiteResponse = await fetch("https://ro-customer-care.vercel.app", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AI-Bot/1.0)", // prevents blocks
      },
    });

    if (!websiteResponse.ok) {
      console.error("Failed to fetch website, status:", websiteResponse.status);
      return res.status(500).json({ reply: "Unable to fetch website content." });
    }

    const websiteHTML = await websiteResponse.text();

    // 🔹 Send website content + user question to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `
          You are a professional AI assistant for the RO Customer Care website.
          Answer based only on the website content provided below. Be concise and factual.
          `,
        },
        {
          role: "user",
          content: `
          Website Content:
          ${websiteHTML}

          User Question: ${message}
          `,
        },
      ],
      temperature: 0.4,
    });

    const reply = completion.choices?.[0]?.message?.content || "No reply generated";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Error in AI handler:", err);
    res.status(500).json({ reply: "Something went wrong while processing your request." });
  }
}
