export default abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message = "Ошибка") {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  abstract serializeError(): { message: string };
}
