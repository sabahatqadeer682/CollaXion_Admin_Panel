import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSignature,
  MapPin,
  CalendarPlus,
  GraduationCap,
  Briefcase,
  Settings,
  LogOut,
  BarChart3,
  Network,
  Menu,
  CalendarCog,
  ClipboardList,
  Bell,
  CheckCheck,
  X,
  ClipboardCheck,
  UserCheck,
  AlertCircle,
  Send,
  Clock,
  Megaphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import collaxionLogo from "../images/collaxionlogo.jpeg";

// ─── Mock Notifications ────────────────────────────────────────────────────────
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "application",
    icon: ClipboardList,
    iconBg: "#DBEAFE",
    iconColor: "#1D4ED8",
    title: "New Student Application",
    message: "Ayesha Malik applied for Web3 Internship Program at NextChain Solutions.",
    time: "2 min ago",
    read: false,
    route: "/student-applications",
  },
  {
    id: 2,
    type: "application",
    icon: ClipboardList,
    iconBg: "#DBEAFE",
    iconColor: "#1D4ED8",
    title: "New Student Application",
    message: "Fatima Zahra applied for Mobile UX Research Study at PixelCraft Studios.",
    time: "15 min ago",
    read: false,
    route: "/student-applications",
  },
  {
    id: 3,
    type: "approved",
    icon: UserCheck,
    iconBg: "#D1FAE5",
    iconColor: "#065F46",
    title: "Application Approved by Incharge",
    message: "Hassan Javed's application for Mobile UX Research Study has been approved by internship incharge.",
    time: "1 hr ago",
    read: false,
    route: "/student-applications",
  },
  {
    id: 4,
    type: "forwarded",
    icon: Send,
    iconBg: "#EDE9FE",
    iconColor: "#6D28D9",
    title: "Application Forwarded to Industry",
    message: "Bilal Ahmed's application was forwarded to NextChain Solutions successfully.",
    time: "3 hrs ago",
    read: true,
    route: "/student-applications",
  },
  {
    id: 5,
    type: "deadline",
    icon: Clock,
    iconBg: "#FEF3C7",
    iconColor: "#92400E",
    title: "Deadline Approaching",
    message: "Web3 Internship Program deadline is in 3 days. Review pending applications.",
    time: "5 hrs ago",
    read: false,
    route: "/industry-projects",
  },
  {
    id: 6,
    type: "mou",
    icon: FileSignature,
    iconBg: "#FCE7F3",
    iconColor: "#BE185D",
    title: "MOU Pending Signature",
    message: "EcoPower Industries MOU is awaiting your signature. Please review.",
    time: "1 day ago",
    read: true,
    route: "/mou-management",
  },
  {
    id: 7,
    type: "alert",
    icon: AlertCircle,
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
    title: "Industry Engagement Drop",
    message: "TechNova Pvt. Ltd. has shown no activity for 30+ days. Consider follow-up.",
    time: "2 days ago",
    read: true,
    route: "/industry-activeness",
  },
  {
    id: 8,
    type: "event",
    icon: Megaphone,
    iconBg: "#D1FAE5",
    iconColor: "#065F46",
    title: "Event Created",
    message: "Annual Industry Collaboration Summit 2025 has been successfully created.",
    time: "3 days ago",
    read: true,
    route: "/event-creation",
  },
];

// ─── Notification Panel Component ─────────────────────────────────────────────
const NotificationPanel = ({ notifications, onMarkRead, onMarkAll, onClear, onNavigate, onClose }) => {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [activeTab, setActiveTab] = useState("All");

  const filtered = notifications.filter((n) => {
    if (activeTab === "Applications")
      return ["application", "approved", "forwarded"].includes(n.type);
    if (activeTab === "Alerts")
      return ["deadline", "alert"].includes(n.type);
    return true;
  });

  return (
    <motion.div
      style={np.panel}
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      {/* Header */}
      <div style={np.header}>
        <div style={np.headerLeft}>
          <Bell size={17} color="#0F172A" />
          <span style={np.headerTitle}>Notifications</span>
          {unreadCount > 0 && (
            <span style={np.unreadPill}>{unreadCount} new</span>
          )}
        </div>
        <div style={np.headerActions}>
          <button style={np.textBtn} onClick={onMarkAll} title="Mark all as read">
            <CheckCheck size={15} /> All read
          </button>
          <button style={np.iconBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={np.tabs}>
        {["All", "Applications", "Alerts"].map((tab) => (
          <button
            key={tab}
            style={{ ...np.tab, ...(activeTab === tab ? np.tabActive : {}) }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === "Applications" && (
              <span
                style={{
                  ...np.tabCount,
                  background: activeTab === tab ? "rgba(255,255,255,0.25)" : "#F1F5F9",
                }}
              >
                {notifications.filter((n) =>
                  ["application", "approved", "forwarded"].includes(n.type)
                ).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={np.list}>
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div style={np.empty}>
              <Bell size={36} color="#E2E8F0" />
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", marginTop: "10px" }}>
                No notifications
              </p>
            </div>
          ) : (
            filtered.map((n, i) => {
              const IconComp = n.icon;
              return (
                <motion.div
                  key={n.id}
                  style={{ ...np.item, background: n.read ? "#fff" : "#F8FAFF" }}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ background: "#F1F5F9" }}
                  onClick={() => {
                    onMarkRead(n.id);
                    onNavigate(n.route);
                    onClose();
                  }}
                >
                  {!n.read && <div style={np.unreadDot} />}
                  <div style={{ ...np.iconWrap, background: n.iconBg }}>
                    <IconComp size={16} color={n.iconColor} />
                  </div>
                  <div style={np.itemBody}>
                    <div style={np.itemTitle}>{n.title}</div>
                    <div style={np.itemMsg}>{n.message}</div>
                    <div style={np.itemTime}>{n.time}</div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={np.footer}>
        <button style={np.clearBtn} onClick={onClear}>
          Clear all notifications
        </button>
      </div>
    </motion.div>
  );
};

// ─── Notification Panel Styles ─────────────────────────────────────────────────
const np = {
  panel: {
    position: "absolute",
    top: "52px",
    right: "0",
    width: "380px",
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
    zIndex: 999,
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 18px 12px",
    borderBottom: "1px solid #F1F5F9",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "8px" },
  headerTitle: { fontSize: "0.95rem", fontWeight: "700", color: "#0F172A" },
  unreadPill: {
    background: "#EFF6FF",
    color: "#1D4ED8",
    fontSize: "0.7rem",
    fontWeight: "700",
    padding: "2px 8px",
    borderRadius: "20px",
  },
  headerActions: { display: "flex", alignItems: "center", gap: "6px" },
  textBtn: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "none",
    border: "none",
    color: "#64748B",
    fontSize: "0.75rem",
    fontWeight: "600",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "8px",
  },
  iconBtn: {
    background: "#F8FAFC",
    border: "none",
    color: "#64748B",
    borderRadius: "8px",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    display: "flex",
    gap: "6px",
    padding: "10px 18px",
    borderBottom: "1px solid #F1F5F9",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 12px",
    borderRadius: "8px",
    border: "none",
    background: "none",
    color: "#64748B",
    fontSize: "0.78rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  tabActive: { background: "#0F172A", color: "#fff" },
  tabCount: {
    padding: "1px 6px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "700",
  },
  list: { maxHeight: "380px", overflowY: "auto" },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 0",
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "13px 18px",
    cursor: "pointer",
    borderBottom: "1px solid #F8FAFC",
    position: "relative",
    transition: "background 0.2s",
  },
  unreadDot: {
    position: "absolute",
    top: "18px",
    left: "6px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#3B82F6",
  },
  iconWrap: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  itemBody: { flex: 1, minWidth: 0 },
  itemTitle: {
    fontSize: "0.82rem",
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: "3px",
  },
  itemMsg: {
    fontSize: "0.78rem",
    color: "#64748B",
    lineHeight: 1.45,
    marginBottom: "4px",
  },
  itemTime: { fontSize: "0.72rem", color: "#94A3B8", fontWeight: "500" },
  footer: { padding: "12px 18px", borderTop: "1px solid #F1F5F9" },
  clearBtn: {
    width: "100%",
    background: "#F8FAFC",
    border: "1.5px solid #E2E8F0",
    borderRadius: "10px",
    padding: "9px",
    color: "#64748B",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const MainDashboardWeb = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed]         = useState(false);
  const [activeCard, setActiveCard]       = useState(null);
  const [hoveredCard, setHoveredCard]     = useState(null);
  const [showNotifs, setShowNotifs]       = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const notifRef                          = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  const markAll = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const handleLogout  = () => { localStorage.removeItem("token"); navigate("/login"); };

  const cardData = [
    { id: 1,  icon: <FileSignature size={40} />, title: "MOUs",                 desc: "Track signed and pending Memorandums of Understanding.",         route: "/mou-management"       },
    { id: 2,  icon: <MapPin size={40} />,        title: "Nearby Industries",     desc: "View industries near your location on an interactive map.",      route: "/nearby-industries"    },
    { id: 4,  icon: <CalendarPlus size={40} />,  title: "Advisory Meetings",     desc: "Schedule and manage advisory board meetings.",                   route: "/AdvisoryMeetings"     },
    { id: 5,  icon: <Network size={40} />,       title: "Industry Activeness",   desc: "Monitor active partnerships and industry participation.",        route: "/industry-activeness"  },
    { id: 7,  icon: <Briefcase size={40} />,     title: "Industry Projects",     desc: "View and manage projects offered by industries.",                route: "/industry-projects"    },
    { id: 10, icon: <ClipboardList size={40} />, title: "Student Applications",  desc: "Review, approve, and forward student applications to industry.", route: "/student-applications" },
    { id: 8,  icon: <CalendarCog size={40} />,   title: "Event Creation",        desc: "Create and manage university–industry collaborative events.",    route: "/event-creation"       },
    { id: 6,  icon: <BarChart3 size={40} />,     title: "Ratings & Feedback",    desc: "View ratings and feedback from both students and industries.",   route: "/ratings-feedback"     },
    { id: 9,  icon: <Settings size={40} />,      title: "System Settings",       desc: "Configure system preferences, permissions, and access controls.", route: "/system-settings"     },
  ];

  const sidebarWidth = collapsed ? "80px" : "250px";

  return (
    <div style={styles.container}>
      {/* ===== Sidebar ===== */}
      <motion.aside
        style={{ ...styles.sidebar, width: sidebarWidth }}
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div style={styles.sidebarHeader}>
          <div style={styles.logoContainer}>
            <img src={collaxionLogo} alt="Logo" style={styles.logoImg} />
            {!collapsed && (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={styles.logoText}
              >
                <span style={styles.logoC}>C</span>olla
                <span style={styles.logoX}>X</span>ion
              </motion.h2>
            )}
          </div>
          <motion.button onClick={toggleSidebar} style={styles.toggleBtn} whileTap={{ scale: 0.9 }}>
            <Menu size={20} />
          </motion.button>
        </div>

        <nav style={styles.nav}>
          {[
            ["Manage MOUs",           FileSignature, "/mou-management"       ],
            ["Nearby Industries",     MapPin,        "/nearby-industries"    ],
            ["Internships & Projects",GraduationCap, "/industry-projects"   ],
            ["Student Applications",  ClipboardList, "/student-applications" ],
            ["Event Creation",        CalendarCog,   "/event-creation"       ],
            ["Advisory Meetings",     CalendarPlus,  "/AdvisoryMeetings"     ],
            ["Industry Engagement",   Network,       "/industry-activeness"  ],
            ["Ratings & Feedback",    BarChart3,     "/ratings-feedback"     ],
            ["System Settings",       Settings,      "/system-settings"      ],
          ].map(([label, Icon, path], i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                ...styles.navItem,
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "10px 0" : "10px 12px",
              }}
              onClick={() => path && navigate(path)}
            >
              <Icon size={18} style={styles.icon} />
              {!collapsed && <span>{label}</span>}
            </motion.div>
          ))}
        </nav>

        <motion.div
          whileHover={{ scale: 1.05, color: "#fff" }}
          style={{ ...styles.logout, justifyContent: collapsed ? "center" : "flex-start" }}
          onClick={handleLogout}
        >
          <LogOut size={16} style={styles.icon} />
          {!collapsed && <span>Logout</span>}
        </motion.div>
      </motion.aside>

      {/* ===== Main Area ===== */}
      <main style={styles.main}>
        <motion.div
          style={styles.topbar}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={styles.title}>CollaXion Admin Dashboard</h1>

          <div style={styles.topRight}>
            {/* ── Bell ── */}
            <div ref={notifRef} style={styles.bellWrap}>
              <motion.button
                style={styles.bellBtn}
                whileTap={{ scale: 0.9 }}
                whileHover={{ background: "#EFF6FF" }}
                onClick={() => setShowNotifs((v) => !v)}
              >
                <Bell size={20} color={showNotifs ? "#1D4ED8" : "#193648"} />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      style={styles.badge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <AnimatePresence>
                {showNotifs && (
                  <NotificationPanel
                    notifications={notifications}
                    onMarkRead={markRead}
                    onMarkAll={markAll}
                    onClear={clearAll}
                    onNavigate={(route) => navigate(route)}
                    onClose={() => setShowNotifs(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* User Greeting */}
            <div style={styles.userBox}>
              <motion.span
                style={styles.wavingHand}
                animate={{ rotate: [0, 15, -10, 15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              >
                👋
              </motion.span>
              <span style={styles.username}>Welcome, Ms.Tazzaina</span>
            </div>
          </div>
        </motion.div>

        <p style={styles.subtitle}>
          Monitor and manage all collaboration activities between Universities & Industries
        </p>

        {/* Dashboard Cards */}
        <motion.section
          style={styles.cardsGrid}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          {cardData.map((card) => {
            const isHovered = hoveredCard === card.id;
            const isActive  = activeCard  === card.id;
            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => { setActiveCard(card.id); if (card.route) navigate(card.route); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3 }}
                style={{
                  ...styles.card,
                  background: isActive ? "#193648" : isHovered ? "#E2EEF9" : "#fff",
                  color: isActive ? "#fff" : "#193648",
                  boxShadow: isHovered
                    ? "0 12px 30px rgba(0,0,0,0.15)"
                    : "0 6px 15px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ color: isActive ? "#fff" : "#193648" }}>{card.icon}</div>
                <h3 style={styles.cardTitle}>{card.title}</h3>
                <p style={styles.cardDesc}>{card.desc}</p>
              </motion.div>
            );
          })}
        </motion.section>
      </main>
    </div>
  );
};

// ─── Main Styles ───────────────────────────────────────────────────────────────
const styles = {
  container: {
    display: "flex", height: "100vh",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #E2EEF9 0%, #FFFFFF 100%)",
  },
  sidebar: {
    background: "#193648", color: "#fff",
    display: "flex", flexDirection: "column", justifyContent: "space-between",
    padding: "20px 15px",
    boxShadow: "4px 0 20px rgba(0,0,0,0.2)", transition: "all 0.3s ease",
  },
  sidebarHeader: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: "30px",
  },
  logoContainer: { display: "flex", alignItems: "center", gap: "10px" },
  logoImg: { width: "35px", height: "35px", borderRadius: "50%" },
  logoText: { fontSize: "1.5rem", fontWeight: "700", color: "#fff" },
  logoC: { color: "#fff", fontSize: "1.7rem" },
  logoX: { color: "#fff" },
  toggleBtn: { background: "transparent", border: "none", color: "#fff", cursor: "pointer" },
  nav: { display: "flex", flexDirection: "column", gap: "12px" },
  navItem: {
    display: "flex", alignItems: "center", gap: "15px",
    cursor: "pointer", fontWeight: "500", color: "#d8e4f5",
    borderRadius: "10px", transition: "all 0.3s ease",
  },
  icon: { color: "#AAC3FC" },
  logout: {
    display: "flex", alignItems: "center", gap: "10px",
    color: "#AAC3FC", fontWeight: "500", cursor: "pointer",
    borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "15px",
  },
  main: { flex: 1, padding: "30px 50px", overflowY: "auto" },
  topbar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  topRight: { display: "flex", alignItems: "center", gap: "14px" },
  bellWrap: { position: "relative" },
  bellBtn: {
    position: "relative", background: "#fff",
    border: "1.5px solid #E2E8F0", borderRadius: "12px",
    padding: "8px 10px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)", transition: "background 0.2s",
  },
  badge: {
    position: "absolute", top: "-6px", right: "-6px",
    background: "#EF4444", color: "#fff",
    fontSize: "0.65rem", fontWeight: "800",
    minWidth: "18px", height: "18px", borderRadius: "20px",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "0 4px", border: "2px solid #fff",
    boxShadow: "0 2px 6px rgba(239,68,68,0.5)",
  },
  userBox: { display: "flex", alignItems: "center", gap: "10px" },
  wavingHand: { fontSize: "1.8rem" },
  username: { fontWeight: "500", color: "#193648", fontSize: "1.1rem" },
  title: { color: "#193648", fontSize: "1.8rem", fontWeight: "700" },
  subtitle: {
    color: "#3A70B0", fontSize: "1rem",
    marginTop: "10px", marginBottom: "35px",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
  },
  card: {
    background: "#fff", borderRadius: "18px", padding: "25px",
    textAlign: "center", transition: "all 0.3s ease", cursor: "pointer",
  },
  cardTitle: { marginTop: "12px", fontSize: "1.1rem", fontWeight: "600" },
  cardDesc: { fontSize: "0.9rem", opacity: 0.8, marginTop: "5px" },
};

export default MainDashboardWeb;