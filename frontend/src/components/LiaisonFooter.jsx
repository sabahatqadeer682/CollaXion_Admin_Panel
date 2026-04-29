import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, FileSignature, MapPin, Briefcase, ClipboardList,
  CalendarPlus, CalendarCog, Network, BarChart3, Mail, Sparkles,
} from "lucide-react";
import collaxionLogo from "../images/collaxionlogo.jpeg";

const FOOTER_LINKS = [
  { label: "Dashboard",     path: "/maindashboard",            Icon: BarChart3 },
  { label: "Industries",    path: "/industry-registrations",   Icon: Building2 },
  { label: "MOUs",          path: "/mou-management",           Icon: FileSignature },
  { label: "Projects",      path: "/industry-projects",        Icon: Briefcase },
  { label: "Applications",  path: "/student-applications",     Icon: ClipboardList },
  { label: "Meetings",      path: "/AdvisoryMeetings",         Icon: CalendarPlus },
  { label: "Events",        path: "/event-creation",           Icon: CalendarCog },
  { label: "Engagement",    path: "/industry-activeness",      Icon: Network },
];

export default function LiaisonFooter() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        marginTop: 40,
        background: "linear-gradient(135deg, #0F2A38 0%, #193648 50%, #1F4159 100%)",
        color: "rgba(226,238,249,0.85)",
        overflow: "hidden",
        fontFamily: "'Inter', 'Poppins', sans-serif",
      }}
    >
      <style>{`
        @keyframes liaisonFootOrb1 {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(60px, 30px, 0) scale(1.15); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes liaisonFootOrb2 {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(-50px, -40px, 0) scale(1.1); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes liaisonFootGrid {
          0%   { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        .liaisonFootLink:hover { color: #fff !important; transform: translateX(3px); }
        .liaisonFootLink:hover .liaisonFootIcon { color: #AAC3FC !important; transform: scale(1.15); }
      `}</style>

      <span aria-hidden style={{
        position: "absolute", left: 0, right: 0, top: 0, height: 2,
        background: "linear-gradient(90deg, transparent 0%, rgba(122,169,214,0.6) 30%, rgba(170,195,252,0.7) 50%, rgba(122,169,214,0.6) 70%, transparent 100%)",
        opacity: 0.7, pointerEvents: "none",
      }} />

      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(170,195,252,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(170,195,252,0.05) 1px, transparent 1px)",
        backgroundSize: "60px 60px", opacity: 0.5,
        animation: "liaisonFootGrid 24s linear infinite",
        pointerEvents: "none",
      }} />

      <div aria-hidden style={{
        position: "absolute", top: -100, left: -80,
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(122,169,214,0.18) 0%, rgba(122,169,214,0) 70%)",
        filter: "blur(40px)", pointerEvents: "none",
        animation: "liaisonFootOrb1 16s ease-in-out infinite",
      }} />
      <div aria-hidden style={{
        position: "absolute", bottom: -120, right: -60,
        width: 280, height: 280, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(58,112,176,0.22) 0%, rgba(58,112,176,0) 70%)",
        filter: "blur(40px)", pointerEvents: "none",
        animation: "liaisonFootOrb2 18s ease-in-out infinite",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        padding: "44px 32px 22px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
        gap: 30,
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 13,
              background: "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
              border: "1px solid rgba(255,255,255,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 18px rgba(15,42,56,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}>
              <img src={collaxionLogo} alt="CollaXion" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{
                fontWeight: 800, fontSize: 19, letterSpacing: "-0.01em", lineHeight: 1.1,
                background: "linear-gradient(90deg, #ffffff 0%, #E2EEF9 50%, #AAC3FC 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>CollaXion</div>
              <div style={{ fontSize: 9.5, color: "rgba(226,238,249,0.6)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 3 }}>
                Industry Liaison Operations
              </div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.65, color: "rgba(226,238,249,0.7)", maxWidth: 300 }}>
            Where industry meets academia — sign MOUs, vet partners, advise the board, and orchestrate every collaboration from one elegant workspace.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, padding: "5px 11px", background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.30)", borderRadius: 999 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.25), 0 0 8px rgba(34,197,94,0.6)" }} />
            <span style={{ fontSize: 9.5, color: "#86efac", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Live · Synced
            </span>
          </div>
        </div>

        {/* Workspace links */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(226,238,249,0.55)", marginBottom: 14 }}>
            Workspace
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
            {FOOTER_LINKS.map((l) => (
              <button key={l.path} className="liaisonFootLink" onClick={() => navigate(l.path)} style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                background: "transparent", border: "none",
                color: "rgba(226,238,249,0.75)", fontSize: 12.5, fontWeight: 600,
                cursor: "pointer", padding: 0, textAlign: "left",
                transition: "color 0.22s ease, transform 0.22s ease",
                whiteSpace: "nowrap",
              }}>
                <l.Icon className="liaisonFootIcon" size={13} color="#7AA9D6" style={{ transition: "color 0.22s ease, transform 0.22s ease" }} />
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Get in touch */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(226,238,249,0.55)", marginBottom: 14 }}>
            Get in Touch
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="mailto:collaxionsupport@gmail.com" style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              fontSize: 12.5, color: "rgba(226,238,249,0.85)", fontWeight: 600, textDecoration: "none",
              transition: "color 0.18s ease",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(226,238,249,0.85)")}
            >
              <span style={{
                width: 28, height: 28, borderRadius: 9,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Mail size={13} color="#AAC3FC" />
              </span>
              collaxionsupport@gmail.com
            </a>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              fontSize: 12.5, color: "rgba(226,238,249,0.85)", fontWeight: 600,
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 9,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Building2 size={13} color="#7AA9D6" />
              </span>
              Faculty of Computing
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              fontSize: 12.5, color: "rgba(226,238,249,0.85)", fontWeight: 600,
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 9,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <MapPin size={13} color="#86efac" />
              </span>
              Riphah International University
            </div>
          </div>
        </div>
      </div>

      {/* Copyright strip */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: "16px 32px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap",
        fontSize: 11.5, color: "rgba(226,238,249,0.55)",
      }}>
        <div>
          © {year} <strong style={{ color: "rgba(226,238,249,0.9)", fontWeight: 800 }}>CollaXion</strong> · All rights reserved.
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Sparkles size={11} color="#AAC3FC" /> Bridging Academia &amp; Industry
          </span>
        </div>
      </div>
    </motion.footer>
  );
}
