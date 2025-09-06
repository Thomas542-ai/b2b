import { Router } from 'express';
import {
  getEmailCampaigns,
  createEmailCampaign,
  updateEmailCampaign,
  getWhatsAppCampaigns,
  createWhatsAppCampaign,
  getSMTPConfigs,
  createSMTPConfig,
  sendEmailCampaign,
  sendWhatsAppCampaign
} from '../controllers/campaignController';

const router = Router();

// Email campaign routes
router.get('/email', getEmailCampaigns);
router.post('/email', createEmailCampaign);
router.put('/email/:id', updateEmailCampaign);
router.post('/email/:campaignId/send', sendEmailCampaign);

// WhatsApp campaign routes
router.get('/whatsapp', getWhatsAppCampaigns);
router.post('/whatsapp', createWhatsAppCampaign);
router.post('/whatsapp/:campaignId/send', sendWhatsAppCampaign);

// SMTP configuration routes
router.get('/smtp', getSMTPConfigs);
router.post('/smtp', createSMTPConfig);

export const campaignRoutes = router;
