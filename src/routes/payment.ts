import { Router } from 'express';
import Payment from '../controllers/Payment';

const { insertPayment, getPayments } = Payment;
const router = Router();

router.post('/create', insertPayment);

router.get('/gets', getPayments);

export default router;
