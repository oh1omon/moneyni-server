import { model, Model, Schema, Types } from 'mongoose'
import { ISpendDocument } from '../types'

export const spendSchema: Schema = new Schema({
	_id: Types.ObjectId,
	category: String,
	comment: String,
	cost: Number,
	currency: String,
})

export const Spend: Model<ISpendDocument> = model<ISpendDocument>('Spend', spendSchema)
