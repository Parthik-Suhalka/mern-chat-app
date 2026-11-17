import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js'
import userRoutes from './routes/userRoutes.js'

// 1. Create the Express application instance
const app: Application = express();

// 2. Global Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes)

app.use('/api/messages', messageRoutes)

app.use('/api/users', userRoutes)

// 3. Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// 4. Export the configured app instance
export default app;