import { Model, Document, Types } from 'mongoose';

export interface IUser {
    _id: Types.ObjectId;
    email: string;
    password: string;
    name: string;
    spendings: [] | string[];
}

export type IUserDocument = IUser & Document;

export interface IDayModel extends Model<IUserDocument> {}

//Interface for data coming from client side
export interface IUserInput {
    email?: IUser['email'];
    password?: IUser['password'];
    name?: IUser['name'];
}
