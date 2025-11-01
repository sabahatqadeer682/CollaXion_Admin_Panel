import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <div style={styles.container}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} style={styles.header}>
        <h1 style={styles.title}>Industry Activeness</h1>
        <p style={styles.subtitle}>Live tracking, insights and recognition for industry partners engaged with the university.</p>
      </motion.div>

      {/* Summary Cards (relevant metrics) */}
      <div style={styles.summaryGrid}>
        <SummaryCard
          icon={<CalendarDays size={22} />}
          title="Active Collaborations"
          value={summary.activeCollaborations}
          hint="Agreements & active MOUs"
        />
        <SummaryCard
          icon={<Building2 size={22} />}
          title="Industry Partners Engaged"
          value={summary.industryPartners}
          hint="Distinct industry organizations"
        />
        <SummaryCard
          icon={<Activity size={22} />}
          title="Internships & Projects"
          value={summary.internshipsProjects}
          hint="Active internships + industry projects"
        />
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

        {/* Details */}
        {activeTab === "details" && (
          <div style={styles.detailsGrid}>
            {industriesWithControls(industries, setInsightsIndustry).map((card) => (
              <motion.div key={card.id} whileHover={{ scale: 1.01 }} style={styles.detailCard}>
                <div>
                  <h4 style={{ margin: 0 }}>{card.name}</h4>
                  <p style={{ color: "#6b7280", marginTop: 6 }}>{card.description}</p>

                  <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    <MiniStat label="Events" value={card.events} />
                    <MiniStat label="Collaborations" value={card.collaborations} />
                    <MiniStat label="Internships" value={card.internships} />
                    <MiniStat label="Projects" value={card.projects} />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button style={styles.viewBtn} onClick={() => setInsightsIndustry(card)}>
                    <Eye size={14} /> View Insights
                  </button>
                  <button style={styles.ghostBtn} onClick={() => alert(`${card.name} profile opened (implement)`)}>
                    Manage Partner
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Rankings */}
        {activeTab === "rankings" && (
          <div style={styles.rankOuter}>
            {showConfetti && <ConfettiLayer />}
            <div style={styles.rankTop}>
              <div>
                <h3 style={{ margin: 0 }}>🏆 This Week’s Top Industry Partners</h3>
                <p style={{ margin: "6px 0 0", color: "#6b7280" }}>Recognizing outstanding engagement & collaboration</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: "#193648", fontSize: 18 }}>{top3[0].name}</div>
                <div style={{ color: "#3A70B0" }}>{top3[0].points} pts — Great job!</div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              {industriesWithPointsSorted(industriesWithPoints).map((ind, idx) => (
                <motion.div key={ind.id} whileHover={{ scale: 1.01 }} style={{ ...styles.rankCard, background: idx === 0 ? "linear-gradient(90deg,#FFF7E6,#FFFDF5)" : styles.rankCard.background }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={styles.rankBadge}>{idx + 1}</div>
                    <div>
                      <strong>{ind.name}</strong>
                      <div style={{ color: "#6b7280", fontSize: 13 }}>{ind.collaborations} collaborations • {ind.projects} projects</div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: "#193648" }}>{ind.points} pts</div>
                    {idx === 0 ? <Medal color="#FFD700" /> : idx === 1 ? <Medal color="#C0C0C0" /> : <Star color="#94a3b8" />}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Appreciation banner */}
            <div style={styles.appreciationBanner}>
              <Zap size={18} /> <strong style={{ marginLeft: 8 }}>{top3[0].name}</strong> — Outstanding efforts from Innovatex this week!🎉
            </div>
          </div>
        )}
      </motion.div>

      {/* Insights Modal */}
      <AnimatePresence>
        {insightsIndustry && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalBackdrop}>
            <motion.div initial={{ scale: 0.98, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 10 }} transition={{ duration: 0.25 }} style={styles.modalCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0 }}>{insightsIndustry.name} — Insights</h3>
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
                    <button style={{ ...styles.viewBtn, marginTop: 6 }} onClick={() => alert("Download report (implement)")}>Download Report</button>
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

  tabContainer: { display: "flex", gap: 10, marginTop: 14, marginBottom: 18 },
  tabBtn: { padding: "8px 14px", borderRadius: 10, border: "none", background: "#E2EEF9", color: "#193648", cursor: "pointer", fontWeight: 600 },
  tabBtnActive: { background: "#193648", color: "#fff" },

  content: { marginTop: 8 },

  overviewGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  chartCard: { background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" },
  chartTitle: { margin: 0, color: "#193648", marginBottom: 8, fontWeight: 700 },

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


