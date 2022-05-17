"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Ticket_1 = __importDefault(require("../models/Ticket"));
const coudinary_1 = __importDefault(require("../utils/coudinary"));
const error = {
    successful: false,
    message: 'Server Error Please check your information'
};
const insertTicket = async (req, res) => {
    const { name, price, address, date, rest, description } = req.body;
    const { userId } = res.locals;
    if (!req.files || !name || !price || !address || !date || !rest || !description)
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
        const newTicket = new Ticket_1.default({
            _id,
            author: userId,
            name,
            image: image.join(''),
            rest: rest,
            address,
            price: price,
            date,
            description
        });
        await newTicket.save();
        const result = {
            successful: true,
            message: `Successfully created ticket`
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
const getTickets = async (req, res) => {
    try {
        const query = req.query.query;
        const paging = req.query.paging;
        const posts = query ? await Ticket_1.default.find({
            title: { $regex: query, $options: 'i' }
        })
            .populate('author', '_id fullName avatar_url')
            .limit(10)
            .skip(10 * parseInt(paging, 10)) : await Ticket_1.default.find()
            .populate('author', '_id fullName avatar_url')
            .sort({ _id: -1 })
            .limit(10)
            .skip(10 * parseInt(paging, 10));
        return res.status(200).json({
            successful: true,
            message: 'Get Tickets Successfully',
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
exports.default = { insertTicket, getTickets };
//# sourceMappingURL=Ticket.js.map