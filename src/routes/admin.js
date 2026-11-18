import express from 'express';
import authenticate from '../middleware/authenticate.js';
import requireRole from '../middleware/requireRole.js';
import { users } from '../data/seed.js';

const router = express.Router();

router.use(authenticate);

router.get('/users', requireRole('admin'), (req, res) => {
  const safeUsers = users.map(({ passwordHash, ...user }) => user);

  res.json(safeUsers);
});

export default router;