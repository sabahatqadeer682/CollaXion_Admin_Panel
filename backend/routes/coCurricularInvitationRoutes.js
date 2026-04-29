import express from "express";
import CoCurricularInvitation from "../models/CoCurricularInvitation.js";
import CoCurricularNotification from "../models/CoCurricularNotification.js";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";

const router = express.Router();

const notify = async (title, message, type = "info") => {
  try {
    await CoCurricularNotification.create({ title, message, type, seen: false });
  } catch (e) { console.warn("Notification create failed:", e.message); }
};

// Lazily-built email transporter — defer reading env vars until a request actually
// fires, otherwise the routes module loads before dotenv.config() runs and the
// credentials end up undefined ("Missing credentials for PLAIN").
let _transporter = null;
const getTransporter = () => {
  if (_transporter) return _transporter;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    throw new Error("EMAIL_USER / EMAIL_PASS are missing from backend/.env — set them and restart the server");
  }
  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return _transporter;
};

// GET all invitations
router.get("/", asyncHandler(async (req, res) => {
  const invitations = await CoCurricularInvitation.find()
    .populate("eventId")
    .sort({ createdAt: -1 });
  res.json(invitations);
}));

// CREATE invitation
router.post("/", asyncHandler(async (req, res) => {
  const { eventId, recipientName, recipientEmail, recipientType, message } = req.body;
  
  if (!eventId || !recipientName || !recipientEmail) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const invitation = await CoCurricularInvitation.create({
    eventId, recipientName, recipientEmail,
    recipientType: recipientType || "Industry",
    message, status: "Pending"
  });

  await notify("Invitation created", `Invitation drafted for ${invitation.recipientName} (${invitation.recipientEmail}).`, "info");

  res.status(201).json(invitation);
}));

// SEND invitation email
router.post("/:id/send", asyncHandler(async (req, res) => {
  const invitation = await CoCurricularInvitation.findById(req.params.id)
    .populate("eventId");
  
  if (!invitation) {
    return res.status(404).json({ message: "Invitation not found" });
  }

  if (!invitation.eventId) {
    return res.status(400).json({ message: "Event not found" });
  }

  try {
    const event = invitation.eventId;
    const subject = `Invitation: ${event.name} - CollaXion Co-Curricular Event`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #193648;">You're Invited!</h2>
        <p>Dear ${invitation.recipientName},</p>
        <p>${invitation.message || `You are cordially invited to attend "${event.name}"`}</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #193648; margin-top: 0;">Event Details</h3>
          <p><strong>Event:</strong> ${event.name}</p>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Venue:</strong> ${event.venue}</p>
          <p><strong>Category:</strong> ${event.category}</p>
          <p><strong>Coordinator:</strong> ${event.coordinator}</p>
        </div>
        
        <p>Please confirm your participation at your earliest convenience.</p>
        <p>Best regards,<br>CollaXion Co-Curricular Team</p>
      </div>
    `;

    await getTransporter().sendMail({
      from: `"CollaXion · Co-Curricular Office" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to: invitation.recipientEmail,
      subject,
      html
    });

    invitation.status = "Sent";
    invitation.sentAt = new Date();
    await invitation.save();

    await notify(
      "Invitation sent",
      `Invitation for "${event.name}" emailed to ${invitation.recipientName} (${invitation.recipientEmail}).`,
      "success"
    );

    res.json({ message: "Invitation sent successfully", invitation });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
}));

// UPDATE invitation status
router.patch("/:id/status", asyncHandler(async (req, res) => {
  const { status } = req.body;
  const invitation = await CoCurricularInvitation.findById(req.params.id);
  
  if (!invitation) {
    return res.status(404).json({ message: "Invitation not found" });
  }

  invitation.status = status;
  if (status === "Accepted" || status === "Declined") {
    invitation.responseAt = new Date();
  }
  
  await invitation.save();
  res.json(invitation);
}));

// DELETE invitation
router.delete("/:id", asyncHandler(async (req, res) => {
  const invitation = await CoCurricularInvitation.findById(req.params.id);
  if (!invitation) {
    return res.status(404).json({ message: "Invitation not found" });
  }
  await invitation.deleteOne();
  res.json({ message: "Invitation deleted successfully" });
}));

export default router;