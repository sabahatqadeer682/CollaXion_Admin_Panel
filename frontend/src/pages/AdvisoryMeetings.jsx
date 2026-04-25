

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CalendarDays, Users, FileText, CheckCircle2, Clock, Send, Mail,
//   Download, FileCheck, Loader, Sparkles, PenLine, X, ChevronRight,
//   Bot, ClipboardList, AlertCircle
// } from "lucide-react";
// import collaxionLogo from "../images/collaxionlogo.jpeg";

// const API_BASE = "http://localhost:5000/api/meeting-minutes";

// /* ─────────────────────────────────────────────
//    Helper: call backend proxy → Anthropic API
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
//   if (!response.ok) {
//     let detail = rawText;
//     try { detail = JSON.parse(rawText)?.details || JSON.parse(rawText)?.error || rawText; } catch (_) {}
//     throw new Error(`Server error ${response.status}: ${String(detail).slice(0, 300)}`);
//   }

//   let data;
//   try { data = JSON.parse(rawText); } catch {
//     throw new Error("Server returned invalid response. Check backend logs.");
//   }

//   const content = data.content;
//   if (!content) throw new Error("AI returned empty content. Please try again.");
//   if (typeof content === "object") return content;

//   const cleaned = content
//     .replace(/^```json\s*/gi, "").replace(/^```\s*/gi, "").replace(/```\s*$/gi, "").trim();
//   try { return JSON.parse(cleaned); } catch {
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
//     .replace(/[\u2013\u2014]/g, "-").replace(/[\u2018\u2019]/g, "'")
//     .replace(/[\u201C\u201D]/g, '"').replace(/\u2022/g, "-")
//     .replace(/\u2026/g, "...").replace(/\u00A0/g, " ")
//     .replace(/[^\x00-\xFF]/g, "?");
// };

// const createMinutesPDF = async (minutesData, meetingMeta) => {
//   const { PDFDocument, rgb, StandardFonts } = await import("https://cdn.jsdelivr.net/esm/pdf-lib@1.17.1");

//   const doc     = await PDFDocument.create();
//   const regular = await doc.embedFont(StandardFonts.Helvetica);
//   const bold    = await doc.embedFont(StandardFonts.HelveticaBold);
//   const italic  = await doc.embedFont(StandardFonts.HelveticaOblique);

//   const navy     = rgb(0.06, 0.16, 0.28); const navyDark = rgb(0.04, 0.10, 0.20);
//   const blue     = rgb(0.16, 0.50, 0.73); const blueLt   = rgb(0.84, 0.92, 0.97);
//   const green    = rgb(0.15, 0.68, 0.38); const greenLt  = rgb(0.83, 0.94, 0.87);
//   const amber    = rgb(0.95, 0.61, 0.07); const amberLt  = rgb(0.99, 0.95, 0.83);
//   const red      = rgb(0.75, 0.22, 0.17); const redLt    = rgb(0.98, 0.86, 0.85);
//   const white    = rgb(1, 1, 1);          const offWhite = rgb(0.97, 0.975, 0.982);
//   const black    = rgb(0.12, 0.12, 0.14); const gray     = rgb(0.44, 0.47, 0.51);
//   const grayMid  = rgb(0.72, 0.74, 0.77); const grayLt   = rgb(0.91, 0.92, 0.94);
//   const divider  = rgb(0.87, 0.89, 0.92);

//   const W = 612, H = 792, ML = 50, MB = 52, CW = W - ML - ML;
//   let page, y;

//   const S = (t) => {
//     if (t == null) return "";
//     return String(t)
//       .replace(/[\u2013\u2014]/g, "-").replace(/[\u2018\u2019]/g, "'")
//       .replace(/[\u201C\u201D]/g, '"').replace(/\u2022/g, "-")
//       .replace(/\u2026/g, "...").replace(/\u00A0/g, " ")
//       .replace(/[^\x00-\xFF]/g, "?");
//   };

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

//   const T = (text, opts = {}) => {
//     const { x = ML, size = 10, font = regular, color = black, maxW = CW, lh = 1.55, dx = 0 } = opts;
//     const lines = wrap(text, maxW - dx, size);
//     for (const l of lines) {
//       if (y - size - 2 < MB) { footerOn(); addPage(); headerOn(); }
//       page.drawText(l, { x: x + dx, y: y - size, font, size, color });
//       y -= size * lh;
//     }
//   };

//   const addPage = () => { page = doc.addPage([W, H]); y = H - 50; };
//   const headerOn = () => {
//     page.drawRectangle({ x: 0, y: H - 32, width: W, height: 32, color: navyDark });
//     page.drawRectangle({ x: 0, y: H - 32, width: 5, height: 32, color: blue });
//     page.drawText("ADVISORY BOARD MEETING MINUTES", { x: ML + 4, y: H - 21, font: bold, size: 8, color: rgb(0.65, 0.76, 0.87) });
//     page.drawText(S(meetingMeta.agenda || "").slice(0, 55), { x: W / 2 - 70, y: H - 21, font: italic, size: 8, color: rgb(0.65, 0.76, 0.87) });
//     page.drawText("CollaXion", { x: W - ML - 44, y: H - 21, font: bold, size: 9, color: blue });
//     y = H - 46;
//   };
//   const footerOn = () => {
//     page.drawLine({ start: { x: ML, y: MB - 6 }, end: { x: W - ML, y: MB - 6 }, thickness: 0.5, color: grayLt });
//     page.drawText("CollaXion — Confidential Advisory Board Record", { x: ML, y: MB - 18, font: italic, size: 7, color: grayMid });
//     const pn = doc.getPageCount();
//     page.drawText(`Page ${pn}`, { x: W - ML - 32, y: MB - 18, font: bold, size: 7, color: grayMid });
//   };
//   const need = (h) => { if (y - h < MB + 10) { footerOn(); addPage(); headerOn(); } };
//   const heading = (title) => {
//     need(36);
//     page.drawRectangle({ x: ML, y: y - 28, width: 5, height: 28, color: blue });
//     page.drawRectangle({ x: ML + 5, y: y - 28, width: CW - 5, height: 28, color: offWhite });
//     page.drawText(S(title).toUpperCase(), { x: ML + 14, y: y - 18, font: bold, size: 9.5, color: navy });
//     y -= 36;
//   };
//   const pill = (label, px, py) => {
//     const map = { High: [redLt, red], Medium: [amberLt, amber], Low: [greenLt, green] };
//     const [bg, fg] = map[label] || map.Medium;
//     const pw = label.length * 5.6 + 14;
//     page.drawRectangle({ x: px, y: py - 10, width: pw, height: 12, color: bg });
//     page.drawText(S(label), { x: px + 7, y: py - 7, font: bold, size: 7.5, color: fg });
//   };

//   addPage();
//   const COVER_H = 210;
//   page.drawRectangle({ x: 0, y: H - COVER_H, width: W, height: COVER_H, color: navyDark });
//   page.drawRectangle({ x: W - 10, y: H - COVER_H, width: 10, height: COVER_H, color: blue });
//   page.drawRectangle({ x: 0, y: H - 30, width: W - 10, height: 30, color: navy });
//   page.drawText("OFFICIAL DOCUMENT  |  ADVISORY BOARD", { x: ML, y: H - 20, font: bold, size: 7, color: rgb(0.5, 0.66, 0.82) });
//   page.drawText(S(new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })), { x: W - ML - 200, y: H - 20, font: regular, size: 7, color: rgb(0.5, 0.66, 0.82) });
//   page.drawLine({ start: { x: ML, y: H - 32 }, end: { x: W - 20, y: H - 32 }, thickness: 0.4, color: rgb(0.22, 0.35, 0.50) });
//   page.drawText("CollaXion", { x: ML, y: H - 62, font: bold, size: 24, color: blue });
//   page.drawText("Advisory Board", { x: ML, y: H - 85, font: regular, size: 12, color: rgb(0.72, 0.82, 0.91) });
//   page.drawText("Meeting Minutes", { x: ML, y: H - 108, font: bold, size: 30, color: white });
//   page.drawLine({ start: { x: ML, y: H - 122 }, end: { x: W - 22, y: H - 122 }, thickness: 0.5, color: rgb(0.22, 0.35, 0.50) });
//   const mtLines = wrap(minutesData.meetingTitle || meetingMeta.agenda || "Advisory Board Meeting", CW - 20, 11.5);
//   let mtY = H - 140;
//   for (const ln of mtLines.slice(0, 3)) { page.drawText(S(ln), { x: ML, y: mtY, font: bold, size: 11.5, color: rgb(0.83, 0.90, 0.96) }); mtY -= 17; }

//   const cardTop = H - COVER_H - 16, cardH = 46, cardW = (CW - 12) / 3;
//   const cards = [{ label: "DATE", val: meetingMeta.date || "—" }, { label: "TIME", val: meetingMeta.time || "—" }, { label: "VENUE", val: meetingMeta.venue || "—" }];
//   cards.forEach((c, i) => {
//     const cx = ML + i * (cardW + 6);
//     page.drawRectangle({ x: cx + 1, y: cardTop - cardH - 1, width: cardW, height: cardH, color: grayLt });
//     page.drawRectangle({ x: cx, y: cardTop - cardH, width: cardW, height: cardH, color: white });
//     page.drawRectangle({ x: cx, y: cardTop - 3, width: cardW, height: 3, color: blue });
//     page.drawText(c.label, { x: cx + 8, y: cardTop - 13, font: bold, size: 7, color: blue });
//     const vw = wrap(S(c.val), cardW - 16, 10);
//     vw.slice(0, 2).forEach((vl, vi) => { page.drawText(vl, { x: cx + 8, y: cardTop - 26 - vi * 13, font: bold, size: 10, color: navy }); });
//   });
//   y = cardTop - cardH - 22;

//   if (minutesData.summary) {
//     need(50); y -= 6; heading("Executive Summary");
//     const sumLines = wrap(minutesData.summary, CW - 18, 9.5);
//     const boxH = sumLines.length * 14 + 16;
//     need(boxH + 8);
//     page.drawRectangle({ x: ML, y: y - boxH, width: 4, height: boxH, color: blue });
//     page.drawRectangle({ x: ML + 4, y: y - boxH, width: CW - 4, height: boxH, color: rgb(0.96, 0.97, 0.99) });
//     y -= 10;
//     T(minutesData.summary, { font: italic, size: 9.5, color: gray, dx: 14 });
//     y -= 6;
//   }

//   y -= 4; heading("Attendees");
//   const half = CW / 2;
//   meetingMeta.boardMembers.forEach((m, i) => {
//     const col = i % 2, ax = ML + col * half;
//     if (col === 0) need(30);
//     page.drawCircle({ x: ax + 7, y: y - 8, size: 3.5, color: blue });
//     page.drawText(S(m.name), { x: ax + 18, y: y - 11, font: bold, size: 9.5, color: navy });
//     page.drawText(S(m.role), { x: ax + 18, y: y - 22, font: regular, size: 8, color: gray });
//     if (col === 1 || i === meetingMeta.boardMembers.length - 1) y -= 30;
//   });
//   y -= 8;

//   if ((minutesData.keyDecisions || []).length > 0) {
//     y -= 4; heading("Key Decisions");
//     (minutesData.keyDecisions || []).forEach((d, i) => {
//       need(48);
//       page.drawRectangle({ x: ML, y: y - 22, width: 22, height: 22, color: navy });
//       page.drawText(String(i + 1), { x: ML + (i >= 9 ? 5 : 7), y: y - 15, font: bold, size: 9, color: white });
//       T(S(d.decision), { font: bold, size: 9.5, color: black, dx: 30 });
//       if (d.rationale) T("Rationale: " + S(d.rationale), { font: italic, size: 8.5, color: gray, dx: 30 });
//       page.drawLine({ start: { x: ML + 28, y: y }, end: { x: W - ML, y: y }, thickness: 0.35, color: divider });
//       y -= 8;
//     });
//     y -= 4;
//   }

//   if ((minutesData.actionItems || []).length > 0) {
//     y -= 4; heading("Action Items");
//     need(22);
//     page.drawRectangle({ x: ML, y: y - 20, width: CW, height: 20, color: navy });
//     const COL = { num: ML + 6, task: ML + 22, resp: ML + 240, dl: ML + 360, pri: ML + 458 };
//     [["#", COL.num], ["Task", COL.task], ["Responsible", COL.resp], ["Deadline", COL.dl], ["Priority", COL.pri]].forEach(([lbl, lx]) => {
//       page.drawText(lbl, { x: lx, y: y - 13, font: bold, size: 8, color: white });
//     });
//     y -= 20;
//     (minutesData.actionItems || []).forEach((a, i) => {
//       need(32);
//       const rH = 30, bg = i % 2 === 0 ? white : offWhite;
//       page.drawRectangle({ x: ML, y: y - rH, width: CW, height: rH, color: bg });
//       page.drawRectangle({ x: ML, y: y - rH, width: 4, height: rH, color: blueLt });
//       page.drawLine({ start: { x: ML, y: y - rH }, end: { x: W - ML, y: y - rH }, thickness: 0.3, color: divider });
//       page.drawText(String(i + 1), { x: COL.num, y: y - 18, font: bold, size: 8, color: gray });
//       const tLines = wrap(S(a.task), 210, 8.5);
//       tLines.slice(0, 2).forEach((tl, ti) => { page.drawText(tl, { x: COL.task, y: y - 11 - ti * 11, font: bold, size: 8.5, color: black }); });
//       const rLines = wrap(S(a.responsible || "TBD"), 110, 8);
//       rLines.slice(0, 2).forEach((rl, ri) => { page.drawText(rl, { x: COL.resp, y: y - 11 - ri * 10, font: regular, size: 8, color: navy }); });
//       page.drawText(S(a.deadline || "TBD"), { x: COL.dl, y: y - 14, font: regular, size: 8, color: gray });
//       pill(a.priority || "Medium", COL.pri, y - 10);
//       y -= rH;
//     });
//     y -= 10;
//   }

//   if ((minutesData.discussionPoints || []).length > 0) {
//     y -= 4; heading("Points of Discussion");
//     (minutesData.discussionPoints || []).forEach((pt) => {
//       need(22);
//       page.drawRectangle({ x: ML, y: y - 8, width: 5, height: 5, color: blue });
//       T(S(pt), { size: 9.5, color: black, dx: 14 });
//       y -= 3;
//     });
//     y -= 4;
//   }

//   if (minutesData.nextSteps) { y -= 4; heading("Next Steps"); T(S(minutesData.nextSteps), { size: 9.5, color: black }); y -= 6; }

//   if (minutesData.nextMeetingNote) {
//     need(50); y -= 6;
//     const nmLines = wrap(S(minutesData.nextMeetingNote), CW - 26, 9.5);
//     const nmH = nmLines.length * 14 + 20;
//     page.drawRectangle({ x: ML, y: y - nmH, width: CW, height: nmH, color: blueLt });
//     page.drawRectangle({ x: ML, y: y - nmH, width: 5, height: nmH, color: blue });
//     page.drawText("NEXT MEETING", { x: ML + 14, y: y - 13, font: bold, size: 7.5, color: blue });
//     y -= 18;
//     T(S(minutesData.nextMeetingNote), { font: regular, size: 9.5, color: navy, dx: 14 });
//     y -= 10;
//   }

//   need(75); y -= 12;
//   page.drawLine({ start: { x: ML, y }, end: { x: W - ML, y }, thickness: 0.5, color: grayLt });
//   y -= 24;
//   ["Chairperson", "Secretary / Recorder", "Date Approved"].forEach((lbl, i) => {
//     const sx = ML + i * (CW / 3);
//     page.drawLine({ start: { x: sx, y: y - 18 }, end: { x: sx + CW / 3 - 18, y: y - 18 }, thickness: 0.7, color: grayMid });
//     page.drawText(lbl, { x: sx, y: y - 30, font: regular, size: 7.5, color: gray });
//   });

//   footerOn();
//   const totalPages = doc.getPageCount();
//   for (let pi = 0; pi < totalPages; pi++) {
//     const pg = doc.getPage(pi);
//     pg.drawRectangle({ x: W - ML - 50, y: MB - 22, width: 52, height: 12, color: white });
//     pg.drawText(`Page ${pi + 1} of ${totalPages}`, { x: W - ML - 50, y: MB - 18, font: bold, size: 7, color: grayMid });
//   }

//   const bytes = await doc.save();
//   return URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
// };

// /* ══════════════════════════════════════════════
//    SHARED EDIT FIELD STYLES
// ══════════════════════════════════════════════ */
// const editInput = { width: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.82rem", fontFamily: "inherit", outline: "none", color: "#1e293b", background: "#fff", transition: "border-color 0.2s" };
// const editTextarea = { ...editInput, resize: "vertical", minHeight: 60, lineHeight: 1.5 };
// const sectionLabel = { fontWeight: 700, color: "#193648", fontSize: "0.82rem", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" };
// const addBtn = { background: "#eef4ff", color: "#3a70b0", border: "none", borderRadius: "6px", padding: "3px 10px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" };
// const removeBtn = { background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px 4px", borderRadius: "4px", fontSize: "0.75rem", flexShrink: 0 };

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
//   const updateDecision = (id, f, v)   => setEditData(p => ({ ...p, keyDecisions: p.keyDecisions.map(d => d.id === id ? { ...d, [f]: v } : d) }));
//   const addDecision    = ()           => setEditData(p => ({ ...p, keyDecisions: [...p.keyDecisions, { id: Date.now(), decision: "", rationale: "" }] }));
//   const removeDecision = (id)         => setEditData(p => ({ ...p, keyDecisions: p.keyDecisions.filter(d => d.id !== id) }));
//   const updateAction   = (id, f, v)   => setEditData(p => ({ ...p, actionItems: p.actionItems.map(a => a.id === id ? { ...a, [f]: v } : a) }));
//   const addAction      = ()           => setEditData(p => ({ ...p, actionItems: [...p.actionItems, { id: Date.now(), task: "", responsible: "", deadline: "", priority: "Medium" }] }));
//   const removeAction   = (id)         => setEditData(p => ({ ...p, actionItems: p.actionItems.filter(a => a.id !== id) }));
//   const updateDisc     = (i, v)       => setEditData(p => ({ ...p, discussionPoints: p.discussionPoints.map((d, idx) => idx === i ? v : d) }));
//   const addDisc        = ()           => setEditData(p => ({ ...p, discussionPoints: [...p.discussionPoints, ""] }));
//   const removeDisc     = (i)          => setEditData(p => ({ ...p, discussionPoints: p.discussionPoints.filter((_, idx) => idx !== i) }));

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
//     document.body.appendChild(a); a.click(); document.body.removeChild(a);
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
//     <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,40,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "20px" }}>
//       <motion.div
//         initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.92, opacity: 0 }} transition={{ type: "spring", damping: 20, stiffness: 260 }}
//         style={{ background: "#fff", borderRadius: "24px", width: phase === "edit" ? "820px" : "720px", maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 30px 80px rgba(0,0,0,0.35)", border: "1px solid #e2e8f0", transition: "width 0.3s ease" }}
//       >
//         <div style={{ background: "linear-gradient(120deg,#193648 0%,#2d6a9f 100%)", padding: "22px 28px", borderRadius: "24px 24px 0 0", display: "flex", alignItems: "center", gap: "14px", position: "sticky", top: 0, zIndex: 10 }}>
//           <div style={{ width: 42, height: 42, borderRadius: "12px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//             {phase === "edit" ? <FileText size={20} color="white" /> : <PenLine size={20} color="white" />}
//           </div>
//           <div style={{ flex: 1 }}>
//             <div style={{ color: "white", fontWeight: 700, fontSize: "1.05rem" }}>{phase === "edit" ? "✏️ Review & Edit Minutes" : "Write Meeting Notes"}</div>
//             <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", marginTop: 2 }}>{meeting.agenda} — {meeting.date}</div>
//           </div>
//           <div style={{ display: "flex", gap: 6 }}>
//             {["Write", "Edit", "Save"].map((p, i) => {
//               const active = (i === 0 && (phase === "write" || phase === "error" || phase === "processing")) || (i === 1 && phase === "edit");
//               const done = (i === 0 && phase === "edit");
//               return (
//                 <div key={p} style={{ display: "flex", alignItems: "center", gap: 4, background: done ? "rgba(16,185,129,0.3)" : active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)", borderRadius: "20px", padding: "3px 10px", fontSize: "0.7rem", color: done ? "#6ee7b7" : active ? "white" : "rgba(255,255,255,0.4)", fontWeight: 600 }}>
//                   {done ? "✓" : `${i + 1}.`} {p}
//                 </div>
//               );
//             })}
//           </div>
//           <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "8px", padding: "6px 8px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", flexShrink: 0 }}>
//             <X size={18} />
//           </button>
//         </div>

//         <div style={{ padding: "26px 28px" }}>
//           {(phase === "write" || phase === "error") && (
//             <>
//               <div style={{ marginBottom: 16 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#193648", fontWeight: 600, fontSize: "0.93rem", marginBottom: 8 }}>
//                   <ClipboardList size={16} /> Rough Meeting Notes
//                 </div>
//                 <p style={{ color: "#64748b", fontSize: "0.82rem", margin: "0 0 10px 0", lineHeight: 1.5 }}>
//                   Write everything that happened — decisions, who said what, tasks, deadlines. AI will structure it and you can edit before saving.
//                 </p>
//                 <textarea value={notes} onChange={e => setNotes(e.target.value)}
//                   placeholder={"Example:\n\nDean opened the meeting. Discussed curriculum update — agreed to add AI module in semester 3..."}
//                   style={{ width: "100%", boxSizing: "border-box", minHeight: 240, padding: "13px 15px", border: "2px solid #e2e8f0", borderRadius: "14px", fontSize: "0.87rem", lineHeight: 1.7, fontFamily: "inherit", resize: "vertical", outline: "none", color: "#1e293b", background: "#f8fafc" }}
//                   onFocus={onFocus} onBlur={onBlur}
//                 />
//                 <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7, fontSize: "0.77rem", color: "#94a3b8" }}>
//                   <span>{wordCount} words · {charCount} characters</span>
//                   <span style={{ color: charCount < 30 ? "#ef4444" : "#10b981" }}>{charCount < 30 ? `${30 - charCount} more chars needed` : "✓ Ready to send"}</span>
//                 </div>
//               </div>
//               {phase === "error" && (
//                 <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "11px 15px", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
//                   <AlertCircle size={15} color="#ef4444" style={{ marginTop: 1, flexShrink: 0 }} />
//                   <div>
//                     <div style={{ fontWeight: 600, color: "#dc2626", fontSize: "0.83rem" }}>Generation failed</div>
//                     <div style={{ color: "#7f1d1d", fontSize: "0.78rem", marginTop: 2 }}>{errorMsg}</div>
//                   </div>
//                 </div>
//               )}
//               <div style={{ background: "#f1f5f9", borderRadius: "12px", padding: "12px 15px", marginBottom: 18 }}>
//                 <div style={{ fontWeight: 600, color: "#193648", fontSize: "0.8rem", marginBottom: 7 }}>📋 Attendees (auto-included)</div>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
//                   {meeting.boardMembers.map((m, i) => (
//                     <span key={i} style={{ background: "white", border: "1px solid #cbd5e1", borderRadius: "20px", padding: "3px 10px", fontSize: "0.74rem", color: "#334155" }}>{m.name}</span>
//                   ))}
//                 </div>
//               </div>
//               <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
//                 <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 500, cursor: "pointer", fontSize: "0.86rem" }}>Cancel</button>
//                 <motion.button whileHover={charCount >= 30 ? { scale: 1.03 } : {}} whileTap={charCount >= 30 ? { scale: 0.97 } : {}}
//                   onClick={handleSendToAI} disabled={charCount < 30}
//                   style={{ padding: "9px 22px", borderRadius: "10px", border: "none", background: charCount >= 30 ? "linear-gradient(120deg,#193648,#2d6a9f)" : "#e2e8f0", color: charCount >= 30 ? "white" : "#94a3b8", fontWeight: 600, cursor: charCount >= 30 ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 8, fontSize: "0.86rem" }}>
//                   <Sparkles size={15} /> Send to AI <ChevronRight size={13} />
//                 </motion.button>
//               </div>
//             </>
//           )}

//           {phase === "processing" && (
//             <div style={{ textAlign: "center", padding: "46px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
//               <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#193648,#3a70b0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <Bot size={32} color="white" />
//               </div>
//               <div>
//                 <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#193648", marginBottom: 5 }}>AI is processing your notes…</div>
//                 <div style={{ color: "#64748b", fontSize: "0.86rem" }}>Structuring decisions, assigning responsibilities</div>
//               </div>
//               <div style={{ display: "flex", gap: 7 }}>
//                 {["Analysing notes", "Extracting decisions", "Structuring output"].map((label, i) => (
//                   <motion.div key={i} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.6 }}
//                     style={{ background: "#f1f5f9", borderRadius: "20px", padding: "4px 11px", fontSize: "0.73rem", color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
//                     <Loader size={10} />{label}
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {phase === "edit" && editData && (
//             <>
//               <div style={{ background: "linear-gradient(120deg,#eff6ff,#dbeafe)", border: "1px solid #93c5fd", borderRadius: "12px", padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
//                 <span style={{ fontSize: "1.1rem" }}>✏️</span>
//                 <div>
//                   <div style={{ fontWeight: 700, color: "#1e40af", fontSize: "0.88rem" }}>AI generated your minutes — edit anything before saving</div>
//                   <div style={{ color: "#3b82f6", fontSize: "0.76rem", marginTop: 1 }}>All fields are editable.</div>
//                 </div>
//               </div>
//               <div style={{ marginBottom: 18 }}>
//                 <div style={sectionLabel}>📌 Meeting Title</div>
//                 <input value={editData.meetingTitle || ""} onChange={e => updateField("meetingTitle", e.target.value)} style={editInput} onFocus={onFocus} onBlur={onBlur} />
//               </div>
//               <div style={{ marginBottom: 18 }}>
//                 <div style={sectionLabel}>📝 Executive Summary</div>
//                 <textarea value={editData.summary || ""} onChange={e => updateField("summary", e.target.value)} style={{ ...editTextarea, minHeight: 72 }} onFocus={onFocus} onBlur={onBlur} />
//               </div>
//               <div style={{ marginBottom: 18 }}>
//                 <div style={sectionLabel}>✅ Key Decisions <button style={addBtn} onClick={addDecision}>+ Add Decision</button></div>
//                 {editData.keyDecisions.map((d, idx) => (
//                   <div key={d.id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px", marginBottom: 10 }}>
//                     <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
//                       <span style={{ minWidth: 22, height: 22, borderRadius: "50%", background: "#193648", color: "white", fontSize: "0.68rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{idx + 1}</span>
//                       <div style={{ flex: 1 }}>
//                         <input value={d.decision} onChange={e => updateDecision(d.id, "decision", e.target.value)} placeholder="Decision made..." style={{ ...editInput, marginBottom: 6, fontWeight: 600 }} onFocus={onFocus} onBlur={onBlur} />
//                         <input value={d.rationale || ""} onChange={e => updateDecision(d.id, "rationale", e.target.value)} placeholder="Rationale / reason..." style={{ ...editInput, fontSize: "0.78rem", color: "#64748b" }} onFocus={onFocus} onBlur={onBlur} />
//                       </div>
//                       <button style={removeBtn} onClick={() => removeDecision(d.id)}>✕</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div style={{ marginBottom: 18 }}>
//                 <div style={sectionLabel}>🎯 Action Items <button style={addBtn} onClick={addAction}>+ Add Action</button></div>
//                 {editData.actionItems.map((a, idx) => (
//                   <div key={a.id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px", marginBottom: 10 }}>
//                     <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
//                       <span style={{ minWidth: 22, height: 22, borderRadius: "50%", background: "#3a70b0", color: "white", fontSize: "0.68rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{idx + 1}</span>
//                       <div style={{ flex: 1 }}>
//                         <input value={a.task} onChange={e => updateAction(a.id, "task", e.target.value)} placeholder="Task description..." style={{ ...editInput, marginBottom: 6, fontWeight: 600 }} onFocus={onFocus} onBlur={onBlur} />
//                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
//                           <input value={a.responsible || ""} onChange={e => updateAction(a.id, "responsible", e.target.value)} placeholder="👤 Responsible" style={editInput} onFocus={onFocus} onBlur={onBlur} />
//                           <input value={a.deadline || ""} onChange={e => updateAction(a.id, "deadline", e.target.value)} placeholder="📅 Deadline" style={editInput} onFocus={onFocus} onBlur={onBlur} />
//                           <select value={a.priority || "Medium"} onChange={e => updateAction(a.id, "priority", e.target.value)} style={{ ...editInput, background: priColors[a.priority] || "#fef3c7", color: priText[a.priority] || "#92400e", fontWeight: 700, cursor: "pointer" }}>
//                             <option value="High">High</option>
//                             <option value="Medium">Medium</option>
//                             <option value="Low">Low</option>
//                           </select>
//                         </div>
//                       </div>
//                       <button style={removeBtn} onClick={() => removeAction(a.id)}>✕</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div style={{ marginBottom: 18 }}>
//                 <div style={sectionLabel}>💬 Discussion Points <button style={addBtn} onClick={addDisc}>+ Add Point</button></div>
//                 {(editData.discussionPoints || []).map((d, i) => (
//                   <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
//                     <span style={{ color: "#94a3b8", fontSize: "0.8rem", flexShrink: 0 }}>•</span>
//                     <input value={d} onChange={e => updateDisc(i, e.target.value)} placeholder="Discussion point..." style={{ ...editInput, flex: 1 }} onFocus={onFocus} onBlur={onBlur} />
//                     <button style={removeBtn} onClick={() => removeDisc(i)}>✕</button>
//                   </div>
//                 ))}
//               </div>
//               <div style={{ marginBottom: 18 }}>
//                 <div style={sectionLabel}>🚀 Next Steps</div>
//                 <textarea value={editData.nextSteps || ""} onChange={e => updateField("nextSteps", e.target.value)} style={{ ...editTextarea, minHeight: 56 }} onFocus={onFocus} onBlur={onBlur} />
//               </div>
//               <div style={{ marginBottom: 22 }}>
//                 <div style={sectionLabel}>📅 Next Meeting Note</div>
//                 <input value={editData.nextMeetingNote || ""} onChange={e => updateField("nextMeetingNote", e.target.value)} placeholder="e.g. In 4 weeks — follow up on action items" style={editInput} onFocus={onFocus} onBlur={onBlur} />
//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
//                 <button onClick={() => setPhase("write")} style={{ padding: "9px 18px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 500, cursor: "pointer", fontSize: "0.84rem", display: "flex", alignItems: "center", gap: 6 }}>
//                   ← Back to Notes
//                 </button>
//                 <div style={{ display: "flex", gap: 10 }}>
//                   <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSaveOnly} disabled={isRegenerating}
//                     style={{ padding: "9px 20px", borderRadius: "10px", border: "none", background: "#10b981", color: "white", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: "0.84rem", opacity: isRegenerating ? 0.7 : 1 }}>
//                     {isRegenerating ? <Loader size={14} /> : <CheckCircle2 size={14} />} Save & Close
//                   </motion.button>
//                   <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleDownloadAndSave} disabled={isRegenerating}
//                     style={{ padding: "9px 22px", borderRadius: "10px", border: "none", background: "linear-gradient(120deg,#193648,#2d6a9f)", color: "white", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: "0.84rem", opacity: isRegenerating ? 0.7 : 1 }}>
//                     {isRegenerating ? <Loader size={14} /> : <Download size={14} />} Download PDF & Save
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
//    MAIN COMPONENT — YE FILE KA ASLI FIX HAI
// ══════════════════════════════════════════════ */
// const AdvisoryMeeting = () => {
//   const [meetings, setMeetings] = React.useState([]);
//   const [activeTab, setActiveTab] = React.useState("create");
//   const [showInviteModal, setShowInviteModal] = React.useState(false);
//   const [selectedReps, setSelectedReps] = React.useState([]);
//   const [notesModalFor, setNotesModalFor] = React.useState(null);
//   const [newMeeting, setNewMeeting] = React.useState({ agenda: "", date: "", time: "", venue: "" });
//   const [loadingMeetings, setLoadingMeetings] = React.useState(true); // ✅ NAYA

//   const boardMembers = [
//     { name: "Dean", role: "Chairperson" },
//     { name: "HOD", role: "Head of Department" },
//     { name: "Industry Liaison Officer", role: "Coordinator" },
//     { name: "ABC Tech Representative", role: "Industry Partner" },
//     { name: "Student Representative", role: "Board Member" },
//   ];

//   const industryReps = [
//     { name: "Ali Khan – ABC Tech", suggested: true },
//     { name: "Sara Ahmed – Innovate Labs", suggested: false },
//     { name: "Bilal Rehman – FutureVision Ltd", suggested: true },
//     { name: "Ayesha Noor – TechSphere", suggested: false },
//     { name: "Omar Siddiqui – DataNest", suggested: false },
//   ];

//   // ✅ FIX #1 — Page load par DB se saari meetings fetch karo
//   useEffect(() => {
//     const fetchMeetings = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/all`);
//         const data = await res.json();
//         if (data.success) {
//           // DB se aayi meetings ko frontend format mein convert karo
//           const formatted = data.data.map(m => ({
//             id: m.meetingId,
//             _dbId: m._id,
//             agenda: m.meetingTitle,
//             date: m.date,
//             time: m.time,
//             venue: m.location,
//             status: m.minutesData ? "Completed" : "Scheduled",
//             boardMembers: boardMembers,
//             minutesGenerated: !!m.minutesData,
//             minutesData: m.minutesData || null,
//             downloadUrl: null,
//           }));
//           setMeetings(formatted);
//         }
//       } catch (err) {
//         console.error("Meetings fetch error:", err);
//       } finally {
//         setLoadingMeetings(false);
//       }
//     };
//     fetchMeetings();
//   }, []);

//   // ✅ FIX #2 — Meeting banate waqt DB mein bhi save karo
//   const handleAddMeeting = async () => {
//     if (!newMeeting.agenda || !newMeeting.date || !newMeeting.time || !newMeeting.venue) {
//       alert("Please fill all meeting details!"); return;
//     }

//     const meetingId = String(Date.now());
//     const entry = {
//       id: meetingId,
//       ...newMeeting,
//       status: "Scheduled",
//       boardMembers,
//     };

//     // DB mein save karo
//     try {
//       await fetch(API_BASE, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           meetingId: meetingId,
//           meetingTitle: newMeeting.agenda,
//           date: newMeeting.date,
//           time: newMeeting.time,
//           location: newMeeting.venue,
//           attendees: boardMembers.map(b => b.name).join(", "),
//           decisions: [],
//           actionItems: [],
//         }),
//       });
//     } catch (err) {
//       console.error("Meeting save error:", err);
//     }

//     setMeetings(prev => [...prev, entry]);
//     setNewMeeting({ agenda: "", date: "", time: "", venue: "" });
//     setShowInviteModal(true);
//   };

//   const handleRepSelect = (rep) => {
//     setSelectedReps(prev => prev.includes(rep.name) ? prev.filter(r => r !== rep.name) : [...prev, rep.name]);
//   };

//   const sendInvitations = () => {
//     if (selectedReps.length === 0) { alert("Please select at least one representative."); return; }
//     alert(`✅ Invitations sent to: ${selectedReps.join(", ")}`);
//     setSelectedReps([]); setShowInviteModal(false);
//   };

//   const handleMinutesGenerated = (meetingId, minutesData, downloadUrl) => {
//     setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, status: "Completed", minutesGenerated: true, minutesData, downloadUrl } : m));
//   };

//   const downloadMinutes = (meeting) => {
//     if (!meeting.downloadUrl) return;
//     const a = document.createElement("a");
//     a.href = meeting.downloadUrl;
//     a.download = `Minutes_${meeting.agenda.replace(/\s+/g, "_")}_${meeting.date}.pdf`;
//     document.body.appendChild(a); a.click(); document.body.removeChild(a);
//   };

//   return (
//     <div className="page-container">
//       <AnimatePresence>
//         {notesModalFor && (
//           <NotesModal meeting={notesModalFor} onClose={() => setNotesModalFor(null)} onGenerated={handleMinutesGenerated} />
//         )}
//       </AnimatePresence>

//       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="advisory-header">
//         <div className="flex items-center gap-4">
//           <div className="advisory-title">
//             <h1>Advisory Board Meeting Management</h1>
//             <p>Efficiently organize, schedule, and track advisory board meetings.</p>
//           </div>
//         </div>
//       </motion.div>

//       <div className="tab-buttons">
//         <button className={activeTab === "create" ? "active" : ""} onClick={() => setActiveTab("create")}>📅 Schedule New Meeting</button>
//         <button className={activeTab === "records" ? "active" : ""} onClick={() => setActiveTab("records")}>📘 View Meeting Records</button>
//       </div>

//       <div className="stats-row">
//         <div className="stat-card stat-total"><CalendarDays size={26} /><div className="stat-info"><span className="stat-number">{meetings.length}</span><span className="stat-label">Total Meetings</span></div></div>
//         <div className="stat-card stat-scheduled"><Clock size={26} /><div className="stat-info"><span className="stat-number">{meetings.filter(m => m.status === "Scheduled").length}</span><span className="stat-label">Scheduled</span></div></div>
//         <div className="stat-card stat-completed"><CheckCircle2 size={26} /><div className="stat-info"><span className="stat-number">{meetings.filter(m => m.minutesGenerated).length}</span><span className="stat-label">Completed with MoM</span></div></div>
//       </div>

//       {activeTab === "create" && (
//         <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="meeting-card fade-in">
//           <h2 className="section-title flex items-center gap-2"><CalendarDays /> Enter Meeting Details</h2>
//           <div className="grid md:grid-cols-2 gap-6 mt-4">
//             <div><label className="meeting-label">Agenda</label><input type="text" placeholder="e.g., University-Industry Collaboration" value={newMeeting.agenda} onChange={e => setNewMeeting({ ...newMeeting, agenda: e.target.value })} /></div>
//             <div><label className="meeting-label">Date</label><input type="date" value={newMeeting.date} onChange={e => setNewMeeting({ ...newMeeting, date: e.target.value })} /></div>
//             <div><label className="meeting-label">Time</label><input type="time" value={newMeeting.time} onChange={e => setNewMeeting({ ...newMeeting, time: e.target.value })} /></div>
//             <div><label className="meeting-label">Venue / Meeting Link</label><input type="text" placeholder="e.g., Conference Room A / Zoom Link" value={newMeeting.venue} onChange={e => setNewMeeting({ ...newMeeting, venue: e.target.value })} /></div>
//           </div>
//           <div className="mt-8">
//             <h3 className="section-title flex items-center gap-1"><Users size={18} /> Board Members</h3>
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
//               {boardMembers.map((member, i) => (
//                 <motion.div key={i} whileHover={{ scale: 1.05 }} className="member-card">
//                   <h4>{member.name}</h4><p>{member.role}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//           <div className="flex gap-4 mt-6">
//             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAddMeeting} className="schedule-btn">
//               <Send size={18} /> Schedule Meeting
//             </motion.button>
//           </div>
//         </motion.div>
//       )}

//       {showInviteModal && (
//         <div className="modal-overlay">
//           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="card-modal-box">
//             <h2 className="modal-title flex items-center gap-2 mb-5"><Mail /> Send Invitations to Industry Representatives</h2>
//             <div className="grid sm:grid-cols-2 gap-4">
//               {industryReps.map((rep, i) => (
//                 <div key={i} className={`rep-card ${selectedReps.includes(rep.name) ? "selected" : ""}`} onClick={() => handleRepSelect(rep)}>
//                   <div className="rep-content"><h4>{rep.name}</h4>{rep.suggested && <span className="suggested-badge">System Suggested</span>}</div>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-end gap-3 mt-6">
//               <button className="cancel-btn" onClick={() => setShowInviteModal(false)}>Cancel</button>
//               <button className="send-btn" onClick={sendInvitations}>Send Invitation</button>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {activeTab === "records" && (
//         <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="table-container fade-in">
//           <h2 className="section-title flex items-center gap-2 mb-4"><FileText /> Scheduled Meetings</h2>

//           {/* ✅ Loading state */}
//           {loadingMeetings ? (
//             <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
//               <Loader size={32} style={{ margin: "0 auto 12px", display: "block" }} />
//               <p>Loading meetings...</p>
//             </div>
//           ) : meetings.length === 0 ? (
//             <div className="text-center py-12">
//               <FileText size={48} className="mx-auto text-gray-300 mb-4" />
//               <p className="text-gray-600 text-lg">No meetings scheduled yet.</p>
//               <p className="text-gray-500 text-sm mt-2">Create your first meeting to get started!</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="records-table">
//                 <thead><tr><th>Agenda</th><th>Date</th><th>Time</th><th>Venue</th><th>Status</th><th>Write & Generate MoM</th><th>Download Minutes</th></tr></thead>
//                 <tbody>
//                   {meetings.map((m) => (
//                     <tr key={m.id}>
//                       <td className="font-medium">{m.agenda}</td>
//                       <td>{m.date}</td><td>{m.time}</td>
//                       <td className="max-w-xs truncate">{m.venue}</td>
//                       <td>{m.status === "Scheduled" ? <span className="status-scheduled"><Clock size={15} /> Scheduled</span> : <span className="status-completed"><CheckCircle2 size={15} /> Completed</span>}</td>
//                       <td>
//                         {m.minutesGenerated ? (
//                           <span style={{ color: "#059669", fontWeight: 600, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}><CheckCircle2 size={14} /> Generated</span>
//                         ) : (
//                           <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setNotesModalFor(m)}
//                             style={{ background: "linear-gradient(120deg,#193648,#2d6a9f)", color: "white", border: "none", borderRadius: "9px", padding: "8px 16px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 6, margin: "auto" }}>
//                             <Sparkles size={14} /> Write Notes
//                           </motion.button>
//                         )}
//                       </td>
//                       <td>
//                         {m.minutesGenerated ? (
//                           <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="download-btn" onClick={() => downloadMinutes(m)}>
//                             <Download size={16} /> Download
//                           </motion.button>
//                         ) : (
//                           <span className="not-generated"><FileCheck size={15} /> Not Generated</span>
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


















// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CalendarDays, Users, FileText, CheckCircle2, Clock, Send, Mail,
//   Download, FileCheck, Loader, Sparkles, PenLine, X, ChevronRight,
//   Bot, ClipboardList, AlertCircle, Plus, Trash2, UserPlus, Camera,
//   Bell, CheckCheck, MailCheck, Eye, EyeOff, Search
// } from "lucide-react";

// const API_BASE = "http://localhost:5000/api/meeting-minutes";
// const EMAIL_BASE = "http://localhost:5000/api/email";

// /* ─── Avatar palette ─── */
// const AVATAR_COLORS = [
//   ["#193648","#60b3f0"],["#1d4e2a","#6ee7b7"],["#4a1d62","#c084fc"],
//   ["#7c2d12","#fb923c"],["#1e3a5f","#93c5fd"],["#3d2b0e","#fcd34d"],
// ];
// const getAvatarColor = (name) => {
//   let hash = 0;
//   for (let c of (name||"")) hash = c.charCodeAt(0) + ((hash<<5)-hash);
//   return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
// };
// const Avatar = ({ name, image, size=38 }) => {
//   const [bg,fg] = getAvatarColor(name);
//   const initials = (name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
//   return (
//     <div style={{width:size,height:size,borderRadius:"50%",background:image?undefined:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:size*0.36,fontWeight:700,color:fg,border:`2px solid ${fg}33`,overflow:"hidden"}}>
//       {image ? <img src={image} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}} /> : initials}
//     </div>
//   );
// };

// /* ─── Default board members ─── */
// const DEFAULT_BOARD = [
//   { id:"bm1", name:"Dr. Ahmad Raza", role:"Dean / Chairperson", email:"sabahatqadeerbhati@gmail.com", isFixed:true, image:null },
//   { id:"bm2", name:"Prof. Sara Malik", role:"Head of Department", email:"amnajamil445@gmail.com", isFixed:true, image:null },
//   { id:"bm3", name:"Mr. Bilal Hashmi", role:"Industry Liaison Officer", email:"sabahatqadeerbhati@gmail.com", isFixed:true, image:null },
// ];
// const SUGGESTED_REPS = [
//   { id:"sr1", name:"Ali Khan", org:"ABC Tech", role:"Industry Partner", email:"sabahatqadeerbhati@gmail.com", image:null },
//   { id:"sr2", name:"Sara Ahmed", org:"Innovate Labs", role:"Industry Expert", email:"amnajamil445@gmail.com", image:null },
//   { id:"sr3", name:"Bilal Rehman", org:"FutureVision Ltd", role:"Technology Advisor", email:"sabahatqadeerbhati@gmail.com", image:null },
//   { id:"sr4", name:"Ayesha Noor", org:"TechSphere", role:"Product Strategist", email:"amnajamil445@gmail.com", image:null },
//   { id:"sr5", name:"Omar Siddiqui", org:"DataNest", role:"Data Scientist", email:"sabahatqadeerbhati@gmail.com", image:null },
// ];

// /* ─── Validation helpers ─── */
// const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
// const isEmpty = (v) => !v || !String(v).trim();

// /* ─── AI call ─── */
// const callClaudeForMinutes = async (roughNotes, meetingMeta) => {
//   const systemPrompt = `You are a professional meeting secretary. Always respond with ONLY valid JSON — no markdown, no backticks, no preamble. Schema: {"meetingTitle":"string","summary":"string","keyDecisions":[{"id":1,"decision":"string","rationale":"string"}],"actionItems":[{"id":1,"task":"string","responsible":"string","deadline":"string","priority":"High|Medium|Low"}],"discussionPoints":["string"],"nextSteps":"string","nextMeetingNote":"string"}`;
//   const userPrompt = `Meeting Details:\n- Agenda: ${meetingMeta.agenda}\n- Date: ${meetingMeta.date}\n- Time: ${meetingMeta.time}\n- Venue: ${meetingMeta.venue}\n- Attendees: ${meetingMeta.boardMembers.map(b=>`${b.name} (${b.role})`).join(", ")}\n\nRough Notes:\n${roughNotes}\n\nReturn ONLY JSON.`;
//   const resp = await fetch("http://localhost:5000/api/generate-minutes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({systemPrompt,userPrompt})});
//   const raw = await resp.text();
//   if(!resp.ok) throw new Error(`Server ${resp.status}`);
//   const data = JSON.parse(raw);
//   const content = data.content;
//   if(!content) throw new Error("Empty AI response");
//   if(typeof content==="object") return content;
//   const cleaned = content.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
//   try { return JSON.parse(cleaned); } catch { const m=cleaned.match(/\{[\s\S]*\}/); if(m) return JSON.parse(m[0]); throw new Error("Invalid JSON"); }
// };

// /* ─── PDF generation ─── */
// const sanitize = (t) => (t==null?"":String(t).replace(/[\u2013\u2014]/g,"-").replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"').replace(/\u2022/g,"-").replace(/\u2026/g,"...").replace(/\u00A0/g," ").replace(/[^\x00-\xFF]/g,"?"));

// const createMinutesPDF = async (minutesData, meetingMeta) => {
//   const { PDFDocument, rgb, StandardFonts } = await import("https://cdn.jsdelivr.net/esm/pdf-lib@1.17.1");
//   const doc=await PDFDocument.create();
//   const regular=await doc.embedFont(StandardFonts.Helvetica);
//   const bold=await doc.embedFont(StandardFonts.HelveticaBold);
//   const italic=await doc.embedFont(StandardFonts.HelveticaOblique);
//   const navy=rgb(0.06,0.16,0.28),navyDk=rgb(0.04,0.10,0.20),blue=rgb(0.16,0.50,0.73),blueLt=rgb(0.84,0.92,0.97),green=rgb(0.15,0.68,0.38),greenLt=rgb(0.83,0.94,0.87),amber=rgb(0.95,0.61,0.07),amberLt=rgb(0.99,0.95,0.83),red=rgb(0.75,0.22,0.17),redLt=rgb(0.98,0.86,0.85),white=rgb(1,1,1),offWh=rgb(0.97,0.975,0.982),black=rgb(0.12,0.12,0.14),gray=rgb(0.44,0.47,0.51),grayMd=rgb(0.72,0.74,0.77),grayLt=rgb(0.91,0.92,0.94),div=rgb(0.87,0.89,0.92);
//   const W=612,H=792,ML=50,MB=52,CW=W-ML*2;
//   let page,y;
//   const wrap=(text,maxW,size)=>{const cpp=Math.max(1,Math.floor(maxW/(size*0.545)));const words=sanitize(text).split(" ");let line="",out=[];for(const w of words){const t=line?line+" "+w:w;if(t.length>cpp&&line){out.push(line);line=w;}else line=t;}if(line)out.push(line);return out;};
//   const T=(text,opts={})=>{const{x=ML,size=10,font=regular,color=black,maxW=CW,lh=1.55,dx=0}=opts;const lines=wrap(text,maxW-dx,size);for(const l of lines){if(y-size-2<MB){footerOn();addPage();headerOn();}page.drawText(l,{x:x+dx,y:y-size,font,size,color});y-=size*lh;}};
//   const addPage=()=>{page=doc.addPage([W,H]);y=H-50;};
//   const headerOn=()=>{page.drawRectangle({x:0,y:H-32,width:W,height:32,color:navyDk});page.drawRectangle({x:0,y:H-32,width:5,height:32,color:blue});page.drawText("ADVISORY BOARD MEETING MINUTES",{x:ML+4,y:H-21,font:bold,size:8,color:rgb(0.65,0.76,0.87)});page.drawText("CollaXion",{x:W-ML-44,y:H-21,font:bold,size:9,color:blue});y=H-46;};
//   const footerOn=()=>{page.drawLine({start:{x:ML,y:MB-6},end:{x:W-ML,y:MB-6},thickness:0.5,color:grayLt});page.drawText("CollaXion — Confidential Advisory Board Record",{x:ML,y:MB-18,font:italic,size:7,color:grayMd});};
//   const need=(h)=>{if(y-h<MB+10){footerOn();addPage();headerOn();}};
//   const heading=(title)=>{need(36);page.drawRectangle({x:ML,y:y-28,width:5,height:28,color:blue});page.drawRectangle({x:ML+5,y:y-28,width:CW-5,height:28,color:offWh});page.drawText(sanitize(title).toUpperCase(),{x:ML+14,y:y-18,font:bold,size:9.5,color:navy});y-=36;};
//   const pill=(label,px,py)=>{const map={High:[redLt,red],Medium:[amberLt,amber],Low:[greenLt,green]};const[bg,fg]=map[label]||map.Medium;const pw=label.length*5.6+14;page.drawRectangle({x:px,y:py-10,width:pw,height:12,color:bg});page.drawText(sanitize(label),{x:px+7,y:py-7,font:bold,size:7.5,color:fg});};
//   addPage();
//   const COVER_H=210;
//   page.drawRectangle({x:0,y:H-COVER_H,width:W,height:COVER_H,color:navyDk});
//   page.drawRectangle({x:W-10,y:H-COVER_H,width:10,height:COVER_H,color:blue});
//   page.drawRectangle({x:0,y:H-30,width:W-10,height:30,color:navy});
//   page.drawText("OFFICIAL DOCUMENT  |  ADVISORY BOARD",{x:ML,y:H-20,font:bold,size:7,color:rgb(0.5,0.66,0.82)});
//   page.drawText(sanitize(new Date().toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})),{x:W-ML-200,y:H-20,font:regular,size:7,color:rgb(0.5,0.66,0.82)});
//   page.drawLine({start:{x:ML,y:H-32},end:{x:W-20,y:H-32},thickness:0.4,color:rgb(0.22,0.35,0.50)});
//   page.drawText("CollaXion",{x:ML,y:H-62,font:bold,size:24,color:blue});
//   page.drawText("Advisory Board",{x:ML,y:H-85,font:regular,size:12,color:rgb(0.72,0.82,0.91)});
//   page.drawText("Meeting Minutes",{x:ML,y:H-108,font:bold,size:30,color:white});
//   page.drawLine({start:{x:ML,y:H-122},end:{x:W-22,y:H-122},thickness:0.5,color:rgb(0.22,0.35,0.50)});
//   const mtLines=wrap(minutesData.meetingTitle||meetingMeta.agenda||"Advisory Board Meeting",CW-20,11.5);
//   let mtY=H-140;
//   for(const ln of mtLines.slice(0,3)){page.drawText(sanitize(ln),{x:ML,y:mtY,font:bold,size:11.5,color:rgb(0.83,0.90,0.96)});mtY-=17;}
//   const cardTop=H-COVER_H-16,cardH=46,cardW=(CW-12)/3;
//   [{label:"DATE",val:meetingMeta.date||"—"},{label:"TIME",val:meetingMeta.time||"—"},{label:"VENUE",val:meetingMeta.venue||"—"}].forEach((c,i)=>{const cx=ML+i*(cardW+6);page.drawRectangle({x:cx+1,y:cardTop-cardH-1,width:cardW,height:cardH,color:grayLt});page.drawRectangle({x:cx,y:cardTop-cardH,width:cardW,height:cardH,color:white});page.drawRectangle({x:cx,y:cardTop-3,width:cardW,height:3,color:blue});page.drawText(c.label,{x:cx+8,y:cardTop-13,font:bold,size:7,color:blue});const vw=wrap(sanitize(c.val),cardW-16,10);vw.slice(0,2).forEach((vl,vi)=>{page.drawText(vl,{x:cx+8,y:cardTop-26-vi*13,font:bold,size:10,color:navy});});});
//   y=cardTop-cardH-22;
//   if(minutesData.summary){need(50);y-=6;heading("Executive Summary");const sumLines=wrap(minutesData.summary,CW-18,9.5);const boxH=sumLines.length*14+16;need(boxH+8);page.drawRectangle({x:ML,y:y-boxH,width:4,height:boxH,color:blue});page.drawRectangle({x:ML+4,y:y-boxH,width:CW-4,height:boxH,color:rgb(0.96,0.97,0.99)});y-=10;T(minutesData.summary,{font:italic,size:9.5,color:gray,dx:14});y-=6;}
//   y-=4;heading("Attendees");
//   const half=CW/2;
//   meetingMeta.boardMembers.forEach((m,i)=>{const col=i%2,ax=ML+col*half;if(col===0)need(30);page.drawCircle({x:ax+7,y:y-8,size:3.5,color:blue});page.drawText(sanitize(m.name),{x:ax+18,y:y-11,font:bold,size:9.5,color:navy});page.drawText(sanitize(m.role),{x:ax+18,y:y-22,font:regular,size:8,color:gray});if(col===1||i===meetingMeta.boardMembers.length-1)y-=30;});
//   y-=8;
//   if((minutesData.keyDecisions||[]).length>0){y-=4;heading("Key Decisions");(minutesData.keyDecisions||[]).forEach((d,i)=>{need(48);page.drawRectangle({x:ML,y:y-22,width:22,height:22,color:navy});page.drawText(String(i+1),{x:ML+(i>=9?5:7),y:y-15,font:bold,size:9,color:white});T(sanitize(d.decision),{font:bold,size:9.5,color:black,dx:30});if(d.rationale)T("Rationale: "+sanitize(d.rationale),{font:italic,size:8.5,color:gray,dx:30});page.drawLine({start:{x:ML+28,y:y},end:{x:W-ML,y:y},thickness:0.35,color:div});y-=8;});y-=4;}
//   if((minutesData.actionItems||[]).length>0){y-=4;heading("Action Items");need(22);page.drawRectangle({x:ML,y:y-20,width:CW,height:20,color:navy});const COL={num:ML+6,task:ML+22,resp:ML+240,dl:ML+360,pri:ML+458};[["#",COL.num],["Task",COL.task],["Responsible",COL.resp],["Deadline",COL.dl],["Priority",COL.pri]].forEach(([lbl,lx])=>{page.drawText(lbl,{x:lx,y:y-13,font:bold,size:8,color:white});});y-=20;(minutesData.actionItems||[]).forEach((a,i)=>{need(32);const rH=30,bg=i%2===0?white:offWh;page.drawRectangle({x:ML,y:y-rH,width:CW,height:rH,color:bg});page.drawRectangle({x:ML,y:y-rH,width:4,height:rH,color:blueLt});page.drawLine({start:{x:ML,y:y-rH},end:{x:W-ML,y:y-rH},thickness:0.3,color:div});page.drawText(String(i+1),{x:COL.num,y:y-18,font:bold,size:8,color:gray});const tLines=wrap(sanitize(a.task),210,8.5);tLines.slice(0,2).forEach((tl,ti)=>{page.drawText(tl,{x:COL.task,y:y-11-ti*11,font:bold,size:8.5,color:black});});const rLines=wrap(sanitize(a.responsible||"TBD"),110,8);rLines.slice(0,2).forEach((rl,ri)=>{page.drawText(rl,{x:COL.resp,y:y-11-ri*10,font:regular,size:8,color:navy});});page.drawText(sanitize(a.deadline||"TBD"),{x:COL.dl,y:y-14,font:regular,size:8,color:gray});pill(a.priority||"Medium",COL.pri,y-10);y-=rH;});y-=10;}
//   if((minutesData.discussionPoints||[]).length>0){y-=4;heading("Points of Discussion");(minutesData.discussionPoints||[]).forEach((pt)=>{need(22);page.drawRectangle({x:ML,y:y-8,width:5,height:5,color:blue});T(sanitize(pt),{size:9.5,color:black,dx:14});y-=3;});y-=4;}
//   if(minutesData.nextSteps){y-=4;heading("Next Steps");T(sanitize(minutesData.nextSteps),{size:9.5,color:black});y-=6;}
//   if(minutesData.nextMeetingNote){need(50);y-=6;const nmLines=wrap(sanitize(minutesData.nextMeetingNote),CW-26,9.5);const nmH=nmLines.length*14+20;page.drawRectangle({x:ML,y:y-nmH,width:CW,height:nmH,color:blueLt});page.drawRectangle({x:ML,y:y-nmH,width:5,height:nmH,color:blue});page.drawText("NEXT MEETING",{x:ML+14,y:y-13,font:bold,size:7.5,color:blue});y-=18;T(sanitize(minutesData.nextMeetingNote),{font:regular,size:9.5,color:navy,dx:14});y-=10;}
//   need(75);y-=12;page.drawLine({start:{x:ML,y},end:{x:W-ML,y},thickness:0.5,color:grayLt});y-=24;
//   ["Chairperson","Secretary / Recorder","Date Approved"].forEach((lbl,i)=>{const sx=ML+i*(CW/3);page.drawLine({start:{x:sx,y:y-18},end:{x:sx+CW/3-18,y:y-18},thickness:0.7,color:grayMd});page.drawText(lbl,{x:sx,y:y-30,font:regular,size:7.5,color:gray});});
//   footerOn();
//   const totalPages=doc.getPageCount();
//   for(let pi=0;pi<totalPages;pi++){const pg=doc.getPage(pi);pg.drawRectangle({x:W-ML-50,y:MB-22,width:52,height:12,color:white});pg.drawText(`Page ${pi+1} of ${totalPages}`,{x:W-ML-50,y:MB-18,font:bold,size:7,color:grayMd});}
//   const bytes=await doc.save();
//   return { url:URL.createObjectURL(new Blob([bytes],{type:"application/pdf"})), bytes };
// };

// /* ════════════════════════════════════════════
//    MEMBER CARD with image upload
// ════════════════════════════════════════════ */
// const MemberCard = ({ member, removable, onRemove, onImageUpload, compact=false }) => {
//   const fileRef = useRef();
//   return (
//     <motion.div whileHover={{y:-2,boxShadow:"0 8px 24px rgba(25,54,72,0.15)"}} transition={{duration:0.2}}
//       style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:compact?"12px 14px":"16px",display:"flex",alignItems:"center",gap:12,position:"relative",cursor:"default"}}>
//       <div style={{position:"relative",flexShrink:0}}>
//         <Avatar name={member.name} image={member.image} size={compact?36:46} />
//         {onImageUpload && (
//           <button onClick={()=>fileRef.current?.click()} title="Upload photo"
//             style={{position:"absolute",bottom:-2,right:-2,width:18,height:18,borderRadius:"50%",background:"#193648",border:"2px solid white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
//             <Camera size={9} color="white" />
//           </button>
//         )}
//         <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
//           const f=e.target.files?.[0]; if(!f) return;
//           const reader=new FileReader();
//           reader.onload=ev=>onImageUpload&&onImageUpload(member.id,ev.target.result);
//           reader.readAsDataURL(f);
//         }}/>
//       </div>
//       <div style={{flex:1,minWidth:0}}>
//         <div style={{fontWeight:700,color:"#193648",fontSize:compact?"0.82rem":"0.9rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{member.name}</div>
//         <div style={{color:"#64748b",fontSize:"0.75rem",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{member.role}{member.org?` · ${member.org}`:""}</div>
//         {member.email&&<div style={{color:"#94a3b8",fontSize:"0.68rem",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{member.email}</div>}
//       </div>
//       {removable && (
//         <button onClick={onRemove} style={{background:"#fee2e2",border:"none",borderRadius:"6px",width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
//           <Trash2 size={12} color="#ef4444" />
//         </button>
//       )}
//     </motion.div>
//   );
// };

// /* ════════════════════════════════════════════
//    INVITE MODAL
// ════════════════════════════════════════════ */
// const InviteModal = ({ meeting, onClose, onSent }) => {
//   const [selected, setSelected] = useState([]);
//   const [custom, setCustom] = useState([]);
//   const [newName,setNewName]=useState(""); const [newEmail,setNewEmail]=useState(""); const [newOrg,setNewOrg]=useState(""); const [newRole,setNewRole]=useState("");
//   const [errors,setErrors]=useState({});
//   const [sending,setSending]=useState(false);
//   const [sent,setSent]=useState(false);
//   const [searchQ,setSearchQ]=useState("");

//   const toggle=(rep)=>setSelected(p=>p.find(r=>r.id===rep.id)?p.filter(r=>r.id!==rep.id):[...p,rep]);
//   const isSelected=(rep)=>!!selected.find(r=>r.id===rep.id);

//   const validateAdd=()=>{const e={};if(isEmpty(newName))e.name="Name required";if(isEmpty(newEmail))e.email="Email required";else if(!isEmail(newEmail))e.email="Invalid email";setErrors(e);return Object.keys(e).length===0;};
//   const addCustom=()=>{if(!validateAdd())return;const rep={id:"c"+Date.now(),name:newName,email:newEmail,org:newOrg||"—",role:newRole||"Guest",image:null,isCustom:true};setCustom(p=>[...p,rep]);setSelected(p=>[...p,rep]);setNewName("");setNewEmail("");setNewOrg("");setNewRole("");setErrors({});};

//   const filtered=SUGGESTED_REPS.filter(r=>r.name.toLowerCase().includes(searchQ.toLowerCase())||r.org.toLowerCase().includes(searchQ.toLowerCase()));

//   const sendAll=async()=>{
//     if(selected.length===0){alert("Select at least one person.");return;}
//     setSending(true);
//     const results=await Promise.all(selected.map(async rep=>{
//       try{
//         const r=await fetch(`${EMAIL_BASE}/send-invitation`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:rep.email,name:rep.name,agenda:meeting.agenda,date:meeting.date,time:meeting.time,venue:meeting.venue,meetingId:meeting.id})});
//         const d=await r.json();
//         return{...rep,ok:d.success};
//       }catch(e){return{...rep,ok:false};}
//     }));
//     setSending(false);setSent(true);
//     onSent(results);
//   };

//   const inpStyle={width:"100%",boxSizing:"border-box",padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:"8px",fontSize:"0.82rem",fontFamily:"inherit",outline:"none",color:"#1e293b",background:"#fff"};
//   const errStyle={color:"#ef4444",fontSize:"0.7rem",marginTop:3};

//   return(
//     <div style={{position:"fixed",inset:0,background:"rgba(10,20,40,0.7)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
//       <motion.div initial={{scale:0.9,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.9,opacity:0}}
//         style={{background:"#fff",borderRadius:20,width:760,maxWidth:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 30px 80px rgba(0,0,0,0.3)"}}>
//         {/* Header */}
//         <div style={{background:"linear-gradient(120deg,#193648,#2d6a9f)",padding:"22px 28px",borderRadius:"20px 20px 0 0",display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:10}}>
//           <div style={{width:42,height:42,borderRadius:12,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
//             <Mail size={20} color="white"/>
//           </div>
//           <div style={{flex:1}}>
//             <div style={{color:"white",fontWeight:700,fontSize:"1.05rem"}}>Send Meeting Invitations</div>
//             <div style={{color:"rgba(255,255,255,0.65)",fontSize:"0.78rem",marginTop:2}}>{meeting.agenda} — {meeting.date}</div>
//           </div>
//           {selected.length>0&&<div style={{background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"4px 12px",color:"white",fontSize:"0.78rem",fontWeight:700}}>{selected.length} selected</div>}
//           <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:"white",display:"flex",alignItems:"center"}}>
//             <X size={18}/>
//           </button>
//         </div>

//         <div style={{padding:"24px 28px"}}>
//           {!sent ? (<>
//             {/* Search */}
//             <div style={{position:"relative",marginBottom:16}}>
//               <Search size={15} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#94a3b8"}}/>
//               <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search by name or organisation…" style={{...inpStyle,paddingLeft:36}}/>
//             </div>

//             {/* Suggested reps */}
//             <div style={{fontWeight:700,color:"#193648",fontSize:"0.82rem",marginBottom:10}}>💡 System Suggested Representatives</div>
//             <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
//               {filtered.map(rep=>(
//                 <motion.div key={rep.id} whileTap={{scale:0.97}} onClick={()=>toggle(rep)}
//                   style={{padding:"12px 14px",borderRadius:12,border:`2px solid ${isSelected(rep)?"#193648":"#e2e8f0"}`,background:isSelected(rep)?"#eff6ff":"#f8fafc",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all 0.2s"}}>
//                   <Avatar name={rep.name} size={36}/>
//                   <div style={{flex:1,minWidth:0}}>
//                     <div style={{fontWeight:700,color:"#193648",fontSize:"0.82rem"}}>{rep.name}</div>
//                     <div style={{color:"#64748b",fontSize:"0.72rem"}}>{rep.org} · {rep.role}</div>
//                     <div style={{color:"#94a3b8",fontSize:"0.67rem"}}>{rep.email}</div>
//                   </div>
//                   <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${isSelected(rep)?"#193648":"#cbd5e1"}`,background:isSelected(rep)?"#193648":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
//                     {isSelected(rep)&&<CheckCheck size={11} color="white"/>}
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Custom representatives */}
//             {custom.length>0&&(<>
//               <div style={{fontWeight:700,color:"#193648",fontSize:"0.82rem",marginBottom:10}}>✅ Added by You</div>
//               <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
//                 {custom.map(rep=>(
//                   <div key={rep.id} style={{padding:"10px 12px",borderRadius:12,border:`2px solid ${isSelected(rep)?"#193648":"#e2e8f0"}`,background:isSelected(rep)?"#eff6ff":"#f8fafc",cursor:"pointer",display:"flex",alignItems:"center",gap:10}} onClick={()=>toggle(rep)}>
//                     <Avatar name={rep.name} size={32}/>
//                     <div style={{flex:1,minWidth:0}}>
//                       <div style={{fontWeight:700,color:"#193648",fontSize:"0.8rem"}}>{rep.name}</div>
//                       <div style={{color:"#64748b",fontSize:"0.7rem"}}>{rep.org} · {rep.role}</div>
//                     </div>
//                     {isSelected(rep)&&<CheckCheck size={13} color="#193648"/>}
//                   </div>
//                 ))}
//               </div>
//             </>)}

//             {/* Add custom */}
//             <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:"16px 18px",marginBottom:20}}>
//               <div style={{fontWeight:700,color:"#193648",fontSize:"0.82rem",marginBottom:12,display:"flex",alignItems:"center",gap:6}}><UserPlus size={14}/> Add External Representative</div>
//               <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
//                 <div>
//                   <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Full Name *" style={{...inpStyle,borderColor:errors.name?"#ef4444":"#e2e8f0"}}/>
//                   {errors.name&&<div style={errStyle}>{errors.name}</div>}
//                 </div>
//                 <div>
//                   <input value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="Email Address *" style={{...inpStyle,borderColor:errors.email?"#ef4444":"#e2e8f0"}}/>
//                   {errors.email&&<div style={errStyle}>{errors.email}</div>}
//                 </div>
//                 <input value={newOrg} onChange={e=>setNewOrg(e.target.value)} placeholder="Organisation" style={inpStyle}/>
//                 <input value={newRole} onChange={e=>setNewRole(e.target.value)} placeholder="Role / Title" style={inpStyle}/>
//               </div>
//               <button onClick={addCustom} style={{background:"#193648",color:"white",border:"none",borderRadius:8,padding:"8px 18px",fontSize:"0.8rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
//                 <Plus size={13}/> Add & Select
//               </button>
//             </div>

//             <div style={{display:"flex",justifyContent:"flex-end",gap:10,paddingTop:10,borderTop:"1px solid #f1f5f9"}}>
//               <button onClick={onClose} style={{padding:"9px 20px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"white",color:"#64748b",fontWeight:500,cursor:"pointer",fontSize:"0.84rem"}}>Cancel</button>
//               <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={sendAll} disabled={sending||selected.length===0}
//                 style={{padding:"9px 22px",borderRadius:10,border:"none",background:selected.length>0?"linear-gradient(120deg,#193648,#2d6a9f)":"#e2e8f0",color:selected.length>0?"white":"#94a3b8",fontWeight:600,cursor:selected.length>0?"pointer":"not-allowed",display:"flex",alignItems:"center",gap:7,fontSize:"0.84rem",opacity:sending?0.8:1}}>
//                 {sending?<><Loader size={14}/> Sending…</>:<><Send size={14}/> Send {selected.length>0?`to ${selected.length}`:"Invitations"}</>}
//               </motion.button>
//             </div>
//           </>) : (
//             <div style={{textAlign:"center",padding:"40px 20px"}}>
//               <div style={{width:64,height:64,borderRadius:"50%",background:"#d1fae5",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
//                 <MailCheck size={28} color="#059669"/>
//               </div>
//               <div style={{fontWeight:700,fontSize:"1.1rem",color:"#193648",marginBottom:8}}>Invitations Sent!</div>
//               <div style={{color:"#64748b",fontSize:"0.86rem",marginBottom:24}}>Email invitations have been dispatched to {selected.length} representative(s).</div>
//               <button onClick={onClose} style={{background:"#193648",color:"white",border:"none",borderRadius:10,padding:"10px 28px",fontWeight:600,cursor:"pointer"}}>Done</button>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// /* ════════════════════════════════════════════
//    NOTES MODAL
// ════════════════════════════════════════════ */
// const editInput={width:"100%",boxSizing:"border-box",padding:"8px 11px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:"0.82rem",fontFamily:"inherit",outline:"none",color:"#1e293b",background:"#fff",transition:"border-color 0.2s"};
// const editTextarea={...editInput,resize:"vertical",minHeight:60,lineHeight:1.5};
// const sectionLabel={fontWeight:700,color:"#193648",fontSize:"0.82rem",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"};
// const addBtnStyle={background:"#eef4ff",color:"#3a70b0",border:"none",borderRadius:6,padding:"3px 10px",fontSize:"0.74rem",fontWeight:600,cursor:"pointer"};
// const remBtnStyle={background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:"2px 4px",borderRadius:4,fontSize:"0.75rem",flexShrink:0};

// const NotesModal = ({ meeting, onClose, onGenerated }) => {
//   const [notes,setNotes]=useState(""); const [phase,setPhase]=useState("write");
//   const [errorMsg,setErrorMsg]=useState(""); const [editData,setEditData]=useState(null);
//   const [downloadUrl,setDownloadUrl]=useState(null); const [pdfBytes,setPdfBytes]=useState(null);
//   const [isRegen,setIsRegen]=useState(false); const [sendingEmail,setSendingEmail]=useState(false);

//   const chars=notes.trim().length; const words=notes.trim()?notes.trim().split(/\s+/).length:0;
//   const uf=(f,v)=>setEditData(p=>({...p,[f]:v}));
//   const ud=(id,f,v)=>setEditData(p=>({...p,keyDecisions:p.keyDecisions.map(d=>d.id===id?{...d,[f]:v}:d)}));
//   const ua=(id,f,v)=>setEditData(p=>({...p,actionItems:p.actionItems.map(a=>a.id===id?{...a,[f]:v}:a)}));
//   const udp=(i,v)=>setEditData(p=>({...p,discussionPoints:p.discussionPoints.map((d,idx)=>idx===i?v:d)}));

//   const sendToAI=async()=>{if(chars<30)return;setPhase("processing");try{const s=await callClaudeForMinutes(notes,meeting);setEditData(JSON.parse(JSON.stringify(s)));setPhase("edit");}catch(e){setErrorMsg(e.message||"Error");setPhase("error");}};

//   const genPDF=async()=>{
//     setIsRegen(true);
//     try{const{url,bytes}=await createMinutesPDF(editData,meeting);setDownloadUrl(url);setPdfBytes(bytes);setIsRegen(false);return{url,bytes};}
//     catch(e){setIsRegen(false);alert("PDF error: "+e.message);return null;}
//   };

//   const handleDownloadSave=async()=>{
//     const res=await genPDF(); if(!res)return;
//     const a=document.createElement("a");a.href=res.url;a.download=`Minutes_${meeting.agenda.replace(/\s+/g,"_")}_${meeting.date}.pdf`;document.body.appendChild(a);a.click();document.body.removeChild(a);
//     await saveToBackend(res);
//     onGenerated(meeting.id,editData,res.url,res.bytes);
//     onClose();
//   };

//   const handleSaveOnly=async()=>{
//     const res=await genPDF(); if(!res)return;
//     await saveToBackend(res);
//     onGenerated(meeting.id,editData,res.url,res.bytes);
//     onClose();
//   };

//   const saveToBackend=async(res)=>{
//     try{
//       await fetch(`${API_BASE}/${meeting._dbId||meeting.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({minutesData:editData,decisions:(editData.keyDecisions||[]).map(d=>d.decision),actionItems:(editData.actionItems||[]).map(a=>a.task)})}).catch(()=>{});
//     }catch(e){console.warn("Backend save:",e);}
//   };

//   const handleEmailPDF=async()=>{
//     if(!pdfBytes&&!downloadUrl){const res=await genPDF();if(!res)return;await doEmailSend(res.bytes);}
//     else await doEmailSend(pdfBytes);
//   };
//   const doEmailSend=async(bytes)=>{
//     if(!bytes){alert("Generate PDF first.");return;}
//     setSendingEmail(true);
//     const b64=btoa(String.fromCharCode(...new Uint8Array(bytes)));
//     const recipients=meeting.boardMembers.map(m=>({email:m.email,name:m.name})).filter(r=>r.email&&isEmail(r.email));
//     try{
//       const r=await fetch(`${EMAIL_BASE}/send-minutes`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({recipients,pdfBase64:b64,meetingTitle:editData?.meetingTitle||meeting.agenda,date:meeting.date})});
//       const d=await r.json();
//       if(d.success)alert(`✅ Minutes emailed to ${recipients.length} attendee(s)!`);
//       else alert("Some emails failed. Check logs.");
//     }catch(e){alert("Email error: "+e.message);}
//     setSendingEmail(false);
//   };

//   const onFocus=e=>{e.target.style.borderColor="#193648";};
//   const onBlur=e=>{e.target.style.borderColor="#e2e8f0";};
//   const priC={High:"#fee2e2",Medium:"#fef3c7",Low:"#d1fae5"};
//   const priT={High:"#991b1b",Medium:"#92400e",Low:"#065f46"};

//   return(
//     <div style={{position:"fixed",inset:0,background:"rgba(10,20,40,0.7)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1001,padding:20}}>
//       <motion.div initial={{scale:0.92,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.92,opacity:0}} transition={{type:"spring",damping:20,stiffness:260}}
//         style={{background:"#fff",borderRadius:24,width:phase==="edit"?"840px":"720px",maxWidth:"100%",maxHeight:"92vh",overflowY:"auto",boxShadow:"0 30px 80px rgba(0,0,0,0.35)",border:"1px solid #e2e8f0",transition:"width 0.3s"}}>
//         {/* Header */}
//         <div style={{background:"linear-gradient(120deg,#193648 0%,#2d6a9f 100%)",padding:"22px 28px",borderRadius:"24px 24px 0 0",display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:10}}>
//           <div style={{width:42,height:42,borderRadius:12,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
//             {phase==="edit"?<FileText size={20} color="white"/>:<PenLine size={20} color="white"/>}
//           </div>
//           <div style={{flex:1}}>
//             <div style={{color:"white",fontWeight:700,fontSize:"1.05rem"}}>{phase==="edit"?"✏️ Review & Edit Minutes":"Write Meeting Notes"}</div>
//             <div style={{color:"rgba(255,255,255,0.7)",fontSize:"0.8rem",marginTop:2}}>{meeting.agenda} — {meeting.date}</div>
//           </div>
//           {["Write","Edit","Save"].map((p,i)=>{const active=(i===0&&["write","error","processing"].includes(phase))||(i===1&&phase==="edit");const done=i===0&&phase==="edit";return(
//             <div key={p} style={{display:"flex",alignItems:"center",gap:4,background:done?"rgba(16,185,129,0.3)":active?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.07)",borderRadius:20,padding:"3px 10px",fontSize:"0.7rem",color:done?"#6ee7b7":active?"white":"rgba(255,255,255,0.4)",fontWeight:600}}>
//               {done?"✓":`${i+1}.`} {p}
//             </div>
//           );})}
//           <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:"white",display:"flex",alignItems:"center",flexShrink:0}}><X size={18}/></button>
//         </div>

//         <div style={{padding:"26px 28px"}}>
//           {(phase==="write"||phase==="error")&&(<>
//             <div style={{display:"flex",alignItems:"center",gap:8,color:"#193648",fontWeight:600,fontSize:"0.93rem",marginBottom:8}}><ClipboardList size={16}/> Rough Meeting Notes</div>
//             <p style={{color:"#64748b",fontSize:"0.82rem",margin:"0 0 10px 0",lineHeight:1.5}}>Write everything that happened — decisions, who said what, tasks, deadlines. AI will structure it.</p>
//             <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder={"Example:\n\nDean opened the meeting. Discussed curriculum update — agreed to add AI module in semester 3..."}
//               style={{width:"100%",boxSizing:"border-box",minHeight:240,padding:"13px 15px",border:"2px solid #e2e8f0",borderRadius:14,fontSize:"0.87rem",lineHeight:1.7,fontFamily:"inherit",resize:"vertical",outline:"none",color:"#1e293b",background:"#f8fafc"}}
//               onFocus={onFocus} onBlur={onBlur}/>
//             <div style={{display:"flex",justifyContent:"space-between",marginTop:7,fontSize:"0.77rem",color:"#94a3b8"}}>
//               <span>{words} words · {chars} characters</span>
//               <span style={{color:chars<30?"#ef4444":"#10b981"}}>{chars<30?`${30-chars} more chars needed`:"✓ Ready to send"}</span>
//             </div>
//             {phase==="error"&&(
//               <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"11px 15px",display:"flex",gap:10,alignItems:"flex-start",margin:"14px 0"}}>
//                 <AlertCircle size={15} color="#ef4444" style={{marginTop:1,flexShrink:0}}/>
//                 <div><div style={{fontWeight:600,color:"#dc2626",fontSize:"0.83rem"}}>Generation failed</div><div style={{color:"#7f1d1d",fontSize:"0.78rem",marginTop:2}}>{errorMsg}</div></div>
//               </div>
//             )}
//             <div style={{background:"#f1f5f9",borderRadius:12,padding:"12px 15px",margin:"14px 0 18px"}}>
//               <div style={{fontWeight:600,color:"#193648",fontSize:"0.8rem",marginBottom:7}}>📋 Attendees (auto-included)</div>
//               <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
//                 {meeting.boardMembers.map((m,i)=>(<span key={i} style={{background:"white",border:"1px solid #cbd5e1",borderRadius:20,padding:"3px 10px",fontSize:"0.74rem",color:"#334155",display:"flex",alignItems:"center",gap:5}}><Avatar name={m.name} image={m.image} size={18}/>{m.name}</span>))}
//               </div>
//             </div>
//             <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
//               <button onClick={onClose} style={{padding:"9px 20px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"white",color:"#64748b",fontWeight:500,cursor:"pointer",fontSize:"0.86rem"}}>Cancel</button>
//               <motion.button whileHover={chars>=30?{scale:1.03}:{}} whileTap={chars>=30?{scale:0.97}:{}} onClick={sendToAI} disabled={chars<30}
//                 style={{padding:"9px 22px",borderRadius:10,border:"none",background:chars>=30?"linear-gradient(120deg,#193648,#2d6a9f)":"#e2e8f0",color:chars>=30?"white":"#94a3b8",fontWeight:600,cursor:chars>=30?"pointer":"not-allowed",display:"flex",alignItems:"center",gap:8,fontSize:"0.86rem"}}>
//                 <Sparkles size={15}/> Send to AI <ChevronRight size={13}/>
//               </motion.button>
//             </div>
//           </>)}

//           {phase==="processing"&&(
//             <div style={{textAlign:"center",padding:"46px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:18}}>
//               <div style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,#193648,#3a70b0)",display:"flex",alignItems:"center",justifyContent:"center"}}><Bot size={32} color="white"/></div>
//               <div><div style={{fontWeight:700,fontSize:"1.1rem",color:"#193648",marginBottom:5}}>AI is processing your notes…</div><div style={{color:"#64748b",fontSize:"0.86rem"}}>Structuring decisions & action items</div></div>
//               <div style={{display:"flex",gap:7}}>
//                 {["Analysing notes","Extracting decisions","Structuring output"].map((label,i)=>(
//                   <motion.div key={i} animate={{opacity:[0.4,1,0.4]}} transition={{repeat:Infinity,duration:1.8,delay:i*0.6}}
//                     style={{background:"#f1f5f9",borderRadius:20,padding:"4px 11px",fontSize:"0.73rem",color:"#475569",display:"flex",alignItems:"center",gap:4}}>
//                     <Loader size={10}/>{label}
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {phase==="edit"&&editData&&(<>
//             <div style={{background:"linear-gradient(120deg,#eff6ff,#dbeafe)",border:"1px solid #93c5fd",borderRadius:12,padding:"12px 16px",marginBottom:20,display:"flex",gap:10,alignItems:"center"}}>
//               <span style={{fontSize:"1.1rem"}}>✏️</span>
//               <div><div style={{fontWeight:700,color:"#1e40af",fontSize:"0.88rem"}}>AI generated your minutes — edit anything before saving</div><div style={{color:"#3b82f6",fontSize:"0.76rem",marginTop:1}}>All fields are fully editable.</div></div>
//             </div>

//             <div style={{marginBottom:18}}>
//               <div style={sectionLabel}>📌 Meeting Title</div>
//               <input value={editData.meetingTitle||""} onChange={e=>uf("meetingTitle",e.target.value)} style={editInput} onFocus={onFocus} onBlur={onBlur}/>
//             </div>
//             <div style={{marginBottom:18}}>
//               <div style={sectionLabel}>📝 Executive Summary</div>
//               <textarea value={editData.summary||""} onChange={e=>uf("summary",e.target.value)} style={{...editTextarea,minHeight:72}} onFocus={onFocus} onBlur={onBlur}/>
//             </div>
//             <div style={{marginBottom:18}}>
//               <div style={sectionLabel}>✅ Key Decisions <button style={addBtnStyle} onClick={()=>setEditData(p=>({...p,keyDecisions:[...p.keyDecisions,{id:Date.now(),decision:"",rationale:""}]}))}>+ Add</button></div>
//               {editData.keyDecisions.map((d,idx)=>(
//                 <div key={d.id} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
//                   <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
//                     <span style={{minWidth:22,height:22,borderRadius:"50%",background:"#193648",color:"white",fontSize:"0.68rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{idx+1}</span>
//                     <div style={{flex:1}}>
//                       <input value={d.decision} onChange={e=>ud(d.id,"decision",e.target.value)} placeholder="Decision…" style={{...editInput,marginBottom:6,fontWeight:600}} onFocus={onFocus} onBlur={onBlur}/>
//                       <input value={d.rationale||""} onChange={e=>ud(d.id,"rationale",e.target.value)} placeholder="Rationale…" style={{...editInput,fontSize:"0.78rem",color:"#64748b"}} onFocus={onFocus} onBlur={onBlur}/>
//                     </div>
//                     <button style={remBtnStyle} onClick={()=>setEditData(p=>({...p,keyDecisions:p.keyDecisions.filter(x=>x.id!==d.id)}))}>✕</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div style={{marginBottom:18}}>
//               <div style={sectionLabel}>🎯 Action Items <button style={addBtnStyle} onClick={()=>setEditData(p=>({...p,actionItems:[...p.actionItems,{id:Date.now(),task:"",responsible:"",deadline:"",priority:"Medium"}]}))}>+ Add</button></div>
//               {editData.actionItems.map((a,idx)=>(
//                 <div key={a.id} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
//                   <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
//                     <span style={{minWidth:22,height:22,borderRadius:"50%",background:"#3a70b0",color:"white",fontSize:"0.68rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{idx+1}</span>
//                     <div style={{flex:1}}>
//                       <input value={a.task} onChange={e=>ua(a.id,"task",e.target.value)} placeholder="Task…" style={{...editInput,marginBottom:6,fontWeight:600}} onFocus={onFocus} onBlur={onBlur}/>
//                       <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8}}>
//                         <input value={a.responsible||""} onChange={e=>ua(a.id,"responsible",e.target.value)} placeholder="👤 Responsible" style={editInput} onFocus={onFocus} onBlur={onBlur}/>
//                         <input value={a.deadline||""} onChange={e=>ua(a.id,"deadline",e.target.value)} placeholder="📅 Deadline" style={editInput} onFocus={onFocus} onBlur={onBlur}/>
//                         <select value={a.priority||"Medium"} onChange={e=>ua(a.id,"priority",e.target.value)} style={{...editInput,background:priC[a.priority]||"#fef3c7",color:priT[a.priority]||"#92400e",fontWeight:700,cursor:"pointer"}}>
//                           <option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
//                         </select>
//                       </div>
//                     </div>
//                     <button style={remBtnStyle} onClick={()=>setEditData(p=>({...p,actionItems:p.actionItems.filter(x=>x.id!==a.id)}))}>✕</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div style={{marginBottom:18}}>
//               <div style={sectionLabel}>💬 Discussion Points <button style={addBtnStyle} onClick={()=>setEditData(p=>({...p,discussionPoints:[...p.discussionPoints,""]}))}>+ Add</button></div>
//               {(editData.discussionPoints||[]).map((d,i)=>(
//                 <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
//                   <span style={{color:"#94a3b8",fontSize:"0.8rem",flexShrink:0}}>•</span>
//                   <input value={d} onChange={e=>udp(i,e.target.value)} placeholder="Discussion point…" style={{...editInput,flex:1}} onFocus={onFocus} onBlur={onBlur}/>
//                   <button style={remBtnStyle} onClick={()=>setEditData(p=>({...p,discussionPoints:p.discussionPoints.filter((_,idx)=>idx!==i)}))}>✕</button>
//                 </div>
//               ))}
//             </div>
//             <div style={{marginBottom:18}}>
//               <div style={sectionLabel}>🚀 Next Steps</div>
//               <textarea value={editData.nextSteps||""} onChange={e=>uf("nextSteps",e.target.value)} style={{...editTextarea,minHeight:56}} onFocus={onFocus} onBlur={onBlur}/>
//             </div>
//             <div style={{marginBottom:22}}>
//               <div style={sectionLabel}>📅 Next Meeting Note</div>
//               <input value={editData.nextMeetingNote||""} onChange={e=>uf("nextMeetingNote",e.target.value)} placeholder="e.g. In 4 weeks — follow up on action items" style={editInput} onFocus={onFocus} onBlur={onBlur}/>
//             </div>
//             <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap",paddingTop:14,borderTop:"1px solid #f1f5f9"}}>
//               <button onClick={()=>setPhase("write")} style={{padding:"9px 18px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"white",color:"#64748b",fontWeight:500,cursor:"pointer",fontSize:"0.84rem"}}>← Back</button>
//               <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
//                 <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={handleEmailPDF} disabled={isRegen||sendingEmail}
//                   style={{padding:"9px 16px",borderRadius:10,border:"none",background:"#0ea5e9",color:"white",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:"0.82rem",opacity:sendingEmail?0.7:1}}>
//                   {sendingEmail?<Loader size={13}/>:<Mail size={13}/>} Email PDF to All
//                 </motion.button>
//                 <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={handleSaveOnly} disabled={isRegen}
//                   style={{padding:"9px 18px",borderRadius:10,border:"none",background:"#10b981",color:"white",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:"0.82rem",opacity:isRegen?0.7:1}}>
//                   {isRegen?<Loader size={13}/>:<CheckCircle2 size={13}/>} Save & Close
//                 </motion.button>
//                 <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={handleDownloadSave} disabled={isRegen}
//                   style={{padding:"9px 20px",borderRadius:10,border:"none",background:"linear-gradient(120deg,#193648,#2d6a9f)",color:"white",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:"0.82rem",opacity:isRegen?0.7:1}}>
//                   {isRegen?<Loader size={13}/>:<Download size={13}/>} Download PDF & Save
//                 </motion.button>
//               </div>
//             </div>
//           </>)}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// /* ════════════════════════════════════════════
//    MAIN COMPONENT
// ════════════════════════════════════════════ */
// const AdvisoryMeeting = () => {
//   const [meetings,setMeetings]=useState([]);
//   const [activeTab,setActiveTab]=useState("create");
//   const [showInvite,setShowInvite]=useState(false);
//   const [lastMeeting,setLastMeeting]=useState(null);
//   const [notesModalFor,setNotesModalFor]=useState(null);
//   const [loading,setLoading]=useState(true);

//   /* Form state */
//   const [form,setForm]=useState({agenda:"",date:"",time:"",venue:""});
//   const [formErrors,setFormErrors]=useState({});

//   /* Board members state — fixed + customizable */
//   const [boardMembers,setBoardMembers]=useState(DEFAULT_BOARD);
//   const [addMember,setAddMember]=useState({name:"",role:"",email:"",org:""});
//   const [addMemberErrors,setAddMemberErrors]=useState({});
//   const [showAddMember,setShowAddMember]=useState(false);

//   /* File ref for member image upload */
//   const updateMemberImage=(id,img)=>setBoardMembers(p=>p.map(m=>m.id===id?{...m,image:img}:m));

//   useEffect(()=>{
//     (async()=>{
//       try{const r=await fetch(`${API_BASE}/all`);const d=await r.json();
//         if(d.success){
//           setMeetings(d.data.map(m=>({id:m.meetingId,_dbId:m._id,agenda:m.meetingTitle,date:m.date,time:m.time,venue:m.location,status:m.minutesData?"Completed":"Scheduled",boardMembers:DEFAULT_BOARD,minutesGenerated:!!m.minutesData,minutesData:m.minutesData||null,downloadUrl:null,pdfBytes:null})));
//         }
//       }catch(e){console.error(e);}finally{setLoading(false);}
//     })();
//   },[]);

//   /* Validate form */
//   const validateForm=()=>{
//     const e={};
//     if(isEmpty(form.agenda))e.agenda="Agenda is required";
//     if(isEmpty(form.date))e.date="Date is required";
//     else if(new Date(form.date)<new Date(new Date().toDateString()))e.date="Date cannot be in the past";
//     if(isEmpty(form.time))e.time="Time is required";
//     if(isEmpty(form.venue))e.venue="Venue is required";
//     setFormErrors(e);return Object.keys(e).length===0;
//   };

//   const validateAddMember=()=>{
//     const e={};
//     if(isEmpty(addMember.name))e.name="Name required";
//     if(isEmpty(addMember.role))e.role="Role required";
//     if(!isEmpty(addMember.email)&&!isEmail(addMember.email))e.email="Invalid email";
//     setAddMemberErrors(e);return Object.keys(e).length===0;
//   };

//   const handleAddMemberSubmit=()=>{
//     if(!validateAddMember())return;
//     setBoardMembers(p=>[...p,{id:"m"+Date.now(),name:addMember.name,role:addMember.role,email:addMember.email,org:addMember.org,isFixed:false,image:null}]);
//     setAddMember({name:"",role:"",email:"",org:""});setAddMemberErrors({});setShowAddMember(false);
//   };

//   const handleSchedule=async()=>{
//     if(!validateForm())return;
//     const id=String(Date.now());
//     const entry={id,agenda:form.agenda,date:form.date,time:form.time,venue:form.venue,status:"Scheduled",boardMembers,minutesGenerated:false,minutesData:null,downloadUrl:null,pdfBytes:null};
//     try{
//       const r=await fetch(API_BASE,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({meetingId:id,meetingTitle:form.agenda,date:form.date,time:form.time,location:form.venue,attendees:boardMembers.map(b=>b.name).join(", "),decisions:[],actionItems:[]})});
//       const d=await r.json();
//       if(d.data?._id)entry._dbId=d.data._id;
//     }catch(e){console.warn("Save error:",e);}
//     setMeetings(p=>[...p,entry]);
//     setLastMeeting(entry);
//     setForm({agenda:"",date:"",time:"",venue:""});
//     setShowInvite(true);
//   };

//   const handleMinutesGenerated=(meetingId,minutesData,downloadUrl,pdfBytes)=>{
//     setMeetings(p=>p.map(m=>m.id===meetingId?{...m,status:"Completed",minutesGenerated:true,minutesData,downloadUrl,pdfBytes}:m));
//   };

//   const downloadMinutes=(m)=>{if(!m.downloadUrl)return;const a=document.createElement("a");a.href=m.downloadUrl;a.download=`Minutes_${m.agenda.replace(/\s+/g,"_")}_${m.date}.pdf`;document.body.appendChild(a);a.click();document.body.removeChild(a);};

//   const inpSt={width:"100%",boxSizing:"border-box",padding:"10px 14px",border:"1.5px solid",borderRadius:10,fontSize:"0.88rem",fontFamily:"inherit",outline:"none",color:"#1e293b",background:"#fff",transition:"border-color 0.2s, box-shadow 0.2s"};
//   const errSt={color:"#ef4444",fontSize:"0.73rem",marginTop:4,display:"flex",alignItems:"center",gap:4};

//   return(
//     <div style={{padding:"32px 24px",minHeight:"100vh",background:"linear-gradient(135deg,#e8f0f8 0%,#f8fafc 60%,#eef5ff 100%)",fontFamily:"'Poppins','Segoe UI',sans-serif"}}>
//       <AnimatePresence>
//         {notesModalFor&&<NotesModal meeting={notesModalFor} onClose={()=>setNotesModalFor(null)} onGenerated={handleMinutesGenerated}/>}
//         {showInvite&&lastMeeting&&<InviteModal meeting={lastMeeting} onClose={()=>setShowInvite(false)} onSent={()=>{}}/>}
//       </AnimatePresence>

//       {/* ── Header ── */}
//       <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}
//         style={{background:"linear-gradient(120deg,#193648 0%,#1e4d78 50%,#2d6a9f 100%)",borderRadius:20,padding:"28px 40px",marginBottom:32,boxShadow:"0 16px 48px rgba(25,54,72,0.3)",position:"relative",overflow:"hidden"}}>
//         <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
//         <div style={{position:"absolute",bottom:-60,right:100,width:160,height:160,borderRadius:"50%",background:"rgba(96,179,240,0.08)"}}/>
//         <div style={{position:"relative"}}>
//           <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:8}}>
//             <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.15)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,0.2)"}}>
//               <CalendarDays size={24} color="white"/>
//             </div>
//             <div>
//               <h1 style={{margin:0,color:"white",fontSize:"1.6rem",fontWeight:800,letterSpacing:"-0.5px"}}>Advisory Board Meeting Management</h1>
//               <p style={{margin:0,color:"rgba(255,255,255,0.65)",fontSize:"0.88rem",marginTop:3}}>Schedule, invite, generate minutes & collaborate seamlessly</p>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* ── Stats ── */}
//       <div style={{display:"flex",gap:16,marginBottom:28,flexWrap:"wrap"}}>
//         {[{label:"Total Meetings",val:meetings.length,color:"#3a70b0",icon:<CalendarDays size={22} color="#3a70b0"/>},
//           {label:"Scheduled",val:meetings.filter(m=>m.status==="Scheduled").length,color:"#f59e0b",icon:<Clock size={22} color="#f59e0b"/>},
//           {label:"Completed with MoM",val:meetings.filter(m=>m.minutesGenerated).length,color:"#10b981",icon:<CheckCircle2 size={22} color="#10b981"/>}
//         ].map((s,i)=>(
//           <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
//             style={{background:"white",borderRadius:16,padding:"18px 24px",display:"flex",alignItems:"center",gap:14,flex:"1 1 160px",boxShadow:"0 4px 16px rgba(0,0,0,0.06)",border:`1px solid #edf1f7`,borderTop:`3px solid ${s.color}`}}>
//             {s.icon}
//             <div>
//               <div style={{fontSize:"1.7rem",fontWeight:800,color:"#193648",lineHeight:1}}>{s.val}</div>
//               <div style={{fontSize:"0.76rem",color:"#64748b",marginTop:3}}>{s.label}</div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* ── Tabs ── */}
//       <div style={{display:"flex",gap:12,marginBottom:28,background:"white",borderRadius:14,padding:6,width:"fit-content",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
//         {[{id:"create",label:"📅 Schedule Meeting"},{id:"records",label:"📘 Meeting Records"}].map(t=>(
//           <button key={t.id} onClick={()=>setActiveTab(t.id)}
//             style={{padding:"10px 24px",borderRadius:10,border:"none",background:activeTab===t.id?"#193648":"transparent",color:activeTab===t.id?"white":"#64748b",fontWeight:600,cursor:"pointer",fontSize:"0.9rem",transition:"all 0.2s",fontFamily:"inherit"}}>
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {/* ── Create tab ── */}
//       {activeTab==="create"&&(
//         <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}
//           style={{background:"white",borderRadius:20,padding:"36px 40px",maxWidth:960,boxShadow:"0 8px 32px rgba(0,0,0,0.08)",border:"1px solid #edf1f7"}}>
          
//           <div style={{marginBottom:28}}>
//             <h2 style={{margin:"0 0 4px",color:"#193648",fontSize:"1.15rem",fontWeight:700,display:"flex",alignItems:"center",gap:8}}><CalendarDays size={18}/> Meeting Details</h2>
//             <p style={{margin:0,color:"#94a3b8",fontSize:"0.82rem"}}>Fill in the meeting information. All fields are required.</p>
//           </div>

//           <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:28}}>
//             {[
//               {key:"agenda",label:"Agenda *",type:"text",placeholder:"e.g. University–Industry Collaboration"},
//               {key:"date",label:"Date *",type:"date"},
//               {key:"time",label:"Time *",type:"time"},
//               {key:"venue",label:"Venue / Meeting Link *",type:"text",placeholder:"e.g. Conference Room A or Zoom link"},
//             ].map(f=>(
//               <div key={f.key}>
//                 <label style={{fontSize:"0.83rem",fontWeight:600,color:"#193648",display:"block",marginBottom:6}}>{f.label}</label>
//                 <input type={f.type} value={form[f.key]} placeholder={f.placeholder||""}
//                   onChange={e=>{setForm(p=>({...p,[f.key]:e.target.value}));setFormErrors(p=>({...p,[f.key]:""}));}}
//                   style={{...inpSt,borderColor:formErrors[f.key]?"#ef4444":"#e2e8f0"}}
//                   onFocus={e=>{e.target.style.borderColor="#193648";e.target.style.boxShadow="0 0 0 3px rgba(25,54,72,0.1)";}}
//                   onBlur={e=>{e.target.style.borderColor=formErrors[f.key]?"#ef4444":"#e2e8f0";e.target.style.boxShadow="none";}}/>
//                 {formErrors[f.key]&&<div style={errSt}><AlertCircle size={12}/>{formErrors[f.key]}</div>}
//               </div>
//             ))}
//           </div>

//           {/* Board members section */}
//           <div style={{marginBottom:28}}>
//             <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
//               <h3 style={{margin:0,color:"#193648",fontSize:"1rem",fontWeight:700,display:"flex",alignItems:"center",gap:7}}><Users size={17}/> Board Members</h3>
//               <button onClick={()=>setShowAddMember(p=>!p)}
//                 style={{background:"#193648",color:"white",border:"none",borderRadius:9,padding:"7px 14px",fontSize:"0.78rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
//                 <UserPlus size={13}/> Add Member
//               </button>
//             </div>

//             <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
//               {boardMembers.map(m=>(
//                 <MemberCard key={m.id} member={m}
//                   removable={!m.isFixed}
//                   onRemove={()=>setBoardMembers(p=>p.filter(x=>x.id!==m.id))}
//                   onImageUpload={updateMemberImage}/>
//               ))}
//             </div>

//             {/* Add member form */}
//             <AnimatePresence>
//               {showAddMember&&(
//                 <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
//                   style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:14,padding:"18px 20px",marginTop:16,overflow:"hidden"}}>
//                   <div style={{fontWeight:700,color:"#193648",fontSize:"0.83rem",marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Plus size={13}/> New Board Member</div>
//                   <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
//                     {[{k:"name",pl:"Full Name *"},{k:"role",pl:"Role / Title *"},{k:"email",pl:"Email Address"},{k:"org",pl:"Organisation"}].map(f=>(
//                       <div key={f.k}>
//                         <input value={addMember[f.k]} onChange={e=>{setAddMember(p=>({...p,[f.k]:e.target.value}));setAddMemberErrors(p=>({...p,[f.k]:""}));}}
//                           placeholder={f.pl} style={{...inpSt,padding:"8px 12px",fontSize:"0.8rem",borderColor:addMemberErrors[f.k]?"#ef4444":"#e2e8f0"}}/>
//                         {addMemberErrors[f.k]&&<div style={errSt}><AlertCircle size={11}/>{addMemberErrors[f.k]}</div>}
//                       </div>
//                     ))}
//                   </div>
//                   <div style={{display:"flex",gap:8}}>
//                     <button onClick={handleAddMemberSubmit} style={{background:"#193648",color:"white",border:"none",borderRadius:8,padding:"8px 18px",fontSize:"0.8rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Plus size={12}/> Add</button>
//                     <button onClick={()=>setShowAddMember(false)} style={{background:"#f1f5f9",color:"#64748b",border:"none",borderRadius:8,padding:"8px 16px",fontSize:"0.8rem",cursor:"pointer"}}>Cancel</button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={handleSchedule}
//             style={{background:"linear-gradient(120deg,#193648,#2d6a9f)",color:"white",border:"none",borderRadius:12,padding:"13px 36px",fontWeight:700,fontSize:"0.95rem",cursor:"pointer",display:"flex",alignItems:"center",gap:9,boxShadow:"0 6px 20px rgba(25,54,72,0.3)",fontFamily:"inherit"}}>
//             <Send size={18}/> Schedule Meeting & Send Invites
//           </motion.button>
//         </motion.div>
//       )}

//       {/* ── Records tab ── */}
//       {activeTab==="records"&&(
//         <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}
//           style={{background:"white",borderRadius:20,padding:"30px",boxShadow:"0 8px 32px rgba(0,0,0,0.08)",border:"1px solid #edf1f7"}}>
//           <h2 style={{margin:"0 0 20px",color:"#193648",fontSize:"1.1rem",fontWeight:700,display:"flex",alignItems:"center",gap:8}}><FileText size={18}/> Meeting Records</h2>
//           {loading?(
//             <div style={{textAlign:"center",padding:"48px",color:"#64748b"}}>
//               <Loader size={32} style={{display:"block",margin:"0 auto 12px"}}/>
//               <p style={{margin:0}}>Loading meetings…</p>
//             </div>
//           ):meetings.length===0?(
//             <div style={{textAlign:"center",padding:"48px",color:"#94a3b8"}}>
//               <CalendarDays size={48} style={{display:"block",margin:"0 auto 12px",opacity:0.3}}/>
//               <p style={{margin:0,fontSize:"1rem",fontWeight:600}}>No meetings scheduled yet.</p>
//               <p style={{margin:"6px 0 0",fontSize:"0.84rem"}}>Go to Schedule Meeting to create your first one!</p>
//             </div>
//           ):(
//             <div style={{overflowX:"auto"}}>
//               <table style={{width:"100%",borderCollapse:"collapse",textAlign:"left"}}>
//                 <thead>
//                   <tr style={{background:"#f8fafc"}}>
//                     {["Agenda","Date","Time","Venue","Status","Write & Generate MoM","Download"].map(h=>(
//                       <th key={h} style={{padding:"12px 14px",fontSize:"0.78rem",fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.5px",borderBottom:"2px solid #e2e8f0",whiteSpace:"nowrap"}}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {meetings.map((m,i)=>(
//                     <motion.tr key={m.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
//                       style={{borderBottom:"1px solid #f1f5f9",transition:"background 0.15s"}}
//                       onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
//                       <td style={{padding:"14px",fontWeight:600,color:"#193648",fontSize:"0.88rem",maxWidth:200}}>
//                         <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.agenda}</div>
//                       </td>
//                       <td style={{padding:"14px",color:"#475569",fontSize:"0.84rem",whiteSpace:"nowrap"}}>{m.date}</td>
//                       <td style={{padding:"14px",color:"#475569",fontSize:"0.84rem",whiteSpace:"nowrap"}}>{m.time}</td>
//                       <td style={{padding:"14px",color:"#64748b",fontSize:"0.82rem",maxWidth:160}}>
//                         <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.venue}</div>
//                       </td>
//                       <td style={{padding:"14px"}}>
//                         {m.status==="Scheduled"
//                           ?<span style={{display:"inline-flex",alignItems:"center",gap:5,background:"#fef3c7",color:"#92400e",padding:"4px 10px",borderRadius:20,fontSize:"0.76rem",fontWeight:700,whiteSpace:"nowrap"}}><Clock size={12}/> Scheduled</span>
//                           :<span style={{display:"inline-flex",alignItems:"center",gap:5,background:"#d1fae5",color:"#065f46",padding:"4px 10px",borderRadius:20,fontSize:"0.76rem",fontWeight:700,whiteSpace:"nowrap"}}><CheckCircle2 size={12}/> Completed</span>}
//                       </td>
//                       <td style={{padding:"14px"}}>
//                         {m.minutesGenerated
//                           ?<span style={{color:"#059669",fontWeight:700,fontSize:"0.78rem",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}><CheckCircle2 size={13}/> Generated</span>
//                           :<motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>setNotesModalFor(m)}
//                               style={{background:"linear-gradient(120deg,#193648,#2d6a9f)",color:"white",border:"none",borderRadius:9,padding:"7px 14px",cursor:"pointer",fontWeight:600,fontSize:"0.77rem",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",fontFamily:"inherit"}}>
//                               <Sparkles size={13}/> Write Notes
//                             </motion.button>}
//                       </td>
//                       <td style={{padding:"14px"}}>
//                         {m.minutesGenerated
//                           ?<motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>downloadMinutes(m)}
//                               style={{background:"#10b981",color:"white",border:"none",borderRadius:9,padding:"7px 14px",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:"0.77rem",fontFamily:"inherit",whiteSpace:"nowrap"}}>
//                               <Download size={13}/> Download
//                             </motion.button>
//                           :<span style={{display:"flex",alignItems:"center",gap:5,color:"#cbd5e1",fontSize:"0.78rem",whiteSpace:"nowrap"}}><FileCheck size={13}/> Not yet</span>}
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default AdvisoryMeeting;
























// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";


// import {
//   CalendarDays, Users, FileText, CheckCircle2, Clock, Send, Mail,
//   Download, FileCheck, Loader, Sparkles, PenLine, X, ChevronRight,
//   Bot, ClipboardList, AlertCircle, Plus, Trash2, UserPlus, Camera,
//   Bell, CheckCheck, MailCheck, Eye, EyeOff, Search, Award, Globe,
//   Briefcase, Star, TrendingUp, Shield, Zap, ChevronDown, Menu
// } from "lucide-react";

// const API_BASE = "http://localhost:5000/api/meeting-minutes";
// const EMAIL_BASE = "http://localhost:5000/api/email";

// /* ─── Professional avatar images using UI Avatars ─── */
// const getProfessionalAvatar = (name, role) => {
//   const colors = {
//     "Dean": "1a237e",
//     "Head": "1b5e20",
//     "Industry": "4a148c",
//     "default": "0d47a1"
//   };
//   const key = Object.keys(colors).find(k => role?.includes(k)) || "default";
//   const bg = colors[key];
//   return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=ffffff&size=200&bold=true&font-size=0.4`;
// };

// const AVATAR_COLORS = [
//   ["#0a1628","#4f9cf9"],["#0d2818","#4ade80"],["#2d1b69","#a78bfa"],
//   ["#7c2d12","#fb923c"],["#0c2340","#60a5fa"],["#451a03","#fcd34d"],
// ];
// const getAvatarColor = (name) => {
//   let hash = 0;
//   for (let c of (name||"")) hash = c.charCodeAt(0) + ((hash<<5)-hash);
//   return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
// };

// const Avatar = ({ name, image, size=38 }) => {
//   const [bg,fg] = getAvatarColor(name);
//   const initials = (name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
//   const [imgError, setImgError] = useState(false);
//   const src = image || getProfessionalAvatar(name, "");
  
//   return (
//     <div style={{width:size,height:size,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:size*0.36,fontWeight:700,color:fg,overflow:"hidden",boxShadow:`0 0 0 2px ${fg}44`}}>
//       {!imgError ? (
//         <img src={src} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={()=>setImgError(true)} />
//       ) : initials}
//     </div>
//   );
// };

// /* ─── Default board members with professional photos ─── */
// const DEFAULT_BOARD = [
//   { 
//     id:"bm1", name:"Dr. Ahmad Raza", role:"Dean / Chairperson", 
//     email:"sabahatqadeerbhati@gmail.com", isFixed:true,
//     image:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
//     badge:"👨‍💼"
//   },
//   { 
//     id:"bm2", name:"Prof. Sara Malik", role:"Head of Department", 
//     email:"amnajamil445@gmail.com", isFixed:true,
//     image:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
//     badge:"👩‍🏫"
//   },
//   { 
//     id:"bm3", name:"Mr. Bilal Hashmi", role:"Industry Liaison Officer", 
//     email:"sabahatqadeerbhati@gmail.com", isFixed:true,
//     image:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
//     badge:"🤝"
//   },
// ];

// const SUGGESTED_REPS = [
//   { id:"sr1", name:"Ali Khan", org:"ABC Tech", role:"Industry Partner", email:"sabahatqadeerbhati@gmail.com",
//     image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
//   { id:"sr2", name:"Sara Ahmed", org:"Innovate Labs", role:"Industry Expert", email:"amnajamil445@gmail.com",
//     image:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face" },
//   { id:"sr3", name:"Bilal Rehman", org:"FutureVision Ltd", role:"Technology Advisor", email:"sabahatqadeerbhati@gmail.com",
//     image:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" },
//   { id:"sr4", name:"Ayesha Noor", org:"TechSphere", role:"Product Strategist", email:"amnajamil445@gmail.com",
//     image:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
//   { id:"sr5", name:"Omar Siddiqui", org:"DataNest", role:"Data Scientist", email:"sabahatqadeerbhati@gmail.com",
//     image:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face" },
// ];

// const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
// const isEmpty = (v) => !v || !String(v).trim();

// const callClaudeForMinutes = async (roughNotes, meetingMeta) => {
//   const systemPrompt = `You are a professional meeting secretary. Always respond with ONLY valid JSON — no markdown, no backticks, no preamble. Schema: {"meetingTitle":"string","summary":"string","keyDecisions":[{"id":1,"decision":"string","rationale":"string"}],"actionItems":[{"id":1,"task":"string","responsible":"string","deadline":"string","priority":"High|Medium|Low"}],"discussionPoints":["string"],"nextSteps":"string","nextMeetingNote":"string"}`;
//   const userPrompt = `Meeting Details:\n- Agenda: ${meetingMeta.agenda}\n- Date: ${meetingMeta.date}\n- Time: ${meetingMeta.time}\n- Venue: ${meetingMeta.venue}\n- Attendees: ${meetingMeta.boardMembers.map(b=>`${b.name} (${b.role})`).join(", ")}\n\nRough Notes:\n${roughNotes}\n\nReturn ONLY JSON.`;
//   const resp = await fetch("http://localhost:5000/api/generate-minutes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({systemPrompt,userPrompt})});
//   const raw = await resp.text();
//   if(!resp.ok) throw new Error(`Server ${resp.status}`);
//   const data = JSON.parse(raw);
//   const content = data.content;
//   if(!content) throw new Error("Empty AI response");
//   if(typeof content==="object") return content;
//   const cleaned = content.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
//   try { return JSON.parse(cleaned); } catch { const m=cleaned.match(/\{[\s\S]*\}/); if(m) return JSON.parse(m[0]); throw new Error("Invalid JSON"); }
// };

// const sanitize = (t) => (t==null?"":String(t).replace(/[\u2013\u2014]/g,"-").replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"').replace(/\u2022/g,"-").replace(/\u2026/g,"...").replace(/\u00A0/g," ").replace(/[^\x00-\xFF]/g,"?"));

// const createMinutesPDF = async (minutesData, meetingMeta) => {
//   const { PDFDocument, rgb, StandardFonts } = await import("https://cdn.jsdelivr.net/esm/pdf-lib@1.17.1");
//   const doc=await PDFDocument.create();
//   const regular=await doc.embedFont(StandardFonts.Helvetica);
//   const bold=await doc.embedFont(StandardFonts.HelveticaBold);
//   const italic=await doc.embedFont(StandardFonts.HelveticaOblique);
//   const navy=rgb(0.06,0.16,0.28),navyDk=rgb(0.04,0.10,0.20),blue=rgb(0.16,0.50,0.73),blueLt=rgb(0.84,0.92,0.97),green=rgb(0.15,0.68,0.38),greenLt=rgb(0.83,0.94,0.87),amber=rgb(0.95,0.61,0.07),amberLt=rgb(0.99,0.95,0.83),red=rgb(0.75,0.22,0.17),redLt=rgb(0.98,0.86,0.85),white=rgb(1,1,1),offWh=rgb(0.97,0.975,0.982),black=rgb(0.12,0.12,0.14),gray=rgb(0.44,0.47,0.51),grayMd=rgb(0.72,0.74,0.77),grayLt=rgb(0.91,0.92,0.94),div=rgb(0.87,0.89,0.92);
//   const W=612,H=792,ML=50,MB=52,CW=W-ML*2;
//   let page,y;
//   const wrap=(text,maxW,size)=>{const cpp=Math.max(1,Math.floor(maxW/(size*0.545)));const words=sanitize(text).split(" ");let line="",out=[];for(const w of words){const t=line?line+" "+w:w;if(t.length>cpp&&line){out.push(line);line=w;}else line=t;}if(line)out.push(line);return out;};
//   const T=(text,opts={})=>{const{x=ML,size=10,font=regular,color=black,maxW=CW,lh=1.55,dx=0}=opts;const lines=wrap(text,maxW-dx,size);for(const l of lines){if(y-size-2<MB){footerOn();addPage();headerOn();}page.drawText(l,{x:x+dx,y:y-size,font,size,color});y-=size*lh;}};
//   const addPage=()=>{page=doc.addPage([W,H]);y=H-50;};
//   const headerOn=()=>{page.drawRectangle({x:0,y:H-32,width:W,height:32,color:navyDk});page.drawRectangle({x:0,y:H-32,width:5,height:32,color:blue});page.drawText("ADVISORY BOARD MEETING MINUTES",{x:ML+4,y:H-21,font:bold,size:8,color:rgb(0.65,0.76,0.87)});page.drawText("CollaXion",{x:W-ML-44,y:H-21,font:bold,size:9,color:blue});y=H-46;};
//   const footerOn=()=>{page.drawLine({start:{x:ML,y:MB-6},end:{x:W-ML,y:MB-6},thickness:0.5,color:grayLt});page.drawText("CollaXion — Confidential Advisory Board Record",{x:ML,y:MB-18,font:italic,size:7,color:grayMd});};
//   const need=(h)=>{if(y-h<MB+10){footerOn();addPage();headerOn();}};
//   const heading=(title)=>{need(36);page.drawRectangle({x:ML,y:y-28,width:5,height:28,color:blue});page.drawRectangle({x:ML+5,y:y-28,width:CW-5,height:28,color:offWh});page.drawText(sanitize(title).toUpperCase(),{x:ML+14,y:y-18,font:bold,size:9.5,color:navy});y-=36;};
//   const pill=(label,px,py)=>{const map={High:[redLt,red],Medium:[amberLt,amber],Low:[greenLt,green]};const[bg,fg]=map[label]||map.Medium;const pw=label.length*5.6+14;page.drawRectangle({x:px,y:py-10,width:pw,height:12,color:bg});page.drawText(sanitize(label),{x:px+7,y:py-7,font:bold,size:7.5,color:fg});};
//   addPage();
//   const COVER_H=210;
//   page.drawRectangle({x:0,y:H-COVER_H,width:W,height:COVER_H,color:navyDk});
//   page.drawRectangle({x:W-10,y:H-COVER_H,width:10,height:COVER_H,color:blue});
//   page.drawRectangle({x:0,y:H-30,width:W-10,height:30,color:navy});
//   page.drawText("OFFICIAL DOCUMENT  |  ADVISORY BOARD",{x:ML,y:H-20,font:bold,size:7,color:rgb(0.5,0.66,0.82)});
//   page.drawText(sanitize(new Date().toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})),{x:W-ML-200,y:H-20,font:regular,size:7,color:rgb(0.5,0.66,0.82)});
//   page.drawLine({start:{x:ML,y:H-32},end:{x:W-20,y:H-32},thickness:0.4,color:rgb(0.22,0.35,0.50)});
//   page.drawText("CollaXion",{x:ML,y:H-62,font:bold,size:24,color:blue});
//   page.drawText("Advisory Board",{x:ML,y:H-85,font:regular,size:12,color:rgb(0.72,0.82,0.91)});
//   page.drawText("Meeting Minutes",{x:ML,y:H-108,font:bold,size:30,color:white});
//   page.drawLine({start:{x:ML,y:H-122},end:{x:W-22,y:H-122},thickness:0.5,color:rgb(0.22,0.35,0.50)});
//   const mtLines=wrap(minutesData.meetingTitle||meetingMeta.agenda||"Advisory Board Meeting",CW-20,11.5);
//   let mtY=H-140;
//   for(const ln of mtLines.slice(0,3)){page.drawText(sanitize(ln),{x:ML,y:mtY,font:bold,size:11.5,color:rgb(0.83,0.90,0.96)});mtY-=17;}
//   const cardTop=H-COVER_H-16,cardH=46,cardW=(CW-12)/3;
//   [{label:"DATE",val:meetingMeta.date||"—"},{label:"TIME",val:meetingMeta.time||"—"},{label:"VENUE",val:meetingMeta.venue||"—"}].forEach((c,i)=>{const cx=ML+i*(cardW+6);page.drawRectangle({x:cx+1,y:cardTop-cardH-1,width:cardW,height:cardH,color:grayLt});page.drawRectangle({x:cx,y:cardTop-cardH,width:cardW,height:cardH,color:white});page.drawRectangle({x:cx,y:cardTop-3,width:cardW,height:3,color:blue});page.drawText(c.label,{x:cx+8,y:cardTop-13,font:bold,size:7,color:blue});const vw=wrap(sanitize(c.val),cardW-16,10);vw.slice(0,2).forEach((vl,vi)=>{page.drawText(vl,{x:cx+8,y:cardTop-26-vi*13,font:bold,size:10,color:navy});});});
//   y=cardTop-cardH-22;
//   if(minutesData.summary){need(50);y-=6;heading("Executive Summary");const sumLines=wrap(minutesData.summary,CW-18,9.5);const boxH=sumLines.length*14+16;need(boxH+8);page.drawRectangle({x:ML,y:y-boxH,width:4,height:boxH,color:blue});page.drawRectangle({x:ML+4,y:y-boxH,width:CW-4,height:boxH,color:rgb(0.96,0.97,0.99)});y-=10;T(minutesData.summary,{font:italic,size:9.5,color:gray,dx:14});y-=6;}
//   y-=4;heading("Attendees");
//   const half=CW/2;
//   meetingMeta.boardMembers.forEach((m,i)=>{const col=i%2,ax=ML+col*half;if(col===0)need(30);page.drawCircle({x:ax+7,y:y-8,size:3.5,color:blue});page.drawText(sanitize(m.name),{x:ax+18,y:y-11,font:bold,size:9.5,color:navy});page.drawText(sanitize(m.role),{x:ax+18,y:y-22,font:regular,size:8,color:gray});if(col===1||i===meetingMeta.boardMembers.length-1)y-=30;});
//   y-=8;
//   if((minutesData.keyDecisions||[]).length>0){y-=4;heading("Key Decisions");(minutesData.keyDecisions||[]).forEach((d,i)=>{need(48);page.drawRectangle({x:ML,y:y-22,width:22,height:22,color:navy});page.drawText(String(i+1),{x:ML+(i>=9?5:7),y:y-15,font:bold,size:9,color:white});T(sanitize(d.decision),{font:bold,size:9.5,color:black,dx:30});if(d.rationale)T("Rationale: "+sanitize(d.rationale),{font:italic,size:8.5,color:gray,dx:30});page.drawLine({start:{x:ML+28,y:y},end:{x:W-ML,y:y},thickness:0.35,color:div});y-=8;});y-=4;}
//   if((minutesData.actionItems||[]).length>0){y-=4;heading("Action Items");need(22);page.drawRectangle({x:ML,y:y-20,width:CW,height:20,color:navy});const COL={num:ML+6,task:ML+22,resp:ML+240,dl:ML+360,pri:ML+458};[["#",COL.num],["Task",COL.task],["Responsible",COL.resp],["Deadline",COL.dl],["Priority",COL.pri]].forEach(([lbl,lx])=>{page.drawText(lbl,{x:lx,y:y-13,font:bold,size:8,color:white});});y-=20;(minutesData.actionItems||[]).forEach((a,i)=>{need(32);const rH=30,bg=i%2===0?white:offWh;page.drawRectangle({x:ML,y:y-rH,width:CW,height:rH,color:bg});page.drawRectangle({x:ML,y:y-rH,width:4,height:rH,color:blueLt});page.drawLine({start:{x:ML,y:y-rH},end:{x:W-ML,y:y-rH},thickness:0.3,color:div});page.drawText(String(i+1),{x:COL.num,y:y-18,font:bold,size:8,color:gray});const tLines=wrap(sanitize(a.task),210,8.5);tLines.slice(0,2).forEach((tl,ti)=>{page.drawText(tl,{x:COL.task,y:y-11-ti*11,font:bold,size:8.5,color:black});});const rLines=wrap(sanitize(a.responsible||"TBD"),110,8);rLines.slice(0,2).forEach((rl,ri)=>{page.drawText(rl,{x:COL.resp,y:y-11-ri*10,font:regular,size:8,color:navy});});page.drawText(sanitize(a.deadline||"TBD"),{x:COL.dl,y:y-14,font:regular,size:8,color:gray});pill(a.priority||"Medium",COL.pri,y-10);y-=rH;});y-=10;}
//   if((minutesData.discussionPoints||[]).length>0){y-=4;heading("Points of Discussion");(minutesData.discussionPoints||[]).forEach((pt)=>{need(22);page.drawRectangle({x:ML,y:y-8,width:5,height:5,color:blue});T(sanitize(pt),{size:9.5,color:black,dx:14});y-=3;});y-=4;}
//   if(minutesData.nextSteps){y-=4;heading("Next Steps");T(sanitize(minutesData.nextSteps),{size:9.5,color:black});y-=6;}
//   if(minutesData.nextMeetingNote){need(50);y-=6;const nmLines=wrap(sanitize(minutesData.nextMeetingNote),CW-26,9.5);const nmH=nmLines.length*14+20;page.drawRectangle({x:ML,y:y-nmH,width:CW,height:nmH,color:blueLt});page.drawRectangle({x:ML,y:y-nmH,width:5,height:nmH,color:blue});page.drawText("NEXT MEETING",{x:ML+14,y:y-13,font:bold,size:7.5,color:blue});y-=18;T(sanitize(minutesData.nextMeetingNote),{font:regular,size:9.5,color:navy,dx:14});y-=10;}
//   need(75);y-=12;page.drawLine({start:{x:ML,y},end:{x:W-ML,y},thickness:0.5,color:grayLt});y-=24;
//   ["Chairperson","Secretary / Recorder","Date Approved"].forEach((lbl,i)=>{const sx=ML+i*(CW/3);page.drawLine({start:{x:sx,y:y-18},end:{x:sx+CW/3-18,y:y-18},thickness:0.7,color:grayMd});page.drawText(lbl,{x:sx,y:y-30,font:regular,size:7.5,color:gray});});
//   footerOn();
//   const totalPages=doc.getPageCount();
//   for(let pi=0;pi<totalPages;pi++){const pg=doc.getPage(pi);pg.drawRectangle({x:W-ML-50,y:MB-22,width:52,height:12,color:white});pg.drawText(`Page ${pi+1} of ${totalPages}`,{x:W-ML-50,y:MB-18,font:bold,size:7,color:grayMd});}
//   const bytes=await doc.save();
//   return { url:URL.createObjectURL(new Blob([bytes],{type:"application/pdf"})), bytes };
// };

// /* ═══ MEMBER CARD ═══ */
// const MemberCard = ({ member, removable, onRemove, onImageUpload, compact=false }) => {
//   const fileRef = useRef();
//   const [hovered, setHovered] = useState(false);
//   return (
//     <motion.div
//       whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(14,30,60,0.18)" }}
//       transition={{ duration: 0.25, ease: "easeOut" }}
//       onHoverStart={() => setHovered(true)}
//       onHoverEnd={() => setHovered(false)}
//       style={{
//         background: hovered
//           ? "linear-gradient(135deg,#0f2744 0%,#1a3a5c 100%)"
//           : "linear-gradient(135deg,#ffffff 0%,#f7f9fc 100%)",
//         border: hovered ? "1px solid #3a70b0" : "1px solid #e8edf4",
//         borderRadius: 16, padding: compact ? "14px 16px" : "18px 20px",
//         display: "flex", alignItems: "center", gap: 14,
//         position: "relative", cursor: "default", transition: "all 0.25s ease"
//       }}
//     >
//       <div style={{ position: "relative", flexShrink: 0 }}>
//         <div style={{
//           width: compact ? 42 : 52, height: compact ? 42 : 52,
//           borderRadius: "50%", overflow: "hidden",
//           boxShadow: hovered ? "0 0 0 3px #4f9cf9" : "0 0 0 2px #dde3ec",
//           transition: "box-shadow 0.25s"
//         }}>
//           <Avatar name={member.name} image={member.image} size={compact ? 42 : 52} />
//         </div>
//         {onImageUpload && (
//           <motion.button
//             whileHover={{ scale: 1.2 }}
//             onClick={() => fileRef.current?.click()}
//             style={{
//               position: "absolute", bottom: -2, right: -2,
//               width: 20, height: 20, borderRadius: "50%",
//               background: "#4f9cf9", border: "2px solid white",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               cursor: "pointer", boxShadow: "0 2px 8px rgba(79,156,249,0.5)"
//             }}
//           >
//             <Camera size={9} color="white" />
//           </motion.button>
//         )}
//         <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
//           const f = e.target.files?.[0]; if (!f) return;
//           const reader = new FileReader();
//           reader.onload = ev => onImageUpload && onImageUpload(member.id, ev.target.result);
//           reader.readAsDataURL(f);
//         }} />
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{
//           fontWeight: 700, fontSize: compact ? "0.84rem" : "0.92rem",
//           color: hovered ? "#e8f0fb" : "#0f2240",
//           whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
//           transition: "color 0.25s", fontFamily: "'Playfair Display', Georgia, serif"
//         }}>{member.name}</div>
//         <div style={{
//           color: hovered ? "#7db3e8" : "#64748b",
//           fontSize: "0.74rem", marginTop: 2,
//           whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
//           transition: "color 0.25s"
//         }}>{member.role}{member.org ? ` · ${member.org}` : ""}</div>
//         {member.email && (
//           <div style={{
//             color: hovered ? "#4f9cf9" : "#94a3b8",
//             fontSize: "0.68rem", marginTop: 2,
//             whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
//             transition: "color 0.25s"
//           }}>{member.email}</div>
//         )}
//       </div>
//       {member.isFixed && (
//         <div style={{
//           background: hovered ? "rgba(79,156,249,0.2)" : "#eef4ff",
//           borderRadius: 6, padding: "2px 7px",
//           fontSize: "0.65rem", fontWeight: 700,
//           color: hovered ? "#7db3e8" : "#3a70b0",
//           transition: "all 0.25s"
//         }}>CORE</div>
//       )}
//       {removable && (
//         <motion.button
//           whileHover={{ scale: 1.15, background: "#fca5a5" }}
//           onClick={onRemove}
//           style={{
//             background: "#fee2e2", border: "none", borderRadius: "8px",
//             width: 28, height: 28, display: "flex", alignItems: "center",
//             justifyContent: "center", cursor: "pointer", flexShrink: 0
//           }}
//         >
//           <Trash2 size={12} color="#ef4444" />
//         </motion.button>
//       )}
//     </motion.div>
//   );
// };

// /* ═══ INVITE MODAL ═══ */
// const InviteModal = ({ meeting, onClose, onSent }) => {
//   const [selected, setSelected] = useState([]);
//   const [custom, setCustom] = useState([]);
//   const [newName, setNewName] = useState(""); const [newEmail, setNewEmail] = useState("");
//   const [newOrg, setNewOrg] = useState(""); const [newRole, setNewRole] = useState("");
//   const [errors, setErrors] = useState({});
//   const [sending, setSending] = useState(false);
//   const [sent, setSent] = useState(false);
//   const [searchQ, setSearchQ] = useState("");

//   const toggle = (rep) => setSelected(p => p.find(r => r.id === rep.id) ? p.filter(r => r.id !== rep.id) : [...p, rep]);
//   const isSelected = (rep) => !!selected.find(r => r.id === rep.id);

//   const validateAdd = () => {
//     const e = {};
//     if (isEmpty(newName)) e.name = "Name required";
//     if (isEmpty(newEmail)) e.email = "Email required";
//     else if (!isEmail(newEmail)) e.email = "Invalid email";
//     setErrors(e); return Object.keys(e).length === 0;
//   };
//   const addCustom = () => {
//     if (!validateAdd()) return;
//     const rep = { id: "c" + Date.now(), name: newName, email: newEmail, org: newOrg || "—", role: newRole || "Guest", image: null, isCustom: true };
//     setCustom(p => [...p, rep]); setSelected(p => [...p, rep]);
//     setNewName(""); setNewEmail(""); setNewOrg(""); setNewRole(""); setErrors({});
//   };

//   const filtered = SUGGESTED_REPS.filter(r =>
//     r.name.toLowerCase().includes(searchQ.toLowerCase()) ||
//     r.org.toLowerCase().includes(searchQ.toLowerCase())
//   );

//   const sendAll = async () => {
//     if (selected.length === 0) { alert("Select at least one person."); return; }
//     setSending(true);
//     const results = await Promise.all(selected.map(async rep => {
//       try {
//         const r = await fetch(`${EMAIL_BASE}/send-invitation`, {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ to: rep.email, name: rep.name, agenda: meeting.agenda, date: meeting.date, time: meeting.time, venue: meeting.venue, meetingId: meeting.id })
//         });
//         const d = await r.json();
//         return { ...rep, ok: d.success };
//       } catch (e) { return { ...rep, ok: false }; }
//     }));
//     setSending(false); setSent(true);
//     onSent(results);
//   };

//   const inpStyle = {
//     width: "100%", boxSizing: "border-box", padding: "10px 14px",
//     border: "1.5px solid #dde3ec", borderRadius: "10px",
//     fontSize: "0.83rem", fontFamily: "inherit", outline: "none",
//     color: "#0f2240", background: "#f8fbff", transition: "all 0.2s"
//   };

//   return (
//     <div style={{
//       position: "fixed", inset: 0,
//       background: "rgba(5,15,35,0.75)", backdropFilter: "blur(8px)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       zIndex: 1000, padding: "20px"
//     }}>
//       <motion.div
//         initial={{ scale: 0.88, opacity: 0, y: 30 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.88, opacity: 0, y: 20 }}
//         transition={{ type: "spring", damping: 22, stiffness: 280 }}
//         style={{
//           background: "#ffffff", borderRadius: 24,
//           width: 780, maxWidth: "100%", maxHeight: "90vh",
//           overflowY: "auto", boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
//           border: "1px solid #dde3ec"
//         }}
//       >
//         {/* Header */}
//         <div style={{
//           background: "linear-gradient(130deg,#050f23 0%,#0f2744 50%,#1a4570 100%)",
//           padding: "24px 30px", borderRadius: "24px 24px 0 0",
//           display: "flex", alignItems: "center", gap: 14,
//           position: "sticky", top: 0, zIndex: 10
//         }}>
//           <div style={{
//             width: 46, height: 46, borderRadius: 14,
//             background: "rgba(79,156,249,0.2)",
//             border: "1px solid rgba(79,156,249,0.4)",
//             display: "flex", alignItems: "center", justifyContent: "center"
//           }}>
//             <Mail size={22} color="#7db3e8" />
//           </div>
//           <div style={{ flex: 1 }}>
//             <div style={{ color: "white", fontWeight: 700, fontSize: "1.05rem", fontFamily: "'Playfair Display', Georgia, serif" }}>Send Meeting Invitations</div>
//             <div style={{ color: "rgba(150,180,230,0.8)", fontSize: "0.78rem", marginTop: 2 }}>{meeting.agenda} — {meeting.date}</div>
//           </div>
//           {selected.length > 0 && (
//             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
//               style={{
//                 background: "rgba(79,156,249,0.25)", borderRadius: 20,
//                 padding: "4px 14px", color: "#7db3e8",
//                 fontSize: "0.78rem", fontWeight: 700, border: "1px solid rgba(79,156,249,0.3)"
//               }}>
//               {selected.length} selected
//             </motion.div>
//           )}
//           <button onClick={onClose} style={{
//             background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
//             borderRadius: 10, padding: "6px 8px", cursor: "pointer",
//             color: "white", display: "flex", alignItems: "center"
//           }}>
//             <X size={18} />
//           </button>
//         </div>

//         <div style={{ padding: "26px 30px" }}>
//           {!sent ? (
//             <>
//               <div style={{ position: "relative", marginBottom: 18 }}>
//                 <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
//                 <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
//                   placeholder="Search by name or organisation…"
//                   style={{ ...inpStyle, paddingLeft: 38 }} />
//               </div>

//               <div style={{ fontWeight: 700, color: "#0f2240", fontSize: "0.82rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
//                 <Star size={13} color="#f59e0b" /> System Suggested Representatives
//               </div>
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10, marginBottom: 22 }}>
//                 {filtered.map(rep => (
//                   <motion.div key={rep.id} whileTap={{ scale: 0.97 }} onClick={() => toggle(rep)}
//                     style={{
//                       padding: "13px 15px", borderRadius: 14,
//                       border: `2px solid ${isSelected(rep) ? "#3a70b0" : "#e8edf4"}`,
//                       background: isSelected(rep) ? "linear-gradient(135deg,#eff6ff,#dbeafe)" : "#f8fbff",
//                       cursor: "pointer", display: "flex", alignItems: "center",
//                       gap: 11, transition: "all 0.2s"
//                     }}>
//                     <div style={{ borderRadius: "50%", overflow: "hidden", width: 40, height: 40, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
//                       <Avatar name={rep.name} image={rep.image} size={40} />
//                     </div>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <div style={{ fontWeight: 700, color: "#0f2240", fontSize: "0.83rem" }}>{rep.name}</div>
//                       <div style={{ color: "#64748b", fontSize: "0.72rem" }}>{rep.org} · {rep.role}</div>
//                       <div style={{ color: "#94a3b8", fontSize: "0.67rem" }}>{rep.email}</div>
//                     </div>
//                     <div style={{
//                       width: 22, height: 22, borderRadius: "50%",
//                       border: `2px solid ${isSelected(rep) ? "#3a70b0" : "#cbd5e1"}`,
//                       background: isSelected(rep) ? "#3a70b0" : "transparent",
//                       display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
//                     }}>
//                       {isSelected(rep) && <CheckCheck size={12} color="white" />}
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               {custom.length > 0 && (
//                 <>
//                   <div style={{ fontWeight: 700, color: "#0f2240", fontSize: "0.82rem", marginBottom: 10 }}>✅ Added by You</div>
//                   <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10, marginBottom: 20 }}>
//                     {custom.map(rep => (
//                       <div key={rep.id} onClick={() => toggle(rep)}
//                         style={{
//                           padding: "11px 13px", borderRadius: 12,
//                           border: `2px solid ${isSelected(rep) ? "#3a70b0" : "#e8edf4"}`,
//                           background: isSelected(rep) ? "#eff6ff" : "#f8fbff",
//                           cursor: "pointer", display: "flex", alignItems: "center", gap: 10
//                         }}>
//                         <Avatar name={rep.name} size={34} />
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                           <div style={{ fontWeight: 700, color: "#0f2240", fontSize: "0.81rem" }}>{rep.name}</div>
//                           <div style={{ color: "#64748b", fontSize: "0.7rem" }}>{rep.org} · {rep.role}</div>
//                         </div>
//                         {isSelected(rep) && <CheckCheck size={14} color="#3a70b0" />}
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}

//               <div style={{
//                 background: "linear-gradient(135deg,#f0f7ff,#e8f0fb)",
//                 border: "1px solid #c7d9f5", borderRadius: 16,
//                 padding: "18px 20px", marginBottom: 22
//               }}>
//                 <div style={{ fontWeight: 700, color: "#0f2240", fontSize: "0.83rem", marginBottom: 13, display: "flex", alignItems: "center", gap: 7 }}>
//                   <UserPlus size={14} color="#3a70b0" /> Add External Representative
//                 </div>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
//                   <div>
//                     <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full Name *"
//                       style={{ ...inpStyle, borderColor: errors.name ? "#ef4444" : "#dde3ec" }} />
//                     {errors.name && <div style={{ color: "#ef4444", fontSize: "0.7rem", marginTop: 3 }}>{errors.name}</div>}
//                   </div>
//                   <div>
//                     <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email Address *"
//                       style={{ ...inpStyle, borderColor: errors.email ? "#ef4444" : "#dde3ec" }} />
//                     {errors.email && <div style={{ color: "#ef4444", fontSize: "0.7rem", marginTop: 3 }}>{errors.email}</div>}
//                   </div>
//                   <input value={newOrg} onChange={e => setNewOrg(e.target.value)} placeholder="Organisation" style={inpStyle} />
//                   <input value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="Role / Title" style={inpStyle} />
//                 </div>
//                 <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={addCustom}
//                   style={{
//                     background: "linear-gradient(120deg,#0f2744,#3a70b0)",
//                     color: "white", border: "none", borderRadius: 9,
//                     padding: "8px 20px", fontSize: "0.8rem", fontWeight: 600,
//                     cursor: "pointer", display: "flex", alignItems: "center", gap: 6
//                   }}>
//                   <Plus size={13} /> Add & Select
//                 </motion.button>
//               </div>

//               <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 14, borderTop: "1px solid #f0f4f9" }}>
//                 <button onClick={onClose} style={{
//                   padding: "10px 22px", borderRadius: 11, border: "1.5px solid #dde3ec",
//                   background: "white", color: "#64748b", fontWeight: 500, cursor: "pointer", fontSize: "0.85rem"
//                 }}>Cancel</button>
//                 <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={sendAll}
//                   disabled={sending || selected.length === 0}
//                   style={{
//                     padding: "10px 24px", borderRadius: 11, border: "none",
//                     background: selected.length > 0 ? "linear-gradient(120deg,#0f2744,#3a70b0)" : "#e2e8f0",
//                     color: selected.length > 0 ? "white" : "#94a3b8",
//                     fontWeight: 600, cursor: selected.length > 0 ? "pointer" : "not-allowed",
//                     display: "flex", alignItems: "center", gap: 7, fontSize: "0.84rem",
//                     opacity: sending ? 0.8 : 1, boxShadow: selected.length > 0 ? "0 8px 24px rgba(58,112,176,0.35)" : "none"
//                   }}>
//                   {sending ? <><Loader size={14} /> Sending…</> : <><Send size={14} /> Send {selected.length > 0 ? `to ${selected.length}` : "Invitations"}</>}
//                 </motion.button>
//               </div>
//             </>
//           ) : (
//             <div style={{ textAlign: "center", padding: "50px 20px" }}>
//               <motion.div
//                 initial={{ scale: 0 }} animate={{ scale: 1 }}
//                 transition={{ type: "spring", damping: 12, stiffness: 200 }}
//                 style={{
//                   width: 72, height: 72, borderRadius: "50%",
//                   background: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   margin: "0 auto 18px", boxShadow: "0 10px 30px rgba(5,150,105,0.25)"
//                 }}>
//                 <MailCheck size={30} color="#059669" />
//               </motion.div>
//               <div style={{ fontWeight: 700, fontSize: "1.15rem", color: "#0f2240", marginBottom: 8, fontFamily: "'Playfair Display', Georgia, serif" }}>Invitations Dispatched!</div>
//               <div style={{ color: "#64748b", fontSize: "0.87rem", marginBottom: 26 }}>Email invitations sent to {selected.length} representative(s).</div>
//               <motion.button whileHover={{ scale: 1.04 }} onClick={onClose}
//                 style={{
//                   background: "linear-gradient(120deg,#0f2744,#3a70b0)",
//                   color: "white", border: "none", borderRadius: 11,
//                   padding: "11px 32px", fontWeight: 600, cursor: "pointer",
//                   boxShadow: "0 8px 24px rgba(58,112,176,0.35)"
//                 }}>Done</motion.button>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// /* ═══ NOTES MODAL ═══ */
// const editInput = {
//   width: "100%", boxSizing: "border-box", padding: "9px 13px",
//   border: "1.5px solid #dde3ec", borderRadius: 9,
//   fontSize: "0.83rem", fontFamily: "inherit", outline: "none",
//   color: "#0f2240", background: "#f8fbff", transition: "border-color 0.2s"
// };
// const editTextarea = { ...editInput, resize: "vertical", minHeight: 64, lineHeight: 1.6 };
// const sectionLabel = { fontWeight: 700, color: "#0f2240", fontSize: "0.83rem", marginBottom: 9, display: "flex", alignItems: "center", justifyContent: "space-between" };
// const addBtnStyle = { background: "#eef4ff", color: "#3a70b0", border: "1px solid #c7d9f5", borderRadius: 7, padding: "4px 12px", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" };
// const remBtnStyle = { background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "3px 5px", borderRadius: 5, fontSize: "0.75rem", flexShrink: 0 };

// const NotesModal = ({ meeting, onClose, onGenerated }) => {
//   const [notes, setNotes] = useState(""); const [phase, setPhase] = useState("write");
//   const [errorMsg, setErrorMsg] = useState(""); const [editData, setEditData] = useState(null);
//   const [downloadUrl, setDownloadUrl] = useState(null); const [pdfBytes, setPdfBytes] = useState(null);
//   const [isRegen, setIsRegen] = useState(false); const [sendingEmail, setSendingEmail] = useState(false);

//   const chars = notes.trim().length;
//   const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;
//   const uf = (f, v) => setEditData(p => ({ ...p, [f]: v }));
//   const ud = (id, f, v) => setEditData(p => ({ ...p, keyDecisions: p.keyDecisions.map(d => d.id === id ? { ...d, [f]: v } : d) }));
//   const ua = (id, f, v) => setEditData(p => ({ ...p, actionItems: p.actionItems.map(a => a.id === id ? { ...a, [f]: v } : a) }));
//   const udp = (i, v) => setEditData(p => ({ ...p, discussionPoints: p.discussionPoints.map((d, idx) => idx === i ? v : d) }));

//   const sendToAI = async () => {
//     if (chars < 30) return;
//     setPhase("processing");
//     try {
//       const s = await callClaudeForMinutes(notes, meeting);
//       setEditData(JSON.parse(JSON.stringify(s)));
//       setPhase("edit");
//     } catch (e) { setErrorMsg(e.message || "Error"); setPhase("error"); }
//   };

//   const genPDF = async () => {
//     setIsRegen(true);
//     try {
//       const { url, bytes } = await createMinutesPDF(editData, meeting);
//       setDownloadUrl(url); setPdfBytes(bytes);
//       setIsRegen(false);
//       return { url, bytes };
//     } catch (e) { setIsRegen(false); alert("PDF error: " + e.message); return null; }
//   };

//   const handleDownloadSave = async () => {
//     const res = await genPDF(); if (!res) return;
//     const a = document.createElement("a"); a.href = res.url;
//     a.download = `Minutes_${meeting.agenda.replace(/\s+/g, "_")}_${meeting.date}.pdf`;
//     document.body.appendChild(a); a.click(); document.body.removeChild(a);
//     await saveToBackend(res);
//     onGenerated(meeting.id, editData, res.url, res.bytes);
//     onClose();
//   };

//   const handleSaveOnly = async () => {
//     const res = await genPDF(); if (!res) return;
//     await saveToBackend(res);
//     onGenerated(meeting.id, editData, res.url, res.bytes);
//     onClose();
//   };

//   const saveToBackend = async (res) => {
//     try {
//       await fetch(`${API_BASE}/${meeting._dbId || meeting.id}`, {
//         method: "PATCH", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ minutesData: editData, decisions: (editData.keyDecisions || []).map(d => d.decision), actionItems: (editData.actionItems || []).map(a => a.task) })
//       }).catch(() => { });
//     } catch (e) { console.warn("Backend save:", e); }
//   };

//   const handleEmailPDF = async () => {
//     if (!pdfBytes && !downloadUrl) { const res = await genPDF(); if (!res) return; await doEmailSend(res.bytes); }
//     else await doEmailSend(pdfBytes);
//   };

//   const doEmailSend = async (bytes) => {
//     if (!bytes) { alert("Generate PDF first."); return; }
//     setSendingEmail(true);
//     const b64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
//     const recipients = meeting.boardMembers.map(m => ({ email: m.email, name: m.name })).filter(r => r.email && isEmail(r.email));
//     try {
//       const r = await fetch(`${EMAIL_BASE}/send-minutes`, {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ recipients, pdfBase64: b64, meetingTitle: editData?.meetingTitle || meeting.agenda, date: meeting.date })
//       });
//       const d = await r.json();
//       if (d.success) alert(`✅ Minutes emailed to ${recipients.length} attendee(s)!`);
//       else alert("Some emails failed. Check logs.");
//     } catch (e) { alert("Email error: " + e.message); }
//     setSendingEmail(false);
//   };

//   const onFocus = e => { e.target.style.borderColor = "#3a70b0"; e.target.style.background = "#fff"; };
//   const onBlur = e => { e.target.style.borderColor = "#dde3ec"; e.target.style.background = "#f8fbff"; };
//   const priC = { High: "#fee2e2", Medium: "#fef3c7", Low: "#d1fae5" };
//   const priT = { High: "#991b1b", Medium: "#92400e", Low: "#065f46" };

//   return (
//     <div style={{
//       position: "fixed", inset: 0, background: "rgba(5,15,35,0.75)",
//       backdropFilter: "blur(8px)", display: "flex",
//       alignItems: "center", justifyContent: "center", zIndex: 1001, padding: 20
//     }}>
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0, y: 25 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         transition={{ type: "spring", damping: 20, stiffness: 260 }}
//         style={{
//           background: "#fff", borderRadius: 24,
//           width: phase === "edit" ? "860px" : "740px", maxWidth: "100%",
//           maxHeight: "92vh", overflowY: "auto",
//           boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
//           border: "1px solid #dde3ec", transition: "width 0.3s"
//         }}
//       >
//         <div style={{
//           background: "linear-gradient(130deg,#050f23 0%,#0f2744 50%,#1a4570 100%)",
//           padding: "24px 30px", borderRadius: "24px 24px 0 0",
//           display: "flex", alignItems: "center", gap: 14,
//           position: "sticky", top: 0, zIndex: 10
//         }}>
//           <div style={{
//             width: 46, height: 46, borderRadius: 14,
//             background: "rgba(79,156,249,0.2)",
//             border: "1px solid rgba(79,156,249,0.4)",
//             display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
//           }}>
//             {phase === "edit" ? <FileText size={22} color="#7db3e8" /> : <PenLine size={22} color="#7db3e8" />}
//           </div>
//           <div style={{ flex: 1 }}>
//             <div style={{ color: "white", fontWeight: 700, fontSize: "1.05rem", fontFamily: "'Playfair Display', Georgia, serif" }}>
//               {phase === "edit" ? "✏️ Review & Edit Minutes" : "Write Meeting Notes"}
//             </div>
//             <div style={{ color: "rgba(150,180,230,0.8)", fontSize: "0.8rem", marginTop: 2 }}>{meeting.agenda} — {meeting.date}</div>
//           </div>
//           {["Write", "Edit", "Save"].map((p, i) => {
//             const active = (i === 0 && ["write", "error", "processing"].includes(phase)) || (i === 1 && phase === "edit");
//             const done = i === 0 && phase === "edit";
//             return (
//               <div key={p} style={{
//                 display: "flex", alignItems: "center", gap: 4,
//                 background: done ? "rgba(16,185,129,0.25)" : active ? "rgba(79,156,249,0.2)" : "rgba(255,255,255,0.06)",
//                 borderRadius: 20, padding: "3px 11px", fontSize: "0.7rem",
//                 color: done ? "#6ee7b7" : active ? "#7db3e8" : "rgba(255,255,255,0.35)",
//                 fontWeight: 600, border: `1px solid ${done ? "rgba(110,231,183,0.3)" : active ? "rgba(79,156,249,0.3)" : "transparent"}`
//               }}>
//                 {done ? "✓" : `${i + 1}.`} {p}
//               </div>
//             );
//           })}
//           <button onClick={onClose} style={{
//             background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
//             borderRadius: 10, padding: "6px 8px", cursor: "pointer",
//             color: "white", display: "flex", alignItems: "center", flexShrink: 0
//           }}><X size={18} /></button>
//         </div>

//         <div style={{ padding: "28px 30px" }}>
//           {(phase === "write" || phase === "error") && (
//             <>
//               <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#0f2240", fontWeight: 700, fontSize: "0.95rem", marginBottom: 8 }}>
//                 <ClipboardList size={17} color="#3a70b0" /> Rough Meeting Notes
//               </div>
//               <p style={{ color: "#64748b", fontSize: "0.83rem", margin: "0 0 12px", lineHeight: 1.6 }}>
//                 Write everything that happened — decisions, who said what, tasks, deadlines. AI will structure it into formal minutes.
//               </p>
//               <textarea
//                 value={notes} onChange={e => setNotes(e.target.value)}
//                 placeholder={"Example:\n\nDean opened the meeting. Discussed curriculum update — agreed to add AI module in semester 3..."}
//                 style={{
//                   width: "100%", boxSizing: "border-box", minHeight: 240,
//                   padding: "15px 17px", border: "2px solid #dde3ec",
//                   borderRadius: 14, fontSize: "0.88rem", lineHeight: 1.75,
//                   fontFamily: "inherit", resize: "vertical", outline: "none",
//                   color: "#0f2240", background: "#f8fbff", transition: "all 0.2s"
//                 }}
//                 onFocus={e => { e.target.style.borderColor = "#3a70b0"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 4px rgba(58,112,176,0.1)"; }}
//                 onBlur={e => { e.target.style.borderColor = "#dde3ec"; e.target.style.background = "#f8fbff"; e.target.style.boxShadow = "none"; }}
//               />
//               <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: "0.77rem", color: "#94a3b8" }}>
//                 <span>{words} words · {chars} chars</span>
//                 <span style={{ color: chars < 30 ? "#ef4444" : "#10b981", fontWeight: 600 }}>
//                   {chars < 30 ? `${30 - chars} more chars needed` : "✓ Ready to generate"}
//                 </span>
//               </div>

//               {phase === "error" && (
//                 <div style={{
//                   background: "#fef2f2", border: "1px solid #fecaca",
//                   borderRadius: 12, padding: "12px 16px",
//                   display: "flex", gap: 10, alignItems: "flex-start", margin: "16px 0"
//                 }}>
//                   <AlertCircle size={16} color="#ef4444" style={{ marginTop: 1, flexShrink: 0 }} />
//                   <div>
//                     <div style={{ fontWeight: 700, color: "#dc2626", fontSize: "0.84rem" }}>Generation failed</div>
//                     <div style={{ color: "#7f1d1d", fontSize: "0.79rem", marginTop: 2 }}>{errorMsg}</div>
//                   </div>
//                 </div>
//               )}

//               <div style={{
//                 background: "linear-gradient(135deg,#f0f7ff,#e8f0fb)",
//                 border: "1px solid #c7d9f5", borderRadius: 14,
//                 padding: "14px 17px", margin: "16px 0 20px"
//               }}>
//                 <div style={{ fontWeight: 700, color: "#0f2240", fontSize: "0.81rem", marginBottom: 9 }}>📋 Attendees (auto-included)</div>
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
//                   {meeting.boardMembers.map((m, i) => (
//                     <span key={i} style={{
//                       background: "white", border: "1px solid #c7d9f5", borderRadius: 22,
//                       padding: "4px 12px", fontSize: "0.75rem", color: "#334155",
//                       display: "flex", alignItems: "center", gap: 6
//                     }}>
//                       <Avatar name={m.name} image={m.image} size={20} />
//                       {m.name}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
//                 <button onClick={onClose} style={{
//                   padding: "10px 22px", borderRadius: 11, border: "1.5px solid #dde3ec",
//                   background: "white", color: "#64748b", fontWeight: 500, cursor: "pointer", fontSize: "0.86rem"
//                 }}>Cancel</button>
//                 <motion.button whileHover={chars >= 30 ? { scale: 1.04 } : {}} whileTap={chars >= 30 ? { scale: 0.96 } : {}}
//                   onClick={sendToAI} disabled={chars < 30}
//                   style={{
//                     padding: "10px 24px", borderRadius: 11, border: "none",
//                     background: chars >= 30 ? "linear-gradient(120deg,#0f2744,#3a70b0)" : "#e2e8f0",
//                     color: chars >= 30 ? "white" : "#94a3b8",
//                     fontWeight: 600, cursor: chars >= 30 ? "pointer" : "not-allowed",
//                     display: "flex", alignItems: "center", gap: 8, fontSize: "0.86rem",
//                     boxShadow: chars >= 30 ? "0 8px 24px rgba(58,112,176,0.35)" : "none"
//                   }}>
//                   <Sparkles size={15} /> Send to AI <ChevronRight size={13} />
//                 </motion.button>
//               </div>
//             </>
//           )}

//           {phase === "processing" && (
//             <div style={{ textAlign: "center", padding: "52px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
//                 style={{
//                   width: 72, height: 72, borderRadius: "50%",
//                   background: "linear-gradient(135deg,#0f2744,#3a70b0)",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   boxShadow: "0 12px 36px rgba(58,112,176,0.4)"
//                 }}>
//                 <Bot size={34} color="white" />
//               </motion.div>
//               <div>
//                 <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0f2240", marginBottom: 6, fontFamily: "'Playfair Display', Georgia, serif" }}>
//                   AI is processing your notes…
//                 </div>
//                 <div style={{ color: "#64748b", fontSize: "0.86rem" }}>Structuring decisions & action items into formal minutes</div>
//               </div>
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
//                 {["Analysing notes", "Extracting decisions", "Structuring output"].map((label, i) => (
//                   <motion.div key={i}
//                     animate={{ opacity: [0.4, 1, 0.4] }}
//                     transition={{ repeat: Infinity, duration: 2, delay: i * 0.7 }}
//                     style={{
//                       background: "#f0f7ff", borderRadius: 22, padding: "5px 13px",
//                       fontSize: "0.74rem", color: "#3a70b0", fontWeight: 600,
//                       display: "flex", alignItems: "center", gap: 5,
//                       border: "1px solid #c7d9f5"
//                     }}>
//                     <Loader size={10} />{label}
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {phase === "edit" && editData && (
//             <>
//               <div style={{
//                 background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
//                 border: "1px solid #93c5fd", borderRadius: 13,
//                 padding: "13px 17px", marginBottom: 22,
//                 display: "flex", gap: 11, alignItems: "center"
//               }}>
//                 <span style={{ fontSize: "1.2rem" }}>✏️</span>
//                 <div>
//                   <div style={{ fontWeight: 700, color: "#1e40af", fontSize: "0.88rem" }}>AI generated your minutes — edit anything before saving</div>
//                   <div style={{ color: "#3b82f6", fontSize: "0.76rem", marginTop: 1 }}>All fields are fully editable below.</div>
//                 </div>
//               </div>

//               <div style={{ marginBottom: 18 }}>
//                 <div style={sectionLabel}>📌 Meeting Title</div>
//                 <input value={editData.meetingTitle || ""} onChange={e => uf("meetingTitle", e.target.value)} style={editInput} onFocus={onFocus} onBlur={onBlur} />
//               </div>
//               <div style={{ marginBottom: 18 }}>
//                 <div style={sectionLabel}>📝 Executive Summary</div>
//                 <textarea value={editData.summary || ""} onChange={e => uf("summary", e.target.value)} style={{ ...editTextarea, minHeight: 76 }} onFocus={onFocus} onBlur={onBlur} />
//               </div>
//               <div style={{ marginBottom: 18 }}>
//                 <div style={sectionLabel}>✅ Key Decisions <button style={addBtnStyle} onClick={() => setEditData(p => ({ ...p, keyDecisions: [...p.keyDecisions, { id: Date.now(), decision: "", rationale: "" }] }))}>+ Add</button></div>
//                 {editData.keyDecisions.map((d, idx) => (
//                   <div key={d.id} style={{ background: "#f8fbff", border: "1px solid #dde3ec", borderRadius: 11, padding: "13px 15px", marginBottom: 10 }}>
//                     <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
//                       <span style={{ minWidth: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#0f2744,#3a70b0)", color: "white", fontSize: "0.69rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{idx + 1}</span>
//                       <div style={{ flex: 1 }}>
//                         <input value={d.decision} onChange={e => ud(d.id, "decision", e.target.value)} placeholder="Decision…" style={{ ...editInput, marginBottom: 6, fontWeight: 600 }} onFocus={onFocus} onBlur={onBlur} />
//                         <input value={d.rationale || ""} onChange={e => ud(d.id, "rationale", e.target.value)} placeholder="Rationale…" style={{ ...editInput, fontSize: "0.78rem", color: "#64748b" }} onFocus={onFocus} onBlur={onBlur} />
//                       </div>
//                       <button style={remBtnStyle} onClick={() => setEditData(p => ({ ...p, keyDecisions: p.keyDecisions.filter(x => x.id !== d.id) }))}>✕</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div style={{ marginBottom: 18 }}>
//                 <div style={sectionLabel}>🎯 Action Items <button style={addBtnStyle} onClick={() => setEditData(p => ({ ...p, actionItems: [...p.actionItems, { id: Date.now(), task: "", responsible: "", deadline: "", priority: "Medium" }] }))}>+ Add</button></div>
//                 {editData.actionItems.map((a, idx) => (
//                   <div key={a.id} style={{ background: "#f8fbff", border: "1px solid #dde3ec", borderRadius: 11, padding: "13px 15px", marginBottom: 10 }}>
//                     <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
//                       <span style={{ minWidth: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#1a4570,#4f9cf9)", color: "white", fontSize: "0.69rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{idx + 1}</span>
//                       <div style={{ flex: 1 }}>
//                         <input value={a.task} onChange={e => ua(a.id, "task", e.target.value)} placeholder="Task…" style={{ ...editInput, marginBottom: 6, fontWeight: 600 }} onFocus={onFocus} onBlur={onBlur} />
//                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
//                           <input value={a.responsible || ""} onChange={e => ua(a.id, "responsible", e.target.value)} placeholder="👤 Responsible" style={editInput} onFocus={onFocus} onBlur={onBlur} />
//                           <input value={a.deadline || ""} onChange={e => ua(a.id, "deadline", e.target.value)} placeholder="📅 Deadline" style={editInput} onFocus={onFocus} onBlur={onBlur} />
//                           <select value={a.priority || "Medium"} onChange={e => ua(a.id, "priority", e.target.value)}
//                             style={{ ...editInput, background: priC[a.priority] || "#fef3c7", color: priT[a.priority] || "#92400e", fontWeight: 700, cursor: "pointer" }}>
//                             <option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
//                           </select>
//                         </div>
//                       </div>
//                       <button style={remBtnStyle} onClick={() => setEditData(p => ({ ...p, actionItems: p.actionItems.filter(x => x.id !== a.id) }))}>✕</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div style={{ marginBottom: 18 }}>
//                 <div style={sectionLabel}>💬 Discussion Points <button style={addBtnStyle} onClick={() => setEditData(p => ({ ...p, discussionPoints: [...p.discussionPoints, ""] }))}>+ Add</button></div>
//                 {(editData.discussionPoints || []).map((d, i) => (
//                   <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
//                     <span style={{ color: "#3a70b0", fontSize: "1rem", flexShrink: 0, fontWeight: 700 }}>·</span>
//                     <input value={d} onChange={e => udp(i, e.target.value)} placeholder="Discussion point…" style={{ ...editInput, flex: 1 }} onFocus={onFocus} onBlur={onBlur} />
//                     <button style={remBtnStyle} onClick={() => setEditData(p => ({ ...p, discussionPoints: p.discussionPoints.filter((_, idx) => idx !== i) }))}>✕</button>
//                   </div>
//                 ))}
//               </div>
//               <div style={{ marginBottom: 18 }}>
//                 <div style={sectionLabel}>🚀 Next Steps</div>
//                 <textarea value={editData.nextSteps || ""} onChange={e => uf("nextSteps", e.target.value)} style={{ ...editTextarea, minHeight: 58 }} onFocus={onFocus} onBlur={onBlur} />
//               </div>
//               <div style={{ marginBottom: 24 }}>
//                 <div style={sectionLabel}>📅 Next Meeting Note</div>
//                 <input value={editData.nextMeetingNote || ""} onChange={e => uf("nextMeetingNote", e.target.value)} placeholder="e.g. In 4 weeks — follow up on action items" style={editInput} onFocus={onFocus} onBlur={onBlur} />
//               </div>

//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", paddingTop: 16, borderTop: "1px solid #f0f4f9" }}>
//                 <button onClick={() => setPhase("write")} style={{ padding: "9px 19px", borderRadius: 11, border: "1.5px solid #dde3ec", background: "white", color: "#64748b", fontWeight: 500, cursor: "pointer", fontSize: "0.84rem" }}>← Back</button>
//                 <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
//                   <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleEmailPDF} disabled={isRegen || sendingEmail}
//                     style={{ padding: "9px 17px", borderRadius: 11, border: "none", background: "#0ea5e9", color: "white", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", opacity: sendingEmail ? 0.7 : 1, boxShadow: "0 6px 18px rgba(14,165,233,0.3)" }}>
//                     {sendingEmail ? <Loader size={13} /> : <Mail size={13} />} Email PDF to All
//                   </motion.button>
//                   <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleSaveOnly} disabled={isRegen}
//                     style={{ padding: "9px 19px", borderRadius: 11, border: "none", background: "#10b981", color: "white", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", opacity: isRegen ? 0.7 : 1, boxShadow: "0 6px 18px rgba(16,185,129,0.3)" }}>
//                     {isRegen ? <Loader size={13} /> : <CheckCircle2 size={13} />} Save & Close
//                   </motion.button>
//                   <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleDownloadSave} disabled={isRegen}
//                     style={{ padding: "9px 22px", borderRadius: 11, border: "none", background: "linear-gradient(120deg,#0f2744,#3a70b0)", color: "white", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", opacity: isRegen ? 0.7 : 1, boxShadow: "0 8px 24px rgba(58,112,176,0.35)" }}>
//                     {isRegen ? <Loader size={13} /> : <Download size={13} />} Download PDF & Save
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

// /* ═══════════════════════════════════════════════
//    MAIN COMPONENT
// ═══════════════════════════════════════════════ */
// const AdvisoryMeeting = () => {
//   const [meetings, setMeetings] = useState([]);
//   const [activeTab, setActiveTab] = useState("create");
//   const [showInvite, setShowInvite] = useState(false);
//   const [lastMeeting, setLastMeeting] = useState(null);
//   const [notesModalFor, setNotesModalFor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const [form, setForm] = useState({ agenda: "", date: "", time: "", venue: "" });
//   const [formErrors, setFormErrors] = useState({});
//   const [boardMembers, setBoardMembers] = useState(DEFAULT_BOARD);
//   const [addMember, setAddMember] = useState({ name: "", role: "", email: "", org: "" });
//   const [addMemberErrors, setAddMemberErrors] = useState({});
//   const [showAddMember, setShowAddMember] = useState(false);

//   const updateMemberImage = (id, img) => setBoardMembers(p => p.map(m => m.id === id ? { ...m, image: img } : m));

//   useEffect(() => {
//     (async () => {
//       try {
//         const r = await fetch(`${API_BASE}/all`);
//         const d = await r.json();
//         if (d.success) {
//           setMeetings(d.data.map(m => ({
//             id: m.meetingId, _dbId: m._id, agenda: m.meetingTitle,
//             date: m.date, time: m.time, venue: m.location,
//             status: m.minutesData ? "Completed" : "Scheduled",
//             boardMembers: DEFAULT_BOARD,
//             minutesGenerated: !!m.minutesData, minutesData: m.minutesData || null,
//             downloadUrl: null, pdfBytes: null
//           })));
//         }
//       } catch (e) { console.error(e); } finally { setLoading(false); }
//     })();
//   }, []);

//   const validateForm = () => {
//     const e = {};
//     if (isEmpty(form.agenda)) e.agenda = "Agenda is required";
//     if (isEmpty(form.date)) e.date = "Date is required";
//     else if (new Date(form.date) < new Date(new Date().toDateString())) e.date = "Date cannot be in the past";
//     if (isEmpty(form.time)) e.time = "Time is required";
//     if (isEmpty(form.venue)) e.venue = "Venue is required";
//     setFormErrors(e); return Object.keys(e).length === 0;
//   };

//   const validateAddMember = () => {
//     const e = {};
//     if (isEmpty(addMember.name)) e.name = "Name required";
//     if (isEmpty(addMember.role)) e.role = "Role required";
//     if (!isEmpty(addMember.email) && !isEmail(addMember.email)) e.email = "Invalid email";
//     setAddMemberErrors(e); return Object.keys(e).length === 0;
//   };

//   const handleAddMemberSubmit = () => {
//     if (!validateAddMember()) return;
//     setBoardMembers(p => [...p, { id: "m" + Date.now(), name: addMember.name, role: addMember.role, email: addMember.email, org: addMember.org, isFixed: false, image: null }]);
//     setAddMember({ name: "", role: "", email: "", org: "" });
//     setAddMemberErrors({}); setShowAddMember(false);
//   };

//   const handleSchedule = async () => {
//     if (!validateForm()) return;
//     const id = String(Date.now());
//     const entry = { id, agenda: form.agenda, date: form.date, time: form.time, venue: form.venue, status: "Scheduled", boardMembers, minutesGenerated: false, minutesData: null, downloadUrl: null, pdfBytes: null };
//     try {
//       const r = await fetch(API_BASE, {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ meetingId: id, meetingTitle: form.agenda, date: form.date, time: form.time, location: form.venue, attendees: boardMembers.map(b => b.name).join(", "), decisions: [], actionItems: [] })
//       });
//       const d = await r.json();
//       if (d.data?._id) entry._dbId = d.data._id;
//     } catch (e) { console.warn("Save error:", e); }
//     setMeetings(p => [...p, entry]);
//     setLastMeeting(entry);
//     setForm({ agenda: "", date: "", time: "", venue: "" });
//     setShowInvite(true);
//   };

//   const handleMinutesGenerated = (meetingId, minutesData, downloadUrl, pdfBytes) => {
//     setMeetings(p => p.map(m => m.id === meetingId ? { ...m, status: "Completed", minutesGenerated: true, minutesData, downloadUrl, pdfBytes } : m));
//   };

//   const downloadMinutes = (m) => {
//     if (!m.downloadUrl) return;
//     const a = document.createElement("a"); a.href = m.downloadUrl;
//     a.download = `Minutes_${m.agenda.replace(/\s+/g, "_")}_${m.date}.pdf`;
//     document.body.appendChild(a); a.click(); document.body.removeChild(a);
//   };

//   const inpSt = {
//     width: "100%", boxSizing: "border-box", padding: "11px 15px",
//     border: "1.5px solid #dde3ec", borderRadius: 11,
//     fontSize: "0.88rem", fontFamily: "inherit", outline: "none",
//     color: "#0f2240", background: "#f8fbff", transition: "all 0.2s"
//   };

//   return (
//     <>
//       {/* Google Fonts */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
//         * { box-sizing: border-box; }
//         body { margin: 0; }
//         ::-webkit-scrollbar { width: 6px; height: 6px; }
//         ::-webkit-scrollbar-track { background: #f1f5f9; }
//         ::-webkit-scrollbar-thumb { background: #c7d9f5; border-radius: 3px; }
//         ::-webkit-scrollbar-thumb:hover { background: #3a70b0; }
//         @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
//         @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
//         @keyframes pulse-ring { 0%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(79,156,249,0.5)} 70%{transform:scale(1);box-shadow:0 0 0 12px rgba(79,156,249,0)} 100%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(79,156,249,0)} }

//         @media (max-width: 768px) {
//           .stats-grid { flex-direction: column !important; }
//           .form-grid { grid-template-columns: 1fr !important; }
//           .members-grid { grid-template-columns: 1fr !important; }
//           .header-inner { flex-direction: column !important; gap: 12px !important; }
//           .nav-actions { display: none !important; }
//           .nav-actions.open { display: flex !important; flex-direction: column !important; width: 100% !important; }
//           .records-table { font-size: 0.76rem !important; }
//           .main-pad { padding: 16px !important; }
//         }
//       `}</style>

//       <div style={{ minHeight: "100vh", background: "#f0f5fc", fontFamily: "'DM Sans', sans-serif" }}>
//         <AnimatePresence>
//           {notesModalFor && <NotesModal meeting={notesModalFor} onClose={() => setNotesModalFor(null)} onGenerated={handleMinutesGenerated} />}
//           {showInvite && lastMeeting && <InviteModal meeting={lastMeeting} onClose={() => setShowInvite(false)} onSent={() => { }} />}
//         </AnimatePresence>

//         {/* ── TOP NAVBAR ── */}
//         <nav style={{
//           background: "linear-gradient(110deg,#050f23 0%,#0a1e3d 60%,#0f2744 100%)",
//           padding: "0 32px", height: 64,
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           position: "sticky", top: 0, zIndex: 100,
//           boxShadow: "0 4px 24px rgba(5,15,35,0.5)",
//           borderBottom: "1px solid rgba(79,156,249,0.2)"
//         }}>
//           {/* Logo */}
//           {/* <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{
//               width: 36, height: 36, borderRadius: 10,
//               background: "linear-gradient(135deg,#3a70b0,#4f9cf9)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               boxShadow: "0 4px 16px rgba(79,156,249,0.5)",
//               animation: "pulse-ring 2.5s infinite"
//             }}>
//               <Zap size={18} color="white" strokeWidth={2.5} />
//             </div>
//             <div>
//               <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, fontSize: "1.2rem", color: "white", letterSpacing: "-0.3px" }}>
//                 Colla<span style={{ color: "#4f9cf9" }}>X</span>ion
//               </span>
//               <div style={{ fontSize: "0.58rem", color: "rgba(150,180,230,0.7)", letterSpacing: "2px", textTransform: "uppercase", marginTop: -3 }}>
//                 Advisory Board
//               </div>
//             </div>
//           </div> */}




//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
  
//   {/* Logo */}
//   <div
//     style={{
//       width: 36,
//       height: 36,
//       borderRadius: 10,
//       overflow: "hidden",
//       boxShadow: "0 4px 16px rgba(79,156,249,0.5)",
//       animation: "pulse-ring 2.5s infinite",
//       flexShrink: 0,
//     }}
//   >
//     <img
//       src="../../src/images/collaxionlogo.jpeg"
//       alt="CollaXion Logo"
//       style={{
//         width: "100%",
//         height: "100%",
//         objectFit: "cover",
//       }}
//     />
//   </div>

//   {/* Text */}
//   <div>
//     <span
//       style={{
//         fontFamily: "'Playfair Display', Georgia, serif",
//         fontWeight: 800,
//         fontSize: "1.2rem",
//         color: "white",
//         letterSpacing: "-0.3px",
//       }}
//     >
//       CollaXion
//     </span>

//     <div
//       style={{
//         fontSize: "0.58rem",
//         color: "rgba(150,180,230,0.7)",
//         letterSpacing: "2px",
//         textTransform: "uppercase",
//         marginTop: -3,
//       }}
//     >
//       Advisory Board
//     </div>
//   </div>
// </div>

//           {/* Nav Items */}
//           <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: 4 }}>
//             {[
//               { id: "create", label: "Schedule Meeting", icon: <CalendarDays size={15} /> },
//               { id: "records", label: "Meeting Records", icon: <FileText size={15} /> }
//             ].map(t => (
//               <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
//                 background: activeTab === t.id ? "rgba(79,156,249,0.2)" : "transparent",
//                 border: activeTab === t.id ? "1px solid rgba(79,156,249,0.4)" : "1px solid transparent",
//                 borderRadius: 9, padding: "8px 18px", cursor: "pointer",
//                 color: activeTab === t.id ? "#7db3e8" : "rgba(180,210,240,0.7)",
//                 fontWeight: activeTab === t.id ? 600 : 500,
//                 fontSize: "0.84rem", fontFamily: "'DM Sans', sans-serif",
//                 display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s"
//               }}>
//                 {t.icon} {t.label}
//               </button>
//             ))}
//           </div>

//           {/* Right side */}
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{
//               background: "rgba(79,156,249,0.15)",
//               border: "1px solid rgba(79,156,249,0.3)",
//               borderRadius: 22, padding: "5px 14px",
//               display: "flex", alignItems: "center", gap: 7
//             }}>
//               <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
//               <span style={{ color: "#7db3e8", fontSize: "0.76rem", fontWeight: 600 }}>System Online</span>
//             </div>
//             <button onClick={() => setMobileMenuOpen(p => !p)}
//               style={{ display: "none", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "7px 9px", cursor: "pointer", color: "white" }}
//               className="mobile-menu-btn">
//               <Menu size={18} />
//             </button>
//           </div>
//         </nav>

//         {/* ── HERO BANNER ── */}
//         <div style={{
//           background: "linear-gradient(130deg,#050f23 0%,#0a1e3d 40%,#102a50 70%,#1a3a5c 100%)",
//           padding: "48px 40px 52px",
//           position: "relative", overflow: "hidden"
//         }}>
//           {/* Decorative orbs */}
//           <div style={{ position: "absolute", top: -60, right: -40, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,156,249,0.15),transparent)", pointerEvents: "none" }} />
//           <div style={{ position: "absolute", bottom: -80, left: 60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,rgba(74,222,128,0.08),transparent)", pointerEvents: "none" }} />
//           <div style={{ position: "absolute", top: "50%", left: "50%", width: 400, height: 1, background: "linear-gradient(90deg,transparent,rgba(79,156,249,0.2),transparent)", transform: "translateY(-50%)", pointerEvents: "none" }} />

//           {/* Floating grid dots */}
//           {[...Array(6)].map((_, i) => (
//             <div key={i} style={{
//               position: "absolute",
//               top: `${20 + i * 12}%`,
//               right: `${10 + (i % 3) * 12}%`,
//               width: 4, height: 4, borderRadius: "50%",
//               background: "rgba(79,156,249,0.4)",
//               animation: `float ${2 + i * 0.4}s ease-in-out infinite`,
//               animationDelay: `${i * 0.3}s`,
//               pointerEvents: "none"
//             }} />
//           ))}

//           <div className="header-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto", position: "relative" }}>
//             <div>
//               {/* <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
//                 <div style={{
//                   background: "rgba(79,156,249,0.15)",
//                   border: "1px solid rgba(79,156,249,0.35)", borderRadius: 24,
//                   padding: "4px 14px", fontSize: "0.72rem",
//                   color: "#7db3e8", fontWeight: 600, letterSpacing: "0.5px"
//                 }}>
//                   UNIVERSITY ADVISORY SYSTEM
//                 </div>
//               </div> */}



//               <div
//   style={{
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 14,
//     background: "rgba(79,156,249,0.15)",
//     border: "1px solid rgba(79,156,249,0.35)",
//     borderRadius: 24,
//     padding: "6px 12px",
//     width: "fit-content",
//   }}
// >
//   <img
//      src="../../src/images/collaxionlogo.jpeg"
//     alt="CollaXion Logo"
//     style={{
//       width: 18,
//       height: 18,
//       borderRadius: 12,
//       objectFit: "cover",
//     }}
//   />

//   <span
//     style={{
//       fontSize: "0.72rem",
//       color: "#7db3e8",
//       fontWeight: 600,
//       letterSpacing: "0.5px",
//       whiteSpace: "nowrap",
//     }}
//   >
//     UNIVERSITY ADVISORY SYSTEM
//   </span>
// </div>
//               <h1 style={{
//                 margin: "0 0 10px", color: "white",
//                 fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
//                 fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif",
//                 lineHeight: 1.15, letterSpacing: "-0.5px"
//               }}>
//                 Advisory Board<br />
//                 {/* <span style={{ background: "linear-gradient(120deg,#4f9cf9,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
//                   Meeting Management
//                 </span> */}

//                 <span
//   style={{
//     // background: "linear-gradient(120deg, #193648, #4da3d9)",

//     background: "linear-gradient(120deg, #193648, #00c6ff)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//     textShadow: "0px 0px 8px rgba(77,163,217,0.6)",
//   }}
// >
//   Meeting Management
// </span>
//               </h1>
//               <p style={{ margin: 0, color: "rgba(170,200,240,0.8)", fontSize: "1rem", lineHeight: 1.6, maxWidth: 480 }}>
//                 Schedule meetings, send invitations, generate AI-powered minutes & collaborate with board members seamlessly.
//               </p>
//             </div>

        




// <div
//   style={{
//     display: "flex",
//     flexDirection: "column",
//     gap: 18,
//     flexShrink: 0,
//   }}
// >
//   {[
//     {
//       label: "Total Meetings",
//       val: meetings.length,
//       color: "#4da3d9",
//       icon: <CalendarDays size={18} color="#4da3d9" />,
//     },
//     {
//       label: "Completed",
//       val: meetings.filter((m) => m.minutesGenerated).length,
//       color: "#22c55e",
//       icon: <CheckCircle2 size={18} color="#22c55e" />,
//     },
//     {
//       label: "Scheduled",
//       val: meetings.filter((m) => m.status === "Scheduled").length,
//       color: "#facc15",
//       icon: <Clock size={18} color="#facc15" />,
//     },
//   ].map((s, i) => (
//     <motion.div
//       key={i}
//       initial={{ opacity: 0, x: 30 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: i * 0.1 + 0.3 }}
//       whileHover={{ scale: 1.04 }}
//       style={{
//         background: "rgba(255,255,255,0.05)",
//         border: "1px solid rgba(255,255,255,0.08)",
//         borderLeft: `4px solid ${s.color}`,
//         borderRadius: 14,
//         padding: "16px 20px",
//         display: "flex",
//         alignItems: "center",
//         gap: 14,
//         backdropFilter: "blur(12px)",
//         minWidth: 220,
//         transition: "all 0.3s ease",
//         boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
//       }}
//     >
//       {/* ICON */}
//       <div style={{ display: "flex", alignItems: "center" }}>
//         {s.icon}
//       </div>

//       {/* CONTENT */}
//       <div style={{ display: "flex", flexDirection: "column" }}>
//         <div
//           style={{
//             fontSize: "1.8rem",
//             fontWeight: 800,
//             color: "white",
//             lineHeight: 1,
//             fontFamily: "'Playfair Display', Georgia, serif",
//           }}
//         >
//           {s.val}
//         </div>

//         <div
//           style={{
//             fontSize: "0.75rem",
//             color: "rgba(170,200,240,0.75)",
//             marginTop: 2,
//             letterSpacing: "0.5px",
//           }}
//         >
//           {s.label}
//         </div>
//       </div>
//     </motion.div>
//   ))}
// </div>






//           </div>
//         </div>

//         {/* ── MAIN CONTENT ── */}
//         <div className="main-pad" style={{ padding: "32px 40px", maxWidth: 1280, margin: "0 auto" }}>

//           {/* Tab Switcher */}
//           <div style={{ display: "flex", gap: 0, marginBottom: 28, background: "white", borderRadius: 14, padding: 5, width: "fit-content", boxShadow: "0 4px 20px rgba(15,39,68,0.08)", border: "1px solid #e8edf4" }}>
//             {[
//               { id: "create", label: "Schedule Meeting", icon: <CalendarDays size={15} /> },
//               { id: "records", label: "Meeting Records", icon: <FileText size={15} /> }
//             ].map(t => (
//               <motion.button key={t.id} onClick={() => setActiveTab(t.id)}
//                 layout
//                 style={{
//                   padding: "10px 26px", borderRadius: 10, border: "none",
//                   background: activeTab === t.id ? "linear-gradient(120deg,#0f2744,#3a70b0)" : "transparent",
//                   color: activeTab === t.id ? "white" : "#64748b",
//                   fontWeight: 600, cursor: "pointer", fontSize: "0.88rem",
//                   display: "flex", alignItems: "center", gap: 7,
//                   fontFamily: "'DM Sans', sans-serif", transition: "all 0.25s",
//                   boxShadow: activeTab === t.id ? "0 6px 18px rgba(58,112,176,0.3)" : "none"
//                 }}>
//                 {t.icon} {t.label}
//               </motion.button>
//             ))}
//           </div>

//           {/* ── SCHEDULE TAB ── */}
//           {activeTab === "create" && (
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>

//                 {/* Left: Form */}
//                 <div style={{
//                   background: "white", borderRadius: 22, padding: "36px 38px",
//                   boxShadow: "0 8px 40px rgba(15,39,68,0.09)",
//                   border: "1px solid #e8edf4"
//                 }}>
//                   <div style={{ marginBottom: 30 }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
//                       <div style={{
//                         width: 38, height: 38, borderRadius: 11,
//                         background: "linear-gradient(135deg,#0f2744,#3a70b0)",
//                         display: "flex", alignItems: "center", justifyContent: "center"
//                       }}>
//                         <CalendarDays size={18} color="white" />
//                       </div>
//                       <h2 style={{ margin: 0, color: "#0f2240", fontSize: "1.15rem", fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif" }}>Meeting Details</h2>
//                     </div>
//                     <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.82rem" }}>Complete all fields to schedule your advisory board meeting.</p>
//                   </div>

//                   <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
//                     {[
//                       { key: "agenda", label: "Meeting Agenda", type: "text", placeholder: "e.g. University–Industry Collaboration", icon: "📋", span: true },
//                       { key: "date", label: "Meeting Date", type: "date", icon: "📅" },
//                       { key: "time", label: "Meeting Time", type: "time", icon: "🕐" },
//                       { key: "venue", label: "Venue / Meeting Link", type: "text", placeholder: "e.g. Conference Room A or Zoom link", icon: "📍", span: true },
//                     ].map(f => (
//                       <div key={f.key} style={{ gridColumn: f.span ? "1 / -1" : undefined }}>
//                         <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: 7 }}>
//                           {f.icon} {f.label}
//                         </label>
//                         <input type={f.type} value={form[f.key]} placeholder={f.placeholder || ""}
//                           onChange={e => { setForm(p => ({ ...p, [f.key]: e.target.value })); setFormErrors(p => ({ ...p, [f.key]: "" })); }}
//                           style={{ ...inpSt, borderColor: formErrors[f.key] ? "#ef4444" : "#dde3ec" }}
//                           onFocus={e => { e.target.style.borderColor = "#3a70b0"; e.target.style.boxShadow = "0 0 0 4px rgba(58,112,176,0.1)"; e.target.style.background = "#fff"; }}
//                           onBlur={e => { e.target.style.borderColor = formErrors[f.key] ? "#ef4444" : "#dde3ec"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fbff"; }}
//                         />
//                         {formErrors[f.key] && (
//                           <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
//                             <AlertCircle size={11} /> {formErrors[f.key]}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>

//                   <motion.button whileHover={{ scale: 1.03, boxShadow: "0 14px 40px rgba(58,112,176,0.45)" }} whileTap={{ scale: 0.97 }}
//                     onClick={handleSchedule}
//                     style={{
//                       background: "linear-gradient(120deg,#0a1e3d 0%,#0f2744 40%,#3a70b0 100%)",
//                       color: "white", border: "none", borderRadius: 13,
//                       padding: "14px 38px", fontWeight: 700, fontSize: "0.95rem",
//                       cursor: "pointer", display: "flex", alignItems: "center", gap: 9,
//                       boxShadow: "0 8px 28px rgba(58,112,176,0.35)", fontFamily: "'DM Sans', sans-serif",
//                       position: "relative", overflow: "hidden"
//                     }}>
//                     <Send size={17} /> Schedule Meeting & Send Invites
//                   </motion.button>
//                 </div>

//                 {/* Right: Board Members */}
//                 <div style={{
//                   background: "white", borderRadius: 22, padding: "28px 26px",
//                   boxShadow: "0 8px 40px rgba(15,39,68,0.09)",
//                   border: "1px solid #e8edf4"
//                 }}>
//                   <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                       <div style={{
//                         width: 34, height: 34, borderRadius: 10,
//                         background: "linear-gradient(135deg,#1a4570,#4f9cf9)",
//                         display: "flex", alignItems: "center", justifyContent: "center"
//                       }}>
//                         <Users size={16} color="white" />
//                       </div>
//                       <div>
//                         <h3 style={{ margin: 0, color: "#0f2240", fontSize: "0.95rem", fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif" }}>Board Members</h3>
//                         <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{boardMembers.length} members</div>
//                       </div>
//                     </div>
//                     <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
//                       onClick={() => setShowAddMember(p => !p)}
//                       style={{
//                         background: showAddMember ? "linear-gradient(120deg,#0f2744,#3a70b0)" : "#f0f7ff",
//                         color: showAddMember ? "white" : "#3a70b0",
//                         border: "1px solid " + (showAddMember ? "transparent" : "#c7d9f5"),
//                         borderRadius: 9, padding: "7px 13px",
//                         fontSize: "0.76rem", fontWeight: 600, cursor: "pointer",
//                         display: "flex", alignItems: "center", gap: 5
//                       }}>
//                       <UserPlus size={13} /> {showAddMember ? "Cancel" : "Add"}
//                     </motion.button>
//                   </div>

//                   <div className="members-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
//                     {boardMembers.map(m => (
//                       <MemberCard key={m.id} member={m}
//                         removable={!m.isFixed}
//                         onRemove={() => setBoardMembers(p => p.filter(x => x.id !== m.id))}
//                         onImageUpload={updateMemberImage}
//                         compact
//                       />
//                     ))}
//                   </div>

//                   <AnimatePresence>
//                     {showAddMember && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
//                         style={{ overflow: "hidden", marginTop: 14 }}>
//                         <div style={{
//                           background: "linear-gradient(135deg,#f0f7ff,#e8f0fb)",
//                           border: "1px solid #c7d9f5", borderRadius: 14, padding: "16px 18px"
//                         }}>
//                           <div style={{ fontWeight: 700, color: "#0f2240", fontSize: "0.8rem", marginBottom: 12 }}>New Board Member</div>
//                           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 11 }}>
//                             {[{ k: "name", pl: "Full Name *" }, { k: "role", pl: "Role *" }, { k: "email", pl: "Email" }, { k: "org", pl: "Organisation" }].map(f => (
//                               <div key={f.k}>
//                                 <input value={addMember[f.k]}
//                                   onChange={e => { setAddMember(p => ({ ...p, [f.k]: e.target.value })); setAddMemberErrors(p => ({ ...p, [f.k]: "" })); }}
//                                   placeholder={f.pl}
//                                   style={{ ...inpSt, padding: "8px 12px", fontSize: "0.79rem", borderColor: addMemberErrors[f.k] ? "#ef4444" : "#dde3ec" }}
//                                 />
//                                 {addMemberErrors[f.k] && <div style={{ color: "#ef4444", fontSize: "0.68rem", marginTop: 3 }}>{addMemberErrors[f.k]}</div>}
//                               </div>
//                             ))}
//                           </div>
//                           <div style={{ display: "flex", gap: 8 }}>
//                             <motion.button whileHover={{ scale: 1.04 }} onClick={handleAddMemberSubmit}
//                               style={{ background: "linear-gradient(120deg,#0f2744,#3a70b0)", color: "white", border: "none", borderRadius: 8, padding: "8px 17px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
//                               <Plus size={12} /> Add
//                             </motion.button>
//                             <button onClick={() => setShowAddMember(false)}
//                               style={{ background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: "0.78rem", cursor: "pointer" }}>
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* ── RECORDS TAB ── */}
//           {/* {activeTab === "records" && (
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
//               <div style={{
//                 background: "white", borderRadius: 22, padding: "32px",
//                 boxShadow: "0 8px 40px rgba(15,39,68,0.09)",
//                 border: "1px solid #e8edf4"
//               }}>
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                     <div style={{
//                       width: 38, height: 38, borderRadius: 11,
//                       background: "linear-gradient(135deg,#0f2744,#3a70b0)",
//                       display: "flex", alignItems: "center", justifyContent: "center"
//                     }}>
//                       <FileText size={18} color="white" />
//                     </div>
//                     <div>
//                       <h2 style={{ margin: 0, color: "#0f2240", fontSize: "1.1rem", fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif" }}>Meeting Records</h2>
//                       <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{meetings.length} total meetings</div>
//                     </div>
//                   </div>
//                   <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
//                     onClick={() => setActiveTab("create")}
//                     style={{
//                       background: "linear-gradient(120deg,#0f2744,#3a70b0)",
//                       color: "white", border: "none", borderRadius: 10,
//                       padding: "9px 18px", fontWeight: 600, fontSize: "0.82rem",
//                       cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
//                       boxShadow: "0 6px 18px rgba(58,112,176,0.3)"
//                     }}>
//                     <Plus size={14} /> New Meeting
//                   </motion.button>
//                 </div>

//                 {loading ? (
//                   <div style={{ textAlign: "center", padding: "60px 20px" }}>
//                     <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
//                       style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #e8edf4", borderTopColor: "#3a70b0", margin: "0 auto 16px" }} />
//                     <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Loading meeting records…</p>
//                   </div>
//                 ) : meetings.length === 0 ? (
//                   <div style={{ textAlign: "center", padding: "64px 20px" }}>
//                     <div style={{
//                       width: 80, height: 80, borderRadius: "50%",
//                       background: "linear-gradient(135deg,#f0f7ff,#e8edf4)",
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                       margin: "0 auto 18px"
//                     }}>
//                       <CalendarDays size={36} color="#c7d9f5" />
//                     </div>
//                     <p style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#334155", fontFamily: "'Playfair Display', Georgia, serif" }}>No meetings yet</p>
//                     <p style={{ margin: "6px 0 20px", fontSize: "0.84rem", color: "#94a3b8" }}>Schedule your first advisory board meeting to get started.</p>
//                     <motion.button whileHover={{ scale: 1.04 }} onClick={() => setActiveTab("create")}
//                       style={{
//                         background: "linear-gradient(120deg,#0f2744,#3a70b0)",
//                         color: "white", border: "none", borderRadius: 11,
//                         padding: "11px 28px", fontWeight: 600, cursor: "pointer",
//                         boxShadow: "0 8px 24px rgba(58,112,176,0.35)"
//                       }}>
//                       Schedule First Meeting
//                     </motion.button>
//                   </div>
//                 ) : (
//                   <div style={{ overflowX: "auto" }}>
//                     <table className="records-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
//                       <thead>
//                         <tr>
//                           {["Agenda", "Date & Time", "Venue", "Status", "MoM / Notes", "Download"].map(h => (
//                             <th key={h} style={{
//                               padding: "12px 16px", fontSize: "0.72rem",
//                               fontWeight: 700, color: "#64748b",
//                               textTransform: "uppercase", letterSpacing: "0.8px",
//                               borderBottom: "2px solid #e8edf4",
//                               background: "#f8fbff", whiteSpace: "nowrap"
//                             }}>{h}</th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {meetings.map((m, i) => (
//                           <motion.tr key={m.id}
//                             initial={{ opacity: 0, y: 8 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: i * 0.05 }}
//                             style={{ borderBottom: "1px solid #f0f4f9" }}
//                             onMouseEnter={e => e.currentTarget.style.background = "#f8fbff"}
//                             onMouseLeave={e => e.currentTarget.style.background = "transparent"}
//                           >
//                             <td style={{ padding: "16px", maxWidth: 220 }}>
//                               <div style={{ fontWeight: 700, color: "#0f2240", fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Playfair Display', Georgia, serif" }}>
//                                 {m.agenda}
//                               </div>
//                               <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: 2 }}>ID: {m.id.slice(-6)}</div>
//                             </td>
//                             <td style={{ padding: "16px", whiteSpace: "nowrap" }}>
//                               <div style={{ fontWeight: 600, color: "#334155", fontSize: "0.84rem" }}>{m.date}</div>
//                               <div style={{ color: "#94a3b8", fontSize: "0.76rem", marginTop: 1 }}>{m.time}</div>
//                             </td>
//                             <td style={{ padding: "16px", maxWidth: 160 }}>
//                               <div style={{ color: "#64748b", fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.venue}</div>
//                             </td>
//                             <td style={{ padding: "16px" }}>
//                               {m.status === "Scheduled" ? (
//                                 <span style={{
//                                   display: "inline-flex", alignItems: "center", gap: 5,
//                                   background: "#fef9e7", color: "#92400e",
//                                   padding: "5px 11px", borderRadius: 22,
//                                   fontSize: "0.74rem", fontWeight: 700,
//                                   border: "1px solid #fde68a", whiteSpace: "nowrap"
//                                 }}>
//                                   <Clock size={11} /> Scheduled
//                                 </span>
//                               ) : (
//                                 <span style={{
//                                   display: "inline-flex", alignItems: "center", gap: 5,
//                                   background: "#f0fdf4", color: "#065f46",
//                                   padding: "5px 11px", borderRadius: 22,
//                                   fontSize: "0.74rem", fontWeight: 700,
//                                   border: "1px solid #86efac", whiteSpace: "nowrap"
//                                 }}>
//                                   <CheckCircle2 size={11} /> Completed
//                                 </span>
//                               )}
//                             </td>
//                             <td style={{ padding: "16px" }}>
//                               {m.minutesGenerated ? (
//                                 <span style={{
//                                   display: "flex", alignItems: "center", gap: 5,
//                                   color: "#059669", fontWeight: 700, fontSize: "0.78rem", whiteSpace: "nowrap"
//                                 }}>
//                                   <CheckCircle2 size={14} /> Generated
//                                 </span>
//                               ) : (
//                                 <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
//                                   onClick={() => setNotesModalFor(m)}
//                                   style={{
//                                     background: "linear-gradient(120deg,#0f2744,#3a70b0)",
//                                     color: "white", border: "none", borderRadius: 9,
//                                     padding: "7px 14px", cursor: "pointer",
//                                     fontWeight: 600, fontSize: "0.76rem",
//                                     display: "flex", alignItems: "center", gap: 5,
//                                     whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif",
//                                     boxShadow: "0 4px 14px rgba(58,112,176,0.3)"
//                                   }}>
//                                   <Sparkles size={12} /> Write Notes
//                                 </motion.button>
//                               )}
//                             </td>
//                             <td style={{ padding: "16px" }}>
//                               {m.minutesGenerated ? (
//                                 <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
//                                   onClick={() => downloadMinutes(m)}
//                                   style={{
//                                     background: "#10b981", color: "white", border: "none",
//                                     borderRadius: 9, padding: "7px 14px", fontWeight: 600,
//                                     cursor: "pointer", display: "flex", alignItems: "center",
//                                     gap: 5, fontSize: "0.76rem",
//                                     fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
//                                     boxShadow: "0 4px 14px rgba(16,185,129,0.3)"
//                                   }}>
//                                   <Download size={12} /> Download
//                                 </motion.button>




//                               ) : (
//                                 <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#c7d9f5", fontSize: "0.76rem", whiteSpace: "nowrap" }}>
//                                   <FileCheck size={13} /> Not yet
//                                 </span>
//                               )}
//                             </td>
//                           </motion.tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           )} */}





// {activeTab === "records" && (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.35 }}
//   >
//     <div
//       style={{
//         background: "white",
//         borderRadius: 22,
//         padding: "32px",
//         boxShadow: "0 8px 40px rgba(15,39,68,0.09)",
//         border: "1px solid #e8edf4",
//       }}
//     >
//       {/* HEADER */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginBottom: 24,
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div
//             style={{
//               width: 38,
//               height: 38,
//               borderRadius: 11,
//               background: "linear-gradient(135deg,#0f2744,#3a70b0)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <FileText size={18} color="white" />
//           </div>

//           <div>
//             <h2
//               style={{
//                 margin: 0,
//                 color: "#0f2240",
//                 fontSize: "1.1rem",
//                 fontWeight: 700,
//                 fontFamily: "'Playfair Display', Georgia, serif",
//               }}
//             >
//               Meeting Records
//             </h2>
//             <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
//               {meetings.length} total meetings
//             </div>
//           </div>
//         </div>

//         <motion.button
//           whileHover={{ scale: 1.04 }}
//           whileTap={{ scale: 0.96 }}
//           onClick={() => setActiveTab("create")}
//           style={{
//             background: "linear-gradient(120deg,#0f2744,#3a70b0)",
//             color: "white",
//             border: "none",
//             borderRadius: 10,
//             padding: "9px 18px",
//             fontWeight: 600,
//             fontSize: "0.82rem",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             boxShadow: "0 6px 18px rgba(58,112,176,0.3)",
//           }}
//         >
//           <Plus size={14} /> New Meeting
//         </motion.button>
//       </div>

//       {/* EMPTY STATE */}
//       {loading ? (
//         <div style={{ textAlign: "center", padding: "60px 20px" }}>
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{
//               repeat: Infinity,
//               duration: 1.5,
//               ease: "linear",
//             }}
//             style={{
//               width: 44,
//               height: 44,
//               borderRadius: "50%",
//               border: "3px solid #e8edf4",
//               borderTopColor: "#3a70b0",
//               margin: "0 auto 16px",
//             }}
//           />
//           <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
//             Loading meeting records…
//           </p>
//         </div>
//       ) : meetings.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "64px 20px" }}>
//           <div
//             style={{
//               width: 80,
//               height: 80,
//               borderRadius: "50%",
//               background: "linear-gradient(135deg,#f0f7ff,#e8edf4)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               margin: "0 auto 18px",
//             }}
//           >
//             <CalendarDays size={36} color="#c7d9f5" />
//           </div>

//           <p
//             style={{
//               margin: 0,
//               fontSize: "1rem",
//               fontWeight: 700,
//               color: "#334155",
//               fontFamily: "'Playfair Display', Georgia, serif",
//             }}
//           >
//             No meetings yet
//           </p>

//           <p
//             style={{
//               margin: "6px 0 20px",
//               fontSize: "0.84rem",
//               color: "#94a3b8",
//             }}
//           >
//             Schedule your first advisory board meeting to get started.
//           </p>

//           <motion.button
//             whileHover={{ scale: 1.04 }}
//             onClick={() => setActiveTab("create")}
//             style={{
//               background: "linear-gradient(120deg,#0f2744,#3a70b0)",
//               color: "white",
//               border: "none",
//               borderRadius: 11,
//               padding: "11px 28px",
//               fontWeight: 600,
//               cursor: "pointer",
//               boxShadow: "0 8px 24px rgba(58,112,176,0.35)",
//             }}
//           >
//             Schedule First Meeting
//           </motion.button>
//         </div>
//       ) : (
//         /* TABLE */
//         <div style={{ overflowX: "auto" }}>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               textAlign: "left",
//             }}
//           >
//             <thead>
//               <tr>
//                 {[
//                   "Agenda",
//                   "Date & Time",
//                   "Venue",
//                   "Status",
//                   "MoM / Notes",
//                   "Actions",
//                 ].map((h) => (
//                   <th
//                     key={h}
//                     style={{
//                       padding: "12px 16px",
//                       fontSize: "0.72rem",
//                       fontWeight: 700,
//                       color: "#64748b",
//                       textTransform: "uppercase",
//                       letterSpacing: "0.8px",
//                       borderBottom: "2px solid #e8edf4",
//                       background: "#f8fbff",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {meetings.map((m, i) => (
//                 <motion.tr
//                   key={m.id}
//                   initial={{ opacity: 0, y: 8 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: i * 0.05 }}
//                   style={{ borderBottom: "1px solid #f0f4f9" }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.background = "#f8fbff")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.background = "transparent")
//                   }
//                 >
//                   {/* Agenda */}
//                   <td style={{ padding: "16px", maxWidth: 220 }}>
//                     <div
//                       style={{
//                         fontWeight: 700,
//                         color: "#0f2240",
//                         fontSize: "0.88rem",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         whiteSpace: "nowrap",
//                         fontFamily: "'Playfair Display', Georgia, serif",
//                       }}
//                     >
//                       {m.agenda}
//                     </div>
//                   </td>

//                   {/* Date */}
//                   <td style={{ padding: "16px", whiteSpace: "nowrap" }}>
//                     <div
//                       style={{
//                         fontWeight: 600,
//                         color: "#334155",
//                         fontSize: "0.84rem",
//                       }}
//                     >
//                       {m.date}
//                     </div>
//                     <div
//                       style={{
//                         color: "#94a3b8",
//                         fontSize: "0.76rem",
//                       }}
//                     >
//                       {m.time}
//                     </div>
//                   </td>

//                   {/* Venue */}
//                   <td style={{ padding: "16px" }}>
//                     <div
//                       style={{
//                         color: "#64748b",
//                         fontSize: "0.82rem",
//                       }}
//                     >
//                       {m.venue}
//                     </div>
//                   </td>

//                   {/* Status */}
//                   <td style={{ padding: "16px" }}>
//                     {m.status === "Scheduled" ? (
//                       <span
//                         style={{
//                           background: "#fef9e7",
//                           color: "#92400e",
//                           padding: "5px 11px",
//                           borderRadius: 22,
//                           fontSize: "0.74rem",
//                           fontWeight: 700,
//                           border: "1px solid #fde68a",
//                         }}
//                       >
//                         Scheduled
//                       </span>
//                     ) : (
//                       <span
//                         style={{
//                           background: "#f0fdf4",
//                           color: "#065f46",
//                           padding: "5px 11px",
//                           borderRadius: 22,
//                           fontSize: "0.74rem",
//                           fontWeight: 700,
//                           border: "1px solid #86efac",
//                         }}
//                       >
//                         Completed
//                       </span>
//                     )}
//                   </td>

//                   {/* Notes */}
//                   <td style={{ padding: "16px" }}>
//                     {m.minutesGenerated ? (
//                       <span
//                         style={{
//                           color: "#059669",
//                           fontWeight: 700,
//                           fontSize: "0.78rem",
//                         }}
//                       >
//                         Generated
//                       </span>
//                     ) : (
//                       <motion.button
//                         whileHover={{ scale: 1.06 }}
//                         onClick={() => setNotesModalFor(m)}
//                         style={{
//                           background:
//                             "linear-gradient(120deg,#0f2744,#3a70b0)",
//                           color: "white",
//                           border: "none",
//                           borderRadius: 9,
//                           padding: "7px 14px",
//                           fontWeight: 600,
//                           fontSize: "0.76rem",
//                         }}
//                       >
//                         Write Notes
//                       </motion.button>
//                     )}
//                   </td>

//                   {/* ACTIONS */}
//                   <td style={{ padding: "16px" }}>
//                     {m.minutesGenerated ? (
//                       <div style={{ display: "flex", gap: 8 }}>
//                         {/* Download */}
//                         <motion.button
//                           whileHover={{ scale: 1.06 }}
//                           onClick={() => downloadMinutes(m)}
//                           style={{
//                             background: "#10b981",
//                             color: "white",
//                             border: "none",
//                             borderRadius: 9,
//                             padding: "7px 12px",
//                             fontWeight: 600,
//                             fontSize: "0.76rem",
//                           }}
//                         >
//                           <Download size={12} /> Download
//                         </motion.button>

//                         {/* Email */}
//                         {/* <motion.button
//                           whileHover={{ scale: 1.04 }}
//                           onClick={() => handleEmailPDF(m)}
//                           style={{
//                             background: "#0ea5e9",
//                             color: "white",
//                             border: "none",
//                             borderRadius: 9,
//                             padding: "7px 12px",
//                             fontWeight: 600,
//                             fontSize: "0.76rem",
//                           }}
//                         >
//                           <Mail size={12} /> Email
//                         </motion.button> */}
//                       </div>
//                     ) : (
//                       <span style={{ color: "#c7d9f5", fontSize: "0.76rem" }}>
//                         Not yet
//                       </span>
//                     )}
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   </motion.div>
// )}











//         </div>

//         {/* Footer */}
//         {/* <footer style={{
//           background: "linear-gradient(110deg,#050f23,#0a1e3d)",
//           padding: "20px 40px", marginTop: 40,
//           borderTop: "1px solid rgba(79,156,249,0.15)"
//         }}>
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#3a70b0,#4f9cf9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <Zap size={13} color="white" />
//               </div>
//               <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: "white", fontSize: "0.95rem" }}>
//                 CollaXion
//               </span>
//             </div>
//             <div style={{ color: "rgba(130,160,200,0.6)", fontSize: "0.74rem" }}>
//               © 2026 CollaXion
//             </div>
//             <div style={{ display: "flex", gap: 16 }}>
//               {["Privacy", "Terms", "Support"].map(l => (
//                 <span key={l} style={{ color: "rgba(130,160,200,0.5)", fontSize: "0.74rem", cursor: "pointer" }}>{l}</span>
//               ))}
//             </div>
//           </div>
//         </footer> */}




//         <footer
//   style={{
//     background: "linear-gradient(110deg,#050f23,#0a1e3d)",
//     padding: "20px 40px",
//     marginTop: 40,
//     borderTop: "1px solid rgba(79,156,249,0.15)",
//   }}
// >
//   <div
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       flexWrap: "wrap",
//       gap: 12,
//     }}
//   >
//     {/* Logo + Brand */}
//     <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//       <div
//         style={{
//           width: 28,
//           height: 28,
//           borderRadius: 8,
//           overflow: "hidden",
//           boxShadow: "0 3px 12px rgba(79,156,249,0.4)",
//           flexShrink: 0,
//         }}
//       >
//         <img
//           src="../../src/images/collaxionlogo.jpeg"
//           alt="CollaXion Logo"
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//           }}
//         />
//       </div>

//       <span
//         style={{
//           fontFamily: "'Playfair Display', Georgia, serif",
//           fontWeight: 700,
//           color: "white",
//           fontSize: "0.95rem",
//         }}
//       >
//         CollaXion
//       </span>
//     </div>

//     {/* Copyright */}
//     <div
//       style={{
//         color: "rgba(130,160,200,0.6)",
//         fontSize: "0.74rem",
//       }}
//     >
//      © 2026 CollaXion. Where collaboration meets innovation.

//     </div>

//     {/* Links */}
//     {/* <div style={{ display: "flex", gap: 16 }}>
//       {["Privacy", "Terms", "Support"].map((l) => (
//         <span
//           key={l}
//           style={{
//             color: "rgba(130,160,200,0.5)",
//             fontSize: "0.74rem",
//             cursor: "pointer",
//             transition: "0.2s",
//           }}
//           onMouseOver={(e) =>
//             (e.target.style.color = "#4f9cf9")
//           }
//           onMouseOut={(e) =>
//             (e.target.style.color = "rgba(130,160,200,0.5)")
//           }
//         >
//           {l}
//         </span>
//       ))}
//     </div> */}
//   </div>
// </footer>
//       </div>
//     </>
//   );
// };

// export default AdvisoryMeeting;









import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  CalendarDays, Users, FileText, CheckCircle2, Clock, Send, Mail,
  Download, FileCheck, Loader, Sparkles, PenLine, X, ChevronRight,
  Bot, ClipboardList, AlertCircle, Plus, Trash2, UserPlus, Camera,
  Bell, CheckCheck, MailCheck, Eye, EyeOff, Search, Award, Globe,
  Briefcase, Star, TrendingUp, Shield, Zap, ChevronDown, Menu
} from "lucide-react";

const API_BASE = "http://localhost:5000/api/meeting-minutes";
const EMAIL_BASE = "http://localhost:5000/api/email";

/* ─── Avatar helpers ─── */
const getProfessionalAvatar = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d47a1&color=ffffff&size=200&bold=true&font-size=0.4`;
};

const AVATAR_COLORS = [
  ["#0a1628","#4f9cf9"],["#0d2818","#4ade80"],["#2d1b69","#a78bfa"],
  ["#7c2d12","#fb923c"],["#0c2340","#60a5fa"],["#451a03","#fcd34d"],
];
const getAvatarColor = (name) => {
  let hash = 0;
  for (let c of (name||"")) hash = c.charCodeAt(0) + ((hash<<5)-hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const Avatar = ({ name, image, size=38 }) => {
  const [bg,fg] = getAvatarColor(name);
  const initials = (name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const [imgError, setImgError] = useState(false);
  const src = image || getProfessionalAvatar(name);
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:size*0.36,fontWeight:700,color:fg,overflow:"hidden",boxShadow:`0 0 0 2px ${fg}44`}}>
      {!imgError ? (
        <img src={src} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={()=>setImgError(true)} />
      ) : initials}
    </div>
  );
};

/* ─── Default board members (core) ─── */
const DEFAULT_BOARD = [
  { id:"bm1", name:"Dr. Ahmad Raza", role:"Dean / Chairperson", email:"sabahatqadeerbhati@gmail.com", isFixed:true,
    image:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face" },
  { id:"bm2", name:"Prof. Sara Malik", role:"Head of Department", email:"amnajamil445@gmail.com", isFixed:true,
    image:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face" },
  { id:"bm3", name:"Mr. Bilal Hashmi", role:"Industry Liaison Officer", email:"sabahatqadeerbhati@gmail.com", isFixed:true,
    image:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
];

const SUGGESTED_REPS = [
  { id:"sr1", name:"Ali Khan", org:"ABC Tech", role:"Industry Partner", email:"sabahatqadeerbhati@gmail.com",
    image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
  { id:"sr2", name:"Sara Ahmed", org:"Innovate Labs", role:"Industry Expert", email:"amnajamil445@gmail.com",
    image:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face" },
  { id:"sr3", name:"Bilal Rehman", org:"FutureVision Ltd", role:"Technology Advisor", email:"sabahatqadeerbhati@gmail.com",
    image:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" },
  { id:"sr4", name:"Ayesha Noor", org:"TechSphere", role:"Product Strategist", email:"amnajamil445@gmail.com",
    image:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
  { id:"sr5", name:"Omar Siddiqui", org:"DataNest", role:"Data Scientist", email:"sabahatqadeerbhati@gmail.com",
    image:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face" },
];

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isEmpty = (v) => !v || !String(v).trim();

/* ─── PDF generation ─── */
const sanitize = (t) => (t==null?"":String(t)
  .replace(/[\u2013\u2014]/g,"-").replace(/[\u2018\u2019]/g,"'")
  .replace(/[\u201C\u201D]/g,'"').replace(/\u2022/g,"-")
  .replace(/\u2026/g,"...").replace(/\u00A0/g," ")
  .replace(/[^\x00-\xFF]/g,"?"));

const callClaudeForMinutes = async (roughNotes, meetingMeta) => {
  const systemPrompt = `You are a professional meeting secretary. Always respond with ONLY valid JSON — no markdown, no backticks, no preamble. Schema: {"meetingTitle":"string","summary":"string","keyDecisions":[{"id":1,"decision":"string","rationale":"string"}],"actionItems":[{"id":1,"task":"string","responsible":"string","deadline":"string","priority":"High|Medium|Low"}],"discussionPoints":["string"],"nextSteps":"string","nextMeetingNote":"string"}`;
  const userPrompt = `Meeting Details:\n- Agenda: ${meetingMeta.agenda}\n- Date: ${meetingMeta.date}\n- Time: ${meetingMeta.time}\n- Venue: ${meetingMeta.venue}\n- Attendees: ${meetingMeta.boardMembers.map(b=>`${b.name} (${b.role})`).join(", ")}\n\nRough Notes:\n${roughNotes}\n\nReturn ONLY JSON.`;
  const resp = await fetch("http://localhost:5000/api/generate-minutes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({systemPrompt,userPrompt})});
  const raw = await resp.text();
  if(!resp.ok) throw new Error(`Server ${resp.status}`);
  const data = JSON.parse(raw);
  const content = data.content;
  if(!content) throw new Error("Empty AI response");
  if(typeof content==="object") return content;
  const cleaned = content.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
  try { return JSON.parse(cleaned); } catch { const m=cleaned.match(/\{[\s\S]*\}/); if(m) return JSON.parse(m[0]); throw new Error("Invalid JSON"); }
};

const createMinutesPDF = async (minutesData, meetingMeta) => {
  const { PDFDocument, rgb, StandardFonts } = await import("https://cdn.jsdelivr.net/esm/pdf-lib@1.17.1");
  const doc=await PDFDocument.create();
  const regular=await doc.embedFont(StandardFonts.Helvetica);
  const bold=await doc.embedFont(StandardFonts.HelveticaBold);
  const italic=await doc.embedFont(StandardFonts.HelveticaOblique);
  const navy=rgb(0.06,0.16,0.28),navyDk=rgb(0.04,0.10,0.20),blue=rgb(0.16,0.50,0.73),blueLt=rgb(0.84,0.92,0.97),green=rgb(0.15,0.68,0.38),greenLt=rgb(0.83,0.94,0.87),amber=rgb(0.95,0.61,0.07),amberLt=rgb(0.99,0.95,0.83),red=rgb(0.75,0.22,0.17),redLt=rgb(0.98,0.86,0.85),white=rgb(1,1,1),offWh=rgb(0.97,0.975,0.982),black=rgb(0.12,0.12,0.14),gray=rgb(0.44,0.47,0.51),grayMd=rgb(0.72,0.74,0.77),grayLt=rgb(0.91,0.92,0.94),div=rgb(0.87,0.89,0.92);
  const W=612,H=792,ML=50,MB=52,CW=W-ML*2;
  let page,y;
  const wrap=(text,maxW,size)=>{const cpp=Math.max(1,Math.floor(maxW/(size*0.545)));const words=sanitize(text).split(" ");let line="",out=[];for(const w of words){const t=line?line+" "+w:w;if(t.length>cpp&&line){out.push(line);line=w;}else line=t;}if(line)out.push(line);return out;};
  const T=(text,opts={})=>{const{x=ML,size=10,font=regular,color=black,maxW=CW,lh=1.55,dx=0}=opts;const lines=wrap(text,maxW-dx,size);for(const l of lines){if(y-size-2<MB){footerOn();addPage();headerOn();}page.drawText(l,{x:x+dx,y:y-size,font,size,color});y-=size*lh;}};
  const addPage=()=>{page=doc.addPage([W,H]);y=H-50;};
  const headerOn=()=>{page.drawRectangle({x:0,y:H-32,width:W,height:32,color:navyDk});page.drawRectangle({x:0,y:H-32,width:5,height:32,color:blue});page.drawText("ADVISORY BOARD MEETING MINUTES",{x:ML+4,y:H-21,font:bold,size:8,color:rgb(0.65,0.76,0.87)});page.drawText("CollaXion",{x:W-ML-44,y:H-21,font:bold,size:9,color:blue});y=H-46;};
  const footerOn=()=>{page.drawLine({start:{x:ML,y:MB-6},end:{x:W-ML,y:MB-6},thickness:0.5,color:grayLt});page.drawText("CollaXion — Confidential Advisory Board Record",{x:ML,y:MB-18,font:italic,size:7,color:grayMd});};
  const need=(h)=>{if(y-h<MB+10){footerOn();addPage();headerOn();}};
  const heading=(title)=>{need(36);page.drawRectangle({x:ML,y:y-28,width:5,height:28,color:blue});page.drawRectangle({x:ML+5,y:y-28,width:CW-5,height:28,color:offWh});page.drawText(sanitize(title).toUpperCase(),{x:ML+14,y:y-18,font:bold,size:9.5,color:navy});y-=36;};
  const pill=(label,px,py)=>{const map={High:[redLt,red],Medium:[amberLt,amber],Low:[greenLt,green]};const[bg,fg]=map[label]||map.Medium;const pw=label.length*5.6+14;page.drawRectangle({x:px,y:py-10,width:pw,height:12,color:bg});page.drawText(sanitize(label),{x:px+7,y:py-7,font:bold,size:7.5,color:fg});};
  addPage();
  const COVER_H=210;
  page.drawRectangle({x:0,y:H-COVER_H,width:W,height:COVER_H,color:navyDk});
  page.drawRectangle({x:W-10,y:H-COVER_H,width:10,height:COVER_H,color:blue});
  page.drawRectangle({x:0,y:H-30,width:W-10,height:30,color:navy});
  page.drawText("OFFICIAL DOCUMENT  |  ADVISORY BOARD",{x:ML,y:H-20,font:bold,size:7,color:rgb(0.5,0.66,0.82)});
  page.drawText(sanitize(new Date().toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})),{x:W-ML-200,y:H-20,font:regular,size:7,color:rgb(0.5,0.66,0.82)});
  page.drawLine({start:{x:ML,y:H-32},end:{x:W-20,y:H-32},thickness:0.4,color:rgb(0.22,0.35,0.50)});
  page.drawText("CollaXion",{x:ML,y:H-62,font:bold,size:24,color:blue});
  page.drawText("Advisory Board",{x:ML,y:H-85,font:regular,size:12,color:rgb(0.72,0.82,0.91)});
  page.drawText("Meeting Minutes",{x:ML,y:H-108,font:bold,size:30,color:white});
  page.drawLine({start:{x:ML,y:H-122},end:{x:W-22,y:H-122},thickness:0.5,color:rgb(0.22,0.35,0.50)});
  const mtLines=wrap(minutesData.meetingTitle||meetingMeta.agenda||"Advisory Board Meeting",CW-20,11.5);
  let mtY=H-140;
  for(const ln of mtLines.slice(0,3)){page.drawText(sanitize(ln),{x:ML,y:mtY,font:bold,size:11.5,color:rgb(0.83,0.90,0.96)});mtY-=17;}
  const cardTop=H-COVER_H-16,cardH=46,cardW=(CW-12)/3;
  [{label:"DATE",val:meetingMeta.date||"—"},{label:"TIME",val:meetingMeta.time||"—"},{label:"VENUE",val:meetingMeta.venue||"—"}].forEach((c,i)=>{const cx=ML+i*(cardW+6);page.drawRectangle({x:cx+1,y:cardTop-cardH-1,width:cardW,height:cardH,color:grayLt});page.drawRectangle({x:cx,y:cardTop-cardH,width:cardW,height:cardH,color:white});page.drawRectangle({x:cx,y:cardTop-3,width:cardW,height:3,color:blue});page.drawText(c.label,{x:cx+8,y:cardTop-13,font:bold,size:7,color:blue});const vw=wrap(sanitize(c.val),cardW-16,10);vw.slice(0,2).forEach((vl,vi)=>{page.drawText(vl,{x:cx+8,y:cardTop-26-vi*13,font:bold,size:10,color:navy});});});
  y=cardTop-cardH-22;
  if(minutesData.summary){need(50);y-=6;heading("Executive Summary");const sumLines=wrap(minutesData.summary,CW-18,9.5);const boxH=sumLines.length*14+16;need(boxH+8);page.drawRectangle({x:ML,y:y-boxH,width:4,height:boxH,color:blue});page.drawRectangle({x:ML+4,y:y-boxH,width:CW-4,height:boxH,color:rgb(0.96,0.97,0.99)});y-=10;T(minutesData.summary,{font:italic,size:9.5,color:gray,dx:14});y-=6;}
  y-=4;heading("Attendees");
  const half=CW/2;
  meetingMeta.boardMembers.forEach((m,i)=>{const col=i%2,ax=ML+col*half;if(col===0)need(30);page.drawCircle({x:ax+7,y:y-8,size:3.5,color:blue});page.drawText(sanitize(m.name),{x:ax+18,y:y-11,font:bold,size:9.5,color:navy});page.drawText(sanitize(m.role),{x:ax+18,y:y-22,font:regular,size:8,color:gray});if(col===1||i===meetingMeta.boardMembers.length-1)y-=30;});
  y-=8;
  if((minutesData.keyDecisions||[]).length>0){y-=4;heading("Key Decisions");(minutesData.keyDecisions||[]).forEach((d,i)=>{need(48);page.drawRectangle({x:ML,y:y-22,width:22,height:22,color:navy});page.drawText(String(i+1),{x:ML+(i>=9?5:7),y:y-15,font:bold,size:9,color:white});T(sanitize(d.decision),{font:bold,size:9.5,color:black,dx:30});if(d.rationale)T("Rationale: "+sanitize(d.rationale),{font:italic,size:8.5,color:gray,dx:30});page.drawLine({start:{x:ML+28,y:y},end:{x:W-ML,y:y},thickness:0.35,color:div});y-=8;});y-=4;}
  if((minutesData.actionItems||[]).length>0){y-=4;heading("Action Items");need(22);page.drawRectangle({x:ML,y:y-20,width:CW,height:20,color:navy});const COL={num:ML+6,task:ML+22,resp:ML+240,dl:ML+360,pri:ML+458};[["#",COL.num],["Task",COL.task],["Responsible",COL.resp],["Deadline",COL.dl],["Priority",COL.pri]].forEach(([lbl,lx])=>{page.drawText(lbl,{x:lx,y:y-13,font:bold,size:8,color:white});});y-=20;(minutesData.actionItems||[]).forEach((a,i)=>{need(32);const rH=30,bg=i%2===0?white:offWh;page.drawRectangle({x:ML,y:y-rH,width:CW,height:rH,color:bg});page.drawRectangle({x:ML,y:y-rH,width:4,height:rH,color:blueLt});page.drawLine({start:{x:ML,y:y-rH},end:{x:W-ML,y:y-rH},thickness:0.3,color:div});page.drawText(String(i+1),{x:COL.num,y:y-18,font:bold,size:8,color:gray});const tLines=wrap(sanitize(a.task),210,8.5);tLines.slice(0,2).forEach((tl,ti)=>{page.drawText(tl,{x:COL.task,y:y-11-ti*11,font:bold,size:8.5,color:black});});const rLines=wrap(sanitize(a.responsible||"TBD"),110,8);rLines.slice(0,2).forEach((rl,ri)=>{page.drawText(rl,{x:COL.resp,y:y-11-ri*10,font:regular,size:8,color:navy});});page.drawText(sanitize(a.deadline||"TBD"),{x:COL.dl,y:y-14,font:regular,size:8,color:gray});pill(a.priority||"Medium",COL.pri,y-10);y-=rH;});y-=10;}
  if((minutesData.discussionPoints||[]).length>0){y-=4;heading("Points of Discussion");(minutesData.discussionPoints||[]).forEach((pt)=>{need(22);page.drawRectangle({x:ML,y:y-8,width:5,height:5,color:blue});T(sanitize(pt),{size:9.5,color:black,dx:14});y-=3;});y-=4;}
  if(minutesData.nextSteps){y-=4;heading("Next Steps");T(sanitize(minutesData.nextSteps),{size:9.5,color:black});y-=6;}
  if(minutesData.nextMeetingNote){need(50);y-=6;const nmLines=wrap(sanitize(minutesData.nextMeetingNote),CW-26,9.5);const nmH=nmLines.length*14+20;page.drawRectangle({x:ML,y:y-nmH,width:CW,height:nmH,color:blueLt});page.drawRectangle({x:ML,y:y-nmH,width:5,height:nmH,color:blue});page.drawText("NEXT MEETING",{x:ML+14,y:y-13,font:bold,size:7.5,color:blue});y-=18;T(sanitize(minutesData.nextMeetingNote),{font:regular,size:9.5,color:navy,dx:14});y-=10;}
  need(75);y-=12;page.drawLine({start:{x:ML,y},end:{x:W-ML,y},thickness:0.5,color:grayLt});y-=24;
  ["Chairperson","Secretary / Recorder","Date Approved"].forEach((lbl,i)=>{const sx=ML+i*(CW/3);page.drawLine({start:{x:sx,y:y-18},end:{x:sx+CW/3-18,y:y-18},thickness:0.7,color:grayMd});page.drawText(lbl,{x:sx,y:y-30,font:regular,size:7.5,color:gray});});
  footerOn();
  const totalPages=doc.getPageCount();
  for(let pi=0;pi<totalPages;pi++){const pg=doc.getPage(pi);pg.drawRectangle({x:W-ML-50,y:MB-22,width:52,height:12,color:white});pg.drawText(`Page ${pi+1} of ${totalPages}`,{x:W-ML-50,y:MB-18,font:bold,size:7,color:grayMd});}
  const bytes=await doc.save();
  return { url:URL.createObjectURL(new Blob([bytes],{type:"application/pdf"})), bytes };
};

/* ═══ MEMBER CARD ═══ */
const MemberCard = ({ member, removable, onRemove, onImageUpload, compact=false }) => {
  const fileRef = useRef();
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(14,30,60,0.18)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: hovered
          ? "linear-gradient(135deg,#0f2744 0%,#1a3a5c 100%)"
          : "linear-gradient(135deg,#ffffff 0%,#f7f9fc 100%)",
        border: hovered ? "1px solid #3a70b0" : "1px solid #e8edf4",
        borderRadius: 16, padding: compact ? "14px 16px" : "18px 20px",
        display: "flex", alignItems: "center", gap: 14,
        position: "relative", cursor: "default", transition: "all 0.25s ease"
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: compact ? 42 : 52, height: compact ? 42 : 52,
          borderRadius: "50%", overflow: "hidden",
          boxShadow: hovered ? "0 0 0 3px #4f9cf9" : "0 0 0 2px #dde3ec",
          transition: "box-shadow 0.25s"
        }}>
          <Avatar name={member.name} image={member.image} size={compact ? 42 : 52} />
        </div>
        {onImageUpload && (
          <motion.button
            whileHover={{ scale: 1.2 }}
            onClick={() => fileRef.current?.click()}
            style={{
              position: "absolute", bottom: -2, right: -2,
              width: 20, height: 20, borderRadius: "50%",
              background: "#4f9cf9", border: "2px solid white",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(79,156,249,0.5)"
            }}
          >
            <Camera size={9} color="white" />
          </motion.button>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
          const f = e.target.files?.[0]; if (!f) return;
          const reader = new FileReader();
          reader.onload = ev => onImageUpload && onImageUpload(member.id, ev.target.result);
          reader.readAsDataURL(f);
        }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 700, fontSize: compact ? "0.84rem" : "0.92rem",
          color: hovered ? "#e8f0fb" : "#0f2240",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          transition: "color 0.25s", fontFamily: "'Playfair Display', Georgia, serif"
        }}>{member.name}</div>
        <div style={{
          color: hovered ? "#7db3e8" : "#64748b",
          fontSize: "0.74rem", marginTop: 2,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          transition: "color 0.25s"
        }}>{member.role}{member.org ? ` · ${member.org}` : ""}</div>
        {member.email && (
          <div style={{
            color: hovered ? "#4f9cf9" : "#94a3b8",
            fontSize: "0.68rem", marginTop: 2,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            transition: "color 0.25s"
          }}>{member.email}</div>
        )}
      </div>
      {member.isFixed && (
        <div style={{
          background: hovered ? "rgba(79,156,249,0.2)" : "#eef4ff",
          borderRadius: 6, padding: "2px 7px",
          fontSize: "0.65rem", fontWeight: 700,
          color: hovered ? "#7db3e8" : "#3a70b0",
          transition: "all 0.25s"
        }}>CORE</div>
      )}
      {removable && (
        <motion.button
          whileHover={{ scale: 1.15, background: "#fca5a5" }}
          onClick={onRemove}
          style={{
            background: "#fee2e2", border: "none", borderRadius: "8px",
            width: 28, height: 28, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", flexShrink: 0
          }}
        >
          <Trash2 size={12} color="#ef4444" />
        </motion.button>
      )}
    </motion.div>
  );
};

/* ═══ INVITE MODAL ═══ */
const InviteModal = ({ meeting, onClose, onSent }) => {
  const [selected, setSelected] = useState([]);
  const [custom, setCustom] = useState([]);
  const [newName, setNewName] = useState(""); const [newEmail, setNewEmail] = useState("");
  const [newOrg, setNewOrg] = useState(""); const [newRole, setNewRole] = useState("");
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  const toggle = (rep) => setSelected(p => p.find(r => r.id === rep.id) ? p.filter(r => r.id !== rep.id) : [...p, rep]);
  const isSelected = (rep) => !!selected.find(r => r.id === rep.id);

  const validateAdd = () => {
    const e = {};
    if (isEmpty(newName)) e.name = "Name required";
    if (isEmpty(newEmail)) e.email = "Email required";
    else if (!isEmail(newEmail)) e.email = "Invalid email";
    setErrors(e); return Object.keys(e).length === 0;
  };
  const addCustom = () => {
    if (!validateAdd()) return;
    const rep = { id: "c" + Date.now(), name: newName, email: newEmail, org: newOrg || "—", role: newRole || "Guest", image: null, isCustom: true };
    setCustom(p => [...p, rep]); setSelected(p => [...p, rep]);
    setNewName(""); setNewEmail(""); setNewOrg(""); setNewRole(""); setErrors({});
  };

  const filtered = SUGGESTED_REPS.filter(r =>
    r.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    r.org.toLowerCase().includes(searchQ.toLowerCase())
  );

  const sendAll = async () => {
    if (selected.length === 0) { alert("Select at least one person."); return; }
    setSending(true);
    const results = await Promise.all(selected.map(async rep => {
      try {
        const r = await fetch(`${EMAIL_BASE}/send-invitation`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: rep.email, name: rep.name, agenda: meeting.agenda, date: meeting.date, time: meeting.time, venue: meeting.venue, meetingId: meeting.id })
        });
        const d = await r.json();
        return { ...rep, ok: d.success };
      } catch (e) { return { ...rep, ok: false }; }
    }));
    setSending(false); setSent(true);
    onSent(results);
  };

  const inpStyle = {
    width: "100%", boxSizing: "border-box", padding: "10px 14px",
    border: "1.5px solid #dde3ec", borderRadius: "10px",
    fontSize: "0.83rem", fontFamily: "inherit", outline: "none",
    color: "#0f2240", background: "#f8fbff", transition: "all 0.2s"
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(5,15,35,0.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:"20px" }}>
      <motion.div
        initial={{ scale:0.88, opacity:0, y:30 }}
        animate={{ scale:1, opacity:1, y:0 }}
        exit={{ scale:0.88, opacity:0, y:20 }}
        transition={{ type:"spring", damping:22, stiffness:280 }}
        style={{ background:"#ffffff", borderRadius:24, width:780, maxWidth:"100%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 40px 100px rgba(0,0,0,0.35)", border:"1px solid #dde3ec" }}
      >
        <div style={{ background:"linear-gradient(130deg,#050f23 0%,#0f2744 50%,#1a4570 100%)", padding:"24px 30px", borderRadius:"24px 24px 0 0", display:"flex", alignItems:"center", gap:14, position:"sticky", top:0, zIndex:10 }}>
          <div style={{ width:46, height:46, borderRadius:14, background:"rgba(79,156,249,0.2)", border:"1px solid rgba(79,156,249,0.4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Mail size={22} color="#7db3e8" />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:"white", fontWeight:700, fontSize:"1.05rem", fontFamily:"'Playfair Display', Georgia, serif" }}>Send Meeting Invitations</div>
            <div style={{ color:"rgba(150,180,230,0.8)", fontSize:"0.78rem", marginTop:2 }}>{meeting.agenda} — {meeting.date}</div>
          </div>
          {selected.length > 0 && (
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} style={{ background:"rgba(79,156,249,0.25)", borderRadius:20, padding:"4px 14px", color:"#7db3e8", fontSize:"0.78rem", fontWeight:700, border:"1px solid rgba(79,156,249,0.3)" }}>
              {selected.length} selected
            </motion.div>
          )}
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"6px 8px", cursor:"pointer", color:"white", display:"flex", alignItems:"center" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding:"26px 30px" }}>
          {!sent ? (
            <>
              <div style={{ position:"relative", marginBottom:18 }}>
                <Search size={15} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }} />
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search by name or organisation…" style={{ ...inpStyle, paddingLeft:38 }} />
              </div>
              <div style={{ fontWeight:700, color:"#0f2240", fontSize:"0.82rem", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
                <Star size={13} color="#f59e0b" /> System Suggested Representatives
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:10, marginBottom:22 }}>
                {filtered.map(rep => (
                  <motion.div key={rep.id} whileTap={{ scale:0.97 }} onClick={()=>toggle(rep)}
                    style={{ padding:"13px 15px", borderRadius:14, border:`2px solid ${isSelected(rep)?"#3a70b0":"#e8edf4"}`, background:isSelected(rep)?"linear-gradient(135deg,#eff6ff,#dbeafe)":"#f8fbff", cursor:"pointer", display:"flex", alignItems:"center", gap:11, transition:"all 0.2s" }}>
                    <div style={{ borderRadius:"50%", overflow:"hidden", width:40, height:40, flexShrink:0, boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}>
                      <Avatar name={rep.name} image={rep.image} size={40} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, color:"#0f2240", fontSize:"0.83rem" }}>{rep.name}</div>
                      <div style={{ color:"#64748b", fontSize:"0.72rem" }}>{rep.org} · {rep.role}</div>
                      <div style={{ color:"#94a3b8", fontSize:"0.67rem" }}>{rep.email}</div>
                    </div>
                    <div style={{ width:22, height:22, borderRadius:"50%", border:`2px solid ${isSelected(rep)?"#3a70b0":"#cbd5e1"}`, background:isSelected(rep)?"#3a70b0":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {isSelected(rep) && <CheckCheck size={12} color="white" />}
                    </div>
                  </motion.div>
                ))}
              </div>
              {custom.length > 0 && (
                <>
                  <div style={{ fontWeight:700, color:"#0f2240", fontSize:"0.82rem", marginBottom:10 }}>✅ Added by You</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:10, marginBottom:20 }}>
                    {custom.map(rep => (
                      <div key={rep.id} onClick={()=>toggle(rep)} style={{ padding:"11px 13px", borderRadius:12, border:`2px solid ${isSelected(rep)?"#3a70b0":"#e8edf4"}`, background:isSelected(rep)?"#eff6ff":"#f8fbff", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
                        <Avatar name={rep.name} size={34} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:700, color:"#0f2240", fontSize:"0.81rem" }}>{rep.name}</div>
                          <div style={{ color:"#64748b", fontSize:"0.7rem" }}>{rep.org} · {rep.role}</div>
                        </div>
                        {isSelected(rep) && <CheckCheck size={14} color="#3a70b0" />}
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div style={{ background:"linear-gradient(135deg,#f0f7ff,#e8f0fb)", border:"1px solid #c7d9f5", borderRadius:16, padding:"18px 20px", marginBottom:22 }}>
                <div style={{ fontWeight:700, color:"#0f2240", fontSize:"0.83rem", marginBottom:13, display:"flex", alignItems:"center", gap:7 }}>
                  <UserPlus size={14} color="#3a70b0" /> Add External Representative
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                  <div>
                    <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Full Name *" style={{ ...inpStyle, borderColor:errors.name?"#ef4444":"#dde3ec" }} />
                    {errors.name && <div style={{ color:"#ef4444", fontSize:"0.7rem", marginTop:3 }}>{errors.name}</div>}
                  </div>
                  <div>
                    <input value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="Email Address *" style={{ ...inpStyle, borderColor:errors.email?"#ef4444":"#dde3ec" }} />
                    {errors.email && <div style={{ color:"#ef4444", fontSize:"0.7rem", marginTop:3 }}>{errors.email}</div>}
                  </div>
                  <input value={newOrg} onChange={e=>setNewOrg(e.target.value)} placeholder="Organisation" style={inpStyle} />
                  <input value={newRole} onChange={e=>setNewRole(e.target.value)} placeholder="Role / Title" style={inpStyle} />
                </div>
                <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={addCustom}
                  style={{ background:"linear-gradient(120deg,#0f2744,#3a70b0)", color:"white", border:"none", borderRadius:9, padding:"8px 20px", fontSize:"0.8rem", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                  <Plus size={13} /> Add & Select
                </motion.button>
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", gap:10, paddingTop:14, borderTop:"1px solid #f0f4f9" }}>
                <button onClick={onClose} style={{ padding:"10px 22px", borderRadius:11, border:"1.5px solid #dde3ec", background:"white", color:"#64748b", fontWeight:500, cursor:"pointer", fontSize:"0.85rem" }}>Cancel</button>
                <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={sendAll} disabled={sending||selected.length===0}
                  style={{ padding:"10px 24px", borderRadius:11, border:"none", background:selected.length>0?"linear-gradient(120deg,#0f2744,#3a70b0)":"#e2e8f0", color:selected.length>0?"white":"#94a3b8", fontWeight:600, cursor:selected.length>0?"pointer":"not-allowed", display:"flex", alignItems:"center", gap:7, fontSize:"0.84rem", opacity:sending?0.8:1, boxShadow:selected.length>0?"0 8px 24px rgba(58,112,176,0.35)":"none" }}>
                  {sending ? <><Loader size={14} /> Sending…</> : <><Send size={14} /> Send {selected.length>0?`to ${selected.length}`:"Invitations"}</>}
                </motion.button>
              </div>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"50px 20px" }}>
              <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", damping:12, stiffness:200 }}
                style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#d1fae5,#a7f3d0)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", boxShadow:"0 10px 30px rgba(5,150,105,0.25)" }}>
                <MailCheck size={30} color="#059669" />
              </motion.div>
              <div style={{ fontWeight:700, fontSize:"1.15rem", color:"#0f2240", marginBottom:8, fontFamily:"'Playfair Display', Georgia, serif" }}>Invitations Dispatched!</div>
              <div style={{ color:"#64748b", fontSize:"0.87rem", marginBottom:26 }}>Email invitations sent to {selected.length} representative(s).</div>
              <motion.button whileHover={{ scale:1.04 }} onClick={onClose}
                style={{ background:"linear-gradient(120deg,#0f2744,#3a70b0)", color:"white", border:"none", borderRadius:11, padding:"11px 32px", fontWeight:600, cursor:"pointer", boxShadow:"0 8px 24px rgba(58,112,176,0.35)" }}>Done</motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ═══ NOTES MODAL ═══ */
const editInput = { width:"100%", boxSizing:"border-box", padding:"9px 13px", border:"1.5px solid #dde3ec", borderRadius:9, fontSize:"0.83rem", fontFamily:"inherit", outline:"none", color:"#0f2240", background:"#f8fbff", transition:"border-color 0.2s" };
const editTextarea = { ...editInput, resize:"vertical", minHeight:64, lineHeight:1.6 };
const sectionLabel = { fontWeight:700, color:"#0f2240", fontSize:"0.83rem", marginBottom:9, display:"flex", alignItems:"center", justifyContent:"space-between" };
const addBtnStyle = { background:"#eef4ff", color:"#3a70b0", border:"1px solid #c7d9f5", borderRadius:7, padding:"4px 12px", fontSize:"0.74rem", fontWeight:600, cursor:"pointer" };
const remBtnStyle = { background:"none", border:"none", color:"#ef4444", cursor:"pointer", padding:"3px 5px", borderRadius:5, fontSize:"0.75rem", flexShrink:0 };

const NotesModal = ({ meeting, onClose, onGenerated }) => {
  const [notes, setNotes] = useState("");
  const [phase, setPhase] = useState("write");
  const [errorMsg, setErrorMsg] = useState("");
  const [editData, setEditData] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [pdfBytes, setPdfBytes] = useState(null);
  const [isRegen, setIsRegen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const chars = notes.trim().length;
  const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const uf = (f, v) => setEditData(p => ({ ...p, [f]: v }));
  const ud = (id, f, v) => setEditData(p => ({ ...p, keyDecisions: p.keyDecisions.map(d => d.id===id?{...d,[f]:v}:d) }));
  const ua = (id, f, v) => setEditData(p => ({ ...p, actionItems: p.actionItems.map(a => a.id===id?{...a,[f]:v}:a) }));
  const udp = (i, v) => setEditData(p => ({ ...p, discussionPoints: p.discussionPoints.map((d,idx)=>idx===i?v:d) }));

  const sendToAI = async () => {
    if (chars < 30) return;
    setPhase("processing");
    try {
      const s = await callClaudeForMinutes(notes, meeting);
      setEditData(JSON.parse(JSON.stringify(s)));
      setPhase("edit");
    } catch (e) { setErrorMsg(e.message||"Error"); setPhase("error"); }
  };

  const genPDF = async () => {
    setIsRegen(true);
    try {
      const { url, bytes } = await createMinutesPDF(editData, meeting);
      setDownloadUrl(url); setPdfBytes(bytes);
      setIsRegen(false);
      return { url, bytes };
    } catch (e) { setIsRegen(false); alert("PDF error: "+e.message); return null; }
  };

  const handleDownloadSave = async () => {
    const res = await genPDF(); if (!res) return;
    const a = document.createElement("a"); a.href=res.url;
    a.download=`Minutes_${meeting.agenda.replace(/\s+/g,"_")}_${meeting.date}.pdf`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    await saveToBackend(res);
    onGenerated(meeting.id, editData, res.url, res.bytes);
    onClose();
  };

  const handleSaveOnly = async () => {
    const res = await genPDF(); if (!res) return;
    await saveToBackend(res);
    onGenerated(meeting.id, editData, res.url, res.bytes);
    onClose();
  };

  const saveToBackend = async (res) => {
    try {
      await fetch(`${API_BASE}/${meeting._dbId||meeting.id}`, {
        method:"PATCH", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          minutesData: editData,
          decisions: (editData.keyDecisions||[]).map(d=>d.decision),
          actionItems: (editData.actionItems||[]).map(a=>a.task)
        })
      }).catch(()=>{});
    } catch (e) { console.warn("Backend save:", e); }
  };

  const handleEmailPDF = async () => {
    let bytesToSend = pdfBytes;
    if (!bytesToSend) {
      const res = await genPDF(); if (!res) return;
      bytesToSend = res.bytes;
    }
    await doEmailSend(bytesToSend);
  };

  const doEmailSend = async (bytes) => {
    if (!bytes) { alert("Generate PDF first."); return; }
    setSendingEmail(true);
    const b64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
    // ✅ All board members (core + custom) receive the email
    const recipients = meeting.boardMembers
      .map(m => ({ email: m.email, name: m.name }))
      .filter(r => r.email && isEmail(r.email));
    try {
      const r = await fetch(`${EMAIL_BASE}/send-minutes`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ recipients, pdfBase64:b64, meetingTitle:editData?.meetingTitle||meeting.agenda, date:meeting.date })
      });
      const d = await r.json();
      if (d.success) alert(`✅ Minutes emailed to ${recipients.length} board member(s)!`);
      else alert("Some emails failed. Check logs.");
    } catch (e) { alert("Email error: "+e.message); }
    setSendingEmail(false);
  };

  const onFocus = e => { e.target.style.borderColor="#3a70b0"; e.target.style.background="#fff"; };
  const onBlur  = e => { e.target.style.borderColor="#dde3ec"; e.target.style.background="#f8fbff"; };
  const priC = { High:"#fee2e2", Medium:"#fef3c7", Low:"#d1fae5" };
  const priT = { High:"#991b1b", Medium:"#92400e", Low:"#065f46" };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(5,15,35,0.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1001, padding:20 }}>
      <motion.div
        initial={{ scale:0.9, opacity:0, y:25 }}
        animate={{ scale:1, opacity:1, y:0 }}
        exit={{ scale:0.9, opacity:0 }}
        transition={{ type:"spring", damping:20, stiffness:260 }}
        style={{ background:"#fff", borderRadius:24, width:phase==="edit"?"860px":"740px", maxWidth:"100%", maxHeight:"92vh", overflowY:"auto", boxShadow:"0 40px 100px rgba(0,0,0,0.35)", border:"1px solid #dde3ec", transition:"width 0.3s" }}
      >
        <div style={{ background:"linear-gradient(130deg,#050f23 0%,#0f2744 50%,#1a4570 100%)", padding:"24px 30px", borderRadius:"24px 24px 0 0", display:"flex", alignItems:"center", gap:14, position:"sticky", top:0, zIndex:10 }}>
          <div style={{ width:46, height:46, borderRadius:14, background:"rgba(79,156,249,0.2)", border:"1px solid rgba(79,156,249,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {phase==="edit" ? <FileText size={22} color="#7db3e8" /> : <PenLine size={22} color="#7db3e8" />}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:"white", fontWeight:700, fontSize:"1.05rem", fontFamily:"'Playfair Display', Georgia, serif" }}>
              {phase==="edit"?"✏️ Review & Edit Minutes":"Write Meeting Notes"}
            </div>
            <div style={{ color:"rgba(150,180,230,0.8)", fontSize:"0.8rem", marginTop:2 }}>{meeting.agenda} — {meeting.date}</div>
          </div>
          {["Write","Edit","Save"].map((p,i)=>{
            const active=(i===0&&["write","error","processing"].includes(phase))||(i===1&&phase==="edit");
            const done=i===0&&phase==="edit";
            return (
              <div key={p} style={{ display:"flex", alignItems:"center", gap:4, background:done?"rgba(16,185,129,0.25)":active?"rgba(79,156,249,0.2)":"rgba(255,255,255,0.06)", borderRadius:20, padding:"3px 11px", fontSize:"0.7rem", color:done?"#6ee7b7":active?"#7db3e8":"rgba(255,255,255,0.35)", fontWeight:600, border:`1px solid ${done?"rgba(110,231,183,0.3)":active?"rgba(79,156,249,0.3)":"transparent"}` }}>
                {done?"✓":`${i+1}.`} {p}
              </div>
            );
          })}
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"6px 8px", cursor:"pointer", color:"white", display:"flex", alignItems:"center", flexShrink:0 }}><X size={18} /></button>
        </div>

        <div style={{ padding:"28px 30px" }}>
          {(phase==="write"||phase==="error") && (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:8, color:"#0f2240", fontWeight:700, fontSize:"0.95rem", marginBottom:8 }}>
                <ClipboardList size={17} color="#3a70b0" /> Rough Meeting Notes
              </div>
              <p style={{ color:"#64748b", fontSize:"0.83rem", margin:"0 0 12px", lineHeight:1.6 }}>
                Write everything that happened — decisions, who said what, tasks, deadlines. AI will structure it into formal minutes.
              </p>
              <textarea
                value={notes} onChange={e=>setNotes(e.target.value)}
                placeholder={"Example:\n\nDean opened the meeting. Discussed curriculum update — agreed to add AI module in semester 3..."}
                style={{ width:"100%", boxSizing:"border-box", minHeight:240, padding:"15px 17px", border:"2px solid #dde3ec", borderRadius:14, fontSize:"0.88rem", lineHeight:1.75, fontFamily:"inherit", resize:"vertical", outline:"none", color:"#0f2240", background:"#f8fbff", transition:"all 0.2s" }}
                onFocus={e=>{e.target.style.borderColor="#3a70b0";e.target.style.background="#fff";e.target.style.boxShadow="0 0 0 4px rgba(58,112,176,0.1)";}}
                onBlur={e=>{e.target.style.borderColor="#dde3ec";e.target.style.background="#f8fbff";e.target.style.boxShadow="none";}}
              />
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:"0.77rem", color:"#94a3b8" }}>
                <span>{words} words · {chars} chars</span>
                <span style={{ color:chars<30?"#ef4444":"#10b981", fontWeight:600 }}>{chars<30?`${30-chars} more chars needed`:"✓ Ready to generate"}</span>
              </div>
              {phase==="error" && (
                <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:12, padding:"12px 16px", display:"flex", gap:10, alignItems:"flex-start", margin:"16px 0" }}>
                  <AlertCircle size={16} color="#ef4444" style={{ marginTop:1, flexShrink:0 }} />
                  <div>
                    <div style={{ fontWeight:700, color:"#dc2626", fontSize:"0.84rem" }}>Generation failed</div>
                    <div style={{ color:"#7f1d1d", fontSize:"0.79rem", marginTop:2 }}>{errorMsg}</div>
                  </div>
                </div>
              )}
              <div style={{ background:"linear-gradient(135deg,#f0f7ff,#e8f0fb)", border:"1px solid #c7d9f5", borderRadius:14, padding:"14px 17px", margin:"16px 0 20px" }}>
                <div style={{ fontWeight:700, color:"#0f2240", fontSize:"0.81rem", marginBottom:9 }}>📋 Attendees (auto-included)</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                  {meeting.boardMembers.map((m,i)=>(
                    <span key={i} style={{ background:"white", border:"1px solid #c7d9f5", borderRadius:22, padding:"4px 12px", fontSize:"0.75rem", color:"#334155", display:"flex", alignItems:"center", gap:6 }}>
                      <Avatar name={m.name} image={m.image} size={20} />
                      {m.name}{!m.isFixed && <span style={{ fontSize:"0.62rem", color:"#64748b" }}>(Custom)</span>}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
                <button onClick={onClose} style={{ padding:"10px 22px", borderRadius:11, border:"1.5px solid #dde3ec", background:"white", color:"#64748b", fontWeight:500, cursor:"pointer", fontSize:"0.86rem" }}>Cancel</button>
                <motion.button whileHover={chars>=30?{scale:1.04}:{}} whileTap={chars>=30?{scale:0.96}:{}} onClick={sendToAI} disabled={chars<30}
                  style={{ padding:"10px 24px", borderRadius:11, border:"none", background:chars>=30?"linear-gradient(120deg,#0f2744,#3a70b0)":"#e2e8f0", color:chars>=30?"white":"#94a3b8", fontWeight:600, cursor:chars>=30?"pointer":"not-allowed", display:"flex", alignItems:"center", gap:8, fontSize:"0.86rem", boxShadow:chars>=30?"0 8px 24px rgba(58,112,176,0.35)":"none" }}>
                  <Sparkles size={15} /> Send to AI <ChevronRight size={13} />
                </motion.button>
              </div>
            </>
          )}

          {phase==="processing" && (
            <div style={{ textAlign:"center", padding:"52px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
              <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:3, ease:"linear" }}
                style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#0f2744,#3a70b0)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 12px 36px rgba(58,112,176,0.4)" }}>
                <Bot size={34} color="white" />
              </motion.div>
              <div>
                <div style={{ fontWeight:700, fontSize:"1.1rem", color:"#0f2240", marginBottom:6, fontFamily:"'Playfair Display', Georgia, serif" }}>AI is processing your notes…</div>
                <div style={{ color:"#64748b", fontSize:"0.86rem" }}>Structuring decisions & action items into formal minutes</div>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
                {["Analysing notes","Extracting decisions","Structuring output"].map((label,i)=>(
                  <motion.div key={i} animate={{ opacity:[0.4,1,0.4] }} transition={{ repeat:Infinity, duration:2, delay:i*0.7 }}
                    style={{ background:"#f0f7ff", borderRadius:22, padding:"5px 13px", fontSize:"0.74rem", color:"#3a70b0", fontWeight:600, display:"flex", alignItems:"center", gap:5, border:"1px solid #c7d9f5" }}>
                    <Loader size={10} />{label}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {phase==="edit" && editData && (
            <>
              <div style={{ background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #93c5fd", borderRadius:13, padding:"13px 17px", marginBottom:22, display:"flex", gap:11, alignItems:"center" }}>
                <span style={{ fontSize:"1.2rem" }}>✏️</span>
                <div>
                  <div style={{ fontWeight:700, color:"#1e40af", fontSize:"0.88rem" }}>AI generated your minutes — edit anything before saving</div>
                  <div style={{ color:"#3b82f6", fontSize:"0.76rem", marginTop:1 }}>All fields are fully editable below.</div>
                </div>
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={sectionLabel}>📌 Meeting Title</div>
                <input value={editData.meetingTitle||""} onChange={e=>uf("meetingTitle",e.target.value)} style={editInput} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={sectionLabel}>📝 Executive Summary</div>
                <textarea value={editData.summary||""} onChange={e=>uf("summary",e.target.value)} style={{ ...editTextarea, minHeight:76 }} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={sectionLabel}>✅ Key Decisions <button style={addBtnStyle} onClick={()=>setEditData(p=>({...p,keyDecisions:[...p.keyDecisions,{id:Date.now(),decision:"",rationale:""}]}))}>+ Add</button></div>
                {editData.keyDecisions.map((d,idx)=>(
                  <div key={d.id} style={{ background:"#f8fbff", border:"1px solid #dde3ec", borderRadius:11, padding:"13px 15px", marginBottom:10 }}>
                    <div style={{ display:"flex", gap:9, alignItems:"flex-start" }}>
                      <span style={{ minWidth:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#0f2744,#3a70b0)", color:"white", fontSize:"0.69rem", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>{idx+1}</span>
                      <div style={{ flex:1 }}>
                        <input value={d.decision} onChange={e=>ud(d.id,"decision",e.target.value)} placeholder="Decision…" style={{ ...editInput, marginBottom:6, fontWeight:600 }} onFocus={onFocus} onBlur={onBlur} />
                        <input value={d.rationale||""} onChange={e=>ud(d.id,"rationale",e.target.value)} placeholder="Rationale…" style={{ ...editInput, fontSize:"0.78rem", color:"#64748b" }} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                      <button style={remBtnStyle} onClick={()=>setEditData(p=>({...p,keyDecisions:p.keyDecisions.filter(x=>x.id!==d.id)}))}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={sectionLabel}>🎯 Action Items <button style={addBtnStyle} onClick={()=>setEditData(p=>({...p,actionItems:[...p.actionItems,{id:Date.now(),task:"",responsible:"",deadline:"",priority:"Medium"}]}))}>+ Add</button></div>
                {editData.actionItems.map((a,idx)=>(
                  <div key={a.id} style={{ background:"#f8fbff", border:"1px solid #dde3ec", borderRadius:11, padding:"13px 15px", marginBottom:10 }}>
                    <div style={{ display:"flex", gap:9, alignItems:"flex-start" }}>
                      <span style={{ minWidth:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#1a4570,#4f9cf9)", color:"white", fontSize:"0.69rem", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>{idx+1}</span>
                      <div style={{ flex:1 }}>
                        <input value={a.task} onChange={e=>ua(a.id,"task",e.target.value)} placeholder="Task…" style={{ ...editInput, marginBottom:6, fontWeight:600 }} onFocus={onFocus} onBlur={onBlur} />
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:8 }}>
                          <input value={a.responsible||""} onChange={e=>ua(a.id,"responsible",e.target.value)} placeholder="👤 Responsible" style={editInput} onFocus={onFocus} onBlur={onBlur} />
                          <input value={a.deadline||""} onChange={e=>ua(a.id,"deadline",e.target.value)} placeholder="📅 Deadline" style={editInput} onFocus={onFocus} onBlur={onBlur} />
                          <select value={a.priority||"Medium"} onChange={e=>ua(a.id,"priority",e.target.value)}
                            style={{ ...editInput, background:priC[a.priority]||"#fef3c7", color:priT[a.priority]||"#92400e", fontWeight:700, cursor:"pointer" }}>
                            <option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
                          </select>
                        </div>
                      </div>
                      <button style={remBtnStyle} onClick={()=>setEditData(p=>({...p,actionItems:p.actionItems.filter(x=>x.id!==a.id)}))}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={sectionLabel}>💬 Discussion Points <button style={addBtnStyle} onClick={()=>setEditData(p=>({...p,discussionPoints:[...p.discussionPoints,""]}))}>+ Add</button></div>
                {(editData.discussionPoints||[]).map((d,i)=>(
                  <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"center" }}>
                    <span style={{ color:"#3a70b0", fontSize:"1rem", flexShrink:0, fontWeight:700 }}>·</span>
                    <input value={d} onChange={e=>udp(i,e.target.value)} placeholder="Discussion point…" style={{ ...editInput, flex:1 }} onFocus={onFocus} onBlur={onBlur} />
                    <button style={remBtnStyle} onClick={()=>setEditData(p=>({...p,discussionPoints:p.discussionPoints.filter((_,idx)=>idx!==i)}))}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={sectionLabel}>🚀 Next Steps</div>
                <textarea value={editData.nextSteps||""} onChange={e=>uf("nextSteps",e.target.value)} style={{ ...editTextarea, minHeight:58 }} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={{ marginBottom:24 }}>
                <div style={sectionLabel}>📅 Next Meeting Note</div>
                <input value={editData.nextMeetingNote||""} onChange={e=>uf("nextMeetingNote",e.target.value)} placeholder="e.g. In 4 weeks — follow up on action items" style={editInput} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap", paddingTop:16, borderTop:"1px solid #f0f4f9" }}>
                <button onClick={()=>setPhase("write")} style={{ padding:"9px 19px", borderRadius:11, border:"1.5px solid #dde3ec", background:"white", color:"#64748b", fontWeight:500, cursor:"pointer", fontSize:"0.84rem" }}>← Back</button>
                <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={handleEmailPDF} disabled={isRegen||sendingEmail}
                    style={{ padding:"9px 17px", borderRadius:11, border:"none", background:"#0ea5e9", color:"white", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", opacity:sendingEmail?0.7:1, boxShadow:"0 6px 18px rgba(14,165,233,0.3)" }}>
                    {sendingEmail?<Loader size={13}/>:<Mail size={13}/>} Email PDF to All
                  </motion.button>
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={handleSaveOnly} disabled={isRegen}
                    style={{ padding:"9px 19px", borderRadius:11, border:"none", background:"#10b981", color:"white", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", opacity:isRegen?0.7:1, boxShadow:"0 6px 18px rgba(16,185,129,0.3)" }}>
                    {isRegen?<Loader size={13}/>:<CheckCircle2 size={13}/>} Save & Close
                  </motion.button>
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={handleDownloadSave} disabled={isRegen}
                    style={{ padding:"9px 22px", borderRadius:11, border:"none", background:"linear-gradient(120deg,#0f2744,#3a70b0)", color:"white", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", opacity:isRegen?0.7:1, boxShadow:"0 8px 24px rgba(58,112,176,0.35)" }}>
                    {isRegen?<Loader size={13}/>:<Download size={13}/>} Download PDF & Save
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

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const AdvisoryMeeting = () => {
  const [meetings, setMeetings] = useState([]);
  const [activeTab, setActiveTab] = useState("create");
  const [showInvite, setShowInvite] = useState(false);
  const [lastMeeting, setLastMeeting] = useState(null);
  const [notesModalFor, setNotesModalFor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ boardMembers for the schedule form — always starts with DEFAULT_BOARD
  const [boardMembers, setBoardMembers] = useState(DEFAULT_BOARD);
  const [addMember, setAddMember] = useState({ name:"", role:"", email:"", org:"" });
  const [addMemberErrors, setAddMemberErrors] = useState({});
  const [showAddMember, setShowAddMember] = useState(false);
  const [form, setForm] = useState({ agenda:"", date:"", time:"", venue:"" });
  const [formErrors, setFormErrors] = useState({});

  // ✅ Per-meeting email sending state (keyed by meeting id)
  const [emailingMeeting, setEmailingMeeting] = useState(null); // id of meeting being emailed

  const updateMemberImage = (id, img) => setBoardMembers(p => p.map(m => m.id===id?{...m,image:img}:m));

  // ✅ Load meetings from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/all`);
        const d = await r.json();
        if (d.success) {
          setMeetings(d.data.map(m => ({
            id: m.meetingId,
            _dbId: m._id,
            agenda: m.meetingTitle,
            date: m.date,
            time: m.time,
            venue: m.location,
            status: m.minutesData ? "Completed" : "Scheduled",
            // ✅ Restore board members from DB (fall back to DEFAULT_BOARD if empty)
            boardMembers: (m.boardMembers && m.boardMembers.length > 0)
              ? m.boardMembers
              : DEFAULT_BOARD,
            minutesGenerated: !!m.minutesData,
            minutesData: m.minutesData || null,
            downloadUrl: null,
            pdfBytes: null,
          })));
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    })();
  }, []);

  const validateForm = () => {
    const e = {};
    if (isEmpty(form.agenda)) e.agenda = "Agenda is required";
    if (isEmpty(form.date)) e.date = "Date is required";
    else if (new Date(form.date) < new Date(new Date().toDateString())) e.date = "Date cannot be in the past";
    if (isEmpty(form.time)) e.time = "Time is required";
    if (isEmpty(form.venue)) e.venue = "Venue is required";
    setFormErrors(e); return Object.keys(e).length === 0;
  };

  const validateAddMember = () => {
    const e = {};
    if (isEmpty(addMember.name)) e.name = "Name required";
    if (isEmpty(addMember.role)) e.role = "Role required";
    if (!isEmpty(addMember.email) && !isEmail(addMember.email)) e.email = "Invalid email";
    setAddMemberErrors(e); return Object.keys(e).length === 0;
  };

  const handleAddMemberSubmit = () => {
    if (!validateAddMember()) return;
    setBoardMembers(p => [...p, {
      id: "m"+Date.now(), name:addMember.name, role:addMember.role,
      email:addMember.email, org:addMember.org, isFixed:false, image:null
    }]);
    setAddMember({ name:"", role:"", email:"", org:"" });
    setAddMemberErrors({}); setShowAddMember(false);
  };

  const handleSchedule = async () => {
    if (!validateForm()) return;
    const id = String(Date.now());

    // ✅ Sanitize boardMembers for backend (remove base64 images to keep payload small)
    const membersForDB = boardMembers.map(m => ({
      id: m.id, name: m.name, role: m.role,
      email: m.email || "", org: m.org || "",
      isFixed: m.isFixed || false,
      // only store URL images, not base64 (too large for DB)
      image: m.image && !m.image.startsWith("data:") ? m.image : null,
    }));

    const entry = {
      id, agenda: form.agenda, date: form.date, time: form.time, venue: form.venue,
      status: "Scheduled",
      boardMembers, // keep full local copy (including base64)
      minutesGenerated: false, minutesData: null, downloadUrl: null, pdfBytes: null
    };

    try {
      const r = await fetch(API_BASE, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingId: id, meetingTitle: form.agenda,
          date: form.date, time: form.time, location: form.venue,
          attendees: boardMembers.map(b=>b.name).join(", "),
          decisions: [], actionItems: [],
          boardMembers: membersForDB, // ✅ save to DB
        })
      });
      const d = await r.json();
      if (d.data?._id) entry._dbId = d.data._id;
    } catch (e) { console.warn("Save error:", e); }

    setMeetings(p => [...p, entry]);
    setLastMeeting(entry);
    setForm({ agenda:"", date:"", time:"", venue:"" });
    // ✅ Reset board to default after scheduling
    setBoardMembers(DEFAULT_BOARD);
    setShowInvite(true);
  };

  const handleMinutesGenerated = (meetingId, minutesData, downloadUrl, pdfBytes) => {
    setMeetings(p => p.map(m => m.id===meetingId
      ? { ...m, status:"Completed", minutesGenerated:true, minutesData, downloadUrl, pdfBytes }
      : m
    ));
  };

  const downloadMinutes = (m) => {
    if (!m.downloadUrl) return;
    const a = document.createElement("a"); a.href = m.downloadUrl;
    a.download = `Minutes_${m.agenda.replace(/\s+/g,"_")}_${m.date}.pdf`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  // ✅ Email PDF to all board members from the Records table
  const handleEmailFromRecords = async (meeting) => {
    if (!meeting.minutesData) { alert("No minutes generated yet."); return; }
    setEmailingMeeting(meeting.id);
    try {
      // Regenerate PDF on the fly
      const { url, bytes } = await createMinutesPDF(meeting.minutesData, meeting);

      const b64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
      const recipients = meeting.boardMembers
        .map(m => ({ email: m.email, name: m.name }))
        .filter(r => r.email && isEmail(r.email));

      if (recipients.length === 0) {
        alert("No valid email addresses found for board members."); setEmailingMeeting(null); return;
      }

      const r = await fetch(`${EMAIL_BASE}/send-minutes`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients, pdfBase64: b64,
          meetingTitle: meeting.minutesData?.meetingTitle || meeting.agenda,
          date: meeting.date
        })
      });
      const d = await r.json();
      if (d.success) alert(`✅ Minutes emailed to ${recipients.length} board member(s)!`);
      else alert("Some emails may have failed. Check server logs.");
    } catch (e) { alert("Email error: "+e.message); }
    setEmailingMeeting(null);
  };

  const inpSt = {
    width:"100%", boxSizing:"border-box", padding:"11px 15px",
    border:"1.5px solid #dde3ec", borderRadius:11,
    fontSize:"0.88rem", fontFamily:"inherit", outline:"none",
    color:"#0f2240", background:"#f8fbff", transition:"all 0.2s"
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #c7d9f5; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #3a70b0; }
        @keyframes pulse-ring { 0%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(79,156,249,0.5)} 70%{transform:scale(1);box-shadow:0 0 0 12px rgba(79,156,249,0)} 100%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(79,156,249,0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr !important; }
          .members-grid { grid-template-columns: 1fr !important; }
          .header-inner { flex-direction: column !important; gap: 12px !important; }
          .main-pad { padding: 16px !important; }
          .schedule-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#f0f5fc", fontFamily:"'DM Sans', sans-serif" }}>
        <AnimatePresence>
          {notesModalFor && <NotesModal meeting={notesModalFor} onClose={()=>setNotesModalFor(null)} onGenerated={handleMinutesGenerated} />}
          {showInvite && lastMeeting && <InviteModal meeting={lastMeeting} onClose={()=>setShowInvite(false)} onSent={()=>{}} />}
        </AnimatePresence>

        {/* ── NAV ── */}
        <nav style={{ background:"linear-gradient(110deg,#050f23 0%,#0a1e3d 60%,#0f2744 100%)", padding:"0 32px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 4px 24px rgba(5,15,35,0.5)", borderBottom:"1px solid rgba(79,156,249,0.2)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, overflow:"hidden", boxShadow:"0 4px 16px rgba(79,156,249,0.5)", animation:"pulse-ring 2.5s infinite", flexShrink:0 }}>
              <img src="../../src/images/collaxionlogo.jpeg" alt="CollaXion Logo" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <div>
              <span style={{ fontFamily:"'Playfair Display', Georgia, serif", fontWeight:800, fontSize:"1.2rem", color:"white", letterSpacing:"-0.3px" }}>CollaXion</span>
              <div style={{ fontSize:"0.58rem", color:"rgba(150,180,230,0.7)", letterSpacing:"2px", textTransform:"uppercase", marginTop:-3 }}>Advisory Board</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            {[{id:"create",label:"Schedule Meeting",icon:<CalendarDays size={15}/>},{id:"records",label:"Meeting Records",icon:<FileText size={15}/>}].map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ background:activeTab===t.id?"rgba(79,156,249,0.2)":"transparent", border:activeTab===t.id?"1px solid rgba(79,156,249,0.4)":"1px solid transparent", borderRadius:9, padding:"8px 18px", cursor:"pointer", color:activeTab===t.id?"#7db3e8":"rgba(180,210,240,0.7)", fontWeight:activeTab===t.id?600:500, fontSize:"0.84rem", fontFamily:"'DM Sans', sans-serif", display:"flex", alignItems:"center", gap:6, transition:"all 0.2s" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ background:"rgba(79,156,249,0.15)", border:"1px solid rgba(79,156,249,0.3)", borderRadius:22, padding:"5px 14px", display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 6px #4ade80" }} />
              <span style={{ color:"#7db3e8", fontSize:"0.76rem", fontWeight:600 }}>System Online</span>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div style={{ background:"linear-gradient(130deg,#050f23 0%,#0a1e3d 40%,#102a50 70%,#1a3a5c 100%)", padding:"48px 40px 52px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-60, right:-40, width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(79,156,249,0.15),transparent)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:-80, left:60, width:240, height:240, borderRadius:"50%", background:"radial-gradient(circle,rgba(74,222,128,0.08),transparent)", pointerEvents:"none" }} />
          {[...Array(6)].map((_,i)=>(
            <div key={i} style={{ position:"absolute", top:`${20+i*12}%`, right:`${10+(i%3)*12}%`, width:4, height:4, borderRadius:"50%", background:"rgba(79,156,249,0.4)", animation:`float ${2+i*0.4}s ease-in-out infinite`, animationDelay:`${i*0.3}s`, pointerEvents:"none" }} />
          ))}
          <div className="header-inner" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", maxWidth:1200, margin:"0 auto", position:"relative" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14, background:"rgba(79,156,249,0.15)", border:"1px solid rgba(79,156,249,0.35)", borderRadius:24, padding:"6px 12px", width:"fit-content" }}>
                <img src="../../src/images/collaxionlogo.jpeg" alt="CollaXion Logo" style={{ width:18, height:18, borderRadius:12, objectFit:"cover" }} />
                <span style={{ fontSize:"0.72rem", color:"#7db3e8", fontWeight:600, letterSpacing:"0.5px" }}>UNIVERSITY ADVISORY SYSTEM</span>
              </div>
              <h1 style={{ margin:"0 0 10px", color:"white", fontSize:"clamp(1.6rem, 4vw, 2.8rem)", fontWeight:800, fontFamily:"'Playfair Display', Georgia, serif", lineHeight:1.15, letterSpacing:"-0.5px" }}>
                Advisory Board<br />
                <span style={{ background:"linear-gradient(120deg, #193648, #00c6ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", textShadow:"0px 0px 8px rgba(77,163,217,0.6)" }}>Meeting Management</span>
              </h1>
              <p style={{ margin:0, color:"rgba(170,200,240,0.8)", fontSize:"1rem", lineHeight:1.6, maxWidth:480 }}>
                Schedule meetings, send invitations, generate AI-powered minutes & collaborate with board members seamlessly.
              </p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:18, flexShrink:0 }}>
              {[
                { label:"Total Meetings", val:meetings.length, color:"#4da3d9", icon:<CalendarDays size={18} color="#4da3d9"/> },
                { label:"Completed", val:meetings.filter(m=>m.minutesGenerated).length, color:"#22c55e", icon:<CheckCircle2 size={18} color="#22c55e"/> },
                { label:"Scheduled", val:meetings.filter(m=>m.status==="Scheduled").length, color:"#facc15", icon:<Clock size={18} color="#facc15"/> },
              ].map((s,i)=>(
                <motion.div key={i} initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.1+0.3 }} whileHover={{ scale:1.04 }}
                  style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderLeft:`4px solid ${s.color}`, borderRadius:14, padding:"16px 20px", display:"flex", alignItems:"center", gap:14, backdropFilter:"blur(12px)", minWidth:220, transition:"all 0.3s ease", boxShadow:"0 4px 20px rgba(0,0,0,0.25)" }}>
                  {s.icon}
                  <div style={{ display:"flex", flexDirection:"column" }}>
                    <div style={{ fontSize:"1.8rem", fontWeight:800, color:"white", lineHeight:1, fontFamily:"'Playfair Display', Georgia, serif" }}>{s.val}</div>
                    <div style={{ fontSize:"0.75rem", color:"rgba(170,200,240,0.75)", marginTop:2, letterSpacing:"0.5px" }}>{s.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div className="main-pad" style={{ padding:"32px 40px", maxWidth:1280, margin:"0 auto" }}>
          {/* Tab switcher */}
          <div style={{ display:"flex", gap:0, marginBottom:28, background:"white", borderRadius:14, padding:5, width:"fit-content", boxShadow:"0 4px 20px rgba(15,39,68,0.08)", border:"1px solid #e8edf4" }}>
            {[{id:"create",label:"Schedule Meeting",icon:<CalendarDays size={15}/>},{id:"records",label:"Meeting Records",icon:<FileText size={15}/>}].map(t=>(
              <motion.button key={t.id} onClick={()=>setActiveTab(t.id)} layout
                style={{ padding:"10px 26px", borderRadius:10, border:"none", background:activeTab===t.id?"linear-gradient(120deg,#0f2744,#3a70b0)":"transparent", color:activeTab===t.id?"white":"#64748b", fontWeight:600, cursor:"pointer", fontSize:"0.88rem", display:"flex", alignItems:"center", gap:7, fontFamily:"'DM Sans', sans-serif", transition:"all 0.25s", boxShadow:activeTab===t.id?"0 6px 18px rgba(58,112,176,0.3)":"none" }}>
                {t.icon} {t.label}
              </motion.button>
            ))}
          </div>

          {/* ── SCHEDULE TAB ── */}
          {activeTab==="create" && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
              <div className="schedule-grid" style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:24, alignItems:"start" }}>
                {/* Left: Form */}
                <div style={{ background:"white", borderRadius:22, padding:"36px 38px", boxShadow:"0 8px 40px rgba(15,39,68,0.09)", border:"1px solid #e8edf4" }}>
                  <div style={{ marginBottom:30 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                      <div style={{ width:38, height:38, borderRadius:11, background:"linear-gradient(135deg,#0f2744,#3a70b0)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <CalendarDays size={18} color="white" />
                      </div>
                      <h2 style={{ margin:0, color:"#0f2240", fontSize:"1.15rem", fontWeight:700, fontFamily:"'Playfair Display', Georgia, serif" }}>Meeting Details</h2>
                    </div>
                    <p style={{ margin:0, color:"#94a3b8", fontSize:"0.82rem" }}>Complete all fields to schedule your advisory board meeting.</p>
                  </div>
                  <div className="form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:32 }}>
                    {[
                      { key:"agenda", label:"Meeting Agenda", type:"text", placeholder:"e.g. University–Industry Collaboration", icon:"📋", span:true },
                      { key:"date", label:"Meeting Date", type:"date", icon:"📅" },
                      { key:"time", label:"Meeting Time", type:"time", icon:"🕐" },
                      { key:"venue", label:"Venue / Meeting Link", type:"text", placeholder:"e.g. Conference Room A or Zoom link", icon:"📍", span:true },
                    ].map(f=>(
                      <div key={f.key} style={{ gridColumn:f.span?"1 / -1":undefined }}>
                        <label style={{ fontSize:"0.82rem", fontWeight:600, color:"#334155", display:"block", marginBottom:7 }}>{f.icon} {f.label}</label>
                        <input type={f.type} value={form[f.key]} placeholder={f.placeholder||""}
                          onChange={e=>{setForm(p=>({...p,[f.key]:e.target.value}));setFormErrors(p=>({...p,[f.key]:""}));}}
                          style={{ ...inpSt, borderColor:formErrors[f.key]?"#ef4444":"#dde3ec" }}
                          onFocus={e=>{e.target.style.borderColor="#3a70b0";e.target.style.boxShadow="0 0 0 4px rgba(58,112,176,0.1)";e.target.style.background="#fff";}}
                          onBlur={e=>{e.target.style.borderColor=formErrors[f.key]?"#ef4444":"#dde3ec";e.target.style.boxShadow="none";e.target.style.background="#f8fbff";}}
                        />
                        {formErrors[f.key] && <div style={{ color:"#ef4444", fontSize:"0.72rem", marginTop:4, display:"flex", alignItems:"center", gap:4 }}><AlertCircle size={11}/> {formErrors[f.key]}</div>}
                      </div>
                    ))}
                  </div>
                  <motion.button whileHover={{ scale:1.03, boxShadow:"0 14px 40px rgba(58,112,176,0.45)" }} whileTap={{ scale:0.97 }} onClick={handleSchedule}
                    style={{ background:"linear-gradient(120deg,#0a1e3d 0%,#0f2744 40%,#3a70b0 100%)", color:"white", border:"none", borderRadius:13, padding:"14px 38px", fontWeight:700, fontSize:"0.95rem", cursor:"pointer", display:"flex", alignItems:"center", gap:9, boxShadow:"0 8px 28px rgba(58,112,176,0.35)", fontFamily:"'DM Sans', sans-serif" }}>
                    <Send size={17}/> Schedule Meeting & Send Invites
                  </motion.button>
                </div>

                {/* Right: Board Members */}
                <div style={{ background:"white", borderRadius:22, padding:"28px 26px", boxShadow:"0 8px 40px rgba(15,39,68,0.09)", border:"1px solid #e8edf4" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#1a4570,#4f9cf9)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Users size={16} color="white"/>
                      </div>
                      <div>
                        <h3 style={{ margin:0, color:"#0f2240", fontSize:"0.95rem", fontWeight:700, fontFamily:"'Playfair Display', Georgia, serif" }}>Board Members</h3>
                        <div style={{ fontSize:"0.7rem", color:"#94a3b8" }}>{boardMembers.length} members (saved with meeting)</div>
                      </div>
                    </div>
                    <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={()=>setShowAddMember(p=>!p)}
                      style={{ background:showAddMember?"linear-gradient(120deg,#0f2744,#3a70b0)":"#f0f7ff", color:showAddMember?"white":"#3a70b0", border:"1px solid "+(showAddMember?"transparent":"#c7d9f5"), borderRadius:9, padding:"7px 13px", fontSize:"0.76rem", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                      <UserPlus size={13}/> {showAddMember?"Cancel":"Add"}
                    </motion.button>
                  </div>

                  {/* ✅ Custom member notice */}
                  {boardMembers.some(m=>!m.isFixed) && (
                    <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:10, padding:"8px 12px", marginBottom:12, fontSize:"0.75rem", color:"#065f46", display:"flex", alignItems:"center", gap:6 }}>
                      <CheckCircle2 size={13} color="#059669"/> Custom members will be saved with this meeting & included in PDF/emails.
                    </div>
                  )}

                  <div className="members-grid" style={{ display:"grid", gridTemplateColumns:"1fr", gap:10 }}>
                    {boardMembers.map(m=>(
                      <MemberCard key={m.id} member={m}
                        removable={!m.isFixed}
                        onRemove={()=>setBoardMembers(p=>p.filter(x=>x.id!==m.id))}
                        onImageUpload={updateMemberImage}
                        compact
                      />
                    ))}
                  </div>

                  <AnimatePresence>
                    {showAddMember && (
                      <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} style={{ overflow:"hidden", marginTop:14 }}>
                        <div style={{ background:"linear-gradient(135deg,#f0f7ff,#e8f0fb)", border:"1px solid #c7d9f5", borderRadius:14, padding:"16px 18px" }}>
                          <div style={{ fontWeight:700, color:"#0f2240", fontSize:"0.8rem", marginBottom:12 }}>New Board Member</div>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:11 }}>
                            {[{k:"name",pl:"Full Name *"},{k:"role",pl:"Role *"},{k:"email",pl:"Email"},{k:"org",pl:"Organisation"}].map(f=>(
                              <div key={f.k}>
                                <input value={addMember[f.k]} onChange={e=>{setAddMember(p=>({...p,[f.k]:e.target.value}));setAddMemberErrors(p=>({...p,[f.k]:""}));}} placeholder={f.pl}
                                  style={{ ...inpSt, padding:"8px 12px", fontSize:"0.79rem", borderColor:addMemberErrors[f.k]?"#ef4444":"#dde3ec" }} />
                                {addMemberErrors[f.k] && <div style={{ color:"#ef4444", fontSize:"0.68rem", marginTop:3 }}>{addMemberErrors[f.k]}</div>}
                              </div>
                            ))}
                          </div>
                          <div style={{ display:"flex", gap:8 }}>
                            <motion.button whileHover={{ scale:1.04 }} onClick={handleAddMemberSubmit}
                              style={{ background:"linear-gradient(120deg,#0f2744,#3a70b0)", color:"white", border:"none", borderRadius:8, padding:"8px 17px", fontSize:"0.78rem", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                              <Plus size={12}/> Add
                            </motion.button>
                            <button onClick={()=>setShowAddMember(false)} style={{ background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:8, padding:"8px 14px", fontSize:"0.78rem", cursor:"pointer" }}>Cancel</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── RECORDS TAB ── */}
          {activeTab==="records" && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
              <div style={{ background:"white", borderRadius:22, padding:"32px", boxShadow:"0 8px 40px rgba(15,39,68,0.09)", border:"1px solid #e8edf4" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:38, height:38, borderRadius:11, background:"linear-gradient(135deg,#0f2744,#3a70b0)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <FileText size={18} color="white"/>
                    </div>
                    <div>
                      <h2 style={{ margin:0, color:"#0f2240", fontSize:"1.1rem", fontWeight:700, fontFamily:"'Playfair Display', Georgia, serif" }}>Meeting Records</h2>
                      <div style={{ fontSize:"0.72rem", color:"#94a3b8" }}>{meetings.length} total meetings</div>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={()=>setActiveTab("create")}
                    style={{ background:"linear-gradient(120deg,#0f2744,#3a70b0)", color:"white", border:"none", borderRadius:10, padding:"9px 18px", fontWeight:600, fontSize:"0.82rem", cursor:"pointer", display:"flex", alignItems:"center", gap:6, boxShadow:"0 6px 18px rgba(58,112,176,0.3)" }}>
                    <Plus size={14}/> New Meeting
                  </motion.button>
                </div>

                {loading ? (
                  <div style={{ textAlign:"center", padding:"60px 20px" }}>
                    <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.5, ease:"linear" }}
                      style={{ width:44, height:44, borderRadius:"50%", border:"3px solid #e8edf4", borderTopColor:"#3a70b0", margin:"0 auto 16px" }} />
                    <p style={{ margin:0, color:"#64748b", fontSize:"0.9rem" }}>Loading meeting records…</p>
                  </div>
                ) : meetings.length===0 ? (
                  <div style={{ textAlign:"center", padding:"64px 20px" }}>
                    <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#f0f7ff,#e8edf4)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
                      <CalendarDays size={36} color="#c7d9f5"/>
                    </div>
                    <p style={{ margin:0, fontSize:"1rem", fontWeight:700, color:"#334155", fontFamily:"'Playfair Display', Georgia, serif" }}>No meetings yet</p>
                    <p style={{ margin:"6px 0 20px", fontSize:"0.84rem", color:"#94a3b8" }}>Schedule your first advisory board meeting to get started.</p>
                    <motion.button whileHover={{ scale:1.04 }} onClick={()=>setActiveTab("create")}
                      style={{ background:"linear-gradient(120deg,#0f2744,#3a70b0)", color:"white", border:"none", borderRadius:11, padding:"11px 28px", fontWeight:600, cursor:"pointer", boxShadow:"0 8px 24px rgba(58,112,176,0.35)" }}>
                      Schedule First Meeting
                    </motion.button>
                  </div>
                ) : (
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", textAlign:"left" }}>
                      <thead>
                        <tr>
                          {["Agenda","Date & Time","Venue","Board","Status","MoM / Notes","Actions"].map(h=>(
                            <th key={h} style={{ padding:"12px 16px", fontSize:"0.72rem", fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.8px", borderBottom:"2px solid #e8edf4", background:"#f8fbff", whiteSpace:"nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {meetings.map((m,i)=>(
                          <motion.tr key={m.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
                            style={{ borderBottom:"1px solid #f0f4f9" }}
                            onMouseEnter={e=>e.currentTarget.style.background="#f8fbff"}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                          >
                            {/* Agenda */}
                            <td style={{ padding:"16px", maxWidth:200 }}>
                              <div style={{ fontWeight:700, color:"#0f2240", fontSize:"0.88rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"'Playfair Display', Georgia, serif" }}>{m.agenda}</div>
                            </td>
                            {/* Date */}
                            <td style={{ padding:"16px", whiteSpace:"nowrap" }}>
                              <div style={{ fontWeight:600, color:"#334155", fontSize:"0.84rem" }}>{m.date}</div>
                              <div style={{ color:"#94a3b8", fontSize:"0.76rem" }}>{m.time}</div>
                            </td>
                            {/* Venue */}
                            <td style={{ padding:"16px", maxWidth:140 }}>
                              <div style={{ color:"#64748b", fontSize:"0.82rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.venue}</div>
                            </td>
                            {/* Board Members count + avatars */}
                            <td style={{ padding:"16px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                                <div style={{ display:"flex" }}>
                                  {m.boardMembers.slice(0,3).map((bm,bi)=>(
                                    <div key={bm.id} style={{ marginLeft:bi===0?0:-8, zIndex:3-bi }}>
                                      <Avatar name={bm.name} image={bm.image} size={26}/>
                                    </div>
                                  ))}
                                </div>
                                {m.boardMembers.length>3 && (
                                  <span style={{ fontSize:"0.7rem", color:"#64748b", marginLeft:4 }}>+{m.boardMembers.length-3}</span>
                                )}
                              </div>
                            </td>
                            {/* Status */}
                            <td style={{ padding:"16px" }}>
                              {m.status==="Scheduled" ? (
                                <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:"#fef9e7", color:"#92400e", padding:"5px 11px", borderRadius:22, fontSize:"0.74rem", fontWeight:700, border:"1px solid #fde68a" }}>
                                  <Clock size={11}/> Scheduled
                                </span>
                              ) : (
                                <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:"#f0fdf4", color:"#065f46", padding:"5px 11px", borderRadius:22, fontSize:"0.74rem", fontWeight:700, border:"1px solid #86efac" }}>
                                  <CheckCircle2 size={11}/> Completed
                                </span>
                              )}
                            </td>
                            {/* Notes */}
                            <td style={{ padding:"16px" }}>
                              {m.minutesGenerated ? (
                                <span style={{ display:"flex", alignItems:"center", gap:5, color:"#059669", fontWeight:700, fontSize:"0.78rem" }}>
                                  <CheckCircle2 size={14}/> Generated
                                </span>
                              ) : (
                                <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }} onClick={()=>setNotesModalFor(m)}
                                  style={{ background:"linear-gradient(120deg,#0f2744,#3a70b0)", color:"white", border:"none", borderRadius:9, padding:"7px 14px", cursor:"pointer", fontWeight:600, fontSize:"0.76rem", display:"flex", alignItems:"center", gap:5, fontFamily:"'DM Sans', sans-serif", boxShadow:"0 4px 14px rgba(58,112,176,0.3)" }}>
                                  <Sparkles size={12}/> Write Notes
                                </motion.button>
                              )}
                            </td>
                            {/* ✅ Actions: Download + Email All */}
                            <td style={{ padding:"16px" }}>
                              {m.minutesGenerated ? (
                                <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                                  <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }} onClick={()=>downloadMinutes(m)}
                                    style={{ background:"#10b981", color:"white", border:"none", borderRadius:9, padding:"7px 12px", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontSize:"0.76rem", boxShadow:"0 4px 14px rgba(16,185,129,0.3)" }}>
                                    <Download size={12}/> Download
                                  </motion.button>
                                  {/* ✅ Email All Board Members button */}
                                  <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}
                                    onClick={()=>handleEmailFromRecords(m)}
                                    disabled={emailingMeeting===m.id}
                                    style={{ background:emailingMeeting===m.id?"#94a3b8":"#0ea5e9", color:"white", border:"none", borderRadius:9, padding:"7px 12px", fontWeight:600, cursor:emailingMeeting===m.id?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:5, fontSize:"0.76rem", boxShadow:emailingMeeting===m.id?"none":"0 4px 14px rgba(14,165,233,0.3)", opacity:emailingMeeting===m.id?0.7:1 }}>
                                    {emailingMeeting===m.id ? <Loader size={12}/> : <Mail size={12}/>}
                                    {emailingMeeting===m.id ? "Sending…" : "Email All"}
                                  </motion.button>
                                </div>
                              ) : (
                                <span style={{ display:"flex", alignItems:"center", gap:5, color:"#c7d9f5", fontSize:"0.76rem" }}>
                                  <FileCheck size={13}/> Not yet
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ background:"linear-gradient(110deg,#050f23,#0a1e3d)", padding:"20px 40px", marginTop:40, borderTop:"1px solid rgba(79,156,249,0.15)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:8, overflow:"hidden", boxShadow:"0 3px 12px rgba(79,156,249,0.4)", flexShrink:0 }}>
                <img src="../../src/images/collaxionlogo.jpeg" alt="CollaXion Logo" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
              <span style={{ fontFamily:"'Playfair Display', Georgia, serif", fontWeight:700, color:"white", fontSize:"0.95rem" }}>CollaXion</span>
            </div>
            <div style={{ color:"rgba(130,160,200,0.6)", fontSize:"0.74rem" }}>© 2026 CollaXion. Where collaboration meets innovation.</div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AdvisoryMeeting;