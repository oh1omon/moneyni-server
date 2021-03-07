export type ISignInValidator = (signInData: ISignInValProps) => boolean;

export interface ISignInValProps {
    email?: string;
    password?: string;
}

export const signInValidator: ISignInValidator = (
    signInData: ISignInValProps
) => {
    return (
        !signInData.email ||
        !signInData.password ||
        !/^[^\s@]+@[^\s@]+$/.test(signInData.email)
    );
};
