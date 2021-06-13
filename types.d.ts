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

interface IMessage {
	success: boolean
	message: string
}
interface IServiceUser {
	message: IMessage
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

interface IUpdates {
	password?: string
	name?: string
	spends?: Types.ObjectId
}

interface IUserUC {
	name?: string | null
	id?: string | null
	password?: string | null
	email?: string | null
	spends?: Types.ObjectId | null
}

interface ISpendSC {
	category?: string | undefined
	currency?: string | undefined
	cost?: number | undefined
	comment?: string | undefined
	idArr?: Types.ObjectId[] | undefined
}

type TGetSpend = Promise<
	| {
			status: { success: boolean; message: string }
			spends: ISpendDocument[]
	  }
	| { status: { success: boolean; message: string }; spends?: undefined }
>

type TAddSpend = Promise<
	| { status: { success: boolean; message: string }; spends: ISpendDocument }
	| { status: { success: boolean; message: string }; spends?: undefined }
>
