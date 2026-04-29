import express from "express";
import asyncHandler from "express-async-handler";
import InternshipNotification from "../models/InternshipNotification.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const list = await InternshipNotification.find().sort({ createdAt: -1 }).limit(50);
  res.json(list);
}));

router.post("/", asyncHandler(async (req, res) => {
  const { title, message, type, link } = req.body;
  if (!title || !message) return res.status(400).json({ message: "Title and message required" });
  const n = await InternshipNotification.create({ title, message, type: type || "info", link, seen: false });
  res.status(201).json(n);
}));

router.patch("/:id/seen", asyncHandler(async (req, res) => {
  const n = await InternshipNotification.findById(req.params.id);
  if (!n) return res.status(404).json({ message: "Not found" });
  n.seen = true;
  await n.save();
  res.json(n);
}));

router.patch("/mark-all-seen", asyncHandler(async (req, res) => {
  await InternshipNotification.updateMany({ seen: false }, { seen: true });
  res.json({ message: "All marked seen" });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  const n = await InternshipNotification.findById(req.params.id);
  if (!n) return res.status(404).json({ message: "Not found" });
  await n.deleteOne();
  res.json({ message: "Deleted" });
}));

export default router;
