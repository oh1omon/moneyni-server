"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUserByEmail = exports.createNewUser = exports.connect = exports.database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("./user/user.model");
const connect = () => {
    const uri = process.env.DB_CONNECT_LINK;
    if (exports.database) {
        return;
    }
    mongoose_1.default.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    exports.database = mongoose_1.default.connection;
    exports.database.once('open', async () => {
        console.log('Connected to database');
    });
    exports.database.on('error', () => {
        console.log('Error connecting to database');
    });
};
exports.connect = connect;
/**
 * @param {IUserInput} newUser object, containing fields of email, password, name
 * @return either error message or new User Object
 * */
const createNewUser = async (newUser) => {
    return new Promise(async (resolve, reject) => {
        //Checking if all data is presented to registration
        if (!newUser) {
            reject('Please insert data!');
            return;
        }
        //Checking if there is an user with such email
        const foundUser = await user_model_1.UserModel.findOne({ email: newUser.email });
        if (foundUser) {
            reject('There are an account with such email already');
            return;
        }
        //Hashing password
        const hashedPassword = await bcrypt_1.default.hash(newUser.password, 10);
        //Create new USer
        const injectedUser = await user_model_1.UserModel.create({
            _id: new mongoose_1.default.Types.ObjectId(),
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
exports.createNewUser = createNewUser;
const getUserByEmail = async (email) => {
    return new Promise(async (resolve, reject) => {
        if (!email) {
            reject('No email provided');
            return;
        }
        user_model_1.UserModel.findOne({ email }, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(data);
            }
        });
    });
};
exports.getUserByEmail = getUserByEmail;
const getUserById = async (id) => {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            reject('No id provided');
            return;
        }
        user_model_1.UserModel.findOne({ _id: id }, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(data);
            }
        });
    });
};
exports.getUserById = getUserById;
// export const disconnect = () => {
//     if (!database) {
//         return;
//     }
//     mongoose.disconnect();
// };
//# sourceMappingURL=database.js.map