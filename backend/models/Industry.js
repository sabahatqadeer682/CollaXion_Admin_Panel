import mongoose from "mongoose";

const industrySchema = new mongoose.Schema(
  {
    placeId: { type: String, unique: true, required: true },
    name: String,
    address: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    phone: String,
    website: String,
    rating: Number,
    userRatingsTotal: Number,
    googleMapsUrl: String,
  },
  { timestamps: true }
);

industrySchema.index({ location: "2dsphere" });

export default mongoose.model("Industry", industrySchema);
