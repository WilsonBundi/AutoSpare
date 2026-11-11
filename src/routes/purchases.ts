import { Router } from 'express';
import {
  createPurchase,
  getPurchases,
  getPurchase,
  updatePurchase,
  deletePurchase
} from '../controllers/purchaseController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize('admin', 'manager', 'storekeeper'), getPurchases);
router.get('/:id', authenticate, authorize('admin', 'manager', 'storekeeper'), getPurchase);
router.post('/', authenticate, authorize('admin', 'manager', 'storekeeper'), createPurchase);
router.put('/:id', authenticate, authorize('admin', 'manager'), updatePurchase);
router.delete('/:id', authenticate, authorize('admin'), deletePurchase);

export default router;
