import { ISignInValProps } from './signInValidator';

export type ISignUpValidator = (signUpData: ISignUpValProps) => boolean;

export interface ISignUpValProps extends ISignInValProps {
    name?: string;
}

export const signUpValidator: ISignUpValidator = (
    signInData: ISignUpValProps
) => {
    return (
        !signInData.email ||
        !signInData.name ||
        !signInData.password ||
        !/^[^\s@]+@[^\s@]+$/.test(signInData.email)
    );
};
