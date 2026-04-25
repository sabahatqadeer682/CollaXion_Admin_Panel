// // emailRoutes.js — Add this to your Express app
// // npm install nodemailer

// import express from "express";
// import nodemailer from "nodemailer";

// const router = express.Router();

// // ── Nodemailer transporter — created lazily so .env is already loaded ──
// // DO NOT create at module top-level; env vars aren't ready yet at import time.
// const getTransporter = () => {
//   const user = process.env.EMAIL_USER;
//   const pass = process.env.EMAIL_PASS;

//   if (!user || !pass) {
//     throw new Error(
//       `Email credentials missing. EMAIL_USER="${user}" EMAIL_PASS="${pass ? "***set***" : "NOT SET"}". Check your .env file.`
//     );
//   }

//   return nodemailer.createTransport({
//     service: "gmail",
//     auth: { user, pass },
//   });
// };

// // ── POST /api/email/send-invitation ───────────────────────────────────
// // Body: { to: "email", name: "Recipient Name", agenda, date, time, venue, meetingId }
// router.post("/send-invitation", async (req, res) => {
//   try {
//     const { to, name, agenda, date, time, venue, meetingId } = req.body;
//     if (!to || !agenda)
//       return res.status(400).json({ error: "Missing required fields" });

//     const html = `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8" />
//   <style>
//     body { margin:0; padding:0; background:#f0f4f8; font-family:'Segoe UI',sans-serif; }
//     .wrapper { max-width:600px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 40px rgba(0,0,0,0.12); }
//     .header { background:linear-gradient(135deg,#193648 0%,#2d6a9f 100%); padding:36px 40px; }
//     .logo { font-size:24px; font-weight:800; color:#ffffff; letter-spacing:-0.5px; }
//     .logo span { color:#60b3f0; }
//     .tagline { color:rgba(255,255,255,0.65); font-size:13px; margin-top:4px; }
//     .badge { display:inline-block; background:rgba(255,255,255,0.15); color:#fff; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:5px 12px; border-radius:20px; margin-top:16px; border:1px solid rgba(255,255,255,0.25); }
//     .body { padding:36px 40px; }
//     .greeting { font-size:22px; font-weight:700; color:#193648; margin-bottom:8px; }
//     .intro { color:#64748b; font-size:15px; line-height:1.7; margin-bottom:28px; }
//     .card { background:linear-gradient(135deg,#f0f7ff,#e8f4fd); border:1px solid #c3dff7; border-radius:12px; padding:24px; margin-bottom:24px; }
//     .card-title { font-size:13px; font-weight:700; color:#2d6a9f; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px; }
//     .detail-row { display:flex; align-items:flex-start; gap:14px; margin-bottom:14px; }
//     .detail-icon { width:36px; height:36px; border-radius:8px; background:#2d6a9f; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:16px; }
//     .detail-label { font-size:11px; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
//     .detail-value { font-size:15px; font-weight:600; color:#193648; margin-top:2px; }
//     .cta { text-align:center; margin:28px 0; }
//     .cta a { background:linear-gradient(135deg,#193648,#2d6a9f); color:white; text-decoration:none; padding:14px 36px; border-radius:10px; font-weight:700; font-size:15px; display:inline-block; }
//     .note { background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:14px 18px; font-size:13px; color:#92400e; line-height:1.6; }
//     .footer { background:#f8fafc; padding:24px 40px; border-top:1px solid #e2e8f0; text-align:center; }
//     .footer p { font-size:12px; color:#94a3b8; margin:4px 0; }
//   </style>
// </head>
// <body>
//   <div class="wrapper">
//     <div class="header">
//       <div class="logo">Colla<span>Xion</span></div>
//       <div class="tagline">Industry–Academia Collaboration Platform</div>
//       <div class="badge">📋 Advisory Board Meeting Invitation</div>
//     </div>
//     <div class="body">
//       <div class="greeting">Dear ${name || "Representative"},</div>
//       <p class="intro">
//         You are cordially invited to attend an <strong>Advisory Board Meeting</strong> organized by <strong>CollaXion</strong>. 
//         Your presence and expertise are highly valued. Please review the meeting details below.
//       </p>
//       <div class="card">
//         <div class="card-title">📌 Meeting Details</div>
//         <div class="detail-row">
//           <div class="detail-icon">📋</div>
//           <div>
//             <div class="detail-label">Agenda</div>
//             <div class="detail-value">${agenda}</div>
//           </div>
//         </div>
//         <div class="detail-row">
//           <div class="detail-icon">📅</div>
//           <div>
//             <div class="detail-label">Date</div>
//             <div class="detail-value">${date}</div>
//           </div>
//         </div>
//         <div class="detail-row">
//           <div class="detail-icon">🕐</div>
//           <div>
//             <div class="detail-label">Time</div>
//             <div class="detail-value">${time}</div>
//           </div>
//         </div>
//         <div class="detail-row">
//           <div class="detail-icon">📍</div>
//           <div>
//             <div class="detail-label">Venue</div>
//             <div class="detail-value">${venue}</div>
//           </div>
//         </div>
//       </div>
//       <div class="note">
//         ⏰ <strong>Kindly confirm your attendance</strong> at your earliest convenience. 
//         Meeting minutes and documents will be shared after the session.
//       </div>
//     </div>
//     <div class="footer">
//       <p><strong>CollaXion</strong> — Bridging Industry & Academia</p>
//       <p>This is an automated invitation. Please do not reply to this email.</p>
//     </div>
//   </div>
// </body>
// </html>`;

//     await getTransporter().sendMail({
//       from: `"CollaXion Advisory Board" <${process.env.EMAIL_USER}>`,
//       to,
//       subject: `📋 Meeting Invitation: ${agenda} — ${date}`,
//       html,
//     });

//     res.json({ success: true, message: `Invitation sent to ${to}` });
//   } catch (err) {
//     console.error("Email send error:", err);
//     res.status(500).json({ error: "Failed to send email", details: err.message });
//   }
// });

// // ── POST /api/email/send-minutes ───────────────────────────────────────
// // Body: { recipients: [{email, name}], pdfBase64, meetingTitle, date }
// router.post("/send-minutes", async (req, res) => {
//   try {
//     const { recipients, pdfBase64, meetingTitle, date } = req.body;
//     if (!recipients || !pdfBase64)
//       return res.status(400).json({ error: "Missing recipients or PDF" });

//     const pdfBuffer = Buffer.from(pdfBase64, "base64");
//     const results = [];

//     for (const { email, name } of recipients) {
//       try {
//         const html = `
// <!DOCTYPE html>
// <html>
// <head>
//   <style>
//     body { margin:0; padding:0; background:#f0f4f8; font-family:'Segoe UI',sans-serif; }
//     .wrapper { max-width:600px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 8px 40px rgba(0,0,0,0.12); }
//     .header { background:linear-gradient(135deg,#193648,#2d6a9f); padding:36px 40px; }
//     .logo { font-size:24px; font-weight:800; color:#fff; } .logo span { color:#60b3f0; }
//     .badge { display:inline-block; background:rgba(255,255,255,0.15); color:#fff; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:5px 12px; border-radius:20px; margin-top:16px; border:1px solid rgba(255,255,255,0.25); }
//     .body { padding:36px 40px; }
//     .greeting { font-size:20px; font-weight:700; color:#193648; margin-bottom:8px; }
//     .intro { color:#64748b; font-size:15px; line-height:1.7; }
//     .attach-note { background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:16px 20px; margin:24px 0; display:flex; align-items:center; gap:14px; }
//     .attach-icon { font-size:28px; }
//     .attach-text { font-size:14px; color:#166534; font-weight:600; }
//     .footer { background:#f8fafc; padding:24px 40px; border-top:1px solid #e2e8f0; text-align:center; }
//     .footer p { font-size:12px; color:#94a3b8; margin:4px 0; }
//   </style>
// </head>
// <body>
//   <div class="wrapper">
//     <div class="header">
//       <div class="logo">Colla<span>Xion</span></div>
//       <div class="badge">📄 Meeting Minutes — ${date}</div>
//     </div>
//     <div class="body">
//       <div class="greeting">Dear ${name || "Attendee"},</div>
//       <p class="intro">
//         Please find attached the official <strong>Meeting Minutes</strong> for the advisory board session: 
//         <strong>${meetingTitle}</strong> held on <strong>${date}</strong>.
//       </p>
//       <div class="attach-note">
//         <div class="attach-icon">📎</div>
//         <div class="attach-text">Meeting Minutes PDF is attached to this email</div>
//       </div>
//       <p class="intro">Kindly review the minutes, action items, and decisions. Please reach out if you have any clarifications.</p>
//     </div>
//     <div class="footer">
//       <p><strong>CollaXion</strong> — Bridging Industry & Academia</p>
//       <p>This is an automated email. Please do not reply.</p>
//     </div>
//   </div>
// </body>
// </html>`;

//         await getTransporter().sendMail({
//           from: `"CollaXion Advisory Board" <${process.env.EMAIL_USER}>`,
//           to: email,
//           subject: `📄 Meeting Minutes: ${meetingTitle} — ${date}`,
//           html,
//           attachments: [{
//             filename: `Minutes_${meetingTitle.replace(/\s+/g, "_")}_${date}.pdf`,
//             content: pdfBuffer,
//             contentType: "application/pdf",
//           }],
//         });

//         results.push({ email, success: true });
//       } catch (err) {
//         results.push({ email, success: false, error: err.message });
//       }
//     }

//     const allOk = results.every(r => r.success);
//     res.json({ success: allOk, results });
//   } catch (err) {
//     console.error("Send minutes error:", err);
//     res.status(500).json({ error: "Failed to send minutes", details: err.message });
//   }
// });

// export default router;





// emailRoutes.js
// npm install nodemailer






// import express from "express";
// import nodemailer from "nodemailer";

// const router = express.Router();

// // ── Lazy transporter — reads env at request time, not module-load time ──
// const getTransporter = () => {
//   const user = process.env.EMAIL_USER;
//   const pass = process.env.EMAIL_PASS;
//   if (!user || !pass) {
//     throw new Error(
//       `Email credentials missing. EMAIL_USER="${user}" EMAIL_PASS="${pass ? "***set***" : "NOT SET"}". Check your .env file.`
//     );
//   }
//   return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
// };

// // ══════════════════════════════════════════════════════════════
// //  POST /api/email/send-invitation
// // ══════════════════════════════════════════════════════════════
// router.post("/send-invitation", async (req, res) => {
//   try {
//     const { to, name, agenda, date, time, venue } = req.body;
//     if (!to || !agenda)
//       return res.status(400).json({ error: "Missing required fields" });

//     const html = `<!DOCTYPE html>
// <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//   <title>Meeting Invitation</title>
//   <style type="text/css">
//     * { box-sizing:border-box; }
//     body,table,td { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
//     table,td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
//     body { margin:0!important; padding:0!important; background-color:#eef2f7; width:100%!important; }
//     @media only screen and (max-width:620px) {
//       .email-container { width:100%!important; border-radius:0!important; }
//       .pad { padding:28px 22px!important; }
//       .hpad { padding:32px 22px 28px!important; }
//       .fpad { padding:20px 22px!important; }
//       .dcard { padding:20px 18px!important; }
//       .dtcell { display:block!important; width:100%!important; padding-right:0!important; padding-bottom:16px!important; }
//       h2 { font-size:20px!important; }
//     }
//   </style>
// </head>
// <body style="margin:0;padding:0;background-color:#eef2f7;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

// <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#eef2f7;">
//   <tr><td align="center" style="padding:36px 14px;">

//     <table class="email-container" role="presentation" cellpadding="0" cellspacing="0" border="0"
//       width="600" style="max-width:600px;width:100%;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

//       <!-- HEADER -->
//       <tr>
//         <td class="hpad" style="background:linear-gradient(135deg,#193648 0%,#1e4d78 55%,#2d6a9f 100%);padding:40px 48px 36px;">
//           <p style="margin:0;font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px;line-height:1.2;">
//             Colla<span style="color:#60b3f0;">Xion</span>
//           </p>
//           <p style="margin:6px 0 20px;font-size:13px;color:rgba(255,255,255,0.58);line-height:1.4;">
//             Industry&ndash;Academia Collaboration Platform
//           </p>
//           <span style="display:inline-block;background:rgba(255,255,255,0.14);color:#fff;font-size:11px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;padding:8px 18px;border-radius:30px;border:1px solid rgba(255,255,255,0.24);">
//             &#128203;&nbsp; Advisory Board Meeting Invitation
//           </span>
//         </td>
//       </tr>

//       <!-- GREETING -->
//       <tr>
//         <td class="pad" style="padding:44px 48px 0;">
//           <h2 style="margin:0 0 14px;font-size:24px;font-weight:700;color:#193648;line-height:1.35;">
//             Dear ${name || "Representative"},
//           </h2>
//           <p style="margin:0;font-size:16px;line-height:1.85;color:#5a6a7e;">
//             You are cordially invited to attend an
//             <strong style="color:#193648;">Advisory Board Meeting</strong>
//             organized by <strong style="color:#193648;">CollaXion</strong>.
//             Your presence and valued expertise are greatly appreciated.
//             Please find the complete meeting details below.
//           </p>
//         </td>
//       </tr>

//       <!-- RULE -->
//       <tr>
//         <td style="padding:28px 48px 0;">
//           <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
//             <tr><td style="height:1px;background:linear-gradient(to right,#e2e8f0,#b8d7f0,#e2e8f0);font-size:0;line-height:0;">&nbsp;</td></tr>
//           </table>
//         </td>
//       </tr>

//       <!-- DETAILS CARD -->
//       <tr>
//         <td class="pad" style="padding:28px 48px 0;">
//           <table class="dcard" role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
//             style="background:linear-gradient(135deg,#f0f7ff,#e8f4fd);border:1px solid #c3dff7;border-radius:16px;padding:26px 30px;">

//             <tr>
//               <td style="padding-bottom:20px;">
//                 <p style="margin:0;font-size:11px;font-weight:700;color:#2d6a9f;text-transform:uppercase;letter-spacing:1.3px;">
//                   &#128204;&nbsp; Meeting Details
//                 </p>
//               </td>
//             </tr>

//             <!-- Agenda -->
//             <tr>
//               <td style="padding-bottom:18px;">
//                 <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
//                   <tr>
//                     <td width="52" valign="top" style="padding-right:12px;">
//                       <div style="width:42px;height:42px;background:#193648;border-radius:10px;text-align:center;font-size:18px;line-height:42px;">&#128203;</div>
//                     </td>
//                     <td valign="top">
//                       <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.7px;">Agenda</p>
//                       <p style="margin:0;font-size:16px;font-weight:600;color:#193648;line-height:1.45;">${agenda}</p>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>

//             <!-- Date + Time -->
//             <tr>
//               <td style="padding-bottom:18px;">
//                 <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
//                   <tr>
//                     <td class="dtcell" width="50%" valign="top" style="padding-right:12px;">
//                       <table role="presentation" cellpadding="0" cellspacing="0" border="0">
//                         <tr>
//                           <td width="52" valign="top" style="padding-right:12px;">
//                             <div style="width:42px;height:42px;background:#193648;border-radius:10px;text-align:center;font-size:18px;line-height:42px;">&#128197;</div>
//                           </td>
//                           <td valign="top">
//                             <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.7px;">Date</p>
//                             <p style="margin:0;font-size:16px;font-weight:600;color:#193648;">${date}</p>
//                           </td>
//                         </tr>
//                       </table>
//                     </td>
//                     <td class="dtcell" width="50%" valign="top" style="padding-left:12px;">
//                       <table role="presentation" cellpadding="0" cellspacing="0" border="0">
//                         <tr>
//                           <td width="52" valign="top" style="padding-right:12px;">
//                             <div style="width:42px;height:42px;background:#193648;border-radius:10px;text-align:center;font-size:18px;line-height:42px;">&#128336;</div>
//                           </td>
//                           <td valign="top">
//                             <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.7px;">Time</p>
//                             <p style="margin:0;font-size:16px;font-weight:600;color:#193648;">${time}</p>
//                           </td>
//                         </tr>
//                       </table>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>

//             <!-- Venue -->
//             <tr>
//               <td>
//                 <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
//                   <tr>
//                     <td width="52" valign="top" style="padding-right:12px;">
//                       <div style="width:42px;height:42px;background:#193648;border-radius:10px;text-align:center;font-size:18px;line-height:42px;">&#128205;</div>
//                     </td>
//                     <td valign="top">
//                       <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.7px;">Venue</p>
//                       <p style="margin:0;font-size:16px;font-weight:600;color:#193648;line-height:1.45;">${venue}</p>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>

//           </table>
//         </td>
//       </tr>

//       <!-- REMINDER NOTE -->
//       <tr>
//         <td class="pad" style="padding:24px 48px 0;">
//           <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
//             <tr>
//               <td width="4" style="background:#f59e0b;border-radius:4px 0 0 4px;font-size:0;line-height:0;">&nbsp;</td>
//               <td style="background:#fffbeb;border-radius:0 12px 12px 0;padding:16px 20px;">
//                 <p style="margin:0;font-size:14px;color:#92400e;line-height:1.75;">
//                   &#9200;&nbsp; <strong>Kindly confirm your attendance</strong> at your earliest convenience.
//                   Meeting minutes and all related documents will be shared with attendees after the session.
//                 </p>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>

//       <!-- CLOSING -->
//       <tr>
//         <td class="pad" style="padding:28px 48px 40px;">
//           <p style="margin:0 0 10px;font-size:15px;color:#5a6a7e;line-height:1.75;">
//             We look forward to your participation and valuable contributions.
//           </p>
//           <p style="margin:0;font-size:15px;color:#5a6a7e;line-height:1.6;">
//             Warm regards,<br/>
//             <strong style="color:#193648;font-size:16px;">CollaXion Advisory Board Team</strong>
//           </p>
//         </td>
//       </tr>

//       <!-- FOOTER -->
//       <tr>
//         <td class="fpad" style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:22px 48px;">
//           <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
//             <tr>
//               <td align="center">
//                 <p style="margin:0 0 5px;font-size:14px;font-weight:700;color:#193648;">
//                   Colla<span style="color:#2d6a9f;">Xion</span> &mdash; Bridging Industry &amp; Academia
//                 </p>
//                 <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
//                   This is an automated invitation. Please do not reply to this email.
//                 </p>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>

//     </table>

//   </td></tr>
// </table>
// </body>
// </html>`;

//     await getTransporter().sendMail({
//       from: `"CollaXion Advisory Board" <${process.env.EMAIL_USER}>`,
//       to,
//       subject: `📋 Meeting Invitation: ${agenda} — ${date}`,
//       html,
//     });

//     res.json({ success: true, message: `Invitation sent to ${to}` });
//   } catch (err) {
//     console.error("Email send error:", err);
//     res.status(500).json({ error: "Failed to send email", details: err.message });
//   }
// });

// // ══════════════════════════════════════════════════════════════
// //  POST /api/email/send-minutes
// // ══════════════════════════════════════════════════════════════
// router.post("/send-minutes", async (req, res) => {
//   try {
//     const { recipients, pdfBase64, meetingTitle, date } = req.body;
//     if (!recipients || !pdfBase64)
//       return res.status(400).json({ error: "Missing recipients or PDF" });

//     const pdfBuffer = Buffer.from(pdfBase64, "base64");
//     const results = [];

//     for (const { email, name } of recipients) {
//       try {
//         const html = `<!DOCTYPE html>
// <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//   <title>Meeting Minutes</title>
//   <style type="text/css">
//     * { box-sizing:border-box; }
//     body,table,td { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
//     table,td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
//     body { margin:0!important; padding:0!important; background-color:#eef2f7; width:100%!important; }
//     @media only screen and (max-width:620px) {
//       .email-container { width:100%!important; border-radius:0!important; }
//       .pad { padding:28px 22px!important; }
//       .hpad { padding:32px 22px 28px!important; }
//       .fpad { padding:20px 22px!important; }
//       .chcell { display:block!important; width:100%!important; padding:0 0 12px 0!important; }
//       h2 { font-size:20px!important; }
//     }
//   </style>
// </head>
// <body style="margin:0;padding:0;background-color:#eef2f7;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

// <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#eef2f7;">
//   <tr><td align="center" style="padding:36px 14px;">

//     <table class="email-container" role="presentation" cellpadding="0" cellspacing="0" border="0"
//       width="600" style="max-width:600px;width:100%;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10);">

//       <!-- HEADER -->
//       <tr>
//         <td class="hpad" style="background:linear-gradient(135deg,#193648 0%,#1e4d78 55%,#2d6a9f 100%);padding:40px 48px 36px;">
//           <p style="margin:0;font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px;line-height:1.2;">
//             Colla<span style="color:#60b3f0;">Xion</span>
//           </p>
//           <p style="margin:6px 0 20px;font-size:13px;color:rgba(255,255,255,0.58);">
//             Industry&ndash;Academia Collaboration Platform
//           </p>
//           <span style="display:inline-block;background:rgba(255,255,255,0.14);color:#fff;font-size:11px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;padding:8px 18px;border-radius:30px;border:1px solid rgba(255,255,255,0.24);">
//             &#128196;&nbsp; Official Meeting Minutes
//           </span>
//         </td>
//       </tr>

//       <!-- SESSION STRIP -->
//       <tr>
//         <td style="background:#193648;padding:13px 48px;">
//           <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.72);line-height:1.5;">
//             <strong style="color:#60b3f0;">${meetingTitle}</strong>&nbsp;&#183;&nbsp;${date}
//           </p>
//         </td>
//       </tr>

//       <!-- GREETING -->
//       <tr>
//         <td class="pad" style="padding:44px 48px 0;">
//           <h2 style="margin:0 0 14px;font-size:24px;font-weight:700;color:#193648;line-height:1.35;">
//             Dear ${name || "Attendee"},
//           </h2>
//           <p style="margin:0;font-size:16px;line-height:1.85;color:#5a6a7e;">
//             Please find the official <strong style="color:#193648;">Meeting Minutes</strong> for the
//             advisory board session attached to this email. These minutes have been reviewed for accuracy.
//           </p>
//         </td>
//       </tr>

//       <!-- RULE -->
//       <tr>
//         <td style="padding:28px 48px 0;">
//           <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
//             <tr><td style="height:1px;background:linear-gradient(to right,#e2e8f0,#b8d7f0,#e2e8f0);font-size:0;line-height:0;">&nbsp;</td></tr>
//           </table>
//         </td>
//       </tr>

//       <!-- ATTACHMENT NOTICE -->
//       <tr>
//         <td class="pad" style="padding:28px 48px 0;">
//           <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
//             style="background:#f0fdf4;border:1px solid #86efac;border-radius:14px;overflow:hidden;">
//             <tr>
//               <td width="5" style="background:#16a34a;font-size:0;line-height:0;">&nbsp;</td>
//               <td style="padding:20px 22px;">
//                 <table role="presentation" cellpadding="0" cellspacing="0" border="0">
//                   <tr>
//                     <td width="52" valign="middle" style="padding-right:14px;">
//                       <div style="width:44px;height:44px;background:#16a34a;border-radius:10px;text-align:center;line-height:44px;font-size:22px;">&#128206;</div>
//                     </td>
//                     <td valign="middle">
//                       <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#166534;">PDF Attached</p>
//                       <p style="margin:0;font-size:13px;color:#15803d;line-height:1.5;">
//                         Minutes_${(meetingTitle || "Meeting").replace(/\s+/g, "_")}_${date}.pdf
//                       </p>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>

//       <!-- WHAT TO REVIEW -->
//       <tr>
//         <td class="pad" style="padding:26px 48px 0;">
//           <p style="margin:0 0 16px;font-size:12px;font-weight:700;color:#193648;text-transform:uppercase;letter-spacing:1.1px;">
//             &#9989;&nbsp; Please Review
//           </p>
//           <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
//             <tr>
//               <td class="chcell" width="33%" valign="top" style="padding-right:8px;">
//                 <table role="presentation" cellpadding="0" cellspacing="0" border="0"
//                   style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;width:100%;">
//                   <tr><td style="padding:16px;text-align:center;">
//                     <p style="margin:0 0 7px;font-size:22px;">&#128221;</p>
//                     <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#193648;">Key Decisions</p>
//                     <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.4;">Agreed decisions</p>
//                   </td></tr>
//                 </table>
//               </td>
//               <td class="chcell" width="33%" valign="top" style="padding:0 4px;">
//                 <table role="presentation" cellpadding="0" cellspacing="0" border="0"
//                   style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;width:100%;">
//                   <tr><td style="padding:16px;text-align:center;">
//                     <p style="margin:0 0 7px;font-size:22px;">&#127919;</p>
//                     <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#193648;">Action Items</p>
//                     <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.4;">Assigned tasks</p>
//                   </td></tr>
//                 </table>
//               </td>
//               <td class="chcell" width="33%" valign="top" style="padding-left:8px;">
//                 <table role="presentation" cellpadding="0" cellspacing="0" border="0"
//                   style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;width:100%;">
//                   <tr><td style="padding:16px;text-align:center;">
//                     <p style="margin:0 0 7px;font-size:22px;">&#128197;</p>
//                     <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#193648;">Next Steps</p>
//                     <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.4;">Upcoming follow-ups</p>
//                   </td></tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>

//       <!-- BLUE NOTE -->
//       <tr>
//         <td class="pad" style="padding:22px 48px 0;">
//           <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
//             <tr>
//               <td width="4" style="background:#3b82f6;border-radius:4px 0 0 4px;font-size:0;line-height:0;">&nbsp;</td>
//               <td style="background:#eff6ff;border-radius:0 12px 12px 0;padding:16px 20px;">
//                 <p style="margin:0;font-size:14px;color:#1e40af;line-height:1.75;">
//                   &#128172;&nbsp; Please reach out to the CollaXion team for any corrections,
//                   clarifications, or additions to these minutes.
//                 </p>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>

//       <!-- CLOSING -->
//       <tr>
//         <td class="pad" style="padding:28px 48px 40px;">
//           <p style="margin:0 0 10px;font-size:15px;color:#5a6a7e;line-height:1.75;">
//             Thank you for your participation and valuable contributions.
//           </p>
//           <p style="margin:0;font-size:15px;color:#5a6a7e;line-height:1.6;">
//             Best regards,<br/>
//             <strong style="color:#193648;font-size:16px;">CollaXion Advisory Board Team</strong>
//           </p>
//         </td>
//       </tr>

//       <!-- FOOTER -->
//       <tr>
//         <td class="fpad" style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:22px 48px;">
//           <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
//             <tr><td align="center">
//               <p style="margin:0 0 5px;font-size:14px;font-weight:700;color:#193648;">
//                 Colla<span style="color:#2d6a9f;">Xion</span> &mdash; Bridging Industry &amp; Academia
//               </p>
//               <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
//                 This is an automated email. Please do not reply to this message.
//               </p>
//             </td></tr>
//           </table>
//         </td>
//       </tr>

//     </table>

//   </td></tr>
// </table>
// </body>
// </html>`;

//         await getTransporter().sendMail({
//           from: `"CollaXion Advisory Board" <${process.env.EMAIL_USER}>`,
//           to: email,
//           subject: `📄 Meeting Minutes: ${meetingTitle} — ${date}`,
//           html,
//           attachments: [{
//             filename: `Minutes_${meetingTitle.replace(/\s+/g, "_")}_${date}.pdf`,
//             content: pdfBuffer,
//             contentType: "application/pdf",
//           }],
//         });

//         results.push({ email, success: true });
//       } catch (err) {
//         results.push({ email, success: false, error: err.message });
//       }
//     }

//     const allOk = results.every(r => r.success);
//     res.json({ success: allOk, results });
//   } catch (err) {
//     console.error("Send minutes error:", err);
//     res.status(500).json({ error: "Failed to send minutes", details: err.message });
//   }
// });

// export default router;




import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// ── Lazy transporter — stays same ──
const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    throw new Error(`Email credentials missing.`);
  }
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
};

// Common CSS for both emails
const commonStyles = `
  <style type="text/css">
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f4f7fa; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    .email-container { max-width: 600px !important; margin: 0 auto !important; width: 100% !important; }
    .content-card { background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    
    @media only screen and (max-width: 600px) {
      .responsive-pad { padding: 30px 20px !important; }
      .mobile-stack { display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
      .mobile-margin-top { margin-top: 15px !important; }
      h1 { font-size: 24px !important; }
      .detail-box { padding: 15px !important; }
    }
  </style>
`;

// ══════════════════════════════════════════════════════════════
//  POST /api/email/send-invitation
// ══════════════════════════════════════════════════════════════
router.post("/send-invitation", async (req, res) => {
  try {
    const { to, name, agenda, date, time, venue } = req.body;
    if (!to || !agenda) return res.status(400).json({ error: "Missing required fields" });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${commonStyles}
</head>
<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f7fa; padding: 20px 0;">
    <tr>
      <td align="center">
        <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
          <!-- Logo/Header -->
          <tr>
            <td align="center" style="padding-bottom: 20px;">
               <h1 style="margin:0; color:#193648; font-size: 28px; font-weight: 800;">Colla<span style="color:#2d6a9f;">Xion</span></h1>
            </td>
          </tr>
          
          <tr>
            <td class="content-card">
              <!-- Hero Banner -->
              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #193648 0%, #2d6a9f 100%);">
                <tr>
                  <td class="responsive-pad" style="padding: 40px 50px; text-align: center;">
                    <div style="background: rgba(255,255,255,0.15); display: inline-block; padding: 8px 15px; border-radius: 50px; color: #ffffff; font-size: 12px; font-weight: bold; letter-spacing: 1px; margin-bottom: 15px; text-transform: uppercase;">
                      📅 Meeting Invitation
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; line-height: 1.3;">Advisory Board Meeting</h1>
                  </td>
                </tr>
              </table>

              <!-- Body Content -->
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="responsive-pad" style="padding: 40px 50px;">
                    <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin-top: 0;">
                      Dear <strong>${name || "Representative"}</strong>,
                    </p>
                    <p style="font-size: 16px; color: #4a5568; line-height: 1.6;">
                      We are pleased to invite you to the upcoming <strong>CollaXion Advisory Board Meeting</strong>. Your insights and participation are invaluable to our collaboration efforts.
                    </p>

                    <!-- Details Box -->
                    <div class="detail-box" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 25px; margin: 30px 0;">
                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="padding-bottom: 15px; border-bottom: 1px solid #edf2f7;">
                            <span style="font-size: 12px; color: #718096; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 4px;">Meeting Agenda</span>
                            <span style="font-size: 16px; color: #1a202c; font-weight: 600;">${agenda}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 15px;">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                <td class="mobile-stack" width="50%" valign="top">
                                  <span style="font-size: 12px; color: #718096; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 4px;">Date & Time</span>
                                  <span style="font-size: 15px; color: #1a202c; font-weight: 600;">${date} | ${time}</span>
                                </td>
                                <td class="mobile-stack mobile-margin-top" width="50%" valign="top">
                                  <span style="font-size: 12px; color: #718096; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 4px;">Venue</span>
                                  <span style="font-size: 15px; color: #1a202c; font-weight: 600;">${venue}</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <p style="font-size: 15px; color: #718096; font-style: italic; text-align: center; margin-bottom: 0;">
                      Please confirm your attendance at your earliest convenience.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px 20px;">
              <p style="margin: 0; font-size: 14px; color: #a0aec0;">Warm regards,</p>
              <p style="margin: 5px 0 20px 0; font-size: 15px; font-weight: bold; color: #2d6a9f;">CollaXion Advisory Team</p>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
                <p style="margin: 0; font-size: 12px; color: #cbd5e0; line-height: 1.5;">
                  This is an automated message from CollaXion Platform.<br>
                  Bridging Industry & Academia.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await getTransporter().sendMail({
      from: `"CollaXion Advisory Board" <${process.env.EMAIL_USER}>`,
      to,
      subject: `📋 Invitation: ${agenda} (${date})`,
      html,
    });

    res.json({ success: true, message: `Invitation sent to ${to}` });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send email", details: err.message });
  }
});

// ══════════════════════════════════════════════════════════════
//  POST /api/email/send-minutes
// ══════════════════════════════════════════════════════════════
router.post("/send-minutes", async (req, res) => {
  try {
    const { recipients, pdfBase64, meetingTitle, date } = req.body;
    if (!recipients || !pdfBase64) return res.status(400).json({ error: "Missing required data" });

    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    const results = [];

    for (const { email, name } of recipients) {
      try {
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${commonStyles}
</head>
<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f7fa; padding: 20px 0;">
    <tr>
      <td align="center">
        <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
               <h1 style="margin:0; color:#193648; font-size: 28px; font-weight: 800;">Colla<span style="color:#2d6a9f;">Xion</span></h1>
            </td>
          </tr>
          
          <tr>
            <td class="content-card">
              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #193648;">
                <tr>
                  <td class="responsive-pad" style="padding: 35px 50px;">
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td>
                          <div style="background: #2d6a9f; display: inline-block; padding: 6px 12px; border-radius: 4px; color: #ffffff; font-size: 11px; font-weight: bold; letter-spacing: 1px; margin-bottom: 10px;">
                            OFFICIAL DOCUMENT
                          </div>
                          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Meeting Minutes</h1>
                          <p style="color: #60b3f0; margin: 5px 0 0 0; font-size: 14px;">${meetingTitle} • ${date}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="responsive-pad" style="padding: 40px 50px;">
                    <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin-top: 0;">
                      Dear <strong>${name || "Attendee"}</strong>,
                    </p>
                    <p style="font-size: 16px; color: #4a5568; line-height: 1.6;">
                      Thank you for attending the advisory board meeting. Please find the official minutes of the session attached as a PDF for your review and records.
                    </p>

                    <!-- Attachment Card -->
                    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 25px 0; border: 1px dashed #cbd5e0; border-radius: 8px;">
                      <tr>
                        <td style="padding: 20px; background-color: #fdfdfd;">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td width="48" style="padding-right: 15px;">
                                <div style="width: 44px; height: 44px; background: #fee2e2; border-radius: 8px; text-align: center; line-height: 44px; font-size: 20px;">📄</div>
                              </td>
                              <td>
                                <p style="margin: 0; font-size: 14px; font-weight: bold; color: #2d3748;">Meeting_Minutes.pdf</p>
                                <p style="margin: 2px 0 0 0; font-size: 12px; color: #718096;">Official PDF Attachment</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <div style="background-color: #ebf8ff; border-left: 4px solid #3182ce; padding: 15px 20px; margin-top: 30px;">
                      <p style="margin: 0; font-size: 14px; color: #2b6cb0; line-height: 1.5;">
                        <strong>Note:</strong> If you have any corrections or feedback regarding these minutes, please reply to this email or contact the CollaXion team within 3 working days.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 30px 20px;">
              <p style="margin: 0; font-size: 14px; color: #a0aec0;">Thank you for your contribution.</p>
              <p style="margin: 5px 0 0 0; font-size: 15px; font-weight: bold; color: #193648;">CollaXion Platform</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        await getTransporter().sendMail({
          from: `"CollaXion Advisory Board" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `📄 Meeting Minutes: ${meetingTitle}`,
          html,
          attachments: [{
            filename: `Minutes_${meetingTitle.replace(/\s+/g, "_")}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          }],
        });
        results.push({ email, success: true });
      } catch (err) {
        results.push({ email, success: false, error: err.message });
      }
    }
    res.json({ success: results.every(r => r.success), results });
  } catch (err) {
    res.status(500).json({ error: "Failed to send minutes", details: err.message });
  }
});

export default router;