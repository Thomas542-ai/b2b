// File upload utilities for serverless environments
// Uses Supabase Storage for file persistence

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://qphomvhegulifftzirmb.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaG9tdmhlZ3VsaWZmdHppcm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjgxNzksImV4cCI6MjA3MjUwNDE3OX0.W74O4Z-Q-7SXH6x7bq2wghRlae28tZ2qb4VQzz398e4';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  publicUrl?: string;
}

export class FileUploadService {
  private bucketName = 'leadsfynder-uploads';

  async uploadFile(
    file: Buffer | Uint8Array,
    fileName: string,
    contentType: string,
    folder: string = 'general'
  ): Promise<UploadResult> {
    try {
      // Ensure bucket exists
      await this.ensureBucketExists();

      // Generate unique filename
      const timestamp = Date.now();
      const uniqueFileName = `${folder}/${timestamp}-${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(uniqueFileName, file, {
          contentType,
          upsert: false
        });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(uniqueFileName);

      return {
        success: true,
        url: data.path,
        publicUrl: publicData.publicUrl
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      return !error;
    } catch (error) {
      return false;
    }
  }

  async getFileUrl(filePath: string): Promise<string | null> {
    try {
      const { data } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      return null;
    }
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === this.bucketName);

      if (!bucketExists) {
        await supabase.storage.createBucket(this.bucketName, {
          public: true,
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ],
          fileSizeLimit: 10485760 // 10MB
        });
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
    }
  }

  // Validate file type
  validateFileType(mimeType: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    return allowedTypes.includes(mimeType);
  }

  // Validate file size
  validateFileSize(size: number, maxSize: number = 10485760): boolean {
    return size <= maxSize;
  }
}

export const fileUploadService = new FileUploadService();
