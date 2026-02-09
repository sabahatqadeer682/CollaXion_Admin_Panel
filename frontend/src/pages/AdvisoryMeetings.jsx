import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, FileText, UploadCloud, CheckCircle2, Clock, Send, Mail, Download, FileCheck, Loader, Trash2, RefreshCw } from "lucide-react";
import collaxionLogo from "../images/collaxionlogo.jpeg";

const AdvisoryMeeting = () => {
  const [meetings, setMeetings] = useState([]);
  const [activeTab, setActiveTab] = useState("create");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedReps, setSelectedReps] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedMinutes, setSavedMinutes] = useState([]);

  // ── fetch all saved minutes from DB on mount ────────────────────
  const fetchSavedMinutes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/meeting-minutes');
      const rawText = await response.text();
      if (!rawText) return;
      const result = JSON.parse(rawText);
      if (result?.data) setSavedMinutes(result.data);
    } catch (err) {
      console.error('❌ Failed to fetch saved minutes:', err);
    }
  };

  useEffect(() => {
    fetchSavedMinutes();
  }, []);

  // ── delete MoM from DB + reset that meeting's local state ────────
  const deleteMeetingMinutes = async (meetingId) => {
    if (!confirm('Are you sure you want to delete the uploaded MoM for this meeting?')) return;
    try {
      // find the DB record that matches this meetingId
      const record = savedMinutes.find(m => m.meetingId === meetingId.toString());
      if (record) {
        const response = await fetch(`http://localhost:5000/api/meeting-minutes/${record._id}`, {
          method: 'DELETE',
        });
        const rawText = await response.text();
        if (rawText) {
          const result = JSON.parse(rawText);
          if (!result.success) throw new Error(result.message || 'Delete failed');
        }
      }

      // reset local meeting state so Upload button reappears
      setMeetings(prev =>
        prev.map(m =>
          m.id === meetingId
            ? { ...m, momFile: null, status: 'Scheduled', minutesGenerated: false, minutesData: null, downloadUrl: null, fileName: null }
            : m
        )
      );

      // refresh DB list
      await fetchSavedMinutes();
      alert('✅ MoM deleted successfully.');
    } catch (err) {
      console.error('❌ Delete error:', err);
      alert(`❌ Failed to delete: ${err.message}`);
    }
  };

  // ── re-upload: just reset local state so the Upload label reappears ─
  const reuploadMeeting = (meetingId) => {
    setMeetings(prev =>
      prev.map(m =>
        m.id === meetingId
          ? { ...m, momFile: null, status: 'Scheduled', minutesGenerated: false, minutesData: null, downloadUrl: null, fileName: null }
          : m
      )
    );
  };

  const [newMeeting, setNewMeeting] = useState({
    agenda: "",
    date: "",
    time: "",
    venue: "",
  });

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

  const handleAddMeeting = () => {
    if (!newMeeting.agenda || !newMeeting.date || !newMeeting.time || !newMeeting.venue) {
      alert("Please fill all meeting details!");
      return;
    }
    const newData = { ...newMeeting, id: Date.now(), status: "Scheduled", boardMembers };
    setMeetings([...meetings, newData]);
    setNewMeeting({ agenda: "", date: "", time: "", venue: "" });
    setShowInviteModal(true);
  };

  const handleRepSelect = (rep) => {
    if (selectedReps.includes(rep.name)) {
      setSelectedReps(selectedReps.filter((r) => r !== rep.name));
    } else {
      setSelectedReps([...selectedReps, rep.name]);
    }
  };

  const sendInvitations = () => {
    if (selectedReps.length === 0) {
      alert("Please select at least one representative to send an invitation.");
      return;
    }
    alert(`✅ Invitations successfully sent to: ${selectedReps.join(", ")}`);
    setSelectedReps([]);
    setShowInviteModal(false);
  };

  // Extract content from uploaded file
  const extractFileContent = async (file) => {
    // ── helper: runs keyword extraction on any plain-text string ──
    const parseContent = (content) => {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);

      const decisionKeywords = ['decided', 'approved', 'agreed', 'resolved', 'concluded', 'established', 'finalized'];
      const actionKeywords = ['will', 'should', 'must', 'assign', 'deadline', 'by', 'responsible', 'coordinate'];

      const decisions = sentences.filter(sentence =>
        decisionKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
      ).slice(0, 5);

      const actions = sentences.filter(sentence =>
        actionKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
      ).slice(0, 5);

      const finalDecisions = decisions.length > 0 ? decisions : [
        "Approved collaboration with industry partners for enhanced student training",
        "Agreed to establish joint research initiatives with technology companies",
        "Decided to increase industry mentorship opportunities by 40%",
        "Resolved to implement new curriculum based on industry feedback"
      ];

      const finalActions = actions.length > 0 ? actions : [
        "HOD to coordinate with industry representatives within 15 days",
        "Industry Liaison Officer to draft partnership agreements by month-end",
        "Student Representative to collect feedback from current participants",
        "Dean to approve budget allocation for new initiatives by next week"
      ];

      return { decisions: finalDecisions, actions: finalActions, originalContent: content };
    };

    // ── PDF: use pdf.js to extract real text page-by-page ──────────
    if (file.type === 'application/pdf') {
      const pdfjsLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.mjs';

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      await pdfDoc.destroy();
      return parseContent(fullText.trim());
    }

    // ── TXT / DOC / DOCX: read as plain text (same as before) ─────
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(parseContent(e.target.result));
      };
      reader.readAsText(file);
    });
  };

  // Generate professional meeting minutes
  const generateMeetingMinutes = (meeting, extractedContent) => {
    const { decisions, actions, originalContent } = extractedContent;

    return {
      meetingTitle: meeting.agenda,
      date: meeting.date,
      time: meeting.time,
      location: meeting.venue,
      attendees: meeting.boardMembers.map(member => member.name).join(', '),
      decisions: decisions,
      actionItems: actions,
      originalContent: originalContent,
      originalFileName: '',
      generatedAt: new Date().toISOString()
    };
  };

  // ── Sanitize text so pdf-lib's WinAnsi fonts never crash ────────────────
  // Replaces common unicode punctuation with ASCII equivalents and strips
  // anything else that falls outside the WinAnsi-safe range (0x00-0xFF).
  const sanitizeText = (input) => {
    if (input == null) return '';
    return String(input)
      .replace(/\u2013/g, '-')          // en-dash  →  -
      .replace(/\u2014/g, '-')          // em-dash  →  -
      .replace(/\u2018/g, "'")          // left single quote
      .replace(/\u2019/g, "'")          // right single quote
      .replace(/\u201C/g, '"')          // left double quote
      .replace(/\u201D/g, '"')          // right double quote
      .replace(/\u2022/g, '-')          // bullet   →  -
      .replace(/\u2026/g, '...')        // ellipsis →  ...
      .replace(/\u00A0/g, ' ')          // non-breaking space → space
      .replace(/\uFFFD/g, '?')          // replacement char (the one in your error)
      .replace(/[^\x00-\xFF]/g, '?');   // anything else outside Latin-1 → ?
  };

  // ── Create downloadable PDF using pdf-lib (runs entirely in the browser) ──
  const createDownloadablePDF = async (minutesData) => {
    const { PDFDocument, rgb, StandardFonts } = await import('https://cdn.jsdelivr.net/esm/pdf-lib@1.17.1');

    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // ── colours ───────────────────────────────────────────────────
    const darkBlue = rgb(25 / 255, 54 / 255, 72 / 255);
    const medBlue = rgb(58 / 255, 112 / 255, 176 / 255);
    const green = rgb(16 / 255, 185 / 255, 129 / 255);
    const lightGray = rgb(237 / 255, 241 / 255, 247 / 255);
    const white = rgb(1, 1, 1);
    const black = rgb(0, 0, 0);
    const gray = rgb(140 / 255, 140 / 255, 140 / 255);

    // ── page setup ────────────────────────────────────────────────
    const pageW = 612, pageH = 792;
    const mL = 50, mR = 50, mT = 50, mB = 50;
    const contentW = pageW - mL - mR;

    let page, y;

    const addPage = () => {
      page = pdfDoc.addPage([pageW, pageH]);
      y = pageH - mT;
    };

    // ── header banner on every page ───────────────────────────────
    const drawHeader = () => {
      page.drawRectangle({ x: 0, y: pageH - 38, width: pageW, height: 38, color: darkBlue });
      page.drawText('ADVISORY BOARD MEETING MINUTES', {
        x: mL, y: pageH - 24, font: helveticaBold, size: 14, color: white
      });
      page.drawText('CollaXion', {
        x: pageW - mR - 60, y: pageH - 24, font: helveticaBold, size: 9, color: medBlue
      });
      y = pageH - mT - 12;
    };

    // ── word-wrap text drawing ────────────────────────────────────
    const drawText = (text, opts = {}) => {
      const { x = mL, font = helvetica, size = 10, color = black, maxW = contentW } = opts;
      const charsPerLine = Math.floor(maxW / (size * 0.55)) || 1;
      const words = sanitizeText(text).split(' ');
      let line = '', lines = [];
      words.forEach(w => {
        const test = line ? line + ' ' + w : w;
        if (test.length > charsPerLine && line) { lines.push(line); line = w; }
        else { line = test; }
      });
      if (line) lines.push(line);

      lines.forEach(l => {
        if (y - size < mB) { addPage(); drawHeader(); }
        page.drawText(l, { x, y: y - size, font, size, color });
        y -= size * 1.45;
      });
    };

    // ── section heading with light-gray bar ───────────────────────
    const drawSection = (title, barColor = lightGray, textColor = darkBlue) => {
      if (y - 30 < mB) { addPage(); drawHeader(); }
      page.drawRectangle({ x: mL, y: y - 22, width: contentW, height: 24, color: barColor });
      page.drawText(title, { x: mL + 8, y: y - 16, font: helveticaBold, size: 11, color: textColor });
      y -= 34;
    };

    // ── horizontal rule ───────────────────────────────────────────
    const drawRule = (color = medBlue) => {
      page.drawLine({ start: { x: mL, y }, end: { x: pageW - mR, y }, thickness: 1, color });
      y -= 6;
    };

    // ══════════════════════════════════════════════════════════════
    //  PAGE 1  —  meeting details + extracted content
    // ══════════════════════════════════════════════════════════════
    addPage();
    drawHeader();
    y -= 8;

    // big title
    page.drawText(sanitizeText(minutesData.meetingTitle), {
      x: mL, y: y - 20, font: helveticaBold, size: 18, color: darkBlue
    });
    y -= 30;
    drawRule(medBlue);
    y -= 6;

    // date / time / location rows
    [['Date', minutesData.date], ['Time', minutesData.time], ['Location', minutesData.location]].forEach(([label, val]) => {
      if (y - 16 < mB) { addPage(); drawHeader(); }
      page.drawText(label, { x: mL, y: y - 12, font: helveticaBold, size: 10, color: darkBlue });
      page.drawText(sanitizeText(val) || '-', { x: mL + 130, y: y - 12, font: helvetica, size: 10, color: black });
      y -= 20;
    });
    y -= 8;

    // ── Attendees ─────────────────────────────────────────────────
    drawSection('ATTENDEES');
    minutesData.attendees.split(', ').forEach((name, i) => {
      drawText(`${i + 1}.  ${name.trim()}`, { size: 10 });
    });
    y -= 10;

    // ── Decisions Made ────────────────────────────────────────────
    drawSection('DECISIONS MADE');
    minutesData.decisions.forEach((d, i) => {
      drawText(`${i + 1}.  ${d.trim()}`, { size: 10 });
      y -= 3;
    });
    y -= 10;

    // ── Action Items ──────────────────────────────────────────────
    drawSection('ACTION ITEMS');
    minutesData.actionItems.forEach((a, i) => {
      drawText(`${i + 1}.  ${a.trim()}`, { size: 10 });
      y -= 3;
    });
    y -= 10;

    // ── Next Meeting ──────────────────────────────────────────────
    drawSection('NEXT MEETING');
    drawText('Date  :  TBD', { size: 10 });
    drawText('Agenda  :  Follow-up on action items and new business', { size: 10 });

    // ══════════════════════════════════════════════════════════════
    //  PAGE 2+  —  full original uploaded document content
    // ══════════════════════════════════════════════════════════════
    if (minutesData.originalContent && minutesData.originalContent.trim().length > 0) {
      addPage();
      drawHeader();
      y -= 8;

      // green-tinted section heading
      drawSection(
        'UPLOADED DOCUMENT CONTENT',
        rgb(232 / 255, 245 / 255, 233 / 255),  // light green bar
        green
      );

      // source file reference
      if (minutesData.originalFileName) {
        page.drawText(`Source file: ${minutesData.originalFileName}`, {
          x: mL, y: y - 10, font: helvetica, size: 8, color: gray
        });
        y -= 18;
      }

      drawRule(rgb(200 / 255, 200 / 255, 200 / 255));
      y -= 4;

      // render every line of the raw uploaded text
      minutesData.originalContent.split('\n').forEach(line => {
        if (y - 13 < mB) { addPage(); drawHeader(); }
        const trimmed = line.trim();
        if (trimmed === '') { y -= 6; }
        else { drawText(trimmed, { size: 9, color: rgb(40 / 255, 40 / 255, 40 / 255) }); }
      });
    }

    // ── page footers ──────────────────────────────────────────────
    const totalPages = pdfDoc.getPageCount();
    for (let i = 0; i < totalPages; i++) {
      const p = pdfDoc.getPage(i);
      p.drawText(`Page ${i + 1} of ${totalPages}`, {
        x: mL, y: 18, font: helvetica, size: 8, color: gray
      });
      p.drawText(`Generated: ${new Date(minutesData.generatedAt).toLocaleString()}`, {
        x: pageW - mR - 170, y: 18, font: helvetica, size: 8, color: gray
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  };

  // Save meeting minutes to database
  const saveMeetingMinutesToDB = async (minutesData, meetingId) => {
    try {
      const response = await fetch('http://localhost:5000/api/meeting-minutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId: meetingId.toString(),
          ...minutesData
        }),
      });

      const rawText = await response.text();

      if (!rawText) {
        if (response.ok) {
          console.log('✅ Meeting minutes saved to database (empty body)');
          return { success: true };
        } else {
          throw new Error(`Server returned status ${response.status} with no body`);
        }
      }

      let result;
      try {
        result = JSON.parse(rawText);
      } catch {
        throw new Error(`Server did not return JSON. Status: ${response.status}. Response: ${rawText.slice(0, 200)}`);
      }

      if (response.ok) {
        console.log('✅ Meeting minutes saved to database:', result);
        return result;
      } else {
        throw new Error(result.message || result.error || 'Failed to save meeting minutes');
      }
    } catch (error) {
      console.error('❌ Error saving meeting minutes:', error);
      throw error;
    }
  };

  // Handle file upload and auto-generate minutes
  const handleFileUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid document file (TXT, PDF, DOC, DOCX)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should not exceed 10MB');
      return;
    }

    setIsProcessing(true);

    try {
      // Extract content from file
      const extractedContent = await extractFileContent(file);

      // Find the meeting
      const meeting = meetings.find(m => m.id === id);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Generate meeting minutes data object
      const minutesData = generateMeetingMinutes(meeting, extractedContent);
      minutesData.originalFileName = file.name;

      // Create downloadable PDF
      const downloadUrl = await createDownloadablePDF(minutesData);

      // Save to database — strip originalContent so the DB payload stays light
      const { originalContent: _skip, ...minutesForDB } = minutesData;
      await saveMeetingMinutesToDB(minutesForDB, id);

      // Update meeting state
      setMeetings(
        meetings.map((m) =>
          m.id === id
            ? {
              ...m,
              momFile: file,
              status: "Completed",
              minutesGenerated: true,
              minutesData: minutesData,
              downloadUrl: downloadUrl,
              fileName: file.name
            }
            : m
        )
      );

      alert(`✅ Meeting minutes generated successfully!\n\nExtracted:\n• ${extractedContent.decisions.length} decisions\n• ${extractedContent.actions.length} action items\n\nPDF ready for download!`);

    } catch (error) {
      console.error('❌ Error processing file:', error);
      alert(`❌ Failed to generate meeting minutes: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download meeting minutes PDF
  const downloadMeetingMinutes = (meeting) => {
    if (meeting.downloadUrl) {
      const link = document.createElement('a');
      link.href = meeting.downloadUrl;
      link.download = `Meeting_Minutes_${meeting.agenda.replace(/\s+/g, '_')}_${meeting.date}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`📥 Downloaded: ${meeting.fileName}`);
    }
  };

  return (
    <div className="page-container">
      {/* Processing Overlay */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-8 flex flex-col items-center max-w-sm mx-4">
            <Loader className="animate-spin text-blue-600 mb-4" size={32} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing Meeting File</h3>
            <p className="text-gray-600 text-center text-sm">
              Extracting decisions and action items...
            </p>
          </div>
        </motion.div>
      )}

      {/* ===== Enhanced Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="advisory-header"
      >
        <div className="flex items-center gap-4">
          <img src={collaxionLogo} alt="CollaXion" className="advisory-logo" />
          <div className="advisory-title">
            <h1>Advisory Board Meeting Management</h1>
            <p>Efficiently organize, schedule, and track advisory board meetings.</p>
          </div>
        </div>
      </motion.div>

      {/* ===== Tabs ===== */}
      <div className="tab-buttons">
        <button
          className={activeTab === "create" ? "active" : ""}
          onClick={() => setActiveTab("create")}
        >
          📅 Schedule New Meeting
        </button>
        <button
          className={activeTab === "records" ? "active" : ""}
          onClick={() => setActiveTab("records")}
        >
          📘 View Meeting Records
        </button>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="stats-row">
        <div className="stat-card stat-total">
          <CalendarDays size={26} />
          <div className="stat-info">
            <span className="stat-number">{meetings.length}</span>
            <span className="stat-label">Total Meetings</span>
          </div>
        </div>
        <div className="stat-card stat-scheduled">
          <Clock size={26} />
          <div className="stat-info">
            <span className="stat-number">{meetings.filter(m => m.status === 'Scheduled').length}</span>
            <span className="stat-label">Scheduled</span>
          </div>
        </div>
        <div className="stat-card stat-completed">
          <CheckCircle2 size={26} />
          <div className="stat-info">
            <span className="stat-number">{meetings.filter(m => m.minutesGenerated).length}</span>
            <span className="stat-label">Completed with MoM</span>
          </div>
        </div>
      </div>

      {/* ===== Create Meeting ===== */}
      {activeTab === "create" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="meeting-card fade-in"
        >
          <h2 className="section-title flex items-center gap-2">
            <CalendarDays /> Enter Meeting Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="meeting-label">Agenda</label>
              <input
                type="text"
                placeholder="e.g., University-Industry Collaboration"
                value={newMeeting.agenda}
                onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
              />
            </div>

            <div>
              <label className="meeting-label">Date</label>
              <input
                type="date"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
              />
            </div>

            <div>
              <label className="meeting-label">Time</label>
              <input
                type="time"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
              />
            </div>

            <div>
              <label className="meeting-label">Venue / Meeting Link</label>
              <input
                type="text"
                placeholder="e.g., Conference Room A / Zoom Link"
                value={newMeeting.venue}
                onChange={(e) => setNewMeeting({ ...newMeeting, venue: e.target.value })}
              />
            </div>
          </div>

          {/* ===== Board Members Section ===== */}
          <div className="mt-8">
            <h3 className="section-title flex items-center gap-1">
              <Users size={18} /> Board Members Present in Meeting
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
              {boardMembers.map((member, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="member-card"
                >
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddMeeting}
              className="schedule-btn"
            >
              <Send size={18} /> Schedule Meeting
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ===== Invitation Modal (Card Style) ===== */}
      {showInviteModal && (
        <div className="modal-overlay">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="card-modal-box"
          >
            <h2 className="modal-title flex items-center gap-2 mb-5">
              <Mail /> Send Invitations to Industry Representatives
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {industryReps.map((rep, i) => (
                <div
                  key={i}
                  className={`rep-card ${selectedReps.includes(rep.name) ? "selected" : ""}`}
                  onClick={() => handleRepSelect(rep)}
                >
                  <div className="rep-content">
                    <h4>{rep.name}</h4>
                    {rep.suggested && (
                      <span className="suggested-badge">System Suggested</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="cancel-btn" onClick={() => setShowInviteModal(false)}>
                Cancel
              </button>
              <button className="send-btn" onClick={sendInvitations}>
                Send Invitation
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ===== Records ===== */}
      {activeTab === "records" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="table-container fade-in"
        >
          <h2 className="section-title flex items-center gap-2 mb-4">
            <FileText /> Scheduled Meetings
          </h2>

          {meetings.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">No meetings scheduled yet.</p>
              <p className="text-gray-500 text-sm mt-2">Create your first meeting to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Agenda</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Venue</th>
                    <th>Status</th>
                    <th>Upload MoM</th>
                    <th>Download Minutes</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((m) => (
                    <tr key={m.id}>
                      <td className="font-medium">{m.agenda}</td>
                      <td>{m.date}</td>
                      <td>{m.time}</td>
                      <td className="max-w-xs truncate">{m.venue}</td>
                      <td>
                        {m.status === "Scheduled" ? (
                          <span className="status-scheduled">
                            <Clock size={15} /> Scheduled
                          </span>
                        ) : (
                          <span className="status-completed">
                            <CheckCircle2 size={15} /> Completed
                          </span>
                        )}
                      </td>
                      <td>
                        <label className={`upload-label ${isProcessing ? 'disabled' : ''}`}>
                          <UploadCloud size={16} />
                          <input
                            type="file"
                            accept=".txt,.doc,.docx,.pdf"
                            onChange={(e) => handleFileUpload(e, m.id)}
                            style={{ display: "none" }}
                            disabled={isProcessing}
                          />
                          {isProcessing ? "Processing..." : "Upload"}
                        </label>
                        {m.fileName && (
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            📎 {m.fileName}
                          </div>
                        )}
                      </td>
                      <td>
                        {m.minutesGenerated ? (
                          <button
                            className="download-btn"
                            onClick={() => downloadMeetingMinutes(m)}
                          >
                            <Download size={16} /> Download
                          </button>
                        ) : (
                          <span className="not-generated">
                            <FileCheck size={15} /> Not Generated
                          </span>
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

      {/* ===== Enhanced CSS ===== */}
      <style>{`
        body { font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #e2eef9 0%, #ffffff 100%); }
        .page-container { padding: 40px 20px; min-height: 100vh; }

        /* ===== Header ===== */
        .advisory-header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg, #193648, #3a70b0); padding: 25px 40px; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.12); margin-bottom: 40px; color: white; }
        .advisory-logo { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .advisory-title h1 { font-size: 2rem; font-weight: 700; margin: 0; }
        .advisory-title p { font-size: 0.95rem; margin-top: 6px; color: #dce3f2; margin-bottom: 0; }

        /* ===== Tabs ===== */
        .tab-buttons { display: flex; justify-content: center; gap: 20px; margin-bottom: 40px; }
        .tab-buttons button { padding: 12px 28px; border-radius: 12px; background: #e4e9f1; color: #193648; font-weight: 500; cursor: pointer; border: none; transition: all 0.3s ease; font-size: 0.95rem; }
        .tab-buttons button.active { background: #193648; color: white; transform: scale(1.05); box-shadow: 0 5px 15px rgba(25,54,72,0.3); }
        .tab-buttons button:hover:not(.active) { background: #d1d9e6; transform: translateY(-2px); }

        
/* ===== Meeting Card ===== */        .meeting-card { background: white; border-radius: 20px; padding: 40px; max-width: 900px; margin: auto; box-shadow: 0 10px 35px rgba(0,0,0,0.1); border: 1px solid #edf1f7; }        input[type='text'], input[type='date'], input[type='time'] { width: 100%; box-sizing: border-box; padding: 10px 15px; margin-top: 5px; border: 1.5px solid #d3d9e1; border-radius: 10px; outline: none; transition: all 0.3s ease; background: #fff; color: #193648; font-family: 'Poppins', sans-serif; font-size: 0.9rem; cursor: text; }        input:focus { border-color: #193648; box-shadow: 0 0 0 3px rgba(25,54,72,0.2); }        .meeting-label { font-size: 0.9rem; color: #193648; font-weight: 500; }        .section-title { font-weight: 600; font-size: 1.1rem; color: #193648; margin-top: 20px; }        .member-card { background: #f8fafc; border-radius: 12px; padding: 15px; border: 1px solid #e2e8f0; box-shadow: 0 3px 8px rgba(0,0,0,0.05); text-align: center; }        .member-card h4 { font-weight: 600; color: #193648; }        .member-card p { color: #3a70b0; font-size: 0.85rem; margin-top: 4px; }        .schedule-btn { background: #193648; color: white; padding: 12px 35px; border-radius: 12px; font-weight: 500; display: flex; align-items: center; gap: 8px; border: none; cursor: pointer; transition: all 0.3s ease; margin-top: 25px; }        .schedule-btn:hover { background: #204d76; transform: scale(1.05); }        /* ===== Table ===== */        .table-container { max-width: 1300px; margin: auto; background: white; padding: 30px; border-radius: 18px; box-shadow: 0 10px 35px rgba(0,0,0,0.1); border: 1px solid #edf1f7; }        table { width: 100%; border-collapse: collapse; text-align: center; }        th { background: #193648; color: white; padding: 12px; font-size: 0.9rem; }        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }        tr:hover { background: #f1f6fb; }        .upload-label { color: #193648; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }        .upload-label:hover { text-decoration: underline; }        .download-btn { background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.3s ease; margin: auto; }        .download-btn:hover { background: #059669; transform: scale(1.05); }        /* ===== Card Modal ===== */        .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:999; }        .card-modal-box { background: #fff; border-radius: 20px; padding: 35px; width: 700px; max-width: 95%; box-shadow: 0 15px 40px rgba(0,0,0,0.25); border: 1px solid #e2e8f0; transition: all 0.3s ease; }        .modal-title { font-weight: 600; font-size: 1.2rem; color: #193648; }        .rep-card { position: relative; background: #f3f4f6; border-radius: 16px; padding: 18px; cursor: pointer; transition: all 0.3s ease; border: 1px solid #d1d5db; }        .rep-card:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }        .rep-card.selected { border-color: #193648; background: #e4f0ff; }        .rep-content { display: flex; align-items: center; justify-content: space-between; }        .suggested-badge { background: #ffe8b0; color: #b87b00; font-weight: 600; font-size: 0.75rem; padding: 3px 7px; border-radius: 6px; }        .cancel-btn { padding: 10px 25px; border-radius: 12px; background: #f3f4f6; color: #193648; font-weight: 500; cursor: pointer; border: none; transition: all 0.3s ease; }        .cancel-btn:hover { background: #e2e8f0; }        .send-btn { padding: 10px 25px; border-radius: 12px; background: #193648; color: white; font-weight: 500; cursor: pointer; border: none; transition: all 0.3s ease; }        .send-btn:hover { background: #204d76; }      `}</style>    </div>);
}; export default AdvisoryMeeting;