import request from "supertest";
import express from "express";
import { GenerateIcsUseCase } from "../../src/application/usecases/generate_ics_usecase";
import { IcsGeneratorService } from "../../src/infrastructure/ics/generate_ics";
import { CalendarController } from "../../src/application/http/calendar_controller";

describe("E2E: Geração de Calendário via HTTP", () => {
  let app: express.Express;

  beforeAll(() => {
    const generator = new IcsGeneratorService();
    const useCase = new GenerateIcsUseCase(generator);
    const controller = new CalendarController(useCase);

    app = express();
    app.use(express.json());
    app.post("/api/v1/calendar", (req, res) => controller.handle(req, res));
  });

  it("deve processar o JSON e retornar o arquivo .ics para download com Status 200", async () => {
    const payload = {
      title: "Reunião de Arquitetura",
      start: "2026-09-15T14:00:00Z",
      end: "2026-09-15T15:00:00Z",
      timezone: "America/Sao_Paulo",
    };

    const response = await request(app).post("/api/v1/calendar").send(payload);

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/calendar");
    expect(response.headers["content-disposition"]).toContain('attachment; filename="evento.ics"');

    expect(response.text).toContain("BEGIN:VCALENDAR");
    expect(response.text).toContain("SUMMARY:Reunião de Arquitetura");
    expect(response.text).toContain("TZID=America/Sao_Paulo");
  });

  it("deve barrar requisições com domínio inválido e retornar Status 400", async () => {
    const invalidPayload = {
      title: "", 
      start: "2026-09-15T14:00:00Z",
      end: "2026-09-15T15:00:00Z",
    };

    const response = await request(app).post("/api/v1/calendar").send(invalidPayload);

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});

