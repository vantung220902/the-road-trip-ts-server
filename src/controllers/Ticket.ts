import mongoose from 'mongoose';
import Ticket, { ITicketModel } from '../models/Ticket';
import Logging from '../utils/Logging';
import IResponse from './../types/ReturnType';
import { Response, Request } from 'express';
import cloudinaryImageUploadMethod from '../utils/coudinary';
const error: IResponse = {
    successful: false,
    message: 'Server Error Please check your information'
};

const insertTicket = async (req: Request, res: Response) => {
    const { name, price, address, date, rest, description } = req.body;
    const { userId } = res.locals;
    if (!req.files || !name || !price || !address || !date || !rest || !description) return res.status(404).send(error);
    try {
        const image = [];
        const files = req.files as Express.Multer.File[];
        for (const file of files) {
            const { path } = file;
            const newPath: any = await cloudinaryImageUploadMethod(path);
            image.push(`${newPath.res};`);
        }

        const _id = new mongoose.Types.ObjectId();
        const newTicket: ITicketModel = new Ticket({
            _id,
            author: userId,
            name,
            image: image.join(''),
            rest: rest as number,
            address,
            price: price as number,
            date,
            description
        });
        await newTicket.save();
        const result: IResponse = {
            successful: true,
            message: `Successfully created ticket`
        };
        return res.status(200).json(result);
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        Logging.error(error);
        return res.status(500).json(error);
    }
};

const getTickets = async (req: Request, res: Response) => {
    try {
        const query = req.query.query;
        const paging = req.query.paging as string;
        const posts = query ? <ITicketModel[]>await Ticket.find({
                  title: { $regex: query, $options: 'i' }
              })
                  .populate('author', '_id fullName avatar_url')
                  .limit(10)
                  .skip(10 * parseInt(paging, 10)) : <ITicketModel[]>await Ticket.find()
                  .populate('author', '_id fullName avatar_url')
                  .sort({ _id: -1 })
                  .limit(10)
                  .skip(10 * parseInt(paging, 10));
        return res.status(200).json({
            successful: true,
            message: 'Get Tickets Successfully',
            data: posts
        });
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: e.message
        };
        Logging.error(error);
        return res.status(500).json(error);
    }
};

export default { insertTicket, getTickets };
