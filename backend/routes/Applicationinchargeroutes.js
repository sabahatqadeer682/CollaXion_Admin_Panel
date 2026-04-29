// import express from "express";
// import mongoose from "mongoose";
// import User from "../models/User.js";
// const router = express.Router();

// // ── Application Schema (matches your existing collection) ──────────────
// const applicationSchema = new mongoose.Schema(
//   {
//     studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected", "sent_to_liaison"],
//       default: "pending",
//     },
//     internshipInchargeApproval: {
//       status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//       approvedAt: Date,
//       rejectedAt: Date,
//       remarks: String,
//     },
//     industryLiaisonApproval: {
//       status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
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

// // Use existing model if already registered, else create new
// const Application =
//   mongoose.models.Application ||
//   mongoose.model("Application", applicationSchema, "applications");

// // ── Internship Schema (for populate) ──────────────────────────────────
// const internshipSchema = new mongoose.Schema(
//   {
//     title: String,
//     company: String,
//     description: String,
//     requiredSkills: [String],
//     type: String,
//     slots: Number,
//     deadline: Date,
//     isActive: { type: Boolean, default: true },
//     postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// const Internship =
//   mongoose.models.Internship ||
//   mongoose.model("Internship", internshipSchema, "internships");

// // ────────────────────────────────────────────────────────────────────────
// // GET /api/incharge/applications
// // Fetch all applications for Incharge to review
// // Query params: status (optional filter)
// // ────────────────────────────────────────────────────────────────────────
// router.get("/applications", async (req, res) => {
//   try {
//     const { status, page = 1, limit = 50 } = req.query;

//     const filter = {};
//     if (status && status !== "all") filter.status = status;

//     const applications = await Application.find(filter)
//       .populate("studentId", "name email studentId department rollNumber profileImage")
//       .populate("internshipId", "title company type requiredSkills slots")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .lean();

//     const total = await Application.countDocuments(filter);

//     // Stats summary
//     const stats = {
//       total: await Application.countDocuments(),
//       pending: await Application.countDocuments({ status: "pending" }),
//       approved: await Application.countDocuments({ status: "approved" }),
//       rejected: await Application.countDocuments({ status: "rejected" }),
//       sent_to_liaison: await Application.countDocuments({ status: "sent_to_liaison" }),
//     };

//     return res.json({
//       success: true,
//       data: applications,
//       stats,
//       pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
//     });
//   } catch (err) {
//     console.error("GET /incharge/applications error:", err);
//     return res.status(500).json({ success: false, message: "Failed to fetch applications", error: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────────────────
// // GET /api/incharge/applications/:id
// // Single application detail
// // ────────────────────────────────────────────────────────────────────────
// router.get("/applications/:id", async (req, res) => {
//   try {
//     const app = await Application.findById(req.params.id)
//       .populate("studentId", "name email studentId department rollNumber profileImage")
//       .populate("internshipId", "title company type requiredSkills slots description")
//       .lean();

//     if (!app) return res.status(404).json({ success: false, message: "Application not found" });

//     return res.json({ success: true, data: app });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────────────────
// // PATCH /api/incharge/applications/:id/approve
// // Incharge approves an application
// // ────────────────────────────────────────────────────────────────────────
// router.patch("/applications/:id/approve", async (req, res) => {
//   try {
//     const { remarks } = req.body;

//     const application = await Application.findById(req.params.id);
//     if (!application) return res.status(404).json({ success: false, message: "Application not found" });

//     if (application.status !== "pending") {
//       return res.status(400).json({
//         success: false,
//         message: `Cannot approve — current status is '${application.status}'`,
//       });
//     }

//     application.status = "approved";
//     application.internshipInchargeApproval = {
//       status: "approved",
//       approvedAt: new Date(),
//       remarks: remarks || "",
//     };

//     await application.save();

//     const updated = await Application.findById(req.params.id)
//       .populate("studentId", "name email studentId department")
//       .populate("internshipId", "title company")
//       .lean();

//     return res.json({ success: true, message: "Application approved", data: updated });
//   } catch (err) {
//     console.error("PATCH approve error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────────────────
// // PATCH /api/incharge/applications/:id/reject
// // Incharge rejects an application
// // ────────────────────────────────────────────────────────────────────────
// router.patch("/applications/:id/reject", async (req, res) => {
//   try {
//     const { remarks } = req.body;

//     const application = await Application.findById(req.params.id);
//     if (!application) return res.status(404).json({ success: false, message: "Application not found" });

//     if (!["pending", "approved"].includes(application.status)) {
//       return res.status(400).json({
//         success: false,
//         message: `Cannot reject — current status is '${application.status}'`,
//       });
//     }

//     application.status = "rejected";
//     application.internshipInchargeApproval = {
//       status: "rejected",
//       rejectedAt: new Date(),
//       remarks: remarks || "",
//     };

//     await application.save();

//     return res.json({ success: true, message: "Application rejected" });
//   } catch (err) {
//     console.error("PATCH reject error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────────────────
// // PATCH /api/incharge/applications/:id/send-to-liaison
// // Forward approved application to Industry Liaison
// // ────────────────────────────────────────────────────────────────────────
// router.patch("/applications/:id/send-to-liaison", async (req, res) => {
//   try {
//     const application = await Application.findById(req.params.id);
//     if (!application) return res.status(404).json({ success: false, message: "Application not found" });

//     if (application.status !== "approved") {
//       return res.status(400).json({
//         success: false,
//         message: "Only approved applications can be sent to liaison",
//       });
//     }

//     application.status = "sent_to_liaison";
//     application.industryLiaisonApproval = {
//       status: "pending",
//     };

//     await application.save();

//     const updated = await Application.findById(req.params.id)
//       .populate("studentId", "name email studentId department")
//       .populate("internshipId", "title company")
//       .lean();

//     return res.json({ success: true, message: "Application forwarded to Industry Liaison", data: updated });
//   } catch (err) {
//     console.error("PATCH send-to-liaison error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────────────────
// // GET /api/incharge/internships
// // All internship postings (for dropdown/display in frontend)
// // ────────────────────────────────────────────────────────────────────────
// router.get("/internships", async (req, res) => {
//   try {
//     const internships = await Internship.find({})
//       .sort({ createdAt: -1 })
//       .lean();

//     return res.json({ success: true, data: internships });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// export default router;


// import express from "express";
// import mongoose from "mongoose";
// const router = express.Router();

// // ── Application Schema ─────────────────────────────────────────────────
// const applicationSchema = new mongoose.Schema(
//   {
//     studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     studentEmail: { type: String },
//     internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
//     status: { type: String, default: "pending" },
//     internshipInchargeApproval: {
//       status: { type: String, default: "pending" },
//       approvedAt: Date,
//       rejectedAt: Date,
//       remarks: String,
//     },
//     industryLiaisonApproval: {
//       status: { type: String, default: "pending" },
//       approvedAt: Date,
//       rejectedAt: Date,
//       remarks: String,
//     },
//     matchScore: { type: Number, default: 0 },
//     matchingSkills: [String],
//     missingSkills: [String],
//     cvSnapshot: String,
//     coverLetter: String,
//     skillsSnapshot: [mongoose.Schema.Types.Mixed],
//     statusHistory: [mongoose.Schema.Types.Mixed],
//     appliedAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true, strict: false }
// );

// const Application =
//   mongoose.models.Application ||
//   mongoose.model("Application", applicationSchema, "applications");

// // ── Internship Schema ─────────────────────────────────────────────────
// const internshipSchema = new mongoose.Schema(
//   { title: String, company: String, description: String, requiredSkills: [String], type: String, slots: Number, deadline: Date, isActive: Boolean, postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } },
//   { timestamps: true, strict: false }
// );
// const Internship =
//   mongoose.models.Internship ||
//   mongoose.model("Internship", internshipSchema, "internships");

// // ── User Schema ────────────────────────────────────────────────────────
// const userSchema = new mongoose.Schema(
//   { name: String, email: String, studentId: String, department: String, rollNumber: String, profileImage: String },
//   { timestamps: true, strict: false }
// );
// const User =
//   mongoose.models.User ||
//   mongoose.model("User", userSchema, "users");

// // ── Helper: normalise status to lowercase ─────────────────────────────
// const normaliseStatus = (s) => (s || "").toLowerCase().replace(/ /g, "_");

// // ── Helper: case-insensitive status filter ────────────────────────────
// const statusFilter = (value) => ({
//   $regex: new RegExp(`^${value}$`, "i"),
// });

// // ────────────────────────────────────────────────────────────────────────
// // GET /api/incharge/applications
// // ────────────────────────────────────────────────────────────────────────
// router.get("/applications", async (req, res) => {
//   try {
//     const { status, page = 1, limit = 50 } = req.query;

//     const filter = {};
//     if (status && status !== "all") {
//       filter.status = statusFilter(status);
//     }

//     let applications = await Application.find(filter)
//       .populate("studentId", "name email studentId department rollNumber profileImage")
//       .populate("internshipId", "title company type requiredSkills slots")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .lean();

//     // Enrich: lookup by studentEmail if studentId not populated
//     const emailsToLookup = applications
//       .filter((a) => !a.studentId?.name && a.studentEmail)
//       .map((a) => a.studentEmail);

//     let usersByEmail = {};
//     if (emailsToLookup.length > 0) {
//       const users = await User.find({ email: { $in: emailsToLookup } }).lean();
//       users.forEach((u) => { usersByEmail[u.email] = u; });
//     }

//     applications = applications.map((app) => {
//       app.status = normaliseStatus(app.status);
//       if (!app.studentId?.name && app.studentEmail) {
//         const user = usersByEmail[app.studentEmail];
//         app.studentId = user || { name: app.studentEmail.split("@")[0], email: app.studentEmail };
//       }
//       return app;
//     });

//     // Stats
//     const allApps = await Application.find({}).lean();
//     const count = (s) => allApps.filter((a) => normaliseStatus(a.status) === s).length;
//     const stats = {
//       total: allApps.length,
//       pending: count("pending"),
//       approved: count("approved"),
//       rejected: count("rejected"),
//       sent_to_liaison: count("sent_to_liaison"),
//     };

//     const total = await Application.countDocuments(filter);
//     return res.json({
//       success: true,
//       data: applications,
//       stats,
//       pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
//     });
//   } catch (err) {
//     console.error("GET /incharge/applications error:", err);
//     return res.status(500).json({ success: false, message: "Failed to fetch applications", error: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────────────────
// // GET /api/incharge/applications/:id
// // ────────────────────────────────────────────────────────────────────────
// router.get("/applications/:id", async (req, res) => {
//   try {
//     let app = await Application.findById(req.params.id)
//       .populate("studentId", "name email studentId department rollNumber profileImage")
//       .populate("internshipId", "title company type requiredSkills slots description")
//       .lean();

//     if (!app) return res.status(404).json({ success: false, message: "Application not found" });

//     app.status = normaliseStatus(app.status);

//     if (!app.studentId?.name && app.studentEmail) {
//       const user = await User.findOne({ email: app.studentEmail }).lean();
//       app.studentId = user || { name: app.studentEmail.split("@")[0], email: app.studentEmail };
//     }

//     return res.json({ success: true, data: app });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────────────────
// // PATCH /api/incharge/applications/:id/approve
// // Incharge accepts → status goes directly to sent_to_liaison
// // ────────────────────────────────────────────────────────────────────────
// router.patch("/applications/:id/approve", async (req, res) => {
//   try {
//     const { remarks } = req.body;

//     const application = await Application.findById(req.params.id);
//     if (!application) return res.status(404).json({ success: false, message: "Application not found" });

//     const currentStatus = normaliseStatus(application.status);
//     if (currentStatus !== "pending") {
//       return res.status(400).json({
//         success: false,
//         message: `Cannot accept — current status is '${application.status}'`,
//       });
//     }

//     // Directly set to sent_to_liaison (incharge accepts → goes to liaison)
//     application.status = "sent_to_liaison";
//     application.internshipInchargeApproval = {
//       status: "approved",
//       approvedAt: new Date(),
//       remarks: remarks || "Accepted by incharge",
//     };
//     application.industryLiaisonApproval = {
//       status: "pending",
//     };

//     await application.save();

//     let updated = await Application.findById(req.params.id)
//       .populate("studentId", "name email studentId department")
//       .populate("internshipId", "title company")
//       .lean();

//     updated.status = normaliseStatus(updated.status);

//     return res.json({ success: true, message: "Application accepted and sent to Industry Liaison", data: updated });
//   } catch (err) {
//     console.error("PATCH approve error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────────────────
// // PATCH /api/incharge/applications/:id/reject
// // ────────────────────────────────────────────────────────────────────────
// router.patch("/applications/:id/reject", async (req, res) => {
//   try {
//     const { remarks } = req.body;

//     const application = await Application.findById(req.params.id);
//     if (!application) return res.status(404).json({ success: false, message: "Application not found" });

//     const currentStatus = normaliseStatus(application.status);
//     if (!["pending", "approved"].includes(currentStatus)) {
//       return res.status(400).json({
//         success: false,
//         message: `Cannot reject — current status is '${application.status}'`,
//       });
//     }

//     application.status = "rejected";
//     application.internshipInchargeApproval = {
//       status: "rejected",
//       rejectedAt: new Date(),
//       remarks: remarks || "Rejected by incharge",
//     };

//     await application.save();
//     return res.json({ success: true, message: "Application rejected" });
//   } catch (err) {
//     console.error("PATCH reject error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ────────────────────────────────────────────────────────────────────────
// // GET /api/incharge/internships
// // ────────────────────────────────────────────────────────────────────────
// router.get("/internships", async (req, res) => {
//   try {
//     const internships = await Internship.find({}).sort({ createdAt: -1 }).lean();
//     return res.json({ success: true, data: internships });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// export default router;





import express from "express";
import mongoose from "mongoose";
import InternshipNotification from "../models/InternshipNotification.js";
const router = express.Router();

const notify = async (title, message, type = "info") => {
  try { await InternshipNotification.create({ title, message, type, seen: false }); }
  catch (e) { console.warn("Internship notification failed:", e.message); }
};

// ── Application Schema ─────────────────────────────────────────────────
const applicationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    studentEmail: { type: String },
    internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
    status: { type: String, default: "pending" },
    internshipInchargeApproval: {
      status: { type: String, default: "pending" },
      approvedAt: Date,
      rejectedAt: Date,
      remarks: String,
    },
    industryLiaisonApproval: {
      status: { type: String, default: "pending" },
      approvedAt: Date,
      rejectedAt: Date,
      remarks: String,
    },
    matchScore: { type: Number, default: 0 },
    matchingSkills: [String],
    missingSkills: [String],
    cvSnapshot: String,
    coverLetter: String,
    skillsSnapshot: [mongoose.Schema.Types.Mixed],
    statusHistory: [mongoose.Schema.Types.Mixed],
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false }
);

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema, "applications");

// ── Internship Schema ─────────────────────────────────────────────────
const internshipSchema = new mongoose.Schema(
  { title: String, company: String, description: String, requiredSkills: [String], type: String, slots: Number, deadline: Date, isActive: Boolean, postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Student" } },
  { timestamps: true, strict: false }
);
const Internship =
  mongoose.models.Internship ||
  mongoose.model("Internship", internshipSchema, "internships");

// ── Student Schema — collection is "students", name field is "fullName" ───
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

// ── Helper: normalise status to lowercase ─────────────────────────────
const normaliseStatus = (s) => (s || "").toLowerCase().replace(/ /g, "_");

// ── Helper: case-insensitive status filter ────────────────────────────
const statusFilter = (value) => ({
  $regex: new RegExp(`^${value}$`, "i"),
});

// ── Helper: resolve student from doc (handles fullName → name alias) ──
const resolveStudent = (studentDoc, fallbackEmail) => {
  if (!studentDoc && !fallbackEmail) return { name: "Unknown Student", email: "" };
  if (!studentDoc) {
    return { name: fallbackEmail.split("@")[0], email: fallbackEmail };
  }
  return {
    ...studentDoc,
    // alias fullName → name so all frontend code works without changes
    name: studentDoc.fullName || studentDoc.name || fallbackEmail?.split("@")[0] || "Unknown",
  };
};

// ────────────────────────────────────────────────────────────────────────
// GET /api/incharge/applications
// ────────────────────────────────────────────────────────────────────────
router.get("/applications", async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (status && status !== "all") {
      filter.status = statusFilter(status);
    }

    let applications = await Application.find(filter)
      .populate("studentId", "fullName email department semester phone profileImage cvUrl extractedSkills")
      .populate("internshipId", "title company type requiredSkills slots")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    // Collect emails that still need lookup (studentId not populated)
    const emailsToLookup = applications
      .filter((a) => !a.studentId?.fullName && a.studentEmail)
      .map((a) => a.studentEmail);

    let studentsByEmail = {};
    if (emailsToLookup.length > 0) {
      const found = await Student.find({ email: { $in: emailsToLookup } }).lean();
      found.forEach((s) => { studentsByEmail[s.email] = s; });
    }

    applications = applications.map((app) => {
      app.status = normaliseStatus(app.status);

      // Resolve student — use populated doc first, then email lookup, then fallback
      const rawStudent = app.studentId?.fullName
        ? app.studentId
        : studentsByEmail[app.studentEmail] || null;

      app.studentId = resolveStudent(rawStudent, app.studentEmail);
      return app;
    });

    // Stats
    const allApps = await Application.find({}).lean();
    const count = (s) => allApps.filter((a) => normaliseStatus(a.status) === s).length;
    const stats = {
      total: allApps.length,
      pending: count("pending"),
      approved: count("approved"),
      rejected: count("rejected"),
      sent_to_liaison: count("sent_to_liaison"),
    };

    const total = await Application.countDocuments(filter);
    return res.json({
      success: true,
      data: applications,
      stats,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("GET /incharge/applications error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch applications", error: err.message });
  }
});

// ────────────────────────────────────────────────────────────────────────
// GET /api/incharge/applications/:id
// ────────────────────────────────────────────────────────────────────────
router.get("/applications/:id", async (req, res) => {
  try {
    let app = await Application.findById(req.params.id)
      .populate("studentId", "fullName email department semester phone profileImage cvUrl extractedSkills")
      .populate("internshipId", "title company type requiredSkills slots description")
      .lean();

    if (!app) return res.status(404).json({ success: false, message: "Application not found" });

    app.status = normaliseStatus(app.status);

    // Resolve student
    if (!app.studentId?.fullName && app.studentEmail) {
      const student = await Student.findOne({ email: app.studentEmail }).lean();
      app.studentId = resolveStudent(student, app.studentEmail);
    } else {
      app.studentId = resolveStudent(app.studentId, app.studentEmail);
    }

    return res.json({ success: true, data: app });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ────────────────────────────────────────────────────────────────────────
// PATCH /api/incharge/applications/:id/approve
// ────────────────────────────────────────────────────────────────────────
router.patch("/applications/:id/approve", async (req, res) => {
  try {
    const { remarks } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    const currentStatus = normaliseStatus(application.status);
    if (currentStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot accept — current status is '${application.status}'`,
      });
    }

    application.status = "sent_to_liaison";
    application.internshipInchargeApproval = {
      status: "approved",
      approvedAt: new Date(),
      remarks: remarks || "Accepted by incharge",
    };
    application.industryLiaisonApproval = { status: "pending" };

    await application.save();

    let updated = await Application.findById(req.params.id)
      .populate("studentId", "fullName email department")
      .populate("internshipId", "title company")
      .lean();

    updated.status = normaliseStatus(updated.status);
    updated.studentId = resolveStudent(updated.studentId, updated.studentEmail);

    const studentName = updated.studentId?.fullName || updated.studentName || "Student";
    const internshipTitle = updated.internshipId?.title || "internship";
    await notify(
      "Application accepted",
      `${studentName}'s application for "${internshipTitle}" was approved and forwarded to Industry Liaison.`,
      "success"
    );

    return res.json({ success: true, message: "Application accepted and sent to Industry Liaison", data: updated });
  } catch (err) {
    console.error("PATCH approve error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ────────────────────────────────────────────────────────────────────────
// PATCH /api/incharge/applications/:id/reject
// ────────────────────────────────────────────────────────────────────────
router.patch("/applications/:id/reject", async (req, res) => {
  try {
    const { remarks } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    const currentStatus = normaliseStatus(application.status);
    if (!["pending", "approved"].includes(currentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot reject — current status is '${application.status}'`,
      });
    }

    application.status = "rejected";
    application.internshipInchargeApproval = {
      status: "rejected",
      rejectedAt: new Date(),
      remarks: remarks || "Rejected by incharge",
    };

    await application.save();

    const studentName = application.studentName || "Student";
    await notify("Application rejected", `${studentName}'s application was rejected.`, "warning");

    return res.json({ success: true, message: "Application rejected" });
  } catch (err) {
    console.error("PATCH reject error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ────────────────────────────────────────────────────────────────────────
// GET /api/incharge/internships
// ────────────────────────────────────────────────────────────────────────
router.get("/internships", async (req, res) => {
  try {
    const internships = await Internship.find({}).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: internships });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;