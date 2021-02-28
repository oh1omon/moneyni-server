"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const user_schema_1 = require("./user.schema");
exports.UserModel = mongoose_1.model('User', user_schema_1.UserSchema);
//# sourceMappingURL=user.model.js.map