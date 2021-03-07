"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpValidator = void 0;
const signUpValidator = (signInData) => {
    return (!signInData.email ||
        !signInData.name ||
        !signInData.password ||
        !/^[^\s@]+@[^\s@]+$/.test(signInData.email));
};
exports.signUpValidator = signUpValidator;
//# sourceMappingURL=signUpValidator.js.map