import { jest } from '@jest/globals';
import { sendEmail, sendVerificationEmail, sendOrderConfirmationEmail } from '../../../utils/mail.js';

// Mock nodemailer config
jest.mock('../../../config/nodemailer.js', () => ({
  transporter: {
    sendMail: jest.fn().mockResolvedValue(true),
  },
}));

import { transporter } from '../../../config/nodemailer.js';
const sendMailMock = transporter.sendMail;

// Mock jwt
jest.mock('../../../utils/jwt.js', () => ({
  generateToken: jest.fn().mockReturnValue('mocked-token-123'),
}));

describe('Email Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EMAIL_USER = 'test@example.com'; // Set EMAIL_USER
  });

  test('sendEmail should call transporter.sendMail with correct data', async () => {
    await sendEmail({
      to: 'test@mail.com',
      subject: 'Hello',
      html: '<p>Hello world</p>',
    });

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: `"Your Store" <test@example.com>`,
        to: 'test@mail.com',
        subject: 'Hello',
        html: '<p>Hello world</p>',
      })
    );
  });

  test('sendVerificationEmail should call sendEmail with token link', async () => {
    const mockUser = {
      _id: '123',
      email: 'verifyme@mail.com',
      verificationToken: 'mocked-token-123',
    };

    await sendVerificationEmail(mockUser);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'verifyme@mail.com',
        subject: 'Verify Your Email',
        html: expect.stringContaining('/verify/mocked-token-123'),
      })
    );
  });

  test('sendOrderConfirmationEmail should call sendEmail with order summary', async () => {
    const mockOrder = {
      _id: 'abc123',
      items: [],
      totalPrice: 100,
      isPaid: true,
      status: 'Processing',
    };

    await sendOrderConfirmationEmail('buyer@mail.com', mockOrder);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    const callArgs = sendMailMock.mock.calls[0][0]; // Get the first call’s argument
    expect(callArgs).toMatchObject({
      to: 'buyer@mail.com',
      subject: 'Order Confirmation - MyShop',
      from: `"Your Store" <test@example.com>`,
    });
    expect(callArgs.html).toMatch(/Order ID:.*abc123/);
    expect(callArgs.html).toMatch(/Total:.*\$100/);
    expect(callArgs.html).toMatch(/Status:.*Paid \(Processing\)/);
  });
});