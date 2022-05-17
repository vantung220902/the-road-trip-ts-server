import mongoose, { Document, Schema } from 'mongoose';
export interface IComment {
    body: string;
    userId: string;
    postId:string;
    time_created: number;
}
export interface ICommentModel extends IComment, Document {}
const CommentSchema = new Schema({
    body: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    time_created: { type: Number, required: false, default: new Date().getDate() }
});
export default mongoose.model<ICommentModel>('Comment', CommentSchema);
