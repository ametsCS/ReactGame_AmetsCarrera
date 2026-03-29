require("dotenv").config();

const express = require("express");
const Groq = require("groq-sdk");

const app = express();

const primaryModel = process.env.GROQ_MODEL_PRIMARY || "openai/gpt-oss-120b";
const degradedModel = process.env.GROQ_MODEL_DEGRADED || "openai/gpt-oss-20b";
const allowedModels = new Set([primaryModel, degradedModel]);

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;

  if (!origin || !allowedOrigins.includes(origin)) {
    return false;
  }

  res.header("Access-Control-Allow-Origin", origin);
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"] || "Content-Type"
  );

  return true;
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin) {
    next();
    return;
  }

  if (!setCorsHeaders(req, res)) {
    res.status(403).json({
      error: "Origin not allowed by CORS"
    });
    return;
  }

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get("/", (_req, res) => {
  res.send("React Game backend is running.");
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    allowedOrigins,
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
      "Choose exactly one of the provided sequences.",
      "Return only the selected sequence in the JSON schema response.",
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

const moveResponseFormat = {
  type: "json_schema",
  json_schema: {
    name: "hex_game_move",
    strict: true,
    schema: {
      type: "object",
      properties: {
        move: {
          type: "array",
          minItems: 1,
          items: {
            type: "array",
            minItems: 1,
            maxItems: 2,
            items: {
              type: ["integer", "string"]
            }
          }
        }
      },
      required: ["move"],
      additionalProperties: false
    }
  }
};

const normalizeSequence = (sequence) =>
  JSON.stringify(
    (sequence || []).map((coordinate) => [Number(coordinate?.[0]), Number(coordinate?.[1])])
  );

const normalizeCoordinate = (coordinate) => {
  if (Array.isArray(coordinate) && coordinate.length === 1) {
    return normalizeCoordinate(coordinate[0]);
  }

  if (Array.isArray(coordinate) && coordinate.length >= 2) {
    return [Number(coordinate[0]), Number(coordinate[1])];
  }

  if (typeof coordinate === "string") {
    const normalized = coordinate.trim();

    if (/^[0-9]{2}$/.test(normalized)) {
      return [Number(normalized[0]), Number(normalized[1])];
    }
  }

  if (Number.isInteger(coordinate)) {
    const normalized = String(coordinate).padStart(2, "0");
    return [Number(normalized[0]), Number(normalized[1])];
  }

  throw new Error(`Invalid coordinate returned by model: ${JSON.stringify(coordinate)}`);
};

const parseMoveResponse = (content) => {
  if (!content) {
    throw new Error("Empty response from model");
  }

  const normalized = content.replace(/```json|```/gi, "").trim();
  const parsed = JSON.parse(normalized);

  if (!Array.isArray(parsed.move) || parsed.move.length === 0) {
    throw new Error("Model response did not include a valid move array");
  }

  return parsed.move.map(normalizeCoordinate);
};

const resolveMove = (move, candidateSequences) => {
  const normalizedCandidates = new Set(candidateSequences.map(normalizeSequence));
  const normalizedMove = normalizeSequence(move);

  if (normalizedCandidates.has(normalizedMove)) {
    return move;
  }

  const fallbackMove = candidateSequences[0];

  if (!fallbackMove) {
    throw new Error("No fallback candidate sequence was available");
  }

  console.warn("Model returned a move outside the candidate set. Falling back to the first candidate.");

  return fallbackMove;
};

const handleLLMMove = async (req, res) => {
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
      response_format: moveResponseFormat,
      messages: buildMessages({
        candidateSequences,
        instruction
      })
    });

    const content = completion.choices[0]?.message?.content || "";
    const move = resolveMove(parseMoveResponse(content), candidateSequences);

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
};

app.post("/llm-move", handleLLMMove);
app.post("/api/llm-move", handleLLMMove);

module.exports = app;
