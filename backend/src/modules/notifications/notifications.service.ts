import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>("SMTP_HOST");
    const port = this.configService.get<number>("SMTP_PORT");
    const user = this.configService.get<string>("SMTP_USER");
    const pass = this.configService.get<string>("SMTP_PASS");

    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });
      this.logger.log("Email transporter initialized");
    } else {
      this.logger.warn("SMTP configuration missing, emails will not be sent");
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!this.transporter) {
      this.logger.warn(`Skipping email to ${to}: Transporter not initialized`);
      return;
    }

    try {
      const from = this.configService.get<string>(
        "EMAIL_FROM",
        '"SkillTracker" <noreply@skilltracker.ai>',
      );
      await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
    }
  }

  async sendStreakReminder(to: string, name: string, streak: number) {
    const subject = `🔥 Keep your ${streak}-day streak alive!`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5;">Hi ${name}! 👋</h2>
        <p style="font-size: 16px; color: #374151;">
          You're doing amazing! You currently have a <strong>${streak}-day learning streak</strong>.
        </p>
        <p style="font-size: 16px; color: #374151;">
          Don't let it expire today. Just complete one chapter to keep the flame burning.
        </p>
        <div style="margin: 30px 0;">
          <a href="${this.configService.get("FRONTEND_URL")}" 
             style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Continue Learning
          </a>
        </div>
        <p style="font-size: 12px; color: #9ca3af;">
          Happy learning,<br>The SkillTracker Team
        </p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }
}
