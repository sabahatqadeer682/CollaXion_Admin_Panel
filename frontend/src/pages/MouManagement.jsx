// MouManagement.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  X,
} from "lucide-react";
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
      university: "FAST NUCES",
      industry: "InnoSoft Solutions",
      startDate: "2023-08-01",
      endDate: "2024-08-01",
      description: "Expired MOU for training programs and joint projects.",
    },
    {
      id: 3,
      university: "COMSATS University",
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
      "⚠️ MOU expired: FAST NUCES × InnoSoft (Aug 1, 2024)",
      "📄 Draft prepared for COMSATS × Alpha Robotics",
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
    setFormData({ university: "", industry: "", startDate: "", endDate: "", description: "" });
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
              placeholder="Search university or industry..."
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

      {/* Summary row */}
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

      {/* Expiry alerts */}
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

      {/* Grid: left = list, right = activity log */}
      <div style={styles.grid}>
        <div style={styles.leftCol}>
          {/* Card list */}
          <div style={styles.cardGrid}>
            {filtered.length === 0 ? (
              <div style={styles.empty}>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#19405f" }}>
                  No MOUs match your search.
                </div>
                <div style={{ color: "#2b5b94", marginTop: 8 }}>Try clearing filters or add a new MOU.</div>
              </div>
            ) : (
              filtered.map((m) => {
                const progress = calcProgressLocal(m.startDate, m.endDate);
                return (
                  <motion.div
                    key={m.id}
                    whileHover={{ translateY: -6, boxShadow: "0 16px 30px rgba(0,0,0,0.08)" }}
                    style={{ ...styles.card, ...(isExpired(m) ? styles.expiredCard : {}) }}
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
                          Progress: {calcProgress(m.startDate, m.endDate)}%
                        </div>
                        <div style={{ fontSize: 12, color: isExpired(m) ? "#9a2f2f" : "#2b5b94" }}>
                          {isExpired(m) ? "Expired" : isOngoing(m) ? "Ongoing" : "Completed"}
                        </div>
                      </div>

                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${calcProgress(m.startDate, m.endDate)}%`,
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
              Use search & filter to quickly find MOUs. Click "Create MOU" to add and auto-generate a PDF.
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Glassmorphism style */}
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

        <form onSubmit={handleCreate} style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
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

          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="date"
              style={{ ...styles.input, flex: 1 }}
              value={formData.startDate}
              required
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <input
              type="date"
              style={{ ...styles.input, flex: 1 }}
              value={formData.endDate}
              required
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <textarea
            style={{ ...styles.input, minHeight: 100, resize: "vertical", paddingTop: 10 }}
            placeholder="Short description (purpose, scope, etc.)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button type="submit" style={styles.saveBtn}>
              Save & Generate PDF
            </button>
            <button type="button" style={styles.ghostBtn} onClick={() => setShowModal(false)}>
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

// Local helper used in map to avoid repeated date parsing
function calcProgressLocal(start, end) {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (isNaN(s) || isNaN(e) || e <= s) return 100;
  const now = Date.now();
  const total = e - s;
  const elapsed = Math.max(0, Math.min(now - s, total));
  return Math.round((elapsed / total) * 100);
}

function calcProgress(start, end) {
  return calcProgressLocal(start, end);
}

// ===== styles =====
const styles = {
  page: {
    minHeight: "100vh",
    padding: 36,
    // light-blue gradient (same feel as earlier)
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
  headerActions: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  searchWrapper: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    background: "rgba(255,255,255,0.8)",
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 6px 18px rgba(29,86,140,0.06)",
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
    boxShadow: "0 8px 22px rgba(30,79,145,0.18)",
  },

  summaryRow: { display: "flex", gap: 12, marginTop: 10, marginBottom: 18, flexWrap: "wrap" },
  statCard: {
    background: "rgba(255,255,255,0.85)",
    padding: 12,
    borderRadius: 12,
    minWidth: 140,
    boxShadow: "0 8px 30px rgba(23,58,92,0.05)",
    border: "1px solid rgba(255,255,255,0.6)",
  },
  statTitle: { fontSize: 13, color: "#27547f" },
  statValue: { fontSize: 20, fontWeight: 700, color: "#123b6e", marginTop: 6 },

  alert: {
    background: "rgba(255,245,225,1)",
    borderRadius: 12,
    padding: 12,
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 16,
    border: "1px solid rgba(170,120,0,0.12)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: 18,
    alignItems: "start",
  },

  leftCol: {},
  rightCol: {},

  cardGrid: { display: "grid", gap: 14 },

  card: {
    background: "rgba(255,255,255,0.85)",
    borderRadius: 14,
    padding: 14,
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 10px 26px rgba(21,65,106,0.04)",
  },
  expiredCard: {
    opacity: 0.7,
    background: "rgba(250,245,245,0.9)",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#123b6e" },
  cardSubtitle: { fontSize: 13, color: "#27547f", marginTop: 6 },
  desc: { marginTop: 10, color: "#2b5b94", fontSize: 14 },
  progressWrap: { marginTop: 12 },
  progressLabel: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  progressBar: {
    height: 9,
    background: "rgba(28,64,102,0.06)",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg,#3b82f6,#60a5fa)",
    transition: "width 0.5s ease",
  },

  cardActions: { marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" },
  pdfBtn: {
    background: "linear-gradient(90deg,#4CAF50,#3A8C42)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },

  activity: {
    background: "rgba(255,255,255,0.9)",
    padding: 14,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 10px 20px rgba(23,58,92,0.03)",
  },
  activityHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  activityList: { display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflow: "auto" },
  activityItem: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,250,255,0.96))",
    padding: 10,
    borderRadius: 8,
    color: "#1d4b77",
    fontSize: 13,
    border: "1px solid rgba(30,78,119,0.04)",
  },

  helpCard: {
    padding: 12,
    borderRadius: 12,
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(255,255,255,0.6)",
  },

  // Modal glassmorphism
  modalOverlay: {
    position: "fixed",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(15,30,45,0.28)",
    backdropFilter: "blur(4px)",
    zIndex: 1200,
    padding: 24,
  },
  modalCard: {
    width: 520,
    borderRadius: 16,
    padding: 20,
    background: "linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.62))",
    boxShadow: "0 20px 50px rgba(20,60,100,0.18)",
    border: "1px solid rgba(255,255,255,0.5)",
    backdropFilter: "blur(8px)",
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },

  formRow: { marginTop: 12 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(30,78,119,0.08)",
    background: "rgba(255,255,255,0.9)",
    outline: "none",
    fontSize: 14,
    color: "#123b6e",
  },
  saveBtn: {
    background: "linear-gradient(90deg,#3A70B0,#1E4F91)",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  ghostBtn: {
    background: "transparent",
    border: "1px solid rgba(30,78,119,0.12)",
    padding: "10px 12px",
    borderRadius: 10,
    color: "#123b6e",
    cursor: "pointer",
  },
};

export default MouManagement;
