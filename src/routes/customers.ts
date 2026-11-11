import { Router } from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getDebtors
} from '../controllers/customerController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getCustomers);
router.get('/debtors', authenticate, authorize('admin', 'manager'), getDebtors);
router.get('/:id', authenticate, getCustomer);
router.post('/', authenticate, authorize('admin', 'manager', 'cashier'), createCustomer);
router.put('/:id', authenticate, authorize('admin', 'manager'), updateCustomer);
router.delete('/:id', authenticate, authorize('admin', 'manager'), deleteCustomer);

export default router;
