import { Router } from 'express';
import Comment from '../controllers/Comment';

const { insertComment, getComments } = Comment;
const router = Router();

router.post('/create', insertComment);

router.get('/gets', getComments);

export default router;
