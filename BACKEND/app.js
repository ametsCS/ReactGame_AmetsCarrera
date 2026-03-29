require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

const primaryModel = process.env.GROQ_MODEL_PRIMARY || "llama-3.3-70b-versatile";
const degradedModel = process.env.GROQ_MODEL_DEGRADED || "llama-3.1-8b-instant";
const allowedModels = new Set([primaryModel, degradedModel]);

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    }
  })
);

app.get("/", (_req, res) => {
  res.send("React Game backend is running.");
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    modelPrimary: primaryModel,
    modelDegraded: degradedModel
  });
});

const buildMessages = ({ candidateSequences, instruction }) => [
  {
    role: "system",
    content: [
      "You are choosing the best move for a hexagonal board game.",
      "You will receive up to three candidate sequences of coordinates.",
      "Return a JSON object with this exact shape:",
      '{"move":[[row,column],[row,column]]}',
      "Choose exactly one of the provided sequences.",
      "Do not add explanations or markdown."
    ].join(" ")
  },
  {
    role: "user",
    content: JSON.stringify({
      instruction,
      candidateSequences
    })
  }
];

const parseMoveResponse = (content) => {
  if (!content) {
    throw new Error("Empty response from model");
  }

  const normalized = content.replace(/```json|```/gi, "").trim();
  const parsed = JSON.parse(normalized);

  if (!Array.isArray(parsed.move) || parsed.move.length === 0) {
    throw new Error("Model response did not include a valid move array");
  }

  return parsed.move;
};

app.post("/api/llm-move", async (req, res) => {
  if (!groq) {
    res.status(500).json({
      error: "Missing GROQ_API_KEY on the backend"
    });
    return;
  }

  const { candidateSequences, instruction, model } = req.body ?? {};

  if (!Array.isArray(candidateSequences) || candidateSequences.length === 0) {
    res.status(400).json({
      error: "candidateSequences must be a non-empty array"
    });
    return;
  }

  const selectedModel = allowedModels.has(model) ? model : primaryModel;

  try {
    const completion = await groq.chat.completions.create({
      model: selectedModel,
      temperature: 0,
      messages: buildMessages({
        candidateSequences,
        instruction
      })
    });

    const content = completion.choices[0]?.message?.content || "";
    const move = parseMoveResponse(content);

    res.json({
      move,
      model: selectedModel
    });
  } catch (error) {
    console.error("Error generating LLM move:", error);
    res.status(500).json({
      error: "Failed to generate LLM move"
    });
  }
});

module.exports = app;
