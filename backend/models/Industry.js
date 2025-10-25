import mongoose from "mongoose";

const industrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  email: String,
  contact: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

// ✅ Create geospatial index
industrySchema.index({ location: "2dsphere" });

export default mongoose.model("Industry", industrySchema);

