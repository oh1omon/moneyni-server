import bcrypt from 'bcrypt';
import { IUser, IUserDocument } from '../db/user/user.types';
import { UserModel } from '../db/user/user.model';

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
                return done(null, user, { message: 'Authorized!' });
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
    passport.serializeUser((user: any, done: any) => {
        done(null, user.id);
    });
    // passport.deserializeUser(function (id: string, done: any) {
    //     UserModel.findById(id, function (err: any, user: any) {
    //         done(err, user);
    //     });
    // });
    passport.deserializeUser(async (id: any, done: any) => {
        return done(null, await getUserById(id));
    });
};
