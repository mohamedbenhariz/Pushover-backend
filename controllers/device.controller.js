import { query } from '../config/database.js';
import { logger } from '../utils/logger.js';

export const getDevices = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      'SELECT * FROM devices WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const addDevice = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, type } = req.body;

    const result = await query(
      'INSERT INTO devices (user_id, name, type) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, type]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateDevice = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const deviceId = req.params.id;
    const { name } = req.body;

    const result = await query(
      'UPDATE devices SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [name, deviceId, userId]
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
    const userId = req.user.id;
    const deviceId = req.params.id;

    const result = await query(
      'DELETE FROM devices WHERE id = $1 AND user_id = $2 RETURNING *',
      [deviceId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    next(error);
  }
};