// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { verifyToken, generateToken } from '../utils/jwt.js';
import { sendVerificationEmail } from '../utils/mail.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/mail.js';
import { log } from 'console';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await sendVerificationEmail(user);

    res.status(201).json({
      message: 'User registered successfully. Please check your inbox.',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('❌ SIGNUP ERROR:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const decoded = verifyToken(req.params.token);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export const getCurrentUser = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const user = await User.findById(req.user.id).select('name email role');

  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) return res.status(403).json({ message: 'Email not verified' });

    const token = generateToken({ id: user._id, role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000, //
    });

    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const message = `Click the link to reset your password: ${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
    <p>Click the link to reset your password: </p>
    <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}" classname="bg-red">RESET</a>
  `;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html,
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send password reset email' });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Token is invalid or expired' });

    user.password = await bcrypt.hash(password, 12); // Hash the new password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset password' });
  }
};