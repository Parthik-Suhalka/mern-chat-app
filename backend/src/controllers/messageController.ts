import { Response } from 'express';
import Message from '../models/Message.js';
import { AuthRequest } from '../middlewares/protectRoute.js';
import { getIO, getReceiverSocketId } from '../sockets/socket.js';

// --- 1. SEND PRIVATE 1-ON-1 MESSAGE ---
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    const receiverId = req.params.id as string;
    const senderId = req.userId;

    if (!text) {
      res.status(400).json({ message: 'Message text is required' });
      return;
    }

    // 1. Save private message to MongoDB
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
    });

    // 2. Populate sender details for the UI
    const populatedMessage = await newMessage.populate('senderId', 'username profilePic');

    // 3. Look up the recipient's active socket ID
    const receiverSocketId = getReceiverSocketId(receiverId);

    // 4. Emit ONLY to the recipient if they are currently online
    if (receiverSocketId) {
      const io = getIO();
      io.to(receiverSocketId).emit('newMessage', populatedMessage);
    }

    // 5. Return the saved message to the sender over HTTP
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send private message', error });
  }
};

// --- 2. GET 1-ON-1 CONVERSATION HISTORY ---
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userToChatId = req.params.id as string;
    const myId = req.userId;

    // Fetch all messages where (I sent to them) OR (they sent to me)
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    })
      .populate('senderId', 'username profilePic')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch conversation', error });
  }
};