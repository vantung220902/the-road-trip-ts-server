import mongoose from 'mongoose';
import Chat, { IChatModel } from '../models/Chat';
import Logging from '../utils/Logging';
import { ICommentReturn } from './../types/Comment/CommentType';
import { Response, Request } from 'express';
const insertMessage = async (req: Request, res: Response) => {
    const { body, receiver } = req.body;
    const { userId } = res.locals;
    const error = {
        successful: false,
        message: 'Server Error Please check your information',
        data: null
    };
    if (!body || !receiver) return res.status(404).send(error);
    try {
        const _id = new mongoose.Types.ObjectId();
        const newChat: IChatModel = new Chat({
            _id,
            sender: userId,
            receiver,
            body,
            time_created: new Date().getDate()
        });
        await newChat.save();
        Logging.info('Create Message Successfully');
        const chat = <IChatModel>await Chat.findOne({ _id: newChat._id }).populate('receiver', '_id fullName avatar_url')
            .populate('sender', '_id fullName avatar_url');
        const result = {
            successful: true,
            message: `Successfully created message`,
            data: chat
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
const getMessage = async (req: Request, res: Response) => {
    try {
        const { receiver } = req.query;
        const { userId } = res.locals;
        const messages = <IChatModel[]>await Chat.find({
            $or: [{ $and: [{ receiver }, { sender: userId }] }, { $and: [{ receiver: userId }, { sender: receiver }] }]
        })
            .populate('receiver', '_id fullName avatar_url').populate('sender','_id fullName avatar_url')
        return res.status(200).json({
            successful: true,
            message: 'Get Message Success',
            data: messages
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

export default { insertMessage, getMessage };
