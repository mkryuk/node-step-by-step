import { Schema } from 'mongoose';
export const todoSchema = new Schema({
    completed: Boolean,
    title: String,
    userId: String,
});
