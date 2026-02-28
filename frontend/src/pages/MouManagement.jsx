// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { PlusCircle, Clock, AlertTriangle, Search, Filter, X, Trash2, Plus, Minus } from "lucide-react";
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// import axios from 'axios';

// const API_URL = "http://localhost:5000/api/mous";
// const MAX_FILE_SIZE = 2 * 1024 * 1024;

// const MouManagement = () => {
//   const [mous, setMous] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [activityLog, setActivityLog] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [customFields, setCustomFields] = useState([{ label: "", value: "" }]);
//   const [formData, setFormData] = useState({
//     title: "",
//     university: "",
//     industry: "",
//     collaborationType: "",
//     startDate: "",
//     endDate: "",
//     description: "",
//     universityLogo: null,
//     industryLogo: null,
//   });

//   useEffect(() => {
//     fetchMous();
//   }, []);

//   const fetchMous = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(API_URL);
//       setMous(response.data);
//       const logs = response.data.slice(0, 5).map(m => {
//         const isExp = new Date(m.endDate).getTime() <= Date.now();
//         return isExp
//           ? `⚠️ MOU expired: ${m.university} × ${m.industry} (${m.endDate})`
//           : `✅ MOU created: ${m.title} between ${m.university} & ${m.industry} (${m.startDate})`;
//       });
//       setActivityLog(logs);
//     } catch (error) {
//       console.error("Error fetching MOUs:", error);
//       setError("Failed to load MOUs from server");
//       setActivityLog(["❌ Error loading MOUs from server"]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calcProgress = (start, end) => {
//     const s = new Date(start).getTime();
//     const e = new Date(end).getTime();
//     const now = Date.now();
//     if (isNaN(s) || isNaN(e) || e <= s) return 100;
//     const total = e - s;
//     const elapsed = Math.max(0, Math.min(now - s, total));
//     return Math.round((elapsed / total) * 100);
//   };

//   const isExpired = (m) => new Date(m.endDate).getTime() <= Date.now();
//   const isOngoing = (m) => new Date(m.endDate).getTime() > Date.now();

//   const filtered = mous.filter((m) => {
//     const q = searchTerm.trim().toLowerCase();
//     const matches =
//       !q ||
//       (m.university && m.university.toLowerCase().includes(q)) ||
//       (m.industry && m.industry.toLowerCase().includes(q));
//     if (!matches) return false;
//     if (filterStatus === "Ongoing") return isOngoing(m);
//     if (filterStatus === "Expired") return isExpired(m);
//     return true;
//   });

//   const expiringSoon = mous.filter((m) => {
//     const end = new Date(m.endDate).getTime();
//     const days = (end - Date.now()) / (1000 * 60 * 60 * 24);
//     return days > 0 && days <= 30;
//   });

//   const addCustomField = () => {
//     setCustomFields([...customFields, { label: "", value: "" }]);
//   };

//   const removeCustomField = (index) => {
//     setCustomFields(customFields.filter((_, i) => i !== index));
//   };

//   const updateCustomField = (index, field, value) => {
//     const updated = [...customFields];
//     updated[index][field] = value;
//     setCustomFields(updated);
//   };

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     try {
//       let universityLogoData = null;
//       let industryLogoData = null;

//       if (formData.universityLogo) {
//         const reader = new FileReader();
//         universityLogoData = await new Promise((resolve, reject) => {
//           reader.onload = () => resolve(reader.result.split(',')[1]);
//           reader.onerror = reject;
//           reader.readAsDataURL(formData.universityLogo);
//         });
//       }

//       if (formData.industryLogo) {
//         const reader = new FileReader();
//         industryLogoData = await new Promise((resolve, reject) => {
//           reader.onload = () => resolve(reader.result.split(',')[1]);
//           reader.onerror = reject;
//           reader.readAsDataURL(formData.industryLogo);
//         });
//       }

//       const filteredCustomFields = customFields.filter(f => f.label.trim() && f.value.trim());

//       const newMouData = {
//         title: formData.title,
//         university: formData.university,
//         industry: formData.industry,
//         collaborationType: formData.collaborationType,
//         startDate: formData.startDate,
//         endDate: formData.endDate,
//         description: formData.description,
//         customFields: filteredCustomFields,
//         universityLogoData,
//         industryLogoData,
//         extraDetails: [],
//         signatories: { university: "", industry: "" },
//         universityContact: { name: "", designation: "", email: "" },
//         industryContact: { name: "", designation: "", email: "" },
//         status: "Draft",
//       };

//       console.log("Generating PDF...");
//       const pdfBase64 = await generateFormalMouPDF(newMouData, true);
//       newMouData.pdfData = pdfBase64;

//       const dataSize = JSON.stringify(newMouData).length;
//       console.log(`Total MOU data size: ${(dataSize / 1024 / 1024).toFixed(2)} MB`);
//       if (dataSize > 15 * 1024 * 1024) {
//         alert("MOU data too large (>15MB). Try using smaller logo files.");
//         return;
//       }

//       console.log("Saving to backend...");
//       const response = await axios.post(API_URL, newMouData, {
//         timeout: 30000,
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       console.log("MOU saved successfully:", response.data);

//       setMous((s) => [response.data, ...s]);
//       setActivityLog((a) => [
//         `✅ MOU created: ${response.data.title} between ${response.data.university} & ${response.data.industry} (Starts ${response.data.startDate})`,
//         ...a.slice(0, 4),
//       ]);

//       const pdfBytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
//       const blob = new Blob([pdfBytes], { type: "application/pdf" });
//       const url = URL.createObjectURL(blob);
//       window.open(url, "_blank");

//       setFormData({
//         title: "",
//         university: "",
//         industry: "",
//         collaborationType: "",
//         startDate: "",
//         endDate: "",
//         description: "",
//         universityLogo: null,
//         industryLogo: null,
//       });
//       setCustomFields([{ label: "", value: "" }]);
//       setShowModal(false);
//       alert("MOU created successfully!");
//     } catch (error) {
//       console.error("Error creating MOU:", error);
//       if (error.response) {
//         console.error("Server response:", error.response.data);
//         console.error("Status code:", error.response.status);
//         alert(`Failed to create MOU: ${error.response.data.message || error.response.data.error || 'Server error'}`);
//       } else if (error.request) {
//         console.error("No response received:", error.request);
//         alert("Failed to create MOU: No response from server. Check if backend is running.");
//       } else {
//         console.error("Error details:", error.message);
//         alert(`Failed to create MOU: ${error.message}`);
//       }
//     }
//   };

//   const handleDelete = async (mouId) => {
//     if (!window.confirm("Are you sure you want to delete this MOU?")) return;
//     try {
//       await axios.delete(`${API_URL}/${mouId}`);
//       setMous((s) => s.filter(m => m._id !== mouId));
//       setActivityLog((a) => [`🗑️ MOU deleted`, ...a.slice(0, 4)]);
//       alert("MOU deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting MOU:", error);
//       alert(`Failed to delete MOU: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   // FIXED: Utility function to wrap text without recursion
//   const wrapText = (text = "", maxChars = 90) => {
//     if (!text) return [""];
//     const words = text.split(" ");
//     const lines = [];
//     let cur = "";
//     words.forEach(w => {
//       if ((cur + " " + w).trim().length > maxChars) {
//         if (cur) lines.push(cur.trim());
//         cur = w;
//       } else {
//         cur = (cur + " " + w).trim();
//       }
//     });
//     if (cur) lines.push(cur.trim());
//     return lines;
//   };

//   // FIXED: Non-recursive text drawing with proper page management
//   const drawWrappedText = (pdfDoc, currentPage, text, x, startY, rightLimit, font, size, lineHeight) => {
//     const maxChars = Math.floor((rightLimit - x) / (size * 0.6));
//     const lines = wrapText(text, maxChars);
//     let y = startY;
//     let page = currentPage;
    
//     for (const line of lines) {
//       // Check if we need a new page
//       if (y < 70) {
//         page = pdfDoc.addPage([612, 792]);
//         y = page.getHeight() - 60;
//       }
      
//       page.drawText(line, { x, y, font, size, color: rgb(0, 0, 0) });
//       y -= lineHeight;
//     }
    
//     return { page, y };
//   };

//   const drawSectionHeading = (page, text, x, y, boldFont, size) => {
//     page.drawText(text, { x, y, font: boldFont, size, color: rgb(0, 0, 0) });
//     y -= size + 4;
//     return y;
//   };

//   const generateFormalMouPDF = async (mou, returnBase64 = false) => {
//     try {
//       const pdfDoc = await PDFDocument.create();
//       const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//       const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
//       const pageWidth = 612;
//       const pageHeight = 792;
//       const left = 60;
//       const right = pageWidth - 60;

//       // PAGE 1: Cover page with logos
//       const coverPage = pdfDoc.addPage([pageWidth, pageHeight]);
//       let cy = coverPage.getHeight() - 100;

//       // Title at top
//       const title = "MEMORANDUM OF UNDERSTANDING";
//       const titleSize = 16;
//       const titleWidth = boldFont.widthOfTextAtSize(title, titleSize);
//       coverPage.drawText(title, { 
//         x: (pageWidth - titleWidth) / 2, 
//         y: cy, 
//         font: boldFont, 
//         size: titleSize, 
//         color: rgb(0, 0, 0) 
//       });
//       cy -= 80;

//       // Logos section
//       const logoSize = 80;
//       const handshakeSize = 50;
//       const totalWidth = logoSize + handshakeSize + logoSize + 60;
//       const startX = (pageWidth - totalWidth) / 2;

//       // University Logo
//       if (mou.universityLogoData) {
//         try {
//           const logoBytes = Uint8Array.from(atob(mou.universityLogoData), c => c.charCodeAt(0));
//           const uniLogo = await pdfDoc.embedPng(logoBytes);
//           const logoDims = uniLogo.scale(logoSize / Math.max(uniLogo.width, uniLogo.height));
//           coverPage.drawImage(uniLogo, {
//             x: startX,
//             y: cy - logoSize / 2,
//             width: logoDims.width,
//             height: logoDims.height,
//           });
//         } catch (err) {
//           console.error("Failed to embed university logo:", err);
//         }
//       } else {
//         coverPage.drawRectangle({
//           x: startX,
//           y: cy - logoSize / 2,
//           width: logoSize,
//           height: logoSize,
//           borderColor: rgb(0.7, 0.7, 0.7),
//           borderWidth: 1,
//         });
//         coverPage.drawText("University", {
//           x: startX + 10,
//           y: cy,
//           font: font,
//           size: 10,
//           color: rgb(0.5, 0.5, 0.5),
//         });
//       }

//       // Handshake icon
//       const handshakeX = startX + logoSize + 30;
//       const handshakeY = cy;
      
//       coverPage.drawCircle({
//         x: handshakeX,
//         y: handshakeY,
//         size: handshakeSize / 2,
//         borderColor: rgb(0.2, 0.4, 0.6),
//         borderWidth: 2,
//       });
      
//       coverPage.drawRectangle({
//         x: handshakeX - 18,
//         y: handshakeY - 5,
//         width: 15,
//         height: 10,
//         color: rgb(0.2, 0.4, 0.6),
//       });
      
//       coverPage.drawRectangle({
//         x: handshakeX + 3,
//         y: handshakeY - 5,
//         width: 15,
//         height: 10,
//         color: rgb(0.2, 0.4, 0.6),
//       });
      
//       coverPage.drawCircle({
//         x: handshakeX,
//         y: handshakeY,
//         size: 6,
//         color: rgb(0.2, 0.4, 0.6),
//       });

//       // Industry Logo
//       const industryX = handshakeX + handshakeSize + 30;
//       if (mou.industryLogoData) {
//         try {
//           const logoBytes = Uint8Array.from(atob(mou.industryLogoData), c => c.charCodeAt(0));
//           const indLogo = await pdfDoc.embedPng(logoBytes);
//           const logoDims = indLogo.scale(logoSize / Math.max(indLogo.width, indLogo.height));
//           coverPage.drawImage(indLogo, {
//             x: industryX,
//             y: cy - logoSize / 2,
//             width: logoDims.width,
//             height: logoDims.height,
//           });
//         } catch (err) {
//           console.error("Failed to embed industry logo:", err);
//         }
//       } else {
//         coverPage.drawRectangle({
//           x: industryX,
//           y: cy - logoSize / 2,
//           width: logoSize,
//           height: logoSize,
//           borderColor: rgb(0.7, 0.7, 0.7),
//           borderWidth: 1,
//         });
//         coverPage.drawText("Industry", {
//           x: industryX + 15,
//           y: cy,
//           font: font,
//           size: 10,
//           color: rgb(0.5, 0.5, 0.5),
//         });
//       }

//       cy -= 120;

//       // Names below logos
//       const uniName = mou.university || "University";
//       const indName = mou.industry || "Industry";
//       const uniWidth = boldFont.widthOfTextAtSize(uniName, 12);
//       const indWidth = boldFont.widthOfTextAtSize(indName, 12);
      
//       coverPage.drawText(uniName, {
//         x: startX + (logoSize - uniWidth) / 2,
//         y: cy,
//         font: boldFont,
//         size: 12,
//         color: rgb(0, 0, 0),
//       });

//       coverPage.drawText(indName, {
//         x: industryX + (logoSize - indWidth) / 2,
//         y: cy,
//         font: boldFont,
//         size: 12,
//         color: rgb(0, 0, 0),
//       });

//       cy -= 60;

//       // Custom fields on cover page
//       if (mou.customFields && mou.customFields.length > 0) {
//         coverPage.drawText("Additional Information:", {
//           x: left,
//           y: cy,
//           font: boldFont,
//           size: 11,
//           color: rgb(0, 0, 0),
//         });
//         cy -= 20;

//         for (const field of mou.customFields) {
//           const fieldText = `${field.label}: ${field.value}`;
//           const result = drawWrappedText(pdfDoc, coverPage, fieldText, left, cy, right, font, 10, 14);
//           cy = result.y - 5;
//         }
//       }

//       // PAGE 2: MOU Content
//       let page = pdfDoc.addPage([pageWidth, pageHeight]);
//       let y = page.getHeight() - 70;
//       const lineHeight = 16;
//       const textColor = rgb(0, 0, 0);

//       // Centered Title
//       const pageTitle = "MEMORANDUM OF UNDERSTANDING (MOU)";
//       const pageTitleSize = 14;
//       const pageTitleWidth = boldFont.widthOfTextAtSize(pageTitle, pageTitleSize);
//       page.drawText(pageTitle, { 
//         x: (pageWidth - pageTitleWidth) / 2, 
//         y, 
//         font: boldFont, 
//         size: pageTitleSize, 
//         color: textColor 
//       });
//       y -= 28;

//       // Intro paragraph
//       const intro = `This Memorandum of Understanding (MOU) is made and entered into by and between ${mou.university || "the University"} (hereinafter referred to as "the University") and ${mou.industry || "the Industry"} (hereinafter referred to as "the Industry").`;
//       let result = drawWrappedText(pdfDoc, page, intro, left, y, right, font, 11, lineHeight);
//       page = result.page;
//       y = result.y - 8;

//       const refLine = `Title: ${mou.title || "—"} | Type: ${mou.collaborationType || "—"} | Effective: ${mou.startDate || "—"} to ${mou.endDate || "—"}`;
//       result = drawWrappedText(pdfDoc, page, refLine, left, y, right, font, 10, lineHeight);
//       page = result.page;
//       y = result.y - 12;

//       // 1. Parties
//       if (y < 100) {
//         page = pdfDoc.addPage([pageWidth, pageHeight]);
//         y = page.getHeight() - 60;
//       }
//       y = drawSectionHeading(page, "1. PARTIES", left, y, boldFont, 12);
      
//       const p1a = `1.1 University: ${mou.university || "—"}.`;
//       result = drawWrappedText(pdfDoc, page, p1a, left + 10, y, right, font, 11, lineHeight);
//       page = result.page;
//       y = result.y;
      
//       const p1b = `1.2 Industry: ${mou.industry || "—"}.`;
//       result = drawWrappedText(pdfDoc, page, p1b, left + 10, y, right, font, 11, lineHeight);
//       page = result.page;
//       y = result.y - 6;

//       // 2. Purpose
//       if (y < 100) {
//         page = pdfDoc.addPage([pageWidth, pageHeight]);
//         y = page.getHeight() - 60;
//       }
//       y = drawSectionHeading(page, "2. PURPOSE", left, y, boldFont, 12);
//       const purpose = mou.description && mou.description.trim().length > 0
//         ? `The purpose of this MOU is to establish collaborative activities between the parties in relation to ${mou.description}.`
//         : `The purpose of this MOU is to establish collaborative activities between the parties, including but not limited to research, internships, training, and consultancy services as mutually agreed.`;
//       result = drawWrappedText(pdfDoc, page, purpose, left + 10, y, right, font, 11, lineHeight);
//       page = result.page;
//       y = result.y - 6;

//       // 3. Scope
//       if (y < 150) {
//         page = pdfDoc.addPage([pageWidth, pageHeight]);
//         y = page.getHeight() - 60;
//       }
//       y = drawSectionHeading(page, "3. SCOPE & RESPONSIBILITIES", left, y, boldFont, 12);
//       const scopeLines = [
//         `${mou.university || "The University"} agrees to provide academic supervision, access to subject matter expertise and student involvement as appropriate.`,
//         `${mou.industry || "The Industry"} agrees to provide practical guidance, access to facilities and industrial data, and mentorship where applicable.`,
//         `Specific responsibilities of each party shall be agreed upon in writing and appended to this MOU where necessary.`
//       ];
//       for (const s of scopeLines) {
//         result = drawWrappedText(pdfDoc, page, `• ${s}`, left + 12, y, right, font, 11, lineHeight);
//         page = result.page;
//         y = result.y;
//       }
//       y -= 6;

//       // 4. Duration
//       if (y < 100) {
//         page = pdfDoc.addPage([pageWidth, pageHeight]);
//         y = page.getHeight() - 60;
//       }
//       y = drawSectionHeading(page, "4. DURATION", left, y, boldFont, 12);
//       const duration = `This MOU shall commence on ${mou.startDate || "—"} and remain in effect until ${mou.endDate || "—"}, unless earlier terminated in accordance with Section 6.`;
//       result = drawWrappedText(pdfDoc, page, duration, left + 10, y, right, font, 11, lineHeight);
//       page = result.page;
//       y = result.y - 6;

//       // 5. Confidentiality
//       if (y < 100) {
//         page = pdfDoc.addPage([pageWidth, pageHeight]);
//         y = page.getHeight() - 60;
//       }
//       y = drawSectionHeading(page, "5. CONFIDENTIALITY", left, y, boldFont, 12);
//       const conf = `Each party agrees to maintain confidentiality of shared proprietary information and to use such information only for the purposes set forth in this MOU, except as required by law or by prior written consent of the disclosing party.`;
//       result = drawWrappedText(pdfDoc, page, conf, left + 10, y, right, font, 11, lineHeight);
//       page = result.page;
//       y = result.y - 6;

//       // 6. Termination
//       if (y < 100) {
//         page = pdfDoc.addPage([pageWidth, pageHeight]);
//         y = page.getHeight() - 60;
//       }
//       y = drawSectionHeading(page, "6. TERMINATION", left, y, boldFont, 12);
//       const term = `Either party may terminate this MOU by providing thirty (30) days' prior written notice to the other party. Termination shall not affect accrued rights or obligations of either party at the date of termination.`;
//       result = drawWrappedText(pdfDoc, page, term, left + 10, y, right, font, 11, lineHeight);
//       page = result.page;
//       y = result.y - 10;

//       // 7. Signatures
//       if (y < 170) {
//         page = pdfDoc.addPage([pageWidth, pageHeight]);
//         y = page.getHeight() - 60;
//       }
//       page.drawText("7. SIGNATURES", { x: left, y, font: boldFont, size: 12, color: textColor });
//       y -= (lineHeight + 6);

//       const sigBlockTop = y;
//       const colWidth = (pageWidth - left * 2) / 2;
//       const leftX = left;
//       const rightX = left + colWidth + 10;

//       page.drawText("For the University:", { x: leftX, y: sigBlockTop, font: font, size: 11, color: textColor });
//       page.drawText(`Name & Title: ____________________________`, { x: leftX, y: sigBlockTop - lineHeight, font: font, size: 11 });
//       page.drawText(`Signature: _______________________________`, { x: leftX, y: sigBlockTop - lineHeight * 2, font: font, size: 11 });
//       page.drawText(`Date: _________________________________`, { x: leftX, y: sigBlockTop - lineHeight * 3, font: font, size: 11 });

//       page.drawText("For the Industry:", { x: rightX, y: sigBlockTop, font: font, size: 11, color: textColor });
//       page.drawText(`Name & Title: ____________________________`, { x: rightX, y: sigBlockTop - lineHeight, font: font, size: 11 });
//       page.drawText(`Signature: _______________________________`, { x: rightX, y: sigBlockTop - lineHeight * 2, font: font, size: 11 });
//       page.drawText(`Date: _________________________________`, { x: rightX, y: sigBlockTop - lineHeight * 3, font: font, size: 11 });

//       const pdfBytes = await pdfDoc.save();
//       if (returnBase64) {
//         return btoa(String.fromCharCode(...pdfBytes));
//       } else {
//         const blob = new Blob([pdfBytes], { type: "application/pdf" });
//         const url = URL.createObjectURL(blob);
//         window.open(url, "_blank");
//       }
//     } catch (err) {
//       console.error("Error generating MOU PDF:", err);
//       throw err;
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.header}>
//         <div>
//           <h1 style={styles.title}>MOU Management</h1>
//           <p style={styles.subtitle}>Manage MOUs — create, monitor timelines and expiries.</p>
//         </div>
//         <div style={styles.headerActions}>
//           <div style={styles.searchWrapper}>
//             <Search size={16} color="#193648" />
//             <input
//               style={styles.searchInput}
//               placeholder="Search by industry name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div style={styles.filterWrapper}>
//             <Filter size={16} color="#193648" />
//             <select
//               style={styles.filterSelect}
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//             >
//               <option>All</option>
//               <option>Ongoing</option>
//               <option>Expired</option>
//             </select>
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.97 }}
//             style={styles.createBtn}
//             onClick={() => setShowModal(true)}
//           >
//             <PlusCircle size={16} />
//             Create MOU
//           </motion.button>
//         </div>
//       </div>

//       <div style={styles.summaryRow}>
//         <div style={styles.statCard}>
//           <div style={styles.statTitle}>Total MOUs</div>
//           <div style={styles.statValue}>{mous.length}</div>
//         </div>
//         <div style={styles.statCard}>
//           <div style={styles.statTitle}>Ongoing</div>
//           <div style={styles.statValue}>{mous.filter(isOngoing).length}</div>
//         </div>
//         <div style={styles.statCard}>
//           <div style={styles.statTitle}>Expired</div>
//           <div style={{ ...styles.statValue, color: "#9a2f2f" }}>{mous.filter(isExpired).length}</div>
//         </div>
//         <div style={styles.statCard}>
//           <div style={styles.statTitle}>Expiring soon</div>
//           <div style={{ ...styles.statValue, color: "#a35b00" }}>{expiringSoon.length}</div>
//         </div>
//       </div>

//       {expiringSoon.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           style={styles.alert}
//         >
//           <AlertTriangle size={18} color="#a35b00" />
//           <div style={{ marginLeft: 12 }}>
//             <strong style={{ color: "#8a5b00" }}>{expiringSoon.length} MOUs expiring soon</strong>
//             <div style={{ fontSize: 13, color: "#6b4f00", marginTop: 6 }}>
//               {expiringSoon.map((m) => (
//                 <div key={m._id}>
//                   • {m.university} × {m.industry} — ends {m.endDate}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </motion.div>
//       )}

//       {error && (
//         <div style={{ ...styles.alert, background: "#ffebee" }}>
//           <AlertTriangle size={18} color="#c62828" />
//           <div style={{ marginLeft: 12, color: "#c62828" }}>{error}</div>
//         </div>
//       )}

//       <div style={styles.grid}>
//         <div style={styles.leftCol}>
//           {loading ? (
//             <div style={styles.empty}>Loading MOUs...</div>
//           ) : (
//             <div style={styles.cardGrid}>
//               {filtered.length === 0 ? (
//                 <div style={styles.empty}>
//                   <div style={{ fontSize: 18, fontWeight: 600, color: "#193648" }}>
//                     No MOUs match your search.
//                   </div>
//                   <div style={{ color: "#2b5b94", marginTop: 8 }}>
//                     Try clearing filters or add a new MOU.
//                   </div>
//                 </div>
//               ) : (
//                 filtered.map((m) => {
//                   const progress = calcProgress(m.startDate, m.endDate);
//                   return (
//                     <motion.div
//                       key={m._id}
//                       whileHover={{ translateY: -4, boxShadow: "0 12px 20px rgba(0,0,0,0.08)" }}
//                       style={{ ...styles.card, ...(isExpired(m) ? styles.expiredCard : {}) }}
//                     >
//                       <div style={styles.cardHeader}>
//                         <div>
//                           <div style={styles.cardTitle}>{m.university}</div>
//                           <div style={styles.cardSubtitle}>Partner: {m.industry}</div>
//                         </div>
//                         <div style={{ textAlign: "right" }}>
//                           <Clock size={18} color="#193648" />
//                           <div style={{ fontSize: 12, color: "#193648", marginTop: 6 }}>
//                             {m.startDate} → {m.endDate}
//                           </div>
//                         </div>
//                       </div>
//                       <div style={styles.desc}>{m.description || "—"}</div>
//                       <div style={styles.progressWrap}>
//                         <div style={styles.progressLabel}>
//                           <div style={{ fontSize: 12, color: "#193648" }}>
//                             Progress: {progress}%
//                           </div>
//                           <div style={{ fontSize: 12, color: isExpired(m) ? "#9a2f2f" : "#193648" }}>
//                             {isExpired(m) ? "Expired" : "Ongoing"}
//                           </div>
//                         </div>
//                         <div style={styles.progressBar}>
//                           <div style={{ ...styles.progressFill, width: `${progress}%` }} />
//                         </div>
//                       </div>
//                       <div style={styles.cardActions}>
//                         <button
//                           style={styles.pdfBtn}
//                           onClick={() => generateFormalMouPDF(m)}
//                           title="Download MOU PDF"
//                         >
//                           Download PDF
//                         </button>
//                         <button
//                           style={styles.deleteBtn}
//                           onClick={() => handleDelete(m._id)}
//                           title="Delete MOU"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </motion.div>
//                   );
//                 })
//               )}
//             </div>
//           )}
//         </div>

//         <div style={styles.rightCol}>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             style={styles.activity}
//           >
//             <div style={styles.activityHeader}>
//               <h3 style={{ margin: 0 }}>Tips</h3>
//             </div>
//             <div style={{ fontSize: 12, color: "#193648" }}>
//               • Use search & filter to quickly find MOUs.<br />
//               • Preview the formal MOU in a new tab before saving.<br />
//               • Upload PNG logos for best quality.<br />
//               • Add custom fields for additional information.<br />
//             </div>
//           </motion.div>
//           <div style={styles.activity}>
//             <div style={styles.activityHeader}>
//               <h3 style={{ margin: 0 }}>Industry Engagement Tracking</h3>
//             </div>
//             <div style={{ fontSize: 12, color: "#193648" }}>
//               {[
//                 { name: "TechNova Pvt Ltd", activity: 90 },
//                 { name: "InnoSoft Solutions", activity: 70 },
//                 { name: "NextGen Robotics", activity: 50 },
//                 { name: "CloudEdge Systems", activity: 40 },
//                 { name: "GreenEnergy Labs", activity: 30 },
//               ].map((ind, i) => (
//                 <div key={i} style={{ marginBottom: 10 }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
//                     <span>{ind.name}</span>
//                     <span>{ind.activity}%</span>
//                   </div>
//                   <div style={{ height: 6, borderRadius: 3, background: "#e0e0e0", overflow: "hidden", marginTop: 3 }}>
//                     <div
//                       style={{
//                         width: `${ind.activity}%`,
//                         height: "100%",
//                         background: "#447da0ff",
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div style={styles.activity}>
//             <div style={styles.activityHeader}>
//               <h3 style={{ margin: 0 }}>System Suggested Industries</h3>
//             </div>
//             <div style={{ fontSize: 12, color: "#193648", lineHeight: 1.6 }}>
//               <div>• AI Dynamics Pvt Ltd — ideal for research collaboration</div>
//               <div>• VisionWare Technologies — recommended for internships</div>
//               <div>• DataBridge Analytics — suggested for consultancy</div>
//               <div>• AutoSmart Industries — emerging in industrial automation</div>
//             </div>
//           </div>
//           <div style={styles.activity}>
//             <div style={styles.activityHeader}>
//               <h3 style={{ margin: 0 }}>Recent Activity</h3>
//               <div style={{ fontSize: 13, color: "#2b5b94" }}>{activityLog.length} items</div>
//             </div>
//             <div style={styles.activityList}>
//               {activityLog.map((a, i) => (
//                 <div key={i} style={styles.activityItem}>{a}</div>
//               ))}
//             </div>
//           </div>
//           <div style={styles.activity}>
//             <div style={styles.activityHeader}>
//               <h3 style={{ margin: 0 }}>Expiring MOUs</h3>
//               <div style={{ fontSize: 13, color: "#2b5b94" }}>{expiringSoon.length} items</div>
//             </div>
//             <div style={styles.activityList}>
//               {expiringSoon.length === 0 ? (
//                 <div style={styles.activityItem}>No MOUs expiring soon</div>
//               ) : (
//                 expiringSoon.map((m) => (
//                   <div key={m._id} style={{ ...styles.activityItem, color: "#9a2f2f" }}>
//                     {m.university} × {m.industry} — ends {m.endDate}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {showModal && (
//         <div style={styles.modalOverlay}>
//           <motion.div
//             initial={{ y: 50, opacity: 0, scale: 0.9 }}
//             animate={{ y: 0, opacity: 1, scale: 1 }}
//             exit={{ y: 50, opacity: 0, scale: 0.9 }}
//             transition={{ type: "spring", stiffness: 120, damping: 15 }}
//             style={styles.modal}
//           >
//             <div style={styles.modalHeader}>
//               <h3>Create MOU</h3>
//               <X size={20} style={{ cursor: "pointer" }} onClick={() => setShowModal(false)} />
//             </div>
//             <motion.form
//               onSubmit={handleCreate}
//               style={styles.form}
//               initial="hidden"
//               animate="visible"
//               variants={{
//                 hidden: {},
//                 visible: { transition: { staggerChildren: 0.06 } },
//               }}
//             >
//               <label><strong>Basic Details</strong></label>
//               <input
//                 placeholder="MOU Title"
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                 required
//                 style={inputStyle}
//               />
//               <input
//                 placeholder="University Name"
//                 value={formData.university}
//                 onChange={(e) => setFormData({ ...formData, university: e.target.value })}
//                 required
//                 style={inputStyle}
//               />
//               <input
//                 placeholder="Industry Name"
//                 value={formData.industry}
//                 onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
//                 required
//                 style={inputStyle}
//               />
//               <select
//                 value={formData.collaborationType}
//                 onChange={(e) => setFormData({ ...formData, collaborationType: e.target.value })}
//                 style={inputStyle}
//                 required
//               >
//                 <option value="">Select Collaboration Type</option>
//                 <option>Research</option>
//                 <option>Internship</option>
//                 <option>Training</option>
//                 <option>Consultancy</option>
//               </select>
//               <div style={{ display: "flex", gap: 8 }}>
//                 <input
//                   type="date"
//                   value={formData.startDate}
//                   onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
//                   required
//                   style={{ ...inputStyle, width: "50%" }}
//                 />
//                 <input
//                   type="date"
//                   value={formData.endDate}
//                   onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
//                   required
//                   style={{ ...inputStyle, width: "50%" }}
//                 />
//               </div>
//               <textarea
//                 placeholder="Short purpose (optional)"
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 style={{ height: 70, padding: "8px", borderRadius: 6, border: "1px solid #ccc", marginBottom: 6 }}
//               />
              
//               <label><strong>Logos (PNG format recommended)</strong></label>
//               <div style={{ marginBottom: 6 }}>
//                 <label style={{ fontSize: 12, color: "#2b5b94" }}>University Logo:</label>
//                 <input
//                   type="file"
//                   accept=".png,.jpg,.jpeg"
//                   onChange={(e) => {
//                     const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
//                     if (file && file.size > MAX_FILE_SIZE) {
//                       alert(`File too large! Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
//                       e.target.value = "";
//                       return;
//                     }
//                     setFormData({ ...formData, universityLogo: file });
//                   }}
//                   style={inputStyle}
//                 />
//                 {formData.universityLogo && (
//                   <div style={{ fontSize: 11, color: "#2b5b94", marginTop: 2 }}>
//                     ✓ {formData.universityLogo.name}
//                   </div>
//                 )}
//               </div>
              
//               <div style={{ marginBottom: 6 }}>
//                 <label style={{ fontSize: 12, color: "#2b5b94" }}>Industry Logo:</label>
//                 <input
//                   type="file"
//                   accept=".png,.jpg,.jpeg"
//                   onChange={(e) => {
//                     const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
//                     if (file && file.size > MAX_FILE_SIZE) {
//                       alert(`File too large! Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
//                       e.target.value = "";
//                       return;
//                     }
//                     setFormData({ ...formData, industryLogo: file });
//                   }}
//                   style={inputStyle}
//                 />
//                 {formData.industryLogo && (
//                   <div style={{ fontSize: 11, color: "#2b5b94", marginTop: 2 }}>
//                     ✓ {formData.industryLogo.name}
//                   </div>
//                 )}
//               </div>

//               <label><strong>Custom Fields</strong></label>
//               {customFields.map((field, index) => (
//                 <div key={index} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
//                   <input
//                     placeholder="Field Label (e.g., Department)"
//                     value={field.label}
//                     onChange={(e) => updateCustomField(index, 'label', e.target.value)}
//                     style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
//                   />
//                   <input
//                     placeholder="Field Value"
//                     value={field.value}
//                     onChange={(e) => updateCustomField(index, 'value', e.target.value)}
//                     style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
//                   />
//                   {customFields.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeCustomField(index)}
//                       style={{ 
//                         background: "#9a2f2f", 
//                         color: "#fff", 
//                         border: "none", 
//                         borderRadius: 4, 
//                         padding: "6px 8px", 
//                         cursor: "pointer" 
//                       }}
//                     >
//                       <Minus size={14} />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 onClick={addCustomField}
//                 style={{ 
//                   marginBottom: 12, 
//                   padding: "6px 12px", 
//                   borderRadius: 6, 
//                   border: "1px solid #193648", 
//                   background: "#fff", 
//                   color: "#193648", 
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 4,
//                   fontSize: 13
//                 }}
//               >
//                 <Plus size={14} /> Add Custom Field
//               </button>

//               <motion.button
//                 type="submit"
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.98 }}
//                 style={{ 
//                   marginTop: 12, 
//                   padding: "10px 20px", 
//                   borderRadius: 6, 
//                   border: "none", 
//                   background: "#193648", 
//                   color: "#fff", 
//                   fontWeight: 600, 
//                   cursor: "pointer" 
//                 }}
//               >
//                 Generate & Preview MOU
//               </motion.button>
//             </motion.form>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   page: { padding: 20, fontFamily: "sans-serif", background: "#f5f8fb", minHeight: "100vh" },
//   header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap" },
//   title: { margin: 0, fontSize: 26, color: "#193648" },
//   subtitle: { margin: 0, fontSize: 14, color: "#2b5b94" },
//   headerActions: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },
//   searchWrapper: { display: "flex", alignItems: "center", background: "#fff", borderRadius: 6, padding: "4px 8px", gap: 4, border: "1px solid #ccc" },
//   searchInput: { border: "none", outline: "none", padding: 4, width: 180 },
//   filterWrapper: { display: "flex", alignItems: "center", background: "#fff", borderRadius: 6, padding: "4px 8px", gap: 4, border: "1px solid #ccc" },
//   filterSelect: { border: "none", outline: "none", background: "transparent", fontSize: 13 },
//   createBtn: { display: "flex", alignItems: "center", gap: 6, background: "#174866ff", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 600 },
//   summaryRow: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 },
//   statCard: { flex: 1, minWidth: 120, background: "#fff", padding: 12, borderRadius: 6, boxShadow: "0 4px 8px rgba(0,0,0,0.05)" },
//   statTitle: { fontSize: 12, color: "#2b5b94" },
//   statValue: { fontSize: 20, fontWeight: 600, color: "#193648" },
//   alert: { display: "flex", alignItems: "flex-start", background: "#fff8e1", padding: 12, borderRadius: 6, gap: 8, marginBottom: 20 },
//   grid: { display: "flex", gap: 12, flexWrap: "wrap" },
//   leftCol: { flex: 3, minWidth: 320 },
//   rightCol: { flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 12 },
//   cardGrid: { display: "flex", flexDirection: "column", gap: 12 },
//   card: { background: "#fff", borderRadius: 6, padding: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
//   expiredCard: { background: "#fdecea" },
//   cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
//   cardTitle: { fontWeight: 600, color: "#193648" },
//   cardSubtitle: { fontSize: 13, color: "#2b5b94" },
//   desc: { fontSize: 13, color: "#193648", marginBottom: 6 },
//   progressWrap: { marginTop: 6 },
//   progressLabel: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
//   progressBar: { height: 6, borderRadius: 3, background: "#e0e0e0", overflow: "hidden" },
//   progressFill: { height: "100%", background: "#115077ff" },
//   cardActions: { marginTop: 6, textAlign: "right", display: "flex", gap: 8, justifyContent: "flex-end" },
//   pdfBtn: { background: "#2b5b94", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer" },
//   deleteBtn: { background: "#9a2f2f", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },
//   activity: { background: "#fff", borderRadius: 6, padding: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
//   activityHeader: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
//   activityList: { fontSize: 12, color: "#37576bff" },
//   activityItem: { marginBottom: 4 },
//   empty: { padding: 40, textAlign: "center" },
//   modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.35)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99 },
//   modal: { background: "#fff", padding: 20, borderRadius: 8, width: "90%", maxWidth: 500, maxHeight: "90%", overflowY: "auto" },
//   modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
//   form: { display: "flex", flexDirection: "column" },
// };

// const inputStyle = { padding: "8px", borderRadius: 6, border: "1px solid #ccc", marginBottom: 6, width: "100%" };

// export default MouManagement;

// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   PlusCircle, Search, Filter, X, Trash2, Eye, Send,
//   CheckCircle, XCircle, Calendar, Clock, AlertTriangle,
//   FileText, ChevronRight, Bell, User, Building2,
//   MapPin, Coffee, Edit3, History, Stamp, ArrowLeft
// } from "lucide-react";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/mous";

// // ─── STATUS CONFIG ───────────────────────────────────────────────────────────
// const STATUS = {
//   Draft:            { color: "#64748b", bg: "#f1f5f9", label: "Draft" },
//   "Sent to Industry": { color: "#d97706", bg: "#fffbeb", label: "Sent to Industry" },
//   "Changes Proposed": { color: "#7c3aed", bg: "#f5f3ff", label: "Changes Proposed" },
//   "Approved by Industry": { color: "#059669", bg: "#ecfdf5", label: "Approved by Industry" },
//   "Approved by University": { color: "#0284c7", bg: "#e0f2fe", label: "Approved by Univ." },
//   "Mutually Approved": { color: "#16a34a", bg: "#dcfce7", label: "Mutually Approved ✓" },
//   Rejected:         { color: "#dc2626", bg: "#fef2f2", label: "Rejected" },
// };

// // ─── HELPERS ─────────────────────────────────────────────────────────────────
// const today = () => new Date().toISOString().split("T")[0];
// const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-PK", { day:"2-digit", month:"short", year:"numeric" }) : "—";
// const calcProgress = (s, e) => {
//   const start = new Date(s), end = new Date(e), now = new Date();
//   if (!start || !end || end <= start) return 100;
//   return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
// };

// // ─── BADGE ───────────────────────────────────────────────────────────────────
// const Badge = ({ status }) => {
//   const cfg = STATUS[status] || STATUS.Draft;
//   return (
//     <span style={{
//       background: cfg.bg, color: cfg.color,
//       padding: "3px 10px", borderRadius: 20, fontSize: 11,
//       fontWeight: 700, letterSpacing: 0.3, border: `1px solid ${cfg.color}30`
//     }}>{cfg.label}</span>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// const MouManagement = () => {
//   const [view, setView]               = useState("list");       // list | create | detail
//   const [mous, setMous]               = useState([]);
//   const [selected, setSelected]       = useState(null);
//   const [search, setSearch]           = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [loading, setLoading]         = useState(true);
//   const [meetingModal, setMeetingModal] = useState(false);
//   const [approveModal, setApproveModal] = useState(false);
//   const [stampType, setStampType]     = useState(""); // "approve" | "reject"

//   // ── fetch ──
//   useEffect(() => { fetchMous(); }, []);

//   const fetchMous = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_URL);
//       setMous(res.data);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── filtered list ──
//   const filtered = mous.filter(m => {
//     const q = search.toLowerCase();
//     const matchQ = !q || m.university?.toLowerCase().includes(q) || m.industry?.toLowerCase().includes(q) || m.title?.toLowerCase().includes(q);
//     const matchS = filterStatus === "All" || m.status === filterStatus;
//     return matchQ && matchS;
//   });

//   const expiringSoon = mous.filter(m => {
//     const diff = (new Date(m.endDate) - new Date()) / 86400000;
//     return diff > 0 && diff <= 30;
//   });

//   // ── open detail ──
//   const openDetail = (mou) => { setSelected(mou); setView("detail"); };
//   const goBack     = ()    => { setSelected(null); setView("list"); };

//   // ── send to industry ──
//   const handleSend = async () => {
//     if (!selected) return;
//     if (!window.confirm(`Send this MOU to ${selected.industry}?`)) return;
//     try {
//       const updated = { ...selected, status: "Sent to Industry", sentAt: new Date().toISOString() };
//       const res = await axios.put(`${API_URL}/${selected._id}`, updated);
//       updateLocal(res.data);
//     } catch(e) { alert("Error sending MOU"); }
//   };

//   // ── approve / reject ──
//   const handleApproveReject = async (type) => {
//     if (!selected) return;
//     const newStatus = type === "approve" ? "Approved by University" : "Rejected";
//     const stamp = {
//       by: "University Admin",
//       type,
//       date: new Date().toISOString(),
//       note: type === "approve" ? "Approved by University Authority" : "Rejected by University",
//     };
//     try {
//       const updated = {
//         ...selected,
//         status: newStatus,
//         universityStamp: stamp,
//         // if industry already approved → mutually approved
//         ...(type === "approve" && selected.status === "Approved by Industry"
//           ? { status: "Mutually Approved" } : {}),
//       };
//       const res = await axios.put(`${API_URL}/${selected._id}`, updated);
//       updateLocal(res.data);
//       setApproveModal(false);
//     } catch(e) { alert("Error updating status"); }
//   };

//   // ── meeting schedule ──
//   const handleMeetingSave = async (meetingData) => {
//     try {
//       const updated = { ...selected, scheduledMeeting: meetingData, status: selected.status };
//       const res = await axios.put(`${API_URL}/${selected._id}`, updated);
//       updateLocal(res.data);
//       setMeetingModal(false);
//       alert("Meeting scheduled & saved!");
//     } catch(e) { alert("Error saving meeting"); }
//   };

//   // ── delete ──
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this MOU?")) return;
//     await axios.delete(`${API_URL}/${id}`);
//     setMous(s => s.filter(m => m._id !== id));
//     if (view === "detail") goBack();
//   };

//   const updateLocal = (updated) => {
//     setMous(s => s.map(m => m._id === updated._id ? updated : m));
//     setSelected(updated);
//   };

//   // ── RENDER ──
//   return (
//     <div style={S.page}>
//       {/* TOP BAR */}
//       <div style={S.topbar}>
//         <div style={S.brand}>
//           <FileText size={20} color="#fff" />
//           <span style={S.brandText}>MOU Portal</span>
//           <span style={S.brandSub}>University Administration</span>
//         </div>
//         <div style={S.topActions}>
//           {expiringSoon.length > 0 && (
//             <div style={S.alertChip}>
//               <Bell size={13} /> {expiringSoon.length} expiring soon
//             </div>
//           )}
//           <div style={S.avatar}>UA</div>
//         </div>
//       </div>

//       <div style={S.body}>
//         {/* ── LIST VIEW ── */}
//         {view === "list" && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//             {/* Stats */}
//             <div style={S.statsRow}>
//               {[
//                 { label: "Total MOUs", val: mous.length, color: "#1e3a5f" },
//                 { label: "Ongoing", val: mous.filter(m => new Date(m.endDate) > new Date()).length, color: "#0284c7" },
//                 { label: "Pending Review", val: mous.filter(m => m.status === "Changes Proposed" || m.status === "Approved by Industry").length, color: "#7c3aed" },
//                 { label: "Expiring Soon", val: expiringSoon.length, color: "#d97706" },
//                 { label: "Mutually Approved", val: mous.filter(m => m.status === "Mutually Approved").length, color: "#16a34a" },
//               ].map((s, i) => (
//                 <div key={i} style={S.statCard}>
//                   <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{s.label}</div>
//                   <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.val}</div>
//                 </div>
//               ))}
//             </div>

//             {/* Toolbar */}
//             <div style={S.toolbar}>
//               <div style={S.searchBox}>
//                 <Search size={15} color="#94a3b8" />
//                 <input style={S.searchInput} placeholder="Search by name, industry, title..."
//                   value={search} onChange={e => setSearch(e.target.value)} />
//                 {search && <X size={14} style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
//               </div>
//               <div style={S.filterBox}>
//                 <Filter size={14} color="#64748b" />
//                 <select style={S.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
//                   <option>All</option>
//                   {Object.keys(STATUS).map(s => <option key={s}>{s}</option>)}
//                 </select>
//               </div>
//               <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
//                 style={S.createBtn} onClick={() => setView("create")}>
//                 <PlusCircle size={15} /> Create MOU
//               </motion.button>
//             </div>

//             {/* MOU Cards */}
//             {loading ? (
//               <div style={S.empty}>Loading MOUs...</div>
//             ) : filtered.length === 0 ? (
//               <div style={S.empty}>No MOUs found. Create one!</div>
//             ) : (
//               <div style={S.cardGrid}>
//                 {filtered.map(m => <MouCard key={m._id} m={m} onOpen={openDetail} onDelete={handleDelete} />)}
//               </div>
//             )}
//           </motion.div>
//         )}

//         {/* ── CREATE VIEW ── */}
//         {view === "create" && (
//           <CreateMou
//             onBack={goBack}
//             onSaved={(saved) => {
//               setMous(s => [saved, ...s]);
//               goBack();
//             }}
//           />
//         )}

//         {/* ── DETAIL VIEW ── */}
//         {view === "detail" && selected && (
//           <DetailView
//             mou={selected}
//             onBack={goBack}
//             onSend={handleSend}
//             onDelete={() => handleDelete(selected._id)}
//             onScheduleMeeting={() => setMeetingModal(true)}
//             onApproveReject={(type) => { setStampType(type); setApproveModal(true); }}
//             onUpdate={updateLocal}
//           />
//         )}
//       </div>

//       {/* ── MEETING MODAL ── */}
//       <AnimatePresence>
//         {meetingModal && (
//           <MeetingModal
//             existing={selected?.scheduledMeeting}
//             onClose={() => setMeetingModal(false)}
//             onSave={handleMeetingSave}
//           />
//         )}
//       </AnimatePresence>

//       {/* ── APPROVE/REJECT MODAL ── */}
//       <AnimatePresence>
//         {approveModal && (
//           <StampModal
//             type={stampType}
//             mou={selected}
//             onClose={() => setApproveModal(false)}
//             onConfirm={() => handleApproveReject(stampType)}
//           />
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
//   const needsAction = ["Changes Proposed", "Approved by Industry"].includes(m.status);
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}
//       style={{ ...S.card, ...(needsAction ? S.cardUrgent : {}) }}
//     >
//       {needsAction && <div style={S.urgentStrip}>⚡ Action Required</div>}
//       <div style={S.cardTop}>
//         <div>
//           <div style={S.cardTitle}>{m.title || "Untitled MOU"}</div>
//           <div style={S.cardMeta}>
//             <Building2 size={12} /> {m.university}
//             <ChevronRight size={12} style={{ margin: "0 2px" }} />
//             {m.industry}
//           </div>
//         </div>
//         <Badge status={m.status} />
//       </div>

//       <div style={{ fontSize: 12, color: "#64748b", margin: "6px 0" }}>
//         📅 {fmtDate(m.startDate)} → {fmtDate(m.endDate)}
//         {m.collaborationType && <span style={{ marginLeft: 8, background: "#e2e8f0", padding: "1px 8px", borderRadius: 10, fontSize: 11 }}>{m.collaborationType}</span>}
//       </div>

//       {hasChanges && (
//         <div style={S.changesBadge}>
//           <History size={11} /> {m.proposedChanges.length} change(s) proposed by industry
//         </div>
//       )}

//       <div style={{ margin: "8px 0 4px" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>
//           <span>Progress</span><span>{prog}%</span>
//         </div>
//         <div style={{ height: 4, background: "#e2e8f0", borderRadius: 4 }}>
//           <div style={{ width: `${prog}%`, height: "100%", background: needsAction ? "#7c3aed" : "#0284c7", borderRadius: 4, transition: "width 0.5s" }} />
//         </div>
//       </div>

//       <div style={S.cardFooter}>
//         <button style={S.btnOutline} onClick={() => onOpen(m)}>
//           <Eye size={13} /> View Details
//         </button>
//         <button style={S.btnDanger} onClick={() => onDelete(m._id)}>
//           <Trash2 size={13} />
//         </button>
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
//     title: "", university: "", industry: "",
//     collaborationType: "", startDate: "", endDate: "",
//     description: "",
//     objectives: [""],
//     responsibilities: { university: [""], industry: [""] },
//     terms: [""],
//     signatories: { university: "", industry: "" },
//     universityContact: { name: "", designation: "", email: "" },
//     industryContact: { name: "", designation: "", email: "" },
//     status: "Draft",
//   });

//   const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

//   const arrAdd    = (key)          => setForm(f => ({ ...f, [key]: [...f[key], ""] }));
//   const arrRemove = (key, i)       => setForm(f => ({ ...f, [key]: f[key].filter((_,j) => j!==i) }));
//   const arrUpdate = (key, i, val)  => setForm(f => { const a=[...f[key]]; a[i]=val; return {...f,[key]:a}; });

//   const nested2Add    = (key, sub)         => setForm(f => ({ ...f, [key]: { ...f[key], [sub]: [...f[key][sub], ""] } }));
//   const nested2Remove = (key, sub, i)      => setForm(f => ({ ...f, [key]: { ...f[key], [sub]: f[key][sub].filter((_,j)=>j!==i) } }));
//   const nested2Update = (key, sub, i, val) => setForm(f => { const a=[...f[key][sub]]; a[i]=val; return {...f,[key]:{...f[key],[sub]:a}}; });

//   const handleSave = async () => {
//     const { title, university, industry, collaborationType, startDate, endDate } = form;
//     if (!title || !university || !industry || !collaborationType || !startDate || !endDate)
//       return alert("Please fill all required fields.");
//     try {
//       setSaving(true);
//       const res = await axios.post(API_URL, form);
//       onSaved(res.data);
//     } catch(e) {
//       alert("Error saving MOU: " + (e.response?.data?.message || e.message));
//     } finally { setSaving(false); }
//   };

//   return (
//     <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
//       <div style={S.detailHeader}>
//         <button style={S.backBtn} onClick={onBack}><ArrowLeft size={16} /> Back</button>
//         <div>
//           <h2 style={{ margin: 0, color: "#1e3a5f", fontSize: 20 }}>Create New MOU</h2>
//           <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Fill in the MOU details below — fully editable before sending</p>
//         </div>
//         <div style={{ display: "flex", gap: 8 }}>
//           <button style={S.btnOutline} onClick={onBack}>Cancel</button>
//           <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
//             style={S.btnPrimary} onClick={handleSave} disabled={saving}>
//             {saving ? "Saving..." : "💾 Save Draft"}
//           </motion.button>
//         </div>
//       </div>

//       <div style={S.createBody}>
//         {/* SECTION: Basic Info */}
//         <Section title="📋 Basic Information" icon="📋">
//           <div style={S.grid2}>
//             <FormField label="MOU Title *" value={form.title} onChange={v => set("title",v)} placeholder="e.g., Industry-Academia Research Collaboration" />
//             <FormField label="Collaboration Type *" value={form.collaborationType} onChange={v => set("collaborationType",v)} type="select"
//               options={["","Research","Internship","Training","Consultancy","Joint Venture","Other"]} />
//             <FormField label="University *" value={form.university} onChange={v => set("university",v)} placeholder="Full University Name" />
//             <FormField label="Industry Partner *" value={form.industry} onChange={v => set("industry",v)} placeholder="Company / Organization Name" />
//             <FormField label="Start Date *" value={form.startDate} onChange={v => set("startDate",v)} type="date" />
//             <FormField label="End Date *" value={form.endDate} onChange={v => set("endDate",v)} type="date" />
//           </div>
//           <FormField label="Purpose / Description" value={form.description} onChange={v => set("description",v)}
//             type="textarea" placeholder="Describe the purpose and scope of this MOU..." />
//         </Section>

//         {/* SECTION: Objectives */}
//         <Section title="🎯 Objectives">
//           {form.objectives.map((obj, i) => (
//             <div key={i} style={S.listItem}>
//               <input style={S.listInput} value={obj} placeholder={`Objective ${i+1}`}
//                 onChange={e => arrUpdate("objectives", i, e.target.value)} />
//               {form.objectives.length > 1 &&
//                 <button style={S.listRemove} onClick={() => arrRemove("objectives", i)}><X size={13}/></button>}
//             </div>
//           ))}
//           <button style={S.addRowBtn} onClick={() => arrAdd("objectives")}>+ Add Objective</button>
//         </Section>

//         {/* SECTION: Responsibilities */}
//         <Section title="📌 Responsibilities">
//           <div style={S.grid2}>
//             <div>
//               <label style={S.subLabel}>University Responsibilities</label>
//               {form.responsibilities.university.map((r, i) => (
//                 <div key={i} style={S.listItem}>
//                   <input style={S.listInput} value={r} placeholder={`Responsibility ${i+1}`}
//                     onChange={e => nested2Update("responsibilities","university",i,e.target.value)} />
//                   {form.responsibilities.university.length > 1 &&
//                     <button style={S.listRemove} onClick={() => nested2Remove("responsibilities","university",i)}><X size={13}/></button>}
//                 </div>
//               ))}
//               <button style={S.addRowBtn} onClick={() => nested2Add("responsibilities","university")}>+ Add</button>
//             </div>
//             <div>
//               <label style={S.subLabel}>Industry Responsibilities</label>
//               {form.responsibilities.industry.map((r, i) => (
//                 <div key={i} style={S.listItem}>
//                   <input style={S.listInput} value={r} placeholder={`Responsibility ${i+1}`}
//                     onChange={e => nested2Update("responsibilities","industry",i,e.target.value)} />
//                   {form.responsibilities.industry.length > 1 &&
//                     <button style={S.listRemove} onClick={() => nested2Remove("responsibilities","industry",i)}><X size={13}/></button>}
//                 </div>
//               ))}
//               <button style={S.addRowBtn} onClick={() => nested2Add("responsibilities","industry")}>+ Add</button>
//             </div>
//           </div>
//         </Section>

//         {/* SECTION: Terms */}
//         <Section title="⚖️ Terms & Conditions">
//           {form.terms.map((t, i) => (
//             <div key={i} style={S.listItem}>
//               <input style={S.listInput} value={t} placeholder={`Term / Clause ${i+1}`}
//                 onChange={e => arrUpdate("terms", i, e.target.value)} />
//               {form.terms.length > 1 &&
//                 <button style={S.listRemove} onClick={() => arrRemove("terms", i)}><X size={13}/></button>}
//             </div>
//           ))}
//           <button style={S.addRowBtn} onClick={() => arrAdd("terms")}>+ Add Term</button>
//         </Section>

//         {/* SECTION: Contacts */}
//         <Section title="👤 Contact Information">
//           <div style={S.grid2}>
//             <div>
//               <label style={S.subLabel}>University Contact</label>
//               <FormField label="Name" value={form.universityContact.name}
//                 onChange={v => set("universityContact",{...form.universityContact,name:v})} />
//               <FormField label="Designation" value={form.universityContact.designation}
//                 onChange={v => set("universityContact",{...form.universityContact,designation:v})} />
//               <FormField label="Email" value={form.universityContact.email} type="email"
//                 onChange={v => set("universityContact",{...form.universityContact,email:v})} />
//             </div>
//             <div>
//               <label style={S.subLabel}>Industry Contact</label>
//               <FormField label="Name" value={form.industryContact.name}
//                 onChange={v => set("industryContact",{...form.industryContact,name:v})} />
//               <FormField label="Designation" value={form.industryContact.designation}
//                 onChange={v => set("industryContact",{...form.industryContact,designation:v})} />
//               <FormField label="Email" value={form.industryContact.email} type="email"
//                 onChange={v => set("industryContact",{...form.industryContact,email:v})} />
//             </div>
//           </div>
//         </Section>

//         {/* SECTION: Signatories */}
//         <Section title="✍️ Authorized Signatories">
//           <div style={S.grid2}>
//             <FormField label="University Signatory" value={form.signatories.university}
//               onChange={v => set("signatories",{...form.signatories,university:v})}
//               placeholder="Name & Designation" />
//             <FormField label="Industry Signatory" value={form.signatories.industry}
//               onChange={v => set("signatories",{...form.signatories,industry:v})}
//               placeholder="Name & Designation" />
//           </div>
//         </Section>

//         <div style={{ textAlign: "right", marginTop: 16 }}>
//           <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
//             style={{ ...S.btnPrimary, padding: "12px 32px", fontSize: 15 }}
//             onClick={handleSave} disabled={saving}>
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
// const DetailView = ({ mou, onBack, onSend, onDelete, onScheduleMeeting, onApproveReject, onUpdate }) => {
//   const [editing, setEditing] = useState(false);
//   const [editData, setEditData] = useState(mou);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => { setEditData(mou); }, [mou]);

//   const hasChanges = mou.proposedChanges && mou.proposedChanges.length > 0;
//   const canSend = ["Draft", "Rejected"].includes(mou.status);
//   const canApprove = ["Sent to Industry", "Changes Proposed", "Approved by Industry"].includes(mou.status);
//   const meeting = mou.scheduledMeeting;

//   const saveEdit = async () => {
//     try {
//       setSaving(true);
//       const res = await axios.put(`${API_URL}/${mou._id}`, editData);
//       onUpdate(res.data);
//       setEditing(false);
//     } catch(e) { alert("Error saving"); }
//     finally { setSaving(false); }
//   };

//   const setEdit = (key, val) => setEditData(f => ({ ...f, [key]: val }));

//   return (
//     <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
//       {/* Header */}
//       <div style={S.detailHeader}>
//         <button style={S.backBtn} onClick={onBack}><ArrowLeft size={16}/> Back</button>
//         <div style={{ flex: 1 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <h2 style={{ margin: 0, color: "#1e3a5f", fontSize: 20 }}>{mou.title || "Untitled MOU"}</h2>
//             <Badge status={mou.status} />
//           </div>
//           <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
//             {mou.university} ↔ {mou.industry} | Created: {fmtDate(mou.createdAt)}
//           </p>
//         </div>
//         <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//           {editing ? (
//             <>
//               <button style={S.btnOutline} onClick={() => setEditing(false)}>Cancel</button>
//               <button style={S.btnPrimary} onClick={saveEdit} disabled={saving}>
//                 {saving ? "Saving..." : "💾 Save Changes"}
//               </button>
//             </>
//           ) : (
//             <>
//               {canSend && <button style={S.btnSend} onClick={onSend}><Send size={14}/> Send to Industry</button>}
//               {canApprove && (
//                 <>
//                   <button style={S.btnApprove} onClick={() => onApproveReject("approve")}><CheckCircle size={14}/> Approve</button>
//                   <button style={S.btnReject} onClick={() => onApproveReject("reject")}><XCircle size={14}/> Reject</button>
//                 </>
//               )}
//               <button style={S.btnMeeting} onClick={onScheduleMeeting}><Calendar size={14}/> {meeting ? "Edit Meeting" : "Schedule Meeting"}</button>
//               <button style={S.btnOutline} onClick={() => setEditing(true)}><Edit3 size={14}/> Edit MOU</button>
//               <button style={S.btnDanger} onClick={onDelete}><Trash2 size={14}/></button>
//             </>
//           )}
//         </div>
//       </div>

//       <div style={S.detailBody}>
//         {/* LEFT: MOU Content */}
//         <div style={S.detailLeft}>
//           {/* Alert: changes proposed */}
//           {hasChanges && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//               style={S.changesAlert}>
//               <AlertTriangle size={16} color="#7c3aed" />
//               <span style={{ color: "#7c3aed", fontWeight: 600 }}>
//                 Industry has proposed {mou.proposedChanges.length} change(s) — review in the sidebar
//               </span>
//             </motion.div>
//           )}

//           {/* Meeting Scheduled */}
//           {meeting && (
//             <div style={S.meetingCard}>
//               <div style={{ fontWeight: 700, color: "#0284c7", marginBottom: 6, display:"flex", gap:6, alignItems:"center" }}>
//                 <Calendar size={14}/> Scheduled Meeting
//               </div>
//               <div style={S.meetingGrid}>
//                 <MeetingRow icon={<Clock size={12}/>} label="Date & Time" val={`${fmtDate(meeting.date)} at ${meeting.time}`} />
//                 <MeetingRow icon={<MapPin size={12}/>} label="Venue" val={meeting.venue} />
//                 <MeetingRow icon={<Coffee size={12}/>} label="Agenda" val={meeting.agenda} />
//                 {meeting.menu && <MeetingRow icon={<Coffee size={12}/>} label="Menu / Refreshments" val={meeting.menu} />}
//               </div>
//             </div>
//           )}

//           {/* Stamps */}
//           {(mou.universityStamp || mou.industryStamp) && (
//             <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
//               {mou.universityStamp && <StampBadge stamp={mou.universityStamp} label="University" />}
//               {mou.industryStamp   && <StampBadge stamp={mou.industryStamp}   label="Industry"   />}
//             </div>
//           )}

//           {/* MOU Sections */}
//           {editing ? (
//             <EditableMou data={editData} onChange={setEdit} />
//           ) : (
//             <ViewMou mou={mou} />
//           )}
//         </div>

//         {/* RIGHT: Changes Sidebar */}
//         <div style={S.sidebar}>
//           <div style={S.sidebarTitle}>
//             <History size={15}/> Change Log
//           </div>
//           {!hasChanges ? (
//             <div style={S.sidebarEmpty}>No changes proposed by industry yet.</div>
//           ) : (
//             mou.proposedChanges.map((c, i) => (
//               <motion.div key={i} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }}
//                 transition={{ delay: i * 0.1 }}
//                 style={S.changeItem}>
//                 <div style={{ fontWeight: 700, color: "#7c3aed", fontSize: 12, marginBottom: 4 }}>
//                   📝 {c.field || `Change #${i+1}`}
//                 </div>
//                 <div style={{ fontSize: 12, marginBottom: 4 }}>
//                   <span style={{ color: "#dc2626", textDecoration: "line-through" }}>{c.oldValue || "—"}</span>
//                   <span style={{ color: "#64748b", margin:"0 6px" }}>→</span>
//                   <span style={{ color: "#16a34a" }}>{c.newValue || "—"}</span>
//                 </div>
//                 {c.reason && <div style={{ fontSize: 11, color: "#94a3b8" }}>Reason: {c.reason}</div>}
//                 <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 4 }}>{fmtDate(c.date)}</div>
//               </motion.div>
//             ))
//           )}

//           {/* Timeline */}
//           <div style={{ ...S.sidebarTitle, marginTop: 16 }}>
//             <Clock size={15}/> Timeline
//           </div>
//           <div style={S.timeline}>
//             {[
//               { label: "Draft Created", date: mou.createdAt, done: true },
//               { label: "Sent to Industry", date: mou.sentAt, done: !!mou.sentAt },
//               { label: "Industry Response", date: mou.industryResponseAt, done: !!mou.industryResponseAt },
//               { label: "University Decision", date: mou.universityStamp?.date, done: !!mou.universityStamp },
//               { label: "Mutually Approved", date: null, done: mou.status === "Mutually Approved" },
//             ].map((t, i) => (
//               <div key={i} style={S.timelineItem}>
//                 <div style={{ ...S.timelineDot, background: t.done ? "#16a34a" : "#e2e8f0" }}>
//                   {t.done && <CheckCircle size={10} color="#fff" />}
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 12, fontWeight: 600, color: t.done ? "#1e3a5f" : "#94a3b8" }}>{t.label}</div>
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

// // ═══════════════════════════════════════════════════════════════════════════════
// //  VIEW MOU (read-only)
// // ═══════════════════════════════════════════════════════════════════════════════
// const ViewMou = ({ mou }) => (
//   <div style={S.mouDoc}>
//     <div style={S.mouDocTitle}>MEMORANDUM OF UNDERSTANDING</div>
//     <div style={{ textAlign:"center", fontSize:13, color:"#64748b", marginBottom:16 }}>
//       {mou.university} & {mou.industry}
//     </div>
//     <hr style={{ borderColor:"#e2e8f0", margin:"12px 0" }} />

//     <MouSection title="1. Parties">
//       <p><strong>University:</strong> {mou.university}</p>
//       <p><strong>Industry:</strong> {mou.industry}</p>
//     </MouSection>

//     <MouSection title="2. Purpose">
//       <p>{mou.description || "—"}</p>
//     </MouSection>

//     <MouSection title="3. Collaboration Type">
//       <p>{mou.collaborationType}</p>
//     </MouSection>

//     <MouSection title="4. Duration">
//       <p>From <strong>{fmtDate(mou.startDate)}</strong> to <strong>{fmtDate(mou.endDate)}</strong></p>
//     </MouSection>

//     {mou.objectives?.filter(Boolean).length > 0 && (
//       <MouSection title="5. Objectives">
//         <ul>{mou.objectives.filter(Boolean).map((o,i) => <li key={i}>{o}</li>)}</ul>
//       </MouSection>
//     )}

//     {(mou.responsibilities?.university?.length > 0 || mou.responsibilities?.industry?.length > 0) && (
//       <MouSection title="6. Responsibilities">
//         {mou.responsibilities?.university?.filter(Boolean).length > 0 && (
//           <>
//             <strong>University:</strong>
//             <ul>{mou.responsibilities.university.filter(Boolean).map((r,i) => <li key={i}>{r}</li>)}</ul>
//           </>
//         )}
//         {mou.responsibilities?.industry?.filter(Boolean).length > 0 && (
//           <>
//             <strong>Industry:</strong>
//             <ul>{mou.responsibilities.industry.filter(Boolean).map((r,i) => <li key={i}>{r}</li>)}</ul>
//           </>
//         )}
//       </MouSection>
//     )}

//     {mou.terms?.filter(Boolean).length > 0 && (
//       <MouSection title="7. Terms & Conditions">
//         <ol>{mou.terms.filter(Boolean).map((t,i) => <li key={i}>{t}</li>)}</ol>
//       </MouSection>
//     )}

//     <MouSection title="8. Signatories">
//       <div style={{ display:"flex", gap:40, marginTop:8 }}>
//         <div>
//           <div style={{ borderTop:"1px solid #1e3a5f", paddingTop:6, marginTop:30, width:160 }}>
//             <strong>{mou.signatories?.university || "University Authority"}</strong><br />
//             <span style={{ fontSize:12, color:"#64748b" }}>For {mou.university}</span>
//           </div>
//         </div>
//         <div>
//           <div style={{ borderTop:"1px solid #1e3a5f", paddingTop:6, marginTop:30, width:160 }}>
//             <strong>{mou.signatories?.industry || "Industry Authority"}</strong><br />
//             <span style={{ fontSize:12, color:"#64748b" }}>For {mou.industry}</span>
//           </div>
//         </div>
//       </div>
//     </MouSection>
//   </div>
// );

// // ═══════════════════════════════════════════════════════════════════════════════
// //  EDITABLE MOU
// // ═══════════════════════════════════════════════════════════════════════════════
// const EditableMou = ({ data, onChange }) => {
//   const arrUpdate = (key, i, val) => {
//     const a = [...(data[key] || [])]; a[i] = val; onChange(key, a);
//   };
//   return (
//     <div style={S.mouDoc}>
//       <div style={S.mouDocTitle}>MEMORANDUM OF UNDERSTANDING — EDIT MODE</div>
//       <hr style={{ borderColor:"#e2e8f0", margin:"12px 0" }} />

//       <MouSection title="Basic Details">
//         <div style={S.grid2}>
//           <FormField label="Title" value={data.title} onChange={v => onChange("title", v)} />
//           <FormField label="Collaboration Type" value={data.collaborationType} type="select"
//             options={["","Research","Internship","Training","Consultancy","Joint Venture","Other"]}
//             onChange={v => onChange("collaborationType", v)} />
//           <FormField label="Start Date" value={data.startDate} type="date" onChange={v => onChange("startDate", v)} />
//           <FormField label="End Date" value={data.endDate} type="date" onChange={v => onChange("endDate", v)} />
//         </div>
//         <FormField label="Purpose" value={data.description} type="textarea" onChange={v => onChange("description", v)} />
//       </MouSection>

//       <MouSection title="Objectives">
//         {(data.objectives||[""]).map((o, i) => (
//           <input key={i} style={{ ...S.listInput, marginBottom:6 }} value={o}
//             onChange={e => arrUpdate("objectives", i, e.target.value)} placeholder={`Objective ${i+1}`} />
//         ))}
//       </MouSection>

//       <MouSection title="Terms & Conditions">
//         {(data.terms||[""]).map((t, i) => (
//           <input key={i} style={{ ...S.listInput, marginBottom:6 }} value={t}
//             onChange={e => arrUpdate("terms", i, e.target.value)} placeholder={`Term ${i+1}`} />
//         ))}
//       </MouSection>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  MEETING MODAL
// // ═══════════════════════════════════════════════════════════════════════════════
// const MeetingModal = ({ existing, onClose, onSave }) => {
//   const [form, setForm] = useState(existing || {
//     date: "", time: "", venue: "", agenda: "", menu: "", attendees: "",
//   });
//   const set = (k,v) => setForm(f => ({...f,[k]:v}));
//   return (
//     <div style={S.overlay}>
//       <motion.div initial={{ y:40, opacity:0, scale:0.95 }} animate={{ y:0, opacity:1, scale:1 }}
//         exit={{ y:40, opacity:0, scale:0.95 }}
//         style={{ ...S.modal, maxWidth:500 }}>
//         <div style={S.modalHeader}>
//           <div style={{ fontWeight:700, fontSize:16, color:"#1e3a5f" }}>
//             <Calendar size={18} style={{ marginRight:8 }} /> Schedule Meeting
//           </div>
//           <X size={20} style={{ cursor:"pointer" }} onClick={onClose} />
//         </div>
//         <div style={S.modalBody}>
//           <FormField label="Meeting Date *" value={form.date} type="date" onChange={v => set("date",v)} />
//           <FormField label="Time *" value={form.time} type="time" onChange={v => set("time",v)} />
//           <FormField label="Venue / Location *" value={form.venue} onChange={v => set("venue",v)} placeholder="e.g., Conference Room A, City Hotel" />
//           <FormField label="Agenda *" value={form.agenda} type="textarea" onChange={v => set("agenda",v)}
//             placeholder="Meeting objectives and points to discuss..." />
//           <FormField label="Menu / Refreshments (optional)" value={form.menu} onChange={v => set("menu",v)}
//             placeholder="e.g., Lunch, Tea & Coffee, etc." />
//           <FormField label="Expected Attendees (optional)" value={form.attendees} onChange={v => set("attendees",v)}
//             placeholder="e.g., Dean, Industry Director, Project Lead" />
//         </div>
//         <div style={{ padding:"12px 20px", display:"flex", gap:8, justifyContent:"flex-end", borderTop:"1px solid #f1f5f9" }}>
//           <button style={S.btnOutline} onClick={onClose}>Cancel</button>
//           <button style={S.btnPrimary} onClick={() => {
//             if (!form.date || !form.time || !form.venue || !form.agenda) return alert("Please fill required fields.");
//             onSave(form);
//           }}>
//             <Calendar size={14}/> Save Meeting
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  STAMP MODAL
// // ═══════════════════════════════════════════════════════════════════════════════
// const StampModal = ({ type, mou, onClose, onConfirm }) => (
//   <div style={S.overlay}>
//     <motion.div initial={{ y:30, opacity:0, scale:0.95 }} animate={{ y:0, opacity:1, scale:1 }}
//       exit={{ y:30, opacity:0, scale:0.95 }}
//       style={{ ...S.modal, maxWidth:400, textAlign:"center" }}>
//       <div style={{ padding:32 }}>
//         <div style={{
//           width:80, height:80, borderRadius:"50%", margin:"0 auto 16px",
//           background: type==="approve" ? "#dcfce7" : "#fef2f2",
//           display:"flex", alignItems:"center", justifyContent:"center",
//           border: `3px solid ${type==="approve" ? "#16a34a" : "#dc2626"}`
//         }}>
//           {type==="approve"
//             ? <CheckCircle size={36} color="#16a34a"/>
//             : <XCircle size={36} color="#dc2626"/>}
//         </div>
//         <div style={{ fontSize:18, fontWeight:800, color:"#1e3a5f", marginBottom:8 }}>
//           {type==="approve" ? "Approve this MOU?" : "Reject this MOU?"}
//         </div>
//         <div style={{ fontSize:13, color:"#64748b", marginBottom:20 }}>
//           {type==="approve"
//             ? `This will stamp "APPROVED" on behalf of ${mou?.university}. The industry will be notified.`
//             : `This will mark the MOU as Rejected. You can re-send after making changes.`}
//         </div>
//         {type==="approve" && mou?.status === "Approved by Industry" && (
//           <div style={{ background:"#dcfce7", border:"1px solid #16a34a", borderRadius:8, padding:"10px 16px", marginBottom:16, fontSize:13, color:"#166534" }}>
//             🎉 Industry has already approved! This will mark the MOU as <strong>Mutually Approved</strong>.
//           </div>
//         )}
//         <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
//           <button style={S.btnOutline} onClick={onClose}>Cancel</button>
//           <button style={type==="approve" ? S.btnApprove : S.btnReject} onClick={onConfirm}>
//             <Stamp size={14}/>
//             {type==="approve" ? " Confirm Approve" : " Confirm Reject"}
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   </div>
// );

// // ═══════════════════════════════════════════════════════════════════════════════
// //  SMALL HELPERS
// // ═══════════════════════════════════════════════════════════════════════════════
// const Section = ({ title, children }) => (
//   <div style={S.section}>
//     <div style={S.sectionTitle}>{title}</div>
//     {children}
//   </div>
// );

// const MouSection = ({ title, children }) => (
//   <div style={{ marginBottom:16 }}>
//     <div style={{ fontWeight:700, color:"#1e3a5f", fontSize:13, marginBottom:6, borderBottom:"1px solid #f1f5f9", paddingBottom:4 }}>{title}</div>
//     <div style={{ fontSize:13, color:"#374151", lineHeight:1.7 }}>{children}</div>
//   </div>
// );

// const FormField = ({ label, value, onChange, type="text", placeholder="", options=[] }) => (
//   <div style={{ marginBottom:10 }}>
//     {label && <label style={{ fontSize:12, color:"#64748b", display:"block", marginBottom:4, fontWeight:600 }}>{label}</label>}
//     {type === "textarea" ? (
//       <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
//         style={{ ...S.input, height:80, resize:"vertical" }} />
//     ) : type === "select" ? (
//       <select value={value} onChange={e => onChange(e.target.value)} style={S.input}>
//         {options.map(o => <option key={o} value={o}>{o || "Select..."}</option>)}
//       </select>
//     ) : (
//       <input type={type} value={value} onChange={e => onChange(e.target.value)}
//         placeholder={placeholder} style={S.input} />
//     )}
//   </div>
// );

// const StampBadge = ({ stamp, label }) => (
//   <div style={{
//     border: `2px solid ${stamp.type==="approve" ? "#16a34a" : "#dc2626"}`,
//     borderRadius:8, padding:"8px 14px",
//     background: stamp.type==="approve" ? "#f0fdf4" : "#fef2f2",
//   }}>
//     <div style={{ fontWeight:800, fontSize:12, color: stamp.type==="approve" ? "#16a34a" : "#dc2626" }}>
//       {stamp.type==="approve" ? "✅ APPROVED" : "❌ REJECTED"} — {label}
//     </div>
//     <div style={{ fontSize:11, color:"#64748b" }}>By: {stamp.by} on {fmtDate(stamp.date)}</div>
//   </div>
// );

// const MeetingRow = ({ icon, label, val }) => (
//   <div style={{ display:"flex", gap:6, marginBottom:4, fontSize:12 }}>
//     <span style={{ color:"#0284c7" }}>{icon}</span>
//     <span style={{ color:"#64748b", minWidth:120 }}>{label}:</span>
//     <span style={{ color:"#1e3a5f", fontWeight:600 }}>{val || "—"}</span>
//   </div>
// );

// const MeetingGrid = ({ children }) => <div>{children}</div>;

// // ═══════════════════════════════════════════════════════════════════════════════
// //  STYLES
// // ═══════════════════════════════════════════════════════════════════════════════
// const S = {
//   page: { fontFamily: "'Segoe UI', sans-serif", minHeight:"100vh", background:"#f8fafc" },
//   topbar: { background:"linear-gradient(135deg,#1e3a5f,#0f2340)", padding:"12px 24px",
//     display:"flex", justifyContent:"space-between", alignItems:"center",
//     boxShadow:"0 2px 10px rgba(0,0,0,0.2)" },
//   brand: { display:"flex", alignItems:"center", gap:10 },
//   brandText: { color:"#fff", fontWeight:800, fontSize:18, letterSpacing:0.5 },
//   brandSub: { color:"#93c5fd", fontSize:12, borderLeft:"1px solid #3b6ea0", paddingLeft:10, marginLeft:4 },
//   topActions: { display:"flex", alignItems:"center", gap:12 },
//   alertChip: { background:"#fef3c7", color:"#b45309", padding:"4px 12px", borderRadius:20,
//     fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:4 },
//   avatar: { width:34, height:34, borderRadius:"50%", background:"#3b82f6",
//     color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
//     fontWeight:700, fontSize:13 },

//   body: { padding:24, maxWidth:1400, margin:"0 auto" },

//   statsRow: { display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" },
//   statCard: { flex:1, minWidth:130, background:"#fff", borderRadius:10, padding:"14px 18px",
//     boxShadow:"0 1px 4px rgba(0,0,0,0.06)", borderLeft:"3px solid #e2e8f0" },

//   toolbar: { display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" },
//   searchBox: { flex:1, minWidth:220, display:"flex", alignItems:"center", gap:8,
//     background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"8px 12px" },
//   searchInput: { flex:1, border:"none", outline:"none", fontSize:13, background:"transparent" },
//   filterBox: { display:"flex", alignItems:"center", gap:6, background:"#fff",
//     border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 12px" },
//   filterSel: { border:"none", outline:"none", fontSize:13, background:"transparent" },
//   createBtn: { display:"flex", alignItems:"center", gap:6, background:"#1e3a5f",
//     color:"#fff", border:"none", padding:"10px 18px", borderRadius:8, cursor:"pointer",
//     fontWeight:700, fontSize:13 },

//   cardGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 },
//   card: { background:"#fff", borderRadius:12, padding:16, boxShadow:"0 1px 6px rgba(0,0,0,0.06)",
//     transition:"all 0.2s", cursor:"default" },
//   cardUrgent: { borderLeft:"4px solid #7c3aed", background:"#fafaff" },
//   urgentStrip: { background:"#f5f3ff", color:"#7c3aed", fontSize:11, fontWeight:700,
//     padding:"3px 10px", borderRadius:6, marginBottom:8, display:"inline-block" },
//   cardTop: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 },
//   cardTitle: { fontWeight:700, color:"#1e3a5f", fontSize:14, marginBottom:3 },
//   cardMeta: { display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#64748b" },
//   changesBadge: { display:"flex", alignItems:"center", gap:5, background:"#f5f3ff",
//     color:"#7c3aed", fontSize:11, padding:"3px 10px", borderRadius:6, marginBottom:6,
//     fontWeight:600 },
//   cardFooter: { display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 },

//   empty: { textAlign:"center", padding:60, color:"#94a3b8", fontSize:15 },

//   // Buttons
//   btnOutline: { display:"flex", alignItems:"center", gap:5, background:"#fff",
//     border:"1px solid #e2e8f0", color:"#374151", padding:"8px 14px",
//     borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
//   btnPrimary: { display:"flex", alignItems:"center", gap:5, background:"#1e3a5f",
//     color:"#fff", border:"none", padding:"8px 16px", borderRadius:7, cursor:"pointer",
//     fontSize:13, fontWeight:600 },
//   btnSend: { display:"flex", alignItems:"center", gap:5, background:"#0284c7",
//     color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer",
//     fontSize:13, fontWeight:600 },
//   btnApprove: { display:"flex", alignItems:"center", gap:5, background:"#16a34a",
//     color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer",
//     fontSize:13, fontWeight:600 },
//   btnReject: { display:"flex", alignItems:"center", gap:5, background:"#dc2626",
//     color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer",
//     fontSize:13, fontWeight:600 },
//   btnMeeting: { display:"flex", alignItems:"center", gap:5, background:"#7c3aed",
//     color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer",
//     fontSize:13, fontWeight:600 },
//   btnDanger: { display:"flex", alignItems:"center", gap:5, background:"#fef2f2",
//     color:"#dc2626", border:"1px solid #fecaca", padding:"8px 10px",
//     borderRadius:7, cursor:"pointer" },

//   // Detail
//   detailHeader: { display:"flex", alignItems:"center", gap:16, marginBottom:20,
//     flexWrap:"wrap", background:"#fff", padding:16, borderRadius:12,
//     boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
//   backBtn: { display:"flex", alignItems:"center", gap:5, background:"transparent",
//     border:"1px solid #e2e8f0", color:"#64748b", padding:"7px 12px",
//     borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600, whiteSpace:"nowrap" },
//   detailBody: { display:"flex", gap:16 },
//   detailLeft: { flex:1, minWidth:0 },
//   sidebar: { width:280, flexShrink:0, background:"#fff", borderRadius:12, padding:16,
//     boxShadow:"0 1px 4px rgba(0,0,0,0.06)", maxHeight:"calc(100vh - 180px)",
//     overflowY:"auto", position:"sticky", top:16 },
//   sidebarTitle: { fontWeight:700, color:"#1e3a5f", fontSize:13, marginBottom:10,
//     display:"flex", alignItems:"center", gap:6, paddingBottom:8,
//     borderBottom:"1px solid #f1f5f9" },
//   sidebarEmpty: { fontSize:12, color:"#94a3b8", textAlign:"center", padding:20 },
//   changeItem: { background:"#f5f3ff", border:"1px solid #e9d5ff", borderRadius:8,
//     padding:"10px 12px", marginBottom:8 },
//   timeline: { paddingLeft:4 },
//   timelineItem: { display:"flex", gap:10, alignItems:"flex-start", marginBottom:12 },
//   timelineDot: { width:20, height:20, borderRadius:"50%", flexShrink:0,
//     display:"flex", alignItems:"center", justifyContent:"center" },

//   // Create
//   createBody: { background:"#fff", borderRadius:12, padding:24, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
//   section: { marginBottom:28, paddingBottom:20, borderBottom:"1px solid #f1f5f9" },
//   sectionTitle: { fontWeight:800, color:"#1e3a5f", fontSize:15, marginBottom:14,
//     display:"flex", alignItems:"center", gap:8 },
//   grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:8 },
//   subLabel: { fontWeight:700, fontSize:13, color:"#374151", display:"block", marginBottom:8 },
//   listItem: { display:"flex", gap:8, marginBottom:6, alignItems:"center" },
//   listInput: { flex:1, padding:"8px 12px", border:"1px solid #e2e8f0", borderRadius:7,
//     fontSize:13, outline:"none", fontFamily:"inherit" },
//   listRemove: { background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca",
//     borderRadius:6, padding:"5px 8px", cursor:"pointer" },
//   addRowBtn: { background:"transparent", border:"1px dashed #cbd5e1", color:"#64748b",
//     padding:"6px 14px", borderRadius:7, cursor:"pointer", fontSize:12, marginTop:4 },
//   input: { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0",
//     borderRadius:7, fontSize:13, outline:"none", fontFamily:"inherit",
//     boxSizing:"border-box", background:"#fafafa" },

//   // MOU Doc
//   mouDoc: { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12,
//     padding:28, marginBottom:16 },
//   mouDocTitle: { textAlign:"center", fontWeight:800, fontSize:18, color:"#1e3a5f",
//     letterSpacing:1, marginBottom:6 },

//   // Meeting card
//   meetingCard: { background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10,
//     padding:"12px 16px", marginBottom:12 },
//   meetingGrid: {},

//   changesAlert: { display:"flex", alignItems:"center", gap:10, background:"#f5f3ff",
//     border:"1px solid #e9d5ff", borderRadius:10, padding:"10px 16px", marginBottom:12 },

//   // Modal
//   overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.4)",
//     display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 },
//   modal: { background:"#fff", borderRadius:14, width:"90%",
//     maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" },
//   modalHeader: { display:"flex", justifyContent:"space-between", alignItems:"center",
//     padding:"16px 20px", borderBottom:"1px solid #f1f5f9" },
//   modalBody: { padding:"16px 20px" },
// };










// import React, { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   PlusCircle, Search, Filter, X, Trash2, Eye, Send,
//   CheckCircle, XCircle, Calendar, Clock, AlertTriangle,
//   FileText, ChevronRight, Bell, User, Building2,
//   MapPin, Coffee, Edit3, History, Stamp, ArrowLeft,
//   Download, BellRing, CheckSquare
// } from "lucide-react";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/mous";

// // ─── STATUS CONFIG ───────────────────────────────────────────────────────────
// const STATUS = {
//   Draft:            { color: "#64748b", bg: "#f1f5f9", label: "Draft" },
//   "Sent to Industry": { color: "#d97706", bg: "#fffbeb", label: "Sent to Industry" },
//   "Changes Proposed": { color: "#7c3aed", bg: "#f5f3ff", label: "Changes Proposed" },
//   "Approved by Industry": { color: "#059669", bg: "#ecfdf5", label: "Approved by Industry" },
//   "Approved by University": { color: "#0284c7", bg: "#e0f2fe", label: "Approved by Univ." },
//   "Mutually Approved": { color: "#16a34a", bg: "#dcfce7", label: "Mutually Approved ✓" },
//   Rejected:         { color: "#dc2626", bg: "#fef2f2", label: "Rejected" },
// };

// // ─── HELPERS ─────────────────────────────────────────────────────────────────
// const today = () => new Date().toISOString().split("T")[0];
// const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-PK", { day:"2-digit", month:"short", year:"numeric" }) : "—";
// const calcProgress = (s, e) => {
//   const start = new Date(s), end = new Date(e), now = new Date();
//   if (!start || !end || end <= start) return 100;
//   return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
// };

// // ─── BADGE ───────────────────────────────────────────────────────────────────
// const Badge = ({ status }) => {
//   const cfg = STATUS[status] || STATUS.Draft;
//   return (
//     <span style={{
//       background: cfg.bg, color: cfg.color,
//       padding: "3px 10px", borderRadius: 20, fontSize: 11,
//       fontWeight: 700, letterSpacing: 0.3, border: `1px solid ${cfg.color}30`
//     }}>{cfg.label}</span>
//   );
// };

// // ─── NOTIFICATION SYSTEM ─────────────────────────────────────────────────────
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
//             <motion.div key={n.id}
//               initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
//               style={{
//                 background: n.type === "success" ? "#dcfce7" : n.type === "error" ? "#fef2f2" : "#eff6ff",
//                 border: `1px solid ${n.type === "success" ? "#86efac" : n.type === "error" ? "#fca5a5" : "#93c5fd"}`,
//                 color: n.type === "success" ? "#166534" : n.type === "error" ? "#991b1b" : "#1e40af",
//                 padding: "10px 16px", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
//                 fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, maxWidth: 320,
//               }}>
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
// //  PDF GENERATOR
// // ═══════════════════════════════════════════════════════════════════════════════
// const generateMouPdf = (mou) => {
//   // Build printable HTML and use window.print with a hidden iframe
//   const html = `
// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="utf-8"/>
// <title>MOU - ${mou.title}</title>
// <style>
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Source+Serif+4:wght@400;600&display=swap');
//   * { margin: 0; padding: 0; box-sizing: border-box; }
//   body { font-family: 'Source Serif 4', Georgia, serif; color: #1a1a2e; background: #fff; padding: 50px; max-width: 800px; margin: 0 auto; }
//   .header { text-align: center; border-bottom: 3px double #1e3a5f; padding-bottom: 24px; margin-bottom: 28px; }
//   .logos { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
//   .logo-box { border: 2px solid #1e3a5f; border-radius: 10px; padding: 12px 24px; font-size: 13px; color: #1e3a5f; font-weight: 700; text-align: center; min-width: 160px; }
//   .logo-icon { font-size: 28px; display: block; margin-bottom: 4px; }
//   .handshake { font-size: 32px; color: #1e3a5f; }
//   h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; color: #1e3a5f; letter-spacing: 2px; margin-bottom: 6px; }
//   .subtitle { font-size: 13px; color: #64748b; }
//   .stamp { display: inline-block; border: 4px solid #16a34a; color: #16a34a; padding: 6px 20px; border-radius: 6px; font-size: 18px; font-weight: 900; letter-spacing: 4px; transform: rotate(-5deg); margin: 10px 0; }
//   .section { margin-bottom: 20px; }
//   .section-title { font-family: 'Playfair Display', Georgia, serif; font-size: 14px; font-weight: 700; color: #1e3a5f; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; }
//   p, li { font-size: 13px; line-height: 1.8; color: #374151; }
//   ul, ol { padding-left: 20px; }
//   .signatories { display: flex; justify-content: space-between; margin-top: 40px; }
//   .signatory { text-align: center; width: 200px; }
//   .sig-line { border-top: 1px solid #1e3a5f; padding-top: 6px; margin-top: 50px; font-size: 12px; font-weight: 700; }
//   .approved-badge { text-align: center; margin: 16px 0; }
//   .parties-row { display: flex; justify-content: space-between; gap: 20px; }
//   .party-box { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 12px; }
//   .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #94a3b8; text-align: center; }
// </style>
// </head>
// <body>
//   <div class="header">
//     <div class="logos">
//       <div class="logo-box">
//         <span class="logo-icon">🎓</span>
//         ${mou.university}
//       </div>
//       <div class="handshake">🤝</div>
//       <div class="logo-box">
//         <span class="logo-icon">🏢</span>
//         ${mou.industry}
//       </div>
//     </div>
//     <h1>MEMORANDUM OF UNDERSTANDING</h1>
//     <div class="subtitle">This MOU is entered into on ${fmtDate(new Date().toISOString())} | ${mou.collaborationType}</div>
//     <div class="approved-badge">
//       <div class="stamp">${mou.status === "Mutually Approved" ? "MUTUALLY APPROVED" : mou.status === "Approved by Industry" ? "INDUSTRY APPROVED" : "UNIVERSITY APPROVED"}</div>
//     </div>
//   </div>

//   <div class="section">
//     <div class="section-title">1. PARTIES TO THIS AGREEMENT</div>
//     <div class="parties-row">
//       <div class="party-box">
//         <strong>UNIVERSITY:</strong><br/>${mou.university}<br/>
//         <em>Signatory: ${mou.signatories?.university || "University Authority"}</em><br/>
//         ${mou.universityContact?.email ? `Email: ${mou.universityContact.email}` : ""}
//       </div>
//       <div class="party-box">
//         <strong>INDUSTRY PARTNER:</strong><br/>${mou.industry}<br/>
//         <em>Signatory: ${mou.signatories?.industry || "Industry Authority"}</em><br/>
//         ${mou.industryContact?.email ? `Email: ${mou.industryContact.email}` : ""}
//       </div>
//     </div>
//   </div>

//   <div class="section">
//     <div class="section-title">2. PURPOSE</div>
//     <p>${mou.description || "This MOU establishes a formal collaboration framework between the parties."}</p>
//   </div>

//   <div class="section">
//     <div class="section-title">3. COLLABORATION TYPE</div>
//     <p>${mou.collaborationType}</p>
//   </div>

//   <div class="section">
//     <div class="section-title">4. DURATION</div>
//     <p>This MOU is effective from <strong>${fmtDate(mou.startDate)}</strong> to <strong>${fmtDate(mou.endDate)}</strong>.</p>
//   </div>

//   ${mou.objectives?.filter(Boolean).length > 0 ? `
//   <div class="section">
//     <div class="section-title">5. OBJECTIVES</div>
//     <ul>${mou.objectives.filter(Boolean).map(o => `<li>${o}</li>`).join("")}</ul>
//   </div>` : ""}

//   ${(mou.responsibilities?.university?.filter(Boolean).length > 0 || mou.responsibilities?.industry?.filter(Boolean).length > 0) ? `
//   <div class="section">
//     <div class="section-title">6. RESPONSIBILITIES</div>
//     ${mou.responsibilities?.university?.filter(Boolean).length > 0 ? `<p><strong>University:</strong></p><ul>${mou.responsibilities.university.filter(Boolean).map(r => `<li>${r}</li>`).join("")}</ul>` : ""}
//     ${mou.responsibilities?.industry?.filter(Boolean).length > 0 ? `<p><strong>Industry:</strong></p><ul>${mou.responsibilities.industry.filter(Boolean).map(r => `<li>${r}</li>`).join("")}</ul>` : ""}
//   </div>` : ""}

//   ${mou.terms?.filter(Boolean).length > 0 ? `
//   <div class="section">
//     <div class="section-title">7. TERMS & CONDITIONS</div>
//     <ol>${mou.terms.filter(Boolean).map(t => `<li>${t}</li>`).join("")}</ol>
//   </div>` : ""}

//   ${mou.scheduledMeeting ? `
//   <div class="section">
//     <div class="section-title">8. SCHEDULED MEETING</div>
//     <p><strong>Date:</strong> ${fmtDate(mou.scheduledMeeting.date)} at ${mou.scheduledMeeting.time}</p>
//     <p><strong>Venue:</strong> ${mou.scheduledMeeting.venue}</p>
//     <p><strong>Agenda:</strong> ${mou.scheduledMeeting.agenda}</p>
//   </div>` : ""}

//   <div class="signatories">
//     <div class="signatory">
//       <div class="sig-line">
//         ${mou.signatories?.university || "University Authority"}<br/>
//         <span style="font-size:11px;font-weight:400;color:#64748b">For ${mou.university}</span>
//       </div>
//     </div>
//     <div class="signatory">
//       <div class="sig-line">
//         ${mou.signatories?.industry || "Industry Authority"}<br/>
//         <span style="font-size:11px;font-weight:400;color:#64748b">For ${mou.industry}</span>
//       </div>
//     </div>
//   </div>

//   <div class="footer">
//     Generated on ${new Date().toLocaleString()} | MOU Portal — University Administration<br/>
//     University Approved: ${mou.universityStamp ? fmtDate(mou.universityStamp.date) : "—"} | 
//     Industry Approved: ${mou.industryStamp ? fmtDate(mou.industryStamp.date) : "—"}
//   </div>
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
//     setTimeout(() => document.body.removeChild(iframe), 1000);
//   }, 500);
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// const MouManagement = () => {
//   return (
//     <NotificationProvider>
//       <MouApp />
//     </NotificationProvider>
//   );
// };

// const MouApp = () => {
//   const { addNotification } = useNotify();
//   const [view, setView]               = useState("list");
//   const [mous, setMous]               = useState([]);
//   const [selected, setSelected]       = useState(null);
//   const [search, setSearch]           = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [loading, setLoading]         = useState(true);
//   const [meetingModal, setMeetingModal] = useState(false);
//   const [approveModal, setApproveModal] = useState(false);
//   const [stampType, setStampType]     = useState("");
//   const [notifPanel, setNotifPanel]   = useState(false);
//   const [notifLog, setNotifLog]       = useState([]);

//   useEffect(() => { fetchMous(); }, []);

//   const fetchMous = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_URL);
//       setMous(res.data);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const pushNotif = (msg, type = "info") => {
//     addNotification(msg, type);
//     setNotifLog(l => [{ msg, type, time: new Date() }, ...l.slice(0, 19)]);
//   };

//   const filtered = mous.filter(m => {
//     const q = search.toLowerCase();
//     const matchQ = !q || m.university?.toLowerCase().includes(q) || m.industry?.toLowerCase().includes(q) || m.title?.toLowerCase().includes(q);
//     const matchS = filterStatus === "All" || m.status === filterStatus;
//     return matchQ && matchS;
//   });

//   const expiringSoon = mous.filter(m => {
//     const diff = (new Date(m.endDate) - new Date()) / 86400000;
//     return diff > 0 && diff <= 30;
//   });

//   const openDetail = (mou) => { setSelected(mou); setView("detail"); };
//   const goBack     = ()    => { setSelected(null); setView("list"); };

//   const handleSend = async () => {
//     if (!selected) return;
//     if (!window.confirm(`Send this MOU to ${selected.industry}?`)) return;
//     try {
//       const updated = { ...selected, status: "Sent to Industry", sentAt: new Date().toISOString() };
//       const res = await axios.put(`${API_URL}/${selected._id}`, updated);
//       updateLocal(res.data);
//       pushNotif(`📨 MOU sent to ${selected.industry} successfully!`, "success");
//     } catch(e) { pushNotif("Error sending MOU", "error"); }
//   };

//   const handleApproveReject = async (type) => {
//     if (!selected) return;
//     const newStatus = type === "approve" ? "Approved by University" : "Rejected";
//     const stamp = {
//       by: "University Admin",
//       type,
//       date: new Date().toISOString(),
//       note: type === "approve" ? "Approved by University Authority" : "Rejected by University",
//     };
//     try {
//       const isMutual = type === "approve" && selected.status === "Approved by Industry";
//       const updated = {
//         ...selected,
//         status: isMutual ? "Mutually Approved" : newStatus,
//         universityStamp: stamp,
//       };
//       const res = await axios.put(`${API_URL}/${selected._id}`, updated);
//       updateLocal(res.data);
//       setApproveModal(false);
//       if (isMutual) {
//         pushNotif(`🎉 MOU is now Mutually Approved! PDF download available.`, "success");
//       } else if (type === "approve") {
//         pushNotif(`✅ MOU approved by University. Industry will be notified.`, "success");
//         setTimeout(() => pushNotif(`🔔 Notification sent to ${selected.industry} — University has approved the MOU.`, "info"), 1200);
//       } else {
//         pushNotif(`❌ MOU rejected. Industry will be notified.`, "error");
//         setTimeout(() => pushNotif(`🔔 Notification sent to ${selected.industry} — MOU has been rejected.`, "info"), 1200);
//       }
//     } catch(e) { pushNotif("Error updating status", "error"); }
//   };

//   // ── industry approve (simulate from university portal) ──
//   const handleIndustryApprove = async () => {
//     if (!selected) return;
//     const stamp = {
//       by: selected.industry,
//       type: "approve",
//       date: new Date().toISOString(),
//       note: "Approved by Industry Representative",
//     };
//     try {
//       const isMutual = selected.status === "Approved by University";
//       const updated = {
//         ...selected,
//         status: isMutual ? "Mutually Approved" : "Approved by Industry",
//         industryStamp: stamp,
//         industryResponseAt: new Date().toISOString(),
//       };
//       const res = await axios.put(`${API_URL}/${selected._id}`, updated);
//       updateLocal(res.data);
//       if (isMutual) {
//         pushNotif(`🎉 Both parties approved! MOU is Mutually Approved. PDF download available.`, "success");
//       } else {
//         pushNotif(`✅ ${selected.industry} has approved the MOU! PDF download is now available.`, "success");
//         setTimeout(() => pushNotif(`🔔 University has been notified of industry approval.`, "info"), 1200);
//       }
//     } catch(e) { pushNotif("Error processing industry approval", "error"); }
//   };

//   const handleMeetingSave = async (meetingData) => {
//     try {
//       const updated = { ...selected, scheduledMeeting: meetingData, status: selected.status };
//       const res = await axios.put(`${API_URL}/${selected._id}`, updated);
//       updateLocal(res.data);
//       setMeetingModal(false);
//       pushNotif(`📅 Meeting scheduled for ${meetingData.date} at ${meetingData.time}`, "success");
//       // Simulate notification to industry
//       setTimeout(() => pushNotif(`🔔 ${selected.industry} has been notified of the scheduled meeting.`, "info"), 1000);
//     } catch(e) { pushNotif("Error saving meeting", "error"); }
//   };

//   // ── send notification after approve (re-send MOU) ──
//   const handleSendAfterApprove = async () => {
//     if (!selected) return;
//     if (!["Approved by University", "Mutually Approved"].includes(selected.status)) {
//       pushNotif("Can only notify industry after University approval.", "error");
//       return;
//     }
//     pushNotif(`📬 Re-sent MOU notification to ${selected.industry} with current approval status.`, "success");
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this MOU?")) return;
//     await axios.delete(`${API_URL}/${id}`);
//     setMous(s => s.filter(m => m._id !== id));
//     if (view === "detail") goBack();
//   };

//   const updateLocal = (updated) => {
//     setMous(s => s.map(m => m._id === updated._id ? updated : m));
//     setSelected(updated);
//   };

//   // simulate industry proposing changes — triggers notification
//   const simulateIndustryChange = async () => {
//     if (!selected) return;
//     const fakeChange = {
//       field: "Duration",
//       oldValue: fmtDate(selected.endDate),
//       newValue: "Extended by 6 months",
//       reason: "Project scope expanded",
//       date: new Date().toISOString(),
//     };
//     const updated = {
//       ...selected,
//       status: "Changes Proposed",
//       proposedChanges: [...(selected.proposedChanges || []), fakeChange],
//       industryResponseAt: new Date().toISOString(),
//     };
//     try {
//       const res = await axios.put(`${API_URL}/${selected._id}`, updated);
//       updateLocal(res.data);
//       pushNotif(`🔔 ${selected.industry} has proposed changes to the MOU!`, "info");
//     } catch(e) { pushNotif("Error simulating change", "error"); }
//   };

//   return (
//     <div style={S.page}>
//       {/* TOP BAR */}
//       <div style={S.topbar}>
//         <div style={S.brand}>
//           <FileText size={20} color="#fff" />
//           <span style={S.brandText}>MOU Portal</span>
//           <span style={S.brandSub}>University Administration</span>
//         </div>
//         <div style={S.topActions}>
//           {expiringSoon.length > 0 && (
//             <div style={S.alertChip}>
//               <Bell size={13} /> {expiringSoon.length} expiring soon
//             </div>
//           )}
//           <div style={{ position: "relative" }}>
//             <motion.button whileHover={{ scale: 1.05 }} style={S.notifBtn}
//               onClick={() => setNotifPanel(p => !p)}>
//               <Bell size={16} color="#fff" />
//               {notifLog.length > 0 && (
//                 <span style={S.notifDot}>{notifLog.length > 9 ? "9+" : notifLog.length}</span>
//               )}
//             </motion.button>
//             <AnimatePresence>
//               {notifPanel && (
//                 <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                   style={S.notifPanel}>
//                   <div style={S.notifPanelHeader}>
//                     <span style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>🔔 Notifications</span>
//                     {notifLog.length > 0 && (
//                       <button style={S.clearBtn} onClick={() => setNotifLog([])}>Clear all</button>
//                     )}
//                   </div>
//                   {notifLog.length === 0 ? (
//                     <div style={{ padding: 20, color: "#94a3b8", fontSize: 13, textAlign: "center" }}>No notifications yet</div>
//                   ) : (
//                     notifLog.map((n, i) => (
//                       <div key={i} style={S.notifItem}>
//                         <div style={{ fontSize: 13, color: "#1e3a5f" }}>{n.msg}</div>
//                         <div style={{ fontSize: 11, color: "#94a3b8" }}>{n.time?.toLocaleTimeString()}</div>
//                       </div>
//                     ))
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//           <div style={S.avatar}>UA</div>
//         </div>
//       </div>

//       <div style={S.body}>
//         {view === "list" && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//             <div style={S.statsRow}>
//               {[
//                 { label: "Total MOUs", val: mous.length, color: "#1e3a5f" },
//                 { label: "Ongoing", val: mous.filter(m => new Date(m.endDate) > new Date()).length, color: "#0284c7" },
//                 { label: "Pending Review", val: mous.filter(m => m.status === "Changes Proposed" || m.status === "Approved by Industry").length, color: "#7c3aed" },
//                 { label: "Expiring Soon", val: expiringSoon.length, color: "#d97706" },
//                 { label: "Mutually Approved", val: mous.filter(m => m.status === "Mutually Approved").length, color: "#16a34a" },
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
//                 <input style={S.searchInput} placeholder="Search by name, industry, title..."
//                   value={search} onChange={e => setSearch(e.target.value)} />
//                 {search && <X size={14} style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
//               </div>
//               <div style={S.filterBox}>
//                 <Filter size={14} color="#64748b" />
//                 <select style={S.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
//                   <option>All</option>
//                   {Object.keys(STATUS).map(s => <option key={s}>{s}</option>)}
//                 </select>
//               </div>
//               <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
//                 style={S.createBtn} onClick={() => setView("create")}>
//                 <PlusCircle size={15} /> Create MOU
//               </motion.button>
//             </div>

//             {loading ? (
//               <div style={S.empty}>Loading MOUs...</div>
//             ) : filtered.length === 0 ? (
//               <div style={S.empty}>No MOUs found. Create one!</div>
//             ) : (
//               <div style={S.cardGrid}>
//                 {filtered.map(m => <MouCard key={m._id} m={m} onOpen={openDetail} onDelete={handleDelete} />)}
//               </div>
//             )}
//           </motion.div>
//         )}

//         {view === "create" && (
//           <CreateMou
//             onBack={goBack}
//             onSaved={(saved) => {
//               setMous(s => [saved, ...s]);
//               pushNotif("✅ MOU created and saved as Draft!", "success");
//               goBack();
//             }}
//           />
//         )}

//         {view === "detail" && selected && (
//           <DetailView
//             mou={selected}
//             onBack={goBack}
//             onSend={handleSend}
//             onDelete={() => handleDelete(selected._id)}
//             onScheduleMeeting={() => setMeetingModal(true)}
//             onApproveReject={(type) => { setStampType(type); setApproveModal(true); }}
//             onUpdate={updateLocal}
//             onSendAfterApprove={handleSendAfterApprove}
//             onSimulateChange={simulateIndustryChange}
//             onIndustryApprove={handleIndustryApprove}
//             onDownloadPdf={() => generateMouPdf(selected)}
//           />
//         )}
//       </div>

//       <AnimatePresence>
//         {meetingModal && (
//           <MeetingModal
//             existing={selected?.scheduledMeeting}
//             onClose={() => setMeetingModal(false)}
//             onSave={handleMeetingSave}
//           />
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {approveModal && (
//           <StampModal
//             type={stampType}
//             mou={selected}
//             onClose={() => setApproveModal(false)}
//             onConfirm={() => handleApproveReject(stampType)}
//           />
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
//   const needsAction = ["Changes Proposed", "Approved by Industry"].includes(m.status);
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}
//       style={{ ...S.card, ...(needsAction ? S.cardUrgent : {}) }}
//     >
//       {needsAction && <div style={S.urgentStrip}>⚡ Action Required</div>}
//       {m.status === "Mutually Approved" && <div style={{ ...S.urgentStrip, background: "#dcfce7", color: "#16a34a" }}>✅ Mutually Approved</div>}
//       <div style={S.cardTop}>
//         <div>
//           <div style={S.cardTitle}>{m.title || "Untitled MOU"}</div>
//           <div style={S.cardMeta}>
//             <Building2 size={12} /> {m.university}
//             <ChevronRight size={12} style={{ margin: "0 2px" }} />
//             {m.industry}
//           </div>
//         </div>
//         <Badge status={m.status} />
//       </div>

//       <div style={{ fontSize: 12, color: "#64748b", margin: "6px 0" }}>
//         📅 {fmtDate(m.startDate)} → {fmtDate(m.endDate)}
//         {m.collaborationType && <span style={{ marginLeft: 8, background: "#e2e8f0", padding: "1px 8px", borderRadius: 10, fontSize: 11 }}>{m.collaborationType}</span>}
//       </div>

//       {hasChanges && (
//         <div style={S.changesBadge}>
//           <History size={11} /> {m.proposedChanges.length} change(s) proposed by industry
//         </div>
//       )}

//       <div style={{ margin: "8px 0 4px" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>
//           <span>Progress</span><span>{prog}%</span>
//         </div>
//         <div style={{ height: 4, background: "#e2e8f0", borderRadius: 4 }}>
//           <div style={{ width: `${prog}%`, height: "100%", background: needsAction ? "#7c3aed" : "#0284c7", borderRadius: 4, transition: "width 0.5s" }} />
//         </div>
//       </div>

//       <div style={S.cardFooter}>
//         <button style={S.btnOutline} onClick={() => onOpen(m)}>
//           <Eye size={13} /> View Details
//         </button>
//         <button style={S.btnDanger} onClick={() => onDelete(m._id)}>
//           <Trash2 size={13} />
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  CREATE MOU  — with logos on top
// // ═══════════════════════════════════════════════════════════════════════════════
// const CreateMou = ({ onBack, onSaved }) => {
//   const [saving, setSaving] = useState(false);
//   const [form, setForm] = useState({
//     title: "", university: "", industry: "",
//     collaborationType: "", startDate: "", endDate: "",
//     description: "",
//     objectives: [""],
//     responsibilities: { university: [""], industry: [""] },
//     terms: [""],
//     signatories: { university: "", industry: "" },
//     universityContact: { name: "", designation: "", email: "" },
//     industryContact: { name: "", designation: "", email: "" },
//     status: "Draft",
//   });

//   const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
//   const arrAdd    = (key)          => setForm(f => ({ ...f, [key]: [...f[key], ""] }));
//   const arrRemove = (key, i)       => setForm(f => ({ ...f, [key]: f[key].filter((_,j) => j!==i) }));
//   const arrUpdate = (key, i, val)  => setForm(f => { const a=[...f[key]]; a[i]=val; return {...f,[key]:a}; });
//   const nested2Add    = (key, sub)         => setForm(f => ({ ...f, [key]: { ...f[key], [sub]: [...f[key][sub], ""] } }));
//   const nested2Remove = (key, sub, i)      => setForm(f => ({ ...f, [key]: { ...f[key], [sub]: f[key][sub].filter((_,j)=>j!==i) } }));
//   const nested2Update = (key, sub, i, val) => setForm(f => { const a=[...f[key][sub]]; a[i]=val; return {...f,[key]:{...f[key],[sub]:a}}; });

//   const handleSave = async () => {
//     const { title, university, industry, collaborationType, startDate, endDate } = form;
//     if (!title || !university || !industry || !collaborationType || !startDate || !endDate)
//       return alert("Please fill all required fields.");
//     try {
//       setSaving(true);
//       const res = await axios.post(API_URL, form);
//       onSaved(res.data);
//     } catch(e) {
//       alert("Error saving MOU: " + (e.response?.data?.message || e.message));
//     } finally { setSaving(false); }
//   };

//   return (
//     <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
//       <div style={S.detailHeader}>
//         <button style={S.backBtn} onClick={onBack}><ArrowLeft size={16} /> Back</button>
//         <div>
//           <h2 style={{ margin: 0, color: "#1e3a5f", fontSize: 20 }}>Create New MOU</h2>
//           <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Fill in the MOU details below — fully editable before sending</p>
//         </div>
//         <div style={{ display: "flex", gap: 8 }}>
//           <button style={S.btnOutline} onClick={onBack}>Cancel</button>
//           <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
//             style={S.btnPrimary} onClick={handleSave} disabled={saving}>
//             {saving ? "Saving..." : "💾 Save Draft"}
//           </motion.button>
//         </div>
//       </div>

//       {/* ── MOU HEADER PREVIEW with Logos ── */}
//       <div style={S.mouHeaderPreview}>
//         <div style={S.mouLogoBox}>
//           <div style={S.mouLogoIcon}>🎓</div>
//           <div style={S.mouLogoName}>{form.university || "University Name"}</div>
//           <div style={S.mouLogoSub}>First Party</div>
//         </div>
//         <div style={S.mouLogoCenter}>
//           <div style={S.mouHandshake}>🤝</div>
//           <div style={S.mouAgreementLabel}>MOU Agreement</div>
//           <div style={S.mouAgreementSub}>{form.collaborationType || "Collaboration Type"}</div>
//         </div>
//         <div style={S.mouLogoBox}>
//           <div style={S.mouLogoIcon}>🏢</div>
//           <div style={S.mouLogoName}>{form.industry || "Industry Partner"}</div>
//           <div style={S.mouLogoSub}>Second Party</div>
//         </div>
//       </div>

//       <div style={S.createBody}>
//         <Section title="📋 Basic Information">
//           <div style={S.grid2}>
//             <FormField label="MOU Title *" value={form.title} onChange={v => set("title",v)} placeholder="e.g., Industry-Academia Research Collaboration" />
//             <FormField label="Collaboration Type *" value={form.collaborationType} onChange={v => set("collaborationType",v)} type="select"
//               options={["","Research","Internship","Training","Consultancy","Joint Venture","Other"]} />
//             <FormField label="University *" value={form.university} onChange={v => set("university",v)} placeholder="Full University Name" />
//             <FormField label="Industry Partner *" value={form.industry} onChange={v => set("industry",v)} placeholder="Company / Organization Name" />
//             <FormField label="Start Date *" value={form.startDate} onChange={v => set("startDate",v)} type="date" />
//             <FormField label="End Date *" value={form.endDate} onChange={v => set("endDate",v)} type="date" />
//           </div>
//           <FormField label="Purpose / Description" value={form.description} onChange={v => set("description",v)}
//             type="textarea" placeholder="Describe the purpose and scope of this MOU..." />
//         </Section>

//         <Section title="🎯 Objectives">
//           {form.objectives.map((obj, i) => (
//             <div key={i} style={S.listItem}>
//               <input style={S.listInput} value={obj} placeholder={`Objective ${i+1}`}
//                 onChange={e => arrUpdate("objectives", i, e.target.value)} />
//               {form.objectives.length > 1 &&
//                 <button style={S.listRemove} onClick={() => arrRemove("objectives", i)}><X size={13}/></button>}
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
//                   <input style={S.listInput} value={r} placeholder={`Responsibility ${i+1}`}
//                     onChange={e => nested2Update("responsibilities","university",i,e.target.value)} />
//                   {form.responsibilities.university.length > 1 &&
//                     <button style={S.listRemove} onClick={() => nested2Remove("responsibilities","university",i)}><X size={13}/></button>}
//                 </div>
//               ))}
//               <button style={S.addRowBtn} onClick={() => nested2Add("responsibilities","university")}>+ Add</button>
//             </div>
//             <div>
//               <label style={S.subLabel}>Industry Responsibilities</label>
//               {form.responsibilities.industry.map((r, i) => (
//                 <div key={i} style={S.listItem}>
//                   <input style={S.listInput} value={r} placeholder={`Responsibility ${i+1}`}
//                     onChange={e => nested2Update("responsibilities","industry",i,e.target.value)} />
//                   {form.responsibilities.industry.length > 1 &&
//                     <button style={S.listRemove} onClick={() => nested2Remove("responsibilities","industry",i)}><X size={13}/></button>}
//                 </div>
//               ))}
//               <button style={S.addRowBtn} onClick={() => nested2Add("responsibilities","industry")}>+ Add</button>
//             </div>
//           </div>
//         </Section>

//         <Section title="⚖️ Terms & Conditions">
//           {form.terms.map((t, i) => (
//             <div key={i} style={S.listItem}>
//               <input style={S.listInput} value={t} placeholder={`Term / Clause ${i+1}`}
//                 onChange={e => arrUpdate("terms", i, e.target.value)} />
//               {form.terms.length > 1 &&
//                 <button style={S.listRemove} onClick={() => arrRemove("terms", i)}><X size={13}/></button>}
//             </div>
//           ))}
//           <button style={S.addRowBtn} onClick={() => arrAdd("terms")}>+ Add Term</button>
//         </Section>

//         <Section title="👤 Contact Information">
//           <div style={S.grid2}>
//             <div>
//               <label style={S.subLabel}>University Contact</label>
//               <FormField label="Name" value={form.universityContact.name}
//                 onChange={v => set("universityContact",{...form.universityContact,name:v})} />
//               <FormField label="Designation" value={form.universityContact.designation}
//                 onChange={v => set("universityContact",{...form.universityContact,designation:v})} />
//               <FormField label="Email" value={form.universityContact.email} type="email"
//                 onChange={v => set("universityContact",{...form.universityContact,email:v})} />
//             </div>
//             <div>
//               <label style={S.subLabel}>Industry Contact</label>
//               <FormField label="Name" value={form.industryContact.name}
//                 onChange={v => set("industryContact",{...form.industryContact,name:v})} />
//               <FormField label="Designation" value={form.industryContact.designation}
//                 onChange={v => set("industryContact",{...form.industryContact,designation:v})} />
//               <FormField label="Email" value={form.industryContact.email} type="email"
//                 onChange={v => set("industryContact",{...form.industryContact,email:v})} />
//             </div>
//           </div>
//         </Section>

//         <Section title="✍️ Authorized Signatories">
//           <div style={S.grid2}>
//             <FormField label="University Signatory" value={form.signatories.university}
//               onChange={v => set("signatories",{...form.signatories,university:v})}
//               placeholder="Name & Designation" />
//             <FormField label="Industry Signatory" value={form.signatories.industry}
//               onChange={v => set("signatories",{...form.signatories,industry:v})}
//               placeholder="Name & Designation" />
//           </div>
//         </Section>

//         <div style={{ textAlign: "right", marginTop: 16 }}>
//           <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
//             style={{ ...S.btnPrimary, padding: "12px 32px", fontSize: 15 }}
//             onClick={handleSave} disabled={saving}>
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

//   const hasChanges = mou.proposedChanges && mou.proposedChanges.length > 0;
//   const canSend = ["Draft", "Rejected"].includes(mou.status);
//   const canApprove = ["Sent to Industry", "Changes Proposed", "Approved by Industry"].includes(mou.status);
//   const canIndustryApprove = ["Sent to Industry", "Changes Proposed", "Approved by University"].includes(mou.status) && !mou.industryStamp;
//   const canSendAfterApprove = ["Approved by University", "Mutually Approved"].includes(mou.status);
//   // PDF available if industry OR university has approved (or both)
//   const canDownloadPdf = ["Approved by Industry", "Approved by University", "Mutually Approved"].includes(mou.status);
//   const isMutuallyApproved = mou.status === "Mutually Approved";
//   const meeting = mou.scheduledMeeting;

//   const saveEdit = async () => {
//     try {
//       setSaving(true);
//       const res = await axios.put(`${API_URL}/${mou._id}`, editData);
//       onUpdate(res.data);
//       setEditing(false);
//     } catch(e) { alert("Error saving"); }
//     finally { setSaving(false); }
//   };

//   const setEdit = (key, val) => setEditData(f => ({ ...f, [key]: val }));

//   return (
//     <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
//       {/* Header */}
//       <div style={S.detailHeader}>
//         <button style={S.backBtn} onClick={onBack}><ArrowLeft size={16}/> Back</button>
//         <div style={{ flex: 1 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
//             <h2 style={{ margin: 0, color: "#1e3a5f", fontSize: 20 }}>{mou.title || "Untitled MOU"}</h2>
//             <Badge status={mou.status} />
//           </div>
//           <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
//             {mou.university} ↔ {mou.industry} | Created: {fmtDate(mou.createdAt)}
//           </p>
//         </div>
//         <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//           {editing ? (
//             <>
//               <button style={S.btnOutline} onClick={() => setEditing(false)}>Cancel</button>
//               <button style={S.btnPrimary} onClick={saveEdit} disabled={saving}>
//                 {saving ? "Saving..." : "💾 Save Changes"}
//               </button>
//             </>
//           ) : (
//             <>
//               {canSend && <button style={S.btnSend} onClick={onSend}><Send size={14}/> Send to Industry</button>}
//               {/* University Approve/Reject */}
//               {canApprove && (
//                 <>
//                   <button style={S.btnApprove} onClick={() => onApproveReject("approve")}><CheckCircle size={14}/> Univ. Approve</button>
//                   <button style={S.btnReject} onClick={() => onApproveReject("reject")}><XCircle size={14}/> Reject</button>
//                 </>
//               )}
//               {/* Industry Approve button */}
//               {canIndustryApprove && (
//                 <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
//                   style={S.btnIndustryApprove} onClick={onIndustryApprove}>
//                   <CheckSquare size={14}/> Industry Approve
//                 </motion.button>
//               )}
//               {canSendAfterApprove && (
//                 <button style={S.btnNotify} onClick={onSendAfterApprove}>
//                   <Bell size={14}/> Notify Industry
//                 </button>
//               )}
//               {/* PDF download available once ANY party approves */}
//               {canDownloadPdf && (
//                 <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
//                   style={S.btnDownload} onClick={onDownloadPdf}>
//                   <Download size={14}/> Download PDF
//                 </motion.button>
//               )}
//               <button style={S.btnMeeting} onClick={onScheduleMeeting}><Calendar size={14}/> {meeting ? "Edit Meeting" : "Schedule Meeting"}</button>
//               <button style={S.btnOutline} onClick={() => setEditing(true)}><Edit3 size={14}/> Edit MOU</button>
//               {["Sent to Industry"].includes(mou.status) && (
//                 <button style={{ ...S.btnOutline, color: "#7c3aed", borderColor: "#7c3aed" }}
//                   onClick={onSimulateChange} title="Simulate: Industry proposes a change">
//                   🔧 Simulate Change
//                 </button>
//               )}
//               <button style={S.btnDanger} onClick={onDelete}><Trash2 size={14}/></button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* ── MOU Logos banner on detail ── */}
//       <div style={{ ...S.mouHeaderPreview, marginBottom: 16, padding: "14px 24px" }}>
//         <div style={S.mouLogoBox}>
//           <div style={S.mouLogoIcon}>🎓</div>
//           <div style={S.mouLogoName}>{mou.university}</div>
//           <div style={S.mouLogoSub}>First Party</div>
//         </div>
//         <div style={S.mouLogoCenter}>
//           <div style={S.mouHandshake}>🤝</div>
//           <div style={S.mouAgreementLabel}>{mou.title || "MOU Agreement"}</div>
//           <div style={S.mouAgreementSub}>{mou.collaborationType}</div>
//           {isMutuallyApproved && (
//             <div style={{ marginTop: 6, background: "#dcfce7", color: "#16a34a", borderRadius: 20, padding: "2px 12px", fontSize: 11, fontWeight: 700, border: "1px solid #86efac" }}>
//               ✅ MUTUALLY APPROVED
//             </div>
//           )}
//         </div>
//         <div style={S.mouLogoBox}>
//           <div style={S.mouLogoIcon}>🏢</div>
//           <div style={S.mouLogoName}>{mou.industry}</div>
//           <div style={S.mouLogoSub}>Second Party</div>
//         </div>
//       </div>

//       <div style={S.detailBody}>
//         <div style={S.detailLeft}>
//           {hasChanges && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//               style={S.changesAlert}>
//               <AlertTriangle size={16} color="#7c3aed" />
//               <span style={{ color: "#7c3aed", fontWeight: 600 }}>
//                 Industry has proposed {mou.proposedChanges.length} change(s) — review in the sidebar
//               </span>
//             </motion.div>
//           )}

//           {meeting && (
//             <div style={S.meetingCard}>
//               <div style={{ fontWeight: 700, color: "#0284c7", marginBottom: 6, display:"flex", gap:6, alignItems:"center" }}>
//                 <Calendar size={14}/> Scheduled Meeting
//               </div>
//               <div style={S.meetingGrid}>
//                 <MeetingRow icon={<Clock size={12}/>} label="Date & Time" val={`${fmtDate(meeting.date)} at ${meeting.time}`} />
//                 <MeetingRow icon={<MapPin size={12}/>} label="Venue" val={meeting.venue} />
//                 <MeetingRow icon={<Coffee size={12}/>} label="Agenda" val={meeting.agenda} />
//                 {meeting.menu && <MeetingRow icon={<Coffee size={12}/>} label="Menu / Refreshments" val={meeting.menu} />}
//                 {meeting.attendees && <MeetingRow icon={<User size={12}/>} label="Attendees" val={meeting.attendees} />}
//               </div>
//             </div>
//           )}

//           {(mou.universityStamp || mou.industryStamp) && (
//             <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
//               {mou.universityStamp && <StampBadge stamp={mou.universityStamp} label="University" />}
//               {mou.industryStamp   && <StampBadge stamp={mou.industryStamp}   label="Industry"   />}
//             </div>
//           )}

//           {canDownloadPdf && (
//             <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }}
//               style={S.downloadBanner}>
//               <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                 <CheckSquare size={22} color="#16a34a" />
//                 <div>
//                   <div style={{ fontWeight:800, color:"#166534", fontSize:14 }}>
//                     {isMutuallyApproved ? "🎉 Both parties have approved this MOU!" : "✅ MOU has been approved — PDF ready!"}
//                   </div>
//                   <div style={{ fontSize:12, color:"#4ade80" }}>
//                     {isMutuallyApproved
//                       ? "The MOU is fully finalized. Download the official PDF document."
//                       : "Download the approved MOU as a PDF. Pending remaining party's approval."}
//                   </div>
//                 </div>
//               </div>
//               <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
//                 style={S.btnDownload} onClick={onDownloadPdf}>
//                 <Download size={15}/> Download PDF
//               </motion.button>
//             </motion.div>
//           )}

//           {editing ? (
//             <EditableMou data={editData} onChange={setEdit} />
//           ) : (
//             <ViewMou mou={mou} />
//           )}
//         </div>

//         <div style={S.sidebar}>
//           <div style={S.sidebarTitle}>
//             <History size={15}/> Change Log
//           </div>
//           {!hasChanges ? (
//             <div style={S.sidebarEmpty}>No changes proposed by industry yet.</div>
//           ) : (
//             mou.proposedChanges.map((c, i) => (
//               <motion.div key={i} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }}
//                 transition={{ delay: i * 0.1 }}
//                 style={S.changeItem}>
//                 <div style={{ fontWeight: 700, color: "#7c3aed", fontSize: 12, marginBottom: 4 }}>
//                   📝 {c.field || `Change #${i+1}`}
//                 </div>
//                 <div style={{ fontSize: 12, marginBottom: 4 }}>
//                   <span style={{ color: "#dc2626", textDecoration: "line-through" }}>{c.oldValue || "—"}</span>
//                   <span style={{ color: "#64748b", margin:"0 6px" }}>→</span>
//                   <span style={{ color: "#16a34a" }}>{c.newValue || "—"}</span>
//                 </div>
//                 {c.reason && <div style={{ fontSize: 11, color: "#94a3b8" }}>Reason: {c.reason}</div>}
//                 <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 4 }}>{fmtDate(c.date)}</div>
//               </motion.div>
//             ))
//           )}

//           <div style={{ ...S.sidebarTitle, marginTop: 16 }}>
//             <Clock size={15}/> Timeline
//           </div>
//           <div style={S.timeline}>
//             {[
//               { label: "Draft Created", date: mou.createdAt, done: true },
//               { label: "Sent to Industry", date: mou.sentAt, done: !!mou.sentAt },
//               { label: "Industry Response", date: mou.industryResponseAt, done: !!mou.industryResponseAt },
//               { label: "University Decision", date: mou.universityStamp?.date, done: !!mou.universityStamp },
//               { label: "Mutually Approved", date: null, done: mou.status === "Mutually Approved" },
//             ].map((t, i) => (
//               <div key={i} style={S.timelineItem}>
//                 <div style={{ ...S.timelineDot, background: t.done ? "#16a34a" : "#e2e8f0" }}>
//                   {t.done && <CheckCircle size={10} color="#fff" />}
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 12, fontWeight: 600, color: t.done ? "#1e3a5f" : "#94a3b8" }}>{t.label}</div>
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

// // ═══════════════════════════════════════════════════════════════════════════════
// //  VIEW MOU
// // ═══════════════════════════════════════════════════════════════════════════════
// const ViewMou = ({ mou }) => (
//   <div style={S.mouDoc}>
//     <div style={S.mouDocTitle}>MEMORANDUM OF UNDERSTANDING</div>
//     <div style={{ textAlign:"center", fontSize:13, color:"#64748b", marginBottom:16 }}>
//       {mou.university} & {mou.industry}
//     </div>
//     <hr style={{ borderColor:"#e2e8f0", margin:"12px 0" }} />

//     <MouSection title="1. Parties">
//       <p><strong>University:</strong> {mou.university}</p>
//       <p><strong>Industry:</strong> {mou.industry}</p>
//     </MouSection>
//     <MouSection title="2. Purpose">
//       <p>{mou.description || "—"}</p>
//     </MouSection>
//     <MouSection title="3. Collaboration Type">
//       <p>{mou.collaborationType}</p>
//     </MouSection>
//     <MouSection title="4. Duration">
//       <p>From <strong>{fmtDate(mou.startDate)}</strong> to <strong>{fmtDate(mou.endDate)}</strong></p>
//     </MouSection>
//     {mou.objectives?.filter(Boolean).length > 0 && (
//       <MouSection title="5. Objectives">
//         <ul>{mou.objectives.filter(Boolean).map((o,i) => <li key={i}>{o}</li>)}</ul>
//       </MouSection>
//     )}
//     {(mou.responsibilities?.university?.length > 0 || mou.responsibilities?.industry?.length > 0) && (
//       <MouSection title="6. Responsibilities">
//         {mou.responsibilities?.university?.filter(Boolean).length > 0 && (
//           <><strong>University:</strong><ul>{mou.responsibilities.university.filter(Boolean).map((r,i) => <li key={i}>{r}</li>)}</ul></>
//         )}
//         {mou.responsibilities?.industry?.filter(Boolean).length > 0 && (
//           <><strong>Industry:</strong><ul>{mou.responsibilities.industry.filter(Boolean).map((r,i) => <li key={i}>{r}</li>)}</ul></>
//         )}
//       </MouSection>
//     )}
//     {mou.terms?.filter(Boolean).length > 0 && (
//       <MouSection title="7. Terms & Conditions">
//         <ol>{mou.terms.filter(Boolean).map((t,i) => <li key={i}>{t}</li>)}</ol>
//       </MouSection>
//     )}
//     <MouSection title="8. Signatories">
//       <div style={{ display:"flex", gap:40, marginTop:8 }}>
//         <div>
//           <div style={{ borderTop:"1px solid #1e3a5f", paddingTop:6, marginTop:30, width:160 }}>
//             <strong>{mou.signatories?.university || "University Authority"}</strong><br />
//             <span style={{ fontSize:12, color:"#64748b" }}>For {mou.university}</span>
//           </div>
//         </div>
//         <div>
//           <div style={{ borderTop:"1px solid #1e3a5f", paddingTop:6, marginTop:30, width:160 }}>
//             <strong>{mou.signatories?.industry || "Industry Authority"}</strong><br />
//             <span style={{ fontSize:12, color:"#64748b" }}>For {mou.industry}</span>
//           </div>
//         </div>
//       </div>
//     </MouSection>
//   </div>
// );

// // ═══════════════════════════════════════════════════════════════════════════════
// //  EDITABLE MOU
// // ═══════════════════════════════════════════════════════════════════════════════
// const EditableMou = ({ data, onChange }) => {
//   const arrUpdate = (key, i, val) => {
//     const a = [...(data[key] || [])]; a[i] = val; onChange(key, a);
//   };
//   return (
//     <div style={S.mouDoc}>
//       <div style={S.mouDocTitle}>MEMORANDUM OF UNDERSTANDING — EDIT MODE</div>
//       <hr style={{ borderColor:"#e2e8f0", margin:"12px 0" }} />
//       <MouSection title="Basic Details">
//         <div style={S.grid2}>
//           <FormField label="Title" value={data.title} onChange={v => onChange("title", v)} />
//           <FormField label="Collaboration Type" value={data.collaborationType} type="select"
//             options={["","Research","Internship","Training","Consultancy","Joint Venture","Other"]}
//             onChange={v => onChange("collaborationType", v)} />
//           <FormField label="Start Date" value={data.startDate} type="date" onChange={v => onChange("startDate", v)} />
//           <FormField label="End Date" value={data.endDate} type="date" onChange={v => onChange("endDate", v)} />
//         </div>
//         <FormField label="Purpose" value={data.description} type="textarea" onChange={v => onChange("description", v)} />
//       </MouSection>
//       <MouSection title="Objectives">
//         {(data.objectives||[""]).map((o, i) => (
//           <input key={i} style={{ ...S.listInput, marginBottom:6 }} value={o}
//             onChange={e => arrUpdate("objectives", i, e.target.value)} placeholder={`Objective ${i+1}`} />
//         ))}
//       </MouSection>
//       <MouSection title="Terms & Conditions">
//         {(data.terms||[""]).map((t, i) => (
//           <input key={i} style={{ ...S.listInput, marginBottom:6 }} value={t}
//             onChange={e => arrUpdate("terms", i, e.target.value)} placeholder={`Term ${i+1}`} />
//         ))}
//       </MouSection>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  MEETING MODAL
// // ═══════════════════════════════════════════════════════════════════════════════
// const MeetingModal = ({ existing, onClose, onSave }) => {
//   const [form, setForm] = useState(existing || { date:"", time:"", venue:"", agenda:"", menu:"", attendees:"" });
//   const set = (k,v) => setForm(f => ({...f,[k]:v}));
//   return (
//     <div style={S.overlay}>
//       <motion.div initial={{ y:40, opacity:0, scale:0.95 }} animate={{ y:0, opacity:1, scale:1 }}
//         exit={{ y:40, opacity:0, scale:0.95 }}
//         style={{ ...S.modal, maxWidth:500 }}>
//         <div style={S.modalHeader}>
//           <div style={{ fontWeight:700, fontSize:16, color:"#1e3a5f", display:"flex", alignItems:"center", gap:8 }}>
//             <Calendar size={18} /> Schedule Meeting
//           </div>
//           <X size={20} style={{ cursor:"pointer" }} onClick={onClose} />
//         </div>
//         <div style={S.modalBody}>
//           <FormField label="Meeting Date *" value={form.date} type="date" onChange={v => set("date",v)} />
//           <FormField label="Time *" value={form.time} type="time" onChange={v => set("time",v)} />
//           <FormField label="Venue / Location *" value={form.venue} onChange={v => set("venue",v)} placeholder="e.g., Conference Room A, City Hotel" />
//           <FormField label="Agenda *" value={form.agenda} type="textarea" onChange={v => set("agenda",v)} placeholder="Meeting objectives and points to discuss..." />
//           <FormField label="Menu / Refreshments (optional)" value={form.menu} onChange={v => set("menu",v)} placeholder="e.g., Lunch, Tea & Coffee, etc." />
//           <FormField label="Expected Attendees (optional)" value={form.attendees} onChange={v => set("attendees",v)} placeholder="e.g., Dean, Industry Director, Project Lead" />
//         </div>
//         <div style={{ padding:"12px 20px", display:"flex", gap:8, justifyContent:"flex-end", borderTop:"1px solid #f1f5f9" }}>
//           <button style={S.btnOutline} onClick={onClose}>Cancel</button>
//           <button style={S.btnPrimary} onClick={() => {
//             if (!form.date || !form.time || !form.venue || !form.agenda) return alert("Please fill required fields.");
//             onSave(form);
//           }}>
//             <Calendar size={14}/> Save Meeting
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  STAMP MODAL
// // ═══════════════════════════════════════════════════════════════════════════════
// const StampModal = ({ type, mou, onClose, onConfirm }) => (
//   <div style={S.overlay}>
//     <motion.div initial={{ y:30, opacity:0, scale:0.95 }} animate={{ y:0, opacity:1, scale:1 }}
//       exit={{ y:30, opacity:0, scale:0.95 }}
//       style={{ ...S.modal, maxWidth:400, textAlign:"center" }}>
//       <div style={{ padding:32 }}>
//         <div style={{
//           width:80, height:80, borderRadius:"50%", margin:"0 auto 16px",
//           background: type==="approve" ? "#dcfce7" : "#fef2f2",
//           display:"flex", alignItems:"center", justifyContent:"center",
//           border: `3px solid ${type==="approve" ? "#16a34a" : "#dc2626"}`
//         }}>
//           {type==="approve" ? <CheckCircle size={36} color="#16a34a"/> : <XCircle size={36} color="#dc2626"/>}
//         </div>
//         <div style={{ fontSize:18, fontWeight:800, color:"#1e3a5f", marginBottom:8 }}>
//           {type==="approve" ? "Approve this MOU?" : "Reject this MOU?"}
//         </div>
//         <div style={{ fontSize:13, color:"#64748b", marginBottom:20 }}>
//           {type==="approve"
//             ? `This will stamp "APPROVED" on behalf of ${mou?.university}. The industry will be notified.`
//             : `This will mark the MOU as Rejected. Industry will be notified. You can re-send after changes.`}
//         </div>
//         {type==="approve" && mou?.status === "Approved by Industry" && (
//           <div style={{ background:"#dcfce7", border:"1px solid #16a34a", borderRadius:8, padding:"10px 16px", marginBottom:16, fontSize:13, color:"#166534" }}>
//             🎉 Industry has already approved! This will mark the MOU as <strong>Mutually Approved</strong> and enable PDF download.
//           </div>
//         )}
//         <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
//           <button style={S.btnOutline} onClick={onClose}>Cancel</button>
//           <button style={type==="approve" ? S.btnApprove : S.btnReject} onClick={onConfirm}>
//             <Stamp size={14}/>
//             {type==="approve" ? " Confirm Approve" : " Confirm Reject"}
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   </div>
// );

// // ═══════════════════════════════════════════════════════════════════════════════
// //  SMALL HELPERS
// // ═══════════════════════════════════════════════════════════════════════════════
// const Section = ({ title, children }) => (
//   <div style={S.section}>
//     <div style={S.sectionTitle}>{title}</div>
//     {children}
//   </div>
// );

// const MouSection = ({ title, children }) => (
//   <div style={{ marginBottom:16 }}>
//     <div style={{ fontWeight:700, color:"#1e3a5f", fontSize:13, marginBottom:6, borderBottom:"1px solid #f1f5f9", paddingBottom:4 }}>{title}</div>
//     <div style={{ fontSize:13, color:"#374151", lineHeight:1.7 }}>{children}</div>
//   </div>
// );

// const FormField = ({ label, value, onChange, type="text", placeholder="", options=[] }) => (
//   <div style={{ marginBottom:10 }}>
//     {label && <label style={{ fontSize:12, color:"#64748b", display:"block", marginBottom:4, fontWeight:600 }}>{label}</label>}
//     {type === "textarea" ? (
//       <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
//         style={{ ...S.input, height:80, resize:"vertical" }} />
//     ) : type === "select" ? (
//       <select value={value} onChange={e => onChange(e.target.value)} style={S.input}>
//         {options.map(o => <option key={o} value={o}>{o || "Select..."}</option>)}
//       </select>
//     ) : (
//       <input type={type} value={value} onChange={e => onChange(e.target.value)}
//         placeholder={placeholder} style={S.input} />
//     )}
//   </div>
// );

// const StampBadge = ({ stamp, label }) => (
//   <div style={{
//     border: `2px solid ${stamp.type==="approve" ? "#16a34a" : "#dc2626"}`,
//     borderRadius:8, padding:"8px 14px",
//     background: stamp.type==="approve" ? "#f0fdf4" : "#fef2f2",
//   }}>
//     <div style={{ fontWeight:800, fontSize:12, color: stamp.type==="approve" ? "#16a34a" : "#dc2626" }}>
//       {stamp.type==="approve" ? "✅ APPROVED" : "❌ REJECTED"} — {label}
//     </div>
//     <div style={{ fontSize:11, color:"#64748b" }}>By: {stamp.by} on {fmtDate(stamp.date)}</div>
//   </div>
// );

// const MeetingRow = ({ icon, label, val }) => (
//   <div style={{ display:"flex", gap:6, marginBottom:4, fontSize:12 }}>
//     <span style={{ color:"#0284c7" }}>{icon}</span>
//     <span style={{ color:"#64748b", minWidth:120 }}>{label}:</span>
//     <span style={{ color:"#1e3a5f", fontWeight:600 }}>{val || "—"}</span>
//   </div>
// );

// // ═══════════════════════════════════════════════════════════════════════════════
// //  STYLES
// // ═══════════════════════════════════════════════════════════════════════════════
// const S = {
//   page: { fontFamily: "'Segoe UI', sans-serif", minHeight:"100vh", background:"#f8fafc" },
//   topbar: { background:"linear-gradient(135deg,#1e3a5f,#0f2340)", padding:"12px 24px",
//     display:"flex", justifyContent:"space-between", alignItems:"center",
//     boxShadow:"0 2px 10px rgba(0,0,0,0.2)", position:"relative", zIndex:100 },
//   brand: { display:"flex", alignItems:"center", gap:10 },
//   brandText: { color:"#fff", fontWeight:800, fontSize:18, letterSpacing:0.5 },
//   brandSub: { color:"#93c5fd", fontSize:12, borderLeft:"1px solid #3b6ea0", paddingLeft:10, marginLeft:4 },
//   topActions: { display:"flex", alignItems:"center", gap:12 },
//   alertChip: { background:"#fef3c7", color:"#b45309", padding:"4px 12px", borderRadius:20,
//     fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:4 },
//   avatar: { width:34, height:34, borderRadius:"50%", background:"#3b82f6",
//     color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
//     fontWeight:700, fontSize:13 },
//   notifBtn: { background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)",
//     borderRadius:8, padding:"6px 8px", cursor:"pointer", display:"flex", alignItems:"center",
//     position:"relative" },
//   notifDot: { position:"absolute", top:-6, right:-6, background:"#ef4444", color:"#fff",
//     borderRadius:"50%", width:18, height:18, fontSize:10, fontWeight:700,
//     display:"flex", alignItems:"center", justifyContent:"center" },
//   notifPanel: { position:"absolute", right:0, top:44, width:340, background:"#fff",
//     borderRadius:12, boxShadow:"0 10px 40px rgba(0,0,0,0.15)", border:"1px solid #e2e8f0",
//     maxHeight:380, overflowY:"auto", zIndex:200 },
//   notifPanelHeader: { padding:"12px 16px", borderBottom:"1px solid #f1f5f9",
//     display:"flex", justifyContent:"space-between", alignItems:"center" },
//   clearBtn: { background:"transparent", border:"none", color:"#94a3b8", cursor:"pointer",
//     fontSize:12, fontWeight:600 },
//   notifItem: { padding:"10px 16px", borderBottom:"1px solid #f8fafc" },

//   body: { padding:24, maxWidth:1400, margin:"0 auto" },

//   statsRow: { display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" },
//   statCard: { flex:1, minWidth:130, background:"#fff", borderRadius:10, padding:"14px 18px",
//     boxShadow:"0 1px 4px rgba(0,0,0,0.06)", borderLeft:"3px solid #e2e8f0" },

//   toolbar: { display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" },
//   searchBox: { flex:1, minWidth:220, display:"flex", alignItems:"center", gap:8,
//     background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"8px 12px" },
//   searchInput: { flex:1, border:"none", outline:"none", fontSize:13, background:"transparent" },
//   filterBox: { display:"flex", alignItems:"center", gap:6, background:"#fff",
//     border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 12px" },
//   filterSel: { border:"none", outline:"none", fontSize:13, background:"transparent" },
//   createBtn: { display:"flex", alignItems:"center", gap:6, background:"#1e3a5f",
//     color:"#fff", border:"none", padding:"10px 18px", borderRadius:8, cursor:"pointer",
//     fontWeight:700, fontSize:13 },

//   cardGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 },
//   card: { background:"#fff", borderRadius:12, padding:16, boxShadow:"0 1px 6px rgba(0,0,0,0.06)",
//     transition:"all 0.2s", cursor:"default" },
//   cardUrgent: { borderLeft:"4px solid #7c3aed", background:"#fafaff" },
//   urgentStrip: { background:"#f5f3ff", color:"#7c3aed", fontSize:11, fontWeight:700,
//     padding:"3px 10px", borderRadius:6, marginBottom:8, display:"inline-block" },
//   cardTop: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 },
//   cardTitle: { fontWeight:700, color:"#1e3a5f", fontSize:14, marginBottom:3 },
//   cardMeta: { display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#64748b" },
//   changesBadge: { display:"flex", alignItems:"center", gap:5, background:"#f5f3ff",
//     color:"#7c3aed", fontSize:11, padding:"3px 10px", borderRadius:6, marginBottom:6, fontWeight:600 },
//   cardFooter: { display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 },

//   empty: { textAlign:"center", padding:60, color:"#94a3b8", fontSize:15 },

//   btnOutline: { display:"flex", alignItems:"center", gap:5, background:"#fff",
//     border:"1px solid #e2e8f0", color:"#374151", padding:"8px 14px",
//     borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
//   btnPrimary: { display:"flex", alignItems:"center", gap:5, background:"#1e3a5f",
//     color:"#fff", border:"none", padding:"8px 16px", borderRadius:7, cursor:"pointer",
//     fontSize:13, fontWeight:600 },
//   btnSend: { display:"flex", alignItems:"center", gap:5, background:"#0284c7",
//     color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer",
//     fontSize:13, fontWeight:600 },
//   btnApprove: { display:"flex", alignItems:"center", gap:5, background:"#16a34a",
//     color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer",
//     fontSize:13, fontWeight:600 },
//   btnReject: { display:"flex", alignItems:"center", gap:5, background:"#dc2626",
//     color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer",
//     fontSize:13, fontWeight:600 },
//   btnMeeting: { display:"flex", alignItems:"center", gap:5, background:"#7c3aed",
//     color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer",
//     fontSize:13, fontWeight:600 },
//   btnDanger: { display:"flex", alignItems:"center", gap:5, background:"#fef2f2",
//     color:"#dc2626", border:"1px solid #fecaca", padding:"8px 10px", borderRadius:7, cursor:"pointer" },
//   btnNotify: { display:"flex", alignItems:"center", gap:5, background:"#0ea5e9",
//     color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer",
//     fontSize:13, fontWeight:600 },
//   btnIndustryApprove: { display:"flex", alignItems:"center", gap:5, background:"#059669",
//     color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer",
//     fontSize:13, fontWeight:700, boxShadow:"0 2px 8px rgba(5,150,105,0.3)" },
//   btnDownload: { display:"flex", alignItems:"center", gap:5, background:"#16a34a",
//     color:"#fff", border:"none", padding:"8px 16px", borderRadius:7, cursor:"pointer",
//     fontSize:13, fontWeight:700 },

//   // MOU logo header preview
//   mouHeaderPreview: {
//     background: "linear-gradient(135deg,#f0f7ff,#e8f4fd)",
//     border: "1px solid #bfdbfe",
//     borderRadius: 14, padding: "20px 32px",
//     display: "flex", alignItems: "center", justifyContent: "space-between",
//     marginBottom: 20, boxShadow: "0 2px 12px rgba(30,58,95,0.07)"
//   },
//   mouLogoBox: {
//     textAlign: "center", minWidth: 140,
//     background: "#fff", borderRadius: 12, padding: "14px 20px",
//     border: "1px solid #dbeafe", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
//   },
//   mouLogoIcon: { fontSize: 32, display: "block", marginBottom: 6 },
//   mouLogoName: { fontWeight: 800, color: "#1e3a5f", fontSize: 13 },
//   mouLogoSub: { fontSize: 11, color: "#94a3b8", marginTop: 3 },
//   mouLogoCenter: { textAlign: "center", flex: 1, padding: "0 20px" },
//   mouHandshake: { fontSize: 40 },
//   mouAgreementLabel: { fontWeight: 800, color: "#1e3a5f", fontSize: 15, marginTop: 4 },
//   mouAgreementSub: { fontSize: 12, color: "#64748b", marginTop: 2 },

//   // Detail
//   detailHeader: { display:"flex", alignItems:"center", gap:16, marginBottom:20,
//     flexWrap:"wrap", background:"#fff", padding:16, borderRadius:12,
//     boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
//   backBtn: { display:"flex", alignItems:"center", gap:5, background:"transparent",
//     border:"1px solid #e2e8f0", color:"#64748b", padding:"7px 12px",
//     borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600, whiteSpace:"nowrap" },
//   detailBody: { display:"flex", gap:16 },
//   detailLeft: { flex:1, minWidth:0 },
//   sidebar: { width:280, flexShrink:0, background:"#fff", borderRadius:12, padding:16,
//     boxShadow:"0 1px 4px rgba(0,0,0,0.06)", maxHeight:"calc(100vh - 180px)",
//     overflowY:"auto", position:"sticky", top:16 },
//   sidebarTitle: { fontWeight:700, color:"#1e3a5f", fontSize:13, marginBottom:10,
//     display:"flex", alignItems:"center", gap:6, paddingBottom:8, borderBottom:"1px solid #f1f5f9" },
//   sidebarEmpty: { fontSize:12, color:"#94a3b8", textAlign:"center", padding:20 },
//   changeItem: { background:"#f5f3ff", border:"1px solid #e9d5ff", borderRadius:8,
//     padding:"10px 12px", marginBottom:8 },
//   timeline: { paddingLeft:4 },
//   timelineItem: { display:"flex", gap:10, alignItems:"flex-start", marginBottom:12 },
//   timelineDot: { width:20, height:20, borderRadius:"50%", flexShrink:0,
//     display:"flex", alignItems:"center", justifyContent:"center" },

//   // Download banner
//   downloadBanner: {
//     background: "linear-gradient(135deg,#dcfce7,#d1fae5)",
//     border: "1px solid #86efac",
//     borderRadius: 12, padding: "14px 20px", marginBottom: 16,
//     display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
//     flexWrap: "wrap"
//   },

//   // Create
//   createBody: { background:"#fff", borderRadius:12, padding:24, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
//   section: { marginBottom:28, paddingBottom:20, borderBottom:"1px solid #f1f5f9" },
//   sectionTitle: { fontWeight:800, color:"#1e3a5f", fontSize:15, marginBottom:14, display:"flex", alignItems:"center", gap:8 },
//   grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:8 },
//   subLabel: { fontWeight:700, fontSize:13, color:"#374151", display:"block", marginBottom:8 },
//   listItem: { display:"flex", gap:8, marginBottom:6, alignItems:"center" },
//   listInput: { flex:1, padding:"8px 12px", border:"1px solid #e2e8f0", borderRadius:7, fontSize:13, outline:"none", fontFamily:"inherit" },
//   listRemove: { background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:6, padding:"5px 8px", cursor:"pointer" },
//   addRowBtn: { background:"transparent", border:"1px dashed #cbd5e1", color:"#64748b", padding:"6px 14px", borderRadius:7, cursor:"pointer", fontSize:12, marginTop:4 },
//   input: { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:7, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box", background:"#fafafa" },

//   mouDoc: { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:28, marginBottom:16 },
//   mouDocTitle: { textAlign:"center", fontWeight:800, fontSize:18, color:"#1e3a5f", letterSpacing:1, marginBottom:6 },

//   meetingCard: { background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"12px 16px", marginBottom:12 },
//   meetingGrid: {},

//   changesAlert: { display:"flex", alignItems:"center", gap:10, background:"#f5f3ff", border:"1px solid #e9d5ff", borderRadius:10, padding:"10px 16px", marginBottom:12 },

//   overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 },
//   modal: { background:"#fff", borderRadius:14, width:"90%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" },
//   modalHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid #f1f5f9" },
//   modalBody: { padding:"16px 20px" },
// };

// export default MouManagement;


import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle, Search, Filter, X, Trash2, Eye, Send,
  CheckCircle, XCircle, Calendar, Clock, AlertTriangle,
  FileText, ChevronRight, Bell, User, Building2,
  MapPin, Coffee, Edit3, History, Stamp, ArrowLeft,
  Download, BellRing, CheckSquare, Upload
} from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/mous";

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS = {
  Draft:                   { color: "#64748b", bg: "#f1f5f9", label: "Draft" },
  "Sent to Industry":      { color: "#d97706", bg: "#fffbeb", label: "Sent to Industry" },
  "Changes Proposed":      { color: "#7c3aed", bg: "#f5f3ff", label: "Changes Proposed" },
  "Approved by Industry":  { color: "#059669", bg: "#ecfdf5", label: "Approved by Industry" },
  "Approved by University":{ color: "#0284c7", bg: "#e0f2fe", label: "Approved by Univ." },
  "Mutually Approved":     { color: "#16a34a", bg: "#dcfce7", label: "Mutually Approved ✓" },
  Rejected:                { color: "#dc2626", bg: "#fef2f2", label: "Rejected" },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-PK", { day:"2-digit", month:"short", year:"numeric" }) : "—";
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
    <path d="M12 3L1 9L12 15L23 9L12 3Z" stroke="#1e3a5f" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M5 12V17C5 17 7.5 20 12 20C16.5 20 19 17 19 17V12" stroke="#1e3a5f" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M23 9V15" stroke="#1e3a5f" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IndustrySvg = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="7" width="20" height="15" rx="1" stroke="#1e3a5f" strokeWidth="1.8"/>
    <path d="M6 7V4H18V7" stroke="#1e3a5f" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="9" y="14" width="6" height="8" stroke="#1e3a5f" strokeWidth="1.5"/>
    <path d="M6 11H8M10 11H12M14 11H16M6 14H8" stroke="#1e3a5f" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

// ─── PROFESSIONAL CENTER DIVIDER ──────────────────────────────────────────────
const MouDivider = () => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
    <div style={{ width:1, height:16, background:"linear-gradient(to bottom,transparent,#1e3a5f)" }}/>
    <div style={{ width:40, height:40, border:"2px solid #1e3a5f", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:"#fff", boxShadow:"0 2px 10px rgba(30,58,95,0.14)" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="1" stroke="#1e3a5f" strokeWidth="1.7"/>
        <rect x="13" y="3" width="8" height="8" rx="1" stroke="#1e3a5f" strokeWidth="1.7"/>
        <rect x="3" y="13" width="8" height="8" rx="1" stroke="#1e3a5f" strokeWidth="1.7"/>
        <rect x="13" y="13" width="8" height="8" rx="1" stroke="#1e3a5f" strokeWidth="1.7"/>
      </svg>
    </div>
    <div style={{ width:1, height:16, background:"linear-gradient(to top,transparent,#1e3a5f)" }}/>
    <div style={{ fontSize:9, letterSpacing:2.5, color:"#7a8fa6", textTransform:"uppercase", fontWeight:700, marginTop:5 }}>MOU</div>
  </div>
);

// ─── LOGO DISPLAY ─────────────────────────────────────────────────────────────
const LogoDisplay = ({ src, fallback, size = 44 }) => (
  src
    ? <img src={src} alt="logo" style={{ width:size, height:size, objectFit:"contain", borderRadius:4 }}/>
    : <div style={{ width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center" }}>{fallback}</div>
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
    <div style={{ marginBottom:10 }}>
      <label style={{ fontSize:12, color:"#64748b", display:"block", marginBottom:6, fontWeight:600 }}>{label}</label>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:56, height:56, border:"1.5px dashed #c5d5e8", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:"#f8fafc", overflow:"hidden", flexShrink:0 }}>
          {value ? <img src={value} alt="logo" style={{ width:"100%", height:"100%", objectFit:"contain" }}/> : <Upload size={18} color="#94a3b8"/>}
        </div>
        <div>
          <div style={{ display:"flex", gap:6, marginBottom:4 }}>
            <button type="button" style={S.uploadBtn} onClick={() => ref.current.click()}>
              <Upload size={12}/> {value ? "Change" : "Upload Logo"}
            </button>
            {value && (
              <button type="button" style={{ ...S.uploadBtn, background:"#fef2f2", color:"#dc2626", borderColor:"#fecaca" }} onClick={() => onChange("")}>Remove</button>
            )}
          </div>
          <div style={{ fontSize:11, color:"#94a3b8" }}>PNG or JPG recommended</div>
        </div>
        <input ref={ref} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFile}/>
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
      <div style={{ position:"fixed", top:70, right:20, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity:0, x:80 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:80 }}
              style={{ background: n.type==="success"?"#dcfce7": n.type==="error"?"#fef2f2":"#eff6ff", border:`1px solid ${n.type==="success"?"#86efac": n.type==="error"?"#fca5a5":"#93c5fd"}`, color: n.type==="success"?"#166534": n.type==="error"?"#991b1b":"#1e40af", padding:"10px 16px", borderRadius:10, boxShadow:"0 4px 20px rgba(0,0,0,0.12)", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:8, maxWidth:320 }}>
              {n.type === "success" ? <CheckCircle size={15}/> : <BellRing size={15}/>}
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
//  PDF GENERATOR — Professional, no meeting info
// ═══════════════════════════════════════════════════════════════════════════════
const generateMouPdf = (mou) => {
  let n = 1;
  const sec = (t) => `${n++}. ${t.toUpperCase()}`;
  const refNo = `MOU-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

  const uniLogoHtml = mou.universityLogo
    ? `<img src="${mou.universityLogo}" style="width:56px;height:56px;object-fit:contain;border-radius:4px;"/>`
    : `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 3L1 9L12 15L23 9L12 3Z" stroke="#1e3a5f" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 12V17C5 17 7.5 20 12 20C16.5 20 19 17 19 17V12" stroke="#1e3a5f" stroke-width="1.8" stroke-linecap="round"/><path d="M23 9V15" stroke="#1e3a5f" stroke-width="1.8" stroke-linecap="round"/></svg>`;

  const indLogoHtml = mou.industryLogo
    ? `<img src="${mou.industryLogo}" style="width:56px;height:56px;object-fit:contain;border-radius:4px;"/>`
    : `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="15" rx="1" stroke="#1e3a5f" stroke-width="1.8"/><path d="M6 7V4H18V7" stroke="#1e3a5f" stroke-width="1.8" stroke-linecap="round"/><rect x="9" y="14" width="6" height="8" stroke="#1e3a5f" stroke-width="1.5"/><path d="M6 11H8M10 11H12M14 11H16" stroke="#1e3a5f" stroke-width="1.3" stroke-linecap="round"/></svg>`;

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
  .frame-outer{position:absolute;inset:14px;border:2.5px solid #1e3a5f;pointer-events:none;}
  .frame-inner{position:absolute;inset:21px;border:0.75px solid #a8bcd4;pointer-events:none;}
  .corner{position:absolute;width:20px;height:20px;}
  .corner.tl{top:9px;left:9px;border-top:2.5px solid #1e3a5f;border-left:2.5px solid #1e3a5f;}
  .corner.tr{top:9px;right:9px;border-top:2.5px solid #1e3a5f;border-right:2.5px solid #1e3a5f;}
  .corner.bl{bottom:9px;left:9px;border-bottom:2.5px solid #1e3a5f;border-left:2.5px solid #1e3a5f;}
  .corner.br{bottom:9px;right:9px;border-bottom:2.5px solid #1e3a5f;border-right:2.5px solid #1e3a5f;}
  .topbar{height:7px;background:#1e3a5f;margin:14px 14px 0;}
  .content{padding:42px 58px 40px;position:relative;z-index:1;}
  .logo-row{display:flex;justify-content:space-between;align-items:center;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #c0cedc;}
  .entity{display:flex;align-items:center;gap:13px;}
  .entity.right{flex-direction:row-reverse;}
  .logo-box{width:62px;height:62px;border:1.5px solid #c0cedc;border-radius:6px;background:#f4f7fb;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;}
  .entity-text{line-height:1.35;}
  .entity-text.right{text-align:right;}
  .entity-tag{font-size:8.5px;letter-spacing:2.5px;color:#8a9db5;text-transform:uppercase;font-weight:700;}
  .entity-name{font-family:'Cormorant Garamond',serif;font-size:14.5px;font-weight:700;color:#1e3a5f;max-width:195px;}
  .center-divider{display:flex;flex-direction:column;align-items:center;gap:3px;padding:0 20px;}
  .d-line{width:1px;height:18px;}
  .d-line.t{background:linear-gradient(to bottom,transparent,rgba(30,58,95,0.5));}
  .d-line.b{background:linear-gradient(to top,transparent,rgba(30,58,95,0.5));}
  .d-circle{width:44px;height:44px;border:2px solid #1e3a5f;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(30,58,95,0.13);}
  .d-label{font-size:7.5px;letter-spacing:3px;color:#8a9db5;text-transform:uppercase;font-weight:700;margin-top:5px;}
  .title-block{text-align:center;padding:16px 0 14px;}
  .doc-eyebrow{font-size:9px;letter-spacing:4px;color:#8a9db5;text-transform:uppercase;font-weight:700;margin-bottom:8px;}
  .doc-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:#1e3a5f;letter-spacing:1.5px;line-height:1.1;}
  .doc-sub{font-size:12px;color:#8a9db5;margin-top:8px;font-style:italic;}
  .approved-row{text-align:center;margin:10px 0 18px;}
  .approved-seal{display:inline-flex;align-items:center;gap:11px;border:1.8px solid #15803d;color:#15803d;padding:5px 24px;font-size:10.5px;font-weight:700;letter-spacing:3px;text-transform:uppercase;}
  .seal-dot{width:6px;height:6px;background:#15803d;border-radius:50%;}
  .hr-bold{border:none;border-top:1.8px solid #1e3a5f;margin:14px 0;}
  .hr{border:none;border-top:0.75px solid #c0cedc;margin:12px 0;}
  .section{margin-bottom:17px;}
  .sec-title{font-family:'Cormorant Garamond',serif;font-size:12px;font-weight:700;color:#1e3a5f;letter-spacing:1.8px;text-transform:uppercase;border-left:3px solid #1e3a5f;padding:1px 0 1px 10px;margin-bottom:9px;}
  p{margin-bottom:5px;color:#2d3748;font-size:13px;}
  ul,ol{padding-left:22px;color:#2d3748;}
  li{margin-bottom:3px;font-size:13px;}
  .ptable{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px;}
  .ptable .h td{background:#eef3f8;font-weight:700;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#1e3a5f;padding:7px 14px;border:1px solid #c0cedc;}
  .ptable .b td{padding:11px 14px;border:1px solid #c0cedc;vertical-align:top;}
  .p-name{font-size:13px;font-weight:600;color:#1e3a5f;margin-bottom:4px;}
  .p-info{font-size:11.5px;color:#5a6a7e;line-height:1.6;}
  .sig-row{display:flex;gap:40px;margin-top:34px;}
  .sig-box{flex:1;}
  .sig-lbl{font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#a0adb8;font-weight:700;margin-bottom:4px;}
  .sig-line{border-bottom:1px solid #1e3a5f;height:44px;margin-bottom:6px;}
  .sig-name{font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700;color:#1e3a5f;}
  .sig-org{font-size:11px;color:#7a8fa6;margin-top:1px;}
  .sig-date{font-size:10.5px;color:#a0adb8;margin-top:8px;}
  .doc-footer{margin-top:26px;padding-top:10px;border-top:1px solid #c0cedc;display:flex;justify-content:space-between;font-size:10px;color:#a0adb8;font-style:italic;}
  .watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-38deg);font-family:'Cormorant Garamond',serif;font-size:96px;font-weight:700;color:rgba(30,58,95,0.036);letter-spacing:6px;white-space:nowrap;pointer-events:none;z-index:0;}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
</style>
</head>
<body>
<div class="page">
  <div class="watermark">CONFIDENTIAL</div>
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
            <rect x="3" y="3" width="8" height="8" rx="1" stroke="#1e3a5f" stroke-width="1.7"/>
            <rect x="13" y="3" width="8" height="8" rx="1" stroke="#1e3a5f" stroke-width="1.7"/>
            <rect x="3" y="13" width="8" height="8" rx="1" stroke="#1e3a5f" stroke-width="1.7"/>
            <rect x="13" y="13" width="8" height="8" rx="1" stroke="#1e3a5f" stroke-width="1.7"/>
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
      <p>${mou.description || "This Memorandum of Understanding establishes a formal framework for collaboration between the parties, defining mutual obligations and the scope of the partnership."}</p>
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
      ${mou.responsibilities?.university?.filter(Boolean).length > 0 ? `<p style="margin-bottom:4px;"><strong>${mou.university}:</strong></p><ul style="margin-bottom:10px;">${mou.responsibilities.university.filter(Boolean).map(r=>`<li>${r}</li>`).join("")}</ul>` : ""}
      ${mou.responsibilities?.industry?.filter(Boolean).length > 0 ? `<p style="margin-bottom:4px;"><strong>${mou.industry}:</strong></p><ul>${mou.responsibilities.industry.filter(Boolean).map(r=>`<li>${r}</li>`).join("")}</ul>` : ""}
    </div>` : ""}

    ${mou.terms?.filter(Boolean).length > 0 ? `
    <div class="section">
      <div class="sec-title">${sec("Terms and Conditions")}</div>
      <ol>${mou.terms.filter(Boolean).map(t=>`<li>${t}</li>`).join("")}</ol>
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
      <span>Generated: ${new Date().toLocaleDateString("en-PK",{day:"2-digit",month:"long",year:"numeric"})}</span>
    </div>

  </div>
</div>
</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1200);
  }, 600);
};

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
  const [meetingModal, setMeetingModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
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
  const goBack     = ()    => { setSelected(null); setView("list"); };

  const handleSend = async () => {
    if (!selected || !window.confirm(`Send this MOU to ${selected.industry}?`)) return;
    try {
      const res = await axios.put(`${API_URL}/${selected._id}`, { ...selected, status:"Sent to Industry", sentAt:new Date().toISOString() });
      updateLocal(res.data);
      pushNotif(`MOU sent to ${selected.industry} successfully!`, "success");
    } catch { pushNotif("Error sending MOU", "error"); }
  };

  const handleApproveReject = async (type) => {
    if (!selected) return;
    const stamp = { by:"University Admin", type, date:new Date().toISOString() };
    try {
      const isMutual = type === "approve" && selected.status === "Approved by Industry";
      const res = await axios.put(`${API_URL}/${selected._id}`, {
        ...selected,
        status: isMutual ? "Mutually Approved" : (type==="approve" ? "Approved by University" : "Rejected"),
        universityStamp: stamp,
      });
      updateLocal(res.data); setApproveModal(false);
      if (isMutual) pushNotif("🎉 Mutually Approved! PDF download available.", "success");
      else if (type === "approve") {
        pushNotif("MOU approved by University.", "success");
        setTimeout(() => pushNotif(`Notification sent to ${selected.industry} — University approved.`, "info"), 1200);
      } else {
        pushNotif("MOU rejected. Industry will be notified.", "error");
        setTimeout(() => pushNotif(`Notification sent to ${selected.industry} — MOU rejected.`, "info"), 1200);
      }
    } catch { pushNotif("Error updating status", "error"); }
  };

  const handleIndustryApprove = async () => {
    if (!selected) return;
    const stamp = { by:selected.industry, type:"approve", date:new Date().toISOString() };
    try {
      const isMutual = selected.status === "Approved by University";
      const res = await axios.put(`${API_URL}/${selected._id}`, {
        ...selected,
        status: isMutual ? "Mutually Approved" : "Approved by Industry",
        industryStamp: stamp, industryResponseAt: new Date().toISOString(),
      });
      updateLocal(res.data);
      if (isMutual) pushNotif("🎉 Both parties approved! MOU is Mutually Approved.", "success");
      else { pushNotif(`${selected.industry} has approved the MOU!`, "success"); setTimeout(() => pushNotif("University notified of industry approval.", "info"), 1200); }
    } catch { pushNotif("Error processing industry approval", "error"); }
  };

  const handleMeetingSave = async (meetingData) => {
    try {
      const res = await axios.put(`${API_URL}/${selected._id}`, { ...selected, scheduledMeeting: meetingData });
      updateLocal(res.data); setMeetingModal(false);
      pushNotif(`Meeting scheduled for ${meetingData.date} at ${meetingData.time}`, "success");
      setTimeout(() => pushNotif(`${selected.industry} notified of scheduled meeting.`, "info"), 1000);
    } catch { pushNotif("Error saving meeting", "error"); }
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
      const res = await axios.put(`${API_URL}/${selected._id}`, {
        ...selected, status:"Changes Proposed",
        proposedChanges: [...(selected.proposedChanges||[]), { field:"Duration", oldValue:fmtDate(selected.endDate), newValue:"Extended by 6 months", reason:"Project scope expanded", date:new Date().toISOString() }],
        industryResponseAt: new Date().toISOString(),
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
          <FileText size={20} color="#fff"/>
          <span style={S.brandText}>MOU</span>
          <span style={S.brandSub}>Industry Liason Incharge</span>
        </div>
        <div style={S.topActions}>
          {expiringSoon.length > 0 && <div style={S.alertChip}><Bell size={13}/> {expiringSoon.length} expiring soon</div>}
          <div style={{ position:"relative" }}>
            <motion.button whileHover={{ scale:1.05 }} style={S.notifBtn} onClick={() => setNotifPanel(p=>!p)}>
              <Bell size={16} color="#fff"/>
              {notifLog.length > 0 && <span style={S.notifDot}>{notifLog.length > 9 ? "9+" : notifLog.length}</span>}
            </motion.button>
            <AnimatePresence>
              {notifPanel && (
                <motion.div initial={{ opacity:0, y:-10, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-10, scale:0.95 }} style={S.notifPanel}>
                  <div style={S.notifPanelHeader}>
                    <span style={{ fontWeight:700, fontSize:14, color:"#1e3a5f" }}>Notifications</span>
                    {notifLog.length > 0 && <button style={S.clearBtn} onClick={() => setNotifLog([])}>Clear all</button>}
                  </div>
                  {notifLog.length === 0
                    ? <div style={{ padding:20, color:"#94a3b8", fontSize:13, textAlign:"center" }}>No notifications yet</div>
                    : notifLog.map((n,i) => (
                      <div key={i} style={S.notifItem}>
                        <div style={{ fontSize:13, color:"#1e3a5f" }}>{n.msg}</div>
                        <div style={{ fontSize:11, color:"#94a3b8" }}>{n.time?.toLocaleTimeString()}</div>
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
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div style={S.statsRow}>
              {[
                { label:"Total MOUs",        val:mous.length,                                                                              color:"#1e3a5f" },
                { label:"Ongoing",           val:mous.filter(m=>new Date(m.endDate)>new Date()).length,                                    color:"#0284c7" },
                { label:"Pending Review",    val:mous.filter(m=>["Changes Proposed","Approved by Industry"].includes(m.status)).length,    color:"#7c3aed" },
                { label:"Expiring Soon",     val:expiringSoon.length,                                                                      color:"#d97706" },
                { label:"Mutually Approved", val:mous.filter(m=>m.status==="Mutually Approved").length,                                    color:"#16a34a" },
              ].map((s,i) => (
                <div key={i} style={S.statCard}>
                  <div style={{ fontSize:11, color:"#64748b", marginBottom:4 }}>{s.label}</div>
                  <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
            <div style={S.toolbar}>
              <div style={S.searchBox}>
                <Search size={15} color="#94a3b8"/>
                <input style={S.searchInput} placeholder="Search by name, industry, title..." value={search} onChange={e=>setSearch(e.target.value)}/>
                {search && <X size={14} style={{ cursor:"pointer" }} onClick={() => setSearch("")}/>}
              </div>
              <div style={S.filterBox}>
                <Filter size={14} color="#64748b"/>
                <select style={S.filterSel} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                  <option>All</option>
                  {Object.keys(STATUS).map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }} style={S.createBtn} onClick={() => setView("create")}>
                <PlusCircle size={15}/> Create MOU
              </motion.button>
            </div>
            {loading ? <div style={S.empty}>Loading MOUs...</div>
              : filtered.length === 0 ? <div style={S.empty}>No MOUs found. Create one!</div>
              : <div style={S.cardGrid}>{filtered.map(m=><MouCard key={m._id} m={m} onOpen={openDetail} onDelete={handleDelete}/>)}</div>}
          </motion.div>
        )}
        {view === "create" && (
          <CreateMou onBack={goBack} onSaved={(saved) => { setMous(s=>[saved,...s]); pushNotif("MOU created and saved as Draft!", "success"); goBack(); }}/>
        )}
        {view === "detail" && selected && (
          <DetailView mou={selected} onBack={goBack} onSend={handleSend} onDelete={() => handleDelete(selected._id)}
            onScheduleMeeting={() => setMeetingModal(true)}
            onApproveReject={(type) => { setStampType(type); setApproveModal(true); }}
            onUpdate={updateLocal} onSendAfterApprove={handleSendAfterApprove}
            onSimulateChange={simulateIndustryChange} onIndustryApprove={handleIndustryApprove}
            onDownloadPdf={() => generateMouPdf(selected)}/>
        )}
      </div>

      <AnimatePresence>
        {meetingModal && <MeetingModal existing={selected?.scheduledMeeting} onClose={() => setMeetingModal(false)} onSave={handleMeetingSave}/>}
      </AnimatePresence>
      <AnimatePresence>
        {approveModal && <StampModal type={stampType} mou={selected} onClose={() => setApproveModal(false)} onConfirm={() => handleApproveReject(stampType)}/>}
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
  const needsAction = ["Changes Proposed","Approved by Industry"].includes(m.status);
  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
      whileHover={{ y:-3, boxShadow:"0 8px 30px rgba(0,0,0,0.1)" }}
      style={{ ...S.card, ...(needsAction ? S.cardUrgent : {}) }}>
      {needsAction && <div style={S.urgentStrip}>⚡ Action Required</div>}
      {m.status === "Mutually Approved" && <div style={{ ...S.urgentStrip, background:"#dcfce7", color:"#16a34a" }}>✅ Mutually Approved</div>}
      <div style={S.cardTop}>
        <div>
          <div style={S.cardTitle}>{m.title || "Untitled MOU"}</div>
          <div style={S.cardMeta}><Building2 size={12}/> {m.university}<ChevronRight size={12} style={{ margin:"0 2px" }}/>{m.industry}</div>
        </div>
        <Badge status={m.status}/>
      </div>
      <div style={{ fontSize:12, color:"#64748b", margin:"6px 0" }}>
        📅 {fmtDate(m.startDate)} → {fmtDate(m.endDate)}
        {m.collaborationType && <span style={{ marginLeft:8, background:"#e2e8f0", padding:"1px 8px", borderRadius:10, fontSize:11 }}>{m.collaborationType}</span>}
      </div>
      {hasChanges && <div style={S.changesBadge}><History size={11}/> {m.proposedChanges.length} change(s) proposed by industry</div>}
      <div style={{ margin:"8px 0 4px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#94a3b8", marginBottom:3 }}><span>Progress</span><span>{prog}%</span></div>
        <div style={{ height:4, background:"#e2e8f0", borderRadius:4 }}>
          <div style={{ width:`${prog}%`, height:"100%", background:needsAction?"#7c3aed":"#0284c7", borderRadius:4, transition:"width 0.5s" }}/>
        </div>
      </div>
      <div style={S.cardFooter}>
        <button style={S.btnOutline} onClick={() => onOpen(m)}><Eye size={13}/> View Details</button>
        <button style={S.btnDanger} onClick={() => onDelete(m._id)}><Trash2 size={13}/></button>
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
    title:"", university:"", industry:"", collaborationType:"",
    startDate:"", endDate:"", description:"", objectives:[""],
    responsibilities:{ university:[""], industry:[""] }, terms:[""],
    signatories:{ university:"", industry:"" },
    universityContact:{ name:"", designation:"", email:"" },
    industryContact:{ name:"", designation:"", email:"" },
    universityLogo:"", industryLogo:"",
    status:"Draft",
  });

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const arrAdd    = (k)       => setForm(f=>({...f,[k]:[...f[k],""]}));
  const arrRemove = (k,i)     => setForm(f=>({...f,[k]:f[k].filter((_,j)=>j!==i)}));
  const arrUpdate = (k,i,v)   => setForm(f=>{ const a=[...f[k]]; a[i]=v; return {...f,[k]:a}; });
  const n2Add    = (k,s)      => setForm(f=>({...f,[k]:{...f[k],[s]:[...f[k][s],""]}}));
  const n2Remove = (k,s,i)    => setForm(f=>({...f,[k]:{...f[k],[s]:f[k][s].filter((_,j)=>j!==i)}}));
  const n2Update = (k,s,i,v)  => setForm(f=>{ const a=[...f[k][s]]; a[i]=v; return {...f,[k]:{...f[k],[s]:a}}; });

  const handleSave = async () => {
    const { title, university, industry, collaborationType, startDate, endDate } = form;
    if (!title||!university||!industry||!collaborationType||!startDate||!endDate) return alert("Please fill all required fields.");
    try { setSaving(true); const res = await axios.post(API_URL, form); onSaved(res.data); }
    catch(e) { alert("Error saving MOU: " + (e.response?.data?.message || e.message)); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}>
      <div style={S.detailHeader}>
        <button style={S.backBtn} onClick={onBack}><ArrowLeft size={16}/> Back</button>
        <div>
          <h2 style={{ margin:0, color:"#1e3a5f", fontSize:20 }}>Create New MOU</h2>
          <p style={{ margin:0, fontSize:13, color:"#64748b" }}>Fill in MOU details </p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button style={S.btnOutline} onClick={onBack}>Cancel</button>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} style={S.btnPrimary} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "💾 Save Draft"}
          </motion.button>
        </div>
      </div>

      {/* LIVE PREVIEW HEADER */}
      <div style={S.mouHeaderPreview}>
        <div style={S.mouLogoBox}>
          <div style={S.mouLogoIconWrap}>
            <LogoDisplay src={form.universityLogo} fallback={<UniSvg size={26}/>} size={44}/>
          </div>
          <div style={S.mouLogoName}>{form.university || "University Name"}</div>
          <div style={S.mouLogoSub}>First Party</div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"0 8px" }}>
          <MouDivider/>
          <div style={S.mouAgreementLabel}>{form.title || "MOU Agreement"}</div>
          <div style={S.mouAgreementSub}>{form.collaborationType || "Collaboration Type"}</div>
        </div>
        <div style={S.mouLogoBox}>
          <div style={S.mouLogoIconWrap}>
            <LogoDisplay src={form.industryLogo} fallback={<IndustrySvg size={26}/>} size={44}/>
          </div>
          <div style={S.mouLogoName}>{form.industry || "Industry Partner"}</div>
          <div style={S.mouLogoSub}>Second Party</div>
        </div>
      </div>

      <div style={S.createBody}>
        <Section title="🖼️ Party Logos">
          <p style={{ fontSize:12, color:"#94a3b8", marginBottom:12 }}>Upload logos for both parties — they will appear in the header above and in the PDF.</p>
          <div style={S.grid2}>
            <LogoUploadField label="University Logo" value={form.universityLogo} onChange={v => set("universityLogo",v)}/>
            <LogoUploadField label="Industry / Company Logo" value={form.industryLogo} onChange={v => set("industryLogo",v)}/>
          </div>
        </Section>

        <Section title="📋 Basic Information">
          <div style={S.grid2}>
            <FormField label="MOU Title *" value={form.title} onChange={v=>set("title",v)} placeholder="e.g., Industry-Academia Research Collaboration"/>
            <FormField label="Collaboration Type *" value={form.collaborationType} onChange={v=>set("collaborationType",v)} type="select" options={["","Research","Internship","Training","Consultancy","Joint Venture","Other"]}/>
            <FormField label="University *" value={form.university} onChange={v=>set("university",v)} placeholder="Full University Name"/>
            <FormField label="Industry Partner *" value={form.industry} onChange={v=>set("industry",v)} placeholder="Company / Organization Name"/>
            <FormField label="Start Date *" value={form.startDate} onChange={v=>set("startDate",v)} type="date"/>
            <FormField label="End Date *" value={form.endDate} onChange={v=>set("endDate",v)} type="date"/>
          </div>
          <FormField label="Purpose / Description" value={form.description} onChange={v=>set("description",v)} type="textarea" placeholder="Describe the purpose and scope of this MOU..."/>
        </Section>

        <Section title="🎯 Objectives">
          {form.objectives.map((obj,i) => (
            <div key={i} style={S.listItem}>
              <input style={S.listInput} value={obj} placeholder={`Objective ${i+1}`} onChange={e=>arrUpdate("objectives",i,e.target.value)}/>
              {form.objectives.length > 1 && <button style={S.listRemove} onClick={() => arrRemove("objectives",i)}><X size={13}/></button>}
            </div>
          ))}
          <button style={S.addRowBtn} onClick={() => arrAdd("objectives")}>+ Add Objective</button>
        </Section>

        <Section title="📌 Responsibilities">
          <div style={S.grid2}>
            <div>
              <label style={S.subLabel}>University Responsibilities</label>
              {form.responsibilities.university.map((r,i) => (
                <div key={i} style={S.listItem}>
                  <input style={S.listInput} value={r} placeholder={`Responsibility ${i+1}`} onChange={e=>n2Update("responsibilities","university",i,e.target.value)}/>
                  {form.responsibilities.university.length > 1 && <button style={S.listRemove} onClick={() => n2Remove("responsibilities","university",i)}><X size={13}/></button>}
                </div>
              ))}
              <button style={S.addRowBtn} onClick={() => n2Add("responsibilities","university")}>+ Add</button>
            </div>
            <div>
              <label style={S.subLabel}>Industry Responsibilities</label>
              {form.responsibilities.industry.map((r,i) => (
                <div key={i} style={S.listItem}>
                  <input style={S.listInput} value={r} placeholder={`Responsibility ${i+1}`} onChange={e=>n2Update("responsibilities","industry",i,e.target.value)}/>
                  {form.responsibilities.industry.length > 1 && <button style={S.listRemove} onClick={() => n2Remove("responsibilities","industry",i)}><X size={13}/></button>}
                </div>
              ))}
              <button style={S.addRowBtn} onClick={() => n2Add("responsibilities","industry")}>+ Add</button>
            </div>
          </div>
        </Section>

        <Section title="⚖️ Terms & Conditions">
          {form.terms.map((t,i) => (
            <div key={i} style={S.listItem}>
              <input style={S.listInput} value={t} placeholder={`Term / Clause ${i+1}`} onChange={e=>arrUpdate("terms",i,e.target.value)}/>
              {form.terms.length > 1 && <button style={S.listRemove} onClick={() => arrRemove("terms",i)}><X size={13}/></button>}
            </div>
          ))}
          <button style={S.addRowBtn} onClick={() => arrAdd("terms")}>+ Add Term</button>
        </Section>

        <Section title="👤 Contact Information">
          <div style={S.grid2}>
            <div>
              <label style={S.subLabel}>University Contact</label>
              <FormField label="Name" value={form.universityContact.name} onChange={v=>set("universityContact",{...form.universityContact,name:v})}/>
              <FormField label="Designation" value={form.universityContact.designation} onChange={v=>set("universityContact",{...form.universityContact,designation:v})}/>
              <FormField label="Email" value={form.universityContact.email} type="email" onChange={v=>set("universityContact",{...form.universityContact,email:v})}/>
            </div>
            <div>
              <label style={S.subLabel}>Industry Contact</label>
              <FormField label="Name" value={form.industryContact.name} onChange={v=>set("industryContact",{...form.industryContact,name:v})}/>
              <FormField label="Designation" value={form.industryContact.designation} onChange={v=>set("industryContact",{...form.industryContact,designation:v})}/>
              <FormField label="Email" value={form.industryContact.email} type="email" onChange={v=>set("industryContact",{...form.industryContact,email:v})}/>
            </div>
          </div>
        </Section>

        <Section title="✍️ Authorized Signatories">
          <div style={S.grid2}>
            <FormField label="University Signatory" value={form.signatories.university} onChange={v=>set("signatories",{...form.signatories,university:v})} placeholder="Name & Designation"/>
            <FormField label="Industry Signatory" value={form.signatories.industry} onChange={v=>set("signatories",{...form.signatories,industry:v})} placeholder="Name & Designation"/>
          </div>
        </Section>

        <div style={{ textAlign:"right", marginTop:16 }}>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            style={{ ...S.btnPrimary, padding:"12px 32px", fontSize:15 }} onClick={handleSave} disabled={saving}>
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
const DetailView = ({ mou, onBack, onSend, onDelete, onScheduleMeeting, onApproveReject, onUpdate, onSendAfterApprove, onSimulateChange, onIndustryApprove, onDownloadPdf }) => {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(mou);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setEditData(mou); }, [mou]);

  const hasChanges    = mou.proposedChanges && mou.proposedChanges.length > 0;
  const canSend       = ["Draft","Rejected"].includes(mou.status);
  const canApprove    = ["Sent to Industry","Changes Proposed","Approved by Industry"].includes(mou.status);
  const canIndApprove = ["Sent to Industry","Changes Proposed","Approved by University"].includes(mou.status) && !mou.industryStamp;
  const canSendAfter  = ["Approved by University","Mutually Approved"].includes(mou.status);
  const canDownload   = ["Approved by Industry","Approved by University","Mutually Approved"].includes(mou.status);
  const isMutual      = mou.status === "Mutually Approved";
  const meeting       = mou.scheduledMeeting;

  const saveEdit = async () => {
    try { setSaving(true); const res = await axios.put(`${API_URL}/${mou._id}`, editData); onUpdate(res.data); setEditing(false); }
    catch { alert("Error saving"); } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}>
      <div style={S.detailHeader}>
        <button style={S.backBtn} onClick={onBack}><ArrowLeft size={16}/> Back</button>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <h2 style={{ margin:0, color:"#1e3a5f", fontSize:20 }}>{mou.title || "Untitled MOU"}</h2>
            <Badge status={mou.status}/>
          </div>
          <p style={{ margin:0, fontSize:12, color:"#64748b" }}>{mou.university} ↔ {mou.industry} | Created: {fmtDate(mou.createdAt)}</p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {editing ? (
            <>
              <button style={S.btnOutline} onClick={() => setEditing(false)}>Cancel</button>
              <button style={S.btnPrimary} onClick={saveEdit} disabled={saving}>{saving?"Saving...":"💾 Save Changes"}</button>
            </>
          ) : (
            <>
              {canSend       && <button style={S.btnSend} onClick={onSend}><Send size={14}/> Send to Industry</button>}
              {canApprove    && <><button style={S.btnApprove} onClick={()=>onApproveReject("approve")}><CheckCircle size={14}/> Univ. Approve</button><button style={S.btnReject} onClick={()=>onApproveReject("reject")}><XCircle size={14}/> Reject</button></>}
              {canIndApprove && <motion.button whileHover={{ scale:1.04 }} style={S.btnIndustryApprove} onClick={onIndustryApprove}><CheckSquare size={14}/> Industry Approve</motion.button>}
              {canSendAfter  && <button style={S.btnNotify} onClick={onSendAfterApprove}><Bell size={14}/> Notify Industry</button>}
              {canDownload   && <motion.button whileHover={{ scale:1.04 }} style={S.btnDownload} onClick={onDownloadPdf}><Download size={14}/> Download PDF</motion.button>}
              <button style={S.btnMeeting} onClick={onScheduleMeeting}><Calendar size={14}/> {meeting?"Edit Meeting":"Schedule Meeting"}</button>
              <button style={S.btnOutline} onClick={() => setEditing(true)}><Edit3 size={14}/> Edit MOU</button>
              {mou.status === "Sent to Industry" && <button style={{ ...S.btnOutline, color:"#7c3aed", borderColor:"#7c3aed" }} onClick={onSimulateChange}>🔧 Simulate Change</button>}
              <button style={S.btnDanger} onClick={onDelete}><Trash2 size={14}/></button>
            </>
          )}
        </div>
      </div>

      {/* HEADER BANNER */}
      <div style={{ ...S.mouHeaderPreview, marginBottom:16 }}>
        <div style={S.mouLogoBox}>
          <div style={S.mouLogoIconWrap}><LogoDisplay src={mou.universityLogo} fallback={<UniSvg size={26}/>} size={44}/></div>
          <div style={S.mouLogoName}>{mou.university}</div>
          <div style={S.mouLogoSub}>First Party</div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"0 8px" }}>
          <MouDivider/>
          <div style={S.mouAgreementLabel}>{mou.title || "MOU Agreement"}</div>
          <div style={S.mouAgreementSub}>{mou.collaborationType}</div>
          {isMutual && <div style={{ marginTop:6, background:"#dcfce7", color:"#16a34a", borderRadius:20, padding:"2px 12px", fontSize:11, fontWeight:700, border:"1px solid #86efac" }}>✅ MUTUALLY APPROVED</div>}
        </div>
        <div style={S.mouLogoBox}>
          <div style={S.mouLogoIconWrap}><LogoDisplay src={mou.industryLogo} fallback={<IndustrySvg size={26}/>} size={44}/></div>
          <div style={S.mouLogoName}>{mou.industry}</div>
          <div style={S.mouLogoSub}>Second Party</div>
        </div>
      </div>

      <div style={S.detailBody}>
        <div style={S.detailLeft}>
          {hasChanges && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={S.changesAlert}>
              <AlertTriangle size={16} color="#7c3aed"/>
              <span style={{ color:"#7c3aed", fontWeight:600 }}>Industry has proposed {mou.proposedChanges.length} change(s) — review in the sidebar</span>
            </motion.div>
          )}
          {meeting && (
            <div style={S.meetingCard}>
              <div style={{ fontWeight:700, color:"#0284c7", marginBottom:6, display:"flex", gap:6, alignItems:"center" }}><Calendar size={14}/> Scheduled Meeting</div>
              <MeetingRow icon={<Clock size={12}/>} label="Date & Time" val={`${fmtDate(meeting.date)} at ${meeting.time}`}/>
              <MeetingRow icon={<MapPin size={12}/>} label="Venue" val={meeting.venue}/>
              <MeetingRow icon={<Coffee size={12}/>} label="Agenda" val={meeting.agenda}/>
              {meeting.menu      && <MeetingRow icon={<Coffee size={12}/>} label="Menu"      val={meeting.menu}/>}
              {meeting.attendees && <MeetingRow icon={<User size={12}/>}   label="Attendees" val={meeting.attendees}/>}
            </div>
          )}
          {(mou.universityStamp || mou.industryStamp) && (
            <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
              {mou.universityStamp && <StampBadge stamp={mou.universityStamp} label="University"/>}
              {mou.industryStamp   && <StampBadge stamp={mou.industryStamp}   label="Industry"/>}
            </div>
          )}
          {canDownload && (
            <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} style={S.downloadBanner}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <CheckSquare size={22} color="#16a34a"/>
                <div>
                  <div style={{ fontWeight:800, color:"#166534", fontSize:14 }}>{isMutual ? "🎉 Both parties have approved this MOU!" : "✅ MOU approved — PDF ready"}</div>
                  <div style={{ fontSize:12, color:"#4ade80" }}>{isMutual ? "The MOU is fully finalized. Download the official PDF." : "Download the approved MOU PDF."}</div>
                </div>
              </div>
              <motion.button whileHover={{ scale:1.04 }} style={S.btnDownload} onClick={onDownloadPdf}><Download size={15}/> Download PDF</motion.button>
            </motion.div>
          )}
          {editing ? <EditableMou data={editData} onChange={(k,v)=>setEditData(f=>({...f,[k]:v}))}/> : <ViewMou mou={mou}/>}
        </div>

        <div style={S.sidebar}>
          <div style={S.sidebarTitle}><History size={15}/> Change Log</div>
          {!hasChanges ? <div style={S.sidebarEmpty}>No changes proposed by industry yet.</div>
            : mou.proposedChanges.map((c,i) => (
              <motion.div key={i} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.1 }} style={S.changeItem}>
                <div style={{ fontWeight:700, color:"#7c3aed", fontSize:12, marginBottom:4 }}>📝 {c.field || `Change #${i+1}`}</div>
                <div style={{ fontSize:12, marginBottom:4 }}>
                  <span style={{ color:"#dc2626", textDecoration:"line-through" }}>{c.oldValue||"—"}</span>
                  <span style={{ color:"#64748b", margin:"0 6px" }}>→</span>
                  <span style={{ color:"#16a34a" }}>{c.newValue||"—"}</span>
                </div>
                {c.reason && <div style={{ fontSize:11, color:"#94a3b8" }}>Reason: {c.reason}</div>}
                <div style={{ fontSize:10, color:"#cbd5e1", marginTop:4 }}>{fmtDate(c.date)}</div>
              </motion.div>
            ))}
          <div style={{ ...S.sidebarTitle, marginTop:16 }}><Clock size={15}/> Timeline</div>
          <div style={S.timeline}>
            {[
              { label:"Draft Created",       date:mou.createdAt,             done:true },
              { label:"Sent to Industry",    date:mou.sentAt,                done:!!mou.sentAt },
              { label:"Industry Response",   date:mou.industryResponseAt,    done:!!mou.industryResponseAt },
              { label:"University Decision", date:mou.universityStamp?.date, done:!!mou.universityStamp },
              { label:"Mutually Approved",   date:null,                      done:mou.status==="Mutually Approved" },
            ].map((t,i) => (
              <div key={i} style={S.timelineItem}>
                <div style={{ ...S.timelineDot, background:t.done?"#16a34a":"#e2e8f0" }}>
                  {t.done && <CheckCircle size={10} color="#fff"/>}
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:t.done?"#1e3a5f":"#94a3b8" }}>{t.label}</div>
                  {t.date && <div style={{ fontSize:10, color:"#94a3b8" }}>{fmtDate(t.date)}</div>}
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
    <div style={{ textAlign:"center", fontSize:13, color:"#64748b", marginBottom:16 }}>{mou.university} & {mou.industry}</div>
    <hr style={{ borderColor:"#e2e8f0", margin:"12px 0" }}/>
    <MouSection title="1. Parties"><p><strong>University:</strong> {mou.university}</p><p><strong>Industry:</strong> {mou.industry}</p></MouSection>
    <MouSection title="2. Purpose"><p>{mou.description || "—"}</p></MouSection>
    <MouSection title="3. Collaboration Type"><p>{mou.collaborationType}</p></MouSection>
    <MouSection title="4. Duration"><p>From <strong>{fmtDate(mou.startDate)}</strong> to <strong>{fmtDate(mou.endDate)}</strong></p></MouSection>
    {mou.objectives?.filter(Boolean).length > 0 && <MouSection title="5. Objectives"><ul>{mou.objectives.filter(Boolean).map((o,i)=><li key={i}>{o}</li>)}</ul></MouSection>}
    {(mou.responsibilities?.university?.filter(Boolean).length>0||mou.responsibilities?.industry?.filter(Boolean).length>0) && (
      <MouSection title="6. Responsibilities">
        {mou.responsibilities?.university?.filter(Boolean).length>0&&<><strong>University:</strong><ul>{mou.responsibilities.university.filter(Boolean).map((r,i)=><li key={i}>{r}</li>)}</ul></>}
        {mou.responsibilities?.industry?.filter(Boolean).length>0&&<><strong>Industry:</strong><ul>{mou.responsibilities.industry.filter(Boolean).map((r,i)=><li key={i}>{r}</li>)}</ul></>}
      </MouSection>
    )}
    {mou.terms?.filter(Boolean).length>0&&<MouSection title="7. Terms & Conditions"><ol>{mou.terms.filter(Boolean).map((t,i)=><li key={i}>{t}</li>)}</ol></MouSection>}
    <MouSection title="8. Signatories">
      <div style={{ display:"flex", gap:40, marginTop:8 }}>
        {[["university","university"],["industry","industry"]].map(([side,key])=>(
          <div key={side}><div style={{ borderTop:"1px solid #1e3a5f", paddingTop:6, marginTop:30, width:160 }}>
            <strong>{mou.signatories?.[key]||`${side.charAt(0).toUpperCase()+side.slice(1)} Authority`}</strong><br/>
            <span style={{ fontSize:12, color:"#64748b" }}>For {mou[side]}</span>
          </div></div>
        ))}
      </div>
    </MouSection>
  </div>
);

// ─── EDITABLE MOU ─────────────────────────────────────────────────────────────
const EditableMou = ({ data, onChange }) => {
  const upd = (k,i,v) => { const a=[...(data[k]||[])]; a[i]=v; onChange(k,a); };
  return (
    <div style={S.mouDoc}>
      <div style={S.mouDocTitle}>MEMORANDUM OF UNDERSTANDING - EDIT MODE</div>
      <hr style={{ borderColor:"#e2e8f0", margin:"12px 0" }}/>
      <MouSection title="Basic Details">
        <div style={S.grid2}>
          <FormField label="Title" value={data.title} onChange={v=>onChange("title",v)}/>
          <FormField label="Collaboration Type" value={data.collaborationType} type="select" options={["","Research","Internship","Training","Consultancy","Joint Venture","Other"]} onChange={v=>onChange("collaborationType",v)}/>
          <FormField label="Start Date" value={data.startDate} type="date" onChange={v=>onChange("startDate",v)}/>
          <FormField label="End Date" value={data.endDate} type="date" onChange={v=>onChange("endDate",v)}/>
        </div>
        <FormField label="Purpose" value={data.description} type="textarea" onChange={v=>onChange("description",v)}/>
      </MouSection>
      <MouSection title="Objectives">
        {(data.objectives||[""]).map((o,i)=><input key={i} style={{...S.listInput,marginBottom:6}} value={o} onChange={e=>upd("objectives",i,e.target.value)} placeholder={`Objective ${i+1}`}/>)}
      </MouSection>
      <MouSection title="Terms & Conditions">
        {(data.terms||[""]).map((t,i)=><input key={i} style={{...S.listInput,marginBottom:6}} value={t} onChange={e=>upd("terms",i,e.target.value)} placeholder={`Term ${i+1}`}/>)}
      </MouSection>
    </div>
  );
};

// ─── MEETING MODAL ────────────────────────────────────────────────────────────
const MeetingModal = ({ existing, onClose, onSave }) => {
  const [form, setForm] = useState(existing || { date:"",time:"",venue:"",agenda:"",menu:"",attendees:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <div style={S.overlay}>
      <motion.div initial={{y:40,opacity:0,scale:0.95}} animate={{y:0,opacity:1,scale:1}} exit={{y:40,opacity:0,scale:0.95}} style={{...S.modal,maxWidth:500}}>
        <div style={S.modalHeader}>
          <div style={{fontWeight:700,fontSize:16,color:"#1e3a5f",display:"flex",alignItems:"center",gap:8}}><Calendar size={18}/> Schedule Meeting</div>
          <X size={20} style={{cursor:"pointer"}} onClick={onClose}/>
        </div>
        <div style={S.modalBody}>
          <FormField label="Meeting Date *" value={form.date} type="date" onChange={v=>set("date",v)}/>
          <FormField label="Time *" value={form.time} type="time" onChange={v=>set("time",v)}/>
          <FormField label="Venue / Location *" value={form.venue} onChange={v=>set("venue",v)} placeholder="e.g., Conference Room A, City Hotel"/>
          <FormField label="Agenda *" value={form.agenda} type="textarea" onChange={v=>set("agenda",v)} placeholder="Meeting objectives and points to discuss..."/>
          <FormField label="Menu / Refreshments" value={form.menu} onChange={v=>set("menu",v)} placeholder="e.g., Lunch, Tea & Coffee"/>
          <FormField label="Expected Attendees" value={form.attendees} onChange={v=>set("attendees",v)} placeholder="e.g., Dean, Industry Director"/>
        </div>
        <div style={{padding:"12px 20px",display:"flex",gap:8,justifyContent:"flex-end",borderTop:"1px solid #f1f5f9"}}>
          <button style={S.btnOutline} onClick={onClose}>Cancel</button>
          <button style={S.btnPrimary} onClick={()=>{if(!form.date||!form.time||!form.venue||!form.agenda)return alert("Please fill required fields.");onSave(form);}}>
            <Calendar size={14}/> Save Meeting
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── STAMP MODAL ──────────────────────────────────────────────────────────────
const StampModal = ({ type, mou, onClose, onConfirm }) => (
  <div style={S.overlay}>
    <motion.div initial={{y:30,opacity:0,scale:0.95}} animate={{y:0,opacity:1,scale:1}} exit={{y:30,opacity:0,scale:0.95}} style={{...S.modal,maxWidth:400,textAlign:"center"}}>
      <div style={{padding:32}}>
        <div style={{width:80,height:80,borderRadius:"50%",margin:"0 auto 16px",background:type==="approve"?"#dcfce7":"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",border:`3px solid ${type==="approve"?"#16a34a":"#dc2626"}`}}>
          {type==="approve"?<CheckCircle size={36} color="#16a34a"/>:<XCircle size={36} color="#dc2626"/>}
        </div>
        <div style={{fontSize:18,fontWeight:800,color:"#1e3a5f",marginBottom:8}}>{type==="approve"?"Approve this MOU?":"Reject this MOU?"}</div>
        <div style={{fontSize:13,color:"#64748b",marginBottom:20}}>
          {type==="approve"?`Stamp "APPROVED" on behalf of ${mou?.university}. Industry will be notified.`:`Mark the MOU as Rejected. Industry will be notified.`}
        </div>
        {type==="approve"&&mou?.status==="Approved by Industry"&&(
          <div style={{background:"#dcfce7",border:"1px solid #16a34a",borderRadius:8,padding:"10px 16px",marginBottom:16,fontSize:13,color:"#166534"}}>
            🎉 Industry already approved! This will mark the MOU as <strong>Mutually Approved</strong>.
          </div>
        )}
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button style={S.btnOutline} onClick={onClose}>Cancel</button>
          <button style={type==="approve"?S.btnApprove:S.btnReject} onClick={onConfirm}>
            <Stamp size={14}/>{type==="approve"?" Confirm Approve":" Confirm Reject"}
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
  <div style={{marginBottom:16}}>
    <div style={{fontWeight:700,color:"#1e3a5f",fontSize:13,marginBottom:6,borderBottom:"1px solid #f1f5f9",paddingBottom:4}}>{title}</div>
    <div style={{fontSize:13,color:"#374151",lineHeight:1.7}}>{children}</div>
  </div>
);
const FormField = ({ label, value, onChange, type="text", placeholder="", options=[] }) => (
  <div style={{marginBottom:10}}>
    {label&&<label style={{fontSize:12,color:"#64748b",display:"block",marginBottom:4,fontWeight:600}}>{label}</label>}
    {type==="textarea"
      ?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...S.input,height:80,resize:"vertical"}}/>
      :type==="select"
        ?<select value={value} onChange={e=>onChange(e.target.value)} style={S.input}>{options.map(o=><option key={o} value={o}>{o||"Select..."}</option>)}</select>
        :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={S.input}/>
    }
  </div>
);
const StampBadge = ({ stamp, label }) => (
  <div style={{border:`2px solid ${stamp.type==="approve"?"#16a34a":"#dc2626"}`,borderRadius:8,padding:"8px 14px",background:stamp.type==="approve"?"#f0fdf4":"#fef2f2"}}>
    <div style={{fontWeight:800,fontSize:12,color:stamp.type==="approve"?"#16a34a":"#dc2626"}}>{stamp.type==="approve"?"✅ APPROVED":"❌ REJECTED"} — {label}</div>
    <div style={{fontSize:11,color:"#64748b"}}>By: {stamp.by} on {fmtDate(stamp.date)}</div>
  </div>
);
const MeetingRow = ({ icon, label, val }) => (
  <div style={{display:"flex",gap:6,marginBottom:4,fontSize:12}}>
    <span style={{color:"#0284c7"}}>{icon}</span>
    <span style={{color:"#64748b",minWidth:120}}>{label}:</span>
    <span style={{color:"#1e3a5f",fontWeight:600}}>{val||"—"}</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const S = {
  page:     { fontFamily:"'Segoe UI',sans-serif", minHeight:"100vh", background:"#f8fafc" },
  topbar:   { background:"linear-gradient(135deg,#193648,#193648)", padding:"12px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.2)", position:"relative", zIndex:100 },
  brand:    { display:"flex", alignItems:"center", gap:10 },
  brandText:{ color:"#fff", fontWeight:800, fontSize:18, letterSpacing:0.5 },
  brandSub: { color:"#93c5fd", fontSize:12, borderLeft:"1px solid #3b6ea0", paddingLeft:10, marginLeft:4 },
  topActions:{ display:"flex", alignItems:"center", gap:12 },
  alertChip:{ background:"#fef3c7", color:"#b45309", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:4 },
  avatar:   { width:34, height:34, borderRadius:"50%", background:"#193648", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13 },
  notifBtn: { background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:8, padding:"6px 8px", cursor:"pointer", display:"flex", alignItems:"center", position:"relative" },
  notifDot: { position:"absolute", top:-6, right:-6, background:"#ef4444", color:"#fff", borderRadius:"50%", width:18, height:18, fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" },
  notifPanel:{ position:"absolute", right:0, top:44, width:340, background:"#fff", borderRadius:12, boxShadow:"0 10px 40px rgba(0,0,0,0.15)", border:"1px solid #e2e8f0", maxHeight:380, overflowY:"auto", zIndex:200 },
  notifPanelHeader:{ padding:"12px 16px", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" },
  clearBtn: { background:"transparent", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:12, fontWeight:600 },
  notifItem:{ padding:"10px 16px", borderBottom:"1px solid #f8fafc" },
  body:     { padding:24, maxWidth:1400, margin:"0 auto" },
  statsRow: { display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" },
  statCard: { flex:1, minWidth:130, background:"#fff", borderRadius:10, padding:"14px 18px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", borderLeft:"3px solid #e2e8f0" },
  toolbar:  { display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" },
  searchBox:{ flex:1, minWidth:220, display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"8px 12px" },
  searchInput:{ flex:1, border:"none", outline:"none", fontSize:13, background:"transparent" },
  filterBox:{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 12px" },
  filterSel:{ border:"none", outline:"none", fontSize:13, background:"transparent" },
  createBtn:{ display:"flex", alignItems:"center", gap:6, background:"#1e3a5f", color:"#fff", border:"none", padding:"10px 18px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13 },
  cardGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 },
  card:     { background:"#fff", borderRadius:12, padding:16, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", transition:"all 0.2s" },
  cardUrgent:{ borderLeft:"4px solid #7c3aed", background:"#fafaff" },
  urgentStrip:{ background:"#f5f3ff", color:"#7c3aed", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6, marginBottom:8, display:"inline-block" },
  cardTop:  { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 },
  cardTitle:{ fontWeight:700, color:"#1e3a5f", fontSize:14, marginBottom:3 },
  cardMeta: { display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#64748b" },
  changesBadge:{ display:"flex", alignItems:"center", gap:5, background:"#f5f3ff", color:"#7c3aed", fontSize:11, padding:"3px 10px", borderRadius:6, marginBottom:6, fontWeight:600 },
  cardFooter:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 },
  empty:    { textAlign:"center", padding:60, color:"#94a3b8", fontSize:15 },

  btnOutline:       { display:"flex", alignItems:"center", gap:5, background:"#fff", border:"1px solid #e2e8f0", color:"#374151", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
  btnPrimary:       { display:"flex", alignItems:"center", gap:5, background:"#1e3a5f", color:"#fff", border:"none", padding:"8px 16px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
  btnSend:          { display:"flex", alignItems:"center", gap:5, background:"#0284c7", color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
  btnApprove:       { display:"flex", alignItems:"center", gap:5, background:"#16a34a", color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
  btnReject:        { display:"flex", alignItems:"center", gap:5, background:"#dc2626", color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
  btnMeeting:       { display:"flex", alignItems:"center", gap:5, background:"#7c3aed", color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
  btnDanger:        { display:"flex", alignItems:"center", gap:5, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", padding:"8px 10px", borderRadius:7, cursor:"pointer" },
  btnNotify:        { display:"flex", alignItems:"center", gap:5, background:"#0ea5e9", color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600 },
  btnIndustryApprove:{ display:"flex", alignItems:"center", gap:5, background:"#059669", color:"#fff", border:"none", padding:"8px 14px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:700, boxShadow:"0 2px 8px rgba(5,150,105,0.3)" },
  btnDownload:      { display:"flex", alignItems:"center", gap:5, background:"#16a34a", color:"#fff", border:"none", padding:"8px 16px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:700 },
  uploadBtn:        { display:"inline-flex", alignItems:"center", gap:5, background:"#f1f5f9", border:"1px solid #e2e8f0", color:"#374151", padding:"6px 12px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600 },

  mouHeaderPreview: { background:"linear-gradient(135deg,#f0f7ff,#e8f4fd)", border:"1px solid #bfdbfe", borderRadius:14, padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, boxShadow:"0 2px 12px rgba(30,58,95,0.07)" },
  mouLogoBox:       { textAlign:"center", minWidth:140, background:"#fff", borderRadius:12, padding:"14px 20px", border:"1px solid #dbeafe", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
  mouLogoIconWrap:  { width:54, height:54, borderRadius:8, background:"#eef4fb", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px", border:"1px solid #c5d5e8", overflow:"hidden" },
  mouLogoName:      { fontWeight:800, color:"#1e3a5f", fontSize:13 },
  mouLogoSub:       { fontSize:11, color:"#94a3b8", marginTop:3 },
  mouAgreementLabel:{ fontWeight:800, color:"#1e3a5f", fontSize:15, marginTop:8, textAlign:"center" },
  mouAgreementSub:  { fontSize:12, color:"#64748b", marginTop:2, textAlign:"center" },

  detailHeader:    { display:"flex", alignItems:"center", gap:16, marginBottom:20, flexWrap:"wrap", background:"#fff", padding:16, borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
  backBtn:         { display:"flex", alignItems:"center", gap:5, background:"transparent", border:"1px solid #e2e8f0", color:"#64748b", padding:"7px 12px", borderRadius:7, cursor:"pointer", fontSize:13, fontWeight:600, whiteSpace:"nowrap" },
  detailBody:      { display:"flex", gap:16 },
  detailLeft:      { flex:1, minWidth:0 },
  sidebar:         { width:280, flexShrink:0, background:"#fff", borderRadius:12, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", maxHeight:"calc(100vh - 180px)", overflowY:"auto", position:"sticky", top:16 },
  sidebarTitle:    { fontWeight:700, color:"#1e3a5f", fontSize:13, marginBottom:10, display:"flex", alignItems:"center", gap:6, paddingBottom:8, borderBottom:"1px solid #f1f5f9" },
  sidebarEmpty:    { fontSize:12, color:"#94a3b8", textAlign:"center", padding:20 },
  changeItem:      { background:"#f5f3ff", border:"1px solid #e9d5ff", borderRadius:8, padding:"10px 12px", marginBottom:8 },
  timeline:        { paddingLeft:4 },
  timelineItem:    { display:"flex", gap:10, alignItems:"flex-start", marginBottom:12 },
  timelineDot:     { width:20, height:20, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" },
  downloadBanner:  { background:"linear-gradient(135deg,#dcfce7,#d1fae5)", border:"1px solid #86efac", borderRadius:12, padding:"14px 20px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" },

  createBody:  { background:"#fff", borderRadius:12, padding:24, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
  section:     { marginBottom:28, paddingBottom:20, borderBottom:"1px solid #f1f5f9" },
  sectionTitle:{ fontWeight:800, color:"#1e3a5f", fontSize:15, marginBottom:14, display:"flex", alignItems:"center", gap:8 },
  grid2:       { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:8 },
  subLabel:    { fontWeight:700, fontSize:13, color:"#374151", display:"block", marginBottom:8 },
  listItem:    { display:"flex", gap:8, marginBottom:6, alignItems:"center" },
  listInput:   { flex:1, padding:"8px 12px", border:"1px solid #e2e8f0", borderRadius:7, fontSize:13, outline:"none", fontFamily:"inherit" },
  listRemove:  { background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:6, padding:"5px 8px", cursor:"pointer" },
  addRowBtn:   { background:"transparent", border:"1px dashed #cbd5e1", color:"#64748b", padding:"6px 14px", borderRadius:7, cursor:"pointer", fontSize:12, marginTop:4 },
  input:       { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:7, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box", background:"#fafafa" },
  mouDoc:      { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:28, marginBottom:16 },
  mouDocTitle: { textAlign:"center", fontWeight:800, fontSize:18, color:"#1e3a5f", letterSpacing:1, marginBottom:6 },
  meetingCard: { background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"12px 16px", marginBottom:12 },
  changesAlert:{ display:"flex", alignItems:"center", gap:10, background:"#f5f3ff", border:"1px solid #e9d5ff", borderRadius:10, padding:"10px 16px", marginBottom:12 },
  overlay:     { position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 },
  modal:       { background:"#fff", borderRadius:14, width:"90%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" },
  modalHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid #f1f5f9" },
  modalBody:   { padding:"16px 20px" },
};

export default MouManagement;