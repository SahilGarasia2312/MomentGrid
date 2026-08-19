'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const connectDB = require('./src/infrastructure/database/connection');
const authRoutes = require('./src/presentation/routes/auth.routes');
const studioRoutes = require('./src/presentation/routes/studio.routes');
const photographerRoutes = require('./src/presentation/routes/photographer.routes');
const clientRoutes = require('./src/presentation/routes/client.routes');
const bookingRoutes = require('./src/presentation/routes/booking.routes'); // feature: event booking system routes
const galleryManagementRoutes = require('./src/presentation/routes/galleryManagement.routes'); // feature: gallery management routes
const albumRoutes = require('./src/presentation/routes/album.routes'); // feature: album selection & studio review routes
const paymentRoutes = require('./src/presentation/routes/payment.routes'); // feature: payment module & invoice routes
const notificationRoutes = require('./src/presentation/routes/notification.routes'); // feature: notification module routes
const adminRoutes = require('./src/presentation/routes/admin.routes'); // feature: super admin dashboard routes
const errorHandler = require('./src/presentation/middleware/errorHandler');
const requestLogger = require('./src/presentation/middleware/requestLogger');

// ── Bootstrap ──────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 4000;

// ── Security Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true, // allow cookies (refresh token)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

// ── Body Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Request Logger (dev) ───────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ success: true, message: 'MomentGrid API is running.' })
);

// ── API Routes ─────────────────────────────────────────────────────────────
app.use('/v1/auth', authRoutes);
app.use('/v1/studio', studioRoutes);
app.use('/v1/photographers', photographerRoutes);
app.use('/v1/clients', clientRoutes);
app.use('/v1/bookings', bookingRoutes); // feature: event booking system REST API endpoint
app.use('/v1/gallery-manager', galleryManagementRoutes); // feature: gallery management API endpoint
app.use('/v1/albums', albumRoutes); // feature: album selection API endpoint
app.use('/v1/payments', paymentRoutes); // feature: payment module API endpoint
app.use('/v1/notifications', notificationRoutes); // feature: notification module API endpoint
app.use('/v1/admin', adminRoutes); // feature: super admin dashboard API endpoint

// ── 404 Handler ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'ROUTE_NOT_FOUND', message: 'The requested endpoint does not exist.' },
  });
});

// ── Central Error Handler ──────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────────────
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n🚀 MomentGrid API running on http://localhost:${PORT}`);
      console.log(`   Environment : ${process.env.NODE_ENV}`);
      console.log(`   Auth routes : http://localhost:${PORT}/v1/auth\n`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

// ── Unhandled Rejections ───────────────────────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});

start();
