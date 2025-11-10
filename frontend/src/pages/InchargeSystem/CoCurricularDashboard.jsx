// CoCurricularDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Calendar, FileText, Plus, Edit, Trash2,
  CheckCircle, AlertCircle, Clock, User, LogOut, Bell,
  Download, Mail, TrendingUp, BarChart3, Target, Users,
  Image, Paperclip, Send, Settings, Key
} from "lucide-react";

/**
 * Single-file CoCurricular Dashboard (frontend-only)
 * Theme colors from image:
 *  - dark: #040415
 *  - primary: #aac3fd
 *  - light: #dfe8fe
 *  - nearWhite: #fcfdff
 *
 * Inline styles only. Framer Motion for animations.
 */

export default function CoCurricularDashboard() {
  // THEME
  const theme = {
    dark: "#193648",
    primary: "#E2EEF9",
    light: "#dfe8fe",
    nearWhite: "#fcfdff",
    accentText: "#193648"
  };

  // NAV & UI STATE
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // DATA (mock / local)
  const [tasks, setTasks] = useState([
    { id: 1, title: "Finalize Tech Summit Schedule", assignedTo: "Prof. R. Mehta", email: "r.mehta@collxion.edu", deadline: "2024-11-12", status: "In Progress", progress: 75 },
    { id: 2, title: "Sports Team Registration", assignedTo: "Prof. A. Khan", email: "a.khan@collxion.edu", deadline: "2024-11-20", status: "Pending", progress: 30 },
    { id: 3, title: "Cultural Event Budget Approval", assignedTo: "Prof. S. Ahmed", email: "s.ahmed@collxion.edu", deadline: "2024-11-10", status: "Overdue", progress: 0 },
    { id: 4, title: "Venue Booking for Workshop", assignedTo: "Prof. R. Mehta", email: "r.mehta@collxion.edu", deadline: "2024-11-28", status: "Pending", progress: 10 },
  ]);
  const [events, setEvents] = useState([
    { id: 1, name: "AI & Robotics Workshop", date: "2024-11-15", venue: "CS Lab", expected: 80, registered: 72, category: "Technical", coordinator: "Dr. N. Sharma", budget: 15000, poster: null, status: "upcoming" },
    { id: 2, name: "Annual Sports Day", date: "2024-11-22", venue: "Main Ground", expected: 500, registered: 480, category: "Sports", coordinator: "Prof. P. Singh", budget: 45000, poster: null, status: "upcoming" },
    { id: 3, name: "Cultural Night 2024", date: "2024-12-01", venue: "Open Air Theatre", expected: 800, registered: 720, category: "Cultural", coordinator: "Ms. R. Gupta", budget: 75000, poster: null, status: "upcoming" },
  ]);

  // Notifications & mock history
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Budget approval pending for Cultural Night", type: "urgent", seen: false },
    { id: 2, text: "Venue booking confirmed for AI Workshop", type: "info", seen: false },
  ]);

  // Event Form state (with poster upload)
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
  const onPosterChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setNewEvent(prev => ({ ...prev, posterFile: f, posterPreview: ev.target.result }));
    r.readAsDataURL(f);
  };

  // Invitations recipients (mock)
  const [recipients, setRecipients] = useState([
    { id: 1, name: "ABC Industries", email: "contact@abcind.com", selected: false },
    { id: 2, name: "NextGen Tech", email: "info@nextgen.com", selected: false },
    { id: 3, name: "Sigma Labs", email: "hello@sigmalabs.com", selected: false },
  ]);
  const [inviteMsg, setInviteMsg] = useState("");

  // Chart tooltip state
  const [chartTooltip, setChartTooltip] = useState(null); // {x,y,content}

  // Derived data
  const upcomingEvents = events.filter(e => e.status === "upcoming");
  const avgProgress = Math.round(tasks.reduce((s, t) => s + t.progress, 0) / Math.max(1, tasks.length));
  const overdueCount = tasks.filter(t => new Date(t.deadline) < new Date()).length;
  const deadlineAlerts = tasks.filter(t => {
    if (t.status === "Completed") return false;
    const diff = (new Date(t.deadline) - new Date()) / (1000*60*60*24);
    return diff < 0 || diff <= 2;
  });

  // Small helpers
  const handleCreateOrUpdateEvent = () => {
    if (!newEvent.name || !newEvent.date || !newEvent.venue || !newEvent.expected || !newEvent.coordinator) {
      alert("Please fill required fields");
      return;
    }
    const ev = {
      id: editingEvent ? editingEvent.id : Date.now(),
      ...newEvent,
      expected: parseInt(newEvent.expected || "0"),
      registered: editingEvent ? editingEvent.registered || 0 : Math.floor(Math.random()*50)+10,
      budget: parseFloat(newEvent.budget) || 0,
      poster: newEvent.posterPreview || null,
      status: "upcoming"
    };
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? ev : e));
      alert("Event updated");
    } else {
      setEvents([ev, ...events]);
      alert("Event created");
    }
    resetEventForm();
    setActiveSection("manage");
  };
  const resetEventForm = () => {
    setNewEvent({ name: "", date: "", venue: "", expected: "", category: "Technical", coordinator: "", email: "", budget: "", description: "", posterFile: null, posterPreview: null });
    setEditingEvent(null);
    setShowEventForm(false);
  };
  const handleEditEvent = (e) => {
    setEditingEvent(e);
    setNewEvent({ ...e, expected: e.expected || "", budget: e.budget || "", posterFile: null, posterPreview: e.poster || null });
    setShowEventForm(true);
    setActiveSection("create");
  };
  const handleDeleteEvent = (id) => {
    if (!window.confirm("Delete event?")) return;
    setEvents(events.filter(e => e.id !== id));
  };

  // Tasks
  const markTaskDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: "Completed", progress: 100 } : t));
  };
  const sendTaskReminder = (task) => {
    alert(`Reminder sent to ${task.assignedTo} (${task.email}) — task: ${task.title}`);
  };

  // Notifications
  const markNotificationSeen = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, seen: true } : n));
  };

  // Profile actions
  const [profile, setProfile] = useState({ name: "Prof. Sarah Ahmed", email: "sarah.ahmed@collxion.edu", dp: null });
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [pwdForm, setPwdForm] = useState({ oldPwd: "", newPwd: "", confirm: "" });
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

  // Invitations send
  const sendInvites = (eventObj) => {
    const selected = recipients.filter(r => r.selected);
    if (selected.length === 0) { alert("Select recipients"); return; }
    if (!eventObj) { alert("Select an event (or go to Manage Events and select invite)"); return; }
    alert(`Invites sent for ${eventObj.name} to ${selected.map(s => s.name).join(", ")}`);
    setRecipients(recipients.map(r => ({ ...r, selected: false })));
    setInviteMsg("");
    setInviteModalOpen(false);
  };

  // Sidebar variants
  const sidebarVariants = { open: { width: 280 }, closed: { width: 72 } };

  // Chart data (simple)
  const weeklyProgress = [
    { day: "Mon", completed: 3 },
    { day: "Tue", completed: 5 },
    { day: "Wed", completed: 2 },
    { day: "Thu", completed: 7 },
    { day: "Fri", completed: 4 },
    { day: "Sat", completed: 6 },
    { day: "Sun", completed: 1 },
  ];

  // ---------- Small subcomponents inside file (keeps single file) ----------

  function ProgressRing({ progress = 50, size = 68, stroke = 8 }) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = (progress / 100) * c;
    return (
      <svg width={size} height={size} style={{ display: "block" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={theme.light} strokeWidth={stroke} />
        <motion.circle
          cx={size/2}
          cy={size/2}
          r={r}
          fill="none"
          stroke={theme.primary}
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
    const colors = [theme.primary, "#f59e0b", "#16a34a", "#ef4444", "#8b5cf6"];
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

  // ---------- UI Layout (single-file but split logically) ----------
  const navItems = [
    { label: "Dashboard", icon: <BarChart3 size={18} />, id: "dashboard" },
    { label: "Responsibilities", icon: <FileText size={18} />, id: "responsibilities" },
    { label: "Create Event", icon: <Plus size={18} />, id: "create" },
    { label: "Manage Events", icon: <Edit size={18} />, id: "manage" },
    { label: "Invitations", icon: <Mail size={18} />, id: "invitations" },
  ];

  // LOGOUT action (both places)
  const handleLogout = () => {
    if (!window.confirm("Logout?")) return;
    alert("Logged out (mock)");
    // In real app, redirect or clear tokens; here we'll reset UI
    setActiveSection("dashboard");
    setProfileOpen(false);
  };

  // make sure profile menu closes when clicking outside
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

  // ---------- RENDER ----------
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
                      background: active ? "rgba(170,195,253,0.12)" : "transparent", color: active ? theme.accentText : theme.nearWhite, fontWeight: 700
                    }}
                  >
                    <div style={{ width: 28, display: "flex", justifyContent: "center" }}>{n.icon}</div>
                    {drawerOpen && <div>{n.label}</div>}
                  </div>
                );
              })}
              {/* Logout under Invitations as requested */}
              <div
                onClick={() => { setActiveSection("invitations"); setInviteModalOpen(false); /* keep view */ }}
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
                      <Settings size={14} style={{ marginRight: 8 }} /> Profile & Settings
                    </button>
                    <button onClick={() => { setChangePwdOpen(p => !p); }} style={{ padding: 10, borderRadius: 8, border: "1px solid #eef2ff", background: "#fff", cursor: "pointer", textAlign: "left" }}>
                      <Key size={14} style={{ marginRight: 8 }} /> Change Password
                    </button>
                    <button onClick={handleLogout} style={{ padding: 10, borderRadius: 8, border: "1px solid #fee2e2", background: "#fff", color: "#ef4444", cursor: "pointer", textAlign: "left" }}>
                      <LogOut size={14} style={{ marginRight: 8 }} /> Logout
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

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
                        <div key={n.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: 8, borderRadius: 8, background: n.seen ? "#fff" : theme.light }}>
                          <div>
                            <div style={{ fontWeight: 700 }}>{n.text}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>{n.type}</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <button onClick={() => { markNotificationSeen(n.id); }} style={{ background: "transparent", border: "1px solid #eef2ff", padding: 6, borderRadius: 6 }}>Mark</button>
                            <button onClick={() => setNotifications(notifications.filter(x => x.id !== n.id))} style={{ background: "transparent", border: "1px solid #fee2e2", color: "#ef4444", padding: 6, borderRadius: 6 }}>Dismiss</button>
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

        {/* PAGE CONTENT */}
        <div style={{ padding: 24 }}>
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: theme.dark }}>Dashboard Overview</h2>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e6eefc", background: "#fff", cursor: "pointer" }}><Download size={14} /></button>
                  <button style={{ padding: "10px 12px", borderRadius: 8, border: "none", background: theme.primary, color: theme.accentText, cursor: "pointer" }}>Export</button>
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
                        <div key={ev.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, borderRadius: 8, border: "1px solid #eef2ff" }}>
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
                            <div style={{ fontSize: 12, color: "#64748b" }}>{ev.registered}/{ev.expected}</div>
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
                      {deadlineAlerts.slice(0,3).map(a => (
                        <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, borderRadius: 8, border: "1px dashed #eef2ff", marginTop: 8 }}>
                          <div>
                            <div style={{ fontWeight: 800 }}>{a.title}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>{a.status === "Overdue" ? "Overdue" : "Due soon"} • {a.deadline}</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <button onClick={() => sendTaskReminder(a)} style={{ padding: 6, borderRadius: 8, background: theme.primary, color: theme.accentText }}>Remind</button>
                            <button onClick={() => markTaskDone(a.id)} style={{ padding: 6, borderRadius: 8, border: "1px solid #e6eefc" }}>Mark Done</button>
                          </div>
                        </div>
                      ))}
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
                        <div style={{ marginTop: 8, fontSize: 12, color: overdueCount ? "#ef4444" : "#16a34a" }}>{overdueCount} overdue</div>
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
                  <button onClick={() => { const id = Date.now(); setTasks([{ id, title: "New Task", assignedTo: "TBD", email: "", deadline: new Date().toISOString().slice(0,10), status: "Pending", progress: 0}, ...tasks]); }} style={{ padding: 8, borderRadius: 8, background: theme.primary, color: theme.accentText }}>Add Task</button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
                {tasks.map(task => {
                  const isOverdue = new Date(task.deadline) < new Date();
                  const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / (1000*60*60*24));
                  return (
                    <motion.div key={task.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ background: "#fff", padding: 12, borderRadius: 12 }}>
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
                            <div style={{ width: `${task.progress}%`, height: "100%", background: task.status === "Completed" ? "#16a34a" : (isOverdue ? "#ef4444" : "#f59e0b"), transition: "width 0.4s" }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                            <div style={{ fontSize: 12, color: "#64748b" }}>Deadline</div>
                            <div style={{ fontSize: 12 }}>{task.deadline}</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        <button onClick={() => markTaskDone(task.id)} style={{ padding: 8, borderRadius: 8, background: "#16a34a", color: "#fff" }}><CheckCircle size={14} /> Mark Done</button>
                        <button onClick={() => sendTaskReminder(task)} style={{ padding: 8, borderRadius: 8, background: "#f59e0b", color: "#fff" }}><Mail size={14} /> Remind</button>
                        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                          <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} style={{ padding: 8, borderRadius: 8, border: "1px solid #fee2e2", color: "#ef4444" }}><Trash2 size={14} /></button>
                        </div>
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
                  <button onClick={resetEventForm} style={{ padding: 8, borderRadius: 8, border: "1px solid #eef2ff" }}>Reset</button>
                  <button onClick={handleCreateOrUpdateEvent} style={{ padding: 8, borderRadius: 8, background: theme.primary, color: theme.accentText }}>{editingEvent ? "Update" : "Create"}</button>
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
                        {newEvent.posterPreview && <button onClick={()=>setNewEvent(prev=>({...prev, posterFile:null, posterPreview:null}))} style={{ padding: 8, borderRadius: 6, border: "1px solid #fee2e2", color: "#ef4444" }}><Trash2 size={14} /></button>}
                      </div>

                      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <button onClick={() => { setInviteModalOpen(true); }} style={{ padding: 8, borderRadius: 6, border: "1px solid #eef2ff" }}>Invite</button>
                        <button onClick={handleCreateOrUpdateEvent} style={{ padding: 8, borderRadius: 6, background: theme.primary, color: theme.accentText }}>{editingEvent ? "Update" : "Create"}</button>
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
                <div><button onClick={() => { setActiveSection("create"); setShowEventForm(true); }} style={{ padding: 8, borderRadius: 8, background: theme.primary, color: theme.accentText }}>New Event</button></div>
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
                      <tr key={ev.id} style={{ borderBottom: "1px solid #eef2ff" }}>
                        <td style={{ padding: 8 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <div style={{ width: 48, height: 48, borderRadius: 8, background: theme.light, display: "flex", alignItems: "center", justifyContent: "center" }}><Calendar size={18} /></div>
                            <div>
                              <div style={{ fontWeight: 800 }}>{ev.name}</div>
                              <div style={{ fontSize: 12, color: "#64748b" }}>{ev.category}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: 8 }}>{ev.date}</td>
                        <td style={{ padding: 8 }}>{ev.venue}</td>
                        <td style={{ padding: 8 }}>{ev.coordinator}</td>
                        <td style={{ padding: 8 }}>₹{(ev.budget||0).toLocaleString()}</td>
                        <td style={{ padding: 8 }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => handleEditEvent(ev)} style={{ padding: 6, borderRadius: 6, border: "1px solid #eef2ff" }}><Edit size={14} /></button>
                            <button onClick={() => handleDeleteEvent(ev.id)} style={{ padding: 6, borderRadius: 6, border: "1px solid #fee2e2", color: "#ef4444" }}><Trash2 size={14} /></button>
                            <button onClick={() => { setInviteModalOpen(true); }} style={{ padding: 6, borderRadius: 6, background: theme.primary, color: theme.accentText }}><Send size={14} /></button>
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
                  <button onClick={() => setInviteModalOpen(true)} style={{ padding: 8, borderRadius: 8, background: theme.primary, color: theme.accentText }}>Open Invite Modal</button>
                  <button onClick={handleLogout} style={{ padding: 8, borderRadius: 8, border: "1px solid #fee2e2", color: "#ef4444" }}>Logout</button>
                </div>
              </div>

              <div style={{ background: "#fff", padding: 12, borderRadius: 12 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800 }}>Recipients</div>
                    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                      {recipients.map(r => (
                        <label key={r.id} style={{ padding: 8, borderRadius: 8, border: "1px solid #eef2ff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                        {events.map(ev => <option key={ev.id} value={ev.name}>{ev.name}</option>)}
                      </select>
                      <button onClick={() => sendInvites(events[0])} style={{ padding: 8, borderRadius: 8, background: theme.primary, color: theme.accentText }}><Send size={14} /> Send</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    <div><button onClick={() => setInviteModalOpen(false)} style={{ padding: 6, borderRadius: 6, border: "1px solid #eef2ff" }}>Close</button></div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800 }}>Select Recipients</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                        {recipients.map(r => (
                          <label key={r.id} style={{ padding: 8, borderRadius: 8, border: "1px solid #eef2ff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                          {events.map(ev => <option key={ev.id} value={ev.name}>{ev.name}</option>)}
                        </select>
                        <button onClick={() => sendInvites(events[0])} style={{ padding: 8, borderRadius: 8, background: theme.primary, color: theme.accentText }}><Send size={14} /> Send</button>
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
