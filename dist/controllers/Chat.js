"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Chat_1 = __importDefault(require("../models/Chat"));
const insertMessage = async (req, res) => {
    const { body, receiver } = req.body;
    const { userId } = res.locals;
    const error = {
        successful: false,
        message: 'Server Error Please check your information',
        data: null
    };
    if (!body || !receiver)
        return res.status(404).send(error);
    try {
        const _id = new mongoose_1.default.Types.ObjectId();
        const newChat = new Chat_1.default({
            _id,
            sender: userId,
            receiver,
            body,
            time_created: new Date().getDate()
        });
        await newChat.save();
        const chat = await Chat_1.default.findOne({ _id: newChat._id }).populate('receiver', '_id fullName avatar_url')
            .populate('sender', '_id fullName avatar_url');
        const result = {
            successful: true,
            message: `Successfully created message`,
            data: chat
        };
        return res.status(200).json(result);
    }
    catch (e) {
        const error = {
            successful: false,
            message: e.message,
            data: null
        };
        return res.status(500).json(error);
    }
};
const getMessage = async (req, res) => {
    try {
        const { receiver } = req.query;
        const { userId } = res.locals;
        const messages = await Chat_1.default.find({
            $or: [{ $and: [{ receiver }, { sender: userId }] }, { $and: [{ receiver: userId }, { sender: receiver }] }]
        })
            .populate('receiver', '_id fullName avatar_url').populate('sender', '_id fullName avatar_url');
        return res.status(200).json({
            successful: true,
            message: 'Get Message Success',
            data: messages
        });
    }
    catch (e) {
        const error = {
            successful: false,
            message: e.message,
            data: null
        };
        return res.status(500).json(error);
    }
};
exports.default = { insertMessage, getMessage };
//# sourceMappingURL=Chat.js.map