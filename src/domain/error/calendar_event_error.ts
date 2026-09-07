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

export class InvalidTimezoneError extends Error {
  constructor(message: string = "O fuso horário fornecido é inválido.") {
    super(message);
    this.name = "InvalidTimezoneError";
  }
}

export class InvalidRecurrenceError extends Error {
  constructor(message: string = "A regra de recorrência fornecida é inválida.") {
    super(message);
    this.name = "InvalidRecurrenceError";
  }
}

export class InvalidAlarmMinutesBeforeError extends Error {
  constructor(message: string = "O valor de minutos antes do alarme é inválido.") {
    super(message);
    this.name = "InvalidAlarmMinutesBeforeError";
  }
}


export class InvalidEmailError extends Error {
  constructor(message: string = "O endereço de e-mail fornecido é inválido.") {
    super(message);
    this.name = "InvalidEmailError";
  }
}

