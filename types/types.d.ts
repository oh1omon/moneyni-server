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
	balance: {
		current: number
		spent: number
		income: number
	}
	spends: [] | Types.ObjectId[]
	months: { month: number; id: Types.ObjectId }[]
}

type IUserDocument = IUser & Document

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

// Interface for Month schema

interface IMonth {
	_id: Types.ObjectId
	owner: Types.ObjectId
	month: number
	spends: Types.ObjectId[]
	balance: {
		current: number
		spent: number
		income: number
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

//UserService

interface IUserUC {
	name?: string | null
	id?: string | null
	password?: string | null
	email?: string | null
	spends?: Types.ObjectId | null
	balance?: {
		current: number
		spent: number
		income: number
	}
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
	balance?: {
		current: number
		spent: number
		income: number
	}
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

type TJobs = {
	interval: string
	cb: () => void
}[]
