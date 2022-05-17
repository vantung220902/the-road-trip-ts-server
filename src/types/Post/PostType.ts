import IResponse from '../ReturnType';
import { Types } from 'mongoose';
interface IPostReturn extends IResponse {
    _id: Types.ObjectId;
    title: string;
    image: string;
    rating: number;
    userId: string;
    time_created: number;
}

export interface InsertPostType extends IPostReturn {}
