import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { generateApiKey } from '../utils/helpers.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate API key
    const apiKey = generateApiKey();

    // Create user
    await query(
      'INSERT INTO users (username, email, password, api_key) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, apiKey]
    );
    
    // Get the inserted user
    const result = await query(
      'SELECT id, username, email, api_key FROM users WHERE email = ?',
      [email]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        apiKey: user.api_key
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        apiKey: user.api_key
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const refreshApiKey = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const newApiKey = generateApiKey();

    await query(
      'UPDATE users SET api_key = ? WHERE id = ?',
      [newApiKey, userId]
    );

    res.json({ apiKey: newApiKey });
  } catch (error) {
    next(error);
  }
};
