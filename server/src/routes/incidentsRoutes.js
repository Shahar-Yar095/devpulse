import { Router } from 'express';
import {
  getAllIncidents,
  reportIncident,
  resolveIncident
} from '../controllers/incidentsController.js';

const router = Router();

router.get('/', getAllIncidents);
router.post('/', reportIncident);
router.patch('/:id/resolve', resolveIncident);

export default router;
