import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket {
    image: string;
    author: string;
    address: string;
    name: string;
    date: string;
    description: string;
    price: number;
    rest: number;
}
export interface ITicketModel extends ITicket, Document {}

const TicketSchema = new Schema({
    image: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    address: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rest: { type: Number, required: true, },
});
export default mongoose.model<ITicketModel>('Ticket', TicketSchema);
