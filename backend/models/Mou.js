// backend/models/Mou.js
import mongoose from "mongoose";

const mouSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    university: { type: String, required: true },
    industry: { type: String, required: true },
    collaborationType: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    description: { type: String, default: "" },
    extraDetails: { type: [String], default: [] },
    signatories: { university: String, industry: String },
    universityContact: { name: String, designation: String, email: String },
    industryContact: { name: String, designation: String, email: String },
    status: { type: String, default: "Draft" },
    pdfData: String,
    attachmentName: String,
    attachmentData: String,
    attachmentType: String,
  },
  { timestamps: true }
);

export default mongoose.model("Mou", mouSchema);