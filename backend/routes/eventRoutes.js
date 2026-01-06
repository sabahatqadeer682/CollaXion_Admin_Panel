// routes/eventRoutes.js
import express from "express";
import Event from "../models/Event.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

/* ================================
   CREATE EVENT (with Base64 poster)
   ================================ */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      title,
      date,
      time,
      location,
      attendees,
      type,
      description,
      poster, // Base64 string: "data:image/png;base64,..."
    } = req.body;

    // Validation
    if (!title?.trim() || !date?.trim()) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    // Optional: limit image size (~2MB)
    if (poster && typeof poster === "string" && poster.length > 3_000_000) {
      return res
        .status(400)
        .json({ message: "Poster image too large (max ~2MB)" });
    }

    const event = await Event.create({
      title: title.trim(),
      date,
      time,
      location,
      attendees,
      type: type || "Workshop",
      description,
      poster, // null or Base64 string
    });

    res.status(201).json(event);
  })
);

/* ================================
   GET ALL EVENTS
   ================================ */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  })
);

/* ================================
   DELETE EVENT
   ================================ */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  })
);

export default router;