import { Express } from "express";
import users from './users'
import posts from './post';
import stories from './story';
import friends from './friend';
import comments from './comments';
import chats from './chat';
import ticket from './ticket';
import payment from './payment';
import { checkAuth } from './../middleware/checkAuth';
function router(app: Express) {

    app.use('/api/user', users);

    app.use('/api/post', checkAuth, posts);

    app.use('/api/story', checkAuth, stories);

    app.use('/api/comments', checkAuth, comments);

    app.use('/api/chats', checkAuth, chats);

    app.use('/api/friend', checkAuth, friends);

    app.use('/api/ticket', checkAuth, ticket);

    app.use('/api/payment', checkAuth, payment);

}
export default router;
