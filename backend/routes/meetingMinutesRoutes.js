// import express from "express";
// import MeetingMinutes from "../models/MeetingMinutes.js";

// const router = express.Router();



// router.get("/all", async (req, res) => {
//     try {
//         const meetingMinutes = await MeetingMinutes.find().sort({ generatedAt: -1 });
//         res.status(200).json({ success: true, data: meetingMinutes });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Failed to fetch", error: error.message });
//     }
// });


// // Create new meeting minutes
// router.post("/", async (req, res) => {
//     try {
//         const meetingMinutes = new MeetingMinutes(req.body);
//         const savedMinutes = await meetingMinutes.save();

//         res.status(201).json({
//             success: true,
//             message: "Meeting minutes saved successfully",
//             data: savedMinutes,
//         });
//     } catch (error) {
//         console.error("Error saving meeting minutes:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to save meeting minutes",
//             error: error.message,
//         });
//     }
// });

// // Get meeting minutes by meeting ID
// router.get("/:meetingId", async (req, res) => {
//     try {
//         const { meetingId } = req.params;
//         const meetingMinutes = await MeetingMinutes.findOne({ meetingId });

//         if (!meetingMinutes) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Meeting minutes not found",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: meetingMinutes,
//         });
//     } catch (error) {
//         console.error("Error fetching meeting minutes:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch meeting minutes",
//             error: error.message,
//         });
//     }
// });

// // Get all meeting minutes
// router.get("/", async (req, res) => {
//     try {
//         const meetingMinutes = await MeetingMinutes.find().sort({ generatedAt: -1 });

//         res.status(200).json({
//             success: true,
//             data: meetingMinutes,
//         });
//     } catch (error) {
//         console.error("Error fetching meeting minutes:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch meeting minutes",
//             error: error.message,
//         });
//     }
// });



// // UPDATE meeting with minutes data (PATCH)
// router.patch("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     // Try by _id first, then by meetingId
//     let updated = await MeetingMinutes.findByIdAndUpdate(
//       id,
//       { $set: req.body },
//       { new: true }
//     ).catch(() => null);

//     if (!updated) {
//       updated = await MeetingMinutes.findOneAndUpdate(
//         { meetingId: id },
//         { $set: req.body },
//         { new: true }
//       );
//     }

//     if (!updated) {
//       return res.status(404).json({ success: false, message: "Meeting not found" });
//     }

//     res.json({ success: true, data: updated });
//   } catch (error) {
//     console.error("PATCH error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });






// // Delete meeting minutes
// router.delete("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedMinutes = await MeetingMinutes.findByIdAndDelete(id);

//         if (!deletedMinutes) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Meeting minutes not found",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Meeting minutes deleted successfully",
//         });
//     } catch (error) {
//         console.error("Error deleting meeting minutes:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to delete meeting minutes",
//             error: error.message,
//         });
//     }
// });

// export default router;







import express from "express";
import MeetingMinutes from "../models/MeetingMinutes.js";

const router = express.Router();

// GET all meetings
router.get("/all", async (req, res) => {
  try {
    const meetingMinutes = await MeetingMinutes.find().sort({ generatedAt: -1 });
    res.status(200).json({ success: true, data: meetingMinutes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch", error: error.message });
  }
});

// CREATE new meeting (with boardMembers)
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

// GET by meetingId
router.get("/:meetingId", async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meetingMinutes = await MeetingMinutes.findOne({ meetingId });
    if (!meetingMinutes) {
      return res.status(404).json({ success: false, message: "Meeting minutes not found" });
    }
    res.status(200).json({ success: true, data: meetingMinutes });
  } catch (error) {
    console.error("Error fetching meeting minutes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meeting minutes",
      error: error.message,
    });
  }
});

// GET all (alternate route)
router.get("/", async (req, res) => {
  try {
    const meetingMinutes = await MeetingMinutes.find().sort({ generatedAt: -1 });
    res.status(200).json({ success: true, data: meetingMinutes });
  } catch (error) {
    console.error("Error fetching meeting minutes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meeting minutes",
      error: error.message,
    });
  }
});

// PATCH — update minutes data AND/OR boardMembers
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Try by _id first, then by meetingId
    let updated = await MeetingMinutes.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).catch(() => null);

    if (!updated) {
      updated = await MeetingMinutes.findOneAndUpdate(
        { meetingId: id },
        { $set: req.body },
        { new: true }
      );
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: "Meeting not found" });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMinutes = await MeetingMinutes.findByIdAndDelete(id);
    if (!deletedMinutes) {
      return res.status(404).json({ success: false, message: "Meeting minutes not found" });
    }
    res.status(200).json({ success: true, message: "Meeting minutes deleted successfully" });
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