import { Router } from 'express';
const router = Router();

router.get('/users', (req, res) => res.json({ message: 'Get all users' }));
router.get('/analytics', (req, res) => res.json({ message: 'Get analytics' }));
router.get('/plans', (req, res) => res.json({ message: 'Get plans' }));
router.get('/dashboard', (req, res) => {
  res.json({
    stats: {
      totalUsers: 1247,
      activeUsers: 892,
      totalRevenue: 154200,
      monthlyGrowth: 12.5,
      premiumUsers: 234,
      pendingApprovals: 8
    },
    users: [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@techcorp.com',
        company: 'TechCorp Solutions',
        role: 'USER',
        status: 'active',
        plan: 'Premium',
        createdAt: '2024-01-15',
        lastLogin: '2024-01-20'
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@globalinnovations.com',
        company: 'Global Innovations',
        role: 'ADMIN',
        status: 'active',
        plan: 'Enterprise',
        createdAt: '2024-01-10',
        lastLogin: '2024-01-18'
      },
      {
        id: '3',
        firstName: 'Mike',
        lastName: 'Wilson',
        email: 'mike@digitaldynamics.com',
        company: 'Digital Dynamics',
        role: 'USER',
        status: 'inactive',
        plan: 'Basic',
        createdAt: '2024-01-05',
        lastLogin: '2024-01-12'
      }
    ]
  })
})

export const adminRoutes = router;
