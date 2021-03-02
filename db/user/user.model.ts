import { model } from 'mongoose';
import { UserSchema } from './user.schema';
import { IDayModel, IUserDocument } from './user.types';

export const UserModel: IDayModel = model<IUserDocument>('User', UserSchema);
