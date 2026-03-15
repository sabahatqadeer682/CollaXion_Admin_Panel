
// // export default MouManagement;


// import React, { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   PlusCircle, Search, Filter, X, Trash2, Eye, Send,
//   CheckCircle, XCircle, Calendar, Clock, AlertTriangle,
//   FileText, ChevronRight, Bell, User, Building2,
//   MapPin, Coffee, Edit3, History, Stamp, ArrowLeft,
//   Download, BellRing, CheckSquare, Upload
// } from "lucide-react";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/mous";

// // ─── STATUS CONFIG ────────────────────────────────────────────────────────────
// const STATUS = {
//   Draft:                   { color: "#64748b", bg: "#f1f5f9", label: "Draft" },
//   "Sent to Industry":      { color: "#d97706", bg: "#fffbeb", label: "Sent to Industry" },
//   "Changes Proposed":      { color: "#7c3aed", bg: "#f5f3ff", label: "Changes Proposed" },
//   "Approved by Industry":  { color: "#059669", bg: "#ecfdf5", label: "Approved by Industry" },
//   "Approved by University":{ color: "#0284c7", bg: "#e0f2fe", label: "Approved by Univ." },
//   "Mutually Approved":     { color: "#16a34a", bg: "#dcfce7", label: "Mutually Approved ✓" },
//   Rejected:                { color: "#dc2626", bg: "#fef2f2", label: "Rejected" },
// };

// // ─── HELPERS ──────────────────────────────────────────────────────────────────
// const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-PK", { day:"2-digit", month:"short", year:"numeric" }) : "—";
// const calcProgress = (s, e) => {
//   const start = new Date(s), end = new Date(e), now = new Date();
//   if (!start || !end || end <= start) return 100;
//   return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
// };

// // ─── BADGE ────────────────────────────────────────────────────────────────────
// const Badge = ({ status }) => {
//   const cfg = STATUS[status] || STATUS.Draft;
//   return (
//     <span style={{ background: cfg.bg, color: cfg.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.3, border: `1px solid ${cfg.color}30` }}>
//       {cfg.label}
//     </span>
//   );
// };

// // ─── SVG ICON COMPONENTS ──────────────────────────────────────────────────────
// const UniSvg = ({ size = 28 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <path d="M12 3L1 9L12 15L23 9L12 3Z" stroke="#1e3a5f" strokeWidth="1.8" strokeLinejoin="round"/>
//     <path d="M5 12V17C5 17 7.5 20 12 20C16.5 20 19 17 19 17V12" stroke="#1e3a5f" strokeWidth="1.8" strokeLinecap="round"/>
//     <path d="M23 9V15" stroke="#1e3a5f" strokeWidth="1.8" strokeLinecap="round"/>
//   </svg>
// );

// const IndustrySvg = ({ size = 28 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <rect x="2" y="7" width="20" height="15" rx="1" stroke="#1e3a5f" strokeWidth="1.8"/>
//     <path d="M6 7V4H18V7" stroke="#1e3a5f" strokeWidth="1.8" strokeLinecap="round"/>
//     <rect x="9" y="14" width="6" height="8" stroke="#1e3a5f" strokeWidth="1.5"/>
//     <path d="M6 11H8M10 11H12M14 11H16M6 14H8" stroke="#1e3a5f" strokeWidth="1.3" strokeLinecap="round"/>
//   </svg>
// );

// // ─── PROFESSIONAL CENTER DIVIDER ──────────────────────────────────────────────
// const MouDivider = () => (
//   <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
//     <div style={{ width:1, height:16, background:"linear-gradient(to bottom,transparent,#1e3a5f)" }}/>
//     <div style={{ width:40, height:40, border:"2px solid #1e3a5f", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:"#fff", boxShadow:"0 2px 10px rgba(30,58,95,0.14)" }}>
//       <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//         <rect x="3" y="3" width="8" height="8" rx="1" stroke="#1e3a5f" strokeWidth="1.7"/>
//         <rect x="13" y="3" width="8" height="8" rx="1" stroke="#1e3a5f" strokeWidth="1.7"/>
//         <rect x="3" y="13" width="8" height="8" rx="1" stroke="#1e3a5f" strokeWidth="1.7"/>
//         <rect x="13" y="13" width="8" height="8" rx="1" stroke="#1e3a5f" strokeWidth="1.7"/>
//       </svg>
//     </div>
//     <div style={{ width:1, height:16, background:"linear-gradient(to top,transparent,#1e3a5f)" }}/>
//     <div style={{ fontSize:9, letterSpacing:2.5, color:"#7a8fa6", textTransform:"uppercase", fontWeight:700, marginTop:5 }}>MOU</div>
//   </div>
// );

// // ─── LOGO DISPLAY ─────────────────────────────────────────────────────────────
// const LogoDisplay = ({ src, fallback, size = 44 }) => (
//   src
//     ? <img src={src} alt="logo" style={{ width:size, height:size, objectFit:"contain", borderRadius:4 }}/>
//     : <div style={{ width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center" }}>{fallback}</div>
// );

// // ─── LOGO UPLOAD FIELD ────────────────────────────────────────────────────────
// const LogoUploadField = ({ label, value, onChange }) => {
//   const ref = useRef();
//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => onChange(ev.target.result);
//     reader.readAsDataURL(file);
//   };
//   return (
//     <div style={{ marginBottom:10 }}>
//       <label style={{ fontSize:12, color:"#64748b", display:"block", marginBottom:6, fontWeight:600 }}>{label}</label>
//       <div style={{ display:"flex", alignItems:"center", gap:12 }}>
//         <div style={{ width:56, height:56, border:"1.5px dashed #c5d5e8", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:"#f8fafc", overflow:"hidden", flexShrink:0 }}>
//           {value ? <img src={value} alt="logo" style={{ width:"100%", height:"100%", objectFit:"contain" }}/> : <Upload size={18} color="#94a3b8"/>}
//         </div>
//         <div>
//           <div style={{ display:"flex", gap:6, marginBottom:4 }}>
//             <button type="button" style={S.uploadBtn} onClick={() => ref.current.click()}>
//               <Upload size={12}/> {value ? "Change" : "Upload Logo"}
//             </button>
//             {value && (
//               <button type="button" style={{ ...S.uploadBtn, background:"#fef2f2", color:"#dc2626", borderColor:"#fecaca" }} onClick={() => onChange("")}>Remove</button>
//             )}
//           </div>
//           <div style={{ fontSize:11, color:"#94a3b8" }}>PNG or JPG recommended</div>
//         </div>
//         <input ref={ref} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFile}/>
//       </div>
//     </div>
//   );
// };

// // ─── NOTIFICATION SYSTEM ──────────────────────────────────────────────────────
// const NotificationContext = React.createContext(null);
// const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);
//   const addNotification = (msg, type = "info") => {
//     const id = Date.now();
//     setNotifications(n => [...n, { id, msg, type }]);
//     setTimeout(() => setNotifications(n => n.filter(x => x.id !== id)), 5000);
//   };
//   return (
//     <NotificationContext.Provider value={{ notifications, addNotification }}>
//       {children}
//       <div style={{ position:"fixed", top:70, right:20, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
//         <AnimatePresence>
//           {notifications.map(n => (
//             <motion.div key={n.id} initial={{ opacity:0, x:80 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:80 }}
//               style={{ background: n.type==="success"?"#dcfce7": n.type==="error"?"#fef2f2":"#eff6ff", border:`1px solid ${n.type==="success"?"#86efac": n.type==="error"?"#fca5a5":"#93c5fd"}`, color: n.type==="success"?"#166534": n.type==="error"?"#991b1b":"#1e40af", padding:"10px 16px", borderRadius:10, boxShadow:"0 4px 20px rgba(0,0,0,0.12)", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:8, maxWidth:320 }}>
//               {n.type === "success" ? <CheckCircle size={15}/> : <BellRing size={15}/>}
//               {n.msg}
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </NotificationContext.Provider>
//   );
// };
// const useNotify = () => React.useContext(NotificationContext);

// // ═══════════════════════════════════════════════════════════════════════════════
// //  PDF GENERATOR — Professional, no meeting info
// // ═══════════════════════════════════════════════════════════════════════════════
// const generateMouPdf = (mou) => {
//   let n = 1;
//   const sec = (t) => `${n++}. ${t.toUpperCase()}`;
//   const refNo = `MOU-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

//   const uniLogoHtml = mou.universityLogo
//     ? `<img src="${mou.universityLogo}" style="width:56px;height:56px;object-fit:contain;border-radius:4px;"/>`
//     : `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 3L1 9L12 15L23 9L12 3Z" stroke="#1e3a5f" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 12V17C5 17 7.5 20 12 20C16.5 20 19 17 19 17V12" stroke="#1e3a5f" stroke-width="1.8" stroke-linecap="round"/><path d="M23 9V15" stroke="#1e3a5f" stroke-width="1.8" stroke-linecap="round"/></svg>`;

//   const indLogoHtml = mou.industryLogo
//     ? `<img src="${mou.industryLogo}" style="width:56px;height:56px;object-fit:contain;border-radius:4px;"/>`
//     : `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="15" rx="1" stroke="#1e3a5f" stroke-width="1.8"/><path d="M6 7V4H18V7" stroke="#1e3a5f" stroke-width="1.8" stroke-linecap="round"/><rect x="9" y="14" width="6" height="8" stroke="#1e3a5f" stroke-width="1.5"/><path d="M6 11H8M10 11H12M14 11H16" stroke="#1e3a5f" stroke-width="1.3" stroke-linecap="round"/></svg>`;

//   const html = `<!DOCTYPE html>
// <html>
// <head>
// <meta charset="utf-8"/>
// <title>${refNo} — ${mou.title || "MOU"}</title>
// <style>
//   @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant+Garamond:wght@500;600;700&display=swap');
//   @page { size:A4; margin:0; }
//   *{margin:0;padding:0;box-sizing:border-box;}
//   body{font-family:'EB Garamond',Georgia,serif;color:#1a2340;background:#fff;font-size:13.5px;line-height:1.8;}
//   .page{width:794px;min-height:1122px;margin:0 auto;position:relative;}
//   .frame-outer{position:absolute;inset:14px;border:2.5px solid #1e3a5f;pointer-events:none;}
//   .frame-inner{position:absolute;inset:21px;border:0.75px solid #a8bcd4;pointer-events:none;}
//   .corner{position:absolute;width:20px;height:20px;}
//   .corner.tl{top:9px;left:9px;border-top:2.5px solid #1e3a5f;border-left:2.5px solid #1e3a5f;}
//   .corner.tr{top:9px;right:9px;border-top:2.5px solid #1e3a5f;border-right:2.5px solid #1e3a5f;}
//   .corner.bl{bottom:9px;left:9px;border-bottom:2.5px solid #1e3a5f;border-left:2.5px solid #1e3a5f;}
//   .corner.br{bottom:9px;right:9px;border-bottom:2.5px solid #1e3a5f;border-right:2.5px solid #1e3a5f;}
//   .topbar{height:7px;background:#1e3a5f;margin:14px 14px 0;}
//   .content{padding:42px 58px 40px;position:relative;z-index:1;}
//   .logo-row{display:flex;justify-content:space-between;align-items:center;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #c0cedc;}
//   .entity{display:flex;align-items:center;gap:13px;}
//   .entity.right{flex-direction:row-reverse;}
//   .logo-box{width:62px;height:62px;border:1.5px solid #c0cedc;border-radius:6px;background:#f4f7fb;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;}
//   .entity-text{line-height:1.35;}
//   .entity-text.right{text-align:right;}
//   .entity-tag{font-size:8.5px;letter-spacing:2.5px;color:#8a9db5;text-transform:uppercase;font-weight:700;}
//   .entity-name{font-family:'Cormorant Garamond',serif;font-size:14.5px;font-weight:700;color:#1e3a5f;max-width:195px;}
//   .center-divider{display:flex;flex-direction:column;align-items:center;gap:3px;padding:0 20px;}
//   .d-line{width:1px;height:18px;}
//   .d-line.t{background:linear-gradient(to bottom,transparent,rgba(30,58,95,0.5));}
//   .d-line.b{background:linear-gradient(to top,transparent,rgba(30,58,95,0.5));}
//   .d-circle{width:44px;height:44px;border:2px solid #1e3a5f;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(30,58,95,0.13);}
//   .d-label{font-size:7.5px;letter-spacing:3px;color:#8a9db5;text-transform:uppercase;font-weight:700;margin-top:5px;}
//   .title-block{text-align:center;padding:16px 0 14px;}
//   .doc-eyebrow{font-size:9px;letter-spacing:4px;color:#8a9db5;text-transform:uppercase;font-weight:700;margin-bottom:8px;}
//   .doc-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:#1e3a5f;letter-spacing:1.5px;line-height:1.1;}
//   .doc-sub{font-size:12px;color:#8a9db5;margin-top:8px;font-style:italic;}
//   .approved-row{text-align:center;margin:10px 0 18px;}
//   .approved-seal{display:inline-flex;align-items:center;gap:11px;border:1.8px solid #15803d;color:#15803d;padding:5px 24px;font-size:10.5px;font-weight:700;letter-spacing:3px;text-transform:uppercase;}
//   .seal-dot{width:6px;height:6px;background:#15803d;border-radius:50%;}
//   .hr-bold{border:none;border-top:1.8px solid #1e3a5f;margin:14px 0;}
//   .hr{border:none;border-top:0.75px solid #c0cedc;margin:12px 0;}
//   .section{margin-bottom:17px;}
//   .sec-title{font-family:'Cormorant Garamond',serif;font-size:12px;font-weight:700;color:#1e3a5f;letter-spacing:1.8px;text-transform:uppercase;border-left:3px solid #1e3a5f;padding:1px 0 1px 10px;margin-bottom:9px;}
//   p{margin-bottom:5px;color:#2d3748;font-size:13px;}
//   ul,ol{padding-left:22px;color:#2d3748;}
//   li{margin-bottom:3px;font-size:13px;}
//   .ptable{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px;}
//   .ptable .h td{background:#eef3f8;font-weight:700;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#1e3a5f;padding:7px 14px;border:1px solid #c0cedc;}
//   .ptable .b td{padding:11px 14px;border:1px solid #c0cedc;vertical-align:top;}
//   .p-name{font-size:13px;font-weight:600;color:#1e3a5f;margin-bottom:4px;}
//   .p-info{font-size:11.5px;color:#5a6a7e;line-height:1.6;}
//   .sig-row{display:flex;gap:40px;margin-top:34px;}
//   .sig-box{flex:1;}
//   .sig-lbl{font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#a0adb8;font-weight:700;margin-bottom:4px;}
//   .sig-line{border-bottom:1px solid #1e3a5f;height:44px;margin-bottom:6px;}
//   .sig-name{font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700;color:#1e3a5f;}
//   .sig-org{font-size:11px;color:#7a8fa6;margin-top:1px;}
//   .sig-date{font-size:10.5px;color:#a0adb8;margin-top:8px;}
//   .doc-footer{margin-top:26px;padding-top:10px;border-top:1px solid #c0cedc;display:flex;justify-content:space-between;font-size:10px;color:#a0adb8;font-style:italic;}
//   .watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-38deg);font-family:'Cormorant Garamond',serif;font-size:96px;font-weight:700;color:rgba(30,58,95,0.036);letter-spacing:6px;white-space:nowrap;pointer-events:none;z-index:0;}
//   @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
// </style>
// </head>
// <body>
// <div class="page">
//   <div class="watermark">CONFIDENTIAL</div>
//   <div class="topbar"></div>
//   <div class="frame-outer"></div>
//   <div class="frame-inner"></div>
//   <div class="corner tl"></div><div class="corner tr"></div>
//   <div class="corner bl"></div><div class="corner br"></div>
//   <div class="content">

//     <div class="logo-row">
//       <div class="entity">
//         <div class="logo-box">${uniLogoHtml}</div>
//         <div class="entity-text">
//           <div class="entity-tag">University</div>
//           <div class="entity-name">${mou.university}</div>
//         </div>
//       </div>
//       <div class="center-divider">
//         <div class="d-line t"></div>
//         <div class="d-circle">
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//             <rect x="3" y="3" width="8" height="8" rx="1" stroke="#1e3a5f" stroke-width="1.7"/>
//             <rect x="13" y="3" width="8" height="8" rx="1" stroke="#1e3a5f" stroke-width="1.7"/>
//             <rect x="3" y="13" width="8" height="8" rx="1" stroke="#1e3a5f" stroke-width="1.7"/>
//             <rect x="13" y="13" width="8" height="8" rx="1" stroke="#1e3a5f" stroke-width="1.7"/>
//           </svg>
//         </div>
//         <div class="d-line b"></div>
//         <div class="d-label">Agreement</div>
//       </div>
//       <div class="entity right">
//         <div class="logo-box">${indLogoHtml}</div>
//         <div class="entity-text right">
//           <div class="entity-tag">Industry Partner</div>
//           <div class="entity-name">${mou.industry}</div>
//         </div>
//       </div>
//     </div>

//     <div class="title-block">
//       <div class="doc-eyebrow">Official Document</div>
//       <div class="doc-title">Memorandum of Understanding</div>
//       <div class="doc-sub">Ref. No.: ${refNo} &nbsp;·&nbsp; Dated: ${fmtDate(new Date().toISOString())} &nbsp;·&nbsp; Type: ${mou.collaborationType}</div>
//     </div>

//     <div class="approved-row">
//       <div class="approved-seal"><span class="seal-dot"></span> Mutually Approved &amp; Executed <span class="seal-dot"></span></div>
//     </div>

//     <hr class="hr-bold"/>

//     <div class="section">
//       <div class="sec-title">${sec("Parties to This Agreement")}</div>
//       <table class="ptable">
//         <tr class="h"><td>First Party — University</td><td>Second Party — Industry Partner</td></tr>
//         <tr class="b">
//           <td>
//             <div class="p-name">${mou.university}</div>
//             <div class="p-info">
//               ${mou.universityContact?.name ? `Contact: ${mou.universityContact.name}<br/>` : ""}
//               ${mou.universityContact?.designation ? `Designation: ${mou.universityContact.designation}<br/>` : ""}
//               ${mou.universityContact?.email ? `Email: ${mou.universityContact.email}<br/>` : ""}
//               Signatory: <em>${mou.signatories?.university || "University Authority"}</em>
//             </div>
//           </td>
//           <td>
//             <div class="p-name">${mou.industry}</div>
//             <div class="p-info">
//               ${mou.industryContact?.name ? `Contact: ${mou.industryContact.name}<br/>` : ""}
//               ${mou.industryContact?.designation ? `Designation: ${mou.industryContact.designation}<br/>` : ""}
//               ${mou.industryContact?.email ? `Email: ${mou.industryContact.email}<br/>` : ""}
//               Signatory: <em>${mou.signatories?.industry || "Industry Authority"}</em>
//             </div>
//           </td>
//         </tr>
//       </table>
//     </div>

//     <div class="section">
//       <div class="sec-title">${sec("Purpose and Scope")}</div>
//       <p>${mou.description || "This Memorandum of Understanding establishes a formal framework for collaboration between the parties, defining mutual obligations and the scope of the partnership."}</p>
//     </div>

//     <div class="section">
//       <div class="sec-title">${sec("Nature of Collaboration")}</div>
//       <p>The nature of collaboration under this MOU is classified as: <strong>${mou.collaborationType}</strong>.</p>
//     </div>

//     <div class="section">
//       <div class="sec-title">${sec("Duration and Validity")}</div>
//       <p>This MOU shall come into force on <strong>${fmtDate(mou.startDate)}</strong> and shall remain valid until <strong>${fmtDate(mou.endDate)}</strong>, unless extended or terminated earlier by mutual written consent.</p>
//     </div>

//     ${mou.objectives?.filter(Boolean).length > 0 ? `
//     <div class="section">
//       <div class="sec-title">${sec("Objectives")}</div>
//       <ul>${mou.objectives.filter(Boolean).map(o => `<li>${o}</li>`).join("")}</ul>
//     </div>` : ""}

//     ${(mou.responsibilities?.university?.filter(Boolean).length > 0 || mou.responsibilities?.industry?.filter(Boolean).length > 0) ? `
//     <div class="section">
//       <div class="sec-title">${sec("Roles and Responsibilities")}</div>
//       ${mou.responsibilities?.university?.filter(Boolean).length > 0 ? `<p style="margin-bottom:4px;"><strong>${mou.university}:</strong></p><ul style="margin-bottom:10px;">${mou.responsibilities.university.filter(Boolean).map(r=>`<li>${r}</li>`).join("")}</ul>` : ""}
//       ${mou.responsibilities?.industry?.filter(Boolean).length > 0 ? `<p style="margin-bottom:4px;"><strong>${mou.industry}:</strong></p><ul>${mou.responsibilities.industry.filter(Boolean).map(r=>`<li>${r}</li>`).join("")}</ul>` : ""}
//     </div>` : ""}

//     ${mou.terms?.filter(Boolean).length > 0 ? `
//     <div class="section">
//       <div class="sec-title">${sec("Terms and Conditions")}</div>
//       <ol>${mou.terms.filter(Boolean).map(t=>`<li>${t}</li>`).join("")}</ol>
//     </div>` : ""}

//     <div class="section">
//       <div class="sec-title">${sec("General Provisions")}</div>
//       <p>This MOU does not create legally binding financial obligations unless a formal agreement is subsequently executed. Either party may terminate with thirty (30) days' written notice. Amendments require mutual written consent. This MOU shall be governed by the applicable laws of Pakistan.</p>
//     </div>

//     <hr class="hr-bold"/>

//     <div class="sec-title" style="margin-bottom:10px;">${sec("Execution and Authentication")}</div>
//     <p style="font-size:12px;color:#5a6a7e;margin-bottom:6px;">In witness whereof, the duly authorized representatives of both parties have signed this MOU on the date first written above.</p>

//     <div class="sig-row">
//       <div class="sig-box">
//         <div class="sig-lbl">Authorized Signatory — First Party</div>
//         <div class="sig-line"></div>
//         <div class="sig-name">${mou.signatories?.university || "University Authority"}</div>
//         <div class="sig-org">${mou.university}</div>
//         <div class="sig-date">Date: ${mou.universityStamp ? fmtDate(mou.universityStamp.date) : "____________________"}</div>
//       </div>
//       <div class="sig-box">
//         <div class="sig-lbl">Authorized Signatory — Second Party</div>
//         <div class="sig-line"></div>
//         <div class="sig-name">${mou.signatories?.industry || "Industry Authority"}</div>
//         <div class="sig-org">${mou.industry}</div>
//         <div class="sig-date">Date: ${mou.industryStamp ? fmtDate(mou.industryStamp.date) : "____________________"}</div>
//       </div>
//     </div>

//     <div class="doc-footer">
//       <span>MOU Portal — University Administration System</span>
//       <span>Ref: ${refNo}</span>
//       <span>Generated: ${new Date().toLocaleDateString("en-PK",{day:"2-digit",month:"long",year:"numeric"})}</span>
//     </div>

//   </div>
// </div>
// </body>
// </html>`;

//   const iframe = document.createElement("iframe");
//   iframe.style.display = "none";
//   document.body.appendChild(iframe);
//   iframe.contentDocument.write(html);
//   iframe.contentDocument.close();
//   setTimeout(() => {
//     iframe.contentWindow.focus();
//     iframe.contentWindow.print();
//     setTimeout(() => document.body.removeChild(iframe), 1200);
//   }, 600);
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// const MouManagement = () => (
//   <NotificationProvider><MouApp /></NotificationProvider>
// );

// const MouApp = () => {
//   const { addNotification } = useNotify();
//   const [view, setView]             = useState("list");
//   const [mous, setMous]             = useState([]);
//   const [selected, setSelected]     = useState(null);
//   const [search, setSearch]         = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [loading, setLoading]       = useState(true);
//   const [meetingModal, setMeetingModal] = useState(false);
//   const [approveModal, setApproveModal] = useState(false);
//   const [stampType, setStampType]   = useState("");
//   const [notifPanel, setNotifPanel] = useState(false);
//   const [notifLog, setNotifLog]     = useState([]);

//   useEffect(() => { fetchMous(); }, []);

//   const fetchMous = async () => {
//     try { setLoading(true); const res = await axios.get(API_URL); setMous(res.data); }
//     catch (e) { console.error(e); } finally { setLoading(false); }
//   };

//   const pushNotif = (msg, type = "info") => {
//     addNotification(msg, type);
//     setNotifLog(l => [{ msg, type, time: new Date() }, ...l.slice(0, 19)]);
//   };

//   const filtered = mous.filter(m => {
//     const q = search.toLowerCase();
//     const matchQ = !q || m.university?.toLowerCase().includes(q) || m.industry?.toLowerCase().includes(q) || m.title?.toLowerCase().includes(q);
//     return matchQ && (filterStatus === "All" || m.status === filterStatus);
//   });

//   const expiringSoon = mous.filter(m => {
//     const diff = (new Date(m.endDate) - new Date()) / 86400000;
//     return diff > 0 && diff <= 30;
//   });

//   const openDetail = (mou) => { setSelected(mou); setView("detail"); };
//   const goBack     = ()    => { setSelected(null); setView("list"); };

//   const handleSend = async () => {
//     if (!selected || !window.confirm(`Send this MOU to ${selected.industry}?`)) return;
//     try {
//       const res = await axios.put(`${API_URL}/${selected._id}`, { ...selected, status:"Sent to Industry", sentAt:new Date().toISOString() });
//       updateLocal(res.data);
//       pushNotif(`MOU sent to ${selected.industry} successfully!`, "success");
//     } catch { pushNotif("Error sending MOU", "error"); }
//   };

//   const handleApproveReject = async (type) => {
//     if (!selected) return;
//     const stamp = { by:"University Admin", type, date:new Date().toISOString() };
//     try {
//       const isMutual = type === "approve" && selected.status === "Approved by Industry";
//       const res = await axios.put(`${API_URL}/${selected._id}`, {
//         ...selected,
//         status: isMutual ? "Mutually Approved" : (type==="approve" ? "Approved by University" : "Rejected"),
//         universityStamp: stamp,
//       });
//       updateLocal(res.data); setApproveModal(false);
//       if (isMutual) pushNotif("🎉 Mutually Approved! PDF download available.", "success");
//       else if (type === "approve") {
//         pushNotif("MOU approved by University.", "success");
//         setTimeout(() => pushNotif(`Notification sent to ${selected.industry} — University approved.`, "info"), 1200);
//       } else {
//         pushNotif("MOU rejected. Industry will be notified.", "error");
//         setTimeout(() => pushNotif(`Notification sent to ${selected.industry} — MOU rejected.`, "info"), 1200);
//       }
//     } catch { pushNotif("Error updating status", "error"); }
//   };

//   const handleIndustryApprove = async () => {
//     if (!selected) return;
//     const stamp = { by:selected.industry, type:"approve", date:new Date().toISOString() };
//     try {
//       const isMutual = selected.status === "Approved by University";
//       const res = await axios.put(`${API_URL}/${selected._id}`, {
//         ...selected,
//         status: isMutual ? "Mutually Approved" : "Approved by Industry",
//         industryStamp: stamp, industryResponseAt: new Date().toISOString(),
//       });
//       updateLocal(res.data);
//       if (isMutual) pushNotif("🎉 Both parties approved! MOU is Mutually Approved.", "success");
//       else { pushNotif(`${selected.industry} has approved the MOU!`, "success"); setTimeout(() => pushNotif("University notified of industry approval.", "info"), 1200); }
//     } catch { pushNotif("Error processing industry approval", "error"); }
//   };

//   const handleMeetingSave = async (meetingData) => {
//     try {
//       const res = await axios.put(`${API_URL}/${selected._id}`, { ...selected, scheduledMeeting: meetingData });
//       updateLocal(res.data); setMeetingModal(false);
//       pushNotif(`Meeting scheduled for ${meetingData.date} at ${meetingData.time}`, "success");
//       setTimeout(() => pushNotif(`${selected.industry} notified of scheduled meeting.`, "info"), 1000);
//     } catch { pushNotif("Error saving meeting", "error"); }
//   };

//   const handleSendAfterApprove = () => {
//     if (!selected) return;
//     pushNotif(`Re-sent MOU notification to ${selected.industry} with current approval status.`, "success");
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this MOU?")) return;
//     await axios.delete(`${API_URL}/${id}`);
//     setMous(s => s.filter(m => m._id !== id));
//     if (view === "detail") goBack();
//   };

//   const simulateIndustryChange = async () => {
//     if (!selected) return;
//     try {
//       const res = await axios.put(`${API_URL}/${selected._id}`, {
//         ...selected, status:"Changes Proposed",
//         proposedChanges: [...(selected.proposedChanges||[]), { field:"Duration", oldValue:fmtDate(selected.endDate), newValue:"Extended by 6 months", reason:"Project scope expanded", date:new Date().toISOString() }],
//         industryResponseAt: new Date().toISOString(),
//       });
//       updateLocal(res.data);
//       pushNotif(`${selected.industry} has proposed changes to the MOU!`, "info");
//     } catch { pushNotif("Error simulating change", "error"); }
//   };

//   const updateLocal = (updated) => {
//     setMous(s => s.map(m => m._id === updated._id ? updated : m));
//     setSelected(updated);
//   };

//   return (
//     <div style={S.page}>
//       <div style={S.topbar}>
//         <div style={S.brand}>
//           <FileText size={20} color="#fff"/>
//           <span style={S.brandText}>MOU</span>
//           <span style={S.brandSub}>Industry Liason Incharge</span>
//         </div>
//         <div style={S.topActions}>
//           {expiringSoon.length > 0 && <div style={S.alertChip}><Bell size={13}/> {expiringSoon.length} expiring soon</div>}
//           <div style={{ position:"relative" }}>
//             <motion.button whileHover={{ scale:1.05 }} style={S.notifBtn} onClick={() => setNotifPanel(p=>!p)}>
//               <Bell size={16} color="#fff"/>
//               {notifLog.length > 0 && <span style={S.notifDot}>{notifLog.length > 9 ? "9+" : notifLog.length}</span>}
//             </motion.button>
//             <AnimatePresence>
//               {notifPanel && (
//                 <motion.div initial={{ opacity:0, y:-10, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-10, scale:0.95 }} style={S.notifPanel}>
//                   <div style={S.notifPanelHeader}>
//                     <span style={{ fontWeight:700, fontSize:14, color:"#1e3a5f" }}>Notifications</span>
//                     {notifLog.length > 0 && <button style={S.clearBtn} onClick={() => setNotifLog([])}>Clear all</button>}
//                   </div>
//                   {notifLog.length === 0
//                     ? <div style={{ padding:20, color:"#94a3b8", fontSize:13, textAlign:"center" }}>No notifications yet</div>
//                     : notifLog.map((n,i) => (
//                       <div key={i} style={S.notifItem}>
//                         <div style={{ fontSize:13, color:"#1e3a5f" }}>{n.msg}</div>
//                         <div style={{ fontSize:11, color:"#94a3b8" }}>{n.time?.toLocaleTimeString()}</div>
//                       </div>
//                     ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//           <div style={S.avatar}>CX</div>
//         </div>
//       </div>

//       <div style={S.body}>
//         {view === "list" && (
//           <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
//             <div style={S.statsRow}>
//               {[
//                 { label:"Total MOUs",        val:mous.length,                                                                              color:"#1e3a5f" },
//                 { label:"Ongoing",           val:mous.filter(m=>new Date(m.endDate)>new Date()).length,                                    color:"#0284c7" },
//                 { label:"Pending Review",    val:mous.filter(m=>["Changes Proposed","Approved by Industry"].includes(m.status)).length,    color:"#7c3aed" },
//                 { label:"Expiring Soon",     val:expiringSoon.length,                                                                      color:"#d97706" },
//                 { label:"Mutually Approved", val:mous.filter(m=>m.status==="Mutually Approved").length,                                    color:"#16a34a" },
//               ].map((s,i) => (
//                 <div key={i} style={S.statCard}>
//                   <div style={{ fontSize:11, color:"#64748b", marginBottom:4 }}>{s.label}</div>
//                   <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.val}</div>
//                 </div>
//               ))}
//             </div>
//             <div style={S.toolbar}>
//               <div style={S.searchBox}>
//                 <Search size={15} color="#94a3b8"/>
//                 <input style={S.searchInput} placeholder="Search by name, industry, title..." value={search} onChange={e=>setSearch(e.target.value)}/>
//                 {search && <X size={14} style={{ cursor:"pointer" }} onClick={() => setSearch("")}/>}
//               </div>
//               <div style={S.filterBox}>
//                 <Filter size={14} color="#64748b"/>
//                 <select style={S.filterSel} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
//                   <option>All</option>
//                   {Object.keys(STATUS).map(s=><option key={s}>{s}</option>)}
//                 </select>
//               </div>
//               <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }} style={S.createBtn} onClick={() => setView("create")}>
//                 <PlusCircle size={15}/> Create MOU
//               </motion.button>
//             </div>
//             {loading ? <div style={S.empty}>Loading MOUs...</div>
//               : filtered.length === 0 ? <div style={S.empty}>No MOUs found. Create one!</div>
//               : <div style={S.cardGrid}>{filtered.map(m=><MouCard key={m._id} m={m} onOpen={openDetail} onDelete={handleDelete}/>)}</div>}
//           </motion.div>
//         )}
//         {view === "create" && (
//           <CreateMou onBack={goBack} onSaved={(saved) => { setMous(s=>[saved,...s]); pushNotif("MOU created and saved as Draft!", "success"); goBack(); }}/>
//         )}
//         {view === "detail" && selected && (
//           <DetailView mou={selected} onBack={goBack} onSend={handleSend} onDelete={() => handleDelete(selected._id)}
//             onScheduleMeeting={() => setMeetingModal(true)}
//             onApproveReject={(type) => { setStampType(type); setApproveModal(true); }}
//             onUpdate={updateLocal} onSendAfterApprove={handleSendAfterApprove}
//             onSimulateChange={simulateIndustryChange} onIndustryApprove={handleIndustryApprove}
//             onDownloadPdf={() => generateMouPdf(selected)}/>
//         )}
//       </div>

//       <AnimatePresence>
//         {meetingModal && <MeetingModal existing={selected?.scheduledMeeting} onClose={() => setMeetingModal(false)} onSave={handleMeetingSave}/>}
//       </AnimatePresence>
//       <AnimatePresence>
//         {approveModal && <StampModal type={stampType} mou={selected} onClose={() => setApproveModal(false)} onConfirm={() => handleApproveReject(stampType)}/>}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  MOU CARD
// // ═══════════════════════════════════════════════════════════════════════════════
// const MouCard = ({ m, onOpen, onDelete }) => {
//   const prog = calcProgress(m.startDate, m.endDate);
//   const hasChanges = m.proposedChanges && m.proposedChanges.length > 0;
//   const needsAction = ["Changes Proposed","Approved by Industry"].includes(m.status);
//   return (
//     <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
//       whileHover={{ y:-3, boxShadow:"0 8px 30px rgba(0,0,0,0.1)" }}
//       style={{ ...S.card, ...(needsAction ? S.cardUrgent : {}) }}>
//       {needsAction && <div style={S.urgentStrip}>⚡ Action Required</div>}
//       {m.status === "Mutually Approved" && <div style={{ ...S.urgentStrip, background:"#dcfce7", color:"#16a34a" }}>✅ Mutually Approved</div>}
//       <div style={S.cardTop}>
//         <div>
//           <div style={S.cardTitle}>{m.title || "Untitled MOU"}</div>
//           <div style={S.cardMeta}><Building2 size={12}/> {m.university}<ChevronRight size={12} style={{ margin:"0 2px" }}/>{m.industry}</div>
//         </div>
//         <Badge status={m.status}/>
//       </div>
//       <div style={{ fontSize:12, color:"#64748b", margin:"6px 0" }}>
//         📅 {fmtDate(m.startDate)} → {fmtDate(m.endDate)}
//         {m.collaborationType && <span style={{ marginLeft:8, background:"#e2e8f0", padding:"1px 8px", borderRadius:10, fontSize:11 }}>{m.collaborationType}</span>}
//       </div>
//       {hasChanges && <div style={S.changesBadge}><History size={11}/> {m.proposedChanges.length} change(s) proposed by industry</div>}
//       <div style={{ margin:"8px 0 4px" }}>
//         <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#94a3b8", marginBottom:3 }}><span>Progress</span><span>{prog}%</span></div>
//         <div style={{ height:4, background:"#e2e8f0", borderRadius:4 }}>
//           <div style={{ width:`${prog}%`, height:"100%", background:needsAction?"#7c3aed":"#0284c7", borderRadius:4, transition:"width 0.5s" }}/>
//         </div>
//       </div>
//       <div style={S.cardFooter}>
//         <button style={S.btnOutline} onClick={() => onOpen(m)}><Eye size={13}/> View Details</button>
//         <button style={S.btnDanger} onClick={() => onDelete(m._id)}><Trash2 size={13}/></button>
//       </div>
//     </motion.div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  CREATE MOU
// // ═══════════════════════════════════════════════════════════════════════════════
// const CreateMou = ({ onBack, onSaved }) => {
//   const [saving, setSaving] = useState(false);
//   const [form, setForm] = useState({
//     title:"", university:"", industry:"", collaborationType:"",
//     startDate:"", endDate:"", description:"", objectives:[""],
//     responsibilities:{ university:[""], industry:[""] }, terms:[""],
//     signatories:{ university:"", industry:"" },
//     universityContact:{ name:"", designation:"", email:"" },
//     industryContact:{ name:"", designation:"", email:"" },
//     universityLogo:"", industryLogo:"",
//     status:"Draft",
//   });

//   const set = (k,v) => setForm(f=>({...f,[k]:v}));
//   const arrAdd    = (k)       => setForm(f=>({...f,[k]:[...f[k],""]}));
//   const arrRemove = (k,i)     => setForm(f=>({...f,[k]:f[k].filter((_,j)=>j!==i)}));
//   const arrUpdate = (k,i,v)   => setForm(f=>{ const a=[...f[k]]; a[i]=v; return {...f,[k]:a}; });
//   const n2Add    = (k,s)      => setForm(f=>({...f,[k]:{...f[k],[s]:[...f[k][s],""]}}));
//   const n2Remove = (k,s,i)    => setForm(f=>({...f,[k]:{...f[k],[s]:f[k][s].filter((_,j)=>j!==i)}}));
//   const n2Update = (k,s,i,v)  => setForm(f=>{ const a=[...f[k][s]]; a[i]=v; return {...f,[k]:{...f[k],[s]:a}}; });

//   const handleSave = async () => {
//     const { title, university, industry, collaborationType, startDate, endDate } = form;
//     if (!title||!university||!industry||!collaborationType||!startDate||!endDate) return alert("Please fill all required fields.");
//     try { setSaving(true); const res = await axios.post(API_URL, form); onSaved(res.data); }
//     catch(e) { alert("Error saving MOU: " + (e.response?.data?.message || e.message)); }
//     finally { setSaving(false); }
//   };

//   return (
//     <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}>
//       <div style={S.detailHeader}>
//         <button style={S.backBtn} onClick={onBack}><ArrowLeft size={16}/> Back</button>
//         <div>
//           <h2 style={{ margin:0, color:"#1e3a5f", fontSize:20 }}>Create New MOU</h2>
//           <p style={{ margin:0, fontSize:13, color:"#64748b" }}>Fill in MOU details </p>
//         </div>
//         <div style={{ display:"flex", gap:8 }}>
//           <button style={S.btnOutline} onClick={onBack}>Cancel</button>
//           <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} style={S.btnPrimary} onClick={handleSave} disabled={saving}>
//             {saving ? "Saving..." : "💾 Save Draft"}
//           </motion.button>
//         </div>
//       </div>

//       {/* LIVE PREVIEW HEADER */}
//       <div style={S.mouHeaderPreview}>
//         <div style={S.mouLogoBox}>
//           <div style={S.mouLogoIconWrap}>
//             <LogoDisplay src={form.universityLogo} fallback={<UniSvg size={26}/>} size={44}/>
//           </div>
//           <div style={S.mouLogoName}>{form.university || "University Name"}</div>
//           <div style={S.mouLogoSub}>First Party</div>
//         </div>
//         <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"0 8px" }}>
//           <MouDivider/>
//           <div style={S.mouAgreementLabel}>{form.title || "MOU Agreement"}</div>
//           <div style={S.mouAgreementSub}>{form.collaborationType || "Collaboration Type"}</div>
//         </div>
//         <div style={S.mouLogoBox}>
//           <div style={S.mouLogoIconWrap}>
//             <LogoDisplay src={form.industryLogo} fallback={<IndustrySvg size={26}/>} size={44}/>
//           </div>
//           <div style={S.mouLogoName}>{form.industry || "Industry Partner"}</div>
//           <div style={S.mouLogoSub}>Second Party</div>
//         </div>
//       </div>

//       <div style={S.createBody}>
//         <Section title="🖼️ Party Logos">
//           <p style={{ fontSize:12, color:"#94a3b8", marginBottom:12 }}>Upload logos for both parties — they will appear in the header above and in the PDF.</p>
//           <div style={S.grid2}>
//             <LogoUploadField label="University Logo" value={form.universityLogo} onChange={v => set("universityLogo",v)}/>
//             <LogoUploadField label="Industry / Company Logo" value={form.industryLogo} onChange={v => set("industryLogo",v)}/>
//           </div>
//         </Section>

//         <Section title="📋 Basic Information">
//           <div style={S.grid2}>
//             <FormField label="MOU Title *" value={form.title} onChange={v=>set("title",v)} placeholder="e.g., Industry-Academia Research Collaboration"/>
//             <FormField label="Collaboration Type *" value={form.collaborationType} onChange={v=>set("collaborationType",v)} type="select" options={["","Research","Internship","Training","Consultancy","Joint Venture","Other"]}/>
//             <FormField label="University *" value={form.university} onChange={v=>set("university",v)} placeholder="Full University Name"/>
//             <FormField label="Industry Partner *" value={form.industry} onChange={v=>set("industry",v)} placeholder="Company / Organization Name"/>
//             <FormField label="Start Date *" value={form.startDate} onChange={v=>set("startDate",v)} type="date"/>
//             <FormField label="End Date *" value={form.endDate} onChange={v=>set("endDate",v)} type="date"/>
//           </div>
//           <FormField label="Purpose / Description" value={form.description} onChange={v=>set("description",v)} type="textarea" placeholder="Describe the purpose and scope of this MOU..."/>
//         </Section>

//         <Section title="🎯 Objectives">
//           {form.objectives.map((obj,i) => (
//             <div key={i} style={S.listItem}>
//               <input style={S.listInput} value={obj} placeholder={`Objective ${i+1}`} onChange={e=>arrUpdate("objectives",i,e.target.value)}/>
//               {form.objectives.length > 1 && <button style={S.listRemove} onClick={() => arrRemove("objectives",i)}><X size={13}/></button>}
//             </div>
//           ))}
//           <button style={S.addRowBtn} onClick={() => arrAdd("objectives")}>+ Add Objective</button>
//         </Section>

//         <Section title="📌 Responsibilities">
//           <div style={S.grid2}>
//             <div>
//               <label style={S.subLabel}>University Responsibilities</label>
//               {form.responsibilities.university.map((r,i) => (
//                 <div key={i} style={S.listItem}>
//                   <input style={S.listInput} value={r} placeholder={`Responsibility ${i+1}`} onChange={e=>n2Update("responsibilities","university",i,e.target.value)}/>
//                   {form.responsibilities.university.length > 1 && <button style={S.listRemove} onClick={() => n2Remove("responsibilities","university",i)}><X size={13}/></button>}
//                 </div>
//               ))}
//               <button style={S.addRowBtn} onClick={() => n2Add("responsibilities","university")}>+ Add</button>
//             </div>
//             <div>
//               <label style={S.subLabel}>Industry Responsibilities</label>
//               {form.responsibilities.industry.map((r,i) => (
//                 <div key={i} style={S.listItem}>
//                   <input style={S.listInput} value={r} placeholder={`Responsibility ${i+1}`} onChange={e=>n2Update("responsibilities","industry",i,e.target.value)}/>
//                   {form.responsibilities.industry.length > 1 && <button style={S.listRemove} onClick={() => n2Remove("responsibilities","industry",i)}><X size={13}/></button>}
//                 </div>
//               ))}
//               <button style={S.addRowBtn} onClick={() => n2Add("responsibilities","industry")}>+ Add</button>
//             </div>
//           </div>
//         </Section>

//         <Section title="⚖️ Terms & Conditions">
//           {form.terms.map((t,i) => (
//             <div key={i} style={S.listItem}>
//               <input style={S.listInput} value={t} placeholder={`Term / Clause ${i+1}`} onChange={e=>arrUpdate("terms",i,e.target.value)}/>
//               {form.terms.length > 1 && <button style={S.listRemove} onClick={() => arrRemove("terms",i)}><X size={13}/></button>}
//             </div>
//           ))}
//           <button style={S.addRowBtn} onClick={() => arrAdd("terms")}>+ Add Term</button>
//         </Section>

//         <Section title="👤 Contact Information">
//           <div style={S.grid2}>
//             <div>
//               <label style={S.subLabel}>University Contact</label>
//               <FormField label="Name" value={form.universityContact.name} onChange={v=>set("universityContact",{...form.universityContact,name:v})}/>
//               <FormField label="Designation" value={form.universityContact.designation} onChange={v=>set("universityContact",{...form.universityContact,designation:v})}/>
//               <FormField label="Email" value={form.universityContact.email} type="email" onChange={v=>set("universityContact",{...form.universityContact,email:v})}/>
//             </div>
//             <div>
//               <label style={S.subLabel}>Industry Contact</label>
//               <FormField label="Name" value={form.industryContact.name} onChange={v=>set("industryContact",{...form.industryContact,name:v})}/>
//               <FormField label="Designation" value={form.industryContact.designation} onChange={v=>set("industryContact",{...form.industryContact,designation:v})}/>
//               <FormField label="Email" value={form.industryContact.email} type="email" onChange={v=>set("industryContact",{...form.industryContact,email:v})}/>
//             </div>
//           </div>
//         </Section>

//         <Section title="✍️ Authorized Signatories">
//           <div style={S.grid2}>
//             <FormField label="University Signatory" value={form.signatories.university} onChange={v=>set("signatories",{...form.signatories,university:v})} placeholder="Name & Designation"/>
//             <FormField label="Industry Signatory" value={form.signatories.industry} onChange={v=>set("signatories",{...form.signatories,industry:v})} placeholder="Name & Designation"/>
//           </div>
//         </Section>

//         <div style={{ textAlign:"right", marginTop:16 }}>
//           <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
//             style={{ ...S.btnPrimary, padding:"12px 32px", fontSize:15 }} onClick={handleSave} disabled={saving}>
//             {saving ? "Saving..." : "💾 Save MOU as Draft"}
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  DETAIL VIEW
// // ═══════════════════════════════════════════════════════════════════════════════
// const DetailView = ({ mou, onBack, onSend, onDelete, onScheduleMeeting, onApproveReject, onUpdate, onSendAfterApprove, onSimulateChange, onIndustryApprove, onDownloadPdf }) => {
//   const [editing, setEditing] = useState(false);
//   const [editData, setEditData] = useState(mou);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => { setEditData(mou); }, [mou]);

//   const hasChanges    = mou.proposedChanges && mou.proposedChanges.length > 0;
//   const canSend       = ["Draft","Rejected"].includes(mou.status);
//   const canApprove    = ["Sent to Industry","Changes Proposed","Approved by Industry"].includes(mou.status);
//   const canIndApprove = ["Sent to Industry","Changes Proposed","Approved by University"].includes(mou.status) && !mou.industryStamp;
//   const canSendAfter  = ["Approved by University","Mutually Approved"].includes(mou.status);
//   const canDownload   = ["Approved by Industry","Approved by University","Mutually Approved"].includes(mou.status);
//   const isMutual      = mou.status === "Mutually Approved";
//   const meeting       = mou.scheduledMeeting;

//   const saveEdit = async () => {
//     try { setSaving(true); const res = await axios.put(`${API_URL}/${mou._id}`, editData); onUpdate(res.data); setEditing(false); }
//     catch { alert("Error saving"); } finally { setSaving(false); }
//   };

//   return (
//     <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}>
//       <div style={S.detailHeader}>
//         <button style={S.backBtn} onClick={onBack}><ArrowLeft size={16}/> Back</button>
//         <div style={{ flex:1 }}>
//           <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
//             <h2 style={{ margin:0, color:"#1e3a5f", fontSize:20 }}>{mou.title || "Untitled MOU"}</h2>
//             <Badge status={mou.status}/>
//           </div>
//           <p style={{ margin:0, fontSize:12, color:"#64748b" }}>{mou.university} ↔ {mou.industry} | Created: {fmtDate(mou.createdAt)}</p>
//         </div>
//         <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
//           {editing ? (
//             <>
//               <button style={S.btnOutline} onClick={() => setEditing(false)}>Cancel</button>
//               <button style={S.btnPrimary} onClick={saveEdit} disabled={saving}>{saving?"Saving...":"💾 Save Changes"}</button>
//             </>
//           ) : (
//             <>
//               {canSend       && <button style={S.btnSend} onClick={onSend}><Send size={14}/> Send to Industry</button>}
//               {canApprove    && <><button style={S.btnApprove} onClick={()=>onApproveReject("approve")}><CheckCircle size={14}/> Univ. Approve</button><button style={S.btnReject} onClick={()=>onApproveReject("reject")}><XCircle size={14}/> Reject</button></>}
//               {canIndApprove && <motion.button whileHover={{ scale:1.04 }} style={S.btnIndustryApprove} onClick={onIndustryApprove}><CheckSquare size={14}/> Industry Approve</motion.button>}
//               {canSendAfter  && <button style={S.btnNotify} onClick={onSendAfterApprove}><Bell size={14}/> Notify Industry</button>}
//               {canDownload   && <motion.button whileHover={{ scale:1.04 }} style={S.btnDownload} onClick={onDownloadPdf}><Download size={14}/> Download PDF</motion.button>}
//               <button style={S.btnMeeting} onClick={onScheduleMeeting}><Calendar size={14}/> {meeting?"Edit Meeting":"Schedule Meeting"}</button>
//               <button style={S.btnOutline} onClick={() => setEditing(true)}><Edit3 size={14}/> Edit MOU</button>
//               {mou.status === "Sent to Industry" && <button style={{ ...S.btnOutline, color:"#7c3aed", borderColor:"#7c3aed" }} onClick={onSimulateChange}>🔧 Simulate Change</button>}
//               <button style={S.btnDanger} onClick={onDelete}><Trash2 size={14}/></button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* HEADER BANNER */}
//       <div style={{ ...S.mouHeaderPreview, marginBottom:16 }}>
//         <div style={S.mouLogoBox}>
//           <div style={S.mouLogoIconWrap}><LogoDisplay src={mou.universityLogo} fallback={<UniSvg size={26}/>} size={44}/></div>
//           <div style={S.mouLogoName}>{mou.university}</div>
//           <div style={S.mouLogoSub}>First Party</div>
//         </div>
//         <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"0 8px" }}>
//           <MouDivider/>
//           <div style={S.mouAgreementLabel}>{mou.title || "MOU Agreement"}</div>
//           <div style={S.mouAgreementSub}>{mou.collaborationType}</div>
//           {isMutual && <div style={{ marginTop:6, background:"#dcfce7", color:"#16a34a", borderRadius:20, padding:"2px 12px", fontSize:11, fontWeight:700, border:"1px solid #86efac" }}>✅ MUTUALLY APPROVED</div>}
//         </div>
//         <div style={S.mouLogoBox}>
//           <div style={S.mouLogoIconWrap}><LogoDisplay src={mou.industryLogo} fallback={<IndustrySvg size={26}/>} size={44}/></div>
//           <div style={S.mouLogoName}>{mou.industry}</div>
//           <div style={S.mouLogoSub}>Second Party</div>
//         </div>
//       </div>

//       <div style={S.detailBody}>
//         <div style={S.detailLeft}>
//           {hasChanges && (
//             <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={S.changesAlert}>
//               <AlertTriangle size={16} color="#7c3aed"/>
//               <span style={{ color:"#7c3aed", fontWeight:600 }}>Industry has proposed {mou.proposedChanges.length} change(s) — review in the sidebar</span>
//             </motion.div>
//           )}
//           {meeting && (
//             <div style={S.meetingCard}>
//               <div style={{ fontWeight:700, color:"#0284c7", marginBottom:6, display:"flex", gap:6, alignItems:"center" }}><Calendar size={14}/> Scheduled Meeting</div>
//               <MeetingRow icon={<Clock size={12}/>} label="Date & Time" val={`${fmtDate(meeting.date)} at ${meeting.time}`}/>
//               <MeetingRow icon={<MapPin size={12}/>} label="Venue" val={meeting.venue}/>
//               <MeetingRow icon={<Coffee size={12}/>} label="Agenda" val={meeting.agenda}/>
//               {meeting.menu      && <MeetingRow icon={<Coffee size={12}/>} label="Menu"      val={meeting.menu}/>}
//               {meeting.attendees && <MeetingRow icon={<User size={12}/>}   label="Attendees" val={meeting.attendees}/>}
//             </div>
//           )}
//           {(mou.universityStamp || mou.industryStamp) && (
//             <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
//               {mou.universityStamp && <StampBadge stamp={mou.universityStamp} label="University"/>}
//               {mou.industryStamp   && <StampBadge stamp={mou.industryStamp}   label="Industry"/>}
//             </div>
//           )}
//           {canDownload && (
//             <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} style={S.downloadBanner}>
//               <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                 <CheckSquare size={22} color="#16a34a"/>
//                 <div>
//                   <div style={{ fontWeight:800, color:"#166534", fontSize:14 }}>{isMutual ? "🎉 Both parties have approved this MOU!" : "✅ MOU approved — PDF ready"}</div>
//                   <div style={{ fontSize:12, color:"#4ade80" }}>{isMutual ? "The MOU is fully finalized. Download the official PDF." : "Download the approved MOU PDF."}</div>
//                 </div>
//               </div>
//               <motion.button whileHover={{ scale:1.04 }} style={S.btnDownload} onClick={onDownloadPdf}><Download size={15}/> Download PDF</motion.button>
//             </motion.div>
//           )}
//           {editing ? <EditableMou data={editData} onChange={(k,v)=>setEditData(f=>({...f,[k]:v}))}/> : <ViewMou mou={mou}/>}
//         </div>

//         <div style={S.sidebar}>
//           <div style={S.sidebarTitle}><History size={15}/> Change Log</div>
//           {!hasChanges ? <div style={S.sidebarEmpty}>No changes proposed by industry yet.</div>
//             : mou.proposedChanges.map((c,i) => (
//               <motion.div key={i} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.1 }} style={S.changeItem}>
//                 <div style={{ fontWeight:700, color:"#7c3aed", fontSize:12, marginBottom:4 }}>📝 {c.field || `Change #${i+1}`}</div>
//                 <div style={{ fontSize:12, marginBottom:4 }}>
//                   <span style={{ color:"#dc2626", textDecoration:"line-through" }}>{c.oldValue||"—"}</span>
//                   <span style={{ color:"#64748b", margin:"0 6px" }}>→</span>
//                   <span style={{ color:"#16a34a" }}>{c.newValue||"—"}</span>
//                 </div>
//                 {c.reason && <div style={{ fontSize:11, color:"#94a3b8" }}>Reason: {c.reason}</div>}
//                 <div style={{ fontSize:10, color:"#cbd5e1", marginTop:4 }}>{fmtDate(c.date)}</div>
//               </motion.div>
//             ))}
//           <div style={{ ...S.sidebarTitle, marginTop:16 }}><Clock size={15}/> Timeline</div>
//           <div style={S.timeline}>
//             {[
//               { label:"Draft Created",       date:mou.createdAt,             done:true },
//               { label:"Sent to Industry",    date:mou.sentAt,                done:!!mou.sentAt },
//               { label:"Industry Response",   date:mou.industryResponseAt,    done:!!mou.industryResponseAt },
//               { label:"University Decision", date:mou.universityStamp?.date, done:!!mou.universityStamp },
//               { label:"Mutually Approved",   date:null,                      done:mou.status==="Mutually Approved" },
//             ].map((t,i) => (
//               <div key={i} style={S.timelineItem}>
//                 <div style={{ ...S.timelineDot, background:t.done?"#16a34a":"#e2e8f0" }}>
//                   {t.done && <CheckCircle size={10} color="#fff"/>}
//                 </div>
//                 <div>
//                   <div style={{ fontSize:12, fontWeight:600, color:t.done?"#1e3a5f":"#94a3b8" }}>{t.label}</div>
//                   {t.date && <div style={{ fontSize:10, color:"#94a3b8" }}>{fmtDate(t.date)}</div>}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // ─── VIEW MOU ─────────────────────────────────────────────────────────────────
// const ViewMou = ({ mou }) => (
//   <div style={S.mouDoc}>
//     <div style={S.mouDocTitle}>MEMORANDUM OF UNDERSTANDING</div>
//     <div style={{ textAlign:"center", fontSize:13, color:"#64748b", marginBottom:16 }}>{mou.university} & {mou.industry}</div>
//     <hr style={{ borderColor:"#e2e8f0", margin:"12px 0" }}/>
//     <MouSection title="1. Parties"><p><strong>University:</strong> {mou.university}</p><p><strong>Industry:</strong> {mou.industry}</p></MouSection>
//     <MouSection title="2. Purpose"><p>{mou.description || "—"}</p></MouSection>
//     <MouSection title="3. Collaboration Type"><p>{mou.collaborationType}</p></MouSection>
//     <MouSection title="4. Duration"><p>From <strong>{fmtDate(mou.startDate)}</strong> to <strong>{fmtDate(mou.endDate)}</strong></p></MouSection>
//     {mou.objectives?.filter(Boolean).length > 0 && <MouSection title="5. Objectives"><ul>{mou.objectives.filter(Boolean).map((o,i)=><li key={i}>{o}</li>)}</ul></MouSection>}
//     {(mou.responsibilities?.university?.filter(Boolean).length>0||mou.responsibilities?.industry?.filter(Boolean).length>0) && (
//       <MouSection title="6. Responsibilities">
//         {mou.responsibilities?.university?.filter(Boolean).length>0&&<><strong>University:</strong><ul>{mou.responsibilities.university.filter(Boolean).map((r,i)=><li key={i}>{r}</li>)}</ul></>}
//         {mou.responsibilities?.industry?.filter(Boolean).length>0&&<><strong>Industry:</strong><ul>{mou.responsibilities.industry.filter(Boolean).map((r,i)=><li key={i}>{r}</li>)}</ul></>}
//       </MouSection>
//     )}
//     {mou.terms?.filter(Boolean).length>0&&<MouSection title="7. Terms & Conditions"><ol>{mou.terms.filter(Boolean).map((t,i)=><li key={i}>{t}</li>)}</ol></MouSection>}
//     <MouSection title="8. Signatories">
//       <div style={{ display:"flex", gap:40, marginTop:8 }}>
//         {[["university","university"],["industry","industry"]].map(([side,key])=>(
//           <div key={side}><div style={{ borderTop:"1px solid #1e3a5f", paddingTop:6, marginTop:30, width:160 }}>
//             <strong>{mou.signatories?.[key]||`${side.charAt(0).toUpperCase()+side.slice(1)} Authority`}</strong><br/>
//             <span style={{ fontSize:12, color:"#64748b" }}>For {mou[side]}</span>
//           </div></div>
//         ))}
//       </div>
//     </MouSection>
//   </div>
// );

// // ─── EDITABLE MOU ─────────────────────────────────────────────────────────────
// const EditableMou = ({ data, onChange }) => {
//   const upd = (k,i,v) => { const a=[...(data[k]||[])]; a[i]=v; onChange(k,a); };
//   return (
//     <div style={S.mouDoc}>
//       <div style={S.mouDocTitle}>MEMORANDUM OF UNDERSTANDING - EDIT MODE</div>
//       <hr style={{ borderColor:"#e2e8f0", margin:"12px 0" }}/>
//       <MouSection title="Basic Details">
//         <div style={S.grid2}>
//           <FormField label="Title" value={data.title} onChange={v=>onChange("title",v)}/>
//           <FormField label="Collaboration Type" value={data.collaborationType} type="select" options={["","Research","Internship","Training","Consultancy","Joint Venture","Other"]} onChange={v=>onChange("collaborationType",v)}/>
//           <FormField label="Start Date" value={data.startDate} type="date" onChange={v=>onChange("startDate",v)}/>
//           <FormField label="End Date" value={data.endDate} type="date" onChange={v=>onChange("endDate",v)}/>
//         </div>
//         <FormField label="Purpose" value={data.description} type="textarea" onChange={v=>onChange("description",v)}/>
//       </MouSection>
//       <MouSection title="Objectives">
//         {(data.objectives||[""]).map((o,i)=><input key={i} style={{...S.listInput,marginBottom:6}} value={o} onChange={e=>upd("objectives",i,e.target.value)} placeholder={`Objective ${i+1}`}/>)}
//       </MouSection>
//       <MouSection title="Terms & Conditions">
//         {(data.terms||[""]).map((t,i)=><input key={i} style={{...S.listInput,marginBottom:6}} value={t} onChange={e=>upd("terms",i,e.target.value)} placeholder={`Term ${i+1}`}/>)}
//       </MouSection>
//     </div>
//   );
// };

// // ─── MEETING MODAL ────────────────────────────────────────────────────────────
// const MeetingModal = ({ existing, onClose, onSave }) => {
//   const [form, setForm] = useState(existing || { date:"",time:"",venue:"",agenda:"",menu:"",attendees:"" });
//   const set = (k,v) => setForm(f=>({...f,[k]:v}));
//   return (
//     <div style={S.overlay}>
//       <motion.div initial={{y:40,opacity:0,scale:0.95}} animate={{y:0,opacity:1,scale:1}} exit={{y:40,opacity:0,scale:0.95}} style={{...S.modal,maxWidth:500}}>
//         <div style={S.modalHeader}>
//           <div style={{fontWeight:700,fontSize:16,color:"#1e3a5f",display:"flex",alignItems:"center",gap:8}}><Calendar size={18}/> Schedule Meeting</div>
//           <X size={20} style={{cursor:"pointer"}} onClick={onClose}/>
//         </div>
//         <div style={S.modalBody}>
//           <FormField label="Meeting Date *" value={form.date} type="date" onChange={v=>set("date",v)}/>
//           <FormField label="Time *" value={form.time} type="time" onChange={v=>set("time",v)}/>
//           <FormField label="Venue / Location *" value={form.venue} onChange={v=>set("venue",v)} placeholder="e.g., Conference Room A, City Hotel"/>
//           <FormField label="Agenda *" value={form.agenda} type="textarea" onChange={v=>set("agenda",v)} placeholder="Meeting objectives and points to discuss..."/>
//           <FormField label="Menu / Refreshments" value={form.menu} onChange={v=>set("menu",v)} placeholder="e.g., Lunch, Tea & Coffee"/>
//           <FormField label="Expected Attendees" value={form.attendees} onChange={v=>set("attendees",v)} placeholder="e.g., Dean, Industry Director"/>
//         </div>
//         <div style={{padding:"12px 20px",display:"flex",gap:8,justifyContent:"flex-end",borderTop:"1px solid #f1f5f9"}}>
//           <button style={S.btnOutline} onClick={onClose}>Cancel</button>
//           <button style={S.btnPrimary} onClick={()=>{if(!form.date||!form.time||!form.venue||!form.agenda)return alert("Please fill required fields.");onSave(form);}}>
//             <Calendar size={14}/> Save Meeting
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // ─── STAMP MODAL ──────────────────────────────────────────────────────────────
// const StampModal = ({ type, mou, onClose, onConfirm }) => (
//   <div style={S.overlay}>
//     <motion.div initial={{y:30,opacity:0,scale:0.95}} animate={{y:0,opacity:1,scale:1}} exit={{y:30,opacity:0,scale:0.95}} style={{...S.modal,maxWidth:400,textAlign:"center"}}>
//       <div style={{padding:32}}>
//         <div style={{width:80,height:80,borderRadius:"50%",margin:"0 auto 16px",background:type==="approve"?"#dcfce7":"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",border:`3px solid ${type==="approve"?"#16a34a":"#dc2626"}`}}>
//           {type==="approve"?<CheckCircle size={36} color="#16a34a"/>:<XCircle size={36} color="#dc2626"/>}
//         </div>
//         <div style={{fontSize:18,fontWeight:800,color:"#1e3a5f",marginBottom:8}}>{type==="approve"?"Approve this MOU?":"Reject this MOU?"}</div>
//         <div style={{fontSize:13,color:"#64748b",marginBottom:20}}>
//           {type==="approve"?`Stamp "APPROVED" on behalf of ${mou?.university}. Industry will be notified.`:`Mark the MOU as Rejected. Industry will be notified.`}
//         </div>
//         {type==="approve"&&mou?.status==="Approved by Industry"&&(
//           <div style={{background:"#dcfce7",border:"1px solid #16a34a",borderRadius:8,padding:"10px 16px",marginBottom:16,fontSize:13,color:"#166534"}}>
//             🎉 Industry already approved! This will mark the MOU as <strong>Mutually Approved</strong>.
//           </div>
//         )}
//         <div style={{display:"flex",gap:10,justifyContent:"center"}}>
//           <button style={S.btnOutline} onClick={onClose}>Cancel</button>
//           <button style={type==="approve"?S.btnApprove:S.btnReject} onClick={onConfirm}>
//             <Stamp size={14}/>{type==="approve"?" Confirm Approve":" Confirm Reject"}
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   </div>
// );

// // ─── SMALL HELPERS ────────────────────────────────────────────────────────────
// const Section = ({ title, children }) => (
//   <div style={S.section}><div style={S.sectionTitle}>{title}</div>{children}</div>
// );
// const MouSection = ({ title, children }) => (
//   <div style={{marginBottom:16}}>
//     <div style={{fontWeight:700,color:"#1e3a5f",fontSize:13,marginBottom:6,borderBottom:"1px solid #f1f5f9",paddingBottom:4}}>{title}</div>
//     <div style={{fontSize:13,color:"#374151",lineHeight:1.7}}>{children}</div>
//   </div>
// );
// const FormField = ({ label, value, onChange, type="text", placeholder="", options=[] }) => (
//   <div style={{marginBottom:10}}>
//     {label&&<label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:4,fontWeight:600}}>{label}</label>}
//     {type==="textarea"
//       ?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...S.input,height:80,resize:"vertical"}}/>
//       :type==="select"
//         ?<select value={value} onChange={e=>onChange(e.target.value)} style={S.input}>{options.map(o=><option key={o} value={o}>{o||"Select..."}</option>)}</select>
//         :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={S.input}/>
//     }
//   </div>
// );
// const StampBadge = ({ stamp, label }) => (
//   <div style={{border:`2px solid ${stamp.type==="approve"?"#16a34a":"#dc2626"}`,borderRadius:8,padding:"8px 14px",background:stamp.type==="approve"?"#f0fdf4":"#fef2f2"}}>
//     <div style={{fontWeight:800,fontSize:12,color:stamp.type==="approve"?"#16a34a":"#dc2626"}}>{stamp.type==="approve"?"✅ APPROVED":"❌ REJECTED"} — {label}</div>
//     <div style={{fontSize:11,color:"#64748b"}}>By: {stamp.by} on {fmtDate(stamp.date)}</div>
//   </div>
// );
// const MeetingRow = ({ icon, label, val }) => (
//   <div style={{display:"flex",gap:6,marginBottom:4,fontSize:12}}>
//     <span style={{color:"#0284c7"}}>{icon}</span>
//     <span style={{color:"#64748b",minWidth:120}}>{label}:</span>
//     <span style={{color:"#1e3a5f",fontWeight:600}}>{val||"—"}</span>
//   </div>
// );

// // ═══════════════════════════════════════════════════════════════════════════════
// //  STYLES
// // ═══════════════════════════════════════════════════════════════════════════════
// const S = {
//   page:     { fontFamily:"'Segoe UI',sans-serif", minHeight:"100vh", background:"#f8fafc" },
//   topbar:   { background:"linear-gradient(135deg,#193648,#193648)", padding:"12px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.2)", position:"relative", zIndex:100 },
//   brand:    { display:"flex", alignItems:"center", gap:10 },
//   brandText:{ color:"#fff", fontWeight:800, fontSize:18, letterSpacing:0.5 },
//   brandSub: { color:"#93c5fd", fontSize:12, borderLeft:"1px solid #3b6ea0", paddingLeft:10, marginLeft:4 },
//   topActions:{ display:"flex", alignItems:"center", gap:12 },
//   alertChip:{ background:"#fef3c7", color:"#b45309", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:4 },
//   avatar:   { width:34, height:34, borderRadius:"50%", background:"#193648", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13 },
//   notifBtn: { background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:8, padding:"6px 8px", cursor:"pointer", display:"flex", alignItems:"center", position:"relative" },
//   notifDot: { position:"absolute", top:-6, right:-6, background:"#ef4444", color:"#fff", borderRadius:"50%", width:18, height:18, fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" },
//   notifPanel:{ position:"absolute", right:0, top:44, width:340, background:"#fff", borderRadius:12, boxShadow:"0 10px 40px rgba(0,0,0,0.15)", border:"1px solid #e2e8f0", maxHeight:380, overflowY:"auto", zIndex:200 },
//   notifPanelHeader:{ padding:"12px 16px", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" },
//   clearBtn: { background:"transparent", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:12, fontWeight:600 },
//   notifItem:{ padding:"10px 16px", borderBottom:"1px solid #f8fafc" },
//   body:     { padding:24, maxWidth:1400, margin:"0 auto" },
//   statsRow: { display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" },
//   statCard: { flex:1, minWidth:130, background:"#fff", borderRadius:10, padding:"14px 18px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", borderLeft:"3px solid #e2e8f0" },
//   toolbar:  { display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" },
//   searchBox:{ flex:1, minWidth:220, display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"8px 12px" },
//   searchInput:{ flex:1, border:"none", outline:"none", fontSize:13, background:"transparent" },
//   filterBox:{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 12px" },
//   filterSel:{ border:"none", outline:"none", fontSize:13, background:"transparent" },
//   createBtn:{ display:"flex", alignItems:"center", gap:6, background:"#1e3a5f", color:"#fff", border:"none", padding:"10px 18px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13 },
//   cardGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 },
//   card:     { background:"#fff", borderRadius:12, padding:16, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", transition:"all 0.2s" },
//   cardUrgent:{ borderLeft:"4px solid #7c3aed", background:"#fafaff" },
//   urgentStrip:{ background:"#f5f3ff", color:"#7c3aed", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6, marginBottom:8, display:"inline-block" },
//   cardTop:  { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 },
//   cardTitle:{ fontWeight:700, color:"#1e3a5f", fontSize:14, marginBottom:3 },
//   cardMeta: { display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#64748b" },
//   changesBadge:{ display:"flex", alignItems:"center", gap:5, background:"#f5f3ff", color:"#7c3aed", fontSize:11, padding:"3px 10px", borderRadius:6, marginBottom:6, fontWeight:600 },
//   cardFooter:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 },
//   empty:    { textAlign:"center", padding:60, color:"#94a3b8", fontSize:15 },

//   btnOutline:       { display:"flex", alignItems:"center", gap:5, background:"#fff", border:"1px solid #e2e8f0", color:"#374151", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
//   btnPrimary:       { display:"flex", alignItems:"center", gap:5, background:"#1e3a5f", color:"#fff", border:"none", padding:"8px 16px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
//   btnSend:          { display:"flex", alignItems:"center", gap:5, background:"#0284c7", color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
//   btnApprove:       { display:"flex", alignItems:"center", gap:5, background:"#16a34a", color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
//   btnReject:        { display:"flex", alignItems:"center", gap:5, background:"#dc2626", color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
//   btnMeeting:       { display:"flex", alignItems:"center", gap:5, background:"#7c3aed", color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
//   btnDanger:        { display:"flex", alignItems:"center", gap:5, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", padding:"8px 10px", borderRadius:7, cursor:"pointer" },
//   btnNotify:        { display:"flex", alignItems:"center", gap:5, background:"#0ea5e9", color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
//   btnIndustryApprove:{ display:"flex", alignItems:"center", gap:5, background:"#059669", color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:700, boxShadow:"0 2px 8px rgba(5,150,105,0.3)" },
//   btnDownload:      { display:"flex", alignItems:"center", gap:5, background:"#16a34a", color:"#fff", border:"none", padding:"8px 16px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:700 },
//   uploadBtn:        { display:"inline-flex", alignItems:"center", gap:5, background:"#f1f5f9", border:"1px solid #e2e8f0", color:"#374151", padding:"6px 12px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600 },

//   mouHeaderPreview: { background:"linear-gradient(135deg,#f0f7ff,#e8f4fd)", border:"1px solid #bfdbfe", borderRadius:14, padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, boxShadow:"0 2px 12px rgba(30,58,95,0.07)" },
//   mouLogoBox:       { textAlign:"center", minWidth:140, background:"#fff", borderRadius:12, padding:"14px 20px", border:"1px solid #dbeafe", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
//   mouLogoIconWrap:  { width:54, height:54, borderRadius:8, background:"#eef4fb", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px", border:"1px solid #c5d5e8", overflow:"hidden" },
//   mouLogoName:      { fontWeight:800, color:"#1e3a5f", fontSize:13 },
//   mouLogoSub:       { fontSize:11, color:"#94a3b8", marginTop:3 },
//   mouAgreementLabel:{ fontWeight:800, color:"#1e3a5f", fontSize:15, marginTop:8, textAlign:"center" },
//   mouAgreementSub:  { fontSize:12, color:"#64748b", marginTop:2, textAlign:"center" },

//   detailHeader:    { display:"flex", alignItems:"center", gap:16, marginBottom:20, flexWrap:"wrap", background:"#fff", padding:16, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
//   backBtn:         { display:"flex", alignItems:"center", gap:5, background:"transparent", border:"1px solid #e2e8f0", color:"#64748b", padding:"7px 12px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600, whiteSpace:"nowrap" },
//   detailBody:      { display:"flex", gap:16 },
//   detailLeft:      { flex:1, minWidth:0 },
//   sidebar:         { width:280, flexShrink:0, background:"#fff", borderRadius:12, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", maxHeight:"calc(100vh - 180px)", overflowY:"auto", position:"sticky", top:16 },
//   sidebarTitle:    { fontWeight:700, color:"#1e3a5f", fontSize:13, marginBottom:10, display:"flex", alignItems:"center", gap:6, paddingBottom:8, borderBottom:"1px solid #f1f5f9" },
//   sidebarEmpty:    { fontSize:12, color:"#94a3b8", textAlign:"center", padding:20 },
//   changeItem:      { background:"#f5f3ff", border:"1px solid #e9d5ff", borderRadius:8, padding:"10px 12px", marginBottom:8 },
//   timeline:        { paddingLeft:4 },
//   timelineItem:    { display:"flex", gap:10, alignItems:"flex-start", marginBottom:12 },
//   timelineDot:     { width:20, height:20, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" },
//   downloadBanner:  { background:"linear-gradient(135deg,#dcfce7,#d1fae5)", border:"1px solid #86efac", borderRadius:12, padding:"14px 20px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" },

//   createBody:  { background:"#fff", borderRadius:12, padding:24, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
//   section:     { marginBottom:28, paddingBottom:20, borderBottom:"1px solid #f1f5f9" },
//   sectionTitle:{ fontWeight:800, color:"#1e3a5f", fontSize:15, marginBottom:14, display:"flex", alignItems:"center", gap:8 },
//   grid2:       { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:8 },
//   subLabel:    { fontWeight:700, fontSize:13, color:"#374151", display:"block", marginBottom:8 },
//   listItem:    { display:"flex", gap:8, marginBottom:6, alignItems:"center" },
//   listInput:   { flex:1, padding:"8px 12px", border:"1px solid #e2e8f0", borderRadius:7, fontSize:13, outline:"none", fontFamily:"inherit" },
//   listRemove:  { background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:6, padding:"5px 8px", cursor:"pointer" },
//   addRowBtn:   { background:"transparent", border:"1px dashed #cbd5e1", color:"#64748b", padding:"6px 14px", borderRadius:7, cursor:"pointer", fontSize:12, marginTop:4 },
//   input:       { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:7, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box", background:"#fafafa" },
//   mouDoc:      { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:28, marginBottom:16 },
//   mouDocTitle: { textAlign:"center", fontWeight:800, fontSize:18, color:"#1e3a5f", letterSpacing:1, marginBottom:6 },
//   meetingCard: { background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"12px 16px", marginBottom:12 },
//   changesAlert:{ display:"flex", alignItems:"center", gap:10, background:"#f5f3ff", border:"1px solid #e9d5ff", borderRadius:10, padding:"10px 16px", marginBottom:12 },
//   overlay:     { position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 },
//   modal:       { background:"#fff", borderRadius:14, width:"90%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" },
//   modalHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid #f1f5f9" },
//   modalBody:   { padding:"16px 20px" },
// };













// export default MouManagement;




// import React, { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   PlusCircle, Search, Filter, X, Trash2, Eye, Send,
//   CheckCircle, XCircle, Calendar, Clock, AlertTriangle,
//   FileText, ChevronRight, Bell, User, Building2,
//   MapPin, Coffee, Edit3, History, Stamp, ArrowLeft,
//   Download, BellRing, CheckSquare, Upload, MessageSquare,
//   ThumbsUp, ThumbsDown, RefreshCw, Vote
// } from "lucide-react";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/mous";

// // ─── STATUS CONFIG ────────────────────────────────────────────────────────────
// const STATUS = {
//   Draft:                    { color: "#64748b", bg: "#f1f5f9", label: "Draft" },
//   "Sent to Industry":       { color: "#d97706", bg: "#fffbeb", label: "Sent to Industry" },
//   "Changes Proposed":       { color: "#7c3aed", bg: "#f5f3ff", label: "Changes Proposed" },
//   "Industry Responded":     { color: "#0891b2", bg: "#ecfeff", label: "Industry Responded" },
//   "Approved by Industry":   { color: "#059669", bg: "#ecfdf5", label: "Approved by Industry" },
//   "Approved by University": { color: "#0284c7", bg: "#e0f2fe", label: "Approved by Univ." },
//   "Mutually Approved":      { color: "#16a34a", bg: "#dcfce7", label: "Mutually Approved ✓" },
//   Rejected:                 { color: "#dc2626", bg: "#fef2f2", label: "Rejected" },
// };

// // ─── CHANGE LOG TYPES ─────────────────────────────────────────────────────────
// const CHANGE_TYPES = {
//   industry_change:    { color: "#7c3aed", bg: "#f5f3ff", icon: "🏭", label: "Industry Changed" },
//   industry_approve:   { color: "#059669", bg: "#ecfdf5", icon: "✅", label: "Industry Approved" },
//   industry_reject:    { color: "#dc2626", bg: "#fef2f2", icon: "❌", label: "Industry Rejected" },
//   industry_response:  { color: "#0891b2", bg: "#ecfeff", icon: "💬", label: "Industry Response" },
//   university_change:  { color: "#0284c7", bg: "#e0f2fe", icon: "🎓", label: "University Changed" },
//   university_approve: { color: "#16a34a", bg: "#dcfce7", icon: "✅", label: "University Approved" },
//   university_reject:  { color: "#dc2626", bg: "#fef2f2", icon: "❌", label: "University Rejected" },
//   meeting_proposed:   { color: "#7c3aed", bg: "#f5f3ff", icon: "📅", label: "Meeting Proposed" },
//   meeting_confirmed:  { color: "#16a34a", bg: "#dcfce7", icon: "🤝", label: "Meeting Confirmed" },
// };

// // ─── HELPERS ──────────────────────────────────────────────────────────────────
// const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) : "—";
// const fmtDateTime = (d) => d ? new Date(d).toLocaleString("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
// const calcProgress = (s, e) => {
//   const start = new Date(s), end = new Date(e), now = new Date();
//   if (!start || !end || end <= start) return 100;
//   return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
// };

// // ─── BADGE ────────────────────────────────────────────────────────────────────
// const Badge = ({ status }) => {
//   const cfg = STATUS[status] || STATUS.Draft;
//   return (
//     <span style={{ background: cfg.bg, color: cfg.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.3, border: `1px solid ${cfg.color}30` }}>
//       {cfg.label}
//     </span>
//   );
// };

// // ─── SVG ICON COMPONENTS ──────────────────────────────────────────────────────
// const UniSvg = ({ size = 28 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <path d="M12 3L1 9L12 15L23 9L12 3Z" stroke="#193648" strokeWidth="1.8" strokeLinejoin="round" />
//     <path d="M5 12V17C5 17 7.5 20 12 20C16.5 20 19 17 19 17V12" stroke="#193648" strokeWidth="1.8" strokeLinecap="round" />
//     <path d="M23 9V15" stroke="#193648" strokeWidth="1.8" strokeLinecap="round" />
//   </svg>
// );

// const IndustrySvg = ({ size = 28 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <rect x="2" y="7" width="20" height="15" rx="1" stroke="#193648" strokeWidth="1.8" />
//     <path d="M6 7V4H18V7" stroke="#193648" strokeWidth="1.8" strokeLinecap="round" />
//     <rect x="9" y="14" width="6" height="8" stroke="#193648" strokeWidth="1.5" />
//     <path d="M6 11H8M10 11H12M14 11H16M6 14H8" stroke="#193648" strokeWidth="1.3" strokeLinecap="round" />
//   </svg>
// );

// // ─── PROFESSIONAL CENTER DIVIDER ──────────────────────────────────────────────
// const MouDivider = () => (
//   <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
//     <div style={{ width: 1, height: 16, background: "linear-gradient(to bottom,transparent,#193648)" }} />
//     <div style={{ width: 40, height: 40, border: "2px solid #193648", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", boxShadow: "0 2px 10px rgba(30,58,95,0.14)" }}>
//       <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//         <rect x="3" y="3" width="8" height="8" rx="1" stroke="#193648" strokeWidth="1.7" />
//         <rect x="13" y="3" width="8" height="8" rx="1" stroke="#193648" strokeWidth="1.7" />
//         <rect x="3" y="13" width="8" height="8" rx="1" stroke="#193648" strokeWidth="1.7" />
//         <rect x="13" y="13" width="8" height="8" rx="1" stroke="#193648" strokeWidth="1.7" />
//       </svg>
//     </div>
//     <div style={{ width: 1, height: 16, background: "linear-gradient(to top,transparent,#193648)" }} />
//     <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#7a8fa6", textTransform: "uppercase", fontWeight: 700, marginTop: 5 }}>MOU</div>
//   </div>
// );

// // ─── LOGO DISPLAY ─────────────────────────────────────────────────────────────
// const LogoDisplay = ({ src, fallback, size = 44 }) => (
//   src
//     ? <img src={src} alt="logo" style={{ width: size, height: size, objectFit: "contain", borderRadius: 4 }} />
//     : <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>{fallback}</div>
// );

// // ─── LOGO UPLOAD FIELD ────────────────────────────────────────────────────────
// const LogoUploadField = ({ label, value, onChange }) => {
//   const ref = useRef();
//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => onChange(ev.target.result);
//     reader.readAsDataURL(file);
//   };
//   return (
//     <div style={{ marginBottom: 10 }}>
//       <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>
//       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//         <div style={{ width: 56, height: 56, border: "1.5px dashed #c5d5e8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", overflow: "hidden", flexShrink: 0 }}>
//           {value ? <img src={value} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <Upload size={18} color="#94a3b8" />}
//         </div>
//         <div>
//           <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
//             <button type="button" style={S.uploadBtn} onClick={() => ref.current.click()}>
//               <Upload size={12} /> {value ? "Change" : "Upload Logo"}
//             </button>
//             {value && (
//               <button type="button" style={{ ...S.uploadBtn, background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }} onClick={() => onChange("")}>Remove</button>
//             )}
//           </div>
//           <div style={{ fontSize: 11, color: "#94a3b8" }}>PNG or JPG recommended</div>
//         </div>
//         <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
//       </div>
//     </div>
//   );
// };

// // ─── NOTIFICATION SYSTEM ──────────────────────────────────────────────────────
// const NotificationContext = React.createContext(null);
// const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);
//   const addNotification = (msg, type = "info") => {
//     const id = Date.now();
//     setNotifications(n => [...n, { id, msg, type }]);
//     setTimeout(() => setNotifications(n => n.filter(x => x.id !== id)), 5000);
//   };
//   return (
//     <NotificationContext.Provider value={{ notifications, addNotification }}>
//       {children}
//       <div style={{ position: "fixed", top: 70, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
//         <AnimatePresence>
//           {notifications.map(n => (
//             <motion.div key={n.id} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
//               style={{ background: n.type === "success" ? "#dcfce7" : n.type === "error" ? "#fef2f2" : "#eff6ff", border: `1px solid ${n.type === "success" ? "#86efac" : n.type === "error" ? "#fca5a5" : "#93c5fd"}`, color: n.type === "success" ? "#166534" : n.type === "error" ? "#991b1b" : "#1e40af", padding: "10px 16px", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, maxWidth: 320 }}>
//               {n.type === "success" ? <CheckCircle size={15} /> : <BellRing size={15} />}
//               {n.msg}
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </NotificationContext.Provider>
//   );
// };
// const useNotify = () => React.useContext(NotificationContext);

// // ═══════════════════════════════════════════════════════════════════════════════
// //  PDF GENERATOR — Fixed: images properly embedded as base64
// // ═══════════════════════════════════════════════════════════════════════════════
// const generateMouPdf = (mou) => {
//   let n = 1;
//   const sec = (t) => `${n++}. ${t.toUpperCase()}`;
//   const refNo = `MOU-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

//   // FIX: Images are already base64 from FileReader, use them directly
//   // base64 images: NO crossorigin attr (breaks data: URIs), assign to JS vars first
//   // Safely get base64 src — ensure data: prefix is present
//   const _rawUni = mou.universityLogo || "";
//   const _rawInd = mou.industryLogo || "";
//   // base64 from FileReader always starts with "data:image/..."
//   // If stored in DB it may be truncated — check and use placeholder if so
//   const _uniSrc = _rawUni.startsWith("data:") ? _rawUni : (_rawUni.length > 100 ? "data:image/png;base64," + _rawUni : "");
//   const _indSrc = _rawInd.startsWith("data:") ? _rawInd : (_rawInd.length > 100 ? "data:image/png;base64," + _rawInd : "");

//   const _uniSvg = `<svg width="44" height="44" viewBox="0 0 24 24" fill="none"><path d="M12 3L1 9L12 15L23 9L12 3Z" stroke="#193648" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 12V17C5 17 7.5 20 12 20C16.5 20 19 17 19 17V12" stroke="#193648" stroke-width="1.8" stroke-linecap="round"/><path d="M23 9V15" stroke="#193648" stroke-width="1.8" stroke-linecap="round"/></svg>`;
//   const _indSvg = `<svg width="44" height="44" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="15" rx="1" stroke="#193648" stroke-width="1.8"/><path d="M6 7V4H18V7" stroke="#193648" stroke-width="1.8" stroke-linecap="round"/><rect x="9" y="14" width="6" height="8" stroke="#193648" stroke-width="1.5"/><path d="M6 11H8M10 11H12M14 11H16" stroke="#193648" stroke-width="1.3" stroke-linecap="round"/></svg>`;

//   const uniLogoHtml = _uniSrc
//     ? `<img src="${_uniSrc}" style="width:64px;height:64px;object-fit:contain;display:block;border-radius:4px;" />`
//     : _uniSvg;

//   const indLogoHtml = _indSrc
//     ? `<img src="${_indSrc}" style="width:64px;height:64px;object-fit:contain;display:block;border-radius:4px;" />`
//     : _indSvg;

//   const html = `<!DOCTYPE html>
// <html>
// <head>
// <meta charset="utf-8"/>
// <title>${refNo} — ${mou.title || "MOU"}</title>
// <style>
//   @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant+Garamond:wght@500;600;700&display=swap');
//   @page { size:A4; margin:0; }
//   *{margin:0;padding:0;box-sizing:border-box;}
//   body{font-family:'EB Garamond',Georgia,serif;color:#1a2340;background:#fff;font-size:13.5px;line-height:1.8;}
//   .page{width:794px;min-height:1122px;margin:0 auto;position:relative;}
//   .frame-outer{position:absolute;inset:14px;border:2.5px solid #193648;pointer-events:none;}
//   .frame-inner{position:absolute;inset:21px;border:0.75px solid #a8bcd4;pointer-events:none;}
//   .corner{position:absolute;width:20px;height:20px;}
//   .corner.tl{top:9px;left:9px;border-top:2.5px solid #193648;border-left:2.5px solid #193648;}
//   .corner.tr{top:9px;right:9px;border-top:2.5px solid #193648;border-right:2.5px solid #193648;}
//   .corner.bl{bottom:9px;left:9px;border-bottom:2.5px solid #193648;border-left:2.5px solid #193648;}
//   .corner.br{bottom:9px;right:9px;border-bottom:2.5px solid #193648;border-right:2.5px solid #193648;}
//   .topbar{height:7px;background:#193648;margin:14px 14px 0;}
//   .content{padding:42px 58px 40px;position:relative;z-index:1;}
//   .logo-row{display:flex;justify-content:space-between;align-items:center;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #c0cedc;}
//   .entity{display:flex;align-items:center;gap:13px;}
//   .entity.right{flex-direction:row-reverse;}
//   .logo-box{width:72px;height:72px;border:1.5px solid #c0cedc;border-radius:6px;background:#f4f7fb;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;padding:2px;}
//   .logo-box img{max-width:68px;max-height:68px;width:auto;height:auto;object-fit:contain;display:block;}
//   .entity-text{line-height:1.35;}
//   .entity-text.right{text-align:right;}
//   .entity-tag{font-size:8.5px;letter-spacing:2.5px;color:#8a9db5;text-transform:uppercase;font-weight:700;}
//   .entity-name{font-family:'Cormorant Garamond',serif;font-size:14.5px;font-weight:700;color:#193648;max-width:195px;}
//   .center-divider{display:flex;flex-direction:column;align-items:center;gap:3px;padding:0 20px;}
//   .d-line{width:1px;height:18px;}
//   .d-line.t{background:linear-gradient(to bottom,transparent,rgba(30,58,95,0.5));}
//   .d-line.b{background:linear-gradient(to top,transparent,rgba(30,58,95,0.5));}
//   .d-circle{width:44px;height:44px;border:2px solid #193648;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(30,58,95,0.13);}
//   .d-label{font-size:7.5px;letter-spacing:3px;color:#8a9db5;text-transform:uppercase;font-weight:700;margin-top:5px;}
//   .title-block{text-align:center;padding:16px 0 14px;}
//   .doc-eyebrow{font-size:9px;letter-spacing:4px;color:#8a9db5;text-transform:uppercase;font-weight:700;margin-bottom:8px;}
//   .doc-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:#193648;letter-spacing:1.5px;line-height:1.1;}
//   .doc-sub{font-size:12px;color:#8a9db5;margin-top:8px;font-style:italic;}
//   .approved-row{text-align:center;margin:10px 0 18px;}
//   .approved-seal{display:inline-flex;align-items:center;gap:11px;border:1.8px solid #15803d;color:#15803d;padding:5px 24px;font-size:10.5px;font-weight:700;letter-spacing:3px;text-transform:uppercase;}
//   .seal-dot{width:6px;height:6px;background:#15803d;border-radius:50%;}
//   .hr-bold{border:none;border-top:1.8px solid #193648;margin:14px 0;}
//   .hr{border:none;border-top:0.75px solid #c0cedc;margin:12px 0;}
//   .section{margin-bottom:17px;}
//   .sec-title{font-family:'Cormorant Garamond',serif;font-size:12px;font-weight:700;color:#193648;letter-spacing:1.8px;text-transform:uppercase;border-left:3px solid #193648;padding:1px 0 1px 10px;margin-bottom:9px;}
//   p{margin-bottom:5px;color:#2d3748;font-size:13px;}
//   ul,ol{padding-left:22px;color:#2d3748;}
//   li{margin-bottom:3px;font-size:13px;}
//   .ptable{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px;}
//   .ptable .h td{background:#eef3f8;font-weight:700;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#193648;padding:7px 14px;border:1px solid #c0cedc;}
//   .ptable .b td{padding:11px 14px;border:1px solid #c0cedc;vertical-align:top;}
//   .p-name{font-size:13px;font-weight:600;color:#193648;margin-bottom:4px;}
//   .p-info{font-size:11.5px;color:#5a6a7e;line-height:1.6;}
//   .sig-row{display:flex;gap:40px;margin-top:34px;}
//   .sig-box{flex:1;}
//   .sig-lbl{font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#a0adb8;font-weight:700;margin-bottom:4px;}
//   .sig-line{border-bottom:1px solid #193648;height:44px;margin-bottom:6px;}
//   .sig-name{font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700;color:#193648;}
//   .sig-org{font-size:11px;color:#7a8fa6;margin-top:1px;}
//   .sig-date{font-size:10.5px;color:#a0adb8;margin-top:8px;}
//   .doc-footer{margin-top:26px;padding-top:10px;border-top:1px solid #c0cedc;display:flex;justify-content:space-between;font-size:10px;color:#a0adb8;font-style:italic;}
//   .watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-38deg);font-family:'Cormorant Garamond',serif;font-size:96px;font-weight:700;color:rgba(30,58,95,0.036);letter-spacing:6px;white-space:nowrap;pointer-events:none;z-index:0;}
//   @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
// </style>
// </head>
// <body>
// <div class="page">
//   <div class="watermark">CONFIDENTIAL</div>
//   <div class="topbar"></div>
//   <div class="frame-outer"></div>
//   <div class="frame-inner"></div>
//   <div class="corner tl"></div><div class="corner tr"></div>
//   <div class="corner bl"></div><div class="corner br"></div>
//   <div class="content">

//     <div class="logo-row">
//       <div class="entity">
//         <div class="logo-box">${uniLogoHtml}</div>
//         <div class="entity-text">
//           <div class="entity-tag">University</div>
//           <div class="entity-name">${mou.university}</div>
//         </div>
//       </div>
//       <div class="center-divider">
//         <div class="d-line t"></div>
//         <div class="d-circle">
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//             <rect x="3" y="3" width="8" height="8" rx="1" stroke="#193648" stroke-width="1.7"/>
//             <rect x="13" y="3" width="8" height="8" rx="1" stroke="#193648" stroke-width="1.7"/>
//             <rect x="3" y="13" width="8" height="8" rx="1" stroke="#193648" stroke-width="1.7"/>
//             <rect x="13" y="13" width="8" height="8" rx="1" stroke="#193648" stroke-width="1.7"/>
//           </svg>
//         </div>
//         <div class="d-line b"></div>
//         <div class="d-label">Agreement</div>
//       </div>
//       <div class="entity right">
//         <div class="logo-box">${indLogoHtml}</div>
//         <div class="entity-text right">
//           <div class="entity-tag">Industry Partner</div>
//           <div class="entity-name">${mou.industry}</div>
//         </div>
//       </div>
//     </div>

//     <div class="title-block">
//       <div class="doc-eyebrow">Official Document</div>
//       <div class="doc-title">Memorandum of Understanding</div>
//       <div class="doc-sub">Ref. No.: ${refNo} &nbsp;·&nbsp; Dated: ${fmtDate(new Date().toISOString())} &nbsp;·&nbsp; Type: ${mou.collaborationType}</div>
//     </div>

//     <div class="approved-row">
//       <div class="approved-seal"><span class="seal-dot"></span> Mutually Approved &amp; Executed <span class="seal-dot"></span></div>
//     </div>

//     <hr class="hr-bold"/>

//     <div class="section">
//       <div class="sec-title">${sec("Parties to This Agreement")}</div>
//       <table class="ptable">
//         <tr class="h"><td>First Party — University</td><td>Second Party — Industry Partner</td></tr>
//         <tr class="b">
//           <td>
//             <div class="p-name">${mou.university}</div>
//             <div class="p-info">
//               ${mou.universityContact?.name ? `Contact: ${mou.universityContact.name}<br/>` : ""}
//               ${mou.universityContact?.designation ? `Designation: ${mou.universityContact.designation}<br/>` : ""}
//               ${mou.universityContact?.email ? `Email: ${mou.universityContact.email}<br/>` : ""}
//               Signatory: <em>${mou.signatories?.university || "University Authority"}</em>
//             </div>
//           </td>
//           <td>
//             <div class="p-name">${mou.industry}</div>
//             <div class="p-info">
//               ${mou.industryContact?.name ? `Contact: ${mou.industryContact.name}<br/>` : ""}
//               ${mou.industryContact?.designation ? `Designation: ${mou.industryContact.designation}<br/>` : ""}
//               ${mou.industryContact?.email ? `Email: ${mou.industryContact.email}<br/>` : ""}
//               Signatory: <em>${mou.signatories?.industry || "Industry Authority"}</em>
//             </div>
//           </td>
//         </tr>
//       </table>
//     </div>

//     <div class="section">
//       <div class="sec-title">${sec("Purpose and Scope")}</div>
//       <p>${mou.description || "This Memorandum of Understanding establishes a formal framework for collaboration between the parties."}</p>
//     </div>

//     <div class="section">
//       <div class="sec-title">${sec("Nature of Collaboration")}</div>
//       <p>The nature of collaboration under this MOU is classified as: <strong>${mou.collaborationType}</strong>.</p>
//     </div>

//     <div class="section">
//       <div class="sec-title">${sec("Duration and Validity")}</div>
//       <p>This MOU shall come into force on <strong>${fmtDate(mou.startDate)}</strong> and shall remain valid until <strong>${fmtDate(mou.endDate)}</strong>, unless extended or terminated earlier by mutual written consent.</p>
//     </div>

//     ${mou.objectives?.filter(Boolean).length > 0 ? `
//     <div class="section">
//       <div class="sec-title">${sec("Objectives")}</div>
//       <ul>${mou.objectives.filter(Boolean).map(o => `<li>${o}</li>`).join("")}</ul>
//     </div>` : ""}

//     ${(mou.responsibilities?.university?.filter(Boolean).length > 0 || mou.responsibilities?.industry?.filter(Boolean).length > 0) ? `
//     <div class="section">
//       <div class="sec-title">${sec("Roles and Responsibilities")}</div>
//       ${mou.responsibilities?.university?.filter(Boolean).length > 0 ? `<p style="margin-bottom:4px;"><strong>${mou.university}:</strong></p><ul style="margin-bottom:10px;">${mou.responsibilities.university.filter(Boolean).map(r => `<li>${r}</li>`).join("")}</ul>` : ""}
//       ${mou.responsibilities?.industry?.filter(Boolean).length > 0 ? `<p style="margin-bottom:4px;"><strong>${mou.industry}:</strong></p><ul>${mou.responsibilities.industry.filter(Boolean).map(r => `<li>${r}</li>`).join("")}</ul>` : ""}
//     </div>` : ""}

//     ${mou.terms?.filter(Boolean).length > 0 ? `
//     <div class="section">
//       <div class="sec-title">${sec("Terms and Conditions")}</div>
//       <ol>${mou.terms.filter(Boolean).map(t => `<li>${t}</li>`).join("")}</ol>
//     </div>` : ""}

//     <div class="section">
//       <div class="sec-title">${sec("General Provisions")}</div>
//       <p>This MOU does not create legally binding financial obligations unless a formal agreement is subsequently executed. Either party may terminate with thirty (30) days' written notice. Amendments require mutual written consent. This MOU shall be governed by the applicable laws of Pakistan.</p>
//     </div>

//     <hr class="hr-bold"/>

//     <div class="sec-title" style="margin-bottom:10px;">${sec("Execution and Authentication")}</div>
//     <p style="font-size:12px;color:#5a6a7e;margin-bottom:6px;">In witness whereof, the duly authorized representatives of both parties have signed this MOU on the date first written above.</p>

//     <div class="sig-row">
//       <div class="sig-box">
//         <div class="sig-lbl">Authorized Signatory — First Party</div>
//         <div class="sig-line"></div>
//         <div class="sig-name">${mou.signatories?.university || "University Authority"}</div>
//         <div class="sig-org">${mou.university}</div>
//         <div class="sig-date">Date: ${mou.universityStamp ? fmtDate(mou.universityStamp.date) : "____________________"}</div>
//       </div>
//       <div class="sig-box">
//         <div class="sig-lbl">Authorized Signatory — Second Party</div>
//         <div class="sig-line"></div>
//         <div class="sig-name">${mou.signatories?.industry || "Industry Authority"}</div>
//         <div class="sig-org">${mou.industry}</div>
//         <div class="sig-date">Date: ${mou.industryStamp ? fmtDate(mou.industryStamp.date) : "____________________"}</div>
//       </div>
//     </div>

//     <div class="doc-footer">
//       <span>MOU Portal — University Administration System</span>
//       <span>Ref: ${refNo}</span>
//       <span>Generated: ${new Date().toLocaleDateString("en-PK", { day: "2-digit", month: "long", year: "numeric" })}</span>
//     </div>

//   </div>
// </div>
// </body>
// </html>`;

//   // Use Blob URL — avoids document.write() truncation of large base64 strings
//   const blob = new Blob([html], { type: "text/html;charset=utf-8" });
//   const blobUrl = URL.createObjectURL(blob);
//   const printWindow = window.open(blobUrl, "_blank", "width=900,height=700");
//   if (!printWindow) { alert("Please allow popups for PDF generation."); return; }
//   printWindow.addEventListener("load", () => {
//     setTimeout(() => {
//       printWindow.focus();
//       printWindow.print();
//       setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
//     }, 600);
//   });
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  CHANGE LOG HELPER — add entry to change log
// // ═══════════════════════════════════════════════════════════════════════════════
// const addChangeLogEntry = (mou, type, data = {}) => {
//   const entry = {
//     id: Date.now(),
//     type,
//     date: new Date().toISOString(),
//     ...data,
//   };
//   return [...(mou.changeLog || []), entry];
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// const MouManagement = () => (
//   <NotificationProvider><MouApp /></NotificationProvider>
// );

// const MouApp = () => {
//   const { addNotification } = useNotify();
//   const [view, setView]             = useState("list");
//   const [mous, setMous]             = useState([]);
//   const [selected, setSelected]     = useState(null);
//   const [search, setSearch]         = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [loading, setLoading]       = useState(true);
//   const [meetingModal, setMeetingModal]   = useState(false);
//   const [approveModal, setApproveModal]   = useState(false);
//   const [responseModal, setResponseModal] = useState(false); // NEW: industry response modal
//   const [stampType, setStampType]   = useState("");
//   const [notifPanel, setNotifPanel] = useState(false);
//   const [notifLog, setNotifLog]     = useState([]);

//   useEffect(() => { fetchMous(); }, []);

//   const fetchMous = async () => {
//     try { setLoading(true); const res = await axios.get(API_URL); setMous(res.data); }
//     catch (e) { console.error(e); } finally { setLoading(false); }
//   };

//   const pushNotif = (msg, type = "info") => {
//     addNotification(msg, type);
//     setNotifLog(l => [{ msg, type, time: new Date() }, ...l.slice(0, 19)]);
//   };

//   const filtered = mous.filter(m => {
//     const q = search.toLowerCase();
//     const matchQ = !q || m.university?.toLowerCase().includes(q) || m.industry?.toLowerCase().includes(q) || m.title?.toLowerCase().includes(q);
//     return matchQ && (filterStatus === "All" || m.status === filterStatus);
//   });

//   const expiringSoon = mous.filter(m => {
//     const diff = (new Date(m.endDate) - new Date()) / 86400000;
//     return diff > 0 && diff <= 30;
//   });

//   const openDetail = (mou) => { setSelected(mou); setView("detail"); };
//   const goBack = () => { setSelected(null); setView("list"); };

//   const handleSend = async () => {
//     if (!selected || !window.confirm(`Send this MOU to ${selected.industry}?`)) return;
//     try {
//       const changeLog = addChangeLogEntry(selected, "industry_response", {
//         party: "University",
//         action: "MOU Sent",
//         message: `MOU sent to ${selected.industry} for review`,
//       });
//       const res = await axios.put(`${API_URL}/${selected._id}`, {
//         ...selected, status: "Sent to Industry", sentAt: new Date().toISOString(), changeLog,
//       });
//       updateLocal(res.data);
//       pushNotif(`MOU sent to ${selected.industry} successfully!`, "success");
//     } catch { pushNotif("Error sending MOU", "error"); }
//   };

//   // NEW: Handle industry response (the response button)
//   const handleIndustryResponse = async (responseData) => {
//     if (!selected) return;
//     try {
//       const logType = responseData.type === "accept" ? "industry_approve"
//         : responseData.type === "reject" ? "industry_reject"
//         : responseData.type === "change" ? "industry_change"
//         : "industry_response";

//       const changeLog = addChangeLogEntry(selected, logType, {
//         party: "Industry",
//         from: selected.industry,
//         message: responseData.message,
//       });

//       let newStatus = selected.status;
//       if (responseData.type === "accept") newStatus = "Approved by Industry";
//       else if (responseData.type === "reject") newStatus = "Rejected";
//       else if (responseData.type === "change") newStatus = "Changes Proposed";
//       else newStatus = "Industry Responded";

//       const industryStamp = responseData.type === "accept"
//         ? { by: selected.industry, type: "approve", date: new Date().toISOString() }
//         : selected.industryStamp;

//       const updatePayload = {
//         title:              selected.title,
//         university:         selected.university,
//         industry:           selected.industry,
//         collaborationType:  selected.collaborationType,
//         startDate:          selected.startDate,
//         endDate:            selected.endDate,
//         description:        selected.description,
//         objectives:         selected.objectives,
//         responsibilities:   selected.responsibilities,
//         terms:              selected.terms,
//         signatories:        selected.signatories,
//         universityContact:  selected.universityContact,
//         industryContact:    selected.industryContact,
//         universityLogo:     selected.universityLogo,
//         industryLogo:       selected.industryLogo,
//         universityStamp:    selected.universityStamp,
//         scheduledMeeting:   selected.scheduledMeeting,
//         sentAt:             selected.sentAt,
//         status:             newStatus,
//         changeLog,
//         industryStamp,
//         industryResponseAt: new Date().toISOString(),
//         proposedChanges: responseData.changes
//           ? [...(selected.proposedChanges || []), ...responseData.changes]
//           : (selected.proposedChanges || []),
//       };

//       const res = await axios.put(`${API_URL}/${selected._id}`, updatePayload);
//       updateLocal(res.data);
//       setResponseModal(false);

//       if (responseData.type === "accept") {
//         pushNotif(`🎉 ${selected.industry} has approved the MOU!`, "success");
//         setTimeout(() => pushNotif("University notified of industry approval.", "info"), 1200);
//       } else if (responseData.type === "reject") {
//         pushNotif(`${selected.industry} rejected the MOU.`, "error");
//       } else if (responseData.type === "change") {
//         pushNotif(`${selected.industry} proposed changes to the MOU.`, "info");
//       } else {
//         pushNotif(`${selected.industry} sent a response/comment.`, "info");
//       }
//     } catch (err) {
//       console.error("Industry response error:", err?.response?.data || err.message);
//       pushNotif(`Error: ${err?.response?.data?.message || err.message || "Could not save response"}`, "error");
//     }
//   };

//   const handleApproveReject = async (type) => {
//     if (!selected) return;
//     const stamp = { by: "University Admin", type, date: new Date().toISOString() };
//     try {
//       const isMutual = type === "approve" && selected.status === "Approved by Industry";
//       const newStatus = isMutual ? "Mutually Approved" : (type === "approve" ? "Approved by University" : "Rejected");

//       const changeLog = addChangeLogEntry(selected, type === "approve" ? "university_approve" : "university_reject", {
//         party: "University",
//         action: type === "approve" ? "Approved" : "Rejected",
//         message: isMutual ? "University approved — MOU is now Mutually Approved" : `University ${type === "approve" ? "approved" : "rejected"} the MOU`,
//       });

//       const res = await axios.put(`${API_URL}/${selected._id}`, {
//         ...selected, status: newStatus, universityStamp: stamp, changeLog,
//       });
//       updateLocal(res.data); setApproveModal(false);

//       if (isMutual) pushNotif("🎉 Mutually Approved! PDF download available.", "success");
//       else if (type === "approve") {
//         pushNotif("MOU approved by University.", "success");
//         setTimeout(() => pushNotif(`Notification sent to ${selected.industry} — University approved.`, "info"), 1200);
//       } else {
//         pushNotif("MOU rejected. Industry will be notified.", "error");
//       }
//     } catch { pushNotif("Error updating status", "error"); }
//   };

//   const handleIndustryApprove = async () => {
//     if (!selected) return;
//     const stamp = { by: selected.industry, type: "approve", date: new Date().toISOString() };
//     try {
//       const isMutual = selected.status === "Approved by University";
//       const changeLog = addChangeLogEntry(selected, "industry_approve", {
//         party: "Industry",
//         from: selected.industry,
//         message: isMutual ? `${selected.industry} approved — MOU is now Mutually Approved` : `${selected.industry} has approved the MOU`,
//       });
//       const res = await axios.put(`${API_URL}/${selected._id}`, {
//         ...selected,
//         status: isMutual ? "Mutually Approved" : "Approved by Industry",
//         industryStamp: stamp, industryResponseAt: new Date().toISOString(), changeLog,
//       });
//       updateLocal(res.data);
//       if (isMutual) pushNotif("🎉 Both parties approved! MOU is Mutually Approved.", "success");
//       else { pushNotif(`${selected.industry} has approved the MOU!`, "success"); setTimeout(() => pushNotif("University notified of industry approval.", "info"), 1200); }
//     } catch { pushNotif("Error processing industry approval", "error"); }
//   };

//   const handleMeetingSave = async (meetingData) => {
//     try {
//       const changeLog = addChangeLogEntry(selected, "meeting_proposed", {
//         party: "University",
//         message: `Meeting proposed: ${meetingData.date} at ${meetingData.time} — ${meetingData.venue}`,
//         meetingOptions: meetingData.options,
//       });
//       const res = await axios.put(`${API_URL}/${selected._id}`, {
//         ...selected, scheduledMeeting: meetingData, changeLog,
//       });
//       updateLocal(res.data); setMeetingModal(false);
//       pushNotif(`Meeting scheduled for ${meetingData.date} at ${meetingData.time}`, "success");
//       setTimeout(() => pushNotif(`${selected.industry} notified of scheduled meeting.`, "info"), 1000);
//     } catch { pushNotif("Error saving meeting", "error"); }
//   };

//   const handleIndustryMeetingSelect = async (selectedSlot) => {
//     if (!selected) return;
//     try {
//       const updatedMeeting = {
//         ...selected.scheduledMeeting,
//         confirmedSlot: selectedSlot,
//         confirmedAt: new Date().toISOString(),
//       };
//       const changeLog = addChangeLogEntry(selected, "meeting_confirmed", {
//         party: "Industry",
//         from: selected.industry,
//         message: `${selected.industry} confirmed meeting: ${selectedSlot.date} at ${selectedSlot.time}`,
//       });
//       // Explicit payload — avoids any stale/large data issues
//       const res = await axios.put(`${API_URL}/${selected._id}`, {
//         title:             selected.title,
//         university:        selected.university,
//         industry:          selected.industry,
//         collaborationType: selected.collaborationType,
//         startDate:         selected.startDate,
//         endDate:           selected.endDate,
//         description:       selected.description,
//         objectives:        selected.objectives,
//         responsibilities:  selected.responsibilities,
//         terms:             selected.terms,
//         signatories:       selected.signatories,
//         universityContact: selected.universityContact,
//         industryContact:   selected.industryContact,
//         universityLogo:    selected.universityLogo,
//         industryLogo:      selected.industryLogo,
//         status:            selected.status,
//         universityStamp:   selected.universityStamp,
//         industryStamp:     selected.industryStamp,
//         sentAt:            selected.sentAt,
//         industryResponseAt: selected.industryResponseAt,
//         proposedChanges:   selected.proposedChanges,
//         scheduledMeeting:  updatedMeeting,
//         changeLog,
//       });
//       updateLocal(res.data);
//       pushNotif(`🤝 Meeting confirmed: ${selectedSlot.date} at ${selectedSlot.time}!`, "success");
//       setTimeout(() => pushNotif("Both parties notified of confirmed meeting time.", "info"), 1000);
//     } catch (err) {
//       console.error("Meeting confirm error:", err?.response?.data || err.message);
//       pushNotif(`Error confirming meeting: ${err?.response?.data?.message || err.message}`, "error");
//     }
//   };

//   const handleSendAfterApprove = () => {
//     if (!selected) return;
//     pushNotif(`Re-sent MOU notification to ${selected.industry} with current approval status.`, "success");
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this MOU?")) return;
//     await axios.delete(`${API_URL}/${id}`);
//     setMous(s => s.filter(m => m._id !== id));
//     if (view === "detail") goBack();
//   };

//   const simulateIndustryChange = async () => {
//     if (!selected) return;
//     try {
//       const changeLog = addChangeLogEntry(selected, "industry_change", {
//         party: "Industry",
//         from: selected.industry,
//         field: "Duration",
//         oldValue: fmtDate(selected.endDate),
//         newValue: "Extended by 6 months",
//         reason: "Project scope expanded",
//       });
//       const res = await axios.put(`${API_URL}/${selected._id}`, {
//         ...selected, status: "Changes Proposed",
//         proposedChanges: [...(selected.proposedChanges || []), { field: "Duration", oldValue: fmtDate(selected.endDate), newValue: "Extended by 6 months", reason: "Project scope expanded", date: new Date().toISOString() }],
//         industryResponseAt: new Date().toISOString(), changeLog,
//       });
//       updateLocal(res.data);
//       pushNotif(`${selected.industry} has proposed changes to the MOU!`, "info");
//     } catch { pushNotif("Error simulating change", "error"); }
//   };

//   const updateLocal = (updated) => {
//     setMous(s => s.map(m => m._id === updated._id ? updated : m));
//     setSelected(updated);
//   };

//   return (
//     <div style={S.page}>
//       <div style={S.topbar}>
//         <div style={S.brand}>
//           <FileText size={20} color="#fff" />
//           <span style={S.brandText}>MOU</span>
//           <span style={S.brandSub}>Industry Liaison Incharge</span>
//         </div>
//         <div style={S.topActions}>
//           {expiringSoon.length > 0 && <div style={S.alertChip}><Bell size={13} /> {expiringSoon.length} expiring soon</div>}
//           <div style={{ position: "relative" }}>
//             <motion.button whileHover={{ scale: 1.05 }} style={S.notifBtn} onClick={() => setNotifPanel(p => !p)}>
//               <Bell size={16} color="#fff" />
//               {notifLog.length > 0 && <span style={S.notifDot}>{notifLog.length > 9 ? "9+" : notifLog.length}</span>}
//             </motion.button>
//             <AnimatePresence>
//               {notifPanel && (
//                 <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} style={S.notifPanel}>
//                   <div style={S.notifPanelHeader}>
//                     <span style={{ fontWeight: 700, fontSize: 14, color: "#193648" }}>Notifications</span>
//                     {notifLog.length > 0 && <button style={S.clearBtn} onClick={() => setNotifLog([])}>Clear all</button>}
//                   </div>
//                   {notifLog.length === 0
//                     ? <div style={{ padding: 20, color: "#94a3b8", fontSize: 13, textAlign: "center" }}>No notifications yet</div>
//                     : notifLog.map((n, i) => (
//                       <div key={i} style={S.notifItem}>
//                         <div style={{ fontSize: 13, color: "#193648" }}>{n.msg}</div>
//                         <div style={{ fontSize: 11, color: "#94a3b8" }}>{n.time?.toLocaleTimeString()}</div>
//                       </div>
//                     ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//           <div style={S.avatar}>CX</div>
//         </div>
//       </div>

//       <div style={S.body}>
//         {view === "list" && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//             <div style={S.statsRow}>
//               {[
//                 { label: "Total MOUs",        val: mous.length,                                                                              color: "#193648" },
//                 { label: "Ongoing",           val: mous.filter(m => new Date(m.endDate) > new Date()).length,                                  color: "#0284c7" },
//                 { label: "Pending Review",    val: mous.filter(m => ["Changes Proposed", "Approved by Industry", "Industry Responded"].includes(m.status)).length, color: "#7c3aed" },
//                 { label: "Expiring Soon",     val: expiringSoon.length,                                                                        color: "#d97706" },
//                 { label: "Mutually Approved", val: mous.filter(m => m.status === "Mutually Approved").length,                                  color: "#16a34a" },
//               ].map((s, i) => (
//                 <div key={i} style={S.statCard}>
//                   <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{s.label}</div>
//                   <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.val}</div>
//                 </div>
//               ))}
//             </div>
//             <div style={S.toolbar}>
//               <div style={S.searchBox}>
//                 <Search size={15} color="#94a3b8" />
//                 <input style={S.searchInput} placeholder="Search by name, industry, title..." value={search} onChange={e => setSearch(e.target.value)} />
//                 {search && <X size={14} style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
//               </div>
//               <div style={S.filterBox}>
//                 <Filter size={14} color="#64748b" />
//                 <select style={S.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
//                   <option>All</option>
//                   {Object.keys(STATUS).map(s => <option key={s}>{s}</option>)}
//                 </select>
//               </div>
//               <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={S.createBtn} onClick={() => setView("create")}>
//                 <PlusCircle size={15} /> Create MOU
//               </motion.button>
//             </div>
//             {loading ? <div style={S.empty}>Loading MOUs...</div>
//               : filtered.length === 0 ? <div style={S.empty}>No MOUs found. Create one!</div>
//                 : <div style={S.cardGrid}>{filtered.map(m => <MouCard key={m._id} m={m} onOpen={openDetail} onDelete={handleDelete} />)}</div>}
//           </motion.div>
//         )}
//         {view === "create" && (
//           <CreateMou onBack={goBack} onSaved={(saved) => { setMous(s => [saved, ...s]); pushNotif("MOU created and saved as Draft!", "success"); goBack(); }} />
//         )}
//         {view === "detail" && selected && (
//           <DetailView
//             mou={selected} onBack={goBack} onSend={handleSend} onDelete={() => handleDelete(selected._id)}
//             onScheduleMeeting={() => setMeetingModal(true)}
//             onApproveReject={(type) => { setStampType(type); setApproveModal(true); }}
//             onUpdate={updateLocal} onSendAfterApprove={handleSendAfterApprove}
//             onSimulateChange={simulateIndustryChange} onIndustryApprove={handleIndustryApprove}
//             onDownloadPdf={() => generateMouPdf(selected)}
//             onIndustryResponse={() => setResponseModal(true)}
//             onIndustryMeetingSelect={handleIndustryMeetingSelect}
//           />
//         )}
//       </div>

//       <AnimatePresence>
//         {meetingModal && <MeetingModal existing={selected?.scheduledMeeting} onClose={() => setMeetingModal(false)} onSave={handleMeetingSave} />}
//       </AnimatePresence>
//       <AnimatePresence>
//         {approveModal && <StampModal type={stampType} mou={selected} onClose={() => setApproveModal(false)} onConfirm={() => handleApproveReject(stampType)} />}
//       </AnimatePresence>
//       {/* NEW: Industry Response Modal */}
//       <AnimatePresence>
//         {responseModal && selected && (
//           <IndustryResponseModal mou={selected} onClose={() => setResponseModal(false)} onSave={handleIndustryResponse} />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  MOU CARD
// // ═══════════════════════════════════════════════════════════════════════════════
// const MouCard = ({ m, onOpen, onDelete }) => {
//   const prog = calcProgress(m.startDate, m.endDate);
//   const hasChanges = m.proposedChanges && m.proposedChanges.length > 0;
//   const needsAction = ["Changes Proposed", "Approved by Industry", "Industry Responded"].includes(m.status);
//   const changeLogCount = (m.changeLog || []).length;
//   return (
//     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}
//       style={{ ...S.card, ...(needsAction ? S.cardUrgent : {}) }}>
//       {needsAction && <div style={S.urgentStrip}>⚡ Action Required</div>}
//       {m.status === "Mutually Approved" && <div style={{ ...S.urgentStrip, background: "#dcfce7", color: "#16a34a" }}>✅ Mutually Approved</div>}
//       <div style={S.cardTop}>
//         <div>
//           <div style={S.cardTitle}>{m.title || "Untitled MOU"}</div>
//           <div style={S.cardMeta}><Building2 size={12} /> {m.university}<ChevronRight size={12} style={{ margin: "0 2px" }} />{m.industry}</div>
//         </div>
//         <Badge status={m.status} />
//       </div>
//       <div style={{ fontSize: 12, color: "#64748b", margin: "6px 0" }}>
//         📅 {fmtDate(m.startDate)} → {fmtDate(m.endDate)}
//         {m.collaborationType && <span style={{ marginLeft: 8, background: "#e2e8f0", padding: "1px 8px", borderRadius: 10, fontSize: 11 }}>{m.collaborationType}</span>}
//       </div>
//       {hasChanges && <div style={S.changesBadge}><History size={11} /> {m.proposedChanges.length} change(s) proposed by industry</div>}
//       {changeLogCount > 0 && <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b", marginBottom: 4 }}><MessageSquare size={11} /> {changeLogCount} activity entries</div>}
//       <div style={{ margin: "8px 0 4px" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 3 }}><span>Progress</span><span>{prog}%</span></div>
//         <div style={{ height: 4, background: "#e2e8f0", borderRadius: 4 }}>
//           <div style={{ width: `${prog}%`, height: "100%", background: needsAction ? "#7c3aed" : "#0284c7", borderRadius: 4, transition: "width 0.5s" }} />
//         </div>
//       </div>
//       <div style={S.cardFooter}>
//         <button style={S.btnOutline} onClick={() => onOpen(m)}><Eye size={13} /> View Details</button>
//         <button style={S.btnDanger} onClick={() => onDelete(m._id)}><Trash2 size={13} /></button>
//       </div>
//     </motion.div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  CREATE MOU
// // ═══════════════════════════════════════════════════════════════════════════════
// const CreateMou = ({ onBack, onSaved }) => {
//   const [saving, setSaving] = useState(false);
//   const [form, setForm] = useState({
//     title: "", university: "", industry: "", collaborationType: "",
//     startDate: "", endDate: "", description: "", objectives: [""],
//     responsibilities: { university: [""], industry: [""] }, terms: [""],
//     signatories: { university: "", industry: "" },
//     universityContact: { name: "", designation: "", email: "" },
//     industryContact: { name: "", designation: "", email: "" },
//     universityLogo: "", industryLogo: "",
//     status: "Draft",
//     changeLog: [],
//     proposedChanges: [],
//   });

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
//   const arrAdd    = (k)      => setForm(f => ({ ...f, [k]: [...f[k], ""] }));
//   const arrRemove = (k, i)   => setForm(f => ({ ...f, [k]: f[k].filter((_, j) => j !== i) }));
//   const arrUpdate = (k, i, v) => setForm(f => { const a = [...f[k]]; a[i] = v; return { ...f, [k]: a }; });
//   const n2Add    = (k, s)     => setForm(f => ({ ...f, [k]: { ...f[k], [s]: [...f[k][s], ""] } }));
//   const n2Remove = (k, s, i)  => setForm(f => ({ ...f, [k]: { ...f[k], [s]: f[k][s].filter((_, j) => j !== i) } }));
//   const n2Update = (k, s, i, v) => setForm(f => { const a = [...f[k][s]]; a[i] = v; return { ...f, [k]: { ...f[k], [s]: a } }; });

//   const handleSave = async () => {
//     const { title, university, industry, collaborationType, startDate, endDate } = form;
//     if (!title || !university || !industry || !collaborationType || !startDate || !endDate) return alert("Please fill all required fields.");
//     try {
//       setSaving(true);
//       const initLog = addChangeLogEntry(form, "university_change", { party: "University", action: "MOU Created", message: `MOU "${title}" created as Draft` });
//       const res = await axios.post(API_URL, { ...form, changeLog: initLog });
//       onSaved(res.data);
//     }
//     catch (e) { alert("Error saving MOU: " + (e.response?.data?.message || e.message)); }
//     finally { setSaving(false); }
//   };

//   return (
//     <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
//       <div style={S.detailHeader}>
//         <button style={S.backBtn} onClick={onBack}><ArrowLeft size={16} /> Back</button>
//         <div>
//           <h2 style={{ margin: 0, color: "#193648", fontSize: 20 }}>Create New MOU</h2>
//           <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Fill in MOU details</p>
//         </div>
//         <div style={{ display: "flex", gap: 8 }}>
//           <button style={S.btnOutline} onClick={onBack}>Cancel</button>
//           <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={S.btnPrimary} onClick={handleSave} disabled={saving}>
//             {saving ? "Saving..." : "💾 Save Draft"}
//           </motion.button>
//         </div>
//       </div>

//       {/* LIVE PREVIEW HEADER */}
//       <div style={S.mouHeaderPreview}>
//         <div style={S.mouLogoBox}>
//           <div style={S.mouLogoIconWrap}>
//             <LogoDisplay src={form.universityLogo} fallback={<UniSvg size={26} />} size={44} />
//           </div>
//           <div style={S.mouLogoName}>{form.university || "University Name"}</div>
//           <div style={S.mouLogoSub}>First Party</div>
//         </div>
//         <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 8px" }}>
//           <MouDivider />
//           <div style={S.mouAgreementLabel}>{form.title || "MOU Agreement"}</div>
//           <div style={S.mouAgreementSub}>{form.collaborationType || "Collaboration Type"}</div>
//         </div>
//         <div style={S.mouLogoBox}>
//           <div style={S.mouLogoIconWrap}>
//             <LogoDisplay src={form.industryLogo} fallback={<IndustrySvg size={26} />} size={44} />
//           </div>
//           <div style={S.mouLogoName}>{form.industry || "Industry Partner"}</div>
//           <div style={S.mouLogoSub}>Second Party</div>
//         </div>
//       </div>

//       <div style={S.createBody}>
//         <Section title="🖼️ Party Logos">
//           <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Upload logos for both parties — they will appear in the header and in the PDF.</p>
//           <div style={S.grid2}>
//             <LogoUploadField label="University Logo" value={form.universityLogo} onChange={v => set("universityLogo", v)} />
//             <LogoUploadField label="Industry / Company Logo" value={form.industryLogo} onChange={v => set("industryLogo", v)} />
//           </div>
//         </Section>

//         <Section title="📋 Basic Information">
//           <div style={S.grid2}>
//             <FormField label="MOU Title *" value={form.title} onChange={v => set("title", v)} placeholder="e.g., Industry-Academia Research Collaboration" />
//             <FormField label="Collaboration Type *" value={form.collaborationType} onChange={v => set("collaborationType", v)} type="select" options={["", "Research", "Internship", "Training", "Consultancy", "Joint Venture", "Other"]} />
//             <FormField label="University *" value={form.university} onChange={v => set("university", v)} placeholder="Full University Name" />
//             <FormField label="Industry Partner *" value={form.industry} onChange={v => set("industry", v)} placeholder="Company / Organization Name" />
//             <FormField label="Start Date *" value={form.startDate} onChange={v => set("startDate", v)} type="date" />
//             <FormField label="End Date *" value={form.endDate} onChange={v => set("endDate", v)} type="date" />
//           </div>
//           <FormField label="Purpose / Description" value={form.description} onChange={v => set("description", v)} type="textarea" placeholder="Describe the purpose and scope of this MOU..." />
//         </Section>

//         <Section title="🎯 Objectives">
//           {form.objectives.map((obj, i) => (
//             <div key={i} style={S.listItem}>
//               <input style={S.listInput} value={obj} placeholder={`Objective ${i + 1}`} onChange={e => arrUpdate("objectives", i, e.target.value)} />
//               {form.objectives.length > 1 && <button style={S.listRemove} onClick={() => arrRemove("objectives", i)}><X size={13} /></button>}
//             </div>
//           ))}
//           <button style={S.addRowBtn} onClick={() => arrAdd("objectives")}>+ Add Objective</button>
//         </Section>

//         <Section title="📌 Responsibilities">
//           <div style={S.grid2}>
//             <div>
//               <label style={S.subLabel}>University Responsibilities</label>
//               {form.responsibilities.university.map((r, i) => (
//                 <div key={i} style={S.listItem}>
//                   <input style={S.listInput} value={r} placeholder={`Responsibility ${i + 1}`} onChange={e => n2Update("responsibilities", "university", i, e.target.value)} />
//                   {form.responsibilities.university.length > 1 && <button style={S.listRemove} onClick={() => n2Remove("responsibilities", "university", i)}><X size={13} /></button>}
//                 </div>
//               ))}
//               <button style={S.addRowBtn} onClick={() => n2Add("responsibilities", "university")}>+ Add</button>
//             </div>
//             <div>
//               <label style={S.subLabel}>Industry Responsibilities</label>
//               {form.responsibilities.industry.map((r, i) => (
//                 <div key={i} style={S.listItem}>
//                   <input style={S.listInput} value={r} placeholder={`Responsibility ${i + 1}`} onChange={e => n2Update("responsibilities", "industry", i, e.target.value)} />
//                   {form.responsibilities.industry.length > 1 && <button style={S.listRemove} onClick={() => n2Remove("responsibilities", "industry", i)}><X size={13} /></button>}
//                 </div>
//               ))}
//               <button style={S.addRowBtn} onClick={() => n2Add("responsibilities", "industry")}>+ Add</button>
//             </div>
//           </div>
//         </Section>

//         <Section title="⚖️ Terms & Conditions">
//           {form.terms.map((t, i) => (
//             <div key={i} style={S.listItem}>
//               <input style={S.listInput} value={t} placeholder={`Term / Clause ${i + 1}`} onChange={e => arrUpdate("terms", i, e.target.value)} />
//               {form.terms.length > 1 && <button style={S.listRemove} onClick={() => arrRemove("terms", i)}><X size={13} /></button>}
//             </div>
//           ))}
//           <button style={S.addRowBtn} onClick={() => arrAdd("terms")}>+ Add Term</button>
//         </Section>

//         <Section title="👤 Contact Information">
//           <div style={S.grid2}>
//             <div>
//               <label style={S.subLabel}>University Contact</label>
//               <FormField label="Name" value={form.universityContact.name} onChange={v => set("universityContact", { ...form.universityContact, name: v })} />
//               <FormField label="Designation" value={form.universityContact.designation} onChange={v => set("universityContact", { ...form.universityContact, designation: v })} />
//               <FormField label="Email" value={form.universityContact.email} type="email" onChange={v => set("universityContact", { ...form.universityContact, email: v })} />
//             </div>
//             <div>
//               <label style={S.subLabel}>Industry Contact</label>
//               <FormField label="Name" value={form.industryContact.name} onChange={v => set("industryContact", { ...form.industryContact, name: v })} />
//               <FormField label="Designation" value={form.industryContact.designation} onChange={v => set("industryContact", { ...form.industryContact, designation: v })} />
//               <FormField label="Email" value={form.industryContact.email} type="email" onChange={v => set("industryContact", { ...form.industryContact, email: v })} />
//             </div>
//           </div>
//         </Section>

//         <Section title="✍️ Authorized Signatories">
//           <div style={S.grid2}>
//             <FormField label="University Signatory" value={form.signatories.university} onChange={v => set("signatories", { ...form.signatories, university: v })} placeholder="Name & Designation" />
//             <FormField label="Industry Signatory" value={form.signatories.industry} onChange={v => set("signatories", { ...form.signatories, industry: v })} placeholder="Name & Designation" />
//           </div>
//         </Section>

//         <div style={{ textAlign: "right", marginTop: 16 }}>
//           <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
//             style={{ ...S.btnPrimary, padding: "12px 32px", fontSize: 15 }} onClick={handleSave} disabled={saving}>
//             {saving ? "Saving..." : "💾 Save MOU as Draft"}
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  DETAIL VIEW
// // ═══════════════════════════════════════════════════════════════════════════════
// const DetailView = ({ mou, onBack, onSend, onDelete, onScheduleMeeting, onApproveReject, onUpdate, onSendAfterApprove, onSimulateChange, onIndustryApprove, onDownloadPdf, onIndustryResponse, onIndustryMeetingSelect }) => {
//   const [editing, setEditing] = useState(false);
//   const [editData, setEditData] = useState(mou);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => { setEditData(mou); }, [mou]);

//   const hasChanges    = mou.proposedChanges && mou.proposedChanges.length > 0;
//   const canSend       = ["Draft", "Rejected"].includes(mou.status);
//   const canApprove    = ["Sent to Industry", "Changes Proposed", "Approved by Industry", "Industry Responded"].includes(mou.status);
//   const canIndApprove = ["Sent to Industry", "Changes Proposed", "Approved by University", "Industry Responded"].includes(mou.status) && !mou.industryStamp;
//   const canSendAfter  = ["Approved by University", "Mutually Approved"].includes(mou.status);
//   const canDownload   = ["Approved by Industry", "Approved by University", "Mutually Approved"].includes(mou.status);
//   const isMutual      = mou.status === "Mutually Approved";
//   const meeting       = mou.scheduledMeeting;
//   const canRespond    = ["Sent to Industry", "Changes Proposed"].includes(mou.status); // show response button
//   const hasMeetingOptions = meeting?.options && meeting.options.length > 0;
//   const hasConfirmedSlot  = meeting?.confirmedSlot;
//   // Industry can confirm a single-slot meeting (no options, not yet confirmed)
//   const canIndustryConfirmSingle = meeting && !hasMeetingOptions && !hasConfirmedSlot && meeting.date && meeting.time;

//   const saveEdit = async () => {
//     try {
//       setSaving(true);
//       const changeLog = addChangeLogEntry(editData, "university_change", {
//         party: "University",
//         action: "MOU Edited",
//         message: "University updated MOU details",
//       });
//       const res = await axios.put(`${API_URL}/${mou._id}`, { ...editData, changeLog });
//       onUpdate(res.data); setEditing(false);
//     }
//     catch { alert("Error saving"); } finally { setSaving(false); }
//   };

//   return (
//     <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
//       <div style={S.detailHeader}>
//         <button style={S.backBtn} onClick={onBack}><ArrowLeft size={16} /> Back</button>
//         <div style={{ flex: 1 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
//             <h2 style={{ margin: 0, color: "#193648", fontSize: 20 }}>{mou.title || "Untitled MOU"}</h2>
//             <Badge status={mou.status} />
//           </div>
//           <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{mou.university} ↔ {mou.industry} | Created: {fmtDate(mou.createdAt)}</p>
//         </div>
//         <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//           {editing ? (
//             <>
//               <button style={S.btnOutline} onClick={() => setEditing(false)}>Cancel</button>
//               <button style={S.btnPrimary} onClick={saveEdit} disabled={saving}>{saving ? "Saving..." : "💾 Save Changes"}</button>
//             </>
//           ) : (
//             <>
//               {canSend       && <button style={S.btnSend} onClick={onSend}><Send size={14} /> Send to Industry</button>}
//               {canRespond    && (
//                 <motion.button whileHover={{ scale: 1.04 }} style={S.btnResponse} onClick={onIndustryResponse}>
//                   <MessageSquare size={14} /> Industry Response
//                 </motion.button>
//               )}
//               {canApprove    && <><button style={S.btnApprove} onClick={() => onApproveReject("approve")}><CheckCircle size={14} /> Univ. Approve</button><button style={S.btnReject} onClick={() => onApproveReject("reject")}><XCircle size={14} /> Reject</button></>}
//               {canIndApprove && <motion.button whileHover={{ scale: 1.04 }} style={S.btnIndustryApprove} onClick={onIndustryApprove}><CheckSquare size={14} /> Industry Approve</motion.button>}
//               {canSendAfter  && <button style={S.btnNotify} onClick={onSendAfterApprove}><Bell size={14} /> Notify Industry</button>}
//               {canDownload   && <motion.button whileHover={{ scale: 1.04 }} style={S.btnDownload} onClick={onDownloadPdf}><Download size={14} /> Download PDF</motion.button>}
//               <button style={S.btnMeeting} onClick={onScheduleMeeting}><Calendar size={14} /> {meeting ? "Edit Meeting" : "Schedule Meeting"}</button>
//               <button style={S.btnOutline} onClick={() => setEditing(true)}><Edit3 size={14} /> Edit MOU</button>
//               {mou.status === "Sent to Industry" && <button style={{ ...S.btnOutline, color: "#7c3aed", borderColor: "#7c3aed" }} onClick={onSimulateChange}>🔧 Simulate Change</button>}
//               <button style={S.btnDanger} onClick={onDelete}><Trash2 size={14} /></button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* HEADER BANNER */}
//       <div style={{ ...S.mouHeaderPreview, marginBottom: 16 }}>
//         <div style={S.mouLogoBox}>
//           <div style={S.mouLogoIconWrap}><LogoDisplay src={mou.universityLogo} fallback={<UniSvg size={26} />} size={44} /></div>
//           <div style={S.mouLogoName}>{mou.university}</div>
//           <div style={S.mouLogoSub}>First Party</div>
//         </div>
//         <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 8px" }}>
//           <MouDivider />
//           <div style={S.mouAgreementLabel}>{mou.title || "MOU Agreement"}</div>
//           <div style={S.mouAgreementSub}>{mou.collaborationType}</div>
//           {isMutual && <div style={{ marginTop: 6, background: "#dcfce7", color: "#16a34a", borderRadius: 20, padding: "2px 12px", fontSize: 11, fontWeight: 700, border: "1px solid #86efac" }}>✅ MUTUALLY APPROVED</div>}
//         </div>
//         <div style={S.mouLogoBox}>
//           <div style={S.mouLogoIconWrap}><LogoDisplay src={mou.industryLogo} fallback={<IndustrySvg size={26} />} size={44} /></div>
//           <div style={S.mouLogoName}>{mou.industry}</div>
//           <div style={S.mouLogoSub}>Second Party</div>
//         </div>
//       </div>

//       <div style={S.detailBody}>
//         <div style={S.detailLeft}>
//           {hasChanges && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={S.changesAlert}>
//               <AlertTriangle size={16} color="#7c3aed" />
//               <span style={{ color: "#7c3aed", fontWeight: 600 }}>Industry has proposed {mou.proposedChanges.length} change(s) — review in the sidebar</span>
//             </motion.div>
//           )}

//           {/* MEETING CARD — with industry slot selection */}
//           {meeting && (
//             <div style={S.meetingCard}>
//               <div style={{ fontWeight: 700, color: "#0284c7", marginBottom: 8, display: "flex", gap: 6, alignItems: "center", justifyContent: "space-between" }}>
//                 <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={14} /> Scheduled Meeting</span>
//                 {hasConfirmedSlot && <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 12, border: "1px solid #86efac" }}>✅ Confirmed</span>}
//               </div>

//               {hasConfirmedSlot ? (
//                 /* Confirmed slot */
//                 <div>
//                   <div style={{ background: "linear-gradient(135deg,#dcfce7,#d1fae5)", border: "1px solid #86efac", borderRadius: 10, padding: "12px 16px", marginBottom: 8 }}>
//                     <div style={{ fontWeight: 800, color: "#16a34a", fontSize: 13, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
//                       🤝 Meeting Confirmed by {mou.industry}
//                     </div>
//                     <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
//                       <div style={{ background: "#fff", borderRadius: 8, padding: "8px 14px", border: "1px solid #bbf7d0", flex: 1, minWidth: 140 }}>
//                         <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 }}>Date & Time</div>
//                         <div style={{ fontWeight: 800, color: "#15803d", fontSize: 14 }}>
//                           {meeting.confirmedSlot.date}
//                         </div>
//                         <div style={{ fontWeight: 600, color: "#166534", fontSize: 12 }}>
//                           🕐 {meeting.confirmedSlot.time}
//                         </div>
//                       </div>
//                       <div style={{ background: "#fff", borderRadius: 8, padding: "8px 14px", border: "1px solid #bbf7d0", flex: 1, minWidth: 140 }}>
//                         <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 }}>Venue</div>
//                         <div style={{ fontWeight: 700, color: "#166534", fontSize: 13 }}>📍 {meeting.venue || "—"}</div>
//                       </div>
//                     </div>
//                     {meeting.agenda && (
//                       <div style={{ marginTop: 8, fontSize: 12, color: "#166534" }}>
//                         <span style={{ fontWeight: 700 }}>Agenda: </span>{meeting.agenda}
//                       </div>
//                     )}
//                     {meeting.confirmedSlot.note && (
//                       <div style={{ marginTop: 4, fontSize: 11, color: "#4b5563" }}>📌 {meeting.confirmedSlot.note}</div>
//                     )}
//                     <div style={{ marginTop: 6, fontSize: 10, color: "#6b7280" }}>
//                       Confirmed at: {fmtDateTime(meeting.confirmedAt)}
//                     </div>
//                   </div>
//                 </div>
//               ) : hasMeetingOptions ? (
//                 /* Industry chooses from options */
//                 <div>
//                   <div style={{ fontSize: 12, color: "#0284c7", fontWeight: 600, marginBottom: 6 }}>📋 Options proposed by University — Industry to select:</div>
//                   {meeting.options.map((opt, i) => (
//                     <motion.div key={i} whileHover={{ scale: 1.01 }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8faff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
//                       <div>
//                         <div style={{ fontWeight: 600, color: "#193648", fontSize: 12 }}>{opt.date} at {opt.time}</div>
//                         {opt.note && <div style={{ fontSize: 11, color: "#64748b" }}>{opt.note}</div>}
//                       </div>
//                       <button style={{ ...S.btnApprove, padding: "4px 10px", fontSize: 11 }} onClick={() => onIndustryMeetingSelect(opt)}>
//                         <Vote size={11} /> Select
//                       </button>
//                     </motion.div>
//                   ))}
//                   <MeetingRow icon={<MapPin size={12} />} label="Venue" val={meeting.venue} />
//                   <MeetingRow icon={<Coffee size={12} />} label="Agenda" val={meeting.agenda} />
//                 </div>
//               ) : (
//                 /* Simple single meeting */
//                 <div>
//                   <MeetingRow icon={<Clock size={12} />} label="Date & Time" val={`${fmtDate(meeting.date)} at ${meeting.time}`} />
//                   <MeetingRow icon={<MapPin size={12} />} label="Venue" val={meeting.venue} />
//                   <MeetingRow icon={<Coffee size={12} />} label="Agenda" val={meeting.agenda} />
//                   {meeting.menu && <MeetingRow icon={<Coffee size={12} />} label="Menu" val={meeting.menu} />}
//                   {meeting.attendees && <MeetingRow icon={<User size={12} />} label="Attendees" val={meeting.attendees} />}
//                   {canIndustryConfirmSingle && (
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 10 }}>
//                       <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>
//                         🏭 Industry — confirm this meeting slot:
//                       </div>
//                       <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
//                         style={{ ...S.btnApprove, width: "100%", justifyContent: "center", padding: "9px" }}
//                         onClick={() => onIndustryMeetingSelect({ date: meeting.date, time: meeting.time, note: "" })}>
//                         <Vote size={13} /> Confirm This Meeting
//                       </motion.button>
//                     </motion.div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {(mou.universityStamp || mou.industryStamp) && (
//             <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
//               {mou.universityStamp && <StampBadge stamp={mou.universityStamp} label="University" />}
//               {mou.industryStamp   && <StampBadge stamp={mou.industryStamp}   label="Industry" />}
//             </div>
//           )}
//           {canDownload && (
//             <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={S.downloadBanner}>
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <CheckSquare size={22} color="#16a34a" />
//                 <div>
//                   <div style={{ fontWeight: 800, color: "#166534", fontSize: 14 }}>{isMutual ? "🎉 Both parties have approved this MOU!" : "✅ MOU approved — PDF ready"}</div>
//                   <div style={{ fontSize: 12, color: "#4ade80" }}>{isMutual ? "The MOU is fully finalized. Download the official PDF." : "Download the approved MOU PDF."}</div>
//                 </div>
//               </div>
//               <motion.button whileHover={{ scale: 1.04 }} style={S.btnDownload} onClick={onDownloadPdf}><Download size={15} /> Download PDF</motion.button>
//             </motion.div>
//           )}
//           {editing ? <EditableMou data={editData} onChange={(k, v) => setEditData(f => ({ ...f, [k]: v }))} /> : <ViewMou mou={mou} />}
//         </div>

//         {/* ── SIDEBAR: Change Log + Timeline ── */}
//         <div style={S.sidebar}>
//           {/* CHANGE LOG — full activity */}
//           <div style={S.sidebarTitle}><History size={15} /> Activity Log</div>
//           {(!mou.changeLog || mou.changeLog.length === 0) && (!hasChanges)
//             ? <div style={S.sidebarEmpty}>No activity yet.</div>
//             : null
//           }

//           {/* Proposed Changes (structural) */}
//           {hasChanges && (
//             <div style={{ marginBottom: 10 }}>
//               <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Proposed Field Changes</div>
//               {mou.proposedChanges.map((c, i) => (
//                 <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={S.changeItem}>
//                   <div style={{ fontWeight: 700, color: "#7c3aed", fontSize: 12, marginBottom: 3 }}>🏭 {c.field || `Change #${i + 1}`}</div>
//                   <div style={{ fontSize: 12, marginBottom: 3 }}>
//                     <span style={{ color: "#dc2626", textDecoration: "line-through" }}>{c.oldValue || "—"}</span>
//                     <span style={{ color: "#64748b", margin: "0 6px" }}>→</span>
//                     <span style={{ color: "#16a34a" }}>{c.newValue || "—"}</span>
//                   </div>
//                   {c.reason && <div style={{ fontSize: 11, color: "#94a3b8" }}>Reason: {c.reason}</div>}
//                   <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 3 }}>{fmtDate(c.date)}</div>
//                 </motion.div>
//               ))}
//             </div>
//           )}

//           {/* Full Change Log */}
//           {(mou.changeLog || []).length > 0 && (
//             <div>
//               <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>All Activity</div>
//               {[...(mou.changeLog || [])].reverse().map((entry, i) => {
//                 const cfg = CHANGE_TYPES[entry.type] || { color: "#64748b", bg: "#f1f5f9", icon: "📌", label: entry.type };
//                 return (
//                   <motion.div key={entry.id || i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
//                     style={{ background: cfg.bg, border: `1px solid ${cfg.color}30`, borderRadius: 8, padding: "9px 12px", marginBottom: 7 }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
//                       <span style={{ fontSize: 14 }}>{cfg.icon}</span>
//                       <span style={{ fontWeight: 700, color: cfg.color, fontSize: 11 }}>{cfg.label}</span>
//                       <span style={{ marginLeft: "auto", fontSize: 10, color: "#94a3b8" }}>{entry.party}</span>
//                     </div>
//                     {entry.message && <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.4 }}>{entry.message}</div>}
//                     {entry.from && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>From: {entry.from}</div>}
//                     {entry.field && (
//                       <div style={{ fontSize: 11, marginTop: 3 }}>
//                         <span style={{ color: "#dc2626", textDecoration: "line-through" }}>{entry.oldValue}</span>
//                         <span style={{ color: "#64748b", margin: "0 4px" }}>→</span>
//                         <span style={{ color: "#16a34a" }}>{entry.newValue}</span>
//                       </div>
//                     )}
//                     <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 4 }}>{fmtDateTime(entry.date)}</div>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           )}

//           {/* TIMELINE */}
//           <div style={{ ...S.sidebarTitle, marginTop: 16 }}><Clock size={15} /> Timeline</div>
//           <div style={S.timeline}>
//             {[
//               { label: "Draft Created",       date: mou.createdAt,             done: true },
//               { label: "Sent to Industry",    date: mou.sentAt,                done: !!mou.sentAt },
//               { label: "Industry Response",   date: mou.industryResponseAt,    done: !!mou.industryResponseAt },
//               { label: "University Decision", date: mou.universityStamp?.date, done: !!mou.universityStamp },
//               { label: "Meeting Confirmed",   date: mou.scheduledMeeting?.confirmedAt, done: !!mou.scheduledMeeting?.confirmedSlot },
//               { label: "Mutually Approved",   date: null,                      done: mou.status === "Mutually Approved" },
//             ].map((t, i) => (
//               <div key={i} style={S.timelineItem}>
//                 <div style={{ ...S.timelineDot, background: t.done ? "#16a34a" : "#e2e8f0" }}>
//                   {t.done && <CheckCircle size={10} color="#fff" />}
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 12, fontWeight: 600, color: t.done ? "#193648" : "#94a3b8" }}>{t.label}</div>
//                   {t.date && <div style={{ fontSize: 10, color: "#94a3b8" }}>{fmtDate(t.date)}</div>}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // ─── VIEW MOU ─────────────────────────────────────────────────────────────────
// const ViewMou = ({ mou }) => (
//   <div style={S.mouDoc}>
//     <div style={S.mouDocTitle}>MEMORANDUM OF UNDERSTANDING</div>
//     <div style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginBottom: 16 }}>{mou.university} & {mou.industry}</div>
//     <hr style={{ borderColor: "#e2e8f0", margin: "12px 0" }} />
//     <MouSection title="1. Parties"><p><strong>University:</strong> {mou.university}</p><p><strong>Industry:</strong> {mou.industry}</p></MouSection>
//     <MouSection title="2. Purpose"><p>{mou.description || "—"}</p></MouSection>
//     <MouSection title="3. Collaboration Type"><p>{mou.collaborationType}</p></MouSection>
//     <MouSection title="4. Duration"><p>From <strong>{fmtDate(mou.startDate)}</strong> to <strong>{fmtDate(mou.endDate)}</strong></p></MouSection>
//     {mou.objectives?.filter(Boolean).length > 0 && <MouSection title="5. Objectives"><ul>{mou.objectives.filter(Boolean).map((o, i) => <li key={i}>{o}</li>)}</ul></MouSection>}
//     {(mou.responsibilities?.university?.filter(Boolean).length > 0 || mou.responsibilities?.industry?.filter(Boolean).length > 0) && (
//       <MouSection title="6. Responsibilities">
//         {mou.responsibilities?.university?.filter(Boolean).length > 0 && <><strong>University:</strong><ul>{mou.responsibilities.university.filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}</ul></>}
//         {mou.responsibilities?.industry?.filter(Boolean).length > 0 && <><strong>Industry:</strong><ul>{mou.responsibilities.industry.filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}</ul></>}
//       </MouSection>
//     )}
//     {mou.terms?.filter(Boolean).length > 0 && <MouSection title="7. Terms & Conditions"><ol>{mou.terms.filter(Boolean).map((t, i) => <li key={i}>{t}</li>)}</ol></MouSection>}
//     <MouSection title="8. Signatories">
//       <div style={{ display: "flex", gap: 40, marginTop: 8 }}>
//         {[["university", "university"], ["industry", "industry"]].map(([side, key]) => (
//           <div key={side}><div style={{ borderTop: "1px solid #193648", paddingTop: 6, marginTop: 30, width: 160 }}>
//             <strong>{mou.signatories?.[key] || `${side.charAt(0).toUpperCase() + side.slice(1)} Authority`}</strong><br />
//             <span style={{ fontSize: 12, color: "#64748b" }}>For {mou[side]}</span>
//           </div></div>
//         ))}
//       </div>
//     </MouSection>
//   </div>
// );

// // ─── EDITABLE MOU ─────────────────────────────────────────────────────────────
// const EditableMou = ({ data, onChange }) => {
//   const upd = (k, i, v) => { const a = [...(data[k] || [])]; a[i] = v; onChange(k, a); };
//   return (
//     <div style={S.mouDoc}>
//       <div style={S.mouDocTitle}>MEMORANDUM OF UNDERSTANDING - EDIT MODE</div>
//       <hr style={{ borderColor: "#e2e8f0", margin: "12px 0" }} />
//       <MouSection title="Basic Details">
//         <div style={S.grid2}>
//           <FormField label="Title" value={data.title} onChange={v => onChange("title", v)} />
//           <FormField label="Collaboration Type" value={data.collaborationType} type="select" options={["", "Research", "Internship", "Training", "Consultancy", "Joint Venture", "Other"]} onChange={v => onChange("collaborationType", v)} />
//           <FormField label="Start Date" value={data.startDate} type="date" onChange={v => onChange("startDate", v)} />
//           <FormField label="End Date" value={data.endDate} type="date" onChange={v => onChange("endDate", v)} />
//         </div>
//         <FormField label="Purpose" value={data.description} type="textarea" onChange={v => onChange("description", v)} />
//       </MouSection>
//       <MouSection title="Objectives">
//         {(data.objectives || [""]).map((o, i) => <input key={i} style={{ ...S.listInput, marginBottom: 6 }} value={o} onChange={e => upd("objectives", i, e.target.value)} placeholder={`Objective ${i + 1}`} />)}
//       </MouSection>
//       <MouSection title="Terms & Conditions">
//         {(data.terms || [""]).map((t, i) => <input key={i} style={{ ...S.listInput, marginBottom: 6 }} value={t} onChange={e => upd("terms", i, e.target.value)} placeholder={`Term ${i + 1}`} />)}
//       </MouSection>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  INDUSTRY RESPONSE MODAL — NEW
// // ═══════════════════════════════════════════════════════════════════════════════
// const IndustryResponseModal = ({ mou, onClose, onSave }) => {
//   const [responseType, setResponseType] = useState("comment"); // 'accept' | 'reject' | 'comment' | 'change'
//   const [message, setMessage] = useState("");
//   const [changes, setChanges] = useState([{ field: "", oldValue: "", newValue: "", reason: "" }]);

//   const addChange = () => setChanges(c => [...c, { field: "", oldValue: "", newValue: "", reason: "" }]);
//   const updateChange = (i, k, v) => setChanges(c => { const a = [...c]; a[i] = { ...a[i], [k]: v }; return a; });
//   const removeChange = (i) => setChanges(c => c.filter((_, j) => j !== i));

//   const handleSubmit = () => {
//     if (!message.trim() && responseType !== "accept" && responseType !== "reject") return alert("Please enter a response message.");
//     const payload = {
//       type: responseType,
//       message: message || (responseType === "accept" ? `${mou.industry} has accepted the MOU.` : `${mou.industry} has rejected the MOU.`),
//       changes: responseType === "change" ? changes.filter(c => c.field).map(c => ({ ...c, date: new Date().toISOString() })) : undefined,
//     };
//     onSave(payload);
//   };

//   const typeConfig = {
//     accept:  { color: "#16a34a", bg: "#f0fdf4", border: "#86efac", icon: <ThumbsUp size={16} />, label: "Accept MOU" },
//     reject:  { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", icon: <ThumbsDown size={16} />, label: "Reject MOU" },
//     comment: { color: "#0284c7", bg: "#eff6ff", border: "#93c5fd", icon: <MessageSquare size={16} />, label: "Send Comment" },
//     change:  { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", icon: <RefreshCw size={16} />, label: "Propose Changes" },
//   };

//   return (
//     <div style={S.overlay}>
//       <motion.div initial={{ y: 40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0, scale: 0.95 }}
//         style={{ ...S.modal, maxWidth: 560 }}>
//         <div style={S.modalHeader}>
//           <div style={{ fontWeight: 700, fontSize: 16, color: "#193648", display: "flex", alignItems: "center", gap: 8 }}>
//             <MessageSquare size={18} /> Industry Response — {mou.industry}
//           </div>
//           <X size={20} style={{ cursor: "pointer" }} onClick={onClose} />
//         </div>
//         <div style={S.modalBody}>
//           {/* Response type selector */}
//           <div style={{ marginBottom: 16 }}>
//             <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, display: "block", marginBottom: 8 }}>Response Type</label>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
//               {Object.entries(typeConfig).map(([key, cfg]) => (
//                 <motion.button key={key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
//                   onClick={() => setResponseType(key)}
//                   style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, border: `2px solid ${responseType === key ? cfg.color : "#e2e8f0"}`, background: responseType === key ? cfg.bg : "#fff", color: responseType === key ? cfg.color : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s" }}>
//                   {cfg.icon} {cfg.label}
//                 </motion.button>
//               ))}
//             </div>
//           </div>

//           {/* Message */}
//           <FormField
//             label={responseType === "accept" ? "Acceptance Note (optional)" : responseType === "reject" ? "Rejection Reason *" : "Message / Comment *"}
//             value={message}
//             type="textarea"
//             onChange={setMessage}
//             placeholder={
//               responseType === "accept" ? "e.g., We accept the MOU as presented." :
//               responseType === "reject" ? "e.g., Terms do not align with our current capacity." :
//               responseType === "comment" ? "e.g., Please clarify the scope of section 3..." :
//               "Describe the changes you are proposing..."
//             }
//           />

//           {/* Change fields (only when type = change) */}
//           {responseType === "change" && (
//             <div>
//               <label style={{ fontSize: 12, color: "#7c3aed", fontWeight: 700, display: "block", marginBottom: 8 }}>Proposed Changes</label>
//               {changes.map((ch, i) => (
//                 <div key={i} style={{ background: "#f5f3ff", border: "1px solid #e9d5ff", borderRadius: 8, padding: "12px", marginBottom: 10 }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
//                     <span style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed" }}>Change #{i + 1}</span>
//                     {changes.length > 1 && <button style={S.listRemove} onClick={() => removeChange(i)}><X size={12} /></button>}
//                   </div>
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
//                     <FormField label="Field / Section" value={ch.field} onChange={v => updateChange(i, "field", v)} placeholder="e.g., Duration, Clause 3" />
//                     <FormField label="Reason" value={ch.reason} onChange={v => updateChange(i, "reason", v)} placeholder="Why this change?" />
//                     <FormField label="Current Value" value={ch.oldValue} onChange={v => updateChange(i, "oldValue", v)} placeholder="Existing value" />
//                     <FormField label="Proposed Value" value={ch.newValue} onChange={v => updateChange(i, "newValue", v)} placeholder="New value" />
//                   </div>
//                 </div>
//               ))}
//               <button style={S.addRowBtn} onClick={addChange}>+ Add Another Change</button>
//             </div>
//           )}

//           {/* Preview summary */}
//           {responseType && (
//             <div style={{ background: typeConfig[responseType].bg, border: `1px solid ${typeConfig[responseType].border}`, borderRadius: 8, padding: "10px 14px", marginTop: 12 }}>
//               <div style={{ fontSize: 12, color: typeConfig[responseType].color, fontWeight: 600 }}>
//                 {typeConfig[responseType].icon} This will be logged in the Change Log and university will be notified.
//               </div>
//             </div>
//           )}
//         </div>
//         <div style={{ padding: "12px 20px", display: "flex", gap: 8, justifyContent: "flex-end", borderTop: "1px solid #f1f5f9" }}>
//           <button style={S.btnOutline} onClick={onClose}>Cancel</button>
//           <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
//             style={{ ...S.btnPrimary, background: typeConfig[responseType].color }}
//             onClick={handleSubmit}>
//             {typeConfig[responseType].icon} Submit Response
//           </motion.button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // ─── MEETING MODAL — Updated with multiple time options ───────────────────────
// const MeetingModal = ({ existing, onClose, onSave }) => {
//   const [mode, setMode] = useState(existing?.options ? "options" : "single"); // 'single' | 'options'
//   const [form, setForm] = useState(existing || { date: "", time: "", venue: "", agenda: "", menu: "", attendees: "", options: [] });
//   const [options, setOptions] = useState(existing?.options || [{ date: "", time: "", note: "" }]);
//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
//   const addOption = () => setOptions(o => [...o, { date: "", time: "", note: "" }]);
//   const updateOption = (i, k, v) => setOptions(o => { const a = [...o]; a[i] = { ...a[i], [k]: v }; return a; });
//   const removeOption = (i) => setOptions(o => o.filter((_, j) => j !== i));

//   const handleSave = () => {
//     if (!form.venue || !form.agenda) return alert("Please fill venue and agenda.");
//     if (mode === "single" && (!form.date || !form.time)) return alert("Please fill date and time.");
//     if (mode === "options" && options.filter(o => o.date && o.time).length === 0) return alert("Please add at least one time option.");
//     const data = mode === "options"
//       ? { ...form, options: options.filter(o => o.date && o.time), date: "", time: "" }
//       : { ...form, options: [] };
//     onSave(data);
//   };

//   return (
//     <div style={S.overlay}>
//       <motion.div initial={{ y: 40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0, scale: 0.95 }} style={{ ...S.modal, maxWidth: 540 }}>
//         <div style={S.modalHeader}>
//           <div style={{ fontWeight: 700, fontSize: 16, color: "#193648", display: "flex", alignItems: "center", gap: 8 }}><Calendar size={18} /> Schedule Meeting</div>
//           <X size={20} style={{ cursor: "pointer" }} onClick={onClose} />
//         </div>
//         <div style={S.modalBody}>
//           {/* Mode toggle */}
//           <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
//             {[
//               { key: "single",  label: "📅 Single Date/Time" },
//               { key: "options", label: "🗓️ Multiple Options (Industry Chooses)" },
//             ].map(m => (
//               <button key={m.key} onClick={() => setMode(m.key)}
//                 style={{ flex: 1, padding: "8px", borderRadius: 8, border: `2px solid ${mode === m.key ? "#0284c7" : "#e2e8f0"}`, background: mode === m.key ? "#eff6ff" : "#fff", color: mode === m.key ? "#0284c7" : "#64748b", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
//                 {m.label}
//               </button>
//             ))}
//           </div>

//           {mode === "single" ? (
//             <>
//               <div style={S.grid2}>
//                 <FormField label="Meeting Date *" value={form.date} type="date" onChange={v => set("date", v)} />
//                 <FormField label="Time *" value={form.time} type="time" onChange={v => set("time", v)} />
//               </div>
//             </>
//           ) : (
//             <div style={{ marginBottom: 12 }}>
//               <label style={{ fontSize: 12, color: "#0284c7", fontWeight: 700, display: "block", marginBottom: 8 }}>Time Options (industry will select one)</label>
//               {options.map((opt, i) => (
//                 <div key={i} style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//                     <span style={{ fontSize: 11, fontWeight: 700, color: "#0284c7" }}>Option {i + 1}</span>
//                     {options.length > 1 && <button style={S.listRemove} onClick={() => removeOption(i)}><X size={12} /></button>}
//                   </div>
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 8 }}>
//                     <FormField label="Date" value={opt.date} type="date" onChange={v => updateOption(i, "date", v)} />
//                     <FormField label="Time" value={opt.time} type="time" onChange={v => updateOption(i, "time", v)} />
//                     <FormField label="Note (optional)" value={opt.note} onChange={v => updateOption(i, "note", v)} placeholder="e.g., Morning slot" />
//                   </div>
//                 </div>
//               ))}
//               <button style={S.addRowBtn} onClick={addOption}>+ Add Time Option</button>
//             </div>
//           )}

//           <FormField label="Venue / Location *" value={form.venue} onChange={v => set("venue", v)} placeholder="e.g., Conference Room A, City Hotel" />
//           <FormField label="Agenda *" value={form.agenda} type="textarea" onChange={v => set("agenda", v)} placeholder="Meeting objectives and points to discuss..." />
//           <FormField label="Menu / Refreshments" value={form.menu} onChange={v => set("menu", v)} placeholder="e.g., Lunch, Tea & Coffee" />
//           <FormField label="Expected Attendees" value={form.attendees} onChange={v => set("attendees", v)} placeholder="e.g., Dean, Industry Director" />

//           {mode === "options" && (
//             <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#92400e" }}>
//               💡 Industry will see these options and select their preferred time. Both parties will be notified once confirmed.
//             </div>
//           )}
//         </div>
//         <div style={{ padding: "12px 20px", display: "flex", gap: 8, justifyContent: "flex-end", borderTop: "1px solid #f1f5f9" }}>
//           <button style={S.btnOutline} onClick={onClose}>Cancel</button>
//           <button style={S.btnPrimary} onClick={handleSave}><Calendar size={14} /> Save Meeting</button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // ─── STAMP MODAL ──────────────────────────────────────────────────────────────
// const StampModal = ({ type, mou, onClose, onConfirm }) => (
//   <div style={S.overlay}>
//     <motion.div initial={{ y: 30, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0, scale: 0.95 }} style={{ ...S.modal, maxWidth: 400, textAlign: "center" }}>
//       <div style={{ padding: 32 }}>
//         <div style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 16px", background: type === "approve" ? "#dcfce7" : "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${type === "approve" ? "#16a34a" : "#dc2626"}` }}>
//           {type === "approve" ? <CheckCircle size={36} color="#16a34a" /> : <XCircle size={36} color="#dc2626" />}
//         </div>
//         <div style={{ fontSize: 18, fontWeight: 800, color: "#193648", marginBottom: 8 }}>{type === "approve" ? "Approve this MOU?" : "Reject this MOU?"}</div>
//         <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
//           {type === "approve" ? `Stamp "APPROVED" on behalf of ${mou?.university}. Industry will be notified.` : `Mark the MOU as Rejected. Industry will be notified.`}
//         </div>
//         {type === "approve" && mou?.status === "Approved by Industry" && (
//           <div style={{ background: "#dcfce7", border: "1px solid #16a34a", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#166534" }}>
//             🎉 Industry already approved! This will mark the MOU as <strong>Mutually Approved</strong>.
//           </div>
//         )}
//         <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
//           <button style={S.btnOutline} onClick={onClose}>Cancel</button>
//           <button style={type === "approve" ? S.btnApprove : S.btnReject} onClick={onConfirm}>
//             <Stamp size={14} />{type === "approve" ? " Confirm Approve" : " Confirm Reject"}
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   </div>
// );

// // ─── SMALL HELPERS ────────────────────────────────────────────────────────────
// const Section = ({ title, children }) => (
//   <div style={S.section}><div style={S.sectionTitle}>{title}</div>{children}</div>
// );
// const MouSection = ({ title, children }) => (
//   <div style={{ marginBottom: 16 }}>
//     <div style={{ fontWeight: 700, color: "#193648", fontSize: 13, marginBottom: 6, borderBottom: "1px solid #f1f5f9", paddingBottom: 4 }}>{title}</div>
//     <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{children}</div>
//   </div>
// );
// const FormField = ({ label, value, onChange, type = "text", placeholder = "", options = [] }) => (
//   <div style={{ marginBottom: 10 }}>
//     {label && <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4, fontWeight: 600 }}>{label}</label>}
//     {type === "textarea"
//       ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...S.input, height: 80, resize: "vertical" }} />
//       : type === "select"
//         ? <select value={value} onChange={e => onChange(e.target.value)} style={S.input}>{options.map(o => <option key={o} value={o}>{o || "Select..."}</option>)}</select>
//         : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={S.input} />
//     }
//   </div>
// );
// const StampBadge = ({ stamp, label }) => (
//   <div style={{ border: `2px solid ${stamp.type === "approve" ? "#16a34a" : "#dc2626"}`, borderRadius: 8, padding: "8px 14px", background: stamp.type === "approve" ? "#f0fdf4" : "#fef2f2" }}>
//     <div style={{ fontWeight: 800, fontSize: 12, color: stamp.type === "approve" ? "#16a34a" : "#dc2626" }}>{stamp.type === "approve" ? "✅ APPROVED" : "❌ REJECTED"} — {label}</div>
//     <div style={{ fontSize: 11, color: "#64748b" }}>By: {stamp.by} on {fmtDate(stamp.date)}</div>
//   </div>
// );
// const MeetingRow = ({ icon, label, val }) => (
//   <div style={{ display: "flex", gap: 6, marginBottom: 4, fontSize: 12 }}>
//     <span style={{ color: "#0284c7" }}>{icon}</span>
//     <span style={{ color: "#64748b", minWidth: 120 }}>{label}:</span>
//     <span style={{ color: "#193648", fontWeight: 600 }}>{val || "—"}</span>
//   </div>
// );

// // ═══════════════════════════════════════════════════════════════════════════════
// //  STYLES
// // ═══════════════════════════════════════════════════════════════════════════════
// const S = {
//   page:     { fontFamily: "'Segoe UI',sans-serif", minHeight: "100vh", background: "#f8fafc" },
//   topbar:   { background: "linear-gradient(135deg,#193648,#193648)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.2)", position: "relative", zIndex: 100 },
//   brand:    { display: "flex", alignItems: "center", gap: 10 },
//   brandText:{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: 0.5 },
//   brandSub: { color: "#93c5fd", fontSize: 12, borderLeft: "1px solid #3b6ea0", paddingLeft: 10, marginLeft: 4 },
//   topActions:{ display: "flex", alignItems: "center", gap: 12 },
//   alertChip:{ background: "#fef3c7", color: "#b45309", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 },
//   avatar:   { width: 34, height: 34, borderRadius: "50%", background: "#193648", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 },
//   notifBtn: { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center", position: "relative" },
//   notifDot: { position: "absolute", top: -6, right: -6, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
//   notifPanel:{ position: "absolute", right: 0, top: 44, width: 340, background: "#fff", borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0", maxHeight: 380, overflowY: "auto", zIndex: 200 },
//   notifPanelHeader:{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" },
//   clearBtn: { background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 12, fontWeight: 600 },
//   notifItem:{ padding: "10px 16px", borderBottom: "1px solid #f8fafc" },
//   body:     { padding: 24, maxWidth: 1400, margin: "0 auto" },
//   statsRow: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
//   statCard: { flex: 1, minWidth: 130, background: "#fff", borderRadius: 10, padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", borderLeft: "3px solid #e2e8f0" },
//   toolbar:  { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" },
//   searchBox:{ flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px" },
//   searchInput:{ flex: 1, border: "none", outline: "none", fontSize: 13, background: "transparent" },
//   filterBox:{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 12px" },
//   filterSel:{ border: "none", outline: "none", fontSize: 13, background: "transparent" },
//   createBtn:{ display: "flex", alignItems: "center", gap: 6, background: "#193648", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 },
//   cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 16 },
//   card:     { background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", transition: "all 0.2s" },
//   cardUrgent:{ borderLeft: "4px solid #7c3aed", background: "#fafaff" },
//   urgentStrip:{ background: "#f5f3ff", color: "#7c3aed", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, marginBottom: 8, display: "inline-block" },
//   cardTop:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
//   cardTitle:{ fontWeight: 700, color: "#193648", fontSize: 14, marginBottom: 3 },
//   cardMeta: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" },
//   changesBadge:{ display: "flex", alignItems: "center", gap: 5, background: "#f5f3ff", color: "#7c3aed", fontSize: 11, padding: "3px 10px", borderRadius: 6, marginBottom: 6, fontWeight: 600 },
//   cardFooter:{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
//   empty:    { textAlign: "center", padding: 60, color: "#94a3b8", fontSize: 15 },

//   btnOutline:        { display: "flex", alignItems: "center", gap: 5, background: "#fff", border: "1px solid #e2e8f0", color: "#374151", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
//   btnPrimary:        { display: "flex", alignItems: "center", gap: 5, background: "#193648", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
//   btnSend:           { display: "flex", alignItems: "center", gap: 5, background: "#0284c7", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
//   btnApprove:        { display: "flex", alignItems: "center", gap: 5, background: "#16a34a", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
//   btnReject:         { display: "flex", alignItems: "center", gap: 5, background: "#dc2626", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
//   btnMeeting:        { display: "flex", alignItems: "center", gap: 5, background: "#7c3aed", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
//   btnDanger:         { display: "flex", alignItems: "center", gap: 5, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "8px 10px", borderRadius: 7, cursor: "pointer" },
//   btnNotify:         { display: "flex", alignItems: "center", gap: 5, background: "#0ea5e9", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
//   btnIndustryApprove:{ display: "flex", alignItems: "center", gap: 5, background: "#059669", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 700, boxShadow: "0 2px 8px rgba(5,150,105,0.3)" },
//   btnDownload:       { display: "flex", alignItems: "center", gap: 5, background: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 700 },
//   btnResponse:       { display: "flex", alignItems: "center", gap: 5, background: "#0891b2", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
//   uploadBtn:         { display: "inline-flex", alignItems: "center", gap: 5, background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#374151", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 },

//   mouHeaderPreview:  { background: "linear-gradient(135deg,#f0f7ff,#e8f4fd)", border: "1px solid #bfdbfe", borderRadius: 14, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, boxShadow: "0 2px 12px rgba(30,58,95,0.07)" },
//   mouLogoBox:        { textAlign: "center", minWidth: 140, background: "#fff", borderRadius: 12, padding: "14px 20px", border: "1px solid #dbeafe", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
//   mouLogoIconWrap:   { width: 54, height: 54, borderRadius: 8, background: "#eef4fb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", border: "1px solid #c5d5e8", overflow: "hidden" },
//   mouLogoName:       { fontWeight: 800, color: "#193648", fontSize: 13 },
//   mouLogoSub:        { fontSize: 11, color: "#94a3b8", marginTop: 3 },
//   mouAgreementLabel: { fontWeight: 800, color: "#193648", fontSize: 15, marginTop: 8, textAlign: "center" },
//   mouAgreementSub:   { fontSize: 12, color: "#64748b", marginTop: 2, textAlign: "center" },

//   detailHeader:      { display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap", background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
//   backBtn:           { display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "1px solid #e2e8f0", color: "#64748b", padding: "7px 12px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" },
//   detailBody:        { display: "flex", gap: 16 },
//   detailLeft:        { flex: 1, minWidth: 0 },
//   sidebar:           { width: 300, flexShrink: 0, background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", maxHeight: "calc(100vh - 180px)", overflowY: "auto", position: "sticky", top: 16 },
//   sidebarTitle:      { fontWeight: 700, color: "#193648", fontSize: 13, marginBottom: 10, display: "flex", alignItems: "center", gap: 6, paddingBottom: 8, borderBottom: "1px solid #f1f5f9" },
//   sidebarEmpty:      { fontSize: 12, color: "#94a3b8", textAlign: "center", padding: 20 },
//   changeItem:        { background: "#f5f3ff", border: "1px solid #e9d5ff", borderRadius: 8, padding: "10px 12px", marginBottom: 8 },
//   timeline:          { paddingLeft: 4 },
//   timelineItem:      { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 },
//   timelineDot:       { width: 20, height: 20, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" },
//   downloadBanner:    { background: "linear-gradient(135deg,#dcfce7,#d1fae5)", border: "1px solid #86efac", borderRadius: 12, padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },

//   createBody:        { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
//   section:           { marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #f1f5f9" },
//   sectionTitle:      { fontWeight: 800, color: "#193648", fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 },
//   grid2:             { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 },
//   subLabel:          { fontWeight: 700, fontSize: 13, color: "#374151", display: "block", marginBottom: 8 },
//   listItem:          { display: "flex", gap: 8, marginBottom: 6, alignItems: "center" },
//   listInput:         { flex: 1, padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, outline: "none", fontFamily: "inherit" },
//   listRemove:        { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 6, padding: "5px 8px", cursor: "pointer" },
//   addRowBtn:         { background: "transparent", border: "1px dashed #cbd5e1", color: "#64748b", padding: "6px 14px", borderRadius: 7, cursor: "pointer", fontSize: 12, marginTop: 4 },
//   input:             { width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 7, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#fafafa" },
//   mouDoc:            { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 28, marginBottom: 16 },
//   mouDocTitle:       { textAlign: "center", fontWeight: 800, fontSize: 18, color: "#193648", letterSpacing: 1, marginBottom: 6 },
//   meetingCard:       { background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "12px 16px", marginBottom: 12 },
//   changesAlert:      { display: "flex", alignItems: "center", gap: 10, background: "#f5f3ff", border: "1px solid #e9d5ff", borderRadius: 10, padding: "10px 16px", marginBottom: 12 },
//   overlay:           { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
//   modal:             { background: "#fff", borderRadius: 14, width: "90%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
//   modalHeader:       { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f1f5f9" },
//   modalBody:         { padding: "16px 20px" },
// };

// export default MouManagement;



import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle, Search, Filter, X, Trash2, Eye, Send,
  CheckCircle, XCircle, Calendar, Clock, AlertTriangle,
  FileText, ChevronRight, Bell, User, Building2,
  MapPin, Coffee, Edit3, History, Stamp, ArrowLeft,
  Download, BellRing, CheckSquare, Upload, MessageSquare,
  ThumbsUp, ThumbsDown, RefreshCw, Vote
} from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/mous";

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS = {
  Draft:                    { color: "#64748b", bg: "#f1f5f9", label: "Draft" },
  "Sent to Industry":       { color: "#d97706", bg: "#fffbeb", label: "Sent to Industry" },
  "Changes Proposed":       { color: "#7c3aed", bg: "#f5f3ff", label: "Changes Proposed" },
  "Industry Responded":     { color: "#0891b2", bg: "#ecfeff", label: "Industry Responded" },
  "Approved by Industry":   { color: "#059669", bg: "#ecfdf5", label: "Approved by Industry" },
  "Approved by University": { color: "#0284c7", bg: "#e0f2fe", label: "Approved by Univ." },
  "Mutually Approved":      { color: "#16a34a", bg: "#dcfce7", label: "Mutually Approved ✓" },
  Rejected:                 { color: "#dc2626", bg: "#fef2f2", label: "Rejected" },
};

// ─── CHANGE LOG TYPES ─────────────────────────────────────────────────────────
const CHANGE_TYPES = {
  industry_change:    { color: "#7c3aed", bg: "#f5f3ff", icon: "🏭", label: "Industry Changed" },
  industry_approve:   { color: "#059669", bg: "#ecfdf5", icon: "✅", label: "Industry Approved" },
  industry_reject:    { color: "#dc2626", bg: "#fef2f2", icon: "❌", label: "Industry Rejected" },
  industry_response:  { color: "#0891b2", bg: "#ecfeff", icon: "💬", label: "Industry Response" },
  university_change:  { color: "#0284c7", bg: "#e0f2fe", icon: "🎓", label: "University Changed" },
  university_approve: { color: "#16a34a", bg: "#dcfce7", icon: "✅", label: "University Approved" },
  university_reject:  { color: "#dc2626", bg: "#fef2f2", icon: "❌", label: "University Rejected" },
  meeting_proposed:   { color: "#7c3aed", bg: "#f5f3ff", icon: "📅", label: "Meeting Proposed" },
  meeting_confirmed:  { color: "#16a34a", bg: "#dcfce7", icon: "🤝", label: "Meeting Confirmed" },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtDateTime = (d) => d ? new Date(d).toLocaleString("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const calcProgress = (s, e) => {
  const start = new Date(s), end = new Date(e), now = new Date();
  if (!start || !end || end <= start) return 100;
  return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.Draft;
  return (
    <span style={{ background: cfg.bg, color: cfg.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.3, border: `1px solid ${cfg.color}30` }}>
      {cfg.label}
    </span>
  );
};

// ─── SVG ICON COMPONENTS ──────────────────────────────────────────────────────
const UniSvg = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3L1 9L12 15L23 9L12 3Z" stroke="#193648" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M5 12V17C5 17 7.5 20 12 20C16.5 20 19 17 19 17V12" stroke="#193648" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M23 9V15" stroke="#193648" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IndustrySvg = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="7" width="20" height="15" rx="1" stroke="#193648" strokeWidth="1.8" />
    <path d="M6 7V4H18V7" stroke="#193648" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="9" y="14" width="6" height="8" stroke="#193648" strokeWidth="1.5" />
    <path d="M6 11H8M10 11H12M14 11H16M6 14H8" stroke="#193648" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

// ─── PROFESSIONAL CENTER DIVIDER ──────────────────────────────────────────────
const MouDivider = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
    <div style={{ width: 1, height: 16, background: "linear-gradient(to bottom,transparent,#193648)" }} />
    <div style={{ width: 40, height: 40, border: "2px solid #193648", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", boxShadow: "0 2px 10px rgba(30,58,95,0.14)" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="1" stroke="#193648" strokeWidth="1.7" />
        <rect x="13" y="3" width="8" height="8" rx="1" stroke="#193648" strokeWidth="1.7" />
        <rect x="3" y="13" width="8" height="8" rx="1" stroke="#193648" strokeWidth="1.7" />
        <rect x="13" y="13" width="8" height="8" rx="1" stroke="#193648" strokeWidth="1.7" />
      </svg>
    </div>
    <div style={{ width: 1, height: 16, background: "linear-gradient(to top,transparent,#193648)" }} />
    <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#7a8fa6", textTransform: "uppercase", fontWeight: 700, marginTop: 5 }}>MOU</div>
  </div>
);

// ─── LOGO DISPLAY ─────────────────────────────────────────────────────────────
const LogoDisplay = ({ src, fallback, size = 44 }) => (
  src
    ? <img src={src} alt="logo" style={{ width: size, height: size, objectFit: "contain", borderRadius: 4 }} />
    : <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>{fallback}</div>
);

// ─── LOGO UPLOAD FIELD ────────────────────────────────────────────────────────
const LogoUploadField = ({ label, value, onChange }) => {
  const ref = useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 56, height: 56, border: "1.5px dashed #c5d5e8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", overflow: "hidden", flexShrink: 0 }}>
          {value ? <img src={value} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <Upload size={18} color="#94a3b8" />}
        </div>
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
            <button type="button" style={S.uploadBtn} onClick={() => ref.current.click()}>
              <Upload size={12} /> {value ? "Change" : "Upload Logo"}
            </button>
            {value && (
              <button type="button" style={{ ...S.uploadBtn, background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }} onClick={() => onChange("")}>Remove</button>
            )}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>PNG or JPG recommended</div>
        </div>
        <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      </div>
    </div>
  );
};

// ─── NOTIFICATION SYSTEM ──────────────────────────────────────────────────────
const NotificationContext = React.createContext(null);
const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const addNotification = (msg, type = "info") => {
    const id = Date.now();
    setNotifications(n => [...n, { id, msg, type }]);
    setTimeout(() => setNotifications(n => n.filter(x => x.id !== id)), 5000);
  };
  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
      <div style={{ position: "fixed", top: 70, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
              style={{ background: n.type === "success" ? "#dcfce7" : n.type === "error" ? "#fef2f2" : "#eff6ff", border: `1px solid ${n.type === "success" ? "#86efac" : n.type === "error" ? "#fca5a5" : "#93c5fd"}`, color: n.type === "success" ? "#166534" : n.type === "error" ? "#991b1b" : "#1e40af", padding: "10px 16px", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, maxWidth: 320 }}>
              {n.type === "success" ? <CheckCircle size={15} /> : <BellRing size={15} />}
              {n.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
const useNotify = () => React.useContext(NotificationContext);

// ═══════════════════════════════════════════════════════════════════════════════
//  PDF GENERATOR — Fixed: images properly embedded as base64
// ═══════════════════════════════════════════════════════════════════════════════
const generateMouPdf = (mou) => {
  let n = 1;
  const sec = (t) => `${n++}. ${t.toUpperCase()}`;
  const refNo = `MOU-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

  // FIX: Images are already base64 from FileReader, use them directly
  // base64 images: NO crossorigin attr (breaks data: URIs), assign to JS vars first
  // Safely get base64 src — ensure data: prefix is present
  const _rawUni = mou.universityLogo || "";
  const _rawInd = mou.industryLogo || "";
  // base64 from FileReader always starts with "data:image/..."
  // If stored in DB it may be truncated — check and use placeholder if so
  const _uniSrc = _rawUni.startsWith("data:") ? _rawUni : (_rawUni.length > 100 ? "data:image/png;base64," + _rawUni : "");
  const _indSrc = _rawInd.startsWith("data:") ? _rawInd : (_rawInd.length > 100 ? "data:image/png;base64," + _rawInd : "");

  const _uniSvg = `<svg width="44" height="44" viewBox="0 0 24 24" fill="none"><path d="M12 3L1 9L12 15L23 9L12 3Z" stroke="#193648" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 12V17C5 17 7.5 20 12 20C16.5 20 19 17 19 17V12" stroke="#193648" stroke-width="1.8" stroke-linecap="round"/><path d="M23 9V15" stroke="#193648" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  const _indSvg = `<svg width="44" height="44" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="15" rx="1" stroke="#193648" stroke-width="1.8"/><path d="M6 7V4H18V7" stroke="#193648" stroke-width="1.8" stroke-linecap="round"/><rect x="9" y="14" width="6" height="8" stroke="#193648" stroke-width="1.5"/><path d="M6 11H8M10 11H12M14 11H16" stroke="#193648" stroke-width="1.3" stroke-linecap="round"/></svg>`;

  const uniLogoHtml = _uniSrc
    ? `<img src="${_uniSrc}" style="width:64px;height:64px;object-fit:contain;display:block;border-radius:4px;" />`
    : _uniSvg;

  const indLogoHtml = _indSrc
    ? `<img src="${_indSrc}" style="width:64px;height:64px;object-fit:contain;display:block;border-radius:4px;" />`
    : _indSvg;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${refNo} — ${mou.title || "MOU"}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant+Garamond:wght@500;600;700&display=swap');
  @page { size:A4; margin:0; }
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'EB Garamond',Georgia,serif;color:#1a2340;background:#fff;font-size:13.5px;line-height:1.8;}
  .page{width:794px;min-height:1122px;margin:0 auto;position:relative;}
  .frame-outer{position:absolute;inset:14px;border:2.5px solid #193648;pointer-events:none;}
  .frame-inner{position:absolute;inset:21px;border:0.75px solid #a8bcd4;pointer-events:none;}
  .corner{position:absolute;width:20px;height:20px;}
  .corner.tl{top:9px;left:9px;border-top:2.5px solid #193648;border-left:2.5px solid #193648;}
  .corner.tr{top:9px;right:9px;border-top:2.5px solid #193648;border-right:2.5px solid #193648;}
  .corner.bl{bottom:9px;left:9px;border-bottom:2.5px solid #193648;border-left:2.5px solid #193648;}
  .corner.br{bottom:9px;right:9px;border-bottom:2.5px solid #193648;border-right:2.5px solid #193648;}
  .topbar{height:7px;background:#193648;margin:14px 14px 0;}
  .content{padding:42px 58px 40px;position:relative;z-index:1;}
  .logo-row{display:flex;justify-content:space-between;align-items:center;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #c0cedc;}
  .entity{display:flex;align-items:center;gap:13px;}
  .entity.right{flex-direction:row-reverse;}
  .logo-box{width:72px;height:72px;border:1.5px solid #c0cedc;border-radius:6px;background:#f4f7fb;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;padding:2px;}
  .logo-box img{max-width:68px;max-height:68px;width:auto;height:auto;object-fit:contain;display:block;}
  .entity-text{line-height:1.35;}
  .entity-text.right{text-align:right;}
  .entity-tag{font-size:8.5px;letter-spacing:2.5px;color:#8a9db5;text-transform:uppercase;font-weight:700;}
  .entity-name{font-family:'Cormorant Garamond',serif;font-size:14.5px;font-weight:700;color:#193648;max-width:195px;}
  .center-divider{display:flex;flex-direction:column;align-items:center;gap:3px;padding:0 20px;}
  .d-line{width:1px;height:18px;}
  .d-line.t{background:linear-gradient(to bottom,transparent,rgba(30,58,95,0.5));}
  .d-line.b{background:linear-gradient(to top,transparent,rgba(30,58,95,0.5));}
  .d-circle{width:44px;height:44px;border:2px solid #193648;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(30,58,95,0.13);}
  .d-label{font-size:7.5px;letter-spacing:3px;color:#8a9db5;text-transform:uppercase;font-weight:700;margin-top:5px;}
  .title-block{text-align:center;padding:16px 0 14px;}
  .doc-eyebrow{font-size:9px;letter-spacing:4px;color:#8a9db5;text-transform:uppercase;font-weight:700;margin-bottom:8px;}
  .doc-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:#193648;letter-spacing:1.5px;line-height:1.1;}
  .doc-sub{font-size:12px;color:#8a9db5;margin-top:8px;font-style:italic;}
  .approved-row{text-align:center;margin:10px 0 18px;}
  .approved-seal{display:inline-flex;align-items:center;gap:11px;border:1.8px solid #15803d;color:#15803d;padding:5px 24px;font-size:10.5px;font-weight:700;letter-spacing:3px;text-transform:uppercase;}
  .seal-dot{width:6px;height:6px;background:#15803d;border-radius:50%;}
  .hr-bold{border:none;border-top:1.8px solid #193648;margin:14px 0;}
  .hr{border:none;border-top:0.75px solid #c0cedc;margin:12px 0;}
  .section{margin-bottom:17px;}
  .sec-title{font-family:'Cormorant Garamond',serif;font-size:12px;font-weight:700;color:#193648;letter-spacing:1.8px;text-transform:uppercase;border-left:3px solid #193648;padding:1px 0 1px 10px;margin-bottom:9px;}
  p{margin-bottom:5px;color:#2d3748;font-size:13px;}
  ul,ol{padding-left:22px;color:#2d3748;}
  li{margin-bottom:3px;font-size:13px;}
  .ptable{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px;}
  .ptable .h td{background:#eef3f8;font-weight:700;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#193648;padding:7px 14px;border:1px solid #c0cedc;}
  .ptable .b td{padding:11px 14px;border:1px solid #c0cedc;vertical-align:top;}
  .p-name{font-size:13px;font-weight:600;color:#193648;margin-bottom:4px;}
  .p-info{font-size:11.5px;color:#5a6a7e;line-height:1.6;}
  .sig-row{display:flex;gap:40px;margin-top:34px;}
  .sig-box{flex:1;}
  .sig-lbl{font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#a0adb8;font-weight:700;margin-bottom:4px;}
  .sig-line{border-bottom:1px solid #193648;height:44px;margin-bottom:6px;}
  .sig-name{font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700;color:#193648;}
  .sig-org{font-size:11px;color:#7a8fa6;margin-top:1px;}
  .sig-date{font-size:10.5px;color:#a0adb8;margin-top:8px;}
  .doc-footer{margin-top:26px;padding-top:10px;border-top:1px solid #c0cedc;display:flex;justify-content:space-between;font-size:10px;color:#a0adb8;font-style:italic;}
  .watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-38deg);font-family:'Cormorant Garamond',serif;font-size:96px;font-weight:700;color:rgba(30,58,95,0.036);letter-spacing:6px;white-space:nowrap;pointer-events:none;z-index:0;}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
</style>
</head>
<body>
<div class="page">
  <div class="watermark">AGREEMENT</div>
  <div class="topbar"></div>
  <div class="frame-outer"></div>
  <div class="frame-inner"></div>
  <div class="corner tl"></div><div class="corner tr"></div>
  <div class="corner bl"></div><div class="corner br"></div>
  <div class="content">

    <div class="logo-row">
      <div class="entity">
        <div class="logo-box">${uniLogoHtml}</div>
        <div class="entity-text">
          <div class="entity-tag">University</div>
          <div class="entity-name">${mou.university}</div>
        </div>
      </div>
      <div class="center-divider">
        <div class="d-line t"></div>
        <div class="d-circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="8" height="8" rx="1" stroke="#193648" stroke-width="1.7"/>
            <rect x="13" y="3" width="8" height="8" rx="1" stroke="#193648" stroke-width="1.7"/>
            <rect x="3" y="13" width="8" height="8" rx="1" stroke="#193648" stroke-width="1.7"/>
            <rect x="13" y="13" width="8" height="8" rx="1" stroke="#193648" stroke-width="1.7"/>
          </svg>
        </div>
        <div class="d-line b"></div>
        <div class="d-label">Agreement</div>
      </div>
      <div class="entity right">
        <div class="logo-box">${indLogoHtml}</div>
        <div class="entity-text right">
          <div class="entity-tag">Industry Partner</div>
          <div class="entity-name">${mou.industry}</div>
        </div>
      </div>
    </div>

    <div class="title-block">
      <div class="doc-eyebrow">Official Document</div>
      <div class="doc-title">Memorandum of Understanding</div>
      <div class="doc-sub">Ref. No.: ${refNo} &nbsp;·&nbsp; Dated: ${fmtDate(new Date().toISOString())} &nbsp;·&nbsp; Type: ${mou.collaborationType}</div>
    </div>

    <div class="approved-row">
      <div class="approved-seal"><span class="seal-dot"></span> Mutually Approved &amp; Executed <span class="seal-dot"></span></div>
    </div>

    <hr class="hr-bold"/>

    <div class="section">
      <div class="sec-title">${sec("Parties to This Agreement")}</div>
      <table class="ptable">
        <tr class="h"><td>First Party — University</td><td>Second Party — Industry Partner</td></tr>
        <tr class="b">
          <td>
            <div class="p-name">${mou.university}</div>
            <div class="p-info">
              ${mou.universityContact?.name ? `Contact: ${mou.universityContact.name}<br/>` : ""}
              ${mou.universityContact?.designation ? `Designation: ${mou.universityContact.designation}<br/>` : ""}
              ${mou.universityContact?.email ? `Email: ${mou.universityContact.email}<br/>` : ""}
              Signatory: <em>${mou.signatories?.university || "University Authority"}</em>
            </div>
          </td>
          <td>
            <div class="p-name">${mou.industry}</div>
            <div class="p-info">
              ${mou.industryContact?.name ? `Contact: ${mou.industryContact.name}<br/>` : ""}
              ${mou.industryContact?.designation ? `Designation: ${mou.industryContact.designation}<br/>` : ""}
              ${mou.industryContact?.email ? `Email: ${mou.industryContact.email}<br/>` : ""}
              Signatory: <em>${mou.signatories?.industry || "Industry Authority"}</em>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <div class="section">
      <div class="sec-title">${sec("Purpose and Scope")}</div>
      <p>${mou.description || "This Memorandum of Understanding establishes a formal framework for collaboration between the parties."}</p>
    </div>

    <div class="section">
      <div class="sec-title">${sec("Nature of Collaboration")}</div>
      <p>The nature of collaboration under this MOU is classified as: <strong>${mou.collaborationType}</strong>.</p>
    </div>

    <div class="section">
      <div class="sec-title">${sec("Duration and Validity")}</div>
      <p>This MOU shall come into force on <strong>${fmtDate(mou.startDate)}</strong> and shall remain valid until <strong>${fmtDate(mou.endDate)}</strong>, unless extended or terminated earlier by mutual written consent.</p>
    </div>

    ${mou.objectives?.filter(Boolean).length > 0 ? `
    <div class="section">
      <div class="sec-title">${sec("Objectives")}</div>
      <ul>${mou.objectives.filter(Boolean).map(o => `<li>${o}</li>`).join("")}</ul>
    </div>` : ""}

    ${(mou.responsibilities?.university?.filter(Boolean).length > 0 || mou.responsibilities?.industry?.filter(Boolean).length > 0) ? `
    <div class="section">
      <div class="sec-title">${sec("Roles and Responsibilities")}</div>
      ${mou.responsibilities?.university?.filter(Boolean).length > 0 ? `<p style="margin-bottom:4px;"><strong>${mou.university}:</strong></p><ul style="margin-bottom:10px;">${mou.responsibilities.university.filter(Boolean).map(r => `<li>${r}</li>`).join("")}</ul>` : ""}
      ${mou.responsibilities?.industry?.filter(Boolean).length > 0 ? `<p style="margin-bottom:4px;"><strong>${mou.industry}:</strong></p><ul>${mou.responsibilities.industry.filter(Boolean).map(r => `<li>${r}</li>`).join("")}</ul>` : ""}
    </div>` : ""}

    ${mou.terms?.filter(Boolean).length > 0 ? `
    <div class="section">
      <div class="sec-title">${sec("Terms and Conditions")}</div>
      <ol>${mou.terms.filter(Boolean).map(t => `<li>${t}</li>`).join("")}</ol>
    </div>` : ""}

    <div class="section">
      <div class="sec-title">${sec("General Provisions")}</div>
      <p>This MOU does not create legally binding financial obligations unless a formal agreement is subsequently executed. Either party may terminate with thirty (30) days' written notice. Amendments require mutual written consent. This MOU shall be governed by the applicable laws of Pakistan.</p>
    </div>

    <hr class="hr-bold"/>

    <div class="sec-title" style="margin-bottom:10px;">${sec("Execution and Authentication")}</div>
    <p style="font-size:12px;color:#5a6a7e;margin-bottom:6px;">In witness whereof, the duly authorized representatives of both parties have signed this MOU on the date first written above.</p>

    <div class="sig-row">
      <div class="sig-box">
        <div class="sig-lbl">Authorized Signatory — First Party</div>
        <div class="sig-line"></div>
        <div class="sig-name">${mou.signatories?.university || "University Authority"}</div>
        <div class="sig-org">${mou.university}</div>
        <div class="sig-date">Date: ${mou.universityStamp ? fmtDate(mou.universityStamp.date) : "____________________"}</div>
      </div>
      <div class="sig-box">
        <div class="sig-lbl">Authorized Signatory — Second Party</div>
        <div class="sig-line"></div>
        <div class="sig-name">${mou.signatories?.industry || "Industry Authority"}</div>
        <div class="sig-org">${mou.industry}</div>
        <div class="sig-date">Date: ${mou.industryStamp ? fmtDate(mou.industryStamp.date) : "____________________"}</div>
      </div>
    </div>

    <div class="doc-footer">
      <span>MOU Portal — University Administration System</span>
      <span>Ref: ${refNo}</span>
      <span>Generated: ${new Date().toLocaleDateString("en-PK", { day: "2-digit", month: "long", year: "numeric" })}</span>
    </div>

  </div>
</div>
</body>
</html>`;

  // Use Blob URL — avoids document.write() truncation of large base64 strings
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const blobUrl = URL.createObjectURL(blob);
  const printWindow = window.open(blobUrl, "_blank", "width=900,height=700");
  if (!printWindow) { alert("Please allow popups for PDF generation."); return; }
  printWindow.addEventListener("load", () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    }, 600);
  });
};

// ═══════════════════════════════════════════════════════════════════════════════
//  CHANGE LOG HELPER — add entry to change log
// ═══════════════════════════════════════════════════════════════════════════════
const addChangeLogEntry = (mou, type, data = {}) => {
  const entry = {
    id: Date.now(),
    type,
    date: new Date().toISOString(),
    ...data,
  };
  return [...(mou.changeLog || []), entry];
};

// ─── BUILD PAYLOAD — safe explicit fields (avoids spread issues with large base64) ──
const buildPayload = (mou) => ({
  title:              mou.title,
  university:         mou.university,
  industry:           mou.industry,
  collaborationType:  mou.collaborationType,
  startDate:          mou.startDate,
  endDate:            mou.endDate,
  description:        mou.description,
  objectives:         mou.objectives,
  responsibilities:   mou.responsibilities,
  terms:              mou.terms,
  signatories:        mou.signatories,
  universityContact:  mou.universityContact,
  industryContact:    mou.industryContact,
  universityLogo:     mou.universityLogo,
  industryLogo:       mou.industryLogo,
  status:             mou.status,
  universityStamp:    mou.universityStamp,
  industryStamp:      mou.industryStamp,
  sentAt:             mou.sentAt,
  industryResponseAt: mou.industryResponseAt,
  proposedChanges:    mou.proposedChanges || [],
  changeLog:          mou.changeLog       || [],
});

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const MouManagement = () => (
  <NotificationProvider><MouApp /></NotificationProvider>
);

const MouApp = () => {
  const { addNotification } = useNotify();
  const [view, setView]             = useState("list");
  const [mous, setMous]             = useState([]);
  const [selected, setSelected]     = useState(null);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading]       = useState(true);
  const [meetingModal, setMeetingModal]       = useState(false);
  const [approveModal, setApproveModal]       = useState(false);
  const [responseModal, setResponseModal]     = useState(false);
  const [industryMeetingModal, setIndustryMeetingModal] = useState(false); // Industry proposes/edits slot
  const [stampType, setStampType]   = useState("");
  const [notifPanel, setNotifPanel] = useState(false);
  const [notifLog, setNotifLog]     = useState([]);

  useEffect(() => { fetchMous(); }, []);

  const fetchMous = async () => {
    try { setLoading(true); const res = await axios.get(API_URL); setMous(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const pushNotif = (msg, type = "info") => {
    addNotification(msg, type);
    setNotifLog(l => [{ msg, type, time: new Date() }, ...l.slice(0, 19)]);
  };

  const filtered = mous.filter(m => {
    const q = search.toLowerCase();
    const matchQ = !q || m.university?.toLowerCase().includes(q) || m.industry?.toLowerCase().includes(q) || m.title?.toLowerCase().includes(q);
    return matchQ && (filterStatus === "All" || m.status === filterStatus);
  });

  const expiringSoon = mous.filter(m => {
    const diff = (new Date(m.endDate) - new Date()) / 86400000;
    return diff > 0 && diff <= 30;
  });

  const openDetail = (mou) => { setSelected(mou); setView("detail"); };
  const goBack = () => { setSelected(null); setView("list"); };

  const handleSend = async () => {
    if (!selected || !window.confirm(`Send this MOU to ${selected.industry}?`)) return;
    try {
      const changeLog = addChangeLogEntry(selected, "industry_response", {
        party: "University",
        action: "MOU Sent",
        message: `MOU sent to ${selected.industry} for review`,
      });
      const res = await axios.put(`${API_URL}/${selected._id}`, {
        ...buildPayload(selected), status: "Sent to Industry", sentAt: new Date().toISOString(), changeLog,
      });
      updateLocal(res.data);
      pushNotif(`MOU sent to ${selected.industry} successfully!`, "success");
    } catch { pushNotif("Error sending MOU", "error"); }
  };

  // NEW: Handle industry response (the response button)
  const handleIndustryResponse = async (responseData) => {
    if (!selected) return;
    try {
      const logType = responseData.type === "accept" ? "industry_approve"
        : responseData.type === "reject" ? "industry_reject"
        : responseData.type === "change" ? "industry_change"
        : "industry_response";

      const changeLog = addChangeLogEntry(selected, logType, {
        party: "Industry",
        from: selected.industry,
        message: responseData.message,
      });

      let newStatus = selected.status;
      if (responseData.type === "accept") newStatus = "Approved by Industry";
      else if (responseData.type === "reject") newStatus = "Rejected";
      else if (responseData.type === "change") newStatus = "Changes Proposed";
      else newStatus = "Industry Responded";

      const industryStamp = responseData.type === "accept"
        ? { by: selected.industry, type: "approve", date: new Date().toISOString() }
        : selected.industryStamp;

      const updatePayload = {
        title:              selected.title,
        university:         selected.university,
        industry:           selected.industry,
        collaborationType:  selected.collaborationType,
        startDate:          selected.startDate,
        endDate:            selected.endDate,
        description:        selected.description,
        objectives:         selected.objectives,
        responsibilities:   selected.responsibilities,
        terms:              selected.terms,
        signatories:        selected.signatories,
        universityContact:  selected.universityContact,
        industryContact:    selected.industryContact,
        universityLogo:     selected.universityLogo,
        industryLogo:       selected.industryLogo,
        universityStamp:    selected.universityStamp,
        scheduledMeeting:   selected.scheduledMeeting,
        sentAt:             selected.sentAt,
        status:             newStatus,
        changeLog,
        industryStamp,
        industryResponseAt: new Date().toISOString(),
        proposedChanges: responseData.changes
          ? [...(selected.proposedChanges || []), ...responseData.changes]
          : (selected.proposedChanges || []),
      };

      const res = await axios.put(`${API_URL}/${selected._id}`, updatePayload);
      updateLocal(res.data);
      setResponseModal(false);

      if (responseData.type === "accept") {
        pushNotif(`🎉 ${selected.industry} has approved the MOU!`, "success");
        setTimeout(() => pushNotif("University notified of industry approval.", "info"), 1200);
      } else if (responseData.type === "reject") {
        pushNotif(`${selected.industry} rejected the MOU.`, "error");
      } else if (responseData.type === "change") {
        pushNotif(`${selected.industry} proposed changes to the MOU.`, "info");
      } else {
        pushNotif(`${selected.industry} sent a response/comment.`, "info");
      }
    } catch (err) {
      console.error("Industry response error:", err?.response?.data || err.message);
      pushNotif(`Error: ${err?.response?.data?.message || err.message || "Could not save response"}`, "error");
    }
  };

  const handleApproveReject = async (type) => {
    if (!selected) return;
    const stamp = { by: "University Admin", type, date: new Date().toISOString() };
    try {
      const isMutual = type === "approve" && selected.status === "Approved by Industry";
      const newStatus = isMutual ? "Mutually Approved" : (type === "approve" ? "Approved by University" : "Rejected");

      const changeLog = addChangeLogEntry(selected, type === "approve" ? "university_approve" : "university_reject", {
        party: "University",
        action: type === "approve" ? "Approved" : "Rejected",
        message: isMutual ? "University approved — MOU is now Mutually Approved" : `University ${type === "approve" ? "approved" : "rejected"} the MOU`,
      });

      const res = await axios.put(`${API_URL}/${selected._id}`, {
        ...buildPayload(selected), status: newStatus, universityStamp: stamp, changeLog,
      });
      updateLocal(res.data); setApproveModal(false);

      if (isMutual) pushNotif("🎉 Mutually Approved! PDF download available.", "success");
      else if (type === "approve") {
        pushNotif("MOU approved by University.", "success");
        setTimeout(() => pushNotif(`Notification sent to ${selected.industry} — University approved.`, "info"), 1200);
      } else {
        pushNotif("MOU rejected. Industry will be notified.", "error");
      }
    } catch { pushNotif("Error updating status", "error"); }
  };

  const handleIndustryApprove = async () => {
    if (!selected) return;
    const stamp = { by: selected.industry, type: "approve", date: new Date().toISOString() };
    try {
      const isMutual = selected.status === "Approved by University";
      const changeLog = addChangeLogEntry(selected, "industry_approve", {
        party: "Industry",
        from: selected.industry,
        message: isMutual ? `${selected.industry} approved — MOU is now Mutually Approved` : `${selected.industry} has approved the MOU`,
      });
      const res = await axios.put(`${API_URL}/${selected._id}`, {
        ...buildPayload(selected),
        status: isMutual ? "Mutually Approved" : "Approved by Industry",
        industryStamp: stamp, industryResponseAt: new Date().toISOString(), changeLog,
      });
      updateLocal(res.data);
      if (isMutual) pushNotif("🎉 Both parties approved! MOU is Mutually Approved.", "success");
      else { pushNotif(`${selected.industry} has approved the MOU!`, "success"); setTimeout(() => pushNotif("University notified of industry approval.", "info"), 1200); }
    } catch { pushNotif("Error processing industry approval", "error"); }
  };

  // ── University saves meeting (with options or single slot) ──
  const handleMeetingSave = async (meetingData) => {
    if (!selected) return;
    try {
      // Fresh meeting object — no confirmedSlot, no industryProposedSlot
      const freshMeeting = {
        venue:       meetingData.venue,
        agenda:      meetingData.agenda,
        menu:        meetingData.menu        || "",
        attendees:   meetingData.attendees   || "",
        options:     meetingData.options     || [],
        date:        meetingData.date        || "",
        time:        meetingData.time        || "",
        confirmedSlot:        null,
        confirmedAt:          null,
        industryProposedSlot: null,
        industryProposedAt:   null,
      };
      const changeLog = addChangeLogEntry(selected, "meeting_proposed", {
        party:   "University",
        message: meetingData.options?.length
          ? `University proposed ${meetingData.options.length} meeting time options`
          : `University proposed meeting: ${meetingData.date} at ${meetingData.time}`,
      });
      const res = await axios.put(`${API_URL}/${selected._id}`, {
        ...buildPayload(selected),
        scheduledMeeting: freshMeeting,
        changeLog,
      });
      // Force local state to have the freshMeeting
      updateLocal({ ...res.data, scheduledMeeting: freshMeeting });
      setMeetingModal(false);
      pushNotif("Meeting schedule sent to industry!", "success");
      setTimeout(() => pushNotif(`${selected.industry} notified of meeting options.`, "info"), 1000);
    } catch (err) {
      console.error(err);
      pushNotif("Error saving meeting", "error");
    }
  };

  // ── Industry selects one of university's options → IMMEDIATE confirm ──
  const handleIndustryMeetingSelect = async (opt) => {
    if (!selected) return;
    const slot = { date: opt.date || "", time: opt.time || "", note: opt.note || "" };
    const now  = new Date().toISOString();
    try {
      const updatedMeeting = {
        ...selected.scheduledMeeting,
        confirmedSlot:        slot,
        confirmedAt:          now,
        industryProposedSlot: null,
        industryProposedAt:   null,
      };
      const changeLog = addChangeLogEntry(selected, "meeting_confirmed", {
        party:   "Industry",
        from:    selected.industry,
        message: `${selected.industry} confirmed meeting: ${slot.date} at ${slot.time}`,
      });
      const res = await axios.put(`${API_URL}/${selected._id}`, {
        ...buildPayload(selected),
        scheduledMeeting: updatedMeeting,
        changeLog,
      });
      // Always force confirmedSlot in local state
      updateLocal({
        ...res.data,
        scheduledMeeting: { ...(res.data.scheduledMeeting || selected.scheduledMeeting || {}), confirmedSlot: slot, confirmedAt: now, industryProposedSlot: null },
      });
      pushNotif(`🤝 Meeting confirmed: ${slot.date} at ${slot.time}!`, "success");
    } catch (err) {
      console.error(err);
      pushNotif(`Error: ${err?.response?.data?.message || err.message}`, "error");
    }
  };

  // ── Industry proposes their own custom slot → pending university confirm ──
  const handleIndustryProposeMeeting = async (slotData) => {
    if (!selected) return;
    const proposal = { date: slotData.date || "", time: slotData.time || "", note: slotData.note || "" };
    const now = new Date().toISOString();
    try {
      const updatedMeeting = {
        ...selected.scheduledMeeting,
        industryProposedSlot: proposal,
        industryProposedAt:   now,
        confirmedSlot:        null,
        confirmedAt:          null,
      };
      const changeLog = addChangeLogEntry(selected, "meeting_proposed", {
        party:   "Industry",
        from:    selected.industry,
        message: `${selected.industry} proposed slot: ${proposal.date} at ${proposal.time}`,
      });
      const res = await axios.put(`${API_URL}/${selected._id}`, {
        ...buildPayload(selected),
        scheduledMeeting: updatedMeeting,
        changeLog,
      });
      updateLocal({
        ...res.data,
        scheduledMeeting: { ...(res.data.scheduledMeeting || selected.scheduledMeeting || {}), industryProposedSlot: proposal, industryProposedAt: now, confirmedSlot: null, confirmedAt: null },
      });
      setIndustryMeetingModal(false);
      pushNotif(`${selected.industry} proposed: ${proposal.date} at ${proposal.time}`, "info");
      setTimeout(() => pushNotif("University notified of industry's proposed slot.", "info"), 1000);
    } catch (err) {
      console.error(err);
      pushNotif(`Error: ${err?.response?.data?.message || err.message}`, "error");
    }
  };

  // ── University confirms industry's proposed slot → CONFIRMED ──
  const handleUniversityConfirmIndustrySlot = async () => {
    if (!selected?.scheduledMeeting?.industryProposedSlot?.date) return;
    const slot = {
      date: selected.scheduledMeeting.industryProposedSlot.date,
      time: selected.scheduledMeeting.industryProposedSlot.time,
      note: selected.scheduledMeeting.industryProposedSlot.note || "",
    };
    const now = new Date().toISOString();
    try {
      const updatedMeeting = {
        ...selected.scheduledMeeting,
        confirmedSlot:        slot,
        confirmedAt:          now,
        industryProposedSlot: null,
        industryProposedAt:   null,
      };
      const changeLog = addChangeLogEntry(selected, "meeting_confirmed", {
        party:   "University",
        message: `Both parties confirmed meeting: ${slot.date} at ${slot.time}`,
      });
      const res = await axios.put(`${API_URL}/${selected._id}`, {
        ...buildPayload(selected),
        scheduledMeeting: updatedMeeting,
        changeLog,
      });
      updateLocal({
        ...res.data,
        scheduledMeeting: { ...(res.data.scheduledMeeting || selected.scheduledMeeting || {}), confirmedSlot: slot, confirmedAt: now, industryProposedSlot: null },
      });
      pushNotif("🎉 Meeting confirmed by both parties!", "success");
    } catch (err) {
      console.error(err);
      pushNotif(`Error: ${err?.response?.data?.message || err.message}`, "error");
    }
  };

    const handleSendAfterApprove = () => {
    if (!selected) return;
    pushNotif(`Re-sent MOU notification to ${selected.industry} with current approval status.`, "success");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this MOU?")) return;
    await axios.delete(`${API_URL}/${id}`);
    setMous(s => s.filter(m => m._id !== id));
    if (view === "detail") goBack();
  };

  const simulateIndustryChange = async () => {
    if (!selected) return;
    try {
      const changeLog = addChangeLogEntry(selected, "industry_change", {
        party: "Industry",
        from: selected.industry,
        field: "Duration",
        oldValue: fmtDate(selected.endDate),
        newValue: "Extended by 6 months",
        reason: "Project scope expanded",
      });
      const res = await axios.put(`${API_URL}/${selected._id}`, {
        ...buildPayload(selected), status: "Changes Proposed",
        proposedChanges: [...(selected.proposedChanges || []), { field: "Duration", oldValue: fmtDate(selected.endDate), newValue: "Extended by 6 months", reason: "Project scope expanded", date: new Date().toISOString() }],
        industryResponseAt: new Date().toISOString(), changeLog,
      });
      updateLocal(res.data);
      pushNotif(`${selected.industry} has proposed changes to the MOU!`, "info");
    } catch { pushNotif("Error simulating change", "error"); }
  };

  const updateLocal = (updated) => {
    setMous(s => s.map(m => m._id === updated._id ? updated : m));
    setSelected(updated);
  };

  return (
    <div style={S.page}>
      <div style={S.topbar}>
        <div style={S.brand}>
          <FileText size={20} color="#fff" />
          <span style={S.brandText}>MOU</span>
          <span style={S.brandSub}>Industry Liaison Incharge</span>
        </div>
        <div style={S.topActions}>
          {expiringSoon.length > 0 && <div style={S.alertChip}><Bell size={13} /> {expiringSoon.length} expiring soon</div>}
          <div style={{ position: "relative" }}>
            <motion.button whileHover={{ scale: 1.05 }} style={S.notifBtn} onClick={() => setNotifPanel(p => !p)}>
              <Bell size={16} color="#fff" />
              {notifLog.length > 0 && <span style={S.notifDot}>{notifLog.length > 9 ? "9+" : notifLog.length}</span>}
            </motion.button>
            <AnimatePresence>
              {notifPanel && (
                <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} style={S.notifPanel}>
                  <div style={S.notifPanelHeader}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#193648" }}>Notifications</span>
                    {notifLog.length > 0 && <button style={S.clearBtn} onClick={() => setNotifLog([])}>Clear all</button>}
                  </div>
                  {notifLog.length === 0
                    ? <div style={{ padding: 20, color: "#94a3b8", fontSize: 13, textAlign: "center" }}>No notifications yet</div>
                    : notifLog.map((n, i) => (
                      <div key={i} style={S.notifItem}>
                        <div style={{ fontSize: 13, color: "#193648" }}>{n.msg}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{n.time?.toLocaleTimeString()}</div>
                      </div>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div style={S.avatar}>CX</div>
        </div>
      </div>

      <div style={S.body}>
        {view === "list" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={S.statsRow}>
              {[
                { label: "Total MOUs",        val: mous.length,                                                                              color: "#193648" },
                { label: "Ongoing",           val: mous.filter(m => new Date(m.endDate) > new Date()).length,                                  color: "#0284c7" },
                { label: "Pending Review",    val: mous.filter(m => ["Changes Proposed", "Approved by Industry", "Industry Responded"].includes(m.status)).length, color: "#7c3aed" },
                { label: "Expiring Soon",     val: expiringSoon.length,                                                                        color: "#d97706" },
                { label: "Mutually Approved", val: mous.filter(m => m.status === "Mutually Approved").length,                                  color: "#16a34a" },
              ].map((s, i) => (
                <div key={i} style={S.statCard}>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
            <div style={S.toolbar}>
              <div style={S.searchBox}>
                <Search size={15} color="#94a3b8" />
                <input style={S.searchInput} placeholder="Search by name, industry, title..." value={search} onChange={e => setSearch(e.target.value)} />
                {search && <X size={14} style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
              </div>
              <div style={S.filterBox}>
                <Filter size={14} color="#64748b" />
                <select style={S.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option>All</option>
                  {Object.keys(STATUS).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={S.createBtn} onClick={() => setView("create")}>
                <PlusCircle size={15} /> Create MOU
              </motion.button>
            </div>
            {loading ? <div style={S.empty}>Loading MOUs...</div>
              : filtered.length === 0 ? <div style={S.empty}>No MOUs found. Create one!</div>
                : <div style={S.cardGrid}>{filtered.map(m => <MouCard key={m._id} m={m} onOpen={openDetail} onDelete={handleDelete} />)}</div>}
          </motion.div>
        )}
        {view === "create" && (
          <CreateMou onBack={goBack} onSaved={(saved) => { setMous(s => [saved, ...s]); pushNotif("MOU created and saved as Draft!", "success"); goBack(); }} />
        )}
        {view === "detail" && selected && (
          <DetailView
            mou={selected} onBack={goBack} onSend={handleSend} onDelete={() => handleDelete(selected._id)}
            onScheduleMeeting={() => setMeetingModal(true)}
            onApproveReject={(type) => { setStampType(type); setApproveModal(true); }}
            onUpdate={updateLocal} onSendAfterApprove={handleSendAfterApprove}
            onSimulateChange={simulateIndustryChange} onIndustryApprove={handleIndustryApprove}
            onDownloadPdf={() => generateMouPdf(selected)}
            onIndustryResponse={() => setResponseModal(true)}
            onIndustryMeetingSelect={handleIndustryMeetingSelect}
            onIndustryProposeMeeting={() => setIndustryMeetingModal(true)}
            onUniversityConfirmIndustrySlot={handleUniversityConfirmIndustrySlot}
          />
        )}
      </div>

      <AnimatePresence>
        {meetingModal && <MeetingModal existing={selected?.scheduledMeeting} onClose={() => setMeetingModal(false)} onSave={handleMeetingSave} />}
      </AnimatePresence>
      <AnimatePresence>
        {approveModal && <StampModal type={stampType} mou={selected} onClose={() => setApproveModal(false)} onConfirm={() => handleApproveReject(stampType)} />}
      </AnimatePresence>
      {/* Industry Response Modal */}
      <AnimatePresence>
        {responseModal && selected && (
          <IndustryResponseModal mou={selected} onClose={() => setResponseModal(false)} onSave={handleIndustryResponse} />
        )}
      </AnimatePresence>
      {/* Industry Meeting Slot Modal */}
      <AnimatePresence>
        {industryMeetingModal && selected && (
          <IndustryMeetingModal
            mou={selected}
            onClose={() => setIndustryMeetingModal(false)}
            onSave={handleIndustryProposeMeeting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MOU CARD
// ═══════════════════════════════════════════════════════════════════════════════
const MouCard = ({ m, onOpen, onDelete }) => {
  const prog = calcProgress(m.startDate, m.endDate);
  const hasChanges = m.proposedChanges && m.proposedChanges.length > 0;
  const needsAction = ["Changes Proposed", "Approved by Industry", "Industry Responded"].includes(m.status);
  const changeLogCount = (m.changeLog || []).length;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}
      style={{ ...S.card, ...(needsAction ? S.cardUrgent : {}) }}>
      {needsAction && <div style={S.urgentStrip}>⚡ Action Required</div>}
      {m.status === "Mutually Approved" && <div style={{ ...S.urgentStrip, background: "#dcfce7", color: "#16a34a" }}>✅ Mutually Approved</div>}
      <div style={S.cardTop}>
        <div>
          <div style={S.cardTitle}>{m.title || "Untitled MOU"}</div>
          <div style={S.cardMeta}><Building2 size={12} /> {m.university}<ChevronRight size={12} style={{ margin: "0 2px" }} />{m.industry}</div>
        </div>
        <Badge status={m.status} />
      </div>
      <div style={{ fontSize: 12, color: "#64748b", margin: "6px 0" }}>
        📅 {fmtDate(m.startDate)} → {fmtDate(m.endDate)}
        {m.collaborationType && <span style={{ marginLeft: 8, background: "#e2e8f0", padding: "1px 8px", borderRadius: 10, fontSize: 11 }}>{m.collaborationType}</span>}
      </div>
      {hasChanges && <div style={S.changesBadge}><History size={11} /> {m.proposedChanges.length} change(s) proposed by industry</div>}
      {changeLogCount > 0 && <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b", marginBottom: 4 }}><MessageSquare size={11} /> {changeLogCount} activity entries</div>}
      <div style={{ margin: "8px 0 4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 3 }}><span>Progress</span><span>{prog}%</span></div>
        <div style={{ height: 4, background: "#e2e8f0", borderRadius: 4 }}>
          <div style={{ width: `${prog}%`, height: "100%", background: needsAction ? "#7c3aed" : "#0284c7", borderRadius: 4, transition: "width 0.5s" }} />
        </div>
      </div>
      <div style={S.cardFooter}>
        <button style={S.btnOutline} onClick={() => onOpen(m)}><Eye size={13} /> View Details</button>
        <button style={S.btnDanger} onClick={() => onDelete(m._id)}><Trash2 size={13} /></button>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  CREATE MOU
// ═══════════════════════════════════════════════════════════════════════════════
const CreateMou = ({ onBack, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", university: "", industry: "", collaborationType: "",
    startDate: "", endDate: "", description: "", objectives: [""],
    responsibilities: { university: [""], industry: [""] }, terms: [""],
    signatories: { university: "", industry: "" },
    universityContact: { name: "", designation: "", email: "" },
    industryContact: { name: "", designation: "", email: "" },
    universityLogo: "", industryLogo: "",
    status: "Draft",
    changeLog: [],
    proposedChanges: [],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const arrAdd    = (k)      => setForm(f => ({ ...f, [k]: [...f[k], ""] }));
  const arrRemove = (k, i)   => setForm(f => ({ ...f, [k]: f[k].filter((_, j) => j !== i) }));
  const arrUpdate = (k, i, v) => setForm(f => { const a = [...f[k]]; a[i] = v; return { ...f, [k]: a }; });
  const n2Add    = (k, s)     => setForm(f => ({ ...f, [k]: { ...f[k], [s]: [...f[k][s], ""] } }));
  const n2Remove = (k, s, i)  => setForm(f => ({ ...f, [k]: { ...f[k], [s]: f[k][s].filter((_, j) => j !== i) } }));
  const n2Update = (k, s, i, v) => setForm(f => { const a = [...f[k][s]]; a[i] = v; return { ...f, [k]: { ...f[k], [s]: a } }; });

  const handleSave = async () => {
    const { title, university, industry, collaborationType, startDate, endDate } = form;
    if (!title || !university || !industry || !collaborationType || !startDate || !endDate) return alert("Please fill all required fields.");
    try {
      setSaving(true);
      const initLog = addChangeLogEntry(form, "university_change", { party: "University", action: "MOU Created", message: `MOU "${title}" created as Draft` });
      const res = await axios.post(API_URL, { ...form, changeLog: initLog });
      onSaved(res.data);
    }
    catch (e) { alert("Error saving MOU: " + (e.response?.data?.message || e.message)); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
      <div style={S.detailHeader}>
        <button style={S.backBtn} onClick={onBack}><ArrowLeft size={16} /> Back</button>
        <div>
          <h2 style={{ margin: 0, color: "#193648", fontSize: 20 }}>Create New MOU</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Fill in MOU details</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={S.btnOutline} onClick={onBack}>Cancel</button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={S.btnPrimary} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "💾 Save Draft"}
          </motion.button>
        </div>
      </div>

      {/* LIVE PREVIEW HEADER */}
      <div style={S.mouHeaderPreview}>
        <div style={S.mouLogoBox}>
          <div style={S.mouLogoIconWrap}>
            <LogoDisplay src={form.universityLogo} fallback={<UniSvg size={26} />} size={44} />
          </div>
          <div style={S.mouLogoName}>{form.university || "University Name"}</div>
          <div style={S.mouLogoSub}>First Party</div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 8px" }}>
          <MouDivider />
          <div style={S.mouAgreementLabel}>{form.title || "MOU Agreement"}</div>
          <div style={S.mouAgreementSub}>{form.collaborationType || "Collaboration Type"}</div>
        </div>
        <div style={S.mouLogoBox}>
          <div style={S.mouLogoIconWrap}>
            <LogoDisplay src={form.industryLogo} fallback={<IndustrySvg size={26} />} size={44} />
          </div>
          <div style={S.mouLogoName}>{form.industry || "Industry Partner"}</div>
          <div style={S.mouLogoSub}>Second Party</div>
        </div>
      </div>

      <div style={S.createBody}>
        <Section title="🖼️ Party Logos">
          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>Upload logos for both parties — they will appear in the header and in the PDF.</p>
          <div style={S.grid2}>
            <LogoUploadField label="University Logo" value={form.universityLogo} onChange={v => set("universityLogo", v)} />
            <LogoUploadField label="Industry / Company Logo" value={form.industryLogo} onChange={v => set("industryLogo", v)} />
          </div>
        </Section>

        <Section title="📋 Basic Information">
          <div style={S.grid2}>
            <FormField label="MOU Title *" value={form.title} onChange={v => set("title", v)} placeholder="e.g., Industry-Academia Research Collaboration" />
            <FormField label="Collaboration Type *" value={form.collaborationType} onChange={v => set("collaborationType", v)} type="select" options={["", "Research", "Internship", "Training", "Consultancy", "Joint Venture", "Other"]} />
            <FormField label="University *" value={form.university} onChange={v => set("university", v)} placeholder="Full University Name" />
            <FormField label="Industry Partner *" value={form.industry} onChange={v => set("industry", v)} placeholder="Company / Organization Name" />
            <FormField label="Start Date *" value={form.startDate} onChange={v => set("startDate", v)} type="date" />
            <FormField label="End Date *" value={form.endDate} onChange={v => set("endDate", v)} type="date" />
          </div>
          <FormField label="Purpose / Description" value={form.description} onChange={v => set("description", v)} type="textarea" placeholder="Describe the purpose and scope of this MOU..." />
        </Section>

        <Section title="🎯 Objectives">
          {form.objectives.map((obj, i) => (
            <div key={i} style={S.listItem}>
              <input style={S.listInput} value={obj} placeholder={`Objective ${i + 1}`} onChange={e => arrUpdate("objectives", i, e.target.value)} />
              {form.objectives.length > 1 && <button style={S.listRemove} onClick={() => arrRemove("objectives", i)}><X size={13} /></button>}
            </div>
          ))}
          <button style={S.addRowBtn} onClick={() => arrAdd("objectives")}>+ Add Objective</button>
        </Section>

        <Section title="📌 Responsibilities">
          <div style={S.grid2}>
            <div>
              <label style={S.subLabel}>University Responsibilities</label>
              {form.responsibilities.university.map((r, i) => (
                <div key={i} style={S.listItem}>
                  <input style={S.listInput} value={r} placeholder={`Responsibility ${i + 1}`} onChange={e => n2Update("responsibilities", "university", i, e.target.value)} />
                  {form.responsibilities.university.length > 1 && <button style={S.listRemove} onClick={() => n2Remove("responsibilities", "university", i)}><X size={13} /></button>}
                </div>
              ))}
              <button style={S.addRowBtn} onClick={() => n2Add("responsibilities", "university")}>+ Add</button>
            </div>
            <div>
              <label style={S.subLabel}>Industry Responsibilities</label>
              {form.responsibilities.industry.map((r, i) => (
                <div key={i} style={S.listItem}>
                  <input style={S.listInput} value={r} placeholder={`Responsibility ${i + 1}`} onChange={e => n2Update("responsibilities", "industry", i, e.target.value)} />
                  {form.responsibilities.industry.length > 1 && <button style={S.listRemove} onClick={() => n2Remove("responsibilities", "industry", i)}><X size={13} /></button>}
                </div>
              ))}
              <button style={S.addRowBtn} onClick={() => n2Add("responsibilities", "industry")}>+ Add</button>
            </div>
          </div>
        </Section>

        <Section title="⚖️ Terms & Conditions">
          {form.terms.map((t, i) => (
            <div key={i} style={S.listItem}>
              <input style={S.listInput} value={t} placeholder={`Term / Clause ${i + 1}`} onChange={e => arrUpdate("terms", i, e.target.value)} />
              {form.terms.length > 1 && <button style={S.listRemove} onClick={() => arrRemove("terms", i)}><X size={13} /></button>}
            </div>
          ))}
          <button style={S.addRowBtn} onClick={() => arrAdd("terms")}>+ Add Term</button>
        </Section>

        <Section title="👤 Contact Information">
          <div style={S.grid2}>
            <div>
              <label style={S.subLabel}>University Contact</label>
              <FormField label="Name" value={form.universityContact.name} onChange={v => set("universityContact", { ...form.universityContact, name: v })} />
              <FormField label="Designation" value={form.universityContact.designation} onChange={v => set("universityContact", { ...form.universityContact, designation: v })} />
              <FormField label="Email" value={form.universityContact.email} type="email" onChange={v => set("universityContact", { ...form.universityContact, email: v })} />
            </div>
            <div>
              <label style={S.subLabel}>Industry Contact</label>
              <FormField label="Name" value={form.industryContact.name} onChange={v => set("industryContact", { ...form.industryContact, name: v })} />
              <FormField label="Designation" value={form.industryContact.designation} onChange={v => set("industryContact", { ...form.industryContact, designation: v })} />
              <FormField label="Email" value={form.industryContact.email} type="email" onChange={v => set("industryContact", { ...form.industryContact, email: v })} />
            </div>
          </div>
        </Section>

        <Section title="✍️ Authorized Signatories">
          <div style={S.grid2}>
            <FormField label="University Signatory" value={form.signatories.university} onChange={v => set("signatories", { ...form.signatories, university: v })} placeholder="Name & Designation" />
            <FormField label="Industry Signatory" value={form.signatories.industry} onChange={v => set("signatories", { ...form.signatories, industry: v })} placeholder="Name & Designation" />
          </div>
        </Section>

        <div style={{ textAlign: "right", marginTop: 16 }}>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ ...S.btnPrimary, padding: "12px 32px", fontSize: 15 }} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "💾 Save MOU as Draft"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  DETAIL VIEW
// ═══════════════════════════════════════════════════════════════════════════════
const DetailView = ({ mou, onBack, onSend, onDelete, onScheduleMeeting, onApproveReject, onUpdate, onSendAfterApprove, onSimulateChange, onIndustryApprove, onDownloadPdf, onIndustryResponse, onIndustryMeetingSelect, onIndustryProposeMeeting, onUniversityConfirmIndustrySlot }) => {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(mou);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setEditData(mou); }, [mou]);

  const hasChanges    = mou.proposedChanges && mou.proposedChanges.length > 0;
  const canSend       = ["Draft", "Rejected"].includes(mou.status);
  const canApprove    = ["Sent to Industry", "Changes Proposed", "Approved by Industry", "Industry Responded"].includes(mou.status);
  const canIndApprove = ["Sent to Industry", "Changes Proposed", "Approved by University", "Industry Responded"].includes(mou.status) && !mou.industryStamp;
  const canSendAfter  = ["Approved by University", "Mutually Approved"].includes(mou.status);
  const canDownload   = ["Approved by Industry", "Approved by University", "Mutually Approved"].includes(mou.status);
  const isMutual      = mou.status === "Mutually Approved";
  const meeting       = mou.scheduledMeeting;
  const canRespond    = ["Sent to Industry", "Changes Proposed"].includes(mou.status); // show response button
  const hasMeetingOptions = meeting?.options && meeting.options.length > 0;
  // Check confirmedSlot safely — must have .date to be valid
  const hasConfirmedSlot  = !!(meeting?.confirmedSlot?.date);
  // Industry can confirm a single-slot meeting (no options, not yet confirmed)
  const canIndustryConfirmSingle = !!(meeting && !hasMeetingOptions && !hasConfirmedSlot && meeting.date && meeting.time);

  const saveEdit = async () => {
    try {
      setSaving(true);
      const changeLog = addChangeLogEntry(editData, "university_change", {
        party: "University",
        action: "MOU Edited",
        message: "University updated MOU details",
      });
      const res = await axios.put(`${API_URL}/${mou._id}`, { ...editData, changeLog });
      onUpdate(res.data); setEditing(false);
    }
    catch { alert("Error saving"); } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
      <div style={S.detailHeader}>
        <button style={S.backBtn} onClick={onBack}><ArrowLeft size={16} /> Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, color: "#193648", fontSize: 20 }}>{mou.title || "Untitled MOU"}</h2>
            <Badge status={mou.status} />
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{mou.university} ↔ {mou.industry} | Created: {fmtDate(mou.createdAt)}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {editing ? (
            <>
              <button style={S.btnOutline} onClick={() => setEditing(false)}>Cancel</button>
              <button style={S.btnPrimary} onClick={saveEdit} disabled={saving}>{saving ? "Saving..." : "💾 Save Changes"}</button>
            </>
          ) : (
            <>
              {canSend       && <button style={S.btnSend} onClick={onSend}><Send size={14} /> Send to Industry</button>}
              {canRespond    && (
                <motion.button whileHover={{ scale: 1.04 }} style={S.btnResponse} onClick={onIndustryResponse}>
                  <MessageSquare size={14} /> Industry Response
                </motion.button>
              )}
              {canApprove    && <><button style={S.btnApprove} onClick={() => onApproveReject("approve")}><CheckCircle size={14} /> Univ. Approve</button><button style={S.btnReject} onClick={() => onApproveReject("reject")}><XCircle size={14} /> Reject</button></>}
              {canIndApprove && <motion.button whileHover={{ scale: 1.04 }} style={S.btnIndustryApprove} onClick={onIndustryApprove}><CheckSquare size={14} /> Industry Approve</motion.button>}
              {canSendAfter  && <button style={S.btnNotify} onClick={onSendAfterApprove}><Bell size={14} /> Notify Industry</button>}
              {canDownload   && <motion.button whileHover={{ scale: 1.04 }} style={S.btnDownload} onClick={onDownloadPdf}><Download size={14} /> Download PDF</motion.button>}
              <button style={S.btnMeeting} onClick={onScheduleMeeting}><Calendar size={14} /> {meeting ? "Edit Meeting" : "Schedule Meeting"}</button>
              <button style={S.btnOutline} onClick={() => setEditing(true)}><Edit3 size={14} /> Edit MOU</button>
              {mou.status === "Sent to Industry" && <button style={{ ...S.btnOutline, color: "#7c3aed", borderColor: "#7c3aed" }} onClick={onSimulateChange}>🔧 Simulate Change</button>}
              <button style={S.btnDanger} onClick={onDelete}><Trash2 size={14} /></button>
            </>
          )}
        </div>
      </div>

      {/* HEADER BANNER */}
      <div style={{ ...S.mouHeaderPreview, marginBottom: 16 }}>
        <div style={S.mouLogoBox}>
          <div style={S.mouLogoIconWrap}><LogoDisplay src={mou.universityLogo} fallback={<UniSvg size={26} />} size={44} /></div>
          <div style={S.mouLogoName}>{mou.university}</div>
          <div style={S.mouLogoSub}>First Party</div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 8px" }}>
          <MouDivider />
          <div style={S.mouAgreementLabel}>{mou.title || "MOU Agreement"}</div>
          <div style={S.mouAgreementSub}>{mou.collaborationType}</div>
          {isMutual && <div style={{ marginTop: 6, background: "#dcfce7", color: "#16a34a", borderRadius: 20, padding: "2px 12px", fontSize: 11, fontWeight: 700, border: "1px solid #86efac" }}>✅ MUTUALLY APPROVED</div>}
        </div>
        <div style={S.mouLogoBox}>
          <div style={S.mouLogoIconWrap}><LogoDisplay src={mou.industryLogo} fallback={<IndustrySvg size={26} />} size={44} /></div>
          <div style={S.mouLogoName}>{mou.industry}</div>
          <div style={S.mouLogoSub}>Second Party</div>
        </div>
      </div>

      <div style={S.detailBody}>
        <div style={S.detailLeft}>
          {hasChanges && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={S.changesAlert}>
              <AlertTriangle size={16} color="#7c3aed" />
              <span style={{ color: "#7c3aed", fontWeight: 600 }}>Industry has proposed {mou.proposedChanges.length} change(s) — review in the sidebar</span>
            </motion.div>
          )}

          {/* ─── MEETING CARD — 4-state flow ─── */}
          {meeting && (
            <div style={{ ...S.meetingCard, padding: 0, overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: "10px 16px", background: hasConfirmedSlot ? "linear-gradient(135deg,#193648,#1e4a6e)" : "#eff6ff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: hasConfirmedSlot ? "#fff" : "#0284c7", fontSize: 13 }}>
                  <Calendar size={14} /> Meeting Schedule
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                  background: hasConfirmedSlot ? "#dcfce7" : meeting.industryProposedSlot ? "#fefce8" : hasMeetingOptions ? "#e0f2fe" : "#f1f5f9",
                  color:      hasConfirmedSlot ? "#16a34a"  : meeting.industryProposedSlot ? "#92400e"  : hasMeetingOptions ? "#0284c7" : "#64748b",
                  border:     `1px solid ${hasConfirmedSlot ? "#86efac" : meeting.industryProposedSlot ? "#fde68a" : hasMeetingOptions ? "#93c5fd" : "#e2e8f0"}`,
                }}>
                  {hasConfirmedSlot ? "✅ Confirmed" : meeting.industryProposedSlot ? "⏳ Awaiting University Confirmation" : hasMeetingOptions ? "📋 Industry Selecting" : "📅 Proposed"}
                </span>
              </div>

              <div style={{ padding: "12px 16px" }}>

                {/* ── STATE 1: MUTUALLY CONFIRMED ── */}
                {hasConfirmedSlot && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: "linear-gradient(135deg,#dcfce7,#d1fae5)", border: "1px solid #86efac", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontWeight: 800, color: "#16a34a", fontSize: 13, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                      🤝 Both Parties Confirmed
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      <div style={{ background: "#fff", borderRadius: 8, padding: "8px 12px", border: "1px solid #bbf7d0" }}>
                        <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Date</div>
                        <div style={{ fontWeight: 800, color: "#15803d", fontSize: 14 }}>{meeting.confirmedSlot.date}</div>
                      </div>
                      <div style={{ background: "#fff", borderRadius: 8, padding: "8px 12px", border: "1px solid #bbf7d0" }}>
                        <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Time</div>
                        <div style={{ fontWeight: 800, color: "#15803d", fontSize: 14 }}>🕐 {meeting.confirmedSlot.time}</div>
                      </div>
                    </div>
                    <MeetingRow icon={<MapPin size={12} />} label="Venue"  val={meeting.venue} />
                    <MeetingRow icon={<Coffee size={12} />} label="Agenda" val={meeting.agenda} />
                    {meeting.confirmedSlot.note && <div style={{ marginTop: 4, fontSize: 11, color: "#4b5563" }}>📌 {meeting.confirmedSlot.note}</div>}
                    <div style={{ marginTop: 6, fontSize: 10, color: "#6b7280" }}>Confirmed: {fmtDateTime(meeting.confirmedAt)}</div>
                  </motion.div>
                )}

                {/* ── STATE 2: INDUSTRY PROPOSED A CUSTOM SLOT → university must confirm ── */}
                {!hasConfirmedSlot && meeting.industryProposedSlot && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                      <div style={{ fontWeight: 700, color: "#92400e", fontSize: 12, marginBottom: 8 }}>
                        🏭 {mou.industry} proposed this slot:
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ background: "#fff", borderRadius: 7, padding: "7px 11px", border: "1px solid #fde68a" }}>
                          <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Date</div>
                          <div style={{ fontWeight: 800, color: "#92400e", fontSize: 13 }}>{meeting.industryProposedSlot.date}</div>
                        </div>
                        <div style={{ background: "#fff", borderRadius: 7, padding: "7px 11px", border: "1px solid #fde68a" }}>
                          <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Time</div>
                          <div style={{ fontWeight: 800, color: "#92400e", fontSize: 13 }}>🕐 {meeting.industryProposedSlot.time}</div>
                        </div>
                      </div>
                      {meeting.industryProposedSlot.note && <div style={{ marginTop: 6, fontSize: 11, color: "#78350f" }}>📌 {meeting.industryProposedSlot.note}</div>}
                      <div style={{ marginTop: 4, fontSize: 10, color: "#a16207" }}>Proposed: {fmtDateTime(meeting.industryProposedAt)}</div>
                    </div>
                    <MeetingRow icon={<MapPin size={12} />} label="Venue"  val={meeting.venue} />
                    <MeetingRow icon={<Coffee size={12} />} label="Agenda" val={meeting.agenda} />
                    {/* University confirms industry's slot */}
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      style={{ ...S.btnApprove, width: "100%", justifyContent: "center", padding: "9px", marginTop: 10 }}
                      onClick={onUniversityConfirmIndustrySlot}>
                      <CheckCircle size={14} /> Confirm This Slot (University)
                    </motion.button>
                    <button style={{ ...S.btnOutline, width: "100%", justifyContent: "center", marginTop: 6, fontSize: 12 }}
                      onClick={() => onScheduleMeeting()}>
                      ✏️ University — Edit Meeting Options
                    </button>
                  </motion.div>
                )}

                {/* ── STATE 3: OPTIONS LIST — industry selects or proposes own ── */}
                {!hasConfirmedSlot && !meeting.industryProposedSlot && hasMeetingOptions && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ fontSize: 12, color: "#0284c7", fontWeight: 600, marginBottom: 8 }}>
                      📋 University proposed these slots — Industry: select one or propose your own
                    </div>
                    {meeting.options.map((opt, i) => (
                      <motion.div key={i} whileHover={{ scale: 1.01 }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8faff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
                        <div>
                          <div style={{ fontWeight: 600, color: "#193648", fontSize: 12 }}>{opt.date} at {opt.time}</div>
                          {opt.note && <div style={{ fontSize: 11, color: "#64748b" }}>{opt.note}</div>}
                        </div>
                        <button style={{ ...S.btnApprove, padding: "4px 10px", fontSize: 11 }} onClick={() => onIndustryMeetingSelect(opt)}>
                          <Vote size={11} /> Select
                        </button>
                      </motion.div>
                    ))}
                    <MeetingRow icon={<MapPin size={12} />} label="Venue"  val={meeting.venue} />
                    <MeetingRow icon={<Coffee size={12} />} label="Agenda" val={meeting.agenda} />
                    {/* Industry proposes their own slot */}
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      style={{ ...S.btnResponse, width: "100%", justifyContent: "center", padding: "9px", marginTop: 10 }}
                      onClick={onIndustryProposeMeeting}>
                      <Edit3 size={13} /> Industry — Propose Different Slot
                    </motion.button>
                  </motion.div>
                )}

                {/* ── STATE 4: SINGLE SLOT — industry confirms or proposes own ── */}
                {!hasConfirmedSlot && !meeting.industryProposedSlot && !hasMeetingOptions && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                    <MeetingRow icon={<Clock size={12} />}  label="Date & Time" val={`${fmtDate(meeting.date)} at ${meeting.time}`} />
                    <MeetingRow icon={<MapPin size={12} />} label="Venue"        val={meeting.venue} />
                    <MeetingRow icon={<Coffee size={12} />} label="Agenda"       val={meeting.agenda} />
                    {meeting.menu      && <MeetingRow icon={<Coffee size={12} />} label="Menu"      val={meeting.menu} />}
                    {meeting.attendees && <MeetingRow icon={<User size={12} />}   label="Attendees" val={meeting.attendees} />}
                    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {canIndustryConfirmSingle && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          style={{ ...S.btnApprove, justifyContent: "center", padding: "9px", fontSize: 12 }}
                          onClick={() => onIndustryMeetingSelect({ date: meeting.date, time: meeting.time, note: "" })}>
                          <Vote size={13} /> Confirm This Slot
                        </motion.button>
                      )}
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        style={{ ...S.btnResponse, justifyContent: "center", padding: "9px", fontSize: 12 }}
                        onClick={onIndustryProposeMeeting}>
                        <Edit3 size={13} /> Propose New Slot
                      </motion.button>
                    </div>
                  </motion.div>
                )}

              </div>
            </div>
          )}

          {(mou.universityStamp || mou.industryStamp) && (
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              {mou.universityStamp && <StampBadge stamp={mou.universityStamp} label="University" />}
              {mou.industryStamp   && <StampBadge stamp={mou.industryStamp}   label="Industry" />}
            </div>
          )}
          {canDownload && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={S.downloadBanner}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckSquare size={22} color="#16a34a" />
                <div>
                  <div style={{ fontWeight: 800, color: "#166534", fontSize: 14 }}>{isMutual ? "🎉 Both parties have approved this MOU!" : "✅ MOU approved — PDF ready"}</div>
                  <div style={{ fontSize: 12, color: "#4ade80" }}>{isMutual ? "The MOU is fully finalized. Download the official PDF." : "Download the approved MOU PDF."}</div>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.04 }} style={S.btnDownload} onClick={onDownloadPdf}><Download size={15} /> Download PDF</motion.button>
            </motion.div>
          )}
          {editing ? <EditableMou data={editData} onChange={(k, v) => setEditData(f => ({ ...f, [k]: v }))} /> : <ViewMou mou={mou} />}
        </div>

        {/* ── SIDEBAR: Change Log + Timeline ── */}
        <div style={S.sidebar}>

          {/* MEETING CONFIRMED GREEN BANNER */}
          {mou.scheduledMeeting?.confirmedSlot?.date && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", border: "2px solid #16a34a", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckCircle size={16} color="#fff" />
                </div>
                <div style={{ fontWeight: 800, color: "#166534", fontSize: 13 }}>Meeting Confirmed!</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <div style={{ background: "#fff", borderRadius: 7, padding: "6px 10px", border: "1px solid #86efac" }}>
                  <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 1 }}>Date</div>
                  <div style={{ fontWeight: 800, color: "#15803d", fontSize: 12 }}>{mou.scheduledMeeting.confirmedSlot.date}</div>
                </div>
                <div style={{ background: "#fff", borderRadius: 7, padding: "6px 10px", border: "1px solid #86efac" }}>
                  <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 1 }}>Time</div>
                  <div style={{ fontWeight: 800, color: "#15803d", fontSize: 12 }}>🕐 {mou.scheduledMeeting.confirmedSlot.time}</div>
                </div>
              </div>
              {mou.scheduledMeeting.venue && (
                <div style={{ marginTop: 6, fontSize: 11, color: "#166534", display: "flex", gap: 4, alignItems: "center" }}>
                  <MapPin size={11} /> {mou.scheduledMeeting.venue}
                </div>
              )}
              <div style={{ marginTop: 4, fontSize: 10, color: "#4ade80" }}>
                ✅ Both parties agreed · {fmtDateTime(mou.scheduledMeeting.confirmedAt)}
              </div>
            </motion.div>
          )}

          {/* CHANGE LOG — full activity */}
          <div style={S.sidebarTitle}><History size={15} /> Activity Log</div>
          {(!mou.changeLog || mou.changeLog.length === 0) && (!hasChanges)
            ? <div style={S.sidebarEmpty}>No activity yet.</div>
            : null
          }

          {/* Proposed Changes (structural) */}
          {hasChanges && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Proposed Field Changes</div>
              {mou.proposedChanges.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={S.changeItem}>
                  <div style={{ fontWeight: 700, color: "#7c3aed", fontSize: 12, marginBottom: 3 }}>🏭 {c.field || `Change #${i + 1}`}</div>
                  <div style={{ fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: "#dc2626", textDecoration: "line-through" }}>{c.oldValue || "—"}</span>
                    <span style={{ color: "#64748b", margin: "0 6px" }}>→</span>
                    <span style={{ color: "#16a34a" }}>{c.newValue || "—"}</span>
                  </div>
                  {c.reason && <div style={{ fontSize: 11, color: "#94a3b8" }}>Reason: {c.reason}</div>}
                  <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 3 }}>{fmtDate(c.date)}</div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Full Change Log */}
          {(mou.changeLog || []).length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>All Activity</div>
              {[...(mou.changeLog || [])].reverse().map((entry, i) => {
                const cfg = CHANGE_TYPES[entry.type] || { color: "#64748b", bg: "#f1f5f9", icon: "📌", label: entry.type };
                return (
                  <motion.div key={entry.id || i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ background: cfg.bg, border: `1px solid ${cfg.color}30`, borderRadius: 8, padding: "9px 12px", marginBottom: 7 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 14 }}>{cfg.icon}</span>
                      <span style={{ fontWeight: 700, color: cfg.color, fontSize: 11 }}>{cfg.label}</span>
                      <span style={{ marginLeft: "auto", fontSize: 10, color: "#94a3b8" }}>{entry.party}</span>
                    </div>
                    {entry.message && <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.4 }}>{entry.message}</div>}
                    {entry.from && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>From: {entry.from}</div>}
                    {entry.field && (
                      <div style={{ fontSize: 11, marginTop: 3 }}>
                        <span style={{ color: "#dc2626", textDecoration: "line-through" }}>{entry.oldValue}</span>
                        <span style={{ color: "#64748b", margin: "0 4px" }}>→</span>
                        <span style={{ color: "#16a34a" }}>{entry.newValue}</span>
                      </div>
                    )}
                    <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 4 }}>{fmtDateTime(entry.date)}</div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* TIMELINE */}
          <div style={{ ...S.sidebarTitle, marginTop: 16 }}><Clock size={15} /> Timeline</div>
          <div style={S.timeline}>
            {[
              { label: "Draft Created",       date: mou.createdAt,             done: true },
              { label: "Sent to Industry",    date: mou.sentAt,                done: !!mou.sentAt },
              { label: "Industry Response",   date: mou.industryResponseAt,    done: !!mou.industryResponseAt },
              { label: "University Decision", date: mou.universityStamp?.date, done: !!mou.universityStamp },
              { label: "Meeting Confirmed",   date: mou.scheduledMeeting?.confirmedAt, done: !!(mou.scheduledMeeting?.confirmedSlot?.date) },
              { label: "Mutually Approved",   date: null,                      done: mou.status === "Mutually Approved" },
            ].map((t, i) => (
              <div key={i} style={S.timelineItem}>
                <div style={{ ...S.timelineDot, background: t.done ? "#16a34a" : "#e2e8f0" }}>
                  {t.done && <CheckCircle size={10} color="#fff" />}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: t.done ? "#193648" : "#94a3b8" }}>{t.label}</div>
                  {t.date && <div style={{ fontSize: 10, color: "#94a3b8" }}>{fmtDate(t.date)}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── VIEW MOU ─────────────────────────────────────────────────────────────────
const ViewMou = ({ mou }) => (
  <div style={S.mouDoc}>
    <div style={S.mouDocTitle}>MEMORANDUM OF UNDERSTANDING</div>
    <div style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginBottom: 16 }}>{mou.university} & {mou.industry}</div>
    <hr style={{ borderColor: "#e2e8f0", margin: "12px 0" }} />
    <MouSection title="1. Parties"><p><strong>University:</strong> {mou.university}</p><p><strong>Industry:</strong> {mou.industry}</p></MouSection>
    <MouSection title="2. Purpose"><p>{mou.description || "—"}</p></MouSection>
    <MouSection title="3. Collaboration Type"><p>{mou.collaborationType}</p></MouSection>
    <MouSection title="4. Duration"><p>From <strong>{fmtDate(mou.startDate)}</strong> to <strong>{fmtDate(mou.endDate)}</strong></p></MouSection>
    {mou.objectives?.filter(Boolean).length > 0 && <MouSection title="5. Objectives"><ul>{mou.objectives.filter(Boolean).map((o, i) => <li key={i}>{o}</li>)}</ul></MouSection>}
    {(mou.responsibilities?.university?.filter(Boolean).length > 0 || mou.responsibilities?.industry?.filter(Boolean).length > 0) && (
      <MouSection title="6. Responsibilities">
        {mou.responsibilities?.university?.filter(Boolean).length > 0 && <><strong>University:</strong><ul>{mou.responsibilities.university.filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}</ul></>}
        {mou.responsibilities?.industry?.filter(Boolean).length > 0 && <><strong>Industry:</strong><ul>{mou.responsibilities.industry.filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}</ul></>}
      </MouSection>
    )}
    {mou.terms?.filter(Boolean).length > 0 && <MouSection title="7. Terms & Conditions"><ol>{mou.terms.filter(Boolean).map((t, i) => <li key={i}>{t}</li>)}</ol></MouSection>}
    <MouSection title="8. Signatories">
      <div style={{ display: "flex", gap: 40, marginTop: 8 }}>
        {[["university", "university"], ["industry", "industry"]].map(([side, key]) => (
          <div key={side}><div style={{ borderTop: "1px solid #193648", paddingTop: 6, marginTop: 30, width: 160 }}>
            <strong>{mou.signatories?.[key] || `${side.charAt(0).toUpperCase() + side.slice(1)} Authority`}</strong><br />
            <span style={{ fontSize: 12, color: "#64748b" }}>For {mou[side]}</span>
          </div></div>
        ))}
      </div>
    </MouSection>
  </div>
);

// ─── EDITABLE MOU ─────────────────────────────────────────────────────────────
const EditableMou = ({ data, onChange }) => {
  const upd = (k, i, v) => { const a = [...(data[k] || [])]; a[i] = v; onChange(k, a); };
  return (
    <div style={S.mouDoc}>
      <div style={S.mouDocTitle}>MEMORANDUM OF UNDERSTANDING - EDIT MODE</div>
      <hr style={{ borderColor: "#e2e8f0", margin: "12px 0" }} />
      <MouSection title="Basic Details">
        <div style={S.grid2}>
          <FormField label="Title" value={data.title} onChange={v => onChange("title", v)} />
          <FormField label="Collaboration Type" value={data.collaborationType} type="select" options={["", "Research", "Internship", "Training", "Consultancy", "Joint Venture", "Other"]} onChange={v => onChange("collaborationType", v)} />
          <FormField label="Start Date" value={data.startDate} type="date" onChange={v => onChange("startDate", v)} />
          <FormField label="End Date" value={data.endDate} type="date" onChange={v => onChange("endDate", v)} />
        </div>
        <FormField label="Purpose" value={data.description} type="textarea" onChange={v => onChange("description", v)} />
      </MouSection>
      <MouSection title="Objectives">
        {(data.objectives || [""]).map((o, i) => <input key={i} style={{ ...S.listInput, marginBottom: 6 }} value={o} onChange={e => upd("objectives", i, e.target.value)} placeholder={`Objective ${i + 1}`} />)}
      </MouSection>
      <MouSection title="Terms & Conditions">
        {(data.terms || [""]).map((t, i) => <input key={i} style={{ ...S.listInput, marginBottom: 6 }} value={t} onChange={e => upd("terms", i, e.target.value)} placeholder={`Term ${i + 1}`} />)}
      </MouSection>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  INDUSTRY RESPONSE MODAL — NEW
// ═══════════════════════════════════════════════════════════════════════════════
const IndustryResponseModal = ({ mou, onClose, onSave }) => {
  const [responseType, setResponseType] = useState("comment"); // 'accept' | 'reject' | 'comment' | 'change'
  const [message, setMessage] = useState("");
  const [changes, setChanges] = useState([{ field: "", oldValue: "", newValue: "", reason: "" }]);

  const addChange = () => setChanges(c => [...c, { field: "", oldValue: "", newValue: "", reason: "" }]);
  const updateChange = (i, k, v) => setChanges(c => { const a = [...c]; a[i] = { ...a[i], [k]: v }; return a; });
  const removeChange = (i) => setChanges(c => c.filter((_, j) => j !== i));

  const handleSubmit = () => {
    if (!message.trim() && responseType !== "accept" && responseType !== "reject") return alert("Please enter a response message.");
    const payload = {
      type: responseType,
      message: message || (responseType === "accept" ? `${mou.industry} has accepted the MOU.` : `${mou.industry} has rejected the MOU.`),
      changes: responseType === "change" ? changes.filter(c => c.field).map(c => ({ ...c, date: new Date().toISOString() })) : undefined,
    };
    onSave(payload);
  };

  const typeConfig = {
    accept:  { color: "#16a34a", bg: "#f0fdf4", border: "#86efac", icon: <ThumbsUp size={16} />, label: "Accept MOU" },
    reject:  { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", icon: <ThumbsDown size={16} />, label: "Reject MOU" },
    comment: { color: "#0284c7", bg: "#eff6ff", border: "#93c5fd", icon: <MessageSquare size={16} />, label: "Send Comment" },
    change:  { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", icon: <RefreshCw size={16} />, label: "Propose Changes" },
  };

  return (
    <div style={S.overlay}>
      <motion.div initial={{ y: 40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0, scale: 0.95 }}
        style={{ ...S.modal, maxWidth: 560 }}>
        <div style={S.modalHeader}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#193648", display: "flex", alignItems: "center", gap: 8 }}>
            <MessageSquare size={18} /> Industry Response — {mou.industry}
          </div>
          <X size={20} style={{ cursor: "pointer" }} onClick={onClose} />
        </div>
        <div style={S.modalBody}>
          {/* Response type selector */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, display: "block", marginBottom: 8 }}>Response Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {Object.entries(typeConfig).map(([key, cfg]) => (
                <motion.button key={key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setResponseType(key)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, border: `2px solid ${responseType === key ? cfg.color : "#e2e8f0"}`, background: responseType === key ? cfg.bg : "#fff", color: responseType === key ? cfg.color : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s" }}>
                  {cfg.icon} {cfg.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Message */}
          <FormField
            label={responseType === "accept" ? "Acceptance Note (optional)" : responseType === "reject" ? "Rejection Reason *" : "Message / Comment *"}
            value={message}
            type="textarea"
            onChange={setMessage}
            placeholder={
              responseType === "accept" ? "e.g., We accept the MOU as presented." :
              responseType === "reject" ? "e.g., Terms do not align with our current capacity." :
              responseType === "comment" ? "e.g., Please clarify the scope of section 3..." :
              "Describe the changes you are proposing..."
            }
          />

          {/* Change fields (only when type = change) */}
          {responseType === "change" && (
            <div>
              <label style={{ fontSize: 12, color: "#7c3aed", fontWeight: 700, display: "block", marginBottom: 8 }}>Proposed Changes</label>
              {changes.map((ch, i) => (
                <div key={i} style={{ background: "#f5f3ff", border: "1px solid #e9d5ff", borderRadius: 8, padding: "12px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed" }}>Change #{i + 1}</span>
                    {changes.length > 1 && <button style={S.listRemove} onClick={() => removeChange(i)}><X size={12} /></button>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <FormField label="Field / Section" value={ch.field} onChange={v => updateChange(i, "field", v)} placeholder="e.g., Duration, Clause 3" />
                    <FormField label="Reason" value={ch.reason} onChange={v => updateChange(i, "reason", v)} placeholder="Why this change?" />
                    <FormField label="Current Value" value={ch.oldValue} onChange={v => updateChange(i, "oldValue", v)} placeholder="Existing value" />
                    <FormField label="Proposed Value" value={ch.newValue} onChange={v => updateChange(i, "newValue", v)} placeholder="New value" />
                  </div>
                </div>
              ))}
              <button style={S.addRowBtn} onClick={addChange}>+ Add Another Change</button>
            </div>
          )}

          {/* Preview summary */}
          {responseType && (
            <div style={{ background: typeConfig[responseType].bg, border: `1px solid ${typeConfig[responseType].border}`, borderRadius: 8, padding: "10px 14px", marginTop: 12 }}>
              <div style={{ fontSize: 12, color: typeConfig[responseType].color, fontWeight: 600 }}>
                {typeConfig[responseType].icon} This will be logged in the Change Log and university will be notified.
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: "12px 20px", display: "flex", gap: 8, justifyContent: "flex-end", borderTop: "1px solid #f1f5f9" }}>
          <button style={S.btnOutline} onClick={onClose}>Cancel</button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ ...S.btnPrimary, background: typeConfig[responseType].color }}
            onClick={handleSubmit}>
            {typeConfig[responseType].icon} Submit Response
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  INDUSTRY MEETING MODAL — industry proposes their own slot
// ═══════════════════════════════════════════════════════════════════════════════
const IndustryMeetingModal = ({ mou, onClose, onSave }) => {
  const existing = mou.scheduledMeeting?.industryProposedSlot;
  const [form, setForm] = useState({
    date: existing?.date || "",
    time: existing?.time || "",
    note: existing?.note || "",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.date || !form.time) return alert("Please fill date and time.");
    onSave(form);
  };

  return (
    <div style={S.overlay}>
      <motion.div initial={{ y: 40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.95 }} style={{ ...S.modal, maxWidth: 440 }}>
        <div style={S.modalHeader}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#193648", display: "flex", alignItems: "center", gap: 8 }}>
            <Edit3 size={18} /> {mou.industry} — Propose Meeting Slot
          </div>
          <X size={20} style={{ cursor: "pointer" }} onClick={onClose} />
        </div>
        <div style={S.modalBody}>
          <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#92400e" }}>
            🏭 As <strong>{mou.industry}</strong>, propose your preferred meeting date and time. University will review and confirm.
          </div>
          {/* Show university's options for reference */}
          {mou.scheduledMeeting?.options?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                University proposed options (for reference):
              </div>
              {mou.scheduledMeeting.options.map((opt, i) => (
                <div key={i} style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 6, padding: "6px 10px", marginBottom: 4, fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#0284c7", fontWeight: 600 }}>{opt.date} at {opt.time}</span>
                  <button style={{ ...S.btnApprove, padding: "3px 10px", fontSize: 11 }}
                    onClick={() => setForm({ date: opt.date, time: opt.time, note: opt.note || "" })}>
                    Use This
                  </button>
                </div>
              ))}
            </div>
          )}
          {mou.scheduledMeeting?.date && !mou.scheduledMeeting?.options?.length && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                University's proposed slot (for reference):
              </div>
              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 6, padding: "6px 10px", marginBottom: 4, fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#0284c7", fontWeight: 600 }}>{fmtDate(mou.scheduledMeeting.date)} at {mou.scheduledMeeting.time}</span>
                <button style={{ ...S.btnApprove, padding: "3px 10px", fontSize: 11 }}
                  onClick={() => setForm({ date: mou.scheduledMeeting.date, time: mou.scheduledMeeting.time, note: "" })}>
                  Use This
                </button>
              </div>
            </div>
          )}
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#193648", marginBottom: 10 }}>Your Preferred Slot:</div>
            <div style={S.grid2}>
              <FormField label="Date *" value={form.date} type="date" onChange={v => set("date", v)} />
              <FormField label="Time *" value={form.time} type="time" onChange={v => set("time", v)} />
            </div>
            <FormField label="Note (optional)" value={form.note} onChange={v => set("note", v)} placeholder="e.g., Prefer morning, available after 10 AM" />
          </div>
        </div>
        <div style={{ padding: "12px 20px", display: "flex", gap: 8, justifyContent: "flex-end", borderTop: "1px solid #f1f5f9" }}>
          <button style={S.btnOutline} onClick={onClose}>Cancel</button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ ...S.btnResponse, gap: 6 }} onClick={handleSubmit}>
            <Send size={14} /> Submit Slot to University
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── MEETING MODAL — Updated with multiple time options ───────────────────────
const MeetingModal = ({ existing, onClose, onSave }) => {
  const [mode, setMode] = useState(existing?.options ? "options" : "single"); // 'single' | 'options'
  const [form, setForm] = useState(existing || { date: "", time: "", venue: "", agenda: "", menu: "", attendees: "", options: [] });
  const [options, setOptions] = useState(existing?.options || [{ date: "", time: "", note: "" }]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const addOption = () => setOptions(o => [...o, { date: "", time: "", note: "" }]);
  const updateOption = (i, k, v) => setOptions(o => { const a = [...o]; a[i] = { ...a[i], [k]: v }; return a; });
  const removeOption = (i) => setOptions(o => o.filter((_, j) => j !== i));

  const handleSave = () => {
    if (!form.venue || !form.agenda) return alert("Please fill venue and agenda.");
    if (mode === "single" && (!form.date || !form.time)) return alert("Please fill date and time.");
    if (mode === "options" && options.filter(o => o.date && o.time).length === 0) return alert("Please add at least one time option.");
    const data = mode === "options"
      ? { ...form, options: options.filter(o => o.date && o.time), date: "", time: "" }
      : { ...form, options: [] };
    onSave(data);
  };

  return (
    <div style={S.overlay}>
      <motion.div initial={{ y: 40, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0, scale: 0.95 }} style={{ ...S.modal, maxWidth: 540 }}>
        <div style={S.modalHeader}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#193648", display: "flex", alignItems: "center", gap: 8 }}><Calendar size={18} /> Schedule Meeting</div>
          <X size={20} style={{ cursor: "pointer" }} onClick={onClose} />
        </div>
        <div style={S.modalBody}>
          {/* Mode toggle */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { key: "single",  label: "📅 Single Date/Time" },
              { key: "options", label: "🗓️ Multiple Options (Industry Chooses)" },
            ].map(m => (
              <button key={m.key} onClick={() => setMode(m.key)}
                style={{ flex: 1, padding: "8px", borderRadius: 8, border: `2px solid ${mode === m.key ? "#0284c7" : "#e2e8f0"}`, background: mode === m.key ? "#eff6ff" : "#fff", color: mode === m.key ? "#0284c7" : "#64748b", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                {m.label}
              </button>
            ))}
          </div>

          {mode === "single" ? (
            <>
              <div style={S.grid2}>
                <FormField label="Meeting Date *" value={form.date} type="date" onChange={v => set("date", v)} />
                <FormField label="Time *" value={form.time} type="time" onChange={v => set("time", v)} />
              </div>
            </>
          ) : (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#0284c7", fontWeight: 700, display: "block", marginBottom: 8 }}>Time Options (industry will select one)</label>
              {options.map((opt, i) => (
                <div key={i} style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#0284c7" }}>Option {i + 1}</span>
                    {options.length > 1 && <button style={S.listRemove} onClick={() => removeOption(i)}><X size={12} /></button>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 8 }}>
                    <FormField label="Date" value={opt.date} type="date" onChange={v => updateOption(i, "date", v)} />
                    <FormField label="Time" value={opt.time} type="time" onChange={v => updateOption(i, "time", v)} />
                    <FormField label="Note (optional)" value={opt.note} onChange={v => updateOption(i, "note", v)} placeholder="e.g., Morning slot" />
                  </div>
                </div>
              ))}
              <button style={S.addRowBtn} onClick={addOption}>+ Add Time Option</button>
            </div>
          )}

          <FormField label="Venue / Location *" value={form.venue} onChange={v => set("venue", v)} placeholder="e.g., Conference Room A, City Hotel" />
          <FormField label="Agenda *" value={form.agenda} type="textarea" onChange={v => set("agenda", v)} placeholder="Meeting objectives and points to discuss..." />
          <FormField label="Menu / Refreshments" value={form.menu} onChange={v => set("menu", v)} placeholder="e.g., Lunch, Tea & Coffee" />
          <FormField label="Expected Attendees" value={form.attendees} onChange={v => set("attendees", v)} placeholder="e.g., Dean, Industry Director" />

          {mode === "options" && (
            <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#92400e" }}>
              💡 Industry will see these options and select their preferred time. Both parties will be notified once confirmed.
            </div>
          )}
        </div>
        <div style={{ padding: "12px 20px", display: "flex", gap: 8, justifyContent: "flex-end", borderTop: "1px solid #f1f5f9" }}>
          <button style={S.btnOutline} onClick={onClose}>Cancel</button>
          <button style={S.btnPrimary} onClick={handleSave}><Calendar size={14} /> Save Meeting</button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── STAMP MODAL ──────────────────────────────────────────────────────────────
const StampModal = ({ type, mou, onClose, onConfirm }) => (
  <div style={S.overlay}>
    <motion.div initial={{ y: 30, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0, scale: 0.95 }} style={{ ...S.modal, maxWidth: 400, textAlign: "center" }}>
      <div style={{ padding: 32 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 16px", background: type === "approve" ? "#dcfce7" : "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${type === "approve" ? "#16a34a" : "#dc2626"}` }}>
          {type === "approve" ? <CheckCircle size={36} color="#16a34a" /> : <XCircle size={36} color="#dc2626" />}
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#193648", marginBottom: 8 }}>{type === "approve" ? "Approve this MOU?" : "Reject this MOU?"}</div>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
          {type === "approve" ? `Stamp "APPROVED" on behalf of ${mou?.university}. Industry will be notified.` : `Mark the MOU as Rejected. Industry will be notified.`}
        </div>
        {type === "approve" && mou?.status === "Approved by Industry" && (
          <div style={{ background: "#dcfce7", border: "1px solid #16a34a", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#166534" }}>
            🎉 Industry already approved! This will mark the MOU as <strong>Mutually Approved</strong>.
          </div>
        )}
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button style={S.btnOutline} onClick={onClose}>Cancel</button>
          <button style={type === "approve" ? S.btnApprove : S.btnReject} onClick={onConfirm}>
            <Stamp size={14} />{type === "approve" ? " Confirm Approve" : " Confirm Reject"}
          </button>
        </div>
      </div>
    </motion.div>
  </div>
);

// ─── SMALL HELPERS ────────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div style={S.section}><div style={S.sectionTitle}>{title}</div>{children}</div>
);
const MouSection = ({ title, children }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontWeight: 700, color: "#193648", fontSize: 13, marginBottom: 6, borderBottom: "1px solid #f1f5f9", paddingBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{children}</div>
  </div>
);
const FormField = ({ label, value, onChange, type = "text", placeholder = "", options = [] }) => (
  <div style={{ marginBottom: 10 }}>
    {label && <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4, fontWeight: 600 }}>{label}</label>}
    {type === "textarea"
      ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...S.input, height: 80, resize: "vertical" }} />
      : type === "select"
        ? <select value={value} onChange={e => onChange(e.target.value)} style={S.input}>{options.map(o => <option key={o} value={o}>{o || "Select..."}</option>)}</select>
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={S.input} />
    }
  </div>
);
const StampBadge = ({ stamp, label }) => (
  <div style={{ border: `2px solid ${stamp.type === "approve" ? "#16a34a" : "#dc2626"}`, borderRadius: 8, padding: "8px 14px", background: stamp.type === "approve" ? "#f0fdf4" : "#fef2f2" }}>
    <div style={{ fontWeight: 800, fontSize: 12, color: stamp.type === "approve" ? "#16a34a" : "#dc2626" }}>{stamp.type === "approve" ? "✅ APPROVED" : "❌ REJECTED"} — {label}</div>
    <div style={{ fontSize: 11, color: "#64748b" }}>By: {stamp.by} on {fmtDate(stamp.date)}</div>
  </div>
);
const MeetingRow = ({ icon, label, val }) => (
  <div style={{ display: "flex", gap: 6, marginBottom: 4, fontSize: 12 }}>
    <span style={{ color: "#0284c7" }}>{icon}</span>
    <span style={{ color: "#64748b", minWidth: 120 }}>{label}:</span>
    <span style={{ color: "#193648", fontWeight: 600 }}>{val || "—"}</span>
  </div>
);
// ═══════════════════════════════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const S = {
  page:     { fontFamily: "'Segoe UI',sans-serif", minHeight: "100vh", background: "#e2eef9" },
  topbar:   { background: "linear-gradient(135deg,#193648,#193648)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.2)", position: "relative", zIndex: 100 },
  brand:    { display: "flex", alignItems: "center", gap: 10 },
  brandText:{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: 0.5 },
  brandSub: { color: "#e2eef9", fontSize: 12, borderLeft: "1px solid #ffffff33", paddingLeft: 10, marginLeft: 4 },
  topActions:{ display: "flex", alignItems: "center", gap: 12 },
  alertChip:{ background: "#fff4e6", color: "#b45309", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 },
  avatar:   { width: 34, height: 34, borderRadius: "50%", background: "#193648", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 },
  notifBtn: { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center", position: "relative" },
  notifDot: { position: "absolute", top: -6, right: -6, background: "#dc2626", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  notifPanel:{ position: "absolute", right: 0, top: 44, width: 340, background: "#fff", borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.15)", border: "1px solid #dbe7f3", maxHeight: 380, overflowY: "auto", zIndex: 200 },
  notifPanelHeader:{ padding: "12px 16px", borderBottom: "1px solid #e2eef9", display: "flex", justifyContent: "space-between", alignItems: "center" },
  clearBtn: { background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: 12, fontWeight: 600 },
  notifItem:{ padding: "10px 16px", borderBottom: "1px solid #e2eef9" },
  body:     { padding: 24, maxWidth: 1400, margin: "0 auto" },
  statsRow: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  statCard: { flex: 1, minWidth: 130, background: "#fff", borderRadius: 10, padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", borderLeft: "3px solid #193648" },
  toolbar:  { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" },
  searchBox:{ flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #dbe7f3", borderRadius: 8, padding: "8px 12px" },
  searchInput:{ flex: 1, border: "none", outline: "none", fontSize: 13, background: "transparent" },
  filterBox:{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #dbe7f3", borderRadius: 8, padding: "6px 12px" },
  filterSel:{ border: "none", outline: "none", fontSize: 13, background: "transparent" },
  createBtn:{ display: "flex", alignItems: "center", gap: 6, background: "#193648", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 16 },
  card:     { background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", transition: "all 0.2s" },
  cardUrgent:{ borderLeft: "4px solid #193648", background: "#f5f9fc" },
  urgentStrip:{ background: "#e2eef9", color: "#193648", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, marginBottom: 8, display: "inline-block" },
  cardTop:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  cardTitle:{ fontWeight: 700, color: "#193648", fontSize: 14, marginBottom: 3 },
  cardMeta: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" },
  changesBadge:{ display: "flex", alignItems: "center", gap: 5, background: "#e2eef9", color: "#193648", fontSize: 11, padding: "3px 10px", borderRadius: 6, marginBottom: 6, fontWeight: 600 },
  cardFooter:{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  empty:    { textAlign: "center", padding: 60, color: "#64748b", fontSize: 15 },

  btnOutline:        { display: "flex", alignItems: "center", gap: 5, background: "#fff", border: "1px solid #dbe7f3", color: "#193648", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  btnPrimary:        { display: "flex", alignItems: "center", gap: 5, background: "#193648", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  btnSend:           { display: "flex", alignItems: "center", gap: 5, background: "#193648", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  btnApprove:        { display: "flex", alignItems: "center", gap: 5, background: "#16a34a", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  btnReject:         { display: "flex", alignItems: "center", gap: 5, background: "#dc2626", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  btnMeeting:        { display: "flex", alignItems: "center", gap: 5, background: "#193648", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  btnDanger:         { display: "flex", alignItems: "center", gap: 5, background: "#fff1f2", color: "#dc2626", border: "1px solid #fecaca", padding: "8px 10px", borderRadius: 7, cursor: "pointer" },
  btnNotify:         { display: "flex", alignItems: "center", gap: 5, background: "#193648", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  btnIndustryApprove:{ display: "flex", alignItems: "center", gap: 5, background: "#16a34a", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 700 },
  btnDownload:       { display: "flex", alignItems: "center", gap: 5, background: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 700 },
  btnResponse:       { display: "flex", alignItems: "center", gap: 5, background: "#193648", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  uploadBtn:         { display: "inline-flex", alignItems: "center", gap: 5, background: "#e2eef9", border: "1px solid #dbe7f3", color: "#193648", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 },

  mouHeaderPreview:  { background: "linear-gradient(135deg,#e2eef9,#ffffff)", border: "1px solid #dbe7f3", borderRadius: 14, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, boxShadow: "0 2px 12px rgba(30,58,95,0.07)" },
  mouLogoBox:        { textAlign: "center", minWidth: 140, background: "#fff", borderRadius: 12, padding: "14px 20px", border: "1px solid #dbe7f3", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  mouLogoIconWrap:   { width: 54, height: 54, borderRadius: 8, background: "#e2eef9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", border: "1px solid #dbe7f3", overflow: "hidden" },
  mouLogoName:       { fontWeight: 800, color: "#193648", fontSize: 13 },
  mouLogoSub:        { fontSize: 11, color: "#64748b", marginTop: 3 },
  mouAgreementLabel: { fontWeight: 800, color: "#193648", fontSize: 15, marginTop: 8, textAlign: "center" },
  mouAgreementSub:   { fontSize: 12, color: "#64748b", marginTop: 2, textAlign: "center" },

  detailHeader:      { display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap", background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  backBtn:           { display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "1px solid #dbe7f3", color: "#64748b", padding: "7px 12px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" },
  detailBody:        { display: "flex", gap: 16 },
  detailLeft:        { flex: 1, minWidth: 0 },
  sidebar:           { width: 300, flexShrink: 0, background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", maxHeight: "calc(100vh - 180px)", overflowY: "auto", position: "sticky", top: 16 },
  sidebarTitle:      { fontWeight: 700, color: "#193648", fontSize: 13, marginBottom: 10, display: "flex", alignItems: "center", gap: 6, paddingBottom: 8, borderBottom: "1px solid #e2eef9" },
  sidebarEmpty:      { fontSize: 12, color: "#64748b", textAlign: "center", padding: 20 },
  changeItem:        { background: "#e2eef9", border: "1px solid #dbe7f3", borderRadius: 8, padding: "10px 12px", marginBottom: 8 },
  timeline:          { paddingLeft: 4 },
  timelineItem:      { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 },
  timelineDot:       { width: 20, height: 20, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#193648", color: "#fff" },
  downloadBanner:    { background: "linear-gradient(135deg,#dcfce7,#e6f9ee)", border: "1px solid #86efac", borderRadius: 12, padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },

  createBody:        { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  section:           { marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #e2eef9" },
  sectionTitle:      { fontWeight: 800, color: "#193648", fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 },
  grid2:             { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 },
  subLabel:          { fontWeight: 700, fontSize: 13, color: "#193648", display: "block", marginBottom: 8 },
  listItem:          { display: "flex", gap: 8, marginBottom: 6, alignItems: "center" },
  listInput:         { flex: 1, padding: "8px 12px", border: "1px solid #dbe7f3", borderRadius: 7, fontSize: 13, outline: "none", fontFamily: "inherit" },
  listRemove:        { background: "#fff1f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 6, padding: "5px 8px", cursor: "pointer" },
  addRowBtn:         { background: "transparent", border: "1px dashed #193648", color: "#193648", padding: "6px 14px", borderRadius: 7, cursor: "pointer", fontSize: 12, marginTop: 4 },
  input:             { width: "100%", padding: "9px 12px", border: "1px solid #dbe7f3", borderRadius: 7, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#ffffff" },
  mouDoc:            { background: "#fff", border: "1px solid #dbe7f3", borderRadius: 12, padding: 28, marginBottom: 16 },
  mouDocTitle:       { textAlign: "center", fontWeight: 800, fontSize: 18, color: "#193648", letterSpacing: 1, marginBottom: 6 },
  meetingCard:       { background: "#e2eef9", border: "1px solid #dbe7f3", borderRadius: 10, padding: "12px 16px", marginBottom: 12 },
  changesAlert:      { display: "flex", alignItems: "center", gap: 10, background: "#e2eef9", border: "1px solid #dbe7f3", borderRadius: 10, padding: "10px 16px", marginBottom: 12 },
  overlay:           { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal:             { background: "#fff", borderRadius: 14, width: "90%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  modalHeader:       { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #e2eef9" },
  modalBody:         { padding: "16px 20px" },
};
export default MouManagement;