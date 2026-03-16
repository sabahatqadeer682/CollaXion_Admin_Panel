// CoCurricularDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Calendar, FileText, Plus, Edit, Trash2,
  CheckCircle, AlertCircle, Clock, User, LogOut, Bell,
  Download, Mail, TrendingUp, BarChart3, Target, Users,
  Image, Paperclip, Send, Settings, Key, X, Camera,
  FileText as FilePdf
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CoCurricularDashboard() {
  // THEME
  const theme = {
    dark: "#193648",
    primary: "#E2EEF9",
    light: "#dfe8fe",
    nearWhite: "#fcfdff",
    accentText: "#193648",
    mediumBlue: "#4a6fa5",
    softBlue: "#7fa3c9"
  };

  // API Configuration
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const COCURRICULAR_API = `${API_BASE}/cocurricular`;

  // Refs for export
  const dashboardRef = useRef(null);
  const exportMenuRef = useRef(null);

  // Export state
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Add Task Form State
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    assignedTo: "",
    assignedToEmail: "",
    deadline: "",
    description: ""
  });

  // NAV & UI STATE
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // DATA
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Task Edit State
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskEditModal, setShowTaskEditModal] = useState(false);
  const [editTaskForm, setEditTaskForm] = useState({
    title: "",
    assignedTo: "",
    assignedToEmail: "",
    deadline: "",
    status: "",
    progress: 0,
    description: ""
  });

  // Event Form state
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    venue: "",
    expected: "",
    category: "Technical",
    coordinator: "",
    email: "",
    budget: "",
    description: "",
    posterFile: null,
    posterPreview: null,
  });
  const posterRef = useRef(null);

  // Invitations recipients
  const [recipients, setRecipients] = useState([
    { id: 1, name: "ABC Industries", email: "contact@abcind.com", selected: false },
    { id: 2, name: "NextGen Tech", email: "info@nextgen.com", selected: false },
    { id: 3, name: "Sigma Labs", email: "hello@sigmalabs.com", selected: false },
  ]);
  const [inviteMsg, setInviteMsg] = useState("");

  // Chart tooltip state
  const [chartTooltip, setChartTooltip] = useState(null);

  // Profile
  const [profile, setProfile] = useState({ name: "Prof. Sarah Ahmed", email: "sarah.ahmed@collxion.edu", dp: null });
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [pwdForm, setPwdForm] = useState({ oldPwd: "", newPwd: "", confirm: "" });

  // ========== EXPORT FUNCTIONS ==========
  const handleExportClick = () => {
    setShowExportMenu(!showExportMenu);
  };

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Export as PNG
  const exportAsPNG = async () => {
    if (!dashboardRef.current) return;
    
    setIsExporting(true);
    setShowExportMenu(false);
    
    try {
      // Temporarily remove tooltip if visible
      if (chartTooltip) setChartTooltip(null);
      
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: theme.light,
        logging: false,
        allowTaint: false,
        useCORS: true
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `cocurricular-dashboard-${new Date().toISOString().slice(0,10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      alert('Dashboard exported as PNG successfully!');
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Failed to export as PNG. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export as PDF
  const exportAsPDF = async () => {
    if (!dashboardRef.current) return;
    
    setIsExporting(true);
    setShowExportMenu(false);
    
    try {
      // Temporarily remove tooltip if visible
      if (chartTooltip) setChartTooltip(null);
      
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: theme.light,
        logging: false,
        allowTaint: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`cocurricular-dashboard-${new Date().toISOString().slice(0,10)}.pdf`);
      
      alert('Dashboard exported as PDF successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export as PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // ========== FETCH DATA FROM API ==========
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchEvents(),
        fetchTasks(),
        fetchNotifications()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("coCurricularToken");
      const response = await fetch(`${COCURRICULAR_API}/events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("coCurricularToken");
      const response = await fetch(`${COCURRICULAR_API}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("coCurricularToken");
      const response = await fetch(`${COCURRICULAR_API}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // ========== TASK HANDLERS ==========
  const handleAddTask = async () => {
    if (!newTaskForm.title || !newTaskForm.assignedTo || !newTaskForm.deadline) {
        alert("Please fill all required fields");
        return;
    }

    const token = localStorage.getItem("coCurricularToken");
   
    try {
        const response = await fetch(`${COCURRICULAR_API}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: newTaskForm.title,
                assignedTo: newTaskForm.assignedTo,
                assignedToEmail: newTaskForm.assignedToEmail,
                deadline: newTaskForm.deadline,
                status: "Pending",
                progress: 0,
                description: newTaskForm.description
            })
        });

        if (response.ok) {
            const newTask = await response.json();
            setTasks([newTask, ...tasks]);
            setShowAddTaskForm(false);
            setNewTaskForm({
                title: "",
                assignedTo: "",
                assignedToEmail: "",
                deadline: "",
                description: ""
            });
            alert("Task added successfully!");
        } else {
            alert("Failed to add task");
        }
    } catch (error) {
        console.error("Error adding task:", error);
        alert("Error adding task");
    }
  };

  const markTaskDone = async (id) => {
    const token = localStorage.getItem("coCurricularToken");
    try {
      const response = await fetch(`${COCURRICULAR_API}/tasks/${id}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
     
      if (response.ok) {
        const completedTask = await response.json();
        setTasks(tasks.map(t => t._id === completedTask._id ? completedTask : t));
        alert("Task marked as completed!");
      } else {
        alert("Failed to complete task");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Error completing task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
   
    const token = localStorage.getItem("coCurricularToken");
    try {
      const response = await fetch(`${COCURRICULAR_API}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
     
      if (response.ok) {
        setTasks(tasks.filter(t => t._id !== id));
        alert("Task deleted successfully");
      } else {
        alert("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditTaskForm({
      title: task.title || "",
      assignedTo: task.assignedTo || "",
      assignedToEmail: task.assignedToEmail || "",
      deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0,10) : "",
      status: task.status || "Pending",
      progress: task.progress || 0,
      description: task.description || ""
    });
    setShowTaskEditModal(true);
  };

  const handleUpdateTask = async () => {
    if (!editTaskForm.title || !editTaskForm.assignedTo || !editTaskForm.deadline) {
      alert("Please fill required fields");
      return;
    }

    const token = localStorage.getItem("coCurricularToken");
   
    try {
      const response = await fetch(`${COCURRICULAR_API}/tasks/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editTaskForm)
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
        setShowTaskEditModal(false);
        setEditingTask(null);
        alert("Task updated successfully!");
      } else {
        alert("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error updating task");
    }
  };

  const sendTaskReminder = (task) => {
    alert(`Reminder sent to ${task.assignedTo} — task: ${task.title}`);
  };

  // ========== EVENT HANDLERS ==========
  const handleCreateOrUpdateEvent = async () => {
    if (!newEvent.name || !newEvent.date || !newEvent.venue || !newEvent.expected || !newEvent.coordinator) {
      alert("Please fill required fields");
      return;
    }

    const token = localStorage.getItem("coCurricularToken");
    const ev = {
      name: newEvent.name,
      date: newEvent.date,
      venue: newEvent.venue,
      expected: parseInt(newEvent.expected || "0"),
      registered: editingEvent ? editingEvent.registered || 0 : Math.floor(Math.random()*50)+10,
      category: newEvent.category,
      coordinator: newEvent.coordinator,
      coordinatorEmail: newEvent.email,
      budget: parseFloat(newEvent.budget) || 0,
      description: newEvent.description,
      poster: newEvent.posterPreview || null,
      status: "upcoming"
    };

    try {
      let response;
      if (editingEvent) {
        response = await fetch(`${COCURRICULAR_API}/events/${editingEvent._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(ev)
        });
      } else {
        response = await fetch(`${COCURRICULAR_API}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(ev)
        });
      }

      if (response.ok) {
        const savedEvent = await response.json();
        if (editingEvent) {
          setEvents(events.map(e => e._id === savedEvent._id ? savedEvent : e));
          alert("Event updated");
        } else {
          setEvents([savedEvent, ...events]);
          alert("Event created");
        }
        resetEventForm();
        setActiveSection("manage");
      } else {
        alert("Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Error saving event");
    }
  };

  const resetEventForm = () => {
    setNewEvent({
      name: "", date: "", venue: "", expected: "", category: "Technical",
      coordinator: "", email: "", budget: "", description: "",
      posterFile: null, posterPreview: null
    });
    setEditingEvent(null);
    setShowEventForm(false);
  };

  const handleEditEvent = (e) => {
    setEditingEvent(e);
    setNewEvent({
      ...e,
      expected: e.expected?.toString() || "",
      budget: e.budget?.toString() || "",
      email: e.coordinatorEmail || "",
      posterFile: null,
      posterPreview: e.poster || null
    });
    setShowEventForm(true);
    setActiveSection("create");
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete event?")) return;
   
    const token = localStorage.getItem("coCurricularToken");
    try {
      const response = await fetch(`${COCURRICULAR_API}/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
     
      if (response.ok) {
        setEvents(events.filter(e => e._id !== id));
        alert("Event deleted");
      } else {
        alert("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event");
    }
  };

  // ========== NOTIFICATION HANDLERS ==========
  const markNotificationSeen = async (id) => {
    const token = localStorage.getItem("coCurricularToken");
    try {
      const response = await fetch(`${COCURRICULAR_API}/notifications/${id}/seen`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
     
      if (response.ok) {
        setNotifications(notifications.map(n =>
          n._id === id ? { ...n, seen: true } : n
        ));
      }
    } catch (error) {
      console.error("Error marking notification:", error);
    }
  };

  // ========== PROFILE ACTIONS ==========
  const changePassword = () => {
    if (!pwdForm.oldPwd || !pwdForm.newPwd || pwdForm.newPwd !== pwdForm.confirm) {
      alert("Check password fields");
      return;
    }
    alert("Password changed (mock)");
    setPwdForm({ oldPwd: "", newPwd: "", confirm: "" });
    setChangePwdOpen(false);
    setProfileOpen(false);
  };

  // ========== INVITATIONS HANDLERS ==========
  const sendInvites = async (eventObj) => {
    const selected = recipients.filter(r => r.selected);
    if (selected.length === 0) { alert("Select recipients"); return; }
    if (!eventObj) { alert("Select an event"); return; }

    const token = localStorage.getItem("coCurricularToken");
    try {
      for (const recipient of selected) {
        await fetch(`${COCURRICULAR_API}/invitations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            eventId: eventObj._id,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            message: inviteMsg || `You are invited to attend "${eventObj.name}"`
          })
        });
      }

      alert(`Invites sent for ${eventObj.name} to ${selected.map(s => s.name).join(", ")}`);
      setRecipients(recipients.map(r => ({ ...r, selected: false })));
      setInviteMsg("");
      setInviteModalOpen(false);
    } catch (error) {
      console.error("Error sending invites:", error);
    }
  };

  // ========== FILE HANDLERS ==========
  const onPosterChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setNewEvent(prev => ({ ...prev, posterFile: f, posterPreview: ev.target.result }));
    r.readAsDataURL(f);
  };

  // ========== LOGOUT ==========
  const handleLogout = () => {
    if (!window.confirm("Logout?")) return;
    localStorage.removeItem("coCurricularToken");
    localStorage.removeItem("coCurricularUser");
    window.location.href = "/co-curricular-login";
  };

  // ========== SIDEBAR VARIANTS ==========
  const sidebarVariants = { open: { width: 280 }, closed: { width: 72 } };

  // ========== HELPER FUNCTIONS FOR THEME COLORS ==========
  const getProgressRingColor = (progress) => {
    if (progress >= 80) return theme.dark;
    if (progress >= 50) return theme.mediumBlue;
    if (progress >= 20) return theme.softBlue;
    return theme.primary;
  };

  const getStatusStyle = (status, isOverdue) => {
    if (isOverdue) {
      return { background: "#ef4444", color: "#fff" };
    }
    
    switch(status) {
      case "Completed":
        return { background: theme.dark, color: "#fff" };
      case "In Progress":
        return { background: theme.mediumBlue, color: "#fff" };
      case "Pending":
        return { background: theme.softBlue, color: "#fff" };
      default:
        return { background: theme.primary, color: theme.dark };
    }
  };

  const getProgressBarColor = (status, isOverdue, progress) => {
    if (status === "Completed") return theme.dark;
    if (isOverdue) return "#ef4444";
    if (progress >= 75) return theme.dark;
    if (progress >= 50) return theme.mediumBlue;
    if (progress >= 25) return theme.softBlue;
    return theme.primary;
  };

  // ========== DERIVED DATA ==========
  const upcomingEvents = events.filter(e => e.status === "upcoming");
  const avgProgress = tasks.length > 0
    ? Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length)
    : 0;
  const overdueCount = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== "Completed").length;
  const deadlineAlerts = tasks.filter(t => {
    if (t.status === "Completed") return false;
    const diff = (new Date(t.deadline) - new Date()) / (1000*60*60*24);
    return diff < 0 || diff <= 2;
  });

  // Chart data
  const weeklyProgress = [
    { day: "Mon", completed: 3 },
    { day: "Tue", completed: 5 },
    { day: "Wed", completed: 2 },
    { day: "Thu", completed: 7 },
    { day: "Fri", completed: 4 },
    { day: "Sat", completed: 6 },
    { day: "Sun", completed: 1 },
  ];

  // ========== SUBCOMPONENTS ==========
  function ProgressRing({ progress = 50, size = 68, stroke = 8 }) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = (progress / 100) * c;
    const ringColor = getProgressRingColor(progress);
    
    return (
      <svg width={size} height={size} style={{ display: "block" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={theme.light} strokeWidth={stroke} />
        <motion.circle
          cx={size/2}
          cy={size/2}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - dash }}
          transition={{ duration: 0.9 }}
        />
        <text x="50%" y="50%" dy="6" textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: theme.dark }}>{progress}%</text>
      </svg>
    );
  }

  function SimpleLineChart({ data = weeklyProgress, width = 300, height = 120 }) {
    const max = Math.max(...data.map(d => d.completed)) || 1;
    const padding = 8;
    const stepX = (width - padding * 2) / (data.length - 1);
    const points = data.map((d, i) => {
      const x = padding + i*stepX;
      const y = height - padding - (d.completed / max) * (height - padding*2);
      return { x, y, label: d.day, value: d.completed };
    });
    const d = points.map((p,i)=> `${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
    const area = `${d} L ${width-padding} ${height-padding} L ${padding} ${height-padding} Z`;
    return (
      <div style={{ width: "100%", overflow: "visible" }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: "block" }}>
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={theme.primary} stopOpacity="0.45" />
              <stop offset="100%" stopColor={theme.primary} stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#g1)" />
          <path d={d} fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" />
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={4} fill="#fff" stroke={theme.primary} strokeWidth="2"
                onMouseEnter={(ev)=> setChartTooltip({ x: ev.clientX, y: ev.clientY, content: `${p.label}: ${p.value}`})}
                onMouseLeave={()=>setChartTooltip(null)}
              />
              <text x={p.x} y={height-4} textAnchor="middle" style={{ fontSize: 11, fill: theme.dark }}>{p.label}</text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  function SimplePieChart({ items = events, size = 100 }) {
    const counts = items.reduce((acc, it) => { acc[it.category] = (acc[it.category] || 0) + 1; return acc; }, {});
    const categories = Object.keys(counts);
    const total = categories.reduce((s, c) => s + counts[c], 0) || 1;
    let start = 0;
    const colors = [theme.dark, theme.mediumBlue, theme.softBlue, theme.primary, "#8b5cf6"];
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {categories.map((c, i) => {
          const v = counts[c];
          const angle = (v / total) * Math.PI * 2;
          const end = start + angle;
          const x1 = size/2 + Math.cos(start) * (size/2 - 6);
          const y1 = size/2 + Math.sin(start) * (size/2 - 6);
          const x2 = size/2 + Math.cos(end) * (size/2 - 6);
          const y2 = size/2 + Math.sin(end) * (size/2 - 6);
          const large = angle > Math.PI ? 1 : 0;
          const d = `M ${size/2} ${size/2} L ${x1} ${y1} A ${size/2-6} ${size/2-6} 0 ${large} 1 ${x2} ${y2} Z`;
          start = end;
          return <path key={c} d={d} fill={colors[i % colors.length]}
            onMouseEnter={(ev)=> setChartTooltip({ x: ev.clientX, y: ev.clientY, content: `${c}: ${v}` })}
            onMouseLeave={()=> setChartTooltip(null)}
          />;
        })}
        <circle cx={size/2} cy={size/2} r={size/2 - 26} fill={theme.nearWhite} />
        <text x="50%" y="50%" textAnchor="middle" dy="6" style={{ fontWeight: 800, fill: theme.dark }}>{total}</text>
      </svg>
    );
  }

  // ========== NAVIGATION ITEMS ==========
  const navItems = [
    { label: "Dashboard", icon: <BarChart3 size={18} />, id: "dashboard" },
    { label: "Responsibilities", icon: <FileText size={18} />, id: "responsibilities" },
    { label: "Create Event", icon: <Plus size={18} />, id: "create" },
    { label: "Manage Events", icon: <Edit size={18} />, id: "manage" },
    { label: "Invitations", icon: <Mail size={18} />, id: "invitations" },
  ];

  // Click outside handlers
  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest) return;
      if (!e.target.closest(".profileMenu") && !e.target.closest(".profileBtn")) {
        setProfileOpen(false);
      }
      if (!e.target.closest(".notifBtn") && !e.target.closest(".notifMenu")) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // ========== RENDER ==========
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: theme.light }}>
      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={drawerOpen ? "open" : "closed"}
        variants={sidebarVariants}
        style={{
          background: theme.dark,
          color: theme.nearWhite,
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1200,
          overflow: "hidden",
          boxShadow: "2px 0 18px rgba(4,4,8,0.25)"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `linear-gradient(90deg, ${theme.primary}, ${theme.light})`, color: theme.accentText, fontWeight: 900
                }}>CX</div>
                {drawerOpen && (
                  <div style={{ lineHeight: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 900, background: `linear-gradient(90deg, ${theme.primary}, ${theme.light})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Collaxion</div>
                    <div style={{ fontSize: 12, color: theme.nearWhite, opacity: 0.9 }}>Co-Curricular</div>
                  </div>
                )}
              </div>
              <button onClick={() => setDrawerOpen(v => !v)} style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.06)", color: theme.nearWhite, padding: 8, borderRadius: 8, cursor: "pointer"
              }} aria-label="toggle menu"><Menu size={18} /></button>
            </div>

            <nav style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {navItems.map(n => {
                const active = activeSection === n.id;
                return (
                  <div key={n.id}
                    onClick={() => { setActiveSection(n.id); setShowEventForm(n.id === "create"); if (n.id !== "create") setShowEventForm(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                      background: active ? "rgba(170,195,253,0.12)" : "transparent", color: active ? theme.primary : theme.nearWhite, fontWeight: 700
                    }}
                  >
                    <div style={{ width: 28, display: "flex", justifyContent: "center" }}>{n.icon}</div>
                    {drawerOpen && <div>{n.label}</div>}
                  </div>
                );
              })}
              <div
                onClick={() => { setActiveSection("invitations"); setInviteModalOpen(false); }}
                style={{ marginTop: 12, padding: "10px 12px", borderRadius: 8, color: theme.nearWhite, cursor: "pointer" }}
              >
                {drawerOpen ? "Invite & Logout" : <Mail size={18} />}
                {drawerOpen && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Open invitations (logout inside)</div>}
              </div>
            </nav>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: theme.primary, color: theme.accentText, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>S</div>
                {drawerOpen && (
                  <div>
                    <div style={{ fontWeight: 800 }}>{profile.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{profile.email}</div>
                  </div>
                )}
              </div>
              <div>
                <button className="profileBtn" onClick={() => setProfileOpen(s => !s)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.06)", color: theme.nearWhite, padding: 8, borderRadius: 8 }}>
                  <User size={16} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {profileOpen && (
                <motion.div className="profileMenu" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: 12, background: theme.nearWhite, color: theme.accentText, padding: 12, borderRadius: 8 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 10, background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{profile.name.split(" ")[0][0]}</div>
                    <div>
                      <div style={{ fontWeight: 800 }}>{profile.name}</div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>{profile.email}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                    <button onClick={() => { setChangePwdOpen(false); setProfileOpen(false); alert("Profile edit (mock)"); }} style={{ padding: 10, borderRadius: 8, border: "1px solid #eef2ff", background: "#fff", cursor: "pointer", textAlign: "left" }}>
                      <Settings size={14} /> Profile & Settings
                    </button>
                    <button onClick={() => { setChangePwdOpen(p => !p); }} style={{ padding: 10, borderRadius: 8, border: "1px solid #eef2ff", background: "#fff", cursor: "pointer", textAlign: "left" }}>
                      <Key size={14} /> Change Password
                    </button>
                    <button onClick={handleLogout} style={{ padding: 10, borderRadius: 8, border: "1px solid #fee2e2", background: "#fff", color: "#ef4444", cursor: "pointer", textAlign: "left" }}>
                      <LogOut size={14} /> Logout
                    </button>
                  </div>

                  {changePwdOpen && (
                    <div style={{ marginTop: 12, background: theme.light, padding: 10, borderRadius: 8 }}>
                      <div style={{ fontWeight: 800, marginBottom: 8 }}>Change Password</div>
                      <input type="password" placeholder="Old password" value={pwdForm.oldPwd} onChange={e=>setPwdForm(prev=>({...prev, oldPwd:e.target.value}))} style={{ padding: 8, width: "100%", borderRadius: 6, border: "1px solid #e6eefc", marginBottom: 8 }} />
                      <input type="password" placeholder="New password" value={pwdForm.newPwd} onChange={e=>setPwdForm(prev=>({...prev, newPwd:e.target.value}))} style={{ padding: 8, width: "100%", borderRadius: 6, border: "1px solid #e6eefc", marginBottom: 8 }} />
                      <input type="password" placeholder="Confirm password" value={pwdForm.confirm} onChange={e=>setPwdForm(prev=>({...prev, confirm:e.target.value}))} style={{ padding: 8, width: "100%", borderRadius: 6, border: "1px solid #e6eefc", marginBottom: 8 }} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={changePassword} style={{ background: theme.primary, color: theme.accentText, padding: 8, borderRadius: 6 }}>Save</button>
                        <button onClick={()=>setChangePwdOpen(false)} style={{ padding: 8, borderRadius: 6, border: "1px solid #e6eefc" }}>Cancel</button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* MAIN */}
      <div style={{ marginLeft: drawerOpen ? 280 : 72, flex: 1, transition: "margin-left 0.25s", minHeight: "100vh" }}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 28px", background: theme.nearWhite, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <button onClick={() => setDrawerOpen(d => !d)} style={{ background: theme.primary, color: theme.accentText, border: "none", padding: 10, borderRadius: 8, cursor: "pointer" }}><Menu size={18} /></button>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>Welcome, Prof. Sarah</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Manage events, tasks & invites</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", position: "relative" }} ref={exportMenuRef}>
            {/* EXPORT BUTTON WITH DROPDOWN */}
            <div style={{ position: "relative" }}>
              <button 
                onClick={handleExportClick}
                disabled={isExporting}
                style={{ 
                  padding: "10px 16px", 
                  borderRadius: 8, 
                  border: "none", 
                  background: theme.primary, 
                  color: theme.accentText, 
                  cursor: isExporting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: 14,
                  fontWeight: 600,
                  opacity: isExporting ? 0.7 : 1
                }}
              >
                <Download size={16} />
                {isExporting ? "Exporting..." : "Export"}
              </button>

              {/* EXPORT DROPDOWN MENU */}
              <AnimatePresence>
                {showExportMenu && !isExporting && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      marginTop: 8,
                      background: "#fff",
                      borderRadius: 8,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      width: 200,
                      zIndex: 1000,
                      overflow: "hidden"
                    }}
                  >
                    <button
                      onClick={exportAsPNG}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "none",
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: 14,
                        color: theme.dark,
                        transition: "background 0.2s",
                        borderBottom: "1px solid #eef2ff"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = theme.light}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                    >
                      <Camera size={18} color={theme.dark} />
                      <span>Export as PNG</span>
                    </button>
                    
                    <button
                      onClick={exportAsPDF}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "none",
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: 14,
                        color: theme.dark,
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = theme.light}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                    >
                      <FilePdf size={18} color={theme.dark} />
                      <span>Export as PDF</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ position: "relative" }}>
              <button className="notifBtn" onClick={() => setNotifOpen(s => !s)} style={{ background: theme.light, padding: 10, borderRadius: 8, border: "none", cursor: "pointer" }}>
                <Bell size={16} />
                {notifications.filter(n=>!n.seen).length > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: "#ef4444", color: "#fff", width: 18, height: 18, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{notifications.filter(n=>!n.seen).length}</span>}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div className="notifMenu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: "absolute", right: 0, top: 44, background: theme.nearWhite, color: theme.accentText, width: 320, boxShadow: "0 12px 40px rgba(2,6,23,0.12)", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>Notifications</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {notifications.map(n => (
                        <div key={n._id} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: 8, borderRadius: 8, background: n.seen ? "#fff" : theme.light }}>
                          <div>
                            <div style={{ fontWeight: 700 }}>{n.title || n.text}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>{n.type}</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <button onClick={() => { markNotificationSeen(n._id); }} style={{ background: "transparent", border: "1px solid #eef2ff", padding: 6, borderRadius: 6 }}>Mark</button>
                            <button onClick={() => setNotifications(notifications.filter(x => x._id !== n._id))} style={{ background: "transparent", border: "1px solid #fee2e2", color: "#ef4444", padding: 6, borderRadius: 6 }}>Dismiss</button>
                          </div>
                        </div>
                      ))}
                      {notifications.length === 0 && <div style={{ color: "#64748b" }}>No notifications</div>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT - Add ref here to capture entire dashboard */}
        <div ref={dashboardRef} style={{ padding: 24 }}>
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: theme.dark }}>Dashboard Overview</h2>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={fetchAllData} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e6eefc", background: "#fff", cursor: "pointer" }}><Download size={14} /></button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
                <div style={{ gridColumn: "span 4" }}>
                  <div style={{ background: "#fff", padding: 16, borderRadius: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>Upcoming Events</div>
                        <div style={{ fontWeight: 900, fontSize: 22 }}>{upcomingEvents.length}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>Budget</div>
                        <div style={{ fontWeight: 800 }}>₹{events.reduce((s,e)=>(s+(e.budget||0)),0).toLocaleString()}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <ProgressRing progress={avgProgress} />
                          <div>
                            <div style={{ fontWeight: 800 }}>{tasks.filter(t => t.status === "Completed").length}/{tasks.length}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>Tasks Completed</div>
                          </div>
                        </div>
                      </div>
                      <div style={{ width: 100 }}>
                        <SimplePieChart items={events} size={100} />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, background: "#fff", padding: 12, borderRadius: 12 }}>
                    <div style={{ fontWeight: 800 }}>This Week</div>
                    <div style={{ marginTop: 8 }}>
                      <SimpleLineChart data={weeklyProgress} width={320} height={100} />
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>Hover chart points to see values</div>
                    </div>
                  </div>
                </div>

                <div style={{ gridColumn: "span 5" }}>
                  <div style={{ background: "#fff", padding: 12, borderRadius: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>Upcoming Events</div>
                        <div style={{ fontWeight: 900 }}>{upcomingEvents.length}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>Next: {upcomingEvents[0] ? new Date(upcomingEvents[0].date).toLocaleDateString() : "-"}</div>
                    </div>

                    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                      {upcomingEvents.slice(0,4).map(ev => (
                        <div key={ev._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, borderRadius: 8, border: "1px solid #eef2ff" }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <div style={{ width: 56, height: 56, borderRadius: 8, background: theme.light, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Calendar size={20} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800 }}>{ev.name}</div>
                              <div style={{ fontSize: 12, color: "#64748b" }}>{new Date(ev.date).toLocaleDateString()} • {ev.venue}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 800 }}>₹{(ev.budget||0).toLocaleString()}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>{ev.registered || 0}/{ev.expected}</div>
                            <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                              <button onClick={() => handleEditEvent(ev)} style={{ padding: 6, borderRadius: 8, border: "1px solid #e6eefc" }}>Edit</button>
                              <button onClick={() => { setInviteModalOpen(true); }} style={{ padding: 6, borderRadius: 8, background: theme.primary, color: theme.accentText }}>Invite</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 12, background: "#fff", padding: 12, borderRadius: 12 }}>
                    <div style={{ fontWeight: 800 }}>Alerts</div>
                    <div style={{ marginTop: 8 }}>
                      {deadlineAlerts.length === 0 && <div style={{ color: "#64748b" }}>No urgent alerts</div>}
                      {deadlineAlerts.slice(0,3).map(a => {
                        const statusStyle = getStatusStyle(a.status, new Date(a.deadline) < new Date());
                        return (
                          <div key={a._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, borderRadius: 8, border: "1px dashed #eef2ff", marginTop: 8 }}>
                            <div>
                              <div style={{ fontWeight: 800 }}>{a.title}</div>
                              <div style={{ fontSize: 12, color: "#64748b" }}>{a.status === "Overdue" ? "Overdue" : "Due soon"} • {new Date(a.deadline).toLocaleDateString()}</div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              <button onClick={() => sendTaskReminder(a)} style={{ padding: 6, borderRadius: 8, background: theme.primary, color: theme.accentText }}>Remind</button>
                              <button onClick={() => markTaskDone(a._id)} style={{ padding: 6, borderRadius: 8, border: "1px solid #e6eefc" }}>Mark Done</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div style={{ gridColumn: "span 3" }}>
                  <div style={{ background: "#fff", padding: 12, borderRadius: 12 }}>
                    <div style={{ fontWeight: 800 }}>Quick Actions</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                      <button onClick={() => { setActiveSection("create"); setShowEventForm(true); }} style={{ padding: 10, borderRadius: 8, background: theme.primary, color: theme.accentText }}>Create Event</button>
                      <button onClick={() => setActiveSection("manage")} style={{ padding: 10, borderRadius: 8, border: "1px solid #eef2ff" }}>Manage Events</button>
                      <button onClick={() => { setActiveSection("invitations"); setInviteModalOpen(true); }} style={{ padding: 10, borderRadius: 8, border: "1px solid #eef2ff" }}>Invitations</button>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, background: "#fff", padding: 12, borderRadius: 12 }}>
                    <div style={{ fontWeight: 800 }}>Team Snapshot</div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12 }}>
                      <div><ProgressRing progress={avgProgress} /></div>
                      <div>
                        <div style={{ fontWeight: 900 }}>{tasks.length}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>Total tasks</div>
                        <div style={{ marginTop: 8, fontSize: 12, color: overdueCount ? "#ef4444" : theme.dark }}>{overdueCount} overdue</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* RESPONSIBILITIES */}
          {activeSection === "responsibilities" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Responsibilities</h2>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setShowAddTaskForm(!showAddTaskForm)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      background: showAddTaskForm ? "#ef4444" : theme.primary,
                      color: showAddTaskForm ? "#fff" : theme.accentText,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "all 0.3s ease"
                    }}
                  >
                    {showAddTaskForm ? <X size={16} /> : <Plus size={16} />}
                    {showAddTaskForm ? "Cancel" : "Add Task"}
                  </button>
                </div>
              </div>

              {/* Inline Add Task Form */}
              <AnimatePresence>
                {showAddTaskForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    style={{
                      background: "#fff",
                      padding: 20,
                      borderRadius: 12,
                      marginBottom: 20,
                      border: `2px solid ${theme.primary}`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                  >
                    <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 800 }}>Add New Task</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>Task Title *</label>
                        <input
                          type="text"
                          value={newTaskForm.title}
                          onChange={(e) => setNewTaskForm({...newTaskForm, title: e.target.value})}
                          style={{
                            width: "100%", padding: 10,
                            border: "1px solid #eef2ff", borderRadius: 8,
                            fontSize: 14
                          }}
                          placeholder="Enter task title"
                        />
                      </div>
                      <div>
                        <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>Assigned To *</label>
                        <input
                          type="text"
                          value={newTaskForm.assignedTo}
                          onChange={(e) => setNewTaskForm({...newTaskForm, assignedTo: e.target.value})}
                          style={{
                            width: "100%", padding: 10,
                            border: "1px solid #eef2ff", borderRadius: 8,
                            fontSize: 14
                          }}
                          placeholder="Person name"
                        />
                      </div>
                      <div>
                        <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>Email</label>
                        <input
                          type="email"
                          value={newTaskForm.assignedToEmail}
                          onChange={(e) => setNewTaskForm({...newTaskForm, assignedToEmail: e.target.value})}
                          style={{
                            width: "100%", padding: 10,
                            border: "1px solid #eef2ff", borderRadius: 8,
                            fontSize: 14
                          }}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>Deadline *</label>
                        <input
                          type="date"
                          value={newTaskForm.deadline}
                          onChange={(e) => setNewTaskForm({...newTaskForm, deadline: e.target.value})}
                          style={{
                            width: "100%", padding: 10,
                            border: "1px solid #eef2ff", borderRadius: 8,
                            fontSize: 14
                          }}
                        />
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>Description</label>
                        <textarea
                          value={newTaskForm.description}
                          onChange={(e) => setNewTaskForm({...newTaskForm, description: e.target.value})}
                          style={{
                            width: "100%", padding: 10,
                            border: "1px solid #eef2ff", borderRadius: 8,
                            fontSize: 14, minHeight: 80,
                            fontFamily: "inherit"
                          }}
                          placeholder="Task description"
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                      <button
                        onClick={handleAddTask}
                        style={{
                          padding: "12px 24px",
                          background: theme.primary,
                          color: theme.accentText,
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontWeight: 600,
                          flex: 1
                        }}
                      >
                        Create Task
                      </button>
                      <button
                        onClick={() => {
                          setShowAddTaskForm(false);
                          setNewTaskForm({
                            title: "",
                            assignedTo: "",
                            assignedToEmail: "",
                            deadline: "",
                            description: ""
                          });
                        }}
                        style={{
                          padding: "12px 24px",
                          border: "1px solid #eef2ff",
                          background: "#fff",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontWeight: 600
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tasks Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
                {tasks.map(task => {
                  const isOverdue = new Date(task.deadline) < new Date() && task.status !== "Completed";
                  const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / (1000*60*60*24));
                  const statusStyle = getStatusStyle(task.status, isOverdue);
                  const progressBarColor = getProgressBarColor(task.status, isOverdue, task.progress);
                  
                  return (
                    <motion.div key={task._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ background: "#fff", padding: 12, borderRadius: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 900 }}>{task.title}</div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>{task.assignedTo}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 900 }}>{task.progress}%</div>
                          <div style={{ fontSize: 12, color: isOverdue ? "#ef4444" : "#64748b" }}>{isOverdue ? "Overdue" : `${daysLeft} d`}</div>
                        </div>
                      </div>

                      <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 84 }}><ProgressRing progress={task.progress} size={84} stroke={8} /></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ height: 10, background: theme.light, borderRadius: 6, overflow: "hidden" }}>
                            <div style={{
                              width: `${task.progress}%`, height: "100%",
                              background: progressBarColor,
                              transition: "width 0.4s"
                            }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                            <div style={{ fontSize: 12, color: "#64748b" }}>Deadline</div>
                            <div style={{ fontSize: 12 }}>{new Date(task.deadline).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        <button onClick={() => markTaskDone(task._id)} style={{ 
                          padding: 8, borderRadius: 8, 
                          background: task.status === "Completed" ? theme.light : theme.dark, 
                          color: task.status === "Completed" ? "#64748b" : "#fff", 
                          border: "none", 
                          cursor: task.status === "Completed" ? "not-allowed" : "pointer", 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 4 
                        }}>
                          <CheckCircle size={14} /> Mark Done
                        </button>
                        <button onClick={() => sendTaskReminder(task)} style={{ 
                          padding: 8, borderRadius: 8, 
                          background: theme.mediumBlue, 
                          color: "#fff", 
                          border: "none", 
                          cursor: "pointer", 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 4 
                        }}>
                          <Mail size={14} /> Remind
                        </button>
                        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                          {/* EDIT BUTTON */}
                          <button
                            onClick={() => handleEditTask(task)}
                            style={{ padding: 8, borderRadius: 8, border: "1px solid #eef2ff", color: "#193648", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            style={{ padding: 8, borderRadius: 8, border: "1px solid #fee2e2", color: "#ef4444", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div style={{ 
                        marginTop: 8, 
                        padding: "4px 8px", 
                        borderRadius: 999,
                        display: "inline-block",
                        fontSize: 12,
                        fontWeight: 600,
                        ...statusStyle
                      }}>
                        {task.status}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}

          {/* CREATE EVENT */}
          {(activeSection === "create" || showEventForm) && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>{editingEvent ? "Edit Event" : "Create Event"}</h2>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={resetEventForm} style={{ padding: 8, borderRadius: 8, border: "1px solid #eef2ff", background: "#fff", cursor: "pointer" }}>Reset</button>
                  <button onClick={handleCreateOrUpdateEvent} style={{ padding: 8, borderRadius: 8, background: theme.primary, color: theme.accentText, border: "none", cursor: "pointer" }}>{editingEvent ? "Update" : "Create"}</button>
                </div>
              </div>

              <div style={{ background: "#fff", padding: 12, borderRadius: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12 }}>
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 800 }}>Event Name</div>
                        <input value={newEvent.name} onChange={e=>setNewEvent(prev=>({...prev, name:e.target.value}))} style={{ padding: 8, borderRadius: 6, border: "1px solid #eef2ff", width: "100%" }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800 }}>Date</div>
                        <input type="date" value={newEvent.date} onChange={e=>setNewEvent(prev=>({...prev, date:e.target.value}))} style={{ padding: 8, borderRadius: 6, border: "1px solid #eef2ff", width: "100%" }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800 }}>Venue</div>
                        <input value={newEvent.venue} onChange={e=>setNewEvent(prev=>({...prev, venue:e.target.value}))} style={{ padding: 8, borderRadius: 6, border: "1px solid #eef2ff", width: "100%" }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800 }}>Expected</div>
                        <input type="number" value={newEvent.expected} onChange={e=>setNewEvent(prev=>({...prev, expected:e.target.value}))} style={{ padding: 8, borderRadius: 6, border: "1px solid #eef2ff", width: "100%" }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800 }}>Coordinator</div>
                        <input value={newEvent.coordinator} onChange={e=>setNewEvent(prev=>({...prev, coordinator:e.target.value}))} style={{ padding: 8, borderRadius: 6, border: "1px solid #eef2ff", width: "100%" }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800 }}>Coordinator Email</div>
                        <input value={newEvent.email} onChange={e=>setNewEvent(prev=>({...prev, email:e.target.value}))} style={{ padding: 8, borderRadius: 6, border: "1px solid #eef2ff", width: "100%" }} />
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div style={{ fontWeight: 800 }}>Description</div>
                        <textarea value={newEvent.description} onChange={e=>setNewEvent(prev=>({...prev, description:e.target.value}))} style={{ padding: 8, borderRadius: 6, border: "1px solid #eef2ff", width: "100%", minHeight: 80 }} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>Poster Upload</div>
                    <div style={{ border: `2px dashed ${theme.light}`, borderRadius: 8, padding: 12, minHeight: 200, display: "flex", flexDirection: "column", gap: 8, alignItems: "center", justifyContent: "center" }}>
                      {newEvent.posterPreview ? <img src={newEvent.posterPreview} alt="poster" style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8 }} /> : (
                        <div style={{ textAlign: "center", color: "#64748b" }}>
                          <Image size={22} />
                          <div style={{ marginTop: 8 }}>Drop or upload poster</div>
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 8 }}>
                        <input ref={posterRef} id="poster" type="file" accept="image/*" style={{ display: "none" }} onChange={onPosterChange} />
                        <label htmlFor="poster" onClick={()=>posterRef.current && posterRef.current.click()} style={{ padding: 8, borderRadius: 6, background: theme.primary, color: theme.accentText, cursor: "pointer" }}><Paperclip size={14} /> Choose</label>
                        {newEvent.posterPreview && <button onClick={()=>setNewEvent(prev=>({...prev, posterFile:null, posterPreview:null}))} style={{ padding: 8, borderRadius: 6, border: "1px solid #fee2e2", color: "#ef4444", cursor: "pointer" }}><Trash2 size={14} /></button>}
                      </div>

                      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <button onClick={() => { setInviteModalOpen(true); }} style={{ padding: 8, borderRadius: 6, border: "1px solid #eef2ff", cursor: "pointer" }}>Invite</button>
                        <button onClick={handleCreateOrUpdateEvent} style={{ padding: 8, borderRadius: 6, background: theme.primary, color: theme.accentText, border: "none", cursor: "pointer" }}>{editingEvent ? "Update" : "Create"}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MANAGE EVENTS */}
          {activeSection === "manage" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Manage Events</h2>
                <div><button onClick={() => { setActiveSection("create"); setShowEventForm(true); }} style={{ padding: 8, borderRadius: 8, background: theme.primary, color: theme.accentText, border: "none", cursor: "pointer" }}>New Event</button></div>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, padding: 12 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: theme.light }}>
                    <tr>
                      <th style={{ padding: 10, textAlign: "left" }}>Event</th>
                      <th style={{ padding: 10, textAlign: "left" }}>Date</th>
                      <th style={{ padding: 10, textAlign: "left" }}>Venue</th>
                      <th style={{ padding: 10, textAlign: "left" }}>Coordinator</th>
                      <th style={{ padding: 10, textAlign: "left" }}>Budget</th>
                      <th style={{ padding: 10, textAlign: "left" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(ev => (
                      <tr key={ev._id} style={{ borderBottom: "1px solid #eef2ff" }}>
                        <td style={{ padding: 8 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <div style={{ width: 48, height: 48, borderRadius: 8, background: theme.light, display: "flex", alignItems: "center", justifyContent: "center" }}><Calendar size={18} /></div>
                            <div>
                              <div style={{ fontWeight: 800 }}>{ev.name}</div>
                              <div style={{ fontSize: 12, color: "#64748b" }}>{ev.category}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: 8 }}>{new Date(ev.date).toLocaleDateString()}</td>
                        <td style={{ padding: 8 }}>{ev.venue}</td>
                        <td style={{ padding: 8 }}>{ev.coordinator}</td>
                        <td style={{ padding: 8 }}>₹{(ev.budget||0).toLocaleString()}</td>
                        <td style={{ padding: 8 }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => handleEditEvent(ev)} style={{ padding: 6, borderRadius: 6, border: "1px solid #eef2ff", cursor: "pointer" }}><Edit size={14} /></button>
                            <button onClick={() => handleDeleteEvent(ev._id)} style={{ padding: 6, borderRadius: 6, border: "1px solid #fee2e2", color: "#ef4444", cursor: "pointer" }}><Trash2 size={14} /></button>
                            <button onClick={() => { setInviteModalOpen(true); }} style={{ padding: 6, borderRadius: 6, background: theme.primary, color: theme.accentText, border: "none", cursor: "pointer" }}><Send size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INVITATIONS */}
          {activeSection === "invitations" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Invitations</h2>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setInviteModalOpen(true)} style={{ padding: 8, borderRadius: 8, background: theme.primary, color: theme.accentText, border: "none", cursor: "pointer" }}>Open Invite Modal</button>
                  <button onClick={handleLogout} style={{ padding: 8, borderRadius: 8, border: "1px solid #fee2e2", color: "#ef4444", background: "#fff", cursor: "pointer" }}>Logout</button>
                </div>
              </div>

              <div style={{ background: "#fff", padding: 12, borderRadius: 12 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800 }}>Recipients</div>
                    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                      {recipients.map(r => (
                        <label key={r.id} style={{ padding: 8, borderRadius: 8, border: "1px solid #eef2ff", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                          <div>
                            <div style={{ fontWeight: 800 }}>{r.name}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>{r.email}</div>
                          </div>
                          <input type="checkbox" checked={r.selected} onChange={() => setRecipients(prev => prev.map(p => p.id === r.id ? { ...p, selected: !p.selected } : p))} />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ width: 420 }}>
                    <div style={{ fontWeight: 800 }}>Message</div>
                    <textarea value={inviteMsg} onChange={e=>setInviteMsg(e.target.value)} style={{ width: "100%", minHeight: 160, padding: 8, borderRadius: 8, border: "1px solid #eef2ff" }} placeholder="Write invite message or select event template..." />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <select style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #eef2ff" }} onChange={(e) => {
                        const v = e.target.value;
                        if (!v) return;
                        setInviteMsg(`You are invited to attend "${v}" — please confirm participation.`);
                      }}>
                        <option value="">Event templates...</option>
                        {events.map(ev => <option key={ev._id} value={ev.name}>{ev.name}</option>)}
                      </select>
                      <button onClick={() => sendInvites(events[0])} style={{ padding: 8, borderRadius: 8, background: theme.primary, color: theme.accentText, border: "none", cursor: "pointer" }}><Send size={14} /> Send</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EDIT TASK MODAL */}
          <AnimatePresence>
            {showTaskEditModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "fixed", inset: 0,
                  background: "rgba(2,6,23,0.4)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", zIndex: 1500,
                  padding: 20
                }}
                onClick={() => setShowTaskEditModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  style={{
                    width: 500, maxWidth: "100%",
                    background: "#fff", borderRadius: 12,
                    padding: 24
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: 20
                  }}>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>
                      Edit Task
                    </h3>
                    <button
                      onClick={() => setShowTaskEditModal(false)}
                      style={{
                        background: "none", border: "none",
                        cursor: "pointer", fontSize: 20
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Task Title *
                      </label>
                      <input
                        type="text"
                        value={editTaskForm.title}
                        onChange={(e) => setEditTaskForm({...editTaskForm, title: e.target.value})}
                        style={{
                          width: "100%", padding: 10,
                          border: "1px solid #eef2ff", borderRadius: 8,
                          fontSize: 14
                        }}
                        placeholder="Enter task title"
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Assigned To *
                      </label>
                      <input
                        type="text"
                        value={editTaskForm.assignedTo}
                        onChange={(e) => setEditTaskForm({...editTaskForm, assignedTo: e.target.value})}
                        style={{
                          width: "100%", padding: 10,
                          border: "1px solid #eef2ff", borderRadius: 8,
                          fontSize: 14
                        }}
                        placeholder="Person name"
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={editTaskForm.assignedToEmail}
                        onChange={(e) => setEditTaskForm({...editTaskForm, assignedToEmail: e.target.value})}
                        style={{
                          width: "100%", padding: 10,
                          border: "1px solid #eef2ff", borderRadius: 8,
                          fontSize: 14
                        }}
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Deadline *
                      </label>
                      <input
                        type="date"
                        value={editTaskForm.deadline}
                        onChange={(e) => setEditTaskForm({...editTaskForm, deadline: e.target.value})}
                        style={{
                          width: "100%", padding: 10,
                          border: "1px solid #eef2ff", borderRadius: 8,
                          fontSize: 14
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Status
                      </label>
                      <select
                        value={editTaskForm.status}
                        onChange={(e) => setEditTaskForm({...editTaskForm, status: e.target.value})}
                        style={{
                          width: "100%", padding: 10,
                          border: "1px solid #eef2ff", borderRadius: 8,
                          fontSize: 14, background: "#fff"
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Progress ({editTaskForm.progress}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editTaskForm.progress}
                        onChange={(e) => setEditTaskForm({...editTaskForm, progress: parseInt(e.target.value)})}
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                        Description
                      </label>
                      <textarea
                        value={editTaskForm.description}
                        onChange={(e) => setEditTaskForm({...editTaskForm, description: e.target.value})}
                        style={{
                          width: "100%", padding: 10,
                          border: "1px solid #eef2ff", borderRadius: 8,
                          fontSize: 14, minHeight: 80,
                          fontFamily: "inherit"
                        }}
                        placeholder="Task description"
                      />
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                      <button
                        onClick={() => setShowTaskEditModal(false)}
                        style={{
                          flex: 1, padding: 12,
                          border: "1px solid #eef2ff",
                          background: "#fff", borderRadius: 8,
                          cursor: "pointer", fontWeight: 600
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateTask}
                        style={{
                          flex: 1, padding: 12,
                          background: theme.primary,
                          color: theme.accentText, border: "none",
                          borderRadius: 8, cursor: "pointer", fontWeight: 600
                        }}
                      >
                        Update Task
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chart tooltip */}
          <AnimatePresence>
            {chartTooltip && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{
                position: "fixed", left: chartTooltip.x + 12, top: chartTooltip.y - 12, background: theme.nearWhite, color: theme.accentText, padding: 8, borderRadius: 8, boxShadow: "0 12px 40px rgba(2,6,23,0.12)", pointerEvents: "none"
              }}>
                {chartTooltip.content}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Invite modal */}
          <AnimatePresence>
            {inviteModalOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1400 }}>
                <div style={{ width: 820, maxWidth: "96%", background: "#fff", borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontWeight: 900 }}>Send Invitations</div>
                    <div><button onClick={() => setInviteModalOpen(false)} style={{ padding: 6, borderRadius: 6, border: "1px solid #eef2ff", cursor: "pointer" }}>Close</button></div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800 }}>Select Recipients</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                        {recipients.map(r => (
                          <label key={r.id} style={{ padding: 8, borderRadius: 8, border: "1px solid #eef2ff", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                            <div>
                              <div style={{ fontWeight: 800 }}>{r.name}</div>
                              <div style={{ fontSize: 12, color: "#64748b" }}>{r.email}</div>
                            </div>
                            <input type="checkbox" checked={r.selected} onChange={() => setRecipients(prev => prev.map(p => p.id === r.id ? { ...p, selected: !p.selected } : p))} />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{ width: 340 }}>
                      <div style={{ fontWeight: 800 }}>Message</div>
                      <textarea value={inviteMsg} onChange={e=>setInviteMsg(e.target.value)} style={{ width: "100%", minHeight: 160, padding: 8, borderRadius: 8, border: "1px solid #eef2ff" }} />
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <select style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #eef2ff" }} onChange={(e)=> {
                          const v = e.target.value; if(!v) return; setInviteMsg(`You are invited to "${v}". Please confirm.`);
                        }}>
                          <option value="">Event templates</option>
                          {events.map(ev => <option key={ev._id} value={ev.name}>{ev.name}</option>)}
                        </select>
                        <button onClick={() => sendInvites(events[0])} style={{ padding: 8, borderRadius: 8, background: theme.primary, color: theme.accentText, border: "none", cursor: "pointer" }}><Send size={14} /> Send</button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}