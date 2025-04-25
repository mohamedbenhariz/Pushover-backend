import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional()
});

export const validateAuth = (req, res, next) => {
  try {
    authSchema.parse(req.body);
    next();
  } catch (error) {
    next({
      type: 'validation',
      errors: error.errors
    });
  }
};