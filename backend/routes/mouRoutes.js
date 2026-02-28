// import express from "express";
// import Mou from "../models/Mou.js";

// const router = express.Router();

// // Get all MOUs
// router.get("/", async (req, res) => {
//   try {
//     const mous = await Mou.find().sort({ createdAt: -1 });
//     res.status(200).json(mous);
//   } catch (error) {
//     console.error("Error fetching MOUs:", error);
//     res.status(500).json({ message: "Error fetching MOUs", error: error.message });
//   }
// });

// // Get single MOU by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const mou = await Mou.findById(req.params.id);
//     if (!mou) {
//       return res.status(404).json({ message: "MOU not found" });
//     }
//     res.status(200).json(mou);
//   } catch (error) {
//     console.error("Error fetching MOU:", error);
//     res.status(500).json({ message: "Error fetching MOU", error: error.message });
//   }
// });

// // Create new MOU
// router.post("/", async (req, res) => {
//   try {
//     console.log("=== MOU Creation Request ===");
//     console.log("Request body keys:", Object.keys(req.body));
//     console.log("Title:", req.body.title);
//     console.log("University:", req.body.university);
//     console.log("Industry:", req.body.industry);
    
//     const dataSize = JSON.stringify(req.body).length;
//     console.log("Total data size:", (dataSize / 1024 / 1024).toFixed(2), "MB");
    
//     if (req.body.pdfData) {
//       console.log("PDF data size:", (req.body.pdfData.length / 1024 / 1024).toFixed(2), "MB");
//     }
//     if (req.body.attachmentData) {
//       console.log("Attachment data size:", (req.body.attachmentData.length / 1024 / 1024).toFixed(2), "MB");
//     }
    
//     // Check data size limit
//     if (dataSize > 16 * 1024 * 1024) {
//       console.error("❌ Data exceeds 16MB MongoDB limit");
//       return res.status(413).json({ 
//         message: "Document too large for MongoDB (16MB limit)", 
//         error: "Reduce attachment size or remove it",
//         currentSize: (dataSize / 1024 / 1024).toFixed(2) + "MB"
//       });
//     }
    
//     // Validate required fields
//     const { title, university, industry, collaborationType, startDate, endDate } = req.body;
//     if (!title || !university || !industry || !collaborationType || !startDate || !endDate) {
//       console.error("❌ Missing required fields");
//       return res.status(400).json({ 
//         message: "Missing required fields", 
//         required: ["title", "university", "industry", "collaborationType", "startDate", "endDate"],
//         received: { title, university, industry, collaborationType, startDate, endDate }
//       });
//     }

//     console.log("Creating Mou instance...");
//     const newMou = new Mou(req.body);
    
//     console.log("Saving to database...");
//     const savedMou = await newMou.save();
    
//     console.log("✅ MOU saved successfully with ID:", savedMou._id);
//     res.status(201).json(savedMou);
    
//   } catch (error) {
//     console.error("❌ Error creating MOU:");
//     console.error("Error name:", error.name);
//     console.error("Error message:", error.message);
//     console.error("Error stack:", error.stack);
    
//     // Validation errors
//     if (error.name === 'ValidationError') {
//       console.error("Validation errors:", error.errors);
//       return res.status(400).json({ 
//         message: "Validation error", 
//         error: error.message,
//         details: Object.keys(error.errors).map(key => ({
//           field: key,
//           message: error.errors[key].message
//         }))
//       });
//     }
    
//     // Duplicate key errors
//     if (error.code === 11000) {
//       return res.status(409).json({ 
//         message: "Duplicate MOU", 
//         error: "MOU with this data already exists" 
//       });
//     }
    
//     // Document size errors
//     if (error.message && (error.message.includes('too large') || error.message.includes('16MB'))) {
//       return res.status(413).json({ 
//         message: "Document too large", 
//         error: "MOU data exceeds MongoDB 16MB limit" 
//       });
//     }

//     // MongoDB connection errors
//     if (error.name === 'MongoError' || error.name === 'MongoServerError') {
//       return res.status(503).json({
//         message: "Database error",
//         error: error.message
//       });
//     }
    
//     // Generic error
//     res.status(500).json({ 
//       message: "Error creating MOU", 
//       error: error.message,
//       errorType: error.name
//     });
//   }
// });

// // Update MOU
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedMou = await Mou.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedMou) {
//       return res.status(404).json({ message: "MOU not found" });
//     }
//     res.status(200).json(updatedMou);
//   } catch (error) {
//     console.error("Error updating MOU:", error);
//     res.status(500).json({ message: "Error updating MOU", error: error.message });
//   }
// });

// // Delete MOU
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedMou = await Mou.findByIdAndDelete(req.params.id);
//     if (!deletedMou) {
//       return res.status(404).json({ message: "MOU not found" });
//     }
//     res.status(200).json({ message: "MOU deleted successfully", mou: deletedMou });
//   } catch (error) {
//     console.error("Error deleting MOU:", error);
//     res.status(500).json({ message: "Error deleting MOU", error: error.message });
//   }
// });

// export default router;



import express from "express";
import Mou from "../models/Mou.js";

const router = express.Router();

// Get all MOUs
router.get("/", async (req, res) => {
  try {
    const mous = await Mou.find().sort({ createdAt: -1 });
    res.status(200).json(mous);
  } catch (error) {
    res.status(500).json({ message: "Error fetching MOUs", error: error.message });
  }
});

// Get single MOU by ID
router.get("/:id", async (req, res) => {
  try {
    const mou = await Mou.findById(req.params.id);
    if (!mou) return res.status(404).json({ message: "MOU not found" });
    res.status(200).json(mou);
  } catch (error) {
    res.status(500).json({ message: "Error fetching MOU", error: error.message });
  }
});

// Create new MOU
router.post("/", async (req, res) => {
  try {
    const { title, university, industry, collaborationType, startDate, endDate } = req.body;

    if (!title || !university || !industry || !collaborationType || !startDate || !endDate) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["title", "university", "industry", "collaborationType", "startDate", "endDate"],
      });
    }

    // Remove mouNumber if sent as null to avoid duplicate key issues
    const data = { ...req.body };
    if (data.mouNumber === null || data.mouNumber === "") delete data.mouNumber;

    const newMou = new Mou(data);
    const savedMou = await newMou.save();
    console.log("✅ MOU saved:", savedMou._id);
    res.status(201).json(savedMou);

  } catch (error) {
    console.error("❌ Error creating MOU:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.message,
        details: Object.keys(error.errors).map((k) => ({
          field: k,
          message: error.errors[k].message,
        })),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate key error",
        error: "A unique index conflict occurred. Please drop the old mouNumber_1 index from MongoDB.",
        details: error.keyValue,
      });
    }

    res.status(500).json({ message: "Error creating MOU", error: error.message });
  }
});

// Update MOU (used for status changes, edits, stamps, meeting, proposed changes)
router.put("/:id", async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.mouNumber === null || data.mouNumber === "") delete data.mouNumber;

    const updatedMou = await Mou.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!updatedMou) return res.status(404).json({ message: "MOU not found" });
    res.status(200).json(updatedMou);
  } catch (error) {
    console.error("❌ Error updating MOU:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate key error on update",
        error: error.message,
      });
    }

    res.status(500).json({ message: "Error updating MOU", error: error.message });
  }
});

// Send MOU to industry (updates status + sentAt)
router.put("/:id/send", async (req, res) => {
  try {
    const mou = await Mou.findById(req.params.id);
    if (!mou) return res.status(404).json({ message: "MOU not found" });

    mou.status = "Sent to Industry";
    mou.sentAt = new Date().toISOString();
    await mou.save();

    res.status(200).json(mou);
  } catch (error) {
    res.status(500).json({ message: "Error sending MOU", error: error.message });
  }
});

// University approves or rejects
router.put("/:id/stamp", async (req, res) => {
  try {
    const { type, by, note } = req.body; // type: "approve" | "reject"
    const mou = await Mou.findById(req.params.id);
    if (!mou) return res.status(404).json({ message: "MOU not found" });

    mou.universityStamp = { by: by || "University Admin", type, note, date: new Date().toISOString() };

    if (type === "approve") {
      mou.status = mou.status === "Approved by Industry"
        ? "Mutually Approved"
        : "Approved by University";
    } else {
      mou.status = "Rejected";
    }

    await mou.save();
    res.status(200).json(mou);
  } catch (error) {
    res.status(500).json({ message: "Error stamping MOU", error: error.message });
  }
});

// Schedule meeting
router.put("/:id/meeting", async (req, res) => {
  try {
    const mou = await Mou.findById(req.params.id);
    if (!mou) return res.status(404).json({ message: "MOU not found" });

    mou.scheduledMeeting = req.body;
    await mou.save();
    res.status(200).json(mou);
  } catch (error) {
    res.status(500).json({ message: "Error saving meeting", error: error.message });
  }
});

// Delete MOU
router.delete("/:id", async (req, res) => {
  try {
    const deletedMou = await Mou.findByIdAndDelete(req.params.id);
    if (!deletedMou) return res.status(404).json({ message: "MOU not found" });
    res.status(200).json({ message: "MOU deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting MOU", error: error.message });
  }
});

export default router;