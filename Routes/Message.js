import express from "express";
import Message from "../Models/Message.js";
import Conversation from "../Models/Conversation.js";
import { protect } from "../Middleware/auth_mid.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const message = await Message.create({
      sender: req.user._id,
      conversationId,
      content,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "_id username avatar");

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Message send error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

router.get("/:conversationId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).populate("sender", "_id username avatar");

    res.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

export default router;
