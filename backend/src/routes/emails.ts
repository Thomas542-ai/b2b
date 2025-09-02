import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => res.json({ message: 'Get email campaigns' }));
router.post('/', (req, res) => res.json({ message: 'Create email campaign' }));
router.get('/:id', (req, res) => res.json({ message: 'Get campaign by ID' }));

export const emailRoutes = router;
