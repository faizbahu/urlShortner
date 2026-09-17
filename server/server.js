import dotenv from 'dotenv';
import app from './app.js';
import {connectDB} from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    if(!process.env.MONGO_URI) {
        console.error('MONGO_URI is not defined in environment variables');
        process.exit(1);
    }
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}
  startServer();