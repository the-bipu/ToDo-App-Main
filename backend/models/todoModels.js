import mongoose from 'mongoose';

// Define the Todo Schema
const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        isChecked: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

// Create models based on the schemas
export const Todo = mongoose.model('Todo', todoSchema);
