import { z } from 'zod';

const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  priority: z.enum(['emergency', 'high', 'normal', 'low']).default('normal'),
  url: z.string().url().optional()
});

export const validateNotification = (req, res, next) => {
  try {
    notificationSchema.parse(req.body);
    next();
  } catch (error) {
    next({
      type: 'validation',
      errors: error.errors
    });
  }
};