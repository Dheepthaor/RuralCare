import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`  🏥 RuralCare API Server Running on port ${PORT}`);
      console.log(`  🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  🩺 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`======================================================\n`);
    });

    const shutdown = () => {
      console.log('\n[Server] Shutting down gracefully...');
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('[Server Error] Startup failed:', error);
    process.exit(1);
  }
};

startServer();
