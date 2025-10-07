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
    const { message } = await req.body;

    // 🟩 STEP 1: Fetch your live website homepage (HTML)
    const websiteResponse = await fetch("https://ro-customer-care.vercel.app/");
    const websiteHTML = await websiteResponse.text(); // <— NOT .json()

    // 🟩 STEP 2: Send that website content + user query to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `
          You are a professional AI assistant for the RO Customer Care website.
          You answer based on the website content provided below.
          Be concise, polite, and factual.
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

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Error in chat API:", err);
    res.status(500).json({ reply: "Sorry, something went wrong while fetching information." });
  }
}
