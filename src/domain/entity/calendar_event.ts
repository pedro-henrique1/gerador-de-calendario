import { randomUUID } from "node:crypto";
import { InvalidEventTitleError, InvalidEventDateError, InvalidTimezoneError, InvalidRecurrenceError, InvalidAlarmMinutesBeforeError, InvalidEmailError } from "../error/calendar_event_error";

export interface CreateCalendarEvent {
  id?: string; 
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  timezone?: string;
  recurrence?: string;
  alarmMinutesBefore?: number;
  organizer?: string;
  attendees?: string[];
}

export class CalendarEvent {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly start: Date,
    public readonly end: Date,
    public readonly description?: string,
    public readonly location?: string,
    public readonly timezone?: string,
    public readonly recurrence?: string,
    public readonly alarmMinutesBefore?: number,
    public readonly organizer?: string,
    public readonly attendees?: string[],
  ) {}

  static create(data: CreateCalendarEvent): CalendarEvent {
    this.validateTitle(data.title);
    this.validateDates(data.start, data.end);
    this.validateTimezone(data.timezone);
    this.validateRecurrence(data.recurrence);
    this.validateAlarm(data.alarmMinutesBefore);
    this.validateEmails(data.organizer, data.attendees);

    return new CalendarEvent(
      data.id ?? randomUUID(),
      data.title,
      new Date(data.start.getTime()),
      new Date(data.end.getTime()),
      data.description,
      data.location,
      data.timezone,
      data.recurrence,
      data.alarmMinutesBefore,
      data.organizer,
      data.attendees,
    );
  }

  private static validateTitle(title: string): void {
    if (!title || !title.trim()) throw new InvalidEventTitleError();
  }

  private static validateDates(start: Date, end: Date): void {
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new InvalidEventDateError("As datas fornecidas são inválidas.");
    }
    if (start.getTime() >= end.getTime()) {
      throw new InvalidEventDateError("A data de início deve ser anterior à data de término.");
    }
  }

  private static validateTimezone(timezone?: string): void {
    if (timezone && !Intl.supportedValuesOf('timeZone').includes(timezone)) {
      throw new InvalidTimezoneError();
    }
  }

  private static validateRecurrence(recurrence?: string): void {
    if (recurrence && !/^FREQ=(SECONDLY|MINUTELY|HOURLY|DAILY|WEEKLY|MONTHLY|YEARLY)/i.test(recurrence)) {
      throw new InvalidRecurrenceError();
    }
  }

  private static validateAlarm(alarm?: number): void {
    if (alarm !== undefined && (!Number.isInteger(alarm) || alarm < 0)) {
      throw new InvalidAlarmMinutesBeforeError("O alarme deve ser um número inteiro positivo de minutos.");
    }
  }

  private static validateEmails(organizer?: string, attendees?: string[]): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (organizer && !emailRegex.test(organizer)) throw new InvalidEmailError("Organizador inválido.");
    if (attendees && attendees.some(email => !emailRegex.test(email))) {
      throw new InvalidEmailError("Convidado inválido.");
    }
  }
}