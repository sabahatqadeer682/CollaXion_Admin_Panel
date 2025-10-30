import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, FileText, UploadCloud, CheckCircle2, Clock, Send, Mail } from "lucide-react";
import collaxionLogo from "../images/collaxionlogo.jpeg";

const AdvisoryMeeting = () => {
  const [meetings, setMeetings] = useState([]);
  const [activeTab, setActiveTab] = useState("create");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedReps, setSelectedReps] = useState([]);

  const [newMeeting, setNewMeeting] = useState({
    agenda: "",
    date: "",
    time: "",
    venue: "",
  });

  const boardMembers = [
    { name: "Dean", role: "Chairperson" },
    { name: "HOD", role: "Head of Department" },
    { name: "Industry Liaison Officer", role: "Coordinator" },
    { name: "ABC Tech Representative", role: "Industry Partner" },
    { name: "Student Representative", role: "Board Member" },
  ];

  const industryReps = [
    { name: "Ali Khan – ABC Tech", suggested: true },
    { name: "Sara Ahmed – Innovate Labs", suggested: false },
    { name: "Bilal Rehman – FutureVision Ltd", suggested: true },
    { name: "Ayesha Noor – TechSphere", suggested: false },
    { name: "Omar Siddiqui – DataNest", suggested: false },
  ];

  const handleAddMeeting = () => {
    if (!newMeeting.agenda || !newMeeting.date || !newMeeting.time || !newMeeting.venue) {
      alert("Please fill all meeting details!");
      return;
    }

    const newData = {
      ...newMeeting,
      id: Date.now(),
      status: "Scheduled",
      boardMembers,
    };

    setMeetings([...meetings, newData]);
    setNewMeeting({ agenda: "", date: "", time: "", venue: "" });
    setShowInviteModal(true);
  };

  const handleRepSelect = (rep) => {
    if (selectedReps.includes(rep.name)) {
      setSelectedReps(selectedReps.filter((r) => r !== rep.name));
    } else {
      setSelectedReps([...selectedReps, rep.name]);
    }
  };

  const sendInvitations = () => {
    if (selectedReps.length === 0) {
      alert("Please select at least one representative to send an invitation.");
      return;
    }
    alert(`✅ Invitations successfully sent to: ${selectedReps.join(", ")}`);
    setSelectedReps([]);
    setShowInviteModal(false);
  };

  const handleFileUpload = (e, id) => {
    const file = e.target.files[0];
    setMeetings(
      meetings.map((m) =>
        m.id === id ? { ...m, momFile: file, status: "Completed" } : m
      )
    );
  };

  return (
    <div className="page-container">
      {/* ===== Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="advisory-header"
      >
        <div className="flex items-center gap-3">
          <img src={collaxionLogo} alt="CollaXion" className="advisory-logo" />
          <div className="advisory-title">
            <h1>Advisory Board Meeting Management</h1>
            <p>Organize, schedule, and track official advisory meetings efficiently.</p>
          </div>
        </div>
      </motion.div>

      {/* ===== Tabs ===== */}
      <div className="tab-buttons">
        <button
          className={activeTab === "create" ? "active" : ""}
          onClick={() => setActiveTab("create")}
        >
          📅 Schedule New Meeting
        </button>
        <button
          className={activeTab === "records" ? "active" : ""}
          onClick={() => setActiveTab("records")}
        >
          📘 View Meeting Records
        </button>
      </div>

      {/* ===== Create Meeting ===== */}
      {activeTab === "create" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="meeting-card fade-in"
        >
          <h2 className="section-title flex items-center gap-2">
            <CalendarDays /> Enter Meeting Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="meeting-label">Agenda</label>
              <input
                type="text"
                placeholder="e.g., University-Industry Collaboration"
                value={newMeeting.agenda}
                onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
              />
            </div>

            <div>
              <label className="meeting-label">Date</label>
              <input
                type="date"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
              />
            </div>

            <div>
              <label className="meeting-label">Time</label>
              <input
                type="time"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
              />
            </div>

            <div>
              <label className="meeting-label">Venue / Meeting Link</label>
              <input
                type="text"
                placeholder="e.g., Conference Room A / Zoom Link"
                value={newMeeting.venue}
                onChange={(e) => setNewMeeting({ ...newMeeting, venue: e.target.value })}
              />
            </div>
          </div>

          {/* ===== Board Members Section ===== */}
          <div className="mt-8">
            <h3 className="section-title flex items-center gap-1">
              <Users size={18} /> Board Members Present in Meeting
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
              {boardMembers.map((member, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="member-card"
                >
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddMeeting}
              className="schedule-btn"
            >
              <Send size={18} /> Schedule Meeting
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ===== Glass Invitation Modal (Enhanced) ===== */}
      {showInviteModal && (
        <div className="modal-overlay">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-modal-box"
          >
            <h2 className="section-title flex items-center gap-2 mb-4">
              <Mail /> Send Invitations to Industry Representatives
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {industryReps.map((rep, i) => (
                <div
                  key={i}
                  className={`rep-card ${selectedReps.includes(rep.name) ? "selected" : ""}`}
                  onClick={() => handleRepSelect(rep)}
                >
                  <div className="rep-content">
                    <h4>{rep.name}</h4>
                    {rep.suggested && (
                      <div className="suggested-badge" title="System Suggested">⭐</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="cancel-btn" onClick={() => setShowInviteModal(false)}>
                Cancel
              </button>
              <button className="send-btn" onClick={sendInvitations}>
                Send Invitation
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ===== Records ===== */}
      {activeTab === "records" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="table-container fade-in"
        >
          <h2 className="section-title flex items-center gap-2 mb-4">
            <FileText /> Scheduled Meetings
          </h2>

          {meetings.length === 0 ? (
            <p className="text-gray-600 text-center py-6">
              No meetings scheduled yet.
            </p>
          ) : (
            <table className="records-table">
              <thead>
                <tr>
                  <th>Agenda</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Upload MoM</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((m) => (
                  <tr key={m.id}>
                    <td>{m.agenda}</td>
                    <td>{m.date}</td>
                    <td>{m.time}</td>
                    <td>{m.venue}</td>
                    <td>
                      {m.status === "Scheduled" ? (
                        <span style={{ color: "#d4a017", fontWeight: "600" }}>
                          <Clock size={15} /> Scheduled
                        </span>
                      ) : (
                        <span style={{ color: "green", fontWeight: "600" }}>
                          <CheckCircle2 size={15} /> Completed
                        </span>
                      )}
                    </td>
                    <td>
                      <label className="upload-label">
                        <UploadCloud size={16} />
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, m.id)}
                          style={{ display: "none" }}
                        />
                        Upload
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      )}

      {/* ===== Inline CSS (Original + Glass Modal Enhancements) ===== */}
      <style>{`
        body { font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #e2eef9 0%, #ffffff 100%); }
        .page-container { padding: 40px 20px; min-height: 100vh; }
        .advisory-header { display: flex; align-items: center; justify-content: space-between; background: #fff; padding: 25px 40px; border-radius: 18px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); margin-bottom: 40px; }
        .advisory-logo { width: 55px; height: 55px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .advisory-title h1 { font-size: 1.9rem; font-weight: 700; color: #193648; }
        .advisory-title p { color: #3a70b0; font-size: 0.9rem; margin-top: 5px; }
        .tab-buttons { display: flex; justify-content: center; gap: 20px; margin-bottom: 40px; }
        .tab-buttons button { padding: 10px 25px; border-radius: 12px; background: #e4e9f1; color: #193648; font-weight: 500; cursor: pointer; border: none; transition: all 0.3s ease; }
        .tab-buttons button.active { background: #193648; color: white; transform: scale(1.05); }
        .meeting-card { background: white; border-radius: 20px; padding: 40px; max-width: 900px; margin: auto; box-shadow: 0 10px 35px rgba(0,0,0,0.1); border: 1px solid #edf1f7; }
        input[type='text'], input[type='date'], input[type='time'] { width: 100%; padding: 10px 15px; margin-top: 5px; border: 1.5px solid #d3d9e1; border-radius: 10px; outline: none; transition: all 0.3s ease; }
        input:focus { border-color: #193648; box-shadow: 0 0 0 3px rgba(25,54,72,0.2); }
        .meeting-label { font-size: 0.9rem; color: #193648; font-weight: 500; }
        .section-title { font-weight: 600; font-size: 1.1rem; color: #193648; margin-top: 20px; }
        .member-card { background: #f8fafc; border-radius: 12px; padding: 15px; border: 1px solid #e2e8f0; box-shadow: 0 3px 8px rgba(0,0,0,0.05); text-align: center; }
        .member-card h4 { font-weight: 600; color: #193648; }
        .member-card p { color: #3a70b0; font-size: 0.85rem; margin-top: 4px; }
        .schedule-btn { background: #193648; color: white; padding: 12px 35px; border-radius: 12px; font-weight: 500; display: flex; align-items: center; gap: 8px; border: none; cursor: pointer; transition: all 0.3s ease; margin-top: 25px; }
        .schedule-btn:hover { background: #204d76; transform: scale(1.05); }
        .table-container { max-width: 1100px; margin: auto; background: white; padding: 30px; border-radius: 18px; box-shadow: 0 10px 35px rgba(0,0,0,0.1); border: 1px solid #edf1f7; }
        table { width: 100%; border-collapse: collapse; text-align: center; }
        th { background: #193648; color: white; padding: 12px; font-size: 0.9rem; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        tr:hover { background: #f1f6fb; }
        .upload-label { color: #193648; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .upload-label:hover { text-decoration: underline; }

        /* ===== Glass Modal Enhancements ===== */
        .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:999; }
        .glass-modal-box { background: rgba(255,255,255,0.25); backdrop-filter: blur(16px); border-radius: 20px; padding: 35px; width: 650px; max-width: 95%; box-shadow: 0 15px 40px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.35); transition: all 0.3s ease; }
        .rep-card { position: relative; background: rgba(255,255,255,0.2); border-radius: 16px; padding: 18px; cursor: pointer; transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.35); }
        .rep-card:hover { transform: translateY(-4px) scale(1.03); box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
        .rep-card.selected { border-color: #193648; background: rgba(234,242,250,0.5); }
        .rep-content { display: flex; align-items: center; justify-content: space-between; }
        .suggested-badge { background: linear-gradient(135deg, #ffcd3c, #ff9c3c); color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        .cancel-btn, .send-btn { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; }
        .cancel-btn { background: #e4e9f1; color: #193648; }
        .send-btn { background: #193648; color: white; }
        .send-btn:hover { background: #204d76; }

        .records-table tr:hover { background: rgba(25,54,72,0.05); transition: background 0.3s ease; }
      `}</style>
    </div>
  );
};

export default AdvisoryMeeting;
