import { query } from '../config/database.js';
import { logger } from '../utils/logger.js';

export const getDevices = async (req, res, next) => {
  try {
    // Check if user is available
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userId = req.user.id;

    const result = await query(
      'SELECT * FROM devices WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const addDevice = async (req, res, next) => {
  try {
    // Check if user is available
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userId = req.user.id;
    const { name, token, platform } = req.body;

    // Insert the device
    const insertResult = await query(
      'INSERT INTO devices (user_id, name, token, platform) VALUES (?, ?, ?, ?)',
      [userId, name, token, platform]
    );
    
    // Get the inserted device
    const deviceId = insertResult.rows.insertId;
    const result = await query(
      'SELECT * FROM devices WHERE id = ?',
      [deviceId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateDevice = async (req, res, next) => {
  try {
    // Check if user is available
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userId = req.user.id;
    const deviceId = req.params.id;
    const { name, token, platform } = req.body;

    // Update the device
    await query(
      'UPDATE devices SET name = ?, token = ?, platform = ? WHERE id = ? AND user_id = ?',
      [name, token, platform, deviceId, userId]
    );
    
    // Check if the device was updated
    const result = await query(
      'SELECT * FROM devices WHERE id = ? AND user_id = ?',
      [deviceId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteDevice = async (req, res, next) => {
  try {
    // Check if user is available
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userId = req.user.id;
    const deviceId = req.params.id;

    // Check if the device exists
    const checkResult = await query(
      'SELECT * FROM devices WHERE id = ? AND user_id = ?',
      [deviceId, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Delete the device
    await query(
      'DELETE FROM devices WHERE id = ? AND user_id = ?',
      [deviceId, userId]
    );

    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    next(error);
  }
};
