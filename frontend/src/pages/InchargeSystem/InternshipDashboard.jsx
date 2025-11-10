import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Users, Send, CheckCircle, XCircle, TrendingUp, Clock,
  BarChart3, Menu, X, ChevronDown, Bell, Search, MoreVertical,
  Calendar, Award, FileText, Eye, Download, Mail, LogOut, Home
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"];

export default function InternshipDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showCVModal, setShowCVModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [sendingToLiaison, setSendingToLiaison] = useState({});
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New application: Ayesha Khan", time: "2h ago", read: false },
    { id: 2, title: "MOU signed with AgriX", time: "1d ago", read: true },
    { id: 3, title: "Reminder: Advisory Board Meeting", time: "3d ago", read: false }
  ]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmSendModal, setConfirmSendModal] = useState({ open: false, app: null });
  const [exporting, setExporting] = useState(false);
  const [viewLogModal, setViewLogModal] = useState({ open: false, student: null });

  // MOCK DATA
  const internships = [
    { id: 1, title: "AI Research Internship", company: "TechNova", type: "Internship", applicants: 12, totalSlots: 3, tags: ["AI","Research"] },
    { id: 2, title: "Smart Agriculture Project", company: "AgriX", type: "Project", applicants: 8, totalSlots: 5, tags: ["IoT","Agri"] },
    { id: 3, title: "IoT Manufacturing", company: "IndusTech", type: "Project", applicants: 15, totalSlots: 4, tags: ["IoT","Industry"] },
    { id: 4, title: "Blockchain Dev", company: "CryptoX", type: "Internship", applicants: 10, totalSlots: 2, tags: ["Blockchain"] },
  ];

  const [applications, setApplications] = useState([
    {
      id: 101, studentId: "CS-2021-045", name: "Ayesha Khan", dept: "Computer Science",
      internshipId: 1, status: "Pending", appliedOn: "Nov 8, 2025",
      cv: { skills: ["Python", "TensorFlow", "NLP"], education: "BS CS – NUST (3.8 CGPA)", projects: "Chatbot, Image Classifier" }
    },
    {
      id: 102, studentId: "EE-2020-112", name: "Usman Ali", dept: "Electrical Engineering",
      internshipId: 2, status: "Pending", appliedOn: "Nov 7, 2025",
      cv: { skills: ["Arduino", "IoT", "C++"], education: "BS EE – UET (3.6 CGPA)", projects: "Smart Irrigation System" }
    },
    {
      id: 103, studentId: "ME-2021-089", name: "Sara Ahmed", dept: "Mechanical Engineering",
      internshipId: 3, status: "Approved", appliedOn: "Nov 6, 2025",
      cv: { skills: ["SolidWorks", "MATLAB"], education: "BS ME – PIEAS", projects: "Robotic Arm" }
    },
    {
      id: 104, studentId: "CS-2021-050", name: "Ahmed Hassan", dept: "Computer Science",
      internshipId: 1, status: "Pending", appliedOn: "Nov 8, 2025",
      cv: { skills: ["Python", "Machine Learning", "PyTorch"], education: "BS CS – FAST (3.7 CGPA)", projects: "Sentiment Analysis Tool" }
    },
    {
      id: 105, studentId: "CS-2020-033", name: "Fatima Zahra", dept: "Computer Science",
      internshipId: 1, status: "Pending", appliedOn: "Nov 7, 2025",
      cv: { skills: ["Deep Learning", "Computer Vision", "Keras"], education: "BS CS – LUMS (3.9 CGPA)", projects: "Object Detection System" }
    },
    {
      id: 106, studentId: "CS-2021-078", name: "Hassan Raza", dept: "Computer Science",
      internshipId: 1, status: "Approved", appliedOn: "Nov 7, 2025",
      cv: { skills: ["NLP", "TensorFlow", "Python"], education: "BS CS – UET (3.6 CGPA)", projects: "Text Summarization" }
    },
    {
      id: 107, studentId: "CS-2020-091", name: "Sana Malik", dept: "Computer Science",
      internshipId: 1, status: "Pending", appliedOn: "Nov 6, 2025",
      cv: { skills: ["Data Science", "Python", "R"], education: "BS CS – NUST (3.8 CGPA)", projects: "Predictive Analytics Dashboard" }
    },
    {
      id: 108, studentId: "EE-2021-045", name: "Bilal Ahmed", dept: "Electrical Engineering",
      internshipId: 2, status: "Pending", appliedOn: "Nov 7, 2025",
      cv: { skills: ["IoT", "Embedded Systems", "Python"], education: "BS EE – GIKI (3.7 CGPA)", projects: "Smart Home Automation" }
    },
    {
      id: 109, studentId: "EE-2020-089", name: "Zara Khan", dept: "Electrical Engineering",
      internshipId: 2, status: "Approved", appliedOn: "Nov 6, 2025",
      cv: { skills: ["Sensor Networks", "Arduino", "C"], education: "BS EE – UET (3.5 CGPA)", projects: "Weather Monitoring System" }
    },
    {
      id: 110, studentId: "ME-2021-034", name: "Hamza Ali", dept: "Mechanical Engineering",
      internshipId: 3, status: "Pending", appliedOn: "Nov 6, 2025",
      cv: { skills: ["CAD", "Automation", "PLC"], education: "BS ME – NUST (3.6 CGPA)", projects: "Automated Assembly Line" }
    },
    {
      id: 111, studentId: "CS-2020-102", name: "Aisha Siddiqui", dept: "Computer Science",
      internshipId: 4, status: "Pending", appliedOn: "Nov 5, 2025",
      cv: { skills: ["Blockchain", "Solidity", "Web3"], education: "BS CS – FAST (3.8 CGPA)", projects: "Decentralized Voting System" }
    },
    {
      id: 112, studentId: "CS-2021-067", name: "Imran Shah", dept: "Computer Science",
      internshipId: 4, status: "Approved", appliedOn: "Nov 5, 2025",
      cv: { skills: ["Smart Contracts", "Ethereum", "JavaScript"], education: "BS CS – LUMS (3.9 CGPA)", projects: "NFT Marketplace" }
    },
  ]);

  const [sentToIndustry, setSentToIndustry] = useState([
    {
      id: 201, studentId: "CS-2020-078", name: "Ali Raza", dept: "Computer Science",
      internship: "Blockchain Dev", sentOn: "Nov 5, 2025",
      report: "High potential, strong blockchain skills"
    },
  ]);

  const activeStudents = [
    { name: "Hina Malik", internship: "AI Research", startDate: "Oct 1, 2025", endDate: "Dec 31, 2025", progress: 75, tasks: "18/24", status: "On Track", mentor: "Dr. Khan" },
    { name: "Omar Farooq", internship: "IoT Manufacturing", startDate: "Sep 15, 2025", endDate: "Jan 15, 2026", progress: 60, tasks: "12/20", status: "On Track", mentor: "Engr. Nasir" },
    { name: "Zainab Noor", internship: "Smart Agriculture", startDate: "Oct 10, 2025", endDate: "Jan 10, 2026", progress: 90, tasks: "27/30", status: "Excellent", mentor: "Prof. Ali" },
  ];

  const studentLogs = {
    "Hina Malik": [
      { date: "Nov 8, 2025", activity: "Completed Module 3: Neural Networks", status: "completed" },
      { date: "Nov 6, 2025", activity: "Submitted Weekly Report #5", status: "completed" },
      { date: "Nov 4, 2025", activity: "Attended Team Sync Meeting", status: "completed" },
      { date: "Nov 1, 2025", activity: "Started Module 3", status: "in-progress" },
      { date: "Oct 28, 2025", activity: "Completed Module 2: Deep Learning Basics", status: "completed" },
      { date: "Oct 25, 2025", activity: "Code Review Session with Mentor", status: "completed" },
    ],
    "Omar Farooq": [
      { date: "Nov 7, 2025", activity: "IoT Sensor Integration Testing", status: "completed" },
      { date: "Nov 5, 2025", activity: "Code Review with Mentor", status: "completed" },
      { date: "Nov 3, 2025", activity: "Started Dashboard Development", status: "in-progress" },
      { date: "Oct 30, 2025", activity: "Hardware Setup Completed", status: "completed" },
      { date: "Oct 27, 2025", activity: "Requirements Gathering Meeting", status: "completed" },
    ],
    "Zainab Noor": [
      { date: "Nov 8, 2025", activity: "Final Presentation Preparation", status: "completed" },
      { date: "Nov 7, 2025", activity: "Completed All Project Milestones", status: "completed" },
      { date: "Nov 5, 2025", activity: "Documentation Submitted", status: "completed" },
      { date: "Nov 3, 2025", activity: "Field Testing Completed", status: "completed" },
      { date: "Nov 1, 2025", activity: "System Integration Testing", status: "completed" },
      { date: "Oct 29, 2025", activity: "Prototype Demonstration", status: "completed" },
    ],
  };

  const pieData = [
    { name: "Approved", value: applications.filter(a => a.status === "Approved").length },
    { name: "Pending", value: applications.filter(a => a.status === "Pending").length },
    { name: "Sent", value: sentToIndustry.length },
  ];

  // ACTIONS
  const handleApprove = (id) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
    setNotifications(prev => [{ id: Date.now(), title: `Application approved (#${id})`, time: "now", read: false }, ...prev]);
  };

  const handleReject = (id) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    setNotifications(prev => [{ id: Date.now(), title: `Application rejected (#${id})`, time: "now", read: false }, ...prev]);
  };

  const requestSendToLiaison = (app) => {
    setConfirmSendModal({ open: true, app });
  };

  const confirmSend = () => {
    const app = confirmSendModal.app;
    if (!app) return;
    setConfirmSendModal({ open: false, app: null });
    setSendingToLiaison(prev => ({ ...prev, [app.id]: true }));

    setTimeout(() => {
      const internshipTitle = internships.find(i => i.id === app.internshipId)?.title || "";
      setSentToIndustry(prev => [...prev, {
        id: Date.now(),
        studentId: app.studentId,
        name: app.name,
        dept: app.dept,
        internship: internshipTitle,
        sentOn: new Date().toLocaleDateString('en-GB'),
        report: `Approved by Incharge. Skills: ${app.cv.skills.join(', ')}`
      }]);

      setApplications(prev => prev.filter(a => a.id !== app.id));
      setSendingToLiaison(prev => ({ ...prev, [app.id]: false }));
      setNotifications(prev => [{ id: Date.now(), title: `${app.name} sent to Industry Liaison`, time: "just now", read: false }, ...prev]);
    }, 1200);
  };

  const openApplicants = (internship) => {
    setSelectedInternship(internship);
    setShowApplicantsModal(true);
  };

  const openCV = (app) => {
    setSelectedApplicant(app);
    setShowCVModal(true);
  };

  const handleNotificationClick = (n) => {
    setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    setNotificationsOpen(false);
    if (n.title && n.title.toLowerCase().includes('application')) {
      setActiveTab('applications');
    }
  };

  const handleExportReport = async () => {
    try {
      setExporting(true);
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

      const node = document.getElementById('internhub-overview');
      if (!node) {
        alert('Overview node not found');
        setExporting(false);
        return;
      }

      const canvas = await html2canvas(node, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`InternHub_Overview_${new Date().toISOString().slice(0,10)}.pdf`);
      setExporting(false);
    } catch (err) {
      console.warn('PDF export failed:', err);
      setExporting(false);
      window.print();
    }
  };

  const Badge = ({ children, color = '#3b82f6' }) => (
    <span style={{
      background: `${color}22`, color, padding: '6px 12px', borderRadius: 999, fontWeight: 600, fontSize: 13
    }}>{children}</span>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* LEFT SIDEBAR - FULL HEIGHT FROM TOP */}
        <aside style={{
          width: "280px", background: "#193648", color: "#e2e8f0", padding: "0",
          position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 40,
          display: "flex", flexDirection: "column", justifyContent: "space-between"
        }}>
          {/* LOGO */}
          <div style={{ padding: "28px 24px", borderBottom: "1px solid #334155" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 20, color: "#fff"
              }}>C</div>
              <div style={{ fontWeight: 800, fontSize: 22, color: "#fff" }}>Collaxion</div>
            </div>
          </div>

          {/* NAV ITEMS */}
          <nav style={{ flex: 1, padding: "16px 0" }}>
            {[
              { key: "overview", label: "Overview", icon: BarChart3 },
              { key: "internships", label: "Internships & Projects", icon: Briefcase },
              { key: "applications", label: "Applications", icon: Users },
              { key: "sent", label: "Sent ", icon: Send },
              { key: "tracking", label: "Student Progress", icon: TrendingUp },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => { setActiveTab(item.key); setMobileMenuOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px", width: "100%", padding: "14px 24px",
                    background: activeTab === item.key ? "rgba(59, 130, 246, 0.15)" : "transparent",
                    color: activeTab === item.key ? "#60a5fa" : "#94a3b8",
                    border: "none", fontSize: "14.5px", fontWeight: activeTab === item.key ? "600" : "500",
                    cursor: "pointer", transition: "0.2s", borderLeft: activeTab === item.key ? "4px solid #3b82f6" : "4px solid transparent"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = activeTab === item.key ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = activeTab === item.key ? "rgba(59, 130, 246, 0.15)" : "transparent"}
                >
                  <Icon size={19} /> {item.label}
                </button>
              );
            })}
          </nav>

          {/* USER PROFILE SECTION */}
          <div style={{ padding: "20px 24px", borderTop: "1px solid #334155" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: "48px", height: "48px", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 17
              }}>JM</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Junaid Malik</div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>Internship Incharge</div>
              </div>
            </div>

            <button style={{
              display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.1)", color: "#fca5a5", border: "none", borderRadius: 12,
              fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT - SPACED FROM SIDEBAR */}
        <main style={{ marginLeft: "280px", flex: 1, padding: "28px 32px", background: "#f8fafc", minHeight: "100vh" }}>
          {/* TOP BAR WITH NOTIFICATIONS */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#193648", margin: 0 }}>
                {activeTab === "overview" && "Welcome to Intern Hub"}
                {activeTab === "internships" && "Internships & Projects"}
                {activeTab === "applications" && "Student Applications"}
                {activeTab === "sent" && "Sent to Industry"}
                {activeTab === "tracking" && "Student Progress"}
              </h1>
              <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 15 }}>
                {activeTab === "overview" && "Real-time insights into applications, approvals, and progress"}
                {activeTab === "internships" && "Manage all internship and project postings"}
                {activeTab === "applications" && "Review and process student applications"}
                {activeTab === "sent" && "Track students forwarded to industry liaison"}
                {activeTab === "tracking" && "Monitor real-time progress and activities"}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* NOTIFICATIONS */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setNotificationsOpen(!notificationsOpen)} style={{
                  background: '#fff', border: '1px solid #e2e8f0', cursor: 'pointer',
                  width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'relative'
                }}>
                  <Bell size={20} color="#64748b" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span style={{
                      position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff',
                      fontSize: 11, width: 20, height: 20, borderRadius: 999, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '2px solid #fff'
                    }}>
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{
                      position: 'absolute', right: 0, top: 52, width: 380, background: '#fff',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.12)', borderRadius: 16, zIndex: 60, border: "1px solid #e2e8f0"
                    }}>
                      <div style={{ padding: 16, borderBottom: '1px solid #eef2ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 16 }}>Notifications</strong>
                        <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} style={{
                          border: 'none', background: 'transparent', color: '#3b82f6', fontSize: 13, cursor: 'pointer', fontWeight: 600
                        }}>
                          Mark all read
                        </button>
                      </div>
                      <div style={{ maxHeight: 320, overflow: 'auto' }}>
                        {notifications.length === 0 && <div style={{ padding: 20, color: '#94a3b8', textAlign: 'center' }}>No notifications</div>}
                        {notifications.map(n => (
                          <div key={n.id} onClick={() => handleNotificationClick(n)} style={{
                            padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                            cursor: 'pointer', background: n.read ? 'transparent' : '#f0f9ff', borderBottom: "1px solid #f1f5f9",
                            transition: '0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = n.read ? '#f8fafc' : '#e0f2fe'}
                          onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : '#f0f9ff'}
                          >
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{n.title}</div>
                              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{n.time}</div>
                            </div>
                            {!n.read && <div style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: 99, flexShrink: 0 }} />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div id="internhub-overview" style={{ background: "#f8fafc", borderRadius: 16, padding: 0 }}>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 24 }}>
                  <button onClick={handleExportReport} disabled={exporting} style={{
                    background: "#25516dff", color: "#fff", border: "none", padding: "12px 18px",
                    borderRadius: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", cursor: 'pointer',
                    boxShadow: "0 4px 12px rgba(59,130,246,0.25)", transition: '0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <Download size={17} /> {exporting ? 'Exporting…' : 'Export PDF'}
                  </button>
                </div>

                {/* Stats Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "32px" }}>
                  {[
                    { label: "Total Postings", value: internships.length, icon: Briefcase, color: "#8b5cf6" },
                    { label: "Pending", value: applications.filter(a => a.status === "Pending").length, icon: Clock, color: "#f59e0b" },
                    { label: "Approved", value: applications.filter(a => a.status === "Approved").length, icon: CheckCircle, color: "#10b981" },
                    { label: "Sent to Industry", value: sentToIndustry.length, icon: Send, color: "#3b82f6" },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        background: "#fff", padding: "24px", borderRadius: "16px",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "18px",
                        border: "1px solid #f1f5f9"
                      }}
                    >
                      <div style={{
                        width: "60px", height: "60px", background: `${s.color}15`,
                        borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: s.color
                      }}>
                        <s.icon size={26} />
                      </div>
                      <div>
                        <p style={{ fontSize: "14px", color: "#64748b", margin: 0, fontWeight: 500 }}>{s.label}</p>
                        <p style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", margin: "4px 0 0" }}>{s.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Charts */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "32px" }}>
                  <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "#1e293b" }}>Weekly Application Trend</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={[
                        { name: "Mon", apps: 4, sent: 1 }, { name: "Tue", apps: 6, sent: 2 },
                        { name: "Wed", apps: 8, sent: 3 }, { name: "Thu", apps: 5, sent: 3 },
                        { name: "Fri", apps: 7, sent: 4 }, { name: "Sat", apps: 3, sent: 2 }, { name: "Sun", apps: 2, sent: 1 }
                      ]}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                        <YAxis tick={{ fill: '#64748b' }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                        <Line type="monotone" dataKey="apps" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} name="Applications" />
                        <Line type="monotone" dataKey="sent" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="Sent" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "#1e293b" }}>Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={85} innerRadius={60} dataKey="value" label>
                          {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(2,6,23,0.06)", border: "1px solid #f1f5f9" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "#1e293b" }}>Recent Activity</h3>
                  <div style={{ display: "flex", gap: 12, flexWrap: 'wrap' }}>
                    {[...applications.slice(0, 3), ...sentToIndustry.slice(0, 2)].map((a, i) => (
                      <div key={i} style={{ borderRadius: 12, padding: 16, minWidth: 220, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ fontSize: 14, color: '#0f172a' }}>{a.name}</strong>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{a.studentId || ''} • {a.dept || ''}</div>
                          </div>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>{a.appliedOn || a.sentOn}</div>
                        </div>
                        <div style={{ fontSize: 13, color: '#475569' }}>
                          Applied for <strong>{internships.find(int => int.id === a.internshipId)?.title || a.internship}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {a.status === 'Pending' && <Badge color='#f59e0b'>Pending</Badge>}
                          {a.status === 'Approved' && <Badge color='#10b981'>Approved</Badge>}
                          {sentToIndustry.find(s => s.studentId === a.studentId) && <Badge color='#3b82f6'>Sent</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "internships" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", marginTop: 16 }}>
                  {internships.map(i => (
                    <div key={i.id} style={{ background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 8px 20px rgba(2,6,23,0.06)", border: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <div>
                          <h3 style={{ fontWeight: 700, margin: 0, fontSize: 17, color: '#0f172a' }}>{i.title}</h3>
                          <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0 0" }}>{i.company}</p>
                        </div>
                        <MoreVertical size={18} color="#94a3b8" style={{ cursor: 'pointer' }} />
                      </div>
                      
                      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                        <span style={{
                          background: i.type === "Internship" ? "#dbeafe" : "#fef3c7",
                          color: i.type === "Internship" ? "#1e40af" : "#92400e",
                          padding: '6px 12px', borderRadius: 999, fontWeight: 700, fontSize: 12
                        }}>{i.type}</span>
                        {i.tags.map((t, idx) => (
                          <span key={idx} style={{ background: '#f1f5f9', padding: '6px 10px', borderRadius: 8, fontSize: 12, color: '#475569', fontWeight: 600 }}>{t}</span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => openApplicants(i)} style={{
                          border: '1px solid #e2e8f0', background: '#fff', color: '#3b82f6',
                          fontWeight: 700, cursor: 'pointer', padding: '10px 14px', borderRadius: 10,
                          display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, transition: '0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        >
                          <Users size={16} /> {i.applicants} Applicants
                        </button>
                        <button style={{
                          background: '#3b82f6', borderRadius: 10, padding: '10px 16px',
                          border: 'none', fontWeight: 700, color: '#fff', cursor: 'pointer',
                          fontSize: 14, transition: '0.2s', boxShadow: '0 4px 12px rgba(59,130,246,0.2)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
                        onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
                        >Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "applications" && (
              <div>
                {applications.length === 0 ? (
                  <div style={{ background: '#fff', padding: 60, borderRadius: 16, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                    <Users size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                    <p style={{ color: "#94a3b8", fontSize: 16 }}>No applications at the moment</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 14 }}>
                    {applications.map(app => (
                      <div key={app.id} style={{
                        background: '#fff', padding: 20, borderRadius: 14, display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center',
                        boxShadow: '0 6px 18px rgba(2,6,23,0.04)', border: '1px solid #f1f5f9'
                      }}>
                        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                          <div style={{
                            width: 60, height: 60, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: 18, color: '#fff', boxShadow: '0 4px 12px rgba(139,92,246,0.25)'
                          }}>{app.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>{app.name}</div>
                            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{app.studentId} • {app.dept}</div>
                            <div style={{ fontSize: 14, marginTop: 6, color: '#475569' }}>
                              <strong>{internships.find(i => i.id === app.internshipId)?.title || '—'}</strong>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          {app.status === 'Pending' && (
                            <>
                              <button onClick={() => openCV(app)} style={{
                                background: '#3b82f6', color: '#fff', borderRadius: 10, padding: '11px 16px',
                                border: 'none', display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer',
                                fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(59,130,246,0.2)', transition: '0.2s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                              >
                                <Eye size={16} /> View Request
                              </button>
                              <button onClick={() => handleApprove(app.id)} style={{
                                background: '#10b981', color: '#fff', borderRadius: 10, padding: '11px 16px',
                                border: 'none', display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer',
                                fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(16,185,129,0.2)', transition: '0.2s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                              >
                                <CheckCircle size={16} /> Approve
                              </button>
                              <button onClick={() => handleReject(app.id)} style={{
                                background: '#ef4444', color: '#fff', borderRadius: 10, padding: '11px 16px',
                                border: 'none', display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer',
                                fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(239,68,68,0.2)', transition: '0.2s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                              >
                                <XCircle size={16} /> Reject
                              </button>
                            </>
                          )}

                          {app.status === 'Approved' && (
                            <>
                              <Badge color='#10b981'>Approved</Badge>
                              <button onClick={() => requestSendToLiaison(app)} disabled={sendingToLiaison[app.id]} style={{
                                background: '#8b5cf6', color: '#fff', borderRadius: 10, padding: '11px 16px',
                                border: 'none', display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer',
                                fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(139,92,246,0.2)', transition: '0.2s'
                              }}
                              onMouseEnter={e => !sendingToLiaison[app.id] && (e.currentTarget.style.transform = 'translateY(-2px)')}
                              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                              >
                                {sendingToLiaison[app.id] ? 'Sending…' : <><Mail size={16} /> Send to Liaison</>}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "sent" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", marginTop: 12 }}>
                  {sentToIndustry.map(s => (
                    <div key={s.id} style={{
                      background: "#fff", padding: "22px", borderRadius: "16px",
                      border: "1px solid #e6eefc", boxShadow: "0 6px 18px rgba(2,6,23,0.04)"
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: 0, fontWeight: 800, fontSize: 17, color: '#0f172a' }}>{s.name}</h3>
                          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{s.studentId} • {s.dept}</div>
                          <div style={{ fontSize: 14, color: '#3b82f6', fontWeight: 600, marginTop: 8 }}>{s.internship}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>Sent</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{s.sentOn}</div>
                        </div>
                      </div>

                      <p style={{
                        marginTop: 14, background: '#f8fafc', padding: 14, borderRadius: 10,
                        color: '#475569', fontSize: 13, lineHeight: 1.6, border: '1px solid #f1f5f9'
                      }}>{s.report}</p>

                      <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                        <button onClick={() => {
                          navigator.clipboard && navigator.clipboard.writeText(s.report);
                          alert('Report copied to clipboard');
                        }} style={{
                          flex: 1, border: 'none', background: '#eef2ff', color: '#3b82f6',
                          padding: '10px 14px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14
                        }}>
                          Copy Report
                        </button>
                        <button onClick={() => alert('Download feature - integrate backend endpoint')} style={{
                          flex: 1, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b',
                          padding: '10px 14px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                        }}>
                          <Download size={16} /> PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "tracking" && (
              <div>
                <div style={{ display: 'grid', gap: 18, marginTop: 20 }}>
                  {activeStudents.map((s, i) => (
                    <div key={i} style={{
                      background: '#fff', padding: 24, borderRadius: 16,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: 1 }}>
                          <div style={{
                            width: 64, height: 64, borderRadius: 14,
                            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: 20, color: '#fff',
                            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)'
                          }}>{s.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', marginBottom: 4 }}>{s.name}</div>
                            <div style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>
                              <strong style={{ color: '#3b82f6' }}>{s.internship}</strong>
                            </div>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
                                <Users size={14} />
                                Mentor: <strong>{s.mentor}</strong>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
                                <Calendar size={14} />
                                {s.startDate} - {s.endDate}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            background: s.status === 'Excellent' ? '#dcfce7' : s.status === 'On Track' ? '#dbeafe' : '#fef3c7',
                            color: s.status === 'Excellent' ? '#166534' : s.status === 'On Track' ? '#1e40af' : '#92400e',
                            padding: '8px 16px', borderRadius: 999, fontWeight: 700, fontSize: 13, marginBottom: 8
                          }}>{s.status}</div>
                          <div style={{ fontSize: 13, color: '#94a3b8' }}>Progress: <strong style={{ color: '#0f172a' }}>{s.progress}%</strong></div>
                        </div>
                      </div>

                      <div style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#475569' }}>Overall Progress</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#3b82f6' }}>{s.tasks}</div>
                        </div>
                        <div style={{ height: 12, background: '#e6eefc', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                              height: '100%',
                              background: s.progress >= 80 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : s.progress >= 50 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
                              borderRadius: 999,
                              boxShadow: `0 0 10px ${s.progress >= 80 ? '#22c55e' : s.progress >= 50 ? '#f59e0b' : '#ef4444'}40`
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
                        <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Completed</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>
                            {parseInt(s.tasks.split('/')[0])}
                          </div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Total Tasks</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: '#3b82f6' }}>
                            {parseInt(s.tasks.split('/')[1])}
                          </div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Remaining</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: '#f59e0b' }}>
                            {parseInt(s.tasks.split('/')[1]) - parseInt(s.tasks.split('/')[0])}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button
                          onClick={() => setViewLogModal({ open: true, student: s })}
                          style={{
                            flex: 1, border: 'none', background: '#3b82f6', color: '#fff',
                            padding: '12px 16px', borderRadius: 10, fontWeight: 600, fontSize: 14,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)', transition: '0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <FileText size={16} /> View Activity Log
                        </button>
                        <button style={{
                          flex: 1, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b',
                          padding: '12px 16px', borderRadius: 10, fontWeight: 600, fontSize: 14,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          transition: '0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        >
                          <Mail size={16} /> Send Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </main>
      </div>

      {/* APPLICANTS MODAL */}
      <AnimatePresence>
        {showApplicantsModal && selectedInternship && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
            }}
            onClick={() => setShowApplicantsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{
                width: '100%', maxWidth: 900, background: '#fff', borderRadius: 16,
                maxHeight: '85vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                padding: 20, borderBottom: '1px solid #e2e8f0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                    {selectedInternship.title}
                  </h3>
                  <div style={{ color: '#64748b', marginTop: 4 }}>
                    {selectedInternship.company} • {applications.filter(a => a.internshipId === selectedInternship.id).length} Applicants
                  </div>
                </div>
                <button
                  onClick={() => setShowApplicantsModal(false)}
                  style={{
                    border: 'none', background: '#f1f5f9', cursor: 'pointer',
                    width: 36, height: 36, borderRadius: 8, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', transition: '0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: 20, flex: 1, overflow: 'auto' }}>
                {applications.filter(a => a.internshipId === selectedInternship.id).length === 0 ? (
                  <div style={{ padding: 40, color: '#94a3b8', textAlign: 'center' }}>
                    <Users size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
                    <p>No applicants for this posting yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {applications.filter(a => a.internshipId === selectedInternship.id).map(a => (
                      <div key={a.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                        padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                          <div style={{
                            width: 56, height: 56, borderRadius: 12,
                            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: 18, color: '#fff',
                            boxShadow: '0 4px 12px rgba(139,92,246,0.2)'
                          }}>{a.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>{a.name}</div>
                            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{a.studentId} • {a.dept}</div>
                            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Applied: {a.appliedOn}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => { setShowApplicantsModal(false); openCV(a); }} style={{
                            border: 'none', background: '#3b82f6', color: '#fff',
                            padding: '10px 16px', borderRadius: 10, fontWeight: 600,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                            fontSize: 14, boxShadow: '0 4px 12px rgba(59,130,246,0.2)', transition: '0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                          >
                            <Eye size={16} /> View CV
                          </button>
                          {a.status === 'Pending' && (
                            <button onClick={() => handleApprove(a.id)} style={{
                              border: 'none', background: '#10b981', color: '#fff',
                              padding: '10px 16px', borderRadius: 10, fontWeight: 600,
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                              fontSize: 14, boxShadow: '0 4px 12px rgba(16,185,129,0.2)', transition: '0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                              <CheckCircle size={16} /> Approve
                            </button>
                          )}
                          {a.status === 'Approved' && (
                            <button onClick={() => requestSendToLiaison(a)} style={{
                              border: 'none', background: '#8b5cf6', color: '#fff',
                              padding: '10px 16px', borderRadius: 10, fontWeight: 600,
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                              fontSize: 14, boxShadow: '0 4px 12px rgba(139,92,246,0.2)', transition: '0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                              <Send size={16} /> Send
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CV MODAL */}
      <AnimatePresence>
        {showCVModal && selectedApplicant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
            }}
            onClick={() => setShowCVModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              style={{
                width: '100%', maxWidth: 720, background: '#fff', borderRadius: 16,
                maxHeight: '85vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                padding: 20, borderBottom: '1px solid #e2e8f0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                    {selectedApplicant.name}
                  </h3>
                  <div style={{ color: '#64748b', marginTop: 4 }}>
                    {selectedApplicant.studentId} • {selectedApplicant.dept}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ color: '#94a3b8', fontSize: 14 }}>{selectedApplicant.appliedOn}</div>
                  <button
                    onClick={() => setShowCVModal(false)}
                    style={{
                      border: 'none', background: '#f1f5f9', cursor: 'pointer',
                      width: 36, height: 36, borderRadius: 8, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', transition: '0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div style={{ padding: 24, flex: 1, overflow: 'auto' }}>
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: 0, display: 'flex', gap: 8, alignItems: 'center', color: '#0f172a', fontSize: 16 }}>
                    <Award size={18} color="#3b82f6" /> Education
                  </h4>
                  <div style={{
                    background: '#f8fafc', padding: 16, borderRadius: 12, marginTop: 10,
                    border: '1px solid #e2e8f0', color: '#475569', fontSize: 14, lineHeight: 1.6
                  }}>
                    {selectedApplicant.cv.education}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: 0, display: 'flex', gap: 8, alignItems: 'center', color: '#0f172a', fontSize: 16 }}>
                    <FileText size={18} color="#3b82f6" /> Skills
                  </h4>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    {selectedApplicant.cv.skills.map((skill, i) => (
                      <div key={i} style={{
                        background: '#eef2ff', padding: '8px 14px', borderRadius: 999,
                        fontWeight: 600, fontSize: 13, color: '#3b82f6'
                      }}>
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: 0, display: 'flex', gap: 8, alignItems: 'center', color: '#0f172a', fontSize: 16 }}>
                    <Briefcase size={18} color="#3b82f6" /> Projects
                  </h4>
                  <div style={{
                    background: '#f8fafc', padding: 16, borderRadius: 12, marginTop: 10,
                    border: '1px solid #e2e8f0', color: '#475569', fontSize: 14, lineHeight: 1.6
                  }}>
                    {selectedApplicant.cv.projects}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 20, paddingTop: 20, borderTop: '1px solid #e2e8f0' }}>
                  {selectedApplicant.status === 'Pending' && (
                    <>
                      <button onClick={() => { handleApprove(selectedApplicant.id); setShowCVModal(false); }} style={{
                        flex: 1, background: '#10b981', color: '#fff', padding: '12px 16px',
                        borderRadius: 10, border: 'none', fontWeight: 600, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
                        fontSize: 14, boxShadow: '0 4px 12px rgba(16,185,129,0.2)', transition: '0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <CheckCircle size={18} /> Approve Application
                      </button>
                      <button onClick={() => { handleReject(selectedApplicant.id); setShowCVModal(false); }} style={{
                        flex: 1, background: '#ef4444', color: '#fff', padding: '12px 16px',
                        borderRadius: 10, border: 'none', fontWeight: 600, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
                        fontSize: 14, boxShadow: '0 4px 12px rgba(239,68,68,0.2)', transition: '0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <XCircle size={18} /> Reject Application
                      </button>
                    </>
                  )}

                  {selectedApplicant.status === 'Approved' && !sentToIndustry.find(s => s.studentId === selectedApplicant.studentId) && (
                    <button onClick={() => { setShowCVModal(false); requestSendToLiaison(selectedApplicant); }} style={{
                      flex: 1, background: '#8b5cf6', color: '#fff', padding: '12px 16px',
                      borderRadius: 10, border: 'none', fontWeight: 600, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
                      fontSize: 14, boxShadow: '0 4px 12px rgba(139,92,246,0.2)', transition: '0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <Mail size={18} /> Send to Industry Liaison
                    </button>
                  )}

                  {sentToIndustry.find(s => s.studentId === selectedApplicant.studentId) && (
                    <div style={{
                      flex: 1, background: '#dcfce7', color: '#166534', padding: '12px 16px',
                      borderRadius: 10, fontWeight: 700, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 8, fontSize: 14
                    }}>
                      <CheckCircle size={18} /> Sent to Industry Liaison
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRM SEND MODAL */}
      <AnimatePresence>
        {confirmSendModal.open && confirmSendModal.app && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 120,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 8 }}
              style={{
                width: '100%', maxWidth: 480, background: '#fff', borderRadius: 16,
                padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
              }}
            >
              <h3 style={{ marginTop: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                Send to Industry Liaison
              </h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: 14 }}>
                You're about to forward <strong style={{ color: '#0f172a' }}>{confirmSendModal.app.name}</strong>'s 
                approved application to the Industry Liaison. This action will remove it from the Incharge queue and 
                create a record in the Sent list. Do you want to continue?
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button
                  onClick={() => setConfirmSendModal({ open: false, app: null })}
                  style={{
                    border: '1px solid #e2e8f0', background: '#fff', color: '#64748b',
                    padding: '10px 16px', borderRadius: 10, fontWeight: 600, cursor: 'pointer',
                    fontSize: 14, transition: '0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSend}
                  style={{
                    border: 'none', background: '#8b5cf6', color: '#fff',
                    padding: '10px 20px', borderRadius: 10, fontWeight: 600, cursor: 'pointer',
                    fontSize: 14, boxShadow: '0 4px 12px rgba(139,92,246,0.25)', transition: '0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#7c3aed'}
                  onMouseLeave={e => e.currentTarget.style.background = '#8b5cf6'}
                >
                  Yes, Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW LOG MODAL */}
      <AnimatePresence>
        {viewLogModal.open && viewLogModal.student && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
            }}
            onClick={() => setViewLogModal({ open: false, student: null })}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              style={{
                width: '100%', maxWidth: 720, background: '#fff', borderRadius: 16,
                maxHeight: '85vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                padding: 20, borderBottom: '1px solid #e2e8f0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                    Activity Log: {viewLogModal.student.name}
                  </h3>
                  <div style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>
                    {viewLogModal.student.internship} • Mentor: {viewLogModal.student.mentor}
                  </div>
                </div>
                <button
                  onClick={() => setViewLogModal({ open: false, student: null })}
                  style={{
                    border: 'none', background: '#f1f5f9', cursor: 'pointer',
                    width: 36, height: 36, borderRadius: 8, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', transition: '0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: 20, flex: 1, overflow: 'auto' }}>
                {studentLogs[viewLogModal.student.name] ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {studentLogs[viewLogModal.student.name].map((log, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{
                          padding: 16, borderRadius: 12, background: '#f8fafc',
                          border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14
                        }}
                      >
                        <div style={{
                          width: 12, height: 12, borderRadius: 999,
                          background: log.status === 'completed' ? '#10b981' : '#f59e0b',
                          flexShrink: 0, boxShadow: `0 0 0 4px ${log.status === 'completed' ? '#10b98120' : '#f59e0b20'}`
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 4 }}>
                            {log.activity}
                          </div>
                          <div style={{ fontSize: 13, color: '#64748b' }}>{log.date}</div>
                        </div>
                        <div style={{
                          padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                          background: log.status === 'completed' ? '#dcfce7' : '#fef3c7',
                          color: log.status === 'completed' ? '#166534' : '#92400e'
                        }}>
                          {log.status === 'completed' ? 'Completed' : 'In Progress'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                    <FileText size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
                    <p>No activity logs found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}