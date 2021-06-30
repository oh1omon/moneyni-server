import { model, Model, Schema, Types } from 'mongoose'
import { IMonth } from '../types/types'

export const monthSchema: Schema = new Schema({
	_id: Types.ObjectId,
	owner: { type: Types.ObjectId, required: true },
	month: { type: Number, required: true },
	spends: { type: [Types.ObjectId], required: true },
	salary: {
		monthly: {
			type: Number,
			required: true,
			min: 2,
			max: 300_000,
		},
		actual: {
			type: Number,
			required: true,
		},
	},
})

export const Month: Model<IMonth> = model<IMonth>('Month', monthSchema)
