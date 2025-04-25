import express from 'express';
import {
  getNotifications,
  createNotification,
  deleteNotification
} from '../controllers/notification.controller.js';
import { authenticateToken, authenticateApiKey } from '../middleware/auth.js';
import { validateNotification } from '../validators/notification.validator.js';

const router = express.Router();

// API endpoints (require API key)
router.post('/send', authenticateApiKey, validateNotification, createNotification);

// Web app endpoints (require JWT)
router.use(authenticateToken);
router.get('/', getNotifications);
router.delete('/:id', deleteNotification);

export default router;