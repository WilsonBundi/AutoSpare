import { Request, Response } from 'express';
import smsService from '../services/smsService';

export const sendSMS = async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }

    const result = await smsService.sendSMS({ to, message });

    res.json({
      success: true,
      message: 'SMS sent successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Send SMS error:', error);
    res.status(500).json({
      error: error.message || 'Failed to send SMS',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};

export const sendReceiptSMS = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, customerName, amount, saleNumber } = req.body;

    if (!phoneNumber || !customerName || !amount || !saleNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await smsService.sendReceiptSMS(phoneNumber, customerName, amount, saleNumber);

    res.json({
      success: true,
      message: 'Receipt SMS sent successfully',
    });
  } catch (error: any) {
    console.error('Send receipt SMS error:', error);
    res.status(500).json({
      error: error.message || 'Failed to send receipt SMS',
    });
  }
};

export const sendDebtReminderSMS = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, customerName, amount } = req.body;

    if (!phoneNumber || !customerName || !amount) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await smsService.sendDebtReminderSMS(phoneNumber, customerName, amount);

    res.json({
      success: true,
      message: 'Debt reminder SMS sent successfully',
    });
  } catch (error: any) {
    console.error('Send debt reminder SMS error:', error);
    res.status(500).json({
      error: error.message || 'Failed to send debt reminder SMS',
    });
  }
};

export const sendLowStockAlertSMS = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, productName, currentStock } = req.body;

    if (!phoneNumber || !productName || !currentStock) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await smsService.sendLowStockAlertSMS(phoneNumber, productName, currentStock);

    res.json({
      success: true,
      message: 'Low stock alert SMS sent successfully',
    });
  } catch (error: any) {
    console.error('Send low stock alert SMS error:', error);
    res.status(500).json({
      error: error.message || 'Failed to send low stock alert SMS',
    });
  }
};
