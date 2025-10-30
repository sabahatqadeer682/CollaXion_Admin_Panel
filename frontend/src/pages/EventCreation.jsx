// src/pages/EventDashboard.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
  Tag,
} from "lucide-react";

/**
 * CollaXion Event Dashboard
 * - Inline CSS only
 * - Mock events + add-new-event modal
 * - Tabs (All, Upcoming, Workshops, Seminars, Webinars, Industry Visits, Competitions)
 */

const now = new Date("2025-10-30"); // consistent with developer timezone/date note

// Helper: small SVG placeholder as data URL
const svgPlaceholder = (title = "Event", bg = "#E8F1F8", fg = "#0D3B66") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='100%' height='100%' fill='${bg}' rx='12'/><text x='50%' y='50%' font-size='28' font-family='Poppins, sans-serif' fill='${fg}' text-anchor='middle' dominant-baseline='middle'>${title}</text></svg>`
  )}`;

// Some mock events (mix of upcoming and past)
const initialMock = [
      {
    id: 1,
    title: "Inter-College Hackathon",
    date: "2025-12-18",
    time: "09:00",
    location: "Innovation Hub",
    attendees: "Students, Mentors",
    type: "Competition",
    description: "48-hour hack: solve industry-suggested problems.",
    poster: hackathonImg,
  },
  
  {
    id: 2,
    title: "AI in Manufacturing Workshop",
    date: "2025-12-05",
    time: "14:00",
    location: "Lab 3",
    attendees: "Students, Industry Engineers",
    type: "Workshop",
    description:
      "Hands-on workshop on applying AI models to manufacturing datasets.",
    poster: aiWorkshopImg,
  },
  {
    id: 3,
    title: "Past: Industrial Visit - TechCorp",
    date: "2025-09-15",
    time: "09:30",
    location: "TechCorp HQ",
    attendees: "Selected Students",
    type: "Industry Visit",
    description: "Plant tour & Q&A with engineering leads (past event).",
    poster: visitImg,
  },
  {
    id: 4,
    title: "Webinar: Data Privacy Regulations",
    date: "2025-11-20",
    time: "17:00",
    location: "Online",
    attendees: "Open to public",
    type: "Webinar",
    description:
      "Expert panel on data privacy and compliance for student projects.",
    poster: webinarImg,
  },
  {
  id: 5,
    title: "Industry-Academia Innovation Summit",
    date: "2025-11-10",
    time: "10:00",
    location: "Main Auditorium",
    attendees: "Faculty, Industry Leads",
    type: "Conference",
    description:
      "A full-day summit to showcase joint research and internship pipelines.",
    poster: summitImg,
  },

];

// Allowed category tabs (we'll treat some types as categories)
const TABS = [
  { key: "all", label: "All Events" },
  { key: "upcoming", label: "Upcoming" },
  { key: "Workshop", label: "Workshops" },
  { key: "Seminar", label: "Seminars" },
  { key: "Webinar", label: "Webinars" },
  { key: "Industry Visit", label: "Industry Visits" },
  { key: "Competition", label: "Competitions" },
];

const EventDashboard = () => {
  const [events, setEvents] = useState(initialMock);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [posterPreview, setPosterPreview] = useState(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    attendees: "",
    type: "Workshop",
    description: "",
  });

  // Derived stats
  const totalCount = events.length;
  const upcomingCount = events.filter((e) => new Date(e.date) >= now).length;
  const nextEvent = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  // Filtering logic
  const visibleEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = events;

    if (activeTab === "upcoming") {
      list = list.filter((e) => new Date(e.date) >= now);
    } else if (activeTab !== "all") {
      // map tab keys to our types; convert tab key if necessary
      // Tab keys like "Workshop" etc.
      const tabTypeMap = {
        Workshop: "Workshop",
        Seminar: "Seminar",
        Webinar: "Webinar",
        "Industry Visit": "Industry Visit",
        Competition: "Competition",
      };
      const t = tabTypeMap[activeTab];
      if (t) list = list.filter((e) => e.type?.toLowerCase() === t.toLowerCase());
    }

    if (q) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.location || "").toLowerCase().includes(q) ||
          (e.type || "").toLowerCase().includes(q)
      );
    }

    // upcoming first, then nearest date
    list = list.sort((a, b) => new Date(a.date) - new Date(b.date));

    return list;
  }, [events, activeTab, search]);

  // Handlers
  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onPoster = (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    setPosterPreview(URL.createObjectURL(file));
  };

  const createEvent = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return alert("Please provide title and date.");
    const newEvent = {
      id: Date.now(),
      ...form,
      poster: posterPreview || null,
    };
    setEvents((prev) => [newEvent, ...prev]);
    // reset
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
    setShowModal(false);
  };

  const clearPoster = () => setPosterPreview(null);

  const badgeColor = (type) => {
    switch ((type || "").toLowerCase()) {
      case "workshop":
        return "#115E59"; // teal
      case "seminar":
        return "#2C5AA0"; // indigo
      case "webinar":
        return "#0D3B66"; // deep blue
      case "industry visit":
        return "#7A4B00"; // amber
      case "competition":
        return "#7A1F5A"; // magenta
      case "conference":
        return "#0B5F73"; // different blue
      default:
        return "#193648";
    }
  };

  return (
    <div style={styles.page}>
      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <h1 style={styles.heroTitle}>CollaXion Events Hub</h1>
          <p style={styles.heroSub}>
            Manage university–industry events: create, preview, and filter by type — all in one elegant view.
          </p>

          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{totalCount}</div>
              <div style={styles.statLabel}>Total events</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statNumber}>{upcomingCount}</div>
              <div style={styles.statLabel}>Upcoming</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statNumber}>
                {nextEvent ? `${nextEvent.date}` : "—"}
              </div>
              <div style={styles.statLabel}>Next event</div>
            </div>
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.heroPanel}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <PlusCircle size={22} color="#fff" />
              <div>
                <div style={styles.panelTitle}>Create an event</div>
                <div style={styles.panelSub}>Add poster, details & publish</div>
              </div>
            </div>
            <button style={styles.createBtn} onClick={() => setShowModal(true)}>
              Create Event
            </button>
          </div>
        </div>
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
                  key={ev.id}
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
                      {"  •  "}
                      <Clock size={14} /> <span>{ev.time || "TBA"}</span>
                    </p>
                    <p style={styles.cardMeta}>
                      <MapPin size={14} /> <span>{ev.location}</span>
                      {"  •  "}
                      <Users size={14} /> <span>{ev.attendees}</span>
                    </p>
                    <p style={styles.cardDesc}>{ev.description}</p>
                    <div style={styles.cardActions}>
                      <button
                        style={styles.actionBtn}
                        onClick={() => {
                          // quick preview: open the poster in new tab if present
                          if (ev.poster) window.open(ev.poster, "_blank");
                        }}
                      >
                        View Poster
                      </button>
                      <button
                        style={{ ...styles.actionBtn, ...styles.ghostBtn }}
                        onClick={() =>
                          setEvents((prev) => prev.filter((x) => x.id !== ev.id))
                        }
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

      {/* Create Modal */}
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
              <div style={styles.formRow}>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Event title"
                  style={styles.input}
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
                <input name="location" value={form.location} onChange={onChange} placeholder="Location" style={styles.input} />
                <input name="attendees" value={form.attendees} onChange={onChange} placeholder="Attendees" style={styles.input} />
              </div>

              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Short description..."
                style={styles.textarea}
              />

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
  );
};

export default EventDashboard;

/* ===== inline styles (CollaXion theme) ===== */
const styles = {
  page: {
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(180deg, #EAF4FB 0%, #FFFFFF 100%)",
    minHeight: "100vh",
    padding: "36px 56px",
    color: "#0B2B3A",
  },
  hero: {
    display: "flex",
    gap: 28,
    alignItems: "stretch",
    marginBottom: 28,
  },
  heroLeft: {
    flex: 1,
    padding: 22,
  },
  heroRight: {
    width: 320,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#0D3B66",
    marginBottom: 8,
  },
  heroSub: {
    color: "#3A6B89",
    marginBottom: 18,
    maxWidth: 680,
  },
  statsRow: {
    display: "flex",
    gap: 14,
    marginTop: 12,
  },
  statCard: {
    background: "linear-gradient(180deg,#FFFFFF,#F3FAFF)",
    padding: "14px 16px",
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(11,59,102,0.06)",
    minWidth: 120,
    textAlign: "center",
  },
  statNumber: { fontSize: 18, fontWeight: 700, color: "#113A56" },
  statLabel: { fontSize: 12, color: "#6B7C8A", marginTop: 6 },

  heroPanel: {
    background: "linear-gradient(180deg,#0D3B66, #174C6E)",
    color: "#fff",
    padding: 18,
    borderRadius: 14,
    width: 320,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    justifyContent: "space-between",
    boxShadow: "0 12px 30px rgba(13,59,102,0.14)",
  },
  panelTitle: { fontSize: 14, fontWeight: 700 },
  panelSub: { fontSize: 12, opacity: 0.95 },

  createBtn: {
    background: "#00A3A3",
    border: "none",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 8px 20px rgba(0,163,163,0.18)",
  },

  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  tabs: { display: "flex", gap: 10, flexWrap: "wrap" },
  tabButton: {
    background: "transparent",
    border: "1px solid transparent",
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
    color: "#113A56",
    fontWeight: 600,
  },
  tabActive: {
    background: "#193648",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 8px 18px rgba(25,54,72,0.12)",
  },
  search: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    padding: "8px 12px",
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(11,59,102,0.03)",
    border: "1px solid #E6F0F8",
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: 14,
    minWidth: 220,
  },

  gridWrap: {
    marginTop: 8,
  },
  emptyArea: {
    minHeight: 240,
    borderRadius: 14,
    background: "linear-gradient(180deg,#FFFFFF,#F6FBFF)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    boxShadow: "0 10px 30px rgba(10,40,60,0.04)",
    padding: 36,
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.25s ease",
    boxShadow: "0 8px 28px rgba(11,59,102,0.06)",
  },
  cardMediaWrap: {
    position: "relative",
    minHeight: 150,
    overflow: "hidden",
  },
  cardPoster: {
    width: "100%",
    height: 150,
    objectFit: "cover",
    display: "block",
  },
  posterPlaceholder: {
    width: "100%",
    height: 150,
    background: "#F1F6FA",
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
    boxShadow: "0 6px 18px rgba(11,59,102,0.12)",
  },
  pastBadge: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: "6px 8px",
    borderRadius: 8,
    background: "#E6EEF2",
    color: "#334155",
    fontSize: 12,
    fontWeight: 700,
  },

  cardBody: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#10324A" },
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
    color: "#334155",
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #E6F0F8",
    cursor: "pointer",
  },

  /* modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(6, 18, 28, 0.5)",
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
    boxShadow: "0 18px 50px rgba(11,59,102,0.26)",
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: 800, color: "#0D3B66" },
  modalSub: { fontSize: 13, color: "#4B6B79" },
  modalClose: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },

  form: { display: "flex", flexDirection: "column", gap: 12 },
  formRow: { display: "flex", gap: 12 },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #E6F0F8",
    fontSize: 14,
    outline: "none",
  },
  select: { minWidth: 160, padding: "10px 12px", borderRadius: 10, border: "1px solid #E6F0F8" },
  textarea: {
    minHeight: 86,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #E6F0F8",
    fontSize: 14,
    resize: "vertical",
  },
  uploadLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
    background: "#F5FBFB",
    border: "1px dashed #D4E9E9",
    color: "#0B5F6A",
    fontWeight: 700,
  },
  previewImg: { width: 140, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #E6F0F8" },
  noPreview: { color: "#6B7C8A", fontSize: 13 },

  primaryBtn: {
    padding: "10px 16px",
    background: "#0D3B66",
    color: "#fff",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 800,
  },
  ghostSmall: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #E6F0F8",
    background: "transparent",
    cursor: "pointer",
  },

  createBtnAlt: {
    marginTop: 12,
    background: "#00A3A3",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },
};
