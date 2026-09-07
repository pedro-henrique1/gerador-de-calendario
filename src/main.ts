import express from "express";
import { CalendarController } from "./application/http/calendar_controller";
import { GenerateIcsUseCase } from "./application/usecases/generate_ics_usecase";
import { IcsGeneratorService } from "./infrastructure/ics/generate_ics";

const app = express();
app.use(express.json());

const generator = new IcsGeneratorService();
const useCase = new GenerateIcsUseCase(generator);
const controller = new CalendarController(useCase);

app.post("/api/v1/calendar", (req, res) => controller.handle(req, res));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor de calendário rodando na porta ${PORT}`);
});