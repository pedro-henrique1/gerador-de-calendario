import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { CalendarEvent, CreateCalendarEvent } from "../../domain/entity/calendar_event";
import type { IcsGenerator } from "../../infrastructure/ics/generate_ics";
import type { MailService } from "../../infrastructure/mail/mail_service";

@injectable()
export class SendCalendarEmailUseCase {
  constructor(
    @inject("IcsGenerator") private readonly icsGenerator: IcsGenerator,
    @inject("MailService") private readonly mailService: MailService
  ) {}

  async execute(input: CreateCalendarEvent, recipientEmail: string): Promise<void> {
    const event = CalendarEvent.create(input);

    const icsContent = this.icsGenerator.generate(event);

    await this.mailService.sendCalendarInvite(
      recipientEmail,
      `Convite: ${event.title}`,
      icsContent,
      "evento.ics"
    );
  }
}