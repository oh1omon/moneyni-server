import mongoose, { Connection, ConnectOptions } from 'mongoose'

export default class DbService {
	public connection: Connection
	private connectionUri: string
	private options: ConnectOptions

	constructor(connectionUri: string) {
		this.connection = null
		this.connectionUri = connectionUri
		this.options = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		}
	}

	/**
	 * This method is needed to connect to db
	 * @returns {void}
	 */
	connect(): void {
		//if we have existing connection to database we will not make any more
		if (this.connection) return

		//Here we trying to connect to database with passed connection uri
		try {
			mongoose.connect(this.connectionUri, this.options)
		} catch (e) {
			//If has happened any problems with connection, we will print them to console and then stop code executing
			if (e) {
				console.log(`Problem connecting to Database, error message: ${e.message}`)
			}
			return
		}

		//Setting class connection property to the one we have right now
		this.connection = mongoose.connection

		//Adding listener for success connection
		this.connection.once('open', async () => {
			console.log('Connected to database')
		})

		//Adding listener for future possible errors
		this.connection.on('error', () => {
			console.log('Error connecting to database')
		})
	}
}
