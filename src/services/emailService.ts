import { getWelcomeEmail, getTaskAssignedEmail, getStatusUpdatedEmail } from '../emails/templates';

// Using the local Express server we just set up.
// If deployed, this should point to the production backend URL.
const API_URL = 'http://localhost:3001/api/send-email';

class EmailService {
  private async sendEmail(to: string, subject: string, html: string) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, html }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to send email:', errorData);
      }
    } catch (error) {
      console.error('Error calling email API:', error);
    }
  }

  async sendWelcomeEmail(to: string, creatorName: string) {
    const html = getWelcomeEmail(creatorName, 'https://reelflow.aurexdigitals.in/login');
    await this.sendEmail(to, 'Welcome to ReelFlow!', html);
  }

  async sendTaskAssignedEmail(to: string, creatorName: string, taskTitle: string, dueDate: string) {
    const html = getTaskAssignedEmail(creatorName, taskTitle, dueDate, 'https://reelflow.aurexdigitals.in/dashboard');
    await this.sendEmail(to, 'New Task Assigned: ' + taskTitle, html);
  }

  async sendStatusUpdatedEmail(to: string, creatorName: string, taskTitle: string, newStatus: string) {
    const html = getStatusUpdatedEmail(creatorName, taskTitle, newStatus, 'https://reelflow.aurexdigitals.in/dashboard');
    await this.sendEmail(to, `Task Update: ${taskTitle} is now ${newStatus}`, html);
  }
}

export const emailService = new EmailService();
