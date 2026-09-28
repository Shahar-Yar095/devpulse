import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  pingService
} from '../controllers/servicesController.js';

const router = Router();

router.get('/', getAllServices);
router.post('/', createService);
router.get('/:id', getServiceById);
router.post('/:id/ping', pingService);

export default router;
