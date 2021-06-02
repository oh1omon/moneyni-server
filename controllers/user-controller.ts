import { Response } from 'express'
import { IRoute, Request } from '../types'
import Controller, { Methods } from '../typings/controller'

export default class UserController extends Controller {
	constructor() {
		super()
	}

	path = '/user'

	routes: IRoute[] = [
		{
			path: '/update',
			method: Methods.POST,
			handler: this.handleUpdate,
		},
	]

	/**
	 * This method performs validation of user input and then calls user update function.
	 * After that, this handler responses to the client part according to result of user update function
	 * @param req
	 * @param res
	 * @returns {void}
	 */
	handleUpdate(req: Request, res: Response): void {
		res.json({ prikol: 'vnature prikol' })
	}
}
