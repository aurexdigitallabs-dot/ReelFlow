import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body;
  
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Note: onboarding@resend.dev can only send to the email address registered with Resend
    // Add a verified domain in Resend to send to anyone.
    // For local testing, we are overriding 'to' so you don't get the 403 error.
    const data = await resend.emails.send({
      from: 'ReelFlow <onboarding@resend.dev>',
      to: 'aurexdigitallabs@gmail.com', // HARDCODED FOR TESTING
      subject,
      html,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Resend Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Email server running on http://localhost:${PORT}`);
});
