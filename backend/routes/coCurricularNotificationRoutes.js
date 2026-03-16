import express from "express";
import CoCurricularNotification from "../models/CoCurricularNotification.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// GET all notifications
router.get("/", asyncHandler(async (req, res) => {
  const notifications = await CoCurricularNotification.find().sort({ createdAt: -1 });
  res.json(notifications);
}));

// CREATE notification
router.post("/", asyncHandler(async (req, res) => {
  const { title, message, type, link } = req.body;
  
  if (!title || !message) {
    return res.status(400).json({ message: "Title and message required" });
  }

  const notification = await CoCurricularNotification.create({
    title, message, type: type || "info", link, seen: false
  });

  res.status(201).json(notification);
}));

// MARK notification as seen
router.patch("/:id/seen", asyncHandler(async (req, res) => {
  const notification = await CoCurricularNotification.findById(req.params.id);
  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }
  
  notification.seen = true;
  await notification.save();
  res.json(notification);
}));

// MARK all as seen
router.patch("/mark-all-seen", asyncHandler(async (req, res) => {
  await CoCurricularNotification.updateMany({ seen: false }, { seen: true });
  res.json({ message: "All notifications marked as seen" });
}));

// DELETE notification
router.delete("/:id", asyncHandler(async (req, res) => {
  const notification = await CoCurricularNotification.findById(req.params.id);
  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }
  await notification.deleteOne();
  res.json({ message: "Notification deleted successfully" });
}));

export default router;