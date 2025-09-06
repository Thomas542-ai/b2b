import { Request, Response } from 'express';
import { getSupabaseClient } from '../config/supabase';

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Mock dashboard stats for development
    if (process.env.NODE_ENV === 'development') {
      const stats = {
        totalLeads: 1247,
        verifiedLeads: 892,
        emailsSent: 456,
        emailsOpened: 234,
        repliesReceived: 67,
        callsScheduled: 23,
        todayFollowUps: 8,
        conversionRate: 14.7,
        monthlyGrowth: 12.5,
        weeklyGrowth: 8.3
      };
      
      return res.json({
        success: true,
        data: stats
      });
    }
    
    // Production: Calculate real stats from database
    const supabase = await getSupabaseClient();
    
    // Get total leads
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
    
    // Get verified leads
    const { count: verifiedLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('verified', true);
    
    // Get email stats
    const { data: emailStats } = await supabase
      .from('email_campaigns')
      .select('sent, delivered, opened, replied, bounced');
    
    const emailsSent = emailStats?.reduce((sum: number, campaign: any) => sum + (campaign.sent || 0), 0) || 0;
    const emailsOpened = emailStats?.reduce((sum: number, campaign: any) => sum + (campaign.opened || 0), 0) || 0;
    const repliesReceived = emailStats?.reduce((sum: number, campaign: any) => sum + (campaign.replied || 0), 0) || 0;
    
    // Get today's follow-ups
    const today = new Date().toISOString().split('T')[0];
    const { count: todayFollowUps } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('next_follow_up', `${today}T00:00:00Z`)
      .lte('next_follow_up', `${today}T23:59:59Z`);
    
    const stats = {
      totalLeads: totalLeads || 0,
      verifiedLeads: verifiedLeads || 0,
      emailsSent,
      emailsOpened,
      repliesReceived,
      callsScheduled: 0, // Calculate from call logs
      todayFollowUps: todayFollowUps || 0,
      conversionRate: emailsSent > 0 ? ((repliesReceived / emailsSent) * 100) : 0,
      monthlyGrowth: 0, // Calculate from historical data
      weeklyGrowth: 0
    };
    
    return res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get recent activity
export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    // Mock recent activity for development
    if (process.env.NODE_ENV === 'development') {
      const activities = [
        {
          id: '1',
          type: 'lead_added',
          message: 'Added 45 new leads from Google Maps search',
          timestamp: '2 hours ago',
          status: 'success'
        },
        {
          id: '2',
          type: 'email_sent',
          message: 'Sent 23 emails via SMTP campaign',
          timestamp: '4 hours ago',
          status: 'success'
        },
        {
          id: '3',
          type: 'follow_up',
          message: '3 follow-up calls scheduled for today',
          timestamp: '6 hours ago',
          status: 'warning'
        },
        {
          id: '4',
          type: 'call_scheduled',
          message: 'Call with ABC Corp scheduled for 2 PM',
          timestamp: '1 day ago',
          status: 'success'
        }
      ];
      
      return res.json({
        success: true,
        data: activities
      });
    }
    
    // Production: Get real activity from database
    const supabase = await getSupabaseClient();
    
    // Get recent leads
    const { data: recentLeads } = await supabase
      .from('leads')
      .select('name, company, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    // Get recent campaigns
    const { data: recentCampaigns } = await supabase
      .from('email_campaigns')
      .select('name, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    // Get recent call logs
    const { data: recentCalls } = await supabase
      .from('call_logs')
      .select('type, notes, timestamp')
      .order('timestamp', { ascending: false })
      .limit(5);
    
    const activities = [
      ...(recentLeads || []).map((lead: any) => ({
        id: `lead-${lead.created_at}`,
        type: 'lead_added',
        message: `Added new lead: ${lead.name} from ${lead.company}`,
        timestamp: new Date(lead.created_at).toLocaleString(),
        status: 'success'
      })),
      ...(recentCampaigns || []).map((campaign: any) => ({
        id: `campaign-${campaign.created_at}`,
        type: 'email_sent',
        message: `Campaign "${campaign.name}" status: ${campaign.status}`,
        timestamp: new Date(campaign.created_at).toLocaleString(),
        status: 'success'
      })),
      ...(recentCalls || []).map((call: any) => ({
        id: `call-${call.timestamp}`,
        type: 'call_scheduled',
        message: `${call.type} call: ${call.notes}`,
        timestamp: new Date(call.timestamp).toLocaleString(),
        status: 'success'
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
    
    return res.json({
      success: true,
      data: activities
    });
    
  } catch (error) {
    console.error('Get recent activity error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get lead source analytics
export const getLeadSourceAnalytics = async (req: Request, res: Response) => {
  try {
    // Mock lead source analytics for development
    if (process.env.NODE_ENV === 'development') {
      const analytics = {
        sources: [
          { name: 'Google Maps', count: 450, percentage: 36.1 },
          { name: 'Domain Crawler', count: 320, percentage: 25.7 },
          { name: 'CSV Import', count: 280, percentage: 22.5 },
          { name: 'LinkedIn', count: 120, percentage: 9.6 },
          { name: 'Facebook', count: 77, percentage: 6.1 }
        ],
        monthlyTrend: [
          { month: 'Jan', leads: 120 },
          { month: 'Feb', leads: 150 },
          { month: 'Mar', leads: 180 },
          { month: 'Apr', leads: 200 },
          { month: 'May', leads: 250 },
          { month: 'Jun', leads: 300 }
        ]
      };
      
      return res.json({
        success: true,
        data: analytics
      });
    }
    
    // Production: Calculate real analytics
    const supabase = await getSupabaseClient();
    
    // Get leads by source
    const { data: sourceData } = await supabase
      .from('leads')
      .select('source')
      .not('source', 'is', null);
    
    const sourceCounts = (sourceData || []).reduce((acc: any, lead: any) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});
    
    const totalLeads = Object.values(sourceCounts).reduce((sum: number, count: any) => sum + count, 0);
    
    const sources = Object.entries(sourceCounts).map(([name, count]: [string, any]) => ({
      name,
      count,
      percentage: ((count / totalLeads) * 100).toFixed(1)
    }));
    
    return res.json({
      success: true,
      data: {
        sources,
        monthlyTrend: [] // Calculate from historical data
      }
    });
    
  } catch (error) {
    console.error('Get lead source analytics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get campaign performance analytics
export const getCampaignAnalytics = async (req: Request, res: Response) => {
  try {
    // Mock campaign analytics for development
    if (process.env.NODE_ENV === 'development') {
      const analytics = {
        emailCampaigns: {
          total: 12,
          active: 3,
          completed: 8,
          paused: 1,
          totalSent: 1250,
          totalOpened: 750,
          totalReplied: 125,
          averageOpenRate: 60.0,
          averageReplyRate: 10.0
        },
        whatsappCampaigns: {
          total: 5,
          active: 1,
          completed: 4,
          totalSent: 150,
          totalDelivered: 140,
          totalRead: 95,
          totalReplied: 25,
          averageDeliveryRate: 93.3,
          averageReadRate: 67.9,
          averageReplyRate: 17.9
        }
      };
      
      return res.json({
        success: true,
        data: analytics
      });
    }
    
    // Production: Calculate real campaign analytics
    const supabase = await getSupabaseClient();
    
    // Email campaign analytics
    const { data: emailCampaigns } = await supabase
      .from('email_campaigns')
      .select('status, sent, delivered, opened, replied');
    
    const emailStats = {
      total: emailCampaigns?.length || 0,
      active: emailCampaigns?.filter((c: any) => c.status === 'sending').length || 0,
      completed: emailCampaigns?.filter((c: any) => c.status === 'completed').length || 0,
      paused: emailCampaigns?.filter((c: any) => c.status === 'paused').length || 0,
      totalSent: emailCampaigns?.reduce((sum: number, c: any) => sum + (c.sent || 0), 0) || 0,
      totalOpened: emailCampaigns?.reduce((sum: number, c: any) => sum + (c.opened || 0), 0) || 0,
      totalReplied: emailCampaigns?.reduce((sum: number, c: any) => sum + (c.replied || 0), 0) || 0,
      averageOpenRate: 0,
      averageReplyRate: 0
    };
    
    if (emailStats.totalSent > 0) {
      emailStats.averageOpenRate = (emailStats.totalOpened / emailStats.totalSent) * 100;
      emailStats.averageReplyRate = (emailStats.totalReplied / emailStats.totalSent) * 100;
    }
    
    // WhatsApp campaign analytics
    const { data: whatsappCampaigns } = await supabase
      .from('whatsapp_campaigns')
      .select('status, sent, delivered, read, replied');
    
    const whatsappStats = {
      total: whatsappCampaigns?.length || 0,
      active: whatsappCampaigns?.filter((c: any) => c.status === 'sending').length || 0,
      completed: whatsappCampaigns?.filter((c: any) => c.status === 'completed').length || 0,
      totalSent: whatsappCampaigns?.reduce((sum: number, c: any) => sum + (c.sent || 0), 0) || 0,
      totalDelivered: whatsappCampaigns?.reduce((sum: number, c: any) => sum + (c.delivered || 0), 0) || 0,
      totalRead: whatsappCampaigns?.reduce((sum: number, c: any) => sum + (c.read || 0), 0) || 0,
      totalReplied: whatsappCampaigns?.reduce((sum: number, c: any) => sum + (c.replied || 0), 0) || 0,
      averageDeliveryRate: 0,
      averageReadRate: 0,
      averageReplyRate: 0
    };
    
    if (whatsappStats.totalSent > 0) {
      whatsappStats.averageDeliveryRate = (whatsappStats.totalDelivered / whatsappStats.totalSent) * 100;
      whatsappStats.averageReadRate = (whatsappStats.totalRead / whatsappStats.totalSent) * 100;
      whatsappStats.averageReplyRate = (whatsappStats.totalReplied / whatsappStats.totalSent) * 100;
    }
    
    return res.json({
      success: true,
      data: {
        emailCampaigns: emailStats,
        whatsappCampaigns: whatsappStats
      }
    });
    
  } catch (error) {
    console.error('Get campaign analytics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
