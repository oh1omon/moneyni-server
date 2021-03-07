import express, { Request, Response } from 'express';

const router = express.Router();

//Sign Out Route
router.get('/', (req: Request, res: Response) => {
    req.logout();
    req.session.destroy(function (err) {
        if (!err) {
            res.status(200)
                .clearCookie('connect.sid', { path: '/' })
                .json({ status: 'Success' });
        } else {
            // handle error case...
            console.log(err);
        }
    });
});

export default router;
