import { Response } from 'express'
import UserService from '../services/user-service'
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
		{
			path: '/retrieve',
			method: Methods.GET,
			handler: this.handleRetrieve,
		},
	]

	/**
	 * This method calls user update function.
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
			return
		}

		const { name, password, spends } = req.body

		const userService = new UserService({ id: req.user?.id, name, password, spends })

		const result = await userService.updateUser()

		res.json(result)
	}

	/**
	 * This method responses to the client part with user's deserialized object
	 * @param req
	 * @param res
	 * @returns {void}
	 */
	handleRetrieve(req: Request, res: Response): void {
		res.json({ user: req.user })
	}
}
