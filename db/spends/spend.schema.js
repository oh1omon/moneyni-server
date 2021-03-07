"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spendSchema = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
exports.spendSchema = new mongoose_1.Schema({
    _id: mongoose_2.default.Schema.Types.ObjectId,
    category: String,
    comment: String,
    cost: Number,
    currency: String,
});
//# sourceMappingURL=spend.schema.js.map