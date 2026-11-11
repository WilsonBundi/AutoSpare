import { Router } from 'express';
import {
  getDailySales,
  getSalesByCategory,
  getTopSellingProducts,
  getProfitReport,
  getStockValuation,
  getDashboardSummary
} from '../controllers/reportController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/daily-sales', authenticate, getDailySales);
router.get('/sales-by-category', authenticate, authorize('admin', 'manager'), getSalesByCategory);
router.get('/top-products', authenticate, authorize('admin', 'manager'), getTopSellingProducts);
router.get('/profit', authenticate, authorize('admin', 'manager'), getProfitReport);
router.get('/stock-valuation', authenticate, authorize('admin', 'manager'), getStockValuation);
router.get('/dashboard', authenticate, getDashboardSummary);

export default router;
