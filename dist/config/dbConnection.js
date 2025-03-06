var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
export const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoUri = process.env.MONGODB_URI;
        console.log("MONGOURI", mongoUri);
        if (!mongoUri) {
            throw new Error('MONGO_DB environment variable not found');
        }
        console.log("Attempting to connect to MongoDB...");
        yield mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000,
        });
        console.log("Connected to MongoDB successfully!");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
});
