import express, { Request, Response } from 'express';
import { addSpendToUserValidator } from '../validators/addSpendToUserValidator';
import { addNewSpendToUser } from '../db/database';

const router = express.Router();

//Route for adding new spend
router.post('/', (req: any, res: Response) => {
    if (!req.user) return res.json({ message: 'you have to be authenticated' });
    const valRes = addSpendToUserValidator({
        userId: req.user._id,
        newSpendId: req.body.newSpendId,
    });
    if (valRes) {
        return res.json({ message: 'something got wrong' });
    }
    addNewSpendToUser(req.user._id, req.body.newSpendId)
        .then((resp) => res.json({ message: 'user updated', user: resp }))
        .catch((err) => res.json(err));
});

export default router;
