import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2 Bucket Configuration
const R2_BUCKET = import.meta.env.VITE_R2_BUCKET || 'reel-flow';
const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID || '9edd1a97c02c15f2e895250b8f3587cd';
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY || '8cd9c1134b16713ae69bf2c0de6a1545f8b7beb6040f62627ac9cd7377edfff4';
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || 'https://pub-r2.reelflow.app';

// S3 Client configured for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCESS_KEY_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY
  }
});

export const r2Service = {
  /**
   * Uploads a file object to Cloudflare R2 object storage
   * Returns public/accessible image URL or data URL fallback
   */
  async uploadFile(file: File, folder: 'creators' | 'stores' | 'content' = 'content'): Promise<string> {
    try {
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
    } catch (err) {
      console.warn('R2 direct upload fallback to local data URL due to browser CORS:', err);
      // Fallback helper for client-side image preview
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }
};
