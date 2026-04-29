import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User as UserIcon, Lock, Eye, EyeOff, ArrowRight, ShieldCheck,
  Sparkles, AlertCircle, Building2, Handshake, Briefcase,
} from "lucide-react";
import collaxionLogo from "../images/collaxionlogo.jpeg";
import bgImage from "../images/loginadmin.avif";

const LoginScreenWeb = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Please enter your username";
    if (!password) newErrors.password = "Please enter your password";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        navigate("/dashboard");
      } else {
        setErrors({ password: "Invalid admin credentials. Please try again." });
        setLoading(false);
      }
    }, 600);
  };

  // Inject animations + focus styles once
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes cx-fadeup     { 0% { opacity: 0; transform: translateY(28px); } 100% { opacity: 1; transform: translateY(0); } }
      @keyframes cx-slidedown  { 0% { opacity: 0; transform: translateY(-14px); } 100% { opacity: 1; transform: translateY(0); } }
      @keyframes cx-spin       { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes cx-spinrev    { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      @keyframes cx-drift1     { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-25px) scale(1.08); } }
      @keyframes cx-drift2     { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-40px,30px) scale(1.12); } }
      @keyframes cx-pulse      { 0%,100% { transform: scale(1); opacity: 0.55; } 50% { transform: scale(1.12); opacity: 0.85; } }
      @keyframes cx-shine      { 0% { background-position: -240px 0; } 100% { background-position: 240px 0; } }
      @keyframes cx-arrowSlide { 0%,100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
      @keyframes cx-spark      { 0%,100% { opacity: 0; transform: scale(0.6); } 50% { opacity: 0.9; transform: scale(1.1); } }

      .cx-input:focus {
        border-color: #193648 !important;
        box-shadow: 0 0 0 4px rgba(25, 54, 72, 0.10) !important;
      }
      .cx-input:focus + .cx-input-icon { color: #193648 !important; }

      .cx-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 30px rgba(25,54,72,0.32); }
      .cx-btn:active { transform: translateY(0); }
      .cx-btn:disabled { cursor: progress; opacity: 0.85; }

      .cx-card { animation: cx-fadeup 0.7s ease both; }
      .cx-side { animation: cx-fadeup 0.9s ease both; }

      .cx-feat { animation: cx-slidedown 0.6s ease both; }
      .cx-feat:nth-child(1) { animation-delay: 0.10s; }
      .cx-feat:nth-child(2) { animation-delay: 0.22s; }
      .cx-feat:nth-child(3) { animation-delay: 0.34s; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={s.page}>
      {/* ── LEFT SIDE ─────────────────────────────────────────────── */}
      <div style={s.left}>
        {/* Background image layer (subtle, with overlay) */}
        <div style={s.leftPhoto} />
        <div style={s.leftBg} />
        <div style={s.gridOverlay} />
        <div style={{ ...s.blob, ...s.blobA }} />
        <div style={{ ...s.blob, ...s.blobB }} />

        {/* Sparkles */}
        {[
          { top: "12%", left: "8%",  size: 8,  delay: "0s"   },
          { top: "20%", left: "82%", size: 6,  delay: "0.6s" },
          { top: "68%", left: "10%", size: 7,  delay: "1.2s" },
          { top: "78%", left: "84%", size: 9,  delay: "1.8s" },
          { top: "40%", left: "18%", size: 5,  delay: "2.4s" },
        ].map((sp, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              top: sp.top, left: sp.left,
              width: sp.size, height: sp.size,
              borderRadius: "50%",
              background: "radial-gradient(circle, #E2EEF9 0%, rgba(226,238,249,0) 70%)",
              animation: `cx-spark 3s ease-in-out infinite`,
              animationDelay: sp.delay,
              pointerEvents: "none",
            }}
          />
        ))}

        <div className="cx-side" style={s.leftContent}>
          {/* Logo medallion */}
          <div style={s.medallion}>
            <span style={{ ...s.ring, animation: "cx-spin 14s linear infinite" }} />
            <span style={{ ...s.ringInner, animation: "cx-spinrev 9s linear infinite" }} />
            <span style={{ ...s.ringPulse, animation: "cx-pulse 2.6s ease-in-out infinite" }} />
            <div style={s.logoBadge}>
              <img src={collaxionLogo} alt="CollaXion" style={s.logoImg} />
            </div>
          </div>

          {/* Eyebrow */}
          <div style={s.eyebrow}>
            <Sparkles size={12} /> Where Academia Meets Industry
          </div>

          {/* Brand title */}
          <h1 style={s.brandTitle}>
            Welcome to <span style={s.brandTitleAccent}>CollaXion</span>
          </h1>

          {/* Tagline */}
          <p style={s.brandSubtitle}>
            <span style={s.shimmer}>Bridging</span> universities &amp; industries - manage MOUs,
            student applications, events, and partnerships from one elegant workspace.
          </p>

          {/* Feature pills */}
          <div style={s.features}>
            <div className="cx-feat" style={s.featPill}>
              <span style={s.featIcon}><Handshake size={14} color="#fff" /></span>
              <span>MOU &amp; Partnerships Management</span>
            </div>
            <div className="cx-feat" style={s.featPill}>
              <span style={s.featIcon}><Briefcase size={14} color="#fff" /></span>
              <span>Internships &amp; Student Applications</span>
            </div>
            <div className="cx-feat" style={s.featPill}>
              <span style={s.featIcon}><Building2 size={14} color="#fff" /></span>
              <span>Industry Engagement &amp; Events</span>
            </div>
          </div>
        </div>

        {/* Footer line */}
        <div style={s.leftFooter}>
          <span style={s.footerDot} />
          <span>Powered by <strong>CollaXion</strong> · Bridging Academia &amp; Industry</span>
        </div>
      </div>

      {/* ── RIGHT SIDE ────────────────────────────────────────────── */}
      <div style={s.right}>
        {/* Subtle background blobs */}
        <div style={{ ...s.rightBlob, ...s.rightBlobA }} />
        <div style={{ ...s.rightBlob, ...s.rightBlobB }} />

        <div className="cx-card" style={s.card}>
          {/* Top accent bar */}
          <span style={s.cardAccent} />

          {/* Mini brand strip on the card */}
          <div style={s.cardBrand}>
            <div style={s.cardBrandBadge}>
              <img src={collaxionLogo} alt="CollaXion" style={s.cardBrandImg} />
            </div>
            <span style={s.cardBrandText}>
              Colla<span style={{ color: "#3A70B0" }}>X</span>ion
            </span>
          </div>

          <div style={s.cardEyebrow}>
            <ShieldCheck size={11} /> Secure Sign In
          </div>
          <h2 style={s.title}>Welcome back</h2>
          <span style={s.titleUnderline} />
          <p style={s.subtitle}>
            Sign in to your <strong style={{ color: "#193648" }}>Admin</strong> dashboard
          </p>

          <form onSubmit={handleSubmit} style={s.form} autoComplete="off">
            {/* Username */}
            <label style={s.label}>Username</label>
            <div style={s.inputWrap}>
              <UserIcon size={16} className="cx-input-icon" style={s.inputIcon} />
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="cx-input"
                style={{
                  ...s.input,
                  borderColor: errors.username ? "#EF4444" : "#E2EEF9",
                }}
              />
            </div>
            {errors.username && (
              <p style={s.error}><AlertCircle size={12} /> {errors.username}</p>
            )}

            {/* Password */}
            <label style={{ ...s.label, marginTop: 14 }}>Password</label>
            <div style={s.inputWrap}>
              <Lock size={16} className="cx-input-icon" style={s.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cx-input"
                style={{
                  ...s.input,
                  paddingRight: 40,
                  borderColor: errors.password ? "#EF4444" : "#E2EEF9",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={s.eyeBtn}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && (
              <p style={s.error}><AlertCircle size={12} /> {errors.password}</p>
            )}

            {/* Helpers row */}
            <div style={s.helperRow}>
              <label style={s.remember}>
                <input type="checkbox" style={s.checkbox} /> Remember me
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="cx-btn" style={s.button} disabled={loading}>
              {loading ? (
                <>
                  <span style={s.spinner} /> Signing you in…
                </>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>

            {/* Security line */}
            <div style={s.secure}>
              <ShieldCheck size={13} color="#22C55E" />
              <span>Your session is encrypted &amp; secure</span>
            </div>
          </form>
        </div>
      </div>

      {/* Small spinner keyframes inline */}
      <style>{`
        .cx-spinner-anim { animation: cx-spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Poppins', sans-serif",
    background: "#FFFFFF",
    overflow: "hidden",
  },

  // ── LEFT ──
  left: {
    flex: 1.05,
    position: "relative",
    overflow: "hidden",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "50px 56px",
  },
  leftPhoto: {
    position: "absolute", inset: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "saturate(0.9)",
    zIndex: 0,
  },
  leftBg: {
    position: "absolute", inset: 0,
    background:
      "radial-gradient(circle at 18% 20%, rgba(31,65,89,0.85) 0%, rgba(31,65,89,0) 60%), " +
      "radial-gradient(circle at 82% 78%, rgba(44,95,128,0.80) 0%, rgba(44,95,128,0) 55%), " +
      "linear-gradient(135deg, rgba(15,42,56,0.92) 0%, rgba(25,54,72,0.86) 55%, rgba(27,63,88,0.82) 100%)",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
    zIndex: 0,
  },
  gridOverlay: {
    position: "absolute", inset: 0, zIndex: 0,
    backgroundImage:
      "linear-gradient(rgba(226,238,249,0.05) 1px, transparent 1px), " +
      "linear-gradient(90deg, rgba(226,238,249,0.05) 1px, transparent 1px)",
    backgroundSize: "44px 44px",
    WebkitMaskImage:
      "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 75%)",
    maskImage:
      "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 75%)",
    pointerEvents: "none",
  },
  blob: {
    position: "absolute", borderRadius: "50%", filter: "blur(80px)",
    pointerEvents: "none", zIndex: 0,
  },
  blobA: {
    width: 460, height: 460, top: "-12%", left: "-10%",
    background: "radial-gradient(circle, rgba(226,238,249,0.30) 0%, rgba(226,238,249,0) 70%)",
    animation: "cx-drift1 11s ease-in-out infinite",
  },
  blobB: {
    width: 520, height: 520, bottom: "-18%", right: "-12%",
    background: "radial-gradient(circle, rgba(58,112,176,0.40) 0%, rgba(58,112,176,0) 70%)",
    animation: "cx-drift2 13s ease-in-out infinite",
  },

  leftContent: {
    position: "relative", zIndex: 1,
    maxWidth: 540,
  },
  medallion: {
    position: "relative",
    width: 92, height: 92,
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 22,
  },
  ring: {
    position: "absolute", inset: 0, borderRadius: "50%",
    border: "1.5px dashed rgba(226,238,249,0.45)",
  },
  ringInner: {
    position: "absolute", inset: 8, borderRadius: "50%",
    border: "1.5px solid rgba(226,238,249,0.20)",
    borderTopColor: "rgba(226,238,249,0.85)",
  },
  ringPulse: {
    position: "absolute", inset: -6, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(226,238,249,0.30) 0%, rgba(226,238,249,0) 70%)",
  },
  logoBadge: {
    width: 64, height: 64, borderRadius: "50%",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.22)",
    boxShadow: "0 14px 30px rgba(15,42,56,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 2,
  },
  logoImg: { width: 52, height: 52, borderRadius: "50%", objectFit: "cover" },

  eyebrow: {
    display: "inline-flex", alignItems: "center", gap: 7,
    padding: "5px 11px", borderRadius: 999,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
    textTransform: "uppercase", color: "#E2EEF9", marginBottom: 18,
  },
  brandTitle: {
    fontSize: "clamp(2rem, 3.4vw, 2.8rem)",
    fontWeight: 900, margin: "0 0 12px 0",
    color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.05,
  },
  brandTitleAccent: {
    background: "linear-gradient(135deg, #FFFFFF 0%, #E2EEF9 50%, #AAC3FC 100%)",
    WebkitBackgroundClip: "text", backgroundClip: "text",
    WebkitTextFillColor: "transparent", color: "transparent",
  },
  brandSubtitle: {
    fontSize: "0.97rem", lineHeight: 1.65,
    color: "rgba(226,238,249,0.78)",
    margin: "0 0 26px 0", maxWidth: 480,
  },
  shimmer: {
    background: "linear-gradient(90deg, #E2EEF9 0%, #AAC3FC 30%, #E2EEF9 70%)",
    backgroundSize: "240px 100%",
    WebkitBackgroundClip: "text", backgroundClip: "text",
    WebkitTextFillColor: "transparent", color: "transparent",
    animation: "cx-shine 3s linear infinite",
    fontWeight: 800,
  },

  features: { display: "flex", flexDirection: "column", gap: 9 },
  featPill: {
    display: "inline-flex", alignItems: "center", gap: 10,
    padding: "9px 14px",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
    border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: 14, color: "rgba(226,238,249,0.95)",
    fontSize: 13, fontWeight: 500, width: "fit-content",
    boxShadow: "0 6px 18px rgba(15,42,56,0.25)",
  },
  featIcon: {
    width: 26, height: 26, borderRadius: 8,
    background: "linear-gradient(135deg, #3A70B0, #193648)",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 10px rgba(25,54,72,0.4)",
    flexShrink: 0,
  },

  leftFooter: {
    position: "absolute", bottom: 22, left: 56,
    display: "flex", alignItems: "center", gap: 8,
    fontSize: 11, color: "rgba(226,238,249,0.55)",
    letterSpacing: "0.04em", zIndex: 1,
  },
  footerDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "#22C55E",
    boxShadow: "0 0 0 3px rgba(34,197,94,0.20)",
  },

  // ── RIGHT ──
  right: {
    flex: 1,
    position: "relative",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #FFFFFF 0%, #F4F9FD 60%, #E2EEF9 100%)",
    padding: "40px 24px",
    overflow: "hidden",
  },
  rightBlob: {
    position: "absolute", borderRadius: "50%", filter: "blur(70px)",
    pointerEvents: "none",
  },
  rightBlobA: {
    width: 360, height: 360, top: "-12%", right: "-8%",
    background: "radial-gradient(circle, rgba(58,112,176,0.20) 0%, rgba(58,112,176,0) 70%)",
  },
  rightBlobB: {
    width: 320, height: 320, bottom: "-12%", left: "-10%",
    background: "radial-gradient(circle, rgba(207,224,240,0.55) 0%, rgba(207,224,240,0) 70%)",
  },

  card: {
    position: "relative",
    width: "100%", maxWidth: 440,
    background: "linear-gradient(160deg, #FFFFFF 0%, #F8FBFE 100%)",
    border: "1px solid #E2EEF9",
    borderRadius: 24,
    padding: "36px 34px 30px",
    boxShadow:
      "0 30px 70px rgba(25,54,72,0.16), " +
      "0 0 0 1px rgba(25,54,72,0.04), " +
      "inset 0 0 0 1px rgba(255,255,255,0.7)",
    overflow: "hidden",
    zIndex: 1,
    backdropFilter: "blur(8px)",
  },
  cardAccent: {
    position: "absolute", top: 0, left: 0, right: 0, height: 5,
    background: "linear-gradient(90deg, #193648, #3A70B0, #193648)",
    backgroundSize: "200% 100%",
    animation: "cx-shine 4s linear infinite",
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
  },

  cardBrand: {
    display: "flex", alignItems: "center", gap: 9,
    marginBottom: 18, color: "#193648",
  },
  cardBrandBadge: {
    width: 34, height: 34, borderRadius: 9,
    background: "#E2EEF9", border: "1px solid #CFE0F0",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  cardBrandImg: { width: 26, height: 26, borderRadius: "50%", objectFit: "cover" },
  cardBrandText: {
    fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.01em",
  },

  cardEyebrow: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 10px", borderRadius: 999,
    background: "#E2EEF9",
    color: "#193648",
    fontSize: 10, fontWeight: 800, letterSpacing: "0.14em",
    textTransform: "uppercase",
    border: "1px solid #CFE0F0",
    marginBottom: 12,
    width: "fit-content",
  },
  title: {
    fontSize: "1.7rem", fontWeight: 800, color: "#193648",
    margin: 0, letterSpacing: "-0.015em", lineHeight: 1.15,
  },
  titleUnderline: {
    display: "block",
    width: 44, height: 3,
    borderRadius: 4,
    background: "linear-gradient(90deg, #193648, #3A70B0)",
    margin: "10px 0 8px",
  },
  subtitle: {
    fontSize: "0.92rem", color: "#5b7184",
    margin: "0 0 22px 0",
  },

  form: { display: "flex", flexDirection: "column" },
  label: {
    fontSize: "0.78rem", fontWeight: 700, color: "#193648",
    letterSpacing: "0.04em", textTransform: "uppercase",
    marginBottom: 6,
  },
  inputWrap: {
    position: "relative",
    display: "flex", alignItems: "center",
  },
  inputIcon: {
    position: "absolute", left: 14, color: "#3A70B0",
    transition: "color 0.2s ease",
  },
  input: {
    width: "100%",
    padding: "13px 14px 13px 40px",
    fontSize: "0.95rem",
    borderRadius: 12,
    border: "1.5px solid #E2EEF9",
    outline: "none",
    transition: "all 0.25s ease",
    background: "#F8FBFE",
    color: "#193648",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute", right: 10,
    width: 28, height: 28, borderRadius: 8,
    background: "transparent", border: "none",
    color: "#7d8fa3", cursor: "pointer",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
  },
  error: {
    display: "inline-flex", alignItems: "center", gap: 6,
    color: "#EF4444", fontSize: "0.8rem",
    margin: "6px 0 0 0",
  },

  helperRow: {
    display: "flex", alignItems: "center",
    marginTop: 14, marginBottom: 18,
  },
  remember: {
    display: "inline-flex", alignItems: "center", gap: 7,
    fontSize: "0.84rem", color: "#5b7184", cursor: "pointer",
  },
  checkbox: { accentColor: "#193648", width: 14, height: 14 },

  button: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    width: "100%",
    padding: "13px 18px",
    background: "linear-gradient(135deg, #193648 0%, #2C5F80 100%)",
    color: "#fff",
    fontSize: "0.95rem", fontWeight: 700,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 10px 24px rgba(25,54,72,0.28)",
    letterSpacing: "0.02em",
  },
  spinner: {
    display: "inline-block",
    width: 14, height: 14, borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#fff",
    animation: "cx-spin 0.8s linear infinite",
  },

  secure: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    fontSize: "0.78rem", color: "#7d8fa3",
    marginTop: 16,
  },
};

export default LoginScreenWeb;
