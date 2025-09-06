import { Request, Response } from 'express';
import { getSupabaseClient } from '../config/supabase';

// Mock data for development
const mockLeads = [
  {
    id: '1',
    name: 'John Smith',
    company: 'ABC Pet Supplies',
    email: 'john@abcpets.com',
    phone: '+1-555-0123',
    address: '123 Main St, New York, NY 10001',
    website: 'https://abcpets.com',
    status: 'qualified',
    source: 'Google Maps',
    tags: ['pet supplies', 'retail'],
    score: 85,
    lastContact: '2024-01-15',
    nextFollowUp: '2024-01-17',
    notes: 'Interested in bulk pricing for pet food',
    verified: true,
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Pet World Store',
    email: 'sarah@petworld.com',
    phone: '+1-555-0124',
    address: '456 Oak Ave, New York, NY 10002',
    website: 'https://petworld.com',
    status: 'contacted',
    source: 'Domain Crawler',
    tags: ['pet store', 'local business'],
    score: 72,
    lastContact: '2024-01-14',
    nextFollowUp: '2024-01-16',
    notes: 'Sent pricing information, waiting for response',
    verified: false,
    createdAt: '2024-01-12'
  }
];

const mockCallLogs = [
  {
    id: '1',
    leadId: '1',
    type: 'call',
    outcome: 'answered',
    notes: 'Discussed bulk pricing options. Very interested in premium pet food line.',
    duration: 15,
    timestamp: '2024-01-15T14:30:00Z',
    nextFollowUp: '2024-01-17T10:00:00Z'
  }
];

// Get all leads with filtering
export const getLeads = async (req: Request, res: Response) => {
  try {
    const { search, status, source, page = 1, limit = 50 } = req.query;
    
    // In development mode, return mock data
    if (process.env.NODE_ENV === 'development') {
      let filteredLeads = [...mockLeads];
      
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredLeads = filteredLeads.filter(lead =>
          lead.name.toLowerCase().includes(searchTerm) ||
          lead.company.toLowerCase().includes(searchTerm) ||
          lead.email?.toLowerCase().includes(searchTerm)
        );
      }
      
      if (status && status !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.status === status);
      }
      
      if (source && source !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.source === source);
      }
      
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedLeads = filteredLeads.slice(startIndex, endIndex);
      
      return res.json({
        success: true,
        data: paginatedLeads,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: filteredLeads.length,
          pages: Math.ceil(filteredLeads.length / Number(limit))
        }
      });
    }
    
    // Production mode - use Supabase
    const supabase = await getSupabaseClient();
    
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (source && source !== 'all') {
      query = query.eq('source', source);
    }
    
    const { data, error, count } = await query
      .range(
        (Number(page) - 1) * Number(limit),
        Number(page) * Number(limit) - 1
      );
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch leads',
        error: error.message
      });
    }
    
    return res.json({
      success: true,
      data: data || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / Number(limit))
      }
    });
    
  } catch (error) {
    console.error('Get leads error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single lead
export const getLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (process.env.NODE_ENV === 'development') {
      const lead = mockLeads.find(l => l.id === id);
      if (!lead) {
        return res.status(404).json({
          success: false,
          message: 'Lead not found'
        });
      }
      return res.json({ success: true, data: lead });
    }
    
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    return res.json({ success: true, data });
    
  } catch (error) {
    console.error('Get lead error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new lead
export const createLead = async (req: Request, res: Response) => {
  try {
    const leadData = req.body;
    
    if (process.env.NODE_ENV === 'development') {
      const newLead = {
        id: `mock-${Date.now()}`,
        ...leadData,
        createdAt: new Date().toISOString(),
        verified: false,
        score: Math.floor(Math.random() * 40) + 60 // Random score 60-100
      };
      mockLeads.unshift(newLead);
      return res.status(201).json({ success: true, data: newLead });
    }
    
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create lead',
        error: error.message
      });
    }
    
    return res.status(201).json({ success: true, data });
    
  } catch (error) {
    console.error('Create lead error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update lead
export const updateLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (process.env.NODE_ENV === 'development') {
      const leadIndex = mockLeads.findIndex(l => l.id === id);
      if (leadIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Lead not found'
        });
      }
      mockLeads[leadIndex] = { ...mockLeads[leadIndex], ...updateData };
      return res.json({ success: true, data: mockLeads[leadIndex] });
    }
    
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or update failed'
      });
    }
    
    return res.json({ success: true, data });
    
  } catch (error) {
    console.error('Update lead error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete lead
export const deleteLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (process.env.NODE_ENV === 'development') {
      const leadIndex = mockLeads.findIndex(l => l.id === id);
      if (leadIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Lead not found'
        });
      }
      mockLeads.splice(leadIndex, 1);
      return res.json({ success: true, message: 'Lead deleted successfully' });
    }
    
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete lead',
        error: error.message
      });
    }
    
    return res.json({ success: true, message: 'Lead deleted successfully' });
    
  } catch (error) {
    console.error('Delete lead error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get call logs for a lead
export const getCallLogs = async (req: Request, res: Response) => {
  try {
    const { leadId } = req.params;
    
    if (process.env.NODE_ENV === 'development') {
      const logs = mockCallLogs.filter(log => log.leadId === leadId);
      return res.json({ success: true, data: logs });
    }
    
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('call_logs')
      .select('*')
      .eq('lead_id', leadId)
      .order('timestamp', { ascending: false });
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch call logs',
        error: error.message
      });
    }
    
    return res.json({ success: true, data: data || [] });
    
  } catch (error) {
    console.error('Get call logs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create call log
export const createCallLog = async (req: Request, res: Response) => {
  try {
    const callLogData = req.body;
    
    if (process.env.NODE_ENV === 'development') {
      const newLog = {
        id: `log-${Date.now()}`,
        ...callLogData,
        timestamp: new Date().toISOString()
      };
      mockCallLogs.unshift(newLog);
      return res.status(201).json({ success: true, data: newLog });
    }
    
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('call_logs')
      .insert([callLogData])
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create call log',
        error: error.message
      });
    }
    
    return res.status(201).json({ success: true, data });
    
  } catch (error) {
    console.error('Create call log error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get today's follow-ups
export const getTodaysFollowUps = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    if (process.env.NODE_ENV === 'development') {
      const followUps = mockLeads.filter(lead => 
        lead.nextFollowUp && (lead.nextFollowUp as string).startsWith(today as string)
      );
      return res.json({ success: true, data: followUps });
    }
    
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .gte('next_follow_up', `${today}T00:00:00Z`)
      .lte('next_follow_up', `${today}T23:59:59Z`);
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch follow-ups',
        error: error.message
      });
    }
    
    return res.json({ success: true, data: data || [] });
    
  } catch (error) {
    console.error('Get follow-ups error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
