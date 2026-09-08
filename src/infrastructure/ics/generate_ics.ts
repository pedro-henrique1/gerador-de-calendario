import { injectable } from "tsyringe";
import type { CalendarEvent } from "../../domain/entity/calendar_event";

export interface IcsGenerator {
  generate(event: CalendarEvent): string;
}

@injectable()
export class IcsGeneratorService implements IcsGenerator {
  generate(event: CalendarEvent): string {
    const hasTz = !!event.timezone;
    const start = this.formatDate(event.start, hasTz);
    const end = this.formatDate(event.end, hasTz);

    const startPrefix = hasTz ? `DTSTART;TZID=${event.timezone}` : "DTSTART";
    const endPrefix = hasTz ? `DTEND;TZID=${event.timezone}` : "DTEND";
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//gerador-calendario//EN",
      "BEGIN:VEVENT",
      `UID:${this.escape(event.id)}`,
      `DTSTAMP:${this.formatDate(new Date())}`,
      `${startPrefix}:${start}`,
      `${endPrefix}:${end}`,
      `SUMMARY:${this.escape(event.title)}`,
      ...(event.description
        ? [`DESCRIPTION:${this.escape(event.description)}`]
        : []),
      ...(event.location ? [`LOCATION:${this.escape(event.location)}`] : []),
      ...(event.recurrence ? [`RRULE:${event.recurrence}`] : []),
      ...(event.organizer ? [`ORGANIZER:mailto:${event.organizer}`] : []),
      ...(event.attendees
        ? event.attendees.map((email) => `ATTENDEE:mailto:${email}`)
        : []),
      ...(event.alarmMinutesBefore !== undefined
        ? [
            "BEGIN:VALARM",
            "ACTION:DISPLAY",
            "DESCRIPTION:Lembrete",
            `TRIGGER:-PT${event.alarmMinutesBefore}M`,
            "END:VALARM",
          ]
        : []),
      "END:VEVENT",
      "END:VCALENDAR",
    ];

    return `${lines.join("\r\n")}\r\n`;
  }

  private formatDate(date: Date, hasTimezone: boolean = false): string {
    const isoString = date.toISOString().replace(/[-:]/g, "");
    return hasTimezone
      ? isoString.replace(/\.\d{3}Z$/, "")
      : isoString.replace(/\.\d{3}Z$/, "Z");
  }

  private escape(value: string): string {
    return value
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, "\\n");
  }
}
