import express from "express";
import asyncHandler from "express-async-handler";
import LiaisonProfile from "../models/LiaisonProfile.js";

const router = express.Router();

const getOrCreateProfile = async () => {
  let profile = await LiaisonProfile.findOne();
  if (!profile) profile = await LiaisonProfile.create({});
  return profile;
};

router.get("/", asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile();
  res.json(profile);
}));

router.patch("/", asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile();
  const { name, email, role, dp } = req.body || {};
  if (typeof dp === "string" && dp.length > 6_000_000) {
    return res.status(400).json({ message: "Profile photo too large (max ~6MB)" });
  }
  if (typeof name  === "string") profile.name  = name;
  if (typeof email === "string") profile.email = email;
  if (typeof role  === "string") profile.role  = role;
  if (typeof dp    === "string") profile.dp    = dp;
  const saved = await profile.save();
  res.json(saved);
}));

export default router;
