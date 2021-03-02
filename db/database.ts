import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, IUserDocument, IUserInput } from './user/user.types';
import { UserModel } from './user/user.model';

export let database: mongoose.Connection;

export const connect = () => {
    const uri = process.env.DB_CONNECT_LINK;

    if (database) {
        return;
    }

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    database = mongoose.connection;

    database.once('open', async () => {
        console.log('Connected to database');
    });

    database.on('error', () => {
        console.log('Error connecting to database');
    });
};

/**
 * @param {IUserInput} newUser object, containing fields of email, password, name
 * @return either error message or new User Object
 * */
export const createNewUser = async (
    newUser: IUserInput
): Promise<IUserDocument> => {
    return new Promise(async (resolve, reject) => {
        //Checking if all data is presented to registration
        if (!newUser) {
            reject('Please insert data!');
            return;
        }
        //Checking if there is an user with such email
        const foundUser = await UserModel.findOne({ email: newUser.email });
        if (foundUser) {
            reject('There are an account with such email already');
            return;
        }
        //Hashing password
        const hashedPassword: string = await bcrypt.hash(newUser.password, 10);
        //Create new USer
        const injectedUser: IUserDocument = await UserModel.create({
            _id: new mongoose.Types.ObjectId(),
            email: newUser.email,
            password: hashedPassword,
            name: newUser.name,
            spendings: [],
        });
        //Working with the result
        injectedUser
            ? resolve(injectedUser)
            : reject('Something went wrong...');
    });
};

export const getUserByEmail = async (
    email: string
): Promise<IUserDocument | undefined> => {
    return new Promise(async (resolve, reject) => {
        if (!email) {
            reject('No email provided');
            return;
        }
        UserModel.findOne(
            { email },
            (err: Error, data: IUserDocument | null) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    resolve(data);
                }
            }
        );
    });
};

export const getUserById = async (
    id: string
): Promise<IUserDocument | undefined> => {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            reject('No id provided');
            return;
        }
        UserModel.findOne(
            { _id: id },
            (err: Error, data: IUserDocument | null) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    resolve(data);
                }
            }
        );
    });
};
// export const disconnect = () => {
//     if (!database) {
//         return;
//     }
//     mongoose.disconnect();
// };
