"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const Logging_1 = __importDefault(require("./utils/Logging"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
mongoose_1.default
    .connect(config_1.default.mongo.url, {
    w: 'majority',
    retryWrites: true
})
    .then(() => {
    Logging_1.default.info('Connected to Mong');
    StartServer();
})
    .catch((err) => {
    console.log(err);
    Logging_1.default.error('Error connecting to MongoDB');
});
const StartServer = () => {
    app.use((0, morgan_1.default)('dev'));
    app.use((0, cors_1.default)());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
    app.use((0, cookie_parser_1.default)());
    (0, routes_1.default)(app);
    app.use((_req, res) => {
        const error = new Error('not found');
        Logging_1.default.error(error);
        return res.status(404).json({ message: error.message });
    });
    const server = http_1.default.createServer(app);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        socket.on('join_room', (data) => {
            socket.join(data);
            Logging_1.default.info(`User with ID ${socket.id} joined room ${data}`);
        });
        socket.on('leave_room', (data) => {
            socket.leave(data);
            Logging_1.default.info(`User with ID ${socket.id} leave room ${data}`);
        });
        Logging_1.default.info(`Use connected: ${socket.id}`);
        socket.on('send_message', (data) => {
            Logging_1.default.info(data);
            socket.to('Message').emit('receive_message', { data });
        });
        socket.on('send_inviting', (data) => {
            Logging_1.default.info(data);
            socket.to('Inviting').emit('receive_inviting', { data });
        });
        socket.on('send_post', (data) => {
            Logging_1.default.info(data);
            socket.to('Post').emit('receive_post', { data });
        });
        socket.on('disconnect', () => {
            Logging_1.default.warn(`User disconnected ${socket.id} `);
        });
    });
    server.listen(config_1.default.server.port, () => Logging_1.default.log(`Server is running on port ${config_1.default.server.port}.`));
};
//# sourceMappingURL=index.js.map