// src/pages/SystemSettings.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Bell, ShieldCheck, Database, CloudUpload, Zap,
  Save, Key, CheckCircle, AlertTriangle, Monitor, Globe,
  Clock, Camera, Eye, EyeOff, RefreshCw, Download,
  Upload, Shield, Activity, Layers, ChevronRight, ArrowLeft,
  Cpu, Mail, Moon, Sun, Sliders, AlertCircle, Settings as SettingsIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LiaisonNavbar from "../components/LiaisonNavbar";
import LiaisonFooter from "../components/LiaisonFooter";

// ─── Brand palette ───────────────────────────────────────────────────────────
// Primary navy  : #193648
// Mid blue      : #3A70B0
// Accent light  : #AAC3FC
// Page bg       : #E2EEF9 → #FFFFFF
// Card bg       : #FFFFFF
// Text dark     : #193648
// Text muted    : #5a7e9a

const C = {
  navy:      "#193648",
  navyLight: "#1e4060",
  blue:      "#3A70B0",
  blueMid:   "#2d5a8e",
  blueSoft:  "#7AA9D6",
  blueLight: "#AAC3FC",
  tint:      "#E2EEF9",
  pageBg:    "linear-gradient(135deg, #E2EEF9 0%, #FFFFFF 100%)",
  cardBg:    "#FFFFFF",
  border:    "#E2EEF9",
  borderMid: "#AAC3FC",
  textDark:  "#193648",
  textMid:   "#3A70B0",
  textMuted: "#5a7e9a",
  textFaint: "#8fa8bb",
  success:   "#1a7a4a",
  successBg: "#e6f7ef",
  error:     "#b91c1c",
  errorBg:   "#fef2f2",
  warn:      "#b45309",
  warnBg:    "#fffbeb",
};

// ─── Font injection ──────────────────────────────────────────────────────────
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
    * { box-sizing: border-box; }
    body { font-family: 'Poppins', sans-serif; }
    input, select, textarea, button { font-family: 'Poppins', sans-serif; }
    input:focus, select:focus { border-color: #3A70B0 !important; outline: none; box-shadow: 0 0 0 3px rgba(58,112,176,0.14) !important; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #E2EEF9; }
    ::-webkit-scrollbar-thumb { background: #AAC3FC; border-radius: 10px; }
  `}</style>
);

const BASE_API = "http://localhost:5000";

// ─── Constants ───────────────────────────────────────────────────────────────
const ADMIN = {
  username: "admin", password: "admin123",
  displayName: "Ms. Tazzaina", email: "tazzaina@collaxion.edu.pk", role: "Industry Liaison",
};

const initSettings = {
  preferences:  { theme: "light", notifications: true, emailAlerts: true, language: "English", compactMode: false, soundAlerts: false },
  security:     {
    twoFA: false, sessionTimeout: "30",
    loginHistory: [
      { id: 1, when: "2025-11-02 14:12", ip: "103.45.12.11", device: "Chrome · Windows", status: "success" },
      { id: 2, when: "2025-11-01 09:03", ip: "41.220.3.44",  device: "Firefox · Mac",    status: "success" },
      { id: 3, when: "2025-10-29 21:47", ip: "192.168.1.5",  device: "Safari · iPhone",  status: "failed"  },
    ],
  },
  integrations: { slack: false, github: false, googleDrive: false, microsoftTeams: false },
  profile:      { displayName: ADMIN.displayName, email: ADMIN.email, role: ADMIN.role, phone: "+92 300 1234567" },
};

// ─── Micro components ────────────────────────────────────────────────────────

const Toggle = ({ checked, onChange }) => (
  <motion.div
    onClick={onChange}
    whileTap={{ scale: 0.92 }}
    style={{
      width: 46, height: 25, borderRadius: 13, cursor: "pointer", position: "relative", flexShrink: 0,
      background: checked ? `linear-gradient(135deg, ${C.blueMid}, ${C.blue})` : "#cbd5e1",
      boxShadow: checked ? "0 2px 10px rgba(58,112,176,0.35)" : "none",
      transition: "all 0.3s",
    }}
  >
    <motion.div
      animate={{ x: checked ? 23 : 3 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        position: "absolute", top: 4, width: 17, height: 17, borderRadius: "50%",
        background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }}
    />
  </motion.div>
);

const StatusChip = ({ label, color, bg }) => (
  <span style={{
    fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.05em",
    padding: "3px 10px", borderRadius: 20, textTransform: "uppercase",
    background: bg, color,
    border: `1px solid ${color}33`,
  }}>{label}</span>
);

// ─── Layout pieces ───────────────────────────────────────────────────────────

const Card = ({ children, style = {}, accent }) => (
  <div style={{
    background: C.cardBg,
    border: `1.5px solid ${accent ? accent + "44" : C.border}`,
    borderRadius: 18, padding: "22px 24px",
    boxShadow: accent
      ? `0 4px 20px ${accent}18, 0 1px 4px rgba(25,54,72,0.06)`
      : "0 4px 20px rgba(25,54,72,0.07)",
    ...style,
  }}>{children}</div>
);

const CardTitle = ({ children }) => (
  <div style={{
    fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", color: C.textFaint,
    marginBottom: 18, borderBottom: `1px solid ${C.border}`, paddingBottom: 10,
  }}>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{
      display: "block", fontSize: "0.72rem", fontWeight: 700,
      color: C.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6,
    }}>{label}</label>
    {children}
  </div>
);

const Input = ({ readOnly, style: sx = {}, ...props }) => (
  <input
    readOnly={readOnly}
    style={{
      width: "100%", padding: "10px 14px", borderRadius: 10,
      border: `1.5px solid ${C.border}`,
      background: readOnly ? "#f1f7fd" : "#fff",
      color: readOnly ? C.textFaint : C.textDark,
      fontSize: "0.88rem", outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      ...sx,
    }}
    {...props}
  />
);

const Btn = ({ children, onClick, type = "button", variant = "primary", style: sx = {} }) => {
  const variants = {
    primary: { background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`,  color: "#fff", boxShadow: "0 4px 14px rgba(58,112,176,0.3)", border: "none" },
    ghost:   { background: "#fff", color: C.textMid, border: `1.5px solid ${C.border}`, boxShadow: "none" },
    danger:  { background: "linear-gradient(135deg,#991b1b,#dc2626)", color: "#fff", border: "none", boxShadow: "0 4px 14px rgba(220,38,38,0.25)" },
  };
  return (
    <motion.button
      whileTap={{ scale: 0.96 }} whileHover={{ opacity: 0.88 }}
      onClick={onClick} type={type}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        borderRadius: 10, padding: "10px 20px", fontWeight: 700,
        fontSize: "0.84rem", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
        whiteSpace: "nowrap", transition: "opacity 0.2s",
        ...variants[variant], ...sx,
      }}
    >{children}</motion.button>
  );
};

const PrefRow = ({ icon: Icon, title, desc, checked, onChange, accent = C.blue }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "13px 16px", borderRadius: 12, marginBottom: 10,
    background: checked ? "#E2EEF9" : "#f8fbff",
    border: `1.5px solid ${checked ? C.blueLight : C.border}`,
    transition: "all 0.25s",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: checked ? "#AAC3FC" : "#E2EEF9",
        border: `1.5px solid ${checked ? C.blueLight : C.border}`,
      }}>
        <Icon size={16} color={checked ? C.blue : C.textFaint} />
      </div>
      <div>
        <div style={{ fontSize: "0.88rem", fontWeight: 600, color: C.textDark }}>{title}</div>
        <div style={{ fontSize: "0.75rem", color: C.textMuted, marginTop: 2 }}>{desc}</div>
      </div>
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

const InfoRow = ({ label, value, mono, highlight }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0", borderBottom: `1px solid ${C.border}`,
  }}>
    <span style={{ fontSize: "0.8rem", color: C.textMuted }}>{label}</span>
    <span style={{
      fontSize: "0.82rem", fontWeight: 700,
      color: highlight || C.textDark,
      fontFamily: mono ? "monospace" : "inherit",
    }}>{value}</span>
  </div>
);

const NavItem = ({ icon: Icon, label, sub, active, onClick, warn }) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%",
      padding: "10px 14px", borderRadius: 12, border: "none", cursor: "pointer",
      textAlign: "left", fontFamily: "'Poppins', sans-serif",
      background: active ? `linear-gradient(135deg, ${C.navy}, ${C.navyLight})` : "transparent",
      color: active ? "#fff" : C.textMuted,
      boxShadow: active ? "0 4px 16px rgba(25,54,72,0.18)" : "none",
      transition: "all 0.2s",
    }}
  >
    <div style={{
      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: active ? "rgba(255,255,255,0.15)" : "#E2EEF9",
    }}>
      <Icon size={16} color={active ? "#fff" : C.blue} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: "0.85rem", fontWeight: active ? 700 : 500, lineHeight: 1.2 }}>{label}</div>
      <div style={{ fontSize: "0.71rem", opacity: active ? 0.65 : 0.7, marginTop: 2 }}>{sub}</div>
    </div>
    {warn && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 6px #f59e0b80", flexShrink: 0 }} />}
    {active && <ChevronRight size={13} color="rgba(255,255,255,0.5)" />}
  </motion.button>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const SystemSettings = () => {
  const navigate = useNavigate();
  const [section, setSection]       = useState("profile");
  const [settings, setSettings]     = useState({ ...initSettings });
  const [adminPw, setAdminPw]       = useState(ADMIN.password);
  const [imgPreview, setImgPreview] = useState(null);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [pwForm, setPwForm]         = useState({ current: "", newP: "", confirm: "" });
  const [showPw, setShowPw]         = useState({ c: false, n: false, cf: false });
  const [toast, setToast]           = useState(null);
  const [pForm, setPForm]           = useState({ ...initSettings.profile });
  const fileRef                     = useRef(null);

  const flash  = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const tPref  = (k) => setSettings(s => ({ ...s, preferences: { ...s.preferences, [k]: !s.preferences[k] } }));
  const tInteg = (k) => { setSettings(s => ({ ...s, integrations: { ...s.integrations, [k]: !s.integrations[k] } })); flash(`${k} ${settings.integrations[k] ? "disconnected" : "connected"}`); };
  const t2FA   = () => { setSettings(s => ({ ...s, security: { ...s.security, twoFA: !s.security.twoFA } })); flash(settings.security.twoFA ? "2FA disabled" : "2FA enabled"); };

  // Load liaison profile (name/email/role/dp) from backend on mount.
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${BASE_API}/api/liaison/profile`);
        if (!r.ok) return;
        const p = await r.json();
        if (p && typeof p === "object") {
          setPForm((prev) => ({
            ...prev,
            ...(p.name  ? { displayName: p.name }  : {}),
            ...(p.email ? { email:       p.email } : {}),
            ...(p.role  ? { role:        p.role }  : {}),
          }));
          if (typeof p.dp === "string" && p.dp) setImgPreview(p.dp);
        }
      } catch {}
    })();
  }, []);

  // PATCH a partial profile change to the backend and broadcast it so other
  // mounted components (e.g. LiaisonNavbar) refresh their copy.
  const patchProfile = async (patch) => {
    try {
      const r = await fetch(`${BASE_API}/api/liaison/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!r.ok) {
        const txt = await r.text().catch(() => "");
        flash(txt?.includes("too large") ? "Photo too large (max 6MB)" : "Save failed", "err");
        return null;
      }
      const saved = await r.json();
      try { window.dispatchEvent(new CustomEvent("liaison-profile-updated", { detail: saved })); } catch {}
      return saved;
    } catch {
      flash("Network error", "err");
      return null;
    }
  };

  const onImg = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type?.startsWith("image/")) { flash("Please choose an image", "err"); return; }
    if (f.size > 6 * 1024 * 1024)      { flash("Photo too large (max 6MB)", "err"); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl !== "string") return;
      setImgPreview(dataUrl);
      setPhotoSaving(true);
      const saved = await patchProfile({ dp: dataUrl });
      setPhotoSaving(false);
      if (saved) flash("Photo updated");
    };
    reader.readAsDataURL(f);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSettings(s => ({ ...s, profile: { ...s.profile, ...pForm } }));
    const saved = await patchProfile({
      name:  pForm.displayName,
      email: pForm.email,
      role:  pForm.role,
    });
    if (saved) flash("Profile saved");
  };
  const changePw    = (e) => {
    e.preventDefault();
    if (pwForm.current !== adminPw)      { flash("Wrong current password", "err"); return; }
    if (pwForm.newP.length < 6)          { flash("Min 6 characters required", "err"); return; }
    if (pwForm.newP !== pwForm.confirm)  { flash("Passwords don't match", "err"); return; }
    setAdminPw(pwForm.newP); setPwForm({ current: "", newP: "", confirm: "" });
    flash("Password updated successfully");
  };
  const doExport = () => {
    const blob = new Blob([JSON.stringify({ settings, at: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const u = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = u; a.download = "collaxion-settings.json"; a.click(); URL.revokeObjectURL(u);
    flash("Settings exported");
  };
  const doImport = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { const p = JSON.parse(r.result); if (p.settings) { setSettings(p.settings); flash("Settings imported"); } else flash("Invalid file", "err"); } catch { flash("Parse error", "err"); } };
    r.readAsText(f);
  };

  const navItems = [
    { key: "profile",      icon: User,        label: "Profile",          sub: "Identity & avatar"        },
    { key: "preferences",  icon: Sliders,     label: "Preferences",      sub: "Theme & notifications"    },
    { key: "security",     icon: ShieldCheck, label: "Security",         sub: "Password & 2FA",  warn: !settings.security.twoFA },
    { key: "backup",       icon: CloudUpload, label: "Backup & Restore", sub: "Export / import"          },
    { key: "integrations", icon: Zap,         label: "Integrations",     sub: "Connected services"       },
    { key: "sysinfo",      icon: Cpu,         label: "System Info",      sub: "Build & status"           },
  ];

  return (
    <>
      <FontStyle />
      <LiaisonNavbar />
      <div style={{ fontFamily: "'Poppins', sans-serif", background: C.pageBg, minHeight: "100vh" }}>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              style={{
                position: "fixed", top: 22, left: "50%", zIndex: 9999,
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 22px", borderRadius: 14, fontWeight: 700, fontSize: "0.88rem",
                background: toast.type === "err" ? "#991b1b" : C.navy,
                color: "#fff", boxShadow: "0 8px 28px rgba(25,54,72,0.28)",
                border: `1px solid ${toast.type === "err" ? "#dc262650" : "#3A70B050"}`,
              }}
              initial={{ opacity: 0, y: -30, x: "-50%" }}
              animate={{ opacity: 1, y: 0,   x: "-50%" }}
              exit={{ opacity: 0,   y: -30,  x: "-50%" }}
            >
              {toast.type === "err"
                ? <AlertTriangle size={15} color="#fca5a5" />
                : <CheckCircle  size={15} color={C.blueLight} />}
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        <main style={{ maxWidth: 1320, margin: "0 auto", padding: "32px 36px 56px" }}>

          {/* Premium header - matches MOU style */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, marginBottom: 22, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `linear-gradient(135deg, ${C.navy}, ${C.blue})`,
                boxShadow: "0 10px 28px rgba(25,54,72,0.28)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}>
                <SettingsIcon size={26} color="#fff" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: "0.14em",
                    textTransform: "uppercase", color: C.blue,
                    background: "#E2EEF9", border: `1px solid ${C.blueLight}`,
                    padding: "3px 9px", borderRadius: 999,
                  }}>
                    Workspace
                  </span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 10, fontWeight: 800, letterSpacing: "0.14em",
                    textTransform: "uppercase", color: C.success,
                    background: C.successBg, border: "1px solid #bfe5d1",
                    padding: "3px 9px", borderRadius: 999,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.success }} />
                    Live
                  </span>
                </div>
                <h1 style={{ fontSize: "1.7rem", fontWeight: 800, color: C.textDark, margin: 0, letterSpacing: "-0.01em" }}>
                  System Settings
                </h1>
                <p style={{ fontSize: "0.86rem", color: C.textMid, margin: "4px 0 0 0", fontWeight: 500 }}>
                  Manage your profile, preferences, security and integrations
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Btn variant="ghost" onClick={() => navigate("/maindashboard")}>
                <ArrowLeft size={14} /> Dashboard
              </Btn>
              <Btn onClick={() => flash("All settings saved")}>
                <Save size={14} /> Save All
              </Btn>
            </div>
          </div>

          {/* Compact pill counts - quick status overview */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
            {[
              { label: "Sections",  value: navItems.length, accent: C.blue,  bg: "#E2EEF9", brd: C.blueLight },
              { label: "2FA",       value: settings.security.twoFA ? "On" : "Off", accent: settings.security.twoFA ? C.success : C.warn, bg: settings.security.twoFA ? C.successBg : C.warnBg, brd: settings.security.twoFA ? "#bfe5d1" : "#fde68a" },
              { label: "Notifications", value: settings.preferences.notifications ? "On" : "Off", accent: settings.preferences.notifications ? C.success : C.error, bg: settings.preferences.notifications ? C.successBg : C.errorBg, brd: settings.preferences.notifications ? "#bfe5d1" : "#fecaca" },
              { label: "Integrations", value: Object.values(settings.integrations).filter(Boolean).length, accent: C.navy, bg: "#E2EEF9", brd: C.blueLight },
              { label: "Theme",     value: settings.preferences.theme === "dark" ? "Dark" : "Light", accent: C.blue, bg: "#E2EEF9", brd: C.blueLight },
              { label: "Language",  value: settings.preferences.language, accent: C.navy, bg: "#E2EEF9", brd: C.blueLight },
            ].map((p) => (
              <div key={p.label} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 8,
                background: "#fff", border: "1px solid #E2EEF9",
                boxShadow: "0 2px 6px rgba(25,54,72,0.04)",
                fontFamily: "'Poppins', sans-serif",
              }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: p.accent,
                  background: p.bg, border: `1px solid ${p.brd}`,
                  padding: "2px 9px", borderRadius: 999, minWidth: 28,
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {p.value}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: C.textMuted,
                  letterSpacing: "0.04em", textTransform: "uppercase",
                }}>
                  {p.label}
                </span>
              </div>
            ))}
          </div>

          {/* Horizontal tab strip - replaces sidebar drawer */}
          <div style={{
            display: "flex", gap: 8, flexWrap: "wrap",
            background: "#fff",
            border: "1px solid #E2EEF9", borderRadius: 14,
            padding: 8, marginBottom: 24,
            boxShadow: "0 4px 14px rgba(25,54,72,0.06)",
          }}>
            {navItems.map((item) => {
              const active = section === item.key;
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.key}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSection(item.key)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 9,
                    padding: "10px 16px", borderRadius: 10,
                    border: active ? "1px solid #122838" : "1px solid #E2EEF9",
                    background: active
                      ? `linear-gradient(135deg, ${C.navy}, ${C.navyLight})`
                      : "#f8fbff",
                    color: active ? "#fff" : C.textMid,
                    fontSize: 12.5, fontWeight: 700, letterSpacing: "0.01em",
                    cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                    boxShadow: active ? "0 6px 18px rgba(25,54,72,0.22)" : "none",
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                >
                  <Icon size={14} color={active ? "#fff" : C.blue} />
                  {item.label}
                  {item.warn && !active && (
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: "#f59e0b",
                      boxShadow: "0 0 6px #f59e0b80",
                    }} />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Section subheader - context for the current tab */}
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: C.textDark, margin: 0, letterSpacing: "-0.005em" }}>
              {navItems.find(n => n.key === section)?.label}
            </h2>
            <p style={{ fontSize: "0.82rem", color: C.textMuted, margin: "4px 0 0 0" }}>
              {navItems.find(n => n.key === section)?.sub}
            </p>
          </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
              >

                {/* ══ PROFILE ══ */}
                {section === "profile" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <Card>
                        <CardTitle>Account Information</CardTitle>
                        <form onSubmit={saveProfile}>
                          <Field label="Username">
                            <Input value={ADMIN.username} readOnly />
                          </Field>
                          <Field label="Display Name">
                            <Input value={pForm.displayName} onChange={e => setPForm(p => ({ ...p, displayName: e.target.value }))} />
                          </Field>
                          <Field label="Email Address">
                            <Input type="email" value={pForm.email} onChange={e => setPForm(p => ({ ...p, email: e.target.value }))} />
                          </Field>
                          <Field label="Phone">
                            <Input value={pForm.phone} onChange={e => setPForm(p => ({ ...p, phone: e.target.value }))} />
                          </Field>
                          <Field label="Role">
                            <Input value={pForm.role} readOnly />
                          </Field>
                          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                            <Btn type="submit"><Save size={14} /> Save Profile</Btn>
                            <Btn variant="ghost" onClick={() => { setPForm({ ...initSettings.profile }); flash("Profile reset"); }}>
                              <RefreshCw size={13} /> Reset
                            </Btn>
                          </div>
                        </form>
                      </Card>

                      <Card>
                        <CardTitle>Change Password</CardTitle>
                        <form onSubmit={changePw}>
                          {[
                            ["current", "Current Password",    "c"],
                            ["newP",    "New Password",        "n"],
                            ["confirm", "Confirm New Password","cf"],
                          ].map(([field, ph, sk]) => (
                            <Field key={field} label={ph}>
                              <div style={{ position: "relative" }}>
                                <Input
                                  type={showPw[sk] ? "text" : "password"}
                                  placeholder="••••••••"
                                  value={pwForm[field]}
                                  onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
                                  style={{ paddingRight: 42 }}
                                />
                                <button type="button"
                                  onClick={() => setShowPw(p => ({ ...p, [sk]: !p[sk] }))}
                                  style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.textFaint }}>
                                  {showPw[sk] ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                              </div>
                            </Field>
                          ))}
                          <Btn type="submit"><Key size={14} /> Update Password</Btn>
                        </form>
                      </Card>
                    </div>

                    {/* Right col */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <Card accent={C.blue}>
                        <CardTitle>Profile Photo</CardTitle>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "8px 0" }}>
                          <div style={{
                            width: 104, height: 104, borderRadius: 24, overflow: "hidden",
                            border: `3px solid ${C.blueLight}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "#E2EEF9",
                            boxShadow: "0 6px 24px rgba(58,112,176,0.18)",
                          }}>
                            {imgPreview
                              ? <img src={imgPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              : <User size={44} color={C.blue} />
                            }
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "1rem", fontWeight: 700, color: C.textDark }}>{pForm.displayName}</div>
                            <div style={{ fontSize: "0.78rem", color: C.textMid, marginTop: 4 }}>{pForm.role}</div>
                            <div style={{ fontSize: "0.74rem", color: C.textMuted, marginTop: 3 }}>{pForm.email}</div>
                          </div>
                          <input ref={fileRef} type="file" accept="image/*" onChange={onImg} style={{ display: "none" }} />
                          <Btn onClick={() => !photoSaving && fileRef.current?.click()} style={{ width: "100%", justifyContent: "center", opacity: photoSaving ? 0.7 : 1, cursor: photoSaving ? "wait" : "pointer" }}>
                            <Camera size={14} /> {photoSaving ? "Saving…" : "Upload Photo"}
                          </Btn>
                          {imgPreview && (
                            <Btn
                              variant="ghost"
                              onClick={async () => {
                                setPhotoSaving(true);
                                const saved = await patchProfile({ dp: "" });
                                setPhotoSaving(false);
                                if (saved) { setImgPreview(null); flash("Photo removed"); }
                              }}
                              style={{ width: "100%", justifyContent: "center" }}
                            >
                              <RefreshCw size={13} /> Remove Photo
                            </Btn>
                          )}
                        </div>
                      </Card>

                      <Card>
                        <CardTitle>Session Info</CardTitle>
                        <InfoRow label="Username"    value={ADMIN.username}    mono />
                        <InfoRow label="Last Login"  value="2025-11-02 14:12" />
                        <InfoRow label="Session"     value="Active"            highlight={C.success} />
                        <InfoRow label="Permissions" value="Full Access"       highlight={C.blue} />
                      </Card>
                    </div>
                  </div>
                )}

                {/* ══ PREFERENCES ══ */}
                {section === "preferences" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
                    <div>
                      <Card style={{ marginBottom: 20 }}>
                        <CardTitle>Display & Interface</CardTitle>
                        <PrefRow icon={settings.preferences.theme === "dark" ? Moon : Sun} title="Dark Mode" desc="Switch between light and dark interface theme" checked={settings.preferences.theme === "dark"} onChange={() => { tPref("theme"); flash("Theme updated"); }} />
                        <PrefRow icon={Layers} title="Compact Mode" desc="Reduce whitespace for denser information display" checked={settings.preferences.compactMode} onChange={() => { tPref("compactMode"); flash("Compact mode updated"); }} />
                      </Card>
                      <Card>
                        <CardTitle>Notifications & Alerts</CardTitle>
                        <PrefRow icon={Bell}    title="System Notifications" desc="In-app alerts and dashboard notifications"      checked={settings.preferences.notifications}  onChange={() => { tPref("notifications");  flash("Notifications updated"); }} />
                        <PrefRow icon={Mail}    title="Email Alerts"         desc="Receive important updates via email"              checked={settings.preferences.emailAlerts}    onChange={() => { tPref("emailAlerts");    flash("Email alerts updated"); }} />
                        <PrefRow icon={Monitor} title="Sound Alerts"         desc="Audio cues for critical system notifications"    checked={settings.preferences.soundAlerts}    onChange={() => { tPref("soundAlerts");    flash("Sound alerts updated"); }} />
                      </Card>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <Card>
                        <CardTitle>Language</CardTitle>
                        <Field label="Interface Language">
                          <select
                            value={settings.preferences.language}
                            onChange={e => { setSettings(sv => ({ ...sv, preferences: { ...sv.preferences, language: e.target.value } })); flash(`Language → ${e.target.value}`); }}
                            style={{
                              width: "100%", padding: "10px 14px", borderRadius: 10,
                              border: `1.5px solid ${C.border}`, background: "#fff",
                              color: C.textDark, fontSize: "0.88rem", outline: "none",
                            }}
                          >
                            {["English","Urdu","Arabic","Chinese","French"].map(l => <option key={l}>{l}</option>)}
                          </select>
                        </Field>
                      </Card>

                      <Card accent={C.blue}>
                        <CardTitle>Current Configuration</CardTitle>
                        <InfoRow label="Theme"         value={settings.preferences.theme === "dark" ? "🌙 Dark" : "☀️ Light"} />
                        <InfoRow label="Notifications" value={settings.preferences.notifications ? "Enabled"  : "Disabled"} highlight={settings.preferences.notifications ? C.success : C.error} />
                        <InfoRow label="Email Alerts"  value={settings.preferences.emailAlerts    ? "On" : "Off"}           highlight={settings.preferences.emailAlerts    ? C.success : C.error} />
                        <InfoRow label="Language"      value={settings.preferences.language} />
                        <InfoRow label="Compact Mode"  value={settings.preferences.compactMode    ? "On" : "Off"} />
                        <Btn style={{ marginTop: 16, width: "100%", justifyContent: "center" }} onClick={() => flash("Preferences saved")}>
                          <Save size={14} /> Save Preferences
                        </Btn>
                      </Card>
                    </div>
                  </div>
                )}

                {/* ══ SECURITY ══ */}
                {section === "security" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <Card accent={settings.security.twoFA ? C.blue : "#f59e0b"}>
                        <CardTitle>Two-Factor Authentication</CardTitle>
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "16px 18px", borderRadius: 14, marginBottom: 12,
                          background: settings.security.twoFA ? "#E2EEF9" : C.warnBg,
                          border: `1.5px solid ${settings.security.twoFA ? C.blueLight : "#fde68a"}`,
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{
                              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              background: settings.security.twoFA ? "#AAC3FC" : "#fef3c7",
                            }}>
                              <Shield size={20} color={settings.security.twoFA ? C.blue : "#d97706"} />
                            </div>
                            <div>
                              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: settings.security.twoFA ? C.navy : "#b45309" }}>
                                {settings.security.twoFA ? "2FA is Active" : "2FA is Disabled"}
                              </div>
                              <div style={{ fontSize: "0.75rem", color: C.textMuted, marginTop: 2 }}>
                                {settings.security.twoFA ? "Your account has extra protection" : "Enable to strengthen your security"}
                              </div>
                            </div>
                          </div>
                          <Toggle checked={settings.security.twoFA} onChange={t2FA} />
                        </div>
                        {!settings.security.twoFA && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#fffbeb", border: "1px solid #fde68a" }}>
                            <AlertCircle size={14} color="#d97706" />
                            <span style={{ fontSize: "0.78rem", color: C.warn }}>Enable 2FA to better protect your account.</span>
                          </div>
                        )}
                      </Card>

                      <Card>
                        <CardTitle>Session Timeout</CardTitle>
                        <Field label="Auto-logout after inactivity">
                          <select
                            value={settings.security.sessionTimeout}
                            onChange={e => { setSettings(sv => ({ ...sv, security: { ...sv.security, sessionTimeout: e.target.value } })); flash("Timeout updated"); }}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "#fff", color: C.textDark, fontSize: "0.88rem", outline: "none" }}
                          >
                            {[["15","15 minutes"],["30","30 minutes"],["60","1 hour"],["120","2 hours"],["Never","Never"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                          </select>
                        </Field>
                        <InfoRow label="Current Setting" value={settings.security.sessionTimeout === "Never" ? "Never" : `${settings.security.sessionTimeout} min`} highlight={C.blue} />
                      </Card>
                    </div>

                    <Card>
                      <CardTitle>Recent Login Activity</CardTitle>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {settings.security.loginHistory.map((h, i) => (
                          <motion.div key={h.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                            style={{
                              display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderRadius: 12,
                              background: h.status === "failed" ? C.errorBg : "#E2EEF9",
                              border: `1.5px solid ${h.status === "failed" ? "#fecaca" : C.blueLight}`,
                            }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              background: h.status === "failed" ? "#fee2e2" : "#AAC3FC",
                            }}>
                              {h.status === "failed"
                                ? <AlertTriangle size={16} color="#dc2626" />
                                : <CheckCircle  size={16} color={C.blue} />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "0.84rem", fontWeight: 600, color: C.textDark }}>{h.device}</div>
                              <div style={{ fontSize: "0.74rem", color: C.textMuted, fontFamily: "monospace", marginTop: 3 }}>{h.ip}</div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <div style={{ fontSize: "0.72rem", color: C.textFaint, marginBottom: 4 }}>{h.when}</div>
                              <StatusChip
                                label={h.status}
                                color={h.status === "failed" ? "#dc2626" : C.blue}
                                bg={h.status === "failed" ? "#fee2e2" : "#AAC3FC"}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {/* ══ BACKUP ══ */}
                {section === "backup" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <Card accent={C.blue}>
                      <CardTitle>Export Settings</CardTitle>
                      <p style={{ fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.7, marginBottom: 20 }}>
                        Download a complete snapshot of your current configuration as a JSON file. Includes preferences, security settings, and integration toggles.
                      </p>
                      <InfoRow label="Format"   value="JSON"  mono />
                      <InfoRow label="Version"  value="1.4.2" mono />
                      <InfoRow label="Sections" value="6" />
                      <InfoRow label="Last Export" value="Never" />
                      <Btn style={{ marginTop: 20, width: "100%", justifyContent: "center" }} onClick={doExport}>
                        <Download size={15} /> Export Configuration
                      </Btn>
                    </Card>

                    <Card>
                      <CardTitle>Restore Settings</CardTitle>
                      <p style={{ fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.7, marginBottom: 20 }}>
                        Import a previously exported JSON file to restore your configuration. Current settings will be overwritten.
                      </p>
                      <div style={{
                        border: `2px dashed ${C.borderMid}`, borderRadius: 14,
                        padding: "36px 20px", textAlign: "center",
                        background: "#f8fbff",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                      }}>
                        <Upload size={32} color={C.textFaint} />
                        <div style={{ fontSize: "0.85rem", color: C.textMuted }}>Drop your JSON file here or</div>
                        <label>
                          <input type="file" accept="application/json" onChange={doImport} style={{ display: "none" }} />
                          <Btn variant="ghost" style={{ cursor: "pointer" }}>
                            <Upload size={14} /> Choose File
                          </Btn>
                        </label>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, padding: "10px 14px", borderRadius: 10, background: C.warnBg, border: "1px solid #fde68a" }}>
                        <AlertCircle size={13} color="#d97706" />
                        <span style={{ fontSize: "0.75rem", color: C.warn }}>Current settings will be replaced on import.</span>
                      </div>
                    </Card>
                  </div>
                )}

                {/* ══ INTEGRATIONS ══ */}
                {section === "integrations" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {[
                      { key: "slack",          label: "Slack",           desc: "Send notifications to Slack channels",       emoji: "💬" },
                      { key: "github",          label: "GitHub",          desc: "Link repositories and track project activity",emoji: "🐙" },
                      { key: "googleDrive",     label: "Google Drive",    desc: "Automated backup of settings and documents", emoji: "📁" },
                      { key: "microsoftTeams",  label: "Microsoft Teams", desc: "Receive alerts inside Teams channels",       emoji: "🟦" },
                    ].map(({ key, label, desc, emoji }) => {
                      const on = settings.integrations[key];
                      return (
                        <motion.div key={key} whileHover={{ y: -3 }}
                          style={{
                            background: on ? "#E2EEF9" : C.cardBg,
                            border: `1.5px solid ${on ? C.blueLight : C.border}`,
                            borderRadius: 18, padding: "22px 24px",
                            boxShadow: on ? "0 6px 20px rgba(58,112,176,0.12)" : "0 4px 16px rgba(25,54,72,0.06)",
                            transition: "all 0.3s",
                          }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ fontSize: "2rem" }}>{emoji}</div>
                              <div>
                                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textDark }}>{label}</div>
                                <div style={{ marginTop: 5 }}>
                                  <StatusChip
                                    label={on ? "Connected" : "Disconnected"}
                                    color={on ? C.blue : C.textFaint}
                                    bg={on ? "#AAC3FC" : "#f1f5f9"}
                                  />
                                </div>
                              </div>
                            </div>
                            <Toggle checked={on} onChange={() => tInteg(key)} />
                          </div>
                          <div style={{ fontSize: "0.8rem", color: C.textMuted, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                            {desc}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* ══ SYSTEM INFO ══ */}
                {section === "sysinfo" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <Card>
                        <CardTitle>Application Details</CardTitle>
                        <InfoRow label="App Name"    value="CollaXion" />
                        <InfoRow label="Version"     value="v1.4.2"    mono highlight={C.blue} />
                        <InfoRow label="Build Date"  value="2025-10-30" mono />
                        <InfoRow label="Environment" value="Production" highlight={C.success} />
                        <InfoRow label="Platform"    value="Web · React 18" />
                        <InfoRow label="Node"        value="v20.11.0" mono />
                        <Btn variant="ghost" style={{ marginTop: 16 }} onClick={() => { navigator.clipboard?.writeText("CollaXion v1.4.2 | 2025-10-30"); flash("Copied!"); }}>
                          Copy System Info
                        </Btn>
                      </Card>

                      <Card>
                        <CardTitle>Support & Contact</CardTitle>
                        <InfoRow label="Developer"     value="CollaXion Team" />
                        <InfoRow label="Support Email" value="support@collaxion.app" />
                        <InfoRow label="Docs"          value="docs.collaxion.app" />
                        <InfoRow label="Uptime (30d)"  value="99.8%" highlight={C.success} />
                      </Card>
                    </div>

                    <Card accent={C.blue}>
                      <CardTitle>Live System Status</CardTitle>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                          { name: "API Server",    latency: "42ms", ok: true  },
                          { name: "Database",      latency: "18ms", ok: true  },
                          { name: "File Storage",  latency: "61ms", ok: true  },
                          { name: "Email Service", latency: "-",    ok: false },
                          { name: "Auth Service",  latency: "29ms", ok: true  },
                        ].map((svc, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "12px 16px", borderRadius: 12,
                              background: svc.ok ? "#E2EEF9" : C.warnBg,
                              border: `1.5px solid ${svc.ok ? C.blueLight : "#fde68a"}`,
                            }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 10, height: 10, borderRadius: "50%",
                                background: svc.ok ? C.blue : "#f59e0b",
                                boxShadow: svc.ok ? `0 0 7px ${C.blue}` : "0 0 7px #f59e0b",
                              }} />
                              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: C.textDark }}>{svc.name}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <span style={{ fontSize: "0.74rem", fontFamily: "monospace", color: C.textMuted }}>{svc.latency}</span>
                              <StatusChip
                                label={svc.ok ? "Operational" : "Degraded"}
                                color={svc.ok ? C.blue : "#d97706"}
                                bg={svc.ok ? "#AAC3FC" : "#fef3c7"}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, padding: "10px 14px", borderRadius: 10, background: "#E2EEF9", border: `1px solid ${C.blueLight}` }}>
                        <Activity size={13} color={C.blue} />
                        <span style={{ fontSize: "0.75rem", color: C.textMid }}>4 of 5 services operational - Last checked: just now</span>
                      </div>
                    </Card>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
        </main>
      </div>
      <LiaisonFooter />
    </>
  );
};

export default SystemSettings;