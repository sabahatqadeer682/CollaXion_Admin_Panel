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
//   main: { padding: "30px 50px" },
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
  Camera, RefreshCw, ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Mail,
} from "lucide-react";
import LiaisonFooter from "../components/LiaisonFooter";
import LiaisonNavbar from "../components/LiaisonNavbar";
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
  const [profile, setProfile]             = useState({
    name: "Ms. Tazzaina",
    email: "tazzaina@riphah.edu.pk",
    role: "Industry Liaison Incharge",
    dp: "",
  });
  const [profileOpen, setProfileOpen]     = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [now, setNow]                     = useState(new Date());
  const [counts, setCounts]               = useState({
    mous: 0, applications: 0, industries: 0, meetings: 0, events: 0,
  });
  const [mouRecords, setMouRecords]        = useState([]);
  const notifRef                          = useRef(null);
  const profileRef                        = useRef(null);
  const dpInputRef                        = useRef(null);
  const baselineRef                       = useRef({ ready: false, apps: new Map(), events: new Map(), liaison: new Set() });

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  // Click outside profile
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Backend-backed profile
  useEffect(() => { fetchProfile(); }, []);

  // Fetch real dashboard counts (MOUs / Applications / Industries / Meetings)
  useEffect(() => {
    let cancelled = false;
    const safeJson = (url) =>
      fetch(url).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    const lenOf = (x) =>
      Array.isArray(x)                     ? x.length
      : Array.isArray(x?.data)             ? x.data.length
      : Array.isArray(x?.items)            ? x.items.length
      : Array.isArray(x?.registrations)    ? x.registrations.length
      : Array.isArray(x?.results)          ? x.results.length
      : 0;
    const tick = async () => {
      const [mous, apps, inds, mtgs, evts] = await Promise.all([
        safeJson(`${BASE_API}/api/mous`),
        safeJson(`${BASE_API}/api/liaison/applications`),
        safeJson(`${BASE_API}/api/industry-registrations`),
        safeJson(`${BASE_API}/api/meeting-minutes`),
        safeJson(`${BASE_API}/api/events`),
      ]);
      if (cancelled) return;
      setCounts({
        mous:         lenOf(mous),
        applications: lenOf(apps),
        industries:   lenOf(inds),
        meetings:     lenOf(mtgs),
        events:       lenOf(evts),
      });
      const mouArr = Array.isArray(mous) ? mous
                   : Array.isArray(mous?.data)         ? mous.data
                   : Array.isArray(mous?.items)        ? mous.items
                   : Array.isArray(mous?.results)      ? mous.results
                   : [];
      setMouRecords(mouArr);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);
  const fetchProfile = async () => {
    try {
      const r = await fetch(`${BASE_API}/api/liaison/profile`);
      if (!r.ok) return;
      const data = await r.json();
      if (data && typeof data === "object") {
        setProfile((prev) => ({
          ...prev,
          ...(data.name  ? { name:  data.name }  : {}),
          ...(data.email ? { email: data.email } : {}),
          ...(data.role  ? { role:  data.role }  : {}),
          ...(data.dp    ? { dp:    data.dp }    : {}),
        }));
      }
    } catch { /* silent */ }
  };
  const saveProfile = async (patch) => {
    setProfileSaving(true);
    try {
      const r = await fetch(`${BASE_API}/api/liaison/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!r.ok) return null;
      const saved = await r.json();
      setProfile((prev) => ({ ...prev, ...saved }));
      return saved;
    } catch { return null; }
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

      // Student Applications - new entries (client-side diff)
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

      // Events - new entries (client-side diff)
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
    navigate("/role-select", { replace: true });
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
    <div style={{
      display: "block",
      width: "100%", maxWidth: "100%",
      minHeight: "100vh", height: "auto",
      overflow: "visible",
      fontFamily: "'Poppins', sans-serif",
      background: "linear-gradient(135deg, #E2EEF9 0%, #FFFFFF 100%)",
      boxSizing: "border-box",
    }}>
      <style>{`
        @keyframes liaisonKenBurns {
          0%   { transform: scale(1.08) translate3d(0, 0, 0); }
          50%  { transform: scale(1.18) translate3d(-1.5%, -1%, 0); }
          100% { transform: scale(1.08) translate3d(0, 0, 0); }
        }
        @keyframes liaisonShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes liaisonPing {
          0%   { transform: scale(0.6); opacity: 0.85; }
          80%  { transform: scale(2);   opacity: 0; }
          100% { transform: scale(2);   opacity: 0; }
        }
        @keyframes liaisonGradientFlow {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        /* Crossfading slideshow — each layer cycles 0→visible→0 across the full duration */
        @keyframes liaisonSlideshow {
          0%   { opacity: 0; }
          6%   { opacity: 1; }
          25%  { opacity: 1; }
          31%  { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* ===== TOP NAVBAR ===== */}
      <LiaisonNavbar />
      {false && (
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "linear-gradient(135deg, rgba(15,42,56,0.92) 0%, rgba(25,54,72,0.92) 50%, rgba(31,65,89,0.92) 100%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: "0 8px 28px rgba(15,42,56,0.28)",
        width: "100%", maxWidth: "100%",
        display: "flex", alignItems: "center", gap: 14,
        padding: "10px 24px",
        flexWrap: "wrap",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxSizing: "border-box",
      }}>
        <span aria-hidden style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: 2,
          background: "linear-gradient(90deg, transparent 0%, rgba(122,169,214,0.6) 30%, rgba(170,195,252,0.7) 50%, rgba(122,169,214,0.6) 70%, transparent 100%)",
          opacity: 0.7, pointerEvents: "none",
        }} />

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
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

        {/* Tabs - top nav screens (all 9 modules) */}
        <div style={{ display: "flex", gap: 3, alignItems: "center", flex: "1 1 auto", minWidth: 0, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Industries",    Icon: Building2,     path: "/industry-registrations" },
            { label: "MOUs",          Icon: FileSignature, path: "/mou-management" },
            { label: "Nearby",        Icon: MapPin,        path: "/nearby-industries" },
            { label: "Projects",      Icon: Briefcase,     path: "/industry-projects" },
            { label: "Applications",  Icon: ClipboardList, path: "/student-applications" },
            { label: "Meetings",      Icon: CalendarPlus,  path: "/AdvisoryMeetings" },
            { label: "Events",        Icon: CalendarCog,   path: "/event-creation" },
            { label: "Engagement",    Icon: Network,       path: "/industry-activeness" },
            { label: "Feedback",      Icon: BarChart3,     path: "/ratings-feedback" },
          ].map((it) => (
            <button
              key={it.path}
              title={it.label}
              onClick={() => navigate(it.path)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 10px", borderRadius: 10,
                background: "transparent",
                border: "1px solid transparent",
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
          {/* Settings shortcut */}
          <button onClick={() => navigate("/system-settings")} title="System Settings" style={{
            width: 38, height: 38, borderRadius: 10,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "#fff", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.18s ease, transform 0.4s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.16)"; e.currentTarget.style.transform = "rotate(90deg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = ""; }}
          >
            <Settings size={16} />
          </button>

          {/* Bell */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <button onClick={() => setShowNotifs((s) => !s)} title="Notifications" style={{
              position: "relative",
              width: 38, height: 38, borderRadius: 10,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#fff", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: -3, right: -3,
                  background: "#ef4444", color: "#fff",
                  fontSize: 9, minWidth: 16, height: 16, padding: "0 4px",
                  borderRadius: 999,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, border: "2px solid #193648",
                }}>{Math.min(99, unreadCount)}</span>
              )}
            </button>
          </div>

          {/* Profile pill */}
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
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
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
                      <span aria-hidden className="liaisonDpHover" style={{
                        position: "absolute", inset: 2, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(15,42,56,0.55)", color: "#fff",
                        opacity: 0, transition: "opacity 0.18s ease", pointerEvents: "none",
                      }}>
                        <Camera size={14} />
                      </span>
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
                    <style>{`
                      button[title="Click to change photo"]:hover .liaisonDpHover { opacity: 1; }
                    `}</style>
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
      )}

      {/* ===== CINEMATIC HERO BANNER ===== */}
      {(() => {
        const hour = now.getHours();
        const greeting = hour < 5 ? "Good night" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : hour < 21 ? "Good evening" : "Good night";
        const titles = /^(prof\.?|dr\.?|mr\.?|mrs\.?|ms\.?|miss|engr\.?|eng\.?|sir|madam)$/i;
        const allParts = (profile.name || "").trim().split(/\s+/).filter(Boolean);
        const titlePart = allParts.find(p => titles.test(p)) || "";
        const namePart  = allParts.find(p => !titles.test(p)) || "";
        const firstName = (titlePart ? `${titlePart} ${namePart}` : namePart).trim() || profile.name || "there";

        return (
          <div style={{
            position: "relative",
            margin: 0,
            height: "100vh",
            minHeight: 600,
            color: "#fff",
            overflow: "hidden",
            isolation: "isolate",
            contain: "layout paint",
            transform: "translateZ(0)",
          }}>
            {/* Animated slideshow — 4 industry/collaboration images crossfade with Ken-Burns zoom */}
            {[
              "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2400&q=85", // boardroom / partnership
              "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2400&q=85", // students / collaboration
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=85", // team meeting
              "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85", // modern workspace
            ].map((src, i) => (
              <div
                key={src}
                aria-hidden
                style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover", backgroundPosition: "center",
                  filter: "saturate(0.85) contrast(1.05) hue-rotate(-8deg)",
                  animation: `liaisonSlideshow 28s ease-in-out ${i * 7}s infinite, liaisonKenBurns 24s ease-in-out ${i * 7}s infinite`,
                  opacity: 0,
                  zIndex: 0,
                  willChange: "opacity, transform",
                }}
              />
            ))}
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, rgba(15,42,56,0.95) 0%, rgba(25,54,72,0.88) 35%, rgba(44,95,128,0.72) 70%, rgba(15,42,56,0.85) 100%)",
              zIndex: 1,
            }} />
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(70% 90% at 20% 50%, rgba(15,42,56,0.75) 0%, rgba(15,42,56,0) 70%)",
              zIndex: 1,
            }} />
            <div aria-hidden style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg, rgba(15,42,56,0.45) 0%, rgba(15,42,56,0) 25%, rgba(15,42,56,0) 60%, rgba(15,42,56,0.65) 100%)",
              zIndex: 1,
            }} />
            <div aria-hidden style={{
              position: "absolute", top: "12%", right: "8%",
              width: 220, height: 220, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(122,169,214,0.35) 0%, rgba(122,169,214,0) 70%)",
              filter: "blur(30px)", zIndex: 1,
              animation: "liaisonKenBurns 18s ease-in-out infinite reverse",
            }} />
            <div aria-hidden style={{
              position: "absolute", bottom: "-10%", left: "30%",
              width: 280, height: 280, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(58,112,176,0.32) 0%, rgba(58,112,176,0) 70%)",
              filter: "blur(40px)", zIndex: 1,
            }} />
            <div aria-hidden style={{
              position: "absolute", top: 0, bottom: 0, left: 0, width: "30%",
              background: "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)",
              animation: "liaisonShimmer 7s linear infinite",
              zIndex: 2, pointerEvents: "none",
            }} />

            <div style={{
              position: "relative", zIndex: 3,
              height: "100%",
              padding: "32px 48px 28px",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.22)",
                    backdropFilter: "blur(10px)", padding: "6px 14px", borderRadius: 999,
                    fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#E2EEF9",
                  }}
                >
                  <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
                    <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#22C55E", animation: "liaisonPing 1.6s cubic-bezier(0,0,0.2,1) infinite" }} />
                    <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} />
                  </span>
                  Liaison Operations · Live
                </motion.div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(10px)", padding: "8px 14px", borderRadius: 12,
                }}>
                  <Clock size={14} style={{ color: "#AAC3FC" }} />
                  <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                    <span style={{ fontSize: 14, fontWeight: 800 }}>{now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                    <span style={{ fontSize: 9.5, color: "rgba(226,238,249,0.7)", letterSpacing: "0.10em", textTransform: "uppercase", marginTop: 2 }}>
                      {now.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 760, marginTop: -140 }}>
                <motion.h1
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    margin: 0, fontSize: 44, fontWeight: 900, lineHeight: 1.12,
                    letterSpacing: "-0.025em",
                    fontFamily: "'Sora', 'Inter', sans-serif",
                    textShadow: "0 4px 20px rgba(0,0,0,0.35)",
                  }}
                >
                  Hello, {firstName}.
                  <br />
                  <span style={{
                    background: "linear-gradient(90deg, #E2EEF9 0%, #AAC3FC 25%, #7AA9D6 50%, #3A70B0 75%, #AAC3FC 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "liaisonGradientFlow 6s linear infinite",
                    display: "inline-block",
                    marginTop: 6,
                  }}>
                    Where Collaboration Meets Innovation.
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.7 }}
                  style={{ marginTop: 18, marginBottom: 0, fontSize: 14, color: "rgba(226,238,249,0.85)", lineHeight: 1.6, maxWidth: 600, textShadow: "0 2px 10px rgba(0,0,0,0.25)" }}
                >
                  Curate industry partnerships, sign MOUs, forward applications, and orchestrate every collaboration - all from one elegant workspace.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}
                >
                  <button onClick={() => navigate("/mou-management")} style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#fff", color: "#193648",
                    border: "none", borderRadius: 6, padding: "12px 22px",
                    fontWeight: 800, fontSize: 13.5, cursor: "pointer",
                    boxShadow: "0 14px 30px rgba(0,0,0,0.30)",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 18px 36px rgba(0,0,0,0.36)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.30)"; }}
                  >
                    <FileSignature size={14} /> Manage MOUs <ArrowRight size={13} />
                  </button>
                  <button onClick={() => navigate("/student-applications")} style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(255,255,255,0.10)", color: "#fff",
                    border: "1px solid rgba(255,255,255,0.30)",
                    borderRadius: 6, padding: "12px 22px",
                    fontWeight: 700, fontSize: 13.5, cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    transition: "background 0.18s ease",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
                  >
                    <ClipboardList size={14} /> Review Applications
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.7 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))",
                    gap: 14, marginTop: 48, maxWidth: 920,
                  }}
                >
                  {[
                    { Icon: FileSignature, label: "MOUs",         value: counts.mous,         sub: "signed & in-progress",    accent: "#AAC3FC" },
                    { Icon: ClipboardList, label: "Applications", value: counts.applications, sub: "students in pipeline",    accent: "#7AA9D6" },
                    { Icon: Building2,     label: "Company Registration Requests", value: counts.industries, sub: "pending review", accent: "#86efac" },
                    { Icon: CalendarPlus,  label: "Meetings",     value: counts.meetings,     sub: "advisory meetings",       accent: "#fcd34d" },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -3 }}
                      style={{
                        position: "relative",
                        padding: "14px 16px", borderRadius: 14,
                        background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        backdropFilter: "blur(14px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.10)",
                        overflow: "hidden",
                      }}
                    >
                      <span aria-hidden style={{
                        position: "absolute", top: -30, right: -30,
                        width: 90, height: 90, borderRadius: "50%",
                        background: `radial-gradient(circle, ${s.accent}40 0%, ${s.accent}00 70%)`,
                        filter: "blur(8px)", pointerEvents: "none",
                      }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <span style={{
                          width: 32, height: 32, borderRadius: 10,
                          background: `linear-gradient(135deg, ${s.accent}33, ${s.accent}11)`,
                          border: `1px solid ${s.accent}55`,
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          color: s.accent,
                          boxShadow: `0 0 14px ${s.accent}33`,
                        }}>
                          <s.Icon size={15} />
                        </span>
                        <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(226,238,249,0.7)" }}>{s.label}</span>
                      </div>
                      <div style={{
                        fontSize: 32, fontWeight: 900, color: "#fff",
                        fontFamily: "'Sora', 'Inter', sans-serif",
                        fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em",
                        lineHeight: 1, marginBottom: 6,
                      }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: "rgba(226,238,249,0.72)", fontWeight: 600 }}>{s.sub}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        );
      })()}

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

      {/* Legacy sidebar removed — navbar replaces it */}
      {false && (
      <motion.aside
        style={{ ...styles.sidebar, width: 0, display: "none", pointerEvents: "none" }}
      >
        <motion.div
          aria-hidden
          style={styles.sidebarGlow}
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
      )}

      {/* ===== Main Area ===== */}
      <main style={styles.main}>
        {/* Ambient decorative blobs (purely visual) */}
        <div
          aria-hidden
          style={{ ...styles.ambientBlob, ...styles.ambientBlobA }}
        />
        <div aria-hidden style={{ ...styles.ambientBlob, ...styles.ambientBlobB }} />
        <div aria-hidden style={{ ...styles.ambientBlob, ...styles.ambientBlobC }} />


        {/* ─── About The University ────────────────────────────────────── */}
        <style>{`
          @keyframes cxKenBurns {
            0%   { transform: scale(1.05) translate(0, 0); }
            50%  { transform: scale(1.12) translate(-12px, -8px); }
            100% { transform: scale(1.05) translate(0, 0); }
          }
          @keyframes cxShimmer {
            0%   { background-position: -200% 0; }
            100% { background-position:  200% 0; }
          }
          .cx-uni-grid {
            display: grid; grid-template-columns: 1fr; gap: 18px;
            position: relative; z-index: 1;
          }
          @media (min-width: 900px)  { .cx-uni-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
          .cx-uni-card {
            position: relative; overflow: hidden;
            background: #fff; border: 1px solid #E2EEF9; border-radius: 18px;
            box-shadow: 0 12px 30px rgba(25,54,72,0.08);
            transition: transform 0.35s ease, box-shadow 0.35s ease;
          }
          .cx-uni-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 22px 44px rgba(25,54,72,0.18);
          }
          .cx-uni-img {
            position: relative; width: 100%; height: 168px; overflow: hidden;
          }
          .cx-uni-img img {
            width: 100%; height: 100%; object-fit: cover;
            animation: cxKenBurns 14s ease-in-out infinite;
          }
          .cx-uni-img::after {
            content: ""; position: absolute; inset: 0;
            background: linear-gradient(180deg, rgba(25,54,72,0.0) 40%, rgba(25,54,72,0.55) 100%);
          }
          .cx-uni-tag {
            position: absolute; bottom: 12px; left: 12px; z-index: 2;
            display: inline-flex; align-items: center; gap: 6px;
            padding: 5px 11px; border-radius: 999px;
            font-size: 10px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
            color: #fff; background: rgba(25,54,72,0.55);
            border: 1px solid rgba(255,255,255,0.30);
            backdrop-filter: blur(8px);
          }
          .cx-uni-readmore {
            display: inline-flex; align-items: center; gap: 6px;
            margin-top: 12px; padding: 7px 12px; border-radius: 999px;
            background: linear-gradient(90deg, #193648, #3A70B0);
            background-size: 220% 100%;
            color: #fff; font-size: 11.5px; font-weight: 800; letter-spacing: 0.04em;
            border: none; cursor: pointer; font-family: 'Poppins', sans-serif;
            box-shadow: 0 8px 18px rgba(25,54,72,0.28);
            transition: background-position 0.4s ease;
          }
          .cx-uni-readmore:hover { background-position: 100% 0; }
          .cx-uni-list-item {
            display: flex; align-items: center; gap: 10px;
            padding: 9px 12px; border-radius: 10px;
            color: #193648; cursor: pointer;
            transition: background 0.2s ease, transform 0.2s ease;
            font-size: 12.5px; font-weight: 600;
            border: 1px solid transparent;
          }
          .cx-uni-list-item:hover {
            background: #E2EEF9; border-color: #AAC3FC; transform: translateX(4px);
          }
          .cx-uni-chev {
            color: #3A70B0; font-size: 14px; line-height: 1; flex-shrink: 0;
          }
          .cx-uni-banner {
            position: relative; overflow: hidden; border-radius: 22px;
            min-height: 220px;
            background:
              linear-gradient(135deg, rgba(25,54,72,0.92), rgba(58,112,176,0.78)),
              url("https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=70") center/cover no-repeat;
            color: #fff; padding: 32px 30px; margin-bottom: 22px;
            border: 1px solid rgba(255,255,255,0.10);
            box-shadow: 0 18px 40px rgba(25,54,72,0.30);
          }
          .cx-uni-banner::before {
            content: ""; position: absolute; inset: 0; pointer-events: none;
            background:
              radial-gradient(circle at 18% 28%, rgba(170,195,252,0.35), transparent 45%),
              radial-gradient(circle at 82% 72%, rgba(122,169,214,0.30), transparent 50%);
          }
          .cx-uni-banner::after {
            content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 4px;
            background: linear-gradient(90deg, #193648, #3A70B0, #7AA9D6, #AAC3FC, #3A70B0, #193648);
            background-size: 220% 100%;
            animation: cxShimmer 6s linear infinite;
          }
        `}</style>

        {/* ===== MODULE SWIPE CAROUSEL ===== */}
        <section style={{
          marginTop: 36,
          position: "relative",
          padding: "32px 28px 28px",
          borderRadius: 24,
          background: "linear-gradient(135deg, #f4f8ff 0%, #eef4ff 50%, #f8fbff 100%)",
          border: "1px solid #E2EEF9",
          boxShadow: "0 12px 40px rgba(25,54,72,0.10)",
          overflow: "hidden",
        }}>
          <style>{`
            #liaisonModulesScroll::-webkit-scrollbar { display: none; }
            #liaisonModulesScroll { -ms-overflow-style: none; scrollbar-width: none; }
            @keyframes liaisonModuleFloat {
              0%, 100% { transform: translateY(0); }
              50%      { transform: translateY(-3px); }
            }
            @keyframes liaisonOrbDrift {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50%      { transform: translate(20px, -16px) scale(1.08); }
            }
            @keyframes liaisonSweep {
              0%   { transform: translateX(-110%); }
              100% { transform: translateX(110%); }
            }
            @keyframes liaisonRingPulse {
              0%, 100% { box-shadow: 0 0 0 0 var(--ring), 0 0 18px var(--ring); }
              50%      { box-shadow: 0 0 0 6px transparent,   0 0 22px var(--ring); }
            }
            @keyframes liaisonCardIn {
              from { opacity: 0; transform: translateY(14px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes liaisonHeadShine {
              0%   { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }
            .liaisonModuleCard {
              opacity: 0;
              animation: liaisonCardIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
              transform-style: preserve-3d;
              transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                          box-shadow 0.32s ease, border-color 0.32s ease;
              transform: perspective(900px) rotateX(0) rotateY(0) translateZ(0);
            }
            .liaisonModuleCard:hover {
              box-shadow: 0 32px 60px rgba(25,54,72,0.28);
              border-color: var(--accent);
            }
            .liaisonModuleCard .liaisonModuleImage,
            .liaisonModuleCard .liaisonModuleIcon,
            .liaisonModuleCard > div:last-child {
              transform: translateZ(0);
              transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .liaisonModuleCard:hover .liaisonModuleImage { transform: translateZ(36px); }
            .liaisonModuleCard:hover .liaisonModuleIcon { transform: translateZ(60px); }
            .liaisonModuleCard:hover > div:last-child { transform: translateZ(20px); }
            .liaisonModulesScroll {
              perspective: 1500px;
              perspective-origin: center;
            }
            .liaisonModuleCard:hover .liaisonModuleSweep {
              animation: liaisonSweep 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
            .liaisonModuleCard:hover .liaisonModuleIcon {
              animation: liaisonModuleFloat 1.6s ease-in-out infinite;
            }
            .liaisonModuleCard:hover .liaisonModuleArrow {
              transform: translateX(4px);
            }
            .liaisonModuleCard:hover .liaisonModuleImage img {
              transform: scale(1.10);
              filter: saturate(1.15) brightness(1.05);
            }
            .liaisonModuleArrow { transition: transform 0.28s ease; display: inline-flex; }
            .liaisonModuleIcon::after {
              content: ""; position: absolute; inset: -3px; border-radius: inherit;
              animation: liaisonRingPulse 2.4s ease-in-out infinite;
              pointer-events: none;
            }
            .liaisonSwipeBtn {
              transition: background 0.22s ease, color 0.22s ease, transform 0.22s ease,
                          box-shadow 0.22s ease, border-color 0.22s ease;
            }
            .liaisonSwipeBtn:hover {
              background: linear-gradient(135deg, #193648, #3A70B0) !important;
              color: #fff !important;
              transform: translateY(-50%) scale(1.08);
              box-shadow: 0 14px 28px rgba(25,54,72,0.35);
              border-color: transparent !important;
            }
            .liaisonSwipeBtn:active { transform: translateY(-50%) scale(0.96); }
          `}</style>

          {/* Decorative drifting orbs */}
          <span aria-hidden style={{
            position: "absolute", top: -40, left: -30,
            width: 220, height: 220, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(58,112,176,0.18), rgba(58,112,176,0) 70%)",
            filter: "blur(10px)",
            animation: "liaisonOrbDrift 14s ease-in-out infinite",
            pointerEvents: "none",
          }} />
          <span aria-hidden style={{
            position: "absolute", bottom: -50, right: -40,
            width: 240, height: 240, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(122,169,214,0.20), rgba(122,169,214,0) 70%)",
            filter: "blur(12px)",
            animation: "liaisonOrbDrift 18s ease-in-out infinite reverse",
            pointerEvents: "none",
          }} />

          <div style={{
            position: "relative", zIndex: 1,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            margin: "0 0 22px", gap: 14, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "linear-gradient(135deg, #0F2A38, #193648, #3A70B0)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 10px 24px rgba(25,54,72,0.32), inset 0 1px 0 rgba(255,255,255,0.18)",
                padding: 4, flexShrink: 0,
              }}>
                <img src={collaxionLogo} alt="CollaXion" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.22)" }} />
              </div>
              <div>
                <h2 style={{
                  margin: 0, fontSize: 22, fontWeight: 800,
                  letterSpacing: "-0.015em",
                  background: "linear-gradient(90deg, #193648 0%, #3A70B0 50%, #193648 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "liaisonHeadShine 8s linear infinite",
                }}>Your Workspace</h2>
                <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 3, fontWeight: 600 }}>
                  Jump into any of your nine liaison modules
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <button
              type="button"
              aria-label="Previous"
              className="liaisonSwipeBtn"
              onClick={() => { const el = document.getElementById("liaisonModulesScroll"); if (el) el.scrollBy({ left: -280, behavior: "smooth" }); }}
              style={{
                position: "absolute", top: "50%", left: -16, transform: "translateY(-50%)",
                width: 44, height: 44, borderRadius: "50%",
                background: "#fff", color: "#193648",
                border: "1px solid #E2EEF9",
                boxShadow: "0 8px 20px rgba(25,54,72,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", zIndex: 3,
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next"
              className="liaisonSwipeBtn"
              onClick={() => { const el = document.getElementById("liaisonModulesScroll"); if (el) el.scrollBy({ left: 280, behavior: "smooth" }); }}
              style={{
                position: "absolute", top: "50%", right: -16, transform: "translateY(-50%)",
                width: 44, height: 44, borderRadius: "50%",
                background: "#fff", color: "#193648",
                border: "1px solid #E2EEF9",
                boxShadow: "0 8px 20px rgba(25,54,72,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", zIndex: 3,
              }}
            >
              <ChevronRight size={20} />
            </button>

            {/* Edge fade gradients */}
            <span aria-hidden style={{
              position: "absolute", top: 0, bottom: 0, left: 0, width: 40,
              background: "linear-gradient(90deg, rgba(244,248,255,1) 0%, rgba(244,248,255,0) 100%)",
              pointerEvents: "none", zIndex: 2,
            }} />
            <span aria-hidden style={{
              position: "absolute", top: 0, bottom: 0, right: 0, width: 40,
              background: "linear-gradient(270deg, rgba(244,248,255,1) 0%, rgba(244,248,255,0) 100%)",
              pointerEvents: "none", zIndex: 2,
            }} />

            <div
              id="liaisonModulesScroll"
              className="liaisonModulesScroll"
              style={{
                display: "flex", gap: 18,
                overflowX: "auto", scrollSnapType: "x mandatory",
                padding: "8px 4px 30px",
                scrollPaddingLeft: 8,
              }}
            >
              {[
                { Icon: Building2,     label: "Companies",    desc: "Approve & manage company partners",        path: "/industry-registrations", accent: "#3A70B0", img: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=900&q=80" },
                { Icon: FileSignature, label: "MOUs",         desc: "Sign & track partnership agreements",      path: "/mou-management",         accent: "#193648", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80" },
                { Icon: MapPin,        label: "Nearby",       desc: "Map nearby industries on a live map",      path: "/nearby-industries",      accent: "#7AA9D6", img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80" },
                { Icon: Briefcase,     label: "Projects",     desc: "Curate industry collaborations",            path: "/industry-projects",      accent: "#22A06B", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80" },
                { Icon: ClipboardList, label: "Applications", desc: "Forward student internship applications",  path: "/student-applications",   accent: "#D97706", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80" },
                { Icon: CalendarPlus,  label: "Meetings",     desc: "Schedule advisory board meetings",          path: "/AdvisoryMeetings",       accent: "#7C3AED", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80" },
                { Icon: CalendarCog,   label: "Events",       desc: "Plan & host industry events",               path: "/event-creation",         accent: "#0EA5E9", img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80" },
                { Icon: Network,       label: "Engagement",   desc: "Track industry partner activeness",         path: "/industry-activeness",    accent: "#193648", img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80" },
                { Icon: BarChart3,     label: "Feedback",     desc: "Reviews & rating insights",                 path: "/ratings-feedback",       accent: "#DB2777", img: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=900&q=80" },
              ].map((m, i) => (
                <div
                  key={m.path}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(m.path)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate(m.path); }}
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const px = (e.clientX - r.left) / r.width  - 0.5;
                    const py = (e.clientY - r.top)  / r.height - 0.5;
                    const ry = px *  16;
                    const rx = py * -16;
                    e.currentTarget.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.02)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
                  }}
                  className="liaisonModuleCard"
                  style={{
                    "--accent": m.accent,
                    flex: "0 0 auto",
                    width: 270,
                    scrollSnapAlign: "start",
                    background: "#ffffff",
                    border: "1px solid #E2EEF9",
                    borderRadius: 20,
                    boxShadow: "0 10px 28px rgba(25,54,72,0.10)",
                    cursor: "pointer",
                    position: "relative", overflow: "hidden",
                    animationDelay: `${i * 0.06}s`,
                    display: "flex", flexDirection: "column",
                  }}
                >
                  {/* IMAGE HEADER */}
                  <div className="liaisonModuleImage" style={{
                    position: "relative", height: 140, overflow: "hidden",
                  }}>
                    <img
                      src={m.img}
                      alt={m.label}
                      loading="lazy"
                      style={{
                        width: "100%", height: "100%", objectFit: "cover", display: "block",
                        transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), filter 0.4s ease",
                      }}
                    />
                    {/* Color tint overlay */}
                    <span aria-hidden style={{
                      position: "absolute", inset: 0,
                      background: `linear-gradient(180deg, ${m.accent}10 0%, ${m.accent}30 60%, ${m.accent}80 100%)`,
                      mixBlendMode: "multiply",
                      pointerEvents: "none",
                    }} />
                    {/* Bottom fade so text sits cleanly */}
                    <span aria-hidden style={{
                      position: "absolute", left: 0, right: 0, bottom: 0, height: 60,
                      background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 100%)",
                      pointerEvents: "none",
                    }} />
                    {/* Top accent stripe */}
                    <span aria-hidden style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      background: `linear-gradient(90deg, ${m.accent}, ${m.accent}99, ${m.accent})`,
                      zIndex: 2,
                    }} />
                    {/* Floating icon over image */}
                    <div
                      className="liaisonModuleIcon"
                      style={{
                        "--ring": `${m.accent}55`,
                        position: "absolute",
                        bottom: -22, left: 18,
                        width: 52, height: 52, borderRadius: 16,
                        background: `linear-gradient(135deg, #ffffff, #f8fbff)`,
                        border: `1px solid ${m.accent}55`,
                        color: m.accent,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 12px 24px rgba(25,54,72,0.20), 0 0 0 4px #ffffff`,
                        zIndex: 3,
                      }}
                    >
                      <m.Icon size={22} />
                    </div>
                    {/* Sweep highlight (on hover) */}
                    <span
                      aria-hidden
                      className="liaisonModuleSweep"
                      style={{
                        position: "absolute", top: 0, bottom: 0, left: 0, width: "60%",
                        background: `linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)`,
                        transform: "translateX(-110%)",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />
                  </div>

                  {/* CONTENT */}
                  <div style={{ padding: "30px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#193648", letterSpacing: "-0.012em" }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 6, lineHeight: 1.55, minHeight: 38, flex: 1 }}>
                      {m.desc}
                    </div>
                    <div style={{
                      marginTop: 16,
                      display: "inline-flex", alignItems: "center", justifyContent: "space-between",
                      paddingTop: 12,
                      borderTop: "1px dashed #E2EEF9",
                    }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        fontSize: 11, fontWeight: 800, color: m.accent,
                        letterSpacing: "0.10em", textTransform: "uppercase",
                      }}>
                        Open
                        <span className="liaisonModuleArrow"><ArrowRight size={13} /></span>
                      </span>
                      <span aria-hidden style={{
                        width: 28, height: 4, borderRadius: 999,
                        background: `linear-gradient(90deg, ${m.accent}, ${m.accent}55)`,
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginTop: 36 }}>
          {/* Section header — animated */}
          <style>{`
            @keyframes cxAboutHeadShine {
              0%   { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }
            @keyframes cxBadgePulse {
              0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(58,112,176,0.45); }
              50%      { transform: scale(1.04); box-shadow: 0 0 0 6px rgba(58,112,176,0); }
            }
            @keyframes cxBgFlow {
              0%   { background-position: 0% 50%, 0% 50%; }
              100% { background-position: 200% 50%, -200% 50%; }
            }
            @keyframes cxOrbFloat {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50%      { transform: translate(28px, -22px) scale(1.10); }
            }
            @keyframes cxTitleGlow {
              0%, 100% { text-shadow: 0 2px 18px rgba(122,169,214,0.45), 0 0 0 rgba(170,195,252,0); }
              50%      { text-shadow: 0 2px 24px rgba(170,195,252,0.70), 0 0 14px rgba(170,195,252,0.35); }
            }
            @keyframes cxStarTwinkle {
              0%, 100% { opacity: 0.25; transform: scale(0.85); }
              50%      { opacity: 1;    transform: scale(1.15); }
            }
            @keyframes cxBeamSweep {
              0%   { transform: translateX(-110%) skewX(-12deg); }
              100% { transform: translateX(220%)  skewX(-12deg); }
            }
            .cxAboutHeadIcon {
              transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease;
            }
            .cxAboutHeadIcon:hover {
              transform: rotate(-8deg) scale(1.06);
              box-shadow: 0 14px 28px rgba(25,54,72,0.36);
            }
            .cxBannerV2 {
              position: relative; overflow: hidden;
              border-radius: 24px;
              padding: 38px 38px 36px;
              min-height: 240px;
              color: #fff;
              border: 1px solid rgba(255,255,255,0.12);
              box-shadow: 0 22px 50px rgba(15,42,56,0.35);
              background:
                linear-gradient(120deg, #0F2A38 0%, #193648 38%, #2C5F80 70%, #3A70B0 100%),
                linear-gradient(120deg, transparent 0%, rgba(170,195,252,0.10) 50%, transparent 100%);
              background-size: 220% 100%, 220% 100%;
              animation: cxBgFlow 18s linear infinite;
            }
            .cxBannerOrbA, .cxBannerOrbB {
              position: absolute; border-radius: 50%; pointer-events: none;
              filter: blur(8px);
            }
            .cxBannerOrbA {
              width: 260px; height: 260px; top: -90px; right: -60px;
              background: radial-gradient(circle, rgba(170,195,252,0.45) 0%, rgba(170,195,252,0) 70%);
              animation: cxOrbFloat 14s ease-in-out infinite;
            }
            .cxBannerOrbB {
              width: 220px; height: 220px; bottom: -80px; left: -40px;
              background: radial-gradient(circle, rgba(122,169,214,0.40) 0%, rgba(122,169,214,0) 70%);
              animation: cxOrbFloat 18s ease-in-out infinite reverse;
            }
            .cxBannerGrid {
              position: absolute; inset: 0; pointer-events: none; opacity: 0.18;
              background-image:
                linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px);
              background-size: 40px 40px, 40px 40px;
              mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
              -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
            }
            .cxBannerBeam {
              position: absolute; top: 0; bottom: 0; left: 0; width: 30%;
              background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.10) 50%, transparent 100%);
              transform: translateX(-110%) skewX(-12deg);
              animation: cxBeamSweep 9s ease-in-out infinite;
              pointer-events: none;
            }
            .cxBannerStar {
              position: absolute; width: 4px; height: 4px; border-radius: 50%;
              background: #ffffff; pointer-events: none;
              animation: cxStarTwinkle 2.4s ease-in-out infinite;
            }
            .cxBannerStat {
              display: inline-flex; align-items: center; gap: 8px;
              padding: 8px 14px; border-radius: 999px;
              background: rgba(255,255,255,0.10);
              border: 1px solid rgba(255,255,255,0.20);
              backdrop-filter: blur(8px);
              font-size: 11.5px; font-weight: 800; letter-spacing: 0.06em;
              color: #ffffff;
              transition: background 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
            }
            .cxBannerStat:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); border-color: rgba(170,195,252,0.45); }
            .cxBannerStat strong { font-size: 13.5px; color: #AAC3FC; letter-spacing: -0.01em; }
            .cxBannerCTA {
              display: inline-flex; align-items: center; gap: 10px;
              padding: 11px 20px; border-radius: 12px;
              background: linear-gradient(90deg, #ffffff, #E2EEF9);
              color: #193648; font-size: 13px; font-weight: 800; letter-spacing: 0.04em;
              text-transform: uppercase;
              border: none; cursor: pointer;
              box-shadow: 0 14px 30px rgba(0,0,0,0.30);
              transition: transform 0.22s ease, box-shadow 0.22s ease, gap 0.22s ease;
            }
            .cxBannerCTA:hover { transform: translateY(-2px); box-shadow: 0 18px 36px rgba(0,0,0,0.36); gap: 14px; }
          `}</style>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            margin: "0 0 18px", gap: 14, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div className="cxAboutHeadIcon" style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "linear-gradient(135deg, #0F2A38, #193648, #3A70B0)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 10px 22px rgba(25,54,72,0.32), inset 0 1px 0 rgba(255,255,255,0.18)",
                padding: 4, flexShrink: 0,
              }}>
                <img src={collaxionLogo} alt="CollaXion" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.22)" }} />
              </div>
              <div>
                <h2 style={{
                  margin: 0, fontSize: 22, fontWeight: 800,
                  letterSpacing: "-0.015em",
                  display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
                }}>
                  <span style={{
                    background: "linear-gradient(90deg, #193648 0%, #3A70B0 50%, #193648 100%)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "cxAboutHeadShine 8s linear infinite",
                  }}>About CollaXion</span>
                  <span style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "#3A70B0", background: "#eff6ff", border: "1px solid #cfe0f0",
                    padding: "3px 10px", borderRadius: 999,
                    animation: "cxBadgePulse 2.4s ease-in-out infinite",
                  }}>Platform</span>
                </h2>
                <p style={{ margin: "5px 0 0", fontSize: 13.5, color: "#193648", fontWeight: 600, letterSpacing: "-0.005em" }}>
                  The collaboration backbone for Riphah Software Engineering — industry, faculty &amp; students.
                </p>
              </div>
            </div>
          </div>

          {/* Cinematic Kinetic Banner — aurora background + letter-by-letter reveal */}
          <style>{`
            @keyframes cxAuroraShift {
              0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
              33%      { transform: translate3d(8%, -6%, 0) rotate(8deg); }
              66%      { transform: translate3d(-6%, 8%, 0) rotate(-6deg); }
            }
            @keyframes cxStreakSlide {
              0%   { transform: translateX(-50%) translateY(-50%); opacity: 0; }
              10%  { opacity: 1; }
              90%  { opacity: 1; }
              100% { transform: translateX(120%) translateY(40%); opacity: 0; }
            }
            @keyframes cxLetterIn {
              0%   { opacity: 0; transform: translateY(80px) rotateX(80deg) scale(0.6); filter: blur(12px); }
              60%  { opacity: 1; filter: blur(0); }
              100% { opacity: 1; transform: translateY(0)   rotateX(0)    scale(1);   filter: blur(0); }
            }
            @keyframes cxWordSwap {
              0%, 18%   { opacity: 0; transform: translateY(24px) rotateX(60deg); filter: blur(10px); }
              22%, 28%  { opacity: 1; transform: translateY(0)    rotateX(0);    filter: blur(0); }
              32%, 100% { opacity: 0; transform: translateY(-24px) rotateX(-60deg); filter: blur(10px); }
            }
            @keyframes cxNeonPulse {
              0%, 100% {
                text-shadow:
                  0 0 12px rgba(170,195,252,0.55),
                  0 0 28px rgba(122,169,214,0.45),
                  0 0 60px rgba(58,112,176,0.30);
              }
              50% {
                text-shadow:
                  0 0 18px rgba(255,255,255,0.85),
                  0 0 40px rgba(170,195,252,0.75),
                  0 0 80px rgba(58,112,176,0.55);
              }
            }
            @keyframes cxBgPan {
              0%   { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }
            @keyframes cxScanline {
              0%   { transform: translateY(-100%); }
              100% { transform: translateY(100%); }
            }
            @keyframes cxLineSweep2 {
              0%   { transform: scaleX(0); transform-origin: left;  opacity: 1; }
              45%  { transform: scaleX(1); transform-origin: left;  opacity: 1; }
              50%  { transform-origin: right; }
              95%  { transform: scaleX(0); transform-origin: right; opacity: 1; }
              100% { opacity: 0; }
            }
            @keyframes cxCaret2 {
              0%, 49% { opacity: 1; }
              50%, 100% { opacity: 0; }
            }
            @keyframes cxFloatUp {
              0%   { transform: translateY(0)    rotate(0); opacity: 0; }
              10%  { opacity: 0.7; }
              90%  { opacity: 0.7; }
              100% { transform: translateY(-160px) rotate(20deg); opacity: 0; }
            }

            .cxCinemaWrap {
              position: relative; overflow: hidden;
              border-radius: 22px;
              padding: clamp(28px, 4vw, 50px) 26px;
              min-height: 220px;
              display: flex; align-items: center; justify-content: center;
              text-align: center;
              background: linear-gradient(135deg, #193648 0%, #1F4159 45%, #193648 100%);
              border: 1px solid rgba(170,195,252,0.18);
              box-shadow:
                0 30px 70px rgba(0,0,0,0.55),
                inset 0 1px 0 rgba(255,255,255,0.10);
              perspective: 1200px;
              isolation: isolate;
            }
            /* AURORA BLOBS */
            .cxAurora { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.85; pointer-events: none; mix-blend-mode: screen; }
            .cxAuroraA {
              width: 540px; height: 540px; top: -180px; left: -120px;
              background: radial-gradient(circle, #3A70B0 0%, transparent 70%);
              animation: cxAuroraShift 16s ease-in-out infinite;
            }
            .cxAuroraB {
              width: 460px; height: 460px; bottom: -160px; right: -120px;
              background: radial-gradient(circle, #1F4159 0%, transparent 70%);
              animation: cxAuroraShift 20s ease-in-out infinite reverse;
            }
            .cxAuroraC {
              width: 380px; height: 380px; top: 20%; left: 40%;
              background: radial-gradient(circle, #7AA9D6 0%, transparent 70%);
              animation: cxAuroraShift 22s ease-in-out infinite;
              opacity: 0.55;
            }
            /* GRID overlay */
            .cxCinemaGrid {
              position: absolute; inset: 0; pointer-events: none; z-index: 0;
              background-image:
                linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
              background-size: 56px 56px, 56px 56px;
              mask-image: radial-gradient(ellipse at center, #000 30%, transparent 80%);
              -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 80%);
            }
            /* Diagonal STREAKS */
            .cxStreak {
              position: absolute; top: 50%; left: 0;
              width: 220px; height: 2px;
              background: linear-gradient(90deg, transparent, rgba(170,195,252,0.85), transparent);
              filter: blur(1px);
              animation: cxStreakSlide 4s linear infinite;
              pointer-events: none;
            }
            /* SCANLINE */
            .cxScanline {
              position: absolute; left: 0; right: 0; height: 6px;
              background: linear-gradient(90deg, transparent, rgba(170,195,252,0.5), transparent);
              filter: blur(2px);
              animation: cxScanline 5.5s linear infinite;
              pointer-events: none; z-index: 0;
            }
            /* Floating particles */
            .cxParticle {
              position: absolute; bottom: 0;
              width: 4px; height: 4px; border-radius: 50%;
              background: rgba(170,195,252,0.85);
              filter: blur(0.5px);
              box-shadow: 0 0 10px rgba(170,195,252,0.85);
              animation: cxFloatUp 6s linear infinite;
              pointer-events: none;
            }
            /* CONTENT */
            .cxCinemaInner { position: relative; z-index: 2; max-width: 980px; width: 100%; color: #fff; }
            .cxCinemaEyebrow {
              display: inline-flex; align-items: center; gap: 12px;
              font-size: 10px; font-weight: 900;
              letter-spacing: 0.40em; text-transform: uppercase;
              color: #AAC3FC;
              margin-bottom: 16px;
              opacity: 0;
              animation: cxLetterIn 1s 0.05s cubic-bezier(0.22, 1, 0.36, 1) forwards;
              text-shadow: 0 0 12px rgba(170,195,252,0.55);
            }
            .cxCinemaEyebrow::before, .cxCinemaEyebrow::after {
              content: ""; flex-shrink: 0;
              display: inline-block; width: 48px; height: 1px;
              background: linear-gradient(90deg, transparent, #AAC3FC, transparent);
            }

            .cxCycler2 {
              position: relative; height: 1.15em;
              display: flex; align-items: center; justify-content: center;
              font-family: 'Sora', 'Inter', sans-serif;
              font-size: clamp(20px, 3vw, 28px);
              font-weight: 800; letter-spacing: 0.30em; text-transform: uppercase;
              margin-bottom: 26px;
              perspective: 600px;
              color: #AAC3FC;
            }
            .cxCycler2 .cxWord2 {
              position: absolute; left: 50%; transform: translateX(-50%);
              opacity: 0; white-space: nowrap;
              animation: cxWordSwap 6s cubic-bezier(0.22, 1, 0.36, 1) infinite;
              text-shadow: 0 0 16px rgba(170,195,252,0.55);
            }

            .cxCinemaTitle {
              font-family: 'Sora', 'Inter', sans-serif;
              font-size: clamp(26px, 4.5vw, 48px);
              font-weight: 900;
              letter-spacing: -0.025em;
              line-height: 1.05;
              color: #ffffff;
              margin: 0 0 18px;
              perspective: 800px;
              animation: cxNeonPulse 4s ease-in-out infinite 3s;
            }
            .cxCinemaTitle .cxLetter {
              display: inline-block;
              opacity: 0;
              transform-style: preserve-3d;
              animation: cxLetterIn 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
              will-change: opacity, transform, filter;
            }
            .cxCinemaTitle .cxLetterAccent {
              background: linear-gradient(90deg, #AAC3FC 0%, #ffffff 35%, #7AA9D6 65%, #AAC3FC 100%);
              background-size: 200% 100%;
              -webkit-background-clip: text; background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: cxLetterIn 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards,
                         cxBgPan 4s linear infinite;
            }
            .cxCinemaCaret {
              display: inline-block;
              width: 6px; height: 0.85em;
              background: linear-gradient(180deg, #AAC3FC, #3A70B0);
              vertical-align: -0.10em;
              margin-left: 10px;
              border-radius: 3px;
              opacity: 0;
              animation: cxLetterIn 0.6s 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards,
                         cxCaret2 1s 3.1s steps(1, end) infinite;
              box-shadow: 0 0 14px rgba(170,195,252,0.7);
            }
            .cxCinemaUnderline {
              height: 2px; width: 50%; max-width: 320px;
              margin: 14px auto 0;
              background: linear-gradient(90deg, transparent, #7AA9D6, #AAC3FC, #7AA9D6, transparent);
              transform-origin: left;
              animation: cxLineSweep2 5s 2.8s cubic-bezier(0.22, 1, 0.36, 1) infinite;
              box-shadow: 0 0 14px rgba(170,195,252,0.6);
            }
            .cxCinemaTagline {
              font-size: clamp(11.5px, 1.1vw, 13.5px);
              color: rgba(226,238,249,0.85);
              letter-spacing: 0.06em;
              margin: 16px 0 0;
              opacity: 0;
              animation: cxLetterIn 1s 3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
            .cxCinemaTagline strong { color: #AAC3FC; font-weight: 800; letter-spacing: 0.10em; }
          `}</style>

          <div className="cxCinemaWrap" style={{ marginBottom: 22 }}>
            <span aria-hidden className="cxAurora cxAuroraA" />
            <span aria-hidden className="cxAurora cxAuroraB" />
            <span aria-hidden className="cxAurora cxAuroraC" />
            <span aria-hidden className="cxCinemaGrid" />
            <span aria-hidden className="cxScanline" style={{ top: 0, animationDelay: "0s" }} />
            {/* Streaks */}
            <span aria-hidden className="cxStreak" style={{ top: "18%", animationDelay: "0s" }} />
            <span aria-hidden className="cxStreak" style={{ top: "44%", animationDelay: "1.6s", width: 160 }} />
            <span aria-hidden className="cxStreak" style={{ top: "70%", animationDelay: "3.2s", width: 280 }} />
            <span aria-hidden className="cxStreak" style={{ top: "86%", animationDelay: "0.8s", width: 140 }} />
            {/* Particles */}
            {[
              { left: "10%", delay: "0s",   size: 4 },
              { left: "20%", delay: "1.2s", size: 3 },
              { left: "32%", delay: "2.4s", size: 5 },
              { left: "46%", delay: "0.6s", size: 3 },
              { left: "58%", delay: "3.6s", size: 4 },
              { left: "70%", delay: "1.8s", size: 5 },
              { left: "82%", delay: "0.3s", size: 3 },
              { left: "92%", delay: "2.0s", size: 4 },
            ].map((p, i) => (
              <span
                key={i} aria-hidden className="cxParticle"
                style={{
                  left: p.left, animationDelay: p.delay,
                  width: p.size, height: p.size,
                }}
              />
            ))}

            <div className="cxCinemaInner">
              <div className="cxCinemaEyebrow">CollaXion · Riphah</div>

              {/* MAIN TITLE — letter-by-letter reveal */}
              <h3 className="cxCinemaTitle" aria-label="Where Collaboration Meets Innovation">
                {(() => {
                  const words = [
                    { text: "Where",         accent: false },
                    { text: "Collaboration", accent: true  },
                    { text: "Meets",         accent: false },
                    { text: "Innovation",    accent: false },
                  ];
                  let idx = 0;
                  const letterStyle = (i) => ({ animationDelay: `${0.35 + i * 0.045}s` });
                  return (
                    <>
                      {words.map((w, wi) => (
                        <React.Fragment key={`w${wi}`}>
                          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                            {Array.from(w.text).map((ch, ci) => (
                              <span
                                key={`l${wi}-${ci}`}
                                className={"cxLetter" + (w.accent ? " cxLetterAccent" : "")}
                                style={letterStyle(idx++)}
                              >
                                {ch}
                              </span>
                            ))}
                          </span>
                          {wi < words.length - 1 && " "}
                        </React.Fragment>
                      ))}
                      <span aria-hidden className="cxCinemaCaret" />
                    </>
                  );
                })()}
              </h3>

              <span aria-hidden className="cxCinemaUnderline" />

              <p className="cxCinemaTagline">
                <strong>Industry</strong> · <strong>Faculty</strong> · <strong>Students</strong> — one workspace, infinite possibilities.
              </p>
            </div>
          </div>

          {/* 3 cinematic spotlight cards — image-first, minimal text */}
          <style>{`
            @keyframes cxSpotlightShine { 0% { transform: translateX(-110%); } 100% { transform: translateX(110%); } }
            .cxSpotlightCard {
              position: relative; flex: 1 1 320px; min-width: 260px;
              height: 320px; border-radius: 22px; overflow: hidden; cursor: pointer;
              box-shadow: 0 14px 36px rgba(25,54,72,0.18);
              transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                          box-shadow 0.45s ease, flex-grow 0.5s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .cxSpotlightCard:hover {
              transform: translateY(-6px) scale(1.015);
              box-shadow: 0 28px 60px rgba(25,54,72,0.30);
              flex-grow: 1.5;
            }
            .cxSpotlightImg {
              position: absolute; inset: 0;
              background-size: cover; background-position: center;
              transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1),
                          filter 0.45s ease;
            }
            .cxSpotlightCard:hover .cxSpotlightImg {
              transform: scale(1.10);
              filter: saturate(1.15) brightness(1.04);
            }
            .cxSpotlightOverlay {
              position: absolute; inset: 0;
              background: linear-gradient(180deg, rgba(15,42,56,0.05) 0%, rgba(15,42,56,0.30) 45%, rgba(15,42,56,0.92) 100%);
            }
            .cxSpotlightContent {
              position: absolute; inset: 0;
              display: flex; flex-direction: column; justify-content: flex-end;
              padding: 22px;
              color: #fff;
              z-index: 2;
            }
            .cxSpotlightShine {
              position: absolute; top: 0; bottom: 0; left: 0; width: 50%;
              background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.20) 50%, transparent 100%);
              transform: translateX(-110%);
              pointer-events: none;
            }
            .cxSpotlightCard:hover .cxSpotlightShine {
              animation: cxSpotlightShine 0.95s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
            .cxSpotlightCta {
              display: inline-flex; align-items: center; gap: 6;
              margin-top: 10px;
              padding: 8px 14px;
              border-radius: 999px;
              background: rgba(255,255,255,0.16);
              border: 1px solid rgba(255,255,255,0.32);
              backdrop-filter: blur(8px);
              font-size: 11.5px; font-weight: 800; letter-spacing: 0.10em; text-transform: uppercase;
              color: #fff; cursor: pointer; align-self: flex-start;
              transition: background 0.22s ease, transform 0.22s ease, gap 0.22s ease;
            }
            .cxSpotlightCta:hover { background: rgba(255,255,255,0.28); gap: 10px; }
            .cxStatRow {
              display: flex; flex-wrap: wrap; gap: 10px;
              margin-top: 14px;
            }
            .cxStatChip {
              display: inline-flex; align-items: center; gap: 6;
              padding: 5px 11px; border-radius: 999px;
              background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.24);
              font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em;
              backdrop-filter: blur(6px);
            }
          `}</style>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 22 }}>
            {[
              {
                tag: "Industry",
                title: "Build the partner network",
                chips: ["Onboarding", "MOUs", "Trust"],
                img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70",
                route: "/industry-registrations",
              },
              {
                tag: "Students",
                title: "Connect talent to industry",
                chips: ["Internships", "Projects", "Placements"],
                img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=70",
                route: "/student-applications",
              },
              {
                tag: "Coordination",
                title: "Run meetings & events",
                chips: ["Advisory", "Events", "Engagement"],
                img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=70",
                route: "/AdvisoryMeetings",
              },
            ].map((c, i) => (
              <motion.article
                key={c.tag}
                className="cxSpotlightCard"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => navigate(c.route)}
              >
                <div className="cxSpotlightImg" style={{ backgroundImage: `url(${c.img})` }} />
                <div className="cxSpotlightOverlay" />
                <span className="cxSpotlightShine" />
                <div className="cxSpotlightContent">
                  <span style={{
                    display: "inline-flex", width: "fit-content", alignItems: "center", gap: 6,
                    padding: "4px 11px", borderRadius: 999,
                    fontSize: 9.5, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase",
                    background: "rgba(255,255,255,0.20)", border: "1px solid rgba(255,255,255,0.32)",
                    backdropFilter: "blur(8px)", marginBottom: 10,
                  }}>{c.tag}</span>
                  <h4 style={{
                    margin: 0, fontSize: 22, fontWeight: 800,
                    letterSpacing: "-0.012em", lineHeight: 1.2,
                    fontFamily: "'Sora', 'Inter', sans-serif",
                    textShadow: "0 2px 8px rgba(0,0,0,0.45)",
                  }}>
                    {c.title}
                  </h4>
                  <div className="cxStatRow">
                    {c.chips.map((ch) => (
                      <span key={ch} className="cxStatChip">{ch}</span>
                    ))}
                  </div>
                  <button
                    className="cxSpotlightCta"
                    onClick={(e) => { e.stopPropagation(); navigate(c.route); }}
                  >
                    Open <ArrowUpRight size={13} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

        </section>
      </main>
      {/* ===== ANALYTICS / GRAPHS SECTION ===== */}
      {(() => {
        // Weekly Activity — based on MOU records over the past 7 days (Mon → Sun).
        // Each MOU is bucketed by its createdAt / signedAt / updatedAt weekday.
        const trend = (() => {
          const buckets = [0, 0, 0, 0, 0, 0, 0]; // index 0 = Mon ... 6 = Sun
          const today = new Date();
          const weekStart = new Date(today);
          // Roll back to start of current week's Monday (00:00)
          const dow = (today.getDay() + 6) % 7; // Mon=0 ... Sun=6
          weekStart.setDate(today.getDate() - dow);
          weekStart.setHours(0, 0, 0, 0);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 7);
          mouRecords.forEach((m) => {
            const ts = m?.signedAt || m?.createdAt || m?.updatedAt;
            if (!ts) return;
            const d = new Date(ts);
            if (isNaN(d.getTime())) return;
            if (d < weekStart || d >= weekEnd) return;
            const idx = (d.getDay() + 6) % 7; // Mon=0 ... Sun=6
            buckets[idx] += 1;
          });
          return buckets;
        })();
        const trendMax = Math.max(...trend, 1);
        const dist = [
          { label: "Companies",    value: counts.industries,   color: "#3A70B0" },
          { label: "MOUs",         value: counts.mous,         color: "#193648" },
          { label: "Applications", value: counts.applications, color: "#86efac" },
          { label: "Events",       value: counts.events,       color: "#fcd34d" },
          { label: "Meetings",     value: counts.meetings,     color: "#7AA9D6" },
        ];
        const distTotal = dist.reduce((s, d) => s + d.value, 0) || 1;
        let cumulative = 0;
        const radius = 70, cx = 90, cy = 90, sw = 18;
        const C = 2 * Math.PI * radius;

        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        return (
          <section style={{
            position: "relative",
            padding: "28px 32px 16px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 22,
            perspective: 1500,
          }}>
            <style>{`
              @keyframes cxAnalyticsIn {
                0%   { opacity: 0; transform: translateY(28px) scale(0.96); }
                100% { opacity: 1; transform: translateY(0)    scale(1); }
              }
              @keyframes cxAnalyticsHeadShine {
                0%   { background-position: 0% 50%; }
                100% { background-position: 200% 50%; }
              }
              @keyframes cxBarFill {
                from { width: 0; opacity: 0.4; }
                to   { width: var(--w); opacity: 1; }
              }
              @keyframes cxDashIn {
                from { stroke-dasharray: 0 9999; opacity: 0; }
                to   { opacity: 1; }
              }
              @keyframes cxIconFloat {
                0%, 100% { transform: translateY(0); }
                50%      { transform: translateY(-3px); }
              }
              .cxAnalyticsCard {
                opacity: 0;
                animation: cxAnalyticsIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                transform-style: preserve-3d;
                transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                            box-shadow 0.32s ease, border-color 0.32s ease;
                will-change: transform;
              }
              .cxAnalyticsCard:hover {
                box-shadow: 0 28px 56px rgba(25,54,72,0.20);
                border-color: #AAC3FC;
              }
              .cxAnalyticsCard:hover .cxAnalyticsHeadIcon {
                animation: cxIconFloat 1.4s ease-in-out infinite;
                transform: translateZ(28px);
              }
              .cxAnalyticsCard:hover .cxAnalyticsTitle {
                transform: translateZ(18px);
              }
              .cxAnalyticsCard:hover svg,
              .cxAnalyticsCard:hover .cxAnalyticsBars {
                transform: translateZ(12px);
              }
              .cxAnalyticsHeadIcon, .cxAnalyticsTitle, .cxAnalyticsCard svg, .cxAnalyticsBars {
                transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
              }
              .cxAnalyticsTitle {
                background: linear-gradient(90deg, #193648 0%, #3A70B0 50%, #193648 100%);
                background-size: 200% 100%;
                -webkit-background-clip: text; background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: cxAnalyticsHeadShine 8s linear infinite;
              }
              .cxBarTrack { overflow: hidden; }
              .cxBarFill {
                height: 100%; border-radius: 99px;
                animation: cxBarFill 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                box-shadow: var(--gloss);
              }
              .cxDistRow {
                opacity: 0;
                animation: cxAnalyticsIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
              }
            `}</style>
            {/* Trend line chart */}
            <div
              className="cxAnalyticsCard"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width  - 0.5;
                const py = (e.clientY - r.top)  / r.height - 0.5;
                e.currentTarget.style.transform = `perspective(1200px) rotateX(${py * -10}deg) rotateY(${px * 10}deg) translateY(-4px)`;
              }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)"; }}
              style={{
              position: "relative",
              background: "linear-gradient(180deg, #ffffff, #fbfdff)",
              border: "1px solid #E2EEF9", borderRadius: 18,
              padding: "22px 26px",
              boxShadow: "0 6px 22px rgba(25,54,72,0.07)",
              overflow: "hidden",
              animationDelay: "0.05s",
            }}>
              <span aria-hidden style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: "linear-gradient(90deg, #193648, #3A70B0, #7AA9D6)",
              }} />
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <div className="cxAnalyticsHeadIcon" style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: "linear-gradient(135deg, #193648, #3A70B0)",
                  color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 6px 14px rgba(25,54,72,0.25)",
                }}>
                  <BarChart3 size={18} />
                </div>
                <div>
                  <div className="cxAnalyticsTitle" style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em" }}>Weekly Activity</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>MOUs signed/updated this week (Mon–Sun)</div>
                </div>
              </div>
              <svg viewBox="0 0 700 220" width="100%" style={{ display: "block" }}>
                <defs>
                  <linearGradient id="liaisonArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3A70B0" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#3A70B0" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="liaisonLine" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%"  stopColor="#193648" />
                    <stop offset="100%" stopColor="#7AA9D6" />
                  </linearGradient>
                </defs>
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                  <line key={i} x1={48} x2={680} y1={20 + p * 160} y2={20 + p * 160}
                    stroke="#E2EEF9" strokeWidth="1" strokeDasharray={i === 4 ? "" : "3 4"} />
                ))}
                {(() => {
                  const pts = trend.map((v, i) => ({
                    x: 48 + (i * (632 / 6)),
                    y: 180 - (v / trendMax) * 160,
                  }));
                  let d = `M ${pts[0].x} ${pts[0].y}`;
                  for (let i = 0; i < pts.length - 1; i++) {
                    const p0 = pts[i - 1] || pts[i];
                    const p1 = pts[i];
                    const p2 = pts[i + 1];
                    const p3 = pts[i + 2] || p2;
                    const tension = 0.18;
                    const c1x = p1.x + (p2.x - p0.x) * tension;
                    const c1y = p1.y + (p2.y - p0.y) * tension;
                    const c2x = p2.x - (p3.x - p1.x) * tension;
                    const c2y = p2.y - (p3.y - p1.y) * tension;
                    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
                  }
                  const area = `${d} L ${pts[pts.length - 1].x} 180 L ${pts[0].x} 180 Z`;
                  return (<>
                    <path d={area} fill="url(#liaisonArea)" />
                    <path d={d} fill="none" stroke="url(#liaisonLine)" strokeWidth="2.5" strokeLinecap="round" />
                    {pts.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="9" fill="#3A70B0" opacity="0.12" />
                        <circle cx={p.x} cy={p.y} r="4.5" fill="#fff" stroke="#3A70B0" strokeWidth="2" />
                        <text x={p.x} y={p.y - 12} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800, fill: "#193648" }}>{trend[i]}</text>
                        <text x={p.x} y={208} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: "#64748b" }}>{days[i]}</text>
                      </g>
                    ))}
                  </>);
                })()}
              </svg>
            </div>

            {/* Distribution donut */}
            <div
              className="cxAnalyticsCard"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width  - 0.5;
                const py = (e.clientY - r.top)  / r.height - 0.5;
                e.currentTarget.style.transform = `perspective(1200px) rotateX(${py * -10}deg) rotateY(${px * 10}deg) translateY(-4px)`;
              }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)"; }}
              style={{
              position: "relative",
              background: "linear-gradient(180deg, #ffffff, #fbfdff)",
              border: "1px solid #E2EEF9", borderRadius: 18,
              padding: "22px 26px",
              boxShadow: "0 6px 22px rgba(25,54,72,0.07)",
              overflow: "hidden",
              animationDelay: "0.15s",
            }}>
              <span aria-hidden style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: "linear-gradient(90deg, #3A70B0, #7AA9D6, #193648)",
              }} />
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <div className="cxAnalyticsHeadIcon" style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: "linear-gradient(135deg, #193648, #3A70B0)",
                  color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 6px 14px rgba(25,54,72,0.25)",
                }}>
                  <Network size={18} />
                </div>
                <div>
                  <div className="cxAnalyticsTitle" style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em" }}>Activity Mix</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Distribution across categories</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#eef2ff" strokeWidth={sw} />
                  {dist.map((d, i) => {
                    const frac = d.value / distTotal;
                    const dash = frac * C;
                    const offset = (cumulative / distTotal) * C;
                    cumulative += d.value;
                    return (
                      <circle
                        key={i}
                        cx={cx} cy={cy} r={radius}
                        fill="none" stroke={d.color} strokeWidth={sw}
                        strokeDasharray={`${dash} ${C - dash}`}
                        strokeDashoffset={-offset}
                        transform={`rotate(-90 ${cx} ${cy})`}
                        strokeLinecap="butt"
                      />
                    );
                  })}
                  <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontSize: 24, fontWeight: 900, fill: "#193648", fontFamily: "'Sora', sans-serif" }}>{distTotal}</text>
                  <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8", letterSpacing: "0.10em" }}>TOTAL</text>
                </svg>
                <div style={{ flex: 1, minWidth: 160, display: "flex", flexDirection: "column", gap: 7 }}>
                  {dist.map((d) => (
                    <div key={d.label} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                      padding: "7px 10px", borderRadius: 9,
                      background: "#f8fbff", border: "1px solid #eef2ff",
                    }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: d.color, boxShadow: `0 0 0 3px ${d.color}22` }} />
                        <span style={{ fontSize: 12.5, color: "#0f172a", fontWeight: 700 }}>{d.label}</span>
                      </span>
                      <span style={{ fontSize: 13, color: "#193648", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bars chart */}
            <div
              className="cxAnalyticsCard"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width  - 0.5;
                const py = (e.clientY - r.top)  / r.height - 0.5;
                e.currentTarget.style.transform = `perspective(1200px) rotateX(${py * -10}deg) rotateY(${px * 10}deg) translateY(-4px)`;
              }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)"; }}
              style={{
              position: "relative",
              background: "linear-gradient(180deg, #ffffff, #fbfdff)",
              border: "1px solid #E2EEF9", borderRadius: 18,
              padding: "22px 26px",
              boxShadow: "0 6px 22px rgba(25,54,72,0.07)",
              overflow: "hidden",
              animationDelay: "0.25s",
            }}>
              <span aria-hidden style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: "linear-gradient(90deg, #86efac, #3A70B0, #193648)",
              }} />
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <div className="cxAnalyticsHeadIcon" style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: "linear-gradient(135deg, #193648, #3A70B0)",
                  color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 6px 14px rgba(25,54,72,0.25)",
                }}>
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <div className="cxAnalyticsTitle" style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em" }}>Module Pulse</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Activity per workspace area</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {dist.map((d) => {
                  const pct = Math.round((d.value / Math.max(...dist.map((x) => x.value))) * 100);
                  return (
                    <div key={d.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#193648", fontWeight: 700 }}>{d.label}</span>
                        <span style={{ fontSize: 12.5, color: d.color, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{d.value}</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 99, background: "#eef2ff", overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            height: "100%",
                            background: `linear-gradient(90deg, ${d.color}cc, ${d.color})`,
                            borderRadius: 99,
                            boxShadow: `0 0 8px ${d.color}55`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      <LiaisonFooter />
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
    padding: "30px 50px",
    position: "relative",
    overflow: "visible",
    zIndex: 1,
    background: "#ffffff",
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
