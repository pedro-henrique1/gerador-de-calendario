import "reflect-metadata"
import { CalendarEvent } from "../../src/domain/entity/calendar_event";
import { IcsGeneratorService } from "../../src/infrastructure/ics/generate_ics";

describe("IcsGeneratorService", () => {
  it("deve gerar um calendário ICS com os campos obrigatórios formatados corretamente", () => {
    const event = CalendarEvent.create({
      title: "Reunião",
      start: new Date("2026-09-10T10:00:00Z"),
      end: new Date("2026-09-10T11:00:00Z"),
    });

    const generator = new IcsGeneratorService();

    const result = generator.generate(event);

    expect(result).toContain("BEGIN:VCALENDAR");
    expect(result).toContain("VERSION:2.0");
    expect(result).toContain("BEGIN:VEVENT");
    expect(result).toContain(`UID:${event.id}`);
    expect(result).toContain("DTSTART:20260910T100000Z");
    expect(result).toContain("DTEND:20260910T110000Z");
    expect(result).toContain("SUMMARY:Reunião");
    
    expect(result).toContain("END:VEVENT");
    expect(result).toContain("END:VCALENDAR");
  });

  it("deve incluir descrição e localização apenas quando fornecidos", () => {
    const event = CalendarEvent.create({
      title: "Entrevista",
      start: new Date("2026-09-15T14:00:00Z"),
      end: new Date("2026-09-15T15:00:00Z"),
      description: "Entrevista técnica via Google Meet",
      location: "Link do Meet",
    });

    const generator = new IcsGeneratorService();
    const result = generator.generate(event);

    expect(result).toContain("DESCRIPTION:Entrevista técnica via Google Meet");
    expect(result).toContain("LOCATION:Link do Meet");
  });
  
  it("não deve incluir campos vazios de descrição e localização", () => {
    const event = CalendarEvent.create({
      title: "Foco Individual",
      start: new Date("2026-09-20T08:00:00Z"),
      end: new Date("2026-09-20T10:00:00Z"),
    });

    const generator = new IcsGeneratorService();
    const result = generator.generate(event);

    expect(result).not.toContain("DESCRIPTION:");
    expect(result).not.toContain("LOCATION:");
  });

  it("deve incluir regras de recorrência (RRULE)", () => {
    const event = CalendarEvent.create({
      title: "Reunião Diária",
      start: new Date("2026-09-10T10:00:00Z"),
      end: new Date("2026-09-10T11:00:00Z"),
      recurrence: "FREQ=DAILY;COUNT=3",
    });

    const generator = new IcsGeneratorService();
    const result = generator.generate(event);

    expect(result).toContain("RRULE:FREQ=DAILY;COUNT=3");
  });

  it("deve incluir bloco de alarme (VALARM)", () => {
    const event = CalendarEvent.create({
      title: "Reunião com Alarme",
      start: new Date("2026-09-10T10:00:00Z"),
      end: new Date("2026-09-10T11:00:00Z"),
      alarmMinutesBefore: 15,
    });

    const generator = new IcsGeneratorService();
    const result = generator.generate(event);

    expect(result).toContain("BEGIN:VALARM");
    expect(result).toContain("ACTION:DISPLAY");
    expect(result).toContain("DESCRIPTION:Lembrete");
    expect(result).toContain("TRIGGER:-PT15M");
    expect(result).toContain("END:VALARM");
  });

  it("deve incluir organizador e convidados", () => {
    const event = CalendarEvent.create({
      title: "Reunião de Equipe",
      start: new Date("2026-09-10T10:00:00Z"),
      end: new Date("2026-09-10T11:00:00Z"),
      organizer: "pedro@empresa.com",
      attendees: ["dev@empresa.com"],
    });

    const generator = new IcsGeneratorService();
    const result = generator.generate(event);

    expect(result).toContain("ORGANIZER:mailto:pedro@empresa.com");
    expect(result).toContain("ATTENDEE:mailto:dev@empresa.com");
  });
});