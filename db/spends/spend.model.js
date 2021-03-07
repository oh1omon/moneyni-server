"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpendModel = void 0;
const mongoose_1 = require("mongoose");
const spend_schema_1 = require("./spend.schema");
exports.SpendModel = mongoose_1.model('Spend', spend_schema_1.spendSchema);
//# sourceMappingURL=spend.model.js.map