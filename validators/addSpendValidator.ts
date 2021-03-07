export type IAddSpendValidator = (newSpend: IAddSpendValProps) => boolean;

export interface IAddSpendValProps {
    category?: string;
    comment?: string;
    cost?: number;
    currency?: string;
}

export const addSpendValidator: IAddSpendValidator = (
    newSpend: IAddSpendValProps
) => {
    return !newSpend.category || !newSpend.cost || !newSpend.currency;
};
