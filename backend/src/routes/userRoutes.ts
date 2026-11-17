import { Router } from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { getUsersForSidebar } from '../controllers/userController.js';

const router = Router();

// You must be logged in (protectRoute) to see the directory!
router.get('/', protectRoute, getUsersForSidebar);

export default router;