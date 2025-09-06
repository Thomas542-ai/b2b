import { Router } from 'express';
import {
  searchGoogleMaps,
  crawlDomains,
  searchLinkedIn,
  searchFacebook,
  importCSV,
  verifyEmails
} from '../controllers/leadSourceController';

const router = Router();

// Lead source routes
router.post('/google-maps', searchGoogleMaps);
router.post('/domain-crawler', crawlDomains);
router.post('/linkedin', searchLinkedIn);
router.post('/facebook', searchFacebook);
router.post('/csv-import', importCSV);
router.post('/verify-emails', verifyEmails);

export const leadSourceRoutes = router;
