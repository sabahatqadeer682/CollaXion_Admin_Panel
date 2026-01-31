import express from "express";
import axios from "axios";
import Industry from "../models/Industry.js";

const router = express.Router();

// Distance helper
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

router.post("/fetch-from-google", async (req, res) => {
  const { lat, lng, radius = 20 } = req.body;
  const effectiveRadius = Math.min(radius, 20);

  if (!lat || !lng) {
    return res.status(400).json({ message: "Lat & lng required" });
  }

  // ✅ CHECK CACHE FIRST
  const cached = await Industry.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: effectiveRadius * 1000,
      },
    },
  }).limit(50);

  if (cached.length > 5) {
    return res.json({
      fromCache: true,
      industries: cached.map((ind) => ({
        _id: ind._id,
        name: ind.name,
        address: ind.address,
        location: {
          lat: ind.location.coordinates[1],
          lng: ind.location.coordinates[0],
        },
        distanceKm:
          Math.round(
            calculateDistance(
              lat,
              lng,
              ind.location.coordinates[1],
              ind.location.coordinates[0]
            ) * 10
          ) / 10,
        rating: ind.rating,
        phone: ind.phone,
        website: ind.website,
        googleMapsUrl: ind.googleMapsUrl,
      })),
    });
  }

  // ✅ BETTER SEARCH TERMS (PAKISTAN FRIENDLY)
  const queries = [
    "software company",
    "software house",
    "web development",
    "app development",
    "IT services",
    "digital agency",
    "technology solutions",
    "ERP software",
    "IT consultant",
  ];

  const placesMap = new Map();

  for (const q of queries) {
    const resText = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: q,
          location: `${lat},${lng}`,
          radius: effectiveRadius * 1000,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (resText.data.results) {
      resText.data.results.forEach((p) =>
        placesMap.set(p.place_id, p)
      );
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  const places = Array.from(placesMap.values()).slice(0, 50);
  const results = [];

  for (const place of places) {
    const details = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: place.place_id,
          fields:
            "name,formatted_address,geometry,formatted_phone_number,website,rating,user_ratings_total,url",
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const d = details.data.result;
    if (!d?.geometry) continue;

    const dist = calculateDistance(
      lat,
      lng,
      d.geometry.location.lat,
      d.geometry.location.lng
    );

    if (dist > effectiveRadius) continue;

    const industry = await Industry.findOneAndUpdate(
      { placeId: place.place_id },
      {
        placeId: place.place_id,
        name: d.name,
        address: d.formatted_address,
        location: {
          type: "Point",
          coordinates: [
            d.geometry.location.lng,
            d.geometry.location.lat,
          ],
        },
        phone: d.formatted_phone_number || "Not Available",
        website: d.website || "Not Available",
        rating: d.rating || 0,
        userRatingsTotal: d.user_ratings_total || 0,
        googleMapsUrl: d.url,
      },
      { upsert: true, new: true }
    );

    results.push({
      _id: industry._id,
      name: industry.name,
      address: industry.address,
      location: {
        lat: d.geometry.location.lat,
        lng: d.geometry.location.lng,
      },
      distanceKm: Math.round(dist * 10) / 10,
      rating: industry.rating,
      phone: industry.phone,
      website: industry.website,
      googleMapsUrl: industry.googleMapsUrl,
    });
  }

  results.sort((a, b) => a.distanceKm - b.distanceKm);

  res.json({
    fromCache: false,
    industries: results,
  });
});

export default router;
