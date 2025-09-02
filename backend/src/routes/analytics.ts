import { Router } from 'express';
const router = Router();

router.get('/dashboard', (req, res) => res.json({ message: 'Get dashboard analytics' }));
router.get('/leads', (req, res) => res.json({ message: 'Get lead analytics' }));
router.get('/emails', (req, res) => res.json({ message: 'Get email analytics' }));

export const analyticsRoutes = router;
