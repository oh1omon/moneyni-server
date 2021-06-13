import { Types } from 'mongoose'
import {
	IAddSpendToUserValidator,
	IAddSpendValidator,
	IGetSpendsValidator,
	ISignInValidator,
	ISignUpValidator,
	IUpdates,
} from '../types'

/**
 *Methods of this class provides validation functions
 * So, every time we have a new data type to validate, we add method to this class*/
class Validator {
	/**
	 * @param newSpend
	 * @returns true or false depending on status of validation
	 */
	//todo: delete
	addSpendToUserValidator: IAddSpendToUserValidator = (newSpend) => {
		return !newSpend.userId || !newSpend.newSpendId
	}

	/**
	 * This method checks for known properties for user and returns them in the checked object
	 * @param updates
	 * @returns proved updates object
	 */
	public update(updates: Record<string, number | string>): IUpdates {
		const proved: IUpdates = {}
		if (typeof updates.name === 'string') proved.name = updates.name
		if (typeof updates.password === 'string') proved.password = updates.password
		if (Types.ObjectId.isValid(updates.spends)) proved.spends = Types.ObjectId(updates.spends)

		return proved
	}

	/**
	 * @param newSpend
	 * @returns true or false depending on status of validation
	 */
	addSpendValidator: IAddSpendValidator = (newSpend) => {
		return !newSpend.category || !newSpend.cost || !newSpend.currency
	}

	/**
	 * @param spends
	 * @returns true or false depending on status of validation
	 */
	getSpendsValidator: IGetSpendsValidator = (spends) => {
		return !Array.isArray(spends)
	}

	/**
	 * @param signInData
	 * @returns true or false depending on status of validation
	 */
	signInValidator: ISignInValidator = (signInData) => {
		return !signInData.email || !signInData.password || !/^[^\s@]+@[^\s@]+$/.test(signInData.email)
	}

	/**
	 * @param signInData
	 * @returns true or false depending on status of validation
	 */
	signUpValidator: ISignUpValidator = (signInData) => {
		return !signInData.email || !signInData.name || !signInData.password || !/^[^\s@]+@[^\s@]+$/.test(signInData.email)
	}
}

//Exporting instance of class, though nobody makes lots of them
export default new Validator()
