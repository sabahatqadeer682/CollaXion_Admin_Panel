import mongoose from "mongoose";

const industryRegistrationSchema = new mongoose.Schema(
  {
    companyName:  { type: String, required: true, trim: true },
    industry:     { type: String, default: "Not specified" },
    contactName:  { type: String, default: "Not specified" },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:        { type: String, default: "Not Available" },
    website:      { type: String, default: "N/A" },
    address:      { type: String, default: "Not provided" },
    description:  { type: String, default: "" },
    timestamp:    { type: String },   // Human-readable form submission time
    status: {
      type:    String,
      enum:    ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reviewedAt: { type: Date },       // When Liaison approved/rejected
  },
  { timestamps: true }   // adds createdAt + updatedAt automatically
);

export default mongoose.model("IndustryRegistration", industryRegistrationSchema);