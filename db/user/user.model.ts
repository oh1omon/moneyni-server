import { model } from 'mongoose';
import { UserSchema } from './user.schema';
import { IUserDocument } from './user.types';

export const UserModel = model<IUserDocument>('User', UserSchema);
