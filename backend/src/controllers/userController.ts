import { Response } from 'express';
import User from '../models/User.js';
import { AuthRequest } from '../middlewares/protectRoute.js';

export const getUsersForSidebar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loggedInUserId = req.userId;

    // Find all users WHERE their _id is Not Equal ($ne) to the logged-in user's ID.
    // The second argument ('-passwordHash') explicitly removes the password from the result.
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-passwordHash');

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};