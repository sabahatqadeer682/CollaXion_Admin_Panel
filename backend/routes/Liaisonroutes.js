// // routes/liaisonRoutes.js
// // Industry Liaison Incharge — Backend Routes
// // Mount in server.js: app.use("/api/liaison", liaisonRoutes);

// import express from "express";
// import mongoose from "mongoose";

// const router = express.Router();

// // ── Reuse existing models (registered elsewhere) or define locally ─────────
// const applicationSchema = new mongoose.Schema(
//   {
//     studentId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected", "sent_to_liaison"],
//       default: "pending",
//     },
//     internshipInchargeApproval: {
//       status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//       approvedAt: Date,
//       rejectedAt: Date,
//       remarks:    String,
//     },
//     industryLiaisonApproval: {
//       status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//       approvedAt: Date,
//       rejectedAt: Date,
//       remarks:    String,
//     },
//     matchScore:     { type: Number, default: 0 },
//     matchingSkills: [String],
//     missingSkills:  [String],
//     cvSnapshot:     String,
//     skillsSnapshot: [mongoose.Schema.Types.Mixed],
//     appliedAt:      { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const Application =
//   mongoose.models.Application ||
//   mongoose.model("Application", applicationSchema, "applications");

// // ────────────────────────────────────────────────────────────────────────────
// // GET /api/liaison/applications
// // Fetch all applications with status = "sent_to_liaison"
// // These are the ones Internship Incharge has forwarded to Industry Liaison
// // ────────────────────────────────────────────────────────────────────────────
// router.get("/applications", async (req, res) => {
//   try {
//     const { page = 1, limit = 50 } = req.query;

//     const applications = await Application.find({ status: "sent_to_liaison" })
//       .populate("studentId",    "name email studentId department rollNumber profileImage")
//       .populate("internshipId", "title company type requiredSkills slots description")
//       .sort({ updatedAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .lean();

//     const total = await Application.countDocuments({ status: "sent_to_liaison" });

//     // Stats for this liaison's queue
//     const stats = {
//       total:     total,
//       pending:   applications.filter((a) => a.industryLiaisonApproval?.status === "pending").length,
//       forwarded: applications.filter((a) => a.industryLiaisonApproval?.status === "approved").length,
//       rejected:  applications.filter((a) => a.industryLiaisonApproval?.status === "rejected").length,
//     };

//     // Attach a flat liaisonStatus field for easy frontend use
//     const enriched = applications.map((a) => {
//       const ls = a.industryLiaisonApproval?.status;
//       return {
//         ...a,
//         liaisonStatus: ls === "approved" ? "forwarded" : ls === "rejected" ? "rejected" : "pending",
//         liaisonNote:   a.industryLiaisonApproval?.remarks || "",
//       };
//     });

//     return res.json({
//       success: true,
//       data: enriched,
//       stats,
//       pagination: {
//         total,
//         page:  Number(page),
//         limit: Number(limit),
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     console.error("GET /liaison/applications error:", err);
//     return res.status(500).json({ success: false, message: "Failed to fetch applications", error: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────────────────────
// // GET /api/liaison/applications/:id
// // Single application detail
// // ────────────────────────────────────────────────────────────────────────────
// router.get("/applications/:id", async (req, res) => {
//   try {
//     const app = await Application.findOne({
//       _id: req.params.id,
//       status: "sent_to_liaison",
//     })
//       .populate("studentId",    "name email studentId department rollNumber profileImage")
//       .populate("internshipId", "title company type requiredSkills slots description")
//       .lean();

//     if (!app) {
//       return res.status(404).json({ success: false, message: "Application not found or not in liaison queue" });
//     }

//     const ls = app.industryLiaisonApproval?.status;
//     return res.json({
//       success: true,
//       data: {
//         ...app,
//         liaisonStatus: ls === "approved" ? "forwarded" : ls === "rejected" ? "rejected" : "pending",
//         liaisonNote:   app.industryLiaisonApproval?.remarks || "",
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────────────────────
// // PATCH /api/liaison/applications/:id/forward
// // Industry Liaison forwards an application to the industry partner
// // This marks industryLiaisonApproval.status = "approved"
// // ────────────────────────────────────────────────────────────────────────────
// router.patch("/applications/:id/forward", async (req, res) => {
//   try {
//     const { remarks } = req.body;

//     const application = await Application.findOne({
//       _id: req.params.id,
//       status: "sent_to_liaison",
//     });

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: "Application not found in liaison queue",
//       });
//     }

//     if (application.industryLiaisonApproval?.status === "approved") {
//       return res.status(400).json({
//         success: false,
//         message: "Application has already been forwarded to industry",
//       });
//     }

//     // Mark as forwarded by liaison
//     application.industryLiaisonApproval = {
//       status:     "approved",
//       approvedAt: new Date(),
//       remarks:    remarks || "",
//     };

//     await application.save();

//     const updated = await Application.findById(req.params.id)
//       .populate("studentId",    "name email studentId department")
//       .populate("internshipId", "title company")
//       .lean();

//     return res.json({
//       success: true,
//       message: "Application forwarded to industry partner",
//       data: {
//         ...updated,
//         liaisonStatus: "forwarded",
//         liaisonNote:   remarks || "",
//       },
//     });
//   } catch (err) {
//     console.error("PATCH liaison forward error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────────────────────
// // PATCH /api/liaison/applications/:id/reject
// // Industry Liaison rejects an application
// // ────────────────────────────────────────────────────────────────────────────
// router.patch("/applications/:id/reject", async (req, res) => {
//   try {
//     const { remarks } = req.body;

//     const application = await Application.findOne({
//       _id: req.params.id,
//       status: "sent_to_liaison",
//     });

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: "Application not found in liaison queue",
//       });
//     }

//     if (application.industryLiaisonApproval?.status === "rejected") {
//       return res.status(400).json({
//         success: false,
//         message: "Application has already been rejected",
//       });
//     }

//     application.industryLiaisonApproval = {
//       status:     "rejected",
//       rejectedAt: new Date(),
//       remarks:    remarks || "",
//     };

//     await application.save();

//     return res.json({
//       success: true,
//       message: "Application rejected by Industry Liaison",
//       data: {
//         liaisonStatus: "rejected",
//         liaisonNote:   remarks || "",
//       },
//     });
//   } catch (err) {
//     console.error("PATCH liaison reject error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────────────────────
// // GET /api/liaison/stats
// // Quick stats for the liaison dashboard
// // ────────────────────────────────────────────────────────────────────────────
// router.get("/stats", async (req, res) => {
//   try {
//     const all = await Application.find({ status: "sent_to_liaison" }).lean();

//     return res.json({
//       success: true,
//       stats: {
//         total:     all.length,
//         pending:   all.filter((a) => !a.industryLiaisonApproval?.status || a.industryLiaisonApproval.status === "pending").length,
//         forwarded: all.filter((a) => a.industryLiaisonApproval?.status === "approved").length,
//         rejected:  all.filter((a) => a.industryLiaisonApproval?.status === "rejected").length,
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// export default router;





// routes/liaisonRoutes.js





// import express from "express";
// import mongoose from "mongoose";

// const router = express.Router();

// // ── Schema ───────────────────────────────────────────────────────────────
// const applicationSchema = new mongoose.Schema(
//   {
//     studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },

//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "approved",
//         "rejected",
//         "sent_to_liaison",
//         "sent_to_industry", // ✅ ADDED
//       ],
//       default: "pending",
//     },

//     internshipInchargeApproval: {
//       status: {
//         type: String,
//         enum: ["pending", "approved", "rejected"],
//         default: "pending",
//       },
//       approvedAt: Date,
//       rejectedAt: Date,
//       remarks: String,
//     },

//     industryLiaisonApproval: {
//       status: {
//         type: String,
//         enum: ["pending", "approved", "rejected"],
//         default: "pending",
//       },
//       approvedAt: Date,
//       rejectedAt: Date,
//       remarks: String,
//     },

//     matchScore: { type: Number, default: 0 },
//     matchingSkills: [String],
//     missingSkills: [String],
//     cvSnapshot: String,
//     skillsSnapshot: [mongoose.Schema.Types.Mixed],
//     appliedAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const Application =
//   mongoose.models.Application ||
//   mongoose.model("Application", applicationSchema, "applications");

// // ─────────────────────────────────────────────────────────────────────────
// // GET ALL (liaison queue)
// // ─────────────────────────────────────────────────────────────────────────
// router.get("/applications", async (req, res) => {
//   try {
//     const { page = 1, limit = 50 } = req.query;

//     const applications = await Application.find({
//       status: "sent_to_liaison",
//     })
//       .populate(
//         "studentId",
//         "name email studentId department rollNumber profileImage"
//       )
//       .populate(
//         "internshipId",
//         "title company type requiredSkills slots description"
//       )
//       .sort({ updatedAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .lean();

//     const total = await Application.countDocuments({
//       status: "sent_to_liaison",
//     });

//     const stats = {
//       total,
//       pending: applications.filter(
//         (a) => a.industryLiaisonApproval?.status === "pending"
//       ).length,
//       forwarded: applications.filter(
//         (a) => a.industryLiaisonApproval?.status === "approved"
//       ).length,
//       rejected: applications.filter(
//         (a) => a.industryLiaisonApproval?.status === "rejected"
//       ).length,
//     };

//     const enriched = applications.map((a) => {
//       const ls = a.industryLiaisonApproval?.status;
//       return {
//         ...a,
//         liaisonStatus:
//           ls === "approved"
//             ? "forwarded"
//             : ls === "rejected"
//             ? "rejected"
//             : "pending",
//         liaisonNote: a.industryLiaisonApproval?.remarks || "",
//       };
//     });

//     return res.json({
//       success: true,
//       data: enriched,
//       stats,
//       pagination: {
//         total,
//         page: Number(page),
//         limit: Number(limit),
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     console.error("GET error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch applications",
//     });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────
// // FORWARD TO INDUSTRY (FIXED)
// // ─────────────────────────────────────────────────────────────────────────
// router.patch("/applications/:id/forward", async (req, res) => {
//   try {
//     const { remarks } = req.body;

//     const application = await Application.findOne({
//       _id: req.params.id,
//       status: "sent_to_liaison",
//     });

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: "Application not found",
//       });
//     }

//     if (application.industryLiaisonApproval?.status === "approved") {
//       return res.status(400).json({
//         success: false,
//         message: "Already forwarded",
//       });
//     }

//     console.log("BEFORE STATUS:", application.status);

//     // approval
//     application.industryLiaisonApproval = {
//       status: "approved",
//       approvedAt: new Date(),
//       remarks: remarks || "",
//     };

//     // ✅ MAIN FIX
//     application.status = "sent_to_industry";

//     await application.save();

//     // 🔍 VERIFY FROM DB
//     const check = await Application.findById(req.params.id);
//     console.log("AFTER STATUS (DB):", check.status);

//     return res.json({
//       success: true,
//       message: "Forwarded to industry",
//     });
//   } catch (err) {
//     console.error("Forward error:", err);
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────
// // REJECT
// // ─────────────────────────────────────────────────────────────────────────
// router.patch("/applications/:id/reject", async (req, res) => {
//   try {
//     const { remarks } = req.body;

//     const application = await Application.findOne({
//       _id: req.params.id,
//       status: "sent_to_liaison",
//     });

//     if (!application) {
//       return res.status(404).json({
//         success: false,
//         message: "Application not found",
//       });
//     }

//     application.industryLiaisonApproval = {
//       status: "rejected",
//       rejectedAt: new Date(),
//       remarks: remarks || "",
//     };

//     await application.save();

//     return res.json({
//       success: true,
//       message: "Rejected",
//     });
//   } catch (err) {
//     console.error("Reject error:", err);
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────
// // STATS
// // ─────────────────────────────────────────────────────────────────────────
// router.get("/stats", async (req, res) => {
//   try {
//     const all = await Application.find({
//       status: "sent_to_liaison",
//     }).lean();

//     return res.json({
//       success: true,
//       stats: {
//         total: all.length,
//         pending: all.filter(
//           (a) =>
//             !a.industryLiaisonApproval?.status ||
//             a.industryLiaisonApproval.status === "pending"
//         ).length,
//         forwarded: all.filter(
//           (a) => a.industryLiaisonApproval?.status === "approved"
//         ).length,
//         rejected: all.filter(
//           (a) => a.industryLiaisonApproval?.status === "rejected"
//         ).length,
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// });

// export default router;





// import express from "express";
// import mongoose from "mongoose";

// const router = express.Router();

// // ── Schemas ───────────────────────────────────────────────────────────────
// const applicationSchema = new mongoose.Schema(
//   {
//     studentId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     studentEmail: { type: String },
//     internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected", "sent_to_liaison", "sent_to_industry"],
//       default: "pending",
//     },
//     internshipInchargeApproval: {
//       status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//       approvedAt: Date,
//       rejectedAt: Date,
//       remarks:    String,
//     },
//     industryLiaisonApproval: {
//       status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//       approvedAt: Date,
//       rejectedAt: Date,
//       remarks:    String,
//     },
//     matchScore:     { type: Number, default: 0 },
//     matchingSkills: [String],
//     missingSkills:  [String],
//     cvSnapshot:     String,
//     skillsSnapshot: [mongoose.Schema.Types.Mixed],
//     appliedAt:      { type: Date, default: Date.now },
//   },
//   { timestamps: true, strict: false }
// );

// const Application =
//   mongoose.models.Application ||
//   mongoose.model("Application", applicationSchema, "applications");

// // User schema — needed to lookup by studentEmail
// const userSchema = new mongoose.Schema(
//   {
//     name:         String,
//     email:        String,
//     studentId:    String,
//     department:   String,
//     rollNumber:   String,
//     profileImage: String,
//     cgpa:         Number,
//   },
//   { timestamps: true, strict: false }
// );
// const User =
//   mongoose.models.User ||
//   mongoose.model("User", userSchema, "users");

// // Internship schema
// const internshipSchema = new mongoose.Schema(
//   {
//     title:          String,
//     company:        String,
//     description:    String,
//     requiredSkills: [String],
//     type:           String,
//     slots:          Number,
//     deadline:       Date,
//     isActive:       Boolean,
//     postedBy:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true, strict: false }
// );
// const Internship =
//   mongoose.models.Internship ||
//   mongoose.model("Internship", internshipSchema, "internships");

// // ── Helper: enrich a raw application with student + internship data ────────
// async function enrichApplication(app) {
//   const enriched = { ...app };

//   // ── Resolve student ──────────────────────────────────────────────────────
//   // Priority 1: studentId already populated with a name
//   if (app.studentId?.name) {
//     enriched.resolvedStudent = app.studentId;
//   }
//   // Priority 2: studentId is an ObjectId — try to populate manually
//   else if (app.studentId && !app.studentId.name) {
//     try {
//       const user = await User.findById(app.studentId).lean();
//       if (user) enriched.resolvedStudent = user;
//     } catch (_) {}
//   }

//   // Priority 3: fall back to studentEmail lookup
//   if (!enriched.resolvedStudent && app.studentEmail) {
//     const user = await User.findOne({ email: app.studentEmail }).lean();
//     if (user) {
//       enriched.resolvedStudent = user;
//     } else {
//       // last resort: derive display name from email prefix
//       enriched.resolvedStudent = {
//         name:  app.studentEmail.split("@")[0],
//         email: app.studentEmail,
//       };
//     }
//   }

//   if (!enriched.resolvedStudent) {
//     enriched.resolvedStudent = { name: "Unknown Student", email: "" };
//   }

//   // ── Resolve internship ────────────────────────────────────────────────────
//   if (app.internshipId?.title) {
//     enriched.resolvedInternship = app.internshipId;
//   } else if (app.internshipId) {
//     try {
//       const intern = await Internship.findById(
//         app.internshipId?._id || app.internshipId
//       ).lean();
//       if (intern) enriched.resolvedInternship = intern;
//     } catch (_) {}
//   }

//   if (!enriched.resolvedInternship) {
//     enriched.resolvedInternship = { title: "Unknown Internship", company: "—" };
//   }

//   // ── Map liaison status ───────────────────────────────────────────────────
//   const ls = app.industryLiaisonApproval?.status;
//   enriched.liaisonStatus =
//     ls === "approved" ? "forwarded" : ls === "rejected" ? "rejected" : "pending";
//   enriched.liaisonNote = app.industryLiaisonApproval?.remarks || "";

//   // Expose resolved data at top level so the existing frontend fields work
//   enriched.studentId  = enriched.resolvedStudent;
//   enriched.internshipId = enriched.resolvedInternship;

//   return enriched;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // GET /api/liaison/applications
// // Returns all apps with status = sent_to_liaison, fully enriched
// // ─────────────────────────────────────────────────────────────────────────────
// router.get("/applications", async (req, res) => {
//   try {
//     const { page = 1, limit = 50 } = req.query;

//     const raw = await Application.find({ status: "sent_to_liaison" })
//       .populate("studentId",    "name email studentId department rollNumber profileImage cgpa")
//       .populate("internshipId", "title company type requiredSkills slots description")
//       .sort({ updatedAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .lean();

//     const total = await Application.countDocuments({ status: "sent_to_liaison" });

//     // Enrich every application
//     const enriched = await Promise.all(raw.map(enrichApplication));

//     const stats = {
//       total,
//       pending:   enriched.filter((a) => a.liaisonStatus === "pending").length,
//       forwarded: enriched.filter((a) => a.liaisonStatus === "forwarded").length,
//       rejected:  enriched.filter((a) => a.liaisonStatus === "rejected").length,
//     };

//     return res.json({
//       success: true,
//       data: enriched,
//       stats,
//       pagination: {
//         total,
//         page:  Number(page),
//         limit: Number(limit),
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     console.error("GET /liaison/applications error:", err);
//     return res.status(500).json({ success: false, message: "Failed to fetch applications" });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // PATCH /api/liaison/applications/:id/forward  →  sent_to_industry
// // ─────────────────────────────────────────────────────────────────────────────
// router.patch("/applications/:id/forward", async (req, res) => {
//   try {
//     const { remarks } = req.body;

//     const application = await Application.findOne({
//       _id: req.params.id,
//       status: "sent_to_liaison",
//     });

//     if (!application) {
//       return res.status(404).json({ success: false, message: "Application not found or not in liaison queue" });
//     }

//     if (application.industryLiaisonApproval?.status === "approved") {
//       return res.status(400).json({ success: false, message: "Already forwarded to industry" });
//     }

//     application.industryLiaisonApproval = {
//       status:     "approved",
//       approvedAt: new Date(),
//       remarks:    remarks || "",
//     };
//     application.status = "sent_to_industry";

//     await application.save();

//     return res.json({ success: true, message: "Application forwarded to industry successfully" });
//   } catch (err) {
//     console.error("Forward error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // PATCH /api/liaison/applications/:id/reject
// // ─────────────────────────────────────────────────────────────────────────────
// router.patch("/applications/:id/reject", async (req, res) => {
//   try {
//     const { remarks } = req.body;

//     const application = await Application.findOne({
//       _id:    req.params.id,
//       status: "sent_to_liaison",
//     });

//     if (!application) {
//       return res.status(404).json({ success: false, message: "Application not found or not in liaison queue" });
//     }

//     application.industryLiaisonApproval = {
//       status:     "rejected",
//       rejectedAt: new Date(),
//       remarks:    remarks || "",
//     };
//     // Status stays "sent_to_liaison" so incharge can still see it,
//     // but liaisonStatus derived field will show "rejected"
//     // Alternatively set to "rejected" if you want it removed from queue:
//     application.status = "rejected";

//     await application.save();

//     return res.json({ success: true, message: "Application rejected" });
//   } catch (err) {
//     console.error("Reject error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // GET /api/liaison/stats
// // ─────────────────────────────────────────────────────────────────────────────
// router.get("/stats", async (req, res) => {
//   try {
//     const all = await Application.find({ status: "sent_to_liaison" }).lean();
//     return res.json({
//       success: true,
//       stats: {
//         total:     all.length,
//         pending:   all.filter((a) => !a.industryLiaisonApproval?.status || a.industryLiaisonApproval.status === "pending").length,
//         forwarded: all.filter((a) => a.industryLiaisonApproval?.status === "approved").length,
//         rejected:  all.filter((a) => a.industryLiaisonApproval?.status === "rejected").length,
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// export default router;





// import express from "express";
// import mongoose from "mongoose";

// const router = express.Router();

// // ── Schemas ───────────────────────────────────────────────────────────────
// const applicationSchema = new mongoose.Schema(
//   {
//     studentId:    { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
//     studentEmail: { type: String },
//     internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected", "sent_to_liaison", "sent_to_industry"],
//       default: "pending",
//     },
//     internshipInchargeApproval: {
//       status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//       approvedAt: Date,
//       rejectedAt: Date,
//       remarks:    String,
//     },
//     industryLiaisonApproval: {
//       status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//       approvedAt: Date,
//       rejectedAt: Date,
//       remarks:    String,
//     },
//     matchScore:     { type: Number, default: 0 },
//     matchingSkills: [String],
//     missingSkills:  [String],
//     cvSnapshot:     String,
//     skillsSnapshot: [mongoose.Schema.Types.Mixed],
//     appliedAt:      { type: Date, default: Date.now },
//   },
//   { timestamps: true, strict: false }
// );

// const Application =
//   mongoose.models.Application ||
//   mongoose.model("Application", applicationSchema, "applications");

// // ── Student schema — collection is "students", name field is "fullName" ───
// const studentSchema = new mongoose.Schema(
//   {
//     fullName:        String,
//     email:           String,
//     department:      String,
//     semester:        String,
//     phone:           String,
//     profileImage:    String,
//     cvUrl:           String,
//     extractedSkills: [mongoose.Schema.Types.Mixed],
//   },
//   { timestamps: true, strict: false }
// );
// const Student =
//   mongoose.models.Student ||
//   mongoose.model("Student", studentSchema, "students");

// // ── Internship schema ─────────────────────────────────────────────────────
// const internshipSchema = new mongoose.Schema(
//   {
//     title:          String,
//     company:        String,
//     description:    String,
//     requiredSkills: [String],
//     type:           String,
//     slots:          Number,
//     deadline:       Date,
//     isActive:       Boolean,
//     postedBy:       { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
//   },
//   { timestamps: true, strict: false }
// );
// const Internship =
//   mongoose.models.Internship ||
//   mongoose.model("Internship", internshipSchema, "internships");

// // ── Helpers ───────────────────────────────────────────────────────────────
// const normaliseSkill = (s) => (s || "").toLowerCase().trim();
// const skillName      = (s) => (typeof s === "string" ? s : s?.name || s?.skill || "");

// // Resolve student doc → always expose a "name" field for frontend
// const resolveStudent = (doc, fallbackEmail) => {
//   if (!doc && !fallbackEmail) return { name: "Unknown Student", email: "" };
//   if (!doc) return { name: fallbackEmail.split("@")[0], email: fallbackEmail };
//   return {
//     ...doc,
//     name: doc.fullName || doc.name || fallbackEmail?.split("@")[0] || "Unknown",
//   };
// };

// // ── Enrich one application ────────────────────────────────────────────────
// async function enrichApplication(app) {
//   const enriched = { ...app };

//   // ── Resolve student ───────────────────────────────────────────────────
//   let studentDoc = null;

//   // Priority 1: already populated and has fullName
//   if (app.studentId && typeof app.studentId === "object" && app.studentId.fullName) {
//     studentDoc = app.studentId;
//   }
//   // Priority 2: lookup by ObjectId in students collection
//   else if (app.studentId) {
//     try {
//       studentDoc = await Student.findById(app.studentId?._id || app.studentId).lean();
//     } catch (_) {}
//   }
//   // Priority 3: lookup by studentEmail
//   if (!studentDoc && app.studentEmail) {
//     studentDoc = await Student.findOne({ email: app.studentEmail }).lean();
//   }

//   enriched.resolvedStudent = resolveStudent(studentDoc, app.studentEmail);

//   // ── Resolve internship ────────────────────────────────────────────────
//   let internDoc = null;
//   if (app.internshipId && typeof app.internshipId === "object" && app.internshipId.title) {
//     internDoc = app.internshipId;
//   } else if (app.internshipId) {
//     try {
//       internDoc = await Internship.findById(app.internshipId?._id || app.internshipId).lean();
//     } catch (_) {}
//   }
//   if (!internDoc) {
//     internDoc = { title: "Unknown Internship", company: "—", requiredSkills: [] };
//   }
//   enriched.resolvedInternship = internDoc;

//   // ── Recalculate match score if stored value is 0 ──────────────────────
//   if ((app.matchScore ?? 0) === 0) {
//     const requiredSkills = (internDoc.requiredSkills || []).map(normaliseSkill);
//     const studentSkills  = (studentDoc?.extractedSkills || [])
//       .map((s) => normaliseSkill(skillName(s)));

//     if (requiredSkills.length > 0 && studentSkills.length > 0) {
//       const matching = requiredSkills.filter((rs) =>
//         studentSkills.some((ss) => ss.includes(rs) || rs.includes(ss))
//       );
//       const missing = requiredSkills.filter(
//         (rs) => !studentSkills.some((ss) => ss.includes(rs) || rs.includes(ss))
//       );
//       enriched.matchScore     = Math.round((matching.length / requiredSkills.length) * 100);
//       enriched.matchingSkills = matching;
//       enriched.missingSkills  = missing;
//     }
//   }

//   // ── Map liaison status ────────────────────────────────────────────────
//   const ls = app.industryLiaisonApproval?.status;
//   enriched.liaisonStatus =
//     ls === "approved" ? "forwarded" : ls === "rejected" ? "rejected" : "pending";
//   enriched.liaisonNote = app.industryLiaisonApproval?.remarks || "";

//   // Expose at top level so frontend field names work unchanged
//   enriched.studentId    = enriched.resolvedStudent;
//   enriched.internshipId = enriched.resolvedInternship;

//   return enriched;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // GET /api/liaison/applications
// // ─────────────────────────────────────────────────────────────────────────────
// router.get("/applications", async (req, res) => {
//   try {
//     const { page = 1, limit = 50 } = req.query;

//     const raw = await Application.find({ status: "sent_to_liaison" })
//       .populate("studentId",    "fullName email department semester phone profileImage cvUrl extractedSkills")
//       .populate("internshipId", "title company type requiredSkills slots description")
//       .sort({ updatedAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .lean();

//     const total = await Application.countDocuments({ status: "sent_to_liaison" });

//     const enriched = await Promise.all(raw.map(enrichApplication));

//     const stats = {
//       total,
//       pending:   enriched.filter((a) => a.liaisonStatus === "pending").length,
//       forwarded: enriched.filter((a) => a.liaisonStatus === "forwarded").length,
//       rejected:  enriched.filter((a) => a.liaisonStatus === "rejected").length,
//     };

//     return res.json({
//       success: true,
//       data: enriched,
//       stats,
//       pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
//     });
//   } catch (err) {
//     console.error("GET /liaison/applications error:", err);
//     return res.status(500).json({ success: false, message: "Failed to fetch applications" });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // PATCH /api/liaison/applications/:id/forward  →  sent_to_industry
// // ─────────────────────────────────────────────────────────────────────────────
// router.patch("/applications/:id/forward", async (req, res) => {
//   try {
//     const { remarks } = req.body;

//     const application = await Application.findOne({
//       _id: req.params.id,
//       status: "sent_to_liaison",
//     });

//     if (!application) {
//       return res.status(404).json({ success: false, message: "Application not found or not in liaison queue" });
//     }

//     if (application.industryLiaisonApproval?.status === "approved") {
//       return res.status(400).json({ success: false, message: "Already forwarded to industry" });
//     }

//     application.industryLiaisonApproval = {
//       status:     "approved",
//       approvedAt: new Date(),
//       remarks:    remarks || "",
//     };
//     application.status = "sent_to_industry";

//     await application.save();

//     return res.json({ success: true, message: "Application forwarded to industry successfully" });
//   } catch (err) {
//     console.error("Forward error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // PATCH /api/liaison/applications/:id/reject
// // ─────────────────────────────────────────────────────────────────────────────
// router.patch("/applications/:id/reject", async (req, res) => {
//   try {
//     const { remarks } = req.body;

//     const application = await Application.findOne({
//       _id:    req.params.id,
//       status: "sent_to_liaison",
//     });

//     if (!application) {
//       return res.status(404).json({ success: false, message: "Application not found or not in liaison queue" });
//     }

//     application.industryLiaisonApproval = {
//       status:     "rejected",
//       rejectedAt: new Date(),
//       remarks:    remarks || "",
//     };
//     application.status = "rejected";

//     await application.save();

//     return res.json({ success: true, message: "Application rejected" });
//   } catch (err) {
//     console.error("Reject error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // GET /api/liaison/stats
// // ─────────────────────────────────────────────────────────────────────────────
// router.get("/stats", async (req, res) => {
//   try {
//     const all = await Application.find({ status: "sent_to_liaison" }).lean();
//     return res.json({
//       success: true,
//       stats: {
//         total:     all.length,
//         pending:   all.filter((a) => !a.industryLiaisonApproval?.status || a.industryLiaisonApproval.status === "pending").length,
//         forwarded: all.filter((a) => a.industryLiaisonApproval?.status === "approved").length,
//         rejected:  all.filter((a) => a.industryLiaisonApproval?.status === "rejected").length,
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// export default router;




import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ── Schemas ───────────────────────────────────────────────────────────────
const applicationSchema = new mongoose.Schema(
  {
    studentId:    { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    studentEmail: { type: String },
    internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "sent_to_liaison", "sent_to_industry"],
      default: "pending",
    },
    internshipInchargeApproval: {
      status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      approvedAt: Date,
      rejectedAt: Date,
      remarks:    String,
    },
    industryLiaisonApproval: {
      status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      approvedAt: Date,
      rejectedAt: Date,
      remarks:    String,
    },
    matchScore:     { type: Number, default: 0 },
    matchingSkills: [String],
    missingSkills:  [String],
    cvSnapshot:     String,
    skillsSnapshot: [mongoose.Schema.Types.Mixed],
    appliedAt:      { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false }
);

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema, "applications");

// ── Student schema — collection is "students", name field is "fullName" ───
const studentSchema = new mongoose.Schema(
  {
    fullName:        String,
    email:           String,
    department:      String,
    semester:        String,
    phone:           String,
    profileImage:    String,
    cvUrl:           String,
    extractedSkills: [mongoose.Schema.Types.Mixed],
  },
  { timestamps: true, strict: false }
);
const Student =
  mongoose.models.Student ||
  mongoose.model("Student", studentSchema, "students");

// ── Internship schema ─────────────────────────────────────────────────────
const internshipSchema = new mongoose.Schema(
  {
    title:          String,
    company:        String,
    description:    String,
    requiredSkills: [String],
    type:           String,
    slots:          Number,
    deadline:       Date,
    isActive:       Boolean,
    postedBy:       { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  },
  { timestamps: true, strict: false }
);
const Internship =
  mongoose.models.Internship ||
  mongoose.model("Internship", internshipSchema, "internships");

// ── Helpers ───────────────────────────────────────────────────────────────
const normaliseSkill = (s) => (s || "").toLowerCase().trim();
const skillName      = (s) => (typeof s === "string" ? s : s?.name || s?.skill || "");

// Resolve student doc → always expose a "name" field for frontend
const resolveStudent = (doc, fallbackEmail) => {
  if (!doc && !fallbackEmail) return { name: "Unknown Student", email: "" };
  if (!doc) return { name: fallbackEmail.split("@")[0], email: fallbackEmail };
  return {
    ...doc,
    name: doc.fullName || doc.name || fallbackEmail?.split("@")[0] || "Unknown",
  };
};

// ── Enrich one application ────────────────────────────────────────────────
async function enrichApplication(app) {
  const enriched = { ...app };

  // ── Resolve student ───────────────────────────────────────────────────
  let studentDoc = null;

  // Priority 1: already populated and has fullName
  if (app.studentId && typeof app.studentId === "object" && app.studentId.fullName) {
    studentDoc = app.studentId;
  }
  // Priority 2: lookup by ObjectId in students collection
  else if (app.studentId) {
    try {
      studentDoc = await Student.findById(app.studentId?._id || app.studentId).lean();
    } catch (_) {}
  }
  // Priority 3: lookup by studentEmail
  if (!studentDoc && app.studentEmail) {
    studentDoc = await Student.findOne({ email: app.studentEmail }).lean();
  }

  enriched.resolvedStudent = resolveStudent(studentDoc, app.studentEmail);

  // ── Resolve internship ────────────────────────────────────────────────
  let internDoc = null;
  if (app.internshipId && typeof app.internshipId === "object" && app.internshipId.title) {
    internDoc = app.internshipId;
  } else if (app.internshipId) {
    try {
      internDoc = await Internship.findById(app.internshipId?._id || app.internshipId).lean();
    } catch (_) {}
  }
  if (!internDoc) {
    internDoc = { title: "Unknown Internship", company: "—", requiredSkills: [] };
  }
  enriched.resolvedInternship = internDoc;

  // ── Recalculate match score if stored value is 0 ──────────────────────
  if ((app.matchScore ?? 0) === 0) {
    const requiredSkills = (internDoc.requiredSkills || []).map(normaliseSkill);
    const studentSkills  = (studentDoc?.extractedSkills || [])
      .map((s) => normaliseSkill(skillName(s)));

    if (requiredSkills.length > 0 && studentSkills.length > 0) {
      const matching = requiredSkills.filter((rs) =>
        studentSkills.some((ss) => ss.includes(rs) || rs.includes(ss))
      );
      const missing = requiredSkills.filter(
        (rs) => !studentSkills.some((ss) => ss.includes(rs) || rs.includes(ss))
      );
      enriched.matchScore     = Math.round((matching.length / requiredSkills.length) * 100);
      enriched.matchingSkills = matching;
      enriched.missingSkills  = missing;
    }
  }

  // ── Map liaison status ────────────────────────────────────────────────
  const ls = app.industryLiaisonApproval?.status;
  const appStatus = (app.status || "").toLowerCase();

  // sent_to_industry = liaison forwarded it
  // rejected with liaisionApproval.rejected = liaison rejected it
  // sent_to_liaison with liaisionApproval.pending = still pending
  enriched.liaisonStatus =
    appStatus === "sent_to_industry"  ? "forwarded" :
    ls        === "approved"          ? "forwarded" :
    ls        === "rejected"          ? "rejected"  :
    appStatus === "rejected" && ls === "rejected" ? "rejected" :
    "pending";

  enriched.liaisonNote = app.industryLiaisonApproval?.remarks || "";

  // Expose at top level so frontend field names work unchanged
  enriched.studentId    = enriched.resolvedStudent;
  enriched.internshipId = enriched.resolvedInternship;

  return enriched;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/liaison/applications
// ─────────────────────────────────────────────────────────────────────────────
router.get("/applications", async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    // Fetch all apps that have ever been in the liaison queue:
    // sent_to_liaison = pending review
    // sent_to_industry = forwarded by liaison
    // rejected (with industryLiaisonApproval set) = rejected by liaison
    const raw = await Application.find({
      $or: [
        { status: "sent_to_liaison" },
        { status: "sent_to_industry" },
        {
          status: "rejected",
          "industryLiaisonApproval.status": "rejected",
        },
      ],
    })
      .populate("studentId",    "fullName email department semester phone profileImage cvUrl extractedSkills")
      .populate("internshipId", "title company type requiredSkills slots description")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Application.countDocuments({
      $or: [
        { status: "sent_to_liaison" },
        { status: "sent_to_industry" },
        { status: "rejected", "industryLiaisonApproval.status": "rejected" },
      ],
    });

    const enriched = await Promise.all(raw.map(enrichApplication));

    const stats = {
      total,
      pending:   enriched.filter((a) => a.liaisonStatus === "pending").length,
      forwarded: enriched.filter((a) => a.liaisonStatus === "forwarded").length,
      rejected:  enriched.filter((a) => a.liaisonStatus === "rejected").length,
    };

    return res.json({
      success: true,
      data: enriched,
      stats,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("GET /liaison/applications error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/liaison/applications/:id/forward  →  sent_to_industry
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/applications/:id/forward", async (req, res) => {
  try {
    const { remarks } = req.body;

    const application = await Application.findOne({
      _id: req.params.id,
      status: "sent_to_liaison",
    });

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found or not in liaison queue" });
    }

    if (application.industryLiaisonApproval?.status === "approved") {
      return res.status(400).json({ success: false, message: "Already forwarded to industry" });
    }

    application.industryLiaisonApproval = {
      status:     "approved",
      approvedAt: new Date(),
      remarks:    remarks || "",
    };
    application.status = "sent_to_industry";

    await application.save();

    return res.json({ success: true, message: "Application forwarded to industry successfully" });
  } catch (err) {
    console.error("Forward error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/liaison/applications/:id/reject
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/applications/:id/reject", async (req, res) => {
  try {
    const { remarks } = req.body;

    const application = await Application.findOne({
      _id:    req.params.id,
      status: "sent_to_liaison",
    });

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found or not in liaison queue" });
    }

    application.industryLiaisonApproval = {
      status:     "rejected",
      rejectedAt: new Date(),
      remarks:    remarks || "",
    };
    application.status = "rejected";

    await application.save();

    return res.json({ success: true, message: "Application rejected" });
  } catch (err) {
    console.error("Reject error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/liaison/stats
// ─────────────────────────────────────────────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const all = await Application.find({ status: "sent_to_liaison" }).lean();
    return res.json({
      success: true,
      stats: {
        total:     all.length,
        pending:   all.filter((a) => !a.industryLiaisonApproval?.status || a.industryLiaisonApproval.status === "pending").length,
        forwarded: all.filter((a) => a.industryLiaisonApproval?.status === "approved").length,
        rejected:  all.filter((a) => a.industryLiaisonApproval?.status === "rejected").length,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;