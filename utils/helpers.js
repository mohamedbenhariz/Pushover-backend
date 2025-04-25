import crypto from 'crypto';

/**
 * Generates a secure random API key
 * @returns {string} A random API key
 */
export const generateApiKey = () => {
  // Generate 32 bytes of random data and convert to a hex string
  return crypto.randomBytes(32).toString('hex');
};
