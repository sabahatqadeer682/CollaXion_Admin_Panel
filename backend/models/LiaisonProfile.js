import mongoose from "mongoose";

const liaisonProfileSchema = new mongoose.Schema(
  {
    name:  { type: String, default: "Ms. Tazzaina" },
    email: { type: String, default: "tazzaina@riphah.edu.pk" },
    role:  { type: String, default: "Industry Liaison Incharge" },
    dp:    { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("LiaisonProfile", liaisonProfileSchema);
