import { Response } from 'express'
import UserService from '../services/user-service'
import Controller, { Methods } from '../types/controller'
import { IRoute, Request } from '../types/types'

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
			res.json({ success: false, message: 'Error in field everywhere: You need to submit something' })
		}

		if (!req.user) {
			res.json({ success: false, message: 'Error in field user: You need to be logged in to proceed' })
			return
		}

		const { name, password, spends, balance } = req.body

		const userService = new UserService({ id: req.user?.id, name, password, spends, balance })

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
		if (req.user) {
			res.json({ status: { success: true, message: 'You are authenticated' }, user: req.user })
			return
		}
		res.json({ status: { success: false, message: 'Error in field user: You are not authenticated' } })
	}
}
