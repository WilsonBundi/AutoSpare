import { Router } from 'express';
import {
  openSession,
  closeSession,
  getActiveSession,
  getSessions,
  getSession
} from '../controllers/cashSessionController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/active', authenticate, getActiveSession);
router.get('/', authenticate, authorize('admin', 'manager'), getSessions);
router.get('/:id', authenticate, authorize('admin', 'manager'), getSession);
router.post('/open', authenticate, authorize('admin', 'manager', 'cashier'), openSession);
router.post('/:id/close', authenticate, authorize('admin', 'manager', 'cashier'), closeSession);

export default router;
