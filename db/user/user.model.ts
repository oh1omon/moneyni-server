import { model } from 'mongoose';
import { UserSchema } from './user.schema';
import { IUserModel, IUserDocument } from './user.types';

export const UserModel: IUserModel = model<IUserDocument>('User', UserSchema);
