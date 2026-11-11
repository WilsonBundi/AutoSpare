import { Router } from 'express';
import { createSale, getSales, getSale, voidSale } from '../controllers/salesController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getSales);
router.get('/:id', authenticate, getSale);
router.post('/', authenticate, authorize('admin', 'manager', 'cashier'), createSale);
router.post('/:id/void', authenticate, authorize('admin', 'manager'), voidSale);

export default router;
