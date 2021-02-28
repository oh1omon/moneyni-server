import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

export const UserSchema: Schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    spendings: [String],
});
