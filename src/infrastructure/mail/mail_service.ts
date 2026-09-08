import { injectable } from "tsyringe";
import nodemailer from "nodemailer";
import "dotenv/config";

export interface MailService {
  sendCalendarInvite(to: string, subject: string, icsContent: string, filename: string): Promise<void>;
}

@injectable()
export class NodemailerMailService implements MailService {
  
  async sendCalendarInvite(to: string, subject: string, icsContent: string, filename: string): Promise<void> {

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false, 
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.SENHA_EMAIL,    
      },
    });

    await transporter.sendMail({
      from: '"Gerador de Calendário" <' + process.env.EMAIL + '>',
      to,
      subject,
      text: "Segue em anexo o convite do calendário atualizado.",
      attachments: [
        {
          filename,
          content: Buffer.from(icsContent, "utf-8"),
          contentType: "text/calendar; charset=utf-8; method=REQUEST",
        },
      ],
    });
  }
}