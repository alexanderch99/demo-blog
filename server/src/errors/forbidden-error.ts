import CustomError from "./custom-error";

export default class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor(message = "Отказано в доступе") {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serializeError() {
    return {
      message: this.message,
    };
  }
}
