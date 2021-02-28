import mongoose from 'mongoose';
import { IUser, IUserInput } from './user/user.types';
import { UserModel } from './user/user.model';

let database: mongoose.Connection;

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

export const createNewUser = async (newUser: IUserInput): Promise<IUser> => {
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
        //Create new USer
        const injectedUser: IUser = await UserModel.create({
            _id: new mongoose.Types.ObjectId(),
            email: newUser.email,
            password: newUser.password,
            name: newUser.name,
            spendings: [],
        });
        //Working with the result
        injectedUser
            ? resolve(injectedUser)
            : reject('Something went wrong...');
    });
};

// export const disconnect = () => {
//     if (!database) {
//         return;
//     }
//     mongoose.disconnect();
// };
