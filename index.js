"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const database_1 = require("./db/database");
const passport_1 = __importDefault(require("passport"));
const signUp_1 = __importDefault(require("./routes/signUp"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const signIn_1 = __importDefault(require("./routes/signIn"));
const path_1 = __importDefault(require("path"));
const signOut_1 = __importDefault(require("./routes/signOut"));
const addSpend_1 = __importDefault(require("./routes/addSpend"));
const getSpends_1 = __importDefault(require("./routes/getSpends"));
const authConfirm_1 = __importDefault(require("./routes/authConfirm"));
const addSpendToUser_1 = __importDefault(require("./routes/addSpendToUser"));
const MongoDBStore = connect_mongodb_session_1.default(express_session_1.default);
//Extracting PORT & HOST variables from .env file
const PORT = parseInt(process.env.PORT, 10);
const HOST = process.env.HOST;
//Connecting to MongoDB Atlas
database_1.connect();
//Initializing Express
const app = express_1.default();
app.use(cors_1.default());
//Bodyparser Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// //Adding flash
// app.use(flash());
//Initializing Express session
app.use(express_session_1.default({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoDBStore({
        uri: process.env.DB_CONNECT_LINK,
        collection: 'mySessions',
    }),
    cookie: { maxAge: 60 * 60 * 1000 * 24 },
}));
//Applying Passport middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
//Routes
// Only for testing
app.use(express_1.default.static(path_1.default.join(__dirname, 'build')));
//Auth Handlers
app.use('/api/signup', signUp_1.default);
app.use('/api/signin', signIn_1.default);
app.use('/api/signout', signOut_1.default);
app.use('/api/authconfirm', authConfirm_1.default);
//Adding, Getting Spends
app.use('/api/addspend', addSpend_1.default);
app.use('/api/getspends', getSpends_1.default);
app.use('/api/addspendtouser', addSpendToUser_1.default);
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'build/index.html'));
});
//Starting server
app.listen(PORT, HOST, () => {
    console.log(`server is listening on ${HOST}:${PORT}`);
});
//# sourceMappingURL=index.js.map