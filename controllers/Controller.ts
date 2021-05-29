import { Router } from 'express'
import { IRoute } from '../types'

export enum Methods {
	GET = 'GET',
	POST = 'POST',
}

//Since this class is abstract we will inherit its properties to our actual classes
export default abstract class Controller {
	//On class initializing we define:

	// public property Router taken from express
	public router: Router = Router()

	//abstract path property
	public abstract path: string

	//Base for the routes from our child classes
	protected abstract readonly routes: IRoute[] = []

	/**
	 * Function depending on the route object will set app(server) to use this route
	 * @returns {Router}
	 */
	public setRoutes = (): Router => {
		for (const route of this.routes) {
			switch (route.method) {
				case 'GET':
					this.router.get(route.path, route.handler)
					break
				case 'POST':
					this.router.post(route.path, route.handler)
					break
				default:
					console.log('not a valid method')
					break
			}
		}
		return this.router
	}
}
