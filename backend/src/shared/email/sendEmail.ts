import { Resend } from 'resend';
import 'dotenv/config';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(recipient: string, subject: string, html: string) {
  return resend.emails.send({
    from: 'Meta Management <support@guiafsantos.dev>',
    to: [recipient],
    subject,
    html,
  });
}

export { sendEmail };
