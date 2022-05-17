import mongoose, { Document, Schema } from 'mongoose';
export interface IPayment {
    ticket: string;
    userId: string;
    sum: number;
    number: number;
}
export interface IPaymentModel extends IPayment, Document {}
const PaymentSchema = new Schema({
    sum: { type: Number, required: true },
    ticket: { type: Schema.Types.ObjectId, required: true, ref: 'Ticket' },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    number: { type: Number, required: true}
});
export default mongoose.model<IPaymentModel>('Payment', PaymentSchema);
