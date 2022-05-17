import mongoose, { Document, Schema } from 'mongoose';
export interface IChat {
    body: string;
    sender: string;
    receiver: string;
    time_created: number;
}
export interface IChatModel extends IChat, Document {}
const ChatSchema = new Schema({
    body: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    time_created: { type: Number, required: false, default: new Date().getDate() }
});
export default mongoose.model<IChatModel>('Chat', ChatSchema);
