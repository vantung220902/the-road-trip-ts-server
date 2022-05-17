"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Comments_1 = __importDefault(require("../models/Comments"));
const insertComment = async (req, res) => {
    const { body, postId } = req.body;
    const { userId } = res.locals;
    const error = {
        successful: false,
        message: 'Server Error Please check your information',
        data: null
    };
    if (!body || !postId)
        return res.status(404).send(error);
    try {
        const _id = new mongoose_1.default.Types.ObjectId();
        const newComment = new Comments_1.default({
            _id,
            userId,
            postId,
            body,
            time_created: new Date().getDate()
        });
        await newComment.save();
        const comment = await Comments_1.default.findOne({ _id: newComment._id })
            .populate('userId', '_id fullName avatar_url');
        const result = {
            successful: true,
            message: `Successfully created comment`,
            data: comment
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
const getComments = async (req, res) => {
    try {
        const { postId } = req.query;
        const comments = await Comments_1.default.find({ postId: postId }).populate('userId', '_id fullName avatar_url');
        return res.status(200).json({
            successful: true,
            message: 'Get Comments Success',
            data: comments
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
exports.default = { insertComment, getComments };
//# sourceMappingURL=Comment.js.map