import express from "express";
import User from "../Models/User.js";

import { protect } from "../Middleware/auth_mid.js";

const router = express.Router();

// GET /api/users?search=keyword

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/me", protect, async (req, res) => {
  const { username, bio, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { username, bio, avatar },
    { new: true }
  ).select("-password");

  res.json(user);
});

router.get("/all", protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.status(200).json(users);
    } catch (error) {       
    res.status(500).json({ message: "Server error" });
    }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');    

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  } 
});

export default router;