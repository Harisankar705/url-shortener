import mongoose, { mongo, Schema } from "mongoose";
import { IUser } from "../interfaces.js";
const userSchema=new Schema<IUser>({
    googleId:{type:String,required:true},
    name:String,
    email:{type:String,required:true}
})
const UserModel=mongoose.model("User",userSchema)
export default UserModel