import http from 'node:http';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
// Note: We use .js here even though the file is .ts! This is a modern TypeScript rule.
import app from './app.js'; 

// 1. Load hidden variables (like PORT) from a .env file
dotenv.config();

// 2. Create the physical web server and hand it our Express app
const server = http.createServer(app);

// 3. Decide which port to use (use the one from .env, or default to 5000)
const PORT = process.env.PORT || 5000;

connectDB();

// 4. Open the door and start listening for traffic
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});