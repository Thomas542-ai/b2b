import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// User registration and authentication routes
router.post('/register', register);
router.post('/login', login);

// Placeholder routes - will be implemented with controllers
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint' });
});

router.get('/google', (req, res) => {
  res.json({ message: 'Google OAuth endpoint' });
});

router.get('/google/callback', (req, res) => {
  res.json({ message: 'Google OAuth callback' });
});

export const authRoutes = router;
