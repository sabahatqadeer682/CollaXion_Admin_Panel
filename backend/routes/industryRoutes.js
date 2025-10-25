import express from "express";
import Industry from "../models/Industry.js";

const router = express.Router();

// ✅ Get nearby industries like Google Maps
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, maxDistance = 10 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude required" });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // 🔍 Find industries within given radius (default 10km)
    const industries = await Industry.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          maxDistance: parseFloat(maxDistance) * 1000, // convert to meters
          spherical: true,
        },
      },
      {
        $addFields: {
          distanceInKm: { $round: [{ $divide: ["$distance", 1000] }, 2] },
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          email: 1,
          contact: 1,
          location: 1,
          distanceInKm: 1,
        },
      },
    ]);

    res.json(industries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
