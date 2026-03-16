import mongoose from "mongoose";

const coCurricularTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    assignedTo: { type: String, required: true },
    assignedToEmail: { type: String },
    deadline: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Pending", "In Progress", "Completed", "Overdue"],
      default: "Pending"
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    description: { type: String },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "CoCurricularEvent" }
  },
  { timestamps: true }
);

export default mongoose.model("CoCurricularTask", coCurricularTaskSchema);