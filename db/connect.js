
import mongoose from "mongoose";

const connectDB = async (url) => {
    await mongoose.connect(url);
    console.log("connect to db");
}

export default connectDB;