import express from "express";
import CoCurricularEvent from "../models/CoCurricularEvent.js";
import CoCurricularNotification from "../models/CoCurricularNotification.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

const notify = async (title, message, type = "info") => {
  try {
    await CoCurricularNotification.create({ title, message, type, seen: false });
  } catch (e) { console.warn("Notification create failed:", e.message); }
};

// GET all events
router.get("/", asyncHandler(async (req, res) => {
  const events = await CoCurricularEvent.find().sort({ date: 1 });
  res.json(events);
}));

// GET single event
router.get("/:id", asyncHandler(async (req, res) => {
  const event = await CoCurricularEvent.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  res.json(event);
}));

// CREATE event
router.post("/", asyncHandler(async (req, res) => {
  const { name, date, venue, expected, category, coordinator, coordinatorEmail, budget, description, poster } = req.body;
  
  if (!name || !date || !venue || !expected || !coordinator) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  // Check poster size if present (Base64)
  if (poster && typeof poster === "string" && poster.length > 5_000_000) {
    return res.status(400).json({ message: "Poster image too large (max ~5MB)" });
  }

  const event = await CoCurricularEvent.create({
    name, date, venue, expected: parseInt(expected),
    registered: Math.floor(Math.random() * 50) + 10, // Mock registration
    category: category || "Technical",
    coordinator, coordinatorEmail, budget: parseFloat(budget) || 0,
    description, poster, status: "upcoming"
  });

  await notify(
    "New event created",
    `"${event.name}" scheduled on ${new Date(event.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} at ${event.venue}.`,
    "success"
  );

  res.status(201).json(event);
}));

// UPDATE event
router.put("/:id", asyncHandler(async (req, res) => {
  const event = await CoCurricularEvent.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  Object.assign(event, req.body);
  const updatedEvent = await event.save();
  await notify("Event updated", `"${updatedEvent.name}" details were updated.`, "info");
  res.json(updatedEvent);
}));

// DELETE event
router.delete("/:id", asyncHandler(async (req, res) => {
  const event = await CoCurricularEvent.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  const eventName = event.name;
  await event.deleteOne();
  await notify("Event deleted", `"${eventName}" was removed from the calendar.`, "warning");
  res.json({ message: "Event deleted successfully" });
}));

// UPDATE registration count
router.patch("/:id/register", asyncHandler(async (req, res) => {
  const event = await CoCurricularEvent.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  
  event.registered = (event.registered || 0) + 1;
  await event.save();
  res.json(event);
}));

export default router;