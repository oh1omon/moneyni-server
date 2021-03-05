"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_config_1 = require("../passport/passport.config");
const passport_1 = __importDefault(require("passport"));
const database_1 = require("../db/database");
const router = express_1.default.Router();
passport_config_1.initializePassport(passport_1.default, database_1.getUserByEmail, database_1.getUserById);
//Sign In Route
router.post('/', (req, res) => {
    passport_1.default.authenticate('local', function (err, user, info) {
        if (err) {
            return res.json({ message: err.message });
        }
        if (!user) {
            return res.json({ message: 'user not found' });
        }
        req.login(user, function (err) {
            if (err) {
                return res.json({ message: 'internal error' });
            }
            return res.json({
                message: 'authenticated',
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    spendings: user.spendings,
                },
            });
        });
    })(req, res);
}
// passport.authenticate('local', {
//     successMessage: true,
//     failureMessage: true,
//     failureFlash: true,
// }),
// function (req: any, res: Response) {
//     res.json({ email: req.user.email });
// }
);
exports.default = router;
//# sourceMappingURL=signIn.js.map