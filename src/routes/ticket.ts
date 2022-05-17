import { Router } from 'express';
import Ticket from '../controllers/Ticket';
import storage from './../middleware/uploadFile';

const { getTickets, insertTicket } = Ticket;
const router = Router();

router.get('/gets', getTickets);

router.post('/create', storage.array('images', 3), insertTicket);

export default router;