import bcrypt from 'bcrypt'
import { PassportStatic } from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import UserService from '../services/user-service'
import { IUser } from '../types/types'

export const initializePassport = (passport: PassportStatic): void => {
	const authenticateUser = async (email: string, password: string, done: any) => {
		const userService = new UserService({ email })
		const user = await userService.findUserByEmail()
		if (!user) {
			return done(null, false, {
				message: `No user found with ${email} email!`,
			})
		}
		try {
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user, { message: 'Authorized!' })
			} else {
				return done(null, false, { message: 'Wrong password' })
			}
		} catch (e) {
			return done(e)
		}
	}
	passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
	passport.serializeUser((user: IUser, done) => {
		done(null, user.id)
	})
	passport.deserializeUser(async (id: string, done: any) => {
		const userService = new UserService({ id })
		const user = await userService.findUserById()
		user.password = undefined
		return done(null, user)
	})
}
