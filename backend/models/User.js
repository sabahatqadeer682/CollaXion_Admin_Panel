import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  studentId: String,
  department: String,
  rollNumber: String,
  profileImage: String,
});

export default mongoose.model("User", userSchema);