import mongoose from "mongoose";

const coCurricularEventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: String, required: true },
    venue: { type: String, required: true },
    expected: { type: Number, required: true },
    registered: { type: Number, default: 0 },
    category: { 
      type: String, 
      enum: ["Technical", "Sports", "Cultural", "Workshop", "Seminar", "Competition"],
      default: "Technical"
    },
    coordinator: { type: String, required: true },
    coordinatorEmail: { type: String },
    budget: { type: Number, default: 0 },
    description: { type: String },
    poster: { type: String }, // Base64 or URL
    status: { 
      type: String, 
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming"
    },
    createdBy: { type: String, default: "CoCurricular Incharge" }
  },
  { timestamps: true }
);

export default mongoose.model("CoCurricularEvent", coCurricularEventSchema);