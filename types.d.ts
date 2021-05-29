/// <reference types="node" />
import { Request as IRequest } from 'express'
import { Document, Types } from 'mongoose'

//Request
interface Request extends IRequest {
	user?: IUser
}

// interfaces for User
export interface IUser {
	_id: Types.ObjectId
	email: string
	password: string
	name: string
	spendings: [] | Types.ObjectId[]
}

export type IUserDocument = IUser & Document

//Interface for data coming from client side
export interface IUserInput {
	email?: IUser['email']
	password?: IUser['password']
	name?: IUser['name']
}

//Interfaces for Spends
export interface ISpend {
	_id: Types.ObjectId
	category: string
	comment: string
	cost: number
	currency: string
}

export type ISpendDocument = ISpend & Document

//Interface for data coming from client side
export interface ISpendInput {
	category: ISpend['category']
	comment?: ISpend['comment']
	cost: ISpend['cost']
	currency: ISpend['currency']
}
