// models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },          // "YYYY-MM-DD"
    time: { type: String },                         // "HH:MM"
    location: { type: String },
    attendees: { type: String },
    type: {
      type: String,
      enum: [
        "Workshop",
        "Seminar",
        "Webinar",
        "Industry Visit",
        "Competition",
        "Conference",
      ],
      default: "Workshop",
    },
    description: { type: String },
    poster: { type: String }, // URL returned by Cloudinary / local storage
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);