import mongoose from "mongoose";

const coCurricularNotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["info", "urgent", "success", "warning"],
      default: "info"
    },
    seen: { type: Boolean, default: false },
    link: { type: String },
    userId: { type: String } // For future multi-user support
  },
  { timestamps: true }
);

export default mongoose.model("CoCurricularNotification", coCurricularNotificationSchema);