import express, { Request, Response } from 'express';
import { initializePassport } from '../passport/passport.config';
import passport from 'passport';
import { getUserByEmail, getUserById } from '../db/database';

const router = express.Router();

initializePassport(passport, getUserByEmail, getUserById);

//Sign In Route
router.post(
    '/',
    passport.authenticate('local', {
        successMessage: 'success',
        failureFlash: true,
    }),
    function (req: Request, res: Response) {
        res.json({ email: req.user.email });
    }
);

export default router;
