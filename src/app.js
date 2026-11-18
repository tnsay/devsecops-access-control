// import express from 'express';

// import authRoutes from './routes/auth.js';

// import authenticate from './middleware/authenticate.js';

// const app = express();

// // Parse incoming JSON requests
// app.use(express.json());
// //app.use(authenticate);

// // Health check
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'healthy',
//     application: 'DineDesk API',
//   });
// });

// // Authentication routes
// app.use('/api/auth', authRoutes);

// // Temporary endpoint to verify JWT authentication
// app.get('/api/protected', authenticate, (req, res) => {
//   res.status(200).json({
//     message: 'Authentication successful.',
//     user: req.user,
//   });
// });

// // Handle unknown routes
// app.use((req, res) => {
//   res.status(404).json({
//     message: 'Route not found.',
//   });
// });


// export default app;

import express from 'express';

import authRoutes from './routes/auth.js';
import authenticate from './middleware/authenticate.js';

import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import reportRoutes from './routes/reports.js';
import adminRoutes from './routes/admin.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    application: 'DineDesk API',
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Temporary authentication verification endpoint
app.get('/api/protected', authenticate, (req, res) => {
  res.status(200).json({
    message: 'Authentication successful.',
    user: req.user,
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

export default app;