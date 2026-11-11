import { Router } from 'express';
import {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary
} from '../controllers/expenseController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize('admin', 'manager'), getExpenses);
router.get('/summary', authenticate, authorize('admin', 'manager'), getExpenseSummary);
router.get('/:id', authenticate, authorize('admin', 'manager'), getExpense);
router.post('/', authenticate, authorize('admin', 'manager'), createExpense);
router.put('/:id', authenticate, authorize('admin'), updateExpense);
router.delete('/:id', authenticate, authorize('admin'), deleteExpense);

export default router;
