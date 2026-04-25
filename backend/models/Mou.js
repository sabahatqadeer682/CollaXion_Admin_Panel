// // backend/models/Mou.js
// import mongoose from "mongoose";

// const mouSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     university: { type: String, required: true },
//     industry: { type: String, required: true },
//     collaborationType: { type: String, required: true },
//     startDate: { type: String, required: true },
//     endDate: { type: String, required: true },
//     description: { type: String, default: "" },
//     extraDetails: { type: [String], default: [] },
//     signatories: { university: String, industry: String },
//     universityContact: { name: String, designation: String, email: String },
//     industryContact: { name: String, designation: String, email: String },
//     status: { type: String, default: "Draft" },
//     pdfData: String,
//     attachmentName: String,
//     attachmentData: String,
//     attachmentType: String,
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Mou", mouSchema);


// backend/models/Mou.js
import mongoose from "mongoose";

const changeSchema = new mongoose.Schema({
  field:    { type: String },
  oldValue: { type: String },
  newValue: { type: String },
  reason:   { type: String },
  date:     { type: String },
}, { _id: false });

const stampSchema = new mongoose.Schema({
  by:   { type: String },
  type: { type: String },  // "approve" | "reject"
  date: { type: String },
  note: { type: String },
}, { _id: false });

const signatureSchema = new mongoose.Schema({
  mode:     { type: String, enum: ["draw", "type", "upload"], default: "type" },
  dataUrl:  { type: String },   // base64 PNG (canvas/upload)
  text:     { type: String },   // typed name fallback
  signedBy: { type: String },
  signedAt: { type: String },
}, { _id: false });

const meetingSlotSchema = new mongoose.Schema({
  date: { type: String },
  time: { type: String },
  note: { type: String },
}, { _id: false });

const meetingSchema = new mongoose.Schema({
  date:      { type: String },
  time:      { type: String },
  venue:     { type: String },
  agenda:    { type: String },
  menu:      { type: String },
  attendees: { type: String },

  // Multiple proposed time slots (when university offers options to industry)
  options:   { type: [meetingSlotSchema], default: [] },

  // Final confirmed slot (set once both parties agree)
  confirmedSlot: { type: meetingSlotSchema, default: null },
  confirmedAt:   { type: String, default: null },

  // Industry's counter-proposed slot
  industryProposedSlot: { type: meetingSlotSchema, default: null },
  industryProposedAt:   { type: String, default: null },
}, { _id: false });

const mouSchema = new mongoose.Schema({
  // ── Basic ──────────────────────────────────────────────────────
  title:             { type: String, required: true },
  university:        { type: String, required: true },
  industry:          { type: String, required: true },
  collaborationType: { type: String, required: true },
  startDate:         { type: String, required: true },
  endDate:           { type: String, required: true },
  description:       { type: String, default: "" },

  // ── MOU Content Fields ─────────────────────────────────────────
  objectives:        { type: [String], default: [] },
  terms:             { type: [String], default: [] },
  responsibilities: {
    university: { type: [String], default: [] },
    industry:   { type: [String], default: [] },
  },

  // ── People ─────────────────────────────────────────────────────
  signatories: {
    university: { type: String, default: "" },
    industry:   { type: String, default: "" },
  },
  universityContact: {
    name:        { type: String, default: "" },
    designation: { type: String, default: "" },
    email:       { type: String, default: "" },
  },
  industryContact: {
    name:        { type: String, default: "" },
    designation: { type: String, default: "" },
    email:       { type: String, default: "" },
  },

  // ── Workflow ───────────────────────────────────────────────────
  status: {
    type: String,
    default: "Draft",
    enum: [
      "Draft",
      "Sent to Industry",
      "Changes Proposed",
      "Approved by Industry",
      "Approved by University",
      "Mutually Approved",
      "Rejected",
    ],
  },
  sentAt:              { type: String, default: null },
  industryResponseAt:  { type: String, default: null },

  // ── Proposed Changes (by Industry) ────────────────────────────
  proposedChanges: { type: [changeSchema], default: [] },

  // ── Stamps ────────────────────────────────────────────────────
  universityStamp: { type: stampSchema, default: null },
  industryStamp:   { type: stampSchema, default: null },

  // ── Digital Signatures ────────────────────────────────────────
  universitySignature: { type: signatureSchema, default: null },
  industrySignature:   { type: signatureSchema, default: null },

  // ── Meeting ───────────────────────────────────────────────────
  scheduledMeeting: { type: meetingSchema, default: null },

  // ── mouNumber (sparse so null values don't conflict) ──────────
  mouNumber: { type: String, default: null, sparse: true },

  // ── Legacy / optional ─────────────────────────────────────────
  extraDetails:   { type: [String], default: [] },
  customFields:   { type: mongoose.Schema.Types.Mixed, default: [] },
  pdfData:        { type: String },
  pdfHtml:        { type: String },                    // university → industry: printable HTML snapshot
  pdfSentAt:      { type: String, default: null },     // when liaison dispatched the PDF
  industryPdfHtml:   { type: String },                 // industry → university: PDF returned by industry
  industryPdfSentAt: { type: String, default: null },  // when industry returned their version
  attachmentName: { type: String },
  attachmentData: { type: String },
  attachmentType: { type: String },

  // Logos used for the printable PDF / header preview
  universityLogo: { type: String },
  industryLogo:   { type: String },

  // Change log persisted so both sides see the history
  changeLog:      { type: [mongoose.Schema.Types.Mixed], default: [] },
},
{ timestamps: true });

// Drop old mouNumber unique index if it exists (one-time fix)
mouSchema.post("save", function() {});
mongoose.connection.once("open", async () => {
  try {
    await mongoose.connection.collection("mous").dropIndex("mouNumber_1");
    console.log("✅ Dropped old mouNumber_1 index");
  } catch (e) {
    // Index didn't exist — that's fine
  }
});

export default mongoose.model("Mou", mouSchema);