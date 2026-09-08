import "reflect-metadata";
import type { IcsGenerator } from "../../src/infrastructure/ics/generate_ics";
import type { MailService } from "../../src/infrastructure/mail/mail_service";
import { SendCalendarEmailUseCase } from "../../src/application/usecases/send_calendar_email_usecase";

class IcsGeneratorMock implements IcsGenerator {
  generate(event: any): string {
    return "BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR";
  }
  generateBatch(events: any[]): string {
    return "BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR";
  }
}

class MailServiceMock implements MailService {
  public sentCalls: Array<{ to: string; subject: string; icsContent: string }> = [];

  async sendCalendarInvite(to: string, subject: string, icsContent: string, filename: string): Promise<void> {
    this.sentCalls.push({ to, subject, icsContent });
  }
}

describe("SendCalendarEmailUseCase", () => {
  it("deve gerar o ICS do evento e disparar o e-mail para o destinatário correto", async () => {
    const icsGeneratorMock = new IcsGeneratorMock();
    const mailServiceMock = new MailServiceMock();
    
    const useCase = new SendCalendarEmailUseCase(icsGeneratorMock, mailServiceMock);

    const input = {
      title: "Reunião de Teste Automatizado",
      start: new Date("2026-09-20T10:00:00Z"),
      end: new Date("2026-09-20T11:00:00Z"),
      organizer: "organizador@teste.com",
    };

    const recipient = "destinatario@teste.com";

    await useCase.execute(input, recipient);

    expect(mailServiceMock.sentCalls.length).toBe(1);
    expect(mailServiceMock.sentCalls[0].to).toBe(recipient);
    expect(mailServiceMock.sentCalls[0].subject).toContain("Reunião de Teste Automatizado");
    expect(mailServiceMock.sentCalls[0].icsContent).toContain("BEGIN:VCALENDAR");
  });
});