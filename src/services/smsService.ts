import axios from 'axios';

export interface SMSRequest {
  to: string;
  message: string;
}

export class SMSService {
  private apiKey: string;
  private username: string;
  private senderId: string;
  private provider: string;

  constructor() {
    this.apiKey = process.env.SMS_API_KEY || '';
    this.username = process.env.SMS_USERNAME || '';
    this.senderId = process.env.SMS_SENDER_ID || 'AutosparePOS';
    this.provider = process.env.SMS_PROVIDER || 'africastalking';
  }

  async sendSMS(request: SMSRequest): Promise<any> {
    try {
      if (this.provider === 'africastalking') {
        return await this.sendAfricaTalkingSMS(request);
      } else if (this.provider === 'twilio') {
        return await this.sendTwilioSMS(request);
      } else {
        throw new Error('Unsupported SMS provider');
      }
    } catch (error: any) {
      console.error('SMS error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to send SMS');
    }
  }

  private async sendAfricaTalkingSMS(request: SMSRequest): Promise<any> {
    const response = await axios.post(
      'https://api.africastalking.com/version1/messaging',
      {
        username: this.username,
        to: request.to,
        message: request.message,
        from: this.senderId,
      },
      {
        headers: {
          apiKey: this.apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    return response.data;
  }

  private async sendTwilioSMS(request: SMSRequest): Promise<any> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio credentials not configured');
    }

    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      new URLSearchParams({
        To: request.to,
        From: fromNumber,
        Body: request.message,
      }),
      {
        auth: {
          username: accountSid,
          password: authToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  }

  async sendReceiptSMS(phoneNumber: string, customerName: string, amount: number, saleNumber: string): Promise<void> {
    const message = `Dear ${customerName}, thank you for your purchase of KES ${amount.toFixed(2)}. Receipt #${saleNumber}. Visit us again!`;
    await this.sendSMS({
      to: phoneNumber.replace(/^0/, '+254'),
      message,
    });
  }

  async sendDebtReminderSMS(phoneNumber: string, customerName: string, amount: number): Promise<void> {
    const message = `Dear ${customerName}, this is a reminder that you have an outstanding balance of KES ${amount.toFixed(2)}. Please clear your debt. Thank you.`;
    await this.sendSMS({
      to: phoneNumber.replace(/^0/, '+254'),
      message,
    });
  }

  async sendLowStockAlertSMS(phoneNumber: string, productName: string, currentStock: number): Promise<void> {
    const message = `Alert: Product "${productName}" is running low. Current stock: ${currentStock}. Please restock soon.`;
    await this.sendSMS({
      to: phoneNumber.replace(/^0/, '+254'),
      message,
    });
  }
}

export default new SMSService();
