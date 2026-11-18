import express from 'express';
import authenticate from '../middleware/authenticate.js';
import requirePermission from '../middleware/requirePermission.js';

const router = express.Router();

router.use(authenticate);

router.post('/', requirePermission('payments:create'), (req, res) => {
  const { orderId, amount } = req.body;

  if (!Number.isInteger(orderId) || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid payment data.' });
  }

  res.status(201).json({
    message: 'Payment accepted for demonstration.',
    orderId,
    amount,
    status: 'pending',
  });
});

export default router;