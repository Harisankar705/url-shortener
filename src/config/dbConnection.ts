import mongoose from "mongoose";

export const dbConnection = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log("MONGOURI", mongoUri);
    if (!mongoUri) {
      throw new Error('MONGO_DB environment variable not found');
    }
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000, 
    });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; 
  }
};