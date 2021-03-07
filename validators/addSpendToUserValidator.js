"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSpendToUserValidator = void 0;
const addSpendToUserValidator = (newSpend) => {
    return !newSpend.userId || !newSpend.newSpendId;
};
exports.addSpendToUserValidator = addSpendToUserValidator;
//# sourceMappingURL=addSpendToUserValidator.js.map