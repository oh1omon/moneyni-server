import express, { Request, Response } from 'express';
import { initializePassport } from '../passport/passport.config';
import passport from 'passport';
import { getUserByEmail, getUserById } from '../db/database';
import { signInValidator } from '../validators/signInValidator';

const router = express.Router();

initializePassport(passport, getUserByEmail, getUserById);

//Sign In Route
router.post('/', (req: Request, res: Response) => {
    const valRes = signInValidator(req.body);
    if (valRes) return res.json({ message: 'wrong data submitted' });
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
});

export default router;
