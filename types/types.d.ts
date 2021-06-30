/// <reference types="node" />
import { Request as IRequest, Response } from 'express'
import { Document, Types } from 'mongoose'
import { Methods } from './controller'

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
	salary: {
		monthly: number
		actual: number
	}
	spends: [] | Types.ObjectId[]
}

type IUserDocument = IUser & Document

//Interface for data coming from client side
interface IUserInput {
	email?: IUser['email']
	password?: IUser['password']
	name?: IUser['name']
	salary?: number
}

//Interfaces for Spends
interface ISpend {
	_id: Types.ObjectId
	owner: Types.ObjectId
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

// Interface for Month schema

interface IMonth {
	_id: Types.ObjectId
	owner: Types.ObjectId
	month: number
	spends: Types.ObjectId[]
	salary: {
		monthly: number
		actual: number
	}
}

type IMonthDocument = IMonth & Document

interface IMessage {
	success: boolean
	message: string
}
interface IServiceUser {
	status: IMessage
	user?: IUserDocument
}

type TGetUserByEmail = (email: string) => Promise<IUserDocument | Record<string, never>>

type TGetUserById = (id: string) => Promise<IUserDocument | Record<string, never>>

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

//UserService

interface IUserUC {
	name?: string | null
	id?: string | null
	password?: string | null
	email?: string | null
	spends?: Types.ObjectId | null
	salary?: { monthly?: number; actual?: number }
}

interface ISpendSC {
	category?: string | undefined
	currency?: string | undefined
	cost?: number | undefined
	comment?: string | undefined
	idArr?: Types.ObjectId[] | undefined
	owner?: Types.ObjectId | undefined
}

interface IMonthSC {
	idArr?: Types.ObjectId[] | undefined
	owner?: Types.ObjectId | undefined
	month?: number | undefined
	spends?: Types.ObjectId[] | null
	salary?: { monthly?: number; actual?: number }
}

type TGetSpend = Promise<
	| {
			status: { success: boolean; message: string }
			spends: ISpendDocument[]
	  }
	| { status: { success: boolean; message: string }; spends?: undefined }
>

type TGetMonth = Promise<
	| {
			status: { success: boolean; message: string }
			months: IMonthDocument[]
	  }
	| { status: { success: boolean; message: string }; months?: undefined }
>

type TAddSpend = Promise<
	| { status: { success: boolean; message: string }; spends: ISpendDocument }
	| { status: { success: boolean; message: string }; spends?: undefined }
>

type TAddMonth = Promise<
	| { status: { success: boolean; message: string }; month: IMonthDocument }
	| { status: { success: boolean; message: string }; month?: undefined }
>
