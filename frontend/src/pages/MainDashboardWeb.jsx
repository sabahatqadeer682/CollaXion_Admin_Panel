// import React, { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FileSignature,
//   MapPin,
//   CalendarPlus,
//   GraduationCap,
//   Briefcase,
//   Settings,
//   LogOut,
//   BarChart3,
//   Network,
//   Menu,
//   CalendarCog,
//   ClipboardList,
//   Bell,
//   CheckCheck,
//   X,
//   ClipboardCheck,
//   UserCheck,
//   AlertCircle,
//   Send,
//   Clock,
//   Megaphone,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import collaxionLogo from "../images/collaxionlogo.jpeg";

// // ─── Mock Notifications ────────────────────────────────────────────────────────
// const INITIAL_NOTIFICATIONS = [
//   {
//     id: 1,
//     type: "application",
//     icon: ClipboardList,
//     iconBg: "#DBEAFE",
//     iconColor: "#1D4ED8",
//     title: "New Student Application",
//     message: "Ayesha Malik applied for Web3 Internship Program at NextChain Solutions.",
//     time: "2 min ago",
//     read: false,
//     route: "/student-applications",
//   },
//   {
//     id: 2,
//     type: "application",
//     icon: ClipboardList,
//     iconBg: "#DBEAFE",
//     iconColor: "#1D4ED8",
//     title: "New Student Application",
//     message: "Fatima Zahra applied for Mobile UX Research Study at PixelCraft Studios.",
//     time: "15 min ago",
//     read: false,
//     route: "/student-applications",
//   },
//   {
//     id: 3,
//     type: "approved",
//     icon: UserCheck,
//     iconBg: "#D1FAE5",
//     iconColor: "#065F46",
//     title: "Application Approved by Incharge",
//     message: "Hassan Javed's application for Mobile UX Research Study has been approved by internship incharge.",
//     time: "1 hr ago",
//     read: false,
//     route: "/student-applications",
//   },
//   {
//     id: 4,
//     type: "forwarded",
//     icon: Send,
//     iconBg: "#EDE9FE",
//     iconColor: "#6D28D9",
//     title: "Application Forwarded to Industry",
//     message: "Bilal Ahmed's application was forwarded to NextChain Solutions successfully.",
//     time: "3 hrs ago",
//     read: true,
//     route: "/student-applications",
//   },
//   {
//     id: 5,
//     type: "deadline",
//     icon: Clock,
//     iconBg: "#FEF3C7",
//     iconColor: "#92400E",
//     title: "Deadline Approaching",
//     message: "Web3 Internship Program deadline is in 3 days. Review pending applications.",
//     time: "5 hrs ago",
//     read: false,
//     route: "/industry-projects",
//   },
//   {
//     id: 6,
//     type: "mou",
//     icon: FileSignature,
//     iconBg: "#FCE7F3",
//     iconColor: "#BE185D",
//     title: "MOU Pending Signature",
//     message: "EcoPower Industries MOU is awaiting your signature. Please review.",
//     time: "1 day ago",
//     read: true,
//     route: "/mou-management",
//   },
//   {
//     id: 7,
//     type: "alert",
//     icon: AlertCircle,
//     iconBg: "#FEE2E2",
//     iconColor: "#DC2626",
//     title: "Industry Engagement Drop",
//     message: "TechNova Pvt. Ltd. has shown no activity for 30+ days. Consider follow-up.",
//     time: "2 days ago",
//     read: true,
//     route: "/industry-activeness",
//   },
//   {
//     id: 8,
//     type: "event",
//     icon: Megaphone,
//     iconBg: "#D1FAE5",
//     iconColor: "#065F46",
//     title: "Event Created",
//     message: "Annual Industry Collaboration Summit 2025 has been successfully created.",
//     time: "3 days ago",
//     read: true,
//     route: "/event-creation",
//   },

//   { 
//   id: 11, 
//   icon: <ClipboardCheck size={40} />, 
//   title: "Industry Registrations", 
//   desc: "View and review industry registration form responses.", 
//   route: "/industry-registrations" 
// }
// ];

// // ─── Notification Panel Component ─────────────────────────────────────────────
// const NotificationPanel = ({ notifications, onMarkRead, onMarkAll, onClear, onNavigate, onClose }) => {
//   const unreadCount = notifications.filter((n) => !n.read).length;
//   const [activeTab, setActiveTab] = useState("All");

//   const filtered = notifications.filter((n) => {
//     if (activeTab === "Applications")
//       return ["application", "approved", "forwarded"].includes(n.type);
//     if (activeTab === "Alerts")
//       return ["deadline", "alert"].includes(n.type);
//     return true;
//   });

//   return (
//     <motion.div
//       style={np.panel}
//       initial={{ opacity: 0, y: -12, scale: 0.96 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       exit={{ opacity: 0, y: -12, scale: 0.96 }}
//       transition={{ type: "spring", stiffness: 320, damping: 28 }}
//     >
//       {/* Header */}
//       <div style={np.header}>
//         <div style={np.headerLeft}>
//           <Bell size={17} color="#0F172A" />
//           <span style={np.headerTitle}>Notifications</span>
//           {unreadCount > 0 && (
//             <span style={np.unreadPill}>{unreadCount} new</span>
//           )}
//         </div>
//         <div style={np.headerActions}>
//           <button style={np.textBtn} onClick={onMarkAll} title="Mark all as read">
//             <CheckCheck size={15} /> All read
//           </button>
//           <button style={np.iconBtn} onClick={onClose}>
//             <X size={16} />
//           </button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div style={np.tabs}>
//         {["All", "Applications", "Alerts"].map((tab) => (
//           <button
//             key={tab}
//             style={{ ...np.tab, ...(activeTab === tab ? np.tabActive : {}) }}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//             {tab === "Applications" && (
//               <span
//                 style={{
//                   ...np.tabCount,
//                   background: activeTab === tab ? "rgba(255,255,255,0.25)" : "#F1F5F9",
//                 }}
//               >
//                 {notifications.filter((n) =>
//                   ["application", "approved", "forwarded"].includes(n.type)
//                 ).length}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* List */}
//       <div style={np.list}>
//         <AnimatePresence>
//           {filtered.length === 0 ? (
//             <div style={np.empty}>
//               <Bell size={36} color="#E2E8F0" />
//               <p style={{ color: "#94A3B8", fontSize: "0.85rem", marginTop: "10px" }}>
//                 No notifications
//               </p>
//             </div>
//           ) : (
//             filtered.map((n, i) => {
//               const IconComp = n.icon;
//               return (
//                 <motion.div
//                   key={n.id}
//                   style={{ ...np.item, background: n.read ? "#fff" : "#F8FAFF" }}
//                   initial={{ opacity: 0, x: 16 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -16 }}
//                   transition={{ delay: i * 0.04 }}
//                   whileHover={{ background: "#F1F5F9" }}
//                   onClick={() => {
//                     onMarkRead(n.id);
//                     onNavigate(n.route);
//                     onClose();
//                   }}
//                 >
//                   {!n.read && <div style={np.unreadDot} />}
//                   <div style={{ ...np.iconWrap, background: n.iconBg }}>
//                     <IconComp size={16} color={n.iconColor} />
//                   </div>
//                   <div style={np.itemBody}>
//                     <div style={np.itemTitle}>{n.title}</div>
//                     <div style={np.itemMsg}>{n.message}</div>
//                     <div style={np.itemTime}>{n.time}</div>
//                   </div>
//                 </motion.div>
//               );
//             })
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Footer */}
//       <div style={np.footer}>
//         <button style={np.clearBtn} onClick={onClear}>
//           Clear all notifications
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// // ─── Notification Panel Styles ─────────────────────────────────────────────────
// const np = {
//   panel: {
//     position: "absolute",
//     top: "52px",
//     right: "0",
//     width: "380px",
//     background: "#fff",
//     borderRadius: "18px",
//     boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
//     zIndex: 999,
//     overflow: "hidden",
//     fontFamily: "'Poppins', sans-serif",
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "16px 18px 12px",
//     borderBottom: "1px solid #F1F5F9",
//   },
//   headerLeft: { display: "flex", alignItems: "center", gap: "8px" },
//   headerTitle: { fontSize: "0.95rem", fontWeight: "700", color: "#0F172A" },
//   unreadPill: {
//     background: "#EFF6FF",
//     color: "#1D4ED8",
//     fontSize: "0.7rem",
//     fontWeight: "700",
//     padding: "2px 8px",
//     borderRadius: "20px",
//   },
//   headerActions: { display: "flex", alignItems: "center", gap: "6px" },
//   textBtn: {
//     display: "flex",
//     alignItems: "center",
//     gap: "4px",
//     background: "none",
//     border: "none",
//     color: "#64748B",
//     fontSize: "0.75rem",
//     fontWeight: "600",
//     cursor: "pointer",
//     padding: "4px 8px",
//     borderRadius: "8px",
//   },
//   iconBtn: {
//     background: "#F8FAFC",
//     border: "none",
//     color: "#64748B",
//     borderRadius: "8px",
//     padding: "5px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   tabs: {
//     display: "flex",
//     gap: "6px",
//     padding: "10px 18px",
//     borderBottom: "1px solid #F1F5F9",
//   },
//   tab: {
//     display: "flex",
//     alignItems: "center",
//     gap: "5px",
//     padding: "5px 12px",
//     borderRadius: "8px",
//     border: "none",
//     background: "none",
//     color: "#64748B",
//     fontSize: "0.78rem",
//     fontWeight: "600",
//     cursor: "pointer",
//   },
//   tabActive: { background: "#0F172A", color: "#fff" },
//   tabCount: {
//     padding: "1px 6px",
//     borderRadius: "20px",
//     fontSize: "0.7rem",
//     fontWeight: "700",
//   },
//   list: { maxHeight: "380px", overflowY: "auto" },
//   empty: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     padding: "48px 0",
//   },
//   item: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: "12px",
//     padding: "13px 18px",
//     cursor: "pointer",
//     borderBottom: "1px solid #F8FAFC",
//     position: "relative",
//     transition: "background 0.2s",
//   },
//   unreadDot: {
//     position: "absolute",
//     top: "18px",
//     left: "6px",
//     width: "6px",
//     height: "6px",
//     borderRadius: "50%",
//     background: "#3B82F6",
//   },
//   iconWrap: {
//     width: "36px",
//     height: "36px",
//     borderRadius: "10px",
//     flexShrink: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   itemBody: { flex: 1, minWidth: 0 },
//   itemTitle: {
//     fontSize: "0.82rem",
//     fontWeight: "700",
//     color: "#0F172A",
//     marginBottom: "3px",
//   },
//   itemMsg: {
//     fontSize: "0.78rem",
//     color: "#64748B",
//     lineHeight: 1.45,
//     marginBottom: "4px",
//   },
//   itemTime: { fontSize: "0.72rem", color: "#94A3B8", fontWeight: "500" },
//   footer: { padding: "12px 18px", borderTop: "1px solid #F1F5F9" },
//   clearBtn: {
//     width: "100%",
//     background: "#F8FAFC",
//     border: "1.5px solid #E2E8F0",
//     borderRadius: "10px",
//     padding: "9px",
//     color: "#64748B",
//     fontSize: "0.8rem",
//     fontWeight: "600",
//     cursor: "pointer",
//   },
// };

// // ─── Main Dashboard ────────────────────────────────────────────────────────────
// const MainDashboardWeb = () => {
//   const navigate = useNavigate();
//   const [collapsed, setCollapsed]         = useState(false);
//   const [activeCard, setActiveCard]       = useState(null);
//   const [hoveredCard, setHoveredCard]     = useState(null);
//   const [showNotifs, setShowNotifs]       = useState(false);
//   const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
//   const notifRef                          = useRef(null);

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   useEffect(() => {
//     const handler = (e) => {
//       if (notifRef.current && !notifRef.current.contains(e.target)) {
//         setShowNotifs(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const markRead = (id) =>
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );
//   const markAll = () =>
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//   const clearAll = () => setNotifications([]);

//   const toggleSidebar = () => setCollapsed(!collapsed);
//   const handleLogout  = () => { localStorage.removeItem("token"); navigate("/login"); };

//   const cardData = [
//     { id: 1,  icon: <FileSignature size={40} />, title: "MOUs",                 desc: "Track signed and pending Memorandums of Understanding.",         route: "/mou-management"       },
//     { id: 2,  icon: <MapPin size={40} />,        title: "Nearby Industries",     desc: "View industries near your location on an interactive map.",      route: "/nearby-industries"    },
//     { id: 4,  icon: <CalendarPlus size={40} />,  title: "Advisory Meetings",     desc: "Schedule and manage advisory board meetings.",                   route: "/AdvisoryMeetings"     },
//     { id: 5,  icon: <Network size={40} />,       title: "Industry Activeness",   desc: "Monitor active partnerships and industry participation.",        route: "/industry-activeness"  },
//     { id: 7,  icon: <Briefcase size={40} />,     title: "Industry Projects",     desc: "View and manage projects offered by industries.",                route: "/industry-projects"    },
//     { id: 10, icon: <ClipboardList size={40} />, title: "Student Applications",  desc: "Review, approve, and forward student applications to industry.", route: "/student-applications" },
//     { id: 8,  icon: <CalendarCog size={40} />,   title: "Event Creation",        desc: "Create and manage university–industry collaborative events.",    route: "/event-creation"       },
//     { id: 6,  icon: <BarChart3 size={40} />,     title: "Ratings & Feedback",    desc: "View ratings and feedback from both students and industries.",   route: "/ratings-feedback"     },
//     { id: 9,  icon: <Settings size={40} />,      title: "System Settings",       desc: "Configure system preferences, permissions, and access controls.", route: "/system-settings"     },
//   ];

//   const sidebarWidth = collapsed ? "80px" : "250px";

//   return (
//     <div style={styles.container}>
//       {/* ===== Sidebar ===== */}
//       <motion.aside
//         style={{ ...styles.sidebar, width: sidebarWidth }}
//         animate={{ width: sidebarWidth }}
//         transition={{ duration: 0.4, ease: "easeInOut" }}
//       >
//         <div style={styles.sidebarHeader}>
//           <div style={styles.logoContainer}>
//             <img src={collaxionLogo} alt="Logo" style={styles.logoImg} />
//             {!collapsed && (
//               <motion.h2
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 style={styles.logoText}
//               >
//                 <span style={styles.logoC}>C</span>olla
//                 <span style={styles.logoX}>X</span>ion
//               </motion.h2>
//             )}
//           </div>
//           <motion.button onClick={toggleSidebar} style={styles.toggleBtn} whileTap={{ scale: 0.9 }}>
//             <Menu size={20} />
//           </motion.button>
//         </div>

//         <nav style={styles.nav}>
//           {[
//             ["Manage MOUs",           FileSignature, "/mou-management"       ],
//             ["Nearby Industries",     MapPin,        "/nearby-industries"    ],
//             ["Internships & Projects",GraduationCap, "/industry-projects"   ],
//             ["Student Applications",  ClipboardList, "/student-applications" ],
//             ["Event Creation",        CalendarCog,   "/event-creation"       ],
//             ["Advisory Meetings",     CalendarPlus,  "/AdvisoryMeetings"     ],
//             ["Industry Engagement",   Network,       "/industry-activeness"  ],
//             ["Ratings & Feedback",    BarChart3,     "/ratings-feedback"     ],
//             ["System Settings",       Settings,      "/system-settings"      ],
//           ].map(([label, Icon, path], i) => (
//             <motion.div
//               key={i}
//               whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.15)" }}
//               whileTap={{ scale: 0.95 }}
//               transition={{ duration: 0.2 }}
//               style={{
//                 ...styles.navItem,
//                 justifyContent: collapsed ? "center" : "flex-start",
//                 padding: collapsed ? "10px 0" : "10px 12px",
//               }}
//               onClick={() => path && navigate(path)}
//             >
//               <Icon size={18} style={styles.icon} />
//               {!collapsed && <span>{label}</span>}
//             </motion.div>
//           ))}
//         </nav>

//         <motion.div
//           whileHover={{ scale: 1.05, color: "#fff" }}
//           style={{ ...styles.logout, justifyContent: collapsed ? "center" : "flex-start" }}
//           onClick={handleLogout}
//         >
//           <LogOut size={16} style={styles.icon} />
//           {!collapsed && <span>Logout</span>}
//         </motion.div>
//       </motion.aside>

//       {/* ===== Main Area ===== */}
//       <main style={styles.main}>
//         <motion.div
//           style={styles.topbar}
//           initial={{ opacity: 0, y: -15 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <h1 style={styles.title}>CollaXion Admin Dashboard</h1>

//           <div style={styles.topRight}>
//             {/* ── Bell ── */}
//             <div ref={notifRef} style={styles.bellWrap}>
//               <motion.button
//                 style={styles.bellBtn}
//                 whileTap={{ scale: 0.9 }}
//                 whileHover={{ background: "#EFF6FF" }}
//                 onClick={() => setShowNotifs((v) => !v)}
//               >
//                 <Bell size={20} color={showNotifs ? "#1D4ED8" : "#193648"} />
//                 <AnimatePresence>
//                   {unreadCount > 0 && (
//                     <motion.span
//                       style={styles.badge}
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       exit={{ scale: 0 }}
//                       transition={{ type: "spring", stiffness: 400, damping: 20 }}
//                     >
//                       {unreadCount > 9 ? "9+" : unreadCount}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </motion.button>

//               <AnimatePresence>
//                 {showNotifs && (
//                   <NotificationPanel
//                     notifications={notifications}
//                     onMarkRead={markRead}
//                     onMarkAll={markAll}
//                     onClear={clearAll}
//                     onNavigate={(route) => navigate(route)}
//                     onClose={() => setShowNotifs(false)}
//                   />
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* User Greeting */}
//             <div style={styles.userBox}>
//               <motion.span
//                 style={styles.wavingHand}
//                 animate={{ rotate: [0, 15, -10, 15, 0] }}
//                 transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
//               >
//                 👋
//               </motion.span>
//               <span style={styles.username}>Welcome, Ms.Tazzaina</span>
//             </div>
//           </div>
//         </motion.div>

//         <p style={styles.subtitle}>
//           Monitor and manage all collaboration activities between Universities & Industries
//         </p>

//         {/* Dashboard Cards */}
//         <motion.section
//           style={styles.cardsGrid}
//           initial="hidden"
//           animate="visible"
//           variants={{
//             hidden: { opacity: 0 },
//             visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
//           }}
//         >
//           {cardData.map((card) => {
//             const isHovered = hoveredCard === card.id;
//             const isActive  = activeCard  === card.id;
//             return (
//               <motion.div
//                 key={card.id}
//                 onMouseEnter={() => setHoveredCard(card.id)}
//                 onMouseLeave={() => setHoveredCard(null)}
//                 onClick={() => { setActiveCard(card.id); if (card.route) navigate(card.route); }}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.97 }}
//                 transition={{ duration: 0.3 }}
//                 style={{
//                   ...styles.card,
//                   background: isActive ? "#193648" : isHovered ? "#E2EEF9" : "#fff",
//                   color: isActive ? "#fff" : "#193648",
//                   boxShadow: isHovered
//                     ? "0 12px 30px rgba(0,0,0,0.15)"
//                     : "0 6px 15px rgba(0,0,0,0.08)",
//                 }}
//               >
//                 <div style={{ color: isActive ? "#fff" : "#193648" }}>{card.icon}</div>
//                 <h3 style={styles.cardTitle}>{card.title}</h3>
//                 <p style={styles.cardDesc}>{card.desc}</p>
//               </motion.div>
//             );
//           })}
//         </motion.section>
//       </main>
//     </div>
//   );
// };

// // ─── Main Styles ───────────────────────────────────────────────────────────────
// const styles = {
//   container: {
//     display: "flex", height: "100vh",
//     fontFamily: "'Poppins', sans-serif",
//     background: "linear-gradient(135deg, #E2EEF9 0%, #FFFFFF 100%)",
//   },
//   sidebar: {
//     background: "#193648", color: "#fff",
//     display: "flex", flexDirection: "column", justifyContent: "space-between",
//     padding: "20px 15px",
//     boxShadow: "4px 0 20px rgba(0,0,0,0.2)", transition: "all 0.3s ease",
//   },
//   sidebarHeader: {
//     display: "flex", alignItems: "center",
//     justifyContent: "space-between", marginBottom: "30px",
//   },
//   logoContainer: { display: "flex", alignItems: "center", gap: "10px" },
//   logoImg: { width: "35px", height: "35px", borderRadius: "50%" },
//   logoText: { fontSize: "1.5rem", fontWeight: "700", color: "#fff" },
//   logoC: { color: "#fff", fontSize: "1.7rem" },
//   logoX: { color: "#fff" },
//   toggleBtn: { background: "transparent", border: "none", color: "#fff", cursor: "pointer" },
//   nav: { display: "flex", flexDirection: "column", gap: "12px" },
//   navItem: {
//     display: "flex", alignItems: "center", gap: "15px",
//     cursor: "pointer", fontWeight: "500", color: "#d8e4f5",
//     borderRadius: "10px", transition: "all 0.3s ease",
//   },
//   icon: { color: "#AAC3FC" },
//   logout: {
//     display: "flex", alignItems: "center", gap: "10px",
//     color: "#AAC3FC", fontWeight: "500", cursor: "pointer",
//     borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "15px",
//   },
//   main: { flex: 1, padding: "30px 50px", overflowY: "auto" },
//   topbar: {
//     display: "flex", justifyContent: "space-between", alignItems: "center",
//   },
//   topRight: { display: "flex", alignItems: "center", gap: "14px" },
//   bellWrap: { position: "relative" },
//   bellBtn: {
//     position: "relative", background: "#fff",
//     border: "1.5px solid #E2E8F0", borderRadius: "12px",
//     padding: "8px 10px", cursor: "pointer",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.07)", transition: "background 0.2s",
//   },
//   badge: {
//     position: "absolute", top: "-6px", right: "-6px",
//     background: "#EF4444", color: "#fff",
//     fontSize: "0.65rem", fontWeight: "800",
//     minWidth: "18px", height: "18px", borderRadius: "20px",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     padding: "0 4px", border: "2px solid #fff",
//     boxShadow: "0 2px 6px rgba(239,68,68,0.5)",
//   },
//   userBox: { display: "flex", alignItems: "center", gap: "10px" },
//   wavingHand: { fontSize: "1.8rem" },
//   username: { fontWeight: "500", color: "#193648", fontSize: "1.1rem" },
//   title: { color: "#193648", fontSize: "1.8rem", fontWeight: "700" },
//   subtitle: {
//     color: "#3A70B0", fontSize: "1rem",
//     marginTop: "10px", marginBottom: "35px",
//   },
//   cardsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "25px",
//   },
//   card: {
//     background: "#fff", borderRadius: "18px", padding: "25px",
//     textAlign: "center", transition: "all 0.3s ease", cursor: "pointer",
//   },
//   cardTitle: { marginTop: "12px", fontSize: "1.1rem", fontWeight: "600" },
//   cardDesc: { fontSize: "0.9rem", opacity: 0.8, marginTop: "5px" },
// };

// export default MainDashboardWeb;






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
  Building2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import collaxionLogo from "../images/collaxionlogo.jpeg";
import laisonAvatar from "../images/Laison.jpeg";

// ─── Backend base + relative-time helper for real-time notifications ──────────
const BASE_API = "http://localhost:5000";
const relativeTime = (date) => {
  if (!date) return "Just now";
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day(s) ago`;
};

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
    message:
      "Hassan Javed's application for Mobile UX Research Study has been approved by internship incharge.",
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
    message:
      "TechNova Pvt. Ltd. has shown no activity for 30+ days. Consider follow-up.",
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
    message:
      "Annual Industry Collaboration Summit 2025 has been successfully created.",
    time: "3 days ago",
    read: true,
    route: "/event-creation",
  },
];

// ─── Notification Panel Component ─────────────────────────────────────────────
const NotificationPanel = ({
  notifications,
  onMarkRead,
  onMarkAll,
  onClear,
  onNavigate,
  onClose,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [activeTab, setActiveTab] = useState("All");

  const filtered = notifications.filter((n) => {
    if (activeTab === "Applications")
      return ["application", "approved", "forwarded"].includes(n.type);
    if (activeTab === "Alerts") return ["deadline", "alert"].includes(n.type);
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
                  background:
                    activeTab === tab
                      ? "rgba(255,255,255,0.25)"
                      : "#F1F5F9",
                }}
              >
                {
                  notifications.filter((n) =>
                    ["application", "approved", "forwarded"].includes(n.type)
                  ).length
                }
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
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.85rem",
                  marginTop: "10px",
                }}
              >
                No notifications
              </p>
            </div>
          ) : (
            filtered.map((n, i) => {
              const IconComp = n.icon;
              return (
                <motion.div
                  key={n.id}
                  style={{
                    ...np.item,
                    background: n.read ? "#fff" : "#F8FAFF",
                  }}
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
                  <div
                    style={{ ...np.iconWrap, background: n.iconBg }}
                  >
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
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
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
  headerTitle: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#0F172A",
  },
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
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast]                 = useState(null);
  const notifRef                          = useRef(null);
  const baselineRef                       = useRef({ ready: false, apps: new Map(), events: new Map(), liaison: new Set() });

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

  // ── Real-time notifications ──
  // Industry-side actions (registrations + MOU activity) are driven by backend
  // /api/liaison-notifications (persisted). Student-app + event entries are still
  // detected client-side via diff polling.
  useEffect(() => {
    let cancelled = false;
    const safeJson = (url) =>
      fetch(url).then((r) => (r.ok ? r.json() : null)).catch(() => null);

    const iconForCategory = (cat) => {
      switch (cat) {
        case "industry-registration":         return { icon: Building2,     iconBg: "#E2EEF9", iconColor: "#193648" };
        case "industry-mou-proposed-changes": return { icon: AlertCircle,   iconBg: "#FEF3C7", iconColor: "#92400E" };
        case "industry-mou-approved":         return { icon: UserCheck,     iconBg: "#D1FAE5", iconColor: "#065F46" };
        case "industry-mou-rejected":         return { icon: AlertCircle,   iconBg: "#FEE2E2", iconColor: "#DC2626" };
        case "industry-mou-mutual":           return { icon: FileSignature, iconBg: "#D1FAE5", iconColor: "#065F46" };
        case "industry-mou-meeting":          return { icon: CalendarPlus,  iconBg: "#EDE9FE", iconColor: "#6D28D9" };
        case "industry-mou-response":         return { icon: Send,          iconBg: "#DBEAFE", iconColor: "#1D4ED8" };
        default:                              return { icon: FileSignature, iconBg: "#E2EEF9", iconColor: "#193648" };
      }
    };

    const poll = async () => {
      const [liaisonRes, appsRes, eventsRes] = await Promise.all([
        safeJson(`${BASE_API}/api/liaison-notifications?limit=80`),
        safeJson(`${BASE_API}/api/liaison/applications`),
        safeJson(`${BASE_API}/api/events`),
      ]);
      if (cancelled) return;

      const liaisonItems = liaisonRes?.items || [];
      const apps         = appsRes?.data || [];
      const events       = Array.isArray(eventsRes) ? eventsRes : (eventsRes?.data || []);

      const baseline = baselineRef.current;
      const fresh    = [];
      const firstRun = !baseline.ready;

      // Backend-driven liaison notifications (industry-side actions)
      const liaisonMapped = liaisonItems.map((n) => {
        const meta = iconForCategory(n.category);
        return {
          id:        `liaison-${n._id}`,
          backendId: n._id,
          type:      n.category || "industry",
          icon:      meta.icon,
          iconBg:    meta.iconBg,
          iconColor: meta.iconColor,
          title:     n.title,
          message:   n.message,
          time:      relativeTime(n.createdAt),
          read:      n.seen,
          route:     n.link || "/maindashboard",
        };
      });

      const newLiaisonIds = liaisonMapped
        .filter((n) => !baseline.liaison.has(n.backendId))
        .map((n) => n.backendId);

      // Student Applications — new entries (client-side diff)
      const appsMap = new Map(apps.map((a) => [String(a._id), a]));
      if (!firstRun) {
        for (const [id, app] of appsMap) {
          if (!baseline.apps.has(id)) {
            const studentName =
              app.studentId?.name ||
              app.studentId?.fullName ||
              (app.studentEmail ? app.studentEmail.split("@")[0] : null) ||
              "A student";
            fresh.push({
              id: `app-${id}-${Date.now()}`,
              type: "application",
              icon: ClipboardList,
              iconBg: "#E2EEF9",
              iconColor: "#193648",
              title: "New Student Application",
              message: `${studentName}'s application has been forwarded for review.`,
              time: relativeTime(app.appliedAt || app.updatedAt),
              read: false,
              route: "/student-applications",
            });
          }
        }
      }
      baseline.apps = appsMap;

      // Events — new entries (client-side diff)
      const eventsMap = new Map(events.map((e) => [String(e._id), e]));
      if (!firstRun) {
        for (const [id, ev] of eventsMap) {
          if (!baseline.events.has(id)) {
            fresh.push({
              id: `event-${id}-${Date.now()}`,
              type: "event",
              icon: Megaphone,
              iconBg: "#E2EEF9",
              iconColor: "#193648",
              title: "New Event Created",
              message: `${ev.title || "A new event"} has been added.`,
              time: relativeTime(ev.createdAt),
              read: false,
              route: "/event-creation",
            });
          }
        }
      }
      baseline.events = eventsMap;

      // Track which backend liaison notifications we've already merged
      liaisonItems.forEach((n) => baseline.liaison.add(n._id));
      baseline.ready = true;

      // Merge: liaison list (source of truth from backend) + locally-detected fresh + previously-shown locals
      setNotifications((prev) => {
        const localOnly = prev.filter((n) => !n.backendId);
        const merged = [...fresh, ...liaisonMapped, ...localOnly];
        const seen = new Set();
        return merged.filter((n) => {
          if (seen.has(n.id)) return false;
          seen.add(n.id);
          return true;
        });
      });

      if (!firstRun) {
        const popable = liaisonMapped.find((n) => newLiaisonIds.includes(n.backendId)) ||
                        fresh[0];
        if (popable) setToast(popable);
      }
    };

    poll();
    const id = setInterval(poll, 5000);
    const onFocus = () => poll();
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const markRead = (id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      const target = prev.find((n) => n.id === id);
      if (target?.backendId) {
        fetch(`${BASE_API}/api/liaison-notifications/${target.backendId}/seen`, {
          method: "PATCH",
        }).catch(() => {});
      }
      return next;
    });
  };
  const markAll  = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    fetch(`${BASE_API}/api/liaison-notifications/mark-all-seen`, {
      method: "PATCH",
    }).catch(() => {});
  };
  const clearAll = () => {
    setNotifications([]);
    fetch(`${BASE_API}/api/liaison-notifications`, { method: "DELETE" }).catch(() => {});
    baselineRef.current.liaison = new Set();
  };

  const toggleSidebar = () => setCollapsed(!collapsed);
  const handleLogout  = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (_) { /* storage may be unavailable */ }
    navigate("/login", { replace: true });
  };

  // ── Card Data (sequence follows the real workflow: onboarding → engagement → analytics → settings) ──
  // Theme-consistent: every card uses the navy #193648 accent. Variety comes from glyphs + tags.
  const ACCENT = "#193648";
  const ACCENT_SOFT = "#3A70B0";
  const cardData = [
    {
      id: 11,
      icon: <Building2 size={36} />,
      title: "Industry Registrations",
      desc: "Review and approve incoming industry registration requests.",
      route: "/industry-registrations",
      tag: "Onboarding",
      gradient: "linear-gradient(135deg, #E2EEF9 0%, #CFE0F0 100%)",
      accent: ACCENT,
      glyph: "🏢",
    },
    {
      id: 1,
      icon: <FileSignature size={36} />,
      title: "MOUs",
      desc: "Track signed and pending Memorandums of Understanding.",
      route: "/mou-management",
      tag: "Agreements",
      gradient: "linear-gradient(135deg, #EAF2FA 0%, #C9DCEE 100%)",
      accent: ACCENT,
      glyph: "📜",
    },
    {
      id: 2,
      icon: <MapPin size={36} />,
      title: "Nearby Industries",
      desc: "View industries near your location on an interactive map.",
      route: "/nearby-industries",
      tag: "Discovery",
      gradient: "linear-gradient(135deg, #E2EEF9 0%, #BFD6EC 100%)",
      accent: ACCENT,
      glyph: "📍",
    },
    {
      id: 7,
      icon: <Briefcase size={36} />,
      title: "Industry Projects",
      desc: "View and manage projects offered by industries.",
      route: "/industry-projects",
      tag: "Opportunities",
      gradient: "linear-gradient(135deg, #ECF3FA 0%, #C6DAEC 100%)",
      accent: ACCENT,
      glyph: "💼",
    },
    {
      id: 10,
      icon: <ClipboardList size={36} />,
      title: "Student Applications",
      desc: "Review, approve, and forward student applications to industry.",
      route: "/student-applications",
      tag: "Pipeline",
      gradient: "linear-gradient(135deg, #E6EFF8 0%, #BCD3E8 100%)",
      accent: ACCENT,
      glyph: "🎓",
    },
    {
      id: 4,
      icon: <CalendarPlus size={36} />,
      title: "Advisory Meetings",
      desc: "Schedule and manage advisory board meetings.",
      route: "/AdvisoryMeetings",
      tag: "Schedule",
      gradient: "linear-gradient(135deg, #E2EEF9 0%, #CCDFEE 100%)",
      accent: ACCENT,
      glyph: "🗓️",
    },
    {
      id: 8,
      icon: <CalendarCog size={36} />,
      title: "Event Creation",
      desc: "Create and manage university–industry collaborative events.",
      route: "/event-creation",
      tag: "Events",
      gradient: "linear-gradient(135deg, #E9F1F9 0%, #C2D7EA 100%)",
      accent: ACCENT,
      glyph: "🎤",
    },
    {
      id: 5,
      icon: <Network size={36} />,
      title: "Industry Activeness",
      desc: "Monitor active partnerships and industry participation.",
      route: "/industry-activeness",
      tag: "Engagement",
      gradient: "linear-gradient(135deg, #E2EEF9 0%, #C9DCEE 100%)",
      accent: ACCENT,
      glyph: "🔗",
    },
    {
      id: 6,
      icon: <BarChart3 size={36} />,
      title: "Ratings & Feedback",
      desc: "View ratings and feedback from both students and industries.",
      route: "/ratings-feedback",
      tag: "Insights",
      gradient: "linear-gradient(135deg, #ECF3FA 0%, #BFD6EC 100%)",
      accent: ACCENT,
      glyph: "⭐",
    },
  ];

  const sidebarWidth = collapsed ? "80px" : "250px";

  return (
    <div style={styles.container}>
      {/* ===== Real-time Toast (top-right) ===== */}
      <AnimatePresence>
        {toast && (() => {
          const ToastIcon = toast.icon || Bell;
          return (
            <motion.div
              initial={{ opacity: 0, x: 30, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              style={styles.toast}
              onClick={() => {
                if (toast.backendId) markRead(toast.id);
                navigate(toast.route || "/maindashboard");
                setToast(null);
              }}
            >
              <div style={{ ...styles.toastIcon, background: toast.iconBg || "#E2EEF9" }}>
                <ToastIcon size={18} color={toast.iconColor || "#193648"} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.toastTitle}>{toast.title}</div>
                <div style={styles.toastMsg}>{toast.message}</div>
              </div>
              <button
                style={styles.toastClose}
                onClick={(e) => { e.stopPropagation(); setToast(null); }}
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ===== Sidebar ===== */}
      <motion.aside
        style={{ ...styles.sidebar, width: sidebarWidth }}
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Decorative ambient glow inside sidebar */}
        <motion.div
          aria-hidden
          style={styles.sidebarGlow}
          animate={{ opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div style={styles.sidebarHeader}>
          <div style={styles.logoContainer}>
            <div style={styles.logoBadge}>
              <img src={collaxionLogo} alt="Logo" style={styles.logoImg} />
            </div>
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
            whileHover={{ background: "rgba(255,255,255,0.12)" }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={18} />
          </motion.button>
        </div>

        <nav style={styles.nav}>
          {[
            ["Industry Registrations", Building2,     "/industry-registrations" ],
            ["Manage MOUs",            FileSignature, "/mou-management"          ],
            ["Nearby Industries",      MapPin,        "/nearby-industries"       ],
            ["Industry Projects",      Briefcase,     "/industry-projects"      ],
            ["Student Applications",   ClipboardList, "/student-applications"   ],
            ["Advisory Meetings",      CalendarPlus,  "/AdvisoryMeetings"       ],
            ["Event Creation",         CalendarCog,   "/event-creation"         ],
            ["Industry Engagement",    Network,       "/industry-activeness"    ],
            ["Ratings & Feedback",     BarChart3,     "/ratings-feedback"       ],
            ["System Settings",        Settings,      "/system-settings"        ],
          ].map(([label, Icon, path], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.35 }}
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              style={{
                ...styles.navItem,
                justifyContent: collapsed ? "center" : "flex-start",
                padding:        collapsed ? "10px 0" : "10px 12px",
              }}
              onClick={() => path && navigate(path)}
            >
              {/* Hover rail */}
              <motion.span
                aria-hidden
                style={styles.navRail}
                variants={{
                  hover: { opacity: 1, scaleY: 1 },
                }}
                initial={{ opacity: 0, scaleY: 0.2 }}
                transition={{ duration: 0.25 }}
              />
              {/* Hover background */}
              <motion.span
                aria-hidden
                style={styles.navBg}
                variants={{
                  hover: { opacity: 1 },
                }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
              <span style={styles.navIconWrap}><Icon size={18} style={styles.icon} /></span>
              {!collapsed && <span style={styles.navLabel}>{label}</span>}
            </motion.div>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          {!collapsed && (
            <motion.div
              style={styles.sidebarProfile}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <img src={laisonAvatar} alt="Profile" style={styles.sidebarProfileImg} />
              <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <span style={styles.sidebarProfileName}>Ms. Tazzaina</span>
                <span style={styles.sidebarProfileRole}>Liaison Incharge</span>
              </div>
              <span style={styles.statusDot} />
            </motion.div>
          )}
          <motion.div
            whileHover={{ scale: 1.04, color: "#fff" }}
            whileTap={{ scale: 0.97 }}
            style={{
              ...styles.logout,
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            onClick={handleLogout}
          >
            <LogOut size={16} style={styles.icon} />
            {!collapsed && <span>Logout</span>}
          </motion.div>
        </div>
      </motion.aside>

      {/* ===== Main Area ===== */}
      <main style={styles.main}>
        {/* Ambient decorative blobs (purely visual) */}
        <motion.div
          aria-hidden
          style={{ ...styles.ambientBlob, ...styles.ambientBlobA }}
          animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          style={{ ...styles.ambientBlob, ...styles.ambientBlobB }}
          animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          style={{ ...styles.ambientBlob, ...styles.ambientBlobC }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          style={styles.topbar}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={styles.titleWrap}>
            <motion.div
              style={styles.titleAccent}
              initial={{ height: 0 }}
              animate={{ height: 36 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            />
            <div>
              <motion.span
                style={styles.eyebrow}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Sparkles size={12} /> Industry Liaison Incharge
              </motion.span>
              <h1 style={styles.title}>Industry Collaboration Hub</h1>
            </div>
          </div>

          <div style={styles.topRight}>
            {/* ── Bell ── */}
            <div ref={notifRef} style={styles.bellWrap}>
              <motion.button
                style={styles.bellBtn}
                whileTap={{ scale: 0.9 }}
                whileHover={{ background: "#E2EEF9" }}
                onClick={() => setShowNotifs((v) => !v)}
              >
                <Bell
                  size={20}
                  color={showNotifs ? "#3A70B0" : "#193648"}
                />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      style={styles.badge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
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
            <motion.div
              style={styles.userBox}
              whileHover={{ y: -1, boxShadow: "0 12px 28px rgba(25,54,72,0.18)" }}
              transition={{ duration: 0.25 }}
            >
              <div style={styles.avatarRing}>
                <img src={laisonAvatar} alt="Ms. Tazzaina" style={styles.avatarImg} />
                <span style={styles.avatarStatus} />
              </div>
              <div style={styles.userTextWrap}>
                <span style={styles.username}>
                  Ms. Tazzaina
                  <motion.span
                    style={styles.wavingHand}
                    animate={{ rotate: [0, 15, -10, 15, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    👋
                  </motion.span>
                </span>
                <span style={styles.userRole}>Industry Liaison Incharge</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          style={styles.subtitle}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          Monitor and manage all collaboration activities between Universities
          &amp; Industries
        </motion.p>

        {/* 3 × 3 grid — perfect for 9 modules, scales down gracefully on smaller screens */}
        <style>{`
          .cx-cards-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
            position: relative;
            z-index: 1;
          }
          @media (min-width: 720px)  { .cx-cards-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
          @media (min-width: 1080px) { .cx-cards-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        `}</style>

        {/* Dashboard Cards */}
        <motion.section
          className="cx-cards-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden:   { opacity: 0 },
            visible:  { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.5 } },
          }}
        >
          {cardData.map((card) => {
            const isHovered = hoveredCard === card.id;
            const isActive  = activeCard  === card.id;
            return (
              <motion.div
                key={card.id}
                variants={{
                  hidden:  { opacity: 0, y: 24, scale: 0.96 },
                  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: "spring", stiffness: 220, damping: 22 } },
                }}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => {
                  setActiveCard(card.id);
                  if (card.route) navigate(card.route);
                }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.25 }}
                style={{
                  ...styles.card,
                  color: isActive ? "#fff" : "#193648",
                  boxShadow: isActive
                    ? `0 22px 48px ${card.accent}66, 0 0 0 1px ${card.accent}40 inset`
                    : isHovered
                    ? `0 22px 44px ${card.accent}38, 0 2px 0 #fff inset`
                    : "0 8px 24px rgba(25,54,72,0.10), 0 1px 0 rgba(255,255,255,0.6) inset",
                  borderColor: isActive ? card.accent : isHovered ? `${card.accent}55` : "#E2EEF9",
                  background: isActive
                    ? `linear-gradient(160deg, ${card.accent} 0%, ${card.accent}cc 100%)`
                    : "#fff",
                }}
              >
                {/* Soft module-themed background sheen */}
                <div
                  aria-hidden
                  style={{
                    ...styles.cardThemeWash,
                    background: card.gradient,
                    opacity: isActive ? 0 : isHovered ? 0.85 : 0.6,
                  }}
                />

                {/* Top-right radial highlight */}
                <div
                  aria-hidden
                  style={{
                    ...styles.cardHighlight,
                    opacity: isActive ? 0.35 : isHovered ? 0.7 : 0.45,
                  }}
                />

                {/* Big watermark glyph in the corner */}
                <motion.span
                  aria-hidden
                  style={{
                    ...styles.cardGlyph,
                    color: isActive ? "rgba(255,255,255,0.22)" : `${card.accent}33`,
                  }}
                  animate={
                    isHovered
                      ? { rotate: [0, 6, -3, 0], scale: 1.08 }
                      : { rotate: 0, scale: 1 }
                  }
                  transition={{
                    duration: 1.6,
                    repeat: isHovered ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  {card.glyph}
                </motion.span>

                {/* Top accent gradient bar */}
                <motion.div
                  style={{
                    ...styles.cardAccent,
                    background: isActive
                      ? "linear-gradient(90deg, #fff, rgba(255,255,255,0.35))"
                      : `linear-gradient(90deg, ${card.accent}, #3A70B0)`,
                  }}
                  initial={{ scaleX: 0.2 }}
                  animate={{ scaleX: isHovered || isActive ? 1 : 0.5 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />

                {/* Tag chip — solid for punch */}
                <span
                  style={{
                    ...styles.cardTag,
                    background: isActive
                      ? "rgba(255,255,255,0.22)"
                      : card.accent,
                    color: "#fff",
                    borderColor: isActive
                      ? "rgba(255,255,255,0.32)"
                      : card.accent,
                    boxShadow: isActive
                      ? "none"
                      : `0 4px 10px ${card.accent}35`,
                  }}
                >
                  {card.tag}
                </span>

                {/* Icon halo — solid navy gradient with white icon */}
                <motion.div
                  style={{
                    ...styles.iconHalo,
                    background: isActive
                      ? "rgba(255,255,255,0.22)"
                      : `linear-gradient(135deg, ${card.accent} 0%, #3A70B0 100%)`,
                    color: "#fff",
                    boxShadow: isActive
                      ? "0 0 0 1px rgba(255,255,255,0.25) inset"
                      : `0 12px 24px ${card.accent}55, 0 0 0 1px ${card.accent}30`,
                  }}
                  animate={
                    isHovered
                      ? { y: [0, -5, 0] }
                      : { y: 0 }
                  }
                  transition={{
                    duration: 2.4,
                    repeat: isHovered ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  {card.icon}
                </motion.div>

                <h3 style={styles.cardTitle}>{card.title}</h3>
                <p style={{
                  ...styles.cardDesc,
                  color: isActive ? "rgba(255,255,255,0.82)" : "#5b7184",
                }}>{card.desc}</p>

                {/* Hover arrow chip */}
                <motion.div
                  style={{
                    ...styles.cardArrow,
                    background: isActive ? "rgba(255,255,255,0.22)" : `${card.accent}18`,
                    color:      isActive ? "#fff" : card.accent,
                  }}
                  initial={false}
                  animate={{
                    opacity: isHovered || isActive ? 1 : 0,
                    x:       isHovered || isActive ? 0 : 8,
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <ArrowUpRight size={14} />
                </motion.div>
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
    display: "flex",
    height: "100vh",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #E2EEF9 0%, #FFFFFF 100%)",
  },
  sidebar: {
    background:
      "linear-gradient(180deg, #0F2A38 0%, #193648 45%, #1F4159 100%)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px 14px",
    boxShadow: "4px 0 30px rgba(15,42,56,0.35)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  sidebarGlow: {
    position: "absolute",
    top: -120,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(226,238,249,0.25) 0%, rgba(226,238,249,0) 70%)",
    filter: "blur(20px)",
    pointerEvents: "none",
    zIndex: 0,
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    position: "relative",
    zIndex: 1,
  },
  logoContainer: { display: "flex", alignItems: "center", gap: "10px" },
  logoBadge: {
    width: 42, height: 42,
    borderRadius: 12,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.18)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 6px 16px rgba(15,42,56,0.4)",
    flexShrink: 0,
  },
  logoImg:   { width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" },
  logoText:  { fontSize: "1.45rem", fontWeight: "800", color: "#fff", margin: 0, letterSpacing: "-0.01em" },
  logoC:     { color: "#fff", fontSize: "1.6rem" },
  logoX:     { color: "#E2EEF9" },
  toggleBtn: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 10,
    width: 32, height: 32,
    color: "#fff",
    cursor: "pointer",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s ease",
  },
  nav:     { display: "flex", flexDirection: "column", gap: "6px", position: "relative", zIndex: 1 },
  navItem: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.92rem",
    color: "#d8e4f5",
    borderRadius: "12px",
    transition: "color 0.25s ease",
    overflow: "hidden",
  },
  navRail: {
    position: "absolute",
    left: 0,
    top: "18%",
    bottom: "18%",
    width: 3,
    borderRadius: 4,
    background: "linear-gradient(180deg, #E2EEF9, #AAC3FC)",
    boxShadow: "0 0 14px rgba(226,238,249,0.45)",
    transformOrigin: "center",
  },
  navBg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(90deg, rgba(226,238,249,0.14), rgba(226,238,249,0))",
    borderRadius: 12,
  },
  navIconWrap: {
    position: "relative",
    zIndex: 1,
    display: "inline-flex",
    width: 26,
    justifyContent: "center",
  },
  navLabel: { position: "relative", zIndex: 1 },
  icon: { color: "#AAC3FC" },
  sidebarFooter: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    paddingTop: 10,
    position: "relative",
    zIndex: 1,
  },
  sidebarProfile: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(6px)",
  },
  sidebarProfileImg: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid rgba(255,255,255,0.25)",
    flexShrink: 0,
  },
  sidebarProfileName: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#fff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  sidebarProfileRole: {
    fontSize: "0.68rem",
    color: "#AAC3FC",
    fontWeight: 500,
  },
  statusDot: {
    width: 9, height: 9, borderRadius: "50%",
    background: "#22C55E",
    boxShadow: "0 0 0 3px rgba(34,197,94,0.25)",
    marginLeft: "auto",
    flexShrink: 0,
  },
  logout: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#AAC3FC",
    fontWeight: "500",
    cursor: "pointer",
    borderTop: "1px solid rgba(255,255,255,0.15)",
    paddingTop: "13px",
    transition: "color 0.2s",
  },
  main: {
    flex: 1,
    padding: "30px 50px",
    overflowY: "auto",
    position: "relative",
    overflowX: "hidden",
  },
  ambientBlob: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(70px)",
    opacity: 0.55,
    pointerEvents: "none",
    zIndex: 0,
  },
  ambientBlobA: {
    width: 320, height: 320,
    top: -120, right: -60,
    background: "radial-gradient(circle, #CFE0F0 0%, rgba(207,224,240,0) 70%)",
  },
  ambientBlobB: {
    width: 360, height: 360,
    bottom: -140, left: 60,
    background: "radial-gradient(circle, #E2EEF9 0%, rgba(226,238,249,0) 70%)",
    opacity: 0.7,
  },
  ambientBlobC: {
    width: 220, height: 220,
    top: 220, left: "45%",
    background: "radial-gradient(circle, rgba(58,112,176,0.18) 0%, rgba(58,112,176,0) 70%)",
    opacity: 0.5,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    zIndex: 50,
  },
  titleWrap: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  titleAccent: {
    width: 4,
    borderRadius: 4,
    background: "linear-gradient(180deg, #193648, #3A70B0)",
    boxShadow: "0 4px 12px rgba(25,54,72,0.2)",
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#3A70B0",
    background: "rgba(58,112,176,0.10)",
    padding: "4px 10px",
    borderRadius: 999,
    marginBottom: 8,
  },
  topRight:    { display: "flex", alignItems: "center", gap: "14px" },
  toast: {
    position: "fixed",
    top: 24,
    right: 24,
    zIndex: 2000,
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    width: 360,
    maxWidth: "calc(100vw - 32px)",
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 18px 50px rgba(15,23,42,0.18), 0 0 0 1px rgba(15,23,42,0.06)",
    padding: "14px 14px 14px 14px",
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    borderLeft: "4px solid #3A70B0",
  },
  toastIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  toastTitle: {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#0F172A",
    marginBottom: 3,
  },
  toastMsg: {
    fontSize: "0.78rem",
    color: "#475569",
    lineHeight: 1.45,
  },
  toastClose: {
    background: "#F8FAFC",
    border: "none",
    color: "#64748B",
    borderRadius: 8,
    padding: 5,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bellWrap:    { position: "relative" },
  bellBtn: {
    position: "relative",
    background: "#fff",
    border: "1.5px solid #E2EEF9",
    borderRadius: "12px",
    padding: "8px 10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 14px rgba(25,54,72,0.08)",
    transition: "background 0.2s",
  },
  badge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    background: "#EF4444",
    color: "#fff",
    fontSize: "0.65rem",
    fontWeight: "800",
    minWidth: "18px",
    height: "18px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
    border: "2px solid #fff",
    boxShadow: "0 2px 6px rgba(239,68,68,0.5)",
  },
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "6px 14px 6px 6px",
    background: "linear-gradient(135deg, #FFFFFF 0%, #F5F9FD 100%)",
    border: "1.5px solid #E2EEF9",
    borderRadius: 999,
    boxShadow: "0 6px 20px rgba(25,54,72,0.08)",
    cursor: "pointer",
    transition: "box-shadow 0.25s ease, transform 0.25s ease",
    minWidth: 240,
  },
  userTextWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.15,
    gap: 3,
  },
  username: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontWeight: 800,
    color: "#193648",
    fontSize: "0.98rem",
    whiteSpace: "nowrap",
    letterSpacing: "-0.005em",
  },
  userRole: {
    fontSize: "0.7rem",
    color: "#7d8fa3",
    fontWeight: 600,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  },
  wavingHand: { fontSize: "0.95rem", display: "inline-block" },
  avatarRing: {
    position: "relative",
    width: 44,
    height: 44,
    borderRadius: "50%",
    padding: 2,
    background: "linear-gradient(135deg, #193648 0%, #3A70B0 100%)",
    flexShrink: 0,
    boxShadow: "0 6px 14px rgba(25,54,72,0.25)",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #fff",
    display: "block",
  },
  avatarStatus: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#22C55E",
    border: "2px solid #fff",
  },
  title:       { color: "#193648", fontSize: "1.85rem", fontWeight: "800", margin: 0, letterSpacing: "-0.01em" },
  subtitle: {
    color: "#3A70B0",
    fontSize: "1rem",
    marginTop: "10px",
    marginBottom: "26px",
    position: "relative",
    zIndex: 1,
  },
  sectionHead: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
    position: "relative",
    zIndex: 1,
  },
  sectionHeadLeft: { display: "flex", alignItems: "center", gap: 10 },
  sectionDot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "linear-gradient(135deg, #193648, #3A70B0)",
    boxShadow: "0 0 0 4px rgba(25,54,72,0.10)",
  },
  sectionTitle: {
    fontSize: "0.78rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#193648",
  },
  sectionRule: {
    flex: 1,
    height: 1,
    background: "linear-gradient(90deg, rgba(25,54,72,0.18), rgba(25,54,72,0))",
  },
  card: {
    position: "relative",
    background: "#fff",
    borderRadius: "22px",
    padding: "28px 26px 26px",
    border: "1px solid #EAF1F8",
    transition: "background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
    cursor: "pointer",
    overflow: "hidden",
    minHeight: 230,
    display: "flex",
    flexDirection: "column",
  },
  cardAccent: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 5,
    transformOrigin: "left center",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    zIndex: 2,
  },
  cardThemeWash: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    transition: "opacity 0.35s ease",
    mixBlendMode: "multiply",
  },
  cardHighlight: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
    pointerEvents: "none",
    transition: "opacity 0.35s ease",
  },
  cardGlyph: {
    position: "absolute",
    right: -10,
    bottom: -24,
    fontSize: 150,
    lineHeight: 1,
    pointerEvents: "none",
    transformOrigin: "center",
    filter: "saturate(1.15)",
  },
  cardTag: {
    position: "relative",
    zIndex: 1,
    alignSelf: "flex-start",
    display: "inline-flex",
    alignItems: "center",
    fontSize: "0.65rem",
    fontWeight: 800,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "5px 11px",
    borderRadius: 999,
    border: "1px solid",
    marginBottom: 16,
    width: "fit-content",
    transition: "background 0.25s ease, box-shadow 0.25s ease",
  },
  cardSweep: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 100% 0%, rgba(58,112,176,0.10) 0%, rgba(58,112,176,0) 55%)",
    pointerEvents: "none",
  },
  iconHalo: {
    position: "relative",
    zIndex: 1,
    width: 64,
    height: 64,
    borderRadius: 18,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    transition: "background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease",
  },
  cardTitle: {
    position: "relative",
    zIndex: 1,
    marginTop: "10px",
    fontSize: "1.18rem",
    fontWeight: 800,
    letterSpacing: "-0.01em",
  },
  cardDesc: {
    position: "relative",
    zIndex: 1,
    fontSize: "0.92rem",
    marginTop: "6px",
    lineHeight: 1.55,
  },
  cardArrow: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 30,
    height: 30,
    borderRadius: 10,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.25s ease",
  },
};

export default MainDashboardWeb;