import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  return res.status(200).json({
    status: 'healthy',
    application: 'RuralCare Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;
