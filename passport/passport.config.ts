import bcrypt from 'bcrypt';
import { IUser, IUserDocument } from '../db/user/user.types';

const LocalStrategy = require('passport-local').Strategy;

export const initializePassport = (
    passport: any,
    getUserByEmail: any,
    getUserById: any
) => {
    const authenticateUser = async (
        email: string,
        password: string,
        done: any
    ) => {
        const user: IUserDocument = await getUserByEmail(email);
        if (!user) {
            return done(null, false, {
                message: `No user found with ${email} email!`,
            });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Wrong password' });
            }
        } catch (e) {
            return done(e);
        }
    };
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, authenticateUser)
    );
    passport.serializeUser((user: IUser, done: any) => done(null, user._id));
    passport.deserializeUser(async (id: any, done: any) => {
        return done(null, await getUserById(id));
    });
};
