import { Router } from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { sendMessage, getMessages } from '../controllers/messageController.js';

const router = Router();

// Fetch 1-on-1 message history between logged-in user and user :id
router.get('/:id', protectRoute, getMessages);

// Send a private message to user :id
router.post('/send/:id', protectRoute, sendMessage);

export default router;