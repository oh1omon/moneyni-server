import { model, Model, Schema, Types } from 'mongoose'
import { ISpendDocument } from '../types/types'

export const spendSchema: Schema = new Schema({
	_id: Types.ObjectId,
	owner: Types.ObjectId,
	category: {
		type: String,
		required: [true, 'Category is needed'],
		enum: {
			values: [
				'Daily Needs',
				'Bad Habits',
				'Hygiene and Health',
				'Housing',
				'Clothing and Cosmetics',
				'Travel',
				'Food',
				'Entertainment and Gifts',
				'Connection',
			],
			message: '{VALUE} is not supported as spend type',
		},
	},
	comment: { type: String },
	cost: { type: Number, required: [true, 'Cost is needed'], max: 350_000 },
	currency: {
		type: String,
		required: [true, 'Currency is needed'],
		enum: {
			values: ['€', '$', ' ₽'],
			message: '{VALUE} is not supported as currency',
		},
	},
})

export const Spend: Model<ISpendDocument> = model<ISpendDocument>('Spend', spendSchema)
