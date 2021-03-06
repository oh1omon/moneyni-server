import { Response } from 'express'
import passport from 'passport'
import { initializePassport } from '../passport/passport-config'
import UserService from '../services/user-service'
import Controller, { Methods } from '../types/controller'
import { IRoute, Request } from '../types/types'

export default class AuthController extends Controller {
	constructor() {
		super()
		initializePassport(passport)
	}

	path = '/auth'

	routes: IRoute[] = [
		{
			path: '/login',
			method: Methods.POST,
			handler: this.handleLogin,
		},
		{
			path: '/register',
			method: Methods.POST,
			handler: this.handleRegister,
		},
		{
			path: '/logout',
			method: Methods.GET,
			handler: this.handleLogout,
		},
	]

	/**
	 * This method calls user login function.
	 * After that, this handler responses to the client part according to result of user creation function
	 * @param req
	 * @param res
	 * @returns {void}
	 */
	handleLogin(req: Request, res: Response): void {
		passport.authenticate('local', (err, user) => {
			if (err) {
				res.json({ status: { success: false, message: err.message } })
				return
			}
			if (!user) {
				res.json({
					status: { success: false, message: 'Error in field somewhere: Wrong email or password' },
				})
				return
			}
			req.login(user, (err) => {
				if (err) {
					res.json({
						status: {
							success: false,
							message: 'Error in internal processes: Internal error, try later please',
						},
					})
					return
				}
				res.json({
					status: { success: true, message: 'You have been successfully authenticated' },
					user: {
						_id: user._id,
						email: user.email,
						name: user.name,
						operations: user.operations,
						balance: user.balance,
					},
				})
				return
			})
		})(req, res)
	}

	/**
	 * This method calls user creation function.
	 * After that, this handler responses to the client part according to result of user creation function
	 * @param req
	 * @param res
	 * @returns {void}
	 */
	async handleRegister(req: Request, res: Response): Promise<void> {
		try {
			const userService = new UserService(req.body)

			const result = await userService.createNewUser()

			if (result.status.success) {
				req.login(result.user, (err) => {
					if (err) {
						res.json({
							status: {
								success: false,
								message:
									'Error in field nowhere: Problem with signing you in after signing you up',
							},
						})
						return
					}
					res.json({
						status: result.status,
						user: {
							_id: result.user._id,
							email: result.user.email,
							name: result.user.name,
							operations: result.user.operations,
							balance: result.user.balance,
						},
					})
					return
				})
			} else res.json(result)
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
	 * This method logs out user and then deletes user side cookie
	 * @param req
	 * @param res
	 * @returns {void}
	 */
	handleLogout(req: Request, res: Response): void {
		req.logout()
		req.session.destroy(function (err) {
			if (!err) {
				res.status(200)
					.clearCookie('connect.sid', { path: '/' })
					.json({ status: { success: true, message: 'You have successfully logged out' } })
			} else {
				console.log(err)
				res.json({
					status: { success: false, message: 'Error in internal processes: Problem logging you out' },
				})
			}
		})
	}
}
