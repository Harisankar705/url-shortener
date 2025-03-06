import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    googleId: { type: String, required: true },
    name: String,
    email: { type: String, required: true }
});
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
