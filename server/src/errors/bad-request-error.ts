import CustomError from "./custom-error";

export default class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(message = "Некорректный запрос") {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serializeError() {
    return {
      message: this.message,
    };
  }
}
