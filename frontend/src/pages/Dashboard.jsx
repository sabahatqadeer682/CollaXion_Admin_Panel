// src/pages/Dashboard.jsx — CollaXion splash / loading screen
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import collaxionLogo from "../images/collaxionlogo.jpeg";
import internImg from "../images/intern.jpeg";
import event1 from "../images/event1.png";
import event3 from "../images/event3.jpg";
import event4 from "../images/event4.jpg";
import event5 from "../images/event5.jpg";

const TAGLINES = [
  "Connecting universities & industries…",
  "Preparing your collaboration workspace…",
  "Loading the latest opportunities…",
  "Almost there — let's get to work.",
];

const FLOAT_CARDS = [
  { src: internImg, label: "Internships",     top: "22%", left: "10%", r: -8, delay: 0.45, size: 110 },
  { src: event1,    label: "Industry Events", top: "16%", left: "85%", r:  9, delay: 0.55, size: 120 },
  { src: event3,    label: "Hackathons",      top: "70%", left: "12%", r: -6, delay: 0.65, size: 100 },
  { src: event4,    label: "Webinars",        top: "70%", left: "86%", r:  7, delay: 0.75, size: 100 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [tagIdx, setTagIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => navigate("/maindashboard"), 3500);
    return () => clearTimeout(t);
  }, [navigate]);

  useEffect(() => {
    const id = setInterval(() => setTagIdx((i) => (i + 1) % TAGLINES.length), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={s.page}>
      {/* ── Decorative grid pattern ────────────────────────────────────── */}
      <div aria-hidden style={s.grid} />

      {/* ── Ambient gradient blobs ─────────────────────────────────────── */}
      <motion.div
        aria-hidden
        style={{ ...s.blob, ...s.blobA }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        style={{ ...s.blob, ...s.blobB }}
        animate={{ x: [0, -50, 0], y: [0, 25, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        style={{ ...s.blob, ...s.blobC }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Floating decorative image cards ────────────────────────────── */}
      <div style={s.floatLayer}>
        {FLOAT_CARDS.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: c.top,
              left: c.left,
              transform: `translate(-50%, -50%) rotate(${c.r}deg)`,
              width: c.size,
              pointerEvents: "none",
            }}
          >
            <motion.div
              style={s.floatCard}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: c.delay },
                scale:   { type: "spring", stiffness: 200, damping: 18, delay: c.delay },
                y:       { duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: c.delay + 0.4 },
              }}
            >
              <img src={c.src} alt={c.label} style={s.floatImg} />
              <div style={s.floatLabel}>{c.label}</div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* ── Center stage ──────────────────────────────────────────────── */}
      <div style={s.center}>
        {/* Logo with rotating glow ring */}
        <div style={s.logoWrap}>
          <motion.div
            aria-hidden
            style={s.ring}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            aria-hidden
            style={s.ringInner}
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            aria-hidden
            style={s.ringPulse}
            animate={{ scale: [1, 1.15, 1], opacity: [0.55, 0.2, 0.55] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            style={s.logoBadge}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.15 }}
          >
            <img src={collaxionLogo} alt="CollaXion" style={s.logoImg} />
          </motion.div>
        </div>

        {/* Eyebrow */}
        <motion.div
          style={s.eyebrow}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          ✦ Welcome to
        </motion.div>

        {/* Title (gradient) */}
        <motion.h1
          style={s.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          Colla<span style={s.titleAccent}>X</span>ion
        </motion.h1>

        {/* Tagline */}
        <motion.p
          style={s.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.5 }}
        >
          University <span style={s.connector}>↔</span> Industry Collaboration Platform
        </motion.p>

        {/* Cycling loading messages */}
        <div style={s.loadWrap}>
          <motion.span
            aria-hidden
            style={s.dot}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={tagIdx}
              style={s.loadText}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
            >
              {TAGLINES[tagIdx]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div style={s.progressOuter}>
          <motion.div
            style={s.progressInner}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* ── Footer brand line ─────────────────────────────────────────── */}
      <motion.div
        style={s.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <span style={s.footerDot} />
        <span>Powered by <strong>CollaXion</strong> · Bridging Academia &amp; Industry</span>
      </motion.div>
    </div>
  );
};

export default Dashboard;

// ───────────────────────────────────────────────────────────────────────
//   Styles
// ───────────────────────────────────────────────────────────────────────
const s = {
  page: {
    position: "relative",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
    background:
      "radial-gradient(circle at 18% 20%, #E2EEF9 0%, transparent 60%), " +
      "radial-gradient(circle at 82% 78%, #CFE0F0 0%, transparent 55%), " +
      "linear-gradient(135deg, #FFFFFF 0%, #F4F9FD 55%, #E2EEF9 100%)",
    color: "#193648",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Subtle grid pattern overlay
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(25,54,72,0.06) 1px, transparent 1px), " +
      "linear-gradient(90deg, rgba(25,54,72,0.06) 1px, transparent 1px)",
    backgroundSize: "44px 44px",
    maskImage:
      "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)",
    WebkitMaskImage:
      "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)",
    pointerEvents: "none",
  },

  // Animated blobs
  blob: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  blobA: {
    width: 420, height: 420,
    background: "radial-gradient(circle, rgba(25,54,72,0.18) 0%, rgba(25,54,72,0) 70%)",
    top: "-12%", left: "-8%",
  },
  blobB: {
    width: 460, height: 460,
    background: "radial-gradient(circle, rgba(58,112,176,0.30) 0%, rgba(58,112,176,0) 70%)",
    bottom: "-15%", right: "-10%",
  },
  blobC: {
    width: 280, height: 280,
    background: "radial-gradient(circle, rgba(207,224,240,0.55) 0%, rgba(207,224,240,0) 70%)",
    top: "30%", left: "55%",
  },

  // Floating image cards
  floatLayer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  floatCard: {
    position: "relative",
    borderRadius: 18,
    overflow: "hidden",
    background: "#fff",
    border: "1px solid #E2EEF9",
    boxShadow:
      "0 18px 50px rgba(25,54,72,0.18), inset 0 0 0 1px rgba(255,255,255,0.6)",
    width: "100%",
  },
  floatImg: {
    width: "100%",
    height: 80,
    objectFit: "cover",
    display: "block",
  },
  floatLabel: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#193648",
    textAlign: "center",
    padding: "7px 8px",
    background: "#E2EEF9",
  },

  // Center stage
  center: {
    position: "relative",
    zIndex: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    textAlign: "center",
    padding: "0 24px",
    maxWidth: 560,
  },

  // Logo + rings
  logoWrap: {
    position: "relative",
    width: 150,
    height: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  ring: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "1.5px dashed rgba(25,54,72,0.30)",
  },
  ringInner: {
    position: "absolute",
    inset: 18,
    borderRadius: "50%",
    border: "1.5px solid rgba(25,54,72,0.12)",
    borderTopColor: "#193648",
  },
  ringPulse: {
    position: "absolute",
    inset: -6,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(25,54,72,0.20) 0%, rgba(25,54,72,0) 70%)",
  },
  logoBadge: {
    width: 92,
    height: 92,
    borderRadius: "50%",
    background: "#fff",
    border: "1px solid #E2EEF9",
    boxShadow:
      "0 18px 50px rgba(25,54,72,0.20), inset 0 0 0 1px rgba(255,255,255,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    objectFit: "cover",
  },

  // Text
  eyebrow: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: "#3A70B0",
  },
  title: {
    fontSize: 48,
    fontWeight: 900,
    margin: "4px 0 0 0",
    letterSpacing: "-0.03em",
    color: "#193648",
    lineHeight: 1.05,
    textShadow: "0 18px 50px rgba(25,54,72,0.18)",
  },
  titleAccent: {
    color: "#3A70B0",
  },
  subtitle: {
    fontSize: 14.5,
    fontWeight: 500,
    color: "#3A70B0",
    margin: "0 0 8px 0",
    letterSpacing: "0.01em",
  },
  connector: {
    color: "#193648",
    fontWeight: 800,
    margin: "0 6px",
  },

  // Loading message
  loadWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 18px",
    borderRadius: 999,
    background: "#fff",
    border: "1.5px solid #E2EEF9",
    boxShadow: "0 6px 20px rgba(25,54,72,0.08)",
    minWidth: 320,
    justifyContent: "center",
  },
  dot: {
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#22C55E",
    boxShadow: "0 0 0 4px rgba(34,197,94,0.18)",
  },
  loadText: {
    fontSize: 13,
    color: "#193648",
    fontWeight: 600,
  },

  // Progress bar
  progressOuter: {
    width: 320,
    height: 4,
    borderRadius: 999,
    background: "#E2EEF9",
    overflow: "hidden",
    marginTop: 8,
  },
  progressInner: {
    height: "100%",
    background:
      "linear-gradient(90deg, #193648 0%, #3A70B0 50%, #193648 100%)",
    boxShadow: "0 0 12px rgba(25,54,72,0.35)",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 28,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 12,
    color: "#3A70B0",
    letterSpacing: "0.05em",
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#22C55E",
    boxShadow: "0 0 0 3px rgba(34,197,94,0.20)",
  },
};
