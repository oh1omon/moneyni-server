import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { User } from '../models/user-schema'
import { IServiceUser, IUserDocument, IUserUC } from '../types'

export default class UserService {
	//User property interface
	public readonly user: IUserUC = {
		id: null,
		name: null,
		email: null,
		password: null,
		spends: null,
	}

	constructor({ id, name, email, password, spends }: IUserUC) {
		this.user = { id, name, email, password, spends }
	}

	/**
	 * Method performs searching database with id passed into function, and returns found doc, or empty object
	 * @param id string
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
	 * @param email string
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
	 * @returns {Promise<ICreateNewUser>}
	 */
	public async createNewUser(): Promise<IServiceUser> {
		try {
			//Checking if user already exists in DB
			const foundUser = await this.findUserByEmail()
			if (Object.keys(foundUser).length > 0) {
				return { status: { success: false, message: 'there is an account with this email already' } }
			}

			//Hashing password
			const hashedPassword: string = await bcrypt.hash(this.user.password, 10)

			//Create new USer
			const injectedUser: IUserDocument = await User.create({
				_id: new mongoose.Types.ObjectId(),
				email: this.user.email,
				password: hashedPassword,
				name: this.user.name,
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
	 * @param userId
	 * @param updates
	 * @returns
	 */
	public async updateUser(): Promise<IServiceUser> {
		try {
			const updatedUser = await User.findByIdAndUpdate(
				this.user.id,
				await this.updateDataPrep(this.user as { [key: string]: unknown }),
				{
					new: true,
				}
			)

			updatedUser.password = undefined

			return { status: { success: true, message: 'You have successfully updated your profile! ' }, user: updatedUser }
		} catch (e) {
			console.log(e)

			return { status: { success: false, message: e.message } }
		}
	}

	/**
	 * This method is going to prepare data for update method
	 * It will delete null-ish fields and will transform spends field to $push field
	 * @param uncheckedData
	 * @returns {object} with checked data
	 */
	private async updateDataPrep(uncheckedData: Record<string, unknown>) {
		const acc: Record<string, unknown> = {}
		for (const k in uncheckedData) {
			//this part is working with spends property
			if (uncheckedData['spends'] && k === 'spends') {
				acc.$push = { spends: uncheckedData[k] }
				continue
			}

			//This function crypting password
			if (uncheckedData['password'] && k === 'password') {
				const password = await bcrypt.hash(uncheckedData[k], 10)
				acc[k] = password
				continue
			}

			//All other properties will be added, excluding id
			if (uncheckedData[k] && k !== 'id') {
				acc[k] = uncheckedData[k]
			}
		}

		return acc
	}
}
