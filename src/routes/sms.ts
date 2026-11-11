import { Router } from 'express';
import { sendSMS, sendReceiptSMS, sendDebtReminderSMS, sendLowStockAlertSMS } from '../controllers/smsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/send', authenticate, authorize('admin', 'manager'), sendSMS);
router.post('/receipt', authenticate, authorize('admin', 'manager', 'cashier'), sendReceiptSMS);
router.post('/debt-reminder', authenticate, authorize('admin', 'manager'), sendDebtReminderSMS);
router.post('/low-stock-alert', authenticate, authorize('admin', 'manager'), sendLowStockAlertSMS);

export default router;
