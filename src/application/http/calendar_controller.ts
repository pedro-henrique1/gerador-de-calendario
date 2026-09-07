import { Request, Response } from "express";
import { GenerateIcsUseCase } from "../usecases/generate_ics_usecase";
import { 
  InvalidEventTitleError, 
  InvalidEventDateError, 
  InvalidTimezoneError, 
  InvalidRecurrenceError, 
  InvalidAlarmMinutesBeforeError, 
  InvalidEmailError 
} from "../../domain/error/calendar_event_error";

export class CalendarController {
  constructor(private readonly useCase: GenerateIcsUseCase) {}

  async handle(req: Request, res: Response): Promise<Response | void> {
    try {
      const { title, start, end, description, location, timezone, recurrence, alarmMinutesBefore, organizer, attendees } = req.body;

      const input = {
        title,
        start: new Date(start),
        end: new Date(end),
        description,
        location,
        timezone,
        recurrence,
        alarmMinutesBefore,
        organizer,
        attendees,
      };

      const icsString = this.useCase.execute(input);

      res.setHeader("Content-Type", "text/calendar; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="evento.ics"');

      return res.status(200).send(icsString);

    } catch (error) {
      if (
        error instanceof InvalidEventTitleError ||
        error instanceof InvalidEventDateError ||
        error instanceof InvalidTimezoneError ||
        error instanceof InvalidRecurrenceError ||
        error instanceof InvalidAlarmMinutesBeforeError ||
        error instanceof InvalidEmailError
      ) {
        return res.status(400).json({ error: error.message });
      }

      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}