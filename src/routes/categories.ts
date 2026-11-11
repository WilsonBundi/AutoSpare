import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getCategories);
router.get('/:id', authenticate, getCategory);
router.post('/', authenticate, authorize('admin', 'manager', 'storekeeper'), createCategory);
router.put('/:id', authenticate, authorize('admin', 'manager', 'storekeeper'), updateCategory);
router.delete('/:id', authenticate, authorize('admin', 'manager'), deleteCategory);

export default router;
