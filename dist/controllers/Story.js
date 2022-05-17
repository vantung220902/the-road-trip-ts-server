"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Story_1 = __importDefault(require("../models/Story"));
const coudinary_1 = __importDefault(require("../utils/coudinary"));
const insert = async (req, res) => {
    const { title } = req.body;
    const { userId } = res.locals;
    const error = {
        successful: false,
        message: 'Server Error Please check your information'
    };
    if (!req.file || !title)
        return res.status(404).send(error);
    try {
        const response = await (0, coudinary_1.default)(req.file.path);
        const image = response.res;
        const _id = new mongoose_1.default.Types.ObjectId();
        const newStory = new Story_1.default({
            _id,
            title,
            userId,
            image,
            time_created: new Date().getDate()
        });
        await newStory.save();
        const result = {
            successful: true,
            message: `Successfully created post`
        };
        return res.status(200).json(result);
    }
    catch (e) {
        const error = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
const getStories = async (_req, res) => {
    try {
        const { userId } = res.locals;
        const array = [];
        const stories = await Story_1.default.find().populate('userId', '_id fullName avatar_url');
        stories.forEach((story) => {
            if (story.userId === userId)
                array.unshift(story);
            else
                array.push(story);
        });
        return res.status(200).json({
            successful: true,
            message: 'Get Story Success',
            data: array
        });
    }
    catch (e) {
        const error = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
exports.default = { insert, getStories };
//# sourceMappingURL=Story.js.map