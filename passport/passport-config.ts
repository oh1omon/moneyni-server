import bcrypt from 'bcrypt'
import { PassportStatic } from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import UserService from '../services/user-service'
import { IUser } from '../types'

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
	passport.serializeUser((user: IUser, done: any) => {
		done(null, user.id)
	})
	// passport.deserializeUser(function (id: string, done: any) {
	//     UserModel.findById(id, function (err: any, user: any) {
	//         done(err, user);
	//     });
	// });
	passport.deserializeUser(async (id: string, done: any) => {
		const userService = new UserService({ id })
		return done(null, await userService.findUserById())
	})
}
