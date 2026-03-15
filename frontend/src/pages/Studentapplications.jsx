// src/pages/StudentApplications.jsx
// Industry Liaison Side — Review & Forward/Reject Student Applications
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, CheckCircle, XCircle, Clock, Eye, Send,
  Filter, Search, ChevronRight, Building2, GraduationCap,
  AlertCircle, FileText, Calendar, Tag, BarChart2,
  ArrowRight, Info, Inbox
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const INITIAL_APPLICATIONS = [
  {
    id: "APP-001",
    student: { name: "Ayesha Malik", program: "BSCS", id: "CS-2098", semester: "6th", cgpa: "3.7", email: "ayesha.malik@uni.edu.pk" },
    post: { title: "Web3 Internship Program", type: "Internship", industry: "NextChain Solutions", domain: "Blockchain / DApps" },
    appliedOn: "2025-10-05",
    inchargeNote: "Strong blockchain background. Completed FYP on DApp. Highly recommended.",
    inchargeApprovedOn: "2025-10-08",
    liaisonStatus: "Pending", // Pending | Forwarded | Rejected
    liaisonNote: "",
    cv: "ayesha_cv.pdf",
    coverLetter: "Motivated to contribute in a hands-on blockchain environment...",
  },
  {
    id: "APP-002",
    student: { name: "Hassan Javed", program: "BSIT", id: "IT-2056", semester: "7th", cgpa: "3.4", email: "hassan.javed@uni.edu.pk" },
    post: { title: "Mobile UX Research Study", type: "Research", industry: "PixelCraft Studios", domain: "UI/UX / Mobile" },
    appliedOn: "2025-10-10",
    inchargeNote: "Good research orientation. Prior UI/UX project experience.",
    inchargeApprovedOn: "2025-10-12",
    liaisonStatus: "Forwarded",
    liaisonNote: "Profile aligns well with the studio's focus on mobile accessibility.",
    cv: "hassan_cv.pdf",
    coverLetter: "Passionate about user-centred design and mobile experiences...",
  },
  {
    id: "APP-003",
    student: { name: "Ahmed Farooq", program: "BSIT", id: "IT-2044", semester: "5th", cgpa: "3.1", email: "ahmed.farooq@uni.edu.pk" },
    post: { title: "Web3 Internship Program", type: "Internship", industry: "NextChain Solutions", domain: "Blockchain / DApps" },
    appliedOn: "2025-10-06",
    inchargeNote: "Average profile but shows initiative. Recommended with reservation.",
    inchargeApprovedOn: "2025-10-09",
    liaisonStatus: "Rejected",
    liaisonNote: "Insufficient blockchain-specific knowledge compared to other applicants.",
    cv: "ahmed_cv.pdf",
    coverLetter: "Eager to learn Web3 technologies during this internship...",
  },
  {
    id: "APP-004",
    student: { name: "Fatima Zahra", program: "BSCS", id: "CS-2088", semester: "6th", cgpa: "3.85", email: "fatima.zahra@uni.edu.pk" },
    post: { title: "Mobile UX Research Study", type: "Research", industry: "PixelCraft Studios", domain: "UI/UX / Mobile" },
    appliedOn: "2025-10-11",
    inchargeNote: "Outstanding academic record. Published a paper on mobile usability.",
    inchargeApprovedOn: "2025-10-13",
    liaisonStatus: "Pending",
    liaisonNote: "",
    cv: "fatima_cv.pdf",
    coverLetter: "My research on mobile interaction patterns makes me a strong fit...",
  },
  {
    id: "APP-005",
    student: { name: "Bilal Ahmed", program: "BSCS", id: "CS-2167", semester: "7th", cgpa: "3.55", email: "bilal.ahmed@uni.edu.pk" },
    post: { title: "Web3 Internship Program", type: "Internship", industry: "NextChain Solutions", domain: "Blockchain / DApps" },
    appliedOn: "2025-10-07",
    inchargeNote: "Completed two relevant courses. Good communication skills.",
    inchargeApprovedOn: "2025-10-10",
    liaisonStatus: "Pending",
    liaisonNote: "",
    cv: "bilal_cv.pdf",
    coverLetter: "I am excited about the opportunity to work on live blockchain projects...",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const statusConfig = {
  Pending:   { bg: "#FEF3C7", color: "#92400E", icon: <Clock size={13} />,        label: "Pending Review" },
  Forwarded: { bg: "#DBEAFE", color: "#1E40AF", icon: <Send size={13} />,         label: "Forwarded to Industry" },
  Rejected:  { bg: "#FEE2E2", color: "#991B1B", icon: <XCircle size={13} />,      label: "Rejected" },
};

const typeConfig = {
  Internship: { bg: "#FCE7F3", color: "#BE185D" },
  Research:   { bg: "#D1FAE5", color: "#065F46" },
  Project:    { bg: "#EDE9FE", color: "#6D28D9" },
  Workshop:   { bg: "#FEF9C3", color: "#854D0E" },
};

// ─── Component ─────────────────────────────────────────────────────────────────
const StudentApplications = () => {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [selectedApp, setSelectedApp]   = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery]   = useState("");
  const [noteInput, setNoteInput]       = useState("");
  const [confirmModal, setConfirmModal] = useState(null); // { app, action: "Forward"|"Reject" }
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = (appId, action) => {
    setApplications(prev =>
      prev.map(a =>
        a.id === appId
          ? { ...a, liaisonStatus: action === "Forward" ? "Forwarded" : "Rejected", liaisonNote: noteInput }
          : a
      )
    );
    setNoteInput("");
    setConfirmModal(null);
    setSelectedApp(null);
    showToast(
      action === "Forward"
        ? "Application forwarded to industry successfully!"
        : "Application rejected. Student will be notified.",
      action === "Forward" ? "success" : "error"
    );
  };

  const filtered = applications.filter(a => {
    const matchStatus = filterStatus === "All" || a.liaisonStatus === filterStatus;
    const matchSearch =
      a.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.post.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.student.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    All:       applications.length,
    Pending:   applications.filter(a => a.liaisonStatus === "Pending").length,
    Forwarded: applications.filter(a => a.liaisonStatus === "Forwarded").length,
    Rejected:  applications.filter(a => a.liaisonStatus === "Rejected").length,
  };

  return (
    <div style={s.page}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            style={{ ...s.toast, background: toast.type === "success" ? "#10B981" : "#EF4444" }}
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
          >
            {toast.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.headerIcon}><Inbox size={22} color="#fff" /></div>
          <div>
            <h1 style={s.title}>Student Applications</h1>
            <p style={s.subtitle}>
              Review applications approved by Internship Incharge · Forward or reject to send to industry.
            </p>
          </div>
        </div>
        <div style={s.flowBadge}>
          <span style={s.flowStep}>Student</span>
          <ChevronRight size={14} color="#94A3B8" />
          <span style={s.flowStep}>Incharge ✓</span>
          <ChevronRight size={14} color="#94A3B8" />
          <span style={{ ...s.flowStep, ...s.flowStepActive }}>Industry Liaison</span>
          <ChevronRight size={14} color="#94A3B8" />
          <span style={s.flowStep}>Industry</span>
        </div>
      </div>

      {/* Summary Stat Tabs */}
      <div style={s.tabs}>
        {["All", "Pending", "Forwarded", "Rejected"].map((tab) => {
          const active = filterStatus === tab;
          const sc = tab === "All" ? null : statusConfig[tab];
          return (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.96 }}
              style={{ ...s.tab, ...(active ? s.tabActive : {}) }}
              onClick={() => setFilterStatus(tab)}
            >
              {sc && <span style={{ ...s.tabDot, background: sc.color }} />}
              {tab}
              <span style={{ ...s.tabCount, background: active ? "rgba(255,255,255,0.25)" : "#F1F5F9" }}>
                {counts[tab]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Search */}
      <div style={s.searchWrap}>
        <Search size={16} color="#9CA3AF" />
        <input
          style={s.searchInput}
          placeholder="Search by student name, ID, post title or industry..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Applications List */}
      <div style={s.list}>
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div style={s.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Inbox size={52} color="#E2E8F0" />
              <p style={{ color: "#94A3B8", marginTop: "12px" }}>No applications found.</p>
            </motion.div>
          )}
          {filtered.map((app, idx) => {
            const sc = statusConfig[app.liaisonStatus];
            const tc = typeConfig[app.post.type] || typeConfig.Project;
            return (
              <motion.div
                key={app.id}
                style={s.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
              >
                {/* Left accent */}
                <div style={{ ...s.cardAccent, background: sc.color }} />

                <div style={s.cardBody}>
                  {/* Student Info */}
                  <div style={s.studentSection}>
                    <div style={{ ...s.avatarLg, background: ["#DBEAFE","#EDE9FE","#FCE7F3","#D1FAE5","#FEF3C7"][idx % 5], color: ["#1D4ED8","#6D28D9","#BE185D","#065F46","#92400E"][idx % 5] }}>
                      {app.student.name[0]}
                    </div>
                    <div>
                      <div style={s.studentName}>{app.student.name}</div>
                      <div style={s.studentMeta}>
                        <span><GraduationCap size={12} /> {app.student.program}</span>
                        <span>·</span>
                        <span>ID: {app.student.id}</span>
                        <span>·</span>
                        <span>CGPA: {app.student.cgpa}</span>
                        <span>·</span>
                        <span>Sem {app.student.semester}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Info */}
                  <div style={s.postSection}>
                    <div style={s.postTitle}>
                      <Building2 size={14} color="#3B82F6" />
                      {app.post.title}
                    </div>
                    <div style={s.postMeta}>
                      <span style={{ ...s.badge, background: tc.bg, color: tc.color }}>
                        <Tag size={10} /> {app.post.type}
                      </span>
                      <span style={s.industryChip}>{app.post.industry}</span>
                      <span style={s.domainChip}>{app.post.domain}</span>
                    </div>
                  </div>

                  {/* Dates + Incharge Note Preview */}
                  <div style={s.metaRow}>
                    <span style={s.metaItem}><Calendar size={12} /> Applied: {app.appliedOn}</span>
                    <span style={s.metaItem}><CheckCircle size={12} color="#10B981" /> Approved by Incharge: {app.inchargeApprovedOn}</span>
                  </div>

                  <div style={s.inchargeNote}>
                    <Info size={12} color="#6366F1" />
                    <span><strong>Incharge Note:</strong> {app.inchargeNote}</span>
                  </div>

                  {app.liaisonNote && (
                    <div style={{ ...s.inchargeNote, background: sc.bg, borderColor: sc.color + "60" }}>
                      <FileText size={12} color={sc.color} />
                      <span style={{ color: sc.color }}><strong>Your Note:</strong> {app.liaisonNote}</span>
                    </div>
                  )}
                </div>

                {/* Right Panel */}
                <div style={s.cardRight}>
                  <span style={{ ...s.statusPill, background: sc.bg, color: sc.color }}>
                    {sc.icon} {sc.label}
                  </span>

                  <div style={s.appId}>{app.id}</div>

                  <div style={s.actionBtns}>
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      style={s.btnView}
                      onClick={() => { setSelectedApp(app); setNoteInput(app.liaisonNote || ""); }}
                    >
                      <Eye size={14} /> Review
                    </motion.button>

                    {app.liaisonStatus === "Pending" && (
                      <>
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          style={s.btnForward}
                          onClick={() => { setConfirmModal({ app, action: "Forward" }); setNoteInput(""); }}
                        >
                          <Send size={14} /> Forward
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          style={s.btnReject}
                          onClick={() => { setConfirmModal({ app, action: "Reject" }); setNoteInput(""); }}
                        >
                          <XCircle size={14} /> Reject
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ===== Detail Modal ===== */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div style={s.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)}>
            <motion.div
              style={s.modal}
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={s.modalHeader}>
                <div style={s.modalHeaderContent}>
                  <div style={s.modalAvatar}>
                    {selectedApp.student.name[0]}
                  </div>
                  <div>
                    <h2 style={s.modalName}>{selectedApp.student.name}</h2>
                    <p style={s.modalSub}>{selectedApp.student.program} · {selectedApp.student.id}</p>
                  </div>
                  <span style={{ ...s.statusPill, background: statusConfig[selectedApp.liaisonStatus].bg, color: statusConfig[selectedApp.liaisonStatus].color, marginLeft: "auto" }}>
                    {statusConfig[selectedApp.liaisonStatus].icon}
                    {statusConfig[selectedApp.liaisonStatus].label}
                  </span>
                </div>
              </div>

              <div style={s.modalBody}>
                {/* Application Info */}
                <div style={s.modalSection}>
                  <h4 style={s.sectionTitle}><Building2 size={14} /> Applied Position</h4>
                  <div style={s.infoGrid}>
                    <div style={s.infoCell}><span style={s.infoLabel}>Post Title</span><span style={s.infoVal}>{selectedApp.post.title}</span></div>
                    <div style={s.infoCell}><span style={s.infoLabel}>Type</span><span style={s.infoVal}>{selectedApp.post.type}</span></div>
                    <div style={s.infoCell}><span style={s.infoLabel}>Industry</span><span style={s.infoVal}>{selectedApp.post.industry}</span></div>
                    <div style={s.infoCell}><span style={s.infoLabel}>Domain</span><span style={s.infoVal}>{selectedApp.post.domain}</span></div>
                    <div style={s.infoCell}><span style={s.infoLabel}>Applied On</span><span style={s.infoVal}>{selectedApp.appliedOn}</span></div>
                    <div style={s.infoCell}><span style={s.infoLabel}>Incharge Approved</span><span style={s.infoVal}>{selectedApp.inchargeApprovedOn}</span></div>
                  </div>
                </div>

                {/* Student Details */}
                <div style={s.modalSection}>
                  <h4 style={s.sectionTitle}><GraduationCap size={14} /> Student Profile</h4>
                  <div style={s.infoGrid}>
                    <div style={s.infoCell}><span style={s.infoLabel}>Email</span><span style={s.infoVal}>{selectedApp.student.email}</span></div>
                    <div style={s.infoCell}><span style={s.infoLabel}>CGPA</span><span style={s.infoVal}>{selectedApp.student.cgpa}</span></div>
                    <div style={s.infoCell}><span style={s.infoLabel}>Semester</span><span style={s.infoVal}>{selectedApp.student.semester}</span></div>
                    <div style={s.infoCell}><span style={s.infoLabel}>CV</span><span style={{ ...s.infoVal, color: "#3B82F6", cursor: "pointer" }}>📄 {selectedApp.cv}</span></div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div style={s.modalSection}>
                  <h4 style={s.sectionTitle}><FileText size={14} /> Cover Letter</h4>
                  <p style={s.coverText}>{selectedApp.coverLetter}</p>
                </div>

                {/* Incharge Note */}
                <div style={s.modalSection}>
                  <h4 style={s.sectionTitle}><Info size={14} /> Internship Incharge Remarks</h4>
                  <div style={s.noteBox}>{selectedApp.inchargeNote}</div>
                </div>

                {/* Liaison Note */}
                {selectedApp.liaisonStatus === "Pending" && (
                  <div style={s.modalSection}>
                    <h4 style={s.sectionTitle}><FileText size={14} /> Your Remarks (Optional)</h4>
                    <textarea
                      style={s.noteTextarea}
                      placeholder="Add a note before forwarding or rejecting..."
                      value={noteInput}
                      onChange={e => setNoteInput(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                {selectedApp.liaisonNote && selectedApp.liaisonStatus !== "Pending" && (
                  <div style={s.modalSection}>
                    <h4 style={s.sectionTitle}><FileText size={14} /> Your Remarks</h4>
                    <div style={{ ...s.noteBox, background: statusConfig[selectedApp.liaisonStatus].bg, borderColor: statusConfig[selectedApp.liaisonStatus].color + "40", color: statusConfig[selectedApp.liaisonStatus].color }}>
                      {selectedApp.liaisonNote}
                    </div>
                  </div>
                )}

                {/* Action Buttons inside modal */}
                {selectedApp.liaisonStatus === "Pending" && (
                  <div style={s.modalActions}>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      style={s.modalBtnReject}
                      onClick={() => { setConfirmModal({ app: selectedApp, action: "Reject" }); }}
                    >
                      <XCircle size={16} /> Reject Application
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      style={s.modalBtnForward}
                      onClick={() => { setConfirmModal({ app: selectedApp, action: "Forward" }); }}
                    >
                      <Send size={16} /> Forward to Industry <ArrowRight size={16} />
                    </motion.button>
                  </div>
                )}
              </div>

              <button style={s.closeBtn} onClick={() => setSelectedApp(null)}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Confirm Modal ===== */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div style={{ ...s.overlay, zIndex: 1100 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmModal(null)}>
            <motion.div
              style={s.confirmBox}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ ...s.confirmIcon, background: confirmModal.action === "Forward" ? "#DBEAFE" : "#FEE2E2" }}>
                {confirmModal.action === "Forward"
                  ? <Send size={28} color="#1D4ED8" />
                  : <XCircle size={28} color="#DC2626" />}
              </div>
              <h3 style={s.confirmTitle}>
                {confirmModal.action === "Forward" ? "Forward to Industry?" : "Reject Application?"}
              </h3>
              <p style={s.confirmMsg}>
                {confirmModal.action === "Forward"
                  ? `You are about to forward ${confirmModal.app.student.name}'s application to ${confirmModal.app.post.industry}. This action will notify the industry partner.`
                  : `You are about to reject ${confirmModal.app.student.name}'s application. The student will be notified of the decision.`}
              </p>

              <div style={s.noteInputWrap}>
                <label style={s.noteLabel}>Add a remark (optional)</label>
                <textarea
                  style={s.noteTextarea}
                  rows={2}
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder={confirmModal.action === "Forward" ? "e.g. Strong candidate, please prioritize." : "e.g. Insufficient experience for this role."}
                />
              </div>

              <div style={s.confirmBtns}>
                <button style={s.cancelBtn} onClick={() => { setConfirmModal(null); setNoteInput(""); }}>Cancel</button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  style={confirmModal.action === "Forward" ? s.confirmFwdBtn : s.confirmRejBtn}
                  onClick={() => handleAction(confirmModal.app.id, confirmModal.action)}
                >
                  {confirmModal.action === "Forward"
                    ? <><Send size={15} /> Confirm Forward</>
                    : <><XCircle size={15} /> Confirm Reject</>}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    padding: "36px 52px",
    background: "#F8FAFC",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
  },
  toast: {
    position: "fixed", top: "20px", left: "50%",
    transform: "translateX(-50%)",
    display: "flex", alignItems: "center", gap: "8px",
    color: "#fff", padding: "12px 24px", borderRadius: "12px",
    fontWeight: "600", fontSize: "0.88rem",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 9999,
  },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: "28px",
    flexWrap: "wrap", gap: "16px",
  },
  headerLeft: { display: "flex", alignItems: "flex-start", gap: "16px" },
  headerIcon: {
    background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
    borderRadius: "14px", padding: "12px",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
  },
  title: { fontSize: "1.7rem", fontWeight: "700", color: "#0F172A", margin: 0 },
  subtitle: { color: "#64748B", fontSize: "0.88rem", marginTop: "5px" },
  flowBadge: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "#fff", borderRadius: "12px", padding: "10px 16px",
    border: "1.5px solid #E2E8F0", fontSize: "0.8rem", flexWrap: "wrap",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  flowStep: { color: "#94A3B8", fontWeight: "500" },
  flowStepActive: {
    background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    fontWeight: "700",
  },
  tabs: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
  tab: {
    display: "flex", alignItems: "center", gap: "7px",
    padding: "9px 18px", borderRadius: "10px",
    border: "1.5px solid #E2E8F0", background: "#fff",
    color: "#475569", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer",
  },
  tabActive: {
    background: "#0F172A", color: "#fff", borderColor: "#0F172A",
  },
  tabDot: { width: "7px", height: "7px", borderRadius: "50%" },
  tabCount: {
    padding: "2px 8px", borderRadius: "20px",
    fontSize: "0.75rem", fontWeight: "700",
  },
  searchWrap: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "#fff", borderRadius: "12px", padding: "10px 16px",
    border: "1.5px solid #E2E8F0", marginBottom: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  searchInput: {
    border: "none", outline: "none", fontSize: "0.88rem",
    background: "transparent", width: "100%", color: "#0F172A",
  },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  empty: {
    display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0",
  },
  card: {
    background: "#fff", borderRadius: "16px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
    display: "flex", overflow: "hidden",
    transition: "box-shadow 0.3s, transform 0.3s",
  },
  cardAccent: { width: "5px", flexShrink: 0 },
  cardBody: { flex: 1, padding: "20px 20px 20px 20px", display: "flex", flexDirection: "column", gap: "10px" },
  studentSection: { display: "flex", alignItems: "center", gap: "12px" },
  avatarLg: {
    width: "44px", height: "44px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1rem", fontWeight: "700", flexShrink: 0,
  },
  studentName: { fontSize: "1rem", fontWeight: "700", color: "#0F172A" },
  studentMeta: {
    display: "flex", gap: "6px", alignItems: "center",
    fontSize: "0.78rem", color: "#94A3B8", flexWrap: "wrap", marginTop: "3px",
  },
  postSection: { display: "flex", flexDirection: "column", gap: "6px" },
  postTitle: {
    display: "flex", alignItems: "center", gap: "7px",
    fontSize: "0.9rem", fontWeight: "600", color: "#1E40AF",
  },
  postMeta: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" },
  badge: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    padding: "3px 10px", borderRadius: "20px", fontSize: "0.73rem", fontWeight: "600",
  },
  industryChip: {
    fontSize: "0.78rem", color: "#475569", background: "#F1F5F9",
    padding: "3px 10px", borderRadius: "8px", border: "1px solid #E2E8F0",
  },
  domainChip: {
    fontSize: "0.75rem", color: "#94A3B8", fontStyle: "italic",
  },
  metaRow: { display: "flex", gap: "16px", flexWrap: "wrap" },
  metaItem: {
    display: "flex", alignItems: "center", gap: "5px",
    fontSize: "0.78rem", color: "#64748B",
  },
  inchargeNote: {
    display: "flex", alignItems: "flex-start", gap: "8px",
    background: "#F0F4FF", borderRadius: "10px", padding: "10px 14px",
    fontSize: "0.82rem", color: "#3730A3", lineHeight: 1.5,
    border: "1px solid #C7D2FE",
  },
  cardRight: {
    padding: "20px 22px", display: "flex", flexDirection: "column",
    alignItems: "flex-end", justifyContent: "space-between",
    gap: "12px", minWidth: "180px", borderLeft: "1px solid #F1F5F9",
  },
  statusPill: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "5px 12px", borderRadius: "20px",
    fontSize: "0.77rem", fontWeight: "700", whiteSpace: "nowrap",
  },
  appId: { fontSize: "0.75rem", color: "#CBD5E1", fontWeight: "600" },
  actionBtns: { display: "flex", flexDirection: "column", gap: "8px", width: "100%" },
  btnView: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
    background: "#F8FAFC", color: "#475569", border: "1.5px solid #E2E8F0",
    borderRadius: "10px", padding: "8px 12px", fontSize: "0.82rem",
    fontWeight: "600", cursor: "pointer",
  },
  btnForward: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
    background: "#EFF6FF", color: "#1D4ED8", border: "1.5px solid #BFDBFE",
    borderRadius: "10px", padding: "8px 12px", fontSize: "0.82rem",
    fontWeight: "600", cursor: "pointer",
  },
  btnReject: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
    background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA",
    borderRadius: "10px", padding: "8px 12px", fontSize: "0.82rem",
    fontWeight: "600", cursor: "pointer",
  },
  /* Detail Modal */
  overlay: {
    position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#fff", borderRadius: "24px",
    width: "600px", maxWidth: "96vw", maxHeight: "92vh", overflowY: "auto",
    boxShadow: "0 30px 70px rgba(0,0,0,0.3)",
  },
  modalHeader: {
    background: "linear-gradient(135deg, #0F172A, #1E3A5F)",
    padding: "24px", borderRadius: "24px 24px 0 0",
  },
  modalHeaderContent: { display: "flex", alignItems: "center", gap: "14px" },
  modalAvatar: {
    width: "48px", height: "48px", borderRadius: "50%",
    background: "rgba(255,255,255,0.15)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.2rem", fontWeight: "700", flexShrink: 0,
  },
  modalName: { fontSize: "1.15rem", fontWeight: "700", color: "#fff", margin: 0 },
  modalSub: { color: "rgba(255,255,255,0.6)", fontSize: "0.83rem", margin: "4px 0 0 0" },
  modalBody: { padding: "24px" },
  modalSection: { marginBottom: "20px" },
  sectionTitle: {
    display: "flex", alignItems: "center", gap: "7px",
    fontSize: "0.85rem", fontWeight: "700", color: "#475569",
    textTransform: "uppercase", letterSpacing: "0.05em",
    marginBottom: "12px", paddingBottom: "8px",
    borderBottom: "1px solid #F1F5F9",
  },
  infoGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px",
  },
  infoCell: {
    background: "#F8FAFC", borderRadius: "10px", padding: "10px 14px",
    border: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "3px",
  },
  infoLabel: { fontSize: "0.7rem", color: "#94A3B8", fontWeight: "600", textTransform: "uppercase" },
  infoVal: { fontSize: "0.85rem", color: "#0F172A", fontWeight: "600" },
  coverText: {
    fontSize: "0.85rem", color: "#475569", lineHeight: 1.65,
    background: "#F8FAFC", borderRadius: "10px", padding: "14px",
    border: "1px solid #F1F5F9",
  },
  noteBox: {
    fontSize: "0.85rem", color: "#3730A3", background: "#F0F4FF",
    borderRadius: "10px", padding: "14px", border: "1px solid #C7D2FE",
    lineHeight: 1.6,
  },
  noteTextarea: {
    width: "100%", border: "1.5px solid #E2E8F0", borderRadius: "10px",
    padding: "12px", fontSize: "0.85rem", color: "#0F172A",
    resize: "vertical", outline: "none", fontFamily: "inherit",
    boxSizing: "border-box",
  },
  modalActions: { display: "flex", gap: "12px", marginTop: "20px" },
  modalBtnReject: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA",
    borderRadius: "12px", padding: "12px", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer",
  },
  modalBtnForward: {
    flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff",
    border: "none", borderRadius: "12px", padding: "12px",
    fontWeight: "600", fontSize: "0.9rem", cursor: "pointer",
    boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
  },
  closeBtn: {
    display: "block", width: "calc(100% - 48px)", margin: "0 24px 24px",
    background: "#F1F5F9", color: "#475569", border: "none",
    borderRadius: "12px", padding: "11px", fontWeight: "600",
    fontSize: "0.9rem", cursor: "pointer",
  },
  /* Confirm Modal */
  confirmBox: {
    background: "#fff", borderRadius: "22px", padding: "32px",
    width: "420px", maxWidth: "95vw", textAlign: "center",
    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
  },
  confirmIcon: {
    width: "64px", height: "64px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 18px",
  },
  confirmTitle: { fontSize: "1.2rem", fontWeight: "700", color: "#0F172A", margin: "0 0 10px" },
  confirmMsg: { fontSize: "0.88rem", color: "#64748B", lineHeight: 1.6, marginBottom: "20px" },
  noteInputWrap: { textAlign: "left", marginBottom: "20px" },
  noteLabel: { display: "block", fontSize: "0.8rem", color: "#64748B", fontWeight: "600", marginBottom: "6px" },
  confirmBtns: { display: "flex", gap: "12px" },
  cancelBtn: {
    flex: 1, background: "#F1F5F9", color: "#64748B", border: "none",
    borderRadius: "12px", padding: "12px", fontWeight: "600", cursor: "pointer",
  },
  confirmFwdBtn: {
    flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff",
    border: "none", borderRadius: "12px", padding: "12px",
    fontWeight: "600", cursor: "pointer",
    boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
  },
  confirmRejBtn: {
    flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: "#DC2626", color: "#fff", border: "none",
    borderRadius: "12px", padding: "12px", fontWeight: "600", cursor: "pointer",
    boxShadow: "0 4px 14px rgba(220,38,38,0.3)",
  },
};

export default StudentApplications;