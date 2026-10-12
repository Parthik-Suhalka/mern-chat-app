import { Router, Response} from 'express';
import { register, login } from '../controllers/authController.js';
import { protectRoute, AuthRequest } from '../middlewares/protectRoute.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// --- NEW PROTECTED ROUTE ---
// Notice how we put 'protectRoute' in the middle!
router.get('/me', protectRoute, (req: AuthRequest, res: Response) => {
  // If they made it here, the middleware passed them through!
  res.status(200).json({ 
    message: "You have accessed a protected route!", 
    yourUserId: req.userId 
  });
});

export default router;