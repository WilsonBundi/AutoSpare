import { Router } from 'express';
import {
  createSupplierPricing,
  getSupplierPricing,
  getProductPricing,
  deleteSupplierPricing
} from '../controllers/supplierPricingController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Get pricing for a specific supplier
router.get('/supplier/:supplierId', authenticate, getSupplierPricing);

// Get pricing for a specific product (from all suppliers)
router.get('/product/:productId', authenticate, getProductPricing);

// Create/update supplier pricing
router.post('/', authenticate, authorize('admin', 'manager', 'storekeeper'), createSupplierPricing);

// Delete supplier pricing
router.delete('/:supplierId/:productId', authenticate, authorize('admin', 'manager'), deleteSupplierPricing);

export default router;
