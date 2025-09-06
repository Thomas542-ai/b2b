import { Router } from 'express';
import {
  getDashboardStats,
  getRecentActivity,
  getLeadSourceAnalytics,
  getCampaignAnalytics
} from '../controllers/analyticsController';

const router = Router();

// Analytics routes
router.get('/dashboard', getDashboardStats);
router.get('/activity', getRecentActivity);
router.get('/lead-sources', getLeadSourceAnalytics);
router.get('/campaigns', getCampaignAnalytics);

export const analyticsRoutes = router;
