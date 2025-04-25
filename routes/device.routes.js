import express from 'express';
import {
  getDevices,
  addDevice,
  updateDevice,
  deleteDevice
} from '../controllers/device.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateDevice } from '../validators/device.validator.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getDevices);
router.post('/', validateDevice, addDevice);
router.put('/:id', validateDevice, updateDevice);
router.delete('/:id', deleteDevice);

export default router;