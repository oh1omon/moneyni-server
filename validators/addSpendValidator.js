"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSpendValidator = void 0;
const addSpendValidator = (newSpend) => {
    return !newSpend.category || !newSpend.cost || !newSpend.currency;
};
exports.addSpendValidator = addSpendValidator;
//# sourceMappingURL=addSpendValidator.js.map