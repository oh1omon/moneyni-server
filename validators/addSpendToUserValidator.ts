import { Types } from 'mongoose';

export type IAddSpendToUserValidator = (
    newSpend: IAddSpendToUserValProps
) => boolean;

export interface IAddSpendToUserValProps {
    userId: Types.ObjectId;
    newSpendId: Types.ObjectId;
}

export const addSpendToUserValidator: IAddSpendToUserValidator = (
    newSpend: IAddSpendToUserValProps
) => {
    return !newSpend.userId || !newSpend.newSpendId;
};
