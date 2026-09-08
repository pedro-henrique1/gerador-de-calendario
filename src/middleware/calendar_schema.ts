import { z } from "zod";

export const createCalendarSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  start: z.string().datetime("A data de início deve estar no formato ISO 8601 (ex: 2026-09-10T10:00:00Z)"),
  end: z.string().datetime("A data de término deve estar no formato ISO 8601"),
  description: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  recurrence: z.string().optional(),
  alarmMinutesBefore: z.number().int().nonnegative("O alarme deve ser um número positivo").optional(),
  organizer: z.string().email("Formato de e-mail inválido").optional(),
  attendees: z.array(z.string().email("Formato de e-mail inválido")).optional(),
});