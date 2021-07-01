import { Response } from 'express'
import SpendService from '../services/spend-service'
import Controller, { Methods } from '../types/controller'
import { IRoute, Request } from '../types/types'
import MonthService from '../services/month-service'

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
			const { month } = req.body

			let monthData,
				{ idArr } = req.body

			if (month) {
				const monthService = new MonthService({ month, owner: req.body?._id })

				const response = await monthService.get()

				if (!response.status.success) {
					res.json(response)

					return
				}

				idArr = response.months[0].spends

				monthData = { month: response.months[0].month, salary: response.months[0].salary }
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
