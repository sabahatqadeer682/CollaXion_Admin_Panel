import React, { useEffect, useState } from "react"; 
import { motion } from "framer-motion";
import { PlusCircle, Clock, AlertTriangle, Search, Filter, X, Trash2 } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/mous";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB limit

const MouManagement = () => {
  const [mous, setMous] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activityLog, setActivityLog] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    university: "",
    industry: "",
    collaborationType: "",
    startDate: "",
    endDate: "",
    attachment: null,
    description: "",
  });

  // Fetch MOUs from backend
  useEffect(() => {
    fetchMous();
  }, []);

  const fetchMous = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setMous(response.data);
      
      // Build activity log from fetched MOUs
      const logs = response.data.slice(0, 5).map(m => {
        const isExp = new Date(m.endDate).getTime() <= Date.now();
        return isExp 
          ? `⚠️ MOU expired: ${m.university} × ${m.industry} (${m.endDate})`
          : `✅ MOU created: ${m.title} between ${m.university} & ${m.industry} (${m.startDate})`;
      });
      setActivityLog(logs);
    } catch (error) {
      console.error("Error fetching MOUs:", error);
      setError("Failed to load MOUs from server");
      setActivityLog(["❌ Error loading MOUs from server"]);
    } finally {
      setLoading(false);
    }
  };

  const calcProgress = (start, end) => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const now = Date.now();
    if (isNaN(s) || isNaN(e) || e <= s) return 100;
    const total = e - s;
    const elapsed = Math.max(0, Math.min(now - s, total));
    return Math.round((elapsed / total) * 100);
  };

  const isExpired = (m) => new Date(m.endDate).getTime() <= Date.now();
  const isOngoing = (m) => new Date(m.endDate).getTime() > Date.now();

  const filtered = mous.filter((m) => {
    const q = searchTerm.trim().toLowerCase();
    const matches =
      !q ||
      (m.university && m.university.toLowerCase().includes(q)) ||
      (m.industry && m.industry.toLowerCase().includes(q));
    if (!matches) return false;
    if (filterStatus === "Ongoing") return isOngoing(m);
    if (filterStatus === "Expired") return isExpired(m);
    return true;
  });

  const expiringSoon = mous.filter((m) => {
    const end = new Date(m.endDate).getTime();
    const days = (end - Date.now()) / (1000 * 60 * 60 * 24);
    return days > 0 && days <= 30;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    
    try {
      // Validate file size
      if (formData.attachment && formData.attachment.size > MAX_FILE_SIZE) {
        alert(`File size too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
        return;
      }

      // Convert attachment to base64 if exists
      let attachmentData = null;
      let attachmentName = null;
      let attachmentType = null;
      
      if (formData.attachment) {
        const reader = new FileReader();
        attachmentData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(formData.attachment);
        });
        attachmentName = formData.attachment.name;
        attachmentType = formData.attachment.type;
      }

      const newMouData = {
        title: formData.title,
        university: formData.university,
        industry: formData.industry,
        collaborationType: formData.collaborationType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        extraDetails: [],
        signatories: { university: "", industry: "" },
        universityContact: { name: "", designation: "", email: "" },
        industryContact: { name: "", designation: "", email: "" },
        status: "Draft",
        attachmentData,
        attachmentName,
        attachmentType
      };

      // Generate PDF and get base64
      console.log("Generating PDF...");
      const pdfBase64 = await generateFormalMouPDF(newMouData, true);
      newMouData.pdfData = pdfBase64;

      // Check total data size
      const dataSize = JSON.stringify(newMouData).length;
      console.log(`Total MOU data size: ${(dataSize / 1024 / 1024).toFixed(2)} MB`);
      
      if (dataSize > 15 * 1024 * 1024) {
        alert("MOU data too large (>15MB). Try without attachment or use a smaller file.");
        return;
      }

      // Save to backend with timeout
      console.log("Saving to backend...");
      const response = await axios.post(API_URL, newMouData, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("MOU saved successfully:", response.data);

      // Update local state
      setMous((s) => [response.data, ...s]);
      setActivityLog((a) => [
        `✅ MOU created: ${response.data.title} between ${response.data.university} & ${response.data.industry} (Starts ${response.data.startDate})`,
        ...a.slice(0, 4), // Keep only last 5 logs
      ]);

      // Preview PDF in new tab
      const pdfBytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      // Reset form
      setFormData({
        title: "",
        university: "",
        industry: "",
        collaborationType: "",
        startDate: "",
        endDate: "",
        attachment: null,
        description: "",
      });
      setShowModal(false);
      alert("MOU created successfully!");
      
    } catch (error) {
      console.error("Error creating MOU:", error);
      
      // Detailed error logging
      if (error.response) {
        console.error("Server response:", error.response.data);
        console.error("Status code:", error.response.status);
        alert(`Failed to create MOU: ${error.response.data.message || error.response.data.error || 'Server error'}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Failed to create MOU: No response from server. Check if backend is running.");
      } else {
        console.error("Error details:", error.message);
        alert(`Failed to create MOU: ${error.message}`);
      }
    }
  };

  const handleDelete = async (mouId) => {
    if (!window.confirm("Are you sure you want to delete this MOU?")) return;
    
    try {
      await axios.delete(`${API_URL}/${mouId}`);
      setMous((s) => s.filter(m => m._id !== mouId));
      setActivityLog((a) => [`🗑️ MOU deleted`, ...a.slice(0, 4)]);
      alert("MOU deleted successfully!");
    } catch (error) {
      console.error("Error deleting MOU:", error);
      alert(`Failed to delete MOU: ${error.response?.data?.message || error.message}`);
    }
  };

  // Generate PDF - now returns base64 when returnBase64 is true
  const generateFormalMouPDF = async (mou, returnBase64 = false) => {
    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pageWidth = 612;
      const pageHeight = 792;
      const left = 60;
      const right = pageWidth - 60;
      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = page.getHeight() - 70;
      const lineHeight = 16;
      const textColor = rgb(0, 0, 0);

      // Centered Title
      const title = "MEMORANDUM OF UNDERSTANDING (MOU)";
      const titleSize = 14;
      const titleWidth = boldFont.widthOfTextAtSize(title, titleSize);
      page.drawText(title, { x: (pageWidth - titleWidth) / 2, y, font: boldFont, size: titleSize, color: textColor });

      y -= 28;

      // Intro paragraph
      const intro = `This Memorandum of Understanding (MOU) is made and entered into by and between ${mou.university || "the University"} (hereinafter referred to as "the University") and ${mou.industry || "the Industry"} (hereinafter referred to as "the Industry").`;
      y = drawWrappedText(pdfDoc, page, intro, left, y, right, font, 11, lineHeight);

      y -= 8;
      const refLine = `Title: ${mou.title || "—"}    |    Type: ${mou.collaborationType || "—"}    |    Effective: ${mou.startDate || "—"} to ${mou.endDate || "—"}`;
      y = drawWrappedText(pdfDoc, page, refLine, left, y, right, font, 10, lineHeight);

      y -= 12;

      // 1. Parties
      y = drawSectionHeading(page, "1. PARTIES", left, y, boldFont, 12);
      const p1a = `1.1 University: ${mou.university || "—"}.`;
      y = drawWrappedText(pdfDoc, page, p1a, left + 10, y, right, font, 11, lineHeight);
      const p1b = `1.2 Industry: ${mou.industry || "—"}.`;
      y = drawWrappedText(pdfDoc, page, p1b, left + 10, y, right, font, 11, lineHeight);

      y -= 6;

      // 2. Purpose
      y = drawSectionHeading(page, "2. PURPOSE", left, y, boldFont, 12);
      const purpose = mou.description && mou.description.trim().length > 0
        ? `The purpose of this MOU is to establish collaborative activities between the parties in relation to ${mou.description}.`
        : `The purpose of this MOU is to establish collaborative activities between the parties, including but not limited to research, internships, training, and consultancy services as mutually agreed.`;
      y = drawWrappedText(pdfDoc, page, purpose, left + 10, y, right, font, 11, lineHeight);

      y -= 6;

      // 3. Scope
      y = drawSectionHeading(page, "3. SCOPE & RESPONSIBILITIES", left, y, boldFont, 12);
      const scopeLines = [
        `${mou.university || "The University"} agrees to provide academic supervision, access to subject matter expertise and student involvement as appropriate.`,
        `${mou.industry || "The Industry"} agrees to provide practical guidance, access to facilities and industrial data, and mentorship where applicable.`,
        `Specific responsibilities of each party shall be agreed upon in writing and appended to this MOU where necessary.`
      ];
      for (const s of scopeLines) {
        y = drawWrappedText(pdfDoc, page, `• ${s}`, left + 12, y, right, font, 11, lineHeight);
      }

      y -= 6;

      // 4. Duration
      y = drawSectionHeading(page, "4. DURATION", left, y, boldFont, 12);
      const duration = `This MOU shall commence on ${mou.startDate || "—"} and remain in effect until ${mou.endDate || "—"}, unless earlier terminated in accordance with Section 6.`;
      y = drawWrappedText(pdfDoc, page, duration, left + 10, y, right, font, 11, lineHeight);

      y -= 6;

      // 5. Confidentiality
      y = drawSectionHeading(page, "5. CONFIDENTIALITY", left, y, boldFont, 12);
      const conf = `Each party agrees to maintain confidentiality of shared proprietary information and to use such information only for the purposes set forth in this MOU, except as required by law or by prior written consent of the disclosing party.`;
      y = drawWrappedText(pdfDoc, page, conf, left + 10, y, right, font, 11, lineHeight);

      y -= 6;

      // 6. Termination
      y = drawSectionHeading(page, "6. TERMINATION", left, y, boldFont, 12);
      const term = `Either party may terminate this MOU by providing thirty (30) days' prior written notice to the other party. Termination shall not affect accrued rights or obligations of either party at the date of termination.`;
      y = drawWrappedText(pdfDoc, page, term, left + 10, y, right, font, 11, lineHeight);

      y -= 10;

      // 7. Signatures
      if (y < 170) {
        ({ page, y } = addNewPageWithY(pdfDoc));
      }
      page.drawText("7. SIGNATURES", { x: left, y, font: boldFont, size: 12, color: textColor });
      y -= (lineHeight + 6);

      const sigBlockTop = y;
      const colWidth = (pageWidth - left * 2) / 2;
      const leftX = left;
      const rightX = left + colWidth + 10;

      page.drawText("For the University:", { x: leftX, y: sigBlockTop, font: font, size: 11, color: textColor });
      page.drawText(`Name & Title: ____________________________`, { x: leftX, y: sigBlockTop - lineHeight, font: font, size: 11 });
      page.drawText(`Signature: _______________________________`, { x: leftX, y: sigBlockTop - lineHeight * 2, font: font, size: 11 });
      page.drawText(`Date: _________________________________`, { x: leftX, y: sigBlockTop - lineHeight * 3, font: font, size: 11 });

      page.drawText("For the Industry:", { x: rightX, y: sigBlockTop, font: font, size: 11, color: textColor });
      page.drawText(`Name & Title: ____________________________`, { x: rightX, y: sigBlockTop - lineHeight, font: font, size: 11 });
      page.drawText(`Signature: _______________________________`, { x: rightX, y: sigBlockTop - lineHeight * 2, font: font, size: 11 });
      page.drawText(`Date: _________________________________`, { x: rightX, y: sigBlockTop - lineHeight * 3, font: font, size: 11 });

      // Handle attachment (only for small files)
      if (mou.attachmentData && mou.attachmentType && !returnBase64) {
        try {
          const attachmentBytes = Uint8Array.from(atob(mou.attachmentData), c => c.charCodeAt(0));
          
          if (mou.attachmentType === "application/pdf") {
            const attachedPdf = await PDFDocument.load(attachmentBytes);
            const copiedPages = await pdfDoc.copyPages(attachedPdf, attachedPdf.getPageIndices());
            copiedPages.forEach((p) => pdfDoc.addPage(p));
          } else if (mou.attachmentType.startsWith("image/")) {
            let embeddedImage;
            if (mou.attachmentType === "image/jpeg" || mou.attachmentType === "image/jpg") {
              embeddedImage = await pdfDoc.embedJpg(attachmentBytes);
            } else {
              embeddedImage = await pdfDoc.embedPng(attachmentBytes);
            }
            const imgPage = pdfDoc.addPage([pageWidth, pageHeight]);
            const pw = imgPage.getWidth() - 100;
            const ph = imgPage.getHeight() - 100;
            const dims = embeddedImage.scale(1);
            const scale = Math.min(pw / dims.width, ph / dims.height, 1);
            const drawW = dims.width * scale;
            const drawH = dims.height * scale;
            const x = (imgPage.getWidth() - drawW) / 2;
            const yImg = (imgPage.getHeight() - drawH) / 2;
            imgPage.drawImage(embeddedImage, { x, y: yImg, width: drawW, height: drawH });
          }
        } catch (err) {
          console.error("Failed to attach file to MOU PDF:", err);
        }
      }

      const pdfBytes = await pdfDoc.save();
      
      if (returnBase64) {
        // Return base64 string for storage
        return btoa(String.fromCharCode(...pdfBytes));
      } else {
        // Open in new tab for preview/download
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      }
    } catch (err) {
      console.error("Error generating MOU PDF:", err);
      throw err;
    }
  };

  const drawWrappedText = (pdfDoc, page, text, x, y, rightLimit, font, size, lineHeight) => {
    const maxChars = Math.floor((rightLimit - x) / (size * 0.6));
    const lines = wrapText(text, maxChars);
    for (const line of lines) {
      if (y < 70) {
        const np = pdfDoc.addPage([612, 792]);
        page = np;
        y = np.getHeight() - 60;
      }
      page.drawText(line, { x, y, font, size, color: rgb(0,0,0) });
      y -= lineHeight;
    }
    return y;
  };

  const drawSectionHeading = (page, text, x, y, boldFont, size) => {
    page.drawText(text, { x, y, font: boldFont, size, color: rgb(0,0,0) });
    y -= size + 4;
    return y;
  };

  const addNewPageWithY = (pdfDoc) => {
    const page = pdfDoc.addPage([612, 792]);
    const y = page.getHeight() - 60;
    return { page, y };
  };

  const wrapText = (text = "", maxChars = 90) => {
    if (!text) return [""];
    const words = text.split(" ");
    const lines = [];
    let cur = "";
    words.forEach(w => {
      if ((cur + " " + w).trim().length > maxChars) {
        if (cur) lines.push(cur.trim());
        cur = w;
      } else {
        cur = (cur + " " + w).trim();
      }
    });
    if (cur) lines.push(cur.trim());
    return lines;
  };

  // Render
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>MOU Management</h1>
          <p style={styles.subtitle}>Manage MOUs — create, monitor timelines and expiries.</p>
        </div>
        <div style={styles.headerActions}>
          <div style={styles.searchWrapper}>
            <Search size={16} color="#193648" />
            <input
              style={styles.searchInput}
              placeholder="Search by industry name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={styles.filterWrapper}>
            <Filter size={16} color="#193648" />
            <select
              style={styles.filterSelect}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All</option>
              <option>Ongoing</option>
              <option>Expired</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={styles.createBtn}
            onClick={() => setShowModal(true)}
          >
            <PlusCircle size={16} />
            Create MOU
          </motion.button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryRow}>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>Total MOUs</div>
          <div style={styles.statValue}>{mous.length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>Ongoing</div>
          <div style={styles.statValue}>{mous.filter(isOngoing).length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>Expired</div>
          <div style={{ ...styles.statValue, color: "#9a2f2f" }}>{mous.filter(isExpired).length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>Expiring soon</div>
          <div style={{ ...styles.statValue, color: "#a35b00" }}>{expiringSoon.length}</div>
        </div>
      </div>

      {/* Expiry Alert */}
      {expiringSoon.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.alert}
        >
          <AlertTriangle size={18} color="#a35b00" />
          <div style={{ marginLeft: 12 }}>
            <strong style={{ color: "#8a5b00" }}>{expiringSoon.length} MOUs expiring soon</strong>
            <div style={{ fontSize: 13, color: "#6b4f00", marginTop: 6 }}>
              {expiringSoon.map((m) => (
                <div key={m._id}>
                  • {m.university} × {m.industry} — ends {m.endDate}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{ ...styles.alert, background: "#ffebee" }}>
          <AlertTriangle size={18} color="#c62828" />
          <div style={{ marginLeft: 12, color: "#c62828" }}>{error}</div>
        </div>
      )}

      {/* Main Content */}
      <div style={styles.grid}>
        <div style={styles.leftCol}>
          {loading ? (
            <div style={styles.empty}>Loading MOUs...</div>
          ) : (
            <div style={styles.cardGrid}>
              {filtered.length === 0 ? (
                <div style={styles.empty}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#193648" }}>
                    No MOUs match your search.
                  </div>
                  <div style={{ color: "#2b5b94", marginTop: 8 }}>
                    Try clearing filters or add a new MOU.
                  </div>
                </div>
              ) : (
                filtered.map((m) => {
                  const progress = calcProgress(m.startDate, m.endDate);
                  return (
                    <motion.div
                      key={m._id}
                      whileHover={{ translateY: -4, boxShadow: "0 12px 20px rgba(0,0,0,0.08)" }}
                      style={{ ...styles.card, ...(isExpired(m) ? styles.expiredCard : {}) }}
                    >
                      <div style={styles.cardHeader}>
                        <div>
                          <div style={styles.cardTitle}>{m.university}</div>
                          <div style={styles.cardSubtitle}>Partner: {m.industry}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <Clock size={18} color="#193648" />
                          <div style={{ fontSize: 12, color: "#193648", marginTop: 6 }}>
                            {m.startDate} → {m.endDate}
                          </div>
                        </div>
                      </div>

                      <div style={styles.desc}>{m.description || "—"}</div>

                      <div style={styles.progressWrap}>
                        <div style={styles.progressLabel}>
                          <div style={{ fontSize: 12, color: "#193648" }}>
                            Progress: {progress}%
                          </div>
                          <div style={{ fontSize: 12, color: isExpired(m) ? "#9a2f2f" : "#193648" }}>
                            {isExpired(m) ? "Expired" : "Ongoing"}
                          </div>
                        </div>

                        <div style={styles.progressBar}>
                          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                        </div>
                      </div>

                      <div style={styles.cardActions}>
                        <button
                          style={styles.pdfBtn}
                          onClick={() => generateFormalMouPDF(m)}
                          title="Download MOU PDF"
                        >
                          Download PDF
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(m._id)}
                          title="Delete MOU"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={styles.rightCol}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.activity}
          >
            <div style={styles.activityHeader}>
              <h3 style={{ margin: 0 }}>Tips</h3>
            </div>
            <div style={{ fontSize: 12, color: "#193648" }}>
              • Use search & filter to quickly find MOUs.<br />
              • Preview the formal MOU in a new tab before saving.<br />
              • Keep attachments under 5MB for best performance.<br />
            </div>
          </motion.div>

          <div style={styles.activity}>
            <div style={styles.activityHeader}>
              <h3 style={{ margin: 0 }}>Industry Engagement Tracking</h3>
            </div>
            <div style={{ fontSize: 12, color: "#193648" }}>
              {[
                { name: "TechNova Pvt Ltd", activity: 90 },
                { name: "InnoSoft Solutions", activity: 70 },
                { name: "NextGen Robotics", activity: 50 },
                { name: "CloudEdge Systems", activity: 40 },
                { name: "GreenEnergy Labs", activity: 30 },
              ].map((ind, i) => ( 
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span>{ind.name}</span>
                    <span>{ind.activity}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "#e0e0e0", overflow: "hidden", marginTop: 3 }}>
                    <div
                      style={{
                        width: `${ind.activity}%`,
                        height: "100%",
                        background: "#447da0ff",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.activity}>
            <div style={styles.activityHeader}>
              <h3 style={{ margin: 0 }}>System Suggested Industries</h3>
            </div>
            <div style={{ fontSize: 12, color: "#193648", lineHeight: 1.6 }}>
              <div>• AI Dynamics Pvt Ltd — ideal for research collaboration</div>
              <div>• VisionWare Technologies — recommended for internships</div>
              <div>• DataBridge Analytics — suggested for consultancy</div>
              <div>• AutoSmart Industries — emerging in industrial automation</div>
            </div>
          </div>

          <div style={styles.activity}>
            <div style={styles.activityHeader}>
              <h3 style={{ margin: 0 }}>Recent Activity</h3>
              <div style={{ fontSize: 13, color: "#2b5b94" }}>{activityLog.length} items</div>
            </div>
            <div style={styles.activityList}>
              {activityLog.map((a, i) => (
                <div key={i} style={styles.activityItem}>{a}</div>
              ))}
            </div>
          </div>

          <div style={styles.activity}>
            <div style={styles.activityHeader}>
              <h3 style={{ margin: 0 }}>Expiring MOUs</h3>
              <div style={{ fontSize: 13, color: "#2b5b94" }}>{expiringSoon.length} items</div>
            </div>
            <div style={styles.activityList}>
              {expiringSoon.length === 0 ? (
                <div style={styles.activityItem}>No MOUs expiring soon</div>
              ) : (
                expiringSoon.map((m) => (
                  <div key={m._id} style={{ ...styles.activityItem, color: "#9a2f2f" }}>
                    {m.university} × {m.industry} — ends {m.endDate}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            style={styles.modal}
          >
            <div style={styles.modalHeader}>
              <h3>Create MOU</h3>
              <X size={20} style={{ cursor: "pointer" }} onClick={() => setShowModal(false)} />
            </div>

            <motion.form
              onSubmit={handleCreate}
              style={styles.form}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
            >
              <label><strong>Basic Details</strong></label>

              <input
                placeholder="MOU Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={inputStyle}
              />

              <input
                placeholder="University Name"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                required
                style={inputStyle}
              />

              <input
                placeholder="Industry Name"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                required
                style={inputStyle}
              />

              <select
                value={formData.collaborationType}
                onChange={(e) => setFormData({ ...formData, collaborationType: e.target.value })}
                style={inputStyle}
                required
              >
                <option value="">Select Collaboration Type</option>
                <option>Research</option>
                <option>Internship</option>
                <option>Training</option>
                <option>Consultancy</option>
              </select>

              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  style={{ ...inputStyle, width: "50%" }}
                />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  style={{ ...inputStyle, width: "50%" }}
                />
              </div>

              <textarea
                placeholder="Short purpose (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ height: 70, padding: "8px", borderRadius: 6, border: "1px solid #ccc", marginBottom: 6 }}
              />

              <label><strong>Attachment (optional - max 5MB)</strong></label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                  if (file && file.size > MAX_FILE_SIZE) {
                    alert(`File too large! Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
                    e.target.value = "";
                    return;
                  }
                  setFormData({ ...formData, attachment: file });
                }}
                style={inputStyle}
              />
              {formData.attachment && (
                <div style={{ fontSize: 12, color: "#2b5b94", marginTop: -4, marginBottom: 6 }}>
                  Selected: {formData.attachment.name} ({(formData.attachment.size / 1024).toFixed(2)} KB)
                </div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                style={{ marginTop: 12, padding: "10px 20px", borderRadius: 6, border: "none", background: "#193648", color: "#fff", fontWeight: 600, cursor: "pointer" }}
              >
                Generate & Preview MOU
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ===================== Styles =====================
const styles = {
  page: { padding: 20, fontFamily: "sans-serif", background: "#f5f8fb", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap" },
  title: { margin: 0, fontSize: 26, color: "#193648" },
  subtitle: { margin: 0, fontSize: 14, color: "#2b5b94" },
  headerActions: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },
  searchWrapper: { display: "flex", alignItems: "center", background: "#fff", borderRadius: 6, padding: "4px 8px", gap: 4, border: "1px solid #ccc" },
  searchInput: { border: "none", outline: "none", padding: 4, width: 180 },
  filterWrapper: { display: "flex", alignItems: "center", background: "#fff", borderRadius: 6, padding: "4px 8px", gap: 4, border: "1px solid #ccc" },
  filterSelect: { border: "none", outline: "none", background: "transparent", fontSize: 13 },
  createBtn: { display: "flex", alignItems: "center", gap: 6, background: "#174866ff", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontWeight: 600 },
  summaryRow: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 },
  statCard: { flex: 1, minWidth: 120, background: "#fff", padding: 12, borderRadius: 6, boxShadow: "0 4px 8px rgba(0,0,0,0.05)" },
  statTitle: { fontSize: 12, color: "#2b5b94" },
  statValue: { fontSize: 20, fontWeight: 600, color: "#193648" },
  alert: { display: "flex", alignItems: "flex-start", background: "#fff8e1", padding: 12, borderRadius: 6, gap: 8, marginBottom: 20 },
  grid: { display: "flex", gap: 12, flexWrap: "wrap" },
  leftCol: { flex: 3, minWidth: 320 },
  rightCol: { flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 12 },
  cardGrid: { display: "flex", flexDirection: "column", gap: 12 },
  card: { background: "#fff", borderRadius: 6, padding: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  expiredCard: { background: "#fdecea" },
  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
  cardTitle: { fontWeight: 600, color: "#193648" },
  cardSubtitle: { fontSize: 13, color: "#2b5b94" },
  desc: { fontSize: 13, color: "#193648", marginBottom: 6 },
  progressWrap: { marginTop: 6 },
  progressLabel: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
  progressBar: { height: 6, borderRadius: 3, background: "#e0e0e0", overflow: "hidden" },
  progressFill: { height: "100%", background: "#115077ff" },
  cardActions: { marginTop: 6, textAlign: "right", display: "flex", gap: 8, justifyContent: "flex-end" },
  pdfBtn: { background: "#2b5b94", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer" },
  deleteBtn: { background: "#9a2f2f", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },
  activity: { background: "#fff", borderRadius: 6, padding: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  activityHeader: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  activityList: { fontSize: 12, color: "#37576bff" },
  activityItem: { marginBottom: 4 },
  empty: { padding: 40, textAlign: "center" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.35)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99 },
  modal: { background: "#fff", padding: 20, borderRadius: 8, width: "90%", maxWidth: 480, maxHeight: "90%", overflowY: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  form: { display: "flex", flexDirection: "column" },
};

const inputStyle = { padding: "8px", borderRadius: 6, border: "1px solid #ccc", marginBottom: 6, width: "100%" };

export default MouManagement;