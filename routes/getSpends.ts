import express, { Request, Response } from 'express';
import { getSpendsValidator } from '../validators/getSpendsValidator';
import { getSpendsById } from '../db/database';

const router = express.Router();

//Route for getting all spends
router.post('/', (req: Request, res: Response) => {
    const valRes = getSpendsValidator(req.body.spends);
    if (valRes) return res.json({ message: 'wrong spendArr submitted' });
    getSpendsById(req.body.spends)
        .then((resp) =>
            res.json({
                message: 'Spends found: ',
                spends: resp,
            })
        )
        .catch((err) => res.json(err));
});

export default router;
