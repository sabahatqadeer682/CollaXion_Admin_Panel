// import express from "express";
// import axios from "axios";
// import nodemailer from "nodemailer";
// import Industry from "../models/Industry.js";

// const router = express.Router();

// // ⚡ Nodemailer transporter verification
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
// });

// transporter.verify((err, success) => {
//   if (err) console.log("Transporter Error:", err);
//   else console.log("✅ Server ready to send emails:", success);
// });


// function calculateDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) ** 2;
//   return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
// }

// // ✅ Mock data
// const mockIndustries = [
//   {
//     _id: "1",
//     name: "Riphah Tech Solutions",
//     address: "123 Tech Street, Islamabad",
//     location: { lat: 33.6844, lng: 73.0479 },
//     distanceKm: 2,
//     phone: "+92-300-1234567",
//     website: "https://riphahtech.com",
//     email: "47235@students.riphah.edu.pk",
//   },
//   {
//     _id: "2",
//     name: "Jamil IT Services",
//     address: "456 Digital Avenue, Lahore",
//     location: { lat: 31.5204, lng: 74.3587 },
//     distanceKm: 1.5,
//     phone: "+92-301-7654321",
//     website: "https://jamilit.com",
//     email: "amnajamil871@gmail.com",
//   },
// ];

// // Fetch nearby industries
// // router.post("/fetch-from-google", async (req, res) => {
// //   const { lat, lng, radius = 20 } = req.body;
// //   if (!lat || !lng) return res.status(400).json({ message: "Lat & lng required" });

// //   try {
// //     const cached = await Industry.find({
// //       location: { $near: { $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: radius * 1000 } },
// //     }).limit(50);

// //     if (cached.length > 5) {
// //       return res.json({ fromCache: true, industries: cached });
// //     }

// //     const queries = ["software company","software house","web development","app development","IT services"];
// //     const placesMap = new Map();

// //     for (const q of queries) {
// //       const response = await axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json", {
// //         params: { query: q, location: `${lat},${lng}`, radius: radius * 1000, key: process.env.GOOGLE_MAPS_API_KEY }
// //       });
// //       response.data.results?.forEach(p => placesMap.set(p.place_id, p));
// //       await new Promise(r => setTimeout(r, 500));
// //     }

// //     const results = [];
// //     const places = Array.from(placesMap.values()).slice(0,50);

// //     for (const place of places) {
// //       const details = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
// //         params: { place_id: place.place_id, fields: "name,formatted_address,geometry,formatted_phone_number,website,rating,user_ratings_total,url", key: process.env.GOOGLE_MAPS_API_KEY }
// //       });

// //       const d = details.data.result;
// //       if (!d?.geometry) continue;

// //       const dist = calculateDistance(lat, lng, d.geometry.location.lat, d.geometry.location.lng);
// //       if (dist > radius) continue;

// //       const industry = await Industry.findOneAndUpdate({ placeId: place.place_id }, {
// //         placeId: place.place_id,
// //         name: d.name,
// //         address: d.formatted_address,
// //         location: { type: "Point", coordinates: [d.geometry.location.lng, d.geometry.location.lat] },
// //         phone: d.formatted_phone_number || "Not Available",
// //         website: d.website || "Not Available",
// //         email: d.email || "N/A",
// //         rating: d.rating || 0,
// //         userRatingsTotal: d.user_ratings_total || 0,
// //         googleMapsUrl: d.url,
// //       }, { upsert: true, new: true });

// //       results.push(industry);
// //     }

// //     if (results.length === 0) return res.json({ fromCache: false, industries: mockIndustries });

// //     res.json({ fromCache: false, industries: results });

// //   } catch (err) {
// //     console.error(err);
// //     res.json({ fromCache:false, industries: mockIndustries });
// //   }
// // });


// router.post("/fetch-from-google", async (req, res) => {
//   const { lat, lng, radius = 20 } = req.body;

//   try {
//     const response = await axios.get(
//       "https://maps.googleapis.com/maps/api/place/textsearch/json",
//       {
//         params: {
//           query: "software company",
//           location: `${lat},${lng}`,
//           radius: radius * 1000,
//           key: process.env.GOOGLE_MAPS_API_KEY,
//         },
//       }
//     );

//     const results = [];

//     for (const place of response.data.results.slice(0, 10)) {
//       const details = await axios.get(
//         "https://maps.googleapis.com/maps/api/place/details/json",
//         {
//           params: {
//             place_id: place.place_id,
//             fields:
//               "name,formatted_address,geometry,formatted_phone_number,rating,opening_hours,website",
//             key: process.env.GOOGLE_MAPS_API_KEY,
//           },
//         }
//       );

//       const d = details.data.result;

//       results.push({
//         _id: place.place_id,
//         name: d.name,
//         address: d.formatted_address,
//         location: d.geometry.location,
//         phone: d.formatted_phone_number || "Not Available",
//         rating: d.rating || "N/A",
//         website: d.website || "N/A",
//         distanceKm: radius,
//       });
//     }

//     res.json({ industries: results });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to fetch industries" });
//   }
// });




// // Send email
// router.post("/send-email", async (req, res) => {
//   const { industryId, type } = req.body;
//   if (!industryId || !type) return res.status(400).json({ message: "Invalid request" });

//   const industry = ["1","2"].includes(industryId)
//     ? mockIndustries.find(ind => ind._id === industryId)
//     : await Industry.findById(industryId);

//   if (!industry || !industry.email) return res.status(404).json({ message: "Industry not found or no email" });

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
//     });

//     let subject, text, html;
//     if (type === "form") {
//       subject = "CollaXion: Please fill our Google Form";
//       text = `Hello ${industry.name},\nPlease fill this form: ${process.env.GOOGLE_FORM_LINK}`;
//       html = `<p>Hello ${industry.name},</p><p>Please fill this form: <a href="${process.env.GOOGLE_FORM_LINK}" target="_blank">Click Here</a></p>`;
//     } else {
//       subject = "CollaXion App Download";
//       text = `Hello ${industry.name},\nDownload our CollaXion app here: ${process.env.APP_DOWNLOAD_LINK}`;
//       html = `<p>Hello ${industry.name},</p><p>Download our CollaXion app: <a href="${process.env.APP_DOWNLOAD_LINK}" target="_blank">Download Here</a></p>`;
//     }

//     await transporter.sendMail({ from: process.env.EMAIL_USER, to: industry.email, subject, text, html });
//     res.json({ message: "Email sent successfully" });

//   } catch (err) {
//     console.error("Email error:", err);
//     res.status(500).json({ message: "Failed to send email", error: err.toString() });
//   }
// });

// export default router;












import express from "express";
import axios from "axios";
import Industry from "../models/Industry.js";

const router = express.Router();

// Haversine formula
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

// Fetch nearby industries from Google
router.post("/fetch-from-google", async (req, res) => {
  const { lat, lng, radius = 20 } = req.body;

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: "software company",
          location: `${lat},${lng}`,
          radius: radius * 1000,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const results = [];
    for (const place of response.data.results.slice(0, 10)) {
      const details = await axios.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        {
          params: {
            place_id: place.place_id,
            fields:
              "name,formatted_address,geometry,formatted_phone_number,rating,opening_hours,website",
            key: process.env.GOOGLE_MAPS_API_KEY,
          },
        }
      );
      const d = details.data.result;
      if (!d.geometry) continue;

      results.push({
        _id: place.place_id,
        name: d.name,
        address: d.formatted_address,
        location: d.geometry.location,
        phone: d.formatted_phone_number || "Not Available",
        rating: d.rating || "N/A",
        website: d.website || "N/A",
      });
    }

    res.json({ industries: results });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch industries" });
  }
});

export default router;


// mockdata
