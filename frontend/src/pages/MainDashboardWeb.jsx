import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileSignature,
  MapPin,
  Users,
  CalendarPlus,
  GraduationCap,
  Briefcase,
  Settings,
  LogOut,
  BarChart3,
  Network,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import collaxionLogo from "../images/collaxionlogo.jpeg";

const MainDashboardWeb = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Agar tum token use kar rahi ho
    navigate("/login"); // Redirect to login page
  };

  const cardData = [
    { id: 1, icon: <FileSignature size={40} />, title: "MOUs", desc: "Track signed and pending Memorandums of Understanding.", route: "/mou-management" },
    { id: 2, icon: <MapPin size={40} />, title: "Nearby Industries", desc: "View industries near your location on an interactive map.", route: "/nearby-industries" },
    { id: 3, icon: <Users size={40} />, title: "Student Approvals", desc: "Manage and verify student internship applications." },
    { id: 4, icon: <CalendarPlus size={40} />, title: "Advisory Meetings", desc: "Schedule and manage advisory board meetings." },
    { id: 5, icon: <Network size={40} />, title: "Industry Activeness", desc: "Monitor active partnerships and industry participation." },
    { id: 6, icon: <BarChart3 size={40} />, title: "Analytics Overview", desc: "Visualize engagement metrics and collaboration data." },
    { id: 7, icon: <Briefcase size={40} />, title: "Industry Projects", desc: "View and manage projects offered by industries." },
  ];

  const sidebarWidth = collapsed ? "80px" : "250px";

  return (
    <div style={{ ...styles.container }}>
      {/* ===== Sidebar ===== */}
      <motion.aside
        style={{ ...styles.sidebar, width: sidebarWidth }}
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Top Section (Logo + Toggle) */}
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
          <motion.button
            onClick={toggleSidebar}
            style={styles.toggleBtn}
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={20} />
          </motion.button>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {[
            ["Manage MOUs", FileSignature, "/mou-management"],
            ["Nearby Industries", MapPin, "/nearby-industries"],
            ["Student Approvals", Users],
            ["Internship Management", GraduationCap],
            ["Advisory Meetings", CalendarPlus],
            ["System Settings", Settings],
          ].map(([label, Icon, path], i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.05,
                background: "rgba(255,255,255,0.15)",
              }}
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

        {/* Logout */}
        <motion.div
          whileHover={{ scale: 1.05, color: "#fff" }}
          style={{
            ...styles.logout,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onClick={handleLogout} // Bind logout function here
        >
          <LogOut size={16} style={styles.icon} />
          {!collapsed && <span>Logout</span>}
        </motion.div>
      </motion.aside>

      {/* ===== Main Dashboard ===== */}
      <main style={styles.main}>
        <motion.div
          style={styles.topbar}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={styles.title}>CollaXion Admin Dashboard</h1>
          <div style={styles.userBox}>
            <motion.span
              style={styles.wavingHand}
              animate={{ rotate: [0, 15, -10, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              👋
            </motion.span>
            <span style={styles.username}>Welcome, Admin</span>
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
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {cardData.map((card) => {
            const isHovered = hoveredCard === card.id;
            const isActive = activeCard === card.id;

            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => {
                  setActiveCard(card.id);
                  if (card.route) navigate(card.route);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3 }}
                style={{
                  ...styles.card,
                  background: isActive
                    ? "#193648"
                    : isHovered
                      ? "#E2EEF9"
                      : "#fff",
                  color: isActive ? "#fff" : "#193648",
                  boxShadow: isHovered
                    ? "0 12px 30px rgba(0,0,0,0.15)"
                    : "0 6px 15px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ color: isActive ? "#fff" : "#193648" }}>
                  {card.icon}
                </div>
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

// ===== Styles =====
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #E2EEF9 0%, #FFFFFF 100%)",
  },
  sidebar: {
    background: "#193648",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px 15px",
    boxShadow: "4px 0 20px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoImg: { width: "35px", height: "35px", borderRadius: "50%" },
  logoText: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#fff",
    textShadow: "0 0 10px rgba(247, 248, 250, 0)",
  },
  logoC: { color: "#fff", fontSize: "1.7rem" },
  logoX: { color: "#fff" },
  toggleBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  nav: { display: "flex", flexDirection: "column", gap: "12px" },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    cursor: "pointer",
    fontWeight: "500",
    color: "#d8e4f5",
    borderRadius: "10px",
    transition: "all 0.3s ease",
  },
  icon: { color: "#AAC3FC" },
  logout: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#AAC3FC",
    fontWeight: "500",
    cursor: "pointer",
    borderTop: "1px solid rgba(255,255,255,0.2)",
    paddingTop: "15px",
  },
  main: { flex: 1, padding: "30px 50px", overflowY: "auto" },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  userBox: { display: "flex", alignItems: "center", gap: "10px" },
  wavingHand: { fontSize: "1.8rem" },
  username: { fontWeight: "500", color: "#193648", fontSize: "1.1rem" },
  title: { color: "#193648", fontSize: "1.8rem", fontWeight: "700" },
  subtitle: { color: "#3A70B0", fontSize: "1rem", marginTop: "10px", marginBottom: "35px" },
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px" },
  card: { background: "#fff", borderRadius: "18px", padding: "25px", textAlign: "center", transition: "all 0.3s ease", cursor: "pointer" },
  cardTitle: { marginTop: "12px", fontSize: "1.1rem", fontWeight: "600" },
  cardDesc: { fontSize: "0.9rem", opacity: 0.8, marginTop: "5px" },
};

export default MainDashboardWeb;
