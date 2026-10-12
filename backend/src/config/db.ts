import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // 1. Get the connection string from our .env file
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    // 2. Try to connect to MongoDB
    const connection = await mongoose.connect(uri);

    // 3. If successful, print a happy message
    console.log(`📦 MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    // 4. If it fails (like if MongoDB isn't running), print the error and stop the server
    console.error(`❌ MongoDB Connection Error:`, error);
    process.exit(1); 
  }
};

export default connectDB;