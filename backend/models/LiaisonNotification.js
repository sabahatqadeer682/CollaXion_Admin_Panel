import mongoose from "mongoose";

const liaisonNotificationSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true },
    message:  { type: String, required: true },
    category: {
      type: String,
      enum: [
        "industry-registration",
        "industry-mou-proposed-changes",
        "industry-mou-approved",
        "industry-mou-rejected",
        "industry-mou-mutual",
        "industry-mou-meeting",
        "industry-mou-response",
        "industry-mou-other",
      ],
      default: "industry-mou-other",
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "urgent"],
      default: "info",
    },
    link:     { type: String },
    sourceId: { type: String },
    industry: { type: String },
    seen:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("LiaisonNotification", liaisonNotificationSchema);
