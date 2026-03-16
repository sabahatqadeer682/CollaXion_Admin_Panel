import express from "express";
import CoCurricularTask from "../models/CoCurricularTask.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// GET all tasks
router.get("/", asyncHandler(async (req, res) => {
  const tasks = await CoCurricularTask.find().sort({ deadline: 1 });
  res.json(tasks);
}));

// GET tasks by event
router.get("/event/:eventId", asyncHandler(async (req, res) => {
  const tasks = await CoCurricularTask.find({ eventId: req.params.eventId });
  res.json(tasks);
}));

// CREATE task
router.post("/", asyncHandler(async (req, res) => {
  const { title, assignedTo, assignedToEmail, deadline, status, progress, description, eventId } = req.body;
  
  if (!title || !assignedTo || !deadline) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const task = await CoCurricularTask.create({
    title, assignedTo, assignedToEmail, deadline,
    status: status || "Pending",
    progress: progress || 0,
    description, eventId
  });

  res.status(201).json(task);
}));

// UPDATE task
router.put("/:id", asyncHandler(async (req, res) => {
  const task = await CoCurricularTask.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  Object.assign(task, req.body);
  const updatedTask = await task.save();
  res.json(updatedTask);
}));

// DELETE task
router.delete("/:id", asyncHandler(async (req, res) => {
  const task = await CoCurricularTask.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  await task.deleteOne();
  res.json({ message: "Task deleted successfully" });
}));

// MARK task as completed
router.patch("/:id/complete", asyncHandler(async (req, res) => {
  const task = await CoCurricularTask.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  
  task.status = "Completed";
  task.progress = 100;
  await task.save();
  res.json(task);
}));

export default router;