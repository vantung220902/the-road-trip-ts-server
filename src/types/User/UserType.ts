import IResponse from '../ReturnType'
interface IUserTReturn extends IResponse {
    email: string;
    fullName: string | undefined;
    avatar_url: string;
    address: string;
    _id: string;
}

export interface RegisterType extends IResponse {
   
}
export interface LoginType extends IUserTReturn {
    accessToken: string | null;
    refreshToken: string | null;
    exp: number;
    iat: number; 
}
