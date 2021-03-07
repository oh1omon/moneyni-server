"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addSpendValidator_1 = require("../validators/addSpendValidator");
const database_1 = require("../db/database");
const router = express_1.default.Router();
//Route for adding new spend
router.post('/', (req, res) => {
    const valRes = addSpendValidator_1.addSpendValidator(req.body);
    if (valRes)
        return res.json({ message: 'wrong spend submitted' });
    database_1.addNewSpend(req.body)
        .then((resp) => res.json({
        message: 'Spend added',
        spend: resp,
    }))
        .catch((err) => res.json(err));
});
exports.default = router;
//# sourceMappingURL=addSpend.js.map