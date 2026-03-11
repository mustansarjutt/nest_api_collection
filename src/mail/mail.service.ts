import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtp(email: string, name: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Verify your email",
        template: "./otp",
        context: {
          name,
          otp
        }
      });
      return { success: true };
    } catch(error) {
      return { success: false };
    }
  }
}