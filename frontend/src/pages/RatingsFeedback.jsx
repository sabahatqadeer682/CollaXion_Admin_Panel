import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageSquare,
  Users,
  Briefcase,
  ThumbsUp,
  Calendar,
  UserCircle2,
  Building2,
} from "lucide-react";

const RatingsFeedback = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("ratingsFeedback")) || [
      {
        id: 1,
        studentName: "Ali Khan",
        industryName: "TechnoSoft Pvt Ltd",
        date: "2025-10-18",
        studentToIndustry: {
          rating: 4.5,
          feedback: "A great learning atmosphere with skilled mentors.",
        },
        industryToStudent: {
          rating: 4.2,
          feedback: "Ali showed strong initiative and communication skills.",
        },
      },
      {
        id: 2,
        studentName: "Sara Ahmed",
        industryName: "InnovateX Solutions",
        date: "2025-10-10",
        studentToIndustry: {
          rating: 5.0,
          feedback: "Excellent mentorship and exposure to real projects!",
        },
        industryToStudent: {
          rating: 4.8,
          feedback: "Sara was proactive and technically sharp throughout.",
        },
      },
      {
        id: 3,
        studentName: "Hassan Raza",
        industryName: "BrightTech Innovations",
        date: "2025-09-22",
        studentToIndustry: {
          rating: 4.3,
          feedback: "Very organized and motivating team at BrightTech.",
        },
        industryToStudent: {
          rating: 4.1,
          feedback: "Good problem-solving and teamwork shown by Hassan.",
        },
      },
    ];

    setFeedbackData(storedData);
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={20} color="#FFD700" fill="#FFD700" />);
    }
    if (halfStar)
      stars.push(<Star key="half" size={20} color="#FFD700" fill="#FFD70080" />);
    while (stars.length < 5)
      stars.push(<Star key={stars.length} size={20} color="#ccc" />);
    return stars;
  };

  const avgStudentRating =
    feedbackData.reduce((sum, f) => sum + f.studentToIndustry.rating, 0) /
    feedbackData.length;
  const avgIndustryRating =
    feedbackData.reduce((sum, f) => sum + f.industryToStudent.rating, 0) /
    feedbackData.length;

  const currentAvg =
    activeTab === "students" ? avgStudentRating : avgIndustryRating;

  return (
    <div style={styles.page}>
      <div style={styles.glowCircle1}></div>
      <div style={styles.glowCircle2}></div>

      <motion.h1
        style={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        ⭐ Ratings & Feedback
      </motion.h1>
      <p style={styles.subtitle}>
        Transparent performance reflections between <b>Students</b> and{" "}
        <b>Industries</b>
      </p>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <motion.div
          style={{
            ...styles.tab,
            background: activeTab === "students" ? "#193648" : "rgba(255,255,255,0.8)",
            color: activeTab === "students" ? "#fff" : "#193648",
            boxShadow:
              activeTab === "students" ? "0 0 15px rgba(25,54,72,0.4)" : "none",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setActiveTab("students")}
        >
          <Users size={18} style={{ marginRight: 8 }} />
          Ratings by Students
        </motion.div>

        <motion.div
          style={{
            ...styles.tab,
            background: activeTab === "industry" ? "#193648" : "rgba(255,255,255,0.8)",
            color: activeTab === "industry" ? "#fff" : "#193648",
            boxShadow:
              activeTab === "industry" ? "0 0 15px rgba(25,54,72,0.4)" : "none",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setActiveTab("industry")}
        >
          <Briefcase size={18} style={{ marginRight: 8 }} />
          Ratings by Industry
        </motion.div>
      </div>

      {/* Summary */}
      <motion.div
        style={styles.summaryBox}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 style={styles.avgLabel}>
          {activeTab === "students"
            ? "Average Industry Rating"
            : "Average Student Rating"}
        </h2>
        <div style={styles.avgStars}>{renderStars(currentAvg)}</div>
        <h1 style={styles.avgScore}>{currentAvg.toFixed(1)} / 5.0</h1>

        <div style={styles.ratingBars}>
          {[5, 4, 3, 2, 1].map((star, i) => (
            <div key={i} style={styles.barRow}>
              <span style={styles.starLabel}>{star}★</span>
              <div style={styles.progressBarOuter}>
                <motion.div
                  style={styles.progressBarInner}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.random() * 80 + 10}%`,
                  }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                ></motion.div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          style={styles.grid}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5 }}
        >
          {feedbackData.map((item) => {
            const feedback =
              activeTab === "students"
                ? item.studentToIndustry
                : item.industryToStudent;
            const ratedBy =
              activeTab === "students"
                ? item.studentName
                : item.industryName;
            const ratedEntity =
              activeTab === "students"
                ? item.industryName
                : item.studentName;
            const Icon =
              activeTab === "students" ? Building2 : UserCircle2;

            return (
              <motion.div
                key={item.id}
                style={styles.card}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 12px 35px rgba(25,54,72,0.25)",
                }}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.profile}>
                    <Icon size={36} color="#193648" />
                    <div>
                      <h3 style={styles.entityTitle}>{ratedEntity}</h3>
                      <p style={styles.byLine}>
                        Rated by <strong>{ratedBy}</strong>
                      </p>
                    </div>
                  </div>
                  <div style={styles.dateRow}>
                    <Calendar size={14} color="#3A70B0" />
                    <span style={styles.dateText}>{item.date}</span>
                  </div>
                </div>

                <div style={styles.starsRow}>{renderStars(feedback.rating)}</div>
                <p style={styles.ratingNumber}>{feedback.rating.toFixed(1)} / 5.0</p>

                <div style={styles.commentBox}>
                  <MessageSquare size={16} color="#193648" />
                  <span style={styles.commentText}>{feedback.feedback}</span>
                </div>

                <div style={styles.footerRow}>
                  <span style={styles.tag}>
                    {feedback.rating >= 4.5
                      ? "Excellent"
                      : feedback.rating >= 4
                      ? "Good"
                      : "Average"}
                  </span>
                  <motion.div whileTap={{ scale: 0.9 }} style={styles.likeButton}>
                    <ThumbsUp size={16} color="#3A70B0" />
                    <span style={{ fontSize: "0.85rem", color: "#3A70B0" }}>
                      Helpful
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    padding: "50px",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #E2EEF9 0%, #FFFFFF 100%)",
    overflow: "hidden",
  },
  glowCircle1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(58,112,176,0.25), transparent 70%)",
    borderRadius: "50%",
    top: "-80px",
    left: "-100px",
    zIndex: 0,
  },
  glowCircle2: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(25,54,72,0.15), transparent 70%)",
    borderRadius: "50%",
    bottom: "-100px",
    right: "-120px",
    zIndex: 0,
  },
  title: {
    color: "#193648",
    fontSize: "2.2rem",
    fontWeight: "700",
    position: "relative",
    zIndex: 2,
  },
  subtitle: {
    color: "#3A70B0",
    marginBottom: "25px",
    fontSize: "1rem",
    position: "relative",
    zIndex: 2,
  },

  tabsContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
    position: "relative",
    zIndex: 2,
    justifyContent: "center",
  },

  tab: {
    flex: "0 1 220px",
    textAlign: "center",
    padding: "10px 0", // reduced height
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.95rem", // slightly smaller font
    cursor: "pointer",
    border: "2px solid #193648",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    letterSpacing: "0.3px",
  },

  summaryBox: {
    background: "rgba(255,255,255,0.9)",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
    marginBottom: "40px",
    backdropFilter: "blur(10px)",
  },
  avgLabel: {
    color: "#193648",
    fontWeight: "600",
    marginBottom: "10px",
  },
  avgStars: {
    display: "flex",
    justifyContent: "center",
    gap: "5px",
  },
  avgScore: {
    fontSize: "1.6rem",
    color: "#3A70B0",
    fontWeight: "700",
    marginTop: "10px",
  },
  ratingBars: {
    marginTop: "20px",
  },
  barRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "6px",
  },
  starLabel: {
    width: "25px",
    fontSize: "0.85rem",
    color: "#193648",
  },
  progressBarOuter: {
    width: "100%",
    height: "8px",
    background: "#E2EEF9",
    borderRadius: "6px",
  },
  progressBarInner: {
    height: "8px",
    background: "#3A70B0",
    borderRadius: "6px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "25px",
  },
  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    position: "relative",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  entityTitle: {
    color: "#193648",
    fontWeight: "600",
    fontSize: "1rem",
  },
  byLine: {
    color: "#3A70B0",
    fontSize: "0.85rem",
  },
  dateRow: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  dateText: {
    fontSize: "0.8rem",
    color: "#3A70B0",
  },
  starsRow: {
    display: "flex",
    gap: "4px",
    marginBottom: "5px",
  },
  ratingNumber: {
    color: "#193648",
    fontWeight: "600",
    marginBottom: "10px",
  },
  commentBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    background: "#E2EEF9",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "12px",
  },
  commentText: {
    color: "#193648",
    fontSize: "0.9rem",
  },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    background: "#193648",
    color: "#fff",
    borderRadius: "8px",
    padding: "4px 10px",
    fontSize: "0.8rem",
  },
  likeButton: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
  },
};

export default RatingsFeedback;
