import express, { Request, Response } from 'express';

const router = express.Router();

//Route for confirming or not user's authentication
router.get('/', (req: Request, res: Response) => {
    res.json({ user: req.user });
});

export default router;
