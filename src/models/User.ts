import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    email: string;
    password: string;
    refresh_token: string;
    fullName: string | undefined;
    avatar_url: string;
    address: string;
    tokenVersion: number;
}
export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        refresh_token: { type: String, required: false },
        fullName: { type: String, required: false },
        avatar_url: { type: String, required: false },
        address: { type: String, required: false },
        tokenVersion: { type: Number, required: false, default: 0 }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
export default mongoose.model<IUserModel>('User', UserSchema);
