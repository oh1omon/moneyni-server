"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//Route for confirming or not user's authentication
router.get('/', (req, res) => {
    res.json({ user: req.user });
});
exports.default = router;
//# sourceMappingURL=authConfirm.js.map