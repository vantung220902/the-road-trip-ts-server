"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../controllers/User"));
const uploadFile_1 = __importDefault(require("./../middleware/uploadFile"));
const { registerUser, login, refreshToken, updateUser } = User_1.default;
const routes = (0, express_1.Router)();
routes.post('/register', registerUser);
routes.post('/login', login);
routes.get('/refresh', refreshToken);
routes.put('/update', uploadFile_1.default.single('image'), updateUser);
exports.default = routes;
//# sourceMappingURL=users.js.map