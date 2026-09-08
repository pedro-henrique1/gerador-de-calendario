import "reflect-metadata";
import type { IcsGenerator } from "../../src/infrastructure/ics/generate_ics";
import type { CalendarEvent } from "../../src/domain/entity/calendar_event";
import { GenerateIcsUseCase } from "../../src/application/usecases/generate_ics_usecase";

class IcsGeneratorMock implements IcsGenerator {
  public receivedEvent: CalendarEvent | null = null;
  public receivedEventsBatch: CalendarEvent[] | null = null;

  generate(event: CalendarEvent): string {
    this.receivedEvent = event;
    return "BEGIN:VCALENDAR\nSUMMARY:Mocked\nEND:VCALENDAR";
  }

  generateBatch(events: CalendarEvent[]): string {
    this.receivedEventsBatch = events;
    return "BEGIN:VCALENDAR\nSUMMARY:BatchMocked\nEND:VCALENDAR";
  }
}

describe("GenerateIcsUseCase", () => {
  it("deve receber a entrada, criar o CalendarEvent e chamar o gerador de ICS exatamente uma vez", () => {
    const icsGeneratorMock = new IcsGeneratorMock();
    const useCase = new GenerateIcsUseCase(icsGeneratorMock);

    const input = {
      title: "Reunião de Arquitetura",
      start: new Date("2026-09-10T10:00:00Z"),
      end: new Date("2026-09-10T11:00:00Z"),
    };

    const result = useCase.execute(input);

    expect(result).toContain("BEGIN:VCALENDAR");
    expect(icsGeneratorMock.receivedEvent).toBeDefined();
    expect(icsGeneratorMock.receivedEvent?.title).toBe("Reunião de Arquitetura");
  });

  it("deve propagar o erro de domínio caso a entrada seja inválida (não deve chamar o gerador)", () => {
    const icsGeneratorMock = new IcsGeneratorMock();
    const useCase = new GenerateIcsUseCase(icsGeneratorMock);

    const inputInvalid = {
      title: "", 
      start: new Date("2026-09-10T10:00:00Z"),
      end: new Date("2026-09-10T11:00:00Z"),
    };

    expect(() => useCase.execute(inputInvalid)).toThrow();
    expect(icsGeneratorMock.receivedEvent).toBeNull();
  });
});