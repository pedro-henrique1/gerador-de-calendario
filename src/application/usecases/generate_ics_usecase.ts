import { inject, injectable } from "tsyringe";
import { CalendarEvent, CreateCalendarEvent } from "../../domain/entity/calendar_event";
import type { IcsGenerator } from "../../infrastructure/ics/generate_ics";

@injectable()
export class GenerateIcsUseCase {
constructor(
    @inject("IcsGenerator") private readonly icsGenerator: IcsGenerator
  ) {}
  execute(input: CreateCalendarEvent): string {
    const event = CalendarEvent.create(input);
    return this.icsGenerator.generate(event);
  }
}