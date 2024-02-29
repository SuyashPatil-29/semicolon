import transporter from '@/lib/nodemailer';
import nodemailer from 'nodemailer';

export default async function sendEmail({ subject, text, to }:{subject: string, text: string, to: string}) {
  const mailOptions = {
    from: process.env.GMAIL_APP_USERNAME,
    to,
    subject,
    text,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err: any, info:nodemailer.SentMessageInfo) => {
      if (err) {
        console.error(err);
        return reject('Unable to send email');
      }
      const message = `Message delivered to ${info.accepted}`;
      console.error(message);
      return resolve(message);
    });
  });
}

