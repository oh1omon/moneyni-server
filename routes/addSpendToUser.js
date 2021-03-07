"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addSpendToUserValidator_1 = require("../validators/addSpendToUserValidator");
const database_1 = require("../db/database");
const router = express_1.default.Router();
//Route for adding new spend
router.post('/', (req, res) => {
    if (!req.user)
        return res.json({ message: 'you have to be authenticated' });
    const valRes = addSpendToUserValidator_1.addSpendToUserValidator({
        userId: req.user._id,
        newSpendId: req.body.newSpendId,
    });
    if (valRes) {
        return res.json({ message: 'something got wrong' });
    }
    database_1.addNewSpendToUser(req.user._id, req.body.newSpendId)
        .then((resp) => res.json({ message: 'user updated', user: resp }))
        .catch((err) => res.json(err));
});
exports.default = router;
//# sourceMappingURL=addSpendToUser.js.map