"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../db/database");
const signUpValidator_1 = require("../validators/signUpValidator");
const router = express_1.default.Router();
//Sign Up Route
router.post('/', (req, res) => {
    const valRes = signUpValidator_1.signUpValidator(req.body);
    if (valRes)
        return res.json({ message: 'wrong data submitted' });
    database_1.createNewUser(req.body)
        .then((resp) => res.json({
        message: 'User created!',
        user: {
            _id: resp._id,
            email: resp.email,
            name: resp.email,
            spendings: resp.spendings,
        },
    }))
        .catch((err) => res.json(err));
});
exports.default = router;
//# sourceMappingURL=signUp.js.map