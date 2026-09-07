import { CalendarEvent } from "../../src/domain/entity/calendar_event";
import {
  InvalidEventDateError,
  InvalidEventTitleError,
} from "../../src/domain/error/calendar_event_error";

describe("CalendarEvent", () => {
  it("deve criar um evento de calendário", () => {
    const event = CalendarEvent.create({
      title: "Reunião",
      start: new Date("2026-09-10T10:00:00"),
      end: new Date("2026-09-10T11:00:00"),
    });

    expect(event.title).toBe("Reunião");
    expect(event.start).toEqual(new Date("2026-09-10T10:00:00"));
    expect(event.end).toEqual(new Date("2026-09-10T11:00:00"));
  });

  it("deve dar erro ao criar um evento sem título", () => {
    expect(() => {
      CalendarEvent.create({
        title: "",
        start: new Date("2026-09-10T10:00:00"),
        end: new Date("2026-09-10T11:00:00"),
      });
    }).toThrow(InvalidEventTitleError);
  });

  it("deve dar erro ao criar um evento com data de início posterior à data de término", () => {
    expect(() => {
      CalendarEvent.create({
        title: "Reunião",
        start: new Date("2026-09-10T12:00:00"),
        end: new Date("2026-09-10T11:00:00"),
      });
    }).toThrow(InvalidEventDateError);
  });

  it("deve dar erro ao criar um evento com título contendo apenas espaços", () => {
    expect(() => {
      CalendarEvent.create({
        title: "   ",
        start: new Date("2026-09-10T10:00:00"),
        end: new Date("2026-09-10T11:00:00"),
      });
    }).toThrow(InvalidEventTitleError);
  });
  it("um evento deve ter pelo menos 1 minuto", () => {
    expect(() => {
      CalendarEvent.create({
        title: "Reunião",
        start: new Date("2026-09-10T10:00:00"),
        end: new Date("2026-09-10T10:00:00"),
      });
    }).toThrow(InvalidEventDateError);
  });

  it("deve gerar um id único para cada evento", () => {
    const event1 = CalendarEvent.create({
      title: "Reunião 1",
      start: new Date("2026-09-10T10:00:00"),
      end: new Date("2026-09-10T11:00:00"),
    });

    const event2 = CalendarEvent.create({
      title: "Reunião 2",
      start: new Date("2026-09-10T12:00:00"),
      end: new Date("2026-09-10T13:00:00"),
    });

    expect(event1.id).not.toBe(event2.id);
  });

  it("deve proteger as datas internas contra mutações externas (Cópia Defensiva)", () => {
    const dataInicioExterna = new Date("2026-09-10T10:00:00");
    const dataFimExterna = new Date("2026-09-10T11:00:00");

    const event = CalendarEvent.create({
      title: "Reunião Blindada",
      start: dataInicioExterna,
      end: dataFimExterna,
    });

    dataInicioExterna.setFullYear(2030);

    expect(event.start.getFullYear()).toBe(2026);
    expect(event.start.getTime()).not.toBe(dataInicioExterna.getTime());
  });

  it("deve dar erro se a data fornecida for um Invalid Date", () => {
    expect(() => {
      CalendarEvent.create({
        title: "Reunião",
        start: new Date("data-totalmente-invalida"), 
        end: new Date("2026-09-10T11:00:00"),
      });
    }).toThrow(InvalidEventDateError);
  });


  it("deve aceitar um ID pré-existente ao invés de gerar um novo", () => {
    const idExistente = "123e4567-e89b-12d3-a456-426614174000";
    
    const event = CalendarEvent.create({
      id: idExistente,
      title: "Reunião Antiga",
      start: new Date("2026-09-10T10:00:00"),
      end: new Date("2026-09-10T11:00:00"),
    });

    expect(event.id).toBe(idExistente);
  });

});
