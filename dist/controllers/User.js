"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const argon2_1 = __importDefault(require("argon2"));
const auth_1 = require("../utils/auth");
const Logging_1 = __importDefault(require("./../utils/Logging"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const jsonwebtoken_1 = require("jsonwebtoken");
const coudinary_1 = __importDefault(require("../utils/coudinary"));
const registerUser = async (req, res) => {
    const { email, password, fullName } = req.body;
    try {
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            const error = {
                successful: false,
                message: `Duplicated email address`
            };
            return res.status(400).json(error);
        }
        const hashPassword = await argon2_1.default.hash(password);
        const _id = new mongoose_1.default.Types.ObjectId();
        const refresh_token = (0, auth_1.createToken)('refreshToken', _id);
        const newUser = new User_1.default({
            _id,
            email,
            password: hashPassword,
            refresh_token,
            avatar_url: 'https://res.cloudinary.com/the-roap-trip/image/upload/v1646812864/ge7swjvap6co5wapeoye.png',
            fullName,
            address: 'Your address'
        });
        await newUser.save();
        const result = {
            successful: true,
            message: `Create User Successfully`
        };
        return res.status(200).json(result);
    }
    catch (e) {
        Logging_1.default.error(e);
        const error = {
            successful: false,
            message: `Duplicated email address`
        };
        return res.status(400).json(error);
    }
};
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User_1.default.findOne({ email });
        const error = {
            successful: false,
            message: 'Email or password is incorrect'
        };
        if (!existingUser)
            return res.status(400).json(error);
        const isPassword = await argon2_1.default.verify(existingUser.password, password);
        if (!isPassword)
            return res.json(error);
        const accessToken = (0, auth_1.createToken)('accessToken', existingUser._id, existingUser.tokenVersion);
        const decoded = (0, jwt_decode_1.default)(accessToken);
        (0, auth_1.sendRefreshToken)(res, existingUser);
        const response = {
            successful: true,
            message: 'Login successful',
            accessToken,
            refreshToken: (0, auth_1.createToken)('refreshToken', existingUser._id, existingUser.tokenVersion),
            email,
            fullName: existingUser.fullName,
            address: existingUser.address,
            avatar_url: existingUser.avatar_url,
            _id: existingUser._id,
            exp: decoded.exp,
            iat: decoded.iat
        };
        return res.status(200).json(response);
    }
    catch (e) {
        Logging_1.default.error(e);
        const error = {
            successful: false,
            message: `Server error: ${e.message}`
        };
        return res.status(400).json(error);
    }
};
const refreshToken = async (req, res) => {
    const refreshToken = req.query.refreshToken;
    if (!refreshToken)
        return res.sendStatus(401);
    try {
        const decodedUser = (0, jsonwebtoken_1.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const existingUser = await User_1.default.findById(decodedUser.userId);
        if (!existingUser || existingUser.tokenVersion !== decodedUser.tokenVersion)
            return res.sendStatus(401);
        (0, auth_1.sendRefreshToken)(res, existingUser);
        return res.json({
            success: true,
            message: 'Refresh token error',
            accessToken: (0, auth_1.createToken)('accessToken', existingUser._id, existingUser.tokenVersion)
        });
    }
    catch (error) {
        console.log('Error refreshToken', error);
        return res.sendStatus(403);
    }
};
const updateUser = async (req, res) => {
    const { fullName, address } = req.body;
    const error = {
        successful: false,
        message: 'Server Error Please check your information'
    };
    if (!fullName || !address || !req.file)
        return res.status(404).send(error);
    try {
        const response = await (0, coudinary_1.default)(req.file.path);
        const { userId } = res.locals;
        const avatar_url = response.res;
        const authorHeader = req.header('Authorization');
        const accessToken = authorHeader && authorHeader.split(' ')[1];
        const decoded = (0, jwt_decode_1.default)(accessToken);
        const user = await User_1.default.findOneAndUpdate({ userId: userId }, {
            $set: { avatar_url, fullName, address }
        }).select({ password: 0, tokenVersion: 0, createdAt: 0, updatedAt: 0 });
        if (user) {
            const result = {
                successful: true,
                message: `Successfully update user`,
                data: {
                    accessToken: accessToken ? accessToken : null,
                    refreshToken: user.refresh_token,
                    email: user.email,
                    fullName: user.fullName,
                    address: user.address,
                    avatar_url: user.avatar_url,
                    exp: decoded.exp,
                    iat: decoded.iat
                }
            };
            return res.status(200).json(result);
        }
        return res.status(404).json(error);
    }
    catch (e) {
        Logging_1.default.error(e);
        const error = {
            successful: false,
            message: `Server error: ${e.message}`
        };
        return res.status(400).json(error);
    }
};
exports.default = { registerUser, login, refreshToken, updateUser };
//# sourceMappingURL=User.js.map