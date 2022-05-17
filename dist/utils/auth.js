"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createToken = (type, id, tokenVersion = 0) => (0, jsonwebtoken_1.sign)(Object.assign({ userId: id }, (type === 'refreshToken' ? { tokenVersion } : {})), type === 'accessToken' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: type === 'accessToken' ? '2h' : '60h'
});
exports.createToken = createToken;
const sendRefreshToken = (res, user) => {
    res.cookie(process.env.REFRESH_TOKEN_SECRET, (0, exports.createToken)('refreshToken', user._id, user.tokenVersion), {
        secure: true,
        sameSite: 'lax',
        path: '/refresh_token'
    });
};
exports.sendRefreshToken = sendRefreshToken;
//# sourceMappingURL=auth.js.map