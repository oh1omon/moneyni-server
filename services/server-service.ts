import { Application, RequestHandler } from 'express'
import http from 'http'
import Controller from '../types/controller'

export default class Server {
	private app: Application
	private readonly port: number

	constructor(app: Application, port: number) {
		this.app = app
		this.port = port
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
			this.app.use(controller.path, controller.setRoutes())
		})
	}
}
