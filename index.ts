import express from 'express';
import session from 'express-session';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();
import { connect } from './db/database';
import passport from 'passport';
import signUp from './routes/signUp';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import signIn from './routes/signIn';
import path from 'path';
import signOut from './routes/signOut';
import addSpend from './routes/addSpend';
import getSpends from './routes/getSpends';
import authConfirm from './routes/authConfirm';
import addSpendToUser from './routes/addSpendToUser';
const MongoDBStore = connectMongoDBSession(session);

//Extracting PORT & HOST variables from .env file
const PORT: number = parseInt(process.env.PORT as string, 10);
const HOST: string = process.env.HOST!;

//Connecting to MongoDB Atlas
connect();

//Initializing Express
const app = express();

app.use(cors());

//Bodyparser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// //Adding flash
// app.use(flash());

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
        cookie: { maxAge: 60 * 60 * 1000 * 24 * 30 },
    })
);

//Applying Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes

// Only for testing
app.use(express.static(path.join(__dirname, 'build')));

//Auth Handlers
app.use('/api/signup', signUp);
app.use('/api/signin', signIn);
app.use('/api/signout', signOut);
app.use('/api/authconfirm', authConfirm);

//Adding, Getting Spends
app.use('/api/addspend', addSpend);
app.use('/api/getspends', getSpends);
app.use('/api/addspendtouser', addSpendToUser);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});
//Starting server
app.listen(PORT, HOST, () => {
    console.log(`server is listening on ${HOST}:${PORT}`);
});
