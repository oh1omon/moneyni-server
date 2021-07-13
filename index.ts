import MongoStore from 'connect-mongo'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express'
import session from 'express-session'
import schedule from 'node-schedule'
import passport from 'passport'
import AuthController from './controllers/auth-controller'
import OperationsController from './controllers/operations-controller'
import UserController from './controllers/user-controller'
import DbService from './services/db-service'
import MonthlyNullify from './services/monthly-nullify'
import Server from './services/server-service'
dotenv.config()

const app: Application = express()

//Extracting PORT & HOST variables from .env file
const PORT: number = parseInt(process.env.PORT as string, 10)

//Initializing Server class and passing there app instance and port number
const server = new Server(app, PORT, schedule.scheduleJob)

//Initializing DbService class by passing db connection uri to it
const db = new DbService(process.env.DB_CONNECT_LINK)

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

const controllers = [new AuthController(), new OperationsController(), new UserController()]

try {
	server.loadMiddleware(globalMiddleware)
	db.connect()
	server.loadControllers(controllers)
	server.loadJobs([
		{
			interval: MonthlyNullify.interval,
			cb: MonthlyNullify.callback,
		},
	])
	server.run()
} catch (e) {
	console.log(e)
}
