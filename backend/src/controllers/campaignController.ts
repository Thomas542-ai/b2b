import { Request, Response } from 'express';
import { getSupabaseClient } from '../config/supabase';

// Mock data for development
const mockEmailCampaigns = [
  {
    id: '1',
    name: 'Pet Supplies Q1 Outreach',
    subject: 'Premium Pet Food Solutions for Your Store',
    status: 'completed',
    recipients: 150,
    sent: 150,
    delivered: 142,
    opened: 89,
    replied: 23,
    bounced: 8,
    createdAt: '2024-01-10',
    template: 'pet_supplies_template'
  },
  {
    id: '2',
    name: 'Restaurant Equipment Follow-up',
    subject: 'Commercial Kitchen Equipment Special Offer',
    status: 'sending',
    recipients: 200,
    sent: 45,
    delivered: 42,
    opened: 18,
    replied: 3,
    bounced: 3,
    createdAt: '2024-01-15',
    template: 'restaurant_template'
  }
];

const mockWhatsAppCampaigns = [
  {
    id: '1',
    name: 'Pet Store Follow-up',
    message: 'Hi {{name}}, thanks for your interest in our pet supplies. Would you like to schedule a call to discuss bulk pricing?',
    status: 'completed',
    recipients: 25,
    sent: 25,
    delivered: 23,
    read: 18,
    replied: 8,
    failed: 2,
    createdAt: '2024-01-15'
  }
];

const mockSMTPConfigs = [
  {
    id: '1',
    name: 'Gmail Business',
    provider: 'Gmail',
    status: 'active',
    dailyLimit: 500,
    sentToday: 45,
    lastUsed: '2024-01-16T10:30:00Z'
  },
  {
    id: '2',
    name: 'SendGrid Production',
    provider: 'SendGrid',
    status: 'active',
    dailyLimit: 1000,
    sentToday: 234,
    lastUsed: '2024-01-16T09:15:00Z'
  }
];

// Email Campaign Management
export const getEmailCampaigns = async (req: Request, res: Response) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.json({
        success: true,
        data: mockEmailCampaigns
      });
    }
    
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch email campaigns',
        error: error.message
      });
    }
    
    return res.json({ success: true, data: data || [] });
    
  } catch (error) {
    console.error('Get email campaigns error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createEmailCampaign = async (req: Request, res: Response) => {
  try {
    const campaignData = req.body;
    
    if (process.env.NODE_ENV === 'development') {
      const newCampaign = {
        id: `email-${Date.now()}`,
        ...campaignData,
        status: 'draft',
        sent: 0,
        delivered: 0,
        opened: 0,
        replied: 0,
        bounced: 0,
        createdAt: new Date().toISOString()
      };
      mockEmailCampaigns.unshift(newCampaign);
      return res.status(201).json({ success: true, data: newCampaign });
    }
    
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('email_campaigns')
      .insert([campaignData])
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create email campaign',
        error: error.message
      });
    }
    
    return res.status(201).json({ success: true, data });
    
  } catch (error) {
    console.error('Create email campaign error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateEmailCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (process.env.NODE_ENV === 'development') {
      const campaignIndex = mockEmailCampaigns.findIndex(c => c.id === id);
      if (campaignIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }
      mockEmailCampaigns[campaignIndex] = { ...mockEmailCampaigns[campaignIndex], ...updateData };
      return res.json({ success: true, data: mockEmailCampaigns[campaignIndex] });
    }
    
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('email_campaigns')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or update failed'
      });
    }
    
    return res.json({ success: true, data });
    
  } catch (error) {
    console.error('Update email campaign error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// WhatsApp Campaign Management
export const getWhatsAppCampaigns = async (req: Request, res: Response) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.json({
        success: true,
        data: mockWhatsAppCampaigns
      });
    }
    
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('whatsapp_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch WhatsApp campaigns',
        error: error.message
      });
    }
    
    return res.json({ success: true, data: data || [] });
    
  } catch (error) {
    console.error('Get WhatsApp campaigns error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createWhatsAppCampaign = async (req: Request, res: Response) => {
  try {
    const campaignData = req.body;
    
    if (process.env.NODE_ENV === 'development') {
      const newCampaign = {
        id: `whatsapp-${Date.now()}`,
        ...campaignData,
        status: 'draft',
        sent: 0,
        delivered: 0,
        read: 0,
        replied: 0,
        failed: 0,
        createdAt: new Date().toISOString()
      };
      mockWhatsAppCampaigns.unshift(newCampaign);
      return res.status(201).json({ success: true, data: newCampaign });
    }
    
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('whatsapp_campaigns')
      .insert([campaignData])
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create WhatsApp campaign',
        error: error.message
      });
    }
    
    return res.status(201).json({ success: true, data });
    
  } catch (error) {
    console.error('Create WhatsApp campaign error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// SMTP Configuration Management
export const getSMTPConfigs = async (req: Request, res: Response) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return res.json({
        success: true,
        data: mockSMTPConfigs
      });
    }
    
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('smtp_configs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch SMTP configs',
        error: error.message
      });
    }
    
    return res.json({ success: true, data: data || [] });
    
  } catch (error) {
    console.error('Get SMTP configs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createSMTPConfig = async (req: Request, res: Response) => {
  try {
    const configData = req.body;
    
    if (process.env.NODE_ENV === 'development') {
      const newConfig = {
        id: `smtp-${Date.now()}`,
        ...configData,
        status: 'active',
        sentToday: 0,
        lastUsed: new Date().toISOString()
      };
      mockSMTPConfigs.push(newConfig);
      return res.status(201).json({ success: true, data: newConfig });
    }
    
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('smtp_configs')
      .insert([configData])
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create SMTP config',
        error: error.message
      });
    }
    
    return res.status(201).json({ success: true, data });
    
  } catch (error) {
    console.error('Create SMTP config error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Send email campaign
export const sendEmailCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;
    
    // Mock sending process
    if (process.env.NODE_ENV === 'development') {
      const campaign = mockEmailCampaigns.find(c => c.id === campaignId);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }
      
      // Simulate sending
      campaign.status = 'sending';
      
      return res.json({
        success: true,
        message: 'Email campaign started successfully',
        data: campaign
      });
    }
    
    // Production: Implement actual email sending
    return res.status(501).json({
      success: false,
      message: 'Email sending not implemented yet'
    });
    
  } catch (error) {
    console.error('Send email campaign error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Send WhatsApp campaign
export const sendWhatsAppCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;
    
    // Mock sending process
    if (process.env.NODE_ENV === 'development') {
      const campaign = mockWhatsAppCampaigns.find(c => c.id === campaignId);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }
      
      // Simulate sending
      campaign.status = 'sending';
      
      return res.json({
        success: true,
        message: 'WhatsApp campaign started successfully',
        data: campaign
      });
    }
    
    // Production: Implement actual WhatsApp sending
    return res.status(501).json({
      success: false,
      message: 'WhatsApp sending not implemented yet'
    });
    
  } catch (error) {
    console.error('Send WhatsApp campaign error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
