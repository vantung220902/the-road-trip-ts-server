import mongoose from 'mongoose';
import Story, { IStoryModel } from '../models/Story';
import IResponse from './../types/ReturnType';
import { Response, Request } from 'express';
import cloudinaryImageUploadMethod from '../utils/coudinary';

const insert = async (req: Request, res: Response) => {
    const { title } = req.body;
    const { userId } = res.locals;
    const error: IResponse = {
        successful: false,
        message: 'Server Error Please check your information'
    };
    if (!req.file || !title) return res.status(404).send(error);
    try {
        const response:any = await cloudinaryImageUploadMethod(req.file.path);
        const image = response.res;
        const _id = new mongoose.Types.ObjectId();
        const newStory: IStoryModel = new Story({
            _id,
            title,
            userId,
            image,
            time_created: new Date().getDate()
        });
        await newStory.save();
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
const getStories = async (_req: Request, res: Response) => {
    try {
        const { userId } = res.locals;
        const array = <IStoryModel[]>[];
        const stories = <IStoryModel[]>await Story.find().populate('userId', '_id fullName avatar_url');
        stories.forEach((story) => {
            if (story.userId === userId) array.unshift(story);
            else array.push(story);
        });
        return res.status(200).json({
            successful: true,
            message: 'Get Story Success',
            data: array
        });
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};

export default { insert, getStories };
