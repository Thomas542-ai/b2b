import { Router } from 'express';

const router = Router();

router.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile' });
});

router.put('/profile', (req, res) => {
  res.json({ message: 'Update user profile' });
});

router.get('/subscription', (req, res) => {
  res.json({ message: 'Get user subscription' });
});

export const userRoutes = router;
