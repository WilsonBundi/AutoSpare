import { Router } from 'express';
import { stkPush, queryTransaction, mpesaCallback } from '../controllers/mpesaController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/stkpush', authenticate, authorize('admin', 'manager', 'cashier'), stkPush);
router.get('/query/:checkoutRequestID', authenticate, authorize('admin', 'manager'), queryTransaction);
router.post('/callback', mpesaCallback);

export default router;
