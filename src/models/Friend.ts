import mongoose, { Document, Schema } from 'mongoose';

export interface IFriend {
    sender: string;
    receiver: string;
    status: number;
}
export interface IFriendModel extends IFriend, Document {}

const FriendSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        receiver: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        status: { type: Number, default: -1, required: true }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
export default mongoose.model<IFriendModel>('Friend', FriendSchema);
