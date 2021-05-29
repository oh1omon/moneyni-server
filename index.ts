import MongoStore from 'connect-mongo'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { Application } from 'express'
import session from 'express-session'
import passport from 'passport'
import AuthController from './controllers/auth-controller'
import SpendsController from './controllers/spends-controller'
import Server from './server'
dotenv.config()

const app: Application = express()

// //Extracting PORT & HOST variables from .env file
const PORT: number = parseInt(process.env.PORT as string, 10)

//Creating server class and passing express instance and PORT variable there
const server = new Server(app, PORT)

//Creating array of middleware that should be applied globally
const globalMiddleware = [
	cors(),
	express.json(),
	express.urlencoded({ extended: false }),
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: process.env.DB_CONNECT_LINK,
			stringify: false,
		}),
		cookie: { maxAge: 60 * 60 * 1000 * 24 * 30 },
	}),
	passport.initialize(),
	passport.session(),
]

const controllers = [new AuthController(), new SpendsController()]

Promise.resolve().then(() => {
	server.loadMiddleware(globalMiddleware)
	server.loadControllers(controllers)
	server.run()
})
