import { z } from 'zod';

const deviceSchema = z.object({
  name: z.string().min(1, 'Device name is required'),
  token: z.string().min(1, 'Device token is required').optional(),
  platform: z.enum(['ios', 'android', 'desktop'], {
    errorMap: () => ({ message: 'Invalid platform' })
  }).optional().default('ios')
});

export const validateDevice = (req, res, next) => {
  try {
    const validatedData = deviceSchema.parse(req.body);
    
    // Add default values if not provided
    if (!req.body.token) {
      req.body.token = 'default_token_' + Date.now();
    }
    
    if (!req.body.platform) {
      req.body.platform = 'ios';
    }
    
    next();
  } catch (error) {
    next({
      type: 'validation',
      errors: error.errors
    });
  }
};
