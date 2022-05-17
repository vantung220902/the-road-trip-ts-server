"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Friend_1 = __importDefault(require("../models/Friend"));
const checkStatusFriend = async (req, res) => {
    try {
        const { receiver } = req.query;
        const { userId } = res.locals;
        const friend = await Friend_1.default.findOne({
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
    }
    catch (e) {
        const error = {
            successful: false,
            message: e.message
        };
        return res.status(500).json(error);
    }
};
const actionFriend = async (req, res) => {
    try {
        const { receiver, id } = req.query;
        const { userId } = res.locals;
        const status = parseInt(req.query.status, 10);
        let message = '';
        switch (status) {
            case -1:
                const _id = new mongoose_1.default.Types.ObjectId();
                const newFriend = new Friend_1.default({
                    _id,
                    receiver,
                    status: 0,
                    sender: userId
                });
                await newFriend.save();
                message = 'Send Inviting to Friend Successfully';
                break;
            case 0:
                await Friend_1.default.deleteOne({ $and: [{ sender: userId }, { receiver: receiver }] });
                message = 'Remove Inviting to Friend Successfully';
                break;
            case 1:
                await Friend_1.default.deleteOne({ _id: id });
                message = 'Delete Friend Successfully';
                break;
        }
        return res.status(200).json({
            successful: true,
            message: message
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
const getInvitations = async (_req, res) => {
    try {
        const { userId } = res.locals;
        const invitations = await Friend_1.default.find({
            $and: [{ receiver: userId }, { status: 0 }]
        }).populate('sender', '_id fullName avatar_url address')
            .populate('receiver', '_id fullName avatar_url address');
        return res.status(200).json({
            successful: true,
            message: 'Get Inviting Successfully',
            data: invitations
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
const getFriends = async (_req, res) => {
    try {
        const { userId } = res.locals;
        const invitations = await Friend_1.default.find({
            $and: [{ $or: [{ receiver: userId }, { sender: userId }] }, { status: 1 }]
        }).populate('sender', '_id fullName avatar_url address')
            .populate('receiver', '_id fullName avatar_url address');
        return res.status(200).json({
            successful: true,
            message: 'Get Friends Successfully',
            data: invitations
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
const actionInviting = async (req, res) => {
    try {
        const { id } = req.query;
        const status = parseInt(req.query.status, 10);
        let message = '';
        switch (status) {
            case 0:
                await Friend_1.default.deleteOne({ _id: id });
                message = 'Delete Inviting Successfully';
                break;
            case 1:
                await Friend_1.default.updateOne({ _id: id }, { $set: { status: 1 } });
                message = 'Accept Friend Successfully';
                break;
        }
        return res.status(200).json({
            successful: true,
            message: message
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
exports.default = { checkStatusFriend, actionFriend, getInvitations, actionInviting, getFriends };
//# sourceMappingURL=Friend.js.map