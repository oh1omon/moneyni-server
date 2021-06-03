import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { User } from '../models/user-schema'
import { IServiceUser, IUpdates, IUserDocument, IUserInput, IUserService } from '../types'

export default class UserService implements IUserService {
	/**
	 * Method performs searching database with id passed into function, and returns found doc, or empty object
	 * @param id string
	 */
	public async findUserById(id: string): Promise<IUserDocument | Record<string, never>> {
		try {
			const doc = await User.findById(id)
			return doc
		} catch (e) {
			console.log(e)
			return {}
		}
	}

	/**
	 * Method performs searching database with email passed into function, and returns found doc, or empty object
	 * @param email string
	 */
	public async findUserByEmail(email: string): Promise<IUserDocument | Record<string, never>> {
		try {
			const doc = await User.findOne({ email })
			return doc
		} catch (e) {
			console.log(e)
			return {}
		}
	}

	/**
	 * Method check if user already registered or not and then creates, or not creates a new user
	 * @param newUser
	 * @returns {Promise<ICreateNewUser>}
	 */
	public async createNewUser(newUser: IUserInput): Promise<IServiceUser> {
		try {
			//Checking if user already exists in DB
			const foundUser = this.findUserByEmail(newUser.email)
			if (Object.keys(foundUser).length > 0) {
				return { message: { success: false, message: 'there is an account with this email already' } }
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

			return { message: { success: true, message: 'You have been successfully sign up ' }, user: injectedUser }
		} catch (e) {
			console.log(e)

			return { message: { success: false, message: 'Something went wrong' } }
		}
	}

	/**
	 * This method is used for adding spends or just updating the user
	 * @param userId
	 * @param updates
	 * @returns
	 */
	public async updateUser(userId: string, updates: IUpdates): Promise<IServiceUser> {
		try {
			//todo: check if everything works here
			const updatedUser = await User.findByIdAndUpdate(
				userId,
				{
					$push: { spends: updates?.spends },
					name: updates?.name,
					password: updates.password && (await bcrypt.hash(updates?.password, 10)),
				},
				{
					new: true,
				}
			)

			return { message: { success: true, message: 'You have successfully updated your profile! ' }, user: updatedUser }
		} catch (e) {
			console.log(e)

			return { message: { success: false, message: 'Something went wrong' } }
		}
	}
}
