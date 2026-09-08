import "reflect-metadata";
import express from "express";
import { container } from "tsyringe";
import { CalendarController } from "./application/http/calendar_controller";
import { IcsGeneratorService, IcsGenerator } from "./infrastructure/ics/generate_ics";
import { createCalendarSchema } from "./middleware/calendar_schema";
import { validateSchema } from "./middleware/validate_middleware";

container.register<IcsGenerator>("IcsGenerator", {
  useClass: IcsGeneratorService,
});

const app = express();
app.use(express.json());

const controller = container.resolve(CalendarController);

app.post(
  "/api/v1/calendar", 
  validateSchema(createCalendarSchema), 
  (req, res) => controller.handle(req, res)
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor com TSyringe rodando na porta ${PORT}`);
});