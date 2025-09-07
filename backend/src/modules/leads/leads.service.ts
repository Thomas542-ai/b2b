import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class LeadsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllLeads() {
    // Check if we're in demo mode
    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL === 'https://demo.supabase.co') {
      // Return mock data for demo mode
      return [
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
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+1-555-0125',
          company: 'Global Corp',
          address: '789 Business Blvd, Chicago, IL 60601',
          website: 'https://globalcorp.com',
          status: 'qualified',
          source: 'Referral',
          tags: ['enterprise', 'qualified'],
          score: 95,
          notes: 'Very interested. Ready to move forward.',
          verified: true,
          lastContact: new Date(Date.now() - 3600000).toISOString(),
          nextFollowUp: new Date(Date.now() + 86400000).toISOString(),
          created_at: new Date().toISOString(),
        }
      ];
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch leads: ${error.message}`);
    }

    return data;
  }

  async getLeadById(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch lead: ${error.message}`);
    }

    return data;
  }

  async createLead(createLeadDto: any) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('leads')
      .insert({
        ...createLeadDto,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create lead: ${error.message}`);
    }

    return data;
  }

  async updateLead(id: string, updateLeadDto: any) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('leads')
      .update({
        ...updateLeadDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update lead: ${error.message}`);
    }

    return data;
  }

  async deleteLead(id: string) {
    const { error } = await this.supabaseService
      .getClient()
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete lead: ${error.message}`);
    }

    return { message: 'Lead deleted successfully' };
  }
}
