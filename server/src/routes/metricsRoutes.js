import { Router } from 'express';
import { getSystemSummary, getMetricHistory } from '../controllers/metricsController.js';

const router = Router();

router.get('/summary', getSystemSummary);
router.get('/history', getMetricHistory);

export default router;
