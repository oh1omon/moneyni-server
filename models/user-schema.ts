import { model, Model, Schema, Types } from 'mongoose'
import { IUserDocument } from '../types/types'

export const UserSchema: Schema = new Schema({
	_id: Types.ObjectId,
	email: {
		type: String,
		required: [true, 'Your email is required'],
		validate: {
			validator: (email: string) => {
				return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
			},
			message: (props: Record<string, string>) => `${props.value} is not a valid email!`,
		},
	},
	password: {
		type: String,
		required: [true, 'Your password is required'],
		minLength: [8, 'Password should be at least 8 symbols'],
	},
	name: {
		type: String,
		required: [true, 'Your name is required'],
		minLength: [2, 'Your name should not be shorter then 2 symbols'],
		maxLength: [20, 'Your name should not be longer then 20 symbols'],
	},
	balance: {
		current: {
			type: Number,
			required: [true, 'Your current balance is required'],
			max: [300_000, 'Your balance should not be longer then 20 symbols'],
		},
		spent: {
			type: Number,
			required: [true, 'Your current balance is required'],
			max: [300_000, 'Your balance should not be longer then 20 symbols'],
		},
		income: {
			type: Number,
			required: [true, 'Your current balance is required'],
			max: [300_000, 'Your balance should not be longer then 20 symbols'],
		},
	},
	spends: [Types.ObjectId],
	months: [
		{
			month: { type: Number, min: 0, max: 11, required: true },
			id: { type: Types.ObjectId, required: true },
		},
	],
})

export const User: Model<IUserDocument> = model<IUserDocument>('User', UserSchema)
