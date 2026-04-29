// src/pages/EventCreation.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import LiaisonNavbar from "../components/LiaisonNavbar";
import LiaisonFooter from "../components/LiaisonFooter";
import summitImg from "../images/event5.jpg";
import aiWorkshopImg from "../images/event1.png";
import visitImg from "../images/event2.jpg";
import webinarImg from "../images/event4.jpg";
import hackathonImg from "../images/event3.jpg";
import {
  CalendarDays,
  PlusCircle,
  Search,
  Clock,
  MapPin,
  Users,
  Image,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api/events";
const now = new Date("2025-10-30");

// SVG placeholder (same as before)
const svgPlaceholder = (title = "Event", bg = "#E2EEF9", fg = "#193648") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='100%' height='100%' fill='${bg}' rx='12'/><text x='50%' y='50%' font-size='28' font-family='Poppins, sans-serif' fill='${fg}' text-anchor='middle' dominant-baseline='middle'>${title}</text></svg>`
  )}`;

// Tabs
const TABS = [
  { key: "all", label: "All Events" },
  { key: "upcoming", label: "Upcoming" },
  { key: "Workshop", label: "Workshops" },
  { key: "Seminar", label: "Seminars" },
  { key: "Webinar", label: "Webinars" },
  { key: "Industry Visit", label: "Industry Visits" },
  { key: "Competition", label: "Competitions" },
];

const EventCreation = () => {
  // Fixed: useState([]) instead of useState<any[]>([])
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [posterPreview, setPosterPreview] = useState(null);
  const [posterBase64, setPosterBase64] = useState(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    attendees: "",
    type: "Workshop",
    description: "",
  });

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(API);
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events", err);
      }
    };
    fetchEvents();
  }, []);

  // Stats
  const totalCount = events.length;
  const upcomingCount = events.filter((e) => new Date(e.date) >= now).length;
  const nextEvent = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  // Filtering
  const visibleEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = events;

    if (activeTab === "upcoming") {
      list = list.filter((e) => new Date(e.date) >= now);
    } else if (activeTab !== "all") {
      const tabTypeMap = {
        Workshop: "Workshop",
        Seminar: "Seminar",
        Webinar: "Webinar",
        "Industry Visit": "Industry Visit",
        Competition: "Competition",
      };
      const t = tabTypeMap[activeTab];
      if (t) list = list.filter((e) => e.type === t);
    }

    if (q) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.location || "").toLowerCase().includes(q) ||
          (e.type || "").toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, activeTab, search]);

  // Handlers
  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onPoster = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setPosterBase64(base64);
      setPosterPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const clearPoster = () => {
    setPosterPreview(null);
    setPosterBase64(null);
  };

  const createEvent = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return alert("Please provide title and date.");

    const payload = {
      ...form,
      poster: posterBase64,
    };

    try {
      const { data } = await axios.post(API, payload);
      setEvents((prev) => [data, ...prev]);

      // Reset
      setForm({
        title: "",
        date: "",
        time: "",
        location: "",
        attendees: "",
        type: "Workshop",
        description: "",
      });
      setPosterPreview(null);
      setPosterBase64(null);
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create event");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch {
      alert("Failed to delete event");
    }
  };

  const badgeColor = () => "#193648";

  return (
    <>
    <LiaisonNavbar />
    <div style={styles.page}>
      {/* HERO - premium */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        gap: 16, flexWrap: "wrap",
        margin: "20px 0 18px", padding: "0 4px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "#193648", color: "#fff", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 18px rgba(25,54,72,0.28)",
          }}>
            <PlusCircle size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{
              margin: 0, fontSize: 22, fontWeight: 800, color: "#193648",
              letterSpacing: "-0.02em", fontFamily: "'Sora', 'Inter', sans-serif",
              display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
            }}>
              CollaXion Events Hub
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#3A70B0", background: "#eff6ff", border: "1px solid #cfe0f0",
                padding: "3px 10px", borderRadius: 999,
              }}>Live</span>
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#94a3b8" }}>
              Manage university–industry events: create, preview, and filter by type.
            </p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "10px 18px", borderRadius: 10, border: "none",
          background: "#193648", color: "#fff",
          fontSize: 12.5, fontWeight: 800, cursor: "pointer",
          boxShadow: "0 8px 18px rgba(25,54,72,0.25)",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(25,54,72,0.32)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 18px rgba(25,54,72,0.25)"; }}
        >
          <PlusCircle size={14} /> Create Event
        </button>
      </div>

      {/* COMPACT COUNT PILLS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {[
          { label: "Total Events", value: totalCount,                                color: "#193648", halo: "rgba(25,54,72,0.15)" },
          { label: "Upcoming",     value: upcomingCount,                             color: "#3A70B0", halo: "rgba(58,112,176,0.18)" },
          { label: "Next Event",   value: nextEvent ? nextEvent.date : "-",          color: "#16a34a", halo: "rgba(22,163,74,0.20)" },
        ].map((s, i) => (
          <div key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "7px 12px", borderRadius: 8,
            background: "#fff", border: "1px solid #E2EEF9",
            boxShadow: "0 1px 3px rgba(25,54,72,0.06)",
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: s.color,
              boxShadow: `0 0 0 3px ${s.halo}`,
            }} />
            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{s.label}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* TABS + SEARCH */}
      <div style={styles.controls}>
        <div style={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                ...styles.tabButton,
                ...(activeTab === t.key ? styles.tabActive : {}),
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={styles.search}>
          <Search size={16} color="#4B5563" style={{ marginRight: 8 }} />
          <input
            placeholder="Search by title, location or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* GRID */}
      <main style={styles.gridWrap}>
        {visibleEvents.length === 0 ? (
          <div style={styles.emptyArea}>
            <Image size={56} color="#9AA8B2" />
            <div style={styles.emptyTitle}>No events to show</div>
            <div style={styles.emptySub}>
              Try switching tabs or create a new event to populate this area.
            </div>
            <button style={styles.createBtnAlt} onClick={() => setShowModal(true)}>
              + Create Event
            </button>
          </div>
        ) : (
          <div style={styles.cardGrid}>
            {visibleEvents.map((ev) => {
              const isUpcoming = new Date(ev.date) >= now;
              return (
                <motion.article
                  key={ev._id}
                  style={styles.card}
                  whileHover={{ translateY: -6, boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)" }}
                >
                  <div style={styles.cardMediaWrap}>
                    {ev.poster ? (
                      <img src={ev.poster} alt={ev.title} style={styles.cardPoster} />
                    ) : (
                      <div style={styles.posterPlaceholder}>
                        <Image size={28} color="#9AA8B2" />
                      </div>
                    )}
                    <span style={{ ...styles.typeBadge, background: badgeColor(ev.type) }}>
                      {ev.type}
                    </span>
                    {!isUpcoming && <span style={styles.pastBadge}>PAST</span>}
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{ev.title}</h3>
                    <p style={styles.cardMeta}>
                      <CalendarDays size={14} /> <span>{ev.date}</span>
                      {" • "}
                      <Clock size={14} /> <span>{ev.time || "TBA"}</span>
                    </p>
                    <p style={styles.cardMeta}>
                      <MapPin size={14} /> <span>{ev.location}</span>
                      {" • "}
                      <Users size={14} /> <span>{ev.attendees}</span>
                    </p>
                    <p style={styles.cardDesc}>{ev.description}</p>
                    <div style={styles.cardActions}>
                      <button
                        style={styles.actionBtn}
                        onClick={() => ev.poster && window.open(ev.poster, "_blank")}
                      >
                        View Poster
                      </button>
                      <button
                        style={{ ...styles.actionBtn, ...styles.ghostBtn }}
                        onClick={() => handleDelete(ev._id)}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <motion.div style={styles.modal} initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.modalTitle}>Create Event</div>
                <div style={styles.modalSub}>Fill the details and upload poster</div>
              </div>
              <button style={styles.modalClose} onClick={() => setShowModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <form style={styles.form} onSubmit={createEvent}>
              {/* ── Suggestion datalists ── */}
              <datalist id="ec-title-list">
                <option value="AI & ML Bootcamp 2026" />
                <option value="Industry-Academia Tech Summit" />
                <option value="Cloud Computing Workshop" />
                <option value="Cybersecurity Awareness Week" />
                <option value="Data Science Hackathon" />
                <option value="FYP Industry Showcase" />
                <option value="Software Engineering Career Fair" />
                <option value="Blockchain & Web3 Seminar" />
                <option value="DevOps & CI/CD Masterclass" />
                <option value="UI/UX Design Sprint" />
                <option value="Robotics & IoT Demo Day" />
                <option value="Internship Orientation Webinar" />
                <option value="Industry Mentor Connect" />
                <option value="Annual Advisory Board Meet" />
                <option value="Startup Pitch Competition" />
              </datalist>
              <datalist id="ec-location-list">
                <option value="FoC Auditorium, Riphah International University" />
                <option value="Block C - Seminar Hall, FoC" />
                <option value="Riphah Main Campus, Conference Room" />
                <option value="Online - Microsoft Teams" />
                <option value="Online - Zoom" />
                <option value="Innovation Lab, FoC" />
                <option value="National Incubation Center (NIC), Islamabad" />
                <option value="Industry Partner HQ - TechNova" />
                <option value="Industry Partner HQ - IndusTech" />
                <option value="Riphah Library Hall" />
              </datalist>
              <datalist id="ec-attendees-list">
                <option value="Faculty of Computing - All students" />
                <option value="BSCS · Final Year" />
                <option value="BSSE · Final Year" />
                <option value="BSIT · Final Year" />
                <option value="MS Computing Cohort" />
                <option value="Industry partners + FoC faculty" />
                <option value="Advisory Board members" />
                <option value="Faculty + selected students" />
                <option value="Open to all" />
              </datalist>

              <div style={styles.formRow}>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Event title - start typing for suggestions"
                  style={styles.input}
                  list="ec-title-list"
                  autoComplete="off"
                  required
                />
                <select name="type" value={form.type} onChange={onChange} style={styles.select}>
                  <option>Workshop</option>
                  <option>Seminar</option>
                  <option>Webinar</option>
                  <option>Industry Visit</option>
                  <option>Competition</option>
                  <option>Conference</option>
                </select>
              </div>
              <div style={styles.formRow}>
                <input name="date" value={form.date} onChange={onChange} type="date" style={styles.input} required />
                <input name="time" value={form.time} onChange={onChange} type="time" style={styles.input} />
              </div>
              <div style={styles.formRow}>
                <input
                  name="location"
                  value={form.location}
                  onChange={onChange}
                  placeholder="Location - pick a venue or type"
                  style={styles.input}
                  list="ec-location-list"
                  autoComplete="off"
                />
                <input
                  name="attendees"
                  value={form.attendees}
                  onChange={onChange}
                  placeholder="Attendees - pick or type"
                  style={styles.input}
                  list="ec-attendees-list"
                  autoComplete="off"
                />
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Short description..."
                style={styles.textarea}
              />
              {/* Description quick chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: -2 }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase", color: "#94a3b8", marginRight: 4, alignSelf: "center" }}>
                  Templates:
                </span>
                {[
                  { label: "Hands-on", text: "Hands-on session covering fundamentals to advanced concepts. Open Q&A with industry mentors and certificates of participation for attendees." },
                  { label: "Industry Talk", text: "Talk by an industry leader followed by an interactive panel discussion on emerging trends, career pathways, and university–industry collaboration." },
                  { label: "Hackathon", text: "24-hour innovation challenge - students form teams, solve a real industry problem, and pitch to a panel of judges. Prizes and internship offers up for grabs." },
                  { label: "Networking", text: "Curated networking session connecting students with industry partners, advisory board members, and alumni. Light refreshments served." },
                ].map((t) => (
                  <button
                    type="button"
                    key={t.label}
                    onClick={() => setForm((p) => ({ ...p, description: t.text }))}
                    style={{
                      padding: "5px 11px", borderRadius: 999,
                      background: "#f8fbff", border: "1px solid #E2EEF9", color: "#193648",
                      fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                      transition: "background 0.18s ease, border-color 0.18s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#E2EEF9"; e.currentTarget.style.borderColor = "#3A70B0"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fbff"; e.currentTarget.style.borderColor = "#E2EEF9"; }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div style={styles.formRow}>
                <label style={styles.uploadLabel}>
                  <Image size={16} /> <span style={{ marginLeft: 8 }}>Upload poster</span>
                  <input type="file" accept="image/*" onChange={onPoster} style={{ display: "none" }} />
                </label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {posterPreview ? (
                    <>
                      <img src={posterPreview} alt="preview" style={styles.previewImg} />
                      <button type="button" onClick={clearPoster} style={styles.ghostSmall}>Remove</button>
                    </>
                  ) : (
                    <div style={styles.noPreview}>No poster selected</div>
                  )}
                </div>
              </div>

              {/* ── Suggested posters gallery ── */}
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase", color: "#3A70B0", marginBottom: 8 }}>
                  ✨ Suggested posters · pick one related to your event
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
                  gap: 8,
                }}>
                  {(() => {
                    const t = (form.type || "Workshop");
                    const POOL = {
                      Workshop: [
                        aiWorkshopImg,
                        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1573164713619-24c711fe7878?auto=format&fit=crop&w=800&q=80",
                      ],
                      Seminar: [
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=800&q=80",
                      ],
                      Webinar: [
                        webinarImg,
                        "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?auto=format&fit=crop&w=800&q=80",
                      ],
                      "Industry Visit": [
                        visitImg,
                        "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
                      ],
                      Competition: [
                        hackathonImg,
                        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
                      ],
                      Conference: [
                        summitImg,
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1530099486328-e021101a494a?auto=format&fit=crop&w=800&q=80",
                      ],
                    };
                    const list = POOL[t] || POOL.Workshop;
                    return list.map((src, i) => {
                      const selected = posterPreview === src;
                      return (
                        <button
                          type="button"
                          key={i}
                          onClick={() => { setPosterPreview(src); setPosterBase64(src); }}
                          title="Use this poster"
                          style={{
                            position: "relative",
                            width: "100%", height: 78,
                            borderRadius: 10,
                            border: selected ? "2px solid #193648" : "1px solid #E2EEF9",
                            background: `url(${src}) center/cover no-repeat #f8fbff`,
                            cursor: "pointer", padding: 0,
                            boxShadow: selected ? "0 6px 16px rgba(25,54,72,0.28)" : "0 2px 6px rgba(25,54,72,0.06)",
                            transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                            overflow: "hidden",
                          }}
                          onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 18px rgba(25,54,72,0.18)"; } }}
                          onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 6px rgba(25,54,72,0.06)"; } }}
                        >
                          {selected && (
                            <span style={{
                              position: "absolute", top: 4, right: 4,
                              width: 22, height: 22, borderRadius: "50%",
                              background: "#193648", color: "#fff",
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              fontSize: 12, fontWeight: 800,
                              boxShadow: "0 2px 8px rgba(25,54,72,0.40)",
                            }}>✓</span>
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>
                <div style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 6 }}>
                  Suggestions update based on selected event type. You can also upload a custom poster above.
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.ghostBtn}>
                  Cancel
                </button>
                <button type="submit" style={styles.primaryBtn}>
                  Publish Event
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
    <LiaisonFooter />
    </>
  );
};

export default EventCreation;

/* ===== STYLES (unchanged) ===== */
const styles = {
  page: {
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #E2EEF9 0%, #FFFFFF 100%)",
    minHeight: "100vh",
    padding: "36px 56px",
    color: "#193648",
  },
  hero: { display: "flex", gap: 28, alignItems: "stretch", marginBottom: 28 },
  heroLeft: { flex: 1, padding: 22 },
  heroRight: { width: 320, display: "flex", alignItems: "center", justifyContent: "flex-end" },
  heroTitle: { fontSize: 28, fontWeight: 700, color: "#193648", marginBottom: 8 },
  heroSub: { color: "#4B6B79", marginBottom: 18, maxWidth: 680 },
  statsRow: { display: "flex", gap: 14, marginTop: 12 },
  statCard: {
    background: "#fff",
    border: "1px solid #E2EEF9",
    padding: "14px 16px",
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(25,54,72,0.06)",
    minWidth: 120,
    textAlign: "center",
  },
  statNumber: { fontSize: 18, fontWeight: 700, color: "#193648" },
  statLabel: { fontSize: 12, color: "#6B7C8A", marginTop: 6 },
  heroPanel: {
    background: "#193648",
    color: "#fff",
    padding: 18,
    borderRadius: 14,
    width: 320,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    justifyContent: "space-between",
    boxShadow: "0 12px 30px rgba(25,54,72,0.18)",
  },
  panelTitle: { fontSize: 14, fontWeight: 700 },
  panelSub: { fontSize: 12, opacity: 0.95 },
  createBtn: {
    background: "#fff",
    border: "none",
    color: "#193648",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 8px 20px rgba(25,54,72,0.18)",
  },
  controls: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12 },
  tabs: { display: "flex", gap: 10, flexWrap: "wrap" },
  tabButton: {
    background: "transparent",
    border: "1px solid transparent",
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
    color: "#193648",
    fontWeight: 600,
  },
  tabActive: {
    background: "#193648",
    color: "#fff",
    border: "1px solid #193648",
    boxShadow: "0 8px 18px rgba(25,54,72,0.18)",
  },
  search: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    padding: "8px 12px",
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(25,54,72,0.05)",
    border: "1px solid #E2EEF9",
  },
  searchInput: { border: "none", outline: "none", fontSize: 14, minWidth: 220, color: "#193648" },
  gridWrap: { marginTop: 8 },
  emptyArea: {
    minHeight: 240,
    borderRadius: 14,
    background: "#fff",
    border: "1px solid #E2EEF9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    boxShadow: "0 10px 30px rgba(25,54,72,0.05)",
    padding: 36,
  },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 },
  card: {
    background: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.25s ease",
    boxShadow: "0 8px 28px rgba(25,54,72,0.07)",
    border: "1px solid #E2EEF9",
  },
  cardMediaWrap: { position: "relative", minHeight: 150, overflow: "hidden" },
  cardPoster: { width: "100%", height: 150, objectFit: "cover", display: "block" },
  posterPlaceholder: {
    width: "100%",
    height: 150,
    background: "#E2EEF9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  typeBadge: {
    position: "absolute",
    left: 12,
    top: 12,
    padding: "6px 10px",
    borderRadius: 999,
    color: "#fff",
    fontWeight: 700,
    fontSize: 12,
    boxShadow: "0 6px 18px rgba(25,54,72,0.18)",
  },
  pastBadge: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: "6px 8px",
    borderRadius: 8,
    background: "#E2EEF9",
    color: "#193648",
    fontSize: 12,
    fontWeight: 700,
  },
  cardBody: { padding: 16, display: "flex", flexDirection: "column", gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#193648" },
  cardMeta: { fontSize: 13, color: "#4B6B79", display: "flex", gap: 8, alignItems: "center" },
  cardDesc: { fontSize: 13, color: "#445862", marginTop: 6 },
  cardActions: { marginTop: 10, display: "flex", gap: 8 },
  actionBtn: {
    background: "#193648",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },
  ghostBtn: {
    background: "transparent",
    color: "#193648",
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #E2EEF9",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    width: 760,
    maxWidth: "94%",
    background: "#fff",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 18px 50px rgba(25,54,72,0.26)",
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: 800, color: "#193648" },
  modalSub: { fontSize: 13, color: "#4B6B79" },
  modalClose: { border: "none", background: "transparent", cursor: "pointer" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  formRow: { display: "flex", gap: 12 },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #E2EEF9",
    fontSize: 14,
    outline: "none",
    color: "#193648",
  },
  select: {
    minWidth: 160,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #E2EEF9",
    color: "#193648",
  },
  textarea: {
    minHeight: 86,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #E2EEF9",
    fontSize: 14,
    resize: "vertical",
    color: "#193648",
  },
  uploadLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
    background: "#E2EEF9",
    border: "1px dashed #CFE0F0",
    color: "#193648",
    fontWeight: 700,
  },
  previewImg: { width: 140, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #E2EEF9" },
  noPreview: { color: "#6B7C8A", fontSize: 13 },
  primaryBtn: {
    padding: "10px 16px",
    background: "#193648",
    color: "#fff",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
    boxShadow: "0 4px 14px rgba(25,54,72,0.25)",
  },
  ghostSmall: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #E2EEF9",
    background: "transparent",
    cursor: "pointer",
    color: "#193648",
  },
  createBtnAlt: {
    marginTop: 12,
    background: "#193648",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 4px 14px rgba(25,54,72,0.25)",
  },
};