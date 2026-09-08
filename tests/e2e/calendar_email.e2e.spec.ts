import "reflect-metadata";
import request from "supertest";
import express from "express";
import { container } from "tsyringe";
import { IcsGeneratorService } from "../../src/infrastructure/ics/generate_ics";
import type { MailService } from "../../src/infrastructure/mail/mail_service";
import { CalendarController } from "../../src/application/http/calendar_controller";
import { SendCalendarEmailUseCase } from "../../src/application/usecases/send_calendar_email_usecase";
import { createCalendarSchema } from "../../src/middleware/calendar_schema";
import { validateSchema } from "../../src/middleware/validate_middleware";

const app = express();
app.use(express.json());

container.register("IcsGenerator", { useClass: IcsGeneratorService });

class MailServiceMock implements MailService {
  async sendCalendarInvite(to: string, subject: string, icsContent: string, filename: string): Promise<void> {
    if (to === "falha@smtp.com") throw new Error("Erro no SMTP");
  }
}
container.register("MailService", { useClass: MailServiceMock });

const controller = container.resolve(CalendarController);
const sendEmailUseCase = container.resolve(SendCalendarEmailUseCase);

// Rota de ICS
app.post("/api/v1/calendar", validateSchema(createCalendarSchema), (req, res) => controller.handle(req, res));

// Rota de E-mail
app.post("/api/v1/calendar/email", validateSchema(createCalendarSchema), async (req, res) => {
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
    const recipient = organizer || "destinatario@exemplo.com";
    await sendEmailUseCase.execute(input, recipient);
    return res.status(200).json({ message: "E-mail enviado com sucesso!" });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao enviar e-mail", details: error.message });
  }
});

describe("Calendar API E2E", () => {
  it("deve retornar o arquivo .ics com sucesso na rota POST /api/v1/calendar", async () => {
    const response = await request(app)
      .post("/api/v1/calendar")
      .send({
        title: "Reunião E2E",
        start: "2026-09-10T10:00:00Z",
        end: "2026-09-10T11:00:00Z",
      });

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/calendar");
    expect(response.text).toContain("BEGIN:VCALENDAR");
    expect(response.text).toContain("SUMMARY:Reunião E2E");
  });

  it("deve retornar 400 Bad Request ao enviar dados inválidos (Zod Validation)", async () => {
    const response = await request(app)
      .post("/api/v1/calendar")
      .send({
        title: "",
        start: "2026-09-10T10:00:00Z",
        end: "2026-09-10T11:00:00Z",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("deve retornar 400 se a data de término for anterior à de início (Regra de Domínio)", async () => {
    const response = await request(app)
      .post("/api/v1/calendar")
      .send({
        title: "Reunião Inválida",
        start: "2026-09-10T12:00:00Z",
        end: "2026-09-10T10:00:00Z",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("deve enviar o e-mail com sucesso na rota POST /api/v1/calendar/email", async () => {
    const response = await request(app)
      .post("/api/v1/calendar/email")
      .send({
        title: "Convite por E-mail E2E",
        start: "2026-09-10T10:00:00Z",
        end: "2026-09-10T11:00:00Z",
        organizer: "organizador@teste.com",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("E-mail enviado com sucesso!");
  });
});