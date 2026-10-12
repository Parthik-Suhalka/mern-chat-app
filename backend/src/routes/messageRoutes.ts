import { Router } from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = Router();

// Both routes need the bouncer! You must be logged in to chat.
router.post('/', protectRoute, sendMessage);
router.get('/', protectRoute, getMessages);

export default router;