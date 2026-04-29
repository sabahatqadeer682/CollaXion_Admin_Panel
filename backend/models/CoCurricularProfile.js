import mongoose from "mongoose";

// Singleton-style profile for the Co-Curricular Incharge.
// We treat any document as the active profile (first one wins) since the
// portal's auth is currently single-user and hardcoded.
const coCurricularProfileSchema = new mongoose.Schema(
  {
    name:  { type: String, default: "Dr. Habiba Ahmed" },
    email: { type: String, default: "habiba.ahmed@riphah.edu.pk" },
    role:  { type: String, default: "Co-Curricular Incharge" },
    // Base64 data URL or remote image URL — both supported.
    dp:    { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("CoCurricularProfile", coCurricularProfileSchema);
