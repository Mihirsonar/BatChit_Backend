import { protect } from "../Middleware/auth_mid.js";
import Conversation from "../Models/Conversation.js";
import express from "express";

const router = express.Router();

router.post("/", protect, async (req, res) => {
    const {userId} = req.body;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user._id, userId] },
            isGroupChat: false,
        }).populate("participants", "-password").populate("lastMessage");

        if(!conversation){
            conversation = await Conversation.create({
                participants: [req.user._id, userId],
            });

            conversation = await conversation.populate("participants", "-password").populate("lastMessage");
        }
        return res.status(200).json(conversation);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/", protect, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.user._id] },
        })
        .populate("participants", "-password","username email")
        .populate("lastMessage")
        .sort({ updatedAt: -1 });

        return res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;