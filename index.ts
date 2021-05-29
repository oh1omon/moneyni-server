import MongoStore from 'connect-mongo'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import addSpend from './controllers/addSpend'
import addSpendToUser from './routes/addSpendToUser'
import authConfirm from './routes/authConfirm'
import getSpends from './routes/getSpends'
import signIn from './routes/signIn'
import signOut from './routes/signOut'
import signUp from './routes/signUp'
import { connect } from './services/database'
dotenv.config()

//Extracting PORT & HOST variables from .env file
const PORT: number = parseInt(process.env.PORT as string, 10)

//Connecting to MongoDB Atlas
connect()

//Initializing Express
const app = express()

app.use(cors())

//Bodyparser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Initializing Express session
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: process.env.DB_CONNECT_LINK,
			stringify: false,
		}),
		cookie: { maxAge: 60 * 60 * 1000 * 24 * 30 },
	})
)

//Applying Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Routes

//Auth Handlers
app.use('/api/signup', signUp)
app.use('/api/signin', signIn)
app.use('/api/signout', signOut)
app.use('/api/authconfirm', authConfirm)

//Adding, Getting Spends
app.use('/api/addspend', addSpend)
app.use('/api/getspends', getSpends)
app.use('/api/addspendtouser', addSpendToUser)

//Starting server
app.listen(PORT, () => {
	console.log(`server is listening on ${PORT}`)
})
