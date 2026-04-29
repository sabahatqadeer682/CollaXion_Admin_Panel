import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LiaisonNavbar from "../components/LiaisonNavbar";
import LiaisonFooter from "../components/LiaisonFooter";
import {
  BarChart3,
  Activity,
  Briefcase,
  CalendarDays,
  Building2,
  Eye,
  Trophy,
  Medal,
  Star,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

/**
 * IndustryActiveness.jsx
 * - Live engagement (simulated)
 * - Insights modal per industry (charts + KPIs)
 * - Enhanced ranking with confetti + appreciation
 * - Relevant summary cards
 */

const MOCK_INDUSTRIES = [
  {
    id: 1,
    name: "TechVerse Ltd",
    events: 12,
    collaborations: 6,
    internships: 15,
    projects: 4,
    lastActiveMins: 0,
    status: "active",
  },
  {
    id: 2,
    name: "EduSoft Pvt",
    events: 9,
    collaborations: 3,
    internships: 10,
    projects: 2,
    lastActiveMins: 5,
    status: "recent",
  },
  {
    id: 3,
    name: "InnovateX",
    events: 14,
    collaborations: 9,
    internships: 18,
    projects: 6,
    lastActiveMins: 0,
    status: "active",
  },
  {
    id: 4,
    name: "DataPro Solutions",
    events: 7,
    collaborations: 2,
    internships: 9,
    projects: 1,
    lastActiveMins: 12,
    status: "offline",
  },
  {
    id: 5,
    name: "GreenTech Labs",
    events: 10,
    collaborations: 5,
    internships: 12,
    projects: 3,
    lastActiveMins: 3,
    status: "recent",
  },
];

const SUMMARY_TITLES = [
  { key: "activeCollaborations", title: "Active Collaborations" },
  { key: "industryPartners", title: "Industry Partners Engaged" },
  { key: "internshipsProjects", title: "Internships & Projects" },
];

const COLORS = ["#193648", "#3A70B0", "#88C0F9"];

export default function IndustryActiveness() {
  const [activeTab, setActiveTab] = useState("overview");
  const [industries, setIndustries] = useState(MOCK_INDUSTRIES);
  const [insightsIndustry, setInsightsIndustry] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // simulate live changes to status/lastActive every 4s
  useEffect(() => {
    const id = setInterval(() => {
      setIndustries((prev) =>
        prev.map((ind) => {
          // randomly toggle some to active
          const r = Math.random();
          let status = ind.status;
          let lastActiveMins = ind.lastActiveMins;
          if (r > 0.82) {
            status = "active";
            lastActiveMins = 0;
          } else if (r > 0.6) {
            status = "recent";
            lastActiveMins = Math.max(1, Math.floor(Math.random() * 9));
          } else {
            // increment lastActiveMins
            lastActiveMins = Math.min(60, lastActiveMins + Math.floor(Math.random() * 3));
            status = lastActiveMins <= 3 ? "recent" : "offline";
          }
          return { ...ind, status, lastActiveMins };
        })
      );
    }, 4000);

    return () => clearInterval(id);
  }, []);

  // Derived summary stats relevant to your ecosystem
  const summary = useMemo(() => {
    const activeCollaborations = industries.reduce((acc, i) => acc + i.collaborations, 0);
    const industryPartners = industries.length;
    const internshipsProjects = industries.reduce((acc, i) => acc + i.internships + i.projects, 0);
    return { activeCollaborations, industryPartners, internshipsProjects };
  }, [industries]);

  // Points system for ranking
  const industriesWithPoints = useMemo(() => {
    return industries.map((i) => ({
      ...i,
      points: i.events * 5 + i.collaborations * 10 + i.internships * 4 + i.projects * 8,
    }));
  }, [industries]);

  const top3 = useMemo(() => {
    const sorted = [...industriesWithPoints].sort((a, b) => b.points - a.points);
    return sorted.slice(0, 3);
  }, [industriesWithPoints]);

  // Trigger confetti when ranking tab opens
  useEffect(() => {
    if (activeTab === "rankings") {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3500);
      return () => clearTimeout(t);
    }
  }, [activeTab]);

  // Helpers
  const statusText = (ind) => {
    if (ind.status === "active") return "Active Now";
    if (ind.lastActiveMins === 0) return "Active Now";
    if (ind.lastActiveMins <= 3) return `${ind.lastActiveMins} min ago`;
    return `${ind.lastActiveMins} mins ago`;
  };
  const statusColor = (ind) => (ind.status === "active" ? "#16a34a" : ind.status === "recent" ? "#f59e0b" : "#9ca3af");

  // Insights mock time series per industry
  const makeIndustryTimeSeries = (ind) => {
    // generate 7-day sample
    const base = ind.events;
    return Array.from({ length: 7 }).map((_, i) => ({
      day: `D${i + 1}`,
      engagement: Math.max(0, Math.round(base * (0.6 + Math.random() * 0.9))),
    }));
  };

  // ── Generate & download a CSV report for the picked industry ──────────
  const downloadIndustryReport = (ind) => {
    if (!ind) return;
    const points = ind.events * 5 + ind.collaborations * 10 + ind.internships * 4 + ind.projects * 8;
    const generated = new Date().toLocaleString("en-GB", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
    const series = makeIndustryTimeSeries(ind);
    const rows = [
      ["CollaXion Industry Engagement Report"],
      [`Generated · ${generated}`],
      [],
      ["INDUSTRY DETAILS"],
      ["Name",                ind.name],
      ["Status",              statusText(ind)],
      ["Engagement Score",    `${points} pts`],
      [],
      ["KPIs"],
      ["Events",              ind.events],
      ["Active Collaborations", ind.collaborations],
      ["Internships",         ind.internships],
      ["Ongoing Projects",    ind.projects],
      [],
      ["7-DAY ENGAGEMENT TREND"],
      ["Day", "Engagement"],
      ...series.map((d) => [d.day, d.engagement]),
    ];
    const csv = rows
      .map((r) => r.map((v) => {
        const s = String(v ?? "");
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ind.name.replace(/\s+/g, "_")}_engagement_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
    <LiaisonNavbar />
    <div style={styles.container}>
      {/* Header - premium */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{
          display: "flex", alignItems: "center", gap: 14,
          margin: "20px 0 18px", flexWrap: "wrap",
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "#193648", color: "#fff", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 18px rgba(25,54,72,0.28)",
        }}>
          <Activity size={20} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h1 style={{
            margin: 0, fontSize: 22, fontWeight: 800, color: "#193648",
            letterSpacing: "-0.02em", fontFamily: "'Sora', 'Inter', sans-serif",
            display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          }}>
            Industry Activeness
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#3A70B0", background: "#eff6ff", border: "1px solid #cfe0f0",
              padding: "3px 10px", borderRadius: 999,
            }}>Live</span>
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#94a3b8" }}>
            Live tracking, insights and recognition for industry partners engaged with the university.
          </p>
        </div>
      </motion.div>

      {/* Compact count pills (MOU-style) */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {[
          { label: "Active Collaborations",     value: summary.activeCollaborations,   color: "#193648", halo: "rgba(25,54,72,0.15)" },
          { label: "Industry Partners",         value: summary.industryPartners,       color: "#3A70B0", halo: "rgba(58,112,176,0.18)" },
          { label: "Internships & Projects",    value: summary.internshipsProjects,    color: "#16a34a", halo: "rgba(22,163,74,0.20)" },
          { label: "Top Engagement",            value: industries[0]?.engagement || 0, color: "#F59E0B", halo: "rgba(245,158,11,0.20)" },
        ].map((s, i) => (
          <div key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 12px", borderRadius: 8,
            background: "#fff", border: "1px solid #E2EEF9",
            boxShadow: "0 1px 3px rgba(25,54,72,0.06)",
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: s.color,
              boxShadow: `0 0 0 3px ${s.halo}`,
            }} />
            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{s.label}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={<BarChart3 size={16} />}>
          Overview
        </TabButton>
        <TabButton active={activeTab === "live"} onClick={() => setActiveTab("live")} icon={<Activity size={16} />}>
          Live Engagement
        </TabButton>
        <TabButton active={activeTab === "details"} onClick={() => setActiveTab("details")} icon={<Briefcase size={16} />}>
          View Details
        </TabButton>
        <TabButton active={activeTab === "rankings"} onClick={() => setActiveTab("rankings")} icon={<Trophy size={16} />}>
          Rankings
        </TabButton>
      </div>

      {/* Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={styles.content}>
        {/* Overview */}
        {activeTab === "overview" && (
          <div style={styles.overviewGrid}>
            <motion.div style={styles.chartCard} whileHover={{ scale: 1.01 }}>
              <h3 style={styles.chartTitle}>Industry Event Participation (Top)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={industries.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="events" fill={COLORS[0]} />
                  <Bar dataKey="internships" fill={COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div style={styles.chartCard} whileHover={{ scale: 1.01 }}>
              <h3 style={styles.chartTitle}>Contribution Split</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={[{ name: "Events", value: summary.activeCollaborations }, { name: "Internships", value: summary.internshipsProjects }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    <Cell fill={COLORS[0]} />
                    <Cell fill={COLORS[1]} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {/* Live Engagement */}
        {activeTab === "live" && (
          <div style={styles.liveGrid}>
            {industries.map((ind) => (
              <motion.div key={ind.id} whileHover={{ scale: 1.02 }} style={{ ...styles.liveCard, borderLeft: `6px solid ${statusColor(ind)}` }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, background: "#F6FBFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 6px rgba(0,0,0,0.02)" }}>
                    <strong style={{ color: "#193648" }}>{ind.name.split(" ")[0].slice(0, 2).toUpperCase()}</strong>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <div>
                        <h4 style={{ margin: 0 }}>{ind.name}</h4>
                        <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>{statusText(ind)}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {ind.status === "active" ? (
                          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                            <CheckCircle color="#16a34a" />
                          </motion.div>
                        ) : (
                          <Clock color="#9ca3af" />
                        )}
                        <div style={{ fontWeight: 700, color: "#3A70B0", marginTop: 6 }}>{ind.events + ind.internships} pts</div>
                      </div>
                    </div>

                    {/* quick mini-metrics */}
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <MiniStat label="Events" value={ind.events} />
                      <MiniStat label="Internships" value={ind.internships} />
                      <MiniStat label="Projects" value={ind.projects} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Details - premium card grid */}
        {activeTab === "details" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
            gap: 18,
          }}>
            {industriesWithControls(industries, setInsightsIndustry).map((card, i) => {
              const initials = (card.name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
              const ACCENTS = ["#193648", "#3A70B0", "#7AA9D6", "#2C5F80", "#86efac", "#F59E0B"];
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                  style={{
                    position: "relative",
                    background: "linear-gradient(180deg, #ffffff, #fbfdff)",
                    border: "1px solid #E2EEF9",
                    borderRadius: 18, overflow: "hidden",
                    boxShadow: "0 6px 22px rgba(25,54,72,0.07)",
                    padding: "20px 22px 18px 26px",
                    display: "flex", flexDirection: "column", gap: 14,
                    transition: "box-shadow 0.25s ease, border-color 0.25s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 14px 32px ${accent}26`; e.currentTarget.style.borderColor = `${accent}55`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 6px 22px rgba(25,54,72,0.07)"; e.currentTarget.style.borderColor = "#E2EEF9"; }}
                >
                  <span aria-hidden style={{
                    position: "absolute", top: 0, bottom: 0, left: 0, width: 4,
                    background: `linear-gradient(180deg, ${accent}, ${accent}66)`,
                  }} />
                  <span aria-hidden style={{
                    position: "absolute", top: -50, right: -50,
                    width: 140, height: 140, borderRadius: "50%",
                    background: `radial-gradient(circle, ${accent}22 0%, ${accent}00 70%)`,
                    filter: "blur(14px)", pointerEvents: "none",
                  }} />

                  {/* Header - initials avatar + name + status */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
                    <span style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
                      color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: 14, letterSpacing: "0.04em",
                      boxShadow: `0 6px 14px ${accent}40`,
                    }}>
                      {initials}
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontWeight: 800, fontSize: 15, color: "#0f172a",
                        letterSpacing: "-0.01em",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>{card.name}</div>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontSize: 10.5, color: accent, fontWeight: 800,
                        letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 4,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.20)" }} />
                        Active partner
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div style={{
                    fontSize: 12.5, color: "#5b7184", lineHeight: 1.55,
                    padding: "10px 12px",
                    background: "linear-gradient(180deg, #f8fbff, #ffffff)",
                    borderLeft: `3px solid ${accent}55`,
                    borderRadius: "0 10px 10px 0",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {card.description || "Industry partner engaged in collaborative initiatives with the university."}
                  </div>

                  {/* Mini stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {[
                      { label: "Events",   value: card.events },
                      { label: "Collabs",  value: card.collaborations },
                      { label: "Interns",  value: card.internships },
                      { label: "Projects", value: card.projects },
                    ].map((s, j) => (
                      <div key={j} style={{
                        padding: "8px 6px", borderRadius: 9,
                        background: "#f8fbff", border: "1px solid #eef2ff",
                        textAlign: "center",
                      }}>
                        <div style={{
                          fontSize: 16, fontWeight: 900, color: "#193648",
                          fontFamily: "'Sora', 'Inter', sans-serif",
                          fontVariantNumeric: "tabular-nums", lineHeight: 1,
                        }}>{s.value}</div>
                        <div style={{
                          fontSize: 9, color: "#94a3b8", fontWeight: 800,
                          letterSpacing: "0.10em", textTransform: "uppercase",
                          marginTop: 4,
                        }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA - pinned bottom */}
                  <button onClick={() => setInsightsIndustry(card)} style={{
                    marginTop: "auto",
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
                    padding: "10px 14px", borderRadius: 10, border: "none",
                    background: "#193648", color: "#fff",
                    fontWeight: 800, fontSize: 12.5, cursor: "pointer", letterSpacing: "0.02em",
                    boxShadow: "0 8px 18px rgba(25,54,72,0.25)",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(25,54,72,0.32)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 18px rgba(25,54,72,0.25)"; }}
                  >
                    <Eye size={13} /> View Insights
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Rankings - premium */}
        {activeTab === "rankings" && (() => {
          const sortedAll = industriesWithPointsSorted(industriesWithPoints);
          const champ = sortedAll[0];
          const rest = sortedAll;
          const maxPts = champ?.points || 1;
          return (
            <div style={{ position: "relative" }}>
              {showConfetti && <ConfettiLayer />}

              {/* Champion hero card */}
              {champ && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "relative", overflow: "hidden",
                    borderRadius: 20,
                    background: "linear-gradient(135deg, #0F2A38 0%, #193648 50%, #2C5F80 100%)",
                    color: "#fff",
                    padding: "26px 28px",
                    boxShadow: "0 14px 40px rgba(15,42,56,0.30)",
                    marginBottom: 20,
                  }}
                >
                  <span aria-hidden style={{
                    position: "absolute", top: -60, right: -50,
                    width: 200, height: 200, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,215,0,0.30) 0%, rgba(255,215,0,0) 70%)",
                    filter: "blur(20px)", pointerEvents: "none",
                  }} />
                  <span aria-hidden style={{
                    position: "absolute", left: 0, right: 0, bottom: 0, height: 2,
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.6) 50%, transparent 100%)",
                  }} />
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    gap: 18, flexWrap: "wrap", position: "relative", zIndex: 1,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                      <div style={{
                        width: 64, height: 64, borderRadius: 16,
                        background: "linear-gradient(135deg, #FFD700, #FFA500)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 10px 24px rgba(255,165,0,0.40)",
                        flexShrink: 0,
                      }}>
                        <Trophy size={30} color="#fff" />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          background: "rgba(255,215,0,0.18)", border: "1px solid rgba(255,215,0,0.40)",
                          padding: "3px 10px", borderRadius: 999,
                          fontSize: 9.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
                          color: "#FFD700", marginBottom: 6,
                        }}>
                          🏆 Champion · This Week
                        </div>
                        <h2 style={{
                          margin: 0, fontSize: 26, fontWeight: 900,
                          letterSpacing: "-0.02em",
                          fontFamily: "'Sora', 'Inter', sans-serif",
                        }}>{champ.name}</h2>
                        <p style={{ margin: "5px 0 0", fontSize: 13, color: "rgba(226,238,249,0.78)" }}>
                          Outstanding engagement &amp; collaboration with the university.
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(226,238,249,0.65)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Score</div>
                      <div style={{ fontSize: 38, fontWeight: 900, fontFamily: "'Sora','Inter',sans-serif", color: "#FFD700", letterSpacing: "-0.02em", textShadow: "0 4px 16px rgba(255,215,0,0.40)" }}>
                        {champ.points}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(226,238,249,0.7)" }}>points</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Top-3 podium */}
              {sortedAll.length >= 3 && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                  gap: 14, marginBottom: 22,
                }}>
                  {[sortedAll[1], sortedAll[0], sortedAll[2]].filter(Boolean).map((ind, i) => {
                    const rank = ind === sortedAll[0] ? 1 : ind === sortedAll[1] ? 2 : 3;
                    const accent = rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : "#CD7F32";
                    const halo   = rank === 1 ? "rgba(255,215,0,0.20)" : rank === 2 ? "rgba(192,192,192,0.20)" : "rgba(205,127,50,0.20)";
                    return (
                      <motion.div
                        key={ind.id}
                        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.5 }}
                        whileHover={{ y: -4 }}
                        style={{
                          position: "relative", overflow: "hidden",
                          background: "linear-gradient(180deg, #ffffff, #fbfdff)",
                          border: `1px solid ${accent}55`,
                          borderRadius: 16, padding: "18px 18px 16px 22px",
                          boxShadow: `0 10px 26px ${halo}`,
                        }}
                      >
                        <span aria-hidden style={{
                          position: "absolute", top: 0, bottom: 0, left: 0, width: 4,
                          background: `linear-gradient(180deg, ${accent}, ${accent}66)`,
                        }} />
                        <span aria-hidden style={{
                          position: "absolute", top: -30, right: -30,
                          width: 110, height: 110, borderRadius: "50%",
                          background: `radial-gradient(circle, ${accent}33 0%, ${accent}00 70%)`,
                          filter: "blur(10px)",
                        }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                          <span style={{
                            width: 38, height: 38, borderRadius: 11,
                            background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
                            color: "#fff", fontSize: 16, fontWeight: 900,
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            boxShadow: `0 6px 14px ${halo}`,
                            fontFamily: "'Sora', 'Inter', sans-serif",
                          }}>
                            {rank === 1 ? <Trophy size={18} /> : rank === 2 ? <Medal size={18} /> : <Star size={18} />}
                          </span>
                          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94a3b8" }}>
                            Rank #{rank}
                          </div>
                        </div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: "#193648", letterSpacing: "-0.01em", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {ind.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
                          {ind.collaborations} collabs · {ind.projects} projects
                        </div>
                        <div style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          fontSize: 24, fontWeight: 900, color: "#193648",
                          fontFamily: "'Sora', 'Inter', sans-serif",
                          fontVariantNumeric: "tabular-nums",
                        }}>
                          <span>{ind.points}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.10em", textTransform: "uppercase" }}>pts</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Full leaderboard */}
              <div style={{
                background: "linear-gradient(180deg, #ffffff, #fbfdff)",
                border: "1px solid #E2EEF9",
                borderRadius: 16, padding: "18px 20px",
                boxShadow: "0 6px 22px rgba(25,54,72,0.07)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "#193648", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 6px 14px rgba(25,54,72,0.25)",
                  }}>
                    <Trophy size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#193648", letterSpacing: "-0.01em" }}>Full Leaderboard</div>
                    <div style={{ fontSize: 11.5, color: "#94a3b8" }}>All industry partners ranked by engagement points</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {rest.map((ind, idx) => {
                    const pct = Math.round((ind.points / maxPts) * 100);
                    const isTop = idx < 3;
                    const rankBg = idx === 0 ? "#FFD700" : idx === 1 ? "#C0C0C0" : idx === 2 ? "#CD7F32" : "#E2EEF9";
                    const rankColor = idx < 3 ? "#fff" : "#193648";
                    return (
                      <motion.div
                        key={ind.id}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.35 }}
                        whileHover={{ x: 3 }}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "auto 1fr auto",
                          alignItems: "center", gap: 12,
                          padding: "10px 12px",
                          background: isTop ? "linear-gradient(90deg, #fffbeb, #ffffff)" : "#f8fbff",
                          border: `1px solid ${isTop ? "#fde68a" : "#eef2ff"}`,
                          borderRadius: 12,
                        }}
                      >
                        <div style={{
                          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                          background: rankBg, color: rankColor,
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, fontWeight: 900,
                          fontFamily: "'Sora', 'Inter', sans-serif",
                          boxShadow: isTop ? `0 4px 10px ${idx === 0 ? "rgba(255,215,0,0.30)" : idx === 1 ? "rgba(192,192,192,0.30)" : "rgba(205,127,50,0.30)"}` : "none",
                        }}>
                          {idx + 1}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ind.name}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                            <div style={{ flex: 1, height: 5, background: "#E2EEF9", borderRadius: 99, overflow: "hidden" }}>
                              <div style={{
                                width: `${pct}%`, height: "100%",
                                background: isTop ? "linear-gradient(90deg, #FFD700, #FFA500)" : "linear-gradient(90deg, #193648, #3A70B0)",
                                borderRadius: 99,
                              }} />
                            </div>
                            <span style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                              {ind.collaborations} collabs · {ind.projects} projs
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 16, fontWeight: 900, color: "#193648", fontVariantNumeric: "tabular-nums", fontFamily: "'Sora', 'Inter', sans-serif" }}>
                            {ind.points}
                          </div>
                          <div style={{ fontSize: 9.5, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" }}>pts</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Appreciation banner */}
              <div style={{
                marginTop: 18, padding: "14px 18px", borderRadius: 12,
                background: "linear-gradient(135deg, #fff7e6, #fffdf5)",
                border: "1px solid #fde68a",
                display: "flex", alignItems: "center", gap: 10,
                fontSize: 13, color: "#92400e", fontWeight: 700,
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: "linear-gradient(135deg, #FFD700, #FFA500)", color: "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Zap size={16} />
                </span>
                <span>
                  <strong style={{ fontWeight: 900 }}>{champ?.name}</strong> - Outstanding efforts this week! 🎉
                </span>
              </div>
            </div>
          );
        })()}
      </motion.div>

      {/* Insights Modal */}
      <AnimatePresence>
        {insightsIndustry && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalBackdrop}>
            <motion.div initial={{ scale: 0.98, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 10 }} transition={{ duration: 0.25 }} style={styles.modalCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0 }}>{insightsIndustry.name} - Insights</h3>
                  <p style={{ margin: 0, color: "#6b7280" }}>Recent engagement & KPIs</p>
                </div>
                <button style={styles.closeBtn} onClick={() => setInsightsIndustry(null)}>✕</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 18, marginTop: 14 }}>
                <div style={{ background: "#fff", padding: 12, borderRadius: 10 }}>
                  <h4 style={{ margin: "6px 0 10px" }}>7-Day Engagement Trend</h4>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={makeIndustryTimeSeries(insightsIndustry)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="engagement" stroke="#3A70B0" strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>

                  <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    <MiniStat label="Events" value={insightsIndustry.events} />
                    <MiniStat label="Collaborations" value={insightsIndustry.collaborations} />
                    <MiniStat label="Internships" value={insightsIndustry.internships} />
                  </div>
                </div>

                <div style={{ background: "#fff", padding: 12, borderRadius: 10 }}>
                  <h4 style={{ margin: "6px 0 10px" }}>Quick Metrics</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <MetricRow label="Ongoing Projects" value={insightsIndustry.projects} />
                    <MetricRow label="Points (calculated)" value={insightsIndustry.events * 5 + insightsIndustry.collaborations * 10 + insightsIndustry.internships * 4 + insightsIndustry.projects * 8} />
                    <MetricRow label="Last Active" value={statusText(insightsIndustry)} />
                    <button
                      style={{ ...styles.viewBtn, marginTop: 6 }}
                      onClick={() => downloadIndustryReport(insightsIndustry)}
                    >
                      Download Report
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* small styles for confetti animation */}
      <style>{confettiKeyframes}</style>
    </div>
    <LiaisonFooter />
    </>
  );
}

/* ------------------ Small helper components ------------------ */

function SummaryCard({ icon, title, value, hint }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} style={styles.summaryCard}>
      <div style={styles.iconBox}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, color: "#374151" }}>{title}</div>
        <div style={{ fontWeight: 700, color: "#193648", fontSize: 20 }}>{value}</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{hint}</div>
      </div>
    </motion.div>
  );
}

function TabButton({ children, onClick, active, icon }) {
  return (
    <button onClick={onClick} style={{ ...styles.tabBtn, ...(active ? styles.tabBtnActive : {}) }}>
      <span style={{ marginRight: 8 }}>{icon}</span>
      {children}
    </button>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={{ background: "#F8FBFF", padding: "8px 10px", borderRadius: 8 }}>
      <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
      <div style={{ fontWeight: 700, color: "#193648" }}>{value}</div>
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", color: "#374151" }}>
      <div>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function ConfettiLayer() {
  // simple decorative confetti bits
  const pieces = Array.from({ length: 24 });
  return (
    <div style={styles.confetti}>
      {pieces.map((_, i) => (
        <div key={i} className="confetti-piece" style={{ left: `${(i / pieces.length) * 100}%`, animationDelay: `${i * 60}ms` }} />
      ))}
    </div>
  );
}

/* ------------------ tiny helpers for details rendering ------------------ */
function industriesWithControls(industries, setInsights) {
  // add small description for details view
  return industries.map((i) => ({
    ...i,
    description: `${i.collaborations} active collaborations · ${i.projects} projects`,
    viewInsights: () => setInsights(i),
  }));
}

function industriesWithPointsSorted(list) {
  return [...list].sort((a, b) => b.points - a.points);
}

/* ------------------ Styles ------------------ */
const styles = {
  container: { padding: 28, minHeight: "100vh", fontFamily: "'Poppins',sans-serif", background: "linear-gradient(135deg,#E2EEF9 0%, #FFFFFF 100%)" },
  header: { marginBottom: 18 },
  title: { margin: 0, color: "#193648", fontSize: 22, fontWeight: 700 },
  subtitle: { marginTop: 6, color: "#6b7280" },

  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14, marginTop: 18, marginBottom: 18 },
  summaryCard: { display: "flex", gap: 12, alignItems: "center", background: "#fff", padding: 14, borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" },
  iconBox: { background: "#F1F8FF", padding: 10, borderRadius: 10 },

  tabContainer: {
    display: "flex", gap: 4, marginTop: 6, marginBottom: 22,
    padding: 4, borderRadius: 12, background: "#fff",
    border: "1px solid #E2EEF9", boxShadow: "0 4px 12px rgba(25,54,72,0.06)",
    width: "fit-content", flexWrap: "wrap",
  },
  tabBtn: {
    display: "inline-flex", alignItems: "center", gap: 7,
    padding: "8px 14px", borderRadius: 9,
    border: "none", background: "transparent",
    color: "#64748b", cursor: "pointer",
    fontWeight: 700, fontSize: 12.5,
    transition: "background 0.18s ease, color 0.18s ease",
  },
  tabBtnActive: {
    background: "#193648", color: "#fff",
    boxShadow: "0 6px 14px rgba(25,54,72,0.25)",
  },

  content: { marginTop: 8 },

  overviewGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  chartCard: {
    position: "relative",
    background: "linear-gradient(180deg, #ffffff, #fbfdff)",
    border: "1px solid #E2EEF9",
    borderRadius: 16, padding: "20px 22px",
    boxShadow: "0 6px 22px rgba(25,54,72,0.07)",
    overflow: "hidden",
  },
  chartTitle: {
    margin: 0, marginBottom: 12,
    color: "#193648", fontWeight: 800,
    fontSize: 15, letterSpacing: "-0.01em",
    fontFamily: "'Sora', 'Inter', sans-serif",
  },

  liveGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 },
  liveCard: { background: "#fff", padding: 14, borderRadius: 12, boxShadow: "0 6px 12px rgba(0,0,0,0.06)" },

  detailsContainer: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "22px",
  alignItems: "stretch",
},

detailCard: {
  background: "#fff",
  borderRadius: "14px",
  padding: "18px 20px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "relative",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
},
viewBtn: {
  background: "#193648",
  color: "#fff",
  border: "none",
  padding: "7px 14px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  cursor: "pointer",
  alignSelf: "flex-end",
  marginTop: "10px",
},
  detailsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: 14 },
  ghostBtn: { background: "transparent", border: "1px solid #E6EEF9", color: "#193648", padding: "8px 12px", borderRadius: 8, cursor: "pointer" },

  rankOuter: { background: "transparent" },
  rankTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  rankCard: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, background: "#F5FAFF", padding: 12, borderRadius: 10, marginBottom: 10 },
  rankBadge: { background: "#193648", width: 36, height: 36, borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },

  appreciationBanner: { marginTop: 18, background: "#FFF8ED", borderLeft: "4px solid #FFD66B", padding: 12, borderRadius: 8, display: "flex", alignItems: "center", gap: 10, color: "#5b4636" },

  // modal
  modalBackdrop: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 },
  modalCard: { width: "80%", maxWidth: 980, background: "#F8FBFF", borderRadius: 12, padding: 18, boxShadow: "0 20px 60px rgba(2,6,23,0.2)" },
  closeBtn: { background: "transparent", border: "none", fontSize: 18, cursor: "pointer" },

  // confetti
  confetti: { pointerEvents: "none", position: "fixed", inset: 0, zIndex: 1100, overflow: "hidden" },

  // small
  modalSmallCard: { background: "#fff", borderRadius: 10, padding: 12 },
};

/* ------------------ confetti keyframes ------------------ */
const confettiKeyframes = `
.confetti-piece {
  position: absolute;
  top: -10%;
  width: 10px;
  height: 18px;
  opacity: 0.95;
  transform: translateY(-20vh) rotateZ(0deg);
  animation: confettiFall 2.7s linear forwards;
  background: linear-gradient(180deg, #F97316, #FBBF24); /* fallback, will be overridden inline */
  border-radius: 2px;
}
@keyframes confettiFall {
  0% { transform: translateY(-10vh) rotateZ(0deg); opacity: 1; }
  70% { opacity: 1; }
  100% { transform: translateY(110vh) rotateZ(600deg); opacity: 0; }
}
/* generate variety */
.confetti-piece:nth-child(odd) { background: linear-gradient(180deg,#34D399,#10B981); width:8px; height:14px; }
.confetti-piece:nth-child(even) { background: linear-gradient(180deg,#60A5FA,#3B82F6); width:10px; height:18px; }
`;


