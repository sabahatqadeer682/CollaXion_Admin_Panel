import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, FileSignature, MapPin, Briefcase, ClipboardList,
  CalendarPlus, CalendarCog, Network, BarChart3, Settings, Bell,
  ChevronDown, Camera, RefreshCw, LogOut,
} from "lucide-react";
import collaxionLogo from "../images/collaxionlogo.jpeg";
import laisonAvatar from "../images/Laison.jpeg";

const BASE_API = "http://localhost:5000";

const NAV_ITEMS = [
  { label: "Industries",    Icon: Building2,     path: "/industry-registrations" },
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
  const [profile, setProfile] = useState({
    name: "Ms. Tazzaina",
    email: "tazzaina@riphah.edu.pk",
    role: "Industry Liaison Incharge",
    dp: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const profileRef = useRef(null);
  const dpInputRef = useRef(null);

  // Close profile menu on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Fetch profile + unread count from backend
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
      const n = await safe(`${BASE_API}/api/liaison-notifications?limit=80`);
      if (n?.items) setUnread(n.items.filter((x) => !x.seen).length);
    })();
  }, []);

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
      position: "sticky", top: 0, zIndex: 1500,
      background: "linear-gradient(135deg, rgba(15,42,56,0.96) 0%, rgba(25,54,72,0.96) 50%, rgba(31,65,89,0.96) 100%)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      boxShadow: "0 8px 28px rgba(15,42,56,0.28)",
      width: "100%", maxWidth: "100%",
      display: "flex", alignItems: "center", gap: 14,
      padding: "10px 24px", flexWrap: "wrap",
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

      {/* Tabs */}
      <div style={{ display: "flex", gap: 3, alignItems: "center", flex: "1 1 auto", minWidth: 0, justifyContent: "center", flexWrap: "wrap" }}>
        {NAV_ITEMS.map((it) => (
          <button
            key={it.path}
            title={it.label}
            onClick={() => navigate(it.path)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 10px", borderRadius: 10,
              background: "transparent", border: "1px solid transparent",
              color: "rgba(226,238,249,0.70)",
              fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(226,238,249,0.70)"; e.currentTarget.style.transform = ""; }}
          >
            <it.Icon size={13} />
            <span>{it.label}</span>
          </button>
        ))}
      </div>

      {/* Right cluster */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <button onClick={() => navigate("/system-settings")} title="System Settings" style={{
          width: 38, height: 38, borderRadius: 10,
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
          color: "#fff", cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.18s ease, transform 0.4s ease",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.16)"; e.currentTarget.style.transform = "rotate(90deg)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = ""; }}
        >
          <Settings size={16} />
        </button>

        <button onClick={() => navigate("/maindashboard")} title="Notifications" style={{
          position: "relative",
          width: 38, height: 38, borderRadius: 10,
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
          color: "#fff", cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
        >
          <Bell size={16} />
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
