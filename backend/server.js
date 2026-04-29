
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import industryRoutes from "./routes/industryRoutes.js";
import mouRoutes from "./routes/mouRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import meetingMinutesRoutes from "./routes/meetingMinutesRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import liaisonRoutes from "./routes/liaisonRoutes.js";
import coCurricularEventRoutes from "./routes/coCurricularEventRoutes.js";
import coCurricularTaskRoutes from "./routes/coCurricularTaskRoutes.js";
import coCurricularInvitationRoutes from "./routes/coCurricularInvitationRoutes.js";
import coCurricularNotificationRoutes from "./routes/coCurricularNotificationRoutes.js";
import coCurricularProfileRoutes from "./routes/coCurricularProfileRoutes.js";
import internshipProfileRoutes from "./routes/internshipProfileRoutes.js";
import internshipNotificationRoutes from "./routes/internshipNotificationRoutes.js";
import liaisonProfileRoutes from "./routes/liaisonProfileRoutes.js";
import industryRegistrationsRoute from "./routes/Industryregistrations.route.js";
import liaisonNotificationRoutes from "./routes/liaisonNotificationRoutes.js";


import inchargeRoutes from "./routes/applicationInchargeRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

const app = express();
// Middleware
app.use(cors());
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ limit: "12mb", extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ── POST /api/generate-minutes ────────────────────────────────────────
app.post("/api/generate-minutes", async (req, res) => {
  try {
    const { systemPrompt, userPrompt } = req.body;
    if (!systemPrompt || !userPrompt)
      return res.status(400).json({ error: "systemPrompt and userPrompt are required." });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
      return res.status(500).json({ error: "GEMINI_API_KEY is not set in .env" });

    const strictPrompt = `You are a professional meeting secretary.
Transform the meeting notes below into a JSON object.
Return ONLY the raw JSON. No markdown, no backticks, no explanation.
Start with { and end with }.

Use exactly this structure (keep each string SHORT, max 20 words):
{
  "meetingTitle": "string",
  "summary": "string (max 2 sentences)",
  "keyDecisions": [{ "id": 1, "decision": "string", "rationale": "string" }],
  "actionItems": [{ "id": 1, "task": "string", "responsible": "string", "deadline": "string", "priority": "High|Medium|Low" }],
  "discussionPoints": ["string"],
  "nextSteps": "string",
  "nextMeetingNote": "string"
}

Meeting details:
${userPrompt}`;

    const modelConfigs = [
      { model: "gemini-2.5-flash", thinkingBudget: 0 },
      { model: "gemini-2.0-flash", thinkingBudget: null },
      { model: "gemini-2.0-flash-lite", thinkingBudget: null },
      { model: "gemini-1.5-flash", thinkingBudget: null },
    ];

    let rawText = "";
    let lastError = "";

    for (const { model, thinkingBudget } of modelConfigs) {
      try {
        console.log(`🔄 Trying model: ${model}`);

        const generationConfig = { temperature: 0.1, maxOutputTokens: 8192 };
        const bodyPayload = {
          contents: [{ role: "user", parts: [{ text: strictPrompt }] }],
          generationConfig,
        };

        if (thinkingBudget === 0) {
          bodyPayload.generationConfig.thinkingConfig = { thinkingBudget: 0 };
        }

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
            body: JSON.stringify(bodyPayload),
          }
        );

        const bodyText = await geminiRes.text();
        if (!geminiRes.ok) {
          lastError = `${model} HTTP ${geminiRes.status}: ${bodyText.slice(0, 150)}`;
          console.warn(`⚠️  ${lastError}`);
          continue;
        }

        const geminiData = JSON.parse(bodyText);
        rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (rawText) {
          console.log(`✅ Success with: ${model}`);
          console.log(`📄 Raw (first 300):\n${rawText.slice(0, 300)}`);
          break;
        }

        lastError = `${model} → empty`;
        console.warn(`⚠️  ${lastError}`);
      } catch (e) {
        lastError = `${model} → ${e.message}`;
        console.warn(`⚠️  ${lastError}`);
      }
    }

    if (!rawText) throw new Error(`All models failed. Last: ${lastError}`);

    let cleaned = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    let parsed = null;

    try { parsed = JSON.parse(cleaned); } catch (_) {}

    if (!parsed) {
      const start = cleaned.indexOf("{");
      if (start !== -1) {
        let depth = 0, end = -1;
        for (let i = start; i < cleaned.length; i++) {
          if (cleaned[i] === "{") depth++;
          else if (cleaned[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
        }
        if (end !== -1) {
          try { parsed = JSON.parse(cleaned.slice(start, end + 1)); } catch (_) {}
        }
      }
    }

    if (!parsed) {
      console.error("❌ Full raw output:\n", rawText);
      throw new Error("AI did not return valid JSON. Check server logs.");
    }

    const safe = {
      meetingTitle: parsed.meetingTitle || "Advisory Board Meeting",
      summary: parsed.summary || "",
      keyDecisions: Array.isArray(parsed.keyDecisions) ? parsed.keyDecisions : [],
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      discussionPoints: Array.isArray(parsed.discussionPoints) ? parsed.discussionPoints : [],
      nextSteps: parsed.nextSteps || "",
      nextMeetingNote: parsed.nextMeetingNote || "",
    };

    console.log("✅ Parsed successfully, sending to frontend.");
    return res.json({ content: safe });
  } catch (err) {
    console.error("❌ generate-minutes error:", err);
    return res.status(500).json({ error: "Failed to generate meeting minutes.", details: err.message });
  }
});

// ── DEBUG: list available models ───────────────────────────────
app.get("/api/gemini-models", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not set" });
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await r.json();
    const names = (data.models || [])
      .filter(m => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map(m => m.name.replace("models/", ""));
    return res.json({ count: names.length, models: names });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── Application Routes ───────────────────────────────────────
app.use("/api/industries", industryRoutes);
app.use("/api/mous", mouRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/meeting-minutes", meetingMinutesRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/cocurricular/events", coCurricularEventRoutes);
app.use("/api/cocurricular/tasks", coCurricularTaskRoutes);
app.use("/api/cocurricular/invitations", coCurricularInvitationRoutes);
app.use("/api/cocurricular/notifications", coCurricularNotificationRoutes);
app.use("/api/cocurricular/profile", coCurricularProfileRoutes);
app.use("/api/incharge/profile", internshipProfileRoutes);
app.use("/api/incharge/notifications", internshipNotificationRoutes);
app.use("/api/liaison/profile", liaisonProfileRoutes);
app.use("/api/industry-registrations", industryRegistrationsRoute);
app.use("/api/liaison-notifications", liaisonNotificationRoutes);

app.use("/api/email", emailRoutes);

app.use("/api/incharge", inchargeRoutes);

app.use("/api/liaison", liaisonRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Test route
app.get("/", (req, res) => res.send("CollaXion backend running 🚀"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));