import "reflect-metadata";
import { Request, Response } from "express";
import { SendCalendarEmailUseCase } from "../usecases/send_calendar_email_usecase";
import { inject, injectable } from "tsyringe";

@injectable()
export class CalendarEmailController {
  constructor(@inject(SendCalendarEmailUseCase) private readonly sendEmailUseCase: SendCalendarEmailUseCase) {}

  async handle(req: Request, res: Response): Promise<Response | void> {
    try {
      const { title, start, end, description, location, timezone, recurrence, alarmMinutesBefore, organizer, attendees } = req.body;

      const input = {
        title,
        start: new Date(start),
        end: new Date(end),
        description,
        location,
        timezone,
        recurrence,
        alarmMinutesBefore,
        organizer,
        attendees,
      };

      const recipient = organizer || "destinatario@exemplo.com";
      await this.sendEmailUseCase.execute(input, recipient);

      return res.status(200).json({ message: "E-mail com o convite enviado com sucesso!" });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao enviar e-mail", details: error.message });
    }
  }
}