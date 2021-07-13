import { model, Model, Schema, Types } from 'mongoose'
import { IOperationDocument } from '../types/types'

export const operationSchema: Schema = new Schema({
	_id: Types.ObjectId,
	owner: Types.ObjectId,
	category: {
		type: String,
		required: [true, 'Category is needed'],
		enum: {
			values: [
				// Adding funds
				'Salary',
				'Gift',

				// Removing funds
				'Bad Habits',
				'Hygiene and Health',
				'Housing',
				'Clothing and Cosmetics',
				'Travel',
				'Food',
				'Entertainment',
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

export const Operation: Model<IOperationDocument> = model<IOperationDocument>('Operation', operationSchema)
