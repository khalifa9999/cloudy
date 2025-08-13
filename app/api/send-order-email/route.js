import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { orderDetails, cartItems, selectedPaymentMethod } = await request.json();

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD // Your Gmail app password
      }
    });

    // Format cart items for email
    const cartItemsHtml = cartItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      </tr>
    `).join('');

    // Calculate item count
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: bold; }
          td { padding: 10px; border-bottom: 1px solid #eee; }
          .total { font-size: 18px; font-weight: bold; color: #2c3e50; }
          .highlight { background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; color: #2c3e50;">🛒 New Order Received</h1>
            <p style="margin: 5px 0 0 0; color: #7f8c8d;">Order placed on ${new Date().toLocaleString()}</p>
          </div>

          <div class="section">
            <h2>👤 Customer Information</h2>
            <p><strong>Name:</strong> ${orderDetails.firstName} ${orderDetails.lastName}</p>
            <p><strong>Email:</strong> ${orderDetails.email}</p>
            <p><strong>Phone:</strong> ${orderDetails.phone}</p>
            <p><strong>Address:</strong> ${orderDetails.address}, ${orderDetails.city}, ${orderDetails.state} ${orderDetails.zipCode}</p>
            ${orderDetails.notes ? `<p><strong>Notes:</strong> ${orderDetails.notes}</p>` : ''}
          </div>

          <div class="section">
            <h2>💳 Payment Method</h2>
            <p><strong>Selected:</strong> ${selectedPaymentMethod}</p>
          </div>

          <div class="section">
            <h2>📦 Order Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                ${cartItemsHtml}
              </tbody>
            </table>
            <div class="total">
              <p><strong>Total Items:</strong> ${itemCount}</p>
            </div>
          </div>

          <div class="highlight">
            <p style="margin: 0;"><strong>Action Required:</strong> Please contact the customer to complete the payment process using ${selectedPaymentMethod}.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Admin email address
      subject: `New Order - ${orderDetails.firstName} ${orderDetails.lastName}`,
      html: emailHtml
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Order email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending order email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send order email' },
      { status: 500 }
    );
  }
}
