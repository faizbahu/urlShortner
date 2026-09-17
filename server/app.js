import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import urlRoutes from './src/routes/urlRoutes.js';
import { redirectToOriginalUrl } from './src/controllers/urlController.js';
import userRoutes from './src/routes/userRoutes.js';
const app = express();

app.use(cors());
app.use(express.json());



app.use("/api/urls", urlRoutes);
app.use("/users", userRoutes);
app.get("/:shortCode", redirectToOriginalUrl);






app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
  });
});

// Koi route match na ho to yeh chalega — hamesha sab routes ke BAAD
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

export default app;