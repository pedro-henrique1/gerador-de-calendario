export class InvalidEventTitleError extends Error {
  constructor(message: string = "O título do evento é obrigatório.") {
    super(message);
    this.name = "InvalidEventTitleError"; 
  }
}

export class InvalidEventDateError extends Error {
  constructor(message: string = "A data de início não pode ser posterior à data de término.") {
    super(message);
    this.name = "InvalidEventDateError";
  }
}