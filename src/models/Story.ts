import mongoose, { Document, Schema } from 'mongoose';

export interface IStory {
    title: string;
    image: string;
    userId: string;
    time_created: number;
}
export interface IStoryModel extends IStory, Document {}
const StorySchema = new Schema({
    title: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    time_created: { type: Number, required: false, default: new Date().getDate() }
});
export default mongoose.model<IStoryModel>('Story', StorySchema);
