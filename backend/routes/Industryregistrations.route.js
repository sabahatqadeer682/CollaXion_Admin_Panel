import express from "express";
// Industryregistrations.route.js mein line 1 pe:
import IndustryRegistration from "../models/Industryregistration.model.js";
import { notifyLiaison } from "../utils/liaisonNotifier.js";
const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/industry-registrations
// Returns all industry registrations, newest first
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const registrations = await IndustryRegistration.find().sort({ createdAt: -1 });
    res.json({ registrations });
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/industry-registrations
// Called by Google Apps Script webhook when form is submitted
// ─────────────────────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const {
      companyName,
      industry,
      contactName,
      email,
      phone,
      website,
      address,
      description,
      timestamp,
    } = req.body;

    // Basic validation
    if (!companyName || !email) {
      return res.status(400).json({ message: "Company name and email are required" });
    }

    // Check duplicate (same company + email)
    const existing = await IndustryRegistration.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Registration with this email already exists" });
    }

    const registration = new IndustryRegistration({
      companyName,
      industry:    industry    || "Not specified",
      contactName: contactName || "Not specified",
      email,
      phone:       phone       || "Not Available",
      website:     website     || "N/A",
      address:     address     || "Not provided",
      description: description || "",
      timestamp:   timestamp   || new Date().toLocaleString(),
      status:      "Pending",
    });

    await registration.save();

    notifyLiaison({
      title:    "New Industry Registration",
      message:  `${registration.companyName} submitted a registration request.`,
      category: "industry-registration",
      type:     "info",
      link:     "/industry-registrations",
      sourceId: String(registration._id),
      industry: registration.companyName,
    });

    res.status(201).json({ message: "Registration saved successfully", registration });
  } catch (err) {
    console.error("Error saving registration:", err);
    res.status(500).json({ message: "Failed to save registration" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/industry-registrations/:id/status
// Approve or Reject a registration
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/:id/status", async (req, res) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'Approved' or 'Rejected'" });
    }

    const updated = await IndustryRegistration.findByIdAndUpdate(
      id,
      { status, reviewedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json({ message: `Registration ${status.toLowerCase()} successfully`, registration: updated });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/industry-registrations/:id
// Delete a registration
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await IndustryRegistration.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.json({ message: "Registration deleted successfully" });
  } catch (err) {
    console.error("Error deleting registration:", err);
    res.status(500).json({ message: "Failed to delete registration" });
  }
});

export default router;