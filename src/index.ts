import express from 'express';
import cors from 'cors';
import http from 'http';
import morgan from 'morgan';
import path from 'path';
import mongoose from 'mongoose';
import config from './config';
import router from './routes';
import cookieParser from 'cookie-parser';
import { Server, Socket } from 'socket.io';
const app = express();
mongoose
    .connect(config.mongo.url, {
        w: 'majority',
        retryWrites: true
    })
    .then(() => {
        console.log('Connected to Mong');
        StartServer();
    })
    .catch((err) => {
        console.log(err);
        console.error('Error connecting to MongoDB');
    });
const StartServer = () => {
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(cookieParser());
    router(app);
    app.use((_req: express.Request, res: express.Response) => {
        const error = new Error('not found');
        console.error(error);
        return res.status(404).json({ message: error.message });
    });
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket: Socket) => {
        socket.on('join_room', (data: string) => {
            socket.join(data);
            console.log(`User with ID ${socket.id} joined room ${data}`);
        });
        socket.on('leave_room', (data: string) => {
            socket.leave(data);
            console.log(`User with ID ${socket.id} leave room ${data}`);
        });
        console.log(`Use connected: ${socket.id}`);
        socket.on('send_message', (data: string) => {
            socket.to('Message').emit('receive_message', { data });
        });
        socket.on('send_inviting', (data: string) => {
            socket.to('Inviting').emit('receive_inviting', { data });
        });
        socket.on('send_post', (data: string) => {
            socket.to('Post').emit('receive_post', { data });
        });
        socket.on('send_ticket', (data: string) => {
            socket.to('Ticket').emit('receive_ticket', { data });
        });
        socket.on('disconnect', () => {
            console.log(`User disconnected ${socket.id} `);
        });
    });
    server.listen(config.server.port, () => console.log(`Server is running on port ${config.server.port}.`));
};
