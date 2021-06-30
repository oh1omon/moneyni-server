import { Types } from 'mongoose'
import { Spend } from '../models/spend-schema'
import { ISpendSC, TAddSpend, TGetSpend } from '../types/types'

export default class SpendService {
	public readonly idArr: Types.ObjectId[]
	public readonly owner: Types.ObjectId
	public readonly category: string
	public readonly cost: number
	public readonly comment: string
	public readonly currency: string

	constructor({ idArr, owner, category, cost, comment, currency }: ISpendSC) {
		this.idArr = idArr
		this.owner = owner
		this.category = category
		this.cost = cost
		this.comment = comment
		this.currency = currency
	}

	/**
	 * This method is fetching spends by id array provided to the class constructor
	 * @returns {TAddSpend}
	 */
	public async get(): TGetSpend {
		try {
			if (!this.owner)
				return {
					status: {
						success: false,
						message: "Error, you aren't logged: You have to be logged in to fetch your spends",
					},
				}

			// We are trying to find spends, by ids passed int o class constructor
			const foundDocs = await Spend.find({
				_id: { $in: this.idArr },
				owner: this.owner,
			})

			// Then we are returning object with status object and spends array
			return {
				status: {
					success: true,
					message: 'Spends have been successfully found!',
				},
				spends: foundDocs,
			}
		} catch (e) {
			// If something goes wrong, we returning just a status object and logging to console the actual error
			console.log(e)
			return {
				status: {
					success: false,
					message: 'Error in internal processes: Internal error has happened, please try again later',
				},
			}
		}
	}

	/**
	 * This method tries to add a new spend to DB.
	 * In case of success it will return status object and new spend doc object.
	 * In case of failure it will return only status object with message returned by DB.
	 * @returns {TAddSpend}
	 */
	public async add(): TAddSpend {
		try {
			if (!this.owner)
				return {
					status: {
						success: false,
						message: "Error, you aren't logged: You have to be logged in to insert new spend",
					},
				}
			//Trying to insert new Spend
			const addedSpend = await Spend.create({
				_id: new Types.ObjectId(),
				owner: this.owner,
				category: this.category,
				comment: this.comment,
				cost: this.cost,
				currency: this.currency,
			})

			// Then we are returning object with status object and spends array
			return {
				status: {
					success: true,
					message: 'Spend has been successfully added!',
				},
				spends: addedSpend,
			}
		} catch (e) {
			// If something goes wrong, we returning just a status object and logging to console the actual error
			console.log(e)
			return {
				status: {
					success: false,
					message: e.message,
				},
			}
		}
	}
}
