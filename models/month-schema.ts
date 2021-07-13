import { model, Model, Schema, Types } from 'mongoose'
import { IMonth } from '../types/types'

export const monthSchema: Schema = new Schema({
	_id: Types.ObjectId,
	owner: { type: Types.ObjectId, required: true },
	month: { type: Number, required: true },
	operations: { type: [Types.ObjectId], required: true },
	balance: {
		current: {
			type: Number,
			required: true,
			max: 300_000,
		},
		spent: {
			type: Number,
			required: true,
			max: 300_000,
		},
		income: {
			type: Number,
			required: true,
			max: 300_000,
		},
	},
})

export const Month: Model<IMonth> = model<IMonth>('Month', monthSchema)
