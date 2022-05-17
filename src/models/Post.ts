import mongoose, { Document, Schema } from 'mongoose';

export interface IPost {
    image: string;
    userId: string;
    title: string;
    rating: number;
    time_created: number;
    deleted: boolean;
}
export interface IPostModel extends IPost, Document {}

const PostSchema = new Schema({
    image: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    rating: { type: Number, required: false, default: 0 },
    time_created: { type: Number, required: false, default: new Date().getDate() },
    deleted: { type: Boolean, required: false, default: false }
});
export default mongoose.model<IPostModel>('Post', PostSchema);
