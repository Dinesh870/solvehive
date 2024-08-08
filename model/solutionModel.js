import mongoose from "mongoose";
import { Schema } from "mongoose";


const solutionSchema = new Schema({
    problemId: {
        type: String,
        required: true,
    },
    methodName: {
        type: String,
        required: true,
    },
    intuition: {
        type: String,
        required: true,
    },
    algorithm: {
        type: [String],
        required: true,
    },
    author: {
        type: String,
    }
    // code: {
    //     type: String,
    //     required: true,
    // }
});

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;

