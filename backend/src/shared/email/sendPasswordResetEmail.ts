import { mountTemplate } from './mountTemplate';
import { sendEmail } from './sendEmail';

async function sendPasswordResetEmail(recipient: string, link: string) {
  const html = await mountTemplate({
    title: 'Password Recovery',
    description: 'Someone has requested a password reset for your account',
    expiration: 'This link will expire in 30 minutes',
    ignore: 'If you didn\'t request a passoword reset or did so by mistake, you can safely ignore this email and nothing will happen.',
    button: 'Reset Password',
    link,
  });

  await sendEmail(recipient, 'Password Recovery', html);
}

export { sendPasswordResetEmail };
