import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { User } from '../models/user-schema'
import { IServiceUser, IUserDocument, IUserUC } from '../types/types'

export default class UserService {
	//User property interface
	public readonly user: IUserUC = {
		id: null,
		name: null,
		email: null,
		password: null,
		spends: null,
		salary: null,
	}

	constructor({ id, name, email, password, spends, salary }: IUserUC) {
		this.user = { id, name, email, password, spends, salary }
	}

	/**
	 * Method performs searching database with id passed into function, and returns found doc, or empty object
	 */
	public async findUserById(): Promise<IUserDocument | null> {
		try {
			const doc = await User.findById(this.user.id)
			return doc
		} catch (e) {
			console.log(e)
			return null
		}
	}

	/**
	 * Method performs searching database with email passed into function, and returns found doc, or empty object
	 */
	public async findUserByEmail(): Promise<IUserDocument | null> {
		try {
			const doc = await User.findOne({ email: this.user.email })
			return doc
		} catch (e) {
			console.log(e)
			return null
		}
	}

	/**
	 * Method check if user already registered or not and then creates, or not creates a new user
	 * @returns {Promise<IServiceUser>}
	 */
	public async createNewUser(): Promise<IServiceUser> {
		try {
			//Checking if user already exists in DB
			const foundUser = await this.findUserByEmail()
			if (foundUser) {
				return {
					status: {
						success: false,
						message: 'Error in field email: There is an account with this email already',
					},
				}
			}

			//Checking password length
			if (this.user.password.length < 8)
				return {
					status: {
						success: false,
						message: 'Error in field password: Password should be at least 8 symbols',
					},
				}

			//Hashing password
			const hashedPassword: string = await bcrypt.hash(this.user.password, 10)

			//Create new USer
			const injectedUser: IUserDocument = await User.create({
				_id: new mongoose.Types.ObjectId(),
				email: this.user.email,
				password: hashedPassword,
				name: this.user.name,
				salary: { monthly: this.user.salary, actual: this.user.salary },
				spends: [],
			})

			return { status: { success: true, message: 'You have been successfully sign up ' }, user: injectedUser }
		} catch (e) {
			console.log(e)

			return { status: { success: false, message: e.message } }
		}
	}

	/**
	 * This method is used for adding spends or just updating the user
	 * @returns
	 */
	public async updateUser(): Promise<IServiceUser> {
		try {
			//Checking password length
			if (this.user.password && this.user.password.length < 8)
				return {
					status: {
						success: false,
						message: 'Error in field password: Password should be at least 8 symbols',
					},
				}

			//Finding user
			const foundUser = await User.findById(this.user.id)

			//Checking if user has been found
			if (!foundUser) return { status: { success: false, message: 'Error in field user: No user found to update' } }

			//Waiting for user document to be updated, but unsaved
			const updatedUserDoc = await UserService.updateDataPrep(foundUser, this.user as { [key: string]: unknown })

			//Finally, saving user to the db
			const result = await updatedUserDoc.save()

			//Checking if there is any problems saving user
			if (!result) return { status: { success: false, message: 'Error in internal processes: Problem updating user' } }

			//Nulling the password field
			result.password = undefined

			//Returning status and user objects
			return {
				status: { success: true, message: 'You have successfully updated your profile! ' },
				user: result,
			}
		} catch (e) {
			console.log(e)

			return { status: { success: false, message: e.message } }
		}
	}

	/**
	 * This method is combining user document with updates
	 * @param user
	 * @param uncheckedData
	 * @returns {IUserDocument} updates, but unsaved user document
	 */
	private static async updateDataPrep(user: IUserDocument, uncheckedData: IUserUC): Promise<IUserDocument> {
		for (const k in uncheckedData) {
			//this part is working with spends property
			if (uncheckedData['spends'] && k === 'spends') {
				user.spends = [...user.spends, uncheckedData[k]]
				continue
			}

			//This function crypting password
			if (uncheckedData['password'] && k === 'password') {
				const password = await bcrypt.hash(uncheckedData[k], 10)
				user.password = password
				continue
			}

			//This function is to convert salary field into salary object
			if (uncheckedData['salary'] && k === 'salary') {
				Object.assign(user.salary, uncheckedData[k])

				continue
			}

			if (uncheckedData['name'] && k === 'name') {
				user.name = uncheckedData[k] as string
			}
		}

		return user
	}
}
