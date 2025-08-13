# Checkout Setup Guide

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```bash
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# Admin Email Configuration
ADMIN_EMAIL=admin@yourdomain.com

# Facebook Page Username (for client-side access)
NEXT_PUBLIC_FACEBOOK_PAGE_USERNAME=your-facebook-page-username
```

## Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to Security → App passwords
4. Generate a new app password for "Mail"
5. Use this password in `GMAIL_APP_PASSWORD`

## Facebook Page Username

1. Go to your Facebook Page
2. The username is in the URL: `facebook.com/your-page-username`
3. Use this username in `NEXT_PUBLIC_FACEBOOK_PAGE_USERNAME`

## How It Works

1. **User fills checkout form** with contact and shipping information
2. **User selects payment method** from available options
3. **User clicks "Proceed to Payment"**
4. **System sends email to admin** with:
   - Customer information
   - Order details
   - Payment method selected
   - Cart items and totals
5. **User is redirected to Facebook Messenger** with pre-filled order details
6. **Admin can contact customer** to complete payment process

## Features

- ✅ Admin receives detailed order email via Gmail
- ✅ User redirected to Facebook Messenger chat
- ✅ Order details pre-filled in Messenger
- ✅ Cart integration with real-time totals
- ✅ Form validation and error handling
- ✅ Responsive design for mobile and desktop
- ✅ No credit card processing required

## Testing

1. Add items to cart from shop page
2. Navigate to checkout
3. Fill out form and select payment method
4. Click "Proceed to Payment"
5. Check admin email for order notification
6. Verify Facebook Messenger redirect works

## Troubleshooting

- **Email not sending**: Check Gmail credentials and app password
- **Facebook redirect not working**: Verify page username is correct
- **Cart empty**: Ensure CartContext is properly configured
- **Form validation errors**: Check required fields are filled
