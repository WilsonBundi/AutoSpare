import { Request, Response } from 'express';
import mpesaService from '../services/mpesaService';

export const stkPush = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, amount, accountReference, transactionDesc } = req.body;

    if (!phoneNumber || !amount) {
      return res.status(400).json({ error: 'Phone number and amount are required' });
    }

    const result = await mpesaService.stkPush({
      phoneNumber: phoneNumber.replace(/^0/, '+254'), // Convert 07... to +2547...
      amount: Math.round(amount),
      accountReference: accountReference || 'AutosparePOS',
      transactionDesc: transactionDesc || 'Payment for spare parts',
    });

    res.json({
      success: true,
      message: 'STK Push initiated',
      data: result,
    });
  } catch (error: any) {
    console.error('STK Push error:', error);
    res.status(500).json({
      error: error.message || 'Failed to initiate STK Push',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};

export const queryTransaction = async (req: Request, res: Response) => {
  try {
    const { checkoutRequestID } = req.params;

    if (!checkoutRequestID) {
      return res.status(400).json({ error: 'Checkout Request ID is required' });
    }

    const result = await mpesaService.queryTransaction(checkoutRequestID);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Query transaction error:', error);
    res.status(500).json({
      error: error.message || 'Failed to query transaction',
    });
  }
};

export const mpesaCallback = async (req: Request, res: Response) => {
  try {
    const { Body } = req.body;

    if (Body.stkCallback && Body.stkCallback.CallbackMetadata) {
      const metadata = Body.stkCallback.CallbackMetadata;
      const amount = metadata.Amount?.[0];
      const mpesaReceipt = metadata.MpesaReceiptNumber?.[0];
      const transactionDate = metadata.TransactionDate?.[0];
      const phoneNumber = metadata.PhoneNumber?.[0];

      // Here you would typically:
      // 1. Verify the transaction
      // 2. Update the payment status in your database
      // 3. Mark the sale as paid if applicable

      console.log('M-Pesa Callback received:', {
        amount,
        mpesaReceipt,
        transactionDate,
        phoneNumber,
      });

      // TODO: Update payment status in database
      // TODO: Link to sale if applicable
    }

    res.json({
      ResultCode: 0,
      ResultDesc: 'Success',
      ThirdPartyTransID: Body.stkCallback?.MerchantRequestID,
    });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    res.status(500).json({ error: 'Failed to process callback' });
  }
};
