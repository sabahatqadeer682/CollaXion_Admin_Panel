import mongoose from "mongoose";

const internshipNotificationSchema = new mongoose.Schema(
  {
    title:   { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["info", "success", "warning", "urgent"],
      default: "info",
    },
    seen:  { type: Boolean, default: false },
    link:  { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("InternshipNotification", internshipNotificationSchema);
