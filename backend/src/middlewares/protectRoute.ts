import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Extend the Express Request type so TypeScript knows we are adding a 'userId'
export interface AuthRequest extends Request {
  userId?: string;
}

export const protectRoute = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // 2. Look for the token in the headers. 
  // It usually looks like: "Authorization: Bearer <token_string>"
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  // 3. Extract just the token string (remove the word "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    // 5. Attach the user's ID to the request so the next function can use it
    req.userId = decoded.userId;

    // 6. Let them pass to the actual route!
    next(); 
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};