import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { container } from "tsyringe";
import { CalendarController } from "./application/http/calendar_controller";
import { CalendarEmailController } from "./application/http/calendar_email_controller"; // <-- Novo import
import { IcsGeneratorService, IcsGenerator } from "./infrastructure/ics/generate_ics";
import { createCalendarSchema } from "./middleware/calendar_schema";
import { validateSchema } from "./middleware/validate_middleware";
import { NodemailerMailService, type MailService } from "./infrastructure/mail/mail_service";

container.register<IcsGenerator>("IcsGenerator", {
  useClass: IcsGeneratorService,
});

container.register<MailService>("MailService", {
  useClass: NodemailerMailService, 
});

const app = express();
app.use(express.json());

const calendarController = container.resolve(CalendarController);
const emailController = container.resolve(CalendarEmailController); 

app.post(
  "/api/v1/calendar", 
  validateSchema(createCalendarSchema), 
  (req, res) => calendarController.handle(req, res)
);

app.post(
  "/api/v1/calendar/email", 
  validateSchema(createCalendarSchema), 
  (req, res) => emailController.handle(req, res) 
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor com TSyringe rodando na porta ${PORT}`);
});