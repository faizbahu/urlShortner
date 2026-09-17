import dns from 'dns';
import mongoose from 'mongoose';

dns.setServers(['8.8.8.8', '1.1.1.1']);

export const connectDB = async (uri) => {
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};