# Email Setup Guide for Order Notifications

## Problem
Your application is failing to send order emails with a 500 error. This is because the required environment variables for Gmail SMTP are not configured.

## Solution
Follow these steps to set up email functionality:

### 1. Create Environment File
Create a `.env.local` file in your project root with the following content:

```bash
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# Admin Email Configuration
ADMIN_EMAIL=admin@yourdomain.com

# Facebook Page Username (for client-side access)
NEXT_PUBLIC_FACEBOOK_PAGE_USERNAME=your-facebook-page-username
```

### 2. Gmail App Password Setup

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to Security
3. Enable 2-Factor Authentication if not already enabled

#### Step 2: Generate App Password
1. Go to Security → App passwords
2. Select "Mail" as the app
3. Select "Other" as the device (name it "ATV Parts Store")
4. Click "Generate"
5. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

#### Step 3: Update Environment File
Replace `your-gmail-app-password` with the generated app password (remove spaces).

### 3. Configure Admin Email
Set `ADMIN_EMAIL` to the email address where you want to receive order notifications.

### 4. Test Configuration

#### Option A: Test via Checkout
1. Add items to cart
2. Go through checkout process
3. Check server logs for email status
4. Check admin email for order notification

#### Option B: Test API Directly
You can test the email API directly using curl or Postman:

```bash
curl -X POST http://localhost:3000/api/send-order-email \
  -H "Content-Type: application/json" \
  -d '{
    "orderDetails": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "phone": "1234567890",
      "address": "123 Test St",
      "city": "Test City",
      "state": "Test State",
      "zipCode": "12345"
    },
    "cartItems": [
      {
        "name": "Test Product",
        "quantity": 1
      }
    ],
    "selectedPaymentMethod": "zelle"
  }'
```

### 5. Troubleshooting

#### Common Issues:

1. **"GMAIL_USER not set"**
   - Check that `.env.local` file exists
   - Verify `GMAIL_USER` is set correctly
   - Restart your development server

2. **"GMAIL_APP_PASSWORD not set"**
   - Generate a new app password following Step 2
   - Make sure to remove spaces from the password
   - Restart your development server

3. **"Invalid Gmail credentials"**
   - Verify your Gmail username is correct
   - Check that 2-Factor Authentication is enabled
   - Regenerate the app password
   - Make sure you're using the app password, not your regular Gmail password

4. **"ADMIN_EMAIL not set"**
   - Set the `ADMIN_EMAIL` environment variable
   - Use a valid email address

5. **"Email authentication failed"**
   - Double-check your Gmail credentials
   - Ensure 2-Factor Authentication is enabled
   - Try generating a new app password

#### Development vs Production:
- For development: Use `.env.local`
- For production (Vercel): Set environment variables in Vercel dashboard
- For other hosting: Set environment variables according to your hosting provider

### 6. Security Notes
- Never commit `.env.local` to version control
- Use different app passwords for development and production
- Regularly rotate your app passwords
- Consider using a dedicated Gmail account for business emails

### 7. Alternative Email Services
If you prefer not to use Gmail, you can modify the email configuration to use other services:

#### SendGrid:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

#### Mailgun:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASSWORD
  }
});
```

## Next Steps
After setting up the environment variables:
1. Restart your development server
2. Test the checkout process
3. Verify emails are being sent to the admin email
4. Check server logs for any remaining issues

The improved error handling will now provide specific feedback about what's missing or misconfigured.
