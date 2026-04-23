import sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';

dotenv.config();

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API Key not set. Email not sent.');
    return;
  }

  const msg = {
    to,
    from: 'no-reply@srachko.bg', // Replace with your verified sender
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('SendGrid email error:', error);
    // Don't throw, just log. We don't want to fail the request if email fails.
  }
};
