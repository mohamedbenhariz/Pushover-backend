import { z } from 'zod';

const deviceSchema = z.object({
  name: z.string().min(1, 'Device name is required'),
  type: z.enum(['ios', 'android', 'desktop'], {
    errorMap: () => ({ message: 'Invalid device type' })
  })
});

export const validateDevice = (req, res, next) => {
  try {
    deviceSchema.parse(req.body);
    next();
  } catch (error) {
    next({
      type: 'validation',
      errors: error.errors
    });
  }
};