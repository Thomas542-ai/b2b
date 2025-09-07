const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockLeads = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-0123',
    company: 'Acme Corp',
    address: '123 Main St, New York, NY 10001',
    website: 'https://acmecorp.com',
    status: 'new',
    source: 'Google Maps',
    tags: ['high-priority', 'enterprise'],
    score: 85,
    notes: 'Interested in our premium package. Follow up next week.',
    verified: true,
    lastContact: new Date(Date.now() - 86400000).toISOString(),
    nextFollowUp: new Date(Date.now() + 604800000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1-555-0124',
    company: 'Tech Solutions',
    address: '456 Tech Ave, San Francisco, CA 94105',
    website: 'https://techsolutions.com',
    status: 'contacted',
    source: 'LinkedIn',
    tags: ['startup', 'tech'],
    score: 72,
    notes: 'Initial contact made. Waiting for response.',
    verified: false,
    lastContact: new Date(Date.now() - 172800000).toISOString(),
    nextFollowUp: new Date(Date.now() + 259200000).toISOString(),
    created_at: new Date().toISOString(),
  }
];

const mockCampaigns = [
  {
    id: '1',
    name: 'Q1 Outreach Campaign',
    subject: 'Partnership Opportunity',
    status: 'sending',
    recipients: 150,
    sent: 75,
    delivered: 70,
    opened: 35,
    replied: 5,
    bounced: 5,
    created_at: new Date().toISOString(),
  }
];

const mockSMTPConfigs = [
  {
    id: '1',
    name: 'Primary SMTP',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    username: 'demo@example.com',
    isActive: true,
    created_at: new Date().toISOString(),
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/leads', (req, res) => {
  res.json(mockLeads);
});

app.get('/api/campaigns/email', (req, res) => {
  res.json(mockCampaigns);
});

app.get('/api/campaigns/smtp', (req, res) => {
  res.json(mockSMTPConfigs);
});

app.get('/api/analytics/dashboard', (req, res) => {
  res.json({
    totalLeads: 12,
    verifiedLeads: 8,
    emailsSent: 45,
    emailsOpened: 23,
    repliesReceived: 5,
    callsScheduled: 3,
    todayFollowUps: 2,
    conversionRate: 12.5,
  });
});

app.get('/api/analytics/activity', (req, res) => {
  res.json([
    {
      id: '1',
      type: 'lead_added',
      message: 'New lead added: John Doe from Acme Corp',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'email_sent',
      message: 'Email campaign sent to 25 recipients',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    }
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Leads: http://localhost:${PORT}/api/leads`);
  console.log(`📧 Campaigns: http://localhost:${PORT}/api/campaigns/email`);
});
