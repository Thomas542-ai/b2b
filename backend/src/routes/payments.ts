import { Router } from 'express';
const router = Router();

router.post('/stripe/webhook', (req, res) => res.json({ message: 'Stripe webhook' }));
router.post('/paypal/webhook', (req, res) => res.json({ message: 'PayPal webhook' }));
router.post('/razorpay/webhook', (req, res) => res.json({ message: 'Razorpay webhook' }));

export const paymentRoutes = router;
