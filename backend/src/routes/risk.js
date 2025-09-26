import express from 'express';
import { getGroupedIssuesWithRisk } from '../controllers/riskController.js';

const router = express.Router();

// GET /api/risk/grouped - Get grouped issues with risk levels (admin)
router.get('/grouped', getGroupedIssuesWithRisk);

export default router;
