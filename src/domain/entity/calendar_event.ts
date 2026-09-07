import { randomUUID } from "node:crypto";
import { InvalidEventTitleError, InvalidEventDateError } from "../error/calendar_event_error";

export interface CreateCalendarEvent {
  id?: string; 
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
}

export class CalendarEvent {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly start: Date,
    public readonly end: Date,
    public readonly description?: string,
    public readonly location?: string,
  ) {}

  static create(data: CreateCalendarEvent): CalendarEvent {
    if (!data.title || !data.title.trim()) {
      throw new InvalidEventTitleError();
    }

    if (isNaN(data.start.getTime()) || isNaN(data.end.getTime())) {
      throw new InvalidEventDateError("As datas fornecidas são inválidas."); 
    }

    if (data.start.getTime() >= data.end.getTime()) {
      throw new InvalidEventDateError("A data de início deve ser anterior à data de término.");
    }

    const id = data.id ?? randomUUID();

    return new CalendarEvent(
      id,
      data.title,
      new Date(data.start.getTime()),
      new Date(data.end.getTime()),
      data.description,
      data.location,
    );
  }
}