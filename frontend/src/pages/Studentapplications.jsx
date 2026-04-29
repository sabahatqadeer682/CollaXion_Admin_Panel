// // src/pages/StudentApplications.jsx
// // Industry Liaison Side - Review & Forward/Reject Student Applications
// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Users, CheckCircle, XCircle, Clock, Eye, Send,
//   Filter, Search, ChevronRight, Building2, GraduationCap,
//   AlertCircle, FileText, Calendar, Tag, BarChart2,
//   ArrowRight, Info, Inbox
// } from "lucide-react";

// // ─── Mock Data ─────────────────────────────────────────────────────────────────
// const INITIAL_APPLICATIONS = [
//   {
//     id: "APP-001",
//     student: { name: "Ayesha Malik", program: "BSCS", id: "CS-2098", semester: "6th", cgpa: "3.7", email: "ayesha.malik@uni.edu.pk" },
//     post: { title: "Web3 Internship Program", type: "Internship", industry: "NextChain Solutions", domain: "Blockchain / DApps" },
//     appliedOn: "2025-10-05",
//     inchargeNote: "Strong blockchain background. Completed FYP on DApp. Highly recommended.",
//     inchargeApprovedOn: "2025-10-08",
//     liaisonStatus: "Pending", // Pending | Forwarded | Rejected
//     liaisonNote: "",
//     cv: "ayesha_cv.pdf",
//     coverLetter: "Motivated to contribute in a hands-on blockchain environment...",
//   },
//   {
//     id: "APP-002",
//     student: { name: "Hassan Javed", program: "BSIT", id: "IT-2056", semester: "7th", cgpa: "3.4", email: "hassan.javed@uni.edu.pk" },
//     post: { title: "Mobile UX Research Study", type: "Research", industry: "PixelCraft Studios", domain: "UI/UX / Mobile" },
//     appliedOn: "2025-10-10",
//     inchargeNote: "Good research orientation. Prior UI/UX project experience.",
//     inchargeApprovedOn: "2025-10-12",
//     liaisonStatus: "Forwarded",
//     liaisonNote: "Profile aligns well with the studio's focus on mobile accessibility.",
//     cv: "hassan_cv.pdf",
//     coverLetter: "Passionate about user-centred design and mobile experiences...",
//   },
//   {
//     id: "APP-003",
//     student: { name: "Ahmed Farooq", program: "BSIT", id: "IT-2044", semester: "5th", cgpa: "3.1", email: "ahmed.farooq@uni.edu.pk" },
//     post: { title: "Web3 Internship Program", type: "Internship", industry: "NextChain Solutions", domain: "Blockchain / DApps" },
//     appliedOn: "2025-10-06",
//     inchargeNote: "Average profile but shows initiative. Recommended with reservation.",
//     inchargeApprovedOn: "2025-10-09",
//     liaisonStatus: "Rejected",
//     liaisonNote: "Insufficient blockchain-specific knowledge compared to other applicants.",
//     cv: "ahmed_cv.pdf",
//     coverLetter: "Eager to learn Web3 technologies during this internship...",
//   },
//   {
//     id: "APP-004",
//     student: { name: "Fatima Zahra", program: "BSCS", id: "CS-2088", semester: "6th", cgpa: "3.85", email: "fatima.zahra@uni.edu.pk" },
//     post: { title: "Mobile UX Research Study", type: "Research", industry: "PixelCraft Studios", domain: "UI/UX / Mobile" },
//     appliedOn: "2025-10-11",
//     inchargeNote: "Outstanding academic record. Published a paper on mobile usability.",
//     inchargeApprovedOn: "2025-10-13",
//     liaisonStatus: "Pending",
//     liaisonNote: "",
//     cv: "fatima_cv.pdf",
//     coverLetter: "My research on mobile interaction patterns makes me a strong fit...",
//   },
//   {
//     id: "APP-005",
//     student: { name: "Bilal Ahmed", program: "BSCS", id: "CS-2167", semester: "7th", cgpa: "3.55", email: "bilal.ahmed@uni.edu.pk" },
//     post: { title: "Web3 Internship Program", type: "Internship", industry: "NextChain Solutions", domain: "Blockchain / DApps" },
//     appliedOn: "2025-10-07",
//     inchargeNote: "Completed two relevant courses. Good communication skills.",
//     inchargeApprovedOn: "2025-10-10",
//     liaisonStatus: "Pending",
//     liaisonNote: "",
//     cv: "bilal_cv.pdf",
//     coverLetter: "I am excited about the opportunity to work on live blockchain projects...",
//   },
// ];

// // ─── Helpers ───────────────────────────────────────────────────────────────────
// const statusConfig = {
//   Pending:   { bg: "#FEF3C7", color: "#92400E", icon: <Clock size={13} />,        label: "Pending Review" },
//   Forwarded: { bg: "#DBEAFE", color: "#1E40AF", icon: <Send size={13} />,         label: "Forwarded to Industry" },
//   Rejected:  { bg: "#FEE2E2", color: "#991B1B", icon: <XCircle size={13} />,      label: "Rejected" },
// };

// const typeConfig = {
//   Internship: { bg: "#FCE7F3", color: "#BE185D" },
//   Research:   { bg: "#D1FAE5", color: "#065F46" },
//   Project:    { bg: "#EDE9FE", color: "#6D28D9" },
//   Workshop:   { bg: "#FEF9C3", color: "#854D0E" },
// };

// // ─── Component ─────────────────────────────────────────────────────────────────
// const StudentApplications = () => {
//   const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
//   const [selectedApp, setSelectedApp]   = useState(null);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [searchQuery, setSearchQuery]   = useState("");
//   const [noteInput, setNoteInput]       = useState("");
//   const [confirmModal, setConfirmModal] = useState(null); // { app, action: "Forward"|"Reject" }
//   const [toast, setToast]               = useState(null);

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const handleAction = (appId, action) => {
//     setApplications(prev =>
//       prev.map(a =>
//         a.id === appId
//           ? { ...a, liaisonStatus: action === "Forward" ? "Forwarded" : "Rejected", liaisonNote: noteInput }
//           : a
//       )
//     );
//     setNoteInput("");
//     setConfirmModal(null);
//     setSelectedApp(null);
//     showToast(
//       action === "Forward"
//         ? "Application forwarded to industry successfully!"
//         : "Application rejected. Student will be notified.",
//       action === "Forward" ? "success" : "error"
//     );
//   };

//   const filtered = applications.filter(a => {
//     const matchStatus = filterStatus === "All" || a.liaisonStatus === filterStatus;
//     const matchSearch =
//       a.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       a.post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       a.post.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       a.student.id.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchStatus && matchSearch;
//   });

//   const counts = {
//     All:       applications.length,
//     Pending:   applications.filter(a => a.liaisonStatus === "Pending").length,
//     Forwarded: applications.filter(a => a.liaisonStatus === "Forwarded").length,
//     Rejected:  applications.filter(a => a.liaisonStatus === "Rejected").length,
//   };

//   return (
//     <div style={s.page}>
//       {/* Toast */}
//       <AnimatePresence>
//         {toast && (
//           <motion.div
//             style={{ ...s.toast, background: toast.type === "success" ? "#10B981" : "#EF4444" }}
//             initial={{ opacity: 0, y: -50, x: "-50%" }}
//             animate={{ opacity: 1, y: 0, x: "-50%" }}
//             exit={{ opacity: 0, y: -50, x: "-50%" }}
//           >
//             {toast.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
//             {toast.msg}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Page Header */}
//       <div style={s.header}>
//         <div style={s.headerLeft}>
//           <div style={s.headerIcon}><Inbox size={22} color="#fff" /></div>
//           <div>
//             <h1 style={s.title}>Student Applications</h1>
//             <p style={s.subtitle}>
//               Review applications approved by Internship Incharge · Forward or reject to send to industry.
//             </p>
//           </div>
//         </div>
//         <div style={s.flowBadge}>
//           <span style={s.flowStep}>Student</span>
//           <ChevronRight size={14} color="#94A3B8" />
//           <span style={s.flowStep}>Incharge ✓</span>
//           <ChevronRight size={14} color="#94A3B8" />
//           <span style={{ ...s.flowStep, ...s.flowStepActive }}>Industry Liaison</span>
//           <ChevronRight size={14} color="#94A3B8" />
//           <span style={s.flowStep}>Industry</span>
//         </div>
//       </div>

//       {/* Summary Stat Tabs */}
//       <div style={s.tabs}>
//         {["All", "Pending", "Forwarded", "Rejected"].map((tab) => {
//           const active = filterStatus === tab;
//           const sc = tab === "All" ? null : statusConfig[tab];
//           return (
//             <motion.button
//               key={tab}
//               whileTap={{ scale: 0.96 }}
//               style={{ ...s.tab, ...(active ? s.tabActive : {}) }}
//               onClick={() => setFilterStatus(tab)}
//             >
//               {sc && <span style={{ ...s.tabDot, background: sc.color }} />}
//               {tab}
//               <span style={{ ...s.tabCount, background: active ? "rgba(255,255,255,0.25)" : "#F1F5F9" }}>
//                 {counts[tab]}
//               </span>
//             </motion.button>
//           );
//         })}
//       </div>

//       {/* Search */}
//       <div style={s.searchWrap}>
//         <Search size={16} color="#9CA3AF" />
//         <input
//           style={s.searchInput}
//           placeholder="Search by student name, ID, post title or industry..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* Applications List */}
//       <div style={s.list}>
//         <AnimatePresence>
//           {filtered.length === 0 && (
//             <motion.div style={s.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//               <Inbox size={52} color="#E2E8F0" />
//               <p style={{ color: "#94A3B8", marginTop: "12px" }}>No applications found.</p>
//             </motion.div>
//           )}
//           {filtered.map((app, idx) => {
//             const sc = statusConfig[app.liaisonStatus];
//             const tc = typeConfig[app.post.type] || typeConfig.Project;
//             return (
//               <motion.div
//                 key={app.id}
//                 style={s.card}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, x: -40 }}
//                 transition={{ delay: idx * 0.05 }}
//                 whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
//               >
//                 {/* Left accent */}
//                 <div style={{ ...s.cardAccent, background: sc.color }} />

//                 <div style={s.cardBody}>
//                   {/* Student Info */}
//                   <div style={s.studentSection}>
//                     <div style={{ ...s.avatarLg, background: ["#DBEAFE","#EDE9FE","#FCE7F3","#D1FAE5","#FEF3C7"][idx % 5], color: ["#1D4ED8","#6D28D9","#BE185D","#065F46","#92400E"][idx % 5] }}>
//                       {app.student.name[0]}
//                     </div>
//                     <div>
//                       <div style={s.studentName}>{app.student.name}</div>
//                       <div style={s.studentMeta}>
//                         <span><GraduationCap size={12} /> {app.student.program}</span>
//                         <span>·</span>
//                         <span>ID: {app.student.id}</span>
//                         <span>·</span>
//                         <span>CGPA: {app.student.cgpa}</span>
//                         <span>·</span>
//                         <span>Sem {app.student.semester}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Post Info */}
//                   <div style={s.postSection}>
//                     <div style={s.postTitle}>
//                       <Building2 size={14} color="#3B82F6" />
//                       {app.post.title}
//                     </div>
//                     <div style={s.postMeta}>
//                       <span style={{ ...s.badge, background: tc.bg, color: tc.color }}>
//                         <Tag size={10} /> {app.post.type}
//                       </span>
//                       <span style={s.industryChip}>{app.post.industry}</span>
//                       <span style={s.domainChip}>{app.post.domain}</span>
//                     </div>
//                   </div>

//                   {/* Dates + Incharge Note Preview */}
//                   <div style={s.metaRow}>
//                     <span style={s.metaItem}><Calendar size={12} /> Applied: {app.appliedOn}</span>
//                     <span style={s.metaItem}><CheckCircle size={12} color="#10B981" /> Approved by Incharge: {app.inchargeApprovedOn}</span>
//                   </div>

//                   <div style={s.inchargeNote}>
//                     <Info size={12} color="#6366F1" />
//                     <span><strong>Incharge Note:</strong> {app.inchargeNote}</span>
//                   </div>

//                   {app.liaisonNote && (
//                     <div style={{ ...s.inchargeNote, background: sc.bg, borderColor: sc.color + "60" }}>
//                       <FileText size={12} color={sc.color} />
//                       <span style={{ color: sc.color }}><strong>Your Note:</strong> {app.liaisonNote}</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Right Panel */}
//                 <div style={s.cardRight}>
//                   <span style={{ ...s.statusPill, background: sc.bg, color: sc.color }}>
//                     {sc.icon} {sc.label}
//                   </span>

//                   <div style={s.appId}>{app.id}</div>

//                   <div style={s.actionBtns}>
//                     <motion.button
//                       whileTap={{ scale: 0.94 }}
//                       style={s.btnView}
//                       onClick={() => { setSelectedApp(app); setNoteInput(app.liaisonNote || ""); }}
//                     >
//                       <Eye size={14} /> Review
//                     </motion.button>

//                     {app.liaisonStatus === "Pending" && (
//                       <>
//                         <motion.button
//                           whileTap={{ scale: 0.94 }}
//                           style={s.btnForward}
//                           onClick={() => { setConfirmModal({ app, action: "Forward" }); setNoteInput(""); }}
//                         >
//                           <Send size={14} /> Forward
//                         </motion.button>
//                         <motion.button
//                           whileTap={{ scale: 0.94 }}
//                           style={s.btnReject}
//                           onClick={() => { setConfirmModal({ app, action: "Reject" }); setNoteInput(""); }}
//                         >
//                           <XCircle size={14} /> Reject
//                         </motion.button>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </AnimatePresence>
//       </div>

//       {/* ===== Detail Modal ===== */}
//       <AnimatePresence>
//         {selectedApp && (
//           <motion.div style={s.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)}>
//             <motion.div
//               style={s.modal}
//               initial={{ scale: 0.85, y: 40, opacity: 0 }}
//               animate={{ scale: 1, y: 0, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 26 }}
//               onClick={e => e.stopPropagation()}
//             >
//               {/* Modal Header */}
//               <div style={s.modalHeader}>
//                 <div style={s.modalHeaderContent}>
//                   <div style={s.modalAvatar}>
//                     {selectedApp.student.name[0]}
//                   </div>
//                   <div>
//                     <h2 style={s.modalName}>{selectedApp.student.name}</h2>
//                     <p style={s.modalSub}>{selectedApp.student.program} · {selectedApp.student.id}</p>
//                   </div>
//                   <span style={{ ...s.statusPill, background: statusConfig[selectedApp.liaisonStatus].bg, color: statusConfig[selectedApp.liaisonStatus].color, marginLeft: "auto" }}>
//                     {statusConfig[selectedApp.liaisonStatus].icon}
//                     {statusConfig[selectedApp.liaisonStatus].label}
//                   </span>
//                 </div>
//               </div>

//               <div style={s.modalBody}>
//                 {/* Application Info */}
//                 <div style={s.modalSection}>
//                   <h4 style={s.sectionTitle}><Building2 size={14} /> Applied Position</h4>
//                   <div style={s.infoGrid}>
//                     <div style={s.infoCell}><span style={s.infoLabel}>Post Title</span><span style={s.infoVal}>{selectedApp.post.title}</span></div>
//                     <div style={s.infoCell}><span style={s.infoLabel}>Type</span><span style={s.infoVal}>{selectedApp.post.type}</span></div>
//                     <div style={s.infoCell}><span style={s.infoLabel}>Industry</span><span style={s.infoVal}>{selectedApp.post.industry}</span></div>
//                     <div style={s.infoCell}><span style={s.infoLabel}>Domain</span><span style={s.infoVal}>{selectedApp.post.domain}</span></div>
//                     <div style={s.infoCell}><span style={s.infoLabel}>Applied On</span><span style={s.infoVal}>{selectedApp.appliedOn}</span></div>
//                     <div style={s.infoCell}><span style={s.infoLabel}>Incharge Approved</span><span style={s.infoVal}>{selectedApp.inchargeApprovedOn}</span></div>
//                   </div>
//                 </div>

//                 {/* Student Details */}
//                 <div style={s.modalSection}>
//                   <h4 style={s.sectionTitle}><GraduationCap size={14} /> Student Profile</h4>
//                   <div style={s.infoGrid}>
//                     <div style={s.infoCell}><span style={s.infoLabel}>Email</span><span style={s.infoVal}>{selectedApp.student.email}</span></div>
//                     <div style={s.infoCell}><span style={s.infoLabel}>CGPA</span><span style={s.infoVal}>{selectedApp.student.cgpa}</span></div>
//                     <div style={s.infoCell}><span style={s.infoLabel}>Semester</span><span style={s.infoVal}>{selectedApp.student.semester}</span></div>
//                     <div style={s.infoCell}><span style={s.infoLabel}>CV</span><span style={{ ...s.infoVal, color: "#3B82F6", cursor: "pointer" }}>📄 {selectedApp.cv}</span></div>
//                   </div>
//                 </div>

//                 {/* Cover Letter */}
//                 <div style={s.modalSection}>
//                   <h4 style={s.sectionTitle}><FileText size={14} /> Cover Letter</h4>
//                   <p style={s.coverText}>{selectedApp.coverLetter}</p>
//                 </div>

//                 {/* Incharge Note */}
//                 <div style={s.modalSection}>
//                   <h4 style={s.sectionTitle}><Info size={14} /> Internship Incharge Remarks</h4>
//                   <div style={s.noteBox}>{selectedApp.inchargeNote}</div>
//                 </div>

//                 {/* Liaison Note */}
//                 {selectedApp.liaisonStatus === "Pending" && (
//                   <div style={s.modalSection}>
//                     <h4 style={s.sectionTitle}><FileText size={14} /> Your Remarks (Optional)</h4>
//                     <textarea
//                       style={s.noteTextarea}
//                       placeholder="Add a note before forwarding or rejecting..."
//                       value={noteInput}
//                       onChange={e => setNoteInput(e.target.value)}
//                       rows={3}
//                     />
//                   </div>
//                 )}

//                 {selectedApp.liaisonNote && selectedApp.liaisonStatus !== "Pending" && (
//                   <div style={s.modalSection}>
//                     <h4 style={s.sectionTitle}><FileText size={14} /> Your Remarks</h4>
//                     <div style={{ ...s.noteBox, background: statusConfig[selectedApp.liaisonStatus].bg, borderColor: statusConfig[selectedApp.liaisonStatus].color + "40", color: statusConfig[selectedApp.liaisonStatus].color }}>
//                       {selectedApp.liaisonNote}
//                     </div>
//                   </div>
//                 )}

//                 {/* Action Buttons inside modal */}
//                 {selectedApp.liaisonStatus === "Pending" && (
//                   <div style={s.modalActions}>
//                     <motion.button
//                       whileTap={{ scale: 0.96 }}
//                       style={s.modalBtnReject}
//                       onClick={() => { setConfirmModal({ app: selectedApp, action: "Reject" }); }}
//                     >
//                       <XCircle size={16} /> Reject Application
//                     </motion.button>
//                     <motion.button
//                       whileTap={{ scale: 0.96 }}
//                       style={s.modalBtnForward}
//                       onClick={() => { setConfirmModal({ app: selectedApp, action: "Forward" }); }}
//                     >
//                       <Send size={16} /> Forward to Industry <ArrowRight size={16} />
//                     </motion.button>
//                   </div>
//                 )}
//               </div>

//               <button style={s.closeBtn} onClick={() => setSelectedApp(null)}>Close</button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ===== Confirm Modal ===== */}
//       <AnimatePresence>
//         {confirmModal && (
//           <motion.div style={{ ...s.overlay, zIndex: 1100 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmModal(null)}>
//             <motion.div
//               style={s.confirmBox}
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.85, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 350, damping: 28 }}
//               onClick={e => e.stopPropagation()}
//             >
//               <div style={{ ...s.confirmIcon, background: confirmModal.action === "Forward" ? "#DBEAFE" : "#FEE2E2" }}>
//                 {confirmModal.action === "Forward"
//                   ? <Send size={28} color="#1D4ED8" />
//                   : <XCircle size={28} color="#DC2626" />}
//               </div>
//               <h3 style={s.confirmTitle}>
//                 {confirmModal.action === "Forward" ? "Forward to Industry?" : "Reject Application?"}
//               </h3>
//               <p style={s.confirmMsg}>
//                 {confirmModal.action === "Forward"
//                   ? `You are about to forward ${confirmModal.app.student.name}'s application to ${confirmModal.app.post.industry}. This action will notify the industry partner.`
//                   : `You are about to reject ${confirmModal.app.student.name}'s application. The student will be notified of the decision.`}
//               </p>

//               <div style={s.noteInputWrap}>
//                 <label style={s.noteLabel}>Add a remark (optional)</label>
//                 <textarea
//                   style={s.noteTextarea}
//                   rows={2}
//                   value={noteInput}
//                   onChange={e => setNoteInput(e.target.value)}
//                   placeholder={confirmModal.action === "Forward" ? "e.g. Strong candidate, please prioritize." : "e.g. Insufficient experience for this role."}
//                 />
//               </div>

//               <div style={s.confirmBtns}>
//                 <button style={s.cancelBtn} onClick={() => { setConfirmModal(null); setNoteInput(""); }}>Cancel</button>
//                 <motion.button
//                   whileTap={{ scale: 0.95 }}
//                   style={confirmModal.action === "Forward" ? s.confirmFwdBtn : s.confirmRejBtn}
//                   onClick={() => handleAction(confirmModal.app.id, confirmModal.action)}
//                 >
//                   {confirmModal.action === "Forward"
//                     ? <><Send size={15} /> Confirm Forward</>
//                     : <><XCircle size={15} /> Confirm Reject</>}
//                 </motion.button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ─── Styles ────────────────────────────────────────────────────────────────────
// const s = {
//   page: {
//     padding: "36px 52px",
//     background: "#F8FAFC",
//     minHeight: "100vh",
//     fontFamily: "'Inter', sans-serif",
//     position: "relative",
//   },
//   toast: {
//     position: "fixed", top: "20px", left: "50%",
//     transform: "translateX(-50%)",
//     display: "flex", alignItems: "center", gap: "8px",
//     color: "#fff", padding: "12px 24px", borderRadius: "12px",
//     fontWeight: "600", fontSize: "0.88rem",
//     boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 9999,
//   },
//   header: {
//     display: "flex", justifyContent: "space-between",
//     alignItems: "flex-start", marginBottom: "28px",
//     flexWrap: "wrap", gap: "16px",
//   },
//   headerLeft: { display: "flex", alignItems: "flex-start", gap: "16px" },
//   headerIcon: {
//     background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
//     borderRadius: "14px", padding: "12px",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
//   },
//   title: { fontSize: "1.7rem", fontWeight: "700", color: "#0F172A", margin: 0 },
//   subtitle: { color: "#64748B", fontSize: "0.88rem", marginTop: "5px" },
//   flowBadge: {
//     display: "flex", alignItems: "center", gap: "8px",
//     background: "#fff", borderRadius: "12px", padding: "10px 16px",
//     border: "1.5px solid #E2E8F0", fontSize: "0.8rem", flexWrap: "wrap",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//   },
//   flowStep: { color: "#94A3B8", fontWeight: "500" },
//   flowStepActive: {
//     background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
//     WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//     fontWeight: "700",
//   },
//   tabs: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
//   tab: {
//     display: "flex", alignItems: "center", gap: "7px",
//     padding: "9px 18px", borderRadius: "10px",
//     border: "1.5px solid #E2E8F0", background: "#fff",
//     color: "#475569", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer",
//   },
//   tabActive: {
//     background: "#0F172A", color: "#fff", borderColor: "#0F172A",
//   },
//   tabDot: { width: "7px", height: "7px", borderRadius: "50%" },
//   tabCount: {
//     padding: "2px 8px", borderRadius: "20px",
//     fontSize: "0.75rem", fontWeight: "700",
//   },
//   searchWrap: {
//     display: "flex", alignItems: "center", gap: "10px",
//     background: "#fff", borderRadius: "12px", padding: "10px 16px",
//     border: "1.5px solid #E2E8F0", marginBottom: "24px",
//     boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//   },
//   searchInput: {
//     border: "none", outline: "none", fontSize: "0.88rem",
//     background: "transparent", width: "100%", color: "#0F172A",
//   },
//   list: { display: "flex", flexDirection: "column", gap: "16px" },
//   empty: {
//     display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0",
//   },
//   card: {
//     background: "#fff", borderRadius: "16px",
//     boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
//     display: "flex", overflow: "hidden",
//     transition: "box-shadow 0.3s, transform 0.3s",
//   },
//   cardAccent: { width: "5px", flexShrink: 0 },
//   cardBody: { flex: 1, padding: "20px 20px 20px 20px", display: "flex", flexDirection: "column", gap: "10px" },
//   studentSection: { display: "flex", alignItems: "center", gap: "12px" },
//   avatarLg: {
//     width: "44px", height: "44px", borderRadius: "50%",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: "1rem", fontWeight: "700", flexShrink: 0,
//   },
//   studentName: { fontSize: "1rem", fontWeight: "700", color: "#0F172A" },
//   studentMeta: {
//     display: "flex", gap: "6px", alignItems: "center",
//     fontSize: "0.78rem", color: "#94A3B8", flexWrap: "wrap", marginTop: "3px",
//   },
//   postSection: { display: "flex", flexDirection: "column", gap: "6px" },
//   postTitle: {
//     display: "flex", alignItems: "center", gap: "7px",
//     fontSize: "0.9rem", fontWeight: "600", color: "#1E40AF",
//   },
//   postMeta: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" },
//   badge: {
//     display: "inline-flex", alignItems: "center", gap: "4px",
//     padding: "3px 10px", borderRadius: "20px", fontSize: "0.73rem", fontWeight: "600",
//   },
//   industryChip: {
//     fontSize: "0.78rem", color: "#475569", background: "#F1F5F9",
//     padding: "3px 10px", borderRadius: "8px", border: "1px solid #E2E8F0",
//   },
//   domainChip: {
//     fontSize: "0.75rem", color: "#94A3B8", fontStyle: "italic",
//   },
//   metaRow: { display: "flex", gap: "16px", flexWrap: "wrap" },
//   metaItem: {
//     display: "flex", alignItems: "center", gap: "5px",
//     fontSize: "0.78rem", color: "#64748B",
//   },
//   inchargeNote: {
//     display: "flex", alignItems: "flex-start", gap: "8px",
//     background: "#F0F4FF", borderRadius: "10px", padding: "10px 14px",
//     fontSize: "0.82rem", color: "#3730A3", lineHeight: 1.5,
//     border: "1px solid #C7D2FE",
//   },
//   cardRight: {
//     padding: "20px 22px", display: "flex", flexDirection: "column",
//     alignItems: "flex-end", justifyContent: "space-between",
//     gap: "12px", minWidth: "180px", borderLeft: "1px solid #F1F5F9",
//   },
//   statusPill: {
//     display: "inline-flex", alignItems: "center", gap: "5px",
//     padding: "5px 12px", borderRadius: "20px",
//     fontSize: "0.77rem", fontWeight: "700", whiteSpace: "nowrap",
//   },
//   appId: { fontSize: "0.75rem", color: "#CBD5E1", fontWeight: "600" },
//   actionBtns: { display: "flex", flexDirection: "column", gap: "8px", width: "100%" },
//   btnView: {
//     display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
//     background: "#F8FAFC", color: "#475569", border: "1.5px solid #E2E8F0",
//     borderRadius: "10px", padding: "8px 12px", fontSize: "0.82rem",
//     fontWeight: "600", cursor: "pointer",
//   },
//   btnForward: {
//     display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
//     background: "#EFF6FF", color: "#1D4ED8", border: "1.5px solid #BFDBFE",
//     borderRadius: "10px", padding: "8px 12px", fontSize: "0.82rem",
//     fontWeight: "600", cursor: "pointer",
//   },
//   btnReject: {
//     display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
//     background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA",
//     borderRadius: "10px", padding: "8px 12px", fontSize: "0.82rem",
//     fontWeight: "600", cursor: "pointer",
//   },
//   /* Detail Modal */
//   overlay: {
//     position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     zIndex: 1000, backdropFilter: "blur(4px)",
//   },
//   modal: {
//     background: "#fff", borderRadius: "24px",
//     width: "600px", maxWidth: "96vw", maxHeight: "92vh", overflowY: "auto",
//     boxShadow: "0 30px 70px rgba(0,0,0,0.3)",
//   },
//   modalHeader: {
//     background: "linear-gradient(135deg, #0F172A, #1E3A5F)",
//     padding: "24px", borderRadius: "24px 24px 0 0",
//   },
//   modalHeaderContent: { display: "flex", alignItems: "center", gap: "14px" },
//   modalAvatar: {
//     width: "48px", height: "48px", borderRadius: "50%",
//     background: "rgba(255,255,255,0.15)", color: "#fff",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: "1.2rem", fontWeight: "700", flexShrink: 0,
//   },
//   modalName: { fontSize: "1.15rem", fontWeight: "700", color: "#fff", margin: 0 },
//   modalSub: { color: "rgba(255,255,255,0.6)", fontSize: "0.83rem", margin: "4px 0 0 0" },
//   modalBody: { padding: "24px" },
//   modalSection: { marginBottom: "20px" },
//   sectionTitle: {
//     display: "flex", alignItems: "center", gap: "7px",
//     fontSize: "0.85rem", fontWeight: "700", color: "#475569",
//     textTransform: "uppercase", letterSpacing: "0.05em",
//     marginBottom: "12px", paddingBottom: "8px",
//     borderBottom: "1px solid #F1F5F9",
//   },
//   infoGrid: {
//     display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px",
//   },
//   infoCell: {
//     background: "#F8FAFC", borderRadius: "10px", padding: "10px 14px",
//     border: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "3px",
//   },
//   infoLabel: { fontSize: "0.7rem", color: "#94A3B8", fontWeight: "600", textTransform: "uppercase" },
//   infoVal: { fontSize: "0.85rem", color: "#0F172A", fontWeight: "600" },
//   coverText: {
//     fontSize: "0.85rem", color: "#475569", lineHeight: 1.65,
//     background: "#F8FAFC", borderRadius: "10px", padding: "14px",
//     border: "1px solid #F1F5F9",
//   },
//   noteBox: {
//     fontSize: "0.85rem", color: "#3730A3", background: "#F0F4FF",
//     borderRadius: "10px", padding: "14px", border: "1px solid #C7D2FE",
//     lineHeight: 1.6,
//   },
//   noteTextarea: {
//     width: "100%", border: "1.5px solid #E2E8F0", borderRadius: "10px",
//     padding: "12px", fontSize: "0.85rem", color: "#0F172A",
//     resize: "vertical", outline: "none", fontFamily: "inherit",
//     boxSizing: "border-box",
//   },
//   modalActions: { display: "flex", gap: "12px", marginTop: "20px" },
//   modalBtnReject: {
//     flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//     background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA",
//     borderRadius: "12px", padding: "12px", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer",
//   },
//   modalBtnForward: {
//     flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//     background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff",
//     border: "none", borderRadius: "12px", padding: "12px",
//     fontWeight: "600", fontSize: "0.9rem", cursor: "pointer",
//     boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
//   },
//   closeBtn: {
//     display: "block", width: "calc(100% - 48px)", margin: "0 24px 24px",
//     background: "#F1F5F9", color: "#475569", border: "none",
//     borderRadius: "12px", padding: "11px", fontWeight: "600",
//     fontSize: "0.9rem", cursor: "pointer",
//   },
//   /* Confirm Modal */
//   confirmBox: {
//     background: "#fff", borderRadius: "22px", padding: "32px",
//     width: "420px", maxWidth: "95vw", textAlign: "center",
//     boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
//   },
//   confirmIcon: {
//     width: "64px", height: "64px", borderRadius: "50%",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     margin: "0 auto 18px",
//   },
//   confirmTitle: { fontSize: "1.2rem", fontWeight: "700", color: "#0F172A", margin: "0 0 10px" },
//   confirmMsg: { fontSize: "0.88rem", color: "#64748B", lineHeight: 1.6, marginBottom: "20px" },
//   noteInputWrap: { textAlign: "left", marginBottom: "20px" },
//   noteLabel: { display: "block", fontSize: "0.8rem", color: "#64748B", fontWeight: "600", marginBottom: "6px" },
//   confirmBtns: { display: "flex", gap: "12px" },
//   cancelBtn: {
//     flex: 1, background: "#F1F5F9", color: "#64748B", border: "none",
//     borderRadius: "12px", padding: "12px", fontWeight: "600", cursor: "pointer",
//   },
//   confirmFwdBtn: {
//     flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//     background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff",
//     border: "none", borderRadius: "12px", padding: "12px",
//     fontWeight: "600", cursor: "pointer",
//     boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
//   },
//   confirmRejBtn: {
//     flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//     background: "#DC2626", color: "#fff", border: "none",
//     borderRadius: "12px", padding: "12px", fontWeight: "600", cursor: "pointer",
//     boxShadow: "0 4px 14px rgba(220,38,38,0.3)",
//   },
// };

// export default StudentApplications;









// src/pages/StudentApplications.jsx
// Industry Liaison Side - Review & Forward/Reject Student Applications
// Real backend integrated: fetches sent_to_liaison applications from DB






// import React, { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Users, CheckCircle, XCircle, Clock, Eye, Send,
//   Filter, Search, ChevronRight, Building2, GraduationCap,
//   AlertCircle, FileText, Calendar, Tag, BarChart2,
//   ArrowRight, Info, Inbox, RefreshCw, Loader2, Target, Zap
// } from "lucide-react";

// // ─── CONFIG ───────────────────────────────────────────────────────────────────
// const BASE = "http://localhost:5000";
// const API  = `${BASE}/api/liaison`;

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const fmt = (iso) =>
//   iso
//     ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
//     : "-";

// const initials = (name = "") =>
//   name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// const statusConfig = {
//   pending:   { bg: "#FEF3C7", color: "#92400E", icon: <Clock size={13} />,   label: "Pending Review" },
//   forwarded: { bg: "#DBEAFE", color: "#1E40AF", icon: <Send size={13} />,    label: "Forwarded to Industry" },
//   rejected:  { bg: "#FEE2E2", color: "#991B1B", icon: <XCircle size={13} />, label: "Rejected" },
// };

// const typeConfig = {
//   Internship: { bg: "#FCE7F3", color: "#BE185D" },
//   Research:   { bg: "#D1FAE5", color: "#065F46" },
//   Project:    { bg: "#EDE9FE", color: "#6D28D9" },
//   Workshop:   { bg: "#FEF9C3", color: "#854D0E" },
// };

// function Spinner({ size = 16, color = "#1d4ed8" }) {
//   return (
//     <motion.div
//       animate={{ rotate: 360 }}
//       transition={{ repeat: Infinity, duration: 0.75, ease: "linear" }}
//       style={{ width: size, height: size, display: "inline-flex" }}
//     >
//       <Loader2 size={size} color={color} />
//     </motion.div>
//   );
// }

// // ─── Component ────────────────────────────────────────────────────────────────
// const StudentApplications = () => {
//   // ── State ──────────────────────────────────────────────────────────────────
//   const [applications, setApplications] = useState([]);
//   const [internships,  setInternships]  = useState([]);
//   const [loading,      setLoading]      = useState(true);
//   const [actionLoading, setActionLoading] = useState({}); // { [id]: "forwarding"|"rejecting"|null }

//   const [selectedApp,  setSelectedApp]  = useState(null);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [searchQuery,  setSearchQuery]  = useState("");
//   const [noteInput,    setNoteInput]    = useState("");
//   const [confirmModal, setConfirmModal] = useState(null); // { app, action: "Forward"|"Reject" }
//   const [toast,        setToast]        = useState(null);

//   // ── Toast helper ────────────────────────────────────────────────────────────
//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3500);
//   };

//   // ── FETCH from backend ──────────────────────────────────────────────────────
//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [appRes, intRes] = await Promise.all([
//         fetch(`${API}/applications`),
//         fetch(`${BASE}/api/incharge/internships`),
//       ]);
//       const appJson = await appRes.json();
//       const intJson = await intRes.json();
//       setApplications(appJson.data || []);
//       setInternships(intJson.data  || []);
//     } catch (err) {
//       showToast("Backend unavailable - showing demo data", "warn");
//       setApplications(DEMO_APPS);
//       setInternships(DEMO_INTERNSHIPS);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   // ── FORWARD to Industry ─────────────────────────────────────────────────────
//   const handleForward = async (appId) => {
//     setConfirmModal(null);
//     setActionLoading((p) => ({ ...p, [appId]: "forwarding" }));
//     try {
//       const res = await fetch(`${API}/applications/${appId}/forward`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ remarks: noteInput || "" }),
//       });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json.message);

//       setApplications((prev) =>
//         prev.map((a) =>
//           a._id === appId
//             ? { ...a, liaisonStatus: "forwarded", liaisonNote: noteInput }
//             : a
//         )
//       );
//       showToast("Application forwarded to industry ✓", "success");
//     } catch (err) {
//       // Optimistic update for demo/offline mode
//       setApplications((prev) =>
//         prev.map((a) =>
//           a._id === appId
//             ? { ...a, liaisonStatus: "forwarded", liaisonNote: noteInput }
//             : a
//         )
//       );
//       showToast("Forwarded (demo mode) ✓", "success");
//     } finally {
//       setNoteInput("");
//       setSelectedApp(null);
//       setActionLoading((p) => ({ ...p, [appId]: null }));
//     }
//   };

//   // ── REJECT ──────────────────────────────────────────────────────────────────
//   const handleReject = async (appId) => {
//     setConfirmModal(null);
//     setActionLoading((p) => ({ ...p, [appId]: "rejecting" }));
//     try {
//       const res = await fetch(`${API}/applications/${appId}/reject`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ remarks: noteInput || "" }),
//       });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json.message);

//       setApplications((prev) =>
//         prev.map((a) =>
//           a._id === appId
//             ? { ...a, liaisonStatus: "rejected", liaisonNote: noteInput }
//             : a
//         )
//       );
//       showToast("Application rejected. Student will be notified.", "error");
//     } catch (err) {
//       setApplications((prev) =>
//         prev.map((a) =>
//           a._id === appId
//             ? { ...a, liaisonStatus: "rejected", liaisonNote: noteInput }
//             : a
//         )
//       );
//       showToast("Rejected (demo mode)", "error");
//     } finally {
//       setNoteInput("");
//       setSelectedApp(null);
//       setActionLoading((p) => ({ ...p, [appId]: null }));
//     }
//   };

//   // ── Derived ─────────────────────────────────────────────────────────────────
//   const getStatus = (app) => app.liaisonStatus || "pending";

//   const filtered = applications.filter((a) => {
//     const name     = (a.studentId?.name || a.student?.name || "").toLowerCase();
//     const title    = (a.internshipId?.title || "").toLowerCase();
//     const company  = (a.internshipId?.company || "").toLowerCase();
//     const matchSearch =
//       name.includes(searchQuery.toLowerCase()) ||
//       title.includes(searchQuery.toLowerCase()) ||
//       company.includes(searchQuery.toLowerCase());
//     const matchStatus =
//       filterStatus === "All" ||
//       (filterStatus === "Pending"   && getStatus(a) === "pending") ||
//       (filterStatus === "Forwarded" && getStatus(a) === "forwarded") ||
//       (filterStatus === "Rejected"  && getStatus(a) === "rejected");
//     return matchSearch && matchStatus;
//   });

//   const counts = {
//     All:       applications.length,
//     Pending:   applications.filter((a) => getStatus(a) === "pending").length,
//     Forwarded: applications.filter((a) => getStatus(a) === "forwarded").length,
//     Rejected:  applications.filter((a) => getStatus(a) === "rejected").length,
//   };

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div style={s.page}>

//       {/* Toast */}
//       <AnimatePresence>
//         {toast && (
//           <motion.div
//             style={{
//               ...s.toast,
//               background: toast.type === "success" ? "#10B981"
//                 : toast.type === "error" ? "#EF4444"
//                 : "#F59E0B",
//             }}
//             initial={{ opacity: 0, y: -50, x: "-50%" }}
//             animate={{ opacity: 1, y: 0,   x: "-50%" }}
//             exit={{    opacity: 0, y: -50,  x: "-50%" }}
//           >
//             {toast.type === "success" ? <CheckCircle size={16} />
//               : toast.type === "error" ? <XCircle size={16} />
//               : <AlertCircle size={16} />}
//             {toast.msg}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Page Header */}
//       <div style={s.header}>
//         <div style={s.headerLeft}>
//           <div style={s.headerIcon}><Inbox size={22} color="#fff" /></div>
//           <div>
//             <h1 style={s.title}>Student Applications</h1>
//             <p style={s.subtitle}>
//               Review applications approved by Internship Incharge · Forward or reject to send to industry.
//             </p>
//           </div>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           {/* Refresh button */}
//           <button
//             onClick={fetchData}
//             title="Refresh"
//             style={{
//               width: 40, height: 40, borderRadius: 10,
//               background: "#fff", border: "1px solid #E2E8F0",
//               cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
//               boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//             }}
//           >
//             {loading ? <Spinner size={15} color="#64748b" /> : <RefreshCw size={15} color="#64748b" />}
//           </button>

//           {/* Workflow badge */}
//           <div style={s.flowBadge}>
//             <span style={s.flowStep}>Student</span>
//             <ChevronRight size={14} color="#94A3B8" />
//             <span style={s.flowStep}>Incharge ✓</span>
//             <ChevronRight size={14} color="#94A3B8" />
//             <span style={{ ...s.flowStep, ...s.flowStepActive }}>Industry Liaison</span>
//             <ChevronRight size={14} color="#94A3B8" />
//             <span style={s.flowStep}>Industry</span>
//           </div>
//         </div>
//       </div>

//       {/* Summary Stat Cards */}
//       <div style={s.statRow}>
//         {[
//           { label: "Total Received",  value: counts.All,       color: "#6366F1", bg: "#EEF2FF" },
//           { label: "Pending Review",  value: counts.Pending,   color: "#D97706", bg: "#FFFBEB" },
//           { label: "Forwarded",       value: counts.Forwarded, color: "#1D4ED8", bg: "#EFF6FF" },
//           { label: "Rejected",        value: counts.Rejected,  color: "#DC2626", bg: "#FEF2F2" },
//         ].map((st, i) => (
//           <motion.div
//             key={st.label}
//             style={{ ...s.statCard, background: "#fff" }}
//             initial={{ opacity: 0, y: 14 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.06 }}
//           >
//             <div style={{ ...s.statIcon, background: st.bg }}>
//               {i === 0 ? <Inbox size={18} color={st.color} />
//                 : i === 1 ? <Clock size={18} color={st.color} />
//                 : i === 2 ? <Send size={18} color={st.color} />
//                 : <XCircle size={18} color={st.color} />}
//             </div>
//             <div>
//               <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{st.label}</div>
//               <div style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", lineHeight: 1.1, marginTop: 2 }}>{st.value}</div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Tabs */}
//       <div style={s.tabs}>
//         {["All", "Pending", "Forwarded", "Rejected"].map((tab) => {
//           const active = filterStatus === tab;
//           const sc = tab === "All" ? null : statusConfig[tab.toLowerCase()];
//           return (
//             <motion.button
//               key={tab}
//               whileTap={{ scale: 0.96 }}
//               style={{ ...s.tab, ...(active ? s.tabActive : {}) }}
//               onClick={() => setFilterStatus(tab)}
//             >
//               {sc && <span style={{ ...s.tabDot, background: sc.color }} />}
//               {tab}
//               <span style={{ ...s.tabCount, background: active ? "rgba(255,255,255,0.22)" : "#F1F5F9" }}>
//                 {counts[tab]}
//               </span>
//             </motion.button>
//           );
//         })}
//       </div>

//       {/* Search */}
//       <div style={s.searchWrap}>
//         <Search size={16} color="#9CA3AF" />
//         <input
//           style={s.searchInput}
//           placeholder="Search by student name, internship title or company..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* Applications List */}
//       <div style={s.list}>
//         {loading ? (
//           <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
//             <Spinner size={32} color="#1d4ed8" />
//           </div>
//         ) : filtered.length === 0 ? (
//           <motion.div style={s.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//             <Inbox size={52} color="#E2E8F0" />
//             <p style={{ color: "#94A3B8", marginTop: 12, fontSize: 14 }}>
//               {applications.length === 0
//                 ? "No applications forwarded by Incharge yet."
//                 : "No applications match your filters."}
//             </p>
//           </motion.div>
//         ) : (
//           <AnimatePresence>
//             {filtered.map((app, idx) => {
//               const status  = getStatus(app);
//               const sc      = statusConfig[status] || statusConfig.pending;
//               const name    = app.studentId?.name || app.student?.name || "Unknown";
//               const email   = app.studentId?.email || app.student?.email || "";
//               const dept    = app.studentId?.department || app.student?.program || "";
//               const cgpa    = app.studentId?.cgpa || app.student?.cgpa || "";
//               const intern  = internships.find(
//                 (i) => i._id === (app.internshipId?._id || app.internshipId)
//               ) || app.internshipId || {};
//               const tc      = typeConfig[intern.type] || typeConfig.Project;
//               const loading = actionLoading[app._id];

//               return (
//                 <motion.div
//                   key={app._id}
//                   style={s.card}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, x: -40 }}
//                   transition={{ delay: idx * 0.05 }}
//                   whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
//                 >
//                   {/* Left accent */}
//                   <div style={{ ...s.cardAccent, background: sc.color }} />

//                   <div style={s.cardBody}>
//                     {/* Student Info */}
//                     <div style={s.studentSection}>
//                       <div style={{
//                         ...s.avatarLg,
//                         background: ["#DBEAFE","#EDE9FE","#FCE7F3","#D1FAE5","#FEF3C7"][idx % 5],
//                         color: ["#1D4ED8","#6D28D9","#BE185D","#065F46","#92400E"][idx % 5],
//                       }}>
//                         {initials(name)}
//                       </div>
//                       <div>
//                         <div style={s.studentName}>{name}</div>
//                         <div style={s.studentMeta}>
//                           {dept && <span><GraduationCap size={12} /> {dept}</span>}
//                           {cgpa && <><span>·</span><span>CGPA: {cgpa}</span></>}
//                           {email && <><span>·</span><span>{email}</span></>}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Internship Info */}
//                     <div style={s.postSection}>
//                       <div style={s.postTitle}>
//                         <Building2 size={14} color="#3B82F6" />
//                         {intern.title || "-"}
//                         {intern.company && <span style={{ fontWeight: 400, color: "#94A3B8" }}> · {intern.company}</span>}
//                       </div>
//                       <div style={s.postMeta}>
//                         {intern.type && (
//                           <span style={{ ...s.badge, background: tc.bg, color: tc.color }}>
//                             <Tag size={10} /> {intern.type}
//                           </span>
//                         )}
//                         {intern.requiredSkills?.slice(0,3).map((sk, i) => (
//                           <span key={i} style={{ fontSize: "0.73rem", color: "#64748B", background: "#F8FAFC", padding: "2px 8px", borderRadius: 6, border: "1px solid #E2E8F0" }}>
//                             {sk}
//                           </span>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Dates */}
//                     <div style={s.metaRow}>
//                       <span style={s.metaItem}>
//                         <Calendar size={12} /> Applied: {fmt(app.appliedAt || app.createdAt)}
//                       </span>
//                       <span style={s.metaItem}>
//                         <CheckCircle size={12} color="#10B981" />
//                         Approved by Incharge: {fmt(app.internshipInchargeApproval?.approvedAt || app.updatedAt)}
//                       </span>
//                       {app.matchScore != null && (
//                         <span style={s.metaItem}>
//                           <Target size={12} color="#6366f1" />
//                           Match: <strong style={{ color: app.matchScore >= 70 ? "#15803d" : "#b45309" }}>{app.matchScore}%</strong>
//                         </span>
//                       )}
//                     </div>

//                     {/* Incharge Remarks */}
//                     {app.internshipInchargeApproval?.remarks && (
//                       <div style={s.inchargeNote}>
//                         <Info size={12} color="#6366F1" />
//                         <span>
//                           <strong>Incharge Note:</strong> {app.internshipInchargeApproval.remarks}
//                         </span>
//                       </div>
//                     )}

//                     {/* Liaison Note */}
//                     {app.liaisonNote && (
//                       <div style={{ ...s.inchargeNote, background: sc.bg, borderColor: sc.color + "50", color: sc.color }}>
//                         <FileText size={12} color={sc.color} />
//                         <span><strong>Your Note:</strong> {app.liaisonNote}</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Right Panel */}
//                   <div style={s.cardRight}>
//                     <span style={{ ...s.statusPill, background: sc.bg, color: sc.color }}>
//                       {sc.icon} {sc.label}
//                     </span>

//                     <div style={s.actionBtns}>
//                       <motion.button
//                         whileTap={{ scale: 0.94 }}
//                         style={s.btnView}
//                         onClick={() => {
//                           setSelectedApp(app);
//                           setNoteInput(app.liaisonNote || "");
//                         }}
//                       >
//                         <Eye size={14} /> Review
//                       </motion.button>

//                       {status === "pending" && (
//                         <>
//                           <motion.button
//                             whileTap={{ scale: 0.94 }}
//                             style={{ ...s.btnForward, opacity: loading ? 0.7 : 1 }}
//                             disabled={!!loading}
//                             onClick={() => { setConfirmModal({ app, action: "Forward" }); setNoteInput(""); }}
//                           >
//                             {loading === "forwarding" ? <Spinner size={13} color="#1D4ED8" /> : <Send size={14} />}
//                             Forward
//                           </motion.button>
//                           <motion.button
//                             whileTap={{ scale: 0.94 }}
//                             style={{ ...s.btnReject, opacity: loading ? 0.7 : 1 }}
//                             disabled={!!loading}
//                             onClick={() => { setConfirmModal({ app, action: "Reject" }); setNoteInput(""); }}
//                           >
//                             {loading === "rejecting" ? <Spinner size={13} color="#DC2626" /> : <XCircle size={14} />}
//                             Reject
//                           </motion.button>
//                         </>
//                       )}

//                       {status === "forwarded" && (
//                         <div style={{ ...s.statusPill, background: "#DBEAFE", color: "#1E40AF", fontSize: "0.8rem", textAlign: "center" }}>
//                           <CheckCircle size={13} /> Forwarded
//                         </div>
//                       )}

//                       {status === "rejected" && (
//                         <div style={{ ...s.statusPill, background: "#FEE2E2", color: "#991B1B", fontSize: "0.8rem", textAlign: "center" }}>
//                           <XCircle size={13} /> Rejected
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </AnimatePresence>
//         )}
//       </div>

//       {/* ===== Detail Modal ===== */}
//       <AnimatePresence>
//         {selectedApp && (() => {
//           const status = getStatus(selectedApp);
//           const sc     = statusConfig[status] || statusConfig.pending;
//           const name   = selectedApp.studentId?.name || "Unknown";
//           const intern = internships.find(
//             (i) => i._id === (selectedApp.internshipId?._id || selectedApp.internshipId)
//           ) || selectedApp.internshipId || {};

//           return (
//             <motion.div
//               style={s.overlay}
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               onClick={() => setSelectedApp(null)}
//             >
//               <motion.div
//                 style={s.modal}
//                 initial={{ scale: 0.85, y: 40, opacity: 0 }}
//                 animate={{ scale: 1,    y: 0,  opacity: 1 }}
//                 exit={{    scale: 0.9,  opacity: 0 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 26 }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Modal Header */}
//                 <div style={s.modalHeader}>
//                   <div style={s.modalHeaderContent}>
//                     <div style={s.modalAvatar}>{initials(name)}</div>
//                     <div>
//                       <h2 style={s.modalName}>{name}</h2>
//                       <p style={s.modalSub}>
//                         {selectedApp.studentId?.department || ""} · {selectedApp.studentId?.email || ""}
//                       </p>
//                     </div>
//                     <span style={{ ...s.statusPill, background: sc.bg, color: sc.color, marginLeft: "auto" }}>
//                       {sc.icon} {sc.label}
//                     </span>
//                   </div>
//                 </div>

//                 <div style={s.modalBody}>
//                   {/* Position Info */}
//                   <div style={s.modalSection}>
//                     <h4 style={s.sectionTitle}><Building2 size={14} /> Applied Position</h4>
//                     <div style={s.infoGrid}>
//                       <div style={s.infoCell}><span style={s.infoLabel}>Post Title</span><span style={s.infoVal}>{intern.title || "-"}</span></div>
//                       <div style={s.infoCell}><span style={s.infoLabel}>Company</span><span style={s.infoVal}>{intern.company || "-"}</span></div>
//                       <div style={s.infoCell}><span style={s.infoLabel}>Applied On</span><span style={s.infoVal}>{fmt(selectedApp.appliedAt)}</span></div>
//                       <div style={s.infoCell}><span style={s.infoLabel}>Incharge Approved</span><span style={s.infoVal}>{fmt(selectedApp.internshipInchargeApproval?.approvedAt)}</span></div>
//                     </div>
//                   </div>

//                   {/* Match Score */}
//                   {selectedApp.matchScore != null && (
//                     <div style={s.modalSection}>
//                       <h4 style={s.sectionTitle}><Target size={14} /> Match Analysis</h4>
//                       <div style={{
//                         display: "flex", alignItems: "center", gap: 14,
//                         padding: "13px 16px",
//                         background: selectedApp.matchScore >= 70 ? "#f0fdf4" : "#fffbeb",
//                         border: `1px solid ${selectedApp.matchScore >= 70 ? "#bbf7d0" : "#fde68a"}`,
//                         borderRadius: 12, marginBottom: 12
//                       }}>
//                         <Target size={20} color={selectedApp.matchScore >= 70 ? "#15803d" : "#b45309"} />
//                         <div style={{ flex: 1 }}>
//                           <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedApp.matchScore}% Match Score</div>
//                           <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
//                             {selectedApp.matchingSkills?.length || 0} matching · {selectedApp.missingSkills?.length || 0} missing
//                           </div>
//                         </div>
//                         <div style={{ width: 90, height: 6, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
//                           <div style={{
//                             height: "100%", borderRadius: 99,
//                             width: `${selectedApp.matchScore}%`,
//                             background: selectedApp.matchScore >= 70 ? "#22c55e" : "#f97316",
//                           }} />
//                         </div>
//                       </div>
//                       {selectedApp.matchingSkills?.length > 0 && (
//                         <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
//                           {selectedApp.matchingSkills.map((s, i) => (
//                             <span key={i} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>{s}</span>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Student Profile */}
//                   <div style={s.modalSection}>
//                     <h4 style={s.sectionTitle}><GraduationCap size={14} /> Student Profile</h4>
//                     <div style={s.infoGrid}>
//                       <div style={s.infoCell}><span style={s.infoLabel}>Email</span><span style={s.infoVal}>{selectedApp.studentId?.email || "-"}</span></div>
//                       <div style={s.infoCell}><span style={s.infoLabel}>Department</span><span style={s.infoVal}>{selectedApp.studentId?.department || "-"}</span></div>
//                       <div style={s.infoCell}><span style={s.infoLabel}>Roll No.</span><span style={s.infoVal}>{selectedApp.studentId?.rollNumber || selectedApp.studentId?.studentId || "-"}</span></div>
//                       {selectedApp.cvSnapshot && (
//                         <div style={s.infoCell}>
//                           <span style={s.infoLabel}>CV</span>
//                           <a href={`${BASE}${selectedApp.cvSnapshot}`} target="_blank" rel="noreferrer"
//                             style={{ ...s.infoVal, color: "#3B82F6", cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
//                             <FileText size={12} /> View CV
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Incharge Remarks */}
//                   {selectedApp.internshipInchargeApproval?.remarks && (
//                     <div style={s.modalSection}>
//                       <h4 style={s.sectionTitle}><Info size={14} /> Internship Incharge Remarks</h4>
//                       <div style={s.noteBox}>{selectedApp.internshipInchargeApproval.remarks}</div>
//                     </div>
//                   )}

//                   {/* Your Note input (if pending) */}
//                   {status === "pending" && (
//                     <div style={s.modalSection}>
//                       <h4 style={s.sectionTitle}><FileText size={14} /> Your Remarks (Optional)</h4>
//                       <textarea
//                         style={s.noteTextarea}
//                         placeholder="Add a note before forwarding or rejecting..."
//                         value={noteInput}
//                         onChange={(e) => setNoteInput(e.target.value)}
//                         rows={3}
//                       />
//                     </div>
//                   )}

//                   {/* Existing liaison note */}
//                   {selectedApp.liaisonNote && status !== "pending" && (
//                     <div style={s.modalSection}>
//                       <h4 style={s.sectionTitle}><FileText size={14} /> Your Remarks</h4>
//                       <div style={{ ...s.noteBox, background: sc.bg, borderColor: sc.color + "40", color: sc.color }}>
//                         {selectedApp.liaisonNote}
//                       </div>
//                     </div>
//                   )}

//                   {/* Action Buttons inside modal */}
//                   {status === "pending" && (
//                     <div style={s.modalActions}>
//                       <motion.button
//                         whileTap={{ scale: 0.96 }}
//                         style={s.modalBtnReject}
//                         onClick={() => { setConfirmModal({ app: selectedApp, action: "Reject" }); }}
//                       >
//                         <XCircle size={16} /> Reject Application
//                       </motion.button>
//                       <motion.button
//                         whileTap={{ scale: 0.96 }}
//                         style={s.modalBtnForward}
//                         onClick={() => { setConfirmModal({ app: selectedApp, action: "Forward" }); }}
//                       >
//                         <Send size={16} /> Forward to Industry <ArrowRight size={16} />
//                       </motion.button>
//                     </div>
//                   )}
//                 </div>

//                 <button style={s.closeBtn} onClick={() => setSelectedApp(null)}>Close</button>
//               </motion.div>
//             </motion.div>
//           );
//         })()}
//       </AnimatePresence>

//       {/* ===== Confirm Modal ===== */}
//       <AnimatePresence>
//         {confirmModal && (
//           <motion.div
//             style={{ ...s.overlay, zIndex: 1100 }}
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             onClick={() => setConfirmModal(null)}
//           >
//             <motion.div
//               style={s.confirmBox}
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1,   opacity: 1 }}
//               exit={{    scale: 0.85, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 350, damping: 28 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div style={{
//                 ...s.confirmIcon,
//                 background: confirmModal.action === "Forward" ? "#DBEAFE" : "#FEE2E2",
//               }}>
//                 {confirmModal.action === "Forward"
//                   ? <Send size={28} color="#1D4ED8" />
//                   : <XCircle size={28} color="#DC2626" />}
//               </div>
//               <h3 style={s.confirmTitle}>
//                 {confirmModal.action === "Forward" ? "Forward to Industry?" : "Reject Application?"}
//               </h3>
//               <p style={s.confirmMsg}>
//                 {confirmModal.action === "Forward"
//                   ? `Forward ${confirmModal.app.studentId?.name || "this student"}'s application to the industry partner?`
//                   : `Reject ${confirmModal.app.studentId?.name || "this student"}'s application? The student will be notified.`}
//               </p>

//               <div style={s.noteInputWrap}>
//                 <label style={s.noteLabel}>Add a remark (optional)</label>
//                 <textarea
//                   style={s.noteTextarea}
//                   rows={2}
//                   value={noteInput}
//                   onChange={(e) => setNoteInput(e.target.value)}
//                   placeholder={
//                     confirmModal.action === "Forward"
//                       ? "e.g. Strong candidate, please prioritize."
//                       : "e.g. Insufficient experience for this role."
//                   }
//                 />
//               </div>

//               <div style={s.confirmBtns}>
//                 <button
//                   style={s.cancelBtn}
//                   onClick={() => { setConfirmModal(null); setNoteInput(""); }}
//                 >
//                   Cancel
//                 </button>
//                 <motion.button
//                   whileTap={{ scale: 0.95 }}
//                   style={confirmModal.action === "Forward" ? s.confirmFwdBtn : s.confirmRejBtn}
//                   onClick={() =>
//                     confirmModal.action === "Forward"
//                       ? handleForward(confirmModal.app._id)
//                       : handleReject(confirmModal.app._id)
//                   }
//                 >
//                   {confirmModal.action === "Forward"
//                     ? <><Send size={15} /> Confirm Forward</>
//                     : <><XCircle size={15} /> Confirm Reject</>}
//                 </motion.button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const s = {
//   page: {
//     padding: "36px 48px",
//     background: "#F8FAFC",
//     minHeight: "100vh",
//     fontFamily: "'Inter', sans-serif",
//     position: "relative",
//   },
//   toast: {
//     position: "fixed", top: "20px", left: "50%",
//     display: "flex", alignItems: "center", gap: "8px",
//     color: "#fff", padding: "12px 24px", borderRadius: "12px",
//     fontWeight: "600", fontSize: "0.88rem",
//     boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 9999,
//   },
//   header: {
//     display: "flex", justifyContent: "space-between",
//     alignItems: "flex-start", marginBottom: "24px",
//     flexWrap: "wrap", gap: "16px",
//   },
//   headerLeft: { display: "flex", alignItems: "flex-start", gap: "16px" },
//   headerIcon: {
//     background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
//     borderRadius: "14px", padding: "12px",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
//   },
//   title: { fontSize: "1.65rem", fontWeight: "800", color: "#0F172A", margin: 0 },
//   subtitle: { color: "#64748B", fontSize: "0.87rem", marginTop: "5px" },
//   flowBadge: {
//     display: "flex", alignItems: "center", gap: "8px",
//     background: "#fff", borderRadius: "12px", padding: "10px 16px",
//     border: "1.5px solid #E2E8F0", fontSize: "0.8rem", flexWrap: "wrap",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//   },
//   flowStep: { color: "#94A3B8", fontWeight: "500" },
//   flowStepActive: {
//     background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
//     WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//     fontWeight: "700",
//   },

//   // stat cards
//   statRow: {
//     display: "grid", gridTemplateColumns: "repeat(4,1fr)",
//     gap: "14px", marginBottom: "24px",
//   },
//   statCard: {
//     borderRadius: "14px", padding: "18px 20px",
//     border: "1px solid #E8EDF5",
//     display: "flex", alignItems: "center", gap: "14px",
//     boxShadow: "0 2px 10px rgba(15,23,42,0.05)",
//   },
//   statIcon: {
//     width: 46, height: 46, borderRadius: 12, flexShrink: 0,
//     display: "flex", alignItems: "center", justifyContent: "center",
//   },

//   tabs: { display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" },
//   tab: {
//     display: "flex", alignItems: "center", gap: "7px",
//     padding: "9px 18px", borderRadius: "10px",
//     border: "1.5px solid #E2E8F0", background: "#fff",
//     color: "#475569", fontSize: "0.84rem", fontWeight: "600", cursor: "pointer",
//   },
//   tabActive: { background: "#0F172A", color: "#fff", borderColor: "#0F172A" },
//   tabDot: { width: "7px", height: "7px", borderRadius: "50%" },
//   tabCount: {
//     padding: "2px 8px", borderRadius: "20px",
//     fontSize: "0.75rem", fontWeight: "700",
//   },
//   searchWrap: {
//     display: "flex", alignItems: "center", gap: "10px",
//     background: "#fff", borderRadius: "12px", padding: "10px 16px",
//     border: "1.5px solid #E2E8F0", marginBottom: "22px",
//     boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//   },
//   searchInput: {
//     border: "none", outline: "none", fontSize: "0.87rem",
//     background: "transparent", width: "100%", color: "#0F172A",
//   },
//   list: { display: "flex", flexDirection: "column", gap: "14px" },
//   empty: {
//     display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0",
//   },
//   card: {
//     background: "#fff", borderRadius: "14px",
//     boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
//     display: "flex", overflow: "hidden",
//     transition: "box-shadow 0.25s, transform 0.25s",
//   },
//   cardAccent: { width: "5px", flexShrink: 0 },
//   cardBody: {
//     flex: 1, padding: "18px 20px",
//     display: "flex", flexDirection: "column", gap: "9px",
//   },
//   studentSection: { display: "flex", alignItems: "center", gap: "12px" },
//   avatarLg: {
//     width: "44px", height: "44px", borderRadius: "50%",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: "1rem", fontWeight: "800", flexShrink: 0,
//   },
//   studentName: { fontSize: "1rem", fontWeight: "700", color: "#0F172A" },
//   studentMeta: {
//     display: "flex", gap: "6px", alignItems: "center",
//     fontSize: "0.77rem", color: "#94A3B8", flexWrap: "wrap", marginTop: "3px",
//   },
//   postSection: { display: "flex", flexDirection: "column", gap: "6px" },
//   postTitle: {
//     display: "flex", alignItems: "center", gap: "7px",
//     fontSize: "0.9rem", fontWeight: "600", color: "#1E40AF",
//   },
//   postMeta: { display: "flex", gap: "7px", flexWrap: "wrap", alignItems: "center" },
//   badge: {
//     display: "inline-flex", alignItems: "center", gap: "4px",
//     padding: "3px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: "600",
//   },
//   metaRow: { display: "flex", gap: "16px", flexWrap: "wrap" },
//   metaItem: {
//     display: "flex", alignItems: "center", gap: "5px",
//     fontSize: "0.77rem", color: "#64748B",
//   },
//   inchargeNote: {
//     display: "flex", alignItems: "flex-start", gap: "8px",
//     background: "#F0F4FF", borderRadius: "9px", padding: "9px 13px",
//     fontSize: "0.81rem", color: "#3730A3", lineHeight: 1.5,
//     border: "1px solid #C7D2FE",
//   },
//   cardRight: {
//     padding: "18px 20px", display: "flex", flexDirection: "column",
//     alignItems: "flex-end", justifyContent: "space-between",
//     gap: "10px", minWidth: "178px", borderLeft: "1px solid #F1F5F9",
//   },
//   statusPill: {
//     display: "inline-flex", alignItems: "center", gap: "5px",
//     padding: "5px 12px", borderRadius: "20px",
//     fontSize: "0.76rem", fontWeight: "700", whiteSpace: "nowrap",
//   },
//   actionBtns: { display: "flex", flexDirection: "column", gap: "7px", width: "100%" },
//   btnView: {
//     display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
//     background: "#F8FAFC", color: "#475569", border: "1.5px solid #E2E8F0",
//     borderRadius: "9px", padding: "8px 12px", fontSize: "0.81rem",
//     fontWeight: "600", cursor: "pointer",
//   },
//   btnForward: {
//     display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
//     background: "#EFF6FF", color: "#1D4ED8", border: "1.5px solid #BFDBFE",
//     borderRadius: "9px", padding: "8px 12px", fontSize: "0.81rem",
//     fontWeight: "600", cursor: "pointer",
//   },
//   btnReject: {
//     display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
//     background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA",
//     borderRadius: "9px", padding: "8px 12px", fontSize: "0.81rem",
//     fontWeight: "600", cursor: "pointer",
//   },

//   /* Detail Modal */
//   overlay: {
//     position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     zIndex: 1000, backdropFilter: "blur(4px)",
//   },
//   modal: {
//     background: "#fff", borderRadius: "22px",
//     width: "620px", maxWidth: "96vw", maxHeight: "92vh", overflowY: "auto",
//     boxShadow: "0 30px 70px rgba(0,0,0,0.28)",
//   },
//   modalHeader: {
//     background: "linear-gradient(135deg, #0F172A, #1E3A5F)",
//     padding: "24px", borderRadius: "22px 22px 0 0",
//   },
//   modalHeaderContent: { display: "flex", alignItems: "center", gap: "14px" },
//   modalAvatar: {
//     width: "48px", height: "48px", borderRadius: "50%",
//     background: "rgba(255,255,255,0.15)", color: "#fff",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: "1.1rem", fontWeight: "800", flexShrink: 0,
//   },
//   modalName: { fontSize: "1.15rem", fontWeight: "800", color: "#fff", margin: 0 },
//   modalSub:  { color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", margin: "4px 0 0 0" },
//   modalBody: { padding: "22px 24px" },
//   modalSection: { marginBottom: "18px" },
//   sectionTitle: {
//     display: "flex", alignItems: "center", gap: "7px",
//     fontSize: "0.82rem", fontWeight: "700", color: "#475569",
//     textTransform: "uppercase", letterSpacing: "0.05em",
//     marginBottom: "12px", paddingBottom: "8px",
//     borderBottom: "1px solid #F1F5F9",
//   },
//   infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
//   infoCell: {
//     background: "#F8FAFC", borderRadius: "10px", padding: "10px 14px",
//     border: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "3px",
//   },
//   infoLabel: { fontSize: "0.69rem", color: "#94A3B8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em" },
//   infoVal:   { fontSize: "0.85rem", color: "#0F172A", fontWeight: "600" },
//   noteBox: {
//     fontSize: "0.85rem", color: "#3730A3", background: "#F0F4FF",
//     borderRadius: "10px", padding: "14px", border: "1px solid #C7D2FE", lineHeight: 1.6,
//   },
//   noteTextarea: {
//     width: "100%", border: "1.5px solid #E2E8F0", borderRadius: "10px",
//     padding: "12px", fontSize: "0.85rem", color: "#0F172A",
//     resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box",
//   },
//   modalActions: { display: "flex", gap: "12px", marginTop: "20px" },
//   modalBtnReject: {
//     flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//     background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA",
//     borderRadius: "12px", padding: "12px", fontWeight: "600", fontSize: "0.88rem", cursor: "pointer",
//   },
//   modalBtnForward: {
//     flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//     background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff",
//     border: "none", borderRadius: "12px", padding: "12px",
//     fontWeight: "700", fontSize: "0.88rem", cursor: "pointer",
//     boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
//   },
//   closeBtn: {
//     display: "block", width: "calc(100% - 48px)", margin: "0 24px 24px",
//     background: "#F1F5F9", color: "#475569", border: "none",
//     borderRadius: "12px", padding: "11px", fontWeight: "600",
//     fontSize: "0.88rem", cursor: "pointer",
//   },

//   /* Confirm Modal */
//   confirmBox: {
//     background: "#fff", borderRadius: "22px", padding: "32px",
//     width: "420px", maxWidth: "95vw", textAlign: "center",
//     boxShadow: "0 25px 60px rgba(0,0,0,0.28)",
//   },
//   confirmIcon: {
//     width: "64px", height: "64px", borderRadius: "50%",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     margin: "0 auto 18px",
//   },
//   confirmTitle: { fontSize: "1.2rem", fontWeight: "800", color: "#0F172A", margin: "0 0 10px" },
//   confirmMsg:   { fontSize: "0.87rem", color: "#64748B", lineHeight: 1.65, marginBottom: "20px" },
//   noteInputWrap: { textAlign: "left", marginBottom: "20px" },
//   noteLabel:    { display: "block", fontSize: "0.79rem", color: "#64748B", fontWeight: "600", marginBottom: "6px" },
//   confirmBtns:  { display: "flex", gap: "12px" },
//   cancelBtn: {
//     flex: 1, background: "#F1F5F9", color: "#64748B", border: "none",
//     borderRadius: "12px", padding: "12px", fontWeight: "600", cursor: "pointer",
//   },
//   confirmFwdBtn: {
//     flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//     background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff",
//     border: "none", borderRadius: "12px", padding: "12px",
//     fontWeight: "700", cursor: "pointer",
//     boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
//   },
//   confirmRejBtn: {
//     flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//     background: "#DC2626", color: "#fff", border: "none",
//     borderRadius: "12px", padding: "12px", fontWeight: "700", cursor: "pointer",
//     boxShadow: "0 4px 14px rgba(220,38,38,0.3)",
//   },
// };

// // ─── Demo Data (fallback when backend offline) ────────────────────────────────
// const DEMO_INTERNSHIPS = [
//   { _id: "int_1", title: "AI Research Internship",    company: "TechNova",  type: "Research" },
//   { _id: "int_2", title: "Smart Agriculture Project", company: "AgriX",     type: "Internship" },
//   { _id: "int_3", title: "IoT Manufacturing",         company: "IndusTech", type: "Internship" },
// ];

// const DEMO_APPS = [
//   {
//     _id: "app_3",
//     studentId: { name: "Zara Khan", email: "zara.khan@uni.edu", department: "BSCS", rollNumber: "CS-2021" },
//     internshipId: { _id: "int_2", title: "Smart Agriculture Project", company: "AgriX", type: "Internship" },
//     status: "sent_to_liaison", matchScore: 91,
//     matchingSkills: ["IoT", "Arduino", "C", "Sensor Networks"], missingSkills: [],
//     appliedAt: "2025-11-06T08:15:00.000Z",
//     internshipInchargeApproval: { status: "approved", approvedAt: "2025-11-08T14:00:00.000Z", remarks: "Excellent practical experience with IoT. Highly recommended." },
//     liaisonStatus: "pending", liaisonNote: "",
//   },
//   {
//     _id: "app_5",
//     studentId: { name: "Ali Raza", email: "ali.raza@uni.edu", department: "BSIT", rollNumber: "IT-2034" },
//     internshipId: { _id: "int_1", title: "AI Research Internship", company: "TechNova", type: "Research" },
//     status: "sent_to_liaison", matchScore: 78,
//     matchingSkills: ["Python", "ML", "Data Analysis"], missingSkills: ["TensorFlow"],
//     appliedAt: "2025-11-07T09:00:00.000Z",
//     internshipInchargeApproval: { status: "approved", approvedAt: "2025-11-09T11:00:00.000Z", remarks: "Good academic record, solid Python skills." },
//     liaisonStatus: "pending", liaisonNote: "",
//   },
//   {
//     _id: "app_6",
//     studentId: { name: "Mehak Fatima", email: "mehak.f@uni.edu", department: "BSCS", rollNumber: "CS-2044" },
//     internshipId: { _id: "int_3", title: "IoT Manufacturing", company: "IndusTech", type: "Internship" },
//     status: "sent_to_liaison", matchScore: 85,
//     matchingSkills: ["C++", "Embedded Systems", "RTOS"], missingSkills: ["PCB Design"],
//     appliedAt: "2025-11-05T10:30:00.000Z",
//     internshipInchargeApproval: { status: "approved", approvedAt: "2025-11-10T08:00:00.000Z", remarks: "Strong embedded systems background. Completed relevant FYP." },
//     liaisonStatus: "pending", liaisonNote: "",
//   },
// ];

// export default StudentApplications;








// import React, { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Users, CheckCircle, XCircle, Clock, Eye, Send,
//   Search, ChevronRight, Building2, GraduationCap,
//   AlertCircle, FileText, Calendar, Tag, Info, Inbox,
//   RefreshCw, Loader2, Target,
// } from "lucide-react";

// // ─── CONFIG ───────────────────────────────────────────────────────────────────
// const BASE = "http://localhost:5000";
// const API  = `${BASE}/api/liaison`;

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const fmt = (iso) =>
//   iso
//     ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
//     : "-";

// const initials = (name = "") =>
//   name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

// // ── Resolve student name/email from whatever shape the backend returns ────────
// // Backend now sets app.studentId = resolvedStudent (with name + email)
// // but we also handle raw studentEmail as ultimate fallback
// const getStudentName = (app) => {
//   if (app.studentId?.name)  return app.studentId.name;
//   if (app.studentEmail)     return app.studentEmail.split("@")[0];
//   return "Unknown Student";
// };
// const getStudentEmail = (app) => {
//   if (app.studentId?.email) return app.studentId.email;
//   if (app.studentEmail)     return app.studentEmail;
//   return "";
// };
// const getStudentDept = (app) =>
//   app.studentId?.department || app.studentId?.program || "";
// const getStudentCgpa = (app) =>
//   app.studentId?.cgpa || "";

// // ── Resolve internship ────────────────────────────────────────────────────────
// const getInternTitle   = (app) => app.internshipId?.title   || app.resolvedInternship?.title   || "-";
// const getInternCompany = (app) => app.internshipId?.company || app.resolvedInternship?.company || "-";
// const getInternType    = (app) => app.internshipId?.type    || app.resolvedInternship?.type    || "";
// const getInternSkills  = (app) => app.internshipId?.requiredSkills || app.resolvedInternship?.requiredSkills || [];

// // ─────────────────────────────────────────────────────────────────────────────
// const statusConfig = {
//   pending:   { bg: "#FEF3C7", color: "#92400E", icon: <Clock size={13} />,   label: "Pending Review" },
//   forwarded: { bg: "#DBEAFE", color: "#1E40AF", icon: <Send size={13} />,    label: "Forwarded to Industry" },
//   rejected:  { bg: "#FEE2E2", color: "#991B1B", icon: <XCircle size={13} />, label: "Rejected" },
// };

// const typeConfig = {
//   Internship: { bg: "#FCE7F3", color: "#BE185D" },
//   Research:   { bg: "#D1FAE5", color: "#065F46" },
//   Project:    { bg: "#EDE9FE", color: "#6D28D9" },
//   Workshop:   { bg: "#FEF9C3", color: "#854D0E" },
// };

// const AVATAR_COLORS = [
//   { bg: "#DBEAFE", color: "#1D4ED8" },
//   { bg: "#EDE9FE", color: "#6D28D9" },
//   { bg: "#FCE7F3", color: "#BE185D" },
//   { bg: "#D1FAE5", color: "#065F46" },
//   { bg: "#FEF3C7", color: "#92400E" },
// ];

// function Spinner({ size = 16, color = "#1d4ed8" }) {
//   return (
//     <motion.div
//       animate={{ rotate: 360 }}
//       transition={{ repeat: Infinity, duration: 0.75, ease: "linear" }}
//       style={{ width: size, height: size, display: "inline-flex" }}
//     >
//       <Loader2 size={size} color={color} />
//     </motion.div>
//   );
// }

// // ─── Component ────────────────────────────────────────────────────────────────
// const StudentApplications = () => {
//   const [applications,  setApplications]  = useState([]);
//   const [internships,   setInternships]   = useState([]);
//   const [loading,       setLoading]       = useState(true);
//   const [actionLoading, setActionLoading] = useState({});
//   const [selectedApp,   setSelectedApp]   = useState(null);
//   const [filterStatus,  setFilterStatus]  = useState("All");
//   const [searchQuery,   setSearchQuery]   = useState("");
//   const [noteInput,     setNoteInput]     = useState("");
//   const [confirmModal,  setConfirmModal]  = useState(null);
//   const [toast,         setToast]         = useState(null);

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3500);
//   };

//   // ── FETCH ─────────────────────────────────────────────────────────────────
//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [appRes, intRes] = await Promise.all([
//         fetch(`${API}/applications`),
//         fetch(`${BASE}/api/incharge/internships`),
//       ]);
//       const appJson = await appRes.json();
//       const intJson = await intRes.json();
//       setApplications(appJson.data || []);
//       setInternships(intJson.data  || []);
//     } catch {
//       showToast("Backend unavailable - showing demo data", "warn");
//       setApplications(DEMO_APPS);
//       setInternships(DEMO_INTERNSHIPS);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   // ── FORWARD ───────────────────────────────────────────────────────────────
//   const handleForward = async (appId) => {
//     setConfirmModal(null);
//     setActionLoading((p) => ({ ...p, [appId]: "forwarding" }));
//     try {
//       const res  = await fetch(`${API}/applications/${appId}/forward`, {
//         method:  "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify({ remarks: noteInput || "" }),
//       });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json.message);
//       setApplications((prev) =>
//         prev.map((a) =>
//           a._id === appId ? { ...a, liaisonStatus: "forwarded", liaisonNote: noteInput } : a
//         )
//       );
//       showToast("Application forwarded to industry ✓", "success");
//     } catch {
//       // optimistic update for demo/offline
//       setApplications((prev) =>
//         prev.map((a) =>
//           a._id === appId ? { ...a, liaisonStatus: "forwarded", liaisonNote: noteInput } : a
//         )
//       );
//       showToast("Forwarded (demo mode) ✓", "success");
//     } finally {
//       setNoteInput("");
//       setSelectedApp(null);
//       setActionLoading((p) => ({ ...p, [appId]: null }));
//     }
//   };

//   // ── REJECT ────────────────────────────────────────────────────────────────
//   const handleReject = async (appId) => {
//     setConfirmModal(null);
//     setActionLoading((p) => ({ ...p, [appId]: "rejecting" }));
//     try {
//       const res  = await fetch(`${API}/applications/${appId}/reject`, {
//         method:  "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify({ remarks: noteInput || "" }),
//       });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json.message);
//       setApplications((prev) =>
//         prev.map((a) =>
//           a._id === appId ? { ...a, liaisonStatus: "rejected", liaisonNote: noteInput } : a
//         )
//       );
//       showToast("Application rejected. Student will be notified.", "error");
//     } catch {
//       setApplications((prev) =>
//         prev.map((a) =>
//           a._id === appId ? { ...a, liaisonStatus: "rejected", liaisonNote: noteInput } : a
//         )
//       );
//       showToast("Rejected (demo mode)", "error");
//     } finally {
//       setNoteInput("");
//       setSelectedApp(null);
//       setActionLoading((p) => ({ ...p, [appId]: null }));
//     }
//   };

//   // ── Derived ────────────────────────────────────────────────────────────────
//   const getStatus = (app) => app.liaisonStatus || "pending";

//   const filtered = applications.filter((a) => {
//     const name    = getStudentName(a).toLowerCase();
//     const email   = getStudentEmail(a).toLowerCase();
//     const title   = getInternTitle(a).toLowerCase();
//     const company = getInternCompany(a).toLowerCase();
//     const q       = searchQuery.toLowerCase();
//     const matchSearch =
//       name.includes(q) || email.includes(q) ||
//       title.includes(q) || company.includes(q);
//     const matchStatus =
//       filterStatus === "All" ||
//       (filterStatus === "Pending"   && getStatus(a) === "pending") ||
//       (filterStatus === "Forwarded" && getStatus(a) === "forwarded") ||
//       (filterStatus === "Rejected"  && getStatus(a) === "rejected");
//     return matchSearch && matchStatus;
//   });

//   const counts = {
//     All:       applications.length,
//     Pending:   applications.filter((a) => getStatus(a) === "pending").length,
//     Forwarded: applications.filter((a) => getStatus(a) === "forwarded").length,
//     Rejected:  applications.filter((a) => getStatus(a) === "rejected").length,
//   };

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div style={s.page}>

//       {/* Toast */}
//       <AnimatePresence>
//         {toast && (
//           <motion.div
//             style={{
//               ...s.toast,
//               background:
//                 toast.type === "success" ? "#10B981" :
//                 toast.type === "error"   ? "#EF4444" : "#F59E0B",
//             }}
//             initial={{ opacity: 0, y: -50, x: "-50%" }}
//             animate={{ opacity: 1, y: 0,   x: "-50%" }}
//             exit={{    opacity: 0, y: -50,  x: "-50%" }}
//           >
//             {toast.type === "success" ? <CheckCircle size={16} /> :
//              toast.type === "error"   ? <XCircle size={16} />     :
//              <AlertCircle size={16} />}
//             {toast.msg}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Page Header */}
//       <div style={s.header}>
//         <div style={s.headerLeft}>
//           <div style={s.headerIcon}><Inbox size={22} color="#fff" /></div>
//           <div>
//             <h1 style={s.title}>Student Applications</h1>
//             <p style={s.subtitle}>
//               Review applications approved by Internship Incharge · Forward or reject to send to industry.
//             </p>
//           </div>
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <button
//             onClick={fetchData} title="Refresh"
//             style={{
//               width: 40, height: 40, borderRadius: 10,
//               background: "#fff", border: "1px solid #E2E8F0",
//               cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
//               boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//             }}
//           >
//             {loading
//               ? <Spinner size={15} color="#64748b" />
//               : <RefreshCw size={15} color="#64748b" />}
//           </button>

//           <div style={s.flowBadge}>
//             <span style={s.flowStep}>Student</span>
//             <ChevronRight size={14} color="#94A3B8" />
//             <span style={s.flowStep}>Incharge ✓</span>
//             <ChevronRight size={14} color="#94A3B8" />
//             <span style={{ ...s.flowStep, ...s.flowStepActive }}>Industry Liaison</span>
//             <ChevronRight size={14} color="#94A3B8" />
//             <span style={s.flowStep}>Industry</span>
//           </div>
//         </div>
//       </div>

//       {/* Stat Cards */}
//       <div style={s.statRow}>
//         {[
//           { label: "Total Received", value: counts.All,       color: "#6366F1", bg: "#EEF2FF", Icon: Inbox    },
//           { label: "Pending Review", value: counts.Pending,   color: "#D97706", bg: "#FFFBEB", Icon: Clock    },
//           { label: "Forwarded",      value: counts.Forwarded, color: "#1D4ED8", bg: "#EFF6FF", Icon: Send     },
//           { label: "Rejected",       value: counts.Rejected,  color: "#DC2626", bg: "#FEF2F2", Icon: XCircle  },
//         ].map(({ label, value, color, bg, Icon }, i) => (
//           <motion.div
//             key={label}
//             style={{ ...s.statCard }}
//             initial={{ opacity: 0, y: 14 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.06 }}
//           >
//             <div style={{ ...s.statIcon, background: bg }}>
//               <Icon size={18} color={color} />
//             </div>
//             <div>
//               <div style={s.statLabel}>{label}</div>
//               <div style={s.statValue}>{value}</div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* Tabs */}
//       <div style={s.tabs}>
//         {["All", "Pending", "Forwarded", "Rejected"].map((tab) => {
//           const active = filterStatus === tab;
//           const sc = tab === "All" ? null : statusConfig[tab.toLowerCase()];
//           return (
//             <motion.button
//               key={tab}
//               whileTap={{ scale: 0.96 }}
//               style={{ ...s.tab, ...(active ? s.tabActive : {}) }}
//               onClick={() => setFilterStatus(tab)}
//             >
//               {sc && <span style={{ ...s.tabDot, background: sc.color }} />}
//               {tab}
//               <span style={{
//                 ...s.tabCount,
//                 background: active ? "rgba(255,255,255,0.22)" : "#F1F5F9",
//               }}>
//                 {counts[tab]}
//               </span>
//             </motion.button>
//           );
//         })}
//       </div>

//       {/* Search */}
//       <div style={s.searchWrap}>
//         <Search size={16} color="#9CA3AF" />
//         <input
//           style={s.searchInput}
//           placeholder="Search by student name, email, internship title or company..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* List */}
//       <div style={s.list}>
//         {loading ? (
//           <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
//             <Spinner size={32} color="#1d4ed8" />
//           </div>
//         ) : filtered.length === 0 ? (
//           <motion.div style={s.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//             <Inbox size={52} color="#E2E8F0" />
//             <p style={{ color: "#94A3B8", marginTop: 12, fontSize: 14 }}>
//               {applications.length === 0
//                 ? "No applications forwarded by Incharge yet."
//                 : "No applications match your filters."}
//             </p>
//           </motion.div>
//         ) : (
//           <AnimatePresence>
//             {filtered.map((app, idx) => {
//               const status  = getStatus(app);
//               const sc      = statusConfig[status] || statusConfig.pending;
//               const name    = getStudentName(app);
//               const email   = getStudentEmail(app);
//               const dept    = getStudentDept(app);
//               const cgpa    = getStudentCgpa(app);
//               const type    = getInternType(app);
//               const tc      = typeConfig[type] || typeConfig.Project;
//               const skills  = getInternSkills(app);
//               const avc     = AVATAR_COLORS[idx % AVATAR_COLORS.length];
//               const busy    = actionLoading[app._id];

//               return (
//                 <motion.div
//                   key={app._id}
//                   style={s.card}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, x: -40 }}
//                   transition={{ delay: idx * 0.04 }}
//                   whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
//                 >
//                   <div style={{ ...s.cardAccent, background: sc.color }} />

//                   <div style={s.cardBody}>
//                     {/* Student */}
//                     <div style={s.studentSection}>
//                       <div style={{ ...s.avatarLg, background: avc.bg, color: avc.color }}>
//                         {initials(name)}
//                       </div>
//                       <div>
//                         <div style={s.studentName}>{name}</div>
//                         <div style={s.studentMeta}>
//                           {dept  && <span><GraduationCap size={12} /> {dept}</span>}
//                           {cgpa  && <><span>·</span><span>CGPA: {cgpa}</span></>}
//                           {email && <><span>·</span><span>{email}</span></>}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Internship */}
//                     <div style={s.postSection}>
//                       <div style={s.postTitle}>
//                         <Building2 size={14} color="#3B82F6" />
//                         {getInternTitle(app)}
//                         {getInternCompany(app) !== "-" && (
//                           <span style={{ fontWeight: 400, color: "#94A3B8" }}>
//                             {" · "}{getInternCompany(app)}
//                           </span>
//                         )}
//                       </div>
//                       <div style={s.postMeta}>
//                         {type && (
//                           <span style={{ ...s.badge, background: tc.bg, color: tc.color }}>
//                             <Tag size={10} /> {type}
//                           </span>
//                         )}
//                         {skills.slice(0, 3).map((sk, i) => (
//                           <span key={i} style={s.skillChip}>{sk}</span>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Dates + match */}
//                     <div style={s.metaRow}>
//                       <span style={s.metaItem}>
//                         <Calendar size={12} /> Applied: {fmt(app.appliedAt || app.createdAt)}
//                       </span>
//                       <span style={s.metaItem}>
//                         <CheckCircle size={12} color="#10B981" />
//                         Approved by Incharge:{" "}
//                         {fmt(app.internshipInchargeApproval?.approvedAt || app.updatedAt)}
//                       </span>
//                       {app.matchScore != null && (
//                         <span style={s.metaItem}>
//                           <Target size={12} color="#6366f1" />
//                           Match:{" "}
//                           <strong style={{ color: app.matchScore >= 70 ? "#15803d" : "#b45309" }}>
//                             {app.matchScore}%
//                           </strong>
//                         </span>
//                       )}
//                     </div>

//                     {/* Incharge note */}
//                     {app.internshipInchargeApproval?.remarks && (
//                       <div style={s.inchargeNote}>
//                         <Info size={12} color="#6366F1" />
//                         <span>
//                           <strong>Incharge Note:</strong>{" "}
//                           {app.internshipInchargeApproval.remarks}
//                         </span>
//                       </div>
//                     )}

//                     {/* Liaison note */}
//                     {app.liaisonNote && (
//                       <div style={{
//                         ...s.inchargeNote,
//                         background: sc.bg,
//                         borderColor: sc.color + "50",
//                         color: sc.color,
//                       }}>
//                         <FileText size={12} color={sc.color} />
//                         <span><strong>Your Note:</strong> {app.liaisonNote}</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Right panel */}
//                   <div style={s.cardRight}>
//                     <span style={{ ...s.statusPill, background: sc.bg, color: sc.color }}>
//                       {sc.icon} {sc.label}
//                     </span>

//                     <div style={s.actionBtns}>
//                       <motion.button
//                         whileTap={{ scale: 0.94 }}
//                         style={s.btnView}
//                         onClick={() => { setSelectedApp(app); setNoteInput(app.liaisonNote || ""); }}
//                       >
//                         <Eye size={14} /> Review
//                       </motion.button>

//                       {status === "pending" && (
//                         <>
//                           <motion.button
//                             whileTap={{ scale: 0.94 }}
//                             style={{ ...s.btnForward, opacity: busy ? 0.7 : 1 }}
//                             disabled={!!busy}
//                             onClick={() => { setConfirmModal({ app, action: "Forward" }); setNoteInput(""); }}
//                           >
//                             {busy === "forwarding"
//                               ? <Spinner size={13} color="#1D4ED8" />
//                               : <Send size={14} />}
//                             Forward
//                           </motion.button>
//                           <motion.button
//                             whileTap={{ scale: 0.94 }}
//                             style={{ ...s.btnReject, opacity: busy ? 0.7 : 1 }}
//                             disabled={!!busy}
//                             onClick={() => { setConfirmModal({ app, action: "Reject" }); setNoteInput(""); }}
//                           >
//                             {busy === "rejecting"
//                               ? <Spinner size={13} color="#DC2626" />
//                               : <XCircle size={14} />}
//                             Reject
//                           </motion.button>
//                         </>
//                       )}

//                       {status === "forwarded" && (
//                         <div style={{ ...s.statusPill, background: "#DBEAFE", color: "#1E40AF", fontSize: "0.8rem", textAlign: "center" }}>
//                           <CheckCircle size={13} /> Forwarded
//                         </div>
//                       )}
//                       {status === "rejected" && (
//                         <div style={{ ...s.statusPill, background: "#FEE2E2", color: "#991B1B", fontSize: "0.8rem", textAlign: "center" }}>
//                           <XCircle size={13} /> Rejected
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </AnimatePresence>
//         )}
//       </div>

//       {/* ===== Detail Modal ===== */}
//       <AnimatePresence>
//         {selectedApp && (() => {
//           const status = getStatus(selectedApp);
//           const sc     = statusConfig[status] || statusConfig.pending;
//           const name   = getStudentName(selectedApp);

//           return (
//             <motion.div
//               style={s.overlay}
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               onClick={() => setSelectedApp(null)}
//             >
//               <motion.div
//                 style={s.modal}
//                 initial={{ scale: 0.85, y: 40, opacity: 0 }}
//                 animate={{ scale: 1,    y: 0,  opacity: 1 }}
//                 exit={{    scale: 0.9,  opacity: 0 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 26 }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Modal Header */}
//                 <div style={s.modalHeader}>
//                   <div style={s.modalHeaderContent}>
//                     <div style={s.modalAvatar}>{initials(name)}</div>
//                     <div>
//                       <h2 style={s.modalName}>{name}</h2>
//                       <p style={s.modalSub}>
//                         {getStudentDept(selectedApp)
//                           ? `${getStudentDept(selectedApp)} · ` : ""}
//                         {getStudentEmail(selectedApp)}
//                       </p>
//                     </div>
//                     <span style={{ ...s.statusPill, background: sc.bg, color: sc.color, marginLeft: "auto" }}>
//                       {sc.icon} {sc.label}
//                     </span>
//                   </div>
//                 </div>

//                 <div style={s.modalBody}>
//                   {/* Position */}
//                   <div style={s.modalSection}>
//                     <h4 style={s.sectionTitle}><Building2 size={14} /> Applied Position</h4>
//                     <div style={s.infoGrid}>
//                       <div style={s.infoCell}>
//                         <span style={s.infoLabel}>Post Title</span>
//                         <span style={s.infoVal}>{getInternTitle(selectedApp)}</span>
//                       </div>
//                       <div style={s.infoCell}>
//                         <span style={s.infoLabel}>Company</span>
//                         <span style={s.infoVal}>{getInternCompany(selectedApp)}</span>
//                       </div>
//                       <div style={s.infoCell}>
//                         <span style={s.infoLabel}>Applied On</span>
//                         <span style={s.infoVal}>{fmt(selectedApp.appliedAt)}</span>
//                       </div>
//                       <div style={s.infoCell}>
//                         <span style={s.infoLabel}>Incharge Approved</span>
//                         <span style={s.infoVal}>{fmt(selectedApp.internshipInchargeApproval?.approvedAt)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Match score */}
//                   {selectedApp.matchScore != null && (
//                     <div style={s.modalSection}>
//                       <h4 style={s.sectionTitle}><Target size={14} /> Match Analysis</h4>
//                       <div style={{
//                         display: "flex", alignItems: "center", gap: 14,
//                         padding: "13px 16px",
//                         background: selectedApp.matchScore >= 70 ? "#f0fdf4" : "#fffbeb",
//                         border: `1px solid ${selectedApp.matchScore >= 70 ? "#bbf7d0" : "#fde68a"}`,
//                         borderRadius: 12, marginBottom: 12,
//                       }}>
//                         <Target size={20} color={selectedApp.matchScore >= 70 ? "#15803d" : "#b45309"} />
//                         <div style={{ flex: 1 }}>
//                           <div style={{ fontWeight: 700, fontSize: 15 }}>
//                             {selectedApp.matchScore}% Match Score
//                           </div>
//                           <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
//                             {selectedApp.matchingSkills?.length || 0} matching ·{" "}
//                             {selectedApp.missingSkills?.length  || 0} missing
//                           </div>
//                         </div>
//                         <div style={{
//                           width: 90, height: 6, borderRadius: 99,
//                           background: "#e2e8f0", overflow: "hidden",
//                         }}>
//                           <div style={{
//                             height: "100%", borderRadius: 99,
//                             width: `${selectedApp.matchScore}%`,
//                             background: selectedApp.matchScore >= 70 ? "#22c55e" : "#f97316",
//                           }} />
//                         </div>
//                       </div>
//                       {selectedApp.matchingSkills?.length > 0 && (
//                         <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//                           {selectedApp.matchingSkills.map((sk, i) => (
//                             <span key={i} style={{
//                               padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
//                               background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe",
//                             }}>{sk}</span>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Student Profile */}
//                   <div style={s.modalSection}>
//                     <h4 style={s.sectionTitle}><GraduationCap size={14} /> Student Profile</h4>
//                     <div style={s.infoGrid}>
//                       <div style={s.infoCell}>
//                         <span style={s.infoLabel}>Name</span>
//                         <span style={s.infoVal}>{getStudentName(selectedApp)}</span>
//                       </div>
//                       <div style={s.infoCell}>
//                         <span style={s.infoLabel}>Email</span>
//                         <span style={s.infoVal}>{getStudentEmail(selectedApp) || "-"}</span>
//                       </div>
//                       <div style={s.infoCell}>
//                         <span style={s.infoLabel}>Department</span>
//                         <span style={s.infoVal}>{getStudentDept(selectedApp) || "-"}</span>
//                       </div>
//                       <div style={s.infoCell}>
//                         <span style={s.infoLabel}>Roll No.</span>
//                         <span style={s.infoVal}>
//                           {selectedApp.studentId?.rollNumber ||
//                            selectedApp.studentId?.studentId  || "-"}
//                         </span>
//                       </div>
//                       {selectedApp.cvSnapshot && (
//                         <div style={s.infoCell}>
//                           <span style={s.infoLabel}>CV</span>
//                           <a
//                             href={`${BASE}${selectedApp.cvSnapshot}`}
//                             target="_blank" rel="noreferrer"
//                             style={{ ...s.infoVal, color: "#3B82F6", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
//                           >
//                             <FileText size={12} /> View CV
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Cover letter */}
//                   {selectedApp.coverLetter && (
//                     <div style={s.modalSection}>
//                       <h4 style={s.sectionTitle}><FileText size={14} /> Cover Letter</h4>
//                       <div style={s.noteBox}>{selectedApp.coverLetter}</div>
//                     </div>
//                   )}

//                   {/* Incharge remarks */}
//                   {selectedApp.internshipInchargeApproval?.remarks && (
//                     <div style={s.modalSection}>
//                       <h4 style={s.sectionTitle}><Info size={14} /> Internship Incharge Remarks</h4>
//                       <div style={s.noteBox}>{selectedApp.internshipInchargeApproval.remarks}</div>
//                     </div>
//                   )}

//                   {/* Note input */}
//                   {status === "pending" && (
//                     <div style={s.modalSection}>
//                       <h4 style={s.sectionTitle}><FileText size={14} /> Your Remarks (Optional)</h4>
//                       <textarea
//                         style={s.noteTextarea}
//                         placeholder="Add a note before forwarding or rejecting..."
//                         value={noteInput}
//                         onChange={(e) => setNoteInput(e.target.value)}
//                         rows={3}
//                       />
//                     </div>
//                   )}

//                   {selectedApp.liaisonNote && status !== "pending" && (
//                     <div style={s.modalSection}>
//                       <h4 style={s.sectionTitle}><FileText size={14} /> Your Remarks</h4>
//                       <div style={{ ...s.noteBox, background: sc.bg, borderColor: sc.color + "40", color: sc.color }}>
//                         {selectedApp.liaisonNote}
//                       </div>
//                     </div>
//                   )}

//                   {status === "pending" && (
//                     <div style={s.modalActions}>
//                       <motion.button
//                         whileTap={{ scale: 0.96 }}
//                         style={s.modalBtnReject}
//                         onClick={() => setConfirmModal({ app: selectedApp, action: "Reject" })}
//                       >
//                         <XCircle size={16} /> Reject Application
//                       </motion.button>
//                       <motion.button
//                         whileTap={{ scale: 0.96 }}
//                         style={s.modalBtnForward}
//                         onClick={() => setConfirmModal({ app: selectedApp, action: "Forward" })}
//                       >
//                         <Send size={16} /> Forward to Industry
//                       </motion.button>
//                     </div>
//                   )}
//                 </div>

//                 <button style={s.closeBtn} onClick={() => setSelectedApp(null)}>Close</button>
//               </motion.div>
//             </motion.div>
//           );
//         })()}
//       </AnimatePresence>

//       {/* ===== Confirm Modal ===== */}
//       <AnimatePresence>
//         {confirmModal && (
//           <motion.div
//             style={{ ...s.overlay, zIndex: 1100 }}
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             onClick={() => setConfirmModal(null)}
//           >
//             <motion.div
//               style={s.confirmBox}
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1,   opacity: 1 }}
//               exit={{    scale: 0.85, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 350, damping: 28 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div style={{
//                 ...s.confirmIcon,
//                 background: confirmModal.action === "Forward" ? "#DBEAFE" : "#FEE2E2",
//               }}>
//                 {confirmModal.action === "Forward"
//                   ? <Send size={28} color="#1D4ED8" />
//                   : <XCircle size={28} color="#DC2626" />}
//               </div>
//               <h3 style={s.confirmTitle}>
//                 {confirmModal.action === "Forward" ? "Forward to Industry?" : "Reject Application?"}
//               </h3>
//               <p style={s.confirmMsg}>
//                 {confirmModal.action === "Forward"
//                   ? `Forward ${getStudentName(confirmModal.app)}'s application to the industry partner?`
//                   : `Reject ${getStudentName(confirmModal.app)}'s application? The student will be notified.`}
//               </p>

//               <div style={s.noteInputWrap}>
//                 <label style={s.noteLabel}>Add a remark (optional)</label>
//                 <textarea
//                   style={s.noteTextarea}
//                   rows={2}
//                   value={noteInput}
//                   onChange={(e) => setNoteInput(e.target.value)}
//                   placeholder={
//                     confirmModal.action === "Forward"
//                       ? "e.g. Strong candidate, please prioritize."
//                       : "e.g. Insufficient experience for this role."
//                   }
//                 />
//               </div>

//               <div style={s.confirmBtns}>
//                 <button
//                   style={s.cancelBtn}
//                   onClick={() => { setConfirmModal(null); setNoteInput(""); }}
//                 >
//                   Cancel
//                 </button>
//                 <motion.button
//                   whileTap={{ scale: 0.95 }}
//                   style={confirmModal.action === "Forward" ? s.confirmFwdBtn : s.confirmRejBtn}
//                   onClick={() =>
//                     confirmModal.action === "Forward"
//                       ? handleForward(confirmModal.app._id)
//                       : handleReject(confirmModal.app._id)
//                   }
//                 >
//                   {confirmModal.action === "Forward"
//                     ? <><Send size={15} /> Confirm Forward</>
//                     : <><XCircle size={15} /> Confirm Reject</>}
//                 </motion.button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const s = {
//   page: {
//     padding: "36px 48px", background: "#F8FAFC", minHeight: "100vh",
//     fontFamily: "'Inter', sans-serif", position: "relative",
//   },
//   toast: {
//     position: "fixed", top: "20px", left: "50%",
//     display: "flex", alignItems: "center", gap: "8px",
//     color: "#fff", padding: "12px 24px", borderRadius: "12px",
//     fontWeight: "600", fontSize: "0.88rem",
//     boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 9999,
//   },
//   header: {
//     display: "flex", justifyContent: "space-between",
//     alignItems: "flex-start", marginBottom: "24px",
//     flexWrap: "wrap", gap: "16px",
//   },
//   headerLeft:   { display: "flex", alignItems: "flex-start", gap: "16px" },
//   headerIcon: {
//     background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
//     borderRadius: "14px", padding: "12px",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
//   },
//   title:    { fontSize: "1.65rem", fontWeight: "800", color: "#0F172A", margin: 0 },
//   subtitle: { color: "#64748B", fontSize: "0.87rem", marginTop: "5px" },
//   flowBadge: {
//     display: "flex", alignItems: "center", gap: "8px",
//     background: "#fff", borderRadius: "12px", padding: "10px 16px",
//     border: "1.5px solid #E2E8F0", fontSize: "0.8rem", flexWrap: "wrap",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//   },
//   flowStep:       { color: "#94A3B8", fontWeight: "500" },
//   flowStepActive: {
//     background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
//     WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//     fontWeight: "700",
//   },
//   statRow: {
//     display: "grid", gridTemplateColumns: "repeat(4,1fr)",
//     gap: "14px", marginBottom: "24px",
//   },
//   statCard: {
//     background: "#fff", borderRadius: "14px", padding: "18px 20px",
//     border: "1px solid #E8EDF5",
//     display: "flex", alignItems: "center", gap: "14px",
//     boxShadow: "0 2px 10px rgba(15,23,42,0.05)",
//   },
//   statIcon: {
//     width: 46, height: 46, borderRadius: 12, flexShrink: 0,
//     display: "flex", alignItems: "center", justifyContent: "center",
//   },
//   statLabel: { fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" },
//   statValue: { fontSize: 28, fontWeight: 800, color: "#0F172A", lineHeight: 1.1, marginTop: 2 },

//   tabs: { display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" },
//   tab: {
//     display: "flex", alignItems: "center", gap: "7px",
//     padding: "9px 18px", borderRadius: "10px",
//     border: "1.5px solid #E2E8F0", background: "#fff",
//     color: "#475569", fontSize: "0.84rem", fontWeight: "600", cursor: "pointer",
//   },
//   tabActive: { background: "#0F172A", color: "#fff", borderColor: "#0F172A" },
//   tabDot:    { width: "7px", height: "7px", borderRadius: "50%" },
//   tabCount: {
//     padding: "2px 8px", borderRadius: "20px",
//     fontSize: "0.75rem", fontWeight: "700",
//   },
//   searchWrap: {
//     display: "flex", alignItems: "center", gap: "10px",
//     background: "#fff", borderRadius: "12px", padding: "10px 16px",
//     border: "1.5px solid #E2E8F0", marginBottom: "22px",
//     boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
//   },
//   searchInput: {
//     border: "none", outline: "none", fontSize: "0.87rem",
//     background: "transparent", width: "100%", color: "#0F172A",
//   },
//   list:  { display: "flex", flexDirection: "column", gap: "14px" },
//   empty: { display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0" },
//   card: {
//     background: "#fff", borderRadius: "14px",
//     boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
//     display: "flex", overflow: "hidden",
//     transition: "box-shadow 0.25s, transform 0.25s",
//   },
//   cardAccent: { width: "5px", flexShrink: 0 },
//   cardBody: {
//     flex: 1, padding: "18px 20px",
//     display: "flex", flexDirection: "column", gap: "9px",
//   },
//   studentSection: { display: "flex", alignItems: "center", gap: "12px" },
//   avatarLg: {
//     width: "44px", height: "44px", borderRadius: "50%",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: "1rem", fontWeight: "800", flexShrink: 0,
//   },
//   studentName: { fontSize: "1rem", fontWeight: "700", color: "#0F172A" },
//   studentMeta: {
//     display: "flex", gap: "6px", alignItems: "center",
//     fontSize: "0.77rem", color: "#94A3B8", flexWrap: "wrap", marginTop: "3px",
//   },
//   postSection: { display: "flex", flexDirection: "column", gap: "6px" },
//   postTitle: {
//     display: "flex", alignItems: "center", gap: "7px",
//     fontSize: "0.9rem", fontWeight: "600", color: "#1E40AF",
//   },
//   postMeta:  { display: "flex", gap: "7px", flexWrap: "wrap", alignItems: "center" },
//   badge: {
//     display: "inline-flex", alignItems: "center", gap: "4px",
//     padding: "3px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: "600",
//   },
//   skillChip: {
//     fontSize: "0.73rem", color: "#64748B", background: "#F8FAFC",
//     padding: "2px 8px", borderRadius: 6, border: "1px solid #E2E8F0",
//   },
//   metaRow:  { display: "flex", gap: "16px", flexWrap: "wrap" },
//   metaItem: { display: "flex", alignItems: "center", gap: "5px", fontSize: "0.77rem", color: "#64748B" },
//   inchargeNote: {
//     display: "flex", alignItems: "flex-start", gap: "8px",
//     background: "#F0F4FF", borderRadius: "9px", padding: "9px 13px",
//     fontSize: "0.81rem", color: "#3730A3", lineHeight: 1.5,
//     border: "1px solid #C7D2FE",
//   },
//   cardRight: {
//     padding: "18px 20px", display: "flex", flexDirection: "column",
//     alignItems: "flex-end", justifyContent: "space-between",
//     gap: "10px", minWidth: "178px", borderLeft: "1px solid #F1F5F9",
//   },
//   statusPill: {
//     display: "inline-flex", alignItems: "center", gap: "5px",
//     padding: "5px 12px", borderRadius: "20px",
//     fontSize: "0.76rem", fontWeight: "700", whiteSpace: "nowrap",
//   },
//   actionBtns: { display: "flex", flexDirection: "column", gap: "7px", width: "100%" },
//   btnView: {
//     display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
//     background: "#F8FAFC", color: "#475569", border: "1.5px solid #E2E8F0",
//     borderRadius: "9px", padding: "8px 12px", fontSize: "0.81rem", fontWeight: "600", cursor: "pointer",
//   },
//   btnForward: {
//     display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
//     background: "#EFF6FF", color: "#1D4ED8", border: "1.5px solid #BFDBFE",
//     borderRadius: "9px", padding: "8px 12px", fontSize: "0.81rem", fontWeight: "600", cursor: "pointer",
//   },
//   btnReject: {
//     display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
//     background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA",
//     borderRadius: "9px", padding: "8px 12px", fontSize: "0.81rem", fontWeight: "600", cursor: "pointer",
//   },

//   // Modal
//   overlay: {
//     position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     zIndex: 1000, backdropFilter: "blur(4px)",
//   },
//   modal: {
//     background: "#fff", borderRadius: "22px",
//     width: "620px", maxWidth: "96vw", maxHeight: "92vh", overflowY: "auto",
//     boxShadow: "0 30px 70px rgba(0,0,0,0.28)",
//   },
//   modalHeader: {
//     background: "linear-gradient(135deg, #0F172A, #1E3A5F)",
//     padding: "24px", borderRadius: "22px 22px 0 0",
//   },
//   modalHeaderContent: { display: "flex", alignItems: "center", gap: "14px" },
//   modalAvatar: {
//     width: "48px", height: "48px", borderRadius: "50%",
//     background: "rgba(255,255,255,0.15)", color: "#fff",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontSize: "1.1rem", fontWeight: "800", flexShrink: 0,
//   },
//   modalName: { fontSize: "1.15rem", fontWeight: "800", color: "#fff", margin: 0 },
//   modalSub:  { color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", margin: "4px 0 0 0" },
//   modalBody: { padding: "22px 24px" },
//   modalSection: { marginBottom: "18px" },
//   sectionTitle: {
//     display: "flex", alignItems: "center", gap: "7px",
//     fontSize: "0.82rem", fontWeight: "700", color: "#475569",
//     textTransform: "uppercase", letterSpacing: "0.05em",
//     marginBottom: "12px", paddingBottom: "8px",
//     borderBottom: "1px solid #F1F5F9",
//   },
//   infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
//   infoCell: {
//     background: "#F8FAFC", borderRadius: "10px", padding: "10px 14px",
//     border: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "3px",
//   },
//   infoLabel: { fontSize: "0.69rem", color: "#94A3B8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em" },
//   infoVal:   { fontSize: "0.85rem", color: "#0F172A", fontWeight: "600" },
//   noteBox: {
//     fontSize: "0.85rem", color: "#3730A3", background: "#F0F4FF",
//     borderRadius: "10px", padding: "14px", border: "1px solid #C7D2FE", lineHeight: 1.6,
//   },
//   noteTextarea: {
//     width: "100%", border: "1.5px solid #E2E8F0", borderRadius: "10px",
//     padding: "12px", fontSize: "0.85rem", color: "#0F172A",
//     resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box",
//   },
//   modalActions: { display: "flex", gap: "12px", marginTop: "20px" },
//   modalBtnReject: {
//     flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//     background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA",
//     borderRadius: "12px", padding: "12px", fontWeight: "600", fontSize: "0.88rem", cursor: "pointer",
//   },
//   modalBtnForward: {
//     flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//     background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff",
//     border: "none", borderRadius: "12px", padding: "12px",
//     fontWeight: "700", fontSize: "0.88rem", cursor: "pointer",
//     boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
//   },
//   closeBtn: {
//     display: "block", width: "calc(100% - 48px)", margin: "0 24px 24px",
//     background: "#F1F5F9", color: "#475569", border: "none",
//     borderRadius: "12px", padding: "11px", fontWeight: "600",
//     fontSize: "0.88rem", cursor: "pointer",
//   },

//   // Confirm
//   confirmBox: {
//     background: "#fff", borderRadius: "22px", padding: "32px",
//     width: "420px", maxWidth: "95vw", textAlign: "center",
//     boxShadow: "0 25px 60px rgba(0,0,0,0.28)",
//   },
//   confirmIcon: {
//     width: "64px", height: "64px", borderRadius: "50%",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     margin: "0 auto 18px",
//   },
//   confirmTitle: { fontSize: "1.2rem", fontWeight: "800", color: "#0F172A", margin: "0 0 10px" },
//   confirmMsg:   { fontSize: "0.87rem", color: "#64748B", lineHeight: 1.65, marginBottom: "20px" },
//   noteInputWrap: { textAlign: "left", marginBottom: "20px" },
//   noteLabel:     { display: "block", fontSize: "0.79rem", color: "#64748B", fontWeight: "600", marginBottom: "6px" },
//   confirmBtns:   { display: "flex", gap: "12px" },
//   cancelBtn: {
//     flex: 1, background: "#F1F5F9", color: "#64748B", border: "none",
//     borderRadius: "12px", padding: "12px", fontWeight: "600", cursor: "pointer",
//   },
//   confirmFwdBtn: {
//     flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//     background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff",
//     border: "none", borderRadius: "12px", padding: "12px",
//     fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
//   },
//   confirmRejBtn: {
//     flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
//     background: "#DC2626", color: "#fff", border: "none",
//     borderRadius: "12px", padding: "12px", fontWeight: "700", cursor: "pointer",
//     boxShadow: "0 4px 14px rgba(220,38,38,0.3)",
//   },
// };

// // ─── Demo Data ────────────────────────────────────────────────────────────────
// const DEMO_INTERNSHIPS = [
//   { _id: "int_1", title: "AI Research Internship",    company: "TechNova",  type: "Research"   },
//   { _id: "int_2", title: "Smart Agriculture Project", company: "AgriX",     type: "Internship" },
//   { _id: "int_3", title: "IoT Manufacturing",         company: "IndusTech", type: "Internship" },
// ];

// const DEMO_APPS = [
//   {
//     _id: "app_3",
//     studentId: { name: "Zara Khan", email: "zara.khan@uni.edu", department: "BSCS", rollNumber: "CS-2021" },
//     internshipId: { _id: "int_2", title: "Smart Agriculture Project", company: "AgriX", type: "Internship" },
//     matchScore: 91,
//     matchingSkills: ["IoT", "Arduino", "C", "Sensor Networks"], missingSkills: [],
//     appliedAt: "2025-11-06T08:15:00.000Z",
//     internshipInchargeApproval: { status: "approved", approvedAt: "2025-11-08T14:00:00.000Z", remarks: "Excellent practical experience with IoT. Highly recommended." },
//     liaisonStatus: "pending", liaisonNote: "",
//   },
//   {
//     _id: "app_5",
//     studentId: { name: "Ali Raza", email: "ali.raza@uni.edu", department: "BSIT", rollNumber: "IT-2034" },
//     internshipId: { _id: "int_1", title: "AI Research Internship", company: "TechNova", type: "Research" },
//     matchScore: 78,
//     matchingSkills: ["Python", "ML", "Data Analysis"], missingSkills: ["TensorFlow"],
//     appliedAt: "2025-11-07T09:00:00.000Z",
//     internshipInchargeApproval: { status: "approved", approvedAt: "2025-11-09T11:00:00.000Z", remarks: "Good academic record, solid Python skills." },
//     liaisonStatus: "pending", liaisonNote: "",
//   },
// ];

// export default StudentApplications;





import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LiaisonNavbar from "../components/LiaisonNavbar";
import LiaisonFooter from "../components/LiaisonFooter";
import {
  Users, CheckCircle, XCircle, Clock, Eye, Send,
  Search, ChevronRight, Building2, GraduationCap,
  AlertCircle, FileText, Calendar, Tag, Info, Inbox,
  RefreshCw, Loader2, Target,
} from "lucide-react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const BASE = "http://localhost:5000";
const API  = `${BASE}/api/liaison`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "-";

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

// ── Resolve student name/email from whatever shape the backend returns ────────
// Backend now sets app.studentId = resolvedStudent (with name + email)
// but we also handle raw studentEmail as ultimate fallback
const getStudentName = (app) => {
  if (app.studentId?.name)  return app.studentId.name;
  if (app.studentEmail)     return app.studentEmail.split("@")[0];
  return "Unknown Student";
};
const getStudentEmail = (app) => {
  if (app.studentId?.email) return app.studentId.email;
  if (app.studentEmail)     return app.studentEmail;
  return "";
};
const getStudentDept = (app) =>
  app.studentId?.department || app.studentId?.program || "";
const getStudentCgpa = (app) =>
  app.studentId?.cgpa || "";
const getStudentAvatar = (app) => {
  const img = app.studentId?.profileImage || app.studentId?.profilePicture || "";
  if (!img) return "";
  if (/^(data:|https?:\/\/)/i.test(img)) return img;
  return `${BASE}${img.startsWith("/") ? "" : "/"}${img}`;
};

// ── Resolve internship ────────────────────────────────────────────────────────
const getInternTitle   = (app) => app.internshipId?.title   || app.resolvedInternship?.title   || "-";
const getInternCompany = (app) => app.internshipId?.company || app.resolvedInternship?.company || "-";
const getInternType    = (app) => app.internshipId?.type    || app.resolvedInternship?.type    || "";
const getInternSkills  = (app) => app.internshipId?.requiredSkills || app.resolvedInternship?.requiredSkills || [];

// ─────────────────────────────────────────────────────────────────────────────
const statusConfig = {
  pending:   { bg: "#FEF3C7", color: "#92400E", icon: <Clock size={13} />,   label: "Pending Review" },
  forwarded: { bg: "#E2EEF9", color: "#193648", icon: <Send size={13} />,    label: "Forwarded to Industry" },
  rejected:  { bg: "#FEE2E2", color: "#991B1B", icon: <XCircle size={13} />, label: "Rejected" },
};

const typeConfig = {
  Internship: { bg: "#E2EEF9", color: "#193648" },
  Research:   { bg: "#D1FAE5", color: "#065F46" },
  Project:    { bg: "#EDE9FE", color: "#6D28D9" },
  Workshop:   { bg: "#FEF9C3", color: "#854D0E" },
};

const AVATAR_COLORS = [
  { bg: "#E2EEF9", color: "#193648" },
  { bg: "#EDE9FE", color: "#6D28D9" },
  { bg: "#FCE7F3", color: "#BE185D" },
  { bg: "#D1FAE5", color: "#065F46" },
  { bg: "#FEF3C7", color: "#92400E" },
];

function Spinner({ size = 16, color = "#193648" }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.75, ease: "linear" }}
      style={{ width: size, height: size, display: "inline-flex" }}
    >
      <Loader2 size={size} color={color} />
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
const StudentApplications = () => {
  const [applications,  setApplications]  = useState([]);
  const [internships,   setInternships]   = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedApp,   setSelectedApp]   = useState(null);
  const [filterStatus,  setFilterStatus]  = useState("All");
  const [searchQuery,   setSearchQuery]   = useState("");
  const [noteInput,     setNoteInput]     = useState("");
  const [confirmModal,  setConfirmModal]  = useState(null);
  const [toast,         setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── FETCH ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [appRes, intRes] = await Promise.all([
        fetch(`${API}/applications`),
        fetch(`${BASE}/api/incharge/internships`),
      ]);
      if (!appRes.ok) throw new Error(`Applications API error: ${appRes.status}`);
      const appJson = await appRes.json();
      const intJson = intRes.ok ? await intRes.json() : { data: [] };
      setApplications(appJson.data || []);
      setInternships(intJson.data  || []);
    } catch (err) {
      console.error("fetchData error:", err);
      showToast(`Backend error: ${err.message}`, "warn");
      setApplications(DEMO_APPS);
      setInternships(DEMO_INTERNSHIPS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── FORWARD ───────────────────────────────────────────────────────────────
  const handleForward = async (appId) => {
    setConfirmModal(null);
    setActionLoading((p) => ({ ...p, [appId]: "forwarding" }));
    try {
      const res  = await fetch(`${API}/applications/${appId}/forward`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ remarks: noteInput || "" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      // Keep app in list, just update its status locally
      setApplications((prev) =>
        prev.map((a) =>
          a._id === appId ? { ...a, liaisonStatus: "forwarded", liaisonNote: noteInput } : a
        )
      );
      showToast("Application forwarded to industry ✓", "success");
    } catch (err) {
      console.error("Forward error:", err);
      // Optimistic update for demo/offline
      setApplications((prev) =>
        prev.map((a) =>
          a._id === appId ? { ...a, liaisonStatus: "forwarded", liaisonNote: noteInput } : a
        )
      );
      showToast(err.message?.includes("demo") ? "Forwarded (demo mode) ✓" : `Forward failed: ${err.message}`, "warn");
    } finally {
      setNoteInput("");
      setSelectedApp(null);
      setActionLoading((p) => ({ ...p, [appId]: null }));
    }
  };

  // ── REJECT ────────────────────────────────────────────────────────────────
  const handleReject = async (appId) => {
    setConfirmModal(null);
    setActionLoading((p) => ({ ...p, [appId]: "rejecting" }));
    try {
      const res  = await fetch(`${API}/applications/${appId}/reject`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ remarks: noteInput || "" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setApplications((prev) =>
        prev.map((a) =>
          a._id === appId ? { ...a, liaisonStatus: "rejected", liaisonNote: noteInput } : a
        )
      );
      showToast("Application rejected. Student will be notified.", "error");
    } catch (err) {
      console.error("Reject error:", err);
      setApplications((prev) =>
        prev.map((a) =>
          a._id === appId ? { ...a, liaisonStatus: "rejected", liaisonNote: noteInput } : a
        )
      );
      showToast("Rejected (demo mode)", "error");
    } finally {
      setNoteInput("");
      setSelectedApp(null);
      setActionLoading((p) => ({ ...p, [appId]: null }));
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const getStatus = (app) => app.liaisonStatus || "pending";

  const filtered = applications.filter((a) => {
    const name    = getStudentName(a).toLowerCase();
    const email   = getStudentEmail(a).toLowerCase();
    const title   = getInternTitle(a).toLowerCase();
    const company = getInternCompany(a).toLowerCase();
    const q       = searchQuery.toLowerCase();
    const matchSearch =
      name.includes(q) || email.includes(q) ||
      title.includes(q) || company.includes(q);
    const matchStatus =
      filterStatus === "All" ||
      (filterStatus === "Pending"   && getStatus(a) === "pending") ||
      (filterStatus === "Forwarded" && getStatus(a) === "forwarded") ||
      (filterStatus === "Rejected"  && getStatus(a) === "rejected");
    return matchSearch && matchStatus;
  });

  const counts = {
    All:       applications.length,
    Pending:   applications.filter((a) => getStatus(a) === "pending").length,
    Forwarded: applications.filter((a) => getStatus(a) === "forwarded").length,
    Rejected:  applications.filter((a) => getStatus(a) === "rejected").length,
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
    <LiaisonNavbar />
    <div style={s.page}>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            style={{
              ...s.toast,
              background:
                toast.type === "success" ? "#10B981" :
                toast.type === "error"   ? "#EF4444" : "#F59E0B",
            }}
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0,   x: "-50%" }}
            exit={{    opacity: 0, y: -50,  x: "-50%" }}
          >
            {toast.type === "success" ? <CheckCircle size={16} /> :
             toast.type === "error"   ? <XCircle size={16} />     :
             <AlertCircle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.headerIcon}><Inbox size={22} color="#fff" /></div>
          <div>
            <h1 style={s.title}>Student Applications</h1>
            <p style={s.subtitle}>
              Review applications approved by Internship Incharge · Forward or reject to send to industry.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={fetchData} title="Refresh"
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: "#fff", border: "1px solid #E2E8F0",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {loading
              ? <Spinner size={15} color="#64748b" />
              : <RefreshCw size={15} color="#64748b" />}
          </button>

          <div style={s.flowBadge}>
            <span style={s.flowStep}>Student</span>
            <ChevronRight size={14} color="#94A3B8" />
            <span style={s.flowStep}>Incharge ✓</span>
            <ChevronRight size={14} color="#94A3B8" />
            <span style={{ ...s.flowStep, ...s.flowStepActive }}>Industry Liaison</span>
            <ChevronRight size={14} color="#94A3B8" />
            <span style={s.flowStep}>Industry</span>
          </div>
        </div>
      </div>

      {/* (Big stat cards removed - tab counts below already show these numbers) */}

      {/* Tabs */}
      <div style={s.tabs}>
        {["All", "Pending", "Forwarded", "Rejected"].map((tab) => {
          const active = filterStatus === tab;
          const sc = tab === "All" ? null : statusConfig[tab.toLowerCase()];
          return (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.96 }}
              style={{ ...s.tab, ...(active ? s.tabActive : {}) }}
              onClick={() => setFilterStatus(tab)}
            >
              {sc && <span style={{ ...s.tabDot, background: sc.color }} />}
              {tab}
              <span style={{
                ...s.tabCount,
                background: active ? "rgba(255,255,255,0.22)" : "#F1F5F9",
              }}>
                {counts[tab]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Search */}
      <div style={s.searchWrap}>
        <Search size={16} color="#9CA3AF" />
        <input
          style={s.searchInput}
          placeholder="Search by student name, email, internship title or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* List */}
      <div style={s.list}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <Spinner size={32} color="#193648" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div style={s.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Inbox size={52} color="#E2E8F0" />
            <p style={{ color: "#94A3B8", marginTop: 12, fontSize: 14 }}>
              {applications.length === 0
                ? "No applications forwarded by Incharge yet."
                : "No applications match your filters."}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filtered.map((app, idx) => {
              const status  = getStatus(app);
              const sc      = statusConfig[status] || statusConfig.pending;
              const name    = getStudentName(app);
              const email   = getStudentEmail(app);
              const dept    = getStudentDept(app);
              const cgpa    = getStudentCgpa(app);
              const type    = getInternType(app);
              const tc      = typeConfig[type] || typeConfig.Project;
              const skills  = getInternSkills(app);
              const avc     = AVATAR_COLORS[idx % AVATAR_COLORS.length];
              const busy    = actionLoading[app._id];

              return (
                <motion.div
                  key={app._id}
                  style={s.card}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
                >
                  <div style={{ ...s.cardAccent, background: sc.color }} />

                  <div style={s.cardBody}>
                    {/* Student */}
                    <div style={s.studentSection}>
                      {(() => {
                        const dp = getStudentAvatar(app);
                        return dp ? (
                          <img
                            src={dp}
                            alt={name}
                            style={{ ...s.avatarLg, objectFit: "cover" }}
                            onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
                          />
                        ) : null;
                      })()}
                      <div
                        style={{
                          ...s.avatarLg,
                          background: avc.bg,
                          color: avc.color,
                          display: getStudentAvatar(app) ? "none" : "flex",
                        }}
                      >
                        {initials(name)}
                      </div>
                      <div>
                        <div style={s.studentName}>{name}</div>
                        <div style={s.studentMeta}>
                          {dept  && <span><GraduationCap size={12} /> {dept}</span>}
                          {cgpa  && <><span>·</span><span>CGPA: {cgpa}</span></>}
                          {email && <><span>·</span><span>{email}</span></>}
                        </div>
                      </div>
                    </div>

                    {/* Internship */}
                    <div style={s.postSection}>
                      <div style={s.postTitle}>
                        <Building2 size={14} color="#193648" />
                        {getInternTitle(app)}
                        {getInternCompany(app) !== "-" && (
                          <span style={{ fontWeight: 400, color: "#94A3B8" }}>
                            {" · "}{getInternCompany(app)}
                          </span>
                        )}
                      </div>
                      <div style={s.postMeta}>
                        {type && (
                          <span style={{ ...s.badge, background: tc.bg, color: tc.color }}>
                            <Tag size={10} /> {type}
                          </span>
                        )}
                        {skills.slice(0, 3).map((sk, i) => (
                          <span key={i} style={s.skillChip}>{sk}</span>
                        ))}
                      </div>
                    </div>

                    {/* Dates + match */}
                    <div style={s.metaRow}>
                      <span style={s.metaItem}>
                        <Calendar size={12} /> Applied: {fmt(app.appliedAt || app.createdAt)}
                      </span>
                      <span style={s.metaItem}>
                        <CheckCircle size={12} color="#10B981" />
                        Approved by Incharge:{" "}
                        {fmt(app.internshipInchargeApproval?.approvedAt || app.updatedAt)}
                      </span>
                      {app.matchScore != null && (
                        <span style={s.metaItem}>
                          <Target size={12} color="#193648" />
                          Match:{" "}
                          <strong style={{ color: app.matchScore >= 70 ? "#15803d" : "#b45309" }}>
                            {app.matchScore}%
                          </strong>
                        </span>
                      )}
                    </div>

                    {/* Incharge note */}
                    {app.internshipInchargeApproval?.remarks && (
                      <div style={s.inchargeNote}>
                        <Info size={12} color="#193648" />
                        <span>
                          <strong>Incharge Note:</strong>{" "}
                          {app.internshipInchargeApproval.remarks}
                        </span>
                      </div>
                    )}

                    {/* Liaison note */}
                    {app.liaisonNote && (
                      <div style={{
                        ...s.inchargeNote,
                        background: sc.bg,
                        borderColor: sc.color + "50",
                        color: sc.color,
                      }}>
                        <FileText size={12} color={sc.color} />
                        <span><strong>Your Note:</strong> {app.liaisonNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Right panel */}
                  <div style={s.cardRight}>
                    <span style={{ ...s.statusPill, background: sc.bg, color: sc.color }}>
                      {sc.icon} {sc.label}
                    </span>

                    <div style={s.actionBtns}>
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        style={s.btnView}
                        onClick={() => { setSelectedApp(app); setNoteInput(app.liaisonNote || ""); }}
                      >
                        <Eye size={14} /> Review
                      </motion.button>

                      {status === "pending" && (
                        <>
                          <motion.button
                            whileTap={{ scale: 0.94 }}
                            style={{ ...s.btnForward, opacity: busy ? 0.7 : 1 }}
                            disabled={!!busy}
                            onClick={() => { setConfirmModal({ app, action: "Forward" }); setNoteInput(""); }}
                          >
                            {busy === "forwarding"
                              ? <Spinner size={13} color="#fff" />
                              : <Send size={14} />}
                            Forward
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.94 }}
                            style={{ ...s.btnReject, opacity: busy ? 0.7 : 1 }}
                            disabled={!!busy}
                            onClick={() => { setConfirmModal({ app, action: "Reject" }); setNoteInput(""); }}
                          >
                            {busy === "rejecting"
                              ? <Spinner size={13} color="#DC2626" />
                              : <XCircle size={14} />}
                            Reject
                          </motion.button>
                        </>
                      )}

                      {status === "forwarded" && (
                        <div style={{ ...s.statusPill, background: "#E2EEF9", color: "#193648", fontSize: "0.8rem", textAlign: "center" }}>
                          <CheckCircle size={13} /> Forwarded
                        </div>
                      )}
                      {status === "rejected" && (
                        <div style={{ ...s.statusPill, background: "#FEE2E2", color: "#991B1B", fontSize: "0.8rem", textAlign: "center" }}>
                          <XCircle size={13} /> Rejected
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* ===== Detail Modal ===== */}
      <AnimatePresence>
        {selectedApp && (() => {
          const status = getStatus(selectedApp);
          const sc     = statusConfig[status] || statusConfig.pending;
          const name   = getStudentName(selectedApp);

          return (
            <motion.div
              style={s.overlay}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
            >
              <motion.div
                style={s.modal}
                initial={{ scale: 0.85, y: 40, opacity: 0 }}
                animate={{ scale: 1,    y: 0,  opacity: 1 }}
                exit={{    scale: 0.9,  opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div style={s.modalHeader}>
                  <div style={s.modalHeaderContent}>
                    {(() => {
                      const dp = getStudentAvatar(selectedApp);
                      return dp ? (
                        <img
                          src={dp}
                          alt={name}
                          style={{ ...s.modalAvatar, objectFit: "cover", background: "rgba(255,255,255,0.15)" }}
                          onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
                        />
                      ) : null;
                    })()}
                    <div style={{ ...s.modalAvatar, display: getStudentAvatar(selectedApp) ? "none" : "flex" }}>
                      {initials(name)}
                    </div>
                    <div>
                      <h2 style={s.modalName}>{name}</h2>
                      <p style={s.modalSub}>
                        {getStudentDept(selectedApp)
                          ? `${getStudentDept(selectedApp)} · ` : ""}
                        {getStudentEmail(selectedApp)}
                      </p>
                    </div>
                    <span style={{ ...s.statusPill, background: sc.bg, color: sc.color, marginLeft: "auto" }}>
                      {sc.icon} {sc.label}
                    </span>
                  </div>
                </div>

                <div style={s.modalBody}>
                  {/* Position */}
                  <div style={s.modalSection}>
                    <h4 style={s.sectionTitle}><Building2 size={14} /> Applied Position</h4>
                    <div style={s.infoGrid}>
                      <div style={s.infoCell}>
                        <span style={s.infoLabel}>Post Title</span>
                        <span style={s.infoVal}>{getInternTitle(selectedApp)}</span>
                      </div>
                      <div style={s.infoCell}>
                        <span style={s.infoLabel}>Company</span>
                        <span style={s.infoVal}>{getInternCompany(selectedApp)}</span>
                      </div>
                      <div style={s.infoCell}>
                        <span style={s.infoLabel}>Applied On</span>
                        <span style={s.infoVal}>{fmt(selectedApp.appliedAt)}</span>
                      </div>
                      <div style={s.infoCell}>
                        <span style={s.infoLabel}>Incharge Approved</span>
                        <span style={s.infoVal}>{fmt(selectedApp.internshipInchargeApproval?.approvedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match score */}
                  {selectedApp.matchScore != null && (
                    <div style={s.modalSection}>
                      <h4 style={s.sectionTitle}><Target size={14} /> Match Analysis</h4>
                      <div style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "13px 16px",
                        background: selectedApp.matchScore >= 70 ? "#f0fdf4" : "#fffbeb",
                        border: `1px solid ${selectedApp.matchScore >= 70 ? "#bbf7d0" : "#fde68a"}`,
                        borderRadius: 12, marginBottom: 12,
                      }}>
                        <Target size={20} color={selectedApp.matchScore >= 70 ? "#15803d" : "#b45309"} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>
                            {selectedApp.matchScore}% Match Score
                          </div>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                            {selectedApp.matchingSkills?.length || 0} matching ·{" "}
                            {selectedApp.missingSkills?.length  || 0} missing
                          </div>
                        </div>
                        <div style={{
                          width: 90, height: 6, borderRadius: 99,
                          background: "#e2e8f0", overflow: "hidden",
                        }}>
                          <div style={{
                            height: "100%", borderRadius: 99,
                            width: `${selectedApp.matchScore}%`,
                            background: selectedApp.matchScore >= 70 ? "#22c55e" : "#f97316",
                          }} />
                        </div>
                      </div>
                      {selectedApp.matchingSkills?.length > 0 && (
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {selectedApp.matchingSkills.map((sk, i) => (
                            <span key={i} style={{
                              padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                              background: "#E2EEF9", color: "#193648", border: "1px solid #CFE0F0",
                            }}>{sk}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Student Profile */}
                  <div style={s.modalSection}>
                    <h4 style={s.sectionTitle}><GraduationCap size={14} /> Student Profile</h4>
                    <div style={s.infoGrid}>
                      <div style={s.infoCell}>
                        <span style={s.infoLabel}>Name</span>
                        <span style={s.infoVal}>{getStudentName(selectedApp)}</span>
                      </div>
                      <div style={s.infoCell}>
                        <span style={s.infoLabel}>Email</span>
                        <span style={s.infoVal}>{getStudentEmail(selectedApp) || "-"}</span>
                      </div>
                      <div style={s.infoCell}>
                        <span style={s.infoLabel}>Department</span>
                        <span style={s.infoVal}>{getStudentDept(selectedApp) || "-"}</span>
                      </div>
                      <div style={s.infoCell}>
                        <span style={s.infoLabel}>Roll No.</span>
                        <span style={s.infoVal}>
                          {selectedApp.studentId?.rollNumber ||
                           selectedApp.studentId?.studentId  || "-"}
                        </span>
                      </div>
                      {selectedApp.cvSnapshot && (
                        <div style={s.infoCell}>
                          <span style={s.infoLabel}>CV</span>
                          <a
                            href={`${BASE}${selectedApp.cvSnapshot}`}
                            target="_blank" rel="noreferrer"
                            style={{ ...s.infoVal, color: "#193648", textDecoration: "underline", display: "flex", alignItems: "center", gap: 4 }}
                          >
                            <FileText size={12} /> View CV
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cover letter */}
                  {selectedApp.coverLetter && (
                    <div style={s.modalSection}>
                      <h4 style={s.sectionTitle}><FileText size={14} /> Cover Letter</h4>
                      <div style={s.noteBox}>{selectedApp.coverLetter}</div>
                    </div>
                  )}

                  {/* Incharge remarks */}
                  {selectedApp.internshipInchargeApproval?.remarks && (
                    <div style={s.modalSection}>
                      <h4 style={s.sectionTitle}><Info size={14} /> Internship Incharge Remarks</h4>
                      <div style={s.noteBox}>{selectedApp.internshipInchargeApproval.remarks}</div>
                    </div>
                  )}

                  {/* Note input */}
                  {status === "pending" && (
                    <div style={s.modalSection}>
                      <h4 style={s.sectionTitle}><FileText size={14} /> Your Remarks (Optional)</h4>
                      <textarea
                        style={s.noteTextarea}
                        placeholder="Add a note before forwarding or rejecting..."
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}

                  {selectedApp.liaisonNote && status !== "pending" && (
                    <div style={s.modalSection}>
                      <h4 style={s.sectionTitle}><FileText size={14} /> Your Remarks</h4>
                      <div style={{ ...s.noteBox, background: sc.bg, borderColor: sc.color + "40", color: sc.color }}>
                        {selectedApp.liaisonNote}
                      </div>
                    </div>
                  )}

                  {status === "pending" && (
                    <div style={s.modalActions}>
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        style={s.modalBtnReject}
                        onClick={() => setConfirmModal({ app: selectedApp, action: "Reject" })}
                      >
                        <XCircle size={16} /> Reject Application
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        style={s.modalBtnForward}
                        onClick={() => setConfirmModal({ app: selectedApp, action: "Forward" })}
                      >
                        <Send size={16} /> Forward to Industry
                      </motion.button>
                    </div>
                  )}
                </div>

                <button style={s.closeBtn} onClick={() => setSelectedApp(null)}>Close</button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ===== Confirm Modal ===== */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            style={{ ...s.overlay, zIndex: 1100 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirmModal(null)}
          >
            <motion.div
              style={s.confirmBox}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit={{    scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                ...s.confirmIcon,
                background: confirmModal.action === "Forward" ? "#E2EEF9" : "#FEE2E2",
              }}>
                {confirmModal.action === "Forward"
                  ? <Send size={28} color="#193648" />
                  : <XCircle size={28} color="#DC2626" />}
              </div>
              <h3 style={s.confirmTitle}>
                {confirmModal.action === "Forward" ? "Forward to Industry?" : "Reject Application?"}
              </h3>
              <p style={s.confirmMsg}>
                {confirmModal.action === "Forward"
                  ? `Forward ${getStudentName(confirmModal.app)}'s application to the industry partner?`
                  : `Reject ${getStudentName(confirmModal.app)}'s application? The student will be notified.`}
              </p>

              <div style={s.noteInputWrap}>
                <label style={s.noteLabel}>Add a remark (optional)</label>
                <textarea
                  style={s.noteTextarea}
                  rows={2}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder={
                    confirmModal.action === "Forward"
                      ? "e.g. Strong candidate, please prioritize."
                      : "e.g. Insufficient experience for this role."
                  }
                />
              </div>

              <div style={s.confirmBtns}>
                <button
                  style={s.cancelBtn}
                  onClick={() => { setConfirmModal(null); setNoteInput(""); }}
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  style={confirmModal.action === "Forward" ? s.confirmFwdBtn : s.confirmRejBtn}
                  onClick={() =>
                    confirmModal.action === "Forward"
                      ? handleForward(confirmModal.app._id)
                      : handleReject(confirmModal.app._id)
                  }
                >
                  {confirmModal.action === "Forward"
                    ? <><Send size={15} /> Confirm Forward</>
                    : <><XCircle size={15} /> Confirm Reject</>}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    <LiaisonFooter />
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: {
    padding: "36px 48px",
    background: "linear-gradient(135deg, #E2EEF9 0%, #FFFFFF 100%)",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif", position: "relative",
  },
  toast: {
    position: "fixed", top: "20px", left: "50%",
    display: "flex", alignItems: "center", gap: "8px",
    color: "#fff", padding: "12px 24px", borderRadius: "12px",
    fontWeight: "600", fontSize: "0.88rem",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 9999,
  },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: "24px",
    flexWrap: "wrap", gap: "16px",
  },
  headerLeft:   { display: "flex", alignItems: "flex-start", gap: "16px" },
  headerIcon: {
    background: "#193648",
    borderRadius: "14px", padding: "12px",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 14px rgba(25,54,72,0.35)",
  },
  title:    { fontSize: "1.65rem", fontWeight: "800", color: "#193648", margin: 0 },
  subtitle: { color: "#64748B", fontSize: "0.87rem", marginTop: "5px" },
  flowBadge: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "#fff", borderRadius: "12px", padding: "10px 16px",
    border: "1.5px solid #E2EEF9", fontSize: "0.8rem", flexWrap: "wrap",
    boxShadow: "0 2px 8px rgba(25,54,72,0.06)",
  },
  flowStep:       { color: "#94A3B8", fontWeight: "500" },
  flowStepActive: {
    color: "#193648",
    fontWeight: "700",
  },
  statRow: {
    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
    gap: "14px", marginBottom: "24px",
  },
  statCard: {
    background: "#fff", borderRadius: "14px", padding: "18px 20px",
    border: "1px solid #E2EEF9",
    display: "flex", alignItems: "center", gap: "14px",
    boxShadow: "0 2px 10px rgba(25,54,72,0.06)",
  },
  statIcon: {
    width: 46, height: 46, borderRadius: 12, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  statLabel: { fontSize: 11, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" },
  statValue: { fontSize: 28, fontWeight: 800, color: "#193648", lineHeight: 1.1, marginTop: 2 },

  tabs: { display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" },
  tab: {
    display: "flex", alignItems: "center", gap: "7px",
    padding: "9px 18px", borderRadius: "10px",
    border: "1.5px solid #E2EEF9", background: "#fff",
    color: "#475569", fontSize: "0.84rem", fontWeight: "600", cursor: "pointer",
  },
  tabActive: { background: "#193648", color: "#fff", borderColor: "#193648" },
  tabDot:    { width: "7px", height: "7px", borderRadius: "50%" },
  tabCount: {
    padding: "2px 8px", borderRadius: "20px",
    fontSize: "0.75rem", fontWeight: "700",
  },
  searchWrap: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "#fff", borderRadius: "12px", padding: "10px 16px",
    border: "1.5px solid #E2EEF9", marginBottom: "22px",
    boxShadow: "0 1px 4px rgba(25,54,72,0.05)",
  },
  searchInput: {
    border: "none", outline: "none", fontSize: "0.87rem",
    background: "transparent", width: "100%", color: "#193648",
  },
  list:  { display: "flex", flexDirection: "column", gap: "14px" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0" },
  card: {
    background: "#fff", borderRadius: "14px",
    boxShadow: "0 3px 12px rgba(25,54,72,0.07)",
    border: "1px solid #E2EEF9",
    display: "flex", overflow: "hidden",
    transition: "box-shadow 0.25s, transform 0.25s",
  },
  cardAccent: { width: "5px", flexShrink: 0 },
  cardBody: {
    flex: 1, padding: "18px 20px",
    display: "flex", flexDirection: "column", gap: "9px",
  },
  studentSection: { display: "flex", alignItems: "center", gap: "12px" },
  avatarLg: {
    width: "44px", height: "44px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1rem", fontWeight: "800", flexShrink: 0,
  },
  studentName: { fontSize: "1rem", fontWeight: "700", color: "#193648" },
  studentMeta: {
    display: "flex", gap: "6px", alignItems: "center",
    fontSize: "0.77rem", color: "#94A3B8", flexWrap: "wrap", marginTop: "3px",
  },
  postSection: { display: "flex", flexDirection: "column", gap: "6px" },
  postTitle: {
    display: "flex", alignItems: "center", gap: "7px",
    fontSize: "0.9rem", fontWeight: "600", color: "#193648",
  },
  postMeta:  { display: "flex", gap: "7px", flexWrap: "wrap", alignItems: "center" },
  badge: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    padding: "3px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: "600",
  },
  skillChip: {
    fontSize: "0.73rem", color: "#193648", background: "#E2EEF9",
    padding: "2px 8px", borderRadius: 6, border: "1px solid #CFE0F0",
  },
  metaRow:  { display: "flex", gap: "16px", flexWrap: "wrap" },
  metaItem: { display: "flex", alignItems: "center", gap: "5px", fontSize: "0.77rem", color: "#64748B" },
  inchargeNote: {
    display: "flex", alignItems: "flex-start", gap: "8px",
    background: "#E2EEF9", borderRadius: "9px", padding: "9px 13px",
    fontSize: "0.81rem", color: "#193648", lineHeight: 1.5,
    border: "1px solid #CFE0F0",
  },
  cardRight: {
    padding: "18px 20px", display: "flex", flexDirection: "column",
    alignItems: "flex-end", justifyContent: "space-between",
    gap: "10px", minWidth: "178px", borderLeft: "1px solid #E2EEF9",
  },
  statusPill: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "5px 12px", borderRadius: "20px",
    fontSize: "0.76rem", fontWeight: "700", whiteSpace: "nowrap",
  },
  actionBtns: { display: "flex", flexDirection: "column", gap: "7px", width: "100%" },
  btnView: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
    background: "#fff", color: "#193648", border: "1.5px solid #E2EEF9",
    borderRadius: "9px", padding: "8px 12px", fontSize: "0.81rem", fontWeight: "600", cursor: "pointer",
  },
  btnForward: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
    background: "#193648", color: "#fff", border: "1.5px solid #193648",
    borderRadius: "9px", padding: "8px 12px", fontSize: "0.81rem", fontWeight: "600", cursor: "pointer",
    boxShadow: "0 2px 8px rgba(25,54,72,0.25)",
  },
  btnReject: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
    background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA",
    borderRadius: "9px", padding: "8px 12px", fontSize: "0.81rem", fontWeight: "600", cursor: "pointer",
  },

  // Modal
  overlay: {
    position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#fff", borderRadius: "22px",
    width: "620px", maxWidth: "96vw", maxHeight: "92vh", overflowY: "auto",
    boxShadow: "0 30px 70px rgba(0,0,0,0.28)",
  },
  modalHeader: {
    background: "#193648",
    padding: "24px", borderRadius: "22px 22px 0 0",
  },
  modalHeaderContent: { display: "flex", alignItems: "center", gap: "14px" },
  modalAvatar: {
    width: "48px", height: "48px", borderRadius: "50%",
    background: "rgba(255,255,255,0.15)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.1rem", fontWeight: "800", flexShrink: 0,
  },
  modalName: { fontSize: "1.15rem", fontWeight: "800", color: "#fff", margin: 0 },
  modalSub:  { color: "rgba(226,238,249,0.7)", fontSize: "0.82rem", margin: "4px 0 0 0" },
  modalBody: { padding: "22px 24px" },
  modalSection: { marginBottom: "18px" },
  sectionTitle: {
    display: "flex", alignItems: "center", gap: "7px",
    fontSize: "0.82rem", fontWeight: "700", color: "#193648",
    textTransform: "uppercase", letterSpacing: "0.05em",
    marginBottom: "12px", paddingBottom: "8px",
    borderBottom: "1px solid #E2EEF9",
  },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  infoCell: {
    background: "#E2EEF9", borderRadius: "10px", padding: "10px 14px",
    border: "1px solid #CFE0F0", display: "flex", flexDirection: "column", gap: "3px",
  },
  infoLabel: { fontSize: "0.69rem", color: "#64748B", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em" },
  infoVal:   { fontSize: "0.85rem", color: "#193648", fontWeight: "600" },
  noteBox: {
    fontSize: "0.85rem", color: "#193648", background: "#E2EEF9",
    borderRadius: "10px", padding: "14px", border: "1px solid #CFE0F0", lineHeight: 1.6,
  },
  noteTextarea: {
    width: "100%", border: "1.5px solid #E2EEF9", borderRadius: "10px",
    padding: "12px", fontSize: "0.85rem", color: "#193648",
    resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  },
  modalActions: { display: "flex", gap: "12px", marginTop: "20px" },
  modalBtnReject: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA",
    borderRadius: "12px", padding: "12px", fontWeight: "600", fontSize: "0.88rem", cursor: "pointer",
  },
  modalBtnForward: {
    flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: "#193648", color: "#fff",
    border: "none", borderRadius: "12px", padding: "12px",
    fontWeight: "700", fontSize: "0.88rem", cursor: "pointer",
    boxShadow: "0 4px 14px rgba(25,54,72,0.35)",
  },
  closeBtn: {
    display: "block", width: "calc(100% - 48px)", margin: "0 24px 24px",
    background: "#E2EEF9", color: "#193648", border: "none",
    borderRadius: "12px", padding: "11px", fontWeight: "600",
    fontSize: "0.88rem", cursor: "pointer",
  },

  // Confirm
  confirmBox: {
    background: "#fff", borderRadius: "22px", padding: "32px",
    width: "420px", maxWidth: "95vw", textAlign: "center",
    boxShadow: "0 25px 60px rgba(0,0,0,0.28)",
  },
  confirmIcon: {
    width: "64px", height: "64px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 18px",
  },
  confirmTitle: { fontSize: "1.2rem", fontWeight: "800", color: "#193648", margin: "0 0 10px" },
  confirmMsg:   { fontSize: "0.87rem", color: "#64748B", lineHeight: 1.65, marginBottom: "20px" },
  noteInputWrap: { textAlign: "left", marginBottom: "20px" },
  noteLabel:     { display: "block", fontSize: "0.79rem", color: "#193648", fontWeight: "600", marginBottom: "6px" },
  confirmBtns:   { display: "flex", gap: "12px" },
  cancelBtn: {
    flex: 1, background: "#E2EEF9", color: "#193648", border: "none",
    borderRadius: "12px", padding: "12px", fontWeight: "600", cursor: "pointer",
  },
  confirmFwdBtn: {
    flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: "#193648", color: "#fff",
    border: "none", borderRadius: "12px", padding: "12px",
    fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(25,54,72,0.3)",
  },
  confirmRejBtn: {
    flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: "#DC2626", color: "#fff", border: "none",
    borderRadius: "12px", padding: "12px", fontWeight: "700", cursor: "pointer",
    boxShadow: "0 4px 14px rgba(220,38,38,0.3)",
  },
};

// ─── Demo Data ────────────────────────────────────────────────────────────────
const DEMO_INTERNSHIPS = [
  { _id: "int_1", title: "AI Research Internship",    company: "TechNova",  type: "Research"   },
  { _id: "int_2", title: "Smart Agriculture Project", company: "AgriX",     type: "Internship" },
  { _id: "int_3", title: "IoT Manufacturing",         company: "IndusTech", type: "Internship" },
];

const DEMO_APPS = [
  {
    _id: "app_3",
    studentId: { name: "Zara Khan", email: "zara.khan@uni.edu", department: "BSCS", rollNumber: "CS-2021" },
    internshipId: { _id: "int_2", title: "Smart Agriculture Project", company: "AgriX", type: "Internship" },
    matchScore: 91,
    matchingSkills: ["IoT", "Arduino", "C", "Sensor Networks"], missingSkills: [],
    appliedAt: "2025-11-06T08:15:00.000Z",
    internshipInchargeApproval: { status: "approved", approvedAt: "2025-11-08T14:00:00.000Z", remarks: "Excellent practical experience with IoT. Highly recommended." },
    liaisonStatus: "pending", liaisonNote: "",
  },
  {
    _id: "app_5",
    studentId: { name: "Ali Raza", email: "ali.raza@uni.edu", department: "BSIT", rollNumber: "IT-2034" },
    internshipId: { _id: "int_1", title: "AI Research Internship", company: "TechNova", type: "Research" },
    matchScore: 78,
    matchingSkills: ["Python", "ML", "Data Analysis"], missingSkills: ["TensorFlow"],
    appliedAt: "2025-11-07T09:00:00.000Z",
    internshipInchargeApproval: { status: "approved", approvedAt: "2025-11-09T11:00:00.000Z", remarks: "Good academic record, solid Python skills." },
    liaisonStatus: "pending", liaisonNote: "",
  },
];

export default StudentApplications;