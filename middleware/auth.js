import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';
import { query } from '../config/database.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    // Look up the user by API key
    const result = await query(
      'SELECT id, username, email FROM users WHERE api_key = ?',
      [apiKey]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Set the user in the request object
    req.user = {
      id: result.rows[0].id,
      username: result.rows[0].username,
      email: result.rows[0].email
    };
    
    // Also set the apiKey for backward compatibility
    req.apiKey = apiKey;
    
    next();
  } catch (error) {
    logger.error('API key verification failed:', error);
    next(error);
  }
};
