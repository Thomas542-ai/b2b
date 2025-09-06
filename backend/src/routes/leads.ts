import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getCallLogs,
  createCallLog,
  getTodaysFollowUps
} from '../controllers/leadController';

const router = Router();

// Lead management routes
router.get('/', getLeads);
router.get('/follow-ups', getTodaysFollowUps);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

// Call log routes
router.get('/:leadId/call-logs', getCallLogs);
router.post('/:leadId/call-logs', createCallLog);

export const leadRoutes = router;
