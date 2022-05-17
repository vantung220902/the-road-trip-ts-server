"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("./users"));
const post_1 = __importDefault(require("./post"));
const story_1 = __importDefault(require("./story"));
const friend_1 = __importDefault(require("./friend"));
const comments_1 = __importDefault(require("./comments"));
const chat_1 = __importDefault(require("./chat"));
const ticket_1 = __importDefault(require("./ticket"));
const payment_1 = __importDefault(require("./payment"));
const checkAuth_1 = require("./../middleware/checkAuth");
function router(app) {
    app.use('/api/user', users_1.default);
    app.use('/api/post', checkAuth_1.checkAuth, post_1.default);
    app.use('/api/story', checkAuth_1.checkAuth, story_1.default);
    app.use('/api/comments', checkAuth_1.checkAuth, comments_1.default);
    app.use('/api/chats', checkAuth_1.checkAuth, chat_1.default);
    app.use('/api/friend', checkAuth_1.checkAuth, friend_1.default);
    app.use('/api/ticket', checkAuth_1.checkAuth, ticket_1.default);
    app.use('/api/payment', checkAuth_1.checkAuth, payment_1.default);
}
exports.default = router;
//# sourceMappingURL=index.js.map