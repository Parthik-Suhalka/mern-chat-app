import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// --- 1. SIGN UP (Register) ---
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Scramble (hash) the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the new user to MongoDB
    const newUser = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration", error });
  }
};

// --- 2. LOG IN ---
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Compare the typed password with the scrambled one in the database
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Create the VIP pass (JWT Token)
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Send the token back to the user
    res.status(200).json({ 
      message: "Login successful",
      token: token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login", error });
  }
};