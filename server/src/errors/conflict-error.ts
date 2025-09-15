import CustomError from "./custom-error";

export default class ConflictError extends CustomError {
  statusCode = 409;

  constructor(message = "Конфликт") {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serializeError() {
    return { message: this.message };
  }
}
