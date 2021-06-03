import { Response } from 'express'
import UserService from '../services/user-service'
import validator from '../services/validator'
import { IRoute, Request } from '../types'
import Controller, { Methods } from '../typings/controller'

export default class UserController extends Controller {
	constructor() {
		super()
	}

	path = '/user'

	userService = new UserService()

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
	async handleUpdate(req: Request, res: Response): Promise<void> {
		if (!req.body) {
			res.json({ message: 'you need to submit something' })
		}

		if (!req.user) {
			res.json({ message: 'you need to be logged in to proceed' })
		}

		const updates = validator.update(req.body)

		const result = await this.userService.updateUser(req.user.id, updates)

		res.json(result)
	}
}
