import { getWelcomeEmail, getTaskAssignedEmail, getStatusUpdatedEmail, getBrandAdminWelcomeEmail } from '../emails/templates';

// In production on Netlify, use relative '/api/send-email' handled by Netlify serverless functions.
// In local dev, '/api/send-email' is proxied by Vite to http://localhost:3001, with fallback directly to 3001.
const getApiEndpoint = () => {
  if (typeof window === 'undefined') return 'http://localhost:3001/api/send-email';
  return '/api/send-email';
};

export interface SendEmailResult {
  success: boolean;
  error?: string;
  warning?: string;
}

class EmailService {
  private async sendEmail(to: string, subject: string, html: string): Promise<SendEmailResult> {
    const endpoint = getApiEndpoint();
    try {
      let response: Response;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ to, subject, html }),
        });
      } catch (fetchErr) {
        // Fallback for local development if Vite proxy is not active
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          response = await fetch('http://localhost:3001/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ to, subject, html }),
          });
        } else {
          throw fetchErr;
        }
      }
      
      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = resData.error || `Server returned error (${response.status})`;
        console.error('Failed to send email:', message);
        return { success: false, error: message };
      }

      if (resData.error) {
        return { success: false, error: resData.error };
      }

      return {
        success: true,
        warning: resData.warning
      };
    } catch (error: any) {
      console.error('Error calling email API:', error);
      return { success: false, error: error?.message || 'Network connection failed' };
    }
  }

  async sendWelcomeEmail(to: string, creatorName: string): Promise<SendEmailResult> {
    const html = getWelcomeEmail(creatorName, 'https://reelflow.aurexdigitals.in/login');
    return await this.sendEmail(to, 'Welcome to ReelFlow - Creator Onboarding', html);
  }

  async sendBrandAdminWelcomeEmail(to: string, adminName: string, storeNames: string[]): Promise<SendEmailResult> {
    const html = getBrandAdminWelcomeEmail(adminName, storeNames, 'https://reelflow.aurexdigitals.in/login');
    return await this.sendEmail(to, 'Welcome to ReelFlow - Brand Admin Access', html);
  }

  async sendTaskAssignedEmail(to: string, creatorName: string, taskTitle: string, dueDate: string): Promise<SendEmailResult> {
    const html = getTaskAssignedEmail(creatorName, taskTitle, dueDate, 'https://reelflow.aurexdigitals.in/dashboard');
    return await this.sendEmail(to, 'New Task Assigned: ' + taskTitle, html);
  }

  async sendStatusUpdatedEmail(to: string, creatorName: string, taskTitle: string, newStatus: string): Promise<SendEmailResult> {
    const html = getStatusUpdatedEmail(creatorName, taskTitle, newStatus, 'https://reelflow.aurexdigitals.in/dashboard');
    return await this.sendEmail(to, `Task Update: ${taskTitle} is now ${newStatus}`, html);
  }
}

export const emailService = new EmailService();

