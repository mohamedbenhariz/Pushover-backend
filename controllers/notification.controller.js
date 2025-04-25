import { query, getClient } from '../config/database.js';
import { logger } from '../utils/logger.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const result = await query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1',
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
    const userId = req.user.id;
    const { title, message, priority = 'normal', url } = req.body;

    // Start a transaction
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Create notification
      const notificationResult = await client.query(
        'INSERT INTO notifications (user_id, title, message, priority, url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userId, title, message, priority, url]
      );

      // Get user's devices
      const devicesResult = await client.query(
        'SELECT * FROM devices WHERE user_id = $1',
        [userId]
      );

      // Create notification_devices entries
      for (const device of devicesResult.rows) {
        await client.query(
          'INSERT INTO notification_devices (notification_id, device_id, status) VALUES ($1, $2, $3)',
          [notificationResult.rows[0].id, device.id, 'pending']
        );
      }

      await client.query('COMMIT');

      // In a real app, we would trigger actual push notifications here
      // For now, we'll just return the notification
      res.status(201).json(notificationResult.rows[0]);
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
    const userId = req.user.id;
    const notificationId = req.params.id;

    const result = await query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *',
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};
