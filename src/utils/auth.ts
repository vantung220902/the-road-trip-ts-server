import { sign, Secret } from 'jsonwebtoken';
import { IUserModel } from '../models/User';
import { Response } from 'express';
import { Types } from 'mongoose';
export const createToken = (type: 'accessToken' | 'refreshToken', id: Types.ObjectId, tokenVersion: number = 0) =>
    sign(
        {
            userId: id,
            ...(type === 'refreshToken' ? { tokenVersion } : {})
        },
        type === 'accessToken' ? (process.env.ACCESS_TOKEN_SECRET as Secret) : (process.env.REFRESH_TOKEN_SECRET as Secret),
        {
            expiresIn: type === 'accessToken' ? '2h' : '60h'
        }
    );

export const sendRefreshToken = (res: Response, user: IUserModel) => {
    res.cookie(process.env.REFRESH_TOKEN_SECRET as string, createToken('refreshToken', user._id, user.tokenVersion), {
        secure: true,
        sameSite: 'lax',
        path: '/refresh_token'
    });
};
