import type { CalendarEvent } from "../../domain/entity/calendar_event";

export interface IcsGenerator {
  generate(event: CalendarEvent): string; 
}

export class IcsGeneratorService implements IcsGenerator {
  generate(event: CalendarEvent): string {
    const start = this.formatDate(event.start);
    const end = this.formatDate(event.end);

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//gerador-calendario//EN",
      "BEGIN:VEVENT",
      `UID:${this.escape(event.id)}`, 
      `DTSTAMP:${this.formatDate(new Date())}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${this.escape(event.title)}`,
      ...(event.description
        ? [`DESCRIPTION:${this.escape(event.description)}`]
        : []),
      ...(event.location
        ? [`LOCATION:${this.escape(event.location)}`]
        : []),
      "END:VEVENT",
      "END:VCALENDAR",
    ];

    return `${lines.join("\r\n")}\r\n`;
  }

  private formatDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }

  private escape(value: string): string {
    return value
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, "\\n");
  }
}