# 🔌 External Integrations Guide

This guide explains how to enable and configure M-Pesa and SMS integrations for the Boda Boda Spare Parts POS system.

---

## 📱 M-Pesa Integration

### Overview
M-Pesa integration allows customers to pay for spare parts using their mobile phones via STK Push (Lipa na M-Pesa).

### Prerequisites
1. **Safaricom Developer Account**: Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. **Business Shortcode**: Apply for a Paybill or Till Number from Safaricom
3. **API Credentials**: Get Consumer Key and Consumer Secret from the developer portal

### Setup Steps

#### 1. Get M-Pesa Credentials
1. Log in to [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Go to My Apps → Create New App
3. Select Daraja API
4. Note down:
   - Consumer Key
   - Consumer Secret
   - Passkey (from Test Credentials section)
   - Shortcode (Use 174379 for sandbox, your actual shortcode for production)

#### 2. Configure Environment Variables
Add the following to your `.env` file:

```env
# M-Pesa Configuration
MPESA_ENVIRONMENT=sandbox  # Change to 'production' for live environment
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_PASSKEY=your_passkey_here
MPESA_SHORTCODE=174379  # Your actual shortcode for production
CALLBACK_URL=https://your-domain.com  # Your production domain
```

#### 3. Test in Sandbox
```bash
# Restart the backend
npm run dev

# Test STK Push (via API or frontend)
POST /api/mpesa/stkpush
{
  "phoneNumber": "2547XXXXXXXX",
  "amount": 100,
  "accountReference": "TEST123",
  "transactionDesc": "Test payment"
}
```

#### 4. Production Setup
When ready for production:
1. Change `MPESA_ENVIRONMENT` to `production`
2. Use your actual Consumer Key and Secret from Safaricom
3. Use your actual Business Shortcode
4. Set `CALLBACK_URL` to your production domain with HTTPS
5. Ensure your server is accessible from the internet (for callbacks)

### API Endpoints

#### Initiate STK Push
```http
POST /api/mpesa/stkpush
Content-Type: application/json
Authorization: Bearer <token>

{
  "phoneNumber": "254712345678",
  "amount": 1500,
  "accountReference": "SALE-001",
  "transactionDesc": "Payment for spare parts"
}
```

Response:
```json
{
  "success": true,
  "message": "STK Push initiated",
  "data": {
    "MerchantRequestID": "xxx-xxx-xxx",
    "ResponseCode": "0",
    "ResponseDescription": "Success. Request accepted for processing",
    "CustomerMessage": "Success. Request accepted for processing"
  }
}
```

#### Query Transaction Status
```http
GET /api/mpesa/query/:checkoutRequestID
Authorization: Bearer <token>
```

#### Callback Endpoint
The system automatically handles M-Pesa callbacks at:
```
POST /api/mpesa/callback
```

### Integrating with POS

To add M-Pesa as a payment option in the POS:

1. Add M-Pesa button to POS payment selection
2. When selected, prompt for phone number
3. Call STK Push API
4. Show "Waiting for payment..." message
5. Poll transaction status every 5 seconds
6. When payment is complete, finalize the sale

### Troubleshooting

**STK Push fails:**
- Verify Consumer Key and Secret are correct
- Check if phone number format is correct (2547XXXXXXXX)
- Ensure you're using the correct environment (sandbox/production)
- Check if shortcode is correct

**Callback not received:**
- Verify CALLBACK_URL is accessible from internet
- Ensure HTTPS is configured in production
- Check firewall allows incoming requests
- Use ngrok for testing locally

**Invalid credentials:**
- Regenerate Consumer Key and Secret from Safaricom portal
- Ensure credentials are for the correct app
- Check if the app is active in the portal

---

## 📨 SMS Notifications Integration

### Overview
SMS notifications allow you to send:
- Receipts to customers
- Debt reminders to customers with outstanding balances
- Low stock alerts to shop owners

### Prerequisites
1. **SMS Provider Account**: Choose from:
   - Africa's Talking (recommended for Kenya)
   - Twilio (international)
   - Other local SMS providers

### Africa's Talking Setup (Recommended for Kenya)

#### 1. Get Africa's Talking Credentials
1. Sign up at [africastalking.com](https://africastalking.com)
2. Go to Sandbox → Get API Key
3. Note down:
   - API Key
   - Username
   - Sender ID (you can customize this)

#### 2. Configure Environment Variables
Add to your `.env` file:

```env
# SMS Configuration
SMS_PROVIDER=africastalking
SMS_API_KEY=your_api_key_here
SMS_USERNAME=your_username_here
SMS_SENDER_ID=AutosparePOS  # Your approved sender name
```

#### 3. Test SMS
```bash
# Restart the backend
npm run dev

# Test SMS (via API)
POST /api/sms/send
{
  "to": "254712345678",
  "message": "Test message from Autospare POS"
}
```

### Twilio Setup (Alternative)

#### 1. Get Twilio Credentials
1. Sign up at [twilio.com](https://twilio.com)
2. Get from Console:
   - Account SID
   - Auth Token
   - Twilio Phone Number

#### 2. Configure Environment Variables
```env
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=your_twilio_number
```

### API Endpoints

#### Send Custom SMS
```http
POST /api/sms/send
Content-Type: application/json
Authorization: Bearer <token>

{
  "to": "254712345678",
  "message": "Your custom message here"
}
```

#### Send Receipt SMS
```http
POST /api/sms/receipt
Content-Type: application/json
Authorization: Bearer <token>

{
  "phoneNumber": "254712345678",
  "customerName": "John Kamau",
  "amount": 1500,
  "saleNumber": "SALE20261030001"
}
```

#### Send Debt Reminder
```http
POST /api/sms/debt-reminder
Content-Type: application/json
Authorization: Bearer <token>

{
  "phoneNumber": "254712345678",
  "customerName": "John Kamau",
  "amount": 5000
}
```

#### Send Low Stock Alert
```http
POST /api/sms/low-stock-alert
Content-Type: application/json
Authorization: Bearer <token>

{
  "phoneNumber": "254712345678",
  "productName": "Front Brake Pads",
  "currentStock": 5
}
```

### Integrating with Sales Flow

#### Automatic Receipt SMS
After completing a sale in POS:
1. Check if customer has phone number
2. If yes, call `/api/sms/receipt` endpoint
3. Send SMS with sale details

#### Automated Debt Reminders
Set up a daily/weekly job to:
1. Query all customers with outstanding balance
2. For each customer, send debt reminder SMS
3. Track sent reminders to avoid spam

#### Low Stock Alerts
Trigger when:
1. Product stock falls below reorder level
2. Send SMS to shop owner/manager
3. Can be scheduled to run daily

### Troubleshooting

**SMS not sending:**
- Verify API credentials are correct
- Check account balance with SMS provider
- Ensure phone number format is correct (2547XXXXXXXX)
- Check if sender ID is approved by provider

**Invalid phone number:**
- Convert 07... to 2547...
- Ensure number includes country code
- Remove any spaces or special characters

**Rate limiting:**
- Most SMS providers have rate limits
- Implement delays between bulk SMS
- Check provider's rate limit policy

---

## 🔧 Backend Integration with Sales

To integrate M-Pesa and SMS into the sales flow, modify the sale creation in `src/controllers/salesController.ts`:

```typescript
// After successful sale creation
if (paymentMethod === 'mpesa') {
  // Initiate M-Pesa STK Push
  await mpesaService.stkPush({
    phoneNumber: customerPhone,
    amount: totalAmount,
    accountReference: saleNumber,
    transactionDesc: 'Payment for spare parts'
  });
}

// Send receipt SMS if customer has phone
if (customerPhone && customerPhone.trim()) {
  await smsService.sendReceiptSMS(
    customerPhone,
    customerName,
    totalAmount,
    saleNumber
  );
}
```

---

## 📊 Cost Estimates

### M-Pesa Costs
- **STK Push**: Free on customer side
- **Business Paybill**: Small fee per transaction (varies by volume)
- **Till Number**: Small fee per transaction
- Consult Safaricom for current rates

### SMS Costs
- **Africa's Talking**: ~KES 0.80-1.50 per SMS
- **Twilio**: ~KES 10-15 per SMS (international)
- Bulk discounts available for high volume

---

## ✅ Checklist Before Going Live

### M-Pesa
- [ ] Registered on Safaricom Developer Portal
- [ ] Applied for Business Shortcode (Paybill/Till)
- [ ] Obtained Consumer Key and Secret
- [ ] Configured environment variables
- [ ] Tested in sandbox environment
- [ ] Changed to production credentials
- [ ] Set up callback URL with HTTPS
- [ ] Test with real phone number

### SMS
- [ ] Registered with SMS provider
- [ ] Obtained API credentials
- [ ] Configured environment variables
- [ ] Tested SMS sending
- [ ] Approved sender ID (if required)
- [ ] Added SMS credits to account
- [ ] Tested all SMS types (receipt, debt reminder, alert)

---

## 🎯 Recommended Implementation Timeline

### Phase 1: M-Pesa (Week 1-2)
1. Register on Safaricom Developer Portal
2. Test in sandbox environment
3. Integrate with POS payment flow
4. Train staff on M-Pesa payments
5. Go live with small transactions
6. Monitor and optimize

### Phase 2: SMS (Week 2-3)
1. Choose SMS provider (Africa's Talking recommended)
2. Register and get credentials
3. Test SMS sending
4. Start with receipt SMS only
5. Add debt reminders after 1 month
6. Add low stock alerts as needed

---

## 📞 Support

### M-Pesa Support
- **Safaricom Developer Portal**: https://developer.safaricom.co.ke
- **Documentation**: https://developer.safaricom.co.ke/docs
- **Support Email**: developersupport@safaricom.co.ke

### SMS Support
- **Africa's Talking**: https://www.africastalking.com
- **Twilio**: https://www.twilio.com
- Check provider-specific documentation

---

## 🔐 Security Notes

### M-Pesa
- Never commit Consumer Key and Secret to public repositories
- Use environment variables for all credentials
- Rotate credentials periodically
- Monitor API usage for unauthorized access
- Use HTTPS for all production requests

### SMS
- Keep API keys secure
- Monitor SMS usage for unusual activity
- Implement rate limiting to prevent abuse
- Keep sender ID secure
- Regularly check account balance

---

## 📝 Configuration File Template

Create `.env.production` for production:

```env
# Server
PORT=5000
NODE_ENV=production

# Database
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=autospare_pos
DB_USER=autospare_user
DB_PASSWORD=strong_password_here

# JWT
JWT_SECRET=very_long_random_string_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=https://your-domain.com

# M-Pesa (Production)
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_PASSKEY=your_production_passkey
MPESA_SHORTCODE=your_actual_shortcode
CALLBACK_URL=https://your-domain.com

# SMS (Production)
SMS_PROVIDER=africastalking
SMS_API_KEY=your_production_api_key
SMS_USERNAME=your_production_username
SMS_SENDER_ID=AutosparePOS
```

---

**The infrastructure for both M-Pesa and SMS is now fully implemented. Add your credentials to the .env file to activate these features!**
