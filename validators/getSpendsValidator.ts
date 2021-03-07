import { Types } from 'mongoose';

export type IGetSpendsValidator = (newSpend: IGetSpendsValProps) => boolean;

export type IGetSpendsValProps = Types.ObjectId[];

export const getSpendsValidator: IGetSpendsValidator = (
    spends: IGetSpendsValProps
) => {
    return !Array.isArray(spends);
};
