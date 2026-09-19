import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2 Bucket Configuration (Read strictly from environment variables)
const R2_BUCKET = import.meta.env.VITE_R2_BUCKET || '';
const R2_ACCOUNT_ID = import.meta.env.VITE_R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY || '';
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || '';

// S3 Client configured for Cloudflare R2 if credentials are provided in env
const s3Client = (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY)
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY
      },
      forcePathStyle: true
    })
  : null;

export const r2Service = {
  /**
   * Uploads a file object to Cloudflare R2 object storage
   * Returns public/accessible image URL or data URL fallback
   */
  async uploadFile(file: File, folder: 'creators' | 'stores' | 'content' = 'content'): Promise<string> {
    if (!s3Client || !R2_BUCKET || !R2_ACCOUNT_ID) {
      throw new Error('R2 storage credentials (including VITE_R2_ACCOUNT_ID) are not properly configured.');
    }

    const extension = file.name.split('.').pop() || 'png';
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
    const arrayBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: fileName,
      Body: new Uint8Array(arrayBuffer),
      ContentType: file.type || 'image/jpeg'
    });

    await s3Client.send(command);
    
    // Return public R2 URL
    return `${R2_PUBLIC_URL}/${fileName}`;
  },
  
  /**
   * Deletes a file from Cloudflare R2 given its public URL
   */
  async deleteFile(publicUrl: string): Promise<void> {
    try {
      if (!s3Client || !R2_BUCKET || !R2_PUBLIC_URL) return;
      if (!publicUrl.startsWith(R2_PUBLIC_URL)) return;

      const key = publicUrl.substring(R2_PUBLIC_URL.length + 1); // Remove base URL and leading slash
      
      const command = new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key
      });

      await s3Client.send(command);
    } catch (err) {
      console.warn('Failed to delete orphaned file from R2:', err);
    }
  }
};
