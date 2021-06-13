import { Types } from 'mongoose'
import { Spend } from '../models/spend-schema'
import { TAddSpend } from '../types'

export default class SpendService {
	public readonly idArr: Types.ObjectId
	constructor({ idArr }) {
		this.idArr = idArr
	}

	/**
	 * This method is fetching spends by id array provided to the class constructor
	 * @returns {TAddSpend}
	 */
	public async get(): TAddSpend {
		try {
			// We are trying to find spends, by ids passed int o class constructor
			const foundDocs = await Spend.find({
				_id: { $in: this.idArr },
			})

			// Then we are returning object with status object and spends array
			return {
				status: {
					success: false,
					message: 'Internal error has happened, please try again later',
				},
				spends: foundDocs,
			}
		} catch (e) {
			// If something goes wrong, we returning just a status object and logging to console the actual error
			console.log(e)
			return {
				status: {
					success: false,
					message: 'Internal error has happened, please try again later',
				},
			}
		}
	}
}
