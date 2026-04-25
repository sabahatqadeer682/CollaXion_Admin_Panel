import express from "express";
import LiaisonNotification from "../models/LiaisonNotification.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 300);
    const items = await LiaisonNotification.find().sort({ createdAt: -1 }).limit(limit);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
  }
});

router.patch("/mark-all-seen", async (req, res) => {
  try {
    await LiaisonNotification.updateMany({ seen: false }, { seen: true });
    res.json({ message: "All notifications marked as seen" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark all seen", error: err.message });
  }
});

router.patch("/:id/seen", async (req, res) => {
  try {
    const updated = await LiaisonNotification.findByIdAndUpdate(
      req.params.id,
      { seen: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Notification not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark seen", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await LiaisonNotification.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete", error: err.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    await LiaisonNotification.deleteMany({});
    res.json({ message: "Cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear", error: err.message });
  }
});

export default router;
