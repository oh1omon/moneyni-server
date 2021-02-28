"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewUser = exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("./user/user.model");
let database;
const connect = () => {
    const uri = process.env.DB_CONNECT_LINK;
    if (database) {
        return;
    }
    mongoose_1.default.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    database = mongoose_1.default.connection;
    database.once('open', async () => {
        console.log('Connected to database');
    });
    database.on('error', () => {
        console.log('Error connecting to database');
    });
};
exports.connect = connect;
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
        //Create new USer
        const injectedUser = await user_model_1.UserModel.create({
            _id: new mongoose_1.default.Types.ObjectId(),
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
exports.createNewUser = createNewUser;
// export const disconnect = () => {
//     if (!database) {
//         return;
//     }
//     mongoose.disconnect();
// };
//# sourceMappingURL=database.js.map