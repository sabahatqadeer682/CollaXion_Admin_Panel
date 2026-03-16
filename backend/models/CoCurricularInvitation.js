import mongoose from "mongoose";

const coCurricularInvitationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "CoCurricularEvent", required: true },
    recipientName: { type: String, required: true },
    recipientEmail: { type: String, required: true },
    recipientType: { 
      type: String, 
      enum: ["Industry", "University", "Guest", "Student"],
      default: "Industry"
    },
    message: { type: String },
    status: { 
      type: String, 
      enum: ["Pending", "Sent", "Accepted", "Declined"],
      default: "Pending"
    },
    sentAt: { type: Date },
    responseAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("CoCurricularInvitation", coCurricularInvitationSchema);