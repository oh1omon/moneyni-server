"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePassport = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const LocalStrategy = require('passport-local').Strategy;
const initializePassport = (passport, getUserByEmail, getUserById) => {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        if (!user) {
            return done(null, false, {
                message: `No user found with ${email} email!`,
            });
        }
        try {
            if (await bcrypt_1.default.compare(password, user.password)) {
                return done(null, user, { message: 'Authorized!' });
            }
            else {
                return done(null, false, { message: 'Wrong password' });
            }
        }
        catch (e) {
            return done(e);
        }
    };
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    // passport.deserializeUser(function (id: string, done: any) {
    //     UserModel.findById(id, function (err: any, user: any) {
    //         done(err, user);
    //     });
    // });
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id));
    });
};
exports.initializePassport = initializePassport;
//# sourceMappingURL=passport.config.js.map