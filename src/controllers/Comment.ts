import mongoose from 'mongoose';
import Comment, { ICommentModel } from '../models/Comments';
import Logging from '../utils/Logging';
import { ICommentReturn } from './../types/Comment/CommentType';
import { Response, Request } from 'express';
const insertComment = async (req: Request, res: Response) => {
    const { body, postId } = req.body;
    const { userId } = res.locals;
    const error: ICommentReturn = {
        successful: false,
        message: 'Server Error Please check your information',
        data: null
    };
    if (!body || !postId) return res.status(404).send(error);
    try {
        const _id = new mongoose.Types.ObjectId();
        const newComment: ICommentModel = new Comment({
            _id,
            userId,
            postId,
            body,
            time_created: new Date().getDate()
        });
        await newComment.save();
        Logging.info('Create Comment Successfully');
        const comment = <ICommentModel>await Comment.findOne({ _id: newComment._id })
            .populate('userId', '_id fullName avatar_url');
        const result: ICommentReturn = {
            successful: true,
            message: `Successfully created comment`,
            data: comment
        };
        return res.status(200).json(result);
    } catch (e) {
        const error: ICommentReturn = {
            successful: false,
            message: e.message,
            data: null
        };
        Logging.error(error);
        return res.status(500).json(error);
    }
};
const getComments = async (req: Request, res: Response) => {
    try {
        const { postId } = req.query;
        const comments = <ICommentModel[]>await Comment.find({ postId:postId }).populate('userId', '_id fullName avatar_url');
        return res.status(200).json({
            successful: true,
            message: 'Get Comments Success',
            data: comments
        });
    } catch (e) {
        const error: ICommentReturn = {
            successful: false,
            message: e.message,
            data: null
        };
        Logging.error(error);
        return res.status(500).json(error);
    }
};

export default { insertComment, getComments };
