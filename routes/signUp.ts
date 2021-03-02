import express, { Request, Response } from 'express';
import { createNewUser } from '../db/database';

const router = express.Router();

//Sign In Route
router.post('/', (req: Request, res: Response) => {
    createNewUser(req.body)
        .then((resp) => res.json({ resp }))
        .catch((err) => res.json(err));
});

export default router;
