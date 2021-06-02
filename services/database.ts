import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { Spend } from '../models/spend-schema'
import { User } from '../models/user-schema'
import {
	IUserDocument,
	TAddNewSpend,
	TAddNewSpendToUser,
	TCreateNewUser,
	TGetSpendsById,
	TGetUserByEmail,
	TGetUserById,
} from '../types'

/**
 * @param {IUserInput} newUser object, containing fields of email, password, name
 * @return either error message or new User Object
 * */
export const createNewUser: TCreateNewUser = async (newUser) => {
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

export const getUserByEmail: TGetUserByEmail = async (email) => {
	return new Promise((resolve, reject) => {
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

export const getUserById: TGetUserById = async (id) => {
	return new Promise((resolve, reject) => {
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

export const getSpendsById: TGetSpendsById = async (idArr) => {
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

export const addNewSpend: TAddNewSpend = async (newSpend) => {
	return new Promise((resolve, reject) => {
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

export const addNewSpendToUser: TAddNewSpendToUser = async (userId, newSpend) => {
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
