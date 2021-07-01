import { Application, RequestHandler } from 'express'
import http from 'http'
import Controller from '../types/controller'
import { scheduleJob } from 'node-schedule'
import { TJobs } from '../types/types'

export default class Server {
	private app: Application
	private readonly port: number
	private schedule: typeof scheduleJob

	constructor(app: Application, port: number, schedule: typeof scheduleJob) {
		this.app = app
		this.port = port
		this.schedule = schedule
	}

	public run(): http.Server {
		//Returning instance of working server
		return this.app.listen(this.port, () => {
			console.log(`The server is running on port ${this.port}`)
		})
	}

	public loadMiddleware(middlewareArr: RequestHandler[]): void {
		middlewareArr.forEach((middleware) => {
			this.app.use(middleware)
		})
	}

	public loadControllers(controllers: Controller[]): void {
		controllers.forEach((controller) => {
			this.app.use(`/api${controller.path}`, controller.setRoutes())
		})
	}

	public loadJobs(jobs: TJobs): void {
		jobs.forEach((j) => this.schedule(j.cronSchedule, j.cb))
	}
}
