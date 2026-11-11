import { Router } from 'express';
import { addStock, adjustStock, getStockMovements } from '../controllers/inventoryController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/add', authenticate, authorize('admin', 'manager', 'storekeeper'), addStock);
router.post('/adjust', authenticate, authorize('admin', 'manager', 'storekeeper'), adjustStock);
router.get('/movements', authenticate, authorize('admin', 'manager', 'storekeeper'), getStockMovements);

export default router;
