import MongoStore from 'connect-mongo'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import routes from './routes/index'
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
app.use('/', routes)

//Starting server
app.listen(PORT, () => {
	console.log(`server is listening on ${PORT}`)
})
