import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import industryRoutes from "./routes/industryRoutes.js";
import mouRoutes from "./routes/mouRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// Routes
app.use("/api/industries", industryRoutes);
app.use("/api/mous", mouRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("CollaXion backend running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));