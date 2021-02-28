import express, { Request, Response, urlencoded } from 'express';
import * as dotenv from 'dotenv';
import { connect, createNewUser } from './db/database';
import { IUser, IUserInput } from './db/user/user.types';
dotenv.config();
const PORT: number = parseInt(process.env.PORT as string, 10);
const HOST: string = process.env.HOST!;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connect();

// createNewUser({
//     email: 'qrqw',
//     password: 'fwqfwqfwq',
//     name: 'wqrwqrwqr',
// })
//     .then((resp) => console.log(resp))
//     .catch((err) => console.log(err));

app.get('/', (req: Request, res: Response) => {
    res.send('fqefqqwrwqrwfr');
});

app.post('/api/login', (req: Request, res: Response) => {
    createNewUser(req.body)
        .then((resp) => res.json({ resp }))
        .catch((err) => res.json(err));
});

app.listen(PORT, HOST, () => {
    console.log(`server is listening on ${HOST}:${PORT}`);
});
