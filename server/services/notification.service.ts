import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class NotificationService {
  static async create(userId: string, title: string, message: string, type: string = 'INFO') {
    try {
      await prisma.notification.create({
        data: { userId, title, message, type }
      });
      console.log(`[NOTIFICATION] Sent to ${userId}: ${title}`);
    } catch (e: any) {
      console.error('[NOTIFICATION] Failed to create:', e.message);
    }
  }

  static async sendEmail(to: string, subject: string, html: string) {
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.warn('[EMAIL] SMTP not configured. Skipping email to:', to);
      return;
    }

    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        host: SMTP_HOST,
        port: 587,
        secure: false,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
      });
      await transporter.sendMail({ from: `"Paypee" <${SMTP_USER}>`, to, subject, html });
      console.log(`[EMAIL] Sent: "${subject}" → ${to}`);
    } catch (e: any) {
      console.error('[EMAIL] Failed:', e.message);
    }
  }
}
