// import express from 'express';
// import authenticate from '../middleware/authenticate.js';
// import requirePermission from '../middleware/requirePermission.js';
// import { orders } from '../data/seed.js';

// const router = express.Router();

// router.use(authenticate);

// // GET /api/orders
// router.get('/', requirePermission('orders:read'), (req, res) => {
//   res.json(orders);
// });

// // GET /api/orders/:id
// router.get('/:id', requirePermission('orders:read'), (req, res) => {
//   const order = orders.find((item) => item.id === Number(req.params.id));

//   if (!order) {
//     return res.status(404).json({ message: 'Order not found.' });
//   }

//   res.json(order);
// });

// // POST /api/orders
// router.post('/', requirePermission('orders:create'), (req, res) => {
//   const { tableNumber, items, total } = req.body;

//   if (
//     !Number.isInteger(tableNumber) ||
//     !Array.isArray(items) ||
//     items.length === 0 ||
//     typeof total !== 'number' ||
//     total <= 0
//   ) {
//     return res.status(400).json({ message: 'Invalid order data.' });
//   }

//   const newOrder = {
//     id: Math.max(...orders.map((order) => order.id)) + 1,
//     branchId: req.user.branchId,
//     tableNumber,
//     items,
//     total,
//     status: 'pending',
//   };

//   orders.push(newOrder);

//   res.status(201).json(newOrder);
// });

// export default router;

import express from 'express';
import authenticate from '../middleware/authenticate.js';
import requirePermission from '../middleware/requirePermission.js';
import { orders, BRANCHES } from '../data/seed.js';
import { canAccessOrder } from '../policies/orderPolicy.js';

const router = express.Router();

router.use(authenticate);

// GET /api/orders
router.get('/', requirePermission('orders:read'), (req, res) => {
  // Admins can see all branches; other staff see only their own branch
  const visibleOrders = orders.filter((order) =>
    canAccessOrder(req.user, order)
  );

  res.json(visibleOrders);
});

// GET /api/orders/:id
router.get('/:id', requirePermission('orders:read'), (req, res) => {
  const order = orders.find((item) => item.id === Number(req.params.id));

  if (!order || !canAccessOrder(req.user, order)) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  res.json(order);
});

// POST /api/orders
router.post('/', requirePermission('orders:create'), (req, res) => {
  const { tableNumber, items, total } = req.body;

  if (
    !Number.isInteger(tableNumber) ||
    !Array.isArray(items) ||
    items.length === 0 ||
    typeof total !== 'number' ||
    total <= 0
  ) {
    return res.status(400).json({ message: 'Invalid order data.' });
  }

  // Non-admin users always use their assigned branch.
  // Admins must explicitly select a valid branch because they have no branch assignment.
  const branchId =
    req.user.role === 'admin' ? req.body.branchId : req.user.branchId;

  if (![BRANCHES.BOLE, BRANCHES.PIASSA].includes(branchId)) {
    return res.status(400).json({ message: 'A valid branch is required.' });
  }

  const newOrder = {
    id: Math.max(...orders.map((order) => order.id)) + 1,
    branchId,
    tableNumber,
    items,
    total,
    status: 'pending',
  };

  orders.push(newOrder);

  res.status(201).json(newOrder);
});

export default router;