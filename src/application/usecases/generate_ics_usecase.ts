import { CalendarEvent, CreateCalendarEvent } from "../../domain/entity/calendar_event";
import { IcsGenerator } from "../../infrastructure/ics/generate_ics";

export class GenerateIcsUseCase {
  constructor(private readonly icsGenerator: IcsGenerator) {}

  execute(input: CreateCalendarEvent): string {
    const event = CalendarEvent.create(input);
    return this.icsGenerator.generate(event);
  }
}