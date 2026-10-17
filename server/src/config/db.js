import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ruralcare';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};
