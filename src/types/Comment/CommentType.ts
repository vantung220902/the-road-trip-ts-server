import IResponse from '../ReturnType';
import { ICommentModel } from '../../models/Comments';
export interface ICommentReturn extends IResponse {
    data: ICommentModel | null;
}
