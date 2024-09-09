import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        maxlength: 30, 
    },
    email:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    token:{
        type:String
    },
    resetTokenExpireTime:{
        type: Date
    }
});

export default mongoose.model('User', userSchema);