import mongoose from 'mongoose';
import Post, { IPostModel } from '../models/Post';
import IResponse from './../types/ReturnType';
import { Response, Request } from 'express';
import cloudinaryImageUploadMethod from '../utils/coudinary';
const error: IResponse = {
    successful: false,
    message: 'Server Error Please check your information'
};
const insertPost = async (req: Request, res: Response) => {
    const { title } = req.body;
    const { userId } = res.locals;
    if (!req.files || !title) return res.status(404).send(error);
    try {
        const image = [];
        const files = req.files as Express.Multer.File[];
        for (const file of files) {
            const { path } = file;
            const newPath: any = await cloudinaryImageUploadMethod(path);
            image.push(`${newPath.res};`);
        }

        const _id = new mongoose.Types.ObjectId();
        const newPost: IPostModel = new Post({
            _id,
            userId,
            title,
            image: image.join(''),
            rating: 0,
            time_created: new Date().getDate()
        });
        await newPost.save();
        const result: IResponse = {
            successful: true,
            message: `Successfully created post`
        };
        return res.status(200).json(result);
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};

const getPosts = async (req: Request, res: Response) => {
    try {
        const query = req.query.query;
        const paging = req.query.paging as string;
        const posts = query ? <IPostModel[]>await Post.find({
                  $and: [{ title: { $regex: query, $options: 'i' } }, { deleted: false }]
              })
                  .populate('userId', '_id fullName avatar_url address')
                  .limit(5)
                  .skip(5 * parseInt(paging, 10)) : <IPostModel[]>await Post.find({ deleted: false })
                  .populate('userId', '_id fullName avatar_url address')
                  .sort({ _id: -1 })
                  .limit(5)
                  .skip(5 * parseInt(paging, 10));
        return res.status(200).json({
            successful: true,
            message: 'Get Post Successfully',
            data: posts
        });
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
const getPostById = async (req: Request, res: Response) => {
    try {
        const { userId } = res.locals;
        const { query, deleted } = req.query;
        const check = deleted === 'false' ? false : true;
        const paging = req.query.paging as string;
        const posts = query ? <IPostModel[]>await Post.find({
                  $and: [{ userId: userId }, { title: { $regex: query, $options: 'i' } }, { deleted: check }]
              })
                  .populate('userId', '_id fullName avatar_url address')
                  .sort({ _id: -1 })
                  .limit(5)
                  .skip(5 * parseInt(paging, 10)) : <IPostModel[]>await Post.find({
                  $and: [{ userId: userId }, { deleted: check }]
              })
                  .populate('userId', '_id fullName avatar_url address')
                  .sort({ _id: -1 })
                  .limit(5)
                  .skip(5 * parseInt(paging, 10));
        return res.status(200).json({
            successful: true,
            message: 'Get Post Successfully',
            data: posts
        });
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
const getPostUser = async (req: Request, res: Response) => {
    try {
        const { _id } = req.query;
        const paging = req.query.paging as string;
        const posts = <IPostModel[]>await Post.find({
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
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
const softDelete = async (req: Request, res: Response) => {
    const { _id } = req.query;
    if (!_id) return res.status(404).send(error);
    try {
        await Post.updateOne({ _id }, { $set: { deleted: true } });
        return res.status(200).json({
            successful: true,
            message: 'Delete Post Successfully'
        });
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
const updatePost = async (req: Request, res: Response) => {
    const { title, postId } = req.body;

    if (!title || !req.file) return res.status(404).send(error);
    try {
        const response: any = await cloudinaryImageUploadMethod(req.file.path);
        const image = response.res;
        await Post.updateOne({ _id: postId }, { $set: { title, image } });
        return res.status(200).json({
            successful: true,
            message: 'Update Post Successfully'
        });
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
const deleted = async (req: Request, res: Response) => {
    try {
        const { _id } = req.query;
        if (!_id) return res.status(404).send(error);
        await Post.deleteOne({ _id });
        return res.status(200).json({
            successful: true,
            message: 'Deleted Post Successfully'
        });
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
const recovery = async (req: Request, res: Response) => {
    const { _id } = req.query;
    if (!_id) return res.status(404).send(error);
    try {
        await Post.updateOne({ _id }, { $set: { deleted: false } });
        return res.status(200).json({
            successful: true,
            message: 'Recovery Post Successfully'
        });
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
export default { insertPost, getPosts, getPostById, softDelete, updatePost, deleted, recovery, getPostUser };
