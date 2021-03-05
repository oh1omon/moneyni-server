import express, { Request, Response } from 'express';
import { initializePassport } from '../passport/passport.config';
import passport from 'passport';
import { getUserByEmail, getUserById } from '../db/database';

const router = express.Router();

initializePassport(passport, getUserByEmail, getUserById);

//Sign In Route
router.post(
    '/',
    (req, res) => {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return res.json({ message: err.message });
            }
            if (!user) {
                return res.json({ message: 'user not found' });
            }
            req.login(user, function (err) {
                if (err) {
                    return res.json({ message: 'internal error' });
                }
                return res.json({
                    message: 'authenticated',
                    user: {
                        _id: user._id,
                        email: user.email,
                        name: user.name,
                        spendings: user.spendings,
                    },
                });
            });
        })(req, res);
    }
    // passport.authenticate('local', {
    //     successMessage: true,
    //     failureMessage: true,
    //     failureFlash: true,
    // }),
    // function (req: any, res: Response) {
    //     res.json({ email: req.user.email });
    // }
);

export default router;
