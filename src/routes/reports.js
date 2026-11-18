// import express from 'express';
// import authenticate from '../middleware/authenticate.js';
// import requirePermission from '../middleware/requirePermission.js';
// import { orders } from '../data/seed.js';

// const router = express.Router();

// router.use(authenticate);

// router.get('/branch', requirePermission('reports:read'), (req, res) => {
//   const branchOrders = orders.filter(
//     (order) => order.branchId === req.user.branchId
//   );

//   res.json({
//     branchId: req.user.branchId,
//     totalOrders: branchOrders.length,
//     orders: branchOrders,
//   });
// });

// export default router;
import express from 'express';
import authenticate from '../middleware/authenticate.js';
import requirePermission from '../middleware/requirePermission.js';
import { orders } from '../data/seed.js';

const router = express.Router();

router.use(authenticate);

router.get('/branch', requirePermission('reports:read'), (req, res) => {
  // Use the authenticated user's branch, never the query parameter
  const branchOrders =
    req.user.role === 'admin'
      ? orders
      : orders.filter((order) => order.branchId === req.user.branchId);

  res.json({
    branchId: req.user.branchId,
    totalOrders: branchOrders.length,
    orders: branchOrders,
  });
});

export default router;