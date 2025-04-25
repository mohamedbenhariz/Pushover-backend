import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const [rows, fields] = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: rows.length });
    return { rows, rowCount: rows.length, fields };
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
};

export const getClient = async () => {
  return await pool.getConnection();
};
