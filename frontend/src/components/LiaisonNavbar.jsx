import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, FileSignature, MapPin, Briefcase, ClipboardList,
  CalendarPlus, CalendarCog, Network, BarChart3, Settings, Bell,
  ChevronDown, Camera, RefreshCw, LogOut, CheckCircle, AlertCircle, X,
} from "lucide-react";
import collaxionLogo from "../images/collaxionlogo.jpeg";
import laisonAvatar from "../images/Laison.jpeg";

const BASE_API = "http://localhost:5000";

const NAV_ITEMS = [
  { label: "Companies",     Icon: Building2,     path: "/industry-registrations" },
  { label: "MOUs",          Icon: FileSignature, path: "/mou-management" },
  { label: "Nearby",        Icon: MapPin,        path: "/nearby-industries" },
  { label: "Projects",      Icon: Briefcase,     path: "/industry-projects" },
  { label: "Applications",  Icon: ClipboardList, path: "/student-applications" },
  { label: "Meetings",      Icon: CalendarPlus,  path: "/AdvisoryMeetings" },
  { label: "Events",        Icon: CalendarCog,   path: "/event-creation" },
  { label: "Engagement",    Icon: Network,       path: "/industry-activeness" },
  { label: "Feedback",      Icon: BarChart3,     path: "/ratings-feedback" },
];

export default function LiaisonNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = (location?.pathname || "").toLowerCase();
  const [profile, setProfile] = useState({
    name: "Ms. Tazzaina",
    email: "tazzaina@riphah.edu.pk",
    role: "Industry Liaison Incharge",
    dp: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifPing, setNotifPing] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const dpInputRef = useRef(null);
  const notifBaselineRef = useRef({ ids: new Set(), ready: false });

  // Close profile menu / notif panel on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Fetch profile from backend (one-shot)
  useEffect(() => {
    const safe = (url) => fetch(url).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    (async () => {
      const p = await safe(`${BASE_API}/api/liaison/profile`);
      if (p && typeof p === "object") {
        setProfile((prev) => ({
          ...prev,
          ...(p.name  ? { name:  p.name }  : {}),
          ...(p.email ? { email: p.email } : {}),
          ...(p.role  ? { role:  p.role }  : {}),
          ...(p.dp    ? { dp:    p.dp }    : {}),
        }));
      }
    })();
  }, []);

  // Real-time notifications - poll every 15s
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const r = await fetch(`${BASE_API}/api/liaison-notifications?limit=80`);
        if (!r.ok || cancelled) return;
        const data = await r.json();
        const list = Array.isArray(data?.items) ? data.items : [];
        const baseline = notifBaselineRef.current;
        const ids = new Set(list.map((n) => String(n._id)));
        if (!baseline.ready) {
          baseline.ids = ids;
          baseline.ready = true;
        } else {
          const fresh = list.filter((n) => !baseline.ids.has(String(n._id)));
          if (fresh.length) {
            setNotifPing(true);
            setTimeout(() => setNotifPing(false), 3000);
          }
          baseline.ids = ids;
        }
        if (!cancelled) {
          setNotifications(list);
          setUnread(list.filter((x) => !x.seen).length);
        }
      } catch {}
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const fetchNotifications = async () => {
    try {
      const r = await fetch(`${BASE_API}/api/liaison-notifications?limit=80`);
      if (!r.ok) return;
      const data = await r.json();
      const list = Array.isArray(data?.items) ? data.items : [];
      setNotifications(list);
      setUnread(list.filter((x) => !x.seen).length);
    } catch {}
  };

  const markNotificationSeen = async (id) => {
    try {
      const r = await fetch(`${BASE_API}/api/liaison-notifications/${id}/seen`, { method: "PATCH" });
      if (!r.ok) return;
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, seen: true } : n)));
      setUnread((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllNotificationsSeen = async () => {
    try {
      await fetch(`${BASE_API}/api/liaison-notifications/mark-all-seen`, { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
      setUnread(0);
    } catch {}
  };

  const dismissNotification = async (id) => {
    setNotifications((prev) => {
      const target = prev.find((n) => n._id === id);
      if (target && !target.seen) setUnread((u) => Math.max(0, u - 1));
      return prev.filter((n) => n._id !== id);
    });
    try { await fetch(`${BASE_API}/api/liaison-notifications/${id}`, { method: "DELETE" }); } catch {}
  };

  // Listen for profile updates broadcast from other pages (e.g. Settings)
  // so the navbar avatar/name reflect changes without a refresh.
  useEffect(() => {
    const onUpdated = (e) => {
      const p = e?.detail;
      if (!p || typeof p !== "object") return;
      setProfile((prev) => ({
        ...prev,
        ...(p.name  ? { name:  p.name }  : {}),
        ...(p.email ? { email: p.email } : {}),
        ...(p.role  ? { role:  p.role }  : {}),
        ...(typeof p.dp === "string" ? { dp: p.dp } : {}),
      }));
    };
    window.addEventListener("liaison-profile-updated", onUpdated);
    return () => window.removeEventListener("liaison-profile-updated", onUpdated);
  }, []);

  const saveProfile = async (patch) => {
    setProfileSaving(true);
    try {
      const r = await fetch(`${BASE_API}/api/liaison/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!r.ok) return;
      const saved = await r.json();
      setProfile((prev) => ({ ...prev, ...saved }));
      try { window.dispatchEvent(new CustomEvent("liaison-profile-updated", { detail: saved })); } catch {}
    } catch {}
    finally { setProfileSaving(false); }
  };

  const handleDpChange = (file) => {
    if (!file || !file.type?.startsWith("image/")) return;
    if (file.size > 6 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result;
      if (typeof dataUrl !== "string") return;
      setProfile((prev) => ({ ...prev, dp: dataUrl }));
      await saveProfile({ dp: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    try { localStorage.clear(); sessionStorage.clear(); } catch {}
    navigate("/role-select", { replace: true });
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 9999, isolation: "isolate",
      background: "linear-gradient(135deg, rgba(15,42,56,0.96) 0%, rgba(25,54,72,0.96) 50%, rgba(31,65,89,0.96) 100%)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      boxShadow: "0 8px 28px rgba(15,42,56,0.28)",
      width: "100%", maxWidth: "100%",
      display: "flex", alignItems: "center", gap: 14,
      padding: "16px 26px", minHeight: 84, flexWrap: "wrap",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      boxSizing: "border-box",
      fontFamily: "'Inter', 'Poppins', sans-serif",
    }}>
      <span aria-hidden style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: 2,
        background: "linear-gradient(90deg, transparent 0%, rgba(122,169,214,0.6) 30%, rgba(170,195,252,0.7) 50%, rgba(122,169,214,0.6) 70%, transparent 100%)",
        opacity: 0.7, pointerEvents: "none",
      }} />

      {/* Brand */}
      <div onClick={() => navigate("/maindashboard")} style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, cursor: "pointer" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
          border: "1px solid rgba(255,255,255,0.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 18px rgba(15,42,56,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}>
          <img src={collaxionLogo} alt="CollaXion" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.2)" }} />
        </div>
        <div>
          <div style={{
            fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em", lineHeight: 1.1,
            background: "linear-gradient(90deg, #ffffff 0%, #E2EEF9 50%, #AAC3FC 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>CollaXion</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 4 }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "#22C55E",
              boxShadow: "0 0 0 3px rgba(34,197,94,0.25), 0 0 8px rgba(34,197,94,0.6)",
            }} />
            <span style={{ fontSize: 9, color: "rgba(226,238,249,0.78)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Industry Liaison Incharge
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes liaisonTabIn {
          0%   { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .liaisonNavTab {
          opacity: 0;
          animation: liaisonTabIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          position: relative; overflow: hidden;
          transition: background 0.25s ease, color 0.25s ease,
                      transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .liaisonNavTab::before {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%);
          transform: translateX(-120%);
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .liaisonNavTab:hover::before { transform: translateX(120%); }
        .liaisonNavTab::after {
          content: ""; position: absolute; left: 14px; right: 14px; bottom: 4px; height: 2px;
          background: linear-gradient(90deg, transparent, #AAC3FC, transparent);
          transform: scaleX(0); transform-origin: center;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .liaisonNavTab:hover {
          background: rgba(170,195,252,0.16) !important;
          border-color: rgba(170,195,252,0.32) !important;
          color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(58,112,176,0.32), inset 0 1px 0 rgba(255,255,255,0.10);
        }
        .liaisonNavTab:hover::after { transform: scaleX(1); }
        .liaisonNavTab:hover .liaisonNavTabIcon { transform: rotate(-6deg) scale(1.10); }
        .liaisonNavTabIcon { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, alignItems: "center", flex: "1 1 auto", minWidth: 0, justifyContent: "center", flexWrap: "wrap" }}>
        {NAV_ITEMS.map((it, i) => (
          <button
            key={it.path}
            className="liaisonNavTab"
            title={it.label}
            onClick={() => navigate(it.path)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 12px", borderRadius: 11,
              background: "transparent", border: "1px solid transparent",
              color: "#ffffff",
              fontSize: 12.5, fontWeight: 700,
              letterSpacing: "0.01em",
              cursor: "pointer",
              whiteSpace: "nowrap",
              textShadow: "0 1px 2px rgba(15,42,56,0.55)",
              animationDelay: `${0.05 + i * 0.04}s`,
            }}
          >
            <it.Icon size={14} className="liaisonNavTabIcon" />
            <span>{it.label}</span>
          </button>
        ))}
      </div>

      {/* Right cluster */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            onClick={() => setNotifOpen((s) => !s)}
            title="Notifications"
            style={{
              position: "relative",
              width: 38, height: 38, borderRadius: 10,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
              color: "#fff", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.18s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          >
            <Bell size={16} />
            {notifPing && (
              <span aria-hidden style={{
                position: "absolute", top: -2, right: -2,
                width: 22, height: 22, borderRadius: "50%",
                background: "rgba(239,68,68,0.35)",
                animation: "liaisonPing 1.4s cubic-bezier(0,0,0.2,1) infinite",
                pointerEvents: "none",
              }} />
            )}
            {unread > 0 && (
              <span style={{
                position: "absolute", top: -3, right: -3,
                background: "#ef4444", color: "#fff",
                fontSize: 9, minWidth: 16, height: 16, padding: "0 4px",
                borderRadius: 999,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, border: "2px solid #193648",
              }}>{Math.min(99, unread)}</span>
            )}
          </button>
          <style>{`
            @keyframes liaisonPing {
              0%   { transform: scale(0.6); opacity: 0.85; }
              80%  { transform: scale(2);   opacity: 0; }
              100% { transform: scale(2);   opacity: 0; }
            }
          `}</style>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
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
                  zIndex: 10000,
                  display: "flex", flexDirection: "column",
                }}
              >
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
                        {unread > 0 && (
                          <span style={{
                            fontSize: 10, fontWeight: 800, letterSpacing: "0.04em",
                            padding: "2px 7px", borderRadius: 999,
                            background: "#ef4444", color: "#fff",
                            boxShadow: "0 0 0 2px rgba(239,68,68,0.25)",
                            fontVariantNumeric: "tabular-nums",
                          }}>{unread}</span>
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
                            animation: "liaisonPing 1.8s cubic-bezier(0,0,0.2,1) infinite",
                          }} />
                          <span style={{ position: "relative", width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
                        </span>
                        Live · auto-sync 15s
                      </div>
                    </div>
                    {unread > 0 && (
                      <button
                        onClick={markAllNotificationsSeen}
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
                        const tag = (n.type || n.category || "info").toLowerCase();
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
                            onClick={() => {
                              if (!n.seen) markNotificationSeen(n._id);
                              if (n.link) {
                                setNotifOpen(false);
                                navigate(n.link);
                              }
                            }}
                            style={{
                              position: "relative",
                              display: "flex", gap: 10, alignItems: "flex-start",
                              padding: "11px 12px", borderRadius: 12,
                              background: n.seen ? "#fff" : "linear-gradient(180deg, #f8fbff, #ffffff)",
                              border: `1px solid ${n.seen ? "#eef2ff" : p.bg}`,
                              boxShadow: n.seen ? "none" : `0 2px 10px ${p.color}14`,
                              overflow: "hidden",
                              cursor: n.link ? "pointer" : "default",
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
                            <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
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
                                onClick={() => dismissNotification(n._id)}
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

        <div style={{ position: "relative" }} ref={profileRef}>
          <button
            onClick={() => setProfileOpen((s) => !s)}
            title={`${profile.name} · ${profile.role}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 10px 4px 4px", borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#fff", cursor: "pointer", flexShrink: 0,
            }}
          >
            <span style={{
              position: "relative", width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg, #193648, #3A70B0)", padding: 2,
              flexShrink: 0,
            }}>
              <img
                src={profile.dp || laisonAvatar}
                alt={profile.name}
                onError={(e) => { if (e.currentTarget.src !== laisonAvatar) e.currentTarget.src = laisonAvatar; }}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", display: "block" }}
              />
              <span style={{
                position: "absolute", bottom: -1, right: -1,
                width: 9, height: 9, borderRadius: "50%",
                background: "#22C55E", border: "2px solid #193648",
              }} />
            </span>
            <ChevronDown size={13} style={{ transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.18s ease" }} />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                style={{
                  position: "absolute", right: 0, top: 50, width: 280,
                  background: "#fff", color: "#193648",
                  border: "1px solid #E2EEF9", borderRadius: 14,
                  boxShadow: "0 24px 60px rgba(15,23,42,0.20)",
                  padding: 14, zIndex: 1200,
                }}
              >
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 6px 14px", borderBottom: "1px dashed #E2EEF9", marginBottom: 10,
                }}>
                  <button
                    type="button"
                    onClick={() => dpInputRef.current?.click()}
                    title="Click to change photo"
                    disabled={profileSaving}
                    style={{
                      position: "relative",
                      width: 50, height: 50, borderRadius: "50%",
                      background: "linear-gradient(135deg, #193648, #3A70B0)", padding: 2,
                      flexShrink: 0, border: "none",
                      cursor: profileSaving ? "wait" : "pointer", overflow: "hidden",
                    }}
                  >
                    <img
                      src={profile.dp || laisonAvatar}
                      alt={profile.name}
                      onError={(e) => { if (e.currentTarget.src !== laisonAvatar) e.currentTarget.src = laisonAvatar; }}
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", display: "block" }}
                    />
                    {profileSaving && (
                      <span aria-hidden style={{
                        position: "absolute", inset: 2, borderRadius: "50%",
                        background: "rgba(15,42,56,0.55)", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <RefreshCw size={14} />
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
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{profile.role}</div>
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
                <button onClick={() => navigate("/system-settings")} style={{
                  display: "flex", alignItems: "center", gap: 9, width: "100%",
                  padding: "9px 12px", borderRadius: 10,
                  background: "#f8fbff", border: "1px solid #E2EEF9", color: "#193648",
                  fontWeight: 700, fontSize: 12.5, cursor: "pointer", marginBottom: 8,
                }}>
                  <Settings size={13} color="#3A70B0" /> System Settings
                </button>
                <button onClick={handleLogout} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%",
                  padding: "9px 12px",
                  background: "rgba(239,68,68,0.08)", color: "#be123c",
                  border: "1px solid rgba(239,68,68,0.20)",
                  borderRadius: 10, fontWeight: 700, fontSize: 12.5, cursor: "pointer",
                }}>
                  <LogOut size={14} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
