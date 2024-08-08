import mongoose, { mongo } from "mongoose";
import {Schema} from "mongoose";

const sampleExampleSchema = new Schema(
    {
        input: {
            type: String,
            required: true,
        },
        output: {
            type: String,
            required: true,
        },
        explanation: {
            type: String,
            // required: true,
        },
        _id: false
    },
);

const problemSchema = new Schema({
    problemname:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    problemstatement: {
        type: String,
    },
    sampleexample: {
        type: [sampleExampleSchema],
        required: true,
    },
    constraints: {
        type: [String],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;