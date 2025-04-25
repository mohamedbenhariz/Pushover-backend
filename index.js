import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import deviceRoutes from './routes/device.routes.js';
import notificationRoutes from './routes/notification.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the IoT Device Management API',
    version: '1.0.0',
    pipeline: process.env.PIPELINE_NUMBER || '0'
  });
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});