import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CampaignsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllCampaigns() {
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
}
