import express, { Request, Response } from 'express';
import { addSpendValidator } from '../validators/addSpendValidator';
import { addNewSpend } from '../db/database';

const router = express.Router();

//Route for adding new spend
router.post('/', (req: Request, res: Response) => {
    const valRes = addSpendValidator(req.body);
    if (valRes) return res.json({ message: 'wrong spend submitted' });
    addNewSpend(req.body)
        .then((resp) =>
            res.json({
                message: 'Spend added',
                spend: resp,
            })
        )
        .catch((err) => res.json(err));
});

export default router;
