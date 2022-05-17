import mongoose from 'mongoose';
import User, { IUserModel } from '../models/User';
import { Request, Response } from 'express';
import { LoginType, RegisterType } from '../types/User/UserType';
import IResponse from '../types/ReturnType';
import argon2 from 'argon2';
import { createToken, sendRefreshToken } from '../utils/auth';
import Logging from './../utils/Logging';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { verify, Secret } from 'jsonwebtoken';
import { UserAuthPayload } from '../types/User/UserAuthPayload';
import cloudinaryImageUploadMethod from '../utils/coudinary';
const registerUser = async (req: Request, res: Response) => {
    const { email, password, fullName } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error: RegisterType = {
                successful: false,
                message: `Duplicated email address`
            };
            return res.status(400).json(error);
        }
        const hashPassword = await argon2.hash(password);
        const _id = new mongoose.Types.ObjectId();
        const refresh_token = createToken('refreshToken', _id);
        const newUser: IUserModel = new User({
            _id,
            email,
            password: hashPassword,
            refresh_token,
            avatar_url: 'https://res.cloudinary.com/the-roap-trip/image/upload/v1646812864/ge7swjvap6co5wapeoye.png',
            fullName,
            address: 'Your address'
        });
        await newUser.save();
        const result: RegisterType = {
            successful: true,
            message: `Create User Successfully`
        };

        return res.status(200).json(result);
    } catch (e) {
        Logging.error(e);
        const error: RegisterType = {
            successful: false,
            message: `Duplicated email address`
        };
        return res.status(400).json(error);
    }
};
const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        const error: IResponse = {
            successful: false,
            message: 'Email or password is incorrect'
        };
        if (!existingUser) return res.status(400).json(error);
        const isPassword = await argon2.verify(existingUser.password, password);
        if (!isPassword) return res.json(error);
        const accessToken = createToken('accessToken', existingUser._id, existingUser.tokenVersion);
        const decoded = jwtDecode<JwtPayload>(accessToken);
        sendRefreshToken(res, existingUser);
        const response: LoginType = {
            successful: true,
            message: 'Login successful',
            accessToken,
            refreshToken: createToken('refreshToken', existingUser._id, existingUser.tokenVersion),
            email,
            fullName: existingUser.fullName,
            address: existingUser.address,
            avatar_url: existingUser.avatar_url,
            _id: existingUser._id,
            exp: decoded.exp as number,
            iat: decoded.iat as number
        };
        return res.status(200).json(response);
    } catch (e) {
        Logging.error(e);
        const error: IResponse = {
            successful: false,
            message: `Server error: ${e.message}`
        };
        return res.status(400).json(error);
    }
};
const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.query.refreshToken as string;
    if (!refreshToken) return res.sendStatus(401);
    try {
        const decodedUser = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret) as UserAuthPayload;
        const existingUser = await User.findById(decodedUser.userId);
        if (!existingUser || existingUser.tokenVersion !== decodedUser.tokenVersion) return res.sendStatus(401);
        sendRefreshToken(res, existingUser);
        return res.json({
            success: true,
            message: 'Refresh token error',
            accessToken: createToken('accessToken', existingUser._id, existingUser.tokenVersion)
        });
    } catch (error) {
        console.log('Error refreshToken', error);
        return res.sendStatus(403);
    }
};
const updateUser = async (req: Request, res: Response) => {
    const { fullName, address } = req.body;
    const error: IResponse = {
        successful: false,
        message: 'Server Error Please check your information'
    };
    if (!fullName || !address || !req.file) return res.status(404).send(error);
    try {
        const response:any = await cloudinaryImageUploadMethod(req.file.path);
        const { userId } = res.locals;
        const avatar_url = response.res;
        const authorHeader = req.header('Authorization');
        const accessToken = authorHeader && authorHeader.split(' ')[1];
        const decoded = jwtDecode<JwtPayload>(accessToken as string);
        const user = await User.findOneAndUpdate(
            { userId: userId },
            {
                $set: { avatar_url, fullName, address }
            }
        ).select({ password: 0, tokenVersion: 0, createdAt: 0, updatedAt: 0 });
        if (user) {
            const result = {
                successful: true,
                message: `Successfully update user`,
                data: {
                    accessToken: accessToken ? accessToken : null,
                    refreshToken: user.refresh_token,
                    email: user.email,
                    fullName: user.fullName,
                    address: user.address,
                    avatar_url: user.avatar_url,
                    exp: decoded.exp as number,
                    iat: decoded.iat as number
                }
            };
            return res.status(200).json(result);
        }

        return res.status(404).json(error);
    } catch (e) {
       Logging.error(e);
       const error: IResponse = {
           successful: false,
           message: `Server error: ${e.message}`
       };
       return res.status(400).json(error);
    }
};
export default { registerUser, login, refreshToken, updateUser };
