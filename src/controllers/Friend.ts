import mongoose from 'mongoose';
import Friend, { IFriendModel } from '../models/Friend';
import IResponse from './../types/ReturnType';
import { Response, Request } from 'express';

const checkStatusFriend = async (req: Request, res: Response) => {
    try {
        const { receiver } = req.query;
        const { userId } = res.locals;
        const friend = <IFriendModel>await Friend.findOne({
            $or: [
                { sender: userId, receiver },
                { receiver: userId, sender: receiver }
            ]
        });
        return res.status(200).json({
            successful: true,
            message: 'Get Status Friend Successfully',
            data: friend
        });
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
const actionFriend = async (req: Request, res: Response) => {
    try {
        const { receiver, id } = req.query;
        const { userId } = res.locals;
        const status = parseInt(req.query.status as string, 10);
        let message = '';
        switch (status) {
            case -1:
                const _id = new mongoose.Types.ObjectId();
                const newFriend: IFriendModel = new Friend({
                    _id,
                    receiver,
                    status: 0,
                    sender: userId as string
                });
                await newFriend.save();
                message = 'Send Inviting to Friend Successfully';
                break;
            case 0:
                await Friend.deleteOne({ $and: [{ sender: userId },{ receiver:receiver }]});
                message = 'Remove Inviting to Friend Successfully';
                break;
            case 1:
                await Friend.deleteOne({ _id: id });
                message = 'Delete Friend Successfully';
                break;
        }
        return res.status(200).json({
            successful: true,
            message: message
        });
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};

const getInvitations = async (_req: Request, res: Response) => {
    try {
        const { userId } = res.locals;
        const invitations = <IFriendModel[]>await Friend.find({
            $and: [{ receiver: userId }, { status:0 }]
        }).populate('sender', '_id fullName avatar_url address')
            .populate('receiver', '_id fullName avatar_url address');
        return res.status(200).json({
            successful: true,
            message: 'Get Inviting Successfully',
            data: invitations
        });
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
const getFriends = async (_req: Request, res: Response) => {
    try {
        const { userId } = res.locals;
        const invitations = <IFriendModel[]>await Friend.find({
            $and: [{ $or:[{receiver: userId},{sender: userId}] }, { status:1 }]
        }).populate('sender', '_id fullName avatar_url address')
            .populate('receiver', '_id fullName avatar_url address');
        return res.status(200).json({
            successful: true,
            message: 'Get Friends Successfully',
            data: invitations
        });
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
const actionInviting = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        const status = parseInt(req.query.status as string, 10);
        let message = '';
        switch (status) {
            case 0:
                await Friend.deleteOne({ _id: id });
                message = 'Delete Inviting Successfully';
                break;
            case 1:
                await Friend.updateOne({ _id: id }, { $set: { status: 1 } });
                message = 'Accept Friend Successfully';
                break;
        }
        return res.status(200).json({
            successful: true,
            message: message
        });
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
export default { checkStatusFriend, actionFriend, getInvitations, actionInviting, getFriends };
