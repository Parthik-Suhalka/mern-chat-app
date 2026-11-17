import { Response } from 'express';
import Message from '../models/Message.js';
import { AuthRequest } from '../middlewares/protectRoute.js';
import { getIO } from '../sockets/socket.js'; // <-- 1. Import our socket microphone

// --- 1. SEND A MESSAGE & BROADCAST ---
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const senderId = req.userId;

    if (!text) {
      res.status(400).json({ message: "Message text is required" });
      return;
    }

    // 1. Save to MongoDB
    const newMessage = await Message.create({
      senderId,
      text,
    });

    // 2. Fetch the sender's username so the frontend knows who wrote it
    const populatedMessage = await newMessage.populate('senderId', 'username profilePic');

    // 3. Grab the microphone and shout the new message to everyone connected!
    const io = getIO();
    io.emit('newMessage', populatedMessage);

    // 4. Send the HTTP response back to the sender
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error });
  }
};

// --- 2. FETCH ALL MESSAGES ---
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const messages = await Message.find()
      .populate('senderId', 'username profilePic')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error });
  }
};