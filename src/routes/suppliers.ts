import { Router } from 'express';
import {
  createSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getSuppliers);
router.get('/:id', authenticate, getSupplier);
router.post('/', authenticate, authorize('admin', 'manager', 'storekeeper'), createSupplier);
router.put('/:id', authenticate, authorize('admin', 'manager', 'storekeeper'), updateSupplier);
router.delete('/:id', authenticate, authorize('admin', 'manager'), deleteSupplier);

export default router;
