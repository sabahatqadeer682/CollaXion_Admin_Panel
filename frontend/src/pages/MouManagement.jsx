// MouManagement.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Clock, AlertTriangle, Search, Filter, X } from "lucide-react";
import jsPDF from "jspdf";

const MouManagement = () => {
  const [mous, setMous] = useState([
    {
      id: 1,
      university: "Riphah International University",
      industry: "TechNova Pvt Ltd",
      startDate: "2025-01-10",
      endDate: "2026-01-10",
      description: "Collaboration for joint research and internship programs.",
    },
    {
      id: 2,
      university: "Riphah International University",
      industry: "InnoSoft Solutions",
      startDate: "2023-08-01",
      endDate: "2024-08-01",
      description: "Expired MOU for training programs and joint projects.",
    },
    {
      id: 3,
      university: "Riphah International University",
      industry: "Alpha Robotics",
      startDate: "2024-07-05",
      endDate: "2026-07-05",
      description: "Joint robotics research & lab access.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activityLog, setActivityLog] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    university: "",
    industry: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    setActivityLog([
      "✅ MOU created between Riphah & TechNova (Jan 10, 2025)",
      "⚠️ MOU expired: Riphah × InnoSoft (Aug 1, 2024)",
      "📄 Draft prepared for Riphah × Alpha Robotics",
    ]);
  }, []);

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
      m.university.toLowerCase().includes(q) ||
      m.industry.toLowerCase().includes(q);
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

  const handleCreate = (e) => {
    e.preventDefault();
    const newMou = {
      ...formData,
      id: mous.length + Math.floor(Math.random() * 1000) + 1,
    };
    setMous((s) => [newMou, ...s]);
    setActivityLog((a) => [
      `✅ MOU created between ${newMou.university} & ${newMou.industry}`,
      ...a,
    ]);
    setFormData({
      university: "",
      industry: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setShowModal(false);
    generatePDF(newMou);
  };

  const generatePDF = (mou) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("MEMORANDUM OF UNDERSTANDING", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Between: ${mou.university} and ${mou.industry}`, 20, 40);
    doc.text(`Start Date: ${mou.startDate}`, 20, 52);
    doc.text(`End Date: ${mou.endDate}`, 20, 64);
    doc.text("Description:", 20, 76);
    doc.text(mou.description || "-", 20, 86);
    doc.text("University Signature: ____________________", 20, 120);
    doc.text("Industry Signature: _______________________", 20, 140);
    doc.save(`${mou.university.replace(/\s+/g, "_")}_MOU.pdf`);
  };

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
            <Search size={16} color="#2b5b94" />
            <input
              style={styles.searchInput}
              placeholder="Search through industry name ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={styles.filterWrapper}>
            <Filter size={16} color="#2b5b94" />
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
            whileHover={{ scale: 1.03 }}
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
          <div style={styles.statValue}>{mous.filter(isExpired).length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>Expiring soon</div>
          <div style={styles.statValue}>{expiringSoon.length}</div>
        </div>
      </div>

      {/* Expiry Alert */}
      {expiringSoon.length > 0 && (
        <div style={styles.alert}>
          <AlertTriangle size={18} color="#a35b00" />
          <div style={{ marginLeft: 12 }}>
            <strong style={{ color: "#8a5b00" }}>{expiringSoon.length} MOUs expiring soon</strong>
            <div style={{ fontSize: 13, color: "#6b4f00", marginTop: 6 }}>
              {expiringSoon.map((m) => (
                <div key={m.id}>
                  • {m.university} × {m.industry} — ends {m.endDate}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={styles.grid}>
        <div style={styles.leftCol}>
          <div style={styles.cardGrid}>
            {filtered.length === 0 ? (
              <div style={styles.empty}>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#19405f" }}>
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
                    key={m.id}
                    whileHover={{ translateY: -6, boxShadow: "0 16px 30px rgba(0,0,0,0.08)" }}
                    style={{
                      ...styles.card,
                      ...(isExpired(m) ? styles.expiredCard : {}),
                    }}
                  >
                    <div style={styles.cardHeader}>
                      <div>
                        <div style={styles.cardTitle}>{m.university}</div>
                        <div style={styles.cardSubtitle}>Partner: {m.industry}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Clock size={18} color="#2b5b94" />
                        <div style={{ fontSize: 12, color: "#2b5b94", marginTop: 6 }}>
                          {m.startDate} → {m.endDate}
                        </div>
                      </div>
                    </div>

                    <div style={styles.desc}>{m.description || "—"}</div>

                    <div style={styles.progressWrap}>
                      <div style={styles.progressLabel}>
                        <div style={{ fontSize: 12, color: "#2b5b94" }}>
                          Progress: {progress}%
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: isExpired(m) ? "#9a2f2f" : "#2b5b94",
                          }}
                        >
                          {isExpired(m) ? "Expired" : "Ongoing"}
                        </div>
                      </div>

                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div style={styles.cardActions}>
                      <button
                        style={styles.pdfBtn}
                        onClick={() => generatePDF(m)}
                        title="Download MOU PDF"
                      >
                        Download PDF
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Activity Panel */}
        <div style={styles.rightCol}>
          <div style={styles.activity}>
            <div style={styles.activityHeader}>
              <h3 style={{ margin: 0 }}>Recent Activity</h3>
              <div style={{ fontSize: 13, color: "#2b5b94" }}>{activityLog.length} items</div>
            </div>
            <div style={styles.activityList}>
              {activityLog.map((a, i) => (
                <div key={i} style={styles.activityItem}>
                  {a}
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 18 }} />

          <div style={styles.helpCard}>
            <div style={{ fontWeight: 600, color: "#123b6e" }}>Tips</div>
            <div style={{ marginTop: 8, color: "#2b5b94" }}>
              Use search & filter to quickly find MOUs. Click "Create MOU" to add and auto-generate
              a PDF.
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={styles.modalCard}
              initial={{ y: 40, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div style={styles.modalHeader}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#123b6e" }}>
                    Create New MOU
                  </div>
                  <div style={{ fontSize: 13, color: "#27547f" }}>
                    Fill required details and save.
                  </div>
                </div>
                <div onClick={() => setShowModal(false)} style={{ cursor: "pointer" }}>
                  <X size={20} color="#2b5b94" />
                </div>
              </div>

              <form
                onSubmit={handleCreate}
                style={{
                  marginTop: 20,
                  display: "grid",
                  gap: 14,
                }}
              >
                <input
                  style={styles.input}
                  placeholder="University name"
                  value={formData.university}
                  required
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                />
                <input
                  style={styles.input}
                  placeholder="Industry / Partner"
                  value={formData.industry}
                  required
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <input
                    type="date"
                    style={{ ...styles.input, flex: 1, minWidth: 180 }}
                    value={formData.startDate}
                    required
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                  <input
                    type="date"
                    style={{ ...styles.input, flex: 1, minWidth: 180 }}
                    value={formData.endDate}
                    required
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
                <textarea
                  style={{
                    ...styles.input,
                    minHeight: 100,
                    resize: "vertical",
                    paddingTop: 10,
                  }}
                  placeholder="Short description (purpose, scope, etc.)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                  <button type="submit" style={styles.saveBtn}>
                    Save & Generate PDF
                  </button>
                  <button
                    type="button"
                    style={styles.ghostBtn}
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== Styles =====
const styles = {
  page: {
    minHeight: "100vh",
    padding: 36,
    background: "linear-gradient(135deg, #E6EEF8 0%, #B9CDF4 100%)",
    fontFamily: "'Poppins', sans-serif",
    color: "#173248",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "center",
    marginBottom: 18,
  },
  title: { fontSize: 24, margin: 0, fontWeight: 700, color: "#123b6e" },
  subtitle: { marginTop: 4, fontSize: 13, color: "#3a6088" },
  headerActions: { display: "flex", gap: 12, alignItems: "center" },
  searchWrapper: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    background: "rgba(255,255,255,0.8)",
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.6)",
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "6px 8px",
    minWidth: 220,
    color: "#123b6e",
  },
  filterWrapper: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    background: "rgba(255,255,255,0.8)",
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.6)",
  },
  filterSelect: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#123b6e",
    fontSize: 14,
  },
  createBtn: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    background: "linear-gradient(90deg,#3A70B0,#1E4F91)",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
  },
  summaryRow: { display: "flex", gap: 12, marginTop: 10, marginBottom: 18, flexWrap: "wrap" },
  statCard: {
    background: "rgba(255,255,255,0.85)",
    padding: 12,
    borderRadius: 12,
    minWidth: 140,
  },
  statTitle: { fontSize: 13, color: "#27547f" },
  statValue: { fontSize: 20, fontWeight: 600, color: "#123b6e" },
  alert: {
    display: "flex",
    background: "#fff6e6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
  },
  grid: { display: "flex", gap: 20, flexWrap: "wrap" },
  leftCol: { flex: 2, minWidth: 400 },
  rightCol: { flex: 1, minWidth: 260 },
  cardGrid: { display: "grid", gap: 14 },
  card: {
    background: "rgba(255,255,255,0.9)",
    borderRadius: 14,
    padding: 18,
    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
  },
  expiredCard: { borderLeft: "4px solid #a33f3f" },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: { fontSize: 16, fontWeight: 600, color: "#123b6e" },
  cardSubtitle: { fontSize: 13, color: "#2b5b94" },
  desc: { fontSize: 13, color: "#2b5b94", marginTop: 6 },
  progressWrap: { marginTop: 8 },
  progressLabel: { display: "flex", justifyContent: "space-between" },
  progressBar: {
    height: 8,
    borderRadius: 10,
    background: "rgba(39,84,127,0.2)",
  },
  progressFill: {
    height: 8,
    borderRadius: 10,
    background: "linear-gradient(90deg,#4a90e2,#1E4F91)",
  },
  cardActions: { display: "flex", justifyContent: "flex-end", marginTop: 10 },
  pdfBtn: {
    background: "rgba(39,84,127,0.1)",
    border: "none",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 12,
    color: "#123b6e",
  },
  activity: {
    background: "rgba(255,255,255,0.9)",
    borderRadius: 14,
    padding: 18,
  },
  activityHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  activityList: { display: "flex", flexDirection: "column", gap: 8 },
  activityItem: {
    fontSize: 13,
    color: "#2b5b94",
    background: "rgba(220,230,255,0.5)",
    padding: "6px 10px",
    borderRadius: 8,
  },
  helpCard: {
    background: "rgba(255,255,255,0.9)",
    borderRadius: 14,
    padding: 18,
  },
  empty: {
    textAlign: "center",
    padding: 40,
    background: "rgba(255,255,255,0.7)",
    borderRadius: 12,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modalCard: {
    background: "#fff",
    borderRadius: 18,
    padding: 28,
    width: "min(620px, 95%)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #c4d4ea",
    outline: "none",
    background: "#f8fbff",
    color: "#123b6e",
    fontSize: 13,
  },
  saveBtn: {
    background: "linear-gradient(90deg,#3A70B0,#1E4F91)",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
  },
  ghostBtn: {
    background: "transparent",
    color: "#2b5b94",
    border: "1px solid #2b5b94",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
  },
};

export default MouManagement;
