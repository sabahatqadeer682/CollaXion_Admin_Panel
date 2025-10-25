import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileSignature,
  MapPin,
  Users,
  CalendarPlus,
  GraduationCap,
  Building2,
  Briefcase,
  Settings,
  LogOut,
  UserCheck,
  BarChart3,
  Network,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import collaxionLogo from "../images/collaxionlogo.jpeg";

const MainDashboardWeb = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const cardData = [
    {
      id: 1,
      icon: <FileSignature size={40} />,
      title: "MOUs",
      desc: "Track signed and pending Memorandums of Understanding.",
      route: "/mou-management",
    },
    {
      id: 2,
      icon: <MapPin size={40} />,
      title: "Nearby Industries",
      desc: "View industries near your location on an interactive map.",
      route: "/nearby-industries",
    },
    {
      id: 3,
      icon: <Users size={40} />,
      title: "Student Approvals",
      desc: "Manage and verify student internship applications.",
    },
   
    {
      id: 5,
      icon: <CalendarPlus size={40} />,
      title: "Advisory Meetings",
      desc: "Schedule and manage advisory board meetings.",
    },
    {
      id: 6,
      icon: <Network size={40} />,
      title: "Industry Activeness",
      desc: "Monitor active partnerships and industry participation.",
    },
    {
      id: 7,
      icon: <BarChart3 size={40} />,
      title: "Analytics Overview",
      desc: "Visualize engagement metrics and collaboration data.",
    },
   
    {
      id: 9,
      icon: <Briefcase size={40} />,
      title: "Industry Projects",
      desc: "View and manage projects offered by industries.",
    },
  ];

  return (
    <div style={styles.container}>
      {/* ===== Sidebar ===== */}
      <motion.aside
        style={styles.sidebar}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          style={styles.logoContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div style={styles.logoCircle}>
            <img src={collaxionLogo} alt="CollaXion Logo" style={styles.logoImg} />
          </div>
          <h2 style={styles.logoText}>
            Colla
            <span
              style={{
                color: "#6CA9FF",
                textShadow: "0 0 10px rgba(108,169,255,0.8)",
              }}
            >
              Xion
            </span>
          </h2>
        </motion.div>

        {/* Sidebar Navigation */}
        <nav style={styles.nav}>
          {[
            ["Manage MOUs", FileSignature, "/mou-management"],
            ["Nearby Industries", MapPin, "/nearby-industries"], // ✅ now navigates
            ["Student Approvals", Users],
            ["Internship Management", GraduationCap],
            ["Advisory Meetings", CalendarPlus],
            ["System Settings", Settings],
          ].map(([label, Icon, path], i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.05,
                background: "rgba(108,169,255,0.15)",
                borderLeft: "4px solid #6CA9FF",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              style={styles.navItem}
              onClick={() => path && navigate(path)}
            >
              <Icon size={18} style={styles.icon} />
              <span>{label}</span>
            </motion.div>
          ))}
        </nav>

        <motion.div
          whileHover={{ scale: 1.05, color: "#fff" }}
          style={styles.logout}
        >
          <LogOut size={16} style={styles.icon} />
          <span>Logout</span>
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
          Monitor and manage all collaboration activities between Universities &
          Industries
        </p>

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
                    ? "#3A70B0"
                    : isHovered
                    ? "#E3ECFF"
                    : "#fff",
                  color: isActive ? "#fff" : "#193648",
                  boxShadow: isHovered
                    ? "0 10px 25px rgba(0,0,0,0.15)"
                    : "0 6px 14px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ color: isActive ? "#fff" : "#3A70B0" }}>
                  {card.icon}
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </motion.div>
            );
          })}
        </motion.section>
      </main>
    </div>
  );
};

// ===== Styling =====
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #E6EEF8 0%, #B9CDF4 100%)",
  },
  sidebar: {
    width: "250px",
    background: "linear-gradient(180deg, #142A40 0%, #1D4065 100%)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "25px 20px",
    boxShadow: "4px 0 15px rgba(0,0,0,0.15)",
    borderTopRightRadius: "18px",
    borderBottomRightRadius: "18px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "35px",
  },
  logoCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 8px rgba(255,255,255,0.2)",
  },
  logoImg: { width: "30px", height: "30px", borderRadius: "50%" },
  logoText: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "0.5px",
  },
  nav: { display: "flex", flexDirection: "column", gap: "14px" },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    cursor: "pointer",
    fontWeight: "500",
    color: "#d8e4f5",
    padding: "10px 12px",
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
    opacity: 0.9,
  },
  main: { flex: 1, padding: "30px 50px", overflowY: "auto" },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userBox: { display: "flex", alignItems: "center", gap: "10px" },
  wavingHand: { fontSize: "1.8rem", display: "inline-block" },
  username: { fontWeight: "500", color: "#193648", fontSize: "1.1rem" },
  title: { color: "#193648", fontSize: "1.8rem", fontWeight: "700" },
  subtitle: {
    color: "#3A70B0",
    fontSize: "1rem",
    marginTop: "10px",
    textAlign: "left",
    marginLeft: "5px",
    marginBottom: "35px",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
  },
  card: {
    background: "#fff",
    borderRadius: "15px",
    padding: "25px",
    textAlign: "center",
    boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
};

export default MainDashboardWeb;

