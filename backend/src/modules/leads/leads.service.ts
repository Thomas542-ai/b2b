import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class LeadsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllLeads() {
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
