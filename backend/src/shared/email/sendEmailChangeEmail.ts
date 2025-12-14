import { mountTemplate } from './mountTemplate';
import { sendEmail } from './sendEmail';

async function sendEmailChangeEmail(recipient: string, link: string) {
  const html = await mountTemplate({
    title: 'Email Change',
    description: 'Someone has requested an email change for your account',
    expiration: 'This link will expire in 24 hours',
    ignore: 'If you didn\'t request an email change or did so by mistake, you can safely ignore this email and nothing will happen.',
    button: 'Confirm email change',
    link,
  });

  await sendEmail(recipient, 'Email Change', html);
}

export { sendEmailChangeEmail };