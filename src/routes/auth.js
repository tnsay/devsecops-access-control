import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import config from '../config/config.js';
import { users } from '../data/seed.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required login fields
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    // Find user by email
    const user = users.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase()
    );

    // Use the same response for unknown email and wrong password
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    // Issue a short-lived JWT using server-side user information
    const token = jwt.sign(
      {
        role: user.role,
        branchId: user.branchId,
      },
      config.jwt.secret,
      {
        subject: String(user.id),
        issuer: config.jwt.issuer,
        audience: config.jwt.audience,
        expiresIn: '15m',
        algorithm: 'HS256',
      }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);

    return res.status(500).json({
      message: 'An internal server error occurred.',
    });
  }
});

export default router;