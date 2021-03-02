import express, { Request, Response } from 'express';
import session from 'express-session';
import * as dotenv from 'dotenv';
dotenv.config();
import { connect } from './db/database';
import passport from 'passport';
import signUp from './routes/signUp';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import signIn from './routes/signIn';
import flash from 'express-flash';
const MongoDBStore = connectMongoDBSession(session);

//Extracting PORT & HOST variables from .env file
const PORT: number = parseInt(process.env.PORT as string, 10);
const HOST: string = process.env.HOST!;

//Connecting to MongoDB Atlas
connect();

//Initializing Express
const app = express();

//Bodyparser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Adding flash
app.use(flash());

//Initializing Express session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoDBStore({
            uri: process.env.DB_CONNECT_LINK,
            collection: 'mySessions',
        }),
    })
);

//Applying Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.get('/', (req: Request, res: Response) => {
    res.send('fqefqqwrwqrwfr');
});
app.use('/api/signup', signUp);
app.use('/api/signin', signIn);

//Starting server
app.listen(PORT, HOST, () => {
    console.log(`server is listening on ${HOST}:${PORT}`);
});
