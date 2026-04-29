// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Briefcase, Users, Send, CheckCircle, XCircle, TrendingUp, Clock,
//   BarChart3, Menu, X, ChevronDown, Bell, Search, MoreVertical,
//   Calendar, Award, FileText, Eye, Download, Mail, LogOut, Home
// } from "lucide-react";
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell
// } from "recharts";

// const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"];

// export default function InternshipDashboard() {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [selectedInternship, setSelectedInternship] = useState(null);
//   const [selectedApplicant, setSelectedApplicant] = useState(null);
//   const [showCVModal, setShowCVModal] = useState(false);
//   const [showApplicantsModal, setShowApplicantsModal] = useState(false);
//   const [sendingToLiaison, setSendingToLiaison] = useState({});
//   const [notificationsOpen, setNotificationsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([
//     { id: 1, title: "New application: Ayesha Khan", time: "2h ago", read: false },
//     { id: 2, title: "MOU signed with AgriX", time: "1d ago", read: true },
//     { id: 3, title: "Reminder: Advisory Board Meeting", time: "3d ago", read: false }
//   ]);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [confirmSendModal, setConfirmSendModal] = useState({ open: false, app: null });
//   const [exporting, setExporting] = useState(false);
//   const [viewLogModal, setViewLogModal] = useState({ open: false, student: null });

//   // MOCK DATA
//   const internships = [
//     { id: 1, title: "AI Research Internship", company: "TechNova", type: "Internship", applicants: 12, totalSlots: 3, tags: ["AI","Research"] },
//     { id: 2, title: "Smart Agriculture Project", company: "AgriX", type: "Project", applicants: 8, totalSlots: 5, tags: ["IoT","Agri"] },
//     { id: 3, title: "IoT Manufacturing", company: "IndusTech", type: "Project", applicants: 15, totalSlots: 4, tags: ["IoT","Industry"] },
//     { id: 4, title: "Blockchain Dev", company: "CryptoX", type: "Internship", applicants: 10, totalSlots: 2, tags: ["Blockchain"] },
//   ];

//   const [applications, setApplications] = useState([
//     {
//       id: 101, studentId: "CS-2021-045", name: "Ayesha Khan", dept: "Computer Science",
//       internshipId: 1, status: "Pending", appliedOn: "Nov 8, 2025",
//       cv: { skills: ["Python", "TensorFlow", "NLP"], education: "BS CS – NUST (3.8 CGPA)", projects: "Chatbot, Image Classifier" }
//     },
//     {
//       id: 102, studentId: "EE-2020-112", name: "Usman Ali", dept: "Electrical Engineering",
//       internshipId: 2, status: "Pending", appliedOn: "Nov 7, 2025",
//       cv: { skills: ["Arduino", "IoT", "C++"], education: "BS EE – UET (3.6 CGPA)", projects: "Smart Irrigation System" }
//     },
//     {
//       id: 103, studentId: "ME-2021-089", name: "Sara Ahmed", dept: "Mechanical Engineering",
//       internshipId: 3, status: "Approved", appliedOn: "Nov 6, 2025",
//       cv: { skills: ["SolidWorks", "MATLAB"], education: "BS ME – PIEAS", projects: "Robotic Arm" }
//     },
//     {
//       id: 104, studentId: "CS-2021-050", name: "Ahmed Hassan", dept: "Computer Science",
//       internshipId: 1, status: "Pending", appliedOn: "Nov 8, 2025",
//       cv: { skills: ["Python", "Machine Learning", "PyTorch"], education: "BS CS – FAST (3.7 CGPA)", projects: "Sentiment Analysis Tool" }
//     },
//     {
//       id: 105, studentId: "CS-2020-033", name: "Fatima Zahra", dept: "Computer Science",
//       internshipId: 1, status: "Pending", appliedOn: "Nov 7, 2025",
//       cv: { skills: ["Deep Learning", "Computer Vision", "Keras"], education: "BS CS – LUMS (3.9 CGPA)", projects: "Object Detection System" }
//     },
//     {
//       id: 106, studentId: "CS-2021-078", name: "Hassan Raza", dept: "Computer Science",
//       internshipId: 1, status: "Approved", appliedOn: "Nov 7, 2025",
//       cv: { skills: ["NLP", "TensorFlow", "Python"], education: "BS CS – UET (3.6 CGPA)", projects: "Text Summarization" }
//     },
//     {
//       id: 107, studentId: "CS-2020-091", name: "Sana Malik", dept: "Computer Science",
//       internshipId: 1, status: "Pending", appliedOn: "Nov 6, 2025",
//       cv: { skills: ["Data Science", "Python", "R"], education: "BS CS – NUST (3.8 CGPA)", projects: "Predictive Analytics Dashboard" }
//     },
//     {
//       id: 108, studentId: "EE-2021-045", name: "Bilal Ahmed", dept: "Electrical Engineering",
//       internshipId: 2, status: "Pending", appliedOn: "Nov 7, 2025",
//       cv: { skills: ["IoT", "Embedded Systems", "Python"], education: "BS EE – GIKI (3.7 CGPA)", projects: "Smart Home Automation" }
//     },
//     {
//       id: 109, studentId: "EE-2020-089", name: "Zara Khan", dept: "Electrical Engineering",
//       internshipId: 2, status: "Approved", appliedOn: "Nov 6, 2025",
//       cv: { skills: ["Sensor Networks", "Arduino", "C"], education: "BS EE – UET (3.5 CGPA)", projects: "Weather Monitoring System" }
//     },
//     {
//       id: 110, studentId: "ME-2021-034", name: "Hamza Ali", dept: "Mechanical Engineering",
//       internshipId: 3, status: "Pending", appliedOn: "Nov 6, 2025",
//       cv: { skills: ["CAD", "Automation", "PLC"], education: "BS ME – NUST (3.6 CGPA)", projects: "Automated Assembly Line" }
//     },
//     {
//       id: 111, studentId: "CS-2020-102", name: "Aisha Siddiqui", dept: "Computer Science",
//       internshipId: 4, status: "Pending", appliedOn: "Nov 5, 2025",
//       cv: { skills: ["Blockchain", "Solidity", "Web3"], education: "BS CS – FAST (3.8 CGPA)", projects: "Decentralized Voting System" }
//     },
//     {
//       id: 112, studentId: "CS-2021-067", name: "Imran Shah", dept: "Computer Science",
//       internshipId: 4, status: "Approved", appliedOn: "Nov 5, 2025",
//       cv: { skills: ["Smart Contracts", "Ethereum", "JavaScript"], education: "BS CS – LUMS (3.9 CGPA)", projects: "NFT Marketplace" }
//     },
//   ]);

//   const [sentToIndustry, setSentToIndustry] = useState([
//     {
//       id: 201, studentId: "CS-2020-078", name: "Ali Raza", dept: "Computer Science",
//       internship: "Blockchain Dev", sentOn: "Nov 5, 2025",
//       report: "High potential, strong blockchain skills"
//     },
//   ]);

//   const activeStudents = [
//     { name: "Hina Malik", internship: "AI Research", startDate: "Oct 1, 2025", endDate: "Dec 31, 2025", progress: 75, tasks: "18/24", status: "On Track", mentor: "Dr. Khan" },
//     { name: "Omar Farooq", internship: "IoT Manufacturing", startDate: "Sep 15, 2025", endDate: "Jan 15, 2026", progress: 60, tasks: "12/20", status: "On Track", mentor: "Engr. Nasir" },
//     { name: "Zainab Noor", internship: "Smart Agriculture", startDate: "Oct 10, 2025", endDate: "Jan 10, 2026", progress: 90, tasks: "27/30", status: "Excellent", mentor: "Prof. Ali" },
//   ];

//   const studentLogs = {
//     "Hina Malik": [
//       { date: "Nov 8, 2025", activity: "Completed Module 3: Neural Networks", status: "completed" },
//       { date: "Nov 6, 2025", activity: "Submitted Weekly Report #5", status: "completed" },
//       { date: "Nov 4, 2025", activity: "Attended Team Sync Meeting", status: "completed" },
//       { date: "Nov 1, 2025", activity: "Started Module 3", status: "in-progress" },
//       { date: "Oct 28, 2025", activity: "Completed Module 2: Deep Learning Basics", status: "completed" },
//       { date: "Oct 25, 2025", activity: "Code Review Session with Mentor", status: "completed" },
//     ],
//     "Omar Farooq": [
//       { date: "Nov 7, 2025", activity: "IoT Sensor Integration Testing", status: "completed" },
//       { date: "Nov 5, 2025", activity: "Code Review with Mentor", status: "completed" },
//       { date: "Nov 3, 2025", activity: "Started Dashboard Development", status: "in-progress" },
//       { date: "Oct 30, 2025", activity: "Hardware Setup Completed", status: "completed" },
//       { date: "Oct 27, 2025", activity: "Requirements Gathering Meeting", status: "completed" },
//     ],
//     "Zainab Noor": [
//       { date: "Nov 8, 2025", activity: "Final Presentation Preparation", status: "completed" },
//       { date: "Nov 7, 2025", activity: "Completed All Project Milestones", status: "completed" },
//       { date: "Nov 5, 2025", activity: "Documentation Submitted", status: "completed" },
//       { date: "Nov 3, 2025", activity: "Field Testing Completed", status: "completed" },
//       { date: "Nov 1, 2025", activity: "System Integration Testing", status: "completed" },
//       { date: "Oct 29, 2025", activity: "Prototype Demonstration", status: "completed" },
//     ],
//   };

//   const pieData = [
//     { name: "Approved", value: applications.filter(a => a.status === "Approved").length },
//     { name: "Pending", value: applications.filter(a => a.status === "Pending").length },
//     { name: "Sent", value: sentToIndustry.length },
//   ];

//   // ACTIONS
//   const handleApprove = (id) => {
//     setApplications(prev => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
//     setNotifications(prev => [{ id: Date.now(), title: `Application approved (#${id})`, time: "now", read: false }, ...prev]);
//   };

//   const handleReject = (id) => {
//     setApplications(prev => prev.filter(a => a.id !== id));
//     setNotifications(prev => [{ id: Date.now(), title: `Application rejected (#${id})`, time: "now", read: false }, ...prev]);
//   };

//   const requestSendToLiaison = (app) => {
//     setConfirmSendModal({ open: true, app });
//   };

//   const confirmSend = () => {
//     const app = confirmSendModal.app;
//     if (!app) return;
//     setConfirmSendModal({ open: false, app: null });
//     setSendingToLiaison(prev => ({ ...prev, [app.id]: true }));

//     setTimeout(() => {
//       const internshipTitle = internships.find(i => i.id === app.internshipId)?.title || "";
//       setSentToIndustry(prev => [...prev, {
//         id: Date.now(),
//         studentId: app.studentId,
//         name: app.name,
//         dept: app.dept,
//         internship: internshipTitle,
//         sentOn: new Date().toLocaleDateString('en-GB'),
//         report: `Approved by Incharge. Skills: ${app.cv.skills.join(', ')}`
//       }]);

//       setApplications(prev => prev.filter(a => a.id !== app.id));
//       setSendingToLiaison(prev => ({ ...prev, [app.id]: false }));
//       setNotifications(prev => [{ id: Date.now(), title: `${app.name} sent to Industry Liaison`, time: "just now", read: false }, ...prev]);
//     }, 1200);
//   };

//   const openApplicants = (internship) => {
//     setSelectedInternship(internship);
//     setShowApplicantsModal(true);
//   };

//   const openCV = (app) => {
//     setSelectedApplicant(app);
//     setShowCVModal(true);
//   };

//   const handleNotificationClick = (n) => {
//     setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
//     setNotificationsOpen(false);
//     if (n.title && n.title.toLowerCase().includes('application')) {
//       setActiveTab('applications');
//     }
//   };

//   const handleExportReport = async () => {
//     try {
//       setExporting(true);
//       const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
//         import('html2canvas'),
//         import('jspdf')
//       ]);

//       const node = document.getElementById('internhub-overview');
//       if (!node) {
//         alert('Overview node not found');
//         setExporting(false);
//         return;
//       }

//       const canvas = await html2canvas(node, { scale: 2 });
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'pt', 'a4');
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`InternHub_Overview_${new Date().toISOString().slice(0,10)}.pdf`);
//       setExporting(false);
//     } catch (err) {
//       console.warn('PDF export failed:', err);
//       setExporting(false);
//       window.print();
//     }
//   };

//   const Badge = ({ children, color = '#3b82f6' }) => (
//     <span style={{
//       background: `${color}22`, color, padding: '6px 12px', borderRadius: 999, fontWeight: 600, fontSize: 13
//     }}>{children}</span>
//   );

//   return (
//     <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}>
//       <div style={{ display: "flex", minHeight: "100vh" }}>
//         {/* LEFT SIDEBAR - FULL HEIGHT FROM TOP */}
//         <aside style={{
//           width: "280px", background: "#193648", color: "#e2e8f0", padding: "0",
//           position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 40,
//           display: "flex", flexDirection: "column", justifyContent: "space-between"
//         }}>
//           {/* LOGO */}
//           <div style={{ padding: "28px 24px", borderBottom: "1px solid #334155" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//               <div style={{
//                 width: 44, height: 44, background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
//                 borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
//                 fontWeight: 900, fontSize: 20, color: "#fff"
//               }}>C</div>
//               <div style={{ fontWeight: 800, fontSize: 22, color: "#fff" }}>Collaxion</div>
//             </div>
//           </div>

//           {/* NAV ITEMS */}
//           <nav style={{ flex: 1, padding: "16px 0" }}>
//             {[
//               { key: "overview", label: "Overview", icon: BarChart3 },
//               { key: "internships", label: "Internships & Projects", icon: Briefcase },
//               { key: "applications", label: "Applications", icon: Users },
//               { key: "sent", label: "Sent ", icon: Send },
//               { key: "tracking", label: "Student Progress", icon: TrendingUp },
//             ].map(item => {
//               const Icon = item.icon;
//               return (
//                 <button
//                   key={item.key}
//                   onClick={() => { setActiveTab(item.key); setMobileMenuOpen(false); }}
//                   style={{
//                     display: "flex", alignItems: "center", gap: "14px", width: "100%", padding: "14px 24px",
//                     background: activeTab === item.key ? "rgba(59, 130, 246, 0.15)" : "transparent",
//                     color: activeTab === item.key ? "#60a5fa" : "#94a3b8",
//                     border: "none", fontSize: "14.5px", fontWeight: activeTab === item.key ? "600" : "500",
//                     cursor: "pointer", transition: "0.2s", borderLeft: activeTab === item.key ? "4px solid #3b82f6" : "4px solid transparent"
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.background = activeTab === item.key ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.05)"}
//                   onMouseLeave={e => e.currentTarget.style.background = activeTab === item.key ? "rgba(59, 130, 246, 0.15)" : "transparent"}
//                 >
//                   <Icon size={19} /> {item.label}
//                 </button>
//               );
//             })}
//           </nav>

//           {/* USER PROFILE SECTION */}
//           <div style={{ padding: "20px 24px", borderTop: "1px solid #334155" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
//               <div style={{
//                 width: "48px", height: "48px", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
//                 borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
//                 color: "#fff", fontWeight: 700, fontSize: 17
//               }}>JM</div>
//               <div>
//                 <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Junaid Malik</div>
//                 <div style={{ fontSize: 13, color: "#94a3b8" }}>Internship Incharge</div>
//               </div>
//             </div>

//             <button style={{
//               display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 16px",
//               background: "rgba(239, 68, 68, 0.1)", color: "#fca5a5", border: "none", borderRadius: 12,
//               fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "0.2s"
//             }}
//             onMouseEnter={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"}
//             onMouseLeave={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
//             >
//               <LogOut size={18} /> Logout
//             </button>
//           </div>
//         </aside>

//         {/* MAIN CONTENT - SPACED FROM SIDEBAR */}
//         <main style={{ marginLeft: "280px", flex: 1, padding: "28px 32px", background: "#f8fafc", minHeight: "100vh" }}>
//           {/* TOP BAR WITH NOTIFICATIONS */}
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
//             <div>
//               <h1 style={{ fontSize: 28, fontWeight: 800, color: "#193648", margin: 0 }}>
//                 {activeTab === "overview" && "Welcome to Intern Hub"}
//                 {activeTab === "internships" && "Internships & Projects"}
//                 {activeTab === "applications" && "Student Applications"}
//                 {activeTab === "sent" && "Sent to Industry"}
//                 {activeTab === "tracking" && "Student Progress"}
//               </h1>
//               <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 15 }}>
//                 {activeTab === "overview" && "Real-time insights into applications, approvals, and progress"}
//                 {activeTab === "internships" && "Manage all internship and project postings"}
//                 {activeTab === "applications" && "Review and process student applications"}
//                 {activeTab === "sent" && "Track students forwarded to industry liaison"}
//                 {activeTab === "tracking" && "Monitor real-time progress and activities"}
//               </p>
//             </div>

//             <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//               {/* NOTIFICATIONS */}
//               <div style={{ position: 'relative' }}>
//                 <button onClick={() => setNotificationsOpen(!notificationsOpen)} style={{
//                   background: '#fff', border: '1px solid #e2e8f0', cursor: 'pointer',
//                   width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center',
//                   justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'relative'
//                 }}>
//                   <Bell size={20} color="#64748b" />
//                   {notifications.filter(n => !n.read).length > 0 && (
//                     <span style={{
//                       position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff',
//                       fontSize: 11, width: 20, height: 20, borderRadius: 999, display: 'flex',
//                       alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '2px solid #fff'
//                     }}>
//                       {notifications.filter(n => !n.read).length}
//                     </span>
//                   )}
//                 </button>

//                 <AnimatePresence>
//                   {notificationsOpen && (
//                     <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{
//                       position: 'absolute', right: 0, top: 52, width: 380, background: '#fff',
//                       boxShadow: '0 12px 32px rgba(0,0,0,0.12)', borderRadius: 16, zIndex: 60, border: "1px solid #e2e8f0"
//                     }}>
//                       <div style={{ padding: 16, borderBottom: '1px solid #eef2ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <strong style={{ fontSize: 16 }}>Notifications</strong>
//                         <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} style={{
//                           border: 'none', background: 'transparent', color: '#3b82f6', fontSize: 13, cursor: 'pointer', fontWeight: 600
//                         }}>
//                           Mark all read
//                         </button>
//                       </div>
//                       <div style={{ maxHeight: 320, overflow: 'auto' }}>
//                         {notifications.length === 0 && <div style={{ padding: 20, color: '#94a3b8', textAlign: 'center' }}>No notifications</div>}
//                         {notifications.map(n => (
//                           <div key={n.id} onClick={() => handleNotificationClick(n)} style={{
//                             padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
//                             cursor: 'pointer', background: n.read ? 'transparent' : '#f0f9ff', borderBottom: "1px solid #f1f5f9",
//                             transition: '0.2s'
//                           }}
//                           onMouseEnter={e => e.currentTarget.style.background = n.read ? '#f8fafc' : '#e0f2fe'}
//                           onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : '#f0f9ff'}
//                           >
//                             <div>
//                               <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{n.title}</div>
//                               <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{n.time}</div>
//                             </div>
//                             {!n.read && <div style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: 99, flexShrink: 0 }} />}
//                           </div>
//                         ))}
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>
//           </div>

//           <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
//             {/* OVERVIEW */}
//             {activeTab === "overview" && (
//               <div id="internhub-overview" style={{ background: "#f8fafc", borderRadius: 16, padding: 0 }}>
//                 <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 24 }}>
//                   <button onClick={handleExportReport} disabled={exporting} style={{
//                     background: "#25516dff", color: "#fff", border: "none", padding: "12px 18px",
//                     borderRadius: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", cursor: 'pointer',
//                     boxShadow: "0 4px 12px rgba(59,130,246,0.25)", transition: '0.2s'
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
//                   onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//                   >
//                     <Download size={17} /> {exporting ? 'Exporting…' : 'Export PDF'}
//                   </button>
//                 </div>

//                 {/* Stats Grid */}
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "32px" }}>
//                   {[
//                     { label: "Total Postings", value: internships.length, icon: Briefcase, color: "#8b5cf6" },
//                     { label: "Pending", value: applications.filter(a => a.status === "Pending").length, icon: Clock, color: "#f59e0b" },
//                     { label: "Approved", value: applications.filter(a => a.status === "Approved").length, icon: CheckCircle, color: "#10b981" },
//                     { label: "Sent to Industry", value: sentToIndustry.length, icon: Send, color: "#3b82f6" },
//                   ].map((s, i) => (
//                     <motion.div
//                       key={i}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: i * 0.1 }}
//                       style={{
//                         background: "#fff", padding: "24px", borderRadius: "16px",
//                         boxShadow: "0 8px 25px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "18px",
//                         border: "1px solid #f1f5f9"
//                       }}
//                     >
//                       <div style={{
//                         width: "60px", height: "60px", background: `${s.color}15`,
//                         borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: s.color
//                       }}>
//                         <s.icon size={26} />
//                       </div>
//                       <div>
//                         <p style={{ fontSize: "14px", color: "#64748b", margin: 0, fontWeight: 500 }}>{s.label}</p>
//                         <p style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>{s.value}</p>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>

//                 {/* Charts */}
//                 <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "32px" }}>
//                   <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
//                     <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "#1e293b" }}>Weekly Application Trend</h3>
//                     <ResponsiveContainer width="100%" height={260}>
//                       <LineChart data={[
//                         { name: "Mon", apps: 4, sent: 1 }, { name: "Tue", apps: 6, sent: 2 },
//                         { name: "Wed", apps: 8, sent: 3 }, { name: "Thu", apps: 5, sent: 3 },
//                         { name: "Fri", apps: 7, sent: 4 }, { name: "Sat", apps: 3, sent: 2 }, { name: "Sun", apps: 2, sent: 1 }
//                       ]}>
//                         <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" />
//                         <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
//                         <YAxis tick={{ fill: '#64748b' }} />
//                         <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
//                         <Line type="monotone" dataKey="apps" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} name="Applications" />
//                         <Line type="monotone" dataKey="sent" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="Sent" />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
//                     <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "#1e293b" }}>Status Distribution</h3>
//                     <ResponsiveContainer width="100%" height={260}>
//                       <PieChart>
//                         <Pie data={pieData} cx="50%" cy="50%" outerRadius={85} innerRadius={60} dataKey="value" label>
//                           {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//                         </Pie>
//                         <Tooltip />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(2,6,23,0.06)", border: "1px solid #f1f5f9" }}>
//                   <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "#1e293b" }}>Recent Activity</h3>
//                   <div style={{ display: "flex", gap: 12, flexWrap: 'wrap' }}>
//                     {[...applications.slice(0, 3), ...sentToIndustry.slice(0, 2)].map((a, i) => (
//                       <div key={i} style={{ borderRadius: 12, padding: 16, minWidth: 220, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #e2e8f0' }}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                           <div>
//                             <strong style={{ fontSize: 14, color: '#0f172a' }}>{a.name}</strong>
//                             <div style={{ fontSize: 12, color: '#64748b' }}>{a.studentId || ''} • {a.dept || ''}</div>
//                           </div>
//                           <div style={{ fontSize: 12, color: '#94a3b8' }}>{a.appliedOn || a.sentOn}</div>
//                         </div>
//                         <div style={{ fontSize: 13, color: '#475569' }}>
//                           Applied for <strong>{internships.find(int => int.id === a.internshipId)?.title || a.internship}</strong>
//                         </div>
//                         <div style={{ display: 'flex', gap: 8 }}>
//                           {a.status === 'Pending' && <Badge color='#f59e0b'>Pending</Badge>}
//                           {a.status === 'Approved' && <Badge color='#10b981'>Approved</Badge>}
//                           {sentToIndustry.find(s => s.studentId === a.studentId) && <Badge color='#3b82f6'>Sent</Badge>}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "internships" && (
//               <div>
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", marginTop: 16 }}>
//                   {internships.map(i => (
//                     <div key={i.id} style={{ background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(2,6,23,0.06)", border: "1px solid #f1f5f9" }}>
//                       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
//                         <div>
//                           <h3 style={{ fontWeight: 700, margin: 0, fontSize: 17, color: '#0f172a' }}>{i.title}</h3>
//                           <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0 0" }}>{i.company}</p>
//                         </div>
//                         <MoreVertical size={18} color="#94a3b8" style={{ cursor: 'pointer' }} />
//                       </div>
                      
//                       <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
//                         <span style={{
//                           background: i.type === "Internship" ? "#dbeafe" : "#fef3c7",
//                           color: i.type === "Internship" ? "#1e40af" : "#92400e",
//                           padding: '6px 12px', borderRadius: 999, fontWeight: 700, fontSize: 12
//                         }}>{i.type}</span>
//                         {i.tags.map((t, idx) => (
//                           <span key={idx} style={{ background: '#f1f5f9', padding: '6px 10px', borderRadius: 8, fontSize: 12, color: '#475569', fontWeight: 600 }}>{t}</span>
//                         ))}
//                       </div>

//                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
//                         <button onClick={() => openApplicants(i)} style={{
//                           border: '1px solid #e2e8f0', background: '#fff', color: '#3b82f6',
//                           fontWeight: 700, cursor: 'pointer', padding: '10px 14px', borderRadius: 10,
//                           display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, transition: '0.2s'
//                         }}
//                         onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
//                         onMouseLeave={e => e.currentTarget.style.background = '#fff'}
//                         >
//                           <Users size={16} /> {i.applicants} Applicants
//                         </button>
//                         <button style={{
//                           background: '#3b82f6', borderRadius: 10, padding: '10px 16px',
//                           border: 'none', fontWeight: 700, color: '#fff', cursor: 'pointer',
//                           fontSize: 14, transition: '0.2s', boxShadow: '0 4px 12px rgba(59,130,246,0.2)'
//                         }}
//                         onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
//                         onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
//                         >Edit</button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === "applications" && (
//               <div>
//                 {applications.length === 0 ? (
//                   <div style={{ background: '#fff', padding: 60, borderRadius: 16, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
//                     <Users size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
//                     <p style={{ color: "#94a3b8", fontSize: 16 }}>No applications at the moment</p>
//                   </div>
//                 ) : (
//                   <div style={{ display: 'grid', gap: 14 }}>
//                     {applications.map(app => (
//                       <div key={app.id} style={{
//                         background: '#fff', padding: 20, borderRadius: 14, display: 'flex',
//                         justifyContent: 'space-between', alignItems: 'center',
//                         boxShadow: '0 6px 18px rgba(2,6,23,0.04)', border: '1px solid #f1f5f9'
//                       }}>
//                         <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
//                           <div style={{
//                             width: 60, height: 60, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//                             borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                             fontWeight: 800, fontSize: 18, color: '#fff', boxShadow: '0 4px 12px rgba(139,92,246,0.25)'
//                           }}>{app.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
//                           <div>
//                             <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>{app.name}</div>
//                             <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{app.studentId} • {app.dept}</div>
//                             <div style={{ fontSize: 14, marginTop: 6, color: '#475569' }}>
//                               <strong>{internships.find(i => i.id === app.internshipId)?.title || '-'}</strong>
//                             </div>
//                           </div>
//                         </div>

//                         <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
//                           {app.status === 'Pending' && (
//                             <>
//                               <button onClick={() => openCV(app)} style={{
//                                 background: '#3b82f6', color: '#fff', borderRadius: 10, padding: '11px 16px',
//                                 border: 'none', display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer',
//                                 fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(59,130,246,0.2)', transition: '0.2s'
//                               }}
//                               onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
//                               onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//                               >
//                                 <Eye size={16} /> View Request
//                               </button>
//                               <button onClick={() => handleApprove(app.id)} style={{
//                                 background: '#10b981', color: '#fff', borderRadius: 10, padding: '11px 16px',
//                                 border: 'none', display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer',
//                                 fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(16,185,129,0.2)', transition: '0.2s'
//                               }}
//                               onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
//                               onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//                               >
//                                 <CheckCircle size={16} /> Approve
//                               </button>
//                               <button onClick={() => handleReject(app.id)} style={{
//                                 background: '#ef4444', color: '#fff', borderRadius: 10, padding: '11px 16px',
//                                 border: 'none', display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer',
//                                 fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(239,68,68,0.2)', transition: '0.2s'
//                               }}
//                               onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
//                               onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//                               >
//                                 <XCircle size={16} /> Reject
//                               </button>
//                             </>
//                           )}

//                           {app.status === 'Approved' && (
//                             <>
//                               <Badge color='#10b981'>Approved</Badge>
//                               <button onClick={() => requestSendToLiaison(app)} disabled={sendingToLiaison[app.id]} style={{
//                                 background: '#8b5cf6', color: '#fff', borderRadius: 10, padding: '11px 16px',
//                                 border: 'none', display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer',
//                                 fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(139,92,246,0.2)', transition: '0.2s'
//                               }}
//                               onMouseEnter={e => !sendingToLiaison[app.id] && (e.currentTarget.style.transform = 'translateY(-2px)')}
//                               onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//                               >
//                                 {sendingToLiaison[app.id] ? 'Sending…' : <><Mail size={16} /> Send to Liaison</>}
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === "sent" && (
//               <div>
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", marginTop: 12 }}>
//                   {sentToIndustry.map(s => (
//                     <div key={s.id} style={{
//                       background: "#fff", padding: "22px", borderRadius: "16px",
//                       border: "1px solid #e6eefc", boxShadow: "0 6px 18px rgba(2,6,23,0.04)"
//                     }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
//                         <div style={{ flex: 1 }}>
//                           <h3 style={{ margin: 0, fontWeight: 800, fontSize: 17, color: '#0f172a' }}>{s.name}</h3>
//                           <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{s.studentId} • {s.dept}</div>
//                           <div style={{ fontSize: 14, color: '#3b82f6', fontWeight: 600, marginTop: 8 }}>{s.internship}</div>
//                         </div>
//                         <div style={{ textAlign: 'right' }}>
//                           <div style={{ fontSize: 12, color: '#94a3b8' }}>Sent</div>
//                           <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{s.sentOn}</div>
//                         </div>
//                       </div>

//                       <p style={{
//                         marginTop: 14, background: '#f8fafc', padding: 14, borderRadius: 10,
//                         color: '#475569', fontSize: 13, lineHeight: 1.6, border: '1px solid #f1f5f9'
//                       }}>{s.report}</p>

//                       <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
//                         <button onClick={() => {
//                           navigator.clipboard && navigator.clipboard.writeText(s.report);
//                           alert('Report copied to clipboard');
//                         }} style={{
//                           flex: 1, border: 'none', background: '#eef2ff', color: '#3b82f6',
//                           padding: '10px 14px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14
//                         }}>
//                           Copy Report
//                         </button>
//                         <button onClick={() => alert('Download feature - integrate backend endpoint')} style={{
//                           flex: 1, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b',
//                           padding: '10px 14px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14,
//                           display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
//                         }}>
//                           <Download size={16} /> PDF
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === "tracking" && (
//               <div>
//                 <div style={{ display: 'grid', gap: 18, marginTop: 20 }}>
//                   {activeStudents.map((s, i) => (
//                     <div key={i} style={{
//                       background: '#fff', padding: 24, borderRadius: 16,
//                       boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9'
//                     }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
//                         <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: 1 }}>
//                           <div style={{
//                             width: 64, height: 64, borderRadius: 14,
//                             background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//                             display: 'flex', alignItems: 'center', justifyContent: 'center',
//                             fontWeight: 800, fontSize: 20, color: '#fff',
//                             boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)'
//                           }}>{s.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
//                           <div style={{ flex: 1 }}>
//                             <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', marginBottom: 4 }}>{s.name}</div>
//                             <div style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>
//                               <strong style={{ color: '#3b82f6' }}>{s.internship}</strong>
//                             </div>
//                             <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
//                               <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
//                                 <Users size={14} />
//                                 Mentor: <strong>{s.mentor}</strong>
//                               </div>
//                               <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
//                                 <Calendar size={14} />
//                                 {s.startDate} - {s.endDate}
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <div style={{ textAlign: 'right' }}>
//                           <div style={{
//                             background: s.status === 'Excellent' ? '#dcfce7' : s.status === 'On Track' ? '#dbeafe' : '#fef3c7',
//                             color: s.status === 'Excellent' ? '#166534' : s.status === 'On Track' ? '#1e40af' : '#92400e',
//                             padding: '8px 16px', borderRadius: 999, fontWeight: 700, fontSize: 13, marginBottom: 8
//                           }}>{s.status}</div>
//                           <div style={{ fontSize: 13, color: '#94a3b8' }}>Progress: <strong style={{ color: '#0f172a' }}>{s.progress}%</strong></div>
//                         </div>
//                       </div>

//                       <div style={{ marginBottom: 18 }}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
//                           <div style={{ fontWeight: 600, fontSize: 14, color: '#475569' }}>Overall Progress</div>
//                           <div style={{ fontSize: 14, fontWeight: 700, color: '#3b82f6' }}>{s.tasks}</div>
//                         </div>
//                         <div style={{ height: 12, background: '#e6eefc', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
//                           <motion.div
//                             initial={{ width: 0 }}
//                             animate={{ width: `${s.progress}%` }}
//                             transition={{ duration: 0.8, ease: "easeOut" }}
//                             style={{
//                               height: '100%',
//                               background: s.progress >= 80 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : s.progress >= 50 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
//                               borderRadius: 999,
//                               boxShadow: `0 0 10px ${s.progress >= 80 ? '#22c55e' : s.progress >= 50 ? '#f59e0b' : '#ef4444'}40`
//                             }}
//                           />
//                         </div>
//                       </div>

//                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
//                         <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
//                           <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Completed</div>
//                           <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>
//                             {parseInt(s.tasks.split('/')[0])}
//                           </div>
//                         </div>
//                         <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
//                           <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Total Tasks</div>
//                           <div style={{ fontSize: 20, fontWeight: 800, color: '#3b82f6' }}>
//                             {parseInt(s.tasks.split('/')[1])}
//                           </div>
//                         </div>
//                         <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
//                           <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Remaining</div>
//                           <div style={{ fontSize: 20, fontWeight: 800, color: '#f59e0b' }}>
//                             {parseInt(s.tasks.split('/')[1]) - parseInt(s.tasks.split('/')[0])}
//                           </div>
//                         </div>
//                       </div>

//                       <div style={{ display: 'flex', gap: 10 }}>
//                         <button
//                           onClick={() => setViewLogModal({ open: true, student: s })}
//                           style={{
//                             flex: 1, border: 'none', background: '#3b82f6', color: '#fff',
//                             padding: '12px 16px', borderRadius: 10, fontWeight: 600, fontSize: 14,
//                             cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
//                             boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)', transition: '0.2s'
//                           }}
//                           onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
//                           onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//                         >
//                           <FileText size={16} /> View Activity Log
//                         </button>
//                         <button style={{
//                           flex: 1, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b',
//                           padding: '12px 16px', borderRadius: 10, fontWeight: 600, fontSize: 14,
//                           cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
//                           transition: '0.2s'
//                         }}
//                         onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
//                         onMouseLeave={e => e.currentTarget.style.background = '#fff'}
//                         >
//                           <Mail size={16} /> Send Message
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//           </motion.div>
//         </main>
//       </div>

//       {/* APPLICANTS MODAL */}
//       <AnimatePresence>
//         {showApplicantsModal && selectedInternship && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             style={{
//               position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
//               display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
//             }}
//             onClick={() => setShowApplicantsModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               style={{
//                 width: '100%', maxWidth: 900, background: '#fff', borderRadius: 16,
//                 maxHeight: '85vh', display: 'flex', flexDirection: 'column',
//                 boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
//               }}
//               onClick={e => e.stopPropagation()}
//             >
//               <div style={{
//                 padding: 20, borderBottom: '1px solid #e2e8f0',
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center'
//               }}>
//                 <div>
//                   <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
//                     {selectedInternship.title}
//                   </h3>
//                   <div style={{ color: '#64748b', marginTop: 4 }}>
//                     {selectedInternship.company} • {applications.filter(a => a.internshipId === selectedInternship.id).length} Applicants
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowApplicantsModal(false)}
//                   style={{
//                     border: 'none', background: '#f1f5f9', cursor: 'pointer',
//                     width: 36, height: 36, borderRadius: 8, display: 'flex',
//                     alignItems: 'center', justifyContent: 'center', transition: '0.2s'
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
//                   onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div style={{ padding: 20, flex: 1, overflow: 'auto' }}>
//                 {applications.filter(a => a.internshipId === selectedInternship.id).length === 0 ? (
//                   <div style={{ padding: 40, color: '#94a3b8', textAlign: 'center' }}>
//                     <Users size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
//                     <p>No applicants for this posting yet</p>
//                   </div>
//                 ) : (
//                   <div style={{ display: 'grid', gap: 12 }}>
//                     {applications.filter(a => a.internshipId === selectedInternship.id).map(a => (
//                       <div key={a.id} style={{
//                         display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
//                         padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0'
//                       }}>
//                         <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
//                           <div style={{
//                             width: 56, height: 56, borderRadius: 12,
//                             background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//                             display: 'flex', alignItems: 'center', justifyContent: 'center',
//                             fontWeight: 800, fontSize: 18, color: '#fff',
//                             boxShadow: '0 4px 12px rgba(139,92,246,0.2)'
//                           }}>{a.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
//                           <div style={{ flex: 1 }}>
//                             <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>{a.name}</div>
//                             <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{a.studentId} • {a.dept}</div>
//                             <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Applied: {a.appliedOn}</div>
//                           </div>
//                         </div>
//                         <div style={{ display: 'flex', gap: 8 }}>
//                           <button onClick={() => { setShowApplicantsModal(false); openCV(a); }} style={{
//                             border: 'none', background: '#3b82f6', color: '#fff',
//                             padding: '10px 16px', borderRadius: 10, fontWeight: 600,
//                             cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
//                             fontSize: 14, boxShadow: '0 4px 12px rgba(59,130,246,0.2)', transition: '0.2s'
//                           }}
//                           onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
//                           onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//                           >
//                             <Eye size={16} /> View CV
//                           </button>
//                           {a.status === 'Pending' && (
//                             <button onClick={() => handleApprove(a.id)} style={{
//                               border: 'none', background: '#10b981', color: '#fff',
//                               padding: '10px 16px', borderRadius: 10, fontWeight: 600,
//                               cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
//                               fontSize: 14, boxShadow: '0 4px 12px rgba(16,185,129,0.2)', transition: '0.2s'
//                             }}
//                             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
//                             onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//                             >
//                               <CheckCircle size={16} /> Approve
//                             </button>
//                           )}
//                           {a.status === 'Approved' && (
//                             <button onClick={() => requestSendToLiaison(a)} style={{
//                               border: 'none', background: '#8b5cf6', color: '#fff',
//                               padding: '10px 16px', borderRadius: 10, fontWeight: 600,
//                               cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
//                               fontSize: 14, boxShadow: '0 4px 12px rgba(139,92,246,0.2)', transition: '0.2s'
//                             }}
//                             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
//                             onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//                             >
//                               <Send size={16} /> Send
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* CV MODAL */}
//       <AnimatePresence>
//         {showCVModal && selectedApplicant && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             style={{
//               position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
//               display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
//             }}
//             onClick={() => setShowCVModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 10 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 10 }}
//               style={{
//                 width: '100%', maxWidth: 720, background: '#fff', borderRadius: 16,
//                 maxHeight: '85vh', display: 'flex', flexDirection: 'column',
//                 boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
//               }}
//               onClick={e => e.stopPropagation()}
//             >
//               <div style={{
//                 padding: 20, borderBottom: '1px solid #e2e8f0',
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center'
//               }}>
//                 <div>
//                   <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
//                     {selectedApplicant.name}
//                   </h3>
//                   <div style={{ color: '#64748b', marginTop: 4 }}>
//                     {selectedApplicant.studentId} • {selectedApplicant.dept}
//                   </div>
//                 </div>
//                 <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
//                   <div style={{ color: '#94a3b8', fontSize: 14 }}>{selectedApplicant.appliedOn}</div>
//                   <button
//                     onClick={() => setShowCVModal(false)}
//                     style={{
//                       border: 'none', background: '#f1f5f9', cursor: 'pointer',
//                       width: 36, height: 36, borderRadius: 8, display: 'flex',
//                       alignItems: 'center', justifyContent: 'center', transition: '0.2s'
//                     }}
//                     onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
//                     onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
//               </div>

//               <div style={{ padding: 24, flex: 1, overflow: 'auto' }}>
//                 <div style={{ marginBottom: 20 }}>
//                   <h4 style={{ margin: 0, display: 'flex', gap: 8, alignItems: 'center', color: '#0f172a', fontSize: 16 }}>
//                     <Award size={18} color="#3b82f6" /> Education
//                   </h4>
//                   <div style={{
//                     background: '#f8fafc', padding: 16, borderRadius: 12, marginTop: 10,
//                     border: '1px solid #e2e8f0', color: '#475569', fontSize: 14, lineHeight: 1.6
//                   }}>
//                     {selectedApplicant.cv.education}
//                   </div>
//                 </div>

//                 <div style={{ marginBottom: 20 }}>
//                   <h4 style={{ margin: 0, display: 'flex', gap: 8, alignItems: 'center', color: '#0f172a', fontSize: 16 }}>
//                     <FileText size={18} color="#3b82f6" /> Skills
//                   </h4>
//                   <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
//                     {selectedApplicant.cv.skills.map((skill, i) => (
//                       <div key={i} style={{
//                         background: '#eef2ff', padding: '8px 14px', borderRadius: 999,
//                         fontWeight: 600, fontSize: 13, color: '#3b82f6'
//                       }}>
//                         {skill}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div style={{ marginBottom: 20 }}>
//                   <h4 style={{ margin: 0, display: 'flex', gap: 8, alignItems: 'center', color: '#0f172a', fontSize: 16 }}>
//                     <Briefcase size={18} color="#3b82f6" /> Projects
//                   </h4>
//                   <div style={{
//                     background: '#f8fafc', padding: 16, borderRadius: 12, marginTop: 10,
//                     border: '1px solid #e2e8f0', color: '#475569', fontSize: 14, lineHeight: 1.6
//                   }}>
//                     {selectedApplicant.cv.projects}
//                   </div>
//                 </div>

//                 <div style={{ display: 'flex', gap: 12, marginTop: 20, paddingTop: 20, borderTop: '1px solid #e2e8f0' }}>
//                   {selectedApplicant.status === 'Pending' && (
//                     <>
//                       <button onClick={() => { handleApprove(selectedApplicant.id); setShowCVModal(false); }} style={{
//                         flex: 1, background: '#10b981', color: '#fff', padding: '12px 16px',
//                         borderRadius: 10, border: 'none', fontWeight: 600, display: 'flex',
//                         alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
//                         fontSize: 14, boxShadow: '0 4px 12px rgba(16,185,129,0.2)', transition: '0.2s'
//                       }}
//                       onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
//                       onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//                       >
//                         <CheckCircle size={18} /> Approve Application
//                       </button>
//                       <button onClick={() => { handleReject(selectedApplicant.id); setShowCVModal(false); }} style={{
//                         flex: 1, background: '#ef4444', color: '#fff', padding: '12px 16px',
//                         borderRadius: 10, border: 'none', fontWeight: 600, display: 'flex',
//                         alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
//                         fontSize: 14, boxShadow: '0 4px 12px rgba(239,68,68,0.2)', transition: '0.2s'
//                       }}
//                       onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
//                       onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//                       >
//                         <XCircle size={18} /> Reject Application
//                       </button>
//                     </>
//                   )}

//                   {selectedApplicant.status === 'Approved' && !sentToIndustry.find(s => s.studentId === selectedApplicant.studentId) && (
//                     <button onClick={() => { setShowCVModal(false); requestSendToLiaison(selectedApplicant); }} style={{
//                       flex: 1, background: '#8b5cf6', color: '#fff', padding: '12px 16px',
//                       borderRadius: 10, border: 'none', fontWeight: 600, display: 'flex',
//                       alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
//                       fontSize: 14, boxShadow: '0 4px 12px rgba(139,92,246,0.2)', transition: '0.2s'
//                     }}
//                     onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
//                     onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//                     >
//                       <Mail size={18} /> Send to Industry Liaison
//                     </button>
//                   )}

//                   {sentToIndustry.find(s => s.studentId === selectedApplicant.studentId) && (
//                     <div style={{
//                       flex: 1, background: '#dcfce7', color: '#166534', padding: '12px 16px',
//                       borderRadius: 10, fontWeight: 700, display: 'flex', alignItems: 'center',
//                       justifyContent: 'center', gap: 8, fontSize: 14
//                     }}>
//                       <CheckCircle size={18} /> Sent to Industry Liaison
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* CONFIRM SEND MODAL */}
//       <AnimatePresence>
//         {confirmSendModal.open && confirmSendModal.app && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             style={{
//               position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 120,
//               display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
//             }}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 8 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 8 }}
//               style={{
//                 width: '100%', maxWidth: 480, background: '#fff', borderRadius: 16,
//                 padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
//               }}
//             >
//               <h3 style={{ marginTop: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
//                 Send to Industry Liaison
//               </h3>
//               <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: 14 }}>
//                 You're about to forward <strong style={{ color: '#0f172a' }}>{confirmSendModal.app.name}</strong>'s 
//                 approved application to the Industry Liaison. This action will remove it from the Incharge queue and 
//                 create a record in the Sent list. Do you want to continue?
//               </p>
//               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
//                 <button
//                   onClick={() => setConfirmSendModal({ open: false, app: null })}
//                   style={{
//                     border: '1px solid #e2e8f0', background: '#fff', color: '#64748b',
//                     padding: '10px 16px', borderRadius: 10, fontWeight: 600, cursor: 'pointer',
//                     fontSize: 14, transition: '0.2s'
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
//                   onMouseLeave={e => e.currentTarget.style.background = '#fff'}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmSend}
//                   style={{
//                     border: 'none', background: '#8b5cf6', color: '#fff',
//                     padding: '10px 20px', borderRadius: 10, fontWeight: 600, cursor: 'pointer',
//                     fontSize: 14, boxShadow: '0 4px 12px rgba(139,92,246,0.25)', transition: '0.2s'
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.background = '#7c3aed'}
//                   onMouseLeave={e => e.currentTarget.style.background = '#8b5cf6'}
//                 >
//                   Yes, Send
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* VIEW LOG MODAL */}
//       <AnimatePresence>
//         {viewLogModal.open && viewLogModal.student && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             style={{
//               position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
//               display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
//             }}
//             onClick={() => setViewLogModal({ open: false, student: null })}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 10 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 10 }}
//               style={{
//                 width: '100%', maxWidth: 720, background: '#fff', borderRadius: 16,
//                 maxHeight: '85vh', display: 'flex', flexDirection: 'column',
//                 boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
//               }}
//               onClick={e => e.stopPropagation()}
//             >
//               <div style={{
//                 padding: 20, borderBottom: '1px solid #e2e8f0',
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center'
//               }}>
//                 <div>
//                   <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
//                     Activity Log: {viewLogModal.student.name}
//                   </h3>
//                   <div style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>
//                     {viewLogModal.student.internship} • Mentor: {viewLogModal.student.mentor}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setViewLogModal({ open: false, student: null })}
//                   style={{
//                     border: 'none', background: '#f1f5f9', cursor: 'pointer',
//                     width: 36, height: 36, borderRadius: 8, display: 'flex',
//                     alignItems: 'center', justifyContent: 'center', transition: '0.2s'
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
//                   onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div style={{ padding: 20, flex: 1, overflow: 'auto' }}>
//                 {studentLogs[viewLogModal.student.name] ? (
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//                     {studentLogs[viewLogModal.student.name].map((log, idx) => (
//                       <motion.div
//                         key={idx}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: idx * 0.05 }}
//                         style={{
//                           padding: 16, borderRadius: 12, background: '#f8fafc',
//                           border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14
//                         }}
//                       >
//                         <div style={{
//                           width: 12, height: 12, borderRadius: 999,
//                           background: log.status === 'completed' ? '#10b981' : '#f59e0b',
//                           flexShrink: 0, boxShadow: `0 0 0 4px ${log.status === 'completed' ? '#10b98120' : '#f59e0b20'}`
//                         }} />
//                         <div style={{ flex: 1 }}>
//                           <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 4 }}>
//                             {log.activity}
//                           </div>
//                           <div style={{ fontSize: 13, color: '#64748b' }}>{log.date}</div>
//                         </div>
//                         <div style={{
//                           padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
//                           background: log.status === 'completed' ? '#dcfce7' : '#fef3c7',
//                           color: log.status === 'completed' ? '#166534' : '#92400e'
//                         }}>
//                           {log.status === 'completed' ? 'Completed' : 'In Progress'}
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
//                     <FileText size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
//                     <p>No activity logs found</p>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }







// import React, { useEffect, useState, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Briefcase, Users, Send, CheckCircle, XCircle, Clock,
//   BarChart3, X, Bell, Download, Mail, LogOut, FileText, Eye,
//   ChevronRight, Loader2, Target, Zap, Calendar, RefreshCw,
//   Search, TrendingUp, AlertCircle, Award
// } from "lucide-react";
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
//   ResponsiveContainer, PieChart, Pie, Cell
// } from "recharts";

// // ─── CONFIG ─────────────────────────────────────────────────────────────
// const BASE = "http://localhost:5000";
// const API  = `${BASE}/api/incharge`;



// // ─── HELPERS ─────────────────────────────────────────────────────────────
// const fmt = (iso) =>
//   iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

// const initials = (name = "") =>
//   name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// const STATUS_CONFIG = {
//   pending:         { label: "Pending",         bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
//   approved:        { label: "Approved",        bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
//   rejected:        { label: "Rejected",        bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
//   sent_to_liaison: { label: "Sent to Liaison", bg: "#E2EEF9", color: "#193648", border: "#CFE0F0" },
// };

// // ─── SMALL COMPONENTS ────────────────────────────────────────────────────
// function StatusBadge({ status }) {
//   const c = STATUS_CONFIG[status] || { label: status, bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" };
//   return (
//     <span style={{
//       padding: "4px 11px", borderRadius: 99, fontSize: 11, fontWeight: 700,
//       background: c.bg, color: c.color, border: `1px solid ${c.border}`,
//       textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap"
//     }}>{c.label}</span>
//   );
// }

// function SkillTag({ label, matched }) {
//   return (
//     <span style={{
//       padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
//       background: matched ? "#eff6ff" : "#f8fafc",
//       color: matched ? "#1d4ed8" : "#64748b",
//       border: `1px solid ${matched ? "#bfdbfe" : "#e2e8f0"}`
//     }}>{label}</span>
//   );
// }

// function Spinner({ size = 18, color = "#193648" }) {
//   return (
//     <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
//       style={{ width: size, height: size, display: "inline-flex" }}>
//       <Loader2 size={size} color={color} />
//     </motion.div>
//   );
// }

// function Toast({ message, type, onClose }) {
//   useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
//   const palette = { success: "#15803d", error: "#be123c", info: "#1d4ed8", warn: "#b45309" };
//   const bgPalette = { success: "#f0fdf4", error: "#fff1f2", info: "#eff6ff", warn: "#fffbeb" };
//   const borderPalette = { success: "#bbf7d0", error: "#fecdd3", info: "#bfdbfe", warn: "#fde68a" };
//   return (
//     <motion.div initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }}
//       exit={{ opacity: 0, y: 16, x: "-50%" }}
//       style={{
//         position: "fixed", bottom: 28, left: "50%", zIndex: 9999,
//         background: bgPalette[type] || "#fff", border: `1px solid ${borderPalette[type] || "#e2e8f0"}`,
//         borderRadius: 12, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10,
//         boxShadow: "0 8px 30px rgba(0,0,0,0.1)", minWidth: 280, maxWidth: 420
//       }}>
//       <div style={{ width: 8, height: 8, borderRadius: "50%", background: palette[type] || "#64748b", flexShrink: 0 }} />
//       <span style={{ color: "#0f172a", fontSize: 13.5, fontWeight: 500, flex: 1 }}>{message}</span>
//       <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
//         <X size={14} color="#94a3b8" />
//       </button>
//     </motion.div>
//   );
// }

// function StatCard({ label, value, icon: Icon, color, sub, delay = 0 }) {
//   return (
//     <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
//       style={{
//         background: "#fff", border: "1px solid #e8edf5", borderRadius: 16,
//         padding: "22px 24px", display: "flex", gap: 16, alignItems: "center",
//         boxShadow: "0 2px 12px rgba(15,23,42,0.05)"
//       }}>
//       <div style={{
//         width: 52, height: 52, borderRadius: 14, background: `${color}14`,
//         display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
//       }}>
//         <Icon size={22} color={color} />
//       </div>
//       <div>
//         <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
//         <div style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", lineHeight: 1.15, marginTop: 2, fontFamily: "'Sora', sans-serif" }}>{value}</div>
//         {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
//       </div>
//     </motion.div>
//   );
// }

// // ─── MAIN DASHBOARD ──────────────────────────────────────────────────────
// export default function InternshipIncharge() {
//   const [tab, setTab]                 = useState("overview");
//   const [applications, setApplications] = useState([]);
//   const [internships, setInternships]   = useState([]);
//   const [stats, setStats]               = useState({});
//   const [loading, setLoading]           = useState(true);
//   const [actionLoading, setActionLoading] = useState({});
//   const [toasts, setToasts]             = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [notifOpen, setNotifOpen]       = useState(false);
//   const [cvModal, setCvModal]           = useState(null);
//   const [confirmModal, setConfirmModal] = useState(null);
//   const [search, setSearch]             = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const addToast = (message, type = "info") =>
//     setToasts((p) => [...p, { id: Date.now() + Math.random(), message, type }]);

//   // ── FETCH ────────────────────────────────────────────────────────────
//   const fetchAll = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [appRes, intRes] = await Promise.all([
//         fetch(`${API}/applications`),
//         fetch(`${API}/internships`),
//       ]);
//       const appJson = await appRes.json();
//       const intJson = await intRes.json();

//       setApplications(appJson.data || []);
//       setStats(appJson.stats || {});
//       setInternships(intJson.data || []);
//     } catch (err) {
//       addToast("Backend unavailable - using demo data", "warn");
//       setApplications(DEMO_APPS);
//       setInternships(DEMO_INTERNSHIPS);
//       setStats({
//         total: DEMO_APPS.length,
//         pending: DEMO_APPS.filter((a) => a.status === "pending").length,
//         approved: DEMO_APPS.filter((a) => a.status === "approved").length,
//         rejected: DEMO_APPS.filter((a) => a.status === "rejected").length,
//         sent_to_liaison: DEMO_APPS.filter((a) => a.status === "sent_to_liaison").length,
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchAll(); }, [fetchAll]);

//   // ── APPROVE ──────────────────────────────────────────────────────────
//   // const handleApprove = async (app) => {
//   //   setActionLoading((p) => ({ ...p, [app._id]: "approving" }));
//   //   try {
//   //     const res = await fetch(`${API}/applications/${app._id}/approve`, {
//   //       method: "PATCH", headers: { "Content-Type": "application/json" },
//   //     });
//   //     const json = await res.json();
//   //     if (!res.ok) throw new Error(json.message);
//   //     setApplications((p) => p.map((a) => a._id === app._id ? { ...a, status: "approved", internshipInchargeApproval: { status: "approved", approvedAt: new Date() } } : a));
//   //     setStats((s) => ({ ...s, pending: (s.pending || 1) - 1, approved: (s.approved || 0) + 1 }));
//   //     setNotifications((p) => [{ id: Date.now(), text: `${app.studentId?.name || "Student"} approved`, time: "just now", read: false }, ...p]);
//   //     addToast("Application approved ✓", "success");
//   //     setCvModal(null);
//   //   } catch (err) {
//   //     addToast(err.message || "Failed to approve", "error");
//   //   } finally {
//   //     setActionLoading((p) => ({ ...p, [app._id]: null }));
//   //   }
//   // };




// //   const handleApprove = async (app) => {
// //   setActionLoading((p) => ({ ...p, [app._id]: "approving" }));

// //   try {
// //     // const res = await fetch(`${API}/applications/${app._id}/approve`, {
// // const res = await fetch(`${API}/applications/${app._id}/approve`, {
// //       method: "PATCH",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         remarks: "Approved by admin",
// //       }),
// //     });

// //     const json = await res.json();

// //     if (!res.ok) throw new Error(json.message);

// //     // UI update (optimistic)
// //     setApplications((p) =>
// //       p.map((a) =>
// //         a._id === app._id
// //           ? {
// //               ...a,
// //               status: "approved",
// //               internshipInchargeApproval: {
// //                 status: "approved",
// //                 approvedAt: new Date(),
// //                 remarks: "Approved by admin",
// //               },
// //             }
// //           : a
// //       )
// //     );

// //     setStats((s) => ({
// //       ...s,
// //       pending: (s.pending || 1) - 1,
// //       approved: (s.approved || 0) + 1,
// //     }));

// //     setNotifications((p) => [
// //       {
// //         id: Date.now(),
// //         text: `${app.studentId?.name || app.studentEmail || "Student"} approved`,
// //         time: "just now",
// //         read: false,
// //       },
// //       ...p,
// //     ]);

// //     addToast("Application approved ✓", "success");
// //     setCvModal(null);
// //   } catch (err) {
// //     addToast(err.message || "Failed to approve", "error");
// //   } finally {
// //     setActionLoading((p) => ({ ...p, [app._id]: null }));
// //   }
// // };








// const handleApprove = async (app) => {
//   setActionLoading((p) => ({ ...p, [app._id]: "approving" }));

//   try {
//     const res = await fetch(
//       `${API}/applications/${app._id}/approve`,
//       {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           remarks: "Approved by incharge",
//         }),
//       }
//     );

//     const json = await res.json();

//     if (!res.ok) {
//       throw new Error(json.message || "Request failed");
//     }

//     // UI update
//     setApplications((prev) =>
//       prev.map((a) =>
//         a._id === app._id
//           ? {
//               ...a,
//               status: "approved",
//               internshipInchargeApproval: {
//                 status: "approved",
//                 approvedAt: new Date(),
//                 remarks: "Approved by incharge",
//               },
//             }
//           : a
//       )
//     );

//     setStats((s) => ({
//       ...s,
//       pending: Math.max((s.pending || 1) - 1, 0),
//       approved: (s.approved || 0) + 1,
//     }));

//     addToast("Application approved ✓", "success");
//     setCvModal(null);
//   } catch (err) {
//     console.log("Approve Error:", err);
//     addToast(err.message || "Failed to approve", "error");
//   } finally {
//     setActionLoading((p) => ({ ...p, [app._id]: null }));
//   }
// };




//   // ── REJECT ───────────────────────────────────────────────────────────
//   const handleReject = async (app) => {
//     setActionLoading((p) => ({ ...p, [app._id]: "rejecting" }));
//     try {
//       const res = await fetch(`${API}/applications/${app._id}/reject`, {
//         method: "PATCH", headers: { "Content-Type": "application/json" },
//       });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json.message);
//       setApplications((p) => p.map((a) => a._id === app._id ? { ...a, status: "rejected" } : a));
//       setStats((s) => ({ ...s, pending: (s.pending || 1) - 1, rejected: (s.rejected || 0) + 1 }));
//       addToast("Application rejected", "error");
//       setCvModal(null);
//     } catch (err) {
//       addToast(err.message || "Failed to reject", "error");
//     } finally {
//       setActionLoading((p) => ({ ...p, [app._id]: null }));
//     }
//   };

//   // ── SEND TO LIAISON ──────────────────────────────────────────────────
//   const handleSend = async (app) => {
//     setConfirmModal(null);
//     setActionLoading((p) => ({ ...p, [app._id]: "sending" }));
//     try {
//       const res = await fetch(`${API}/applications/${app._id}/send-to-liaison`, {
//         method: "PATCH", headers: { "Content-Type": "application/json" },
//       });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json.message);
//       setApplications((p) => p.map((a) => a._id === app._id ? { ...a, status: "sent_to_liaison" } : a));
//       setStats((s) => ({ ...s, approved: (s.approved || 1) - 1, sent_to_liaison: (s.sent_to_liaison || 0) + 1 }));
//       setNotifications((p) => [{ id: Date.now(), text: `${app.studentId?.name || "Student"} forwarded to Liaison`, time: "just now", read: false }, ...p]);
//       addToast("Forwarded to Industry Liaison ✓", "success");
//     } catch (err) {
//       addToast(err.message || "Failed to forward", "error");
//     } finally {
//       setActionLoading((p) => ({ ...p, [app._id]: null }));
//     }
//   };

//   // ── DERIVED ──────────────────────────────────────────────────────────
//   const filtered = applications.filter((a) => {
//     const name = (a.studentId?.name || a.studentName || "").toLowerCase();
//     return name.includes(search.toLowerCase()) &&
//       (filterStatus === "all" || a.status === filterStatus);
//   });
//   const unread = notifications.filter((n) => !n.read).length;
//   const pending   = applications.filter((a) => a.status === "pending");
//   const approved  = applications.filter((a) => a.status === "approved");
//   const sentList  = applications.filter((a) => a.status === "sent_to_liaison");

//   const PIE_DATA = [
//     { name: "Pending",   value: stats.pending   || 0, color: "#f97316" },
//     { name: "Approved",  value: stats.approved  || 0, color: "#22c55e" },
//     { name: "Sent",      value: stats.sent_to_liaison || 0, color: "#3b82f6" },
//     { name: "Rejected",  value: stats.rejected  || 0, color: "#ef4444" },
//   ].filter((d) => d.value > 0);

//   const navItems = [
//     { key: "overview",     label: "Overview",          icon: BarChart3, badge: 0 },
//     { key: "applications", label: "Applications",       icon: Users,    badge: pending.length },
//     { key: "sent",         label: "Sent to Liaison",    icon: Send,     badge: sentList.length },
//   ];

//   // ─────────────────────────────────────────────────────────────────────
//   return (
//     <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #E2EEF9 0%, #FFFFFF 100%)", fontFamily: "'Sora', 'Segoe UI', sans-serif", display: "flex" }}>

//       {/* ── SIDEBAR ───────────────────────────────────────────────── */}
//       <aside style={{
//         width: 260, background: "#193648", position: "fixed",
//         top: 0, left: 0, height: "100vh", zIndex: 40,
//         display: "flex", flexDirection: "column", boxShadow: "4px 0 24px rgba(15,23,42,0.12)"
//       }}>
//         {/* Logo */}
//         <div style={{ padding: "26px 22px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{
//               width: 40, height: 40, borderRadius: 10,
//               background: "linear-gradient(135deg, #3b82f6, #6366f1)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               fontWeight: 900, fontSize: 18, color: "#fff",
//               boxShadow: "0 4px 14px rgba(99,102,241,0.4)"
//             }}>C</div>
//             <div>
//               <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.01em", fontFamily: "'Sora', sans-serif" }}>Collaxion</div>
//               <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Intern Hub</div>
//             </div>
//           </div>
//         </div>

//         {/* Role pill */}
//         <div style={{ padding: "12px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
//           <div style={{
//             display: "inline-flex", alignItems: "center", gap: 6,
//             background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
//             borderRadius: 99, padding: "5px 12px"
//           }}>
//             <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#60a5fa" }} />
//             <span style={{ fontSize: 10, color: "#93c5fd", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
//               Incharge Portal
//             </span>
//           </div>
//         </div>

//         {/* Nav */}
//         <nav style={{ flex: 1, padding: "14px 12px" }}>
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const active = tab === item.key;
//             return (
//               <button key={item.key} onClick={() => setTab(item.key)} style={{
//                 display: "flex", alignItems: "center", gap: 12, width: "100%",
//                 padding: "12px 14px", borderRadius: 10, marginBottom: 3,
//                 background: active ? "rgba(59,130,246,0.18)" : "transparent",
//                 border: active ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
//                 color: active ? "#93c5fd" : "rgba(255,255,255,0.5)",
//                 fontSize: 14, fontWeight: active ? 700 : 500,
//                 cursor: "pointer", transition: "all 0.18s", textAlign: "left"
//               }}
//               onMouseEnter={(e) => !active && (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
//               onMouseLeave={(e) => !active && (e.currentTarget.style.background = "transparent")}
//               >
//                 <Icon size={17} />
//                 <span style={{ flex: 1 }}>{item.label}</span>
//                 {item.badge > 0 && (
//                   <span style={{
//                     background: active ? "#3b82f6" : "rgba(255,255,255,0.12)",
//                     color: "#fff", fontSize: 11, fontWeight: 700,
//                     padding: "2px 8px", borderRadius: 99, minWidth: 22, textAlign: "center"
//                   }}>{item.badge}</span>
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         {/* User */}
//         <div style={{ padding: "16px 16px 22px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
//             <div style={{
//               width: 40, height: 40, borderRadius: 10,
//               background: "linear-gradient(135deg, #3b82f6, #6366f1)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               fontWeight: 800, fontSize: 13, color: "#fff"
//             }}>JM</div>
//             <div>
//               <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff" }}>Junaid Malik</div>
//               <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Internship Incharge</div>
//             </div>
//           </div>
//           <button style={{
//             display: "flex", alignItems: "center", gap: 8, width: "100%",
//             padding: "10px 14px", background: "rgba(239,68,68,0.1)",
//             color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)",
//             borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "0.18s"
//           }}
//           onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
//           onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
//           ><LogOut size={15} /> Sign Out</button>
//         </div>
//       </aside>

//       {/* ── MAIN ───────────────────────────────────────────────────── */}
//       <main style={{ marginLeft: 260, flex: 1, padding: "32px 40px", minHeight: "100vh" }}>

//         {/* Top bar */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
//           <div>
//             <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em", fontFamily: "'Sora', sans-serif" }}>
//               {tab === "overview"     && "Dashboard Overview"}
//               {tab === "applications" && "Student Applications"}
//               {tab === "sent"         && "Forwarded to Liaison"}
//             </h1>
//             <p style={{ color: "#94a3b8", margin: "5px 0 0", fontSize: 14 }}>
//               {tab === "overview"     && "Live overview of all internship applications"}
//               {tab === "applications" && `${pending.length} pending · ${approved.length} approved`}
//               {tab === "sent"         && `${sentList.length} applications forwarded to Industry Liaison`}
//             </p>
//           </div>

//           <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//             {/* Refresh */}
//             <button onClick={fetchAll} title="Refresh" style={{
//               width: 40, height: 40, borderRadius: 10, background: "#fff",
//               border: "1px solid #e2e8f0", cursor: "pointer",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "0.15s"
//             }}
//             onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
//             onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
//             ><RefreshCw size={15} color="#64748b" /></button>

//             {/* Notification bell */}
//             <div style={{ position: "relative" }}>
//               <button onClick={() => setNotifOpen(!notifOpen)} style={{
//                 width: 40, height: 40, borderRadius: 10, background: "#fff",
//                 border: "1px solid #e2e8f0", cursor: "pointer",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 boxShadow: "0 1px 4px rgba(0,0,0,0.06)", position: "relative"
//               }}>
//                 <Bell size={17} color="#64748b" />
//                 {unread > 0 && (
//                   <span style={{
//                     position: "absolute", top: -3, right: -3,
//                     background: "#ef4444", color: "#fff",
//                     fontSize: 9, width: 16, height: 16, borderRadius: "50%",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     fontWeight: 800, border: "2px solid #f4f7fb"
//                   }}>{unread}</span>
//                 )}
//               </button>
//               <AnimatePresence>
//                 {notifOpen && (
//                   <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
//                     style={{
//                       position: "absolute", right: 0, top: 48, width: 320,
//                       background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14,
//                       zIndex: 60, boxShadow: "0 16px 40px rgba(15,23,42,0.12)"
//                     }}>
//                     <div style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
//                       <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Notifications</span>
//                       <button onClick={() => setNotifications((p) => p.map((n) => ({ ...n, read: true })))}
//                         style={{ border: "none", background: "none", color: "#3b82f6", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
//                         Mark all read
//                       </button>
//                     </div>
//                     <div style={{ maxHeight: 280, overflowY: "auto" }}>
//                       {notifications.length === 0
//                         ? <div style={{ padding: "28px 16px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No notifications yet</div>
//                         : notifications.map((n) => (
//                           <div key={n.id} onClick={() => setNotifications((p) => p.map((x) => x.id === n.id ? { ...x, read: true } : x))}
//                             style={{
//                               padding: "12px 16px", cursor: "pointer",
//                               background: n.read ? "transparent" : "#eff6ff",
//                               borderBottom: "1px solid #f8fafc",
//                               display: "flex", justifyContent: "space-between", alignItems: "center"
//                             }}>
//                             <div>
//                               <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{n.text}</div>
//                               <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{n.time}</div>
//                             </div>
//                             {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3A70B0", flexShrink: 0 }} />}
//                           </div>
//                         ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>

//         {/* ── TAB CONTENT ────────────────────────────────────────── */}
//         <AnimatePresence mode="wait">
//           <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

//             {/* ─── OVERVIEW ──────────────────────────────────────── */}
//             {tab === "overview" && (
//               <div>
//                 {loading ? (
//                   <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
//                     <Spinner size={32} />
//                   </div>
//                 ) : (
//                   <>
//                     {/* Stats */}
//                     <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
//                       <StatCard label="Total"        value={stats.total  || applications.length} icon={Briefcase}    color="#6366f1" delay={0}    />
//                       <StatCard label="Pending"      value={stats.pending      || 0}             icon={Clock}        color="#f97316" delay={0.05} />
//                       <StatCard label="Approved"     value={stats.approved     || 0}             icon={CheckCircle}  color="#22c55e" delay={0.1}  />
//                       <StatCard label="Sent to Liaison" value={stats.sent_to_liaison || 0}       icon={Send}         color="#3b82f6" delay={0.15} />
//                     </div>

//                     {/* Charts row */}
//                     <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 20, marginBottom: 20 }}>
//                       {/* Line */}
//                       <div style={{ background: "#fff", border: "1px solid #e8edf5", borderRadius: 16, padding: "22px 26px", boxShadow: "0 2px 12px rgba(15,23,42,0.05)" }}>
//                         <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>Application Trend</div>
//                         <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 18 }}>This week</div>
//                         <ResponsiveContainer width="100%" height={220}>
//                           <LineChart data={[
//                             { d: "Mon", r: 3, a: 1 }, { d: "Tue", r: 6, a: 3 },
//                             { d: "Wed", r: 9, a: 5 }, { d: "Thu", r: 5, a: 2 },
//                             { d: "Fri", r: 8, a: 4 }, { d: "Sat", r: 4, a: 2 }, { d: "Sun", r: 2, a: 1 },
//                           ]}>
//                             <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                             <XAxis dataKey="d" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
//                             <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
//                             <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 13 }} />
//                             <Line type="monotone" dataKey="r" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} name="Received" />
//                             <Line type="monotone" dataKey="a" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill: "#22c55e" }} name="Approved" />
//                           </LineChart>
//                         </ResponsiveContainer>
//                       </div>

//                       {/* Pie */}
//                       <div style={{ background: "#fff", border: "1px solid #e8edf5", borderRadius: 16, padding: "22px 26px", boxShadow: "0 2px 12px rgba(15,23,42,0.05)" }}>
//                         <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>Status Breakdown</div>
//                         <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>All applications</div>
//                         {PIE_DATA.length === 0
//                           ? <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 13 }}>No data yet</div>
//                           : <>
//                             <ResponsiveContainer width="100%" height={150}>
//                               <PieChart>
//                                 <Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={65} innerRadius={40}
//                                   dataKey="value" paddingAngle={3}>
//                                   {PIE_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
//                                 </Pie>
//                                 <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
//                               </PieChart>
//                             </ResponsiveContainer>
//                             <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 8 }}>
//                               {PIE_DATA.map((d) => (
//                                 <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                   <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
//                                     <div style={{ width: 9, height: 9, borderRadius: 3, background: d.color }} />
//                                     <span style={{ fontSize: 13, color: "#64748b" }}>{d.name}</span>
//                                   </div>
//                                   <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{d.value}</span>
//                                 </div>
//                               ))}
//                             </div>
//                           </>}
//                       </div>
//                     </div>

//                     {/* Recent */}
//                     <div style={{ background: "#fff", border: "1px solid #e8edf5", borderRadius: 16, padding: "22px 26px", boxShadow: "0 2px 12px rgba(15,23,42,0.05)" }}>
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
//                         <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Recent Applications</div>
//                         <button onClick={() => setTab("applications")} style={{
//                           background: "#E2EEF9", color: "#193648", border: "1px solid #CFE0F0",
//                           borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer"
//                         }}>View All →</button>
//                       </div>
//                       <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                         {applications.slice(0, 6).map((app) => (
//                           <MiniRow key={app._id} app={app} internships={internships} onView={() => setCvModal(app)} />
//                         ))}
//                         {applications.length === 0 && (
//                           <div style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 13 }}>No applications yet</div>
//                         )}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}

//             {/* ─── APPLICATIONS ──────────────────────────────────── */}
//             {tab === "applications" && (
//               <div>
//                 {/* Filter bar */}
//                 <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
//                   <div style={{
//                     display: "flex", alignItems: "center", gap: 9,
//                     background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
//                     padding: "10px 14px", flex: 1, minWidth: 200,
//                     boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
//                   }}>
//                     <Search size={15} color="#94a3b8" />
//                     <input value={search} onChange={(e) => setSearch(e.target.value)}
//                       placeholder="Search student name..."
//                       style={{ background: "none", border: "none", outline: "none", width: "100%", fontSize: 13.5, color: "#0f172a" }} />
//                   </div>
//                   {["all", "pending", "approved", "sent_to_liaison", "rejected"].map((s) => {
//                     const count = s === "all" ? applications.length
//                       : applications.filter((a) => a.status === s).length;
//                     const active = filterStatus === s;
//                     return (
//                       <button key={s} onClick={() => setFilterStatus(s)} style={{
//                         padding: "10px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
//                         background: active ? "#193648" : "#fff",
//                         color: active ? "#fff" : "#64748b",
//                         border: active ? "1px solid #193648" : "1px solid #e2e8f0",
//                         boxShadow: "0 1px 4px rgba(0,0,0,0.04)", whiteSpace: "nowrap", transition: "0.15s"
//                       }}>
//                         {s === "all" ? "All" : s === "sent_to_liaison" ? "Sent" : s.charAt(0).toUpperCase() + s.slice(1)}
//                         <span style={{ marginLeft: 6, opacity: 0.7 }}>({count})</span>
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {loading
//                   ? <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner size={32} /></div>
//                   : filtered.length === 0
//                     ? <EmptyState icon={Users} text="No applications match your filters" />
//                     : (
//                       <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//                         {filtered.map((app) => (
//                           <AppCard key={app._id} app={app} internships={internships}
//                             onView={() => setCvModal(app)}
//                             onApprove={() => handleApprove(app)}
//                             onReject={() => handleReject(app)}
//                             onSend={() => setConfirmModal(app)}
//                             loading={actionLoading[app._id]}
//                           />
//                         ))}
//                       </div>
//                     )}
//               </div>
//             )}

//             {/* ─── SENT TO LIAISON ───────────────────────────────── */}
//             {tab === "sent" && (
//               <div>
//                 {loading
//                   ? <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner size={32} /></div>
//                   : sentList.length === 0
//                     ? <EmptyState icon={Send} text="No applications forwarded to liaison yet" />
//                     : (
//                       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))", gap: 16 }}>
//                         {sentList.map((app) => (
//                           <SentCard key={app._id} app={app} internships={internships} />
//                         ))}
//                       </div>
//                     )}
//               </div>
//             )}

//           </motion.div>
//         </AnimatePresence>
//       </main>

//       {/* ── CV MODAL ───────────────────────────────────────────────── */}
//       <AnimatePresence>
//         {cvModal && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             style={{
//               position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
//               zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
//               padding: 20, backdropFilter: "blur(3px)"
//             }}
//             onClick={() => setCvModal(null)}>
//             <motion.div initial={{ scale: 0.97, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97 }}
//               style={{
//                 width: "100%", maxWidth: 740, background: "#fff",
//                 border: "1px solid #e2e8f0", borderRadius: 20,
//                 maxHeight: "88vh", display: "flex", flexDirection: "column",
//                 boxShadow: "0 30px 80px rgba(15,23,42,0.2)"
//               }}
//               onClick={(e) => e.stopPropagation()}>
//               <CVModal app={cvModal} internships={internships}
//                 onClose={() => setCvModal(null)}
//                 onApprove={() => handleApprove(cvModal)}
//                 onReject={() => handleReject(cvModal)}
//                 onSend={() => { setCvModal(null); setConfirmModal(cvModal); }}
//                 loading={actionLoading[cvModal._id]}
//               />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ── CONFIRM MODAL ─────────────────────────────────────────── */}
//       <AnimatePresence>
//         {confirmModal && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             style={{
//               position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
//               zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center",
//               padding: 20, backdropFilter: "blur(3px)"
//             }}>
//             <motion.div initial={{ scale: 0.96, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
//               style={{
//                 width: "100%", maxWidth: 440, background: "#fff",
//                 border: "1px solid #e2e8f0", borderRadius: 18, padding: 28,
//                 boxShadow: "0 24px 60px rgba(15,23,42,0.15)"
//               }}>
//               <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
//                 <div style={{
//                   width: 46, height: 46, borderRadius: 12, background: "#E2EEF9",
//                   display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
//                 }}>
//                   <Send size={20} color="#2563eb" />
//                 </div>
//                 <div>
//                   <div style={{ fontWeight: 800, fontSize: 17, color: "#0f172a", fontFamily: "'Sora', sans-serif" }}>
//                     Forward to Industry Liaison?
//                   </div>
//                   <p style={{ color: "#64748b", fontSize: 13.5, marginTop: 6, lineHeight: 1.6 }}>
//                     <strong style={{ color: "#0f172a" }}>{confirmModal.studentId?.name || "This student"}</strong>'s
//                     approved application will be moved to the Liaison queue. This cannot be undone.
//                   </p>
//                 </div>
//               </div>
//               <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//                 <button onClick={() => setConfirmModal(null)} style={{
//                   padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0",
//                   background: "#fff", color: "#64748b", fontWeight: 600, fontSize: 13.5, cursor: "pointer"
//                 }}>Cancel</button>
//                 <button onClick={() => handleSend(confirmModal)} style={{
//                   padding: "10px 24px", borderRadius: 10, border: "none",
//                   background: "#193648", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer",
//                   boxShadow: "0 4px 14px rgba(25,54,72,0.3)", transition: "0.15s"
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.background = "#0f2233"}
//                 onMouseLeave={(e) => e.currentTarget.style.background = "#193648"}
//                 >Yes, Forward</button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ── TOASTS ─────────────────────────────────────────────────── */}
//       <AnimatePresence>
//         {toasts.map((t) => (
//           <Toast key={t.id} message={t.message} type={t.type}
//             onClose={() => setToasts((p) => p.filter((x) => x.id !== t.id))} />
//         ))}
//       </AnimatePresence>
//     </div>
//   );
// }

// // ─── MINI ROW (overview) ────────────────────────────────────────────────
// function MiniRow({ app, internships, onView }) {
//   const name = app.studentId?.name || app.studentName || "Unknown";
//   const intern = internships.find((i) => i._id === (app.internshipId?._id || app.internshipId));
//   return (
//     <div style={{
//       display: "flex", alignItems: "center", gap: 12,
//       padding: "11px 14px", borderRadius: 10, background: "#f8fafc",
//       border: "1px solid #f1f5f9", transition: "0.15s"
//     }}
//     onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
//     onMouseLeave={(e) => e.currentTarget.style.background = "#f8fafc"}
//     >
//       <div style={{
//         width: 36, height: 36, borderRadius: 9, flexShrink: 0,
//         background: "linear-gradient(135deg, #6366f1, #3b82f6)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontWeight: 800, fontSize: 12, color: "#fff"
//       }}>{initials(name)}</div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>{name}</div>
//         <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{intern?.title || "-"}</div>
//       </div>
//       {app.matchScore != null && (
//         <div style={{ fontSize: 12, fontWeight: 700, color: app.matchScore >= 70 ? "#15803d" : "#b45309" }}>
//           {app.matchScore}% match
//         </div>
//       )}
//       <StatusBadge status={app.status} />
//       <button onClick={onView} style={{
//         background: "#E2EEF9", color: "#193648", border: "1px solid #CFE0F0",
//         borderRadius: 7, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer"
//       }}>View</button>
//       <button onClick={() => handleApprove(app)}>
//   Approve
// </button>
//     </div>
//   );
// }

// // ─── APP CARD ───────────────────────────────────────────────────────────
// function AppCard({ app, internships, onView, onApprove, onReject, onSend, loading }) {
//   const name   = app.studentId?.name || app.studentName || "Unknown";
//   const intern = internships.find((i) => i._id === (app.internshipId?._id || app.internshipId));

//   return (
//     <motion.div layout style={{
//       background: "#fff", border: "1px solid #e8edf5", borderRadius: 16,
//       padding: "18px 22px", display: "flex", alignItems: "center", gap: 16,
//       boxShadow: "0 2px 10px rgba(15,23,42,0.04)", transition: "box-shadow 0.15s"
//     }}
//     whileHover={{ boxShadow: "0 4px 20px rgba(15,23,42,0.08)" }}>
//       {/* Avatar */}
//       <div style={{
//         width: 50, height: 50, borderRadius: 13, flexShrink: 0,
//         background: "linear-gradient(135deg, #6366f1, #3b82f6)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontWeight: 800, fontSize: 15, color: "#fff",
//         boxShadow: "0 4px 12px rgba(99,102,241,0.25)"
//       }}>{initials(name)}</div>

//       {/* Info */}
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3, flexWrap: "wrap" }}>
//           <span style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", fontFamily: "'Sora', sans-serif" }}>{name}</span>
//           <StatusBadge status={app.status} />
//         </div>
//         <div style={{ fontSize: 13, color: "#64748b" }}>
//           {intern?.title || intern?.name || "Unknown Internship"}
//           {intern?.company ? ` · ${intern.company}` : ""}
//         </div>
//         <div style={{ display: "flex", gap: 14, marginTop: 6, flexWrap: "wrap" }}>
//           {app.matchScore != null && (
//             <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//               <Target size={12} color="#6366f1" />
//               <span style={{ fontSize: 12, color: "#94a3b8" }}>Match: </span>
//               <span style={{ fontSize: 12, fontWeight: 700, color: app.matchScore >= 70 ? "#15803d" : "#b45309" }}>
//                 {app.matchScore}%
//               </span>
//             </div>
//           )}
//           {app.matchingSkills?.length > 0 && (
//             <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//               <Zap size={12} color="#22c55e" />
//               <span style={{ fontSize: 12, color: "#94a3b8" }}>{app.matchingSkills.length} skills matched</span>
//             </div>
//           )}
//           <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//             <Calendar size={12} color="#94a3b8" />
//             <span style={{ fontSize: 12, color: "#94a3b8" }}>{fmt(app.appliedAt || app.createdAt)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Actions */}
//       <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
//         <button onClick={onView} style={{
//           padding: "9px 14px", borderRadius: 9, border: "1px solid #e2e8f0",
//           background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600,
//           cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "0.15s"
//         }}
//         onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
//         onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
//         ><Eye size={14} /> CV</button>

//         {app.status === "pending" && (
//           <>
//             <button onClick={onApprove} disabled={!!loading} style={{
//               padding: "9px 15px", borderRadius: 9, border: "none",
//               background: "#22c55e", color: "#fff", fontSize: 13, fontWeight: 700,
//               cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
//               boxShadow: "0 3px 10px rgba(34,197,94,0.3)", opacity: loading ? 0.7 : 1, transition: "0.15s"
//             }}>
//               {loading === "approving" ? <Spinner size={13} color="#fff" /> : <CheckCircle size={14} />}
//               Approve
//             </button>
//             <button onClick={onReject} disabled={!!loading} style={{
//               padding: "9px 15px", borderRadius: 9,
//               border: "1px solid #fecdd3", background: "#fff1f2",
//               color: "#be123c", fontSize: 13, fontWeight: 700,
//               cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "0.15s"
//             }}>
//               {loading === "rejecting" ? <Spinner size={13} color="#be123c" /> : <XCircle size={14} />}
//               Reject
//             </button>
//           </>
//         )}

//         {app.status === "approved" && (
//           <button onClick={onSend} disabled={!!loading} style={{
//             padding: "9px 16px", borderRadius: 9, border: "none",
//             background: "#193648", color: "#fff", fontSize: 13, fontWeight: 700,
//             cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
//             boxShadow: "0 3px 12px rgba(25,54,72,0.25)", transition: "0.15s"
//           }}
//           onMouseEnter={(e) => e.currentTarget.style.background = "#0f2233"}
//           onMouseLeave={(e) => e.currentTarget.style.background = "#193648"}
//           >
//             {loading === "sending" ? <Spinner size={13} color="#fff" /> : <Send size={14} />}
//             Send to Liaison
//           </button>
//         )}

//         {app.status === "sent_to_liaison" && (
//           <div style={{
//             padding: "9px 14px", borderRadius: 9, background: "#eff6ff",
//             color: "#1d4ed8", fontSize: 13, fontWeight: 700,
//             display: "flex", alignItems: "center", gap: 6, border: "1px solid #bfdbfe"
//           }}>
//             <CheckCircle size={14} /> Forwarded
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// }

// // ─── SENT CARD ───────────────────────────────────────────────────────────
// function SentCard({ app, internships }) {
//   const name   = app.studentId?.name || app.studentName || "Unknown";
//   const intern = internships.find((i) => i._id === (app.internshipId?._id || app.internshipId));
//   return (
//     <div style={{
//       background: "#fff", border: "1px solid #e8edf5", borderRadius: 16,
//       padding: "20px 22px", boxShadow: "0 2px 10px rgba(15,23,42,0.04)"
//     }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
//         <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
//           <div style={{
//             width: 46, height: 46, borderRadius: 12, flexShrink: 0,
//             background: "linear-gradient(135deg, #6366f1, #3b82f6)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             fontWeight: 800, fontSize: 14, color: "#fff"
//           }}>{initials(name)}</div>
//           <div>
//             <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", fontFamily: "'Sora', sans-serif" }}>{name}</div>
//             <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{intern?.title || "-"}</div>
//           </div>
//         </div>
//         <StatusBadge status="sent_to_liaison" />
//       </div>

//       <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
//         {app.matchScore != null && (
//           <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//             <Target size={13} color="#6366f1" />
//             <span style={{ fontSize: 12, color: "#94a3b8" }}>Match:</span>
//             <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1" }}>{app.matchScore}%</span>
//           </div>
//         )}
//         {app.matchingSkills?.length > 0 && (
//           <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//             <Zap size={13} color="#22c55e" />
//             <span style={{ fontSize: 12, color: "#94a3b8" }}>{app.matchingSkills.length} skills matched</span>
//           </div>
//         )}
//         <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//           <Calendar size={13} color="#94a3b8" />
//           <span style={{ fontSize: 12, color: "#94a3b8" }}>{fmt(app.updatedAt)}</span>
//         </div>
//       </div>

//       {app.matchingSkills?.length > 0 && (
//         <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
//           {app.matchingSkills.slice(0, 6).map((s, i) => <SkillTag key={i} label={s} matched />)}
//           {app.matchingSkills.length > 6 && <SkillTag label={`+${app.matchingSkills.length - 6} more`} />}
//         </div>
//       )}

//       {app.cvSnapshot && (
//         <a href={`${BASE}${app.cvSnapshot}`} target="_blank" rel="noreferrer" style={{
//           display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
//           background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10,
//           color: "#475569", textDecoration: "none", fontSize: 13, fontWeight: 600, transition: "0.15s"
//         }}
//         onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
//         onMouseLeave={(e) => e.currentTarget.style.background = "#f8fafc"}
//         >
//           <FileText size={14} color="#6366f1" /> View CV Document
//         </a>
//       )}
//     </div>
//   );
// }

// // ─── CV MODAL CONTENT ────────────────────────────────────────────────────
// function CVModal({ app, internships, onClose, onApprove, onReject, onSend, loading }) {
//   const name   = app.studentId?.name || app.studentName || "Unknown";
//   const intern = internships.find((i) => i._id === (app.internshipId?._id || app.internshipId));

//   return (
//     <>
//       {/* Header */}
//       <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
//           <div style={{
//             width: 50, height: 50, borderRadius: 13,
//             background: "linear-gradient(135deg, #6366f1, #3b82f6)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             fontWeight: 800, fontSize: 16, color: "#fff"
//           }}>{initials(name)}</div>
//           <div>
//             <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a", fontFamily: "'Sora', sans-serif" }}>{name}</div>
//             <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
//               {intern?.title || "-"} · Applied {fmt(app.appliedAt)}
//             </div>
//           </div>
//         </div>
//         <button onClick={onClose} style={{
//           width: 34, height: 34, borderRadius: 8, background: "#f8fafc",
//           border: "1px solid #e2e8f0", cursor: "pointer",
//           display: "flex", alignItems: "center", justifyContent: "center"
//         }}><X size={16} color="#64748b" /></button>
//       </div>

//       {/* Body */}
//       <div style={{ padding: "22px 24px", flex: 1, overflowY: "auto" }}>
//         {/* Match Score */}
//         {app.matchScore != null && (
//           <div style={{
//             display: "flex", alignItems: "center", gap: 16, padding: "14px 18px",
//             background: app.matchScore >= 70 ? "#f0fdf4" : "#fffbeb",
//             border: `1px solid ${app.matchScore >= 70 ? "#bbf7d0" : "#fde68a"}`,
//             borderRadius: 12, marginBottom: 20
//           }}>
//             <Target size={22} color={app.matchScore >= 70 ? "#15803d" : "#b45309"} />
//             <div style={{ flex: 1 }}>
//               <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{app.matchScore}% Match Score</div>
//               <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
//                 {app.matchingSkills?.length || 0} matching · {app.missingSkills?.length || 0} missing
//               </div>
//             </div>
//             <div style={{ width: 100, height: 7, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
//               <div style={{
//                 height: "100%", borderRadius: 99, width: `${app.matchScore}%`,
//                 background: app.matchScore >= 70 ? "#22c55e" : "#f97316", transition: "width 0.5s"
//               }} />
//             </div>
//           </div>
//         )}

//         {/* Matching Skills */}
//         {app.matchingSkills?.length > 0 && (
//           <div style={{ marginBottom: 18 }}>
//             <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>
//               Matching Skills
//             </div>
//             <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//               {app.matchingSkills.map((s, i) => <SkillTag key={i} label={s} matched />)}
//             </div>
//           </div>
//         )}

//         {/* Missing Skills */}
//         {app.missingSkills?.length > 0 && (
//           <div style={{ marginBottom: 18 }}>
//             <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>
//               Missing Skills
//             </div>
//             <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//               {app.missingSkills.map((s, i) => <SkillTag key={i} label={s} />)}
//             </div>
//           </div>
//         )}

//         {/* All student skills */}
//         {app.skillsSnapshot?.length > 0 && !app.matchingSkills?.length && (
//           <div style={{ marginBottom: 18 }}>
//             <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>Student Skills</div>
//             <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//               {app.skillsSnapshot.map((s, i) => (
//                 <SkillTag key={i} label={typeof s === "string" ? s : (s?.name || s)} matched />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* CV Document */}
//         {app.cvSnapshot && (
//           <div style={{ marginBottom: 18 }}>
//             <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>CV Document</div>
//             <a href={`${BASE}${app.cvSnapshot}`} target="_blank" rel="noreferrer" style={{
//               display: "flex", alignItems: "center", justifyContent: "space-between",
//               padding: "14px 16px", background: "#f8fafc", border: "1px solid #e2e8f0",
//               borderRadius: 12, textDecoration: "none", transition: "0.15s"
//             }}
//             onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
//             onMouseLeave={(e) => e.currentTarget.style.background = "#f8fafc"}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <FileText size={18} color="#6366f1" />
//                 <div>
//                   <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>View CV / Resume</div>
//                   <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>PDF · Click to open</div>
//                 </div>
//               </div>
//               <Eye size={15} color="#6366f1" />
//             </a>
//           </div>
//         )}

//         {/* Meta info */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
//           {[
//             { label: "Applied On",    value: fmt(app.appliedAt || app.createdAt) },
//             { label: "Current Status", value: (app.status || "").replace(/_/g, " "), cap: true },
//             app.internshipInchargeApproval?.approvedAt
//               ? { label: "Approved On", value: fmt(app.internshipInchargeApproval.approvedAt) }
//               : null,
//           ].filter(Boolean).map((item, i) => (
//             <div key={i} style={{ padding: "12px 14px", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 10 }}>
//               <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{item.label}</div>
//               <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginTop: 4, textTransform: item.cap ? "capitalize" : "none" }}>
//                 {item.value}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Footer */}
//       <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10 }}>
//         {app.status === "pending" && (
//           <>
//             <button onClick={onApprove} disabled={!!loading} style={{
//               flex: 1, padding: "12px", borderRadius: 10, border: "none",
//               background: "#22c55e", color: "#fff", fontWeight: 700, fontSize: 14,
//               cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//               boxShadow: "0 4px 14px rgba(34,197,94,0.3)", opacity: loading ? 0.7 : 1
//             }}>
//               {loading === "approving" ? <Spinner size={15} color="#fff" /> : <CheckCircle size={16} />}
//               Approve Application
//             </button>
//             <button onClick={onReject} disabled={!!loading} style={{
//               flex: 1, padding: "12px", borderRadius: 10,
//               border: "1px solid #fecdd3", background: "#fff1f2",
//               color: "#be123c", fontWeight: 700, fontSize: 14,
//               cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
//             }}>
//               {loading === "rejecting" ? <Spinner size={15} color="#be123c" /> : <XCircle size={16} />}
//               Reject Application
//             </button>
//           </>
//         )}
//         {app.status === "approved" && (
//           <button onClick={onSend} disabled={!!loading} style={{
//             flex: 1, padding: "12px", borderRadius: 10, border: "none",
//             background: "#193648", color: "#fff", fontWeight: 700, fontSize: 14,
//             cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//             boxShadow: "0 4px 16px rgba(25,54,72,0.25)"
//           }}>
//             {loading === "sending" ? <Spinner size={15} color="#fff" /> : <Send size={16} />}
//             Forward to Industry Liaison
//           </button>
//         )}
//         {(app.status === "rejected" || app.status === "sent_to_liaison") && (
//           <div style={{
//             flex: 1, padding: "12px", borderRadius: 10, textAlign: "center",
//             background: app.status === "sent_to_liaison" ? "#eff6ff" : "#fff1f2",
//             color: app.status === "sent_to_liaison" ? "#1d4ed8" : "#be123c",
//             fontWeight: 700, fontSize: 14, border: `1px solid ${app.status === "sent_to_liaison" ? "#bfdbfe" : "#fecdd3"}`
//           }}>
//             {app.status === "sent_to_liaison" ? "✓ Already forwarded to Liaison" : "✗ Application was rejected"}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// // ─── EMPTY STATE ─────────────────────────────────────────────────────────
// function EmptyState({ icon: Icon, text }) {
//   return (
//     <div style={{
//       background: "#fff", border: "1px solid #e8edf5", borderRadius: 16,
//       padding: 64, textAlign: "center", boxShadow: "0 2px 10px rgba(15,23,42,0.04)"
//     }}>
//       <Icon size={40} color="#cbd5e1" style={{ marginBottom: 12 }} />
//       <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>{text}</p>
//     </div>
//   );
// }

// // ─── DEMO DATA ───────────────────────────────────────────────────────────
// const DEMO_INTERNSHIPS = [
//   { _id: "int_1", title: "AI Research Internship", company: "TechNova" },
//   { _id: "int_2", title: "Smart Agriculture Project", company: "AgriX" },
//   { _id: "int_3", title: "IoT Manufacturing", company: "IndusTech" },
// ];

// const DEMO_APPS = [
//   {
//     _id: "app_1", studentId: { name: "Sabahat Raza" }, internshipId: { _id: "int_1" },
//     status: "pending", matchScore: 100,
//     matchingSkills: ["Python", "TensorFlow", "NLP", "ML", "PyTorch", "Deep Learning"],
//     missingSkills: [], cvSnapshot: null,
//     skillsSnapshot: ["Python", "TensorFlow", "NLP", "ML"],
//     appliedAt: "2025-11-09T18:36:15.455Z", createdAt: "2025-11-09T18:36:15.457Z",
//     internshipInchargeApproval: { status: "pending" },
//   },
//   {
//     _id: "app_2", studentId: { name: "Ahmed Hassan" }, internshipId: { _id: "int_1" },
//     status: "approved", matchScore: 82,
//     matchingSkills: ["Python", "ML", "Data Science"], missingSkills: ["TensorFlow"],
//     cvSnapshot: null, skillsSnapshot: ["Python", "ML"],
//     appliedAt: "2025-11-08T10:22:00.000Z", createdAt: "2025-11-08T10:22:00.000Z",
//     internshipInchargeApproval: { status: "approved", approvedAt: "2025-11-09T09:00:00.000Z" },
//   },
//   {
//     _id: "app_3", studentId: { name: "Zara Khan" }, internshipId: { _id: "int_2" },
//     status: "sent_to_liaison", matchScore: 91,
//     matchingSkills: ["IoT", "Arduino", "C", "Sensor Networks"], missingSkills: [],
//     cvSnapshot: null, skillsSnapshot: ["IoT", "Arduino"],
//     appliedAt: "2025-11-06T08:15:00.000Z", updatedAt: "2025-11-08T14:00:00.000Z",
//     internshipInchargeApproval: { status: "approved" },
//   },
//   {
//     _id: "app_4", studentId: { name: "Bilal Chaudhry" }, internshipId: { _id: "int_3" },
//     status: "pending", matchScore: 65,
//     matchingSkills: ["C++", "Embedded Systems"], missingSkills: ["RTOS", "PCB Design"],
//     cvSnapshot: null, skillsSnapshot: ["C++", "Embedded Systems"],
//     appliedAt: "2025-11-10T07:00:00.000Z", createdAt: "2025-11-10T07:00:00.000Z",
//     internshipInchargeApproval: { status: "pending" },
//   },
// ];




import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Users, Send, CheckCircle, XCircle, Clock,
  BarChart3, X, Bell, LogOut, FileText, Eye,
  Loader2, Target, Zap, Calendar, RefreshCw, Search,
  Menu, ChevronLeft, Camera,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import collaxionLogo from "../../images/collaxionlogo.jpeg";
import junaidAvatar from "../../images/Chancellor.jpg";

// ─── CONFIG ──────────────────────────────────────────────────────────────
const BASE = "http://localhost:5000";
const API  = `${BASE}/api/incharge`;

// ─── HELPERS ─────────────────────────────────────────────────────────────
const fmt = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

const getStudentName = (app) => {
  if (app.studentId?.name) return app.studentId.name;
  if (app.studentEmail) return app.studentEmail.split("@")[0];
  return "Unknown Student";
};

const getStudentEmail = (app) => {
  if (app.studentEmail) return app.studentEmail;
  if (app.studentId?.email) return app.studentId.email;
  return null;
};

const getStudentAvatar = (app) => {
  const img = app.studentId?.profileImage || app.studentId?.profilePicture || "";
  if (!img) return "";
  if (/^(data:|https?:\/\/)/i.test(img)) return img;
  return `${BASE}${img.startsWith("/") ? "" : "/"}${img}`;
};

function StudentAvatar({ app, name, size = 50, radius = 13, fontSize = 15 }) {
  const dp = getStudentAvatar(app);
  const [errored, setErrored] = useState(false);
  const showImg = dp && !errored;
  return showImg ? (
    <img
      src={dp}
      alt={name}
      onError={() => setErrored(true)}
      style={{
        width: size, height: size, borderRadius: radius, flexShrink: 0,
        objectFit: "cover", display: "block",
        boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
      }}
    />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: "linear-gradient(135deg, #193648, #3A70B0)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize, color: "#fff",
      boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
    }}>{initials(name)}</div>
  );
}

const normaliseStatus = (s) => (s || "").toLowerCase().replace(/ /g, "_");

const STATUS_CONFIG = {
  pending:         { label: "Pending",         bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  approved:        { label: "Accepted",        bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  rejected:        { label: "Rejected",        bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
  sent_to_liaison: { label: "Sent to Liaison", bg: "#E2EEF9", color: "#193648", border: "#CFE0F0" },
};

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const key = normaliseStatus(status);
  const c = STATUS_CONFIG[key] || { label: status, bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" };
  return (
    <span style={{
      padding: "4px 11px", borderRadius: 99, fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap",
    }}>{c.label}</span>
  );
}

function SkillTag({ label, matched }) {
  return (
    <span style={{
      padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
      background: matched ? "#E2EEF9" : "#f8fafc",
      color: matched ? "#193648" : "#64748b",
      border: `1px solid ${matched ? "#CFE0F0" : "#e2e8f0"}`,
    }}>{label}</span>
  );
}

function Spinner({ size = 18, color = "#193648" }) {
  return (
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      style={{ width: size, height: size, display: "inline-flex" }}>
      <Loader2 size={size} color={color} />
    </motion.div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const palette    = { success: "#15803d", error: "#be123c", info: "#193648", warn: "#b45309" };
  const bgPalette  = { success: "#f0fdf4", error: "#fff1f2", info: "#E2EEF9", warn: "#fffbeb" };
  const brdPalette = { success: "#bbf7d0", error: "#fecdd3", info: "#CFE0F0", warn: "#fde68a" };
  return (
    <motion.div initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 16, x: "-50%" }}
      style={{
        position: "fixed", bottom: 28, left: "50%", zIndex: 9999,
        background: bgPalette[type] || "#fff", border: `1px solid ${brdPalette[type] || "#e2e8f0"}`,
        borderRadius: 12, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)", minWidth: 280, maxWidth: 420,
      }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: palette[type] || "#64748b", flexShrink: 0 }} />
      <span style={{ color: "#0f172a", fontSize: 13.5, fontWeight: 500, flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
        <X size={14} color="#94a3b8" />
      </button>
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon, color, sub, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      whileHover={{ y: -3 }}
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #ffffff, #fbfdff)",
        border: "1px solid #E2EEF9",
        borderRadius: 16,
        padding: "20px 22px", display: "flex", gap: 14, alignItems: "center",
        boxShadow: "0 6px 22px rgba(25,54,72,0.06)",
        transition: "border-color 0.22s ease, box-shadow 0.22s ease",
        overflow: "hidden",
        minWidth: 0,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${color}66`; e.currentTarget.style.boxShadow = `0 12px 28px ${color}22`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2EEF9"; e.currentTarget.style.boxShadow = "0 6px 22px rgba(25,54,72,0.06)"; }}
    >
      <span aria-hidden style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: 4,
        background: `linear-gradient(180deg, ${color}, ${color}66)`,
      }} />
      <div style={{
        width: 50, height: 50, borderRadius: 13,
        background: `linear-gradient(135deg, ${color}1F, ${color}0A)`,
        border: `1px solid ${color}33`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        boxShadow: `0 4px 12px ${color}22`,
      }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginTop: 3, fontFamily: "'Sora', sans-serif", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{value}</div>
        {sub && <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────
export default function InternshipDashboard() {
  const navigate = useNavigate();
  const [tab, setTab]                     = useState("overview");
  const [applications, setApplications]   = useState([]);
  const [internships, setInternships]     = useState([]);
  const [stats, setStats]                 = useState({});
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [toasts, setToasts]               = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [cvModal, setCvModal]             = useState(null);
  const [confirmModal, setConfirmModal]   = useState(null);
  const [search, setSearch]               = useState("");
  const [filterStatus, setFilterStatus]   = useState("all");
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [profile, setProfile]             = useState({
    name: "Junaid Malik",
    email: "junaid.malik@riphah.edu.pk",
    role: "Internship Incharge",
    dp: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const dpInputRef                        = React.useRef(null);
  const baselineRef                       = React.useRef({ ready: false, apps: new Map() });

  const addToast = (message, type = "info") =>
    setToasts((p) => [...p, { id: Date.now() + Math.random(), message, type }]);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try { localStorage.clear(); sessionStorage.clear(); } catch (_) {}
    navigate("/role-select", { replace: true });
  };

  const relativeTime = (date) => {
    if (!date) return "Just now";
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} day(s) ago`;
  };

  // ── FETCH ─────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [appRes, intRes] = await Promise.all([
        fetch(`${API}/applications`),
        fetch(`${API}/internships`),
      ]);
      const appJson = await appRes.json();
      const intJson = await intRes.json();
      const apps = (appJson.data || []).map((a) => ({ ...a, status: normaliseStatus(a.status) }));
      setApplications(apps);
      setStats(appJson.stats || {});
      setInternships(intJson.data || []);
    } catch {
      addToast("Backend unavailable - using demo data", "warn");
      setApplications(DEMO_APPS);
      setInternships(DEMO_INTERNSHIPS);
      setStats({
        total: DEMO_APPS.length,
        pending: DEMO_APPS.filter((a) => normaliseStatus(a.status) === "pending").length,
        approved: DEMO_APPS.filter((a) => normaliseStatus(a.status) === "approved").length,
        rejected: DEMO_APPS.filter((a) => normaliseStatus(a.status) === "rejected").length,
        sent_to_liaison: DEMO_APPS.filter((a) => normaliseStatus(a.status) === "sent_to_liaison").length,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); fetchProfile(); fetchNotifications(); }, [fetchAll]);

  // ── NOTIFICATIONS - backend-backed ───────────────────────────────────
  const fetchNotifications = async () => {
    try {
      const r = await fetch(`${API}/notifications`);
      if (!r.ok) return;
      const list = await r.json();
      if (Array.isArray(list)) {
        setNotifications(list.map((n) => ({
          id: n._id, _id: n._id,
          title: n.title, text: n.title, message: n.message,
          type: n.type, seen: n.seen, read: n.seen,
          createdAt: n.createdAt,
          time: relativeTime(n.createdAt),
        })));
      }
    } catch { /* silent */ }
  };
  const markNotifSeen = async (id) => {
    try {
      await fetch(`${API}/notifications/${id}/seen`, { method: "PATCH" });
      setNotifications((p) => p.map((n) => (n._id === id || n.id === id) ? { ...n, seen: true, read: true } : n));
    } catch {}
  };
  const markAllNotifSeen = async () => {
    try {
      await fetch(`${API}/notifications/mark-all-seen`, { method: "PATCH" });
      setNotifications((p) => p.map((n) => ({ ...n, seen: true, read: true })));
    } catch {}
  };
  const dismissNotif = async (id) => {
    try {
      await fetch(`${API}/notifications/${id}`, { method: "DELETE" });
      setNotifications((p) => p.filter((n) => (n._id !== id && n.id !== id)));
    } catch {}
  };

  // Poll notifications every 15s
  useEffect(() => {
    const id = setInterval(() => fetchNotifications(), 15000);
    return () => clearInterval(id);
  }, []);

  // ── PROFILE - backend-backed photo + name ────────────────────────────
  const fetchProfile = async () => {
    try {
      const r = await fetch(`${API}/profile`);
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
      const r = await fetch(`${API}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!r.ok) { addToast("Failed to save profile", "error"); return null; }
      const saved = await r.json();
      setProfile((prev) => ({ ...prev, ...saved }));
      return saved;
    } catch {
      addToast("Network error while saving profile", "error");
      return null;
    } finally {
      setProfileSaving(false);
    }
  };

  const handleDpChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { addToast("Please pick an image file", "warn"); return; }
    if (file.size > 6 * 1024 * 1024)     { addToast("Image too large (max 6MB)", "warn"); return; }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result;
      if (typeof dataUrl !== "string") return;
      setProfile((prev) => ({ ...prev, dp: dataUrl }));
      const saved = await saveProfile({ dp: dataUrl });
      if (saved) addToast("Profile photo updated", "success");
    };
    reader.readAsDataURL(file);
  };

  // ── Real-time notifications: poll for new student applications every 15s ──
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const r = await fetch(`${API}/applications`);
        if (!r.ok) return;
        const json = await r.json();
        const list = json.data || [];
        if (cancelled) return;
        const baseline = baselineRef.current;
        const map = new Map(list.map((a) => [String(a._id), a]));
        const fresh = [];
        if (baseline.ready) {
          for (const [id, app] of map) {
            const prev = baseline.apps.get(id);
            if (!prev) {
              const name = getStudentName(app);
              fresh.push({
                id: `app-new-${id}-${Date.now()}`,
                text: `New application from ${name}`,
                time: relativeTime(app.appliedAt || app.createdAt),
                read: false,
              });
            }
          }
        }
        baseline.apps  = map;
        baseline.ready = true;
        if (fresh.length) {
          setNotifications((p) => [...fresh, ...p]);
          setApplications((prev) => {
            const seen = new Set(prev.map((a) => String(a._id)));
            const additions = list
              .filter((a) => !seen.has(String(a._id)))
              .map((a) => ({ ...a, status: normaliseStatus(a.status) }));
            return additions.length ? [...additions, ...prev] : prev;
          });
        }
      } catch (_) { /* silent */ }
    };
    const id = setInterval(poll, 15000);
    const onFocus = () => poll();
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // ── ACCEPT (goes directly to sent_to_liaison) ─────────────────────────
  const handleAccept = async (app) => {
    setActionLoading((p) => ({ ...p, [app._id]: "accepting" }));
    try {
      const res = await fetch(`${API}/applications/${app._id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks: "Accepted by incharge" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Request failed");

      // Update UI: status → sent_to_liaison immediately
      setApplications((prev) =>
        prev.map((a) =>
          a._id === app._id
            ? {
                ...a,
                status: "sent_to_liaison",
                internshipInchargeApproval: { status: "approved", approvedAt: new Date() },
                industryLiaisonApproval: { status: "pending" },
              }
            : a
        )
      );
      setStats((s) => ({
        ...s,
        pending: Math.max((s.pending || 1) - 1, 0),
        sent_to_liaison: (s.sent_to_liaison || 0) + 1,
      }));
      const name = getStudentName(app);
      setNotifications((p) => [
        { id: Date.now(), text: `${name} - accepted & sent to Liaison`, time: "just now", read: false },
        ...p,
      ]);
      addToast("Application accepted & sent to Industry Liaison ✓", "success");
      setCvModal(null);
      fetchNotifications();
    } catch (err) {
      addToast(err.message || "Failed to accept", "error");
    } finally {
      setActionLoading((p) => ({ ...p, [app._id]: null }));
    }
  };

  // ── REJECT ────────────────────────────────────────────────────────────
  const handleReject = async (app) => {
    setActionLoading((p) => ({ ...p, [app._id]: "rejecting" }));
    try {
      const res = await fetch(`${API}/applications/${app._id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks: "Rejected by incharge" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setApplications((p) => p.map((a) => a._id === app._id ? { ...a, status: "rejected" } : a));
      setStats((s) => ({ ...s, pending: Math.max((s.pending || 1) - 1, 0), rejected: (s.rejected || 0) + 1 }));
      addToast("Application rejected", "error");
      setCvModal(null);
      fetchNotifications();
    } catch (err) {
      addToast(err.message || "Failed to reject", "error");
    } finally {
      setActionLoading((p) => ({ ...p, [app._id]: null }));
    }
  };

  // ── DERIVED ───────────────────────────────────────────────────────────
  const filtered = applications.filter((a) => {
    const name  = getStudentName(a).toLowerCase();
    const email = getStudentEmail(a)?.toLowerCase() || "";
    return (name.includes(search.toLowerCase()) || email.includes(search.toLowerCase()))
      && (filterStatus === "all" || normaliseStatus(a.status) === filterStatus);
  });

  const unread   = notifications.filter((n) => !n.read).length;
  const pending  = applications.filter((a) => normaliseStatus(a.status) === "pending");
  const sentList = applications.filter((a) => normaliseStatus(a.status) === "sent_to_liaison");

  const PIE_DATA = [
    { name: "Pending",   value: stats.pending         || 0, color: "#F59E0B" },
    { name: "Sent",      value: stats.sent_to_liaison || 0, color: "#193648" },
    { name: "Rejected",  value: stats.rejected        || 0, color: "#EF4444" },
  ].filter((d) => d.value > 0);

  const navItems = [
    { key: "overview",     label: "Overview",        icon: BarChart3, badge: 0,                desc: "Stats & quick insights"  },
    { key: "applications", label: "Applications",    icon: Users,     badge: pending.length,   desc: "Review & approve"        },
    { key: "sent",         label: "Sent to Liaison", icon: Send,      badge: sentList.length,  desc: "Forwarded to industry"   },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #E2EEF9 0%, #FFFFFF 100%)",
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      display: "block",
      width: "100%", maxWidth: "100%",
      overflowX: "hidden",
      boxSizing: "border-box",
    }}>
      <style>{`
        @keyframes intPing {
          0%   { transform: scale(0.6); opacity: 0.85; }
          80%  { transform: scale(2);   opacity: 0; }
          100% { transform: scale(2);   opacity: 0; }
        }
        @keyframes intKenBurns {
          0%   { transform: scale(1.08) translate3d(0, 0, 0); }
          50%  { transform: scale(1.18) translate3d(-1.5%, -1%, 0); }
          100% { transform: scale(1.08) translate3d(0, 0, 0); }
        }
        @keyframes intShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes intGradientFlow {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* TOP NAVBAR - premium sticky */}
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
            position: "relative",
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
                Internship Incharge
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, alignItems: "center", flex: "1 1 auto", minWidth: 0, justifyContent: "center", flexWrap: "wrap" }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                title={item.desc}
                onClick={() => setTab(item.key)}
                style={{
                  position: "relative",
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "8px 12px", borderRadius: 11,
                  background: active ? "linear-gradient(135deg, rgba(170,195,252,0.18), rgba(122,169,214,0.10))" : "transparent",
                  border: active ? "1px solid rgba(170,195,252,0.35)" : "1px solid transparent",
                  color: active ? "#fff" : "rgba(226,238,249,0.70)",
                  fontSize: 12.5, fontWeight: active ? 800 : 600,
                  cursor: "pointer", transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
                  whiteSpace: "nowrap",
                  boxShadow: active ? "0 6px 18px rgba(122,169,214,0.20), inset 0 1px 0 rgba(255,255,255,0.10)" : "none",
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(226,238,249,0.70)"; e.currentTarget.style.transform = ""; } }}
              >
                <Icon size={15} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{
                    background: active ? "#3A70B0" : "rgba(255,255,255,0.18)",
                    color: "#fff", fontSize: 10, fontWeight: 800,
                    padding: "1px 7px", borderRadius: 99, minWidth: 18, textAlign: "center",
                  }}>{item.badge}</span>
                )}
                {active && (
                  <span aria-hidden style={{
                    position: "absolute", left: "20%", right: "20%", bottom: -6, height: 3, borderRadius: 99,
                    background: "linear-gradient(90deg, transparent 0%, #AAC3FC 50%, transparent 100%)",
                    boxShadow: "0 0 14px rgba(170,195,252,0.7)",
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Right cluster */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button onClick={fetchAll} title="Refresh" style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "#fff", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.18s ease, transform 0.4s ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.16)"; e.currentTarget.style.transform = "rotate(180deg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = ""; }}
          >
            <RefreshCw size={14} />
          </button>

          {/* Bell */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setNotifOpen(!notifOpen)} title="Notifications" style={{
              position: "relative",
              width: 38, height: 38, borderRadius: 10,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#fff", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.18s ease",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            >
              <Bell size={16} />
              {unread > 0 && (
                <span style={{
                  position: "absolute", top: -3, right: -3,
                  background: "#ef4444", color: "#fff",
                  fontSize: 9, minWidth: 16, height: 16, padding: "0 4px",
                  borderRadius: 999,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, border: "2px solid #193648",
                }}>{Math.min(99, unread)}</span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute", right: 0, top: 50,
                    width: 460, maxWidth: "calc(100vw - 32px)", maxHeight: 560, overflow: "hidden",
                    background: "#fff", color: "#193648",
                    border: "1px solid #E2EEF9", borderRadius: 18,
                    boxShadow: "0 32px 70px rgba(15,23,42,0.28), 0 4px 12px rgba(15,23,42,0.10)",
                    zIndex: 1200,
                    display: "flex", flexDirection: "column",
                  }}
                >
                  {/* Premium gradient header */}
                  <div style={{
                    position: "relative",
                    background: "linear-gradient(135deg, #0F2A38 0%, #193648 60%, #1F4159 100%)",
                    padding: "12px 16px", minHeight: 60,
                    color: "#fff", overflow: "hidden",
                    borderBottom: "1px solid rgba(170,195,252,0.18)",
                    display: "flex", alignItems: "center",
                  }}>
                    <span aria-hidden style={{
                      position: "absolute", left: 0, right: 0, bottom: 0, height: 2,
                      background: "linear-gradient(90deg, transparent 0%, rgba(170,195,252,0.55) 50%, transparent 100%)",
                      pointerEvents: "none",
                    }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 11, position: "relative", zIndex: 1, width: "100%" }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.20)",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
                      }}>
                        <Bell size={15} color="#AAC3FC" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: 14.5, letterSpacing: "-0.01em", fontFamily: "'Sora', 'Inter', sans-serif" }}>Notifications</span>
                          {unread > 0 && (
                            <span style={{
                              fontSize: 10, fontWeight: 800, letterSpacing: "0.04em",
                              padding: "2px 7px", borderRadius: 999,
                              background: "#ef4444", color: "#fff",
                              boxShadow: "0 0 0 2px rgba(239,68,68,0.25)",
                              fontVariantNumeric: "tabular-nums",
                            }}>{unread}</span>
                          )}
                        </div>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          fontSize: 10, color: "rgba(226,238,249,0.7)",
                          fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2,
                        }}>
                          <span style={{ position: "relative", display: "inline-flex", width: 5, height: 5 }}>
                            <span aria-hidden style={{
                              position: "absolute", inset: 0, borderRadius: "50%", background: "#22C55E",
                              animation: "intPing 1.8s cubic-bezier(0,0,0.2,1) infinite",
                            }} />
                            <span style={{ position: "relative", width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
                          </span>
                          Live · auto-sync 15s
                        </div>
                      </div>
                      {unread > 0 && (
                        <button onClick={markAllNotifSeen} title="Mark all as read" style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "6px 10px", borderRadius: 8,
                          background: "rgba(255,255,255,0.10)", color: "#fff",
                          border: "1px solid rgba(255,255,255,0.20)",
                          fontSize: 10.5, fontWeight: 700, cursor: "pointer", flexShrink: 0,
                        }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
                        >
                          <CheckCircle size={11} /> Mark all
                        </button>
                      )}
                      <button onClick={fetchNotifications} title="Refresh" style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)",
                        cursor: "pointer", color: "#fff",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.18s ease, transform 0.4s ease",
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.transform = "rotate(180deg)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.transform = ""; }}
                      >
                        <RefreshCw size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable list */}
                  <div style={{ padding: 12, overflowY: "auto", flex: 1, background: "#fbfdff" }}>
                    {notifications.length === 0 ? (
                      <div style={{
                        textAlign: "center", padding: "36px 16px",
                        background: "#fff", border: "1px dashed #E2EEF9", borderRadius: 14,
                      }}>
                        <div style={{
                          width: 50, height: 50, borderRadius: 14,
                          background: "linear-gradient(135deg, #f8fbff, #E2EEF9)", color: "#3A70B0",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          marginBottom: 10, boxShadow: "0 6px 14px rgba(58,112,176,0.18)",
                        }}>
                          <Bell size={22} />
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#193648" }}>You're all caught up</div>
                        <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 4 }}>Live updates appear here every 15s.</div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {notifications.slice(0, 12).map((n, i) => {
                          const tag = (n.type || "info").toLowerCase();
                          const palette = {
                            success: { bg: "#f0fdf4", color: "#15803d", Icon: CheckCircle },
                            warning: { bg: "#fff7ed", color: "#c2410c", Icon: XCircle },
                            urgent:  { bg: "#fff1f2", color: "#be123c", Icon: XCircle },
                            info:    { bg: "#eff6ff", color: "#3A70B0", Icon: Bell },
                          };
                          const p = palette[tag] || palette.info;
                          const ts = n.createdAt;
                          const seen = n.seen || n.read;
                          return (
                            <motion.div
                              key={n._id || n.id}
                              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03, duration: 0.3 }}
                              style={{
                                position: "relative",
                                display: "flex", gap: 10, alignItems: "flex-start",
                                padding: "11px 12px", borderRadius: 12,
                                background: seen ? "#fff" : "linear-gradient(180deg, #f8fbff, #ffffff)",
                                border: `1px solid ${seen ? "#eef2ff" : p.bg}`,
                                boxShadow: seen ? "none" : `0 2px 10px ${p.color}14`,
                                overflow: "hidden",
                                transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.transform = "translateX(2px)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = seen ? "#eef2ff" : p.bg; e.currentTarget.style.transform = ""; }}
                            >
                              {!seen && (
                                <span aria-hidden style={{
                                  position: "absolute", top: 0, bottom: 0, left: 0, width: 3,
                                  background: `linear-gradient(180deg, ${p.color}, ${p.color}88)`,
                                }} />
                              )}
                              <span style={{
                                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: p.bg, color: p.color,
                                border: `1px solid ${p.color}33`,
                                marginLeft: !seen ? 4 : 0,
                              }}>
                                <p.Icon size={14} />
                              </span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", lineHeight: 1.35, letterSpacing: "-0.005em" }}>
                                  {n.title || n.text || "Notification"}
                                </div>
                                {n.message && n.message !== (n.title || n.text) && (
                                  <div style={{
                                    fontSize: 11.5, color: "#5b7184", marginTop: 3, lineHeight: 1.5,
                                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                                  }}>{n.message}</div>
                                )}
                                <div style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 5, display: "inline-flex", alignItems: "center", gap: 6 }}>
                                  <span style={{
                                    color: p.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em",
                                    background: p.bg, padding: "1px 7px", borderRadius: 999,
                                    border: `1px solid ${p.color}22`,
                                  }}>{tag}</span>
                                  {ts && <span>{new Date(ts).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>}
                                </div>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                                {!seen && (
                                  <button onClick={() => markNotifSeen(n._id || n.id)} title="Mark read" style={{
                                    width: 26, height: 26, borderRadius: 8,
                                    background: "#fff", border: "1px solid #E2EEF9",
                                    color: "#3A70B0", cursor: "pointer",
                                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                                  }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#3A70B0"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E2EEF9"; }}
                                  >
                                    <CheckCircle size={12} />
                                  </button>
                                )}
                                <button onClick={() => dismissNotif(n._id || n.id)} title="Dismiss" style={{
                                  width: 26, height: 26, borderRadius: 8,
                                  background: "#fff", border: "1px solid #fecdd3",
                                  color: "#be123c", cursor: "pointer",
                                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                                }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.borderColor = "#be123c"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#fecdd3"; }}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div style={{
                      padding: "10px 14px",
                      borderTop: "1px solid #eef2ff", background: "#fff",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      fontSize: 11, color: "#94a3b8",
                    }}>
                      <span>Showing {Math.min(12, notifications.length)} of {notifications.length}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#3A70B0", fontWeight: 700 }}>
                        <RefreshCw size={10} /> Auto-sync 15s
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "4px 10px 4px 4px", borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "#fff",
          }}>
            <button
              type="button"
              onClick={() => dpInputRef.current?.click()}
              title={profileSaving ? "Saving..." : "Change profile photo"}
              disabled={profileSaving}
              style={{
                position: "relative", width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, #193648, #3A70B0)", padding: 2,
                flexShrink: 0, border: "none",
                cursor: profileSaving ? "wait" : "pointer",
                overflow: "hidden",
              }}
            >
              <img
                src={profile.dp || junaidAvatar}
                alt={profile.name}
                onError={(e) => { if (e.currentTarget.src !== junaidAvatar) e.currentTarget.src = junaidAvatar; }}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", display: "block" }}
              />
              <span aria-hidden className="intDpHover" style={{
                position: "absolute", inset: 2, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(15,42,56,0.55)", color: "#fff",
                opacity: 0, transition: "opacity 0.18s ease",
                pointerEvents: "none",
              }}>
                <Camera size={12} />
              </span>
              {profileSaving && (
                <span aria-hidden style={{
                  position: "absolute", inset: 2, borderRadius: "50%",
                  background: "rgba(15,42,56,0.55)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <RefreshCw size={12} />
                </span>
              )}
              <span style={{
                position: "absolute", bottom: -1, right: -1,
                width: 9, height: 9, borderRadius: "50%",
                background: "#22C55E", border: "2px solid #193648",
              }} />
            </button>
            <input
              ref={dpInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => { handleDpChange(e.target.files?.[0]); e.target.value = ""; }}
            />
            <style>{`
              button[title="Change profile photo"]:hover .intDpHover { opacity: 1; }
            `}</style>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, whiteSpace: "nowrap", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis" }}>{profile.name}</span>
              <span style={{ fontSize: 9.5, color: "rgba(226,238,249,0.7)", fontWeight: 600 }}>{profile.role || "Internship Incharge"}</span>
            </span>
            <button onClick={handleLogout} title="Sign out" style={{
              width: 28, height: 28, borderRadius: 8,
              background: "rgba(239,68,68,0.16)", border: "1px solid rgba(239,68,68,0.30)",
              color: "#fca5a5", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.24)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.16)")}
            >
              <LogOut size={12} />
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop when sidebar is open (legacy, kept harmless) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            onClick={() => setSidebarOpen(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", inset: 0, background: "rgba(15,42,56,0.35)",
              backdropFilter: "blur(2px)", zIndex: 30,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR (legacy - disabled in favor of top navbar) ─── */}
      <motion.aside
        animate={{ x: -280 }}
        initial={{ x: -280 }}
        transition={{ duration: 0 }}
        style={{
          width: 0, height: 0,
          background: "transparent",
          position: "fixed",
          top: 0, left: 0, zIndex: -1,
          display: "none", flexDirection: "column",
          overflow: "hidden",
          pointerEvents: "none",
        }}>
        {/* Ambient glow */}
        <div aria-hidden style={{
          position: "absolute",
          top: -120, left: -100,
          width: 280, height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(226,238,249,0.20) 0%, rgba(226,238,249,0) 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
          zIndex: 0,
        }} />
        {/* Logo */}
        <div style={{ padding: "26px 18px 20px 22px", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 16px rgba(15,42,56,0.4)",
              flexShrink: 0,
            }}>
              <img src={collaxionLogo} alt="CollaXion" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.01em" }}>
                <span>C</span>olla<span style={{ color: "#E2EEF9" }}>X</span>ion
              </div>
              <div style={{ fontSize: 9.5, color: "rgba(226,238,249,0.55)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>Internship Operations</div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              title="Collapse menu"
              style={{
                width: 30, height: 30, borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#fff", cursor: "pointer", flexShrink: 0,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <ChevronLeft size={15} />
            </button>
          </div>
        </div>

        {/* Role pill */}
        <div style={{ padding: "12px 22px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(226,238,249,0.12)", border: "1px solid rgba(226,238,249,0.25)",
            borderRadius: 99, padding: "5px 12px",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.25)" }} />
            <span style={{ fontSize: 10, color: "#E2EEF9", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Incharge Portal
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "18px 14px 12px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{
            fontSize: 9.5, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(226,238,249,0.45)", padding: "0 8px", marginBottom: 10,
          }}>
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.key;
            return (
              <button key={item.key} onClick={() => setTab(item.key)} style={{
                position: "relative",
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "11px 14px", borderRadius: 12, marginBottom: 5,
                background: active ? "rgba(226,238,249,0.14)" : "transparent",
                border: active ? "1px solid rgba(226,238,249,0.22)" : "1px solid transparent",
                color: active ? "#E2EEF9" : "rgba(226,238,249,0.62)",
                fontSize: 13.5, fontWeight: active ? 700 : 500,
                cursor: "pointer", transition: "all 0.2s ease", textAlign: "left",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => !active && (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              onMouseLeave={(e) => !active && (e.currentTarget.style.background = "transparent")}
              >
                {active && (
                  <span aria-hidden style={{
                    position: "absolute",
                    left: 0, top: "18%", bottom: "18%",
                    width: 3,
                    borderRadius: 4,
                    background: "linear-gradient(180deg, #E2EEF9, #AAC3FC)",
                    boxShadow: "0 0 12px rgba(226,238,249,0.5)",
                  }} />
                )}
                <span style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: active ? "rgba(226,238,249,0.18)" : "rgba(255,255,255,0.05)",
                  border: active ? "1px solid rgba(226,238,249,0.20)" : "1px solid rgba(255,255,255,0.06)",
                }}>
                  <Icon size={16} />
                </span>
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                  <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 600 }}>{item.label}</span>
                  <span style={{
                    fontSize: 10.5,
                    color: active ? "rgba(226,238,249,0.65)" : "rgba(226,238,249,0.4)",
                    fontWeight: 500, marginTop: 2,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{item.desc}</span>
                </span>
                {item.badge > 0 && (
                  <span style={{
                    background: active ? "#3A70B0" : "rgba(255,255,255,0.12)",
                    color: "#fff", fontSize: 11, fontWeight: 700,
                    padding: "2px 8px", borderRadius: 99, minWidth: 22, textAlign: "center",
                    flexShrink: 0,
                  }}>{item.badge}</span>
                )}
              </button>
            );
          })}

          {/* Today's Pipeline mini-card */}
          <div style={{
            marginTop: "auto", marginBottom: 4,
            padding: "12px 14px",
            borderRadius: 12,
            background: "linear-gradient(135deg, rgba(226,238,249,0.10), rgba(58,112,176,0.10))",
            border: "1px solid rgba(226,238,249,0.18)",
          }}>
            <div style={{
              fontSize: 9.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "rgba(226,238,249,0.55)", marginBottom: 8,
            }}>
              Today's Pipeline
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11.5, color: "rgba(226,238,249,0.6)" }}>Pending</span>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: "#fff" }}>{stats.pending || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11.5, color: "rgba(226,238,249,0.6)" }}>Forwarded</span>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: "#E2EEF9" }}>{stats.sent_to_liaison || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11.5, color: "rgba(226,238,249,0.6)" }}>Total</span>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: "#fff" }}>{stats.total || applications.length}</span>
            </div>
          </div>
        </nav>

        {/* User */}
        <div style={{ padding: "18px 18px 22px", borderTop: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 11, marginBottom: 14,
            padding: "10px 12px", borderRadius: 14,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(6px)",
          }}>
            <div style={{
              position: "relative",
              width: 42, height: 42,
              borderRadius: "50%",
              padding: 2,
              background: "linear-gradient(135deg, #193648, #3A70B0)",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(25,54,72,0.3)",
            }}>
              <img
                src={junaidAvatar}
                alt="Junaid Malik"
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff", display: "block" }}
              />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Junaid Malik</div>
              <div style={{ fontSize: 11, color: "rgba(226,238,249,0.55)", fontWeight: 500 }}>Internship Incharge</div>
            </div>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.25)", flexShrink: 0 }} />
          </div>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%",
            padding: "10px 14px", background: "rgba(239,68,68,0.1)",
            color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "0.18s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
          ><LogOut size={15} /> Sign Out</button>
        </div>
      </motion.aside>

      {/* ── MAIN ────────────────────────────────────────────────────── */}
      <main style={{
        marginLeft: 0,
        padding: "0 28px 0",
        minHeight: "calc(100vh - 60px)",
        width: "100%", maxWidth: "100%",
        boxSizing: "border-box", overflowX: "hidden",
        display: "flex", flexDirection: "column",
      }}>

        {/* Sub-header - only on Applications tab (refined inline) */}
        {tab === "applications" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              margin: "20px 0 16px", gap: 16, flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "linear-gradient(135deg, #193648, #3A70B0)",
                color: "#fff", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 18px rgba(25,54,72,0.28)",
              }}>
                <Users size={20} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h1 style={{
                  margin: 0, fontSize: 22, fontWeight: 800, color: "#193648",
                  letterSpacing: "-0.02em", fontFamily: "'Sora', sans-serif",
                  display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
                }}>
                  Student Applications
                  <span style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "#3A70B0", background: "#eff6ff",
                    border: "1px solid #cfe0f0",
                    padding: "3px 10px", borderRadius: 999,
                  }}>
                    Inbox
                  </span>
                </h1>
                <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 4 }}>
                  Review &amp; forward applications to the Industry Liaison.
                </div>
              </div>
            </div>
            <button onClick={fetchAll} title="Refresh applications" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "9px 14px", borderRadius: 10,
              background: "#fff", border: "1px solid #E2EEF9", color: "#193648",
              fontSize: 12.5, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 4px 12px rgba(25,54,72,0.06)",
              transition: "background 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#3A70B0"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E2EEF9"; e.currentTarget.style.transform = ""; }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </motion.div>
        )}

        {/* ── TAB CONTENT ─────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            style={{ flex: 1, minHeight: 0 }}>

            {/* ─── OVERVIEW ─────────────────────────────────────── */}
            {tab === "overview" && (
              <div>
                {loading ? (
                  <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner size={32} /></div>
                ) : (
                  <>
                    {/* CINEMATIC HERO BANNER - full viewport, full bleed */}
                    <div style={{
                      position: "relative",
                      margin: "0 -28px 22px",
                      height: "calc(100vh - 60px)",
                      minHeight: 540,
                      color: "#fff",
                      overflow: "hidden",
                      boxShadow: "0 14px 40px rgba(15,42,56,0.25)",
                      isolation: "isolate",
                    }}>
                      {/* Background image with Ken-Burns motion */}
                      <div aria-hidden style={{
                        position: "absolute", inset: 0,
                        backgroundImage: "url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2400&q=85)",
                        backgroundSize: "cover", backgroundPosition: "center",
                        filter: "saturate(0.85) contrast(1.05) hue-rotate(-8deg)",
                        animation: "intKenBurns 24s ease-in-out infinite",
                        zIndex: 0,
                      }} />
                      {/* Multi-layer brand overlays */}
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
                      {/* Floating glow orbs */}
                      <div aria-hidden style={{
                        position: "absolute", top: "12%", right: "8%",
                        width: 200, height: 200, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(122,169,214,0.35) 0%, rgba(122,169,214,0) 70%)",
                        filter: "blur(30px)", zIndex: 1,
                        animation: "intKenBurns 18s ease-in-out infinite reverse",
                      }} />
                      <div aria-hidden style={{
                        position: "absolute", bottom: "-10%", left: "30%",
                        width: 260, height: 260, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(58,112,176,0.30) 0%, rgba(58,112,176,0) 70%)",
                        filter: "blur(40px)", zIndex: 1,
                      }} />
                      {/* Diagonal shimmer */}
                      <div aria-hidden style={{
                        position: "absolute", top: 0, bottom: 0, left: 0, width: "30%",
                        background: "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)",
                        animation: "intShimmer 7s linear infinite",
                        zIndex: 2, pointerEvents: "none",
                      }} />

                      {/* CONTENT */}
                      <div style={{
                        position: "relative", zIndex: 3,
                        height: "100%",
                        padding: "32px 48px 28px",
                        display: "flex", flexDirection: "column",
                      }}>
                        {/* Top badges */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            background: "rgba(255,255,255,0.10)",
                            border: "1px solid rgba(255,255,255,0.22)",
                            backdropFilter: "blur(10px)",
                            padding: "6px 14px", borderRadius: 999,
                            fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
                            color: "#E2EEF9",
                          }}>
                            <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
                              <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#22C55E", animation: "intPing 1.6s cubic-bezier(0,0,0.2,1) infinite" }} />
                              <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: "#22C55E" }} />
                            </span>
                            Internship Operations · Live
                          </div>
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: 10,
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.18)",
                            backdropFilter: "blur(10px)",
                            padding: "8px 14px", borderRadius: 12,
                          }}>
                            <Clock size={14} style={{ color: "#AAC3FC" }} />
                            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                              <span style={{ fontSize: 14, fontWeight: 800 }}>{new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                              <span style={{ fontSize: 9.5, color: "rgba(226,238,249,0.7)", letterSpacing: "0.10em", textTransform: "uppercase", marginTop: 2 }}>
                                {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Centerpiece */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 760 }}>
                          <motion.div
                            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(226,238,249,0.75)", marginBottom: 8 }}
                          >
                            Welcome · Faculty of Computing
                          </motion.div>
                          <motion.h1
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                              margin: 0, fontSize: 44, fontWeight: 900, lineHeight: 1.05,
                              letterSpacing: "-0.025em",
                              fontFamily: "'Sora', 'Inter', sans-serif",
                              textShadow: "0 4px 20px rgba(0,0,0,0.35)",
                            }}
                          >
                            Hello, Junaid.
                            <br />
                            <span style={{
                              background: "linear-gradient(90deg, #E2EEF9 0%, #AAC3FC 25%, #7AA9D6 50%, #3A70B0 75%, #AAC3FC 100%)",
                              backgroundSize: "200% auto",
                              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                              animation: "intGradientFlow 6s linear infinite",
                              display: "inline-block",
                            }}>
                              Where Talent Meets Opportunity.
                            </span>
                          </motion.h1>
                          <motion.p
                            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.7 }}
                            style={{ marginTop: 14, marginBottom: 0, fontSize: 14.5, color: "rgba(226,238,249,0.85)", lineHeight: 1.6, maxWidth: 600, textShadow: "0 2px 10px rgba(0,0,0,0.25)" }}
                          >
                            <strong style={{ color: "#fff" }}>{stats.pending || 0}</strong> awaiting review,
                            {" "}<strong style={{ color: "#fff" }}>{stats.sent_to_liaison || 0}</strong> forwarded to Industry Liaison,
                            and <strong style={{ color: "#fff" }}>{(stats.total || applications.length) || 0}</strong> total applications.
                          </motion.p>

                          <motion.div
                            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.6 }}
                            style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}
                          >
                            <button onClick={() => setTab("applications")} style={{
                              display: "inline-flex", alignItems: "center", gap: 8,
                              background: "#fff", color: "#193648",
                              border: "none", borderRadius: 12, padding: "12px 22px",
                              fontWeight: 800, fontSize: 13.5, cursor: "pointer",
                              boxShadow: "0 14px 30px rgba(0,0,0,0.30)",
                              transition: "transform 0.18s ease, box-shadow 0.18s ease",
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 18px 36px rgba(0,0,0,0.36)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.30)"; }}
                            >
                              <Users size={14} /> Review Pending
                            </button>
                            <button onClick={() => setTab("sent")} style={{
                              display: "inline-flex", alignItems: "center", gap: 8,
                              background: "rgba(255,255,255,0.10)", color: "#fff",
                              border: "1px solid rgba(255,255,255,0.30)",
                              borderRadius: 12, padding: "12px 22px",
                              fontWeight: 700, fontSize: 13.5, cursor: "pointer",
                              backdropFilter: "blur(10px)",
                              transition: "background 0.18s ease",
                            }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
                            >
                              <Send size={14} /> View Forwarded
                            </button>
                          </motion.div>

                        {/* Glass stat ribbon - placed inside centerpiece, right under CTAs */}
                        <motion.div
                          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35, duration: 0.7 }}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))",
                            gap: 14, marginTop: 28, maxWidth: 920,
                          }}
                        >
                          {[
                            { Icon: Users,       label: "Total",     value: stats.total || applications.length || 0, sub: "applications",    accent: "#7AA9D6" },
                            { Icon: Clock,       label: "Pending",   value: stats.pending || 0,                       sub: "awaiting review", accent: "#fcd34d" },
                            { Icon: Send,        label: "Forwarded", value: stats.sent_to_liaison || 0,                sub: "with liaison",    accent: "#AAC3FC" },
                            { Icon: CheckCircle, label: "Approved",  value: stats.approved || 0,                       sub: "this term",       accent: "#86efac" },
                          ].map((s, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                              whileHover={{ y: -3 }}
                              style={{
                                position: "relative",
                                padding: "16px 18px", borderRadius: 14,
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
                              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, position: "relative", zIndex: 1 }}>
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
                                fontSize: 36, fontWeight: 900, color: "#fff",
                                fontFamily: "'Sora', 'Inter', sans-serif",
                                fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em",
                                lineHeight: 1, marginBottom: 6,
                                textShadow: `0 2px 14px ${s.accent}33`,
                              }}>
                                {s.value}
                              </div>
                              <div style={{ fontSize: 11, color: "rgba(226,238,249,0.72)", fontWeight: 600 }}>{s.sub}</div>
                            </motion.div>
                          ))}
                        </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* (legacy Today card removed - hero now shows live time) */}

                    {/* (Standalone counts removed - hero already shows live stat ribbon) */}

                    {/* Charts - responsive */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 18, marginBottom: 16 }}>
                      <div style={{ background: "#fff", border: "1px solid #E2EEF9", borderRadius: 18, padding: "24px 28px", boxShadow: "0 4px 18px rgba(25,54,72,0.06)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: "#193648" }}>Application Trend</div>
                            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>Received vs forwarded - this week</div>
                          </div>
                          <span style={{
                            fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                            color: "#193648", background: "#E2EEF9",
                            padding: "4px 10px", borderRadius: 999,
                          }}>Last 7 days</span>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart data={[
                            { d: "Mon", r: 3, a: 1 }, { d: "Tue", r: 6, a: 3 },
                            { d: "Wed", r: 9, a: 5 }, { d: "Thu", r: 5, a: 2 },
                            { d: "Fri", r: 8, a: 4 }, { d: "Sat", r: 4, a: 2 }, { d: "Sun", r: 2, a: 1 },
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="d" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2EEF9", borderRadius: 10, fontSize: 13 }} />
                            <Line type="monotone" dataKey="r" stroke="#193648" strokeWidth={2.5} dot={{ r: 4, fill: "#193648" }} name="Received" />
                            <Line type="monotone" dataKey="a" stroke="#3A70B0" strokeWidth={2.5} dot={{ r: 4, fill: "#3A70B0" }} name="Forwarded" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div style={{ background: "#fff", border: "1px solid #E2EEF9", borderRadius: 18, padding: "24px 28px", boxShadow: "0 4px 18px rgba(25,54,72,0.06)" }}>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#193648", marginBottom: 3 }}>Status Breakdown</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>How applications are distributed</div>
                        {PIE_DATA.length === 0
                          ? <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 13 }}>No data yet</div>
                          : <>
                            <ResponsiveContainer width="100%" height={150}>
                              <PieChart>
                                <Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={65} innerRadius={40}
                                  dataKey="value" paddingAngle={3}>
                                  {PIE_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 8 }}>
                              {PIE_DATA.map((d) => (
                                <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                    <div style={{ width: 9, height: 9, borderRadius: 3, background: d.color }} />
                                    <span style={{ fontSize: 13, color: "#64748b" }}>{d.name}</span>
                                  </div>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{d.value}</span>
                                </div>
                              ))}
                            </div>
                          </>}
                      </div>
                    </div>

                    {/* Recent */}
                    <div style={{ background: "#fff", border: "1px solid #E2EEF9", borderRadius: 18, padding: "24px 28px", boxShadow: "0 4px 18px rgba(25,54,72,0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 16, color: "#193648" }}>Recent Applications</div>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
                            Latest students who applied - review and forward to industry
                          </div>
                        </div>
                        <button onClick={() => setTab("applications")} style={{
                          background: "#193648", color: "#fff", border: "1px solid #193648",
                          borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(25,54,72,0.20)",
                        }}>View All →</button>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {applications.slice(0, 6).map((app) => (
                          <MiniRow key={app._id} app={app} internships={internships}
                            onView={() => setCvModal(app)}
                            onAccept={() => handleAccept(app)}
                          />
                        ))}
                        {applications.length === 0 && (
                          <div style={{ textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 13 }}>No applications yet - students will appear here once they apply.</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ─── APPLICATIONS ─────────────────────────────────── */}
            {tab === "applications" && (
              <div>
                <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 9,
                    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
                    padding: "10px 14px", flex: 1, minWidth: 200,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}>
                    <Search size={15} color="#94a3b8" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by name or email..."
                      style={{ background: "none", border: "none", outline: "none", width: "100%", fontSize: 13.5, color: "#0f172a" }} />
                  </div>
                  {["all", "pending", "sent_to_liaison", "rejected"].map((s) => {
                    const count = s === "all"
                      ? applications.length
                      : applications.filter((a) => normaliseStatus(a.status) === s).length;
                    const active = filterStatus === s;
                    return (
                      <button key={s} onClick={() => setFilterStatus(s)} style={{
                        padding: "10px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
                        background: active ? "#193648" : "#fff",
                        color: active ? "#fff" : "#64748b",
                        border: active ? "1px solid #193648" : "1px solid #e2e8f0",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)", whiteSpace: "nowrap", transition: "0.15s",
                      }}>
                        {s === "all" ? "All" : s === "sent_to_liaison" ? "Sent to Liaison" : s.charAt(0).toUpperCase() + s.slice(1)}
                        <span style={{ marginLeft: 6, opacity: 0.7 }}>({count})</span>
                      </button>
                    );
                  })}
                </div>

                {loading
                  ? <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner size={32} /></div>
                  : filtered.length === 0
                    ? <EmptyState icon={Users} text="No applications match your filters" />
                    : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {filtered.map((app) => (
                          <AppCard key={app._id} app={app} internships={internships}
                            onView={() => setCvModal(app)}
                            onAccept={() => handleAccept(app)}
                            onReject={() => handleReject(app)}
                            loading={actionLoading[app._id]}
                          />
                        ))}
                      </div>
                    )}
              </div>
            )}

            {/* ─── SENT TO LIAISON - premium ─────────────────────── */}
            {tab === "sent" && (
              <div style={{ paddingTop: 22 }}>
                {loading
                  ? <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><Spinner size={32} /></div>
                  : sentList.length === 0
                    ? <EmptyState icon={Send} text="No applications forwarded to liaison yet" />
                    : (
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                        gap: 20,
                        marginBottom: 32,
                      }}>
                        {sentList.map((app, idx) => (
                          <motion.div
                            key={app._id}
                            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            style={{ display: "flex" }}
                          >
                            <SentCard app={app} internships={internships} />
                          </motion.div>
                        ))}
                      </div>
                    )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── FOOTER ────────────────────────────────────────────── */}
        <motion.footer
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            margin: "28px -28px 0",
            marginTop: "auto",
            background: "linear-gradient(135deg, #0F2A38 0%, #193648 50%, #1F4159 100%)",
            color: "rgba(226,238,249,0.85)",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <span aria-hidden style={{
            position: "absolute", left: 0, right: 0, top: 0, height: 2,
            background: "linear-gradient(90deg, transparent 0%, rgba(122,169,214,0.6) 30%, rgba(170,195,252,0.7) 50%, rgba(122,169,214,0.6) 70%, transparent 100%)",
            opacity: 0.7, pointerEvents: "none",
          }} />
          <div aria-hidden style={{
            position: "absolute", top: -100, left: -80,
            width: 320, height: 320, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(122,169,214,0.18) 0%, rgba(122,169,214,0) 70%)",
            filter: "blur(40px)", pointerEvents: "none",
          }} />
          <div aria-hidden style={{
            position: "absolute", bottom: -120, right: -60,
            width: 280, height: 280, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(58,112,176,0.22) 0%, rgba(58,112,176,0) 70%)",
            filter: "blur(40px)", pointerEvents: "none",
          }} />

          <div style={{
            position: "relative", zIndex: 1,
            padding: "40px 32px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: 28,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
                  border: "1px solid rgba(255,255,255,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 6px 18px rgba(15,42,56,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}>
                  <img src={collaxionLogo} alt="CollaXion" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{
                    fontWeight: 800, fontSize: 18, letterSpacing: "-0.01em", lineHeight: 1.1,
                    background: "linear-gradient(90deg, #ffffff 0%, #E2EEF9 50%, #AAC3FC 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>CollaXion</div>
                  <div style={{ fontSize: 9.5, color: "rgba(226,238,249,0.6)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 3 }}>
                    Internship Operations
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.65, color: "rgba(226,238,249,0.7)", maxWidth: 280 }}>
                Where talent meets opportunity - review applications, forward to industry, and track every internship from intake to placement.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(226,238,249,0.55)", marginBottom: 14 }}>
                Workspace
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {navItems.map((l) => (
                  <button key={l.key} onClick={() => setTab(l.key)} style={{
                    display: "inline-flex", alignItems: "center", gap: 9,
                    background: "transparent", border: "none",
                    color: "rgba(226,238,249,0.75)", fontSize: 12.5, fontWeight: 600,
                    cursor: "pointer", padding: 0, textAlign: "left",
                    transition: "color 0.18s ease, transform 0.18s ease",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateX(2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(226,238,249,0.75)"; e.currentTarget.style.transform = ""; }}
                  >
                    <l.icon size={13} color="#7AA9D6" />
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(226,238,249,0.55)", marginBottom: 14 }}>
                At a Glance
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { Icon: Clock,       label: "Pending",   value: stats.pending || 0,                              accent: "#fcd34d" },
                  { Icon: Send,        label: "Forwarded", value: stats.sent_to_liaison || 0,                      accent: "#AAC3FC" },
                  { Icon: CheckCircle, label: "Approved",  value: stats.approved || 0,                             accent: "#86efac" },
                  { Icon: Users,       label: "Total",     value: stats.total || applications.length || 0,         accent: "#7AA9D6" },
                ].map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                    padding: "8px 12px", borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 12, color: "rgba(226,238,249,0.78)" }}>
                      <s.Icon size={13} color={s.accent} />
                      {s.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

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
                  onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(226,238,249,0.85)"}
                >
                  <span style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <Briefcase size={13} color="#AAC3FC" />
                  </span>
                  Faculty of Computing
                </a>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 9,
                  fontSize: 12.5, color: "rgba(226,238,249,0.85)", fontWeight: 600,
                }}>
                  <span style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <Target size={13} color="#7AA9D6" />
                  </span>
                  Riphah International University
                </div>
              </div>
            </div>
          </div>

          <div style={{
            position: "relative", zIndex: 1,
            padding: "16px 32px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap",
            fontSize: 11.5, color: "rgba(226,238,249,0.55)",
          }}>
            <div>
              © {new Date().getFullYear()} <strong style={{ color: "rgba(226,238,249,0.9)", fontWeight: 800 }}>CollaXion</strong> · All rights reserved.
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {["Privacy", "Terms", "Support", "Changelog"].map((label, i, arr) => (
                <React.Fragment key={label}>
                  <span style={{ color: "rgba(226,238,249,0.65)", fontSize: 11.5, fontWeight: 600, padding: "4px 6px" }}>{label}</span>
                  {i < arr.length - 1 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(226,238,249,0.25)" }} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.footer>
      </main>

      {/* ── CV MODAL ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {cvModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
              zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
              padding: 20, backdropFilter: "blur(3px)",
            }}
            onClick={() => setCvModal(null)}>
            <motion.div initial={{ scale: 0.97, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97 }}
              style={{
                width: "100%", maxWidth: 740, background: "#fff",
                border: "1px solid #e2e8f0", borderRadius: 20,
                maxHeight: "88vh", display: "flex", flexDirection: "column",
                boxShadow: "0 30px 80px rgba(15,23,42,0.2)",
              }}
              onClick={(e) => e.stopPropagation()}>
              <CVModal
                app={cvModal}
                internships={internships}
                onClose={() => setCvModal(null)}
                onAccept={() => handleAccept(cvModal)}
                onReject={() => handleReject(cvModal)}
                loading={actionLoading[cvModal._id]}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONFIRM ACCEPT MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
              zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center",
              padding: 20, backdropFilter: "blur(3px)",
            }}>
            <motion.div initial={{ scale: 0.96, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
              style={{
                width: "100%", maxWidth: 440, background: "#fff",
                border: "1px solid #e2e8f0", borderRadius: 18, padding: 28,
                boxShadow: "0 24px 60px rgba(15,23,42,0.15)",
              }}>
              <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, background: "#E2EEF9",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Send size={20} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: "#0f172a" }}>
                    Accept & Send to Liaison?
                  </div>
                  <p style={{ color: "#64748b", fontSize: 13.5, marginTop: 6, lineHeight: 1.6 }}>
                    <strong style={{ color: "#0f172a" }}>{getStudentName(confirmModal)}</strong>'s
                    application will be accepted and forwarded to Industry Liaison immediately.
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setConfirmModal(null)} style={{
                  padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0",
                  background: "#fff", color: "#64748b", fontWeight: 600, fontSize: 13.5, cursor: "pointer",
                }}>Cancel</button>
                <button onClick={() => { handleAccept(confirmModal); setConfirmModal(null); }} style={{
                  padding: "10px 24px", borderRadius: 10, border: "none",
                  background: "#193648", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(25,54,72,0.3)",
                }}>Yes, Accept & Send</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOASTS ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type}
            onClose={() => setToasts((p) => p.filter((x) => x.id !== t.id))} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── MINI ROW ────────────────────────────────────────────────────────────
function MiniRow({ app, internships, onView, onAccept }) {
  const name   = getStudentName(app);
  const email  = getStudentEmail(app);
  const intern = internships.find((i) => String(i._id) === String(app.internshipId?._id || app.internshipId));
  const status = normaliseStatus(app.status);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "11px 14px", borderRadius: 10, background: "#f8fafc",
      border: "1px solid #f1f5f9", transition: "0.15s",
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
    onMouseLeave={(e) => e.currentTarget.style.background = "#f8fafc"}
    >
      <StudentAvatar app={app} name={name} size={36} radius={9} fontSize={12} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>{name}</div>
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
          {intern?.title || "-"}{email ? ` · ${email}` : ""}
        </div>
      </div>
      <StatusBadge status={status} />
      <button onClick={onView} style={{
        background: "#E2EEF9", color: "#193648", border: "1px solid #CFE0F0",
        borderRadius: 7, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer",
      }}>View</button>
      {status === "pending" && (
        <button onClick={onAccept} style={{
          background: "#193648", color: "#fff", border: "none",
          borderRadius: 7, padding: "5px 11px", fontSize: 12, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 2px 8px rgba(25,54,72,0.3)",
        }}>Accept</button>
      )}
    </div>
  );
}

// ─── APP CARD ─────────────────────────────────────────────────────────────
function AppCard({ app, internships, onView, onAccept, onReject, loading }) {
  const name   = getStudentName(app);
  const email  = getStudentEmail(app);
  const status = normaliseStatus(app.status);
  const intern = internships.find((i) => String(i._id) === String(app.internshipId?._id || app.internshipId));

  return (
    <motion.div layout style={{
      background: "#fff", border: "1px solid #e8edf5", borderRadius: 16,
      padding: "18px 22px", display: "flex", alignItems: "center", gap: 16,
      boxShadow: "0 2px 10px rgba(15,23,42,0.04)",
    }}
    whileHover={{ boxShadow: "0 4px 20px rgba(15,23,42,0.08)" }}>

      {/* Avatar */}
      <StudentAvatar app={app} name={name} size={50} radius={13} fontSize={15} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{name}</span>
          <StatusBadge status={status} />
        </div>
        <div style={{ fontSize: 13, color: "#64748b" }}>
          {intern?.title || "Unknown Internship"}{intern?.company ? ` · ${intern.company}` : ""}
        </div>
        {email && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{email}</div>}
        {app.coverLetter && (
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 3, fontStyle: "italic" }}>
            "{app.coverLetter.slice(0, 80)}{app.coverLetter.length > 80 ? "..." : ""}"
          </div>
        )}
        <div style={{ display: "flex", gap: 14, marginTop: 6, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={12} color="#94a3b8" />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{fmt(app.appliedAt || app.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
        <button onClick={onView} style={{
          padding: "9px 14px", borderRadius: 9, border: "1px solid #e2e8f0",
          background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "0.15s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
        ><Eye size={14} /> View</button>

        {status === "pending" && (
          <>
            <button onClick={onAccept} disabled={!!loading} style={{
              padding: "9px 16px", borderRadius: 9, border: "none",
              background: "#193648", color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 3px 10px rgba(25,54,72,0.3)", opacity: loading ? 0.7 : 1, transition: "0.15s",
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#0f2233")}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#193648")}
            >
              {loading === "accepting" ? <Spinner size={13} color="#fff" /> : <Send size={14} />}
              Accept & Send
            </button>
            <button onClick={onReject} disabled={!!loading} style={{
              padding: "9px 15px", borderRadius: 9,
              border: "1px solid #fecdd3", background: "#fff1f2",
              color: "#be123c", fontSize: 13, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "0.15s",
            }}>
              {loading === "rejecting" ? <Spinner size={13} color="#be123c" /> : <XCircle size={14} />}
              Reject
            </button>
          </>
        )}

        {status === "sent_to_liaison" && (
          <div style={{
            padding: "9px 14px", borderRadius: 9, background: "#E2EEF9",
            color: "#193648", fontSize: 13, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 6, border: "1px solid #CFE0F0",
          }}>
            <CheckCircle size={14} /> Sent to Liaison
          </div>
        )}

        {status === "rejected" && (
          <div style={{
            padding: "9px 14px", borderRadius: 9, background: "#fff1f2",
            color: "#be123c", fontSize: 13, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 6, border: "1px solid #fecdd3",
          }}>
            <XCircle size={14} /> Rejected
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── SENT CARD ────────────────────────────────────────────────────────────
function SentCard({ app, internships }) {
  const name   = getStudentName(app);
  const email  = getStudentEmail(app);
  const intern = internships.find((i) => String(i._id) === String(app.internshipId?._id || app.internshipId));
  const truncate = (s, n) => (s && s.length > n ? s.slice(0, n).trim() + "…" : s);
  const accent = "#3A70B0";

  return (
    <div style={{
      position: "relative",
      display: "flex", flexDirection: "column", gap: 14,
      background: "linear-gradient(180deg, #ffffff, #fbfdff)",
      border: "1px solid #E2EEF9", borderRadius: 18,
      padding: "22px 22px 20px 26px",
      boxShadow: "0 6px 22px rgba(25,54,72,0.07)",
      transition: "box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease",
      overflow: "hidden",
      width: "100%",
      minWidth: 0,
      boxSizing: "border-box",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 14px 32px ${accent}26`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = `${accent}55`; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 6px 22px rgba(25,54,72,0.07)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#E2EEF9"; }}
    >
      {/* Side accent ribbon */}
      <span aria-hidden style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: 4,
        background: `linear-gradient(180deg, ${accent}, ${accent}66)`,
      }} />
      {/* Corner glow */}
      <span aria-hidden style={{
        position: "absolute", top: -40, right: -40,
        width: 120, height: 120, borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}22 0%, ${accent}00 70%)`,
        filter: "blur(12px)", pointerEvents: "none",
      }} />

      {/* Header row: avatar + name + status pill */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 0 }}>
          <StudentAvatar app={app} name={name} size={46} radius={12} fontSize={14} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {name}
            </div>
            {email && (
              <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {email}
              </div>
            )}
          </div>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "4px 10px", borderRadius: 999,
          background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
          border: `1px solid ${accent}44`,
          color: accent,
          fontSize: 9.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
          flexShrink: 0,
          boxShadow: `0 4px 10px ${accent}22`,
        }}>
          <Send size={10} /> With Liaison
        </div>
      </div>

      {/* Internship info row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px",
        background: "linear-gradient(180deg, #f8fbff, #ffffff)",
        border: "1px solid #eef2ff", borderRadius: 11,
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: 9,
          background: `linear-gradient(135deg, ${accent}1F, ${accent}0A)`,
          border: `1px solid ${accent}33`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: accent, flexShrink: 0,
        }}>
          <Briefcase size={13} />
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 12.5, color: "#0f172a", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.005em" }}>
            {intern?.title || "-"}
          </div>
          {intern?.company && (
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginTop: 1 }}>{intern.company}</div>
          )}
        </div>
      </div>

      {/* Meta + journey indicator */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap",
        padding: "8px 10px", borderRadius: 9,
        background: "#f8fbff", border: "1px solid #eef2ff",
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#64748b", fontWeight: 600 }}>
          <Calendar size={12} color={accent} />
          {fmt(app.updatedAt || app.appliedAt)}
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 10, fontWeight: 800, color: accent,
          background: "#eff6ff", padding: "3px 8px", borderRadius: 999,
          textTransform: "uppercase", letterSpacing: "0.06em",
          border: `1px solid ${accent}33`,
        }}>
          Awaiting liaison <ChevronLeft size={9} style={{ transform: "rotate(180deg)" }} />
        </span>
      </div>

      {/* Mini progress journey */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 4px" }}>
        {[
          { label: "Applied",   done: true,  color: "#22C55E" },
          { label: "Reviewed",  done: true,  color: "#22C55E" },
          { label: "Forwarded", done: true,  color: accent },
          { label: "Liaison",   done: false, color: "#94a3b8" },
        ].map((step, i, arr) => (
          <React.Fragment key={i}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1, minWidth: 0 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: step.color,
                boxShadow: step.done ? `0 0 0 3px ${step.color}22` : "none",
              }} />
              <span style={{
                fontSize: 8.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
                color: step.done ? "#193648" : "#94a3b8", whiteSpace: "nowrap",
              }}>
                {step.label}
              </span>
            </div>
            {i < arr.length - 1 && (
              <span style={{
                flex: 0.5,
                height: 2, borderRadius: 99,
                background: arr[i + 1].done ? step.color : "#E2EEF9",
                marginTop: -14,
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Cover letter quote */}
      {app.coverLetter && (
        <div style={{
          padding: "10px 12px",
          background: "linear-gradient(180deg, #f8fbff, #ffffff)",
          borderLeft: `3px solid ${accent}55`,
          borderRadius: "0 10px 10px 0",
          fontSize: 12, color: "#5b7184",
          fontStyle: "italic", lineHeight: 1.5,
        }}>
          "{truncate(app.coverLetter, 140)}"
        </div>
      )}

      {/* View CV - pinned */}
      {app.cvSnapshot && (
        <a href={`${BASE}${app.cvSnapshot}`} target="_blank" rel="noreferrer" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "10px 14px", borderRadius: 10,
          background: "#193648", border: "none",
          color: "#fff", textDecoration: "none",
          fontSize: 12.5, fontWeight: 800, letterSpacing: "0.02em",
          marginTop: "auto",
          boxShadow: "0 8px 18px rgba(25,54,72,0.25)",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(25,54,72,0.32)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 18px rgba(25,54,72,0.25)"; }}
        >
          <FileText size={13} /> View CV Document
        </a>
      )}
    </div>
  );
}

// ─── CV MODAL ─────────────────────────────────────────────────────────────
function CVModal({ app, internships, onClose, onAccept, onReject, loading }) {
  const name   = getStudentName(app);
  const email  = getStudentEmail(app);
  const status = normaliseStatus(app.status);
  const intern = internships.find((i) => String(i._id) === String(app.internshipId?._id || app.internshipId));

  return (
    <>
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <StudentAvatar app={app} name={name} size={50} radius={13} fontSize={16} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>{name}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
              {email && <span>{email} · </span>}
              {intern?.title || "-"} · Applied {fmt(app.appliedAt)}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{
          width: 34, height: 34, borderRadius: 8, background: "#f8fafc",
          border: "1px solid #e2e8f0", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><X size={16} color="#64748b" /></button>
      </div>

      {/* Body */}
      <div style={{ padding: "22px 24px", flex: 1, overflowY: "auto" }}>
        {/* Cover Letter */}
        {app.coverLetter && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>
              Cover Letter
            </div>
            <div style={{
              padding: "14px 16px", background: "#f8fafc", border: "1px solid #e2e8f0",
              borderRadius: 12, fontSize: 14, color: "#374151", lineHeight: 1.7,
            }}>
              {app.coverLetter}
            </div>
          </div>
        )}

        {/* Skills */}
        {app.matchingSkills?.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>Matching Skills</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {app.matchingSkills.map((s, i) => <SkillTag key={i} label={s} matched />)}
            </div>
          </div>
        )}
        {app.missingSkills?.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>Missing Skills</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {app.missingSkills.map((s, i) => <SkillTag key={i} label={s} />)}
            </div>
          </div>
        )}

        {/* CV */}
        {app.cvSnapshot && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 9 }}>CV Document</div>
            <a href={`${BASE}${app.cvSnapshot}`} target="_blank" rel="noreferrer" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 16px", background: "#f8fafc", border: "1px solid #e2e8f0",
              borderRadius: 12, textDecoration: "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FileText size={18} color="#6366f1" />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>View CV / Resume</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>PDF · Click to open</div>
                </div>
              </div>
              <Eye size={15} color="#6366f1" />
            </a>
          </div>
        )}

        {/* Meta */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Applied On",     value: fmt(app.appliedAt || app.createdAt) },
            { label: "Current Status", value: status.replace(/_/g, " "), cap: true },
            email ? { label: "Student Email", value: email } : null,
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{ padding: "12px 14px", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginTop: 4, textTransform: item.cap ? "capitalize" : "none" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10 }}>
        {status === "pending" && (
          <>
            <button onClick={onAccept} disabled={!!loading} style={{
              flex: 1, padding: "12px", borderRadius: 10, border: "none",
              background: "#193648", color: "#fff", fontWeight: 700, fontSize: 14,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 14px rgba(25,54,72,0.3)", opacity: loading ? 0.7 : 1,
            }}>
              {loading === "accepting" ? <Spinner size={15} color="#fff" /> : <Send size={16} />}
              Accept & Send to Liaison
            </button>
            <button onClick={onReject} disabled={!!loading} style={{
              flex: 1, padding: "12px", borderRadius: 10,
              border: "1px solid #fecdd3", background: "#fff1f2",
              color: "#be123c", fontWeight: 700, fontSize: 14,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading === "rejecting" ? <Spinner size={15} color="#be123c" /> : <XCircle size={16} />}
              Reject Application
            </button>
          </>
        )}
        {status === "sent_to_liaison" && (
          <div style={{
            flex: 1, padding: "12px", borderRadius: 10, textAlign: "center",
            background: "#E2EEF9", color: "#193648", fontWeight: 700, fontSize: 14,
            border: "1px solid #bfdbfe",
          }}>
            ✓ Accepted & forwarded to Industry Liaison
          </div>
        )}
        {status === "rejected" && (
          <div style={{
            flex: 1, padding: "12px", borderRadius: 10, textAlign: "center",
            background: "#fff1f2", color: "#be123c", fontWeight: 700, fontSize: 14,
            border: "1px solid #fecdd3",
          }}>
            ✗ Application was rejected
          </div>
        )}
      </div>
    </>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, text }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e8edf5", borderRadius: 16,
      padding: 64, textAlign: "center", boxShadow: "0 2px 10px rgba(15,23,42,0.04)",
    }}>
      <Icon size={40} color="#cbd5e1" style={{ marginBottom: 12 }} />
      <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>{text}</p>
    </div>
  );
}

// ─── DEMO DATA ────────────────────────────────────────────────────────────
const DEMO_INTERNSHIPS = [
  { _id: "int_1", title: "AI Research Internship",    company: "TechNova"  },
  { _id: "int_2", title: "Smart Agriculture Project", company: "AgriX"     },
  { _id: "int_3", title: "IoT Manufacturing",          company: "IndusTech" },
];

const DEMO_APPS = [
  {
    _id: "app_1", studentEmail: "47235@students.riphah.edu.pk",
    internshipId: { _id: "int_1" }, status: "pending",
    coverLetter: "I am highly interested in this role.",
    appliedAt: "2025-11-09T18:36:15.455Z",
  },
  {
    _id: "app_2", studentEmail: "47236@students.riphah.edu.pk",
    internshipId: { _id: "int_1" }, status: "sent_to_liaison",
    coverLetter: "Experienced in ML and data science.",
    appliedAt: "2025-11-08T10:22:00.000Z",
  },
  {
    _id: "app_3", studentEmail: "47237@students.riphah.edu.pk",
    internshipId: { _id: "int_2" }, status: "rejected",
    coverLetter: "Expert in IoT systems.",
    appliedAt: "2025-11-06T08:15:00.000Z",
  },
];