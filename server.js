import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_KEY = process.env.GEMINI_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

const sleep = ms => new Promise(r => setTimeout(r, ms));

app.post("/aiagent", async (req, res) => {
  try {
    await sleep(1500); // ✅ rate-limit protection

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GEMINI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gemini-2.0-flash",
        messages: req.body.messages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () =>
  console.log("✅ AI Agent backend running on port 3000")
);
