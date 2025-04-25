import { query, getClient } from '../config/database.js';
import { logger } from '../utils/logger.js';

export const getNotifications = async (req, res, next) => {
  try {
    // Check if user is available
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const result = await query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, parseInt(limit), parseInt(offset)]
    );

    const countResult = await query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ?',
      [userId]
    );

    res.json({
      notifications: result.rows,
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    next(error);
  }
};

export const createNotification = async (req, res, next) => {
  try {
    // Check if user is available
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userId = req.user.id;
    const { title, message, priority = 'normal', url } = req.body;

    // Start a transaction
    const client = await getClient();
    try {
      await client.query('START TRANSACTION');

      // Create notification
      const notificationResult = await client.query(
        'INSERT INTO notifications (user_id, title, message, priority, url) VALUES (?, ?, ?, ?, ?)',
        [userId, title, message, priority, url]
      );
      
      const notificationId = notificationResult.insertId;
      
      // Get the created notification
      const createdNotification = await client.query(
        'SELECT * FROM notifications WHERE id = ?',
        [notificationId]
      );

      // Get user's devices
      const devicesResult = await client.query(
        'SELECT * FROM devices WHERE user_id = ?',
        [userId]
      );

      // Create notification_devices entries
      if (devicesResult.rows && Array.isArray(devicesResult.rows)) {
        for (const device of devicesResult.rows) {
          await client.query(
            'INSERT INTO notification_devices (notification_id, device_id, status) VALUES (?, ?, ?)',
            [notificationId, device.id, 'pending']
          );
        }
      }

      await client.query('COMMIT');

      // In a real app, we would trigger actual push notifications here
      // For now, we'll just return the notification
      res.status(201).json(createdNotification.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    // Check if user is available
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userId = req.user.id;
    const notificationId = req.params.id;

    // Check if notification exists
    const checkResult = await query(
      'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Delete the notification
    await query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};
