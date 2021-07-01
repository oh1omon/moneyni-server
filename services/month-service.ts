import { Types } from 'mongoose'
import { Month } from '../models/month-schema'
import { IMonthSC, TAddMonth, TGetMonth } from '../types/types'

export default class MonthService {
	public readonly idArr: Types.ObjectId[]
	public readonly owner: Types.ObjectId
	public readonly month: number
	public readonly salary: { monthly?: number; actual?: number }
	public readonly spends: Types.ObjectId[] | null

	constructor({ idArr, owner, month, salary, spends }: IMonthSC) {
		this.idArr = idArr
		this.owner = owner
		this.month = month
		this.salary = salary
		this.spends = spends
	}

	/**
	 * This method is fetching month by id month and owner fields provided to the class constructor
	 * @returns {TGetMonth}
	 */
	public async get(): TGetMonth {
		try {
			if (!this.owner)
				return {
					status: {
						success: false,
						message: "Error, you aren't logged: You have to be logged in to fetch your months",
					},
				}

			if (!this.month)
				return {
					status: {
						success: false,
						message: "Error, you aren't monthAdded: You have not specified month",
					},
				}

			// We are trying to find month
			const foundDocs = await Month.find({
				owner: this.owner,
				month: this.month,
			})

			// Here we are checking if there are any months found
			if (!foundDocs)
				return {
					status: {
						success: false,
						message: "Error, you don't haveMonths: No spends found in this month",
					},
				}

			// Then we are returning object with status object and spends array
			return {
				status: {
					success: true,
					message: 'Spends have been successfully found!',
				},
				months: foundDocs,
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
	 * This method tries to add a new month to DB.
	 * In case of success it will return status object and new spend doc object.
	 * In case of failure it will return only status object with message returned by DB.
	 * @returns {TAddMonth}
	 */
	public async add(): TAddMonth {
		try {
			//Trying to insert new Month
			const addedMonth = await Month.create({
				_id: new Types.ObjectId(),
				owner: this.owner,
				//Since we are running new month creation process after 00:00 so we wil need last month, that is why we are not adding +1 to the value returned from getMonth method
				month: new Date().getMonth(),
				spends: this.spends,
				salary: this.salary,
			})

			// Then we are returning object with status object and month array
			return {
				status: {
					success: true,
					message: 'Spend has been successfully added!',
				},
				month: addedMonth,
			}
		} catch (e) {
			// If something goes wrong, we returning just a status object and logging to console the actual error
			console.log(e)
			return {
				status: {
					success: false,
					message: `userId: ${this.owner}, error: ${e.message}`,
				},
			}
		}
	}
}
