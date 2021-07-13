import { User } from '../models/user-schema'
import MonthService from './month-service'
import ScheduleWorker from '../types/schedule-worker'

export default class MonthlyNullify extends ScheduleWorker {
	// Every 00:01:00(ss.mm.hh) 1st day of every month
	static interval = '1 0 1 * *'

	/**
	 * This method runs for every user and saves all his spends and salary to a new month document every beginning of the month
	 * After that it nullifies user
	 */
	static callback(): void {
		// Firstly, we are finding all users in DB
		User.find({}, (err, users) => {
			if (err) {
				console.log(err)
				return
			}

			// For every user we will do some actions
			users.forEach(async (u) => {
				// Destructuring needed data from user document
				const { balance, spends, _id } = u

				// Initializing MonthService
				const monthService = new MonthService({ owner: _id, balance, spends })

				// Trying to create a new Month document
				const response = await monthService.add()

				// In case of success we will nullify spends array, actual salary and then add month record to users document
				if (response.status.success) {
					u.spends = []
					u.balance = { current: 0, income: 0, spent: 0 }
					u.months.push({ month: new Date().getMonth(), id: response.month._id })

					u.save((err) => {
						if (err) {
							console.log(err)
						}
					})
					return
				}

				// This code is run if there is an error happened during month document creation
				console.log(response)
			})
		})
	}
}
