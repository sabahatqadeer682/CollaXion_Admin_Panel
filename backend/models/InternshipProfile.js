import mongoose from "mongoose";

const internshipProfileSchema = new mongoose.Schema(
  {
    name:  { type: String, default: "Junaid Malik" },
    email: { type: String, default: "junaid.malik@riphah.edu.pk" },
    role:  { type: String, default: "Internship Incharge" },
    // Base64 data URL or remote image URL — both supported.
    dp:    { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("InternshipProfile", internshipProfileSchema);
