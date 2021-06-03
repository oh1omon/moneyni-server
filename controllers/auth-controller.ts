import { Response } from 'express'
import passport from 'passport'
import { initializePassport } from '../passport/passport-config'
import UserService from '../services/user-service'
import Validator from '../services/validator'
import { IRoute, Request } from '../types'
import Controller, { Methods } from '../typings/controller'

export default class AuthController extends Controller {
	constructor() {
		super()
	}

	path = '/auth'

	passport = initializePassport(passport)

	userService = new UserService()

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
			method: Methods.POST,
			handler: this.handleLogout,
		},
		{
			path: '/retrieve',
			method: Methods.GET,
			handler: this.handleRetrieve,
		},
	]

	/**
	 * This method performs validation of user input and then calls user login function.
	 * After that, this handler responses to the client part according to result of user creation function
	 * @param req
	 * @param res
	 * @returns {void}
	 */
	handleLogin(req: Request, res: Response): void {
		const valRes = Validator.signInValidator(req.body)
		if (valRes) {
			res.json({ message: 'wrong data submitted' })
			return
		}
		passport.authenticate('local', function (err, user) {
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
					message: 'authenticated',
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
	 * This method performs validation of user input and then calls user creation function.
	 * After that, this handler responses to the client part according to result of user creation function
	 * @param req
	 * @param res
	 * @returns {void}
	 */
	handleRegister(req: Request, res: Response): void {
		const valRes = Validator.signUpValidator(req.body)
		if (valRes) {
			res.json({ message: 'wrong data submitted' })
			return
		}
		this.userService
			.createNewUser(req.body)
			.then((resp) =>
				res.json({
					message: resp.message,
					user: resp.user
						? {
								_id: resp.user._id,
								email: resp.user.email,
								name: resp.user.name,
								spends: resp.user.spends,
						  }
						: null,
				})
			)
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
