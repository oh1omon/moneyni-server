import { Response } from 'express'
import passport from 'passport'
import { initializePassport } from '../passport/passport-config'
import UserService from '../services/user-service'
import { IRoute, Request } from '../types'
import Controller, { Methods } from '../typings/controller'

export default class AuthController extends Controller {
	constructor() {
		super()
	}

	path = '/auth'

	passport = initializePassport(passport)

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
				res.json({ message: err.message })
				return
			}
			if (!user) {
				res.json({ message: 'user not found' })
				return
			}
			req.login(user, function (err) {
				if (err) {
					res.json({ message: 'internal error' })
					return
				}
				res.json({
					status: { success: true, message: 'You have been successfully authenticated' },
					user: {
						_id: user._id,
						email: user.email,
						name: user.name,
						spends: user.spends,
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
	handleRegister(req: Request, res: Response): void {
		const userService = new UserService(req.body)

		userService
			.createNewUser()
			.then((r) => {
				if (r.status.success) {
					req.login(r.user, (err) => {
						if (err) {
							res.json({ status: { success: false, message: 'Problem in signing you in after signing you up' } })
							return
						}
						res.json({
							status: r.status,
							user: {
								_id: r.user._id,
								email: r.user.email,
								name: r.user.name,
								spends: r.user.spends,
							},
						})
						return
					})
				}
			})
			.catch((err) => {
				console.log(err)
				res.json({ err: 'internal error' })
			})
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
				res.status(200).clearCookie('connect.sid', { path: '/' }).json({ user: req.user })
			} else {
				console.log(err)
			}
		})
	}
}
