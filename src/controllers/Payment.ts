import mongoose from 'mongoose';
import Payment, { IPaymentModel } from '../models/Payment';
import User from '../models/User';
import Logging from '../utils/Logging';
import { IPaymentReturn } from './../types/Payment/PaymentType';
import { Response, Request } from 'express';
import argon2 from 'argon2';
const insertPayment = async (req: Request, res: Response) => {
    const { sum, number, password, ticket } = req.body;
    const { userId } = res.locals;
    const error = {
        successful: false,
        message: 'Server Error Please check your information',
        data: null
    };
    if (!sum || !number || !password || !ticket) return res.status(404).send(error);
    try {
        const existingUser = await User.findOne({ _id: userId });
        if (!existingUser) return res.status(400).json(error);
        const isPassword = await argon2.verify(existingUser.password, password);
        if (!isPassword)
            return res.json({
                ...error,
                message: 'Password incorrect, Please check your password'
            });
        const _id = new mongoose.Types.ObjectId();
        const newPayment: IPaymentModel = new Payment({
            _id,
            number: number as number,
            sum: sum as number,
            ticket,
            userId
        });
        await newPayment.save();
        Logging.info('Create Payment Successfully');
        const chat = <IPaymentModel>await Payment.findOne({ _id: newPayment._id }).populate('ticket', '_id name').populate('userId', '_id fullName avatar_url');
        const result: IPaymentReturn = {
            successful: true,
            message: `Created Payment Successfully `,
            data: chat
        };
        return res.status(200).json(result);
    } catch (e) {
        const error: IPaymentReturn = {
            successful: false,
            message: e.message,
            data: null
        };
        Logging.error(error);
        return res.status(500).json(error);
    }
};
const getPayments = async (req: Request, res: Response) => {
    try {
        const { userId } = res.locals;
        const { paging } = req.query;
        const payments = <IPaymentModel[]>await Payment.find({ userId })
            .populate('ticket', '_id name address date image')
            .populate('userId', 'avatar_url fullName')
            .sort({ _id: -1 })
            .limit(10)
            .skip(10 * parseInt(paging as string, 10));
        return res.status(200).json({
            successful: true,
            message: 'Get Payment Success',
            data: payments
        });
    } catch (e) {
        const error: IPaymentReturn = {
            successful: false,
            message: e.message,
            data: null
        };
        Logging.error(error);
        return res.status(500).json(error);
    }
};

export default { insertPayment, getPayments };
