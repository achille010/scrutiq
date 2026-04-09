import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ishyarugemachille4@gmail.com",
        pass: process.env.EMAIL_PASS, // User must set this in .env
      },
    });
  }

  async sendVerificationCode(email: string, code: string) {
    const mailOptions = {
      from: '"HireIQ Recruitment" <ishyarugemachille4@gmail.com>',
      to: email,
      subject: "Activate Your HireIQ Account",
      html: `
        <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #E3EBF6; border-radius: 16px; color: #344050;">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap');
          </style>
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; padding: 12px; background: #2C7BE5; border-radius: 12px; color: white; font-weight: 800; font-size: 24px;">
              A
            </div>
          </div>
          <h1 style="font-size: 20px; font-weight: 800; text-align: center; margin-bottom: 8px; color: #344050;">Welcome to HireIQ</h1>
          <p style="text-align: center; color: #5E6E82; font-size: 14px; margin-bottom: 30px;">Use the code below to verify your technical recruiter account.</p>
          
          <div style="background: #F9FAFD; border: 1px solid #E3EBF6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 30px;">
            <span style="font-size: 42px; font-weight: 800; color: #2C7BE5; letter-spacing: 12px;">${code}</span>
          </div>
          
          <p style="font-size: 11px; text-align: center; color: #5E6E82; line-height: 1.6;">
            If you did not initiate this request, please ignore this email.<br/>
            &copy; 2026 HireIQ Technical Recruitment Platform.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL] Verification code dispatched to ${email}`);
    } catch (error) {
      console.error("[EMAIL ERROR] Dispatch failed:", error);
      console.log(`[DEBUG] FALLBACK VERIFICATION CODE FOR ${email}: ${code}`);
      throw new Error("Failed to send verification email. Please check your SMTP configuration.");
    }
  }
  async sendCustomEmail(email: string, subject: string, message: string) {
    const mailOptions = {
      from: '"HireIQ Recruitment" <ishyarugemachille4@gmail.com>',
      to: email,
      subject: subject,
      html: `
        <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #E3EBF6; border-radius: 16px; color: #344050;">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap');
          </style>
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; padding: 12px; background: #2C7BE5; border-radius: 12px; color: white; font-weight: 800; font-size: 24px;">
              A
            </div>
          </div>
          <h1 style="font-size: 20px; font-weight: 800; color: #344050; margin-bottom: 20px;">${subject}</h1>
          <div style="font-size: 14px; line-height: 1.8; color: #5E6E82; margin-bottom: 30px; white-space: pre-wrap;">
            ${message}
          </div>
          <div style="border-top: 1px solid #E3EBF6; padding-top: 20px; margin-top: 30px;">
            <p style="font-size: 11px; text-align: center; color: #5E6E82; line-height: 1.6;">
              This email was sent via HireIQ Technical Recruitment Platform.<br/>
              &copy; 2026 HireIQ • AI-Powered Talent Ingestion.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL] Custom message dispatched to ${email}`);
    } catch (error) {
      console.error("[EMAIL ERROR] Dispatch failed:", error);
      throw new Error("Failed to dispatch email. Check SMTP credentials.");
    }
  }
}

export default new EmailService();
