import { Response } from 'express'
import passport from 'passport'
import { createNewUser } from '../services/database'
import Validator from '../services/validator'
import { IRoute, Methods, Request } from '../types'
import Controller from './Controller'

export default class AuthController extends Controller {
	constructor() {
		super()
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
			method: Methods.POST,
			handler: this.handleLogout,
		},
		{
			path: '/retrieve',
			method: Methods.GET,
			handler: this.handleRetrieve,
		},
	]

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

	handleRegister(req: Request, res: Response): void {
		const valRes = Validator.signUpValidator(req.body)
		if (valRes) {
			res.json({ message: 'wrong data submitted' })
			return
		}
		createNewUser(req.body)
			.then((resp) =>
				res.json({
					message: 'User created!',
					user: {
						_id: resp._id,
						email: resp.email,
						name: resp.email,
						spends: resp.spends,
					},
				})
			)
			.catch((err) => res.json(err))
	}

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

	handleRetrieve(req: Request, res: Response): void {
		res.json({ user: req.user })
	}
}
