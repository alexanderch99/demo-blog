import CustomError from "./custom-error";

export default class AuthError extends CustomError {
  statusCode = 401;

  constructor(message = "Ошибка аутентификации") {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serializeError() {
    return {
      message: this.message,
    };
  }
}
