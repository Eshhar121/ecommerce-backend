import { generateToken } from './jwt.js';
import { transporter } from '../config/nodemailer.js';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"E-COMMERCE" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    //TODO: Handle email sending errors
  }
};

export const sendVerificationEmail = async (user) => {

  try {
    const token = generateToken({ id: user._id });

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    const html = `
    <p>Click the link below to verify your email:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
  `;

    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      html,
    });
  } catch (error) {
    console.error('Error inside sendVerificationEmail:', error);
    throw error;
  }
};

export const sendOrderConfirmationEmail = async (to, order) => {
  const html = `
    <h2>Thanks for your order!</h2>
    <p>Your order has been placed successfully.</p>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p>Total: $${order.totalPrice}</p>
    <p>Status: ${order.isPaid ? 'Paid' : 'Pending Payment'} (${order.status})</p>
    <p>You can view your order in your account.</p>
    <p>Review products after delivery!</p>
  `;

  await sendEmail({
    to,
    subject: 'Order Confirmation - MyShop',
    html,
  });
};