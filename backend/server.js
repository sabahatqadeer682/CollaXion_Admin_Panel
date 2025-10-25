import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import industryRoutes from "./routes/industryRoutes.js";  // ✅ import route

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.use("/api/industries", industryRoutes); // <— this line connects the routes

// Default route
app.get("/", (req, res) => {
  res.send("CollaXion backend running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
