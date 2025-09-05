import { Router } from 'express';
import { prisma } from '../utils/database';

const router = Router();

// Get all leads
router.get('/', async (req, res): Promise<void> => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
});

// Create a new lead
router.post('/', async (req, res): Promise<void> => {
  try {
    const lead = await prisma.lead.create({
      data: req.body
    });
    res.status(201).json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ message: 'Failed to create lead' });
  }
});

// Get lead by ID
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id }
    });
    
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    
    res.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ message: 'Failed to fetch lead' });
  }
});

export const leadRoutes = router;
