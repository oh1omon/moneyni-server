"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getSpendsValidator_1 = require("../validators/getSpendsValidator");
const database_1 = require("../db/database");
const router = express_1.default.Router();
//Route for getting all spends
router.post('/', (req, res) => {
    const valRes = getSpendsValidator_1.getSpendsValidator(req.body.spends);
    if (valRes)
        return res.json({ message: 'wrong spendArr submitted' });
    database_1.getSpendsById(req.body.spends)
        .then((resp) => res.json({
        message: 'Spends found: ',
        spends: resp,
    }))
        .catch((err) => res.json(err));
});
exports.default = router;
//# sourceMappingURL=getSpends.js.map