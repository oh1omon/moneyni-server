import { Types, Document, Model } from 'mongoose';

export interface ISpend {
    _id: Types.ObjectId;
    category: string;
    comment: string;
    cost: number;
    currency: string;
}

export type ISpendDocument = ISpend & Document;

export interface ISpendModel extends Model<ISpendDocument> {}

//Interface for data coming from client side
export interface ISpendInput {
    category: ISpend['category'];
    comment?: ISpend['comment'];
    cost: ISpend['cost'];
    currency: ISpend['currency'];
}
