import { NextFunction, Request, Response } from 'express';
import IResponse from '../types/ReturnType';
import { Secret, verify } from 'jsonwebtoken';
import { UserAuthPayload } from '../types/User/UserAuthPayload';
export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorHeader = req.header('Authorization');
        const accessToken = authorHeader && authorHeader.split(' ')[1];
        const error: IResponse = {
            successful: false,
            message: 'Access Token is required'
        };
        if (!accessToken) return res.status(400).json({ error });
        const decodedUser = verify(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload;
        res.locals.userId = decodedUser.userId;
        return next();
    } catch (e) {
        const error: IResponse = {
            successful: false,
            message: 'Error Server '
        };
        return res.status(400).json(error);
    }
};
