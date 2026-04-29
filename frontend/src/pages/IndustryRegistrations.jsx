import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import LiaisonNavbar from "../components/LiaisonNavbar";
import LiaisonFooter from "../components/LiaisonFooter";
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  Eye,
  X,
  User,
  Calendar,
  Briefcase,
  MessageCircle,
} from "lucide-react";

const APP_DOWNLOAD_LINK = "https://collaxion.app/download";
const DEFAULT_COUNTRY_CODE = "92";

const slugify = (str = "") =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 10) || "industry";

const randomDigits = (n) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 10 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
};

const generateCredentials = (companyName) => ({
  username: `${slugify(companyName)}_${randomDigits(4)}`,
  password: generatePassword(),
});

const buildConfirmationMessage = ({ contactName, companyName, username, password }) =>
  `Assalam-o-Alaikum,

Thank you for registering ${companyName || "your organisation"} with CollaXion! 

We're delighted to inform you that your registration has been successfully *approved*. A warm welcome to the CollaXion Team - we're excited to have you on board as a valued partner in our university–industry collaboration network.

*About CollaXion*
CollaXion is a unified platform that bridges universities and industries, enabling seamless collaboration on internships, projects, research initiatives, and talent acquisition.

*Get Started - Download the App*
${APP_DOWNLOAD_LINK}

 *Your Login Credentials*
• Username: ${username}
• Password: ${password}

For your account's security, please change your password right after your first login.

*What's Next?*
• Sign in using the credentials above
• Complete your company profile
• Start posting opportunities and connecting with top student talent

If you have any questions or need assistance, feel free to reach us at collaxionteam@gmail.com - our team is happy to help.

We're truly excited to have you with us and look forward to a long-lasting, impactful collaboration. 

Warm regards,
*Team CollaXion*`;

const normalisePhone = (raw = "") => {
  let digits = String(raw).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = DEFAULT_COUNTRY_CODE + digits.slice(1);
  if (digits.length <= 10) digits = DEFAULT_COUNTRY_CODE + digits;
  return digits;
};

const sendWhatsAppConfirmation = (reg) => {
  const phone = normalisePhone(reg.phone);
  if (!phone) {
    alert("Is registration mein valid phone number nahi hai.");
    return;
  }
  const { username, password } = generateCredentials(reg.companyName);
  const text = buildConfirmationMessage({
    contactName: reg.contactName,
    companyName: reg.companyName,
    username,
    password,
  });
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

const STATUS_CONFIG = {
  Pending:  { bg: "#FEF3C7", color: "#92400E", icon: Clock       },
  Approved: { bg: "#D1FAE5", color: "#065F46", icon: CheckCircle },
  Rejected: { bg: "#FEE2E2", color: "#DC2626", icon: XCircle     },
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal = ({ reg, onClose, onApprove, onReject, updating }) => {
  if (!reg) return null;
  const SC = STATUS_CONFIG[reg.status] || STATUS_CONFIG.Pending;

  return (
    <AnimatePresence>
      <motion.div
        style={ms.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={ms.modal}
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div style={ms.header}>
            <div style={ms.headerLeft}>
              <div style={ms.bigIcon}>
                <Building2 size={32} color="#193648" />
              </div>
              <div>
                <h2 style={ms.companyTitle}>{reg.companyName}</h2>
                <p style={ms.industryType}>{reg.industry}</p>
              </div>
            </div>
            <button style={ms.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Status */}
          <div style={{ padding: "0 24px 16px" }}>
            <span style={{ ...ms.statusBadge, background: SC.bg, color: SC.color }}>
              <SC.icon size={14} />
              {reg.status}
            </span>
            <span style={ms.timestamp}>Submitted: {reg.timestamp}</span>
          </div>

          {/* Details Grid */}
          <div style={ms.grid}>
            {[
              { icon: User,     label: "Contact Person", value: reg.contactName },
              { icon: Mail,     label: "Email",          value: reg.email       },
              { icon: Phone,    label: "Phone",          value: reg.phone       },
              { icon: Globe,    label: "Website",        value: reg.website     },
              { icon: MapPin,   label: "Address",        value: reg.address     },
              { icon: Briefcase,label: "Industry Type",  value: reg.industry    },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={ms.detailRow}>
                <div style={ms.detailIcon}><Icon size={15} color="#3A70B0" /></div>
                <div>
                  <div style={ms.detailLabel}>{label}</div>
                  <div style={ms.detailValue}>{value || "N/A"}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          {reg.description && reg.description !== "N/A" && (
            <div style={ms.descBox}>
              <div style={ms.detailLabel}>Company Description</div>
              <p style={ms.descText}>{reg.description}</p>
            </div>
          )}

          {/* Action Buttons */}
          {reg.status === "Pending" && (
            <div style={ms.actions}>
              <button
                style={{ ...ms.btn, ...ms.approveBtn }}
                onClick={() => onApprove(reg._id)}
                disabled={updating}
              >
                <CheckCircle size={16} />
                {updating ? "Processing..." : "Approve Registration"}
              </button>
              <button
                style={{ ...ms.btn, ...ms.rejectBtn }}
                onClick={() => onReject(reg._id)}
                disabled={updating}
              >
                <XCircle size={16} />
                Reject
              </button>
            </div>
          )}

          {reg.status === "Approved" && (
            <div style={ms.actions}>
              <button
                style={{ ...ms.btn, ...ms.whatsappBtn }}
                onClick={() => sendWhatsAppConfirmation(reg)}
                title="Open WhatsApp with a prefilled welcome message - just press Send"
              >
                <MessageCircle size={16} />
                Send WhatsApp Confirmation
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Modal Styles ─────────────────────────────────────────────────────────────
const ms = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#fff", borderRadius: "22px",
    width: "560px", maxWidth: "95vw", maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "24px 24px 14px",
    borderBottom: "1px solid #F1F5F9",
  },
  headerLeft:    { display: "flex", alignItems: "center", gap: "14px" },
  bigIcon:       { background: "#E2EEF9", borderRadius: "16px", padding: "14px", display: "flex" },
  companyTitle:  { fontSize: "1.25rem", fontWeight: "800", color: "#0F172A", margin: 0 },
  industryType:  { fontSize: "0.85rem", color: "#3A70B0", margin: "4px 0 0", fontWeight: "500" },
  closeBtn: {
    background: "#F8FAFC", border: "none", borderRadius: "10px",
    padding: "8px", cursor: "pointer", color: "#64748B", display: "flex",
  },
  statusBadge: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "5px 14px", borderRadius: "20px", fontSize: "0.8rem",
    fontWeight: "700", marginRight: "12px",
  },
  timestamp:     { fontSize: "0.78rem", color: "#94A3B8" },
  grid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "14px", padding: "16px 24px",
  },
  detailRow:     { display: "flex", gap: "10px", alignItems: "flex-start" },
  detailIcon:    { marginTop: "2px", flexShrink: 0 },
  detailLabel:   { fontSize: "0.72rem", color: "#94A3B8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" },
  detailValue:   { fontSize: "0.88rem", color: "#1E293B", fontWeight: "500", marginTop: "2px", wordBreak: "break-word" },
  descBox:       { margin: "0 24px 20px", padding: "16px", background: "#F8FAFC", borderRadius: "12px" },
  descText:      { fontSize: "0.87rem", color: "#475569", lineHeight: 1.65, margin: "8px 0 0" },
  actions:       { display: "flex", gap: "12px", padding: "16px 24px 24px" },
  btn: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    gap: "8px", padding: "12px", borderRadius: "12px", border: "none",
    fontWeight: "700", cursor: "pointer", fontSize: "0.9rem",
    fontFamily: "'Poppins', sans-serif", transition: "opacity 0.2s",
  },
  approveBtn:    { background: "#D1FAE5", color: "#065F46" },
  rejectBtn:     { background: "#FEE2E2", color: "#DC2626" },
  whatsappBtn:   { background: "#25D366", color: "#fff", boxShadow: "0 4px 14px rgba(37,211,102,0.35)" },
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function IndustryRegistrations() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [filter,        setFilter]        = useState("All");
  const [search,        setSearch]        = useState("");
  const [selected,      setSelected]      = useState(null);
  const [updating,      setUpdating]      = useState(false);

  useEffect(() => { fetchRegistrations(); }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/industry-registrations");
      setRegistrations(res.data.registrations || []);
    } catch (err) {
      setError("Failed to load registrations. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setUpdating(true);
      await axios.patch(`http://localhost:5000/api/industry-registrations/${id}/status`, {
        status: "Approved",
      });
      setRegistrations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "Approved" } : r))
      );
      if (selected?._id === id) setSelected((s) => ({ ...s, status: "Approved" }));
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setUpdating(true);
      await axios.patch(`http://localhost:5000/api/industry-registrations/${id}/status`, {
        status: "Rejected",
      });
      setRegistrations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "Rejected" } : r))
      );
      if (selected?._id === id) setSelected((s) => ({ ...s, status: "Rejected" }));
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  // Filter + Search
  const displayed = registrations.filter((r) => {
    const matchFilter = filter === "All" || r.status === filter;
    const matchSearch =
      r.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      r.contactName?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    All:      registrations.length,
    Pending:  registrations.filter((r) => r.status === "Pending").length,
    Approved: registrations.filter((r) => r.status === "Approved").length,
    Rejected: registrations.filter((r) => r.status === "Rejected").length,
  };

  return (
    <>
    <LiaisonNavbar />
    <div style={s.page}>
      {/* ── Header ── */}
      <motion.div
        style={s.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={s.headerLeft}>
          <div>
            <h1 style={s.title}>Industry Registration Requests</h1>
            <p style={s.subtitle}>Review and manage incoming industry registrations</p>
          </div>
        </div>
        <button style={s.refreshBtn} onClick={fetchRegistrations} disabled={loading}>
          <RefreshCw size={16} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          Refresh
        </button>
      </motion.div>

      {/* ── Stats Bar ── */}
      <motion.div
        style={s.statsRow}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { label: "Total",    value: counts.All,      color: "#193648", border: "#cfe0f0" },
          { label: "Pending",  value: counts.Pending,  color: "#3A70B0", border: "#cfe0f0" },
          { label: "Approved", value: counts.Approved, color: "#2C5F80", border: "#cfe0f0" },
          { label: "Rejected", value: counts.Rejected, color: "#7AA9D6", border: "#cfe0f0" },
        ].map((stat) => (
          <div key={stat.label} style={{
            ...s.statCard,
            background: "linear-gradient(180deg, #ffffff, #f8fbff)",
            border: `1px solid ${stat.border}`,
            boxShadow: "0 4px 14px rgba(25,54,72,0.06)",
          }}>
            <span aria-hidden style={{
              position: "absolute", top: 0, bottom: 0, left: 0, width: 4,
              background: `linear-gradient(180deg, ${stat.color}, ${stat.color}66)`,
              borderRadius: "10px 0 0 10px",
            }} />
            <span style={{ ...s.statNum, color: stat.color }}>{stat.value}</span>
            <span style={{ ...s.statLabel, color: "#193648" }}>{stat.label}</span>
          </div>
        ))}
      </motion.div>

      {/* ── Search + Filter ── */}
      <motion.div
        style={s.controlsRow}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Search */}
        <div style={s.searchWrap}>
          <Search size={16} color="#94A3B8" style={{ flexShrink: 0 }} />
          <input
            style={s.searchInput}
            placeholder="Search by company, contact or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div style={s.tabs}>
          {["All", "Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              style={{ ...s.tab, ...(filter === tab ? s.tabActive : {}) }}
              onClick={() => setFilter(tab)}
            >
              {tab}
              <span
                style={{
                  ...s.tabCount,
                  background: filter === tab ? "rgba(255,255,255,0.25)" : "#F1F5F9",
                  color: filter === tab ? "#fff" : "#64748B",
                }}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Content ── */}
      {loading && (
        <div style={s.center}>
          <div style={s.spinner} />
          <p style={{ color: "#94A3B8", marginTop: "16px" }}>Loading registrations...</p>
        </div>
      )}

      {error && !loading && (
        <div style={s.center}>
          <p style={{ color: "#DC2626", fontWeight: "600" }}>{error}</p>
          <button style={s.retryBtn} onClick={fetchRegistrations}>Try Again</button>
        </div>
      )}

      {!loading && !error && (
        <motion.div
          style={s.grid}
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {displayed.length === 0 ? (
            <div style={{ ...s.center, gridColumn: "1/-1" }}>
              <Building2 size={48} color="#E2E8F0" />
              <p style={{ color: "#94A3B8", marginTop: "12px" }}>No registrations found.</p>
            </div>
          ) : (
            displayed.map((reg) => {
              const SC = STATUS_CONFIG[reg.status] || STATUS_CONFIG.Pending;
              return (
                <motion.div
                  key={reg._id}
                  style={s.card}
                  variants={{
                    hidden:   { opacity: 0, y: 20 },
                    visible:  { opacity: 1, y: 0, transition: { duration: 0.35 } },
                  }}
                  whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.13)" }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Card Top */}
                  <div style={s.cardTop}>
                    <div style={s.cardIcon}>
                      <Building2 size={22} color="#193648" />
                    </div>
                    <span style={{ ...s.badge, background: SC.bg, color: SC.color }}>
                      <SC.icon size={12} />
                      {reg.status}
                    </span>
                  </div>

                  <h3 style={s.cardCompany}>{reg.companyName}</h3>
                  <p style={s.cardIndustry}>{reg.industry}</p>

                  <div style={s.cardInfo}>
                    <div style={s.infoRow}><User   size={13} color="#94A3B8" /><span>{reg.contactName}</span></div>
                    <div style={s.infoRow}><Mail   size={13} color="#94A3B8" /><span>{reg.email}</span></div>
                    <div style={s.infoRow}><Phone  size={13} color="#94A3B8" /><span>{reg.phone}</span></div>
                    <div style={s.infoRow}><MapPin size={13} color="#94A3B8" /><span style={{ fontSize: "0.8rem" }}>{reg.address}</span></div>
                  </div>

                  <div style={s.cardTime}>
                    <Calendar size={12} color="#CBD5E1" />
                    {reg.timestamp}
                  </div>

                  {/* Card Buttons */}
                  <div style={s.cardActions}>
                    <button style={s.viewBtn} onClick={() => setSelected(reg)}>
                      <Eye size={14} /> View Details
                    </button>
                    {reg.status === "Pending" && (
                      <>
                        <button style={s.approveSmBtn} onClick={() => handleApprove(reg._id)}>✓</button>
                        <button style={s.rejectSmBtn}  onClick={() => handleReject(reg._id)}>✗</button>
                      </>
                    )}
                    {reg.status === "Approved" && (
                      <button
                        style={s.whatsappSmBtn}
                        onClick={() => sendWhatsAppConfirmation(reg)}
                        title="Send WhatsApp confirmation"
                      >
                        <MessageCircle size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      )}

      {/* ── Detail Modal ── */}
      {selected && (
        <DetailModal
          reg={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          updating={updating}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
    <LiaisonFooter />
    </>
  );
}

// ─── Page Styles ──────────────────────────────────────────────────────────────
const s = {
  page: {
    padding: "30px 50px",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #E2EEF9 0%, #FFFFFF 100%)",
    minHeight: "100vh",
  },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: "24px",
  },
  headerLeft:  { display: "flex", alignItems: "center", gap: "16px" },
  backBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    background: "#193648", color: "#fff", border: "none",
    borderRadius: "10px", padding: "9px 18px", cursor: "pointer",
    fontFamily: "'Poppins', sans-serif", fontWeight: "600", fontSize: "0.85rem",
    flexShrink: 0,
  },
  title:    { fontSize: "1.7rem", fontWeight: "800", color: "#193648", margin: 0 },
  subtitle: { fontSize: "0.88rem", color: "#3A70B0", margin: "4px 0 0" },
  refreshBtn: {
    display: "flex", alignItems: "center", gap: "7px",
    background: "#fff", border: "1.5px solid #E2E8F0",
    borderRadius: "10px", padding: "9px 18px", cursor: "pointer",
    fontFamily: "'Poppins', sans-serif", fontWeight: "600",
    color: "#64748B", fontSize: "0.85rem",
  },
  statsRow: {
    display: "flex", gap: "14px", marginBottom: "24px",
  },
  statCard: {
    position: "relative",
    flex: 1, borderRadius: "14px", padding: "16px 20px 16px 24px",
    display: "flex", flexDirection: "column", gap: "4px",
    overflow: "hidden",
  },
  statNum:   { fontSize: "1.8rem", fontWeight: "800" },
  statLabel: { fontSize: "0.78rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" },
  controlsRow: {
    display: "flex", gap: "14px", marginBottom: "28px",
    flexWrap: "wrap", alignItems: "center",
  },
  searchWrap: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "#fff", border: "1.5px solid #E2E8F0",
    borderRadius: "12px", padding: "10px 16px", flex: 1, minWidth: "240px",
  },
  searchInput: {
    border: "none", outline: "none", flex: 1,
    fontFamily: "'Poppins', sans-serif", fontSize: "0.88rem", color: "#1E293B",
    background: "transparent",
  },
  tabs: { display: "flex", gap: "8px", flexWrap: "wrap" },
  tab: {
    display: "flex", alignItems: "center", gap: "7px",
    padding: "9px 16px", borderRadius: "10px",
    border: "1.5px solid #E2E8F0", background: "#fff",
    cursor: "pointer", fontWeight: "600", color: "#64748B",
    fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem",
    transition: "all 0.2s",
  },
  tabActive:  { background: "#193648", color: "#fff", border: "1.5px solid #193648" },
  tabCount: {
    padding: "2px 8px", borderRadius: "20px",
    fontSize: "0.72rem", fontWeight: "700",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff", borderRadius: "18px", padding: "22px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
    border: "1px solid #F1F5F9", cursor: "pointer",
    transition: "all 0.25s",
  },
  cardTop: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "14px",
  },
  cardIcon: {
    background: "#E2EEF9", borderRadius: "12px",
    padding: "10px", display: "flex",
  },
  badge: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "4px 12px", borderRadius: "20px",
    fontSize: "0.75rem", fontWeight: "700",
  },
  cardCompany:  { fontSize: "1.05rem", fontWeight: "700", color: "#193648", margin: "0 0 3px" },
  cardIndustry: { fontSize: "0.82rem", color: "#3A70B0", fontWeight: "500", marginBottom: "14px" },
  cardInfo:     { display: "flex", flexDirection: "column", gap: "7px", marginBottom: "14px" },
  infoRow: {
    display: "flex", gap: "8px", alignItems: "center",
    fontSize: "0.82rem", color: "#475569",
  },
  cardTime: {
    display: "flex", alignItems: "center", gap: "5px",
    fontSize: "0.73rem", color: "#CBD5E1", marginBottom: "14px",
  },
  cardActions:  { display: "flex", gap: "8px" },
  viewBtn: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    gap: "6px", padding: "9px", background: "#EFF6FF",
    color: "#1D4ED8", border: "none", borderRadius: "10px",
    fontWeight: "600", cursor: "pointer", fontSize: "0.82rem",
    fontFamily: "'Poppins', sans-serif",
  },
  approveSmBtn: {
    width: "38px", height: "38px", background: "#D1FAE5", color: "#065F46",
    border: "none", borderRadius: "10px", fontWeight: "800",
    cursor: "pointer", fontSize: "1rem", display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  rejectSmBtn: {
    width: "38px", height: "38px", background: "#FEE2E2", color: "#DC2626",
    border: "none", borderRadius: "10px", fontWeight: "800",
    cursor: "pointer", fontSize: "1rem", display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  whatsappSmBtn: {
    width: "38px", height: "38px", background: "#25D366", color: "#fff",
    border: "none", borderRadius: "10px",
    cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 12px rgba(37,211,102,0.3)",
  },
  center: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "60px 0", textAlign: "center",
  },
  spinner: {
    width: "40px", height: "40px",
    border: "4px solid #E2E8F0",
    borderTop: "4px solid #193648",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  retryBtn: {
    marginTop: "14px", background: "#193648", color: "#fff",
    border: "none", borderRadius: "10px", padding: "10px 24px",
    cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: "600",
  },
};