import { Model, Document, Types } from 'mongoose';

export interface IUser {
    _id: Types.ObjectId;
    email: string;
    password: string;
    name: string;
    spendings: [] | string[];
}

// export interface IDayDocument extends IDay, Document {}
export type IUserDocument = IUser & Document;

export interface IDayModel extends Model<IUserDocument> {}

export interface IUserInput {
    email?: IUser['email'];
    password?: IUser['password'];
    name?: IUser['name'];
}
