"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//Sign Out Route
router.get('/', (req, res) => {
    req.logout();
    req.session.destroy(function (err) {
        if (!err) {
            res.status(200)
                .clearCookie('connect.sid', { path: '/' })
                .json({ status: 'Success' });
        }
        else {
            // handle error case...
            console.log(err);
        }
    });
});
exports.default = router;
//# sourceMappingURL=signOut.js.map