"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Payment_1 = __importDefault(require("../models/Payment"));
const User_1 = __importDefault(require("../models/User"));
const Ticket_1 = __importDefault(require("../models/Ticket"));
const argon2_1 = __importDefault(require("argon2"));
const insertPayment = async (req, res) => {
    const { sum, number, password, ticket } = req.body;
    const { userId } = res.locals;
    const error = {
        successful: false,
        message: 'Server Error Please check your information',
        data: null
    };
    if (!sum || !number || !password || !ticket)
        return res.status(404).send(error);
    try {
        const existingUser = await User_1.default.findOne({ _id: userId });
        if (!existingUser)
            return res.status(400).json(error);
        const isPassword = await argon2_1.default.verify(existingUser.password, password);
        if (!isPassword)
            return res.json(Object.assign(Object.assign({}, error), { message: 'Password incorrect, Please check your password' }));
        const _id = new mongoose_1.default.Types.ObjectId();
        const newPayment = new Payment_1.default({
            _id,
            number: number,
            sum: sum,
            ticket,
            userId
        });
        await newPayment.save();
        const itemTicket = await Ticket_1.default.findOne({ _id: ticket });
        await Ticket_1.default.updateOne({ _id: ticket }, { rest: itemTicket.rest - number });
        const chat = await Payment_1.default.findOne({ _id: newPayment._id }).populate('ticket', '_id name').populate('userId', '_id fullName avatar_url');
        const result = {
            successful: true,
            message: `Created Payment Successfully `,
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
const getPayments = async (req, res) => {
    try {
        const { userId } = res.locals;
        const { paging } = req.query;
        const payments = await Payment_1.default.find({ userId })
            .populate('ticket', '_id name address date image')
            .populate('userId', 'avatar_url fullName')
            .sort({ _id: -1 })
            .limit(10)
            .skip(10 * parseInt(paging, 10));
        return res.status(200).json({
            successful: true,
            message: 'Get Payment Success',
            data: payments
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
exports.default = { insertPayment, getPayments };
//# sourceMappingURL=Payment.js.map