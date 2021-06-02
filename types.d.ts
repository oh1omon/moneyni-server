/// <reference types="node" />
import { Request as IRequest, Response } from 'express'
import { Document, Types } from 'mongoose'
import { Methods } from './typings/controller'

//Express
interface Request extends IRequest {
	user?: IUser
}

interface IRoute {
	path: string
	method: Methods
	handler: (req: Request, res: Response) => void
}

// interfaces for User
interface IUser {
	_id: Types.ObjectId
	id: string
	email: string
	password: string
	name: string
	spends: [] | Types.ObjectId[]
}

type IUserDocument = IUser & Document

//Interface for data coming from client side
interface IUserInput {
	email?: IUser['email']
	password?: IUser['password']
	name?: IUser['name']
}

//Interfaces for Spends
interface ISpend {
	_id: Types.ObjectId
	category: string
	comment: string
	cost: number
	currency: string
}

type ISpendDocument = ISpend & Document

//Interface for data coming from client side
interface ISpendInput {
	category: ISpend['category']
	comment?: ISpend['comment']
	cost: ISpend['cost']
	currency: ISpend['currency']
}

type TGetUserByEmail = (email: string) => Promise<IUserDocument>

type TGetUserById = (id: string) => Promise<IUserDocument>

type TCreateNewUser = (newUser: IUserInput) => Promise<IUserDocument>

type TGetSpendsById = (idArr: Types.ObjectId[] | []) => Promise<ISpendDocument | ISpendDocument[] | string>

type TAddNewSpend = (newSpend: ISpendInput) => Promise<ISpendDocument | string>

type TAddNewSpendToUser = (userId: Types.ObjectId, newSpend: Types.ObjectId) => Promise<IUserDocument | string>

type IAddSpendToUserValidator = (newSpend: IAddSpendToUserValProps) => boolean

interface IAddSpendToUserValProps {
	userId: Types.ObjectId
	newSpendId: Types.ObjectId
}

type IAddSpendValidator = (newSpend: IAddSpendValProps) => boolean

interface IAddSpendValProps {
	category?: string
	comment?: string
	cost?: number
	currency?: string
}

type IGetSpendsValidator = (newSpend: IGetSpendsValProps) => boolean

type IGetSpendsValProps = Types.ObjectId[]

type ISignInValidator = (signInData: ISignInValProps) => boolean

interface ISignInValProps {
	email?: string
	password?: string
}

type ISignUpValidator = (signUpData: ISignUpValProps) => boolean

interface ISignUpValProps extends ISignInValProps {
	name?: string
}
