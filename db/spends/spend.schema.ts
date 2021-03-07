import { Schema } from 'mongoose';
import mongoose from 'mongoose';

export const spendSchema: Schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: String,
    comment: String,
    cost: Number,
    currency: String,
});
