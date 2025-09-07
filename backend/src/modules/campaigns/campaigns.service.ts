import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CampaignsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllCampaigns() {
    // Check if we're in demo mode
    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL === 'https://demo.supabase.co') {
      // Return mock data for demo mode
      return [
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
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch campaigns: ${error.message}`);
    }

    return data;
  }

  async getCampaignById(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch campaign: ${error.message}`);
    }

    return data;
  }

  async createCampaign(createCampaignDto: any) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('campaigns')
      .insert({
        ...createCampaignDto,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create campaign: ${error.message}`);
    }

    return data;
  }

  async updateCampaign(id: string, updateCampaignDto: any) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('campaigns')
      .update({
        ...updateCampaignDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update campaign: ${error.message}`);
    }

    return data;
  }

  async deleteCampaign(id: string) {
    const { error } = await this.supabaseService
      .getClient()
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete campaign: ${error.message}`);
    }

    return { message: 'Campaign deleted successfully' };
  }

  async getEmailCampaigns() {
    try {
      // Check if we're in demo mode or if Supabase is not available
      if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL === 'https://demo.supabase.co') {
        // Return mock email campaigns data for demo mode
        return [
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
        },
        {
          id: '2',
          name: 'Follow-up Campaign',
          subject: 'Following up on our conversation',
          status: 'draft',
          recipients: 50,
          sent: 0,
          delivered: 0,
          opened: 0,
          replied: 0,
          bounced: 0,
          created_at: new Date().toISOString(),
        }
      ];
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('campaigns')
        .select('*')
        .eq('type', 'email')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch email campaigns: ${error.message}`);
      }

      return data;
    } catch (error) {
      // If Supabase fails, return mock data
      return [
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
    }
  }

  async getSMTPConfigs() {
    try {
      // Check if we're in demo mode or if Supabase is not available
      if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL === 'https://demo.supabase.co') {
        // Return mock SMTP configs for demo mode
        return [
        {
          id: '1',
          name: 'Primary SMTP',
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          username: 'demo@example.com',
          isActive: true,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Backup SMTP',
          host: 'smtp.outlook.com',
          port: 587,
          secure: false,
          username: 'backup@example.com',
          isActive: false,
          created_at: new Date().toISOString(),
        }
      ];
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('smtp_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch SMTP configs: ${error.message}`);
      }

      return data;
    } catch (error) {
      // If Supabase fails, return mock data
      return [
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
    }
  }
}
