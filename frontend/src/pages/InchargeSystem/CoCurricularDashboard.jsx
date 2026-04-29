// CoCurricularDashboard.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Calendar, FileText, Plus, Edit, Trash2,
  CheckCircle, AlertCircle, Clock, User, LogOut, Bell,
  Download, Mail, TrendingUp, BarChart3, Target, Users,
  Image, Paperclip, Send, Settings, Key, X, Camera,
  FileText as FilePdf,
  ChevronLeft, RefreshCw, Briefcase, Zap, Search,
  ArrowRight, Sparkles, MapPin, ClipboardCheck, Award,
  Building2, GraduationCap,
} from "lucide-react";
import collaxionLogo from "../../images/collaxionlogo.jpeg";
import cocuAvatar from "../../images/cocu.jpeg";
import eventImg1 from "../../images/event1.png";
import eventImg2 from "../../images/event2.jpg";
import eventImg3 from "../../images/event3.jpg";
import eventImg4 from "../../images/event4.jpg";
import eventImg5 from "../../images/event5.jpg";

// Default cover images mapped by category - falls back to a hash of the id otherwise.
const EVENT_IMAGES = [eventImg1, eventImg2, eventImg3, eventImg4, eventImg5];
const CATEGORY_IMAGE = {
  Technical:   eventImg1,
  Workshop:    eventImg2,
  Cultural:    eventImg3,
  Sports:      eventImg4,
  Seminar:     eventImg5,
  Competition: eventImg1,
};
const pickEventCover = (ev) => {
  if (ev?.poster) return ev.poster;
  if (ev?.category && CATEGORY_IMAGE[ev.category]) return CATEGORY_IMAGE[ev.category];
  const id = String(ev?._id || "");
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return EVENT_IMAGES[h % EVENT_IMAGES.length];
};
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ─── SHARED VISUAL HELPERS (ported from Internship dashboard) ──────────────
function StatCard({ label, value, icon: Icon, color, sub, delay = 0 }) {
  // Compact long values like "PKR 1,30,000" so they don't crowd the card.
  const stringValue = String(value ?? "");
  const valueSize   = stringValue.length > 12 ? 22
                    : stringValue.length > 9  ? 26
                    : 30;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      style={{
        position: "relative",
        background: "#fff",
        border: "1px solid #E2EEF9",
        borderRadius: 18,
        padding: "20px 22px",
        display: "flex",
        gap: 18,
        alignItems: "center",
        boxShadow: "0 4px 18px rgba(25,54,72,0.06), 0 1px 2px rgba(25,54,72,0.04)",
        overflow: "hidden",
        transition: "box-shadow 0.25s ease, border-color 0.25s ease",
        minWidth: 0,
      }}
    >
      {/* Top accent bar */}
      <span aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${color}88, ${color}, ${color}88)`,
        opacity: 0.85,
      }} />
      {/* Soft corner glow */}
      <span aria-hidden style={{
        position: "absolute", top: -40, right: -40,
        width: 130, height: 130, borderRadius: "50%",
        background: `radial-gradient(circle, ${color}1A 0%, ${color}00 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{
        width: 52, height: 52,
        borderRadius: 14,
        background: `linear-gradient(135deg, ${color}1F, ${color}10)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        border: `1px solid ${color}22`,
      }}>
        <Icon size={22} color={color} />
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{
          fontSize: 11,
          color: "#7B8794",
          fontWeight: 700,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {label}
        </div>
        <div
          title={stringValue}
          style={{
            fontSize: valueSize,
            fontWeight: 800,
            color: "#0F2A38",
            lineHeight: 1.1,
            letterSpacing: "-0.015em",
            fontFamily: "'Sora', 'Inter', sans-serif",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </div>
        {sub && (
          <div style={{
            fontSize: 11.5,
            color: "#94a3b8",
            fontWeight: 500,
            lineHeight: 1.35,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {sub}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  const palette    = { success: "#15803d", error: "#be123c", info: "#193648", warn: "#b45309" };
  const bgPalette  = { success: "#f0fdf4", error: "#fff1f2", info: "#E2EEF9", warn: "#fffbeb" };
  const brdPalette = { success: "#bbf7d0", error: "#fecdd3", info: "#CFE0F0", warn: "#fde68a" };
  return (
    <motion.div initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 16, x: "-50%" }}
      style={{
        position: "fixed", bottom: 28, left: "50%", zIndex: 9999,
        background: bgPalette[type] || "#fff", border: `1px solid ${brdPalette[type] || "#e2e8f0"}`,
        borderRadius: 12, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)", minWidth: 280, maxWidth: 420,
      }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: palette[type] || "#64748b", flexShrink: 0 }} />
      <span style={{ color: "#0f172a", fontSize: 13.5, fontWeight: 500, flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
        <X size={14} color="#94a3b8" />
      </button>
    </motion.div>
  );
}

// ── Autocomplete input with suggestion dropdown ─────────────────────────────
// `suggestions` = array of strings (plain mode)
// `people`      = array of { name, email, role? } - when supplied, the dropdown
//                 renders rich two-line rows and onPick gets the full object so
//                 callers can fill multiple fields at once.
function AutocompleteInput({
  value, onChange, suggestions = [], people, placeholder, icon: Icon, type = "text", onPick,
}) {
  const isPeople = Array.isArray(people) && people.length > 0;
  const [open, setOpen] = useState(false);
  const [hi, setHi]     = useState(-1);
  const wrapRef         = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const v = (value || "").trim().toLowerCase();
    if (isPeople) {
      const seen = new Set();
      const matches = people.filter((p) => {
        if (!p) return false;
        const key = `${p.name || ""}|${p.email || ""}`;
        if (seen.has(key)) return false;
        seen.add(key);
        if (!v) return true;
        return (p.name || "").toLowerCase().includes(v) ||
               (p.email || "").toLowerCase().includes(v) ||
               (p.role  || "").toLowerCase().includes(v);
      });
      return matches.slice(0, 8);
    }
    const uniq = [...new Set((suggestions || []).filter(Boolean).map(String))];
    if (!v) return uniq.slice(0, 6);
    return uniq
      .filter((s) => s.toLowerCase().includes(v) && s.toLowerCase() !== v)
      .slice(0, 6);
  }, [value, suggestions, people, isPeople]);

  const pick = (item) => {
    if (isPeople) {
      onChange(item.name || "");
      onPick && onPick(item);
    } else {
      onChange(item);
      onPick && onPick(item);
    }
    setOpen(false);
    setHi(-1);
  };

  const onKey = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown")      { e.preventDefault(); setHi((p) => Math.min(p + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp")   { e.preventDefault(); setHi((p) => Math.max(p - 1, 0)); }
    else if (e.key === "Enter" && hi >= 0) { e.preventDefault(); pick(filtered[hi]); }
    else if (e.key === "Escape")    setOpen(false);
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
      <div style={{ position: "relative" }}>
        {Icon && (
          <Icon size={14} color="#94a3b8"
            style={{ position: "absolute", top: 12, left: 12, pointerEvents: "none" }} />
        )}
        <input
          type={type}
          value={value || ""}
          onChange={(e) => { onChange(e.target.value); setOpen(true); setHi(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: Icon ? "11px 12px 11px 36px" : "11px 12px",
            borderRadius: 10,
            border: "1px solid #E2EEF9",
            outline: "none",
            fontSize: 13.5,
            color: "#0f172a",
            background: "#fff",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            boxSizing: "border-box",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#CFE0F0")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E2EEF9")}
        />
      </div>
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              position: "absolute", top: 48, left: 0, right: 0,
              background: "#fff", border: "1px solid #E2EEF9", borderRadius: 12,
              boxShadow: "0 24px 48px rgba(15,23,42,0.18), 0 4px 12px rgba(15,23,42,0.06)",
              zIndex: 1000,
              maxHeight: 320, overflowY: "auto", padding: 6,
            }}
          >
            <div style={{
              fontSize: 9.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#94a3b8", padding: "4px 10px 6px",
            }}>
              {isPeople ? "Pick a person - email auto-fills" : "Suggestions"}
            </div>
            {filtered.map((s, i) => {
              const active = hi === i;
              if (isPeople) {
                return (
                  <div
                    key={`${s.name}-${s.email}`}
                    onMouseDown={(e) => { e.preventDefault(); pick(s); }}
                    onMouseEnter={() => setHi(i)}
                    style={{
                      padding: "9px 10px", borderRadius: 9, cursor: "pointer",
                      background: active ? "#E2EEF9" : "transparent",
                      display: "flex", alignItems: "center", gap: 10,
                      transition: "background 0.12s ease",
                    }}
                  >
                    <span style={{
                      width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                      background: "linear-gradient(135deg, #193648, #3A70B0)",
                      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: 11, letterSpacing: "0.04em",
                      boxShadow: "0 4px 8px rgba(25,54,72,0.18)",
                    }}>
                      {(s.name || "?").replace(/^(Ms\.?|Mr\.?|Mrs\.?|Dr\.?|Prof\.?)\s+/i, "")
                        .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                    </span>
                    <span style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>
                        {s.email}
                      </div>
                    </span>
                    {s.role && (
                      <span style={{
                        fontSize: 9.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                        color: "#3A70B0", background: "#f0f7ff",
                        padding: "3px 7px", borderRadius: 999,
                        border: "1px solid #cfe0f0",
                        flexShrink: 0,
                      }}>
                        {s.role}
                      </span>
                    )}
                  </div>
                );
              }
              return (
                <div
                  key={s}
                  onMouseDown={(e) => { e.preventDefault(); pick(s); }}
                  onMouseEnter={() => setHi(i)}
                  style={{
                    padding: "8px 10px", borderRadius: 8, fontSize: 13,
                    color: "#0f172a", cursor: "pointer",
                    background: active ? "#E2EEF9" : "transparent",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <Sparkles size={12} color="#3A70B0" />
                  {s}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Form field wrapper (label + input/AutocompleteInput) ─────────────────────
function FieldLabel({ children, required }) {
  return (
    <label style={{
      display: "block",
      fontSize: 11.5, fontWeight: 700, letterSpacing: "0.05em",
      textTransform: "uppercase", color: "#64748b",
      marginBottom: 6,
    }}>
      {children}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </label>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div style={{
      background: "#fff", border: "1px dashed #e2e8f0", borderRadius: 18,
      padding: "60px 30px", textAlign: "center",
    }}>
      <div style={{
        width: 64, height: 64, margin: "0 auto 16px", borderRadius: 16,
        background: "#f4f7fb", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={28} color="#94a3b8" />
      </div>
      <div style={{ color: "#64748b", fontSize: 14, fontWeight: 600 }}>{text}</div>
    </div>
  );
}

export default function CoCurricularDashboard() {
  // THEME
  const theme = {
    dark: "#193648",
    primary: "#E2EEF9",
    light: "#dfe8fe",
    nearWhite: "#fcfdff",
    accentText: "#193648",
    mediumBlue: "#4a6fa5",
    softBlue: "#7fa3c9"
  };

  // API Configuration
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const COCURRICULAR_API = `${API_BASE}/cocurricular`;

  // Refs for export
  const dashboardRef = useRef(null);
  const exportMenuRef = useRef(null);

  // Export state
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Add Task Form State
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    assignedTo: "",
    assignedToEmail: "",
    deadline: "",
    description: ""
  });

  // NAV & UI STATE
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  // DATA
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Task Edit State
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskEditModal, setShowTaskEditModal] = useState(false);
  const [editTaskForm, setEditTaskForm] = useState({
    title: "",
    assignedTo: "",
    assignedToEmail: "",
    deadline: "",
    status: "",
    progress: 0,
    description: ""
  });

  // Event Form state
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    venue: "",
    expected: "",
    category: "Technical",
    coordinator: "",
    email: "",
    budget: "",
    description: "",
    posterFile: null,
    posterPreview: null,
  });
  const posterRef = useRef(null);

  // Three approved test inboxes - every recipient's email (faculty + industry)
  // is routed to one of these three so every invitation actually lands somewhere
  // we can verify. Sabahat's inbox is intentionally first (index 0).
  const TEST_INBOXES = [
    "sabahatqadeerbhati@gmail.com",
    "amnajamil871@gmail.com",
    "mahamhaleem3@gmail.com",
  ];
  const pickTestInbox = (i) => TEST_INBOXES[i % TEST_INBOXES.length];

  // Faculty members of FoC (mock - add/remove as the directory grows).
  // These appear in the Invitations → "Faculty Members" tab.
  // NOTE: the Co-Curricular Incharge herself is intentionally NOT in this list -
  // she is the sender, so it makes no sense for her to receive her own invitation.
  // Every email is routed through TEST_INBOXES so all invitations land in the
  // approved mailboxes only.
  const FACULTY_MEMBERS = useMemo(() => {
    // Curated Pexels stock photos - hijabi women & Muslim men, professional framing.
    const PEXEL = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`;
    const rows = [
      { id: "f-shumaila-qayoom", name: "Ms. Shumaila Qayoom", role: "Lecturer · FoC",        photo: PEXEL(4348404) },
      { id: "f-shumaila-iqbal",  name: "Ms. Shumaila Iqbal",  role: "Lecturer · FoC",        photo: PEXEL(4348401) },
      { id: "f-habiba",          name: "Ms. Habiba",          role: "Lecturer · FoC",        photo: PEXEL(3776932) },
      { id: "f-sabahat",            name: "Ms. Sabahat Qadeer",      role: "FYP Coordinator",       photo: PEXEL(3768916) },
      { id: "f-maham",           name: "Ms. Maham Haleem",    role: "Lecturer · FoC",        photo: PEXEL(4046718) },
      { id: "f-fatima",          name: "Ms. Fatima Naveed",   role: "Lecturer · FoC",        photo: PEXEL(3760529) },
      { id: "f-zainab",          name: "Ms. Zainab Raza",     role: "Lecturer · FoC",        photo: PEXEL(4622414) },
      { id: "f-Amna Jamil",          name: "Ms. Amna jamil",     role: "Lab Engineer · FoC",    photo: PEXEL(3764119) },
      { id: "f-hassan",          name: "Mr. Hassan Iqbal",    role: "Senior Lecturer · FoC", photo: PEXEL(2698935) },
      { id: "f-usman",           name: "Mr. Usman Niazi",     role: "Lecturer · FoC",        photo: PEXEL(3812944) },
    ];
    return rows.map((r, i) => ({
      ...r,
      email: pickTestInbox(i),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Industry partners - mock list of registered companies with representatives.
  const MOCK_INDUSTRY_PARTNERS = useMemo(() => {
    // Curated Pexels stock photos - Muslim men in suits and hijabi women in business attire.
    const PEXEL = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`;
    const rows = [
      { id: "i-systems",     name: "Systems Limited",      rep: "Mr. Asad Khan",       sector: "IT Services",      photo: PEXEL(2379004) },
      { id: "i-10pearls",    name: "10Pearls",             rep: "Mr. Bilal Khan",      sector: "Software House",   photo: PEXEL(2379005) },
      { id: "i-netsol",      name: "NETSOL Technologies",  rep: "Ms. Hina Tariq",      sector: "Tech & FinTech",   photo: PEXEL(3768912) },
      { id: "i-techlogix",   name: "Techlogix",            rep: "Mr. Imran Yousuf",    sector: "IT Consulting",    photo: PEXEL(2531553) },
      { id: "i-confiz",      name: "Confiz",               rep: "Mr. Faisal Sattar",   sector: "Software House",   photo: PEXEL(3779662) },
      { id: "i-tpl",         name: "TPL Trakker",          rep: "Ms. Sana Bilal",      sector: "IoT & Telematics", photo: PEXEL(4348791) },
      { id: "i-venturedive", name: "VentureDive",          rep: "Mr. Saad Hamid",      sector: "Tech Studio",      photo: PEXEL(614810)  },
      { id: "i-folio3",      name: "Folio3",               rep: "Mr. Adnan Lawai",     sector: "Software House",   photo: PEXEL(2598024) },
      { id: "i-arbisoft",    name: "Arbisoft",             rep: "Ms. Sara Hashmi",     sector: "Software House",   photo: PEXEL(4348402) },
      { id: "i-i2c",         name: "i2c Inc.",             rep: "Mr. Ahmed Raza",      sector: "FinTech",          photo: PEXEL(3777931) },
      { id: "i-jazz",        name: "Jazz / VEON",          rep: "Mr. Hamza Iqbal",     sector: "Telecom",          photo: PEXEL(2589653) },
      { id: "i-telenor",     name: "Telenor Pakistan",     rep: "Ms. Komal Shahid",    sector: "Telecom",          photo: PEXEL(3760854) },
    ];
    return rows.map((r, i) => ({
      ...r,
      email: pickTestInbox(i),
    }));
  }, []);
  const [industryPartners, setIndustryPartners] = useState(
    MOCK_INDUSTRY_PARTNERS.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: `${p.sector} · ${p.rep}`,
      photo: p.photo,
    }))
  );

  // Selection set is shared across both tabs (Map keyed by recipient id so picks survive tab switches).
  // We deliberately do NOT key by email - multiple recipients can legitimately share the same
  // TEST_INBOX, and keying by email would make them all toggle as one.
  const [recipientPicks, setRecipientPicks] = useState(() => new Map());

  // Active tab in Invitations: "industry" | "faculty"
  const [recipientTab, setRecipientTab] = useState("industry");

  // Backwards-compat: legacy code references `recipients` / `setRecipients`. Keep them as
  // an alias of the combined list so nothing else breaks.
  const recipients = useMemo(() => {
    const all = [
      ...industryPartners.map((p) => ({ ...p, type: "industry" })),
      ...FACULTY_MEMBERS.map((p) => ({ ...p, type: "faculty" })),
    ];
    return all.map((r) => ({ ...r, selected: recipientPicks.has(r.id) }));
  }, [industryPartners, FACULTY_MEMBERS, recipientPicks]);

  const setRecipients = (updater) => {
    // Translate a "selected"-style update on recipients into an update of recipientPicks.
    const next = typeof updater === "function" ? updater(recipients) : updater;
    setRecipientPicks((prev) => {
      const map = new Map(prev);
      next.forEach((r) => {
        if (r.selected) map.set(r.id, { id: r.id, name: r.name, email: r.email, type: r.type });
        else            map.delete(r.id);
      });
      return map;
    });
  };
  const [inviteMsg, setInviteMsg] = useState("");

  // Chart tooltip state
  const [chartTooltip, setChartTooltip] = useState(null);

  // Profile - backend-backed; any local change is also persisted.
  const [profile, setProfile] = useState({
    name:  "Dr. Habiba Ahmed",
    email: "habiba.ahmed@riphah.edu.pk",
    role:  "Co-Curricular Incharge",
    dp:    "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const dpInputRef = useRef(null);
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [pwdForm, setPwdForm] = useState({ oldPwd: "", newPwd: "", confirm: "" });

  // Manage Events filter & loading
  const [manageFilter, setManageFilter] = useState("all");
  const [eventsLoading, setEventsLoading] = useState(true);
  // Responsibilities tab filter (Total / Pending / Completed / Overdue)
  const [taskFilter, setTaskFilter] = useState("all");
  // Invitations search & selection
  const [inviteSearch, setInviteSearch]   = useState("");
  const [inviteEvent, setInviteEvent]     = useState("");

  // Real-time notifications
  const [toasts, setToasts] = useState([]);
  const [notifPing, setNotifPing] = useState(false);
  const notifBaselineRef = useRef({ ready: false, ids: new Set() });
  const addToast = (message, type = "info") =>
    setToasts((p) => [...p, { id: Date.now() + Math.random(), message, type }]);

  // ========== EXPORT FUNCTIONS ==========
  const handleExportClick = () => {
    setShowExportMenu(!showExportMenu);
  };

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Export as PNG
  const exportAsPNG = async () => {
    if (!dashboardRef.current) return;
    
    setIsExporting(true);
    setShowExportMenu(false);
    
    try {
      // Temporarily remove tooltip if visible
      if (chartTooltip) setChartTooltip(null);
      
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: theme.light,
        logging: false,
        allowTaint: false,
        useCORS: true
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `cocurricular-dashboard-${new Date().toISOString().slice(0,10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      alert('Dashboard exported as PNG successfully!');
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Failed to export as PNG. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export as PDF
  const exportAsPDF = async () => {
    if (!dashboardRef.current) return;
    
    setIsExporting(true);
    setShowExportMenu(false);
    
    try {
      // Temporarily remove tooltip if visible
      if (chartTooltip) setChartTooltip(null);
      
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: theme.light,
        logging: false,
        allowTaint: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`cocurricular-dashboard-${new Date().toISOString().slice(0,10)}.pdf`);
      
      alert('Dashboard exported as PDF successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export as PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // ========== FETCH DATA FROM API ==========
  useEffect(() => {
    fetchAllData();
    fetchProfile();
  }, []);

  // ========== PROFILE - backend-backed ==========
  const fetchProfile = async () => {
    try {
      const r = await fetch(`${COCURRICULAR_API}/profile`);
      if (!r.ok) return;
      let data = await r.json();
      // One-time migration: replace the old "Prof. Habiba Ahmed" default with
      // "Dr. Habiba Ahmed" so existing seeded documents pick up the rename.
      if (data?.name === "Prof. Habiba Ahmed") {
        try {
          const m = await fetch(`${COCURRICULAR_API}/profile`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Dr. Habiba Ahmed" }),
          });
          if (m.ok) data = await m.json();
        } catch (_) { /* fall through to whatever loaded */ }
      }
      if (data && typeof data === "object") {
        setProfile((prev) => ({
          ...prev,
          ...(data.name  ? { name:  data.name }  : {}),
          ...(data.email ? { email: data.email } : {}),
          ...(data.role  ? { role:  data.role }  : {}),
          ...(data.dp    ? { dp:    data.dp }    : {}),
        }));
      }
    } catch (e) { /* silent - fallback to default */ }
  };

  const saveProfile = async (patch) => {
    setProfileSaving(true);
    try {
      const r = await fetch(`${COCURRICULAR_API}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!r.ok) {
        const txt = await r.text().catch(() => "");
        addToast(`Failed to save profile${txt ? `: ${txt.slice(0, 80)}` : ""}`, "error");
        return null;
      }
      const saved = await r.json();
      setProfile((prev) => ({ ...prev, ...saved }));
      return saved;
    } catch (e) {
      addToast("Network error while saving profile", "error");
      return null;
    } finally {
      setProfileSaving(false);
    }
  };

  const handleDpChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { addToast("Please pick an image file", "warn"); return; }
    if (file.size > 6 * 1024 * 1024)     { addToast("Image too large (max 6MB)", "warn"); return; }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result;
      if (typeof dataUrl !== "string") return;
      // Optimistic UI
      setProfile((prev) => ({ ...prev, dp: dataUrl }));
      const saved = await saveProfile({ dp: dataUrl });
      if (saved) addToast("Profile photo updated", "success");
    };
    reader.readAsDataURL(file);
  };

  // ========== REAL-TIME NOTIFICATIONS (poll every 15s) ==========
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const token = localStorage.getItem("coCurricularToken");
        const r = await fetch(`${COCURRICULAR_API}/notifications`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!r.ok || cancelled) return;
        const list = await r.json();
        if (!Array.isArray(list)) return;

        const baseline = notifBaselineRef.current;
        const ids = new Set(list.map((n) => String(n._id)));

        if (!baseline.ready) {
          baseline.ids = ids;
          baseline.ready = true;
        } else {
          // detect new notifications since last poll
          const fresh = list.filter((n) => !baseline.ids.has(String(n._id)));
          if (fresh.length) {
            fresh.slice(0, 3).forEach((n) => {
              const label = n.title || n.text || "New activity";
              addToast(`🔔 ${label}`, "info");
            });
            setNotifPing(true);
            setTimeout(() => setNotifPing(false), 3000);
          }
          baseline.ids = ids;
        }
        if (!cancelled) setNotifications(list);
      } catch (_) {/* swallow polling errors */}
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => { cancelled = true; clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // also re-poll events & tasks on a slower cadence (60s) so dashboard stays fresh
  useEffect(() => {
    const id = setInterval(() => { fetchEvents(); fetchTasks(); }, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========== INDUSTRY PARTNERS - currently mock-only ==========================
  // We deliberately don't fetch /api/industry-registrations here so the DB doesn't
  // override the curated mock list (each rep's email is routed to TEST_INBOX so
  // every invitation lands in the same test mailbox).

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchEvents(),
        fetchTasks(),
        fetchNotifications()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("coCurricularToken");
      const response = await fetch(`${COCURRICULAR_API}/events`, {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("coCurricularToken");
      const response = await fetch(`${COCURRICULAR_API}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("coCurricularToken");
      const response = await fetch(`${COCURRICULAR_API}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // ========== TASK HANDLERS ==========
  const handleAddTask = async () => {
    if (!newTaskForm.title || !newTaskForm.assignedTo || !newTaskForm.deadline) {
        alert("Please fill all required fields");
        return;
    }

    const token = localStorage.getItem("coCurricularToken");
   
    try {
        const response = await fetch(`${COCURRICULAR_API}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: newTaskForm.title,
                assignedTo: newTaskForm.assignedTo,
                assignedToEmail: newTaskForm.assignedToEmail,
                deadline: newTaskForm.deadline,
                status: "Pending",
                progress: 0,
                description: newTaskForm.description
            })
        });

        if (response.ok) {
            const newTask = await response.json();
            setTasks([newTask, ...tasks]);
            setShowAddTaskForm(false);
            setNewTaskForm({
                title: "",
                assignedTo: "",
                assignedToEmail: "",
                deadline: "",
                description: ""
            });
            fetchNotifications();
            alert("Task added successfully!");
        } else {
            alert("Failed to add task");
        }
    } catch (error) {
        console.error("Error adding task:", error);
        alert("Error adding task");
    }
  };

  const markTaskDone = async (id) => {
    const token = localStorage.getItem("coCurricularToken");
    try {
      const response = await fetch(`${COCURRICULAR_API}/tasks/${id}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
     
      if (response.ok) {
        const completedTask = await response.json();
        setTasks(tasks.map(t => t._id === completedTask._id ? completedTask : t));
        fetchNotifications();
        alert("Task marked as completed!");
      } else {
        alert("Failed to complete task");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Error completing task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
   
    const token = localStorage.getItem("coCurricularToken");
    try {
      const response = await fetch(`${COCURRICULAR_API}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
     
      if (response.ok) {
        setTasks(tasks.filter(t => t._id !== id));
        fetchNotifications();
        alert("Task deleted successfully");
      } else {
        alert("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditTaskForm({
      title: task.title || "",
      assignedTo: task.assignedTo || "",
      assignedToEmail: task.assignedToEmail || "",
      deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0,10) : "",
      status: task.status || "Pending",
      progress: task.progress || 0,
      description: task.description || ""
    });
    setShowTaskEditModal(true);
  };

  const handleUpdateTask = async () => {
    if (!editTaskForm.title || !editTaskForm.assignedTo || !editTaskForm.deadline) {
      alert("Please fill required fields");
      return;
    }

    const token = localStorage.getItem("coCurricularToken");
   
    try {
      const response = await fetch(`${COCURRICULAR_API}/tasks/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editTaskForm)
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
        setShowTaskEditModal(false);
        setEditingTask(null);
        fetchNotifications();
        alert("Task updated successfully!");
      } else {
        alert("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error updating task");
    }
  };

  const sendTaskReminder = async (task) => {
    if (!task?._id) return;
    // Route to a test inbox if the task has no recipient (or the saved one is a non-deliverable
    // demo email like @riphah.edu.pk).
    const looksDeliverable = task.assignedToEmail && /@(gmail|outlook|yahoo|hotmail)\./i.test(task.assignedToEmail);
    const recipientEmail = looksDeliverable ? task.assignedToEmail : pickTestInbox(0);

    addToast(`📨 Sending reminder to ${task.assignedTo || "assignee"}…`, "info");
    try {
      const token = localStorage.getItem("coCurricularToken");
      const r = await fetch(`${COCURRICULAR_API}/tasks/${task._id}/remind`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ recipientEmail }),
      });
      if (r.ok) {
        const data = await r.json().catch(() => ({}));
        addToast(`✅ Reminder emailed to ${data.to || recipientEmail}`, "success");
        fetchNotifications();
      } else {
        const text = await r.text().catch(() => "");
        addToast(`Reminder failed${text ? `: ${text.slice(0, 80)}` : ""}`, "error");
      }
    } catch (e) {
      console.error("Reminder error:", e);
      addToast("Network error while sending reminder", "error");
    }
  };

  // ========== EVENT HANDLERS ==========
  const handleCreateOrUpdateEvent = async () => {
    if (!newEvent.name || !newEvent.date || !newEvent.venue || !newEvent.expected || !newEvent.coordinator) {
      addToast("Please fill the required fields", "warn");
      return;
    }

    const token = localStorage.getItem("coCurricularToken");
    const ev = {
      name: newEvent.name,
      date: newEvent.date,
      venue: newEvent.venue,
      expected: parseInt(newEvent.expected || "0", 10),
      // new events start with 0 registered - no random count anymore
      registered: editingEvent ? (editingEvent.registered || 0) : 0,
      category: newEvent.category,
      coordinator: newEvent.coordinator,
      coordinatorEmail: newEvent.email,
      budget: parseFloat(newEvent.budget) || 0,
      description: newEvent.description,
      poster: newEvent.posterPreview || null,
      status: editingEvent?.status || "upcoming",
    };

    try {
      let response;
      if (editingEvent) {
        response = await fetch(`${COCURRICULAR_API}/events/${editingEvent._id}`, {
          method: "PUT",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(ev),
        });
      } else {
        response = await fetch(`${COCURRICULAR_API}/events`, {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(ev),
        });
      }

      if (response.ok) {
        const savedEvent = await response.json();
        // 1) optimistic local update so UI reflects immediately
        if (editingEvent) {
          setEvents((prev) => prev.map((e) => e._id === savedEvent._id ? savedEvent : e));
          addToast(`Event updated: ${savedEvent.name}`, "success");
        } else {
          setEvents((prev) => [savedEvent, ...prev]);
          addToast(`Event created: ${savedEvent.name}`, "success");
        }
        resetEventForm();
        setActiveSection("manage");
        // 2) re-sync from server so a hard refresh next time also shows the row
        //    (fixes the 'event disappears for a few seconds after refresh' glitch)
        fetchEvents();
        fetchNotifications();
      } else {
        const text = await response.text().catch(() => "");
        addToast(`Failed to save event${text ? `: ${text.slice(0, 80)}` : ""}`, "error");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      addToast("Network error while saving event", "error");
    }
  };

  const resetEventForm = () => {
    setNewEvent({
      name: "", date: "", venue: "", expected: "", category: "Technical",
      coordinator: "", email: "", budget: "", description: "",
      posterFile: null, posterPreview: null
    });
    setEditingEvent(null);
    setShowEventForm(false);
  };

  const handleEditEvent = (e) => {
    setEditingEvent(e);
    setNewEvent({
      ...e,
      expected: e.expected?.toString() || "",
      budget: e.budget?.toString() || "",
      email: e.coordinatorEmail || "",
      posterFile: null,
      posterPreview: e.poster || null
    });
    setShowEventForm(true);
    setActiveSection("create");
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete event?")) return;
   
    const token = localStorage.getItem("coCurricularToken");
    try {
      const response = await fetch(`${COCURRICULAR_API}/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
     
      if (response.ok) {
        setEvents(events.filter(e => e._id !== id));
        fetchNotifications();
        alert("Event deleted");
      } else {
        alert("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event");
    }
  };

  // ========== NOTIFICATION HANDLERS ==========
  const markNotificationSeen = async (id) => {
    const token = localStorage.getItem("coCurricularToken");
    try {
      const response = await fetch(`${COCURRICULAR_API}/notifications/${id}/seen`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
     
      if (response.ok) {
        setNotifications(notifications.map(n =>
          n._id === id ? { ...n, seen: true } : n
        ));
      }
    } catch (error) {
      console.error("Error marking notification:", error);
    }
  };

  // ========== PROFILE ACTIONS ==========
  const changePassword = () => {
    if (!pwdForm.oldPwd || !pwdForm.newPwd || pwdForm.newPwd !== pwdForm.confirm) {
      alert("Check password fields");
      return;
    }
    alert("Password changed (mock)");
    setPwdForm({ oldPwd: "", newPwd: "", confirm: "" });
    setChangePwdOpen(false);
    setProfileOpen(false);
  };

  // ========== INVITATIONS HANDLERS ==========
  const sendInvites = async (eventObj) => {
    const selected = recipients.filter(r => r.selected);
    if (selected.length === 0) { addToast("Select at least one recipient", "warn"); return; }
    if (!eventObj)             { addToast("Select an event first",        "warn"); return; }

    const token = localStorage.getItem("coCurricularToken");
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    let sentCount = 0;
    let failCount = 0;

    for (const recipient of selected) {
      try {
        // 1) Save the invitation row in DB
        const createRes = await fetch(`${COCURRICULAR_API}/invitations`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify({
            eventId: eventObj._id,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            recipientType: "Industry",
            message: inviteMsg || `You are invited to attend "${eventObj.name}"`,
          }),
        });
        if (!createRes.ok) { failCount++; continue; }
        const invitation = await createRes.json();

        // 2) Trigger the actual email via nodemailer (POST /:id/send)
        const sendRes = await fetch(`${COCURRICULAR_API}/invitations/${invitation._id}/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
        });
        if (sendRes.ok) sentCount++;
        else            failCount++;
      } catch (err) {
        console.error("Invite error for", recipient.email, err);
        failCount++;
      }
    }

    if (sentCount > 0) addToast(`📨 Sent ${sentCount} invitation${sentCount === 1 ? "" : "s"} for "${eventObj.name}"`, "success");
    if (failCount > 0) addToast(`${failCount} invitation${failCount === 1 ? "" : "s"} failed (check backend EMAIL_USER / EMAIL_PASS)`, "error");

    if (sentCount > 0 || failCount > 0) fetchNotifications();

    setRecipients((prev) => prev.map((r) => ({ ...r, selected: false })));
    setInviteMsg("");
    setInviteModalOpen(false);
  };

  // ========== FILE HANDLERS ==========
  const onPosterChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setNewEvent(prev => ({ ...prev, posterFile: f, posterPreview: ev.target.result }));
    r.readAsDataURL(f);
  };

  // ========== LOGOUT ==========
  const handleLogout = () => {
    if (!window.confirm("Logout?")) return;
    localStorage.removeItem("coCurricularToken");
    localStorage.removeItem("coCurricularUser");
    window.location.href = "/role-select";
  };

  // ========== SIDEBAR VARIANTS ==========
  const sidebarVariants = { open: { width: 280 }, closed: { width: 72 } };

  // ========== HELPER FUNCTIONS FOR THEME COLORS ==========
  const getProgressRingColor = (progress) => {
    if (progress >= 80) return theme.dark;
    if (progress >= 50) return theme.mediumBlue;
    if (progress >= 20) return theme.softBlue;
    return theme.primary;
  };

  const getStatusStyle = (status, isOverdue) => {
    if (isOverdue) {
      return { background: "#ef4444", color: "#fff" };
    }
    
    switch(status) {
      case "Completed":
        return { background: theme.dark, color: "#fff" };
      case "In Progress":
        return { background: theme.mediumBlue, color: "#fff" };
      case "Pending":
        return { background: theme.softBlue, color: "#fff" };
      default:
        return { background: theme.primary, color: theme.dark };
    }
  };

  const getProgressBarColor = (status, isOverdue, progress) => {
    if (status === "Completed") return theme.dark;
    if (isOverdue) return "#ef4444";
    if (progress >= 75) return theme.dark;
    if (progress >= 50) return theme.mediumBlue;
    if (progress >= 25) return theme.softBlue;
    return theme.primary;
  };

  // ========== DERIVED DATA ==========
  const upcomingEvents = events.filter(e => e.status === "upcoming");
  const avgProgress = tasks.length > 0
    ? Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length)
    : 0;
  const overdueCount = tasks.filter(t => new Date(t.deadline) < new Date() && (t.progress || 0) < 100).length;
  const deadlineAlerts = tasks.filter(t => {
    if ((t.progress || 0) >= 100) return false;
    const diff = (new Date(t.deadline) - new Date()) / (1000*60*60*24);
    return diff < 0 || diff <= 2;
  });

  // Co-curricular specific aggregates
  const totalBudget        = events.reduce((s, e) => s + (Number(e.budget) || 0), 0);
  const totalRegistrations = events.reduce((s, e) => s + (Number(e.registered) || 0), 0);
  const totalCapacity      = events.reduce((s, e) => s + (Number(e.expected) || 0), 0);
  const fillRate           = totalCapacity ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;
  const pendingTasks       = tasks.filter(t => (t.progress || 0) < 100).length;
  const completedTasks     = tasks.filter(t => (t.progress || 0) >= 100).length;

  // Event-category breakdown for the side card
  const categoryBreakdown = events.reduce((acc, ev) => {
    const c = ev.category || "Other";
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});
  const categoryRows = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Recent activity feed (most recent notifications)
  const recentActivity = [...notifications]
    .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
    .slice(0, 5);

  // Pakistani currency format - uses "Lac"/"Crore" suffixes & South-Asian commas.
  const fmtCurrency = (n) => {
    const num = Number(n) || 0;
    if (num >= 1_00_00_000) return `PKR ${(num / 1_00_00_000).toFixed(1).replace(/\.0$/, "")} Crore`;
    if (num >= 1_00_000)    return `PKR ${(num / 1_00_000).toFixed(1).replace(/\.0$/, "")} Lac`;
    // South-Asian (en-IN) grouping renders 1,30,000 instead of 130,000
    return `PKR ${num.toLocaleString("en-IN")}`;
  };

  // Built-in directory of known FoC coordinators / contacts (Pakistani Muslim names + emails).
  // These are merged with whatever already exists in past events so suggestions always
  // contain useful entries even when the database is empty.
  const KNOWN_COORDINATORS = useMemo(() => ([
    // Test inboxes (real, deliverable mailboxes - flagged so they stand out in dropdown)
    { name: "Sabahat Qadeer",  email: "sabahatqadeerbhati@gmail.com", role: "Test inbox" },
    { name: "Amna Jamil",      email: "amnajamil871@gmail.com",       role: "Test inbox" },
    { name: "Maham Haleem",    email: "mahamhaleem3@gmail.com",       role: "Test inbox" },

    // Faculty directory (Pakistani Muslim names)
    { name: "Habiba",          email: "habiba@riphah.edu.pk" },
    { name: "Shumaila Qayoom", email: "shumaila.qayoom@riphah.edu.pk" },
    { name: "Shumaila Iqbal",  email: "shumaila.iqbal@riphah.edu.pk" },
    { name: "Hassan Iqbal",    email: "hassan.iqbal@riphah.edu.pk" },
    { name: "Maryam Shah",     email: "maryam.shah@riphah.edu.pk" },
    { name: "Bilal Ahmed",     email: "bilal.ahmed@riphah.edu.pk" },
    { name: "Zainab Raza",     email: "zainab.raza@riphah.edu.pk" },
    { name: "Usman Niazi",     email: "usman.niazi@riphah.edu.pk" },
    { name: "Fatima Naveed",   email: "fatima.naveed@riphah.edu.pk" },
    { name: "Aisha Siddiqui",  email: "aisha.siddiqui@riphah.edu.pk" },
    { name: "Hina Tariq",      email: "hina.tariq@riphah.edu.pk" },
    { name: "Saira Malik",     email: "saira.malik@riphah.edu.pk" },
    { name: "Mariam Yousuf",   email: "mariam.yousuf@riphah.edu.pk" },
    { name: "Nimra Asad",      email: "nimra.asad@riphah.edu.pk" },
    { name: "Iqra Bashir",     email: "iqra.bashir@riphah.edu.pk" },
    { name: "Rabia Saleem",    email: "rabia.saleem@riphah.edu.pk" },
    { name: "Anum Javed",      email: "anum.javed@riphah.edu.pk" },
    { name: "Sana Khalid",     email: "sana.khalid@riphah.edu.pk" },
    { name: "Mehwish Anwar",   email: "mehwish.anwar@riphah.edu.pk" },
    { name: "Muhammad Ali",    email: "muhammad.ali@riphah.edu.pk" },
    { name: "Ahmed Raza",      email: "ahmed.raza@riphah.edu.pk" },
    { name: "Imran Aslam",     email: "imran.aslam@riphah.edu.pk" },
    { name: "Talha Khan",      email: "talha.khan@riphah.edu.pk" },
    { name: "Faisal Sattar",   email: "faisal.sattar@riphah.edu.pk" },
    { name: "Hamza Iqbal",     email: "hamza.iqbal@riphah.edu.pk" },
    { name: "Yasir Hussain",   email: "yasir.hussain@riphah.edu.pk" },
    { name: "Bilal Khan",      email: "bilal.khan@riphah.edu.pk" },
    { name: "Asad Khan",       email: "asad.khan@riphah.edu.pk" },

    // Senior staff
    { name: "Dr. Ayesha Khan",        email: "ayesha.khan@riphah.edu.pk" },
    { name: "Dr. Hammad Raza",        email: "hammad.raza@riphah.edu.pk" },
    { name: "Dr. Tariq Mahmood",      email: "tariq.mahmood@riphah.edu.pk" },
    { name: "Dr. Naila Iqbal",        email: "naila.iqbal@riphah.edu.pk" },
    { name: "Dr. Habiba Ahmed",       email: "habiba.ahmed@riphah.edu.pk" },
    { name: "Prof. Khalid Rasheed",   email: "khalid.rasheed@riphah.edu.pk" },
    { name: "Prof. Shazia Bukhari",   email: "shazia.bukhari@riphah.edu.pk" },
  ]), []);
  // Common co-curricular task titles for the Add Task form's title autocomplete
  const TASK_TITLE_SUGGESTIONS = useMemo(() => ([
    "Confirm venue booking",
    "Reserve auditorium with admin office",
    "Coordinate with the photographer & video team",
    "Prepare and submit event budget",
    "Order catering for the event",
    "Design and print posters / flyers",
    "Print certificates for participants",
    "Set up registration desk",
    "Brief volunteers and assign duties",
    "Get sponsorship approval from Dean's office",
    "Invite and schedule judges / panelists",
    "Arrange security clearance and parking",
    "Update CollaXion event poster on social media",
    "Send invitation emails to industry partners",
    "Send reminder emails to registered students",
    "Collect attendance and feedback forms",
    "Compile and submit post-event report",
    "Coordinate with IT for AV / projector setup",
    "Arrange transport for guest speakers",
    "Order welcome kits & participant SWAG",
    "Reconcile bills and submit reimbursements",
    "Schedule rehearsal / tech run",
    "Confirm guest list with Industry Liaison Office",
    "Publish event result & winners announcement",
  ]), []);

  // Description templates - quick chips below the description textarea
  const TASK_DESCRIPTION_TEMPLATES = useMemo(() => ([
    {
      label: "Brief",
      text:  "Please complete this task on time and update progress in CollaXion. Reach out if any blockers come up.",
    },
    {
      label: "Coordination",
      text:  "Kindly coordinate with the relevant FoC team and the Industry Liaison Office. Share progress updates by mid-week.",
    },
    {
      label: "Procurement",
      text:  "Get quotations from at least two vendors, share comparison, and proceed with approval from Dean's office before placing the order.",
    },
    {
      label: "Outreach",
      text:  "Use the CollaXion invitation flow to reach out, follow up after 48 hours if no response, and log replies as they come in.",
    },
    {
      label: "Reporting",
      text:  "Compile attendance, feedback scores, and budget actuals into a 1-page report. Attach photos and submit to the Co-Curricular Office.",
    },
  ]), []);

  const KNOWN_VENUES = useMemo(() => ([
    "Riphah Auditorium",
    "Faculty of Computing - Lab 1",
    "Faculty of Computing - Lab 2",
    "Block A Seminar Hall",
    "Block C Conference Room",
    "Open Air Theatre",
    "Sports Complex",
    "Library Multipurpose Hall",
    "Cafeteria Lawn",
  ]), []);

  // Filter out legacy non-Muslim seed entries that may still be in MongoDB from
  // earlier seeds (e.g. "Ms. R. Gupta" / "Dr. N. Sharma" / "Prof. P. Singh").
  // Carefully scoped - names like Shah / Shahid / Raja / Kumail are Muslim and
  // must NOT match this blocklist.
  const SUGGESTION_BLOCKLIST = /\b(gupta|sharma|patel|verma|yadav|chowdhury|chatterjee|banerjee|mukherjee|singh\b)/i;
  const isAllowedName  = (s) => s && !SUGGESTION_BLOCKLIST.test(s);
  const isAllowedEmail = (s) => s && !SUGGESTION_BLOCKLIST.test(s);

  // Suggestion sources for Create Event autocomplete (DB events ⊕ built-in directory)
  const venueSuggestions = useMemo(
    () => Array.from(new Set([
      ...events.map((e) => e.venue).filter(Boolean),
      ...KNOWN_VENUES,
    ])),
    [events, KNOWN_VENUES]
  );
  const coordinatorSuggestions = useMemo(
    () => Array.from(new Set([
      ...events.map((e) => e.coordinator).filter(isAllowedName),
      ...KNOWN_COORDINATORS.map((c) => c.name),
    ])),
    [events, KNOWN_COORDINATORS]
  );
  const coordinatorEmailMap = useMemo(() => {
    const m = {};
    // built-in directory first
    KNOWN_COORDINATORS.forEach((c) => { m[c.name] = c.email; });
    // DB-derived overrides (in case event has a different email saved)
    events.forEach((e) => {
      if (
        e.coordinator && (e.coordinatorEmail || e.email) &&
        isAllowedName(e.coordinator) && isAllowedEmail(e.coordinatorEmail || e.email)
      ) {
        m[e.coordinator] = e.coordinatorEmail || e.email;
      }
    });
    return m;
  }, [events, KNOWN_COORDINATORS]);
  const coordinatorEmailSuggestions = useMemo(
    () => Array.from(new Set([
      ...events.map((e) => e.coordinatorEmail || e.email).filter(isAllowedEmail),
      ...KNOWN_COORDINATORS.map((c) => c.email),
    ])),
    [events, KNOWN_COORDINATORS]
  );
  const eventNameSuggestions = useMemo(
    () => Array.from(new Set([
      ...events.map((e) => e.name).filter(Boolean),
      "Annual Tech Symposium",
      "FoC Open House",
      "AI / ML Workshop",
      "FYP Showcase",
      "Cyber Security Bootcamp",
      "Interfaculty Sports Gala",
    ])),
    [events]
  );
  const EVENT_CATEGORIES = ["Technical", "Sports", "Cultural", "Workshop", "Seminar", "Competition"];

  // Real weekly task completions - counts tasks finished (progress >= 100) per day,
  // for the last 7 days ending today, using updatedAt as the completion timestamp.
  const weeklyProgress = (() => {
    const days = [];
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push({
        date: d,
        day: labels[d.getDay()],
        isToday: i === 0,
        completed: 0,
      });
    }
    tasks.forEach((t) => {
      if ((t.progress || 0) < 100) return;
      const ts = t.updatedAt ? new Date(t.updatedAt) : null;
      if (!ts || isNaN(ts)) return;
      ts.setHours(0, 0, 0, 0);
      const slot = days.find((s) => s.date.getTime() === ts.getTime());
      if (slot) slot.completed += 1;
    });
    return days;
  })();

  // ========== SUBCOMPONENTS ==========
  function ProgressRing({ progress = 50, size = 68, stroke = 8 }) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = (progress / 100) * c;
    const ringColor = getProgressRingColor(progress);
    
    return (
      <svg width={size} height={size} style={{ display: "block" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={theme.light} strokeWidth={stroke} />
        <motion.circle
          cx={size/2}
          cy={size/2}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - dash }}
          transition={{ duration: 0.9 }}
        />
        <text x="50%" y="50%" dy="6" textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: theme.dark }}>{progress}%</text>
      </svg>
    );
  }

  function SimpleLineChart({ data = weeklyProgress, width = 620, height = 240 }) {
    const padTop = 28, padBottom = 36, padLeft = 36, padRight = 18;
    const innerW = width - padLeft - padRight;
    const innerH = height - padTop - padBottom;
    const rawMax = Math.max(...data.map((d) => d.completed));
    const max = rawMax > 0 ? Math.ceil(rawMax * 1.25) : 4;
    const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;
    const points = data.map((d, i) => {
      const x = padLeft + i * stepX;
      const y = padTop + innerH - (d.completed / max) * innerH;
      return { x, y, label: d.day, value: d.completed, isToday: d.isToday };
    });

    // Smooth path via Catmull-Rom-style Bezier interpolation
    const smoothPath = (pts) => {
      if (pts.length < 2) return "";
      let path = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;
        const tension = 0.18;
        const c1x = p1.x + (p2.x - p0.x) * tension;
        const c1y = p1.y + (p2.y - p0.y) * tension;
        const c2x = p2.x - (p3.x - p1.x) * tension;
        const c2y = p2.y - (p3.y - p1.y) * tension;
        path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
      }
      return path;
    };

    const linePath = smoothPath(points);
    const baselineY = padTop + innerH;
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`;

    // Y-axis ticks (0, mid, max)
    const tickCount = 4;
    const ticks = Array.from({ length: tickCount + 1 }, (_, i) => Math.round((max / tickCount) * i));

    const peak = points.reduce((a, b) => (b.value > a.value ? b : a), points[0]);

    return (
      <div style={{ width: "100%", overflow: "visible" }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: "block" }}>
          <defs>
            <linearGradient id="wtcArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%"  stopColor="#3A70B0" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#3A70B0" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#3A70B0" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wtcLine" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%"   stopColor="#193648" />
              <stop offset="50%"  stopColor="#3A70B0" />
              <stop offset="100%" stopColor="#7AA9D6" />
            </linearGradient>
            <filter id="wtcGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Y-axis gridlines + labels */}
          {ticks.map((tv, i) => {
            const y = padTop + innerH - (tv / max) * innerH;
            return (
              <g key={`tick-${i}`}>
                <line
                  x1={padLeft} x2={width - padRight} y1={y} y2={y}
                  stroke="#E2EEF9" strokeWidth="1" strokeDasharray={i === 0 ? "" : "3 4"}
                />
                <text x={padLeft - 8} y={y + 3} textAnchor="end"
                  style={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}>
                  {tv}
                </text>
              </g>
            );
          })}

          {/* Today vertical highlight */}
          {points.map((p, i) => p.isToday && (
            <line key={`today-${i}`} x1={p.x} x2={p.x} y1={padTop} y2={baselineY}
              stroke="#3A70B0" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
          ))}

          {/* Animated area + line */}
          <motion.path
            d={areaPath} fill="url(#wtcArea)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          />
          <motion.path
            d={linePath} fill="none" stroke="url(#wtcLine)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            filter="url(#wtcGlow)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Points + value bubbles + day labels */}
          {points.map((p, i) => {
            const isPeak = p.value > 0 && p === peak;
            return (
              <g key={i}>
                {/* Outer halo */}
                <motion.circle
                  cx={p.x} cy={p.y} r={p.isToday ? 9 : 7}
                  fill="#3A70B0" opacity="0.12"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.05, duration: 0.4 }}
                />
                {/* Dot */}
                <motion.circle
                  cx={p.x} cy={p.y} r={p.isToday ? 5.5 : 4.5}
                  fill="#fff" stroke="#3A70B0" strokeWidth={p.isToday ? "2.5" : "2"}
                  style={{ cursor: "pointer", filter: isPeak ? "drop-shadow(0 2px 6px rgba(58,112,176,0.5))" : "none" }}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={(ev) => setChartTooltip({ x: ev.clientX, y: ev.clientY, content: `${p.label}: ${p.value} task${p.value === 1 ? "" : "s"} completed` })}
                  onMouseLeave={() => setChartTooltip(null)}
                />
                {/* Value label above dot - only if non-zero */}
                {p.value > 0 && (
                  <motion.text
                    x={p.x} y={p.y - 12} textAnchor="middle"
                    style={{ fontSize: 11, fontWeight: 800, fill: isPeak ? "#193648" : "#3A70B0" }}
                    initial={{ opacity: 0, y: p.y - 6 }} animate={{ opacity: 1, y: p.y - 12 }}
                    transition={{ delay: 0.85 + i * 0.05, duration: 0.3 }}
                  >
                    {p.value}
                  </motion.text>
                )}
                {/* Day label */}
                <text x={p.x} y={height - 14} textAnchor="middle"
                  style={{
                    fontSize: 11,
                    fontWeight: p.isToday ? 800 : 600,
                    fill: p.isToday ? "#193648" : "#64748b",
                    letterSpacing: "0.04em",
                  }}>
                  {p.label}
                </text>
                {p.isToday && (
                  <text x={p.x} y={height - 2} textAnchor="middle"
                    style={{ fontSize: 8.5, fontWeight: 800, fill: "#3A70B0", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Today
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  function SimplePieChart({ items = events, size = 100 }) {
    const counts = items.reduce((acc, it) => { acc[it.category] = (acc[it.category] || 0) + 1; return acc; }, {});
    const categories = Object.keys(counts);
    const total = categories.reduce((s, c) => s + counts[c], 0) || 1;
    let start = 0;
    const colors = [theme.dark, theme.mediumBlue, theme.softBlue, theme.primary, "#8b5cf6"];
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {categories.map((c, i) => {
          const v = counts[c];
          const angle = (v / total) * Math.PI * 2;
          const end = start + angle;
          const x1 = size/2 + Math.cos(start) * (size/2 - 6);
          const y1 = size/2 + Math.sin(start) * (size/2 - 6);
          const x2 = size/2 + Math.cos(end) * (size/2 - 6);
          const y2 = size/2 + Math.sin(end) * (size/2 - 6);
          const large = angle > Math.PI ? 1 : 0;
          const d = `M ${size/2} ${size/2} L ${x1} ${y1} A ${size/2-6} ${size/2-6} 0 ${large} 1 ${x2} ${y2} Z`;
          start = end;
          return <path key={c} d={d} fill={colors[i % colors.length]}
            onMouseEnter={(ev)=> setChartTooltip({ x: ev.clientX, y: ev.clientY, content: `${c}: ${v}` })}
            onMouseLeave={()=> setChartTooltip(null)}
          />;
        })}
        <circle cx={size/2} cy={size/2} r={size/2 - 26} fill={theme.nearWhite} />
        <text x="50%" y="50%" textAnchor="middle" dy="6" style={{ fontWeight: 800, fill: theme.dark }}>{total}</text>
      </svg>
    );
  }

  // ========== NAVIGATION ITEMS ==========
  const navItems = [
    { label: "Dashboard", icon: <BarChart3 size={18} />, id: "dashboard" },
    { label: "Responsibilities", icon: <FileText size={18} />, id: "responsibilities" },
    { label: "Create Event", icon: <Plus size={18} />, id: "create" },
    { label: "Manage Events", icon: <Edit size={18} />, id: "manage" },
    { label: "Invitations", icon: <Mail size={18} />, id: "invitations" },
  ];

  // Click outside handlers
  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest) return;
      if (!e.target.closest(".profileMenu") && !e.target.closest(".profileBtn")) {
        setProfileOpen(false);
      }
      if (!e.target.closest(".notifBtn") && !e.target.closest(".notifMenu")) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // ========== RENDER ==========
  // Nav items in the polished format used by InternshipDashboard
  const navMenu = [
    { key: "dashboard",        label: "Dashboard",        desc: "Overview & analytics",      icon: BarChart3 },
    { key: "responsibilities", label: "Responsibilities", desc: "Tasks & deadlines",         icon: ClipboardCheck },
    { key: "create",           label: "Create Event",     desc: "Plan a new event",          icon: Plus },
    { key: "manage",           label: "Manage Events",    desc: "Edit & delete events",      icon: Edit },
    { key: "invitations",      label: "Invitations",      desc: "Email industry partners",   icon: Mail },
  ];
  const unreadNotifs = notifications.filter(n => !n.seen).length;

  return (
    <div style={{
      display: "block", minHeight: "100vh", fontFamily: "'Inter', sans-serif",
      background: "#f4f7fb",
      width: "100%", maxWidth: "100%", overflowX: "hidden",
      boxSizing: "border-box",
    }}>
      <style>{`
        @keyframes cocuPing {
          0%   { transform: scale(0.6); opacity: 0.85; }
          80%  { transform: scale(2);   opacity: 0; }
          100% { transform: scale(2);   opacity: 0; }
        }
      `}</style>
      {/* TOP NAVBAR - premium */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "linear-gradient(135deg, rgba(15,42,56,0.92) 0%, rgba(25,54,72,0.92) 50%, rgba(31,65,89,0.92) 100%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: "0 8px 28px rgba(15,42,56,0.28)",
        width: "100%", maxWidth: "100%",
        display: "flex", alignItems: "center", gap: 14,
        padding: "10px 24px",
        flexWrap: "wrap",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxSizing: "border-box",
      }}>
        {/* Hairline gradient accent at the bottom */}
        <span aria-hidden style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: 2,
          background: "linear-gradient(90deg, transparent 0%, rgba(122,169,214,0.6) 30%, rgba(170,195,252,0.7) 50%, rgba(122,169,214,0.6) 70%, transparent 100%)",
          opacity: 0.7,
          pointerEvents: "none",
        }} />

        {/* Brand block */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{
            position: "relative",
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
            border: "1px solid rgba(255,255,255,0.22)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 18px rgba(15,42,56,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}>
            <img src={collaxionLogo} alt="CollaXion" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.2)" }} />
            <span aria-hidden style={{
              position: "absolute", inset: -3, borderRadius: 14,
              background: "radial-gradient(circle at 50% 0%, rgba(170,195,252,0.35) 0%, rgba(170,195,252,0) 60%)",
              pointerEvents: "none",
            }} />
          </div>
          <div>
            <div style={{
              fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em", lineHeight: 1.1,
              background: "linear-gradient(90deg, #ffffff 0%, #E2EEF9 50%, #AAC3FC 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              CollaXion
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", background: "#22C55E",
                boxShadow: "0 0 0 3px rgba(34,197,94,0.25), 0 0 8px rgba(34,197,94,0.6)",
              }} />
              <span style={{ fontSize: 9, color: "rgba(226,238,249,0.78)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Incharge Portal
              </span>
            </div>
          </div>
        </div>

        {/* Tabs (desktop) */}
        <div style={{
          display: "flex", gap: 4, alignItems: "center",
          flex: "1 1 auto", minWidth: 0, justifyContent: "center",
          flexWrap: "wrap",
        }}>
          {navMenu.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.key;
            return (
              <button
                key={item.key}
                title={item.desc}
                onClick={() => {
                  setActiveSection(item.key);
                  setShowEventForm(item.key === "create");
                }}
                style={{
                  position: "relative",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "9px 14px", borderRadius: 11,
                  background: active
                    ? "linear-gradient(135deg, rgba(170,195,252,0.18), rgba(122,169,214,0.10))"
                    : "transparent",
                  border: active ? "1px solid rgba(170,195,252,0.35)" : "1px solid transparent",
                  color: active ? "#fff" : "rgba(226,238,249,0.70)",
                  fontSize: 12.5, fontWeight: active ? 800 : 600,
                  cursor: "pointer", transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
                  whiteSpace: "nowrap",
                  boxShadow: active ? "0 6px 18px rgba(122,169,214,0.20), inset 0 1px 0 rgba(255,255,255,0.10)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(226,238,249,0.70)";
                    e.currentTarget.style.transform = "";
                  }
                }}
              >
                <Icon size={15} style={{ opacity: active ? 1 : 0.85 }} />
                <span>{item.label}</span>
                {active && (
                  <span aria-hidden style={{
                    position: "absolute", left: "20%", right: "20%", bottom: -6, height: 3, borderRadius: 99,
                    background: "linear-gradient(90deg, transparent 0%, #AAC3FC 50%, transparent 100%)",
                    boxShadow: "0 0 14px rgba(170,195,252,0.7)",
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Right cluster: Bell + Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {/* Notification bell */}
          <div style={{ position: "relative" }}>
            <button
              className="notifBtn"
              onClick={() => setNotifOpen((s) => !s)}
              title="Notifications"
              style={{
                position: "relative",
                width: 38, height: 38, borderRadius: 10,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#fff", cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.18s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            >
              <Bell size={16} />
              {notifPing && (
                <span aria-hidden style={{
                  position: "absolute", top: -2, right: -2,
                  width: 22, height: 22, borderRadius: "50%",
                  background: "rgba(239,68,68,0.35)",
                  animation: "cocuPing 1.4s cubic-bezier(0,0,0.2,1) infinite",
                  pointerEvents: "none",
                }} />
              )}
              {unreadNotifs > 0 && (
                <span style={{
                  position: "absolute", top: -3, right: -3,
                  background: "#ef4444", color: "#fff",
                  fontSize: 9, minWidth: 16, height: 16, padding: "0 4px",
                  borderRadius: 999,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, border: "2px solid #193648",
                }}>
                  {Math.min(99, unreadNotifs)}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  className="notifMenu"
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute", right: 0, top: 50,
                    width: 460, maxWidth: "calc(100vw - 32px)", maxHeight: 560, overflow: "hidden",
                    background: "#fff", color: "#193648",
                    border: "1px solid #E2EEF9", borderRadius: 18,
                    boxShadow: "0 32px 70px rgba(15,23,42,0.28), 0 4px 12px rgba(15,23,42,0.10)",
                    zIndex: 1200,
                    display: "flex", flexDirection: "column",
                  }}
                >
                  {/* Premium gradient header */}
                  <div style={{
                    position: "relative",
                    background: "linear-gradient(135deg, #0F2A38 0%, #193648 60%, #1F4159 100%)",
                    padding: "12px 16px",
                    minHeight: 60,
                    color: "#fff",
                    overflow: "hidden",
                    borderBottom: "1px solid rgba(170,195,252,0.18)",
                    display: "flex",
                    alignItems: "center",
                  }}>
                    <span aria-hidden style={{
                      position: "absolute", left: 0, right: 0, bottom: 0, height: 2,
                      background: "linear-gradient(90deg, transparent 0%, rgba(170,195,252,0.55) 50%, transparent 100%)",
                      pointerEvents: "none",
                    }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 11, position: "relative", zIndex: 1, width: "100%" }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: "rgba(255,255,255,0.10)",
                        border: "1px solid rgba(255,255,255,0.20)",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
                      }}>
                        <Bell size={15} color="#AAC3FC" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: 14.5, letterSpacing: "-0.01em", fontFamily: "'Sora', 'Inter', sans-serif" }}>Notifications</span>
                          {unreadNotifs > 0 && (
                            <span style={{
                              fontSize: 10, fontWeight: 800, letterSpacing: "0.04em",
                              padding: "2px 7px", borderRadius: 999,
                              background: "#ef4444", color: "#fff",
                              boxShadow: "0 0 0 2px rgba(239,68,68,0.25)",
                              fontVariantNumeric: "tabular-nums",
                            }}>{unreadNotifs}</span>
                          )}
                        </div>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          fontSize: 10, color: "rgba(226,238,249,0.7)",
                          fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2,
                        }}>
                          <span style={{ position: "relative", display: "inline-flex", width: 5, height: 5 }}>
                            <span aria-hidden style={{
                              position: "absolute", inset: 0, borderRadius: "50%", background: "#22C55E",
                              animation: "cocuPing 1.8s cubic-bezier(0,0,0.2,1) infinite",
                            }} />
                            <span style={{ position: "relative", width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
                          </span>
                          Live · auto-sync 15s
                        </div>
                      </div>
                      {unreadNotifs > 0 && (
                        <button
                          onClick={() => notifications.filter(n => !n.seen).forEach(n => markNotificationSeen(n._id))}
                          title="Mark all as read"
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "6px 10px", borderRadius: 8,
                            background: "rgba(255,255,255,0.10)", color: "#fff",
                            border: "1px solid rgba(255,255,255,0.20)",
                            fontSize: 10.5, fontWeight: 700, letterSpacing: "0.02em",
                            cursor: "pointer", transition: "background 0.18s ease",
                            flexShrink: 0,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
                        >
                          <CheckCircle size={11} /> Mark all
                        </button>
                      )}
                      <button onClick={fetchNotifications} title="Refresh" style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)",
                        cursor: "pointer", color: "#fff",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.18s ease, transform 0.4s ease",
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.transform = "rotate(180deg)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.transform = ""; }}
                      >
                        <RefreshCw size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable notifications list */}
                  <div style={{ padding: 12, overflowY: "auto", flex: 1, background: "#fbfdff" }}>
                    {notifications.length === 0 ? (
                      <div style={{
                        textAlign: "center", padding: "36px 16px",
                        background: "#fff", border: "1px dashed #E2EEF9", borderRadius: 14,
                      }}>
                        <div style={{
                          width: 50, height: 50, borderRadius: 14,
                          background: "linear-gradient(135deg, #f8fbff, #E2EEF9)",
                          color: "#3A70B0",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          marginBottom: 10, boxShadow: "0 6px 14px rgba(58,112,176,0.18)",
                        }}>
                          <Bell size={22} />
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#193648" }}>You're all caught up</div>
                        <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 4 }}>Live updates appear here every 15s.</div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {notifications.slice(0, 12).map((n, i) => {
                          const tag = (n.type || "info").toLowerCase();
                          const palette = {
                            success: { bg: "#f0fdf4", color: "#15803d", Icon: CheckCircle },
                            warning: { bg: "#fff7ed", color: "#c2410c", Icon: AlertCircle },
                            urgent:  { bg: "#fff1f2", color: "#be123c", Icon: AlertCircle },
                            info:    { bg: "#eff6ff", color: "#3A70B0", Icon: Bell },
                          };
                          const p = palette[tag] || palette.info;
                          const ts = n.createdAt || n.date;
                          return (
                            <motion.div
                              key={n._id}
                              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03, duration: 0.3 }}
                              style={{
                                position: "relative",
                                display: "flex", gap: 10, alignItems: "flex-start",
                                padding: "11px 12px", borderRadius: 12,
                                background: n.seen ? "#fff" : "linear-gradient(180deg, #f8fbff, #ffffff)",
                                border: `1px solid ${n.seen ? "#eef2ff" : p.bg}`,
                                boxShadow: n.seen ? "none" : `0 2px 10px ${p.color}14`,
                                overflow: "hidden",
                                transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.transform = "translateX(2px)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = n.seen ? "#eef2ff" : p.bg; e.currentTarget.style.transform = ""; }}
                            >
                              {!n.seen && (
                                <span aria-hidden style={{
                                  position: "absolute", top: 0, bottom: 0, left: 0, width: 3,
                                  background: `linear-gradient(180deg, ${p.color}, ${p.color}88)`,
                                }} />
                              )}
                              <span style={{
                                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: p.bg, color: p.color,
                                border: `1px solid ${p.color}33`,
                                marginLeft: !n.seen ? 4 : 0,
                              }}>
                                <p.Icon size={14} />
                              </span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", lineHeight: 1.35, letterSpacing: "-0.005em" }}>
                                  {n.title || n.text || "Notification"}
                                </div>
                                {n.message && n.message !== n.title && (
                                  <div style={{
                                    fontSize: 11.5, color: "#5b7184", marginTop: 3, lineHeight: 1.5,
                                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}>
                                    {n.message}
                                  </div>
                                )}
                                <div style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 5, display: "inline-flex", alignItems: "center", gap: 6 }}>
                                  <span style={{
                                    color: p.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em",
                                    background: p.bg, padding: "1px 7px", borderRadius: 999,
                                    border: `1px solid ${p.color}22`,
                                  }}>{tag}</span>
                                  {ts && <span>{new Date(ts).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>}
                                </div>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                                {!n.seen && (
                                  <button onClick={() => markNotificationSeen(n._id)} title="Mark read" style={{
                                    width: 26, height: 26, borderRadius: 8,
                                    background: "#fff", border: "1px solid #E2EEF9",
                                    color: "#3A70B0", cursor: "pointer",
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    transition: "background 0.18s ease, border-color 0.18s ease",
                                  }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#3A70B0"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E2EEF9"; }}
                                  >
                                    <CheckCircle size={12} />
                                  </button>
                                )}
                                <button
                                  onClick={() => setNotifications((prev) => prev.filter(x => x._id !== n._id))}
                                  title="Dismiss"
                                  style={{
                                    width: 26, height: 26, borderRadius: 8,
                                    background: "#fff", border: "1px solid #fecdd3",
                                    color: "#be123c", cursor: "pointer",
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                    transition: "background 0.18s ease, border-color 0.18s ease",
                                  }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.borderColor = "#be123c"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#fecdd3"; }}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div style={{
                      padding: "10px 14px",
                      borderTop: "1px solid #eef2ff",
                      background: "#fff",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      fontSize: 11, color: "#94a3b8",
                    }}>
                      <span>Showing {Math.min(12, notifications.length)} of {notifications.length}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#3A70B0", fontWeight: 700 }}>
                        <RefreshCw size={10} /> Auto-sync 15s
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile dropdown - compact avatar pill (name shown in dropdown only) */}
          <div style={{ position: "relative" }}>
            <button
              className="profileBtn"
              onClick={() => setProfileOpen((s) => !s)}
              title={`${profile.name} · Co-Curricular Incharge`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 8px 4px 4px", borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#fff", cursor: "pointer",
                transition: "background 0.18s ease", flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            >
              <span style={{
                position: "relative", width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg, #193648, #3A70B0)", padding: 2,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <img
                  src={profile.dp || cocuAvatar}
                  alt={profile.name}
                  onError={(e) => { if (e.currentTarget.src !== cocuAvatar) e.currentTarget.src = cocuAvatar; }}
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", display: "block" }}
                />
                <span style={{
                  position: "absolute", bottom: -1, right: -1,
                  width: 9, height: 9, borderRadius: "50%",
                  background: "#22C55E", border: "2px solid #193648",
                }} />
              </span>
              <ChevronLeft size={13} style={{ transform: profileOpen ? "rotate(90deg)" : "rotate(-90deg)", transition: "transform 0.18s ease" }} />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  className="profileMenu"
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  style={{
                    position: "absolute", right: 0, top: 50, width: 240,
                    background: "#fff", color: "#193648",
                    border: "1px solid #E2EEF9", borderRadius: 14,
                    boxShadow: "0 24px 60px rgba(15,23,42,0.20)",
                    padding: 12, zIndex: 1200,
                  }}
                >
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 6px 12px", borderBottom: "1px dashed #E2EEF9", marginBottom: 8,
                  }}>
                    <button
                      type="button"
                      onClick={() => dpInputRef.current?.click()}
                      title="Click to change photo"
                      disabled={profileSaving}
                      style={{
                        position: "relative",
                        width: 48, height: 48, borderRadius: "50%",
                        background: "linear-gradient(135deg, #193648, #3A70B0)", padding: 2,
                        flexShrink: 0, border: "none",
                        cursor: profileSaving ? "wait" : "pointer",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={profile.dp || cocuAvatar}
                        alt={profile.name}
                        onError={(e) => { if (e.currentTarget.src !== cocuAvatar) e.currentTarget.src = cocuAvatar; }}
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", display: "block" }}
                      />
                      {/* Hover overlay - camera icon */}
                      <span aria-hidden style={{
                        position: "absolute", inset: 2, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(15,42,56,0.55)", color: "#fff",
                        opacity: 0, transition: "opacity 0.18s ease",
                        pointerEvents: "none",
                      }}
                        className="dpHoverOverlay"
                      >
                        <Camera size={14} />
                      </span>
                      {profileSaving && (
                        <span aria-hidden style={{
                          position: "absolute", inset: 2, borderRadius: "50%",
                          background: "rgba(15,42,56,0.55)", color: "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <RefreshCw size={14} className="dpSpin" />
                        </span>
                      )}
                    </button>
                    <input
                      ref={dpInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => { handleDpChange(e.target.files?.[0]); e.target.value = ""; }}
                    />
                    <style>{`
                      .profileMenu button[title="Click to change photo"]:hover .dpHoverOverlay { opacity: 1; }
                      @keyframes dpSpinKf { to { transform: rotate(360deg); } }
                      .dpSpin { animation: dpSpinKf 0.9s linear infinite; }
                    `}</style>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 800, color: "#0f172a",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>{profile.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{profile.role || "Co-Curricular Incharge"}</div>
                      <button
                        type="button"
                        onClick={() => dpInputRef.current?.click()}
                        disabled={profileSaving}
                        style={{
                          marginTop: 5, padding: "3px 9px", borderRadius: 999,
                          background: "#f8fbff", border: "1px solid #E2EEF9",
                          color: "#3A70B0", fontSize: 10, fontWeight: 800, letterSpacing: "0.04em",
                          cursor: profileSaving ? "wait" : "pointer",
                          display: "inline-flex", alignItems: "center", gap: 5,
                        }}
                      >
                        <Camera size={10} /> {profileSaving ? "Saving…" : "Change photo"}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", fontSize: 11.5 }}>
                      <span style={{ color: "#64748b" }}>Upcoming events</span>
                      <span style={{ color: "#193648", fontWeight: 800 }}>{upcomingEvents.length}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", fontSize: 11.5 }}>
                      <span style={{ color: "#64748b" }}>Overdue</span>
                      <span style={{ color: overdueCount ? "#be123c" : "#193648", fontWeight: 800 }}>{overdueCount}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", fontSize: 11.5 }}>
                      <span style={{ color: "#64748b" }}>Total tasks</span>
                      <span style={{ color: "#193648", fontWeight: 800 }}>{tasks.length}</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%",
                    padding: "9px 12px", background: "rgba(239,68,68,0.08)",
                    color: "#be123c", border: "1px solid rgba(239,68,68,0.20)",
                    borderRadius: 10, fontWeight: 700, fontSize: 12.5, cursor: "pointer",
                    transition: "background 0.18s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.14)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* SIDEBAR (legacy) - disabled in favor of top navbar */}
      <motion.aside
        animate={{ x: -280 }}
        initial={{ x: -280 }}
        transition={{ duration: 0 }}
        style={{
          width: 0, height: 0,
          background: "transparent",
          position: "fixed",
          top: 0, left: 0, zIndex: -1,
          display: "none", flexDirection: "column",
          overflow: "hidden",
          pointerEvents: "none",
        }}>
        {/* Ambient glow */}
        <div aria-hidden style={{
          position: "absolute", top: -120, left: -100,
          width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(226,238,249,0.20) 0%, rgba(226,238,249,0) 70%)",
          filter: "blur(20px)", pointerEvents: "none", zIndex: 0,
        }} />

        {/* Logo */}
        <div style={{ padding: "26px 18px 20px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 16px rgba(15,42,56,0.4)",
              flexShrink: 0,
            }}>
              <img src={collaxionLogo} alt="CollaXion" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.01em" }}>
                <span>C</span>olla<span style={{ color: "#E2EEF9" }}>X</span>ion
              </div>
              <div style={{ fontSize: 9.5, color: "rgba(226,238,249,0.55)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>
                Co-Curricular Operations
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              title="Collapse menu"
              style={{
                width: 30, height: 30, borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#fff", cursor: "pointer", flexShrink: 0,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <ChevronLeft size={15} />
            </button>
          </div>
        </div>

        {/* Role pill */}
        <div style={{ padding: "12px 22px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(226,238,249,0.12)", border: "1px solid rgba(226,238,249,0.25)",
            borderRadius: 99, padding: "5px 12px",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.25)" }} />
            <span style={{ fontSize: 10, color: "#E2EEF9", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Incharge Portal
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "18px 14px 12px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{
            fontSize: 9.5, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(226,238,249,0.45)", padding: "0 8px", marginBottom: 10,
          }}>
            Main Menu
          </div>

          {navMenu.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.key;
            return (
              <button key={item.key}
                onClick={() => {
                  setActiveSection(item.key);
                  setShowEventForm(item.key === "create");
                }}
                style={{
                  position: "relative",
                  display: "flex", alignItems: "center", gap: 12, width: "100%",
                  padding: "11px 14px", borderRadius: 12, marginBottom: 5,
                  background: active ? "rgba(226,238,249,0.14)" : "transparent",
                  border: active ? "1px solid rgba(226,238,249,0.22)" : "1px solid transparent",
                  color: active ? "#E2EEF9" : "rgba(226,238,249,0.62)",
                  fontSize: 13.5, fontWeight: active ? 700 : 500,
                  cursor: "pointer", transition: "all 0.2s ease", textAlign: "left", overflow: "hidden",
                }}
                onMouseEnter={(e) => !active && (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={(e) => !active && (e.currentTarget.style.background = "transparent")}
              >
                {active && (
                  <span aria-hidden style={{
                    position: "absolute", left: 0, top: "18%", bottom: "18%",
                    width: 3, borderRadius: 4,
                    background: "linear-gradient(180deg, #E2EEF9, #AAC3FC)",
                    boxShadow: "0 0 12px rgba(226,238,249,0.5)",
                  }} />
                )}
                <span style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: active ? "rgba(226,238,249,0.18)" : "rgba(255,255,255,0.05)",
                  border: active ? "1px solid rgba(226,238,249,0.20)" : "1px solid rgba(255,255,255,0.06)",
                }}>
                  <Icon size={16} />
                </span>
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                  <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 600 }}>{item.label}</span>
                  <span style={{
                    fontSize: 10.5,
                    color: active ? "rgba(226,238,249,0.65)" : "rgba(226,238,249,0.4)",
                    fontWeight: 500, marginTop: 2,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{item.desc}</span>
                </span>
                {item.badge > 0 && (
                  <span style={{
                    background: active ? "#3A70B0" : "rgba(255,255,255,0.12)",
                    color: "#fff", fontSize: 11, fontWeight: 700,
                    padding: "2px 8px", borderRadius: 99, minWidth: 22, textAlign: "center",
                    flexShrink: 0,
                  }}>{item.badge}</span>
                )}
              </button>
            );
          })}

          {/* Today's Snapshot mini-card */}
          <div style={{
            marginTop: "auto", marginBottom: 4,
            padding: "12px 14px", borderRadius: 12,
            background: "linear-gradient(135deg, rgba(226,238,249,0.10), rgba(58,112,176,0.10))",
            border: "1px solid rgba(226,238,249,0.18)",
          }}>
            <div style={{
              fontSize: 9.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "rgba(226,238,249,0.55)", marginBottom: 8,
            }}>
              Today's Snapshot
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11.5, color: "rgba(226,238,249,0.6)" }}>Upcoming</span>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: "#fff" }}>{upcomingEvents.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11.5, color: "rgba(226,238,249,0.6)" }}>Overdue</span>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: overdueCount ? "#fca5a5" : "#E2EEF9" }}>{overdueCount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11.5, color: "rgba(226,238,249,0.6)" }}>Tasks</span>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: "#fff" }}>{tasks.length}</span>
            </div>
          </div>
        </nav>

        {/* User pill + logout */}
        <div style={{ padding: "18px 18px 22px", borderTop: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
            padding: "10px 11px", borderRadius: 14,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(6px)",
          }}>
            <div style={{
              position: "relative",
              width: 38, height: 38, borderRadius: "50%", padding: 2,
              background: "linear-gradient(135deg, #193648, #3A70B0)",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(25,54,72,0.3)",
            }}>
              <img
                src={profile.dp || cocuAvatar}
                alt={profile.name}
                onError={(e) => {
                  if (e.currentTarget.src !== cocuAvatar) e.currentTarget.src = cocuAvatar;
                }}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", display: "block" }}
              />
              <span style={{
                position: "absolute", bottom: -1, right: -1,
                width: 11, height: 11, borderRadius: "50%",
                background: "#22C55E",
                border: "2px solid #193648",
              }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: 12.5, fontWeight: 700, color: "#fff",
                lineHeight: 1.25, letterSpacing: "-0.005em",
                wordBreak: "break-word",
              }}>{profile.name}</div>
              <div style={{
                fontSize: 10.5, color: "rgba(226,238,249,0.65)",
                fontWeight: 500, marginTop: 2,
                lineHeight: 1.25,
              }}>Co-Curricular Incharge</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%",
            padding: "10px 14px", background: "rgba(239,68,68,0.1)",
            color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "0.18s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
          ><LogOut size={15} /> Sign Out</button>

        </div>
      </motion.aside>

      {/* MAIN - full width below the top navbar */}
      <div style={{
        marginLeft: 0,
        minHeight: "calc(100vh - 80px)",
        width: "100%", maxWidth: "100%",
        boxSizing: "border-box", overflowX: "hidden",
      }}>
        {/* HEADER - fully removed; each section renders its own visual treatment */}

        {/* PAGE CONTENT - polished surface */}
        <div ref={dashboardRef} style={{ padding: "0 28px 28px", maxWidth: "100%", boxSizing: "border-box", overflowX: "hidden" }}>
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <>
              {/* CINEMATIC HERO BANNER - full viewport, full bleed */}
              {(() => {
                const hour = now.getHours();
                const greeting = hour < 5 ? "Good night" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : hour < 21 ? "Good evening" : "Good night";
                const titles = /^(prof\.?|dr\.?|mr\.?|mrs\.?|ms\.?|miss|engr\.?|eng\.?|sir|madam)$/i;
                const allParts = (profile.name || "").trim().split(/\s+/).filter(Boolean);
                const titlePart = allParts.find(p => titles.test(p)) || "";
                const namePart  = allParts.find(p => !titles.test(p)) || "";
                const firstName = (titlePart ? `${titlePart} ${namePart}` : namePart).trim() || profile.name || "there";
                const nextEv = upcomingEvents[0];
                // Related, university/event-themed imagery (Unsplash) - auditorium full of students
                const heroBg = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2400&q=85";

                return (
                  <div style={{
                    position: "relative",
                    margin: "0 -28px 22px",
                    height: "calc(100vh - 60px)",
                    minHeight: 540,
                    color: "#fff",
                    overflow: "hidden",
                    boxShadow: "0 14px 40px rgba(15,42,56,0.25)",
                    isolation: "isolate",
                  }}>
                    <style>{`
                      @keyframes cocuKenBurns {
                        0%   { transform: scale(1.08) translate3d(0, 0, 0); }
                        50%  { transform: scale(1.18) translate3d(-1.5%, -1%, 0); }
                        100% { transform: scale(1.08) translate3d(0, 0, 0); }
                      }
                      @keyframes cocuShimmer {
                        0%   { transform: translateX(-100%); }
                        100% { transform: translateX(200%); }
                      }
                      @keyframes cocuPulseRing {
                        0%   { transform: scale(0.7); opacity: 0.85; }
                        100% { transform: scale(2.2);  opacity: 0; }
                      }
                      @keyframes cocuGradientFlow {
                        0%   { background-position: 0% center; }
                        100% { background-position: 200% center; }
                      }
                    `}</style>

                    {/* Background image with Ken-Burns motion (video-like feel) */}
                    <div aria-hidden style={{
                      position: "absolute", inset: 0,
                      backgroundImage: `url(${heroBg})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "saturate(0.85) contrast(1.05) hue-rotate(-8deg)",
                      animation: "cocuKenBurns 24s ease-in-out infinite",
                      zIndex: 0,
                    }} />

                    {/* Multi-layer overlays for legibility + brand mood (heavy navy/teal so color stays) */}
                    <div aria-hidden style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(135deg, rgba(15,42,56,0.95) 0%, rgba(25,54,72,0.88) 35%, rgba(44,95,128,0.72) 70%, rgba(15,42,56,0.85) 100%)",
                      zIndex: 1,
                    }} />
                    <div aria-hidden style={{
                      position: "absolute", inset: 0,
                      background: "radial-gradient(70% 90% at 20% 50%, rgba(15,42,56,0.75) 0%, rgba(15,42,56,0) 70%)",
                      zIndex: 1,
                    }} />
                    <div aria-hidden style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(180deg, rgba(15,42,56,0.45) 0%, rgba(15,42,56,0) 25%, rgba(15,42,56,0) 60%, rgba(15,42,56,0.65) 100%)",
                      zIndex: 1,
                    }} />

                    {/* Ambient floating glow orbs */}
                    <div aria-hidden style={{
                      position: "absolute", top: "12%", right: "8%",
                      width: 200, height: 200, borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(122,169,214,0.35) 0%, rgba(122,169,214,0) 70%)",
                      filter: "blur(30px)", zIndex: 1,
                      animation: "cocuKenBurns 18s ease-in-out infinite reverse",
                    }} />
                    <div aria-hidden style={{
                      position: "absolute", bottom: "-10%", left: "30%",
                      width: 260, height: 260, borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(58,112,176,0.30) 0%, rgba(58,112,176,0) 70%)",
                      filter: "blur(40px)", zIndex: 1,
                    }} />

                    {/* Top diagonal shimmer */}
                    <div aria-hidden style={{
                      position: "absolute", top: 0, bottom: 0, left: 0,
                      width: "30%",
                      background: "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)",
                      animation: "cocuShimmer 7s linear infinite",
                      zIndex: 2,
                      pointerEvents: "none",
                    }} />

                    {/* CONTENT */}
                    <div style={{
                      position: "relative", zIndex: 3,
                      height: "100%",
                      padding: "32px 48px 28px",
                      display: "flex", flexDirection: "column",
                    }}>
                      {/* Top row: badge + live clock */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 8,
                          background: "rgba(255,255,255,0.10)",
                          border: "1px solid rgba(255,255,255,0.22)",
                          backdropFilter: "blur(10px)",
                          padding: "6px 14px", borderRadius: 999,
                          fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
                          color: "#E2EEF9",
                        }}>
                          <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
                            <span aria-hidden style={{
                              position: "absolute", inset: 0, borderRadius: "50%", background: "#22C55E",
                              animation: "cocuPulseRing 1.6s cubic-bezier(0,0,0.2,1) infinite",
                            }} />
                            <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} />
                          </span>
                          Co-Curricular Operations · Live
                        </div>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 10,
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.18)",
                          backdropFilter: "blur(10px)",
                          padding: "8px 14px", borderRadius: 12,
                        }}>
                          <Clock size={14} style={{ color: "#AAC3FC" }} />
                          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                            <span style={{ fontSize: 14, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                              {now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <span style={{ fontSize: 9.5, color: "rgba(226,238,249,0.7)", letterSpacing: "0.10em", textTransform: "uppercase", marginTop: 2 }}>
                              {now.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Centerpiece - greeting + tagline + CTAs */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 760 }}>
                        <motion.div
                          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(226,238,249,0.75)", marginBottom: 8 }}
                        >
                          {greeting} ·  Faculty of Computing
                        </motion.div>
                        <motion.h1
                          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            margin: 0, fontSize: 44, fontWeight: 900, lineHeight: 1.05,
                            letterSpacing: "-0.025em",
                            fontFamily: "'Sora', 'Inter', sans-serif",
                            textShadow: "0 4px 20px rgba(0,0,0,0.35)",
                          }}
                        >
                          Hello, {firstName}.
                          <br />
                          <span style={{
                            background: "linear-gradient(90deg, #E2EEF9 0%, #AAC3FC 25%, #7AA9D6 50%, #3A70B0 75%, #AAC3FC 100%)",
                            backgroundSize: "200% auto",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            animation: "cocuGradientFlow 6s linear infinite",
                            display: "inline-block",
                          }}>
                            Where Passion Meets Participation.
                          </span>
                        </motion.h1>
                        <motion.p
                          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15, duration: 0.7 }}
                          style={{
                            marginTop: 14, marginBottom: 0,
                            fontSize: 14.5, color: "rgba(226,238,249,0.85)",
                            lineHeight: 1.6, maxWidth: 600,
                            textShadow: "0 2px 10px rgba(0,0,0,0.25)",
                          }}
                        >
                          <strong style={{ color: "#fff" }}>{upcomingEvents.length}</strong> upcoming event{upcomingEvents.length === 1 ? "" : "s"},
                          {" "}<strong style={{ color: "#fff" }}>{totalRegistrations.toLocaleString()}</strong> registration{totalRegistrations === 1 ? "" : "s"},
                          and <strong style={{ color: "#fff" }}>{pendingTasks}</strong> task{pendingTasks === 1 ? "" : "s"} on your radar
                          {overdueCount > 0 && <> - <strong style={{ color: "#fca5a5" }}>{overdueCount} overdue</strong></>}.
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25, duration: 0.6 }}
                          style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}
                        >
                          <button onClick={() => { setActiveSection("create"); setShowEventForm(true); }} style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            background: "#fff", color: "#193648",
                            border: "none", borderRadius: 12, padding: "12px 22px",
                            fontWeight: 800, fontSize: 13.5, cursor: "pointer",
                            boxShadow: "0 14px 30px rgba(0,0,0,0.30)",
                            transition: "transform 0.18s ease, box-shadow 0.18s ease",
                          }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 18px 36px rgba(0,0,0,0.36)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.30)"; }}
                          >
                            <Plus size={14} /> Create Event <ArrowRight size={13} />
                          </button>
                          <button onClick={() => setActiveSection("responsibilities")} style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            background: "rgba(255,255,255,0.10)", color: "#fff",
                            border: "1px solid rgba(255,255,255,0.30)",
                            borderRadius: 12, padding: "12px 22px",
                            fontWeight: 700, fontSize: 13.5, cursor: "pointer",
                            backdropFilter: "blur(10px)",
                            transition: "background 0.18s ease",
                          }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
                          >
                            <ClipboardCheck size={14} /> View Responsibilities
                          </button>
                          {nextEv && (
                            <button onClick={() => setActiveSection("manage")} style={{
                              display: "inline-flex", alignItems: "center", gap: 8,
                              background: "transparent", color: "rgba(226,238,249,0.85)",
                              border: "1px dashed rgba(255,255,255,0.30)",
                              borderRadius: 12, padding: "12px 18px",
                              fontWeight: 700, fontSize: 12.5, cursor: "pointer",
                              transition: "color 0.18s ease, border-color 0.18s ease",
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.55)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(226,238,249,0.85)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.30)"; }}
                            >
                              <Sparkles size={13} /> Next: {nextEv.name}
                            </button>
                          )}
                        </motion.div>

                        {/* HEADLINE STAT CARDS - beautiful big numbers right under CTAs */}
                        <motion.div
                          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35, duration: 0.7 }}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))",
                            gap: 14,
                            marginTop: 28,
                            maxWidth: 920,
                          }}
                        >
                          {[
                            { Icon: Calendar,       label: "Upcoming Events", value: upcomingEvents.length,                   sub: nextEv ? `Next · ${new Date(nextEv.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}` : "No events yet", accent: "#AAC3FC" },
                            { Icon: Users,          label: "Registrations",   value: totalRegistrations.toLocaleString(),     sub: totalCapacity ? `${fillRate}% of capacity` : "-",                                                accent: "#7AA9D6" },
                            { Icon: ClipboardCheck, label: "Tasks on Radar",  value: pendingTasks,                            sub: `${completedTasks} done · ${overdueCount} late`,                                                  accent: overdueCount > 0 ? "#fca5a5" : "#86efac" },
                            { Icon: AlertCircle,    label: "Overdue",         value: overdueCount,                            sub: overdueCount === 0 ? "All on track ✓" : `Need attention`,                                         accent: overdueCount > 0 ? "#fca5a5" : "#86efac" },
                          ].map((s, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                              whileHover={{ y: -3 }}
                              style={{
                                position: "relative",
                                padding: "16px 18px",
                                borderRadius: 14,
                                background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
                                border: "1px solid rgba(255,255,255,0.16)",
                                backdropFilter: "blur(14px)",
                                WebkitBackdropFilter: "blur(14px)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.10)",
                                overflow: "hidden",
                                transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
                                cursor: "default",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = `${s.accent}66`;
                                e.currentTarget.style.boxShadow = `0 18px 38px rgba(0,0,0,0.28), 0 0 0 1px ${s.accent}33, inset 0 1px 0 rgba(255,255,255,0.12)`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
                                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.10)";
                              }}
                            >
                              {/* Accent glow corner */}
                              <span aria-hidden style={{
                                position: "absolute", top: -30, right: -30,
                                width: 90, height: 90, borderRadius: "50%",
                                background: `radial-gradient(circle, ${s.accent}40 0%, ${s.accent}00 70%)`,
                                filter: "blur(8px)", pointerEvents: "none",
                              }} />

                              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, position: "relative", zIndex: 1 }}>
                                <span style={{
                                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                                  background: `linear-gradient(135deg, ${s.accent}33, ${s.accent}11)`,
                                  border: `1px solid ${s.accent}55`,
                                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                                  color: s.accent,
                                  boxShadow: `0 0 14px ${s.accent}33`,
                                }}>
                                  <s.Icon size={15} />
                                </span>
                                <span style={{
                                  fontSize: 9.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
                                  color: "rgba(226,238,249,0.7)", lineHeight: 1.2,
                                }}>
                                  {s.label}
                                </span>
                              </div>
                              <div style={{
                                fontSize: 36, fontWeight: 900, color: "#fff",
                                fontFamily: "'Sora', 'Inter', sans-serif",
                                fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em",
                                lineHeight: 1, marginBottom: 6,
                                textShadow: `0 2px 14px ${s.accent}33`,
                                position: "relative", zIndex: 1,
                              }}>
                                {s.value}
                              </div>
                              <div style={{
                                fontSize: 11, color: "rgba(226,238,249,0.72)", fontWeight: 600,
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                position: "relative", zIndex: 1,
                              }}>
                                {s.sub}
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>

                      {/* Bottom glassmorphic stat ribbon */}
                      <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.7 }}
                        style={{
                          display: "none",
                          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
                          gap: 1,
                          background: "rgba(255,255,255,0.10)",
                          border: "1px solid rgba(255,255,255,0.18)",
                          backdropFilter: "blur(14px)",
                          borderRadius: 16, overflow: "hidden",
                          marginTop: 22,
                        }}
                      >
                        {[
                          { Icon: Calendar,        label: "Upcoming Events", value: upcomingEvents.length,                       sub: nextEv ? new Date(nextEv.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "No events" },
                          { Icon: Users,           label: "Registrations",   value: totalRegistrations.toLocaleString(),         sub: totalCapacity ? `${fillRate}% of capacity` : "-" },
                          { Icon: ClipboardCheck,  label: "Pending Tasks",   value: pendingTasks,                                sub: `${completedTasks} done · ${overdueCount} late` },
                          { Icon: TrendingUp,      label: "Total Budget",    value: fmtCurrency(totalBudget),                    sub: `${events.length} event${events.length === 1 ? "" : "s"}` },
                        ].map((s, i) => (
                          <div key={i} style={{
                            padding: "14px 18px",
                            background: "rgba(15,42,56,0.30)",
                            display: "flex", alignItems: "center", gap: 12,
                          }}>
                            <span style={{
                              width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                              background: "rgba(255,255,255,0.10)",
                              border: "1px solid rgba(255,255,255,0.18)",
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              color: "#AAC3FC",
                            }}>
                              <s.Icon size={16} />
                            </span>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(226,238,249,0.65)" }}>
                                {s.label}
                              </div>
                              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums", marginTop: 1, letterSpacing: "-0.01em" }}>
                                {s.value}
                              </div>
                              <div style={{ fontSize: 10.5, color: "rgba(226,238,249,0.65)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {s.sub}
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                );
              })()}

              {/* Below-hero section spacing */}
              <div style={{ marginTop: 28 }} />

              {/* CHARTS ROW */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 22, marginBottom: 22 }}>
                <div style={{
                  position: "relative",
                  background: "linear-gradient(180deg, #ffffff, #fbfdff)",
                  border: "1px solid #E2EEF9", borderRadius: 18,
                  padding: "24px 28px",
                  boxShadow: "0 4px 18px rgba(25,54,72,0.06)",
                  overflow: "hidden",
                }}>
                  {/* Top accent strip */}
                  <span aria-hidden style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "linear-gradient(90deg, #193648, #3A70B0, #7AA9D6)",
                  }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 11,
                        background: "linear-gradient(135deg, #193648, #3A70B0)",
                        color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 6px 14px rgba(25,54,72,0.25)",
                      }}>
                        <BarChart3 size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#193648", letterSpacing: "-0.01em" }}>Weekly Task Completions</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Tasks marked done each day this week</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      {(() => {
                        const total = weeklyProgress.reduce((s, d) => s + d.completed, 0);
                        const peak = weeklyProgress.reduce((a, b) => (b.completed > a.completed ? b : a), weeklyProgress[0]);
                        return (
                          <>
                            <span style={{
                              fontSize: 11, fontWeight: 800, color: "#193648",
                              background: "#eff6ff", border: "1px solid #cfe0f0",
                              padding: "5px 11px", borderRadius: 999,
                              display: "inline-flex", alignItems: "center", gap: 6,
                            }}>
                              <CheckCircle size={12} color="#22C55E" /> {total} this week
                            </span>
                            {peak.completed > 0 && (
                              <span style={{
                                fontSize: 11, fontWeight: 800, color: "#c2410c",
                                background: "#fff7ed", border: "1px solid #fed7aa",
                                padding: "5px 11px", borderRadius: 999,
                                display: "inline-flex", alignItems: "center", gap: 6,
                              }}>
                                <TrendingUp size={12} /> Peak: {peak.day} ({peak.completed})
                              </span>
                            )}
                            <span style={{
                              fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
                              color: "#64748b", background: "#f8fbff", border: "1px solid #E2EEF9",
                              padding: "4px 10px", borderRadius: 999,
                            }}>Last 7 days</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <SimpleLineChart data={weeklyProgress} width={620} height={240} />
                </div>

                <div style={{
                  position: "relative",
                  background: "linear-gradient(180deg, #ffffff, #fbfdff)",
                  border: "1px solid #E2EEF9", borderRadius: 18,
                  padding: "24px 28px",
                  boxShadow: "0 4px 18px rgba(25,54,72,0.06)",
                  overflow: "hidden",
                }}>
                  <span aria-hidden style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "linear-gradient(90deg, #193648, #3A70B0, #7AA9D6)",
                  }} />
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 11,
                      background: "linear-gradient(135deg, #193648, #3A70B0)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 6px 14px rgba(25,54,72,0.25)",
                    }}>
                      <Target size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#193648", letterSpacing: "-0.01em" }}>Event Categories</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Distribution across your events</div>
                    </div>
                  </div>
                  {events.length === 0
                    ? <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 13 }}>No events yet</div>
                    : (
                      <>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                          <SimplePieChart items={events} size={160} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {categoryRows.map(([cat, count], i) => {
                            const colors = ["#193648", "#3A70B0", "#7AA9D6", "#2C5F80", "#AAC3FC"];
                            const pct = events.length ? Math.round((count / events.length) * 100) : 0;
                            return (
                              <div key={cat} style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "8px 10px", borderRadius: 10,
                                background: "#f8fbff", border: "1px solid #eef2ff",
                              }}>
                                <span style={{ width: 10, height: 10, borderRadius: "50%", background: colors[i % colors.length], flexShrink: 0, boxShadow: `0 0 0 3px ${colors[i % colors.length]}22` }} />
                                <span style={{ fontSize: 12.5, color: "#0f172a", fontWeight: 700, flex: 1 }}>{cat}</span>
                                <div style={{ flex: 1, height: 5, background: "#E2EEF9", borderRadius: 99, overflow: "hidden", maxWidth: 90 }}>
                                  <div style={{ width: `${pct}%`, height: "100%", background: colors[i % colors.length], borderRadius: 99 }} />
                                </div>
                                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, minWidth: 32, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{pct}%</span>
                                <span style={{ fontSize: 13, fontWeight: 800, color: "#193648", minWidth: 22, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                </div>
              </div>

              {/* RECENT EVENTS + ALERTS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 22 }}>
                <div style={{
                  position: "relative",
                  background: "linear-gradient(180deg, #ffffff, #fbfdff)",
                  border: "1px solid #E2EEF9", borderRadius: 18,
                  padding: "24px 28px",
                  boxShadow: "0 4px 18px rgba(25,54,72,0.06)",
                  overflow: "hidden",
                }}>
                  <span aria-hidden style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "linear-gradient(90deg, #193648, #3A70B0, #7AA9D6)",
                  }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 11,
                        background: "linear-gradient(135deg, #193648, #3A70B0)", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 6px 14px rgba(25,54,72,0.25)",
                      }}>
                        <Calendar size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#193648", letterSpacing: "-0.01em" }}>Upcoming Events</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                          Next on the calendar - edit or invite partners
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setActiveSection("manage")} style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "linear-gradient(135deg, #193648, #2C5F80)", color: "#fff", border: "none",
                      borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                      boxShadow: "0 6px 16px rgba(25,54,72,0.28)",
                      transition: "transform 0.18s ease, box-shadow 0.18s ease",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 10px 22px rgba(25,54,72,0.34)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 16px rgba(25,54,72,0.28)"; }}
                    >View All <ArrowRight size={12} /></button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {upcomingEvents.slice(0, 4).map((ev, idx) => {
                      const dayDiff = Math.ceil((new Date(ev.date) - new Date()) / (1000 * 60 * 60 * 24));
                      return (
                      <motion.div key={ev._id}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.4 }}
                        whileHover={{ x: 3 }}
                        style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "12px 14px", borderRadius: 14,
                          border: "1px solid #eef2ff", background: "linear-gradient(180deg, #f8fbff, #ffffff)",
                          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3A70B0"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(58,112,176,0.15)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#eef2ff"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                          <div style={{
                            width: 60, height: 60, borderRadius: 14,
                            background: `url(${pickEventCover(ev)}) center/cover no-repeat`,
                            color: "#fff", flexShrink: 0,
                            border: "1px solid #E2EEF9",
                            boxShadow: "0 6px 14px rgba(25,54,72,0.18)",
                            position: "relative", overflow: "hidden",
                          }}>
                            <div aria-hidden style={{
                              position: "absolute", inset: 0,
                              background: "linear-gradient(180deg, rgba(15,42,56,0.10) 0%, rgba(15,42,56,0.70) 100%)",
                            }} />
                            <span style={{
                              position: "absolute", top: 5, left: 5, zIndex: 1,
                              fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                              color: "#fff", background: "rgba(15,42,56,0.6)",
                              padding: "2px 6px", borderRadius: 6, backdropFilter: "blur(4px)",
                            }}>
                              {new Date(ev.date).toLocaleDateString("en-GB", { month: "short" })}
                            </span>
                            <span style={{
                              position: "absolute", bottom: 4, left: 0, right: 0, zIndex: 1,
                              textAlign: "center",
                              fontSize: 16, fontWeight: 900, color: "#fff",
                              fontVariantNumeric: "tabular-nums", lineHeight: 1,
                              textShadow: "0 2px 6px rgba(0,0,0,0.4)",
                            }}>
                              {new Date(ev.date).toLocaleDateString("en-GB", { day: "2-digit" })}
                            </span>
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14, letterSpacing: "-0.01em" }}>{ev.name}</div>
                            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              {ev.venue && (<>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                  <MapPin size={11} color="#3A70B0" /> {ev.venue}
                                </span>
                                <span style={{ width: 3, height: 3, borderRadius: 99, background: "#cbd5e1" }} />
                              </>)}
                              <span style={{
                                fontWeight: 700, color: dayDiff <= 0 ? "#be123c" : dayDiff <= 3 ? "#c2410c" : "#3A70B0",
                                background: dayDiff <= 0 ? "#fff1f2" : dayDiff <= 3 ? "#fff7ed" : "#eff6ff",
                                padding: "2px 8px", borderRadius: 99,
                                display: "inline-flex", alignItems: "center", gap: 4,
                              }}>
                                <Clock size={10} /> {dayDiff <= 0 ? "Today" : dayDiff === 1 ? "Tomorrow" : `${dayDiff}d`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <button onClick={() => handleEditEvent(ev)} style={{
                            padding: "7px 12px", borderRadius: 9,
                            background: "#fff", border: "1px solid #e2e8f0", color: "#64748b",
                            fontSize: 12, fontWeight: 600, cursor: "pointer",
                            transition: "all 0.18s ease",
                          }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.color = "#3A70B0"; e.currentTarget.style.borderColor = "#3A70B0"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                          >Edit</button>
                          <button onClick={() => setInviteModalOpen(true)} style={{
                            padding: "7px 14px", borderRadius: 9,
                            background: "linear-gradient(135deg, #193648, #2C5F80)", border: "none", color: "#fff",
                            fontSize: 12, fontWeight: 800, cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(25,54,72,0.22)",
                          }}>Invite</button>
                        </div>
                      </motion.div>
                      );
                    })}
                    {upcomingEvents.length === 0 && (
                      <div style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 13 }}>No upcoming events - create one to get started.</div>
                    )}
                  </div>
                </div>

                <div style={{
                  position: "relative",
                  background: "linear-gradient(180deg, #ffffff, #fbfdff)",
                  border: "1px solid #E2EEF9", borderRadius: 18,
                  padding: "24px 28px",
                  boxShadow: "0 4px 18px rgba(25,54,72,0.06)",
                  overflow: "hidden",
                }}>
                  <span aria-hidden style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "linear-gradient(90deg, #ef4444, #f59e0b, #fbbf24)",
                  }} />
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 11,
                      background: "linear-gradient(135deg, #ef4444, #f59e0b)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 6px 14px rgba(239,68,68,0.25)",
                    }}>
                      <AlertCircle size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#193648", letterSpacing: "-0.01em" }}>Deadline Alerts</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Overdue or due soon</div>
                    </div>
                  </div>
                  {deadlineAlerts.length === 0
                    ? (
                      <div style={{
                        textAlign: "center", padding: "32px 16px",
                        background: "linear-gradient(180deg, #f0fdf4, #ffffff)",
                        border: "1px solid #bbf7d0", borderRadius: 14,
                      }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 14,
                          background: "linear-gradient(135deg, #22c55e, #15803d)", color: "#fff",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          marginBottom: 10, boxShadow: "0 6px 14px rgba(34,197,94,0.30)",
                        }}>
                          <CheckCircle size={22} />
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#15803d" }}>All clear ✓</div>
                        <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 3 }}>No urgent deadlines right now.</div>
                      </div>
                    )
                    : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {deadlineAlerts.slice(0, 4).map((a, idx) => {
                          const isOverdue = new Date(a.deadline) < new Date();
                          return (
                            <motion.div key={a._id}
                              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05, duration: 0.4 }}
                              style={{
                                position: "relative",
                                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
                                padding: "12px 14px", borderRadius: 12,
                                border: `1px solid ${isOverdue ? "#fecaca" : "#fed7aa"}`,
                                background: isOverdue
                                  ? "linear-gradient(180deg, #fff1f2, #ffffff)"
                                  : "linear-gradient(180deg, #fff7ed, #ffffff)",
                                overflow: "hidden",
                              }}>
                              <span aria-hidden style={{
                                position: "absolute", top: 0, bottom: 0, left: 0, width: 3,
                                background: isOverdue
                                  ? "linear-gradient(180deg, #ef4444, #be123c)"
                                  : "linear-gradient(180deg, #f59e0b, #c2410c)",
                              }} />
                              <div style={{ minWidth: 0, flex: 1, paddingLeft: 6 }}>
                                <div style={{ fontWeight: 800, fontSize: 13, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                                <div style={{ fontSize: 11.5, color: isOverdue ? "#be123c" : "#c2410c", marginTop: 3, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
                                  {isOverdue ? <AlertCircle size={11} /> : <Clock size={11} />}
                                  {isOverdue ? "Overdue" : "Due soon"} · {new Date(a.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                                </div>
                              </div>
                              <button onClick={() => markTaskDone(a._id)} title="Mark done" style={{
                                padding: "7px 12px", borderRadius: 9,
                                background: "linear-gradient(135deg, #193648, #2C5F80)", color: "#fff", border: "none",
                                fontSize: 11.5, fontWeight: 800, cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(25,54,72,0.22)",
                                display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0,
                              }}>
                                <CheckCircle size={11} /> Done
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                </div>
              </div>

              {/* QUICK ACTIONS + RECENT ACTIVITY */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 22, marginTop: 22 }}>
                {/* Quick Actions */}
                <div style={{
                  position: "relative",
                  background: "linear-gradient(180deg, #ffffff, #fbfdff)",
                  border: "1px solid #E2EEF9", borderRadius: 18,
                  padding: "24px 28px",
                  boxShadow: "0 4px 18px rgba(25,54,72,0.06)",
                  overflow: "hidden",
                }}>
                  <span aria-hidden style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "linear-gradient(90deg, #193648, #3A70B0, #7AA9D6)",
                  }} />
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 11,
                      background: "linear-gradient(135deg, #193648, #3A70B0)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 6px 14px rgba(25,54,72,0.25)",
                    }}>
                      <Zap size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#193648", letterSpacing: "-0.01em" }}>Quick Actions</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Jump to common tasks</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { Icon: Plus,             label: "Create Event",       desc: "Plan a new co-curricular event", onClick: () => { setActiveSection("create"); setShowEventForm(true); } },
                      { Icon: ClipboardCheck,   label: "Add Task",           desc: "Assign a responsibility",         onClick: () => { setActiveSection("responsibilities"); setShowAddTaskForm(true); } },
                      { Icon: Mail,             label: "Send Invitations",   desc: "Email industry partners",         onClick: () => { setActiveSection("invitations"); setInviteModalOpen(true); } },
                      { Icon: Edit,             label: "Manage Events",      desc: "Edit, delete or update events",   onClick: () => setActiveSection("manage") },
                    ].map((a, i) => (
                      <button key={i} onClick={a.onClick} style={{
                        display: "flex", alignItems: "center", gap: 12, width: "100%",
                        padding: "12px 14px", borderRadius: 12,
                        background: "#f8fbff", border: "1px solid #E2EEF9", cursor: "pointer",
                        transition: "all 0.18s ease", textAlign: "left",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#E2EEF9"; e.currentTarget.style.borderColor = "#3A70B0"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fbff"; e.currentTarget.style.borderColor = "#E2EEF9"; }}
                      >
                        <span style={{
                          width: 36, height: 36, borderRadius: 10,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "linear-gradient(135deg, #193648, #3A70B0)", color: "#fff",
                          flexShrink: 0,
                        }}>
                          <a.Icon size={16} />
                        </span>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{a.label}</div>
                          <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>{a.desc}</div>
                        </span>
                        <ArrowRight size={14} color="#94a3b8" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{
                  position: "relative",
                  background: "linear-gradient(180deg, #ffffff, #fbfdff)",
                  border: "1px solid #E2EEF9", borderRadius: 18,
                  padding: "24px 28px",
                  boxShadow: "0 4px 18px rgba(25,54,72,0.06)",
                  overflow: "hidden",
                }}>
                  <span aria-hidden style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "linear-gradient(90deg, #193648, #3A70B0, #7AA9D6)",
                  }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 11,
                        background: "linear-gradient(135deg, #193648, #3A70B0)", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 6px 14px rgba(25,54,72,0.25)",
                      }}>
                        <Bell size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#193648", letterSpacing: "-0.01em" }}>Recent Activity</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                          Latest notifications across events, tasks &amp; invitations
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
                      color: "#fff", background: "linear-gradient(135deg, #193648, #3A70B0)",
                      padding: "5px 11px", borderRadius: 999,
                      boxShadow: "0 4px 12px rgba(25,54,72,0.25)",
                    }}>{notifications.filter(n => !n.seen).length} unread</span>
                  </div>

                  {recentActivity.length === 0 ? (
                    <EmptyState icon={Bell} text="No activity yet - your event & task updates will show here." />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {recentActivity.map((n) => {
                        const ts  = new Date(n.createdAt || n.date || Date.now());
                        const tag = (n.type || "info").toLowerCase();
                        const palette = {
                          event:  { bg: "#E2EEF9", color: "#193648", Icon: Calendar },
                          task:   { bg: "#fff7ed", color: "#c2410c", Icon: ClipboardCheck },
                          invite: { bg: "#f0fdf4", color: "#15803d", Icon: Mail },
                          info:   { bg: "#f1f5f9", color: "#475569", Icon: Bell },
                        };
                        const p = palette[tag] || palette.info;
                        return (
                          <div key={n._id} style={{
                            display: "flex", gap: 12, alignItems: "flex-start",
                            padding: "12px 14px", borderRadius: 12,
                            border: `1px solid ${n.seen ? "#eef2ff" : p.bg}`,
                            background: n.seen ? "#fff" : "#f8fbff",
                          }}>
                            <span style={{
                              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              background: p.bg, color: p.color,
                            }}>
                              <p.Icon size={15} />
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>
                                {n.title || n.text || "Notification"}
                              </div>
                              <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
                                <span style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: p.color }}>{tag}</span>
                                {" · "}{ts.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                            {!n.seen && (
                              <button onClick={() => markNotificationSeen(n._id)} title="Mark as read" style={{
                                padding: "5px 9px", borderRadius: 7,
                                background: "#fff", border: "1px solid #e2e8f0", color: "#64748b",
                                fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0,
                              }}>Mark</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* RESPONSIBILITIES */}
          {activeSection === "responsibilities" && (
            <>
              {/* Toolbar */}
              <div style={{
                background: "#fff", border: "1px solid #E2EEF9", borderRadius: 16,
                padding: "14px 18px", marginBottom: 18,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                gap: 12, flexWrap: "wrap",
                boxShadow: "0 4px 18px rgba(25,54,72,0.06)",
              }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    { id: "all",       label: "Total",     count: tasks.length,                                                color: "#193648" },
                    { id: "pending",   label: "Pending",   count: tasks.filter((t) => (t.progress || 0) < 100).length,         color: "#F59E0B" },
                    { id: "completed", label: "Completed", count: tasks.filter((t) => (t.progress || 0) >= 100).length,        color: "#22C55E" },
                    { id: "overdue",   label: "Overdue",   count: overdueCount,                                                color: "#EF4444" },
                  ].map((s) => {
                    const active = taskFilter === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setTaskFilter(s.id)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 8,
                          padding: "8px 14px", borderRadius: 8,
                          background: active ? `${s.color}14` : "#fff",
                          border: active ? `1px solid ${s.color}` : "1px solid #E2EEF9",
                          cursor: "pointer",
                          transition: "background 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
                          boxShadow: active ? `0 4px 12px ${s.color}22` : "none",
                        }}
                        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#f8fbff"; }}
                        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "#fff"; }}
                      >
                        <span style={{
                          width: 8, height: 8, borderRadius: 99,
                          background: s.color,
                          boxShadow: `0 0 0 3px ${s.color}22`,
                        }} />
                        <span style={{
                          fontSize: 11.5,
                          color: active ? s.color : "#94a3b8",
                          fontWeight: 800,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}>
                          {s.label}
                        </span>
                        <span style={{
                          fontSize: 14, fontWeight: 800,
                          color: active ? s.color : "#193648",
                          fontVariantNumeric: "tabular-nums",
                        }}>
                          {s.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setShowAddTaskForm(!showAddTaskForm)}
                  style={{
                    padding: "9px 18px",
                    borderRadius: 10,
                    background: showAddTaskForm ? "#ef4444" : "#193648",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontWeight: 700,
                    fontSize: 13,
                    boxShadow: showAddTaskForm
                      ? "0 8px 18px rgba(239,68,68,0.25)"
                      : "0 8px 18px rgba(25,54,72,0.25)",
                    transition: "all 0.25s ease",
                  }}
                >
                  {showAddTaskForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Task</>}
                </button>
              </div>

              {/* Inline Add Task Form - polished */}
              <AnimatePresence>
                {showAddTaskForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0,  scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.985 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: "relative",
                      background: "#fff",
                      padding: "26px 28px 24px",
                      borderRadius: 18,
                      marginBottom: 20,
                      border: "1px solid #E2EEF9",
                      boxShadow: "0 12px 32px rgba(25,54,72,0.10), 0 1px 2px rgba(25,54,72,0.04)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Top gradient accent */}
                    <span aria-hidden style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      background: "linear-gradient(90deg, #193648, #3A70B0, #7AA9D6, #3A70B0, #193648)",
                      backgroundSize: "220% 100%",
                    }} />

                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: "linear-gradient(135deg, #193648, #3A70B0)",
                        color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 18px rgba(25,54,72,0.25)",
                        flexShrink: 0,
                      }}>
                        <ClipboardCheck size={20} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#193648", letterSpacing: "-0.01em" }}>
                          Add New Task
                        </h3>
                        <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#94a3b8" }}>
                          Assign a responsibility to a faculty member - pick from suggestions and email auto-fills.
                        </p>
                      </div>
                    </div>

                    {/* Fields */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <FieldLabel required>Task Title</FieldLabel>
                        <AutocompleteInput
                          value={newTaskForm.title}
                          onChange={(v) => setNewTaskForm((p) => ({ ...p, title: v }))}
                          suggestions={TASK_TITLE_SUGGESTIONS}
                          placeholder="Type task title - or pick a common one"
                          icon={Sparkles}
                        />
                      </div>

                      <div>
                        <FieldLabel required>Assigned To</FieldLabel>
                        <AutocompleteInput
                          value={newTaskForm.assignedTo}
                          onChange={(v) => setNewTaskForm((p) => ({ ...p, assignedTo: v }))}
                          people={KNOWN_COORDINATORS}
                          placeholder="Type name"
                          icon={User}
                          onPick={(person) => {
                            // Picking a person fills both the name AND the email in one go.
                            setNewTaskForm((p) => ({
                              ...p,
                              assignedTo: person.name || "",
                              assignedToEmail: person.email || p.assignedToEmail,
                            }));
                          }}
                        />
                      </div>

                      <div>
                        <FieldLabel>Email</FieldLabel>
                        <AutocompleteInput
                          value={newTaskForm.assignedToEmail}
                          onChange={(v) => setNewTaskForm((p) => ({ ...p, assignedToEmail: v }))}
                          people={KNOWN_COORDINATORS}
                          placeholder="Type email"
                          icon={Mail}
                          type="email"
                          onPick={(person) => {
                            // Picking from the email dropdown also brings the name along.
                            setNewTaskForm((p) => ({
                              ...p,
                              assignedToEmail: person.email || "",
                              assignedTo: p.assignedTo || person.name || "",
                            }));
                          }}
                        />
                      </div>

                      <div style={{ gridColumn: "1 / -1" }}>
                        <FieldLabel required>Deadline</FieldLabel>
                        <div style={{ position: "relative" }}>
                          <Calendar size={14} color="#94a3b8" style={{ position: "absolute", top: 12, left: 12, pointerEvents: "none" }} />
                          <input
                            type="date"
                            value={newTaskForm.deadline}
                            onChange={(e) => setNewTaskForm({ ...newTaskForm, deadline: e.target.value })}
                            min={new Date().toISOString().split("T")[0]}
                            style={{
                              width: "100%", padding: "11px 12px 11px 36px",
                              borderRadius: 10, border: "1px solid #E2EEF9", outline: "none",
                              fontSize: 13.5, color: "#0f172a", background: "#fff",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ gridColumn: "1 / -1" }}>
                        <FieldLabel>Description</FieldLabel>
                        <textarea
                          value={newTaskForm.description}
                          onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                          placeholder="Type description - or pick a template below"
                          style={{
                            width: "100%", padding: "11px 12px",
                            borderRadius: 10, border: "1px solid #E2EEF9", outline: "none",
                            fontSize: 13.5, color: "#0f172a", background: "#fff",
                            minHeight: 90, resize: "vertical", boxSizing: "border-box",
                            fontFamily: "inherit", lineHeight: 1.5,
                            transition: "border-color 0.15s ease",
                          }}
                          onFocus={(e) => e.currentTarget.style.borderColor = "#3A70B0"}
                          onBlur={(e)  => e.currentTarget.style.borderColor = "#E2EEF9"}
                        />
                        {/* Description template chips */}
                        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                          <span style={{
                            fontSize: 10, fontWeight: 800, letterSpacing: "0.10em",
                            textTransform: "uppercase", color: "#94a3b8", marginRight: 4,
                          }}>
                            Templates:
                          </span>
                          {TASK_DESCRIPTION_TEMPLATES.map((t) => (
                            <button
                              key={t.label}
                              type="button"
                              onClick={() => setNewTaskForm((p) => ({ ...p, description: t.text }))}
                              style={{
                                padding: "5px 11px", borderRadius: 999,
                                background: "#f8fbff", border: "1px solid #E2EEF9", color: "#193648",
                                fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                                transition: "background 0.15s ease, border-color 0.15s ease",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#E2EEF9"; e.currentTarget.style.borderColor = "#3A70B0"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fbff"; e.currentTarget.style.borderColor = "#E2EEF9"; }}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer / actions */}
                    <div style={{
                      marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap",
                    }}>
                      <div style={{ fontSize: 11.5, color: "#94a3b8" }}>
                        Required fields are marked with <span style={{ color: "#ef4444", fontWeight: 800 }}>*</span>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => {
                            setShowAddTaskForm(false);
                            setNewTaskForm({ title: "", assignedTo: "", assignedToEmail: "", deadline: "", description: "" });
                          }}
                          style={{
                            padding: "10px 18px",
                            borderRadius: 10,
                            border: "1px solid #E2EEF9", background: "#fff", color: "#64748b",
                            cursor: "pointer", fontWeight: 600, fontSize: 13,
                            transition: "background 0.18s ease",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#f8fbff"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddTask}
                          style={{
                            padding: "10px 22px",
                            borderRadius: 10,
                            background: "linear-gradient(135deg, #193648, #3A70B0)",
                            color: "#fff", border: "none", cursor: "pointer",
                            fontWeight: 700, fontSize: 13,
                            display: "inline-flex", alignItems: "center", gap: 7,
                            boxShadow: "0 10px 22px rgba(25,54,72,0.28)",
                            transition: "transform 0.18s ease, box-shadow 0.18s ease",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 14px 26px rgba(25,54,72,0.34)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 10px 22px rgba(25,54,72,0.28)"; }}
                        >
                          <Plus size={14} /> Create Task
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tasks Grid (respects toolbar filter) */}
              {(() => {
                const visibleTasks = tasks.filter((t) => {
                  const done      = (t.progress || 0) >= 100;
                  const isOverdue = new Date(t.deadline) < new Date() && !done;
                  if (taskFilter === "pending")   return !done;
                  if (taskFilter === "completed") return done;
                  if (taskFilter === "overdue")   return isOverdue;
                  return true;
                });

                if (tasks.length === 0) {
                  return <EmptyState icon={ClipboardCheck} text="No responsibilities yet - click 'Add Task' to assign your first one." />;
                }
                if (visibleTasks.length === 0) {
                  const emptyText = {
                    pending:   "No pending tasks - everything is up to date.",
                    completed: "Nothing completed yet.",
                    overdue:   "Great - no overdue tasks!",
                  }[taskFilter] || "No tasks match this filter.";
                  return <EmptyState icon={ClipboardCheck} text={emptyText} />;
                }
                return (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: 18 }}>
                  {visibleTasks.map((task, idx) => {
                    const isDone    = (task.progress || 0) >= 100;
                    const isOverdue = new Date(task.deadline) < new Date() && !isDone;
                    const daysLeft  = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                    const progressBarColor = getProgressBarColor(isDone ? "Completed" : task.status, isOverdue, task.progress);
                    const initials = (task.assignedTo || "?").replace(/^(Ms\.?|Mr\.?|Mrs\.?|Dr\.?|Prof\.?)\s+/i, "")
                      .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

                    const stateChip = isDone
                      ? { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", label: "Completed", Icon: CheckCircle }
                      : isOverdue
                        ? { bg: "#fff1f2", color: "#be123c", border: "#fecdd3", label: "Overdue",   Icon: AlertCircle }
                        : { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa", label: "Pending",   Icon: Clock };

                    return (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -4 }}
                        style={{
                          position: "relative",
                          background: "#fff",
                          border: "1px solid #E2EEF9",
                          borderRadius: 18,
                          boxShadow: "0 6px 22px rgba(25,54,72,0.07), 0 1px 2px rgba(25,54,72,0.04)",
                          transition: "box-shadow 0.25s ease, border-color 0.25s ease",
                          display: "flex",
                          flexDirection: "column",
                          padding: "20px 20px 16px",
                          minHeight: 300,
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = `${stateChip.color}66`;
                          e.currentTarget.style.boxShadow = `0 14px 32px ${stateChip.color}1f, 0 1px 2px rgba(25,54,72,0.06)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E2EEF9";
                          e.currentTarget.style.boxShadow = "0 6px 22px rgba(25,54,72,0.07), 0 1px 2px rgba(25,54,72,0.04)";
                        }}
                      >
                        {/* Soft side accent ribbon */}
                        <span aria-hidden style={{
                          position: "absolute", top: 0, bottom: 0, left: 0, width: 4,
                          background: `linear-gradient(180deg, ${stateChip.color}, ${stateChip.color}66)`,
                          borderRadius: "18px 0 0 18px",
                        }} />

                        {/* Status pill - absolute, fixed corner */}
                        <span style={{
                          position: "absolute", top: 16, right: 16,
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "4px 10px", borderRadius: 999,
                          background: stateChip.bg, color: stateChip.color,
                          border: `1px solid ${stateChip.border}`,
                          fontSize: 9.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
                          whiteSpace: "nowrap",
                          boxShadow: `0 2px 8px ${stateChip.color}22`,
                        }}>
                          <stateChip.Icon size={10} /> {stateChip.label}
                        </span>

                        {/* Title block: avatar + title + assignee - leave room for status pill */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, paddingRight: 96 }}>
                          <span style={{
                            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                            background: "linear-gradient(135deg, #193648, #3A70B0)",
                            color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 800, fontSize: 13.5, letterSpacing: "0.04em",
                            boxShadow: "0 6px 14px rgba(25,54,72,0.22)",
                          }}>{initials}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div title={task.title} style={{
                              fontSize: 15, fontWeight: 800, color: "#0F2A38",
                              lineHeight: 1.3, letterSpacing: "-0.01em",
                              textDecoration: isDone ? "line-through" : "none",
                              opacity: isDone ? 0.6 : 1,
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            }}>
                              {task.title}
                            </div>
                            <div title={task.assignedTo} style={{
                              fontSize: 11.5, color: "#64748b", marginTop: 4,
                              display: "flex", alignItems: "center", gap: 5,
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            }}>
                              <User size={11} style={{ flexShrink: 0 }} />
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                                {task.assignedTo || "Unassigned"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description (renders only when present) - soft left-border accent */}
                        {task.description && (
                          <div style={{
                            fontSize: 12.5, color: "#5b7184",
                            background: "linear-gradient(180deg, #f8fbff, #ffffff)",
                            borderLeft: `3px solid ${stateChip.color}55`,
                            borderRadius: "0 10px 10px 0",
                            padding: "10px 12px",
                            lineHeight: 1.55,
                            marginBottom: 14,
                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}>
                            {task.description}
                          </div>
                        )}

                        {/* Progress bar */}
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.10em", color: "#94a3b8", textTransform: "uppercase" }}>
                              Progress
                            </span>
                            <span style={{ fontSize: 13.5, fontWeight: 800, color: "#193648", fontVariantNumeric: "tabular-nums" }}>
                              {task.progress || 0}%
                            </span>
                          </div>
                          <div style={{ height: 7, background: "#EEF4FB", borderRadius: 999, overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(25,54,72,0.06)" }}>
                            <div style={{
                              width: `${task.progress || 0}%`, height: "100%",
                              background: `linear-gradient(90deg, ${progressBarColor}cc, ${progressBarColor})`,
                              transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                              borderRadius: 999,
                              boxShadow: `0 0 8px ${progressBarColor}55`,
                            }} />
                          </div>
                        </div>

                        {/* Deadline row */}
                        <div style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          gap: 8, marginBottom: 14,
                          padding: "8px 10px",
                          background: "#f8fbff",
                          borderRadius: 9,
                        }}>
                          <span style={{
                            fontSize: 11.5, color: "#64748b",
                            display: "inline-flex", alignItems: "center", gap: 6,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            fontWeight: 600,
                          }}>
                            <Calendar size={12} color="#3A70B0" />
                            {new Date(task.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                          <span style={{
                            fontSize: 10.5, fontWeight: 800, letterSpacing: "0.04em",
                            color: isDone ? "#15803d" : isOverdue ? "#be123c" : daysLeft <= 2 ? "#c2410c" : "#3A70B0",
                            background: isDone ? "#f0fdf4" : isOverdue ? "#fff1f2" : daysLeft <= 2 ? "#fff7ed" : "#eff6ff",
                            padding: "3px 9px", borderRadius: 999,
                            whiteSpace: "nowrap",
                            textTransform: "uppercase",
                          }}>
                            {isDone ? "Completed" : isOverdue ? `${Math.abs(daysLeft)}d late` : daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
                          </span>
                        </div>

                        {/* Actions - pinned to bottom */}
                        <div style={{ display: "flex", gap: 6, paddingTop: 12, borderTop: "1px dashed #E2EEF9", alignItems: "center", marginTop: "auto" }}>
                          {!isDone && (
                            <button onClick={() => markTaskDone(task._id)} title="Mark as done" style={{
                              flex: 1, padding: "9px 10px", borderRadius: 10,
                              background: "linear-gradient(135deg, #193648, #2C5F80)", color: "#fff",
                              border: "none", cursor: "pointer",
                              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                              fontSize: 12, fontWeight: 700,
                              boxShadow: "0 6px 14px rgba(25,54,72,0.22)",
                              transition: "transform 0.18s ease, box-shadow 0.18s ease",
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(25,54,72,0.30)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 14px rgba(25,54,72,0.22)"; }}
                            >
                              <CheckCircle size={12} /> Mark Done
                            </button>
                          )}
                          {!isDone && (
                            <button onClick={() => sendTaskReminder(task)} title="Send reminder email" style={{
                              flex: 1, padding: "9px 10px", borderRadius: 10,
                              background: "#fff", border: "1px solid #E2EEF9", color: "#193648",
                              cursor: "pointer",
                              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                              fontSize: 12, fontWeight: 700,
                              transition: "background 0.18s ease, border-color 0.18s ease, color 0.18s ease",
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#3A70B0"; e.currentTarget.style.color = "#3A70B0"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E2EEF9"; e.currentTarget.style.color = "#193648"; }}
                            >
                              <Mail size={12} /> Remind
                            </button>
                          )}
                          {isDone && (
                            <span style={{
                              flex: 1,
                              padding: "9px 12px", borderRadius: 10,
                              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #bbf7d0",
                              color: "#15803d",
                              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                              fontSize: 12, fontWeight: 800, letterSpacing: "0.04em",
                            }}>
                              <CheckCircle size={13} /> Task Completed
                            </span>
                          )}
                          <button onClick={() => handleEditTask(task)} title="Edit task" style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "#fff", border: "1px solid #E2EEF9", color: "#193648",
                            cursor: "pointer",
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            transition: "background 0.18s ease, border-color 0.18s ease, color 0.18s ease",
                          }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#3A70B0"; e.currentTarget.style.color = "#3A70B0"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E2EEF9"; e.currentTarget.style.color = "#193648"; }}
                          >
                            <Edit size={13} />
                          </button>
                          <button onClick={() => handleDeleteTask(task._id)} title="Delete task" style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "#fff", border: "1px solid #fecdd3", color: "#be123c",
                            cursor: "pointer",
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            transition: "background 0.18s ease, border-color 0.18s ease",
                          }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.borderColor = "#be123c"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#fecdd3"; }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                );
              })()}
            </>
          )}

          {/* CREATE EVENT */}
          {(activeSection === "create" || showEventForm) && (
            <div style={{ paddingTop: 16 }}>
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "relative",
                  background: "linear-gradient(180deg, #ffffff, #fbfdff)",
                  border: "1px solid #E2EEF9", borderRadius: 20,
                  padding: "30px 32px",
                  boxShadow: "0 12px 36px rgba(25,54,72,0.10), 0 2px 6px rgba(25,54,72,0.04)",
                  overflow: "hidden",
                }}>
                {/* Top gradient accent */}
                <span aria-hidden style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 4,
                  background: "linear-gradient(90deg, #193648, #3A70B0, #7AA9D6, #3A70B0, #193648)",
                  backgroundSize: "200% 100%",
                }} />
                {/* Ambient corner glow */}
                <div aria-hidden style={{
                  position: "absolute", top: -90, right: -70,
                  width: 240, height: 240, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(58,112,176,0.10) 0%, rgba(58,112,176,0) 70%)",
                  filter: "blur(30px)", pointerEvents: "none",
                }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 26, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: "linear-gradient(135deg, #193648, #3A70B0)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 10px 22px rgba(25,54,72,0.30)",
                    }}>
                      {editingEvent ? <Edit size={20} /> : <Sparkles size={20} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 20, color: "#193648", letterSpacing: "-0.02em", fontFamily: "'Sora', sans-serif" }}>
                        {editingEvent ? "Edit Event" : "Craft a new event"}
                      </div>
                      <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 3 }}>
                        Smart suggestions auto-fill venues, coordinators &amp; categories from your past events.
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={resetEventForm} style={{
                      padding: "10px 18px", borderRadius: 11, border: "1px solid #E2EEF9",
                      background: "#fff", color: "#64748b", fontWeight: 700, fontSize: 13, cursor: "pointer",
                      transition: "all 0.18s ease",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fbff"; e.currentTarget.style.borderColor = "#3A70B0"; e.currentTarget.style.color = "#3A70B0"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E2EEF9"; e.currentTarget.style.color = "#64748b"; }}
                    >Reset</button>
                    <button onClick={handleCreateOrUpdateEvent} style={{
                      padding: "10px 22px", borderRadius: 11, border: "none",
                      background: "linear-gradient(135deg, #193648, #2C5F80)", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer",
                      boxShadow: "0 12px 24px rgba(25,54,72,0.30)",
                      display: "inline-flex", alignItems: "center", gap: 7,
                      transition: "transform 0.18s ease, box-shadow 0.18s ease",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 16px 30px rgba(25,54,72,0.36)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 12px 24px rgba(25,54,72,0.30)"; }}
                    >
                      {editingEvent ? <><Edit size={13} /> Update Event</> : <><Plus size={13} /> Create Event</>}
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 24 }}>
                  {/* LEFT - fields */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <FieldLabel required>Event Name</FieldLabel>
                      <AutocompleteInput
                        value={newEvent.name}
                        onChange={(v) => setNewEvent((p) => ({ ...p, name: v }))}
                        suggestions={eventNameSuggestions}
                        placeholder="e.g. AI Bootcamp 2025"
                        icon={Sparkles}
                      />
                    </div>

                    <div>
                      <FieldLabel required>Date</FieldLabel>
                      <div style={{ position: "relative" }}>
                        <Calendar size={14} color="#94a3b8"
                          style={{ position: "absolute", top: 12, left: 12, pointerEvents: "none" }} />
                        <input
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent((p) => ({ ...p, date: e.target.value }))}
                          style={{
                            width: "100%", padding: "11px 12px 11px 36px",
                            borderRadius: 10, border: "1px solid #E2EEF9", outline: "none",
                            fontSize: 13.5, color: "#0f172a", background: "#fff", boxSizing: "border-box",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <FieldLabel required>Category</FieldLabel>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {EVENT_CATEGORIES.map((c) => {
                          const active = newEvent.category === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setNewEvent((p) => ({ ...p, category: c }))}
                              style={{
                                padding: "7px 12px", borderRadius: 999,
                                border: active ? "1px solid #193648" : "1px solid #E2EEF9",
                                background: active ? "#193648" : "#fff",
                                color: active ? "#fff" : "#64748b",
                                fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em",
                                cursor: "pointer", transition: "all 0.18s ease",
                              }}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <FieldLabel required>Venue</FieldLabel>
                      <AutocompleteInput
                        value={newEvent.venue}
                        onChange={(v) => setNewEvent((p) => ({ ...p, venue: v }))}
                        suggestions={venueSuggestions}
                        placeholder="e.g. Riphah Auditorium, Block C"
                        icon={MapPin}
                      />
                    </div>

                    <div>
                      <FieldLabel required>Expected Attendance</FieldLabel>
                      <div style={{ position: "relative" }}>
                        <Users size={14} color="#94a3b8"
                          style={{ position: "absolute", top: 12, left: 12, pointerEvents: "none" }} />
                        <input
                          type="number" min="0"
                          value={newEvent.expected}
                          onChange={(e) => setNewEvent((p) => ({ ...p, expected: e.target.value }))}
                          placeholder="120"
                          style={{
                            width: "100%", padding: "11px 12px 11px 36px",
                            borderRadius: 10, border: "1px solid #E2EEF9", outline: "none",
                            fontSize: 13.5, color: "#0f172a", background: "#fff", boxSizing: "border-box",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Budget (Rs)</FieldLabel>
                      <div style={{ position: "relative" }}>
                        <TrendingUp size={14} color="#94a3b8"
                          style={{ position: "absolute", top: 12, left: 12, pointerEvents: "none" }} />
                        <input
                          type="number" min="0"
                          value={newEvent.budget}
                          onChange={(e) => setNewEvent((p) => ({ ...p, budget: e.target.value }))}
                          placeholder="50000"
                          style={{
                            width: "100%", padding: "11px 12px 11px 36px",
                            borderRadius: 10, border: "1px solid #E2EEF9", outline: "none",
                            fontSize: 13.5, color: "#0f172a", background: "#fff", boxSizing: "border-box",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <FieldLabel required>Coordinator</FieldLabel>
                      <AutocompleteInput
                        value={newEvent.coordinator}
                        onChange={(v) => setNewEvent((p) => ({ ...p, coordinator: v }))}
                        people={KNOWN_COORDINATORS}
                        placeholder="Type or pick - try “Habiba”, “Sabahat”, “Amna”…"
                        icon={User}
                        onPick={(person) => {
                          setNewEvent((p) => ({
                            ...p,
                            coordinator: person.name || "",
                            email: person.email || p.email,
                          }));
                        }}
                      />
                    </div>

                    <div>
                      <FieldLabel>Coordinator Email</FieldLabel>
                      <AutocompleteInput
                        value={newEvent.email}
                        onChange={(v) => setNewEvent((p) => ({ ...p, email: v }))}
                        people={KNOWN_COORDINATORS}
                        placeholder="coordinator@riphah.edu.pk"
                        icon={Mail}
                        type="email"
                        onPick={(person) => {
                          setNewEvent((p) => ({
                            ...p,
                            email: person.email || "",
                            coordinator: p.coordinator || person.name || "",
                          }));
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <FieldLabel>Description</FieldLabel>
                      <textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))}
                        placeholder="What's the event about? Who is it for?"
                        style={{
                          width: "100%", padding: "11px 12px",
                          borderRadius: 10, border: "1px solid #E2EEF9", outline: "none",
                          fontSize: 13.5, color: "#0f172a", background: "#fff",
                          minHeight: 90, resize: "vertical", boxSizing: "border-box",
                          fontFamily: "inherit",
                        }}
                      />
                    </div>
                  </div>

                  {/* RIGHT - Poster + summary */}
                  <div>
                    <FieldLabel>Poster</FieldLabel>
                    <div style={{
                      border: "2px dashed #CFE0F0", borderRadius: 14,
                      background: "#f8fbff", padding: 14, minHeight: 220,
                      display: "flex", flexDirection: "column", gap: 12,
                      alignItems: "center", justifyContent: "center",
                    }}>
                      {newEvent.posterPreview ? (
                        <img src={newEvent.posterPreview} alt="poster"
                          style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 10 }} />
                      ) : (
                        <div style={{ textAlign: "center", color: "#64748b", fontSize: 12.5, width: "100%" }}>
                          <div style={{
                            position: "relative",
                            width: "100%", height: 150, borderRadius: 12, marginBottom: 10,
                            background: `url(${pickEventCover({ category: newEvent.category })}) center/cover no-repeat`,
                            border: "1px solid #E2EEF9",
                            overflow: "hidden",
                          }}>
                            <div aria-hidden style={{
                              position: "absolute", inset: 0,
                              background: "linear-gradient(180deg, rgba(15,42,56,0) 40%, rgba(15,42,56,0.65))",
                            }} />
                            <div style={{
                              position: "absolute", left: 12, bottom: 10,
                              fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em",
                              textTransform: "uppercase", color: "#fff",
                              textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                            }}>
                              Default · {newEvent.category || "Pick a category"}
                            </div>
                          </div>
                          Drag &amp; drop or upload your own poster
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 8 }}>
                        <input ref={posterRef} id="poster" type="file" accept="image/*"
                          style={{ display: "none" }} onChange={onPosterChange} />
                        <label
                          htmlFor="poster"
                          onClick={() => posterRef.current && posterRef.current.click()}
                          style={{
                            padding: "8px 14px", borderRadius: 8,
                            background: "#193648", color: "#fff", cursor: "pointer",
                            fontSize: 12.5, fontWeight: 700,
                            display: "inline-flex", alignItems: "center", gap: 6,
                          }}
                        >
                          <Paperclip size={13} /> Choose Image
                        </label>
                        {newEvent.posterPreview && (
                          <button onClick={() => setNewEvent((p) => ({ ...p, posterFile: null, posterPreview: null }))}
                            style={{
                              padding: "8px 12px", borderRadius: 8,
                              border: "1px solid #fecdd3", color: "#be123c", background: "#fff",
                              fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                              display: "inline-flex", alignItems: "center", gap: 5,
                            }}>
                            <Trash2 size={13} /> Remove
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Live preview tile */}
                    <div style={{
                      marginTop: 16,
                      background: "#fff",
                      border: "1px solid #E2EEF9", borderRadius: 14,
                      overflow: "hidden",
                      boxShadow: "0 4px 14px rgba(25,54,72,0.05)",
                    }}>
                      <div style={{
                        position: "relative",
                        height: 92,
                        background: `url(${newEvent.posterPreview || pickEventCover({ category: newEvent.category })}) center/cover no-repeat`,
                      }}>
                        <div aria-hidden style={{
                          position: "absolute", inset: 0,
                          background: "linear-gradient(180deg, rgba(15,42,56,0.05), rgba(15,42,56,0.55))",
                        }} />
                        <div style={{
                          position: "absolute", top: 10, left: 12,
                          fontSize: 9.5, fontWeight: 800, letterSpacing: "0.12em",
                          textTransform: "uppercase", color: "#fff",
                          background: "rgba(255,255,255,0.18)",
                          padding: "3px 9px", borderRadius: 999,
                          border: "1px solid rgba(255,255,255,0.25)",
                          backdropFilter: "blur(6px)",
                        }}>
                          Live Preview
                        </div>
                      </div>
                      <div style={{ padding: "12px 16px 14px" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#193648", lineHeight: 1.3 }}>
                          {newEvent.name || "Untitled Event"}
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 4, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span>{newEvent.date ? new Date(newEvent.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "- Date -"}</span>
                          <span>·</span>
                          <span>{newEvent.venue || "- Venue -"}</span>
                        </div>
                        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {newEvent.category && (
                            <span style={{
                              padding: "3px 9px", borderRadius: 999, fontSize: 10.5, fontWeight: 700,
                              background: "#E2EEF9", color: "#193648", letterSpacing: "0.04em",
                            }}>{newEvent.category}</span>
                          )}
                          {newEvent.expected && (
                            <span style={{
                              padding: "3px 9px", borderRadius: 999, fontSize: 10.5, fontWeight: 700,
                              background: "#f0fdf4", color: "#15803d",
                            }}>{newEvent.expected} expected</span>
                          )}
                          {newEvent.budget && (
                            <span style={{
                              padding: "3px 9px", borderRadius: 999, fontSize: 10.5, fontWeight: 700,
                              background: "#fff7ed", color: "#c2410c",
                            }}>{fmtCurrency(Number(newEvent.budget))}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* MANAGE EVENTS - polished card grid */}
          {activeSection === "manage" && (
            <div style={{ paddingTop: 16 }}>
              {/* Toolbar - premium */}
              <div style={{
                position: "relative",
                background: "linear-gradient(180deg, #ffffff, #fbfdff)",
                border: "1px solid #E2EEF9", borderRadius: 16,
                padding: "14px 18px", marginBottom: 18,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                gap: 12, flexWrap: "wrap",
                boxShadow: "0 4px 18px rgba(25,54,72,0.06)",
                overflow: "hidden",
              }}>
                <span aria-hidden style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: "linear-gradient(90deg, #193648, #3A70B0, #7AA9D6)",
                }} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { id: "all",       label: "Total",     color: "#193648" },
                    { id: "upcoming",  label: "Upcoming",  color: "#3A70B0" },
                    { id: "ongoing",   label: "Ongoing",   color: "#22C55E" },
                    { id: "completed", label: "Completed", color: "#64748b" },
                    { id: "cancelled", label: "Cancelled", color: "#EF4444" },
                  ].map((s) => {
                    const count = s.id === "all" ? events.length : events.filter((e) => (e.status || "upcoming") === s.id).length;
                    const active = (manageFilter || "all") === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setManageFilter(s.id)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 8,
                          padding: "8px 14px", borderRadius: 8,
                          background: active ? `${s.color}14` : "#fff",
                          border: active ? `1px solid ${s.color}` : "1px solid #E2EEF9",
                          cursor: "pointer",
                          transition: "background 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
                          boxShadow: active ? `0 4px 12px ${s.color}22` : "none",
                        }}
                        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#f8fbff"; }}
                        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "#fff"; }}
                      >
                        <span style={{
                          width: 8, height: 8, borderRadius: 99,
                          background: s.color,
                          boxShadow: `0 0 0 3px ${s.color}22`,
                        }} />
                        <span style={{
                          fontSize: 11.5,
                          color: active ? s.color : "#94a3b8",
                          fontWeight: 800,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}>
                          {s.label}
                        </span>
                        <span style={{
                          fontSize: 14, fontWeight: 800,
                          color: active ? s.color : "#193648",
                          fontVariantNumeric: "tabular-nums",
                        }}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => { setActiveSection("create"); setShowEventForm(true); resetEventForm(); }} style={{
                  padding: "10px 20px", borderRadius: 11, border: "none",
                  background: "linear-gradient(135deg, #193648, #2C5F80)", color: "#fff",
                  fontWeight: 800, fontSize: 13, cursor: "pointer",
                  boxShadow: "0 10px 22px rgba(25,54,72,0.28)",
                  display: "inline-flex", alignItems: "center", gap: 7,
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 14px 28px rgba(25,54,72,0.34)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 10px 22px rgba(25,54,72,0.28)"; }}
                >
                  <Plus size={13} /> New Event
                </button>
              </div>

              {eventsLoading && events.length === 0 ? (
                <div style={{
                  background: "#fff", border: "1px solid #E2EEF9", borderRadius: 18,
                  padding: 60, textAlign: "center", color: "#94a3b8",
                }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    style={{ display: "inline-block", marginBottom: 12 }}>
                    <RefreshCw size={26} color="#3A70B0" />
                  </motion.div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>Loading events from the database...</div>
                </div>
              ) : events.length === 0 ? (
                <EmptyState icon={Calendar} text="No events yet - create your first one to get started." />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 18 }}>
                  {events
                    .filter((ev) => (manageFilter && manageFilter !== "all") ? (ev.status || "upcoming") === manageFilter : true)
                    .map((ev) => {
                      const status   = ev.status || "upcoming";
                      const palette  = {
                        upcoming:  { bg: "#E2EEF9", color: "#193648", label: "Upcoming"  },
                        ongoing:   { bg: "#f0fdf4", color: "#15803d", label: "Ongoing"   },
                        completed: { bg: "#f1f5f9", color: "#475569", label: "Completed" },
                        cancelled: { bg: "#fff1f2", color: "#be123c", label: "Cancelled" },
                      }[status] || { bg: "#E2EEF9", color: "#193648", label: status };
                      const fillPct = ev.expected ? Math.min(100, Math.round(((ev.registered || 0) / ev.expected) * 100)) : 0;

                      return (
                        <motion.div key={ev._id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                          position: "relative",
                          background: "#fff", border: "1px solid #E2EEF9", borderRadius: 18,
                          overflow: "hidden", boxShadow: "0 6px 22px rgba(25,54,72,0.07)",
                          display: "flex", flexDirection: "column",
                          transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s, border-color 0.25s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 18px 36px ${palette.color}25`; e.currentTarget.style.borderColor = `${palette.color}55`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 22px rgba(25,54,72,0.07)"; e.currentTarget.style.borderColor = "#E2EEF9"; }}
                        >
                          {/* Cover */}
                          <div style={{
                            height: 140, position: "relative",
                            background: `url(${pickEventCover(ev)}) center/cover no-repeat`,
                          }}>
                            <div aria-hidden style={{
                              position: "absolute", inset: 0,
                              background: "linear-gradient(180deg, rgba(15,42,56,0.05) 0%, rgba(15,42,56,0.35) 60%, rgba(15,42,56,0.78) 100%)",
                            }} />
                            <span style={{
                              position: "absolute", top: 12, left: 12,
                              padding: "4px 10px", borderRadius: 999,
                              background: palette.bg, color: palette.color,
                              fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              boxShadow: "0 4px 10px rgba(15,42,56,0.25)",
                            }}>{palette.label}</span>
                            {ev.category && (
                              <span style={{
                                position: "absolute", top: 12, right: 12,
                                padding: "4px 10px", borderRadius: 999,
                                background: "rgba(255,255,255,0.95)", color: "#193648",
                                fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                boxShadow: "0 4px 10px rgba(15,42,56,0.20)",
                              }}>{ev.category}</span>
                            )}
                            <div style={{
                              position: "absolute", bottom: 12, left: 14, right: 14,
                              color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 10,
                            }}>
                              <div style={{
                                fontWeight: 800, fontSize: 13.5, letterSpacing: "-0.01em",
                                display: "inline-flex", alignItems: "center", gap: 6,
                                textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                              }}>
                                <Calendar size={14} />
                                {new Date(ev.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                              </div>
                              {ev.venue && (
                                <div style={{
                                  fontSize: 11.5, fontWeight: 600,
                                  color: "rgba(255,255,255,0.85)",
                                  display: "inline-flex", alignItems: "center", gap: 5,
                                  textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "55%",
                                }}>
                                  <MapPin size={11} /> {ev.venue}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Body */}
                          <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", lineHeight: 1.3 }}>{ev.name}</div>
                              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, display: "flex", gap: 10, flexWrap: "wrap" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                  <Clock size={11} /> {new Date(ev.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                                </span>
                                {ev.venue && (
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                    <MapPin size={11} /> {ev.venue}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Registration progress */}
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 4 }}>
                                <span style={{ fontWeight: 700 }}>{(ev.registered || 0)} / {ev.expected || 0} registered</span>
                                <span style={{ fontWeight: 700, color: "#193648" }}>{fillPct}%</span>
                              </div>
                              <div style={{ height: 6, borderRadius: 999, background: "#eef2ff", overflow: "hidden" }}>
                                <div style={{
                                  height: "100%", width: `${fillPct}%`,
                                  background: fillPct >= 80 ? "#15803d" : fillPct >= 40 ? "#3A70B0" : "#7AA9D6",
                                  transition: "width 0.4s ease",
                                }} />
                              </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>
                                  Coordinator
                                </div>
                                <div style={{ fontSize: 12.5, color: "#0f172a", fontWeight: 700, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {ev.coordinator || "-"}
                                </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>
                                  Budget
                                </div>
                                <div style={{ fontSize: 12.5, color: "#193648", fontWeight: 800, marginTop: 2 }}>
                                  {fmtCurrency(Number(ev.budget) || 0)}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: 6, marginTop: "auto", paddingTop: 10, borderTop: "1px solid #eef2ff" }}>
                              <button onClick={() => handleEditEvent(ev)} title="Edit" style={{
                                flex: 1, padding: "8px 10px", borderRadius: 9,
                                background: "#fff", border: "1px solid #E2EEF9", color: "#193648",
                                fontSize: 12, fontWeight: 700, cursor: "pointer",
                                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
                              }}>
                                <Edit size={12} /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  // Jump to Invitations screen with this event auto-selected
                                  setInviteEvent(ev._id);
                                  setInviteMsg(
                                    [
                                      `Dear Esteemed Guest,`,
                                      ``,
                                      `On behalf of the Faculty of Computing - Riphah International University, and powered by the CollaXion Co-Curricular workspace, it is our pleasure to invite you to "${ev.name}".`,
                                      ``,
                                      `📅  Date    : ${new Date(ev.date).toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}`,
                                      ev.venue ? `📍  Venue   : ${ev.venue}` : null,
                                      ev.coordinator ? `🎯  Host    : ${ev.coordinator}` : null,
                                      ``,
                                      `Your presence will add immense value to the discussion and to our students' learning experience. Kindly confirm your attendance at your earliest convenience.`,
                                      ``,
                                      `Warm regards,`,
                                      `Co-Curricular Office · Faculty of Computing`,
                                      `CollaXion Workspace`,
                                    ].filter(Boolean).join("\n")
                                  );
                                  setActiveSection("invitations");
                                  setInviteModalOpen(false);
                                }}
                                title="Invite partners to this event"
                                style={{
                                  flex: 1, padding: "8px 10px", borderRadius: 9,
                                  background: "#193648", border: "1px solid #193648", color: "#fff",
                                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
                                }}
                              >
                                <Send size={12} /> Invite
                              </button>
                              <button onClick={() => handleDeleteEvent(ev._id)} title="Delete" style={{
                                width: 36, height: 36, borderRadius: 9,
                                background: "#fff", border: "1px solid #fecdd3", color: "#be123c",
                                cursor: "pointer",
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                transition: "background 0.18s ease, border-color 0.18s ease",
                              }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.borderColor = "#be123c"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#fecdd3"; }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* INVITATIONS - polished, tabbed */}
          {activeSection === "invitations" && (() => {
            const selectedRecipients = recipients.filter((r) => r.selected);
            const tabRecipients = recipients.filter((r) => r.type === recipientTab);
            const filteredRecipients = tabRecipients.filter((r) =>
              !inviteSearch ||
              r.name.toLowerCase().includes(inviteSearch.toLowerCase()) ||
              r.email.toLowerCase().includes(inviteSearch.toLowerCase())
            );
            const allSelected = tabRecipients.length > 0 && tabRecipients.every((r) => r.selected);
            const pickedEvent = events.find((e) => e._id === inviteEvent) || events[0];
            const initials = (n = "") =>
              n.replace(/^(Ms\.?|Mr\.?|Mrs\.?|Dr\.?|Prof\.?|Engr\.?|Sir|Madam)\s+/i, "")
               .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
            const avatarBg = (i) => ["#193648", "#3A70B0", "#7AA9D6", "#2C5F80", "#0F2A38"][i % 5];
            const tabCounts = {
              industry: industryPartners.length,
              faculty: FACULTY_MEMBERS.length,
            };
            const tabSelectedCounts = {
              industry: recipients.filter((r) => r.type === "industry" && r.selected).length,
              faculty:  recipients.filter((r) => r.type === "faculty"  && r.selected).length,
            };
            const TABS = [
              { id: "industry", label: "Industry Partners", icon: Building2 },
              { id: "faculty",  label: "Faculty Members",   icon: GraduationCap },
            ];

            return (
              <div style={{ paddingTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 22 }}>
                {/* LEFT - Recipients */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "relative",
                    background: "linear-gradient(180deg, #ffffff, #fbfdff)",
                    border: "1px solid #E2EEF9", borderRadius: 18,
                    padding: "26px 26px 24px", boxShadow: "0 6px 22px rgba(25,54,72,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <span aria-hidden style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "linear-gradient(90deg, #193648, #3A70B0, #7AA9D6)",
                  }} />
                  <div aria-hidden style={{
                    position: "absolute", top: -80, right: -80,
                    width: 220, height: 220, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(58,112,176,0.10) 0%, rgba(58,112,176,0) 70%)",
                    filter: "blur(28px)", pointerEvents: "none",
                  }} />
                  {/* Page-level header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, position: "relative", zIndex: 1 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 13,
                      background: "#193648", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 8px 18px rgba(25,54,72,0.28)",
                    }}>
                      <Send size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 17, color: "#193648", letterSpacing: "-0.015em", fontFamily: "'Sora', sans-serif" }}>
                        Send invitations
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                        Pick recipients · craft your message · ship it.
                      </div>
                    </div>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "5px 12px", borderRadius: 999,
                      background: selectedRecipients.length > 0 ? "#193648" : "#f8fbff",
                      color: selectedRecipients.length > 0 ? "#fff" : "#94a3b8",
                      border: selectedRecipients.length > 0 ? "1px solid #193648" : "1px solid #E2EEF9",
                      fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                      boxShadow: selectedRecipients.length > 0 ? "0 6px 14px rgba(25,54,72,0.25)" : "none",
                    }}>
                      {selectedRecipients.length} selected
                    </div>
                  </div>
                  {/* Tabs */}
                  <div style={{
                    display: "flex", gap: 4, padding: 4, borderRadius: 14,
                    background: "#f4f7fb", border: "1px solid #E2EEF9", marginBottom: 18,
                  }}>
                    {TABS.map((t) => {
                      const TIcon  = t.icon;
                      const active = recipientTab === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setRecipientTab(t.id)}
                          style={{
                            flex: 1,
                            padding: "10px 14px", borderRadius: 10,
                            background: active ? "#193648" : "transparent",
                            border: "none",
                            cursor: "pointer", display: "inline-flex",
                            alignItems: "center", justifyContent: "center", gap: 8,
                            color: active ? "#fff" : "#5b7184",
                            fontSize: 13, fontWeight: 700, letterSpacing: "0.02em",
                            transition: "background 0.3s, color 0.25s, box-shadow 0.3s",
                            boxShadow: active ? "0 8px 18px rgba(25,54,72,0.25)" : "none",
                          }}
                        >
                          <TIcon size={14} />
                          {t.label}
                          <span style={{
                            padding: "2px 8px", borderRadius: 999,
                            background: active ? "rgba(255,255,255,0.20)" : "rgba(58,112,176,0.10)",
                            color: active ? "#fff" : "#193648",
                            fontSize: 10.5, fontWeight: 800,
                            border: active ? "1px solid rgba(255,255,255,0.30)" : "1px solid rgba(58,112,176,0.18)",
                          }}>
                            {tabSelectedCounts[t.id]}/{tabCounts[t.id]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Subheader + bulk actions */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#193648" }}>
                        {recipientTab === "industry" ? "Registered Industry Partners" : "Faculty Members · FoC"}
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
                        {recipientTab === "industry"
                          ? "Live from your registered partners directory - pick who should attend."
                          : "FoC faculty roster - invite teachers, mentors, and program coordinators."}
                      </div>
                    </div>
                    <button
                      onClick={() => setRecipients((prev) => prev.map((r) => r.type === recipientTab ? { ...r, selected: !allSelected } : r))}
                      style={{
                        padding: "9px 16px", borderRadius: 10,
                        background: allSelected ? "#fff" : "#193648",
                        color: allSelected ? "#193648" : "#fff",
                        border: allSelected ? "1px solid #E2EEF9" : "none",
                        fontSize: 12, fontWeight: 800, cursor: "pointer",
                        boxShadow: allSelected ? "none" : "0 8px 18px rgba(25,54,72,0.25)",
                        transition: "transform 0.18s ease, box-shadow 0.18s ease",
                        display: "inline-flex", alignItems: "center", gap: 6,
                      }}
                      onMouseEnter={(e) => { if (!allSelected) e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={(e) => { if (!allSelected) e.currentTarget.style.transform = ""; }}
                    >
                      {allSelected ? <><X size={11} /> Clear tab</> : <><CheckCircle size={11} /> Select tab</>}
                    </button>
                  </div>

                  {/* Search */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 14px", border: "1px solid #E2EEF9", borderRadius: 12,
                    background: "#f8fbff", marginBottom: 14,
                  }}>
                    <Search size={14} color="#94a3b8" />
                    <input
                      value={inviteSearch}
                      onChange={(e) => setInviteSearch(e.target.value)}
                      placeholder={recipientTab === "industry" ? "Search by company or email..." : "Search by faculty name or email..."}
                      style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#0f172a" }}
                    />
                    {inviteSearch && (
                      <button onClick={() => setInviteSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Recipient cards */}
                  {filteredRecipients.length === 0 ? (
                    <EmptyState
                      icon={recipientTab === "industry" ? Building2 : GraduationCap}
                      text={recipientTab === "industry"
                        ? (industryPartners.length === 0
                            ? "No industry partners loaded."
                            : "No partners match your search.")
                        : "No faculty match your search."}
                    />
                  ) : (
                    <motion.div
                      key={recipientTab}
                      initial={{ opacity: 0, x: recipientTab === "industry" ? -16 : 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}
                    >
                      {filteredRecipients.map((r, i) => {
                        const sel = r.selected;
                        return (
                          <label
                            key={r.id}
                            style={{
                              display: "flex", alignItems: "center", gap: 12,
                              padding: "12px 14px", borderRadius: 12,
                              border: sel ? "1px solid #3A70B0" : "1px solid #E2EEF9",
                              background: sel ? "#f0f7ff" : "#fff",
                              cursor: "pointer",
                              transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.18s",
                              position: "relative",
                              boxShadow: sel ? "0 6px 18px rgba(58,112,176,0.18)" : "0 1px 3px rgba(25,54,72,0.04)",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
                          >
                            {r.photo ? (
                              <img
                                src={r.photo}
                                alt={r.name}
                                onError={(e) => {
                                  // Fallback to UI Avatars (always returns an image with initials)
                                  if (!e.currentTarget.dataset.fallback) {
                                    e.currentTarget.dataset.fallback = "1";
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name.replace(/^(Ms\.?|Mr\.?|Mrs\.?|Dr\.?|Prof\.?)\s+/i, ""))}&background=193648&color=ffffff&bold=true&size=128`;
                                  }
                                }}
                                style={{
                                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                                  objectFit: "cover", display: "block",
                                  border: sel ? "2px solid #3A70B0" : "2px solid #fff",
                                  boxShadow: "0 4px 12px rgba(25,54,72,0.22)",
                                  background: "#fff",
                                }}
                              />
                            ) : (
                              <span style={{
                                width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                                background: avatarBg(i), color: "#fff",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: 13, letterSpacing: "0.04em",
                                boxShadow: "0 4px 10px rgba(25,54,72,0.20)",
                              }}>
                                {initials(r.name)}
                              </span>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {r.name}
                              </div>
                              <div style={{ fontSize: 11.5, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {r.role || r.email}
                              </div>
                              {r.role && (
                                <div style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {r.email}
                                </div>
                              )}
                            </div>
                            <input
                              type="checkbox" checked={sel}
                              onChange={() => setRecipients((prev) => prev.map((p) => p.id === r.id ? { ...p, selected: !p.selected } : p))}
                              style={{
                                width: 18, height: 18, accentColor: "#193648",
                                cursor: "pointer", flexShrink: 0,
                              }}
                            />
                          </label>
                        );
                      })}
                    </motion.div>
                  )}
                </motion.div>

                {/* RIGHT - Composer + Event card */}
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {/* Event picker / preview */}
                  <div style={{
                    background: pickedEvent
                      ? `linear-gradient(135deg, rgba(15,42,56,0.85), rgba(25,54,72,0.78), rgba(44,95,128,0.82)), url(${pickEventCover(pickedEvent)}) center/cover no-repeat`
                      : "linear-gradient(135deg, #0F2A38 0%, #193648 50%, #2C5F80 100%)",
                    borderRadius: 18, padding: "22px 24px", color: "#fff",
                    boxShadow: "0 14px 40px rgba(25,54,72,0.25)", overflow: "hidden", position: "relative",
                  }}>
                    <div aria-hidden style={{
                      position: "absolute", top: -60, right: -60,
                      width: 220, height: 220, borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(226,238,249,0.20), rgba(226,238,249,0))",
                      filter: "blur(20px)", pointerEvents: "none",
                    }} />
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "rgba(226,238,249,0.18)",
                      border: "1px solid rgba(226,238,249,0.25)",
                      padding: "4px 11px", borderRadius: 999,
                      fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "#E2EEF9", marginBottom: 14, position: "relative", zIndex: 1,
                    }}>
                      <Calendar size={12} /> Select Event
                    </div>
                    <select
                      value={inviteEvent}
                      onChange={(e) => {
                        const id = e.target.value;
                        setInviteEvent(id);
                        const ev = events.find((x) => x._id === id);
                        if (ev) setInviteMsg([
                          `Dear Esteemed Guest,`,
                          ``,
                          `On behalf of the Faculty of Computing - Riphah International University, and powered by the CollaXion Co-Curricular workspace, it is our pleasure to invite you to "${ev.name}".`,
                          ``,
                          `📅  Date    : ${new Date(ev.date).toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}`,
                          ev.venue ? `📍  Venue   : ${ev.venue}` : null,
                          ev.coordinator ? `🎯  Host    : ${ev.coordinator}` : null,
                          ``,
                          `Your presence will add immense value to the discussion and to our students' learning experience. Kindly confirm your attendance at your earliest convenience.`,
                          ``,
                          `Warm regards,`,
                          `Co-Curricular Office · Faculty of Computing`,
                          `CollaXion Workspace`,
                        ].filter(Boolean).join("\n"));
                      }}
                      style={{
                        width: "100%", padding: "11px 14px", borderRadius: 10,
                        background: "rgba(255,255,255,0.10)", color: "#fff",
                        border: "1px solid rgba(255,255,255,0.25)", outline: "none",
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        position: "relative", zIndex: 1,
                      }}
                    >
                      <option value="" style={{ color: "#193648" }}>- Choose an event -</option>
                      {events.map((ev) => (
                        <option key={ev._id} value={ev._id} style={{ color: "#193648" }}>{ev.name}</option>
                      ))}
                    </select>
                    {pickedEvent && (
                      <div style={{ marginTop: 14, position: "relative", zIndex: 1 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em" }}>{pickedEvent.name}</div>
                        <div style={{ fontSize: 12, color: "rgba(226,238,249,0.78)", marginTop: 4, display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                            <Clock size={11} /> {new Date(pickedEvent.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                          {pickedEvent.venue && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <MapPin size={11} /> {pickedEvent.venue}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message composer */}
                  <div style={{
                    position: "relative",
                    background: "linear-gradient(180deg, #ffffff, #fbfdff)",
                    border: "1px solid #E2EEF9", borderRadius: 18,
                    padding: "22px 24px", boxShadow: "0 6px 22px rgba(25,54,72,0.07)",
                    overflow: "hidden",
                  }}>
                    <span aria-hidden style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      background: "linear-gradient(90deg, #193648, #3A70B0, #7AA9D6)",
                    }} />
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 11,
                        background: "#193648", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 6px 14px rgba(25,54,72,0.25)",
                      }}>
                        <Mail size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14.5, color: "#193648", letterSpacing: "-0.01em" }}>Compose your message</div>
                        <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>Pick a template or write your own.</div>
                      </div>
                    </div>
                    <FieldLabel>Message</FieldLabel>
                    <textarea
                      value={inviteMsg}
                      onChange={(e) => setInviteMsg(e.target.value)}
                      placeholder="Write your invitation message - or pick an event above to auto-fill."
                      style={{
                        width: "100%", padding: "12px 14px",
                        borderRadius: 10, border: "1px solid #E2EEF9", outline: "none",
                        fontSize: 13, color: "#0f172a", background: "#fff",
                        minHeight: 140, resize: "vertical", boxSizing: "border-box",
                        fontFamily: "inherit", lineHeight: 1.55,
                      }}
                    />

                    {/* Template chips */}
                    <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <span style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginRight: 4, display: "inline-flex", alignItems: "center" }}>
                        Templates:
                      </span>
                      {[
                        {
                          label: "Formal",
                          text: [
                            `Dear Esteemed Guest,`,
                            ``,
                            `On behalf of the Faculty of Computing - Riphah International University, we cordially invite you to ${pickedEvent ? `"${pickedEvent.name}"` : "our upcoming co-curricular engagement"}.`,
                            ``,
                            `Your presence and insights will add great value to our students and the wider FoC community. We hope you will be able to join us.`,
                            ``,
                            `Warm regards,`,
                            `Co-Curricular Office · Faculty of Computing`,
                            `CollaXion Workspace`,
                          ].join("\n"),
                        },
                        {
                          label: "RSVP",
                          text: [
                            `Dear Guest,`,
                            ``,
                            `We are reaching out to confirm your participation in ${pickedEvent ? `"${pickedEvent.name}"` : "our upcoming event"}${pickedEvent?.date ? `, scheduled for ${new Date(pickedEvent.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}` : ""}.`,
                            ``,
                            `Kindly RSVP at your earliest convenience so we may finalise seating, refreshments, and logistics. Your prompt response is most appreciated.`,
                            ``,
                            `Warm regards,`,
                            `Co-Curricular Office · Faculty of Computing`,
                            `CollaXion Workspace`,
                          ].join("\n"),
                        },
                        {
                          label: "Reminder",
                          text: [
                            `Dear Guest,`,
                            ``,
                            `A gentle reminder that ${pickedEvent ? `"${pickedEvent.name}"` : "our upcoming event"} is just around the corner${pickedEvent?.date ? ` - ${new Date(pickedEvent.date).toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long" })}` : ""}.`,
                            ``,
                            `We look forward to welcoming you${pickedEvent?.venue ? ` at ${pickedEvent.venue}` : ""}. Please feel free to reach out if any logistical assistance is required.`,
                            ``,
                            `Warm regards,`,
                            `Co-Curricular Office · Faculty of Computing`,
                            `CollaXion Workspace`,
                          ].join("\n"),
                        },
                      ].map((t) => (
                        <button key={t.label} onClick={() => setInviteMsg(t.text)} style={{
                          padding: "5px 11px", borderRadius: 999,
                          background: "#f8fbff", border: "1px solid #E2EEF9", color: "#193648",
                          fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                        }}>{t.label}</button>
                      ))}
                    </div>

                    <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 11.5, color: "#94a3b8" }}>
                        Sending to <strong style={{ color: "#193648" }}>{selectedRecipients.length}</strong> partner{selectedRecipients.length === 1 ? "" : "s"}
                      </div>
                      <button
                        onClick={() => sendInvites(pickedEvent)}
                        disabled={selectedRecipients.length === 0 || !pickedEvent}
                        style={{
                          padding: "11px 22px", borderRadius: 11, border: "none",
                          background: (selectedRecipients.length === 0 || !pickedEvent) ? "#cbd5e1" : "#193648",
                          color: "#fff", fontWeight: 800, fontSize: 13,
                          cursor: (selectedRecipients.length === 0 || !pickedEvent) ? "not-allowed" : "pointer",
                          boxShadow: (selectedRecipients.length === 0 || !pickedEvent) ? "none" : "0 12px 26px rgba(25,54,72,0.30)",
                          display: "inline-flex", alignItems: "center", gap: 7,
                          transition: "transform 0.18s ease, box-shadow 0.18s ease",
                        }}
                        onMouseEnter={(e) => { if (!(selectedRecipients.length === 0 || !pickedEvent)) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 16px 32px rgba(25,54,72,0.36)"; } }}
                        onMouseLeave={(e) => { if (!(selectedRecipients.length === 0 || !pickedEvent)) { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 12px 26px rgba(25,54,72,0.30)"; } }}
                      >
                        <Send size={13} /> Send Invitations
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* EDIT TASK MODAL */}
          <AnimatePresence>
            {showTaskEditModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "fixed", inset: 0,
                  background: "rgba(2,6,23,0.4)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", zIndex: 1500,
                  padding: 20
                }}
                onClick={() => setShowTaskEditModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  style={{
                    width: 500, maxWidth: "100%",
                    background: "#fff", borderRadius: 12,
                    padding: 24
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: 20
                  }}>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>
                      Edit Task
                    </h3>
                    <button
                      onClick={() => setShowTaskEditModal(false)}
                      style={{
                        background: "none", border: "none",
                        cursor: "pointer", fontSize: 20
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Task Title *
                      </label>
                      <input
                        type="text"
                        value={editTaskForm.title}
                        onChange={(e) => setEditTaskForm({...editTaskForm, title: e.target.value})}
                        style={{
                          width: "100%", padding: 10,
                          border: "1px solid #eef2ff", borderRadius: 8,
                          fontSize: 14
                        }}
                        placeholder="Enter task title"
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Assigned To *
                      </label>
                      <input
                        type="text"
                        value={editTaskForm.assignedTo}
                        onChange={(e) => setEditTaskForm({...editTaskForm, assignedTo: e.target.value})}
                        style={{
                          width: "100%", padding: 10,
                          border: "1px solid #eef2ff", borderRadius: 8,
                          fontSize: 14
                        }}
                        placeholder="Person name"
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={editTaskForm.assignedToEmail}
                        onChange={(e) => setEditTaskForm({...editTaskForm, assignedToEmail: e.target.value})}
                        style={{
                          width: "100%", padding: 10,
                          border: "1px solid #eef2ff", borderRadius: 8,
                          fontSize: 14
                        }}
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Deadline *
                      </label>
                      <input
                        type="date"
                        value={editTaskForm.deadline}
                        onChange={(e) => setEditTaskForm({...editTaskForm, deadline: e.target.value})}
                        style={{
                          width: "100%", padding: 10,
                          border: "1px solid #eef2ff", borderRadius: 8,
                          fontSize: 14
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Status
                      </label>
                      <select
                        value={editTaskForm.status}
                        onChange={(e) => setEditTaskForm({...editTaskForm, status: e.target.value})}
                        style={{
                          width: "100%", padding: 10,
                          border: "1px solid #eef2ff", borderRadius: 8,
                          fontSize: 14, background: "#fff"
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Progress ({editTaskForm.progress}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editTaskForm.progress}
                        onChange={(e) => setEditTaskForm({...editTaskForm, progress: parseInt(e.target.value)})}
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Description
                      </label>
                      <textarea
                        value={editTaskForm.description}
                        onChange={(e) => setEditTaskForm({...editTaskForm, description: e.target.value})}
                        style={{
                          width: "100%", padding: 10,
                          border: "1px solid #eef2ff", borderRadius: 8,
                          fontSize: 14, minHeight: 80,
                          fontFamily: "inherit"
                        }}
                        placeholder="Task description"
                      />
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                      <button
                        onClick={() => setShowTaskEditModal(false)}
                        style={{
                          flex: 1, padding: 12,
                          border: "1px solid #eef2ff",
                          background: "#fff", borderRadius: 8,
                          cursor: "pointer", fontWeight: 600
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateTask}
                        style={{
                          flex: 1, padding: 12,
                          background: theme.primary,
                          color: theme.accentText, border: "none",
                          borderRadius: 8, cursor: "pointer", fontWeight: 600
                        }}
                      >
                        Update Task
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chart tooltip */}
          <AnimatePresence>
            {chartTooltip && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{
                position: "fixed", left: chartTooltip.x + 12, top: chartTooltip.y - 12, background: theme.nearWhite, color: theme.accentText, padding: 8, borderRadius: 8, boxShadow: "0 12px 40px rgba(2,6,23,0.12)", pointerEvents: "none"
              }}>
                {chartTooltip.content}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Invite modal */}
          <AnimatePresence>
            {inviteModalOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1400 }}>
                <div style={{ width: 820, maxWidth: "96%", background: "#fff", borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontWeight: 900 }}>Send Invitations</div>
                    <div><button onClick={() => setInviteModalOpen(false)} style={{ padding: 6, borderRadius: 6, border: "1px solid #eef2ff", cursor: "pointer" }}>Close</button></div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800 }}>Select Recipients</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                        {recipients.map(r => (
                          <label key={r.id} style={{ padding: 8, borderRadius: 8, border: "1px solid #eef2ff", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                            <div>
                              <div style={{ fontWeight: 800 }}>{r.name}</div>
                              <div style={{ fontSize: 12, color: "#64748b" }}>{r.email}</div>
                            </div>
                            <input type="checkbox" checked={r.selected} onChange={() => setRecipients(prev => prev.map(p => p.id === r.id ? { ...p, selected: !p.selected } : p))} />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{ width: 340 }}>
                      <div style={{ fontWeight: 800 }}>Message</div>
                      <textarea value={inviteMsg} onChange={e=>setInviteMsg(e.target.value)} style={{ width: "100%", minHeight: 160, padding: 8, borderRadius: 8, border: "1px solid #eef2ff" }} />
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <select style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #eef2ff" }} onChange={(e)=> {
                          const v = e.target.value; if(!v) return; setInviteMsg(`You are invited to "${v}". Please confirm.`);
                        }}>
                          <option value="">Event templates</option>
                          {events.map(ev => <option key={ev._id} value={ev.name}>{ev.name}</option>)}
                        </select>
                        <button onClick={() => sendInvites(events[0])} style={{ padding: 8, borderRadius: 8, background: theme.primary, color: theme.accentText, border: "none", cursor: "pointer" }}><Send size={14} /> Send</button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── FOOTER ────────────────────────────────────────────── */}
        <motion.footer
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            marginTop: 28,
            background: "linear-gradient(135deg, #0F2A38 0%, #193648 50%, #1F4159 100%)",
            color: "rgba(226,238,249,0.85)",
            overflow: "hidden",
          }}>
          <style>{`
            @keyframes footOrbDrift1 {
              0%   { transform: translate3d(0, 0, 0) scale(1); }
              50%  { transform: translate3d(60px, 30px, 0) scale(1.15); }
              100% { transform: translate3d(0, 0, 0) scale(1); }
            }
            @keyframes footOrbDrift2 {
              0%   { transform: translate3d(0, 0, 0) scale(1); }
              50%  { transform: translate3d(-50px, -40px, 0) scale(1.1); }
              100% { transform: translate3d(0, 0, 0) scale(1); }
            }
            @keyframes footShine {
              0%   { transform: translateX(-120%); }
              100% { transform: translateX(220%); }
            }
            @keyframes footGridMove {
              0%   { background-position: 0 0; }
              100% { background-position: 60px 60px; }
            }
            .footLink:hover { color: #fff !important; transform: translateX(3px); }
            .footLink:hover .footLinkIcon { color: #AAC3FC !important; transform: scale(1.15); }
            .footStat:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(170,195,252,0.35) !important; }
            .footBrand:hover .footShineMask { animation: footShine 1.4s ease-out forwards; }
          `}</style>

          {/* Top gradient hairline */}
          <span aria-hidden style={{
            position: "absolute", left: 0, right: 0, top: 0, height: 2,
            background: "linear-gradient(90deg, transparent 0%, rgba(122,169,214,0.6) 30%, rgba(170,195,252,0.7) 50%, rgba(122,169,214,0.6) 70%, transparent 100%)",
            opacity: 0.7, pointerEvents: "none",
          }} />

          {/* Subtle moving grid pattern */}
          <div aria-hidden style={{
            position: "absolute", inset: 0,
            backgroundImage:
              "linear-gradient(rgba(170,195,252,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(170,195,252,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.5,
            animation: "footGridMove 24s linear infinite",
            pointerEvents: "none",
          }} />

          {/* Ambient glow orbs (drifting) */}
          <div aria-hidden style={{
            position: "absolute", top: -100, left: -80,
            width: 320, height: 320, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(122,169,214,0.22) 0%, rgba(122,169,214,0) 70%)",
            filter: "blur(40px)", pointerEvents: "none",
            animation: "footOrbDrift1 16s ease-in-out infinite",
          }} />
          <div aria-hidden style={{
            position: "absolute", bottom: -120, right: -60,
            width: 280, height: 280, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(58,112,176,0.26) 0%, rgba(58,112,176,0) 70%)",
            filter: "blur(40px)", pointerEvents: "none",
            animation: "footOrbDrift2 18s ease-in-out infinite",
          }} />

          <div style={{
            position: "relative", zIndex: 1,
            padding: "40px 32px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: 28,
          }}>
            {/* Brand block */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{
                  position: "relative",
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
                  border: "1px solid rgba(255,255,255,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 6px 18px rgba(15,42,56,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}>
                  <img src={collaxionLogo} alt="CollaXion" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{
                    fontWeight: 800, fontSize: 18, letterSpacing: "-0.01em", lineHeight: 1.1,
                    background: "linear-gradient(90deg, #ffffff 0%, #E2EEF9 50%, #AAC3FC 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    CollaXion
                  </div>
                  <div style={{ fontSize: 9.5, color: "rgba(226,238,249,0.6)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 3 }}>
                    Co-Curricular Operations
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.65, color: "rgba(226,238,249,0.7)", maxWidth: 280 }}>
                Where collaboration meets innovation - one unified workspace for events, partnerships, and student engagement at the Faculty of Computing.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 14, padding: "6px 12px", background: "rgba(170,195,252,0.10)", border: "1px solid rgba(170,195,252,0.30)", borderRadius: 999 }}>
                <RefreshCw size={11} color="#AAC3FC" />
                <span style={{ fontSize: 9.5, color: "#AAC3FC", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Synced · {now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase",
                color: "rgba(226,238,249,0.55)", marginBottom: 14,
              }}>
                Workspace
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  { label: "Dashboard",        Icon: BarChart3,      key: "dashboard" },
                  { label: "Responsibilities", Icon: ClipboardCheck, key: "responsibilities" },
                  { label: "Create Event",     Icon: Plus,           key: "create" },
                  { label: "Manage Events",    Icon: Edit,           key: "manage" },
                  { label: "Invitations",      Icon: Mail,           key: "invitations" },
                ].map((l) => (
                  <button key={l.key} className="footLink" onClick={() => { setActiveSection(l.key); setShowEventForm(l.key === "create"); }} style={{
                    display: "inline-flex", alignItems: "center", gap: 9,
                    background: "transparent", border: "none",
                    color: "rgba(226,238,249,0.75)", fontSize: 12.5, fontWeight: 600,
                    cursor: "pointer", padding: 0, textAlign: "left",
                    transition: "color 0.22s ease, transform 0.22s ease",
                  }}>
                    <l.Icon className="footLinkIcon" size={13} color="#7AA9D6" style={{ transition: "color 0.22s ease, transform 0.22s ease" }} />
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Snapshot */}
            <div>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase",
                color: "rgba(226,238,249,0.55)", marginBottom: 14,
              }}>
                At a Glance
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { Icon: Calendar,       label: "Upcoming events", value: upcomingEvents.length,                       accent: "#AAC3FC" },
                  { Icon: Users,          label: "Registrations",   value: totalRegistrations.toLocaleString(),         accent: "#7AA9D6" },
                  { Icon: ClipboardCheck, label: "Pending tasks",   value: pendingTasks,                                accent: "#fcd34d" },
                  { Icon: AlertCircle,    label: "Overdue",         value: overdueCount,                                accent: overdueCount ? "#fca5a5" : "#86efac" },
                ].map((s, i) => (
                  <div key={i} className="footStat" style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                    padding: "8px 12px", borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    transition: "background 0.22s ease, border-color 0.22s ease",
                  }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 12, color: "rgba(226,238,249,0.78)" }}>
                      <s.Icon size={13} color={s.accent} />
                      {s.label}
                    </span>
                    <span style={{
                      fontSize: 13, fontWeight: 800, color: "#fff",
                      fontVariantNumeric: "tabular-nums",
                    }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact + powered by */}
            <div>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase",
                color: "rgba(226,238,249,0.55)", marginBottom: 14,
              }}>
                Get in Touch
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="mailto:collaxionsupport@gmail.com" style={{
                  display: "inline-flex", alignItems: "center", gap: 9,
                  fontSize: 12.5, color: "rgba(226,238,249,0.85)", fontWeight: 600, textDecoration: "none",
                  transition: "color 0.18s ease",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(226,238,249,0.85)"}
                >
                  <span style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <Mail size={13} color="#AAC3FC" />
                  </span>
                  collaxionsupport@gmail.com
                </a>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 9,
                  fontSize: 12.5, color: "rgba(226,238,249,0.85)", fontWeight: 600,
                }}>
                  <span style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <Building2 size={13} color="#7AA9D6" />
                  </span>
                  Faculty of Computing
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 9,
                  fontSize: 12.5, color: "rgba(226,238,249,0.85)", fontWeight: 600,
                }}>
                  <span style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <MapPin size={13} color="#86efac" />
                  </span>
                  Riphah International University
                </div>
              </div>
            </div>
          </div>

          {/* Bottom strip - copyright + utility links */}
          <div style={{
            position: "relative", zIndex: 1,
            padding: "16px 32px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap",
            fontSize: 11.5, color: "rgba(226,238,249,0.55)",
          }}>
            <div>
              © {new Date().getFullYear()} <strong style={{ color: "rgba(226,238,249,0.9)", fontWeight: 800 }}>CollaXion</strong> · All rights reserved.
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {[
                { label: "Privacy",   onClick: () => addToast("Privacy policy coming soon", "info") },
                { label: "Terms",     onClick: () => addToast("Terms of service coming soon", "info") },
                { label: "Support",   onClick: () => { window.location.href = "mailto:collaxionsupport@gmail.com"; } },
                { label: "Changelog", onClick: () => addToast("All changes are live in this build", "info") },
              ].map((l, i, arr) => (
                <React.Fragment key={l.label}>
                  <button onClick={l.onClick} style={{
                    background: "transparent", border: "none",
                    color: "rgba(226,238,249,0.65)", fontSize: 11.5, fontWeight: 600,
                    cursor: "pointer", padding: "4px 6px", borderRadius: 6,
                    transition: "color 0.18s ease, background 0.18s ease",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(226,238,249,0.65)"; e.currentTarget.style.background = "transparent"; }}
                  >
                    {l.label}
                  </button>
                  {i < arr.length - 1 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(226,238,249,0.25)" }} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.footer>
      </div>

      {/* ── TOASTS for real-time activity ──────────────────────────── */}
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type}
            onClose={() => setToasts((p) => p.filter((x) => x.id !== t.id))} />
        ))}
      </AnimatePresence>
    </div>
  );
}