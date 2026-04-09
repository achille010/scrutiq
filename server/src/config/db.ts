import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "", {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s
    });
    console.log(`[SYSTEM] MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[SYSTEM FAULT] MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
