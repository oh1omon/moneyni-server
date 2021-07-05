import { Response } from 'express'
import MonthService from '../services/month-service'
import SpendService from '../services/spend-service'
import Controller, { Methods } from '../types/controller'
import { IRoute, Request } from '../types/types'

export default class SpendsController extends Controller {
	constructor() {
		super()
	}

	path = '/spends'

	routes: IRoute[] = [
		{
			path: '/',
			method: Methods.POST,
			handler: this.handleGet,
		},
		{
			path: '/add',
			method: Methods.POST,
			handler: this.handleAdd,
		},
	]

	/**
	 * This method calls spends getter function.
	 * After that, this handler responses to the client part according to result of spends getter function
	 * @param req
	 * @param res
	 * @returns {void}
	 */
	async handleGet(req: Request, res: Response): Promise<void> {
		try {
			// Getting month in case of user wants to fetch his spends for some old month
			const { month } = req.body

			// Declaring monthData and idArr from req.body
			let monthData,
				{ idArr } = req.body

			// Checking if user has passed month number
			if (month) {
				const monthService = new MonthService({ month, owner: req.user?._id })

				const response = await monthService.get()

				//If no spends were found in the month he has decided to fetch we just respond to him with the message about it
				if (!response.status.success) {
					res.json(response)

					return
				}

				// If user does not have any spends in the month then we will return unsuccessful response
				if (!response.months[0]) {
					res.json({
						status: { success: false, message: 'Error in finding spends: You have no spends in this month' },
					})
					return
				}
				// If spends were successfully fetched from the month user has provided, then we will change assign those spends to idArr
				idArr = response.months[0].spends

				monthData = { month: response.months[0].month, salary: response.months[0].salary, spends: response.months[0].spends }
			}

			const spendsService = new SpendService({ idArr, owner: req.user?._id })

			const spends = await spendsService.get()

			res.json({ ...spends, monthData })
		} catch (e) {
			console.log(e)

			res.json({
				status: { success: false, message: 'Error in internal processes: Internal error, try later please' },
			})
		}
	}

	/**
	 * This method calls spends adding function.
	 * After that, this handler responses to the client part according to result of spends adding function
	 * @param req
	 * @param res
	 * @returns {void}
	 */
	async handleAdd(req: Request, res: Response): Promise<void> {
		try {
			const { category, cost, currency, comment } = req.body

			const spendsService = new SpendService({ category, owner: req.user?._id, cost, currency, comment })

			const newSpend = await spendsService.add()

			res.json(newSpend)
		} catch (e) {
			console.log(e)

			res.json({
				status: { success: false, message: 'Error in internal processes: Internal error, try later please' },
			})
		}
	}
}
