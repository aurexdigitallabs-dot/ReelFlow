import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);
const fromAddress = process.env.RESEND_FROM || 'ReelFlow <noreply@aurexdigitals.in>';

app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body;
  
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields (to, subject, html)' });
  }

  try {
    let { data, error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
    });

    // If Resend throws a sandbox error (e.g., unverified domain), redirect only in non-production environments
    if (error && (error.statusCode === 403 || error.name === 'validation_error' || error.message?.includes('testing emails'))) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[Resend Sandbox] Cannot send to ${to} with unverified domain. Redirecting test email to aurexdigitallabs@gmail.com`);
        const testResult = await resend.emails.send({
          from: fromAddress,
          to: 'aurexdigitallabs@gmail.com',
          subject: `[Test for: ${to}] ${subject}`,
          html,
        });

        if (!testResult.error) {
          return res.status(200).json({
            ...testResult.data,
            deliveredTo: 'aurexdigitallabs@gmail.com',
            warning: `Delivered to aurexdigitallabs@gmail.com in Resend test mode. To send directly to ${to}, verify your domain aurexdigitals.in at resend.com/domains.`,
          });
        }
        error = testResult.error;
      }
    }


    if (error) {
      console.error('Resend API Error:', error);
      return res.status(error.statusCode || 400).json({ error: error.message || 'Resend error' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Resend Exception:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Email server running on http://localhost:${PORT}`);
});

