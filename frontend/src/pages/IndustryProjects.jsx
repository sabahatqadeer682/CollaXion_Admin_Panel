// src/pages/IndustryProjects.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Trash2, Eye, Calendar, Clock, CheckCircle } from "lucide-react";

const IndustryProjects = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "AI-Powered Quality Inspection",
      industry: "TechNova Pvt. Ltd.",
      domain: "AI / Manufacturing",
      type: "Project",
      status: "Ongoing",
      createdAt: "2025-09-15",
      deadline: "2025-12-15",
      description: "Develop an AI system for automatic quality inspection in manufacturing.",
      applicants: [
        { name: "Ali Raza", program: "BSCS", id: "CS-2105", selected: true },
        { name: "Hira Khan", program: "BSE", id: "SE-2120", selected: false },
      ],
    },
    {
      id: 2,
      title: "Web3 Internship Program",
      industry: "NextChain Solutions",
      domain: "Blockchain / DApps",
      type: "Internship",
      status: "Upcoming",
      createdAt: "2025-10-01",
      deadline: "2025-11-15",
      description: "Hands-on internship on blockchain-based DApps and smart contracts.",
      applicants: [
        { name: "Ahmed Farooq", program: "BSIT", id: "IT-2044", selected: false },
        { name: "Ayesha Malik", program: "BSCS", id: "CS-2098", selected: true },
        { name: "Sana Tariq", program: "BSE", id: "SE-2145", selected: false },
      ],
    },
    {
      id: 3,
      title: "Sustainable Energy Workshop",
      industry: "EcoPower Industries",
      domain: "Energy / Sustainability",
      type: "Workshop",
      status: "Completed",
      createdAt: "2025-08-10",
      deadline: "2025-09-10",
      description: "A 2-week industrial training on solar grid management.",
      applicants: [
        { name: "Zain Ali", program: "BSEE", id: "EE-2032", selected: true },
      ],
    },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Ongoing": return "#FFDD57";
      case "Completed": return "#4CAF50";
      case "Upcoming": return "#2196F3";
      default: return "#D4D4D4";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Ongoing": return "🔄";
      case "Completed": return "✅";
      case "Upcoming": return "⏳";
      default: return "";
    }
  };

  const getSelectedCount = (post) => post.applicants.filter(a => a.selected).length;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Industry Projects & Internships</h2>
      <p style={styles.subtext}>
        Track ongoing industry collaborations, monitor student participation, and manage projects efficiently.
      </p>

      <div style={styles.grid}>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            style={styles.card}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
            }}
            transition={{ duration: 0.3 }}
            title={post.description} // Tooltip on hover
          >
            <div style={styles.cardHeader}>
              <div style={styles.iconWrapper}>
                <Briefcase size={28} color="#3A70B0" />
              </div>
              <div>
                <h3 style={styles.cardTitle}>{post.title}</h3>
                <p style={styles.industry}>{post.industry} - <span style={styles.domain}>{post.domain}</span></p>
              </div>
            </div>

            <p style={styles.desc}>{post.description}</p>

            <div style={styles.infoRow}>
              <span
                style={{
                  ...styles.typeBadge,
                  background: getStatusColor(post.status),
                  color: "#193648",
                }}
              >
                {getStatusIcon(post.status)} {post.type} | {post.status}
              </span>
              <span
                style={styles.applicantsLink}
                onClick={() => setSelectedPost(post)}
              >
                <Users size={16} /> {getSelectedCount(post)}/{post.applicants.length} Selected
              </span>
            </div>

            <div style={styles.datesRow}>
              <span><Calendar size={14} /> Created: {post.createdAt}</span>
              <span><Clock size={14} /> Deadline: {post.deadline}</span>
            </div>

            <div style={styles.progressContainer}>
              <div
                style={{
                  ...styles.progressBar,
                  width:
                    post.status === "Completed"
                      ? "100%"
                      : post.status === "Ongoing"
                      ? "60%"
                      : "20%",
                  background:
                    new Date(post.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000
                      ? "#FF6B6B"
                      : getStatusColor(post.status),
                }}
              />
            </div>

            <div style={styles.footerStats}>
              <span>Applicants: {post.applicants.length}</span>
              <span>Selected: {getSelectedCount(post)}</span>
              <span>Duration: {Math.ceil((new Date(post.deadline) - new Date(post.createdAt))/(1000*60*60*24))} days</span>
            </div>

            <div style={styles.actionRow}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                style={{ ...styles.actionBtn, background: "#E7F1FF", color: "#193648" }}
                onClick={() => setSelectedPost(post)}
              >
                <Eye size={15} /> View Details
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                style={{ ...styles.actionBtn, background: "#FFD9D9", color: "#C62828" }}
                onClick={() => handleDelete(post.id)}
              >
                <Trash2 size={15} /> Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ===== Applicant Modal ===== */}
      {selectedPost && (
        <motion.div
          style={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedPost(null)}
        >
          <motion.div
            style={styles.modal}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={styles.modalTitle}>{selectedPost.title}</h3>
            <p style={styles.modalSub}>{selectedPost.industry} - <span style={styles.domain}>{selectedPost.domain}</span></p>
            <p><strong>Type:</strong> {selectedPost.type}</p>
            <p><strong>Status:</strong> {selectedPost.status}</p>
            <p><strong>Created:</strong> {selectedPost.createdAt}</p>
            <p><strong>Deadline:</strong> {selectedPost.deadline}</p>

            <h4 style={styles.modalHeading}>Applicants</h4>
            <div style={styles.applicantsList}>
              {selectedPost.applicants.map((applicant, i) => (
                <div key={i} style={styles.applicantCard}>
                  <p><strong>Name:</strong> {applicant.name}</p>
                  <p><strong>Program:</strong> {applicant.program}</p>
                  <p><strong>ID:</strong> {applicant.id}</p>
                  <p>
                    <CheckCircle size={14} color={applicant.selected ? "#4CAF50" : "#CCC"} />{" "}
                    {applicant.selected ? " Selected" : " Pending"}
                  </p>
                </div>
              ))}
            </div>

            <button style={styles.closeBtn} onClick={() => setSelectedPost(null)}>
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};





const styles = {
  container: {
    padding: "40px 60px",
    background: "linear-gradient(135deg, #E9F2FB 0%, #FFFFFF 100%)",
    minHeight: "100vh",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    color: "#193648",
    fontSize: "1.9rem",
    fontWeight: "700",
    marginBottom: "5px",
  },
  subtext: {
    color: "#3A70B0",
    fontSize: "0.95rem",
    marginBottom: "35px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "25px",
  },
  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "0.3s",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "10px",
  },
  iconWrapper: {
    background: "#EAF3FF",
    borderRadius: "10px",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: "1.15rem",
    fontWeight: "600",
    color: "#193648",
  },
  industry: { color: "#3A70B0", fontSize: "0.9rem" },
  desc: {
    fontSize: "0.9rem",
    marginTop: "10px",
    color: "#555",
    minHeight: "60px",
    lineHeight: "1.4",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
  },
  typeBadge: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "500",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  applicantsLink: {
    color: "#3A70B0",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    transition: "0.2s",
  },
  datesRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    fontSize: "0.8rem",
    color: "#555",
  },
  progressContainer: {
    width: "100%",
    height: "6px",
    background: "#E0E0E0",
    borderRadius: "6px",
    marginTop: "15px",
    marginBottom: "15px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: "6px",
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    borderRadius: "10px",
    padding: "8px 12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "0.2s",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    width: "480px",
    maxHeight: "90vh",
    overflowY: "auto",
    textAlign: "center",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
  },
  modalTitle: { fontSize: "1.35rem", fontWeight: "700", color: "#193648" },
  modalSub: { color: "#3A70B0", fontSize: "0.95rem", marginBottom: "10px" },
  modalHeading: {
    color: "#193648",
    fontSize: "1rem",
    margin: "15px 0 10px 0",
    borderBottom: "1px solid #E0E0E0",
    paddingBottom: "5px",
  },
  applicantsList: { display: "flex", flexDirection: "column", gap: "12px" },
  applicantCard: {
    background: "#F4F8FF",
    borderRadius: "10px",
    padding: "12px",
    textAlign: "left",
    fontSize: "0.9rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "0.2s",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  closeBtn: {
    marginTop: "20px",
    background: "#193648",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "0.2s",
  },
   domain: { fontSize: "0.8rem", color: "#556B7C", fontStyle: "italic" },
  footerStats: { display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "0.8rem", color: "#555" },
};

export default IndustryProjects;
