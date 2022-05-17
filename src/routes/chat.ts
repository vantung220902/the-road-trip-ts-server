import { Router } from 'express';
import Chat from '../controllers/Chat';

const { insertMessage, getMessage } = Chat;
const router = Router();

router.post('/create', insertMessage);

router.get('/gets', getMessage);

export default router;
