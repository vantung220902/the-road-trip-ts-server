import IResponse from '../ReturnType';
import { IPaymentModel } from '../../models/Payment';
export interface IPaymentReturn extends IResponse {
    data: IPaymentModel | null;
}
