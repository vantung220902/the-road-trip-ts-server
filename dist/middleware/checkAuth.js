"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const checkAuth = (req, res, next) => {
    try {
        const authorHeader = req.header('Authorization');
        const accessToken = authorHeader && authorHeader.split(' ')[1];
        const error = {
            successful: false,
            message: 'Access Token is required'
        };
        if (!accessToken)
            return res.status(400).json({ error });
        const decodedUser = (0, jsonwebtoken_1.verify)(accessToken, process.env.ACCESS_TOKEN_SECRET);
        res.locals.userId = decodedUser.userId;
        return next();
    }
    catch (e) {
        const error = {
            successful: false,
            message: 'Error Server '
        };
        return res.status(400).json(error);
    }
};
exports.checkAuth = checkAuth;
//# sourceMappingURL=checkAuth.js.map