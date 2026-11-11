import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getLowStock
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getProducts);
router.get('/low-stock', authenticate, getLowStock);
router.get('/:id', authenticate, getProduct);
router.post('/', authenticate, authorize('admin', 'manager', 'storekeeper'), createProduct);
router.put('/:id', authenticate, authorize('admin', 'manager', 'storekeeper'), updateProduct);
router.delete('/:id', authenticate, authorize('admin', 'manager'), deleteProduct);

export default router;
