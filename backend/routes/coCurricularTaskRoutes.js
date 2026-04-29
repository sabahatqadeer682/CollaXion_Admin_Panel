import express from "express";
import CoCurricularTask from "../models/CoCurricularTask.js";
import CoCurricularNotification from "../models/CoCurricularNotification.js";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";

const router = express.Router();

const notify = async (title, message, type = "info") => {
  try {
    await CoCurricularNotification.create({ title, message, type, seen: false });
  } catch (e) { console.warn("Notification create failed:", e.message); }
};

// Lazily-built transporter so the routes module doesn't load before dotenv.config()
let _transporter = null;
const getTransporter = () => {
  if (_transporter) return _transporter;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    throw new Error("EMAIL_USER / EMAIL_PASS are missing from backend/.env");
  }
  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return _transporter;
};

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

  await notify(
    "New task assigned",
    `"${task.title}" assigned to ${task.assignedTo} — due ${new Date(task.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}.`,
    "info"
  );

  res.status(201).json(task);
}));

// UPDATE task
router.put("/:id", asyncHandler(async (req, res) => {
  const task = await CoCurricularTask.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const prevProgress = task.progress || 0;
  Object.assign(task, req.body);
  const updatedTask = await task.save();
  const newProgress = updatedTask.progress || 0;
  if (newProgress >= 100 && prevProgress < 100) {
    await notify("Task completed", `"${updatedTask.title}" was marked as completed.`, "success");
  } else {
    await notify("Task updated", `"${updatedTask.title}" details were updated (${newProgress}% done).`, "info");
  }
  res.json(updatedTask);
}));

// DELETE task
router.delete("/:id", asyncHandler(async (req, res) => {
  const task = await CoCurricularTask.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  const taskTitle = task.title;
  await task.deleteOne();
  await notify("Task deleted", `"${taskTitle}" was removed.`, "warning");
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
  await notify("Task completed", `"${task.title}" was marked as completed.`, "success");
  res.json(task);
}));

// SEND reminder email to the assignee
router.post("/:id/remind", asyncHandler(async (req, res) => {
  const task = await CoCurricularTask.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Use the override email from the request body, otherwise fall back to the saved one
  const { recipientEmail } = req.body || {};
  const to = recipientEmail || task.assignedToEmail;
  if (!to) {
    return res.status(400).json({ message: "No assignee email available for this task" });
  }

  const isOverdue = new Date(task.deadline) < new Date() && task.status !== "Completed";
  const niceDate  = new Date(task.deadline).toLocaleDateString("en-GB", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  const subject = `${isOverdue ? "Overdue" : "Reminder"}: ${task.title} — CollaXion Co-Curricular`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
      <div style="background: linear-gradient(135deg, #0F2A38, #193648, #2C5F80); padding: 26px 24px; border-radius: 14px 14px 0 0; color: #fff;">
        <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.7;">
          ${isOverdue ? "⚠️ Overdue Task Reminder" : "🔔 Friendly Task Reminder"}
        </div>
        <h2 style="margin: 8px 0 0; font-size: 22px;">${task.title}</h2>
      </div>

      <div style="background: #fff; padding: 24px; border: 1px solid #E2EEF9; border-top: none; border-radius: 0 0 14px 14px;">
        <p style="font-size: 14px; line-height: 1.6;">
          Dear <strong>${task.assignedTo || "Team member"}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6;">
          ${isOverdue
            ? `This is a gentle reminder that the task assigned to you is now <strong style="color:#be123c;">past its deadline</strong>. Please share an update or completion at the earliest.`
            : `This is a friendly reminder about your assigned task. Kindly ensure it is completed before the deadline.`}
        </p>

        <div style="background: #f4f7fb; border: 1px solid #E2EEF9; border-radius: 12px; padding: 16px 18px; margin: 18px 0;">
          <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #94a3b8; margin-bottom: 6px;">Task Details</div>
          <p style="margin: 4px 0;"><strong>Title:</strong> ${task.title}</p>
          ${task.description ? `<p style="margin: 4px 0;"><strong>Description:</strong> ${task.description}</p>` : ""}
          <p style="margin: 4px 0;"><strong>Deadline:</strong> ${niceDate}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> ${task.status || "Pending"}</p>
          <p style="margin: 4px 0;"><strong>Progress:</strong> ${task.progress || 0}%</p>
        </div>

        <p style="font-size: 14px; line-height: 1.6;">
          If you have already completed this task, please update its status in the CollaXion workspace so we may close it on our end.
        </p>

        <p style="font-size: 14px; line-height: 1.6; margin-top: 22px;">
          Warm regards,<br/>
          <strong>Co-Curricular Office · Faculty of Computing</strong><br/>
          <span style="color: #3A70B0;">CollaXion Workspace</span>
        </p>
      </div>
    </div>
  `;

  try {
    await getTransporter().sendMail({
      from: `"CollaXion · Co-Curricular Office" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    await notify("Reminder sent", `Reminder for "${task.title}" emailed to ${to}.`, "info");
    return res.json({ message: "Reminder sent", to });
  } catch (err) {
    console.error("Reminder send error:", err);
    return res.status(500).json({ message: "Failed to send reminder", error: err.message });
  }
}));

export default router;