import { model, Model, Schema, Types } from 'mongoose'
import { IUserDocument } from '../types'

export const UserSchema: Schema = new Schema({
	_id: Types.ObjectId,
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	spends: [Types.ObjectId],
})

export const User: Model<IUserDocument> = model<IUserDocument>('User', UserSchema)
