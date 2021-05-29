import bcrypt from 'bcrypt'
import mongoose, { Types } from 'mongoose'
import { ISpendDocument, ISpendInput, IUserDocument, IUserInput } from '../types'
import { Spend } from './spend.schema'
import { User } from './user.schema'

export let database: mongoose.Connection

export const connect: () => void = () => {
	if (database) {
		return
	}

	mongoose.connect(process.env.DB_CONNECT_LINK, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})

	database = mongoose.connection

	database.once('open', async () => {
		console.log('Connected to database')
	})

	database.on('error', () => {
		console.log('Error connecting to database')
	})
}

/**
 * @param {IUserInput} newUser object, containing fields of email, password, name
 * @return either error message or new User Object
 * */
export const createNewUser = async (newUser: IUserInput): Promise<IUserDocument> => {
	return new Promise(async (resolve, reject) => {
		//Checking if all data is presented to registration
		if (!newUser) {
			reject('Please insert data!')
			return
		}
		//Checking if there is an user with such email
		const foundUser = await User.findOne({ email: newUser.email })
		if (foundUser) {
			reject('There are an account with such email already')
			return
		}
		//Hashing password
		const hashedPassword: string = await bcrypt.hash(newUser.password, 10)
		//Create new USer
		const injectedUser: IUserDocument = await User.create({
			_id: new mongoose.Types.ObjectId(),
			email: newUser.email,
			password: hashedPassword,
			name: newUser.name,
			spends: [],
		})
		//Working with the result
		injectedUser ? resolve(injectedUser) : reject('Something went wrong...')
	})
}

export const getUserByEmail = async (email: string): Promise<IUserDocument | undefined> => {
	return new Promise(async (resolve, reject) => {
		if (!email) {
			reject('No email provided')
			return
		}
		User.findOne({ email }, (err: Error, data: IUserDocument | null) => {
			if (err) {
				reject(err)
				return
			} else {
				resolve(data)
			}
		})
	})
}

export const getUserById = async (id: string): Promise<IUserDocument | undefined> => {
	return new Promise(async (resolve, reject) => {
		if (!id) {
			reject('No id provided')
			return
		}
		User.findOne({ _id: id }, (err: Error, data: IUserDocument | null) => {
			if (err) {
				reject(err)
				return
			} else {
				resolve(data)
			}
		})
	})
}

//Spend Operations

export const getSpendsById = async (idArr: Types.ObjectId[] | []): Promise<ISpendDocument | ISpendDocument[] | string> => {
	return new Promise(async (resolve, reject) => {
		//Finding all spends by idArr
		const foundDocs = await Spend.find({
			_id: { $in: idArr },
		})
		if (foundDocs) {
			resolve(foundDocs)
			return
		} else {
			reject('No docs has been found!')
			return
		}
	})
}

export const addNewSpend = async (newSpend: ISpendInput): Promise<ISpendDocument | string> => {
	return new Promise(async (resolve, reject) => {
		//Trying to insert new Spend
		const addedSpend = Spend.create({
			_id: new mongoose.Types.ObjectId(),
			category: newSpend.category,
			comment: newSpend.comment,
			cost: newSpend.cost,
			currency: newSpend.currency,
		})
		//Working with the result
		addedSpend ? resolve(addedSpend) : reject('Something went wrong!')
	})
}

export const addNewSpendToUser = async (userId: Types.ObjectId, newSpend: Types.ObjectId): Promise<IUserDocument | string> => {
	return new Promise(async (resolve, reject) => {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: userId },
			{ $push: { spends: newSpend } },
			{
				new: true,
			}
		)
		updatedUser ? resolve(updatedUser) : reject('Something went wrong!')
	})
}
