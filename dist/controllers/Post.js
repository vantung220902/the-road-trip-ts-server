"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Post_1 = __importDefault(require("../models/Post"));
const coudinary_1 = __importDefault(require("../utils/coudinary"));
const error = {
    successful: false,
    message: 'Server Error Please check your information'
};
const insertPost = async (req, res) => {
    const { title } = req.body;
    const { userId } = res.locals;
    if (!req.files || !title)
        return res.status(404).send(error);
    try {
        const image = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await (0, coudinary_1.default)(path);
            image.push(`${newPath.res};`);
        }
        const _id = new mongoose_1.default.Types.ObjectId();
        const newPost = new Post_1.default({
            _id,
            userId,
            title,
            image: image.join(''),
            rating: 0,
            time_created: new Date().getDate()
        });
        await newPost.save();
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
const getPosts = async (req, res) => {
    try {
        const query = req.query.query;
        const paging = req.query.paging;
        const posts = query ? await Post_1.default.find({
            $and: [{ title: { $regex: query, $options: 'i' } }, { deleted: false }]
        })
            .populate('userId', '_id fullName avatar_url address')
            .limit(5)
            .skip(5 * parseInt(paging, 10)) : await Post_1.default.find({ deleted: false })
            .populate('userId', '_id fullName avatar_url address')
            .sort({ _id: -1 })
            .limit(5)
            .skip(5 * parseInt(paging, 10));
        return res.status(200).json({
            successful: true,
            message: 'Get Post Successfully',
            data: posts
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
const getPostById = async (req, res) => {
    try {
        const { userId } = res.locals;
        const { query, deleted } = req.query;
        const check = deleted === 'false' ? false : true;
        const paging = req.query.paging;
        const posts = query ? await Post_1.default.find({
            $and: [{ userId: userId }, { title: { $regex: query, $options: 'i' } }, { deleted: check }]
        })
            .populate('userId', '_id fullName avatar_url address')
            .limit(5)
            .skip(5 * parseInt(paging, 10)) : await Post_1.default.find({
            $and: [{ userId: userId }, { deleted: check }]
        })
            .populate('userId', '_id fullName avatar_url address')
            .limit(5)
            .skip(5 * parseInt(paging, 10));
        return res.status(200).json({
            successful: true,
            message: 'Get Post Successfully',
            data: posts
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
const getPostUser = async (req, res) => {
    try {
        const { _id } = req.query;
        const paging = req.query.paging;
        const posts = await Post_1.default.find({
            $and: [{ userId: _id }, { deleted: false }]
        })
            .populate('userId', '_id fullName avatar_url address')
            .limit(5)
            .skip(5 * parseInt(paging, 10));
        return res.status(200).json({
            successful: true,
            message: 'Get Post Successfully',
            data: posts
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
const softDelete = async (req, res) => {
    const { _id } = req.query;
    if (!_id)
        return res.status(404).send(error);
    try {
        await Post_1.default.updateOne({ _id }, { $set: { deleted: true } });
        return res.status(200).json({
            successful: true,
            message: 'Delete Post Successfully'
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
const updatePost = async (req, res) => {
    const { title, postId } = req.body;
    if (!title || !req.file)
        return res.status(404).send(error);
    try {
        const response = await (0, coudinary_1.default)(req.file.path);
        const image = response.res;
        await Post_1.default.updateOne({ _id: postId }, { $set: { title, image } });
        return res.status(200).json({
            successful: true,
            message: 'Update Post Successfully'
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
const deleted = async (req, res) => {
    try {
        const { _id } = req.query;
        if (!_id)
            return res.status(404).send(error);
        console.log(_id);
        await Post_1.default.deleteMany();
        return res.status(200).json({
            successful: true,
            message: 'Deleted Post Successfully'
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
const recovery = async (req, res) => {
    const { _id } = req.query;
    if (!_id)
        return res.status(404).send(error);
    try {
        await Post_1.default.updateOne({ _id }, { $set: { deleted: false } });
        return res.status(200).json({
            successful: true,
            message: 'Recovery Post Successfully'
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
exports.default = { insertPost, getPosts, getPostById, softDelete, updatePost, deleted, recovery, getPostUser };
//# sourceMappingURL=Post.js.map