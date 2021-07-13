import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { User } from '../models/user-schema'
import { ICheckedUserUpdate, IServiceUser, IUserDocument, IUserUC } from '../types/types'

export default class UserService {
	//User property interface
	public readonly user: IUserUC = {
		id: null,
		name: null,
		email: null,
		password: null,
		operations: null,
		balance: null,
	}

	constructor({ id, name, email, password, operations, balance }: IUserUC) {
		this.user = { id, name, email, password, operations, balance }
	}

	/**
	 * Method performs searching database with id passed into function, and returns found doc, or empty object
	 */
	public async findUserById(): Promise<IUserDocument | null> {
		try {
			return await User.findById(this.user.id)
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
			return await User.findOne({ email: this.user.email })
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
				balance: { current: 0, spent: 0, income: 0 },
				operations: [],
				months: [],
			})

			return {
				status: { success: true, message: 'You have been successfully sign up ' },
				user: injectedUser,
			}
		} catch (e) {
			console.log(e)

			return { status: { success: false, message: e.message } }
		}
	}

	/**
	 * This method is used for adding operations or just updating the user
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

			//Waiting for user document to be updated, but unsaved
			const result = await User.findByIdAndUpdate(
				this.user.id,
				await UserService.updateDataPrep(this.user as { [key: string]: unknown }),
				{
					new: true,
				}
			)

			//Checking if there is any problems saving user
			if (!result)
				return { status: { success: false, message: 'Error in field user: No user found to update' } }

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
	 * @param uncheckedData
	 * @returns {IUserDocument} updates, but unsaved user document
	 */
	private static async updateDataPrep(uncheckedData: IUserUC): Promise<ICheckedUserUpdate> {
		const checked: ICheckedUserUpdate = {}

		//this part is working with operations property
		if (uncheckedData.operations) {
			checked.$push = { operations: uncheckedData.operations }
		}

		//This function crypting password
		if (uncheckedData.password) {
			checked.password = await bcrypt.hash(uncheckedData.password, 10)
		}

		//This function is to convert salary field into salary object
		if (uncheckedData.balance) {
			checked.balance = uncheckedData.balance
		}

		//This function is to convert salary field into salary object
		if (uncheckedData.name) {
			checked.name = uncheckedData.name
		}

		return checked
	}
}
