"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInValidator = void 0;
const signInValidator = (signInData) => {
    return (!signInData.email ||
        !signInData.password ||
        !/^[^\s@]+@[^\s@]+$/.test(signInData.email));
};
exports.signInValidator = signInValidator;
//# sourceMappingURL=signInValidator.js.map