import { ISpendDocument, ISpendModel } from './spend.types';
import { model } from 'mongoose';
import { spendSchema } from './spend.schema';

export const SpendModel: ISpendModel = model<ISpendDocument>(
    'Spend',
    spendSchema
);
