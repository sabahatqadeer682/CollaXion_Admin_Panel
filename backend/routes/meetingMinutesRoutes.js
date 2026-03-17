import express from "express";
import MeetingMinutes from "../models/MeetingMinutes.js";

const router = express.Router();

// Create new meeting minutes
router.post("/", async (req, res) => {
    try {
        const meetingMinutes = new MeetingMinutes(req.body);
        const savedMinutes = await meetingMinutes.save();

        res.status(201).json({
            success: true,
            message: "Meeting minutes saved successfully",
            data: savedMinutes,
        });
    } catch (error) {
        console.error("Error saving meeting minutes:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save meeting minutes",
            error: error.message,
        });
    }
});

// Get meeting minutes by meeting ID
router.get("/:meetingId", async (req, res) => {
    try {
        const { meetingId } = req.params;
        const meetingMinutes = await MeetingMinutes.findOne({ meetingId });

        if (!meetingMinutes) {
            return res.status(404).json({
                success: false,
                message: "Meeting minutes not found",
            });
        }

        res.status(200).json({
            success: true,
            data: meetingMinutes,
        });
    } catch (error) {
        console.error("Error fetching meeting minutes:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch meeting minutes",
            error: error.message,
        });
    }
});

// Get all meeting minutes
router.get("/", async (req, res) => {
    try {
        const meetingMinutes = await MeetingMinutes.find().sort({ generatedAt: -1 });

        res.status(200).json({
            success: true,
            data: meetingMinutes,
        });
    } catch (error) {
        console.error("Error fetching meeting minutes:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch meeting minutes",
            error: error.message,
        });
    }
});

// Delete meeting minutes
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMinutes = await MeetingMinutes.findByIdAndDelete(id);

        if (!deletedMinutes) {
            return res.status(404).json({
                success: false,
                message: "Meeting minutes not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Meeting minutes deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting meeting minutes:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete meeting minutes",
            error: error.message,
        });
    }
});

export default router;
