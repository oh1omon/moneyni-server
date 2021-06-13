import { Response } from 'express'
import { addNewSpend, getSpendsById } from '../services/database'
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
		getSpendsById(req.body.spends)
			.then((resp) =>
				res.json({
					message: 'Spends found: ',
					spends: resp,
				})
			)
			.catch((err) => res.json(err))
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
		addNewSpend(req.body)
			.then((resp) =>
				res.json({
					message: 'Spend added',
					spend: resp,
				})
			)
			.catch((err) => res.json(err))
	}
}
