import { Response } from 'express'
import SpendService from '../services/spend-service'
import Validator from '../services/validator'
import { IRoute, Request } from '../types'
import Controller, { Methods } from '../typings/controller'

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
	 * This method performs validation of user input and then calls spends getter function.
	 * After that, this handler responses to the client part according to result of spends getter function
	 * @param req
	 * @param res
	 * @returns {void}
	 */
	handleGet(req: Request, res: Response): void {
		const valRes = Validator.getSpendsValidator(req.body.spends)
		if (valRes) {
			res.json({ message: 'wrong spendArr submitted' })
			return
		}
		const { idArr } = req.body
		const spendsService = new SpendService({ idArr })

		spendsService
			.get()
			.then((r) => res.json(r))
			.catch((e) => {
				console.log(e)
				res.json({ err: 'Some very hard internal error' })
			})
	}

	/**
	 * This method performs validation of user input and then calls spends adding function.
	 * After that, this handler responses to the client part according to result of spends adding function
	 * @param req
	 * @param res
	 * @returns {void}
	 */
	handleAdd(req: Request, res: Response): void {
		const valRes = Validator.addSpendValidator(req.body)
		if (valRes) {
			res.json({ message: 'wrong spend submitted' })
			return
		}
		const { category, cost, currency, comment } = req.body

		const spendsService = new SpendService({ category, cost, currency, comment })

		spendsService
			.add()
			.then((r) => res.json(r))
			.catch((e) => {
				console.log(e)
				res.json({ err: 'Some very hard internal error' })
			})
	}
}
