import express, { Request, Response } from 'express';
import { createNewUser } from '../db/database';

const router = express.Router();

//Sign Up Route
router.post('/', (req: Request, res: Response) => {
    createNewUser(req.body)
        .then((resp) =>
            res.json({
                message: 'User created!',
                user: {
                    _id: resp._id,
                    email: resp.email,
                    name: resp.email,
                    spendings: resp.spendings,
                },
            })
        )
        .catch((err) => res.json(err));
});

export default router;
