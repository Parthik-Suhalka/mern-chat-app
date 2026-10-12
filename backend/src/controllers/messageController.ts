import { Response } from 'express';
import Message from '../models/Message.js';
import { AuthRequest } from '../middlewares/protectRoute.js'; // We need the custom request type

// --- 1. SEND A MESSAGE ---
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const senderId = req.userId; // The middleware attached this!

    if (!text) {
      res.status(400).json({ message: "Message text is required" });
      return;
    }

    // Save the message to the database
    const newMessage = await Message.create({
      senderId,
      text,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error });
  }
};

// --- 2. FETCH ALL MESSAGES ---
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // We use .populate() to replace the 'senderId' string with the actual User data (like username)
    // We select '-passwordHash' so we don't accidentally send passwords to the frontend!
    const messages = await Message.find()
      .populate('senderId', 'username profilePic') 
      .sort({ createdAt: 1 }); // Sort oldest to newest (how a chat app looks)

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error });
  }
};