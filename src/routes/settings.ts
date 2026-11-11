import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getSettings);
router.put('/', authenticate, authorize('admin'), updateSettings);

export default router;
