import { Response } from 'express'
import MonthService from '../services/month-service'
import OperationService from '../services/operation-service'
import Controller, { Methods } from '../types/controller'
import { IRoute, Request } from '../types/types'

export default class OperationsController extends Controller {
	constructor() {
		super()
	}

	path = '/operations'

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
	 * This method calls operations getter function.
	 * After that, this handler responses to the client part according to result of operations getter function
	 * @param req
	 * @param res
	 * @returns {void}
	 */
	async handleGet(req: Request, res: Response): Promise<void> {
		try {
			// Getting month in case of user wants to fetch his operations for some old month
			const { month } = req.body

			// Declaring monthData and idArr from req.body
			let monthData,
				{ idArr } = req.body

			// Checking if user has passed month number
			if (month) {
				const monthService = new MonthService({ month, owner: req.user?._id })

				const response = await monthService.get()

				//If no operations were found in the month he has decided to fetch we just respond to him with the
				// message
				// about it
				if (!response.status.success) {
					res.json(response)

					return
				}

				// If user does not have any operations in the month then we will return unsuccessful response
				if (!response.months[0]) {
					res.json({
						status: {
							success: false,
							message: 'Error in finding operations: You have no operations in this month',
						},
					})
					return
				}
				// If operations were successfully fetched from the month user has provided, then we will change assign
				// those operations to idArr
				idArr = response.months[0].operations

				monthData = {
					month: response.months[0].month,
					balance: response.months[0].balance,
					operations: response.months[0].operations,
				}
			}

			const operationService = new OperationService({ idArr, owner: req.user?._id })

			const operations = await operationService.get()

			res.json({ ...operations, monthData })
		} catch (e) {
			console.log(e)

			res.json({
				status: {
					success: false,
					message: 'Error in internal processes: Internal error, try later please',
				},
			})
		}
	}

	/**
	 * This method calls operation adding function.
	 * After that, this handler responses to the client part according to result of operation adding function
	 * @param req
	 * @param res
	 * @returns {void}
	 */
	async handleAdd(req: Request, res: Response): Promise<void> {
		try {
			const { category, cost, currency, comment } = req.body

			const operationService = new OperationService({
				category,
				owner: req.user?._id,
				cost,
				currency,
				comment,
			})

			const newOperation = await operationService.add()

			res.json(newOperation)
		} catch (e) {
			console.log(e)

			res.json({
				status: {
					success: false,
					message: 'Error in internal processes: Internal error, try later please',
				},
			})
		}
	}
}
