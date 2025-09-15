import CustomError from "./custom-error";

export default class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(message = "Не найдено") {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serializeError() {
    return { message: this.message };
  }
}
