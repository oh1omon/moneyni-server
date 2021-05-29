import { Response, Router } from 'express'
import passport from 'passport'
import { initializePassport } from '../passport/passport.config'
import { createNewUser, getUserByEmail, getUserById } from '../services/database'
import Validator from '../services/validator'
import { Request } from '../types'

const router = Router()

initializePassport(passport, getUserByEmail, getUserById)

router.post('/signin', (req: Request, res: Response) => {
	const valRes = Validator.signInValidator(req.body)
	if (valRes) return res.json({ message: 'wrong data submitted' })
	passport.authenticate('local', function (err, user) {
		if (err) {
			return res.json({ message: err.message })
		}
		if (!user) {
			return res.json({ message: 'user not found' })
		}
		req.login(user, function (err) {
			if (err) {
				return res.json({ message: 'internal error' })
			}
			return res.json({
				message: 'authenticated',
				user: {
					_id: user._id,
					email: user.email,
					name: user.name,
					spends: user.spends,
				},
			})
		})
	})(req, res)
})

router.post('/signup', (req: Request, res: Response) => {
	const valRes = Validator.signUpValidator(req.body)
	if (valRes) return res.json({ message: 'wrong data submitted' })
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
})

router.get('/signout', (req: Request, res: Response) => {
	req.logout()
	req.session.destroy(function (err) {
		if (!err) {
			res.status(200).clearCookie('connect.sid', { path: '/' }).json({ user: req.user })
		} else {
			console.log(err)
		}
	})
})

router.get('/retrieve', (req: Request, res: Response) => {
	res.json({ user: req.user })
})

export default router
