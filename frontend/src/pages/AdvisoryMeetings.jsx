// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CalendarDays, Users, FileText, CheckCircle2, Clock, Send, Mail,
//   Download, FileCheck, Loader, Sparkles, PenLine, X, ChevronRight,
//   Bot, ClipboardList, AlertCircle
// } from "lucide-react";
// import collaxionLogo from "../images/collaxionlogo.jpeg";

// /* ─────────────────────────────────────────────
//    Helper: call backend proxy → Anthropic API
//    (Direct browser→Anthropic calls are blocked
//     by CORS; route through your Express server)
// ───────────────────────────────────────────── */
// const callClaudeForMinutes = async (roughNotes, meetingMeta) => {
//   const systemPrompt = `You are a professional meeting secretary for an Advisory Board.
// Your job is to transform rough meeting notes into a well-structured meeting minutes document.
// Always respond with ONLY valid JSON — no markdown fences, no backticks, no preamble, no trailing text.
// The JSON must match this exact schema:
// {
//   "meetingTitle": "string",
//   "summary": "string (2-3 sentences executive summary)",
//   "keyDecisions": [
//     { "id": 1, "decision": "string", "rationale": "string" }
//   ],
//   "actionItems": [
//     { "id": 1, "task": "string", "responsible": "string", "deadline": "string", "priority": "High|Medium|Low" }
//   ],
//   "discussionPoints": ["string"],
//   "nextSteps": "string",
//   "nextMeetingNote": "string"
// }`;

//   const userPrompt = `Meeting Details:
// - Agenda: ${meetingMeta.agenda}
// - Date: ${meetingMeta.date}
// - Time: ${meetingMeta.time}
// - Venue: ${meetingMeta.venue}
// - Attendees: ${meetingMeta.boardMembers.map(b => `${b.name} (${b.role})`).join(", ")}

// Rough Meeting Notes:
// ${roughNotes}

// Transform these rough notes into professional meeting minutes. Return ONLY the JSON object.`;

//   // Call backend proxy
//   let response;
//   try {
//     response = await fetch("http://localhost:5000/api/generate-minutes", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ systemPrompt, userPrompt }),
//     });
//   } catch (networkErr) {
//     throw new Error("Cannot reach server at localhost:5000. Make sure your backend is running.");
//   }

//   const rawText = await response.text();
//   console.log("Server response status:", response.status);
//   console.log("Server response body:", rawText.slice(0, 500));

//   if (!response.ok) {
//     let detail = rawText;
//     try { detail = JSON.parse(rawText)?.details || JSON.parse(rawText)?.error || rawText; } catch (_) {}
//     throw new Error(`Server error ${response.status}: ${String(detail).slice(0, 300)}`);
//   }

//   let data;
//   try {
//     data = JSON.parse(rawText);
//   } catch {
//     throw new Error("Server returned invalid response. Check backend logs.");
//   }

//   const content = data.content;
//   if (!content) throw new Error("AI returned empty content. Please try again.");

//   // Already a parsed object - return directly
//   if (typeof content === "object") {
//     console.log("Got parsed object from server:", content);
//     return content;
//   }

//   // String fallback - strip fences and parse
//   const cleaned = content
//     .replace(/^```json\s*/gi, "")
//     .replace(/^```\s*/gi, "")
//     .replace(/```\s*$/gi, "")
//     .trim();

//   try {
//     return JSON.parse(cleaned);
//   } catch {
//     const match = cleaned.match(/\{[\s\S]*\}/);
//     if (match) return JSON.parse(match[0]);
//     throw new Error("Could not parse AI response. Please try again.");
//   }
// };

// /* ─────────────────────────────────────────────
//    Helper: build & download PDF with pdf-lib
// ───────────────────────────────────────────── */
// const sanitizeText = (input) => {
//   if (input == null) return "";
//   return String(input)
//     .replace(/[\u2013\u2014]/g, "-")
//     .replace(/[\u2018\u2019]/g, "'")
//     .replace(/[\u201C\u201D]/g, '"')
//     .replace(/\u2022/g, "-")
//     .replace(/\u2026/g, "...")
//     .replace(/\u00A0/g, " ")
//     .replace(/[^\x00-\xFF]/g, "?");
// };

// const createMinutesPDF = async (minutesData, meetingMeta) => {
//   const { PDFDocument, rgb, StandardFonts } = await import(
//     "https://cdn.jsdelivr.net/esm/pdf-lib@1.17.1"
//   );

//   const doc     = await PDFDocument.create();
//   const regular = await doc.embedFont(StandardFonts.Helvetica);
//   const bold    = await doc.embedFont(StandardFonts.HelveticaBold);
//   const italic  = await doc.embedFont(StandardFonts.HelveticaOblique);

//   // ── Palette ───────────────────────────────────────────────────
//   const navy     = rgb(0.06, 0.16, 0.28);
//   const navyDark = rgb(0.04, 0.10, 0.20);
//   const blue     = rgb(0.16, 0.50, 0.73);
//   const blueLt   = rgb(0.84, 0.92, 0.97);
//   const green    = rgb(0.15, 0.68, 0.38);
//   const greenLt  = rgb(0.83, 0.94, 0.87);
//   const amber    = rgb(0.95, 0.61, 0.07);
//   const amberLt  = rgb(0.99, 0.95, 0.83);
//   const red      = rgb(0.75, 0.22, 0.17);
//   const redLt    = rgb(0.98, 0.86, 0.85);
//   const white    = rgb(1, 1, 1);
//   const offWhite = rgb(0.97, 0.975, 0.982);
//   const black    = rgb(0.12, 0.12, 0.14);
//   const gray     = rgb(0.44, 0.47, 0.51);
//   const grayMid  = rgb(0.72, 0.74, 0.77);
//   const grayLt   = rgb(0.91, 0.92, 0.94);
//   const divider  = rgb(0.87, 0.89, 0.92);

//   // ── Page constants ────────────────────────────────────────────
//   const W = 612, H = 792;
//   const ML = 50, MB = 52;
//   const CW = W - ML - ML; // content width (symmetric margins)
//   let page, y;

//   // ── Sanitise text ─────────────────────────────────────────────
//   const S = (t) => {
//     if (t == null) return "";
//     return String(t)
//       .replace(/[\u2013\u2014]/g, "-").replace(/[\u2018\u2019]/g, "'")
//       .replace(/[\u201C\u201D]/g, '"').replace(/\u2022/g, "-")
//       .replace(/\u2026/g, "...").replace(/\u00A0/g, " ")
//       .replace(/[^\x00-\xFF]/g, "?");
//   };

//   // ── Word wrap ─────────────────────────────────────────────────
//   const wrap = (text, maxW, size) => {
//     const cpp = Math.max(1, Math.floor(maxW / (size * 0.545)));
//     const words = S(text).split(" ");
//     let line = "", out = [];
//     for (const w of words) {
//       const t = line ? line + " " + w : w;
//       if (t.length > cpp && line) { out.push(line); line = w; } else line = t;
//     }
//     if (line) out.push(line);
//     return out;
//   };

//   // ── Draw text with auto page-break ───────────────────────────
//   const T = (text, opts = {}) => {
//     const { x = ML, size = 10, font = regular, color = black,
//             maxW = CW, lh = 1.55, dx = 0 } = opts;
//     const lines = wrap(text, maxW - dx, size);
//     for (const l of lines) {
//       if (y - size - 2 < MB) { footerOn(); addPage(); headerOn(); }
//       page.drawText(l, { x: x + dx, y: y - size, font, size, color });
//       y -= size * lh;
//     }
//   };

//   // ── Add a page ────────────────────────────────────────────────
//   const addPage = () => {
//     page = doc.addPage([W, H]);
//     y = H - 50;
//   };

//   // ── Continuation-page header ──────────────────────────────────
//   const headerOn = () => {
//     page.drawRectangle({ x: 0, y: H - 32, width: W, height: 32, color: navyDark });
//     page.drawRectangle({ x: 0, y: H - 32, width: 5, height: 32, color: blue });
//     page.drawText("ADVISORY BOARD MEETING MINUTES", {
//       x: ML + 4, y: H - 21, font: bold, size: 8, color: rgb(0.65, 0.76, 0.87),
//     });
//     page.drawText(S(meetingMeta.agenda || "").slice(0, 55), {
//       x: W / 2 - 70, y: H - 21, font: italic, size: 8, color: rgb(0.65, 0.76, 0.87),
//     });
//     page.drawText("CollaXion", {
//       x: W - ML - 44, y: H - 21, font: bold, size: 9, color: blue,
//     });
//     y = H - 46;
//   };

//   // ── Page footer ───────────────────────────────────────────────
//   const footerOn = () => {
//     page.drawLine({
//       start: { x: ML, y: MB - 6 }, end: { x: W - ML, y: MB - 6 },
//       thickness: 0.5, color: grayLt,
//     });
//     page.drawText("CollaXion — Confidential Advisory Board Record", {
//       x: ML, y: MB - 18, font: italic, size: 7, color: grayMid,
//     });
//     const pn = doc.getPageCount();
//     page.drawText(`Page ${pn}`, {
//       x: W - ML - 32, y: MB - 18, font: bold, size: 7, color: grayMid,
//     });
//   };

//   // ── Ensure vertical space ─────────────────────────────────────
//   const need = (h) => {
//     if (y - h < MB + 10) { footerOn(); addPage(); headerOn(); }
//   };

//   // ── Section heading ───────────────────────────────────────────
//   const heading = (title) => {
//     need(36);
//     page.drawRectangle({ x: ML,     y: y - 28, width: 5,      height: 28, color: blue });
//     page.drawRectangle({ x: ML + 5, y: y - 28, width: CW - 5, height: 28, color: offWhite });
//     page.drawText(S(title).toUpperCase(), {
//       x: ML + 14, y: y - 18, font: bold, size: 9.5, color: navy,
//     });
//     y -= 36;
//   };

//   // ── Priority pill ─────────────────────────────────────────────
//   const pill = (label, px, py) => {
//     const map = { High: [redLt, red], Medium: [amberLt, amber], Low: [greenLt, green] };
//     const [bg, fg] = map[label] || map.Medium;
//     const pw = label.length * 5.6 + 14;
//     page.drawRectangle({ x: px, y: py - 10, width: pw, height: 12, color: bg });
//     page.drawText(S(label), { x: px + 7, y: py - 7, font: bold, size: 7.5, color: fg });
//   };

//   // ════════════════════════════════════════════════════════════════
//   //  PAGE 1 — COVER
//   // ════════════════════════════════════════════════════════════════
//   addPage();

//   const COVER_H = 210;

//   // Full-width navy banner — edge to edge, top of page
//   page.drawRectangle({ x: 0, y: H - COVER_H, width: W, height: COVER_H, color: navyDark });

//   // Right accent column
//   page.drawRectangle({ x: W - 10, y: H - COVER_H, width: 10, height: COVER_H, color: blue });

//   // Top micro-label bar (slightly lighter strip)
//   page.drawRectangle({ x: 0, y: H - 30, width: W - 10, height: 30, color: navy });

//   // Label text
//   page.drawText("OFFICIAL DOCUMENT  |  ADVISORY BOARD", {
//     x: ML, y: H - 20, font: bold, size: 7, color: rgb(0.5, 0.66, 0.82),
//   });
//   page.drawText(S(new Date().toLocaleDateString("en-GB",
//     { weekday:"long", year:"numeric", month:"long", day:"numeric" })), {
//     x: W - ML - 200, y: H - 20, font: regular, size: 7, color: rgb(0.5, 0.66, 0.82),
//   });

//   // Divider inside banner
//   page.drawLine({
//     start: { x: ML, y: H - 32 }, end: { x: W - 20, y: H - 32 },
//     thickness: 0.4, color: rgb(0.22, 0.35, 0.50),
//   });

//   // Org name
//   page.drawText("CollaXion", {
//     x: ML, y: H - 62, font: bold, size: 24, color: blue,
//   });

//   // Subtitle
//   page.drawText("Advisory Board", {
//     x: ML, y: H - 85, font: regular, size: 12, color: rgb(0.72, 0.82, 0.91),
//   });

//   // Main title
//   page.drawText("Meeting Minutes", {
//     x: ML, y: H - 108, font: bold, size: 30, color: white,
//   });

//   // Divider
//   page.drawLine({
//     start: { x: ML, y: H - 122 }, end: { x: W - 22, y: H - 122 },
//     thickness: 0.5, color: rgb(0.22, 0.35, 0.50),
//   });

//   // Meeting title (wrapped, up to 3 lines)
//   const mtLines = wrap(
//     minutesData.meetingTitle || meetingMeta.agenda || "Advisory Board Meeting",
//     CW - 20, 11.5
//   );
//   let mtY = H - 140;
//   for (const ln of mtLines.slice(0, 3)) {
//     page.drawText(S(ln), { x: ML, y: mtY, font: bold, size: 11.5, color: rgb(0.83, 0.90, 0.96) });
//     mtY -= 17;
//   }

//   // ── Info cards ────────────────────────────────────────────────
//   const cardTop = H - COVER_H - 16;
//   const cardH   = 46;
//   const cardW   = (CW - 12) / 3;
//   const cards   = [
//     { label: "DATE",  val: meetingMeta.date  || "—" },
//     { label: "TIME",  val: meetingMeta.time  || "—" },
//     { label: "VENUE", val: meetingMeta.venue || "—" },
//   ];

//   cards.forEach((c, i) => {
//     const cx = ML + i * (cardW + 6);
//     // Card shadow-effect (slightly offset dark rect)
//     page.drawRectangle({ x: cx + 1, y: cardTop - cardH - 1, width: cardW, height: cardH, color: grayLt });
//     // Card body
//     page.drawRectangle({ x: cx, y: cardTop - cardH, width: cardW, height: cardH, color: white });
//     // Top accent bar
//     page.drawRectangle({ x: cx, y: cardTop - 3, width: cardW, height: 3, color: blue });
//     // Label
//     page.drawText(c.label, { x: cx + 8, y: cardTop - 13, font: bold, size: 7, color: blue });
//     // Value
//     const vw = wrap(S(c.val), cardW - 16, 10);
//     vw.slice(0, 2).forEach((vl, vi) => {
//       page.drawText(vl, { x: cx + 8, y: cardTop - 26 - vi * 13, font: bold, size: 10, color: navy });
//     });
//   });

//   y = cardTop - cardH - 22;

//   // ════════════════════════════════════════════════════════════════
//   //  EXECUTIVE SUMMARY
//   // ════════════════════════════════════════════════════════════════
//   if (minutesData.summary) {
//     need(50);
//     y -= 6;
//     heading("Executive Summary");
//     // Summary box with left tint bar
//     const sumLines = wrap(minutesData.summary, CW - 18, 9.5);
//     const boxH = sumLines.length * 14 + 16;
//     need(boxH + 8);
//     page.drawRectangle({ x: ML,     y: y - boxH, width: 4,      height: boxH, color: blue });
//     page.drawRectangle({ x: ML + 4, y: y - boxH, width: CW - 4, height: boxH, color: rgb(0.96, 0.97, 0.99) });
//     y -= 10;
//     T(minutesData.summary, { font: italic, size: 9.5, color: gray, dx: 14 });
//     y -= 6;
//   }

//   // ════════════════════════════════════════════════════════════════
//   //  ATTENDEES
//   // ════════════════════════════════════════════════════════════════
//   y -= 4;
//   heading("Attendees");
//   const half = CW / 2;
//   meetingMeta.boardMembers.forEach((m, i) => {
//     const col = i % 2;
//     const ax  = ML + col * half;
//     if (col === 0) need(30);
//     // Circle dot
//     page.drawCircle({ x: ax + 7, y: y - 8, size: 3.5, color: blue });
//     page.drawText(S(m.name), { x: ax + 18, y: y - 11, font: bold,    size: 9.5, color: navy });
//     page.drawText(S(m.role), { x: ax + 18, y: y - 22, font: regular, size: 8,   color: gray });
//     if (col === 1 || i === meetingMeta.boardMembers.length - 1) y -= 30;
//   });
//   y -= 8;

//   // ════════════════════════════════════════════════════════════════
//   //  KEY DECISIONS
//   // ════════════════════════════════════════════════════════════════
//   if ((minutesData.keyDecisions || []).length > 0) {
//     y -= 4;
//     heading("Key Decisions");
//     (minutesData.keyDecisions || []).forEach((d, i) => {
//       need(48);
//       // Numbered badge
//       page.drawRectangle({ x: ML, y: y - 22, width: 22, height: 22, color: navy });
//       page.drawText(String(i + 1), {
//         x: ML + (i >= 9 ? 5 : 7), y: y - 15, font: bold, size: 9, color: white,
//       });
//       // Decision
//       T(S(d.decision), { font: bold, size: 9.5, color: black, dx: 30 });
//       // Rationale
//       if (d.rationale) {
//         T("Rationale: " + S(d.rationale), { font: italic, size: 8.5, color: gray, dx: 30 });
//       }
//       // Thin rule
//       page.drawLine({
//         start: { x: ML + 28, y: y }, end: { x: W - ML, y: y },
//         thickness: 0.35, color: divider,
//       });
//       y -= 8;
//     });
//     y -= 4;
//   }

//   // ════════════════════════════════════════════════════════════════
//   //  ACTION ITEMS TABLE
//   // ════════════════════════════════════════════════════════════════
//   if ((minutesData.actionItems || []).length > 0) {
//     y -= 4;
//     heading("Action Items");

//     // Table header
//     need(22);
//     page.drawRectangle({ x: ML, y: y - 20, width: CW, height: 20, color: navy });
//     const COL = { num: ML + 6, task: ML + 22, resp: ML + 240, dl: ML + 360, pri: ML + 458 };
//     [["#", COL.num], ["Task", COL.task], ["Responsible", COL.resp],
//      ["Deadline", COL.dl], ["Priority", COL.pri]].forEach(([lbl, lx]) => {
//       page.drawText(lbl, { x: lx, y: y - 13, font: bold, size: 8, color: white });
//     });
//     y -= 20;

//     (minutesData.actionItems || []).forEach((a, i) => {
//       need(32);
//       const rH = 30;
//       const bg = i % 2 === 0 ? white : offWhite;
//       page.drawRectangle({ x: ML,     y: y - rH, width: CW,     height: rH, color: bg });
//       page.drawRectangle({ x: ML,     y: y - rH, width: 4,      height: rH, color: blueLt });
//       page.drawLine({
//         start: { x: ML, y: y - rH }, end: { x: W - ML, y: y - rH },
//         thickness: 0.3, color: divider,
//       });

//       // Row number
//       page.drawText(String(i + 1), { x: COL.num, y: y - 18, font: bold, size: 8, color: gray });

//       // Task (max 2 lines)
//       const tLines = wrap(S(a.task), 210, 8.5);
//       tLines.slice(0, 2).forEach((tl, ti) => {
//         page.drawText(tl, { x: COL.task, y: y - 11 - ti * 11, font: bold, size: 8.5, color: black });
//       });

//       // Responsible
//       const rLines = wrap(S(a.responsible || "TBD"), 110, 8);
//       rLines.slice(0, 2).forEach((rl, ri) => {
//         page.drawText(rl, { x: COL.resp, y: y - 11 - ri * 10, font: regular, size: 8, color: navy });
//       });

//       // Deadline
//       page.drawText(S(a.deadline || "TBD"), { x: COL.dl, y: y - 14, font: regular, size: 8, color: gray });

//       // Priority pill
//       pill(a.priority || "Medium", COL.pri, y - 10);
//       y -= rH;
//     });
//     y -= 10;
//   }

//   // ════════════════════════════════════════════════════════════════
//   //  DISCUSSION POINTS
//   // ════════════════════════════════════════════════════════════════
//   if ((minutesData.discussionPoints || []).length > 0) {
//     y -= 4;
//     heading("Points of Discussion");
//     (minutesData.discussionPoints || []).forEach((pt) => {
//       need(22);
//       // Square bullet
//       page.drawRectangle({ x: ML, y: y - 8, width: 5, height: 5, color: blue });
//       T(S(pt), { size: 9.5, color: black, dx: 14 });
//       y -= 3;
//     });
//     y -= 4;
//   }

//   // ════════════════════════════════════════════════════════════════
//   //  NEXT STEPS
//   // ════════════════════════════════════════════════════════════════
//   if (minutesData.nextSteps) {
//     y -= 4;
//     heading("Next Steps");
//     T(S(minutesData.nextSteps), { size: 9.5, color: black });
//     y -= 6;
//   }

//   // ════════════════════════════════════════════════════════════════
//   //  NEXT MEETING BOX
//   // ════════════════════════════════════════════════════════════════
//   if (minutesData.nextMeetingNote) {
//     need(50);
//     y -= 6;
//     const nmLines = wrap(S(minutesData.nextMeetingNote), CW - 26, 9.5);
//     const nmH = nmLines.length * 14 + 20;
//     page.drawRectangle({ x: ML,     y: y - nmH, width: CW,     height: nmH, color: blueLt });
//     page.drawRectangle({ x: ML,     y: y - nmH, width: 5,      height: nmH, color: blue });
//     page.drawText("NEXT MEETING", { x: ML + 14, y: y - 13, font: bold, size: 7.5, color: blue });
//     y -= 18;
//     T(S(minutesData.nextMeetingNote), { font: regular, size: 9.5, color: navy, dx: 14 });
//     y -= 10;
//   }

//   // ════════════════════════════════════════════════════════════════
//   //  SIGNATURE BLOCK
//   // ════════════════════════════════════════════════════════════════
//   need(75);
//   y -= 12;
//   page.drawLine({ start: { x: ML, y }, end: { x: W - ML, y }, thickness: 0.5, color: grayLt });
//   y -= 24;

//   ["Chairperson", "Secretary / Recorder", "Date Approved"].forEach((lbl, i) => {
//     const sx = ML + i * (CW / 3);
//     page.drawLine({
//       start: { x: sx, y: y - 18 }, end: { x: sx + CW / 3 - 18, y: y - 18 },
//       thickness: 0.7, color: grayMid,
//     });
//     page.drawText(lbl, { x: sx, y: y - 30, font: regular, size: 7.5, color: gray });
//   });

//   // ════════════════════════════════════════════════════════════════
//   //  FOOTERS — stamp on every page with correct page total
//   // ════════════════════════════════════════════════════════════════
//   footerOn(); // last page

//   const totalPages = doc.getPageCount();
//   for (let pi = 0; pi < totalPages; pi++) {
//     const pg = doc.getPage(pi);
//     // White-out old page number and rewrite with "X of Y"
//     pg.drawRectangle({ x: W - ML - 50, y: MB - 22, width: 52, height: 12, color: white });
//     pg.drawText(`Page ${pi + 1} of ${totalPages}`, {
//       x: W - ML - 50, y: MB - 18, font: bold, size: 7, color: grayMid,
//     });
//   }

//   const bytes = await doc.save();
//   return URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
// };


// /* ══════════════════════════════════════════════
//    SHARED EDIT FIELD STYLES
// ══════════════════════════════════════════════ */
// const editInput = {
//   width: "100%", boxSizing: "border-box", padding: "7px 10px",
//   border: "1.5px solid #e2e8f0", borderRadius: "8px",
//   fontSize: "0.82rem", fontFamily: "inherit", outline: "none",
//   color: "#1e293b", background: "#fff", transition: "border-color 0.2s",
// };
// const editTextarea = { ...editInput, resize: "vertical", minHeight: 60, lineHeight: 1.5 };
// const sectionLabel = {
//   fontWeight: 700, color: "#193648", fontSize: "0.82rem",
//   marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between",
// };
// const addBtn = {
//   background: "#eef4ff", color: "#3a70b0", border: "none",
//   borderRadius: "6px", padding: "3px 10px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
// };
// const removeBtn = {
//   background: "none", border: "none", color: "#ef4444",
//   cursor: "pointer", padding: "2px 4px", borderRadius: "4px", fontSize: "0.75rem", flexShrink: 0,
// };

// /* ══════════════════════════════════════════════
//    NOTES INPUT MODAL
// ══════════════════════════════════════════════ */
// const NotesModal = ({ meeting, onClose, onGenerated }) => {
//   const [notes, setNotes] = React.useState("");
//   const [phase, setPhase] = React.useState("write");
//   const [errorMsg, setErrorMsg] = React.useState("");
//   const [minutesData, setMinutesData] = React.useState(null);
//   const [downloadUrl, setDownloadUrl] = React.useState(null);
//   const [isRegenerating, setIsRegenerating] = React.useState(false);
//   const [editData, setEditData] = React.useState(null);

//   const charCount = notes.trim().length;
//   const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

//   const updateField    = (field, val) => setEditData(p => ({ ...p, [field]: val }));
//   const updateDecision = (id, f, v)   => setEditData(p => ({ ...p, keyDecisions: p.keyDecisions.map(d => d.id===id?{...d,[f]:v}:d) }));
//   const addDecision    = ()           => setEditData(p => ({ ...p, keyDecisions: [...p.keyDecisions, { id: Date.now(), decision: "", rationale: "" }] }));
//   const removeDecision = (id)         => setEditData(p => ({ ...p, keyDecisions: p.keyDecisions.filter(d => d.id!==id) }));
//   const updateAction   = (id, f, v)   => setEditData(p => ({ ...p, actionItems: p.actionItems.map(a => a.id===id?{...a,[f]:v}:a) }));
//   const addAction      = ()           => setEditData(p => ({ ...p, actionItems: [...p.actionItems, { id: Date.now(), task: "", responsible: "", deadline: "", priority: "Medium" }] }));
//   const removeAction   = (id)         => setEditData(p => ({ ...p, actionItems: p.actionItems.filter(a => a.id!==id) }));
//   const updateDisc     = (i, v)       => setEditData(p => ({ ...p, discussionPoints: p.discussionPoints.map((d,idx)=>idx===i?v:d) }));
//   const addDisc        = ()           => setEditData(p => ({ ...p, discussionPoints: [...p.discussionPoints, ""] }));
//   const removeDisc     = (i)          => setEditData(p => ({ ...p, discussionPoints: p.discussionPoints.filter((_,idx)=>idx!==i) }));

//   const handleSendToAI = async () => {
//     if (charCount < 30) return;
//     setPhase("processing");
//     try {
//       const structured = await callClaudeForMinutes(notes, meeting);
//       setMinutesData(structured);
//       setEditData(JSON.parse(JSON.stringify(structured)));
//       setDownloadUrl(null);
//       setPhase("edit");
//     } catch (err) {
//       console.error(err);
//       setErrorMsg(err.message || "Something went wrong. Please try again.");
//       setPhase("error");
//     }
//   };

//   const handleGeneratePDF = async () => {
//     setIsRegenerating(true);
//     try {
//       const url = await createMinutesPDF(editData, meeting);
//       setDownloadUrl(url);
//       setMinutesData(editData);
//       setIsRegenerating(false);
//       return url;
//     } catch (err) {
//       setIsRegenerating(false);
//       alert("PDF generation failed: " + err.message);
//       return null;
//     }
//   };

//   const handleDownloadAndSave = async () => {
//     const url = await handleGeneratePDF();
//     if (!url) return;
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `Minutes_${meeting.agenda.replace(/\s+/g, "_")}_${meeting.date}.pdf`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     onGenerated(meeting.id, editData, url);
//     onClose();
//   };

//   const handleSaveOnly = async () => {
//     const url = await handleGeneratePDF();
//     if (!url) return;
//     onGenerated(meeting.id, editData, url);
//     onClose();
//   };

//   const onFocus = e => e.target.style.borderColor = "#193648";
//   const onBlur  = e => e.target.style.borderColor = "#e2e8f0";
//   const priColors = { High: "#fee2e2", Medium: "#fef3c7", Low: "#d1fae5" };
//   const priText   = { High: "#991b1b", Medium: "#92400e", Low: "#065f46" };

//   return (
//     <div style={{ position:"fixed", inset:0, background:"rgba(10,20,40,0.65)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, padding:"20px" }}>
//       <motion.div
//         initial={{ scale:0.92, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }}
//         exit={{ scale:0.92, opacity:0 }} transition={{ type:"spring", damping:20, stiffness:260 }}
//         style={{ background:"#fff", borderRadius:"24px", width: phase==="edit"?"820px":"720px", maxWidth:"100%", maxHeight:"92vh", overflowY:"auto", boxShadow:"0 30px 80px rgba(0,0,0,0.35)", border:"1px solid #e2e8f0", transition:"width 0.3s ease" }}
//       >
//         {/* Header */}
//         <div style={{ background:"linear-gradient(120deg,#193648 0%,#2d6a9f 100%)", padding:"22px 28px", borderRadius:"24px 24px 0 0", display:"flex", alignItems:"center", gap:"14px", position:"sticky", top:0, zIndex:10 }}>
//           <div style={{ width:42, height:42, borderRadius:"12px", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
//             {phase==="edit" ? <FileText size={20} color="white"/> : <PenLine size={20} color="white"/>}
//           </div>
//           <div style={{ flex:1 }}>
//             <div style={{ color:"white", fontWeight:700, fontSize:"1.05rem" }}>
//               {phase==="edit" ? "✏️ Review & Edit Minutes" : "Write Meeting Notes"}
//             </div>
//             <div style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.8rem", marginTop:2 }}>
//               {meeting.agenda} — {meeting.date}
//             </div>
//           </div>
//           <div style={{ display:"flex", gap:6 }}>
//             {["Write","Edit","Save"].map((p, i) => {
//               const active = (i===0 && (phase==="write"||phase==="error"||phase==="processing")) || (i===1 && phase==="edit");
//               const done   = (i===0 && phase==="edit");
//               return (
//                 <div key={p} style={{ display:"flex", alignItems:"center", gap:4, background: done?"rgba(16,185,129,0.3)":active?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.07)", borderRadius:"20px", padding:"3px 10px", fontSize:"0.7rem", color: done?"#6ee7b7":active?"white":"rgba(255,255,255,0.4)", fontWeight:600 }}>
//                   {done?"✓":`${i+1}.`} {p}
//                 </div>
//               );
//             })}
//           </div>
//           <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"8px", padding:"6px 8px", cursor:"pointer", color:"white", display:"flex", alignItems:"center", flexShrink:0 }}>
//             <X size={18}/>
//           </button>
//         </div>

//         <div style={{ padding:"26px 28px" }}>

//           {/* WRITE PHASE */}
//           {(phase==="write"||phase==="error") && (
//             <>
//               <div style={{ marginBottom:16 }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:8, color:"#193648", fontWeight:600, fontSize:"0.93rem", marginBottom:8 }}>
//                   <ClipboardList size={16}/> Rough Meeting Notes
//                 </div>
//                 <p style={{ color:"#64748b", fontSize:"0.82rem", margin:"0 0 10px 0", lineHeight:1.5 }}>
//                   Write everything that happened — decisions, who said what, tasks, deadlines. AI will structure it and you can edit before saving.
//                 </p>
//                 <textarea value={notes} onChange={e=>setNotes(e.target.value)}
//                   placeholder={"Example:\n\nDean opened the meeting. Discussed curriculum update — agreed to add AI module in semester 3. HOD will coordinate with Ali Khan from ABC Tech by end of month..."}
//                   style={{ width:"100%", boxSizing:"border-box", minHeight:240, padding:"13px 15px", border:"2px solid #e2e8f0", borderRadius:"14px", fontSize:"0.87rem", lineHeight:1.7, fontFamily:"inherit", resize:"vertical", outline:"none", color:"#1e293b", background:"#f8fafc" }}
//                   onFocus={onFocus} onBlur={onBlur}
//                 />
//                 <div style={{ display:"flex", justifyContent:"space-between", marginTop:7, fontSize:"0.77rem", color:"#94a3b8" }}>
//                   <span>{wordCount} words · {charCount} characters</span>
//                   <span style={{ color: charCount<30?"#ef4444":"#10b981" }}>{charCount<30?`${30-charCount} more chars needed`:"✓ Ready to send"}</span>
//                 </div>
//               </div>
//               {phase==="error" && (
//                 <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"10px", padding:"11px 15px", display:"flex", gap:10, alignItems:"flex-start", marginBottom:14 }}>
//                   <AlertCircle size={15} color="#ef4444" style={{ marginTop:1, flexShrink:0 }}/>
//                   <div>
//                     <div style={{ fontWeight:600, color:"#dc2626", fontSize:"0.83rem" }}>Generation failed</div>
//                     <div style={{ color:"#7f1d1d", fontSize:"0.78rem", marginTop:2 }}>{errorMsg}</div>
//                   </div>
//                 </div>
//               )}
//               <div style={{ background:"#f1f5f9", borderRadius:"12px", padding:"12px 15px", marginBottom:18 }}>
//                 <div style={{ fontWeight:600, color:"#193648", fontSize:"0.8rem", marginBottom:7 }}>📋 Attendees (auto-included)</div>
//                 <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
//                   {meeting.boardMembers.map((m,i)=>(
//                     <span key={i} style={{ background:"white", border:"1px solid #cbd5e1", borderRadius:"20px", padding:"3px 10px", fontSize:"0.74rem", color:"#334155" }}>{m.name}</span>
//                   ))}
//                 </div>
//               </div>
//               <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
//                 <button onClick={onClose} style={{ padding:"9px 20px", borderRadius:"10px", border:"1.5px solid #e2e8f0", background:"white", color:"#64748b", fontWeight:500, cursor:"pointer", fontSize:"0.86rem" }}>Cancel</button>
//                 <motion.button whileHover={charCount>=30?{scale:1.03}:{}} whileTap={charCount>=30?{scale:0.97}:{}}
//                   onClick={handleSendToAI} disabled={charCount<30}
//                   style={{ padding:"9px 22px", borderRadius:"10px", border:"none", background:charCount>=30?"linear-gradient(120deg,#193648,#2d6a9f)":"#e2e8f0", color:charCount>=30?"white":"#94a3b8", fontWeight:600, cursor:charCount>=30?"pointer":"not-allowed", display:"flex", alignItems:"center", gap:8, fontSize:"0.86rem" }}>
//                   <Sparkles size={15}/> Send to AI <ChevronRight size={13}/>
//                 </motion.button>
//               </div>
//             </>
//           )}

//           {/* PROCESSING PHASE */}
//           {phase==="processing" && (
//             <div style={{ textAlign:"center", padding:"46px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:18 }}>
//               <div style={{ width:68, height:68, borderRadius:"50%", background:"linear-gradient(135deg,#193648,#3a70b0)", display:"flex", alignItems:"center", justifyContent:"center" }}>
//                 <Bot size={32} color="white"/>
//               </div>
//               <div>
//                 <div style={{ fontWeight:700, fontSize:"1.1rem", color:"#193648", marginBottom:5 }}>AI is processing your notes…</div>
//                 <div style={{ color:"#64748b", fontSize:"0.86rem" }}>Structuring decisions, assigning responsibilities</div>
//               </div>
//               <div style={{ display:"flex", gap:7 }}>
//                 {["Analysing notes","Extracting decisions","Structuring output"].map((label,i)=>(
//                   <motion.div key={i} animate={{ opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:1.8, delay:i*0.6 }}
//                     style={{ background:"#f1f5f9", borderRadius:"20px", padding:"4px 11px", fontSize:"0.73rem", color:"#475569", display:"flex", alignItems:"center", gap:4 }}>
//                     <Loader size={10}/>{label}
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* EDIT PHASE */}
//           {phase==="edit" && editData && (
//             <>
//               <div style={{ background:"linear-gradient(120deg,#eff6ff,#dbeafe)", border:"1px solid #93c5fd", borderRadius:"12px", padding:"12px 16px", marginBottom:20, display:"flex", gap:10, alignItems:"center" }}>
//                 <span style={{ fontSize:"1.1rem" }}>✏️</span>
//                 <div>
//                   <div style={{ fontWeight:700, color:"#1e40af", fontSize:"0.88rem" }}>AI generated your minutes — edit anything before saving</div>
//                   <div style={{ color:"#3b82f6", fontSize:"0.76rem", marginTop:1 }}>All fields are editable. Add, remove, or change decisions, actions, and more.</div>
//                 </div>
//               </div>

//               <div style={{ marginBottom:18 }}>
//                 <div style={sectionLabel}>📌 Meeting Title</div>
//                 <input value={editData.meetingTitle||""} onChange={e=>updateField("meetingTitle",e.target.value)} style={editInput} onFocus={onFocus} onBlur={onBlur}/>
//               </div>
//               <div style={{ marginBottom:18 }}>
//                 <div style={sectionLabel}>📝 Executive Summary</div>
//                 <textarea value={editData.summary||""} onChange={e=>updateField("summary",e.target.value)} style={{ ...editTextarea, minHeight:72 }} onFocus={onFocus} onBlur={onBlur}/>
//               </div>

//               {/* Key Decisions */}
//               <div style={{ marginBottom:18 }}>
//                 <div style={sectionLabel}>✅ Key Decisions <button style={addBtn} onClick={addDecision}>+ Add Decision</button></div>
//                 {editData.keyDecisions.map((d,idx)=>(
//                   <div key={d.id} style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:"10px", padding:"12px 14px", marginBottom:10 }}>
//                     <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
//                       <span style={{ minWidth:22, height:22, borderRadius:"50%", background:"#193648", color:"white", fontSize:"0.68rem", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>{idx+1}</span>
//                       <div style={{ flex:1 }}>
//                         <input value={d.decision} onChange={e=>updateDecision(d.id,"decision",e.target.value)} placeholder="Decision made..." style={{ ...editInput, marginBottom:6, fontWeight:600 }} onFocus={onFocus} onBlur={onBlur}/>
//                         <input value={d.rationale||""} onChange={e=>updateDecision(d.id,"rationale",e.target.value)} placeholder="Rationale / reason..." style={{ ...editInput, fontSize:"0.78rem", color:"#64748b" }} onFocus={onFocus} onBlur={onBlur}/>
//                       </div>
//                       <button style={removeBtn} onClick={()=>removeDecision(d.id)}>✕</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Action Items */}
//               <div style={{ marginBottom:18 }}>
//                 <div style={sectionLabel}>🎯 Action Items <button style={addBtn} onClick={addAction}>+ Add Action</button></div>
//                 {editData.actionItems.map((a,idx)=>(
//                   <div key={a.id} style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:"10px", padding:"12px 14px", marginBottom:10 }}>
//                     <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
//                       <span style={{ minWidth:22, height:22, borderRadius:"50%", background:"#3a70b0", color:"white", fontSize:"0.68rem", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>{idx+1}</span>
//                       <div style={{ flex:1 }}>
//                         <input value={a.task} onChange={e=>updateAction(a.id,"task",e.target.value)} placeholder="Task description..." style={{ ...editInput, marginBottom:6, fontWeight:600 }} onFocus={onFocus} onBlur={onBlur}/>
//                         <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:8 }}>
//                           <input value={a.responsible||""} onChange={e=>updateAction(a.id,"responsible",e.target.value)} placeholder="👤 Responsible" style={editInput} onFocus={onFocus} onBlur={onBlur}/>
//                           <input value={a.deadline||""} onChange={e=>updateAction(a.id,"deadline",e.target.value)} placeholder="📅 Deadline" style={editInput} onFocus={onFocus} onBlur={onBlur}/>
//                           <select value={a.priority||"Medium"} onChange={e=>updateAction(a.id,"priority",e.target.value)} style={{ ...editInput, background:priColors[a.priority]||"#fef3c7", color:priText[a.priority]||"#92400e", fontWeight:700, cursor:"pointer" }}>
//                             <option value="High">High</option>
//                             <option value="Medium">Medium</option>
//                             <option value="Low">Low</option>
//                           </select>
//                         </div>
//                       </div>
//                       <button style={removeBtn} onClick={()=>removeAction(a.id)}>✕</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Discussion Points */}
//               <div style={{ marginBottom:18 }}>
//                 <div style={sectionLabel}>💬 Discussion Points <button style={addBtn} onClick={addDisc}>+ Add Point</button></div>
//                 {(editData.discussionPoints||[]).map((d,i)=>(
//                   <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
//                     <span style={{ color:"#94a3b8", fontSize:"0.8rem", flexShrink:0 }}>•</span>
//                     <input value={d} onChange={e=>updateDisc(i,e.target.value)} placeholder="Discussion point..." style={{ ...editInput, flex:1 }} onFocus={onFocus} onBlur={onBlur}/>
//                     <button style={removeBtn} onClick={()=>removeDisc(i)}>✕</button>
//                   </div>
//                 ))}
//               </div>

//               <div style={{ marginBottom:18 }}>
//                 <div style={sectionLabel}>🚀 Next Steps</div>
//                 <textarea value={editData.nextSteps||""} onChange={e=>updateField("nextSteps",e.target.value)} style={{ ...editTextarea, minHeight:56 }} onFocus={onFocus} onBlur={onBlur}/>
//               </div>
//               <div style={{ marginBottom:22 }}>
//                 <div style={sectionLabel}>📅 Next Meeting Note</div>
//                 <input value={editData.nextMeetingNote||""} onChange={e=>updateField("nextMeetingNote",e.target.value)} placeholder="e.g. In 4 weeks — follow up on action items" style={editInput} onFocus={onFocus} onBlur={onBlur}/>
//               </div>

//               <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap", paddingTop:14, borderTop:"1px solid #f1f5f9" }}>
//                 <button onClick={()=>setPhase("write")} style={{ padding:"9px 18px", borderRadius:"10px", border:"1.5px solid #e2e8f0", background:"white", color:"#64748b", fontWeight:500, cursor:"pointer", fontSize:"0.84rem", display:"flex", alignItems:"center", gap:6 }}>
//                   ← Back to Notes
//                 </button>
//                 <div style={{ display:"flex", gap:10 }}>
//                   <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={handleSaveOnly} disabled={isRegenerating}
//                     style={{ padding:"9px 20px", borderRadius:"10px", border:"none", background:"#10b981", color:"white", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontSize:"0.84rem", opacity:isRegenerating?0.7:1 }}>
//                     {isRegenerating?<Loader size={14}/>:<CheckCircle2 size={14}/>} Save & Close
//                   </motion.button>
//                   <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={handleDownloadAndSave} disabled={isRegenerating}
//                     style={{ padding:"9px 22px", borderRadius:"10px", border:"none", background:"linear-gradient(120deg,#193648,#2d6a9f)", color:"white", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:7, fontSize:"0.84rem", opacity:isRegenerating?0.7:1 }}>
//                     {isRegenerating?<Loader size={14}/>:<Download size={14}/>} Download PDF & Save
//                   </motion.button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════
//    MAIN COMPONENT
// ══════════════════════════════════════════════ */
// const AdvisoryMeeting = () => {
//   const [meetings, setMeetings] = React.useState([]);
//   const [activeTab, setActiveTab] = React.useState("create");
//   const [showInviteModal, setShowInviteModal] = React.useState(false);
//   const [selectedReps, setSelectedReps] = React.useState([]);
//   const [notesModalFor, setNotesModalFor] = React.useState(null);
//   const [newMeeting, setNewMeeting] = React.useState({ agenda:"", date:"", time:"", venue:"" });

//   const boardMembers = [
//     { name:"Dean", role:"Chairperson" },
//     { name:"HOD", role:"Head of Department" },
//     { name:"Industry Liaison Officer", role:"Coordinator" },
//     { name:"ABC Tech Representative", role:"Industry Partner" },
//     { name:"Student Representative", role:"Board Member" },
//   ];

//   const industryReps = [
//     { name:"Ali Khan – ABC Tech", suggested:true },
//     { name:"Sara Ahmed – Innovate Labs", suggested:false },
//     { name:"Bilal Rehman – FutureVision Ltd", suggested:true },
//     { name:"Ayesha Noor – TechSphere", suggested:false },
//     { name:"Omar Siddiqui – DataNest", suggested:false },
//   ];

//   const handleAddMeeting = () => {
//     if (!newMeeting.agenda||!newMeeting.date||!newMeeting.time||!newMeeting.venue) {
//       alert("Please fill all meeting details!"); return;
//     }
//     const entry = { ...newMeeting, id:Date.now(), status:"Scheduled", boardMembers };
//     setMeetings(prev=>[...prev, entry]);
//     setNewMeeting({ agenda:"", date:"", time:"", venue:"" });
//     setShowInviteModal(true);
//   };

//   const handleRepSelect = (rep) => {
//     setSelectedReps(prev => prev.includes(rep.name)?prev.filter(r=>r!==rep.name):[...prev,rep.name]);
//   };

//   const sendInvitations = () => {
//     if (selectedReps.length===0) { alert("Please select at least one representative."); return; }
//     alert(`✅ Invitations sent to: ${selectedReps.join(", ")}`);
//     setSelectedReps([]); setShowInviteModal(false);
//   };

//   const handleMinutesGenerated = (meetingId, minutesData, downloadUrl) => {
//     setMeetings(prev=>prev.map(m=>m.id===meetingId?{...m,status:"Completed",minutesGenerated:true,minutesData,downloadUrl}:m));
//   };

//   const downloadMinutes = (meeting) => {
//     if (!meeting.downloadUrl) return;
//     const a = document.createElement("a");
//     a.href = meeting.downloadUrl;
//     a.download = `Minutes_${meeting.agenda.replace(/\s+/g,"_")}_${meeting.date}.pdf`;
//     document.body.appendChild(a); a.click(); document.body.removeChild(a);
//   };

//   return (
//     <div className="page-container">
//       <AnimatePresence>
//         {notesModalFor && (
//           <NotesModal meeting={notesModalFor} onClose={()=>setNotesModalFor(null)} onGenerated={handleMinutesGenerated}/>
//         )}
//       </AnimatePresence>

//       {/* Header */}
//       <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="advisory-header">
//         <div className="flex items-center gap-4">
//           <div className="advisory-title">
//             <h1>Advisory Board Meeting Management</h1>
//             <p>Efficiently organize, schedule, and track advisory board meetings.</p>
//           </div>
//         </div>
//       </motion.div>

//       {/* Tabs */}
//       <div className="tab-buttons">
//         <button className={activeTab==="create"?"active":""} onClick={()=>setActiveTab("create")}>📅 Schedule New Meeting</button>
//         <button className={activeTab==="records"?"active":""} onClick={()=>setActiveTab("records")}>📘 View Meeting Records</button>
//       </div>

//       {/* Stats */}
//       <div className="stats-row">
//         <div className="stat-card stat-total"><CalendarDays size={26}/><div className="stat-info"><span className="stat-number">{meetings.length}</span><span className="stat-label">Total Meetings</span></div></div>
//         <div className="stat-card stat-scheduled"><Clock size={26}/><div className="stat-info"><span className="stat-number">{meetings.filter(m=>m.status==="Scheduled").length}</span><span className="stat-label">Scheduled</span></div></div>
//         <div className="stat-card stat-completed"><CheckCircle2 size={26}/><div className="stat-info"><span className="stat-number">{meetings.filter(m=>m.minutesGenerated).length}</span><span className="stat-label">Completed with MoM</span></div></div>
//       </div>

//       {/* Create Tab */}
//       {activeTab==="create" && (
//         <motion.div initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="meeting-card fade-in">
//           <h2 className="section-title flex items-center gap-2"><CalendarDays/> Enter Meeting Details</h2>
//           <div className="grid md:grid-cols-2 gap-6 mt-4">
//             <div><label className="meeting-label">Agenda</label><input type="text" placeholder="e.g., University-Industry Collaboration" value={newMeeting.agenda} onChange={e=>setNewMeeting({...newMeeting,agenda:e.target.value})}/></div>
//             <div><label className="meeting-label">Date</label><input type="date" value={newMeeting.date} onChange={e=>setNewMeeting({...newMeeting,date:e.target.value})}/></div>
//             <div><label className="meeting-label">Time</label><input type="time" value={newMeeting.time} onChange={e=>setNewMeeting({...newMeeting,time:e.target.value})}/></div>
//             <div><label className="meeting-label">Venue / Meeting Link</label><input type="text" placeholder="e.g., Conference Room A / Zoom Link" value={newMeeting.venue} onChange={e=>setNewMeeting({...newMeeting,venue:e.target.value})}/></div>
//           </div>
//           <div className="mt-8">
//             <h3 className="section-title flex items-center gap-1"><Users size={18}/> Board Members</h3>
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
//               {boardMembers.map((member,i)=>(
//                 <motion.div key={i} whileHover={{ scale:1.05 }} className="member-card">
//                   <h4>{member.name}</h4><p>{member.role}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//           <div className="flex gap-4 mt-6">
//             <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={handleAddMeeting} className="schedule-btn">
//               <Send size={18}/> Schedule Meeting
//             </motion.button>
//           </div>
//         </motion.div>
//       )}

//       {/* Invite Modal */}
//       {showInviteModal && (
//         <div className="modal-overlay">
//           <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ duration:0.4 }} className="card-modal-box">
//             <h2 className="modal-title flex items-center gap-2 mb-5"><Mail/> Send Invitations to Industry Representatives</h2>
//             <div className="grid sm:grid-cols-2 gap-4">
//               {industryReps.map((rep,i)=>(
//                 <div key={i} className={`rep-card ${selectedReps.includes(rep.name)?"selected":""}`} onClick={()=>handleRepSelect(rep)}>
//                   <div className="rep-content"><h4>{rep.name}</h4>{rep.suggested&&<span className="suggested-badge">System Suggested</span>}</div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-end gap-3 mt-6">
//               <button className="cancel-btn" onClick={()=>setShowInviteModal(false)}>Cancel</button>
//               <button className="send-btn" onClick={sendInvitations}>Send Invitation</button>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Records Tab */}
//       {activeTab==="records" && (
//         <motion.div initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="table-container fade-in">
//           <h2 className="section-title flex items-center gap-2 mb-4"><FileText/> Scheduled Meetings</h2>
//           {meetings.length===0 ? (
//             <div className="text-center py-12">
//               <FileText size={48} className="mx-auto text-gray-300 mb-4"/>
//               <p className="text-gray-600 text-lg">No meetings scheduled yet.</p>
//               <p className="text-gray-500 text-sm mt-2">Create your first meeting to get started!</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="records-table">
//                 <thead><tr><th>Agenda</th><th>Date</th><th>Time</th><th>Venue</th><th>Status</th><th>Write & Generate MoM</th><th>Download Minutes</th></tr></thead>
//                 <tbody>
//                   {meetings.map((m)=>(
//                     <tr key={m.id}>
//                       <td className="font-medium">{m.agenda}</td>
//                       <td>{m.date}</td><td>{m.time}</td>
//                       <td className="max-w-xs truncate">{m.venue}</td>
//                       <td>{m.status==="Scheduled"?<span className="status-scheduled"><Clock size={15}/> Scheduled</span>:<span className="status-completed"><CheckCircle2 size={15}/> Completed</span>}</td>
//                       <td>
//                         {m.minutesGenerated?(
//                           <span style={{ color:"#059669", fontWeight:600, fontSize:"0.8rem", display:"flex", alignItems:"center", gap:5, justifyContent:"center" }}><CheckCircle2 size={14}/> Generated</span>
//                         ):(
//                           <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={()=>setNotesModalFor(m)}
//                             style={{ background:"linear-gradient(120deg,#193648,#2d6a9f)", color:"white", border:"none", borderRadius:"9px", padding:"8px 16px", cursor:"pointer", fontWeight:600, fontSize:"0.8rem", display:"flex", alignItems:"center", gap:6, margin:"auto" }}>
//                             <Sparkles size={14}/> Write Notes
//                           </motion.button>
//                         )}
//                       </td>
//                       <td>
//                         {m.minutesGenerated?(
//                           <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} className="download-btn" onClick={()=>downloadMinutes(m)}>
//                             <Download size={16}/> Download
//                           </motion.button>
//                         ):(
//                           <span className="not-generated"><FileCheck size={15}/> Not Generated</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </motion.div>
//       )}

//       <style>{`
//         body { font-family:'Poppins',sans-serif; background:linear-gradient(135deg,#e2eef9 0%,#ffffff 100%); }
//         .page-container { padding:40px 20px; min-height:100vh; }
//         .advisory-header { display:flex; justify-content:space-between; align-items:center; background:linear-gradient(90deg,#193648,#3a70b0); padding:25px 40px; border-radius:20px; box-shadow:0 15px 35px rgba(0,0,0,0.12); margin-bottom:40px; color:white; }
//         .advisory-title h1 { font-size:2rem; font-weight:700; margin:0; }
//         .advisory-title p { font-size:0.95rem; margin-top:6px; color:#dce3f2; margin-bottom:0; }
//         .tab-buttons { display:flex; justify-content:center; gap:20px; margin-bottom:40px; }
//         .tab-buttons button { padding:12px 28px; border-radius:12px; background:#e4e9f1; color:#193648; font-weight:500; cursor:pointer; border:none; transition:all 0.3s ease; font-size:0.95rem; }
//         .tab-buttons button.active { background:#193648; color:white; transform:scale(1.05); box-shadow:0 5px 15px rgba(25,54,72,0.3); }
//         .tab-buttons button:hover:not(.active) { background:#d1d9e6; transform:translateY(-2px); }
//         .stats-row { display:flex; gap:20px; justify-content:center; margin-bottom:35px; flex-wrap:wrap; }
//         .stat-card { display:flex; align-items:center; gap:14px; background:white; padding:18px 24px; border-radius:16px; box-shadow:0 6px 20px rgba(0,0,0,0.07); border:1px solid #edf1f7; min-width:170px; }
//         .stat-total { border-top:3px solid #3a70b0; } .stat-scheduled { border-top:3px solid #f59e0b; } .stat-completed { border-top:3px solid #10b981; }
//         .stat-info { display:flex; flex-direction:column; }
//         .stat-number { font-size:1.6rem; font-weight:700; color:#193648; line-height:1; }
//         .stat-label { font-size:0.78rem; color:#64748b; margin-top:3px; }
//         .meeting-card { background:white; border-radius:20px; padding:40px; max-width:900px; margin:auto; box-shadow:0 10px 35px rgba(0,0,0,0.1); border:1px solid #edf1f7; }
//         input[type='text'],input[type='date'],input[type='time'] { width:100%; box-sizing:border-box; padding:10px 15px; margin-top:5px; border:1.5px solid #d3d9e1; border-radius:10px; outline:none; transition:all 0.3s ease; background:#fff; color:#193648; font-family:'Poppins',sans-serif; font-size:0.9rem; }
//         input:focus { border-color:#193648; box-shadow:0 0 0 3px rgba(25,54,72,0.2); }
//         .meeting-label { font-size:0.9rem; color:#193648; font-weight:500; }
//         .section-title { font-weight:600; font-size:1.1rem; color:#193648; margin-top:20px; }
//         .member-card { background:#f8fafc; border-radius:12px; padding:15px; border:1px solid #e2e8f0; box-shadow:0 3px 8px rgba(0,0,0,0.05); text-align:center; }
//         .member-card h4 { font-weight:600; color:#193648; } .member-card p { color:#3a70b0; font-size:0.85rem; margin-top:4px; }
//         .schedule-btn { background:#193648; color:white; padding:12px 35px; border-radius:12px; font-weight:500; display:flex; align-items:center; gap:8px; border:none; cursor:pointer; transition:all 0.3s ease; margin-top:25px; }
//         .schedule-btn:hover { background:#204d76; transform:scale(1.05); }
//         .table-container { max-width:1300px; margin:auto; background:white; padding:30px; border-radius:18px; box-shadow:0 10px 35px rgba(0,0,0,0.1); border:1px solid #edf1f7; }
//         table { width:100%; border-collapse:collapse; text-align:center; }
//         th { background:#193648; color:white; padding:12px; font-size:0.9rem; }
//         td { padding:12px 10px; border-bottom:1px solid #e2e8f0; vertical-align:middle; }
//         tr:hover { background:#f1f6fb; }
//         .download-btn { background:#10b981; color:white; border:none; padding:8px 16px; border-radius:8px; font-weight:500; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.3s ease; margin:auto; }
//         .download-btn:hover { background:#059669; transform:scale(1.05); }
//         .not-generated { display:flex; align-items:center; justify-content:center; gap:5px; color:#94a3b8; font-size:0.82rem; }
//         .status-scheduled { display:inline-flex; align-items:center; gap:5px; background:#fef3c7; color:#92400e; padding:4px 10px; border-radius:20px; font-size:0.8rem; font-weight:600; }
//         .status-completed { display:inline-flex; align-items:center; gap:5px; background:#d1fae5; color:#065f46; padding:4px 10px; border-radius:20px; font-size:0.8rem; font-weight:600; }
//         .modal-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:999; }
//         .card-modal-box { background:#fff; border-radius:20px; padding:35px; width:700px; max-width:95%; box-shadow:0 15px 40px rgba(0,0,0,0.25); border:1px solid #e2e8f0; }
//         .modal-title { font-weight:600; font-size:1.2rem; color:#193648; }
//         .rep-card { position:relative; background:#f3f4f6; border-radius:16px; padding:18px; cursor:pointer; transition:all 0.3s ease; border:1px solid #d1d5db; }
//         .rep-card:hover { transform:translateY(-3px) scale(1.02); box-shadow:0 8px 25px rgba(0,0,0,0.15); }
//         .rep-card.selected { border-color:#193648; background:#e4f0ff; }
//         .rep-content { display:flex; align-items:center; justify-content:space-between; }
//         .suggested-badge { background:#ffe8b0; color:#b87b00; font-weight:600; font-size:0.75rem; padding:3px 7px; border-radius:6px; }
//         .cancel-btn { padding:10px 25px; border-radius:12px; background:#f3f4f6; color:#193648; font-weight:500; cursor:pointer; border:none; }
//         .send-btn { padding:10px 25px; border-radius:12px; background:#193648; color:white; font-weight:500; cursor:pointer; border:none; }
//       `}</style>
//     </div>
//   );
// };

// export default AdvisoryMeeting;













import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Users, FileText, CheckCircle2, Clock, Send, Mail,
  Download, FileCheck, Loader, Sparkles, PenLine, X, ChevronRight,
  Bot, ClipboardList, AlertCircle
} from "lucide-react";
import collaxionLogo from "../images/collaxionlogo.jpeg";

const API_BASE = "http://localhost:5000/api/meeting-minutes"; // ✅ apna URL

/* ─────────────────────────────────────────────
   Helper: call backend proxy → Anthropic API
───────────────────────────────────────────── */
const callClaudeForMinutes = async (roughNotes, meetingMeta) => {
  const systemPrompt = `You are a professional meeting secretary for an Advisory Board.
Your job is to transform rough meeting notes into a well-structured meeting minutes document.
Always respond with ONLY valid JSON — no markdown fences, no backticks, no preamble, no trailing text.
The JSON must match this exact schema:
{
  "meetingTitle": "string",
  "summary": "string (2-3 sentences executive summary)",
  "keyDecisions": [
    { "id": 1, "decision": "string", "rationale": "string" }
  ],
  "actionItems": [
    { "id": 1, "task": "string", "responsible": "string", "deadline": "string", "priority": "High|Medium|Low" }
  ],
  "discussionPoints": ["string"],
  "nextSteps": "string",
  "nextMeetingNote": "string"
}`;

  const userPrompt = `Meeting Details:
- Agenda: ${meetingMeta.agenda}
- Date: ${meetingMeta.date}
- Time: ${meetingMeta.time}
- Venue: ${meetingMeta.venue}
- Attendees: ${meetingMeta.boardMembers.map(b => `${b.name} (${b.role})`).join(", ")}

Rough Meeting Notes:
${roughNotes}

Transform these rough notes into professional meeting minutes. Return ONLY the JSON object.`;

  let response;
  try {
    response = await fetch("http://localhost:5000/api/generate-minutes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt, userPrompt }),
    });
  } catch (networkErr) {
    throw new Error("Cannot reach server at localhost:5000. Make sure your backend is running.");
  }

  const rawText = await response.text();
  if (!response.ok) {
    let detail = rawText;
    try { detail = JSON.parse(rawText)?.details || JSON.parse(rawText)?.error || rawText; } catch (_) {}
    throw new Error(`Server error ${response.status}: ${String(detail).slice(0, 300)}`);
  }

  let data;
  try { data = JSON.parse(rawText); } catch {
    throw new Error("Server returned invalid response. Check backend logs.");
  }

  const content = data.content;
  if (!content) throw new Error("AI returned empty content. Please try again.");
  if (typeof content === "object") return content;

  const cleaned = content
    .replace(/^```json\s*/gi, "").replace(/^```\s*/gi, "").replace(/```\s*$/gi, "").trim();
  try { return JSON.parse(cleaned); } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse AI response. Please try again.");
  }
};

/* ─────────────────────────────────────────────
   Helper: build & download PDF with pdf-lib
───────────────────────────────────────────── */
const sanitizeText = (input) => {
  if (input == null) return "";
  return String(input)
    .replace(/[\u2013\u2014]/g, "-").replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"').replace(/\u2022/g, "-")
    .replace(/\u2026/g, "...").replace(/\u00A0/g, " ")
    .replace(/[^\x00-\xFF]/g, "?");
};

const createMinutesPDF = async (minutesData, meetingMeta) => {
  const { PDFDocument, rgb, StandardFonts } = await import("https://cdn.jsdelivr.net/esm/pdf-lib@1.17.1");

  const doc     = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold    = await doc.embedFont(StandardFonts.HelveticaBold);
  const italic  = await doc.embedFont(StandardFonts.HelveticaOblique);

  const navy     = rgb(0.06, 0.16, 0.28); const navyDark = rgb(0.04, 0.10, 0.20);
  const blue     = rgb(0.16, 0.50, 0.73); const blueLt   = rgb(0.84, 0.92, 0.97);
  const green    = rgb(0.15, 0.68, 0.38); const greenLt  = rgb(0.83, 0.94, 0.87);
  const amber    = rgb(0.95, 0.61, 0.07); const amberLt  = rgb(0.99, 0.95, 0.83);
  const red      = rgb(0.75, 0.22, 0.17); const redLt    = rgb(0.98, 0.86, 0.85);
  const white    = rgb(1, 1, 1);          const offWhite = rgb(0.97, 0.975, 0.982);
  const black    = rgb(0.12, 0.12, 0.14); const gray     = rgb(0.44, 0.47, 0.51);
  const grayMid  = rgb(0.72, 0.74, 0.77); const grayLt   = rgb(0.91, 0.92, 0.94);
  const divider  = rgb(0.87, 0.89, 0.92);

  const W = 612, H = 792, ML = 50, MB = 52, CW = W - ML - ML;
  let page, y;

  const S = (t) => {
    if (t == null) return "";
    return String(t)
      .replace(/[\u2013\u2014]/g, "-").replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"').replace(/\u2022/g, "-")
      .replace(/\u2026/g, "...").replace(/\u00A0/g, " ")
      .replace(/[^\x00-\xFF]/g, "?");
  };

  const wrap = (text, maxW, size) => {
    const cpp = Math.max(1, Math.floor(maxW / (size * 0.545)));
    const words = S(text).split(" ");
    let line = "", out = [];
    for (const w of words) {
      const t = line ? line + " " + w : w;
      if (t.length > cpp && line) { out.push(line); line = w; } else line = t;
    }
    if (line) out.push(line);
    return out;
  };

  const T = (text, opts = {}) => {
    const { x = ML, size = 10, font = regular, color = black, maxW = CW, lh = 1.55, dx = 0 } = opts;
    const lines = wrap(text, maxW - dx, size);
    for (const l of lines) {
      if (y - size - 2 < MB) { footerOn(); addPage(); headerOn(); }
      page.drawText(l, { x: x + dx, y: y - size, font, size, color });
      y -= size * lh;
    }
  };

  const addPage = () => { page = doc.addPage([W, H]); y = H - 50; };
  const headerOn = () => {
    page.drawRectangle({ x: 0, y: H - 32, width: W, height: 32, color: navyDark });
    page.drawRectangle({ x: 0, y: H - 32, width: 5, height: 32, color: blue });
    page.drawText("ADVISORY BOARD MEETING MINUTES", { x: ML + 4, y: H - 21, font: bold, size: 8, color: rgb(0.65, 0.76, 0.87) });
    page.drawText(S(meetingMeta.agenda || "").slice(0, 55), { x: W / 2 - 70, y: H - 21, font: italic, size: 8, color: rgb(0.65, 0.76, 0.87) });
    page.drawText("CollaXion", { x: W - ML - 44, y: H - 21, font: bold, size: 9, color: blue });
    y = H - 46;
  };
  const footerOn = () => {
    page.drawLine({ start: { x: ML, y: MB - 6 }, end: { x: W - ML, y: MB - 6 }, thickness: 0.5, color: grayLt });
    page.drawText("CollaXion — Confidential Advisory Board Record", { x: ML, y: MB - 18, font: italic, size: 7, color: grayMid });
    const pn = doc.getPageCount();
    page.drawText(`Page ${pn}`, { x: W - ML - 32, y: MB - 18, font: bold, size: 7, color: grayMid });
  };
  const need = (h) => { if (y - h < MB + 10) { footerOn(); addPage(); headerOn(); } };
  const heading = (title) => {
    need(36);
    page.drawRectangle({ x: ML, y: y - 28, width: 5, height: 28, color: blue });
    page.drawRectangle({ x: ML + 5, y: y - 28, width: CW - 5, height: 28, color: offWhite });
    page.drawText(S(title).toUpperCase(), { x: ML + 14, y: y - 18, font: bold, size: 9.5, color: navy });
    y -= 36;
  };
  const pill = (label, px, py) => {
    const map = { High: [redLt, red], Medium: [amberLt, amber], Low: [greenLt, green] };
    const [bg, fg] = map[label] || map.Medium;
    const pw = label.length * 5.6 + 14;
    page.drawRectangle({ x: px, y: py - 10, width: pw, height: 12, color: bg });
    page.drawText(S(label), { x: px + 7, y: py - 7, font: bold, size: 7.5, color: fg });
  };

  addPage();
  const COVER_H = 210;
  page.drawRectangle({ x: 0, y: H - COVER_H, width: W, height: COVER_H, color: navyDark });
  page.drawRectangle({ x: W - 10, y: H - COVER_H, width: 10, height: COVER_H, color: blue });
  page.drawRectangle({ x: 0, y: H - 30, width: W - 10, height: 30, color: navy });
  page.drawText("OFFICIAL DOCUMENT  |  ADVISORY BOARD", { x: ML, y: H - 20, font: bold, size: 7, color: rgb(0.5, 0.66, 0.82) });
  page.drawText(S(new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })), { x: W - ML - 200, y: H - 20, font: regular, size: 7, color: rgb(0.5, 0.66, 0.82) });
  page.drawLine({ start: { x: ML, y: H - 32 }, end: { x: W - 20, y: H - 32 }, thickness: 0.4, color: rgb(0.22, 0.35, 0.50) });
  page.drawText("CollaXion", { x: ML, y: H - 62, font: bold, size: 24, color: blue });
  page.drawText("Advisory Board", { x: ML, y: H - 85, font: regular, size: 12, color: rgb(0.72, 0.82, 0.91) });
  page.drawText("Meeting Minutes", { x: ML, y: H - 108, font: bold, size: 30, color: white });
  page.drawLine({ start: { x: ML, y: H - 122 }, end: { x: W - 22, y: H - 122 }, thickness: 0.5, color: rgb(0.22, 0.35, 0.50) });
  const mtLines = wrap(minutesData.meetingTitle || meetingMeta.agenda || "Advisory Board Meeting", CW - 20, 11.5);
  let mtY = H - 140;
  for (const ln of mtLines.slice(0, 3)) { page.drawText(S(ln), { x: ML, y: mtY, font: bold, size: 11.5, color: rgb(0.83, 0.90, 0.96) }); mtY -= 17; }

  const cardTop = H - COVER_H - 16, cardH = 46, cardW = (CW - 12) / 3;
  const cards = [{ label: "DATE", val: meetingMeta.date || "—" }, { label: "TIME", val: meetingMeta.time || "—" }, { label: "VENUE", val: meetingMeta.venue || "—" }];
  cards.forEach((c, i) => {
    const cx = ML + i * (cardW + 6);
    page.drawRectangle({ x: cx + 1, y: cardTop - cardH - 1, width: cardW, height: cardH, color: grayLt });
    page.drawRectangle({ x: cx, y: cardTop - cardH, width: cardW, height: cardH, color: white });
    page.drawRectangle({ x: cx, y: cardTop - 3, width: cardW, height: 3, color: blue });
    page.drawText(c.label, { x: cx + 8, y: cardTop - 13, font: bold, size: 7, color: blue });
    const vw = wrap(S(c.val), cardW - 16, 10);
    vw.slice(0, 2).forEach((vl, vi) => { page.drawText(vl, { x: cx + 8, y: cardTop - 26 - vi * 13, font: bold, size: 10, color: navy }); });
  });
  y = cardTop - cardH - 22;

  if (minutesData.summary) {
    need(50); y -= 6; heading("Executive Summary");
    const sumLines = wrap(minutesData.summary, CW - 18, 9.5);
    const boxH = sumLines.length * 14 + 16;
    need(boxH + 8);
    page.drawRectangle({ x: ML, y: y - boxH, width: 4, height: boxH, color: blue });
    page.drawRectangle({ x: ML + 4, y: y - boxH, width: CW - 4, height: boxH, color: rgb(0.96, 0.97, 0.99) });
    y -= 10;
    T(minutesData.summary, { font: italic, size: 9.5, color: gray, dx: 14 });
    y -= 6;
  }

  y -= 4; heading("Attendees");
  const half = CW / 2;
  meetingMeta.boardMembers.forEach((m, i) => {
    const col = i % 2, ax = ML + col * half;
    if (col === 0) need(30);
    page.drawCircle({ x: ax + 7, y: y - 8, size: 3.5, color: blue });
    page.drawText(S(m.name), { x: ax + 18, y: y - 11, font: bold, size: 9.5, color: navy });
    page.drawText(S(m.role), { x: ax + 18, y: y - 22, font: regular, size: 8, color: gray });
    if (col === 1 || i === meetingMeta.boardMembers.length - 1) y -= 30;
  });
  y -= 8;

  if ((minutesData.keyDecisions || []).length > 0) {
    y -= 4; heading("Key Decisions");
    (minutesData.keyDecisions || []).forEach((d, i) => {
      need(48);
      page.drawRectangle({ x: ML, y: y - 22, width: 22, height: 22, color: navy });
      page.drawText(String(i + 1), { x: ML + (i >= 9 ? 5 : 7), y: y - 15, font: bold, size: 9, color: white });
      T(S(d.decision), { font: bold, size: 9.5, color: black, dx: 30 });
      if (d.rationale) T("Rationale: " + S(d.rationale), { font: italic, size: 8.5, color: gray, dx: 30 });
      page.drawLine({ start: { x: ML + 28, y: y }, end: { x: W - ML, y: y }, thickness: 0.35, color: divider });
      y -= 8;
    });
    y -= 4;
  }

  if ((minutesData.actionItems || []).length > 0) {
    y -= 4; heading("Action Items");
    need(22);
    page.drawRectangle({ x: ML, y: y - 20, width: CW, height: 20, color: navy });
    const COL = { num: ML + 6, task: ML + 22, resp: ML + 240, dl: ML + 360, pri: ML + 458 };
    [["#", COL.num], ["Task", COL.task], ["Responsible", COL.resp], ["Deadline", COL.dl], ["Priority", COL.pri]].forEach(([lbl, lx]) => {
      page.drawText(lbl, { x: lx, y: y - 13, font: bold, size: 8, color: white });
    });
    y -= 20;
    (minutesData.actionItems || []).forEach((a, i) => {
      need(32);
      const rH = 30, bg = i % 2 === 0 ? white : offWhite;
      page.drawRectangle({ x: ML, y: y - rH, width: CW, height: rH, color: bg });
      page.drawRectangle({ x: ML, y: y - rH, width: 4, height: rH, color: blueLt });
      page.drawLine({ start: { x: ML, y: y - rH }, end: { x: W - ML, y: y - rH }, thickness: 0.3, color: divider });
      page.drawText(String(i + 1), { x: COL.num, y: y - 18, font: bold, size: 8, color: gray });
      const tLines = wrap(S(a.task), 210, 8.5);
      tLines.slice(0, 2).forEach((tl, ti) => { page.drawText(tl, { x: COL.task, y: y - 11 - ti * 11, font: bold, size: 8.5, color: black }); });
      const rLines = wrap(S(a.responsible || "TBD"), 110, 8);
      rLines.slice(0, 2).forEach((rl, ri) => { page.drawText(rl, { x: COL.resp, y: y - 11 - ri * 10, font: regular, size: 8, color: navy }); });
      page.drawText(S(a.deadline || "TBD"), { x: COL.dl, y: y - 14, font: regular, size: 8, color: gray });
      pill(a.priority || "Medium", COL.pri, y - 10);
      y -= rH;
    });
    y -= 10;
  }

  if ((minutesData.discussionPoints || []).length > 0) {
    y -= 4; heading("Points of Discussion");
    (minutesData.discussionPoints || []).forEach((pt) => {
      need(22);
      page.drawRectangle({ x: ML, y: y - 8, width: 5, height: 5, color: blue });
      T(S(pt), { size: 9.5, color: black, dx: 14 });
      y -= 3;
    });
    y -= 4;
  }

  if (minutesData.nextSteps) { y -= 4; heading("Next Steps"); T(S(minutesData.nextSteps), { size: 9.5, color: black }); y -= 6; }

  if (minutesData.nextMeetingNote) {
    need(50); y -= 6;
    const nmLines = wrap(S(minutesData.nextMeetingNote), CW - 26, 9.5);
    const nmH = nmLines.length * 14 + 20;
    page.drawRectangle({ x: ML, y: y - nmH, width: CW, height: nmH, color: blueLt });
    page.drawRectangle({ x: ML, y: y - nmH, width: 5, height: nmH, color: blue });
    page.drawText("NEXT MEETING", { x: ML + 14, y: y - 13, font: bold, size: 7.5, color: blue });
    y -= 18;
    T(S(minutesData.nextMeetingNote), { font: regular, size: 9.5, color: navy, dx: 14 });
    y -= 10;
  }

  need(75); y -= 12;
  page.drawLine({ start: { x: ML, y }, end: { x: W - ML, y }, thickness: 0.5, color: grayLt });
  y -= 24;
  ["Chairperson", "Secretary / Recorder", "Date Approved"].forEach((lbl, i) => {
    const sx = ML + i * (CW / 3);
    page.drawLine({ start: { x: sx, y: y - 18 }, end: { x: sx + CW / 3 - 18, y: y - 18 }, thickness: 0.7, color: grayMid });
    page.drawText(lbl, { x: sx, y: y - 30, font: regular, size: 7.5, color: gray });
  });

  footerOn();
  const totalPages = doc.getPageCount();
  for (let pi = 0; pi < totalPages; pi++) {
    const pg = doc.getPage(pi);
    pg.drawRectangle({ x: W - ML - 50, y: MB - 22, width: 52, height: 12, color: white });
    pg.drawText(`Page ${pi + 1} of ${totalPages}`, { x: W - ML - 50, y: MB - 18, font: bold, size: 7, color: grayMid });
  }

  const bytes = await doc.save();
  return URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
};

/* ══════════════════════════════════════════════
   SHARED EDIT FIELD STYLES
══════════════════════════════════════════════ */
const editInput = { width: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.82rem", fontFamily: "inherit", outline: "none", color: "#1e293b", background: "#fff", transition: "border-color 0.2s" };
const editTextarea = { ...editInput, resize: "vertical", minHeight: 60, lineHeight: 1.5 };
const sectionLabel = { fontWeight: 700, color: "#193648", fontSize: "0.82rem", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" };
const addBtn = { background: "#eef4ff", color: "#3a70b0", border: "none", borderRadius: "6px", padding: "3px 10px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" };
const removeBtn = { background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px 4px", borderRadius: "4px", fontSize: "0.75rem", flexShrink: 0 };

/* ══════════════════════════════════════════════
   NOTES INPUT MODAL
══════════════════════════════════════════════ */
const NotesModal = ({ meeting, onClose, onGenerated }) => {
  const [notes, setNotes] = React.useState("");
  const [phase, setPhase] = React.useState("write");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [minutesData, setMinutesData] = React.useState(null);
  const [downloadUrl, setDownloadUrl] = React.useState(null);
  const [isRegenerating, setIsRegenerating] = React.useState(false);
  const [editData, setEditData] = React.useState(null);

  const charCount = notes.trim().length;
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  const updateField    = (field, val) => setEditData(p => ({ ...p, [field]: val }));
  const updateDecision = (id, f, v)   => setEditData(p => ({ ...p, keyDecisions: p.keyDecisions.map(d => d.id === id ? { ...d, [f]: v } : d) }));
  const addDecision    = ()           => setEditData(p => ({ ...p, keyDecisions: [...p.keyDecisions, { id: Date.now(), decision: "", rationale: "" }] }));
  const removeDecision = (id)         => setEditData(p => ({ ...p, keyDecisions: p.keyDecisions.filter(d => d.id !== id) }));
  const updateAction   = (id, f, v)   => setEditData(p => ({ ...p, actionItems: p.actionItems.map(a => a.id === id ? { ...a, [f]: v } : a) }));
  const addAction      = ()           => setEditData(p => ({ ...p, actionItems: [...p.actionItems, { id: Date.now(), task: "", responsible: "", deadline: "", priority: "Medium" }] }));
  const removeAction   = (id)         => setEditData(p => ({ ...p, actionItems: p.actionItems.filter(a => a.id !== id) }));
  const updateDisc     = (i, v)       => setEditData(p => ({ ...p, discussionPoints: p.discussionPoints.map((d, idx) => idx === i ? v : d) }));
  const addDisc        = ()           => setEditData(p => ({ ...p, discussionPoints: [...p.discussionPoints, ""] }));
  const removeDisc     = (i)          => setEditData(p => ({ ...p, discussionPoints: p.discussionPoints.filter((_, idx) => idx !== i) }));

  const handleSendToAI = async () => {
    if (charCount < 30) return;
    setPhase("processing");
    try {
      const structured = await callClaudeForMinutes(notes, meeting);
      setMinutesData(structured);
      setEditData(JSON.parse(JSON.stringify(structured)));
      setDownloadUrl(null);
      setPhase("edit");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setPhase("error");
    }
  };

  const handleGeneratePDF = async () => {
    setIsRegenerating(true);
    try {
      const url = await createMinutesPDF(editData, meeting);
      setDownloadUrl(url);
      setMinutesData(editData);
      setIsRegenerating(false);
      return url;
    } catch (err) {
      setIsRegenerating(false);
      alert("PDF generation failed: " + err.message);
      return null;
    }
  };

  const handleDownloadAndSave = async () => {
    const url = await handleGeneratePDF();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `Minutes_${meeting.agenda.replace(/\s+/g, "_")}_${meeting.date}.pdf`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    onGenerated(meeting.id, editData, url);
    onClose();
  };

  const handleSaveOnly = async () => {
    const url = await handleGeneratePDF();
    if (!url) return;
    onGenerated(meeting.id, editData, url);
    onClose();
  };

  const onFocus = e => e.target.style.borderColor = "#193648";
  const onBlur  = e => e.target.style.borderColor = "#e2e8f0";
  const priColors = { High: "#fee2e2", Medium: "#fef3c7", Low: "#d1fae5" };
  const priText   = { High: "#991b1b", Medium: "#92400e", Low: "#065f46" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,40,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "20px" }}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }} transition={{ type: "spring", damping: 20, stiffness: 260 }}
        style={{ background: "#fff", borderRadius: "24px", width: phase === "edit" ? "820px" : "720px", maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 30px 80px rgba(0,0,0,0.35)", border: "1px solid #e2e8f0", transition: "width 0.3s ease" }}
      >
        <div style={{ background: "linear-gradient(120deg,#193648 0%,#2d6a9f 100%)", padding: "22px 28px", borderRadius: "24px 24px 0 0", display: "flex", alignItems: "center", gap: "14px", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: "12px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {phase === "edit" ? <FileText size={20} color="white" /> : <PenLine size={20} color="white" />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "white", fontWeight: 700, fontSize: "1.05rem" }}>{phase === "edit" ? "✏️ Review & Edit Minutes" : "Write Meeting Notes"}</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", marginTop: 2 }}>{meeting.agenda} — {meeting.date}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["Write", "Edit", "Save"].map((p, i) => {
              const active = (i === 0 && (phase === "write" || phase === "error" || phase === "processing")) || (i === 1 && phase === "edit");
              const done = (i === 0 && phase === "edit");
              return (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 4, background: done ? "rgba(16,185,129,0.3)" : active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)", borderRadius: "20px", padding: "3px 10px", fontSize: "0.7rem", color: done ? "#6ee7b7" : active ? "white" : "rgba(255,255,255,0.4)", fontWeight: 600 }}>
                  {done ? "✓" : `${i + 1}.`} {p}
                </div>
              );
            })}
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "8px", padding: "6px 8px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "26px 28px" }}>
          {(phase === "write" || phase === "error") && (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#193648", fontWeight: 600, fontSize: "0.93rem", marginBottom: 8 }}>
                  <ClipboardList size={16} /> Rough Meeting Notes
                </div>
                <p style={{ color: "#64748b", fontSize: "0.82rem", margin: "0 0 10px 0", lineHeight: 1.5 }}>
                  Write everything that happened — decisions, who said what, tasks, deadlines. AI will structure it and you can edit before saving.
                </p>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder={"Example:\n\nDean opened the meeting. Discussed curriculum update — agreed to add AI module in semester 3..."}
                  style={{ width: "100%", boxSizing: "border-box", minHeight: 240, padding: "13px 15px", border: "2px solid #e2e8f0", borderRadius: "14px", fontSize: "0.87rem", lineHeight: 1.7, fontFamily: "inherit", resize: "vertical", outline: "none", color: "#1e293b", background: "#f8fafc" }}
                  onFocus={onFocus} onBlur={onBlur}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7, fontSize: "0.77rem", color: "#94a3b8" }}>
                  <span>{wordCount} words · {charCount} characters</span>
                  <span style={{ color: charCount < 30 ? "#ef4444" : "#10b981" }}>{charCount < 30 ? `${30 - charCount} more chars needed` : "✓ Ready to send"}</span>
                </div>
              </div>
              {phase === "error" && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "11px 15px", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
                  <AlertCircle size={15} color="#ef4444" style={{ marginTop: 1, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, color: "#dc2626", fontSize: "0.83rem" }}>Generation failed</div>
                    <div style={{ color: "#7f1d1d", fontSize: "0.78rem", marginTop: 2 }}>{errorMsg}</div>
                  </div>
                </div>
              )}
              <div style={{ background: "#f1f5f9", borderRadius: "12px", padding: "12px 15px", marginBottom: 18 }}>
                <div style={{ fontWeight: 600, color: "#193648", fontSize: "0.8rem", marginBottom: 7 }}>📋 Attendees (auto-included)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {meeting.boardMembers.map((m, i) => (
                    <span key={i} style={{ background: "white", border: "1px solid #cbd5e1", borderRadius: "20px", padding: "3px 10px", fontSize: "0.74rem", color: "#334155" }}>{m.name}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 500, cursor: "pointer", fontSize: "0.86rem" }}>Cancel</button>
                <motion.button whileHover={charCount >= 30 ? { scale: 1.03 } : {}} whileTap={charCount >= 30 ? { scale: 0.97 } : {}}
                  onClick={handleSendToAI} disabled={charCount < 30}
                  style={{ padding: "9px 22px", borderRadius: "10px", border: "none", background: charCount >= 30 ? "linear-gradient(120deg,#193648,#2d6a9f)" : "#e2e8f0", color: charCount >= 30 ? "white" : "#94a3b8", fontWeight: 600, cursor: charCount >= 30 ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 8, fontSize: "0.86rem" }}>
                  <Sparkles size={15} /> Send to AI <ChevronRight size={13} />
                </motion.button>
              </div>
            </>
          )}

          {phase === "processing" && (
            <div style={{ textAlign: "center", padding: "46px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#193648,#3a70b0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={32} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#193648", marginBottom: 5 }}>AI is processing your notes…</div>
                <div style={{ color: "#64748b", fontSize: "0.86rem" }}>Structuring decisions, assigning responsibilities</div>
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                {["Analysing notes", "Extracting decisions", "Structuring output"].map((label, i) => (
                  <motion.div key={i} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.6 }}
                    style={{ background: "#f1f5f9", borderRadius: "20px", padding: "4px 11px", fontSize: "0.73rem", color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
                    <Loader size={10} />{label}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {phase === "edit" && editData && (
            <>
              <div style={{ background: "linear-gradient(120deg,#eff6ff,#dbeafe)", border: "1px solid #93c5fd", borderRadius: "12px", padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: "1.1rem" }}>✏️</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#1e40af", fontSize: "0.88rem" }}>AI generated your minutes — edit anything before saving</div>
                  <div style={{ color: "#3b82f6", fontSize: "0.76rem", marginTop: 1 }}>All fields are editable.</div>
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={sectionLabel}>📌 Meeting Title</div>
                <input value={editData.meetingTitle || ""} onChange={e => updateField("meetingTitle", e.target.value)} style={editInput} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={sectionLabel}>📝 Executive Summary</div>
                <textarea value={editData.summary || ""} onChange={e => updateField("summary", e.target.value)} style={{ ...editTextarea, minHeight: 72 }} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={sectionLabel}>✅ Key Decisions <button style={addBtn} onClick={addDecision}>+ Add Decision</button></div>
                {editData.keyDecisions.map((d, idx) => (
                  <div key={d.id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px", marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ minWidth: 22, height: 22, borderRadius: "50%", background: "#193648", color: "white", fontSize: "0.68rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{idx + 1}</span>
                      <div style={{ flex: 1 }}>
                        <input value={d.decision} onChange={e => updateDecision(d.id, "decision", e.target.value)} placeholder="Decision made..." style={{ ...editInput, marginBottom: 6, fontWeight: 600 }} onFocus={onFocus} onBlur={onBlur} />
                        <input value={d.rationale || ""} onChange={e => updateDecision(d.id, "rationale", e.target.value)} placeholder="Rationale / reason..." style={{ ...editInput, fontSize: "0.78rem", color: "#64748b" }} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                      <button style={removeBtn} onClick={() => removeDecision(d.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={sectionLabel}>🎯 Action Items <button style={addBtn} onClick={addAction}>+ Add Action</button></div>
                {editData.actionItems.map((a, idx) => (
                  <div key={a.id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px", marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ minWidth: 22, height: 22, borderRadius: "50%", background: "#3a70b0", color: "white", fontSize: "0.68rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{idx + 1}</span>
                      <div style={{ flex: 1 }}>
                        <input value={a.task} onChange={e => updateAction(a.id, "task", e.target.value)} placeholder="Task description..." style={{ ...editInput, marginBottom: 6, fontWeight: 600 }} onFocus={onFocus} onBlur={onBlur} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
                          <input value={a.responsible || ""} onChange={e => updateAction(a.id, "responsible", e.target.value)} placeholder="👤 Responsible" style={editInput} onFocus={onFocus} onBlur={onBlur} />
                          <input value={a.deadline || ""} onChange={e => updateAction(a.id, "deadline", e.target.value)} placeholder="📅 Deadline" style={editInput} onFocus={onFocus} onBlur={onBlur} />
                          <select value={a.priority || "Medium"} onChange={e => updateAction(a.id, "priority", e.target.value)} style={{ ...editInput, background: priColors[a.priority] || "#fef3c7", color: priText[a.priority] || "#92400e", fontWeight: 700, cursor: "pointer" }}>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                      </div>
                      <button style={removeBtn} onClick={() => removeAction(a.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={sectionLabel}>💬 Discussion Points <button style={addBtn} onClick={addDisc}>+ Add Point</button></div>
                {(editData.discussionPoints || []).map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <span style={{ color: "#94a3b8", fontSize: "0.8rem", flexShrink: 0 }}>•</span>
                    <input value={d} onChange={e => updateDisc(i, e.target.value)} placeholder="Discussion point..." style={{ ...editInput, flex: 1 }} onFocus={onFocus} onBlur={onBlur} />
                    <button style={removeBtn} onClick={() => removeDisc(i)}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={sectionLabel}>🚀 Next Steps</div>
                <textarea value={editData.nextSteps || ""} onChange={e => updateField("nextSteps", e.target.value)} style={{ ...editTextarea, minHeight: 56 }} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={{ marginBottom: 22 }}>
                <div style={sectionLabel}>📅 Next Meeting Note</div>
                <input value={editData.nextMeetingNote || ""} onChange={e => updateField("nextMeetingNote", e.target.value)} placeholder="e.g. In 4 weeks — follow up on action items" style={editInput} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
                <button onClick={() => setPhase("write")} style={{ padding: "9px 18px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 500, cursor: "pointer", fontSize: "0.84rem", display: "flex", alignItems: "center", gap: 6 }}>
                  ← Back to Notes
                </button>
                <div style={{ display: "flex", gap: 10 }}>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSaveOnly} disabled={isRegenerating}
                    style={{ padding: "9px 20px", borderRadius: "10px", border: "none", background: "#10b981", color: "white", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: "0.84rem", opacity: isRegenerating ? 0.7 : 1 }}>
                    {isRegenerating ? <Loader size={14} /> : <CheckCircle2 size={14} />} Save & Close
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleDownloadAndSave} disabled={isRegenerating}
                    style={{ padding: "9px 22px", borderRadius: "10px", border: "none", background: "linear-gradient(120deg,#193648,#2d6a9f)", color: "white", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: "0.84rem", opacity: isRegenerating ? 0.7 : 1 }}>
                    {isRegenerating ? <Loader size={14} /> : <Download size={14} />} Download PDF & Save
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT — YE FILE KA ASLI FIX HAI
══════════════════════════════════════════════ */
const AdvisoryMeeting = () => {
  const [meetings, setMeetings] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState("create");
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [selectedReps, setSelectedReps] = React.useState([]);
  const [notesModalFor, setNotesModalFor] = React.useState(null);
  const [newMeeting, setNewMeeting] = React.useState({ agenda: "", date: "", time: "", venue: "" });
  const [loadingMeetings, setLoadingMeetings] = React.useState(true); // ✅ NAYA

  const boardMembers = [
    { name: "Dean", role: "Chairperson" },
    { name: "HOD", role: "Head of Department" },
    { name: "Industry Liaison Officer", role: "Coordinator" },
    { name: "ABC Tech Representative", role: "Industry Partner" },
    { name: "Student Representative", role: "Board Member" },
  ];

  const industryReps = [
    { name: "Ali Khan – ABC Tech", suggested: true },
    { name: "Sara Ahmed – Innovate Labs", suggested: false },
    { name: "Bilal Rehman – FutureVision Ltd", suggested: true },
    { name: "Ayesha Noor – TechSphere", suggested: false },
    { name: "Omar Siddiqui – DataNest", suggested: false },
  ];

  // ✅ FIX #1 — Page load par DB se saari meetings fetch karo
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch(`${API_BASE}/all`);
        const data = await res.json();
        if (data.success) {
          // DB se aayi meetings ko frontend format mein convert karo
          const formatted = data.data.map(m => ({
            id: m.meetingId,
            _dbId: m._id,
            agenda: m.meetingTitle,
            date: m.date,
            time: m.time,
            venue: m.location,
            status: m.minutesData ? "Completed" : "Scheduled",
            boardMembers: boardMembers,
            minutesGenerated: !!m.minutesData,
            minutesData: m.minutesData || null,
            downloadUrl: null,
          }));
          setMeetings(formatted);
        }
      } catch (err) {
        console.error("Meetings fetch error:", err);
      } finally {
        setLoadingMeetings(false);
      }
    };
    fetchMeetings();
  }, []);

  // ✅ FIX #2 — Meeting banate waqt DB mein bhi save karo
  const handleAddMeeting = async () => {
    if (!newMeeting.agenda || !newMeeting.date || !newMeeting.time || !newMeeting.venue) {
      alert("Please fill all meeting details!"); return;
    }

    const meetingId = String(Date.now());
    const entry = {
      id: meetingId,
      ...newMeeting,
      status: "Scheduled",
      boardMembers,
    };

    // DB mein save karo
    try {
      await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingId: meetingId,
          meetingTitle: newMeeting.agenda,
          date: newMeeting.date,
          time: newMeeting.time,
          location: newMeeting.venue,
          attendees: boardMembers.map(b => b.name).join(", "),
          decisions: [],
          actionItems: [],
        }),
      });
    } catch (err) {
      console.error("Meeting save error:", err);
    }

    setMeetings(prev => [...prev, entry]);
    setNewMeeting({ agenda: "", date: "", time: "", venue: "" });
    setShowInviteModal(true);
  };

  const handleRepSelect = (rep) => {
    setSelectedReps(prev => prev.includes(rep.name) ? prev.filter(r => r !== rep.name) : [...prev, rep.name]);
  };

  const sendInvitations = () => {
    if (selectedReps.length === 0) { alert("Please select at least one representative."); return; }
    alert(`✅ Invitations sent to: ${selectedReps.join(", ")}`);
    setSelectedReps([]); setShowInviteModal(false);
  };

  const handleMinutesGenerated = (meetingId, minutesData, downloadUrl) => {
    setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, status: "Completed", minutesGenerated: true, minutesData, downloadUrl } : m));
  };

  const downloadMinutes = (meeting) => {
    if (!meeting.downloadUrl) return;
    const a = document.createElement("a");
    a.href = meeting.downloadUrl;
    a.download = `Minutes_${meeting.agenda.replace(/\s+/g, "_")}_${meeting.date}.pdf`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div className="page-container">
      <AnimatePresence>
        {notesModalFor && (
          <NotesModal meeting={notesModalFor} onClose={() => setNotesModalFor(null)} onGenerated={handleMinutesGenerated} />
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="advisory-header">
        <div className="flex items-center gap-4">
          <div className="advisory-title">
            <h1>Advisory Board Meeting Management</h1>
            <p>Efficiently organize, schedule, and track advisory board meetings.</p>
          </div>
        </div>
      </motion.div>

      <div className="tab-buttons">
        <button className={activeTab === "create" ? "active" : ""} onClick={() => setActiveTab("create")}>📅 Schedule New Meeting</button>
        <button className={activeTab === "records" ? "active" : ""} onClick={() => setActiveTab("records")}>📘 View Meeting Records</button>
      </div>

      <div className="stats-row">
        <div className="stat-card stat-total"><CalendarDays size={26} /><div className="stat-info"><span className="stat-number">{meetings.length}</span><span className="stat-label">Total Meetings</span></div></div>
        <div className="stat-card stat-scheduled"><Clock size={26} /><div className="stat-info"><span className="stat-number">{meetings.filter(m => m.status === "Scheduled").length}</span><span className="stat-label">Scheduled</span></div></div>
        <div className="stat-card stat-completed"><CheckCircle2 size={26} /><div className="stat-info"><span className="stat-number">{meetings.filter(m => m.minutesGenerated).length}</span><span className="stat-label">Completed with MoM</span></div></div>
      </div>

      {activeTab === "create" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="meeting-card fade-in">
          <h2 className="section-title flex items-center gap-2"><CalendarDays /> Enter Meeting Details</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div><label className="meeting-label">Agenda</label><input type="text" placeholder="e.g., University-Industry Collaboration" value={newMeeting.agenda} onChange={e => setNewMeeting({ ...newMeeting, agenda: e.target.value })} /></div>
            <div><label className="meeting-label">Date</label><input type="date" value={newMeeting.date} onChange={e => setNewMeeting({ ...newMeeting, date: e.target.value })} /></div>
            <div><label className="meeting-label">Time</label><input type="time" value={newMeeting.time} onChange={e => setNewMeeting({ ...newMeeting, time: e.target.value })} /></div>
            <div><label className="meeting-label">Venue / Meeting Link</label><input type="text" placeholder="e.g., Conference Room A / Zoom Link" value={newMeeting.venue} onChange={e => setNewMeeting({ ...newMeeting, venue: e.target.value })} /></div>
          </div>
          <div className="mt-8">
            <h3 className="section-title flex items-center gap-1"><Users size={18} /> Board Members</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
              {boardMembers.map((member, i) => (
                <motion.div key={i} whileHover={{ scale: 1.05 }} className="member-card">
                  <h4>{member.name}</h4><p>{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAddMeeting} className="schedule-btn">
              <Send size={18} /> Schedule Meeting
            </motion.button>
          </div>
        </motion.div>
      )}

      {showInviteModal && (
        <div className="modal-overlay">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="card-modal-box">
            <h2 className="modal-title flex items-center gap-2 mb-5"><Mail /> Send Invitations to Industry Representatives</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {industryReps.map((rep, i) => (
                <div key={i} className={`rep-card ${selectedReps.includes(rep.name) ? "selected" : ""}`} onClick={() => handleRepSelect(rep)}>
                  <div className="rep-content"><h4>{rep.name}</h4>{rep.suggested && <span className="suggested-badge">System Suggested</span>}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="cancel-btn" onClick={() => setShowInviteModal(false)}>Cancel</button>
              <button className="send-btn" onClick={sendInvitations}>Send Invitation</button>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === "records" && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="table-container fade-in">
          <h2 className="section-title flex items-center gap-2 mb-4"><FileText /> Scheduled Meetings</h2>

          {/* ✅ Loading state */}
          {loadingMeetings ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              <Loader size={32} style={{ margin: "0 auto 12px", display: "block" }} />
              <p>Loading meetings...</p>
            </div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">No meetings scheduled yet.</p>
              <p className="text-gray-500 text-sm mt-2">Create your first meeting to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="records-table">
                <thead><tr><th>Agenda</th><th>Date</th><th>Time</th><th>Venue</th><th>Status</th><th>Write & Generate MoM</th><th>Download Minutes</th></tr></thead>
                <tbody>
                  {meetings.map((m) => (
                    <tr key={m.id}>
                      <td className="font-medium">{m.agenda}</td>
                      <td>{m.date}</td><td>{m.time}</td>
                      <td className="max-w-xs truncate">{m.venue}</td>
                      <td>{m.status === "Scheduled" ? <span className="status-scheduled"><Clock size={15} /> Scheduled</span> : <span className="status-completed"><CheckCircle2 size={15} /> Completed</span>}</td>
                      <td>
                        {m.minutesGenerated ? (
                          <span style={{ color: "#059669", fontWeight: 600, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}><CheckCircle2 size={14} /> Generated</span>
                        ) : (
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setNotesModalFor(m)}
                            style={{ background: "linear-gradient(120deg,#193648,#2d6a9f)", color: "white", border: "none", borderRadius: "9px", padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 6, margin: "auto" }}>
                            <Sparkles size={14} /> Write Notes
                          </motion.button>
                        )}
                      </td>
                      <td>
                        {m.minutesGenerated ? (
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="download-btn" onClick={() => downloadMinutes(m)}>
                            <Download size={16} /> Download
                          </motion.button>
                        ) : (
                          <span className="not-generated"><FileCheck size={15} /> Not Generated</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      <style>{`
        body { font-family:'Poppins',sans-serif; background:linear-gradient(135deg,#e2eef9 0%,#ffffff 100%); }
        .page-container { padding:40px 20px; min-height:100vh; }
        .advisory-header { display:flex; justify-content:space-between; align-items:center; background:linear-gradient(90deg,#193648,#3a70b0); padding:25px 40px; border-radius:20px; box-shadow:0 15px 35px rgba(0,0,0,0.12); margin-bottom:40px; color:white; }
        .advisory-title h1 { font-size:2rem; font-weight:700; margin:0; }
        .advisory-title p { font-size:0.95rem; margin-top:6px; color:#dce3f2; margin-bottom:0; }
        .tab-buttons { display:flex; justify-content:center; gap:20px; margin-bottom:40px; }
        .tab-buttons button { padding:12px 28px; border-radius:12px; background:#e4e9f1; color:#193648; font-weight:500; cursor:pointer; border:none; transition:all 0.3s ease; font-size:0.95rem; }
        .tab-buttons button.active { background:#193648; color:white; transform:scale(1.05); box-shadow:0 5px 15px rgba(25,54,72,0.3); }
        .tab-buttons button:hover:not(.active) { background:#d1d9e6; transform:translateY(-2px); }
        .stats-row { display:flex; gap:20px; justify-content:center; margin-bottom:35px; flex-wrap:wrap; }
        .stat-card { display:flex; align-items:center; gap:14px; background:white; padding:18px 24px; border-radius:16px; box-shadow:0 6px 20px rgba(0,0,0,0.07); border:1px solid #edf1f7; min-width:170px; }
        .stat-total { border-top:3px solid #3a70b0; } .stat-scheduled { border-top:3px solid #f59e0b; } .stat-completed { border-top:3px solid #10b981; }
        .stat-info { display:flex; flex-direction:column; }
        .stat-number { font-size:1.6rem; font-weight:700; color:#193648; line-height:1; }
        .stat-label { font-size:0.78rem; color:#64748b; margin-top:3px; }
        .meeting-card { background:white; border-radius:20px; padding:40px; max-width:900px; margin:auto; box-shadow:0 10px 35px rgba(0,0,0,0.1); border:1px solid #edf1f7; }
        input[type='text'],input[type='date'],input[type='time'] { width:100%; box-sizing:border-box; padding:10px 15px; margin-top:5px; border:1.5px solid #d3d9e1; border-radius:10px; outline:none; transition:all 0.3s ease; background:#fff; color:#193648; font-family:'Poppins',sans-serif; font-size:0.9rem; }
        input:focus { border-color:#193648; box-shadow:0 0 0 3px rgba(25,54,72,0.2); }
        .meeting-label { font-size:0.9rem; color:#193648; font-weight:500; }
        .section-title { font-weight:600; font-size:1.1rem; color:#193648; margin-top:20px; }
        .member-card { background:#f8fafc; border-radius:12px; padding:15px; border:1px solid #e2e8f0; box-shadow:0 3px 8px rgba(0,0,0,0.05); text-align:center; }
        .member-card h4 { font-weight:600; color:#193648; } .member-card p { color:#3a70b0; font-size:0.85rem; margin-top:4px; }
        .schedule-btn { background:#193648; color:white; padding:12px 35px; border-radius:12px; font-weight:500; display:flex; align-items:center; gap:8px; border:none; cursor:pointer; transition:all 0.3s ease; margin-top:25px; }
        .schedule-btn:hover { background:#204d76; transform:scale(1.05); }
        .table-container { max-width:1300px; margin:auto; background:white; padding:30px; border-radius:18px; box-shadow:0 10px 35px rgba(0,0,0,0.1); border:1px solid #edf1f7; }
        table { width:100%; border-collapse:collapse; text-align:center; }
        th { background:#193648; color:white; padding:12px; font-size:0.9rem; }
        td { padding:12px 10px; border-bottom:1px solid #e2e8f0; vertical-align:middle; }
        tr:hover { background:#f1f6fb; }
        .download-btn { background:#10b981; color:white; border:none; padding:8px 16px; border-radius:8px; font-weight:500; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.3s ease; margin:auto; }
        .download-btn:hover { background:#059669; transform:scale(1.05); }
        .not-generated { display:flex; align-items:center; justify-content:center; gap:5px; color:#94a3b8; font-size:0.82rem; }
        .status-scheduled { display:inline-flex; align-items:center; gap:5px; background:#fef3c7; color:#92400e; padding:4px 10px; border-radius:20px; font-size:0.8rem; font-weight:600; }
        .status-completed { display:inline-flex; align-items:center; gap:5px; background:#d1fae5; color:#065f46; padding:4px 10px; border-radius:20px; font-size:0.8rem; font-weight:600; }
        .modal-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:999; }
        .card-modal-box { background:#fff; border-radius:20px; padding:35px; width:700px; max-width:95%; box-shadow:0 15px 40px rgba(0,0,0,0.25); border:1px solid #e2e8f0; }
        .modal-title { font-weight:600; font-size:1.2rem; color:#193648; }
        .rep-card { position:relative; background:#f3f4f6; border-radius:16px; padding:18px; cursor:pointer; transition:all 0.3s ease; border:1px solid #d1d5db; }
        .rep-card:hover { transform:translateY(-3px) scale(1.02); box-shadow:0 8px 25px rgba(0,0,0,0.15); }
        .rep-card.selected { border-color:#193648; background:#e4f0ff; }
        .rep-content { display:flex; align-items:center; justify-content:space-between; }
        .suggested-badge { background:#ffe8b0; color:#b87b00; font-weight:600; font-size:0.75rem; padding:3px 7px; border-radius:6px; }
        .cancel-btn { padding:10px 25px; border-radius:12px; background:#f3f4f6; color:#193648; font-weight:500; cursor:pointer; border:none; }
        .send-btn { padding:10px 25px; border-radius:12px; background:#193648; color:white; font-weight:500; cursor:pointer; border:none; }
      `}</style>
    </div>
  );
};

export default AdvisoryMeeting;


